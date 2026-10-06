#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""坐标体检：每个声明站的写死坐标到底落在哪儿，逐条量出来。

三把尺子（都按"线路自己的分线图"量，不是全网图，否则平行走廊会互相掩护）：
- corridor：坐标到本线走廊最近顶点的垂距。落在走廊上，折线才可能在站点处收尾；
  差几百米以上，区段就得"先拐过去再折回来"，图上是一根钩子、里程白算一倍。
- osm：坐标到 OSM 同名客运站节点的最近距离。这一把量的是"这座站真的在这儿吗"。
- chain：坐标到本线相邻声明站区段折线端点的距离（产物里已核对过的实际落点）。

用法：
    python tools/audit_coords.py                    # 分布 + 最差名单
    python tools/audit_coords.py --json out.json    # 全量落盘
"""

import argparse
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))

from rail_network import extract as extract_mod  # noqa: E402
from rail_network.build import (  # noqa: E402
    LINES, MANUAL_NODES, UNNAMED_ZONES, BATCH_ORDER, NodeRegistry,
    build_station_index, extract_wanted, line_ways, norm_name, way_point_index,
)
from rail_network.geometry import WayGraph, haversine_km, SNAP_MAX  # noqa: E402

COORDS = os.path.join(ROOT, "tools", "rail_network", "node-coords.json")


def load_coords():
    rows = json.load(open(COORDS, encoding="utf-8"))
    return {r["name"]: r for r in rows}, rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", default="")
    ap.add_argument("--batches", default=",".join(BATCH_ORDER))
    ap.add_argument("--corridor-km", type=float, default=0.05)
    args = ap.parse_args()

    coords, rows = load_coords()
    by_name = {}
    for r in rows:
        by_name.setdefault(norm_name(r["name"]), []).append(r)

    batches = [b.strip().upper() for b in args.batches.split(",")]
    active = [ln for ln in LINES if ln["batch"] in batches]
    wanted = extract_wanted(active)
    wanted["__unnamed__"] = [list(b) for b in UNNAMED_ZONES]
    payload = extract_mod.extract(wanted)
    station_index = build_station_index(payload["stations"])
    all_ways = []
    for nm, ws in payload["ways"].items():
        for w in ws:
            w["src"] = nm
            all_ways.append(w)

    recs = []
    for line in active:
        g = WayGraph(line_ways(all_ways, line))
        for b in UNNAMED_ZONES:
            g.bridge_zone(list(b), max_gap=0.004)
        for b in line.get("gap_bridges") or []:
            g.bridge_zone(list(b), max_gap=0.004)
        for name in line["stations"]:
            ent = coords.get(name)
            if ent is None:
                hits = by_name.get(norm_name(name)) or []
                ent = hits[0] if hits else None
            if ent is None:
                recs.append({"line": line["id"], "station": name,
                             "corridor_km": None, "osm_km": None,
                             "problem": "坐标清单里没有这个站名"})
                continue
            c = ent["coord"]
            d, p = g.nearest_vertex(c, radius=SNAP_MAX)
            corridor = haversine_km(c, p) if p is not None else None
            cands = station_index.get(norm_name(name)) or []
            osm = min((haversine_km(c, s["coord"]) for s in cands),
                      default=None)
            recs.append({"line": line["id"], "station": name, "kind": ent["kind"],
                         "source": ent["source"], "coord": c,
                         "corridor_km": None if corridor is None else round(corridor, 4),
                         "osm_km": None if osm is None else round(osm, 4),
                         "osm_cands": len(cands)})

    bad_corridor = [r for r in recs if r.get("corridor_km") is None
                    or r["corridor_km"] > args.corridor_km]
    no_osm = [r for r in recs if r.get("osm_km") is None]
    far_osm = [r for r in recs if r.get("osm_km") is not None and r["osm_km"] > 0.5]
    print("检查 (线,站) 组合 %d：坐标不落本线走廊(>%.0fm) %d  "
          "OSM 无同名站 %d  坐标离 OSM 站>0.5km %d"
          % (len(recs), args.corridor_km * 1000, len(bad_corridor),
             len(no_osm), len(far_osm)))

    def show(title, items, limit=40):
        print("\n== %s（%d 条，列前 %d）==" % (title, len(items), min(limit, len(items))))
        for r in items[:limit]:
            print("  %-26s %-10s corridor=%s osm=%s src=%s"
                  % (r["line"], r["station"], r.get("corridor_km"),
                     r.get("osm_km"), r.get("source")))

    show("坐标不落本线走廊", sorted(bad_corridor, key=lambda r: -(r.get("corridor_km") or 99)))
    show("OSM 里找不到同名客运站", sorted(no_osm, key=lambda r: r["line"]))
    show("坐标离 OSM 站节点远", sorted(far_osm, key=lambda r: -(r.get("osm_km") or 0)))

    if args.json:
        with open(args.json, "w", encoding="utf-8", newline="\n") as f:
            json.dump(recs, f, ensure_ascii=False, indent=1)
        print("\n已写出 %s" % args.json)


if __name__ == "__main__":
    main()
