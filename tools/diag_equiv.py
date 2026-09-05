# -*- coding: utf-8 -*-
"""宁蓉 14 区段等价迁移验证：折线逐点相等 + estLengthKm 相等。"""
import json
import re
import sys

sys.path.insert(0, r"D:\Projects\火车乘车记录\tools")
from rail_network.legacy_ningrong import LEGACY_DATA

PROD = r"D:\Projects\火车乘车记录\js\rail-route-data.js"

text = open(PROD, encoding="utf-8").read()
data = json.loads(re.search(r"var RAIL_ROUTE_DATA = (\{.*\});\s*root\.", text, re.S).group(1))

# id -> 条目列表（重复 id 直接报错，validate 也应拦住）
by_id = {}
for s in data["segments"]:
    by_id.setdefault(s["id"], []).append(s)

dup = {k: len(v) for k, v in by_id.items() if len(v) > 1}
if dup:
    print("!! 产物区段 id 重复:", dup)
    sys.exit(1)

ok, bad = 0, 0
for seg in LEGACY_DATA["segments"]:
    hit = by_id.get(seg["id"])
    if hit is None:
        print("缺失: %s（产物无此 id）" % seg["id"])
        bad += 1
        continue
    s = hit[0]
    if (s["from"], s["to"]) != (seg["from"], seg["to"]):
        print("端点不符: %s prod=%s/%s legacy=%s/%s"
              % (seg["id"], s["from"], s["to"], seg["from"], seg["to"]))
        bad += 1
        continue
    same_pts = s["polyline"] == seg["polyline"]
    same_km = abs(s["estLengthKm"] - seg["estLengthKm"]) < 1e-9
    if same_pts and same_km:
        ok += 1
    else:
        print("不等价: %s same_pts=%s same_km=%s km %s vs %s"
              % (seg["id"], same_pts, same_km, s["estLengthKm"], seg["estLengthKm"]))
        bad += 1

print("legacy %d 区段等价验证: %d OK / %d 不等价"
      % (len(LEGACY_DATA["segments"]), ok, bad))

# legacy 节点完整性
prod_nodes = {n["id"] for n in data["nodes"]}
missing = [n["id"] for n in LEGACY_DATA["nodes"] if n["id"] not in prod_nodes]
print("产物节点 %d 个；legacy 节点缺失: %s"
      % (len(data["nodes"]), missing or "无"))
sys.exit(1 if bad else 0)
