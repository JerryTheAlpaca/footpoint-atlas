#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""抓取车次停靠站序列与累计里程，供经由自动判定使用。

用法（项目根目录）：
    python tools/fetch_train_stops.py                     # 增量：只抓产物里缺的车次
    python tools/fetch_train_stops.py --dry-run           # 只列缺哪些车次，不发请求
    python tools/fetch_train_stops.py --refresh G7113,G13 # 强制重抓指定车次
    python tools/fetch_train_stops.py --all               # 全部重抓
    python tools/fetch_train_stops.py --no-distance       # 不打第三方源，只取官方站序

数据源分工：
    12306 station_name.js      —— 站名 → 电报码，免鉴权。
    12306 leftTicket/query     —— 由记录的站对反查 train_no（czxx 只认编号不认
        车次号）。需要先 GET /otn/leftTicket/init 取会话 Cookie，不需要登录。
    12306 czxx/queryByTrainNo  —— 权威停靠站序列，免 Cookie。
    RailGo /api/train/query    —— 仅用于取各站累计里程（distance），给"一站
        直达穿越并行走廊"这类站序判不出的情况兜底。该库 All Rights Reserved，
        所以产物里只落"站名 + 整数公里"这类事实数据，不落其几何、交路、车底、
        担当局等字段；--no-distance 可完全不打这个源。

产物：js/train-stops.js —— window.TRAIN_STOPS。
原始响应缓存 build-cache/train-stops/（gitignored），离线重跑可复现。

注意：12306 只能查当前运行图（预售期内）。车次号跨运行图会被复用，所以
历史记录抓到的站序未必是当年那趟车。产物照实存当前站序，是否采信由
js/rail-routes.js 在解析时判定（记录的 from/to 必须都在站序里）。
"""

import argparse
import datetime
import http.cookiejar
import json
import os
import re
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE_DIR = os.path.join(ROOT, "build-cache", "train-stops")
DATA_JS = os.path.join(ROOT, "js", "data.js")
OUT_JS = os.path.join(ROOT, "js", "train-stops.js")

STATION_NAME_JS = "https://kyfw.12306.cn/otn/resources/js/framework/station_name.js"
INIT_URL = "https://kyfw.12306.cn/otn/leftTicket/init"
# 12306 会轮换 leftTicket 的后缀，逐个试到通为止。
QUERY_SUFFIXES = ["query", "queryG", "queryZ", "queryA", "queryO", "queryX",
                  "queryE", "queryU"]
CZXX_URL = ("https://kyfw.12306.cn/otn/czxx/queryByTrainNo?train_no=%s"
            "&from_station_telecode=%s&to_station_telecode=%s&depart_date=%s")
RAILGO_URL = "https://data.railgo.zenglingkun.cn/api/train/query?train=%s"

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0 Safari/537.36")
TIMEOUT = 25
SLEEP = 0.4          # 请求间隔，两个源都无频控，留间隔只为不添堵
# 预售期内的候选查询日期偏移（天）。高峰线/周末线在单一天可能查不到，
# 逐个试；命中即停，所以对常规车次不会多发请求。
QUERY_OFFSETS = [3, 1, 5, 7, 10, 14]


class Fetcher:
    """带磁盘缓存的取数器。官方源走同一个 CookieJar 会话。"""

    def __init__(self):
        os.makedirs(CACHE_DIR, exist_ok=True)
        self.jar = http.cookiejar.CookieJar()
        self.opener = urllib.request.build_opener(
            urllib.request.HTTPCookieProcessor(self.jar))
        self.opener.addheaders = [("User-Agent", UA)]
        self.suffix = None
        self.inited = False
        self.calls = 0

    def _cache_path(self, key):
        return os.path.join(CACHE_DIR, re.sub(r"\W", "_", key) + ".json")

    def _read_cache(self, key):
        path = self._cache_path(key)
        if os.path.exists(path):
            with open(path, encoding="utf-8") as f:
                return json.loads(f.read())
        return None

    def _write_cache(self, key, text):
        with open(self._cache_path(key), "w", encoding="utf-8") as f:
            f.write(text)

    def text(self, url, key, use_cookie=False):
        """取原始文本，命中缓存则不发请求。"""
        cached = self._read_cache(key)
        if cached is not None:
            return cached.get("__text__")
        if use_cookie and not self.inited:
            self.opener.open(INIT_URL, timeout=TIMEOUT).read()
            self.inited = True
        self.calls += 1
        with self.opener.open(url, timeout=TIMEOUT) as resp:
            body = resp.read().decode("utf-8")
        self._write_cache(key, json.dumps({"__text__": body},
                                          ensure_ascii=False))
        time.sleep(SLEEP)
        return body


def query_dates():
    """预售期内的候选查询日期（偏移天数）。

    周末线/高峰线在任一天都可能不开行，逐个试到查到为止。顺序把工作日
    与周末错开，多数车次第一次就命中。
    """
    today = datetime.date.today()
    return [(today + datetime.timedelta(days=off)).isoformat()
            for off in QUERY_OFFSETS]


def load_telecodes(fetcher):
    """站名 → 电报码。12306 的 station_name.js，按 @ 分站、| 分字段。"""
    body = fetcher.text(STATION_NAME_JS, "station-name", use_cookie=False)
    tele = {}
    for chunk in body.split("@"):
        parts = chunk.split("|")
        if len(parts) > 2 and parts[1]:
            tele[parts[1]] = parts[2]
    if not tele:
        raise SystemExit("station_name.js 解析为空，格式可能已变")
    return tele


def leftticket_rows(fetcher, ftc, ttc, date):
    """某站对某日的余票查询结果行。返回 (rows, err)。"""
    if fetcher.suffix is None:
        suffixes = list(QUERY_SUFFIXES)
    else:
        suffixes = [fetcher.suffix] + [s for s in QUERY_SUFFIXES
                                       if s != fetcher.suffix]
    last_err = "无响应"
    for suffix in suffixes:
        url = ("https://kyfw.12306.cn/otn/leftTicket/%s"
               "?leftTicketDTO.train_date=%s&leftTicketDTO.from_station=%s"
               "&leftTicketDTO.to_station=%s&purpose_codes=ADULT"
               % (suffix, date, ftc, ttc))
        key = "lt-%s-%s-%s-%s" % (suffix, ftc, ttc, date)
        try:
            payload = json.loads(fetcher.text(url, key, use_cookie=True))
        except (urllib.error.URLError, OSError, ValueError) as exc:
            last_err = str(exc)
            continue
        rows = ((payload.get("data") or {}).get("result")) or []
        if not rows:
            last_err = "该日无车次"
            continue
        fetcher.suffix = suffix
        return rows, None
    return [], last_err


def resolve_pair(fetcher, tele, codes, from_name, to_name):
    """为一个站对解析多个车次的 train_no，跨多个候选日期尝试。

    返回 {车次: (train_no, 生效日期)}。找不到的车次不在结果里。
    """
    if from_name not in tele or to_name not in tele:
        print("    站名不在 12306 站名表里：%s/%s" % (from_name, to_name))
        return {}
    ftc, ttc = tele[from_name], tele[to_name]
    found = {}
    remaining = set(codes)
    for date in query_dates():
        if not remaining:
            break
        rows, err = leftticket_rows(fetcher, ftc, ttc, date)
        if err:
            continue
        by_code = {}
        for row in rows:
            fields = row.split("|")
            # [2]=train_no（czxx 用），[3]=车次号。
            if len(fields) > 3 and fields[3]:
                by_code.setdefault(fields[3], fields[2])
        for code in list(remaining):
            if code in by_code:
                found[code] = (by_code[code], date)
                remaining.discard(code)
    for code in sorted(remaining):
        print("    %s 未查到 train_no：预售期内该站对均无此车次"
              "（可能已停运、改号或为临时线）" % code)
    return found


def fetch_official_stops(fetcher, train_no, tele, from_name, to_name, date):
    """12306 czxx：权威全程停靠站序列。失败返回 None。"""
    url = CZXX_URL % (urllib.parse.quote(train_no), tele[from_name],
                      tele[to_name], date)
    key = "czxx-%s-%s" % (train_no, date)
    try:
        payload = json.loads(fetcher.text(url, key, use_cookie=False))
    except (urllib.error.URLError, OSError, ValueError) as exc:
        print("    12306 czxx 取不到（%s）" % exc)
        return None
    rows = ((payload.get("data") or {}).get("data")) or []
    names = []
    for row in rows:
        name = (row.get("station_name") or "").strip()
        if name and name not in names:
            names.append(name)
    return names or None


def fetch_distance(fetcher, code):
    """RailGo：各站累计里程（整数 km）。取不到返回空 dict，不影响主流程。"""
    key = "railgo-%s" % code
    try:
        payload = json.loads(fetcher.text(RAILGO_URL % urllib.parse.quote(code),
                                         key, use_cookie=False))
    except (urllib.error.URLError, OSError, ValueError, KeyError):
        return {}
    if not isinstance(payload, dict):
        return {}
    dist = {}
    for stop in payload.get("timetable") or []:
        name = (stop.get("station") or "").strip()
        km = stop.get("distance")
        if name and isinstance(km, (int, float)) and km >= 0:
            dist[name] = int(round(km))
    return dist


def read_records():
    code = open(DATA_JS, encoding="utf-8").read()
    m = re.search(r"window\.TRAIN_DATA\s*=\s*(\{.*?\});\s*$", code, re.S)
    if not m:
        raise SystemExit("无法解析 %s" % DATA_JS)
    return json.loads(m.group(1)).get("records", [])


def read_existing():
    if not os.path.exists(OUT_JS):
        return {}
    code = open(OUT_JS, encoding="utf-8").read()
    m = re.search(r"var TRAIN_STOPS = (\{.*\});\s*root\.", code, re.S)
    if not m:
        return {}
    return json.loads(m.group(1)).get("trains", {})


def write_artifact(trains):
    payload = {
        "meta": {
            "generated": datetime.date.today().isoformat(),
            "count": len(trains),
            "note": ("停靠站序列来自 12306（station_name.js + leftTicket + "
                     "czxx/queryByTrainNo），为 asOf 那天的运行图；累计里程 "
                     "km 来自第三方时刻表，仅用于并行走廊判别。"),
        },
        "trains": trains,
    }
    body = json.dumps(payload, ensure_ascii=False, indent=1)
    js = (
        "// 由 tools/fetch_train_stops.py 生成，请勿手工编辑。\n"
        "// 车次停靠站序列与累计里程，供 js/rail-routes.js 判定真实经由。\n"
        "(function (root) {\n"
        "  'use strict';\n"
        "  var TRAIN_STOPS = %s;\n"
        "  root.TRAIN_STOPS = TRAIN_STOPS;\n"
        "})(typeof window !== 'undefined' ? window : globalThis);\n" % body
    )
    fd, tmp = tempfile.mkstemp(dir=os.path.dirname(OUT_JS), suffix=".tmp")
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        f.write(js)
    os.replace(tmp, OUT_JS)
    print("\n已写出 %s（%.1f KB）：%d 个车次"
          % (OUT_JS, len(js) / 1024, len(trains)))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true",
                        help="只列出缺失车次，不发请求")
    parser.add_argument("--all", action="store_true", help="全部重抓")
    parser.add_argument("--no-distance", action="store_true",
                        help="不打第三方源，只取官方站序")
    parser.add_argument("--refresh", default="",
                        help="强制重抓的车次，逗号分隔")
    args = parser.parse_args()

    records = read_records()
    # 站对 → 该车次列表。leftTicket 按站对查，同站对只查一次。
    pairs = {}
    for rec in records:
        code = str(rec.get("train") or "").strip()
        if not code:
            continue
        pairs.setdefault((rec.get("from"), rec.get("to")), set()).add(code)
    wanted = sorted({c for s in pairs.values() for c in s})
    existing = {} if args.all else read_existing()
    refresh = {c.strip() for c in args.refresh.split(",") if c.strip()}
    todo = [c for c in wanted if c in refresh or c not in existing]

    print("记录 %d 条，去重车次 %d 个，站对 %d 组；产物已有 %d 个，待抓 %d 个"
          % (len(records), len(wanted), len(pairs), len(existing), len(todo)))
    if args.dry_run:
        if todo:
            print("待抓车次：" + " ".join(todo))
        else:
            print("无需抓取。")
        return
    if not todo:
        print("无需抓取。")
        report_coverage(records, existing)
        return

    fetcher = Fetcher()
    tele = load_telecodes(fetcher)
    print("12306 站名表 %d 站" % len(tele))

    # 站对 → {车次: (train_no, 生效日期)}。一次 leftTicket 服务同站对的多个
    # 车次；同一车次出现在多个站对时先查到者生效——czxx 返回的是全程站序，
    # 与拿哪个站对去查无关。
    trains = {k: v for k, v in existing.items() if k not in refresh}
    resolved = {}
    todo_set = set(todo)
    need_pairs = sorted(p for p, codes in pairs.items() if codes & todo_set)
    for i, (from_name, to_name) in enumerate(need_pairs, 1):
        codes = {c for c in pairs[(from_name, to_name)] & todo_set
                 if c not in resolved}
        if not codes:
            continue
        print("[%d/%d] 站对 %s→%s（%s）"
              % (i, len(need_pairs), from_name, to_name,
                 " ".join(sorted(codes))))
        for code, (train_no, date) in resolve_pair(fetcher, tele, codes,
                                                   from_name, to_name).items():
            resolved[code] = (train_no, date, from_name, to_name)

    ok, failed = 0, []
    for code in todo:
        hit = resolved.get(code)
        if not hit:
            failed.append(code)
            continue
        train_no, date, from_name, to_name = hit
        stops = fetch_official_stops(fetcher, train_no, tele,
                                     from_name, to_name, date)
        if not stops:
            failed.append(code)
            print("    %s 站序未取得，跳过" % code)
            continue
        entry = {
            "trainNo": train_no,
            "stops": stops,
            "asOf": date,
        }
        if not args.no_distance:
            dist = fetch_distance(fetcher, code)
            kms = {n: dist[n] for n in stops if n in dist}
            if kms:
                # 只存有里程的站，省体积；缺的站在解析时按相邻插值处理。
                entry["km"] = kms
        trains[code] = entry
        ok += 1
        tail = entry.get("km", {}).get(stops[-1])
        print("    %s ← %d 站%s" % (code, len(stops),
                                    "，末站 %d km" % tail if tail else ""))

    write_artifact(trains)
    print("本次抓到 %d 个车次，实际发出 %d 次请求" % (ok, fetcher.calls))
    if failed:
        print("未取得 %d 个车次：%s" % (len(failed), " ".join(failed)))
        print("（这些记录解析时会退回最短路寻径，不影响其它记录）")
    report_coverage(records, trains)


def report_coverage(records, trains):
    """报告每条记录能否用站序判定经由：from/to 是否都在抓到的站序里。"""
    good, bad = [], []
    for rec in records:
        entry = trains.get(str(rec.get("train") or "").strip())
        if not entry:
            bad.append((rec, "无站序数据"))
            continue
        stops = entry["stops"]
        missing = [n for n in (rec["from"], rec["to"]) if n not in stops]
        if missing:
            bad.append((rec, "站序里没有 " + "/".join(missing) + "（车次可能已改号）"))
        else:
            good.append(rec)
    print("\n=== 记录覆盖情况 ===")
    print("可判定 %d/%d 条" % (len(good), len(records)))
    for rec, why in bad:
        print("  %s %s %s→%s：%s"
              % (rec.get("date"), rec.get("train"), rec.get("from"),
                 rec.get("to"), why))


if __name__ == "__main__":
    main()
