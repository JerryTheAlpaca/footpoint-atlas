#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""下载并解包路路通离线数据库（an.db → routes.dat 等），只写 gitignored 的 build-cache/。

链路（公网直链、免登录、HTTP）：
    http://down.lltskb.com/android.ver   配置：当前数据版本 + 数据文件地址
    http://down.lltskb.com/an.db         安卓版离线库（未加密 ZIP，内含 60+ .dat）

android.ver 是**手写的、不合法的 JSON**（渠道块里有 `"name": 应用宝"` 这种缺前引号的
写法），所以这里只按正则抽 `version.data` 与第一个 dataUrl 列表，不做 json.loads。

解包后立刻用解析器过一遍并核对哨兵（消费字节数 == 文件大小、两条记录数在可信区间），
私有格式改版要在下载这一步就撞上，而不是等构建出错。

数据版权属路路通工作室：只可自用，原始字节与解出的 .dat 一律不入库。
用法：
    python tools/fetch_llt_db.py            # 已是最新就跳过
    python tools/fetch_llt_db.py --force    # 强制重下重解
"""

import argparse
import datetime
import hashlib
import io
import json
import os
import re
import sys
import tempfile
import urllib.error
import urllib.request
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))

from rail_network import llt as llt_mod  # noqa: E402

VER_URL = "http://down.lltskb.com/android.ver"
FALLBACK_DB_URLS = ["http://down.lltskb.com/an.db"]
CACHE_DIR = os.path.join(ROOT, "build-cache", "llt")
DB_DIR = os.path.join(CACHE_DIR, "db")
DB_PATH = os.path.join(CACHE_DIR, "an.db")
PROVENANCE = os.path.join(CACHE_DIR, "provenance.json")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) lltskb-offline-probe"
TIMEOUT = 30


def http_get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
        return resp.read()


def parse_ver(text):
    """从 android.ver 抽 (数据版本, 候选下载地址列表)。容忍非法 JSON。"""
    text = text.lstrip("﻿")
    m = re.search(r'"version"\s*:\s*\{(.*?)\}', text, re.S)
    data = None
    if m:
        mm = re.search(r'"data"\s*:\s*"(\d+)"', m.group(1))
        data = mm.group(1) if mm else None
    if data is None:
        mm = re.search(r'"data"\s*:\s*"(\d+)"', text)
        data = mm.group(1) if mm else None
    urls = []
    block = re.search(r'"dataUrl"\s*:\s*\[(.*?)\]', text, re.S)
    if block:
        urls = re.findall(r'"(https?://[^"]+)"', block.group(1))
    # 优先官方域名的 an.db，其次任意地址，最后兜底直链
    urls = [u for u in urls if "down.lltskb.com" in u] + [u for u in urls
                                                          if "down.lltskb.com" not in u]
    urls += [u for u in FALLBACK_DB_URLS if u not in urls]
    return data, urls


def sha256_bytes(b):
    return hashlib.sha256(b).hexdigest()


def read_members(blob):
    """把 an.db 当 ZIP 读进内存：{文件名: 字节}。带路径的条目只取文件名。"""
    with zipfile.ZipFile(io.BytesIO(blob)) as z:
        staged = {}
        for n in z.namelist():
            if n.endswith("/"):
                continue
            base = os.path.basename(n)
            if base:
                staged[base] = z.read(n)
    if "routes.dat" not in staged:
        raise SystemExit("an.db 里没有 routes.dat（解出 %d 个文件），格式可能变了" % len(staged))
    return staged


def _atomic_write(path, content):
    fd, tmp = tempfile.mkstemp(dir=os.path.dirname(path), suffix=".part")
    try:
        with os.fdopen(fd, "wb") as f:
            f.write(content)
        os.replace(tmp, path)
    except Exception:
        if os.path.exists(tmp):
            os.remove(tmp)
        raise


def write_all(staged, db_dir):
    """校验通过后才落盘，逐文件原子替换（build-cache 跨 worktree 共享，不动目录本身）。"""
    if not os.path.isdir(db_dir):
        os.makedirs(db_dir)
    for base, content in staged.items():
        _atomic_write(os.path.join(db_dir, base), content)


def current_routes_sha():
    p = os.path.join(DB_DIR, "routes.dat")
    return llt_mod.sha256_of(p) if os.path.exists(p) else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="忽略本地版本，强制重下重解")
    ap.add_argument("--check-only", action="store_true", help="只报远端版本，不下载")
    args = ap.parse_args()

    try:
        ver_text = http_get(VER_URL).decode("utf-8", errors="replace")
    except (urllib.error.URLError, OSError) as e:
        raise SystemExit("取 %s 失败：%s。解析器仍会退回用 build-cache/llt*/db 里已解包的"
                         "数据；要刷新请恢复网络后重试。" % (VER_URL, e))
    data_version, urls = parse_ver(ver_text)
    if not data_version:
        raise SystemExit("android.ver 里读不出数据版本，内容：%r" % ver_text[:200])
    print("远端数据版本 %s，候选地址 %d 个" % (data_version, len(urls)))

    have = None
    if os.path.exists(PROVENANCE):
        try:
            have = json.load(open(PROVENANCE, encoding="utf-8")).get("dataVersion")
        except Exception:
            have = None
    if (not args.force and not args.check_only and have == data_version
            and current_routes_sha()):
        print("本地已是 %s（routes.dat %s…），跳过下载。--force 可强制重取。"
              % (data_version, current_routes_sha()[:12]))
        return 0
    if args.check_only:
        print("本地版本 %s；routes.dat %s" % (have or "无", current_routes_sha() or "未解包"))
        return 0

    blob, used = None, None
    for u in urls:
        try:
            blob = http_get(u)
            used = u
            break
        except (urllib.error.URLError, OSError) as e:
            print("! %s 取失败：%s" % (u, e))
    if blob is None:
        raise SystemExit("所有 dataUrl 都取不到，稍后重试或手工放置 an.db 到 %s" % DB_PATH)
    print("an.db %s 字节，来自 %s" % (len(blob), used))

    if not zipfile.is_zipfile(io.BytesIO(blob)):
        raise SystemExit("an.db 不是 ZIP（前 8 字节 %s），格式改版" % blob[:8].hex())
    sha = sha256_bytes(blob)
    staged = read_members(blob)
    # 落盘前先校验：解析器过不了就什么都不写，保住上一次能用的数据。
    routes = staged["routes.dat"]
    parsed = llt_mod.parse(routes)
    counts = (len(parsed["lines"]), len(parsed["train_routes"]))
    if current_routes_sha() == sha256_bytes(routes) and have == data_version:
        print("内容未变化（routes.dat %s…），只更新溯源。" % sha256_bytes(routes)[:12])
    os.makedirs(CACHE_DIR, exist_ok=True)
    _atomic_write(DB_PATH, blob)
    write_all(staged, DB_DIR)

    prov = {
        "dataVersion": data_version,
        "fetched": datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
        "verUrl": VER_URL,
        "dbUrl": used,
        "anDb": {"sha256": sha, "bytes": len(blob)},
        "routesDat": {"sha256": sha256_bytes(routes), "bytes": len(routes)},
        "lineEntries": counts[0],
        "trainRecords": counts[1],
        "members": sorted(staged.keys()),
    }
    with open(PROVENANCE, "w", encoding="utf-8") as f:
        json.dump(prov, f, ensure_ascii=False, indent=1)
    print("已解包 %d 个文件到 %s（①层 %d 条、②层 %d 条，routes.dat %s…）"
          % (len(staged), DB_DIR, counts[0], counts[1], prov["routesDat"]["sha256"][:12]))
    print("溯源：%s" % PROVENANCE)
    return 0


if __name__ == "__main__":
    sys.exit(main())
