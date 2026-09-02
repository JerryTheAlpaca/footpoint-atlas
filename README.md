# 我的火车足迹

“我的火车足迹”是一款面向个人乘车记录的可视化网页应用。它把旅途数据整理成一张可探索的中国铁路足迹地图，帮助你回看走过的路线、乘坐过的车型，以及每一段值得记住的旅程。

## 功能特色

- 在中国地图上展示乘车路线、车站和线路热度。
- 提供车型、车站、路局排行，以及年度回顾和行程播放。
- 支持新增、编辑、删除乘车记录，并同步维护站点坐标。
- 桌面端保留大屏数据看板布局，手机端适配为纵向滚动的故事线界面。
- 支持触摸反馈、地图探索模式、底部操作面板和减少动态效果设置。
- 部署模式提供服务端登录、会话过期、登录限流和退出登录。
- 可使用 Docker Compose 部署到自己的服务器。

## 本地运行

项目需要 Python 3。进入项目根目录后运行：

```powershell
python tools\serve.py
```

然后打开 <http://127.0.0.1:8765/>。

页面中的设置功能会通过本地服务将行程数据写回 `js/data.js` 和 Excel 文件；如果直接使用普通静态服务器，数据修改会暂存在浏览器中。

## 数据说明

- `js/data.js` 是页面运行时读取的行程与站点数据。
- `火车乘车记录.xlsx` 是本地维护的原始记录文件。
- 请在公开部署前确认个人行程数据是否适合公开分享。

## 测试

```powershell
node --test tests\*.test.js
python -m unittest discover -s tests -p "test_*.py"
```

## 部署

项目提供 `Dockerfile`、`compose.yaml` 和 `deploy/` 下的部署配置。容器部署会强制启用登录；本地直接运行 `tools/serve.py` 时默认免登录。

### 1. 准备登录配置

先生成密码哈希，过程中不会显示或保存明文密码：

```powershell
python tools/make_password_hash.py
```

再生成至少 32 字符的随机会话密钥：

```powershell
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

复制 `.env.example` 为 `.env`，填写账号、上一步生成的密码哈希和会话密钥。`.env` 已被 Git 忽略，不要把它上传到代码仓库或发给他人。

首次部署时先建立可写的数据目录；默认容器用户是 `1000:1000`：

```bash
sudo install -d -o 1000 -g 1000 /opt/footpoint-atlas-data
```

目录为空时，容器会用仓库当前的 Excel 和 `data.js` 自动初始化，之后的修改都会持久化到该目录。

### 2. 启动容器

```powershell
docker compose up -d --build
```

应用只绑定服务器本机的 `127.0.0.1:8080`，不会直接暴露 Python 数据接口。请在腾讯云服务器上用已配置 HTTPS 证书的 Nginx、Caddy 或腾讯云边缘服务，把公网域名反向代理到 `http://127.0.0.1:8080`。

生产环境必须保留 `TRAIN_COOKIE_SECURE=1` 并通过 HTTPS 访问。腾讯云安全组只需放行实际使用的 80/443 端口，不要放行 8765 或 8080。临时在纯 HTTP 环境测试时可以设为 `0`，上线前应恢复为 `1`。

登录保护覆盖首页、脚本、地图、行程数据和保存接口；健康检查 `/healthz` 是唯一无需登录的运行状态接口。

### 接入 Jerry Ledger 单点登录

当 Ledger 与火车足迹都由本人控制并位于 `*.jerrythealpaca.cn` 时，可让火车足迹服务端校验
Ledger 的父域会话 Cookie。先让两个 Compose 项目加入同一个名为 `jerry-sites` 的 Docker
网络，再在火车足迹 `.env` 中配置：

```dotenv
TRAIN_SSO_SESSION_URL=http://ledger-auth:3000/api/auth/session
TRAIN_SSO_LOGOUT_URL=http://ledger-auth:3000/api/auth/logout
TRAIN_SSO_LOGIN_URL=https://auth.jerrythealpaca.cn/login
TRAIN_SSO_PUBLIC_ORIGIN=https://atlas.jerrythealpaca.cn
TRAIN_SSO_COOKIE_NAME=__Secure-jerry_session
TRAIN_SSO_COOKIE_DOMAIN=.jerrythealpaca.cn
```

配置后，未登录访问会跳到中心登录页；中心会话有效时直接进入足迹页；从足迹站退出会撤销中心
会话并清除父域 Cookie。旧的密码哈希与会话密钥仍可暂时保留在 `.env` 以便回滚，但 SSO 模式
不会再使用它们验证登录。
