# -*- coding: utf-8 -*-
"""从 Geofabrik China OSM PBF 提取铁路 way 与客运站节点。

- ways：railway=rail 且 name 命中线路清单白名单的 way（含 geometry 顶点）；
- stations：railway=station|halt 且有 name 的节点（候选站坐标源）。

PBF 一次扫描，结果缓存为 build-cache/rail-extract.json（不入库）。
pyosmium 的 C++ 层无法打开含中文路径，项目路径含中文时自动改走
ASCII junction（D:\\osm-pbf-cache）。
"""

import hashlib
import json
import os
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CACHE_DIR = os.path.join(ROOT, "build-cache")
CACHE_PATH = os.path.join(CACHE_DIR, "rail-extract.json")

PBF_PROJECT = os.path.join(CACHE_DIR, "china-latest.osm.pbf")
PBF_ASCII = "D:\\osm-pbf-cache\\china-latest.osm.pbf"


def pbf_path():
    if os.path.exists(PBF_ASCII):
        return PBF_ASCII
    if os.path.exists(PBF_PROJECT):
        p = PBF_PROJECT
        # 中文路径 C++ fopen 打不开，优先 ASCII junction。
        if all(ord(c) < 128 for c in p):
            return p
        raise SystemExit("PBF 路径含中文且 ASCII junction 不存在，"
                         "请先执行：New-Item -ItemType Junction -Path D:\\osm-pbf-cache "
                         "-Target <项目>\\build-cache")
    raise SystemExit("缺少 PBF：%s（先下载 Geofabrik China OSM PBF）" % PBF_PROJECT)


def pbf_meta():
    """返回 (快照日期, sha256, 字节数)；sha256 缓存在同名 .sha256。"""
    p = pbf_path()
    size = os.path.getsize(p)
    sha_file = p + ".sha256"
    if os.path.exists(sha_file):
        text = open(sha_file).read().split()
        sha = text[0] if text else ""
    else:
        sha = ""
    # Geofabrik 文件名 fixed：china-latest.osm.pbf 的修改日期即快照日。
    mtime = os.path.getmtime(p)
    import datetime
    snapshot = datetime.datetime.fromtimestamp(mtime).strftime("%Y-%m-%d")
    return {"snapshotDate": snapshot, "sha256": sha, "bytes": size, "path": p}


def extract(ways_spec, force=False):
    """按 {osm_name: bbox|None|[bbox,...]} 白名单提取铁路 way 并收集客运站。

    bbox = (lon1, lat1, lon2, lat2) 时仅保留顶点落入该范围的 way
    （枢纽普速线只取站区段，防止普速走廊进入合并图）；
    值为 bbox 列表时命中任一 bbox 即保留（枢纽 unnamed 分区提取）。
    特殊键 "__unnamed__" 匹配无 name 的 railway=rail way（枢纽站内
    渡线/道岔区常无名，是枢纽分量缺口的桥接段）。
    返回 {"ways": {name: [{"id","pts"}]}, "stations": [{"name","coord"}]}。
    """
    UNNAMED = "__unnamed__"

    def _norm_bbox_group(b):
        if b is None:
            return None
        if b and isinstance(b[0], (list, tuple)):
            return [list(x) for x in b]
        return [list(b)]

    spec = {n: _norm_bbox_group(b) for n, b in dict(ways_spec).items()}
    meta = pbf_meta()
    key_payload = sorted(
        ((n, b) for n, b in spec.items()),
        key=lambda kv: kv[0])
    key = hashlib.sha1(
        json.dumps(key_payload, ensure_ascii=False).encode("utf-8") +
        meta.get("sha256", "").encode("utf-8") +
        b"v4-bbox").hexdigest()[:16]
    cache = os.path.join(CACHE_DIR, "rail-extract-%s.json" % key)
    if os.path.exists(cache) and not force:
        print("使用提取缓存：%s" % cache)
        return json.load(open(cache, encoding="utf-8"))

    import osmium

    ways = {}
    stations = []

    class Handler(osmium.SimpleHandler):
        def way(self, w):
            tags = w.tags
            if tags.get("railway") != "rail":
                return
            name = tags.get("name")
            if name is None:
                if UNNAMED not in spec:
                    return
                name = UNNAMED
            if name not in spec:
                return
            pts = [(n.location.lon, n.location.lat) for n in w.nodes
                   if n.location.valid()]
            if len(pts) < 2:
                return
            bbs = spec[name]
            if bbs and not any(bb[0] <= x <= bb[2] and bb[1] <= y <= bb[3]
                               for bb in bbs for x, y in pts):
                return
            ways.setdefault(name, []).append(
                {"id": w.id, "pts": [[round(x, 6), round(y, 6)] for x, y in pts]})

        def node(self, n):
            tags = n.tags
            if tags.get("railway") not in ("station", "halt"):
                return
            # 排除地铁/轻轨/有轨电车站（OSM 中同样是 railway=station）。
            if tags.get("station") in ("subway", "light_rail", "monorail"):
                return
            if tags.get("subway") == "yes":
                return
            name = tags.get("name")
            if not name or not n.location.valid():
                return
            stations.append({
                "name": name,
                "coord": [round(n.location.lon, 6), round(n.location.lat, 6)],
            })

    print("扫描 PBF 提取铁路 way（%d 个线路名）..." % len(spec))
    Handler().apply_file(meta["path"], locations=True, idx="flex_mem")

    payload = {"ways": ways, "stations": stations, "meta": {
        "snapshotDate": meta["snapshotDate"], "sha256": meta["sha256"],
        "bytes": meta["bytes"]}}
    os.makedirs(CACHE_DIR, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=CACHE_DIR, suffix=".tmp")
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False)
    os.replace(tmp, cache)
    total = sum(len(v) for v in ways.values())
    print("提取完成：%d ways / %d stations，缓存 %s"
          % (total, len(stations), os.path.basename(cache)))
    return payload
