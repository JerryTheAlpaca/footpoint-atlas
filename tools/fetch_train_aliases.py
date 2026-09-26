#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""查"复车次"对应关系（同一列车跨线换号），写 build-cache/train-aliases.json（不入库）。

复车次**不是**对向车次：是一趟车因为跨线导致上下行方向切换、运行中途换车次号，
两个号指同一列车。对向的径路和停站都不能互借（K146 不停旬阳北、K148 停，
两向差约 25km），所以这里只认权威来源：12306 车次详情逐站的
`station_train_code` —— 复车次列车这个字段会在换线站变化。

对应关系拿不到就不要猜：预售期外的历史车次一律记 unknown，
查询接口挂了也只记 lookup-failed，绝不按"数字 ±1"编配对。

默认离线：只解析 build-cache/train-stops/ 里已有的 czxx 缓存，不联网。
    python tools/fetch_train_aliases.py            # 离线
    python tools/fetch_train_aliases.py --live     # 对查不到的车次联网补查
产物只给构建期工具用（tools/rail_network/llt.py --dump-via 的别名兜底），
界面上永远只显示用户输入的那个车次，所以别名号也不进任何提交文件。
"""

import argparse
import glob
import json
import os
import re
import sys
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))

import fetch_train_stops as fts  # noqa: E402

CACHE_DIR = os.path.join(ROOT, "build-cache", "train-stops")
OUT = os.path.join(ROOT, "build-cache", "train-aliases.json")


def codes_from_rows(rows):
    """按行车顺序返回 [(站名, 该站的车次号)]，只保留连续变化点。"""
    out = []
    for row in sorted(rows, key=lambda r: int(r.get("station_no") or 0)):
        code = (row.get("station_train_code") or row.get("train_code") or "").strip()
        name = (row.get("station_name") or "").strip()
        if not code or not name:
            continue
        if not out or out[-1][1] != code:
            out.append((name, code))
    return out


def parse_text(text):
    payload = json.loads(text)
    return ((payload.get("data") or {}).get("data")) or []


def from_cache():
    """离线扫已缓存的 czxx 响应：{train_no: [(站名, 车次号) 变化序列]}。"""
    found = {}
    for path in sorted(glob.glob(os.path.join(CACHE_DIR, "czxx_*.json"))):
        no = os.path.basename(path).split("_")[1]
        try:
            text = json.load(open(path, encoding="utf-8")).get("__text__")
            rows = parse_text(text)
        except Exception as exc:                      # 坏缓存不参与判定
            print("! 读不动 %s：%s" % (os.path.basename(path), exc))
            continue
        if rows:
            found[no] = codes_from_rows(rows)
    return found


def alias_of(code, change_stream):
    """只有真的在途中看到**另一个非空号**才算复车次。

    实测 12306 czxx 的 station_train_code 只在首站那一行有值、其余为 None，
    所以这份数据看不出"中途换号"。把"站对上查到另一趟车"当复车次是错的：
    那是别趟车，径路无关，绝不许借（这正是 K146/K148 那类教训的反面）。
    """
    seen = [c for _, c in change_stream if c]
    distinct = set(seen)
    if len(distinct) < 2 or code not in distinct:
        return []
    out = []
    for c in sorted(distinct - {code}):
        i = [k for k, (_, cc) in enumerate(change_stream) if cc == c][0]
        prev = change_stream[i - 1] if i else None
        out.append({"code": c, "from_station": prev[0] if prev else None,
                    "first_station": change_stream[i][0]})
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--live", action="store_true",
                    help="对离线查不到的车次，用 12306 现查一次（走同一套缓存）")
    args = ap.parse_args()

    text = open(os.path.join(ROOT, "js", "data.js"), encoding="utf-8").read()
    m = re.search(r"window\.TRAIN_DATA\s*=\s*(\{.*?\});\s*$", text, re.S)
    records = json.loads(m.group(1))["records"]
    codes = sorted({r["train"] for r in records})

    streams = from_cache()
    by_code = {}
    for no, stream in streams.items():
        inner = no[5:10].lstrip("0") if len(no) >= 10 else None
        if inner:
            by_code.setdefault(inner, (no, stream))

    unresolved = [c for c in codes if c not in by_code]
    if args.live and unresolved:
        fetcher = fts.Fetcher()
        tele = fts.load_telecodes(fetcher)
        for r in records:
            if r["train"] in by_code:
                continue
            got = fts.resolve_pair(fetcher, tele, {r["train"]}, r["from"], r["to"])
            if r["train"] not in got:
                continue
            no, date = got[r["train"]]
            # 要逐站的 station_train_code，所以自己取原始 rows
            # （fetch_official_stops 只返回站名，会把这个字段丢掉）。
            url = fts.CZXX_URL % (urllib.parse.quote(no), tele[r["from"]],
                                  tele[r["to"]], date)
            try:
                rows = parse_text(fetcher.text(url, "czxx-%s-%s" % (no, date)))
            except Exception as exc:
                print("    %s 的 czxx 取不到：%s" % (r["train"], exc))
                continue
            if rows:
                streams[no] = codes_from_rows(rows)
                by_code.setdefault(r["train"], (no, streams[no]))
        unresolved = [c for c in codes if c not in by_code]

    out = {}
    for code in codes:
        if code in by_code:
            no, stream = by_code[code]
            others = alias_of(code, stream)
            inner = no[5:10].lstrip("0") if len(no) >= 10 else ""
            status = "alias" if others else (
                "code-mismatch" if inner and inner != code else "none")
            out[code] = {
                "status": status,
                "trainNo": no,
                "aliases": others,
                "codesSeen": sorted({c for _, c in stream if c}),
            }
            if status == "code-mismatch":
                # 站对上查到的是别趟车（号不同），不是同一列车的复车次号
                out[code]["why"] = ("该站对上查到的是 %s（另一趟车），"
                                    "不得当作本车次证据" % inner)
        else:
            out[code] = {"status": "unknown", "aliases": [],
                         "why": "预售期外或当前图无此车次，未联网补查" if not args.live
                         else "12306 查不到该车次的 train_no"}
    tmp = OUT + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump({"note": "复车次（同列车跨线换号）对应关系；只本地构建期用，不入库",
                   "cachedResponses": len(streams),
                   "aliases": out}, f, ensure_ascii=False, indent=1)
    os.replace(tmp, OUT)
    n_alias = sum(1 for v in out.values() if v["status"] == "alias")
    n_mis = sum(1 for v in out.values() if v["status"] == "code-mismatch")
    print("车次 %d 个：确认复车次 %d，确认单号 %d，站对上查到别趟车 %d，查不到 %d"
          % (len(out), n_alias, sum(1 for v in out.values() if v["status"] == "none"),
             n_mis, len(unresolved)))
    if not n_alias:
        print("  注：12306 czxx 的 station_train_code 只有首站一行有值，看不出中途换号；"
              "所以这份数据建立不了复车次对应关系，宁可不判。")
    if unresolved:
        print("  查不到：%s" % " ".join(unresolved))
    for code, v in sorted(out.items()):
        if v["status"] == "alias":
            print("  %-8s → %s" % (code, ", ".join(
                "%s(自 %s 起)" % (a["code"], a["from_station"] or "首站")
                for a in v["aliases"])))
        elif v["status"] == "code-mismatch":
            print("  %-8s × %s" % (code, v["why"]))
    print("已写 %s" % OUT)


if __name__ == "__main__":
    main()
