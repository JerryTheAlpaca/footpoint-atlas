#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""坐标体检（外部源）：拿独立的车站坐标库比对我们的坐标清单。

源：build-cache/ext/cc0-stations.json（undef-i/China-Railway-Station-Database，
CC0，4582 站，含经纬度，WGS84 族）与 sl.json（CRTransfer，同源，不重复计）。
两份都与 OSM 无关，能独立指出"这座站到底在哪儿"。

注意：我们的坐标是**吸附到线路走廊 way 顶点**的（正线中心线），对方是**站房/
POI 位置**，两者差几百米是常态，不能按"坐标错了"处理。真正要盯的是：
- 匹配不到任何外部站名的点（可能是线路所/道岔尖，正常；也可能是站名或位置错）
- 差 >2km 的点：走廊落点与站房实际位置离得这么远，要么站真的离正线很远
  （货运站改客用、站到线远），要么我们把节点挂错了走廊。

    python tools/audit_coords_ext.py [--limit 40] [--json 输出]
"""

import argparse
import json
import math
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))

COORDS = os.path.join(ROOT, "tools", "rail_network", "node-coords.json")
EXT_DIR = os.path.join(ROOT, "build-cache", "ext")


def norm(name):
    s = re.sub(r"[^\u4e00-\u9fff]", "", str(name or ""))
    if len(s) > 2 and s.endswith("站"):
        s = s[:-1]
    return s


def hav(a, b):
    k = math.cos(math.radians((a[1] + b[1]) / 2.0)) * 111.32
    return math.hypot((b[0] - a[0]) * k, (b[1] - a[1]) * 111.32)


def load_external():
    out = {}
    p = os.path.join(EXT_DIR, "cc0-stations.json")
    if os.path.exists(p):
        for name, v in json.load(open(p, encoding="utf-8")).items():
            try:
                out.setdefault(norm(name), []).append(
                    (float(v["Longitude"]), float(v["Latitude"]), v.get("type") or ""))
            except (KeyError, TypeError, ValueError):
                continue
    p = os.path.join(EXT_DIR, "sl.json")
    if os.path.exists(p):
        for name, v in json.load(open(p, encoding="utf-8")).items():
            if v.get("lon") is not None:
                out.setdefault(norm(name), []).append((v["lon"], v["lat"], "CRTransfer"))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=40)
    ap.add_argument("--far-km", type=float, default=2.0)
    ap.add_argument("--json", default="")
    args = ap.parse_args()

    rows = json.load(open(COORDS, encoding="utf-8"))
    ext = load_external()
    if not ext:
        raise SystemExit("没找到外部坐标库，先取到 %s" % EXT_DIR)

    matched, missing, far = [], [], []
    for r in rows:
        cands = ext.get(norm(r["name"]))
        if not cands:
            missing.append(r)
            continue
        d = min(hav(r["coord"], (c[0], c[1])) for c in cands)
        rec = {"name": r["name"], "kind": r["kind"], "source": r["source"],
               "km": round(d, 3),
               "ext_type": "/".join(sorted({c[2] for c in cands if c[2]}))}
        matched.append(rec)
        if d > args.far_km:
            far.append(rec)

    ds = sorted(x["km"] for x in matched)
    def q(p):
        return ds[min(len(ds) - 1, int(len(ds) * p))]
    print("清单节点 %d：外部库匹配 %d（%.0f%%），匹配不到 %d"
          % (len(rows), len(matched), 100.0 * len(matched) / len(rows), len(missing)))
    print("偏差分位 p50=%.0fm p90=%.0fm p99=%.0fm 最大=%.1fkm；>%.1fkm 的 %d 个"
          % (q(.5) * 1000, q(.9) * 1000, q(.99) * 1000, ds[-1], args.far_km, len(far)))

    print("\n== 偏差 >%.1fkm（站房与走廊落点对不上，逐个查）==" % args.far_km)
    for r in sorted(far, key=lambda x: -x["km"])[:args.limit]:
        print("  %-12s %-10s %6.2fkm  %s/%s"
              % (r["name"], r["kind"], r["km"], r["source"], r["ext_type"]))
    print("\n== 外部库查无此名 %d 个（前 %d，多数应是线路所/道岔尖）=="
          % (len(missing), min(25, len(missing))))
    print("  " + "、".join(r["name"] for r in missing[:25]))
    kinds = {}
    for r in missing:
        kinds[r["kind"]] = kinds.get(r["kind"], 0) + 1
    print("  其中 kind 分布：" + json.dumps(kinds, ensure_ascii=False))

    if args.json:
        json.dump({"matched": matched, "missing": missing, "far": far},
                  open(args.json, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print("\n已写出 %s" % args.json)


if __name__ == "__main__":
    main()
