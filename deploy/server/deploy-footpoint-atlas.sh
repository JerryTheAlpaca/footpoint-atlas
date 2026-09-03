#!/usr/bin/env bash
# 火车足迹（footpoint-atlas）GitHub 自动部署脚本，带失败回滚。
#
# 安装位置：/usr/local/sbin/deploy-footpoint-atlas
# 调用方：systemd 单元 footpoint-atlas-deploy.service（timer 每分钟触发）
# 状态文件：
#   /var/lib/footpoint-atlas/deployed-commit  当前已健康部署的提交
#   /var/lib/footpoint-atlas/failed-commit    最近一次部署失败并已回滚的提交
# 行为：
#   - origin/main 出现新提交时快进到该提交，重建并重启容器；
#   - 新版本健康检查失败时，回退到上一个已部署提交并重建容器
#     （Docker 层缓存命中，回滚构建很快），恢复旧版本服务；
#   - 回滚成功后记录 failed-commit，同一提交不再自动重试（避免站点
#     在新旧版本间反复震荡），等待新提交；如需强制重试同一提交，
#     删除 /var/lib/footpoint-atlas/failed-commit 即可；
#   - 构建失败不影响正在运行的容器，只把工作树退回已部署版本，
#     且不记录 failed-commit（构建失败常由网络抖动引起，下次照常重试）；
#   - docker compose up 加 180 秒超时，防止依赖健康检查挂起导致
#     部署永久卡死并一直持有锁。
set -Eeuo pipefail

exec 9>/run/lock/footpoint-atlas-deploy.lock
flock -n 9 || exit 0

repo=/opt/footpoint-atlas
state_dir=/var/lib/footpoint-atlas
marker="$state_dir/deployed-commit"
failed="$state_dir/failed-commit"
mkdir -p "$state_dir"

health_url=http://127.0.0.1:8080/healthz
health_attempts=30
health_interval=2

sudo -u ubuntu git -C "$repo" fetch --quiet origin main
target=$(sudo -u ubuntu git -C "$repo" rev-parse origin/main)
deployed=$(cat "$marker" 2>/dev/null || true)
failed_commit=$(cat "$failed" 2>/dev/null || true)

if [[ "$target" == "$deployed" ]]; then
  exit 0
fi
if [[ -n "$failed_commit" && "$target" == "$failed_commit" ]]; then
  echo "Skipping known-bad commit $target (rolled back earlier)" >&2
  exit 0
fi

if [[ -n "$(sudo -u ubuntu git -C "$repo" status --porcelain --untracked-files=no)" ]]; then
  echo "Refusing deploy: tracked files are modified" >&2
  exit 1
fi
rm -f "$failed"

# 目标是 HEAD 的祖先（回退方向）时用 reset，否则只允许快进合并
checkout_revision() {
  local revision="$1"
  if sudo -u ubuntu git -C "$repo" merge-base --is-ancestor "$revision" HEAD; then
    sudo -u ubuntu git -C "$repo" reset --hard --quiet "$revision"
  else
    sudo -u ubuntu git -C "$repo" merge --ff-only --quiet "$revision"
  fi
}

wait_healthy() {
  local attempt
  for attempt in $(seq 1 "$health_attempts"); do
    if curl -fsS --max-time 5 "$health_url" >/dev/null 2>&1; then
      return 0
    fi
    sleep "$health_interval"
  done
  return 1
}

echo "Deploying $target"
checkout_revision "$target"
cd "$repo"

if ! docker compose build; then
  echo "Build failed for $target; previous containers keep serving" >&2
  if [[ -n "$deployed" ]]; then
    checkout_revision "$deployed"
  fi
  exit 1
fi

if timeout 180 docker compose up -d --remove-orphans && wait_healthy; then
  printf "%s\n" "$target" > "$marker"
  echo "Deployment healthy: $target"
  exit 0
fi

echo "Deployment failed: $target" >&2
docker compose ps >&2 || true

if [[ -z "$deployed" ]]; then
  echo "No previous deployment to roll back to" >&2
  exit 1
fi

echo "Rolling back to $deployed" >&2
checkout_revision "$deployed"
docker compose build >&2
if ! timeout 180 docker compose up -d --remove-orphans >&2; then
  echo "Rollback up failed: $deployed" >&2
  exit 1
fi
if ! wait_healthy; then
  echo "Rollback health check failed: $deployed" >&2
  exit 1
fi
printf "%s\n" "$target" > "$failed"
echo "Rolled back to $deployed; skipping $target until a new commit" >&2
exit 1
