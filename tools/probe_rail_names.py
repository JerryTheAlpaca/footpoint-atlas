#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""从 China OSM PBF 中探测铁路 way 的 name 分布，辅助确认线路清单命名。

用法：
    python tools/probe_rail_names.py [--keywords 京沪,京广] [--all-rail]

默认列出 name 含任一关键词的 way 数量与坐标点规模；
--all-rail 列出全部 railway=rail 命名 way 的 name 及数量（用于全面核对）。
"""

import argparse
import collections
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PBF_PATH = os.path.join(_ROOT, "build-cache", "china-latest.osm.pbf")
# pyosmium 的 C++ 层无法打开含中文的路径；项目路径含中文时改用 ASCII junction。
if not os.path.exists(PBF_PATH) or any(ord(c) > 127 for c in PBF_PATH):
    PBF_PATH = "D:\\osm-pbf-cache\\china-latest.osm.pbf"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--keywords", default="")
    parser.add_argument("--all-rail", action="store_true")
    parser.add_argument("--bbox", default="",
                        help="lon1,lat1,lon2,lat2：仅统计该范围内（按 way 首点）的命名 way")
    args = parser.parse_args()
    keywords = [k for k in args.keywords.split(",") if k]
    bbox = None
    if args.bbox:
        bbox = tuple(float(x) for x in args.bbox.split(","))

    import osmium

    counter = collections.Counter()
    pts_counter = collections.Counter()

    class WayHandler(osmium.SimpleHandler):
        def way(self, w):
            tags = w.tags
            if tags.get("railway") != "rail":
                return
            name = tags.get("name")
            if not name:
                return
            if keywords and not any(k in name for k in keywords):
                return
            if bbox:
                try:
                    first = w.nodes[0].location
                except Exception:
                    return
                if not (bbox[0] <= first.lon <= bbox[2] and bbox[1] <= first.lat <= bbox[3]):
                    return
            counter[name] += 1
            pts_counter[name] += len(w.nodes)

    print("扫描 PBF（locations=%s）：%s" % ("flex_mem" if bbox else "False", PBF_PATH))
    WayHandler().apply_file(PBF_PATH, locations=bool(bbox), idx="flex_mem")
    if not keywords:
        print("共 %d 个命名 railway=rail 线路名" % len(counter))
    for name, count in counter.most_common():
        print("%6d ways %9d pts  %s" % (count, pts_counter[name], name))


if __name__ == "__main__":
    main()
