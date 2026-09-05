#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""查某线路 way 走廊在 bbox 内的顶点分布，辅助 station_hints 校准。

用法：python tools/corridor_pts.py <OSM线路名> <lon1,lat1,lon2,lat2>
"""

import json
import sys

payload = json.load(open("build-cache/rail-extract-08012db4f7a7970a.json",
                         encoding="utf-8"))
name = sys.argv[1]
box = [float(x) for x in sys.argv[2].split(",")]
ways = payload["ways"].get(name, [])
pts = [p for w in ways for p in w["pts"]
       if box[0] <= p[0] <= box[2] and box[1] <= p[1] <= box[3]]
pts.sort(key=lambda p: (p[0], p[1]))
step = max(1, len(pts) // 15)
print("%s 顶点 %d（bbox 内 %d）" % (name, sum(len(w["pts"]) for w in ways), len(pts)))
for p in pts[::step]:
    print("%.5f, %.5f" % (p[0], p[1]))
