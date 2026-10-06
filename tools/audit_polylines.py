#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""折线体检：区段折线的每一段"长边"是不是真的压在轨道上。

产物里的折线是 dp_simplify 抽稀过的，相邻顶点之间用直线连。绝大多数连线就是
沿 way 走的，但如果某个站被挂到了走廊外（或寻径选了一根通往远处 way 端点的
直线外呼），折线里就会出现一条几百米到几公里的"飞行段"——图上是一根离开铁路
的直斜线，里程还白算。判据不看形状像不像，直接问几何：**沿这条长边每 200m
取样，到最近 OSM 轨道 line 的距离** 必须贴着走廊。

    python tools/audit_polylines.py                 # 最差名单
    python tools/audit_polylines.py --json out.json # 全量落盘
    python tools/audit_polylines.py --tol 0.05      # 收紧容差（km）
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
    LINES, UNNAMED_ZONES, extract_wanted,
)

ARTIFACT = os.path.join(ROOT, "js", "rail-route-data.js")
# 长边阈值（km）：短边抽稀误差本来就在这个量级，枢纽补桥也 ≤450m。
EDGE_MIN_KM = 0.5
STEP_KM = 0.2
# 虚拟桥接段（UNNAMED_ZONES / gap_bridges 内）允许离开 OSM 实线
BRIDGE_GAP_KM = 0.5


def load_artifact(path):
    text = open(path, encoding="utf-8").read()
    start = text.index("{", text.index("RAIL_ROUTE_DATA"))
    return json.JSONDecoder().raw_decode(text[start:])[0]


def hav(a, b):
    k = math.cos(math.radians((a[1] + b[1]) / 2.0)) * 111.32
    return math.hypot((b[0] - a[0]) * k, (b[1] - a[1]) * 111.32)


class TrackIndex:
    """OSM 轨道 line 的空间网格索引，答"这个点离最近的轨道有多远"。"""

    def __init__(self, ways, cell=0.02):
        self.cell = cell
        self.grid = {}
        self.segs = []
        for w in ways:
            pts = w["pts"]
            for i in range(len(pts) - 1):
                a, b = pts[i], pts[i + 1]
                if hav(a, b) < 1e-4:
                    continue
                idx = len(self.segs)
                self.segs.append((a, b))
                for gx in range(int(min(a[0], b[0]) // self.cell),
                                int(max(a[0], b[0]) // self.cell) + 1):
                    for gy in range(int(min(a[1], b[1]) // self.cell),
                                    int(max(a[1], b[1]) // self.cell) + 1):
                        self.grid.setdefault((gx, gy), []).append(idx)

    def _keys(self, pt, pad):
        gx = int(pt[0] // self.cell)
        gy = int(pt[1] // self.cell)
        for dx in range(-pad, pad + 1):
            for dy in range(-pad, pad + 1):
                yield (gx + dx, gy + dy)

    def nearest_km(self, pt, pad=1):
        best = None
        for k in self._keys(pt, pad):
            for si in self.grid.get(k, ()):
                a, b = self.segs[si]
                d = _point_seg_km(pt, a, b)
                if best is None or d < best:
                    best = d
        return best if best is not None else 99.0


def _point_seg_km(p, a, b):
    """点到线段的距离（km，局部平面近似）。"""
    k = math.cos(math.radians(p[1])) * 111.32
    ax, ay = (a[0] - p[0]) * k, (a[1] - p[1]) * 111.32
    bx, by = (b[0] - p[0]) * k, (b[1] - p[1]) * 111.32
    dx, dy = bx - ax, by - ay
    seg2 = dx * dx + dy * dy
    if seg2 <= 1e-12:
        return math.hypot(ax, ay)
    t = max(0.0, min(1.0, -(ax * dx + ay * dy) / seg2))
    return math.hypot(ax + t * dx, ay + t * dy)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--artifact", default=ARTIFACT)
    ap.add_argument("--tol", type=float, default=0.12,
                    help="折线离最近轨道的允许距离（km）")
    ap.add_argument("--json", default="")
    ap.add_argument("--limit", type=int, default=40)
    args = ap.parse_args()

    art = load_artifact(args.artifact)
    payload = extract_mod.extract(extract_wanted(LINES))
    ways = [w for ws in payload["ways"].values() for w in ws]
    track = TrackIndex(ways)
    name = {n["id"]: n["name"] for n in art["nodes"]}
    zone_boxes = [list(b) for b in UNNAMED_ZONES]
    for ln in LINES:
        zone_boxes += [list(b) for b in (ln.get("gap_bridges") or [])]

    def in_bridge(pt):
        return any(b[0] <= pt[0] <= b[2] and b[1] <= pt[1] <= b[3]
                   for b in zone_boxes)

    rows, edges_total = [], 0
    for seg in art["segments"]:
        pts = seg["polyline"]
        worst_edge, worst_d, worst_at = None, 0.0, None
        for a, b in zip(pts, pts[1:]):
            L = hav(a, b)
            if L < EDGE_MIN_KM:
                continue
            edges_total += 1
            n = max(2, int(L / STEP_KM) + 1)
            for i in range(1, n):
                t = i / float(n)
                p = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
                if in_bridge(p):
                    continue
                d = track.nearest_km(p)
                if d > worst_d:
                    worst_d, worst_edge, worst_at = d, (a, b), list(p)
        if worst_edge and worst_d > args.tol:
            rows.append({"from": name[seg["from"]], "to": name[seg["to"]],
                         "id": seg["id"], "lines": seg["lineIds"],
                         "km": round(worst_d, 3),
                         "edge_km": round(hav(*worst_edge), 2),
                         "at": [round(x, 5) for x in worst_at],
                         "seg_km": seg["estLengthKm"]})
    rows.sort(key=lambda r: -r["km"])
    print("检查 %d 区段（长边 %d 条，容差 %.0fm）：脱轨 %d 段"
          % (len(art["segments"]), edges_total, args.tol * 1000, len(rows)))
    for r in rows[:args.limit]:
        print("  %-14s %-22s 离轨道 %.2fkm  该边长 %.2fkm  @%s  %s"
              % ("+".join(r["lines"]), (r["from"] + "—" + r["to"]),
                 r["km"], r["edge_km"], r["at"], r["id"]))
    if args.json:
        json.dump(rows, open(args.json, "w", encoding="utf-8"),
                  ensure_ascii=False, indent=1)
        print("已写出 %s" % args.json)


if __name__ == "__main__":
    main()
