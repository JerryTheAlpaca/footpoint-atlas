# -*- coding: utf-8 -*-
"""诊断：约束图寻径失败的站对在全网图上的借用线路构成。"""

import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

from rail_network import extract as extract_mod
from rail_network.build import (
    UNNAMED_ZONES, build_station_index, load_data_station_coords,
    resolve_line_stations, NodeRegistry, MANUAL_NODES, norm_name,
)
from rail_network.geometry import WayGraph
from rail_network.lines import LINES, BATCH_ORDER

CACHE = os.path.join(extract_mod.CACHE_DIR, "rail-extract-8d514a7230e3e939.json")
payload = json.load(open(CACHE, encoding="utf-8"))
ways_by_name = payload["ways"]
station_index = build_station_index(payload["stations"])
data_coords = load_data_station_coords()

all_ways = []
for nm, ws in ways_by_name.items():
    for w in ws:
        w["src"] = nm
        all_ways.append(w)
waygraph = WayGraph(list(all_ways))
for b in UNNAMED_ZONES:
    waygraph.bridge_zone(list(b), max_gap=0.004)

FAIL = [
    ("hean-hsr", "合肥南", "肥西"),
    ("changgan-hsr", "莲塘", "丰城东"),
    ("ganshen-hsr", "东莞南", "深圳北"),
    ("hanghuang-hsr", "杭州东", "富阳"),
    ("huanghuang-hsr", "黄冈东", "浠水南"),
    ("chihuang-hsr", "黟县东", "黄山北"),
    ("nanjing-link", "南京", "南京南"),
    ("shanghehang-south", "合肥南", "柘皋"),
]

registry = NodeRegistry()
for n in MANUAL_NODES:
    registry.register(n["name"], n["coord"], kind=n["kind"],
                      source=n["source"], aliases=n.get("aliases"),
                      fixed_id=n["id"])

from collections import Counter

for lid, a, b in FAIL:
    line = next(l for l in LINES if l["id"] == lid)
    try:
        resolved = resolve_line_stations(line, station_index, waygraph,
                                         data_coords, registry)
    except SystemExit as exc:
        print("%s: 站解析失败 %s" % (lid, exc))
        continue
    coords = {norm_name(nm): c for nm, c, _ in resolved}
    if norm_name(a) not in coords or norm_name(b) not in coords:
        print("%s: 站名缺失 %s/%s" % (lid, a, b))
        continue
    pts = waygraph.route(coords[norm_name(a)], coords[norm_name(b)])
    if pts is None:
        print("%s: %s→%s 全网也寻径失败" % (lid, a, b))
        continue
    # 统计路径覆盖的 way 来源：按折线顶点匹配 way（粗略：顶点命中即计）
    hits = Counter()
    for w in all_ways:
        wset = set((round(p[0], 5), round(p[1], 5)) for p in w["pts"])
        n_hit = sum(1 for p in pts if (round(p[0], 5), round(p[1], 5)) in wset)
        if n_hit >= 2:
            hits[w["src"]] += n_hit
    print("%s: %s→%s 全网路径借用：%s"
          % (lid, a, b, ", ".join("%s×%d" % kv for kv in hits.most_common())))
