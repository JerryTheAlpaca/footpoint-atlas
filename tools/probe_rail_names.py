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


def _atomic_write_json(out_path, payload):
    outdir = os.path.dirname(os.path.abspath(out_path))
    if not os.path.isdir(outdir):
        os.makedirs(outdir)
    fd, tmp = tempfile.mkstemp(dir=outdir, suffix=".tmp")
    os.close(fd)
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False)
    os.replace(tmp, out_path)


def run_pts(plan_path, out_path, force):
    """按"枢纽邻域框"收集命名 railway=rail way 的顶点，写 name→[{pts,whole}]。

    只收顶点落进任一框的那些 way，但**存整条 way**（不是框内那一段）：
    线路所就是走廊端点相接的地方，把 way 剪断就把"道岔尖"这个判据剪掉了。
    超过 MAX_WAY_PTS 的超长 way 只存框内段并标 whole=false，落位工具就不拿它的
    端点当线索。这份缓存**只给 tools/llt_junctions.py 用**，不进构建提取白名单
    （所以不可能动到已验收的产物几何），扫一次能用很久，改探针框只要重扫一次
    而不用重建产物。顶点精度与 build 的提取缓存一致（round 6），两边才能按
    同一个坐标判"共用顶点"。
    """
    plan = json.load(open(plan_path, encoding="utf-8"))
    plan = plan.get("boxes", plan)      # 允许直接给 {name: [bbox,…]}
    if not plan:
        raise SystemExit("探针计划是空的：%s —— 先跑 tools/llt_junctions.py "
                         "--emit-probe，别拿空计划覆盖已有的顶点缓存" % plan_path)
    boxes = [b for bs in plan.values() for b in bs]
    MAX_WAY_PTS = 3000
    sha = _pbf_sha256()
    key = hashlib.sha1(
        (sha + "|" + json.dumps(sorted(plan.items()), ensure_ascii=False,
                                sort_keys=True)).encode("utf-8")).hexdigest()
    if os.path.exists(out_path) and not force:
        try:
            if json.load(open(out_path, encoding="utf-8")).get("key") == key:
                print("缓存命中，跳过扫描：%s" % out_path)
                return
        except Exception:
            pass

    import osmium

    got = {}

    def near(p):
        return any(b[0] <= p[0] <= b[2] and b[1] <= p[1] <= b[3] for b in boxes)

    class Handler(osmium.SimpleHandler):
        def way(self, w):
            tags = w.tags
            if tags.get("railway") != "rail":
                return
            name = tags.get("name")
            if not name:
                return
            pts = [(round(n.location.lon, 6), round(n.location.lat, 6))
                   for n in w.nodes]
            if not any(near(p) for p in pts):
                return
            whole = len(pts) <= MAX_WAY_PTS
            got.setdefault(name, []).append(
                {"pts": pts if whole else [p for p in pts if near(p)],
                 "whole": whole})

    print("扫描 PBF（探针顶点：%d 个名字 / %d 个框）：%s"
          % (len(plan), len(boxes), PBF_PATH))
    Handler().apply_file(PBF_PATH, locations=True, idx="flex_mem")
    _atomic_write_json(out_path, {
        "provider": "OpenStreetMap (Geofabrik China)",
        "attribution": "© OpenStreetMap contributors · ODbL",
        "sha256": sha, "key": key, "plan": os.path.basename(plan_path),
        "ways": {n: ws for n, ws in sorted(got.items())},
    })
    print("已写 %s：%d 个命名走廊、%d 条 way 邻域顶点"
          % (out_path, len(got), sum(len(v) for v in got.values())))


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
    parser.add_argument("--pts-plan", default="",
                        help="JSON {走廊名: [[lon1,lat1,lon2,lat2],…]}：只收这些"
                             "枢纽邻域内的命名 way 顶点（线路所落位用）")
    parser.add_argument("--pts-out", default="",
                        help="顶点输出路径，形如 {name: [[lon,lat],…]}（不入库）")
    args = parser.parse_args()
    if args.pts_plan and args.pts_out:
        run_pts(args.pts_plan, args.pts_out, args.force)
        return
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
        _atomic_write_json(args.dump, payload)
        print("已写 %s：%d 个命名走廊、%d 个命名站（sha256 %s…）"
              % (args.dump, len(counter), len(stations), sha[:12]))
        return
    print("共 %d 个命名 railway=rail 线路名" % len(counter))
    for name, count in counter.most_common():
        print("%6d ways %9d pts  %s" % (count, pts_counter[name], name))


if __name__ == "__main__":
    main()
