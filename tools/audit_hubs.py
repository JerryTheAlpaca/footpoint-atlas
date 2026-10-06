#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""枢纽体检：节点在网络里是不是真的接得住车。

四类检查（都不看形状像不像，只看"车真能这么走吗"）：
1. 断头点：区段度数为 1 的节点。线路自己的起终点断头是正常的，中途站断头
   说明这条线到此为止没有通路（列车开进去出不来）。
2. 本线不连通：一条线的区段图分成几个分量＝站序里相邻两站之间其实没有通路，
   构建期会失败，但借用别的线补上的段可能让它"看起来连通"，这里按线复核。
3. 假换乘：一个节点同时属于多条线，但坐标只落在其中一条的走廊上——另一条线
   的车到站必须先离开正线拐过去（走廊垂距见 audit_coords.py）。
4. 近距双名节点：两座不同名节点相距 <300m，通常是同一站场被拆成两个点
   （更名站、上下场），会让寻径在两点间"瞬移"。

    python tools/audit_hubs.py [--artifact 路径] [--json 输出]
"""

import argparse
import json
import math
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))

from rail_network.lines import LINES  # noqa: E402

ARTIFACT = os.path.join(ROOT, "js", "rail-route-data.js")


def load_artifact(path):
    text = open(path, encoding="utf-8").read()
    start = text.index("{", text.index("RAIL_ROUTE_DATA"))
    return json.JSONDecoder().raw_decode(text[start:])[0]


def hav(a, b):
    k = math.cos(math.radians((a[1] + b[1]) / 2.0)) * 111.32
    return math.hypot((b[0] - a[0]) * k, (b[1] - a[1]) * 111.32)


def components(pairs):
    parent = {}

    def find(x):
        parent.setdefault(x, x)
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    for a, b in pairs:
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb
    groups = {}
    for x in list(parent):
        groups.setdefault(find(x), []).append(x)
    return groups


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--artifact", default=ARTIFACT)
    ap.add_argument("--json", default="")
    args = ap.parse_args()
    art = load_artifact(args.artifact)
    nodes = {n["id"]: n for n in art["nodes"]}
    line_name = {l["id"]: l["name"] for l in art["lines"]}
    declared = {l["id"]: set(l["stations"]) for l in LINES}
    ends_by_name = {l["id"]: {l["from"], l["to"]} for l in LINES}

    deg = {}
    by_line = {}
    adj = {}
    for s in art["segments"]:
        for end in (s["from"], s["to"]):
            deg[end] = deg.get(end, 0) + 1
            adj.setdefault(end, set()).add(s["from"] if end == s["to"] else s["to"])
        for lid in s["lineIds"]:
            by_line.setdefault(lid, []).append((s["from"], s["to"]))

    # 1) 断头点
    stubs = []
    for nid, d in sorted(deg.items(), key=lambda kv: kv[1]):
        if d != 1:
            continue
        lids = sorted(l for l, ps in by_line.items() if any(nid in p for p in ps))
        # 线路自己的起终点断头是正常的（清单里就没往下画）
        is_end = any(nodes[nid]["name"] in ends_by_name.get(l, ()) for l in lids)
        stubs.append({"id": nid, "name": nodes[nid]["name"],
                      "kind": nodes[nid]["kind"], "lines": lids,
                      "line_end": is_end})
    mid_stubs = [s for s in stubs if not s["line_end"]]

    # 2) 本线不连通
    split = []
    for lid, pairs in by_line.items():
        comps = components(pairs)
        if len(comps) > 1:
            sizes = sorted((len(v) for v in comps.values()), reverse=True)
            split.append({"line": lid, "name": line_name.get(lid, lid),
                          "components": len(comps), "sizes": sizes,
                          "isolated": sorted(
                              nodes[n]["name"] for v in comps.values()
                              if len(v) < sizes[0] for n in v)[:12]})

    # 3) 假换乘：节点被多条线共用，但只有部分线的站序声明了它
    multi = []
    node_lines = {}
    for lid, ps in by_line.items():
        for p in ps:
            for nid in p:
                node_lines.setdefault(nid, set()).add(lid)
    for nid, lids in sorted(node_lines.items(), key=lambda kv: -len(kv[1])):
        if len(lids) < 2:
            continue
        silent = [l for l in lids if nodes[nid]["name"] not in declared.get(l, set())]
        if silent:
            multi.append({"name": nodes[nid]["name"], "id": nid,
                          "lines": sorted(lids),
                          "not_declared": sorted(line_name.get(l, l) for l in silent)})

    # 4) 近距双名节点
    near = []
    items = [(n["id"], n["name"], n["coord"]) for n in art["nodes"]]
    items.sort(key=lambda x: x[2][1])
    for i, (a, an, ac) in enumerate(items):
        for b, bn, bc in items[i + 1:i + 60]:
            if abs(bc[1] - ac[1]) > 0.004:
                continue
            d = hav(ac, bc)
            if 0.0005 < d < 0.3:
                near.append({"a": an, "b": bn, "km": round(d, 3),
                             "lines_a": sorted(node_lines.get(a, [])),
                             "lines_b": sorted(node_lines.get(b, []))})
    near.sort(key=lambda r: r["km"])

    print("节点 %d / 区段 %d / 线 %d" % (len(nodes), len(art["segments"]), len(by_line)))
    print("\n== 1. 中途断头点 %d 个（线端点断头 %d 个属正常）=="
          % (len(mid_stubs), len(stubs) - len(mid_stubs)))
    for s in mid_stubs[:30]:
        print("  %-10s %-6s %s" % (s["name"], s["kind"], ",".join(s["lines"])))
    print("\n== 2. 本线区段图分裂 %d 条线 ==" % len(split))
    for r in sorted(split, key=lambda x: -x["components"])[:20]:
        print("  %-24s %d 分量 %s  小分量：%s"
              % (r["line"], r["components"], r["sizes"], "、".join(r["isolated"])))
    print("\n== 3. 多线共用但有的线没声明这个站 %d 个 ==" % len(multi))
    for r in multi[:20]:
        print("  %-12s 共用 %d 条线，未声明：%s"
              % (r["name"], len(r["lines"]), "、".join(r["not_declared"])))
    print("\n== 4. <300m 的双名节点对 %d 组 ==" % len(near))
    for r in near[:30]:
        print("  %s ↔ %s  %.0fm  %s | %s"
              % (r["a"], r["b"], r["km"] * 1000,
                 ",".join(r["lines_a"]), ",".join(r["lines_b"])))

    if args.json:
        json.dump({"mid_stubs": mid_stubs, "split_lines": split,
                   "undeclared_shared": multi, "near_pairs": near},
                  open(args.json, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print("\n已写出 %s" % args.json)


if __name__ == "__main__":
    main()
