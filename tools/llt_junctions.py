#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""给落不了位的线路所算候选坐标（阶段 2，只出候选，不写 lines.py）。

线路所的定义就是两条走廊的交点，而 OSM 基本不给它站节点（实测我们需要的 66
个所里只有 19 个有 OSM 同名节点）。所以坐标从**几何证据**来：这个所的两条
邻接线路（①层里都含它的条目）各自的 OSM way 顶点集，取共用顶点；没有严格
共用顶点就取最近端点对（阈值内），这正是手工找 hh-junction(OSM switch 节点
9685733573)、xd-keche-junction(两侧顶点相距 23m) 用的同一个判据，只是自动化。

判据不满足就**放弃**，不做"离 1.1km 就近挪一个"那种事 —— 那正是尖角与
同名抢占的来源。产物一律不写，清单落在 gitignored 的 build-cache/，由人
确认后手工进 lines.py。

用法：python tools/llt_junctions.py [--near 60] [--only 巴河所,肖马杨所]
"""

import argparse
import glob
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))

from rail_network import llt as llt_mod  # noqa: E402
from rail_network.build import norm_name  # noqa: E402
from rail_network.lines import LINES  # noqa: E402

CACHE_DIR = os.path.join(ROOT, "build-cache")
FEASIBILITY = os.path.join(CACHE_DIR, "llt-feasibility.json")
OUT_TXT = os.path.join(CACHE_DIR, "_junction_candidates.txt")
OUT_JSON = os.path.join(CACHE_DIR, "llt-junction-candidates.json")


def newest_extract_cache():
    files = [f for f in glob.glob(os.path.join(CACHE_DIR, "rail-extract-*.json"))]
    if not files:
        raise SystemExit("没有 build-cache/rail-extract-*.json，先跑一次构建生成提取缓存")
    for f in sorted(files, key=os.path.getmtime, reverse=True):
        try:
            with open(f, encoding="utf-8") as h:
                data = json.load(h)
        except Exception:
            continue
        if data.get("ways"):
            return f, data
    raise SystemExit("提取缓存里没有 ways")


def load_js_object(path, marker):
    text = open(path, encoding="utf-8").read()
    start = text.index("{", text.index(marker))
    return json.JSONDecoder().raw_decode(text[start:])[0]


def km_between(a, b):
    import math
    dlon = (a[0] - b[0]) * math.cos(math.radians((a[1] + b[1]) / 2))
    dlat = a[1] - b[1]
    return math.hypot(dlon, dlat) * 111.32


def owner_geometry(llt_obj, feas, name):
    """①层条目 → 可用的 OSM way 名集合（线名本身，或映射到我们线的 osm_names）。"""
    by = {r["line"]: r for r in feas["lines"]}
    r = by.get(name)
    if not r:
        return []
    if r["geometry"] == "osm_name":
        return [name]
    m = r["geometry"]
    if m.startswith("our_osm_names:"):
        return [x for x in m.split(":", 1)[1].split(",") if x]
    return []


def cluster(points, radius_km=0.25):
    """把候选顶点按就近成簇；返回每簇 (中心, 成员数)。"""
    clusters = []
    for p in points:
        hit = None
        for i, c in enumerate(clusters):
            if km_between(p, c[0]) <= radius_km:
                hit = i
                break
        if hit is None:
            clusters.append([p, 1])
        else:
            c = clusters[hit]
            n = c[1] + 1
            c[0] = [(c[0][0] * c[1] + p[0]) / n, (c[0][1] * c[1] + p[1]) / n]
            c[1] = n
    return clusters


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--near", type=float, default=0.06, help="无共用顶点时允许的端点对距离(km)")
    ap.add_argument("--only", default="", help="逗号分隔的所名，只算这些")
    args = ap.parse_args()

    llt_obj = llt_mod.load()
    feas = json.load(open(FEASIBILITY, encoding="utf-8"))
    cache_path, payload = newest_extract_cache()
    artifact = load_js_object(os.path.join(ROOT, "js", "rail-route-data.js"),
                              "var RAIL_ROUTE_DATA")
    have_nodes = {norm_name(n["name"]) for n in artifact["nodes"]}
    way_pts = {nm: [tuple(p) for w in ws for p in w["pts"]]
               for nm, ws in payload["ways"].items()}

    owners = {}
    for line in llt_obj.lines:
        for st in line["stations"]:
            if st["name"].endswith("所"):
                owners.setdefault(st["name"], set()).add(line["name"])

    legs = {r["line"] for r in feas["lines"] if r["in_legs"]}
    only = {x.strip() for x in args.only.split(",") if x.strip()}
    rows = []
    for suo, lines in sorted(owners.items()):
        if norm_name(suo) in have_nodes or norm_name(suo[:-1]) in have_nodes:
            continue                      # OSM 已有节点，不需要这里落位
        if only and suo not in only:
            continue
        geos = [(ln, owner_geometry(llt_obj, feas, ln)) for ln in sorted(lines)]
        usable = [(ln, g) for ln, g in geos if g and any(x in way_pts for x in g)]
        if len(usable) < 2:
            rows.append({"suo": suo, "owners": sorted(lines), "verdict": "no-partner",
                         "why": "邻接线里只有 %d 条有 OSM way 来源" % len(usable)})
            continue
        pts = {}
        for ln, gnames in usable[:2]:
            pts[ln] = {p for nm in gnames for p in way_pts.get(nm, [])}
        (a_name, a), (b_name, b) = list(pts.items())[:2]
        shared = a & b
        if shared:
            clusters = cluster([list(p) for p in shared])
            if len(clusters) > 1:
                rows.append({"suo": suo, "owners": [a_name, b_name], "verdict": "ambiguous",
                             "why": "共用顶点成 %d 簇，方向不明" % len(clusters),
                             "clusters": [[c[0], c[1]] for c in clusters]})
                continue
            coord, n = clusters[0]
            rows.append({"suo": suo, "owners": [a_name, b_name], "verdict": "shared-vertex",
                         "coord": [round(coord[0], 5), round(coord[1], 5)],
                         "evidence": "%d 个共用顶点" % n, "in_legs": bool(legs & {a_name, b_name})})
            continue
        best = min(((km_between(pa, pb), pa, pb) for pa in a for pb in b),
                   key=lambda x: x[0], default=None)
        if best and best[0] <= args.near:
            rows.append({"suo": suo, "owners": [a_name, b_name], "verdict": "near-endpoint",
                         "coord": [round(best[1][0], 5), round(best[1][1], 5)],
                         "evidence": "两侧顶点最近 %.0fm" % (best[0] * 1000),
                         "in_legs": bool(legs & {a_name, b_name})})
        else:
            rows.append({"suo": suo, "owners": [a_name, b_name], "verdict": "no-contact",
                         "why": "两走廊最近 %.0fm，超阈值" % ((best[0] if best else 9e9) * 1000)})

    ok = [r for r in rows if r["verdict"] in ("shared-vertex", "near-endpoint")]
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump({"provenance": {"extract": os.path.basename(cache_path),
                                  "llt": llt_obj.sha256, "near_km": args.near},
                   "candidates": rows}, f, ensure_ascii=False, indent=1)
    with open(OUT_TXT, "w", encoding="utf-8") as f:
        f.write("线路所候选落位（只出候选，不写 lines.py；数据版本 %s）\n" % llt_obj.data_version)
        f.write("无 OSM 站节点的所 %d 个：可按几何落位 %d，其余见原因\n\n" % (len(rows), len(ok)))
        for r in sorted(ok, key=lambda x: (not x.get("in_legs"), x["suo"])):
            f.write("%-10s %-14s  [%s] %s  ← %s + %s%s\n" % (
                r["suo"], r["verdict"], ",".join(r["owners"]),
                r["coord"], r["owners"][0], r["owners"][1],
                "  ⚑车次用到" if r.get("in_legs") else ""))
        f.write("\n--- 落不了的 ---\n")
        for r in rows:
            if r["verdict"] in ("shared-vertex", "near-endpoint"):
                continue
            f.write("%-10s %-14s %s  (%s)\n" % (
                r["suo"], r["verdict"], r.get("why", ""), "、".join(r["owners"])))
    print("所 %d 个候选，可落位 %d（其中车次用到 %d）"
          % (len(rows), len(ok), sum(1 for r in ok if r.get("in_legs"))))
    print("清单：%s 与 %s" % (OUT_TXT, OUT_JSON))
    for r in sorted(ok, key=lambda x: (not x.get("in_legs"), x["suo"]))[:14]:
        print("  %-10s %-14s %s  ← %s" % (r["suo"], r["verdict"], r["coord"],
                                          "+".join(r["owners"])))


if __name__ == "__main__":
    main()
