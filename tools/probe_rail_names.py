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
import hashlib
import json
import os
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PBF_PATH = os.path.join(_ROOT, "build-cache", "china-latest.osm.pbf")
# pyosmium 的 C++ 层无法打开含中文的路径；项目路径含中文时改用 ASCII junction。
if not os.path.exists(PBF_PATH) or any(ord(c) > 127 for c in PBF_PATH):
    PBF_PATH = "D:\\osm-pbf-cache\\china-latest.osm.pbf"


def _pbf_sha256():
    h = hashlib.sha256()
    with open(PBF_PATH, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def _dump_is_fresh(out_path, sha):
    if not os.path.exists(out_path):
        return False
    try:
        with open(out_path, "r", encoding="utf-8") as f:
            return json.load(f).get("sha256") == sha
    except Exception:
        return False


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--keywords", default="")
    parser.add_argument("--all-rail", action="store_true")
    parser.add_argument("--bbox", default="",
                        help="lon1,lat1,lon2,lat2：仅统计该范围内（按 way 首点）的命名 way")
    parser.add_argument("--dump", default="",
                        help="把全部命名 railway=rail 的 name→规模/外接框 与全部命名 "
                             "station|halt 节点写进该 JSON（按 PBF sha256 复用，不入库）")
    parser.add_argument("--force", action="store_true", help="忽略缓存重新扫描")
    args = parser.parse_args()
    keywords = [k for k in args.keywords.split(",") if k]
    bbox = None
    if args.bbox:
        bbox = tuple(float(x) for x in args.bbox.split(","))

    import osmium

    dumping = bool(args.dump)
    sha = _pbf_sha256() if dumping else None
    if dumping and not args.force and _dump_is_fresh(args.dump, sha):
        print("缓存命中，跳过扫描：%s（sha256 %s…）" % (args.dump, sha[:12]))
        return

    counter = collections.Counter()
    pts_counter = collections.Counter()
    boxes = {}
    stations = []

    class WayHandler(osmium.SimpleHandler):
        def node(self, n):
            if not dumping:
                return
            tags = n.tags
            if tags.get("railway") not in ("station", "halt"):
                return
            name = tags.get("name")
            if not name:
                return
            if any(tags.get(k) in ("subway", "light_rail", "monorail", "tram")
                   for k in ("railway", "station")):
                return
            stations.append({"name": name, "lon": round(n.location.lon, 6),
                             "lat": round(n.location.lat, 6)})

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
            if dumping:
                box = boxes.get(name)
                for nd in w.nodes:
                    lon, lat = nd.location.lon, nd.location.lat
                    if box is None:
                        box = [lon, lat, lon, lat]
                    else:
                        box[0] = min(box[0], lon)
                        box[1] = min(box[1], lat)
                        box[2] = max(box[2], lon)
                        box[3] = max(box[3], lat)
                boxes[name] = box

    print("扫描 PBF（locations=%s）：%s"
          % ("flex_mem" if (bbox or dumping) else "False", PBF_PATH))
    WayHandler().apply_file(PBF_PATH, locations=bool(bbox) or dumping, idx="flex_mem")
    if dumping:
        payload = {
            "provider": "OpenStreetMap (Geofabrik China)",
            "attribution": "© OpenStreetMap contributors · ODbL",
            "sha256": sha,
            "pbf": os.path.basename(PBF_PATH),
            "way_names": {n: {"ways": counter[n], "points": pts_counter[n],
                               "bbox": [round(v, 6) for v in boxes.get(n, [0, 0, 0, 0])]}
                          for n in counter},
            "stations": stations,
        }
        outdir = os.path.dirname(os.path.abspath(args.dump))
        if not os.path.isdir(outdir):
            os.makedirs(outdir)
        fd, tmp = tempfile.mkstemp(dir=outdir, suffix=".tmp")
        os.close(fd)
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False)
        os.replace(tmp, args.dump)
        print("已写 %s：%d 个命名走廊、%d 个命名站（sha256 %s…）"
              % (args.dump, len(counter), len(stations), sha[:12]))
        return
    print("共 %d 个命名 railway=rail 线路名" % len(counter))
    for name, count in counter.most_common():
        print("%6d ways %9d pts  %s" % (count, pts_counter[name], name))


if __name__ == "__main__":
    main()
