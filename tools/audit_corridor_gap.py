#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""缺走廊探测：坐标落不回本线走廊的站，附近到底是哪些 OSM 走廊。

构建期只能报出"这个点离本线走廊 X km"，报不出"那该走哪条线"。这里补上后半句：
在站周围 R km 内找所有**已提取**的铁路 way，按来源名归组，给出

- 本线已经允许的走廊（osm_names / link_names / osm_bounds）里有没有它；
- 该名字是不是**别的线已经不限界提取**的（借过来只要写进本线 link_names，
  不改提取白名单，不触发全国 PBF 重扫）；
- 还是要新增来源名（改白名单＝一次约 13 分钟重扫）。

    python tools/audit_corridor_gap.py [--radius-km 1.5] [--json out.json]
"""

import argparse
import json
import math
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))

from rail_network import extract as extract_mod  # noqa: E402
from rail_network.build import (  # noqa: E402
    LINES, UNNAMED_ZONES, extract_wanted, line_allowed_names, norm_name,
)
from rail_network.geometry import dist, SNAP_MAX  # noqa: E402
from rail_network.lines import MANUAL_NODES  # noqa: E402

COORDS = os.path.join(ROOT, "tools", "rail_network", "node-coords.json")
EXEMPT = os.path.join(ROOT, "tools", "rail_network", "pin-exemptions.json")


def hav(a, b):
    k = math.cos(math.radians((a[1] + b[1]) / 2.0)) * 111.32
    return math.hypot((b[0] - a[0]) * k, (b[1] - a[1]) * 111.32)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--radius-km", type=float, default=1.5)
    ap.add_argument("--min-km", type=float, default=0.05, help="豁免阈值以下不查")
    ap.add_argument("--json", default="")
    args = ap.parse_args()

    coords = {r["name"]: r for r in json.load(open(COORDS, encoding="utf-8"))}
    exempt = [r for r in json.load(open(EXEMPT, encoding="utf-8"))
              if r["km"] >= args.min_km]
    by_id = {ln["id"]: ln for ln in LINES}

    payload = extract_mod.extract(extract_wanted(LINES))
    ways_by_name = payload["ways"]
    # 不限界使用该来源的线路：借它不改变提取白名单
    owners = {}
    for ln in LINES:
        bounded = ln.get("osm_bounds") or {}
        for nm in ln["osm_names"]:
            if nm not in bounded:
                owners.setdefault(nm, []).append(ln["id"])

    # 站点网格：先把所有已提取 way 的顶点按名字存下来
    flat = [(nm, w["pts"]) for nm, ws in ways_by_name.items() for w in ws]

    out = []
    for row in sorted(exempt, key=lambda r: -r["km"]):
        line = by_id.get(row["line"])
        node = coords.get(row["station"])
        if not line or not node:
            continue
        c = node["coord"]
        allowed = line_allowed_names(line)
        near = {}
        for nm, pts in flat:
            for p in pts:
                if abs(p[0] - c[0]) > 0.02 or abs(p[1] - c[1]) > 0.02:
                    continue
                d = hav(p, c)
                if d <= args.radius_km:
                    if nm not in near or d < near[nm]:
                        near[nm] = round(d, 3)
        cand = sorted(((nm, d) for nm, d in near.items() if nm not in allowed),
                      key=lambda x: x[1])
        out.append({"line": row["line"], "line_name": line["name"],
                    "station": row["station"], "km": row["km"],
                    "allowed": sorted(allowed),
                    "borrowable": [
                        {"name": nm, "km": d, "owners": owners.get(nm, [])}
                        for nm, d in cand if owners.get(nm)],
                    "needs_rescan": [{"name": nm, "km": d} for nm, d in cand
                                     if not owners.get(nm)]})
        if row["km"] >= 0.3:
            print("%-26s %-9s 离本线走廊 %.2fkm" % (row["line"], row["station"], row["km"]))
            print("    可借（已被别的不限界提取，不触发重扫）：%s"
                  % ("、".join("%s@%.2fkm←%s" % (b["name"], b["km"], "+".join(b["owners"]))
                               for b in out[-1]["borrowable"][:6]) or "无"))
            print("    需新增来源名（要重扫 PBF）：%s"
                  % ("、".join("%s@%.2fkm" % (b["name"], b["km"])
                               for b in out[-1]["needs_rescan"][:6]) or "无"))
    if args.json:
        json.dump(out, open(args.json, "w", encoding="utf-8"),
                  ensure_ascii=False, indent=1)
        print("已写出 %s（%d 条）" % (args.json, len(out)))


if __name__ == "__main__":
    main()
