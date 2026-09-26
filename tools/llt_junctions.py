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
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))

from rail_network import llt as llt_mod  # noqa: E402
from rail_network.build import norm_name  # noqa: E402
from rail_network.lines import LINES  # noqa: E402

from llt_feasibility import YARD_NOISE  # noqa: E402

# 站场级命名：这些 way 是到发线/走行线/渡线，不是"走廊"，不能当所的定位线索
# （YARD_NOISE 的 ^\d+道$ 有锚，接不住 千岛湖站1道 这种带站名前缀的）。
# 工业专用线也要挡：巴河所 曾被 阜黄黄黄段 的邻域框认成 西塞山电厂专用线，
# 名字看着像"一条线"，实际是电厂岔线，位置差 38 公里。
YARD_EXTRA = re.compile(
    r"\d+道$|走行|动车|渡线|客线|货线|安全线|整备场"
    r"|专用线|专用铁路|军用|观光|地铁|有轨")


def is_yard_noise(name):
    return bool(YARD_NOISE.search(name) or YARD_EXTRA.search(name))

CACHE_DIR = os.path.join(ROOT, "build-cache")
FEASIBILITY = os.path.join(CACHE_DIR, "llt-feasibility.json")
INVENTORY = os.path.join(CACHE_DIR, "osm-rail-inventory.json")
OUT_TXT = os.path.join(CACHE_DIR, "_junction_candidates.txt")
OUT_JSON = os.path.join(CACHE_DIR, "llt-junction-candidates.json")
# 探针计划（名字→枢纽邻域框）与按框扫来的顶点缓存：都在 build-cache，不入库。
PROBE_JSON = os.path.join(CACHE_DIR, "llt-junction-probe.json")
PTS_JSON = os.path.join(CACHE_DIR, "osm-rail-pts.json")
PTS_CMD = ("python tools/probe_rail_names.py --pts-plan %s --pts-out %s"
           % (os.path.relpath(PROBE_JSON, ROOT), os.path.relpath(PTS_JSON, ROOT)))
# 共用顶点多到这个量级就不是"交点"而是"共线带"，给不出所的位置。
COLLINEAR_VERTICES = 50
# 按几何认名时，一个所邻域最多接受多少条候选走廊进探针（控提取规模，非判据）。
PROBE_MAX_HITS = 16


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


def _write_json(path, payload):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=1)


def km_between(a, b):
    import math
    dlon = (a[0] - b[0]) * math.cos(math.radians((a[1] + b[1]) / 2))
    dlat = a[1] - b[1]
    return math.hypot(dlon, dlat) * 111.32


def padded(box, deg=0.03):
    """邻域框外扩一点：OSM 的 way 外接框常比所本身紧，等值判会漏。"""
    return [box[0] - deg, box[1] - deg, box[2] + deg, box[3] + deg]


def in_box(p, box):
    return box[0] <= p[0] <= box[2] and box[1] <= p[1] <= box[3]


def tight_names_at(box, inv_boxes, cache_names=None, max_span=0.5, inside=False):
    """所邻域小框落进哪些 OSM 走廊外接框（只认枢纽量级的小框，不认全国干线）。

    这是"按几何认名"：路路通的联络线名与 OSM 名系统性不同（京西联络线 在 OSM
    叫 京广高速京西联络线；阜黄黄黄段 在 OSM 根本没有这个名字），按名字或站集
    都接不上，但几何位置是唯一的。

    inside=True 时要求走廊外接框**整体落在**邻域框内 —— 探针用它来排除"只是
    擦过邻域边角"的远处走廊（武汉枢纽里相交判据一下能命中几百条站场线）。
    """
    hits = []
    for nm, wb in inv_boxes:
        if is_yard_noise(nm):         # 到发线/走行线不是走廊，不能用来定位所
            continue
        if wb[2] - wb[0] >= max_span or wb[3] - wb[1] >= max_span:
            continue
        if wb[0] > box[2] or wb[2] < box[0] or wb[1] > box[3] or wb[3] < box[1]:
            continue
        if inside and (wb[0] < box[0] or wb[2] > box[2]
                       or wb[1] < box[1] or wb[3] > box[3]):
            continue
        if cache_names is not None and nm not in cache_names:
            continue
        hits.append(nm)
    return sorted(hits)


def connector_by_geometry(suo, sidx, entry, cache_names, inv_boxes):
    """该所在这条①层条目里的邻域框 → 已提取走廊里名字对不上但位置对得上的那些。

    不要求"唯一命中"：一个所真正的位置判据是**它与邻接走廊共用顶点**，
    候选多几条只是让顶点集变大，最后仍由 shared/cluster/collinear 三道判据决定，
    而"必须唯一"会让 武石城际线 这种 11 条候选的所直接放弃。
    紧框判据（tight_names_at 的 max_span + inside）已经把长干线挡在外面。
    """
    box = neighbour_box_of(suo, entry, sidx)
    if not box:
        return []
    return tight_names_at(padded(box), inv_boxes, cache_names, inside=True)


def neighbour_box_of(suo, entry, sidx, pad=0.10):
    """该所在自己条目里的邻域框（只认唯一命名的邻居站）。"""
    seq = [s["name"] for s in entry["stations"]]
    i = next((k for k, n in enumerate(seq) if norm_name(n) == norm_name(suo)), None)
    if i is None:
        return None
    coords = []
    for n in seq[max(0, i - 2):i + 3]:
        if norm_name(n) == norm_name(suo):
            continue
        cands = sidx.get(norm_name(n), [])
        if len(cands) == 1:
            coords.append(cands[0])
    if not coords:
        return None
    lon = [c[0] for c in coords]
    lat = [c[1] for c in coords]
    return [min(lon) - pad, min(lat) - pad, max(lon) + pad, max(lat) + pad]


def owner_geometry(llt_obj, ours_stations, name, cache_names):
    """①层条目 → 可提取的 OSM way 名。

    两条来源，都只认**已在提取缓存里**的名字（拿不到几何就判不可落位，
    不去猜）：① 条目名本身就是 OSM way 名；② 按站集重叠映射到我们的线路，
    用该线路 lines.py 里的 osm_names。
    第二路必须现算，不能拿可行性报告里的 geometry 字符串 —— 那份报告的映射
    口径改过（要求双向覆盖），拿旧字符串会把 武冈城际线/阜黄黄黄段 这类
    明明有几何的来源误判成"无来源"。
    """
    if name in cache_names:
        return [name]
    entry = llt_obj.by_name.get(name)
    if not entry:
        return []
    plain = {norm_name(s["name"]) for s in entry["stations"]
             if not s["name"].endswith("所")}
    if not plain:
        return []
    best, best_score = None, 0.0
    for lid, mine in ours_stations.items():
        inter = len(plain & mine)
        if inter < 2:
            continue
        score = min(inter / len(plain), inter / len(mine))
        if score > best_score:
            best, best_score = lid, score
    if best is None or best_score < 0.5:
        return []
    src = next((l["osm_names"] for l in LINES if l["id"] == best), [])
    return [x for x in src if x in cache_names]


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


def probe_plan(llt_obj, ours_stations, cache_names, inv, sidx, artifact, legs):
    """列出"补上提取就能落位"的所，以及需要提取的走廊名 + 紧贴枢纽的 bbox。"""
    owners = {}
    for line in llt_obj.lines:
        for st in line["stations"]:
            if st["name"].endswith("所"):
                owners.setdefault(st["name"], set()).add(line["name"])
    have = {norm_name(n["name"]) for n in artifact["nodes"]}
    inv_boxes = [(nm, w["bbox"]) for nm, w in inv.get("way_names", {}).items()
                 if w.get("bbox")]
    plan = {}
    for s, lines in sorted(owners.items()):
        if norm_name(s) in have or norm_name(s[:-1]) in have:
            continue
        if not (lines & legs):
            continue
        if len(lines) < 2:
            continue
        def geom(o):
            return (owner_geometry(llt_obj, ours_stations, o, cache_names)
                    or connector_by_geometry(s, sidx, llt_obj.by_name.get(o),
                                              cache_names, inv_boxes))
        for o in sorted(lines):
            if geom(o):
                continue    # 已有几何来源，不用扩提取
            own = inv.get("way_names", {}).get(o)
            nb = neighbour_box_of(s, llt_obj.by_name.get(o), sidx)
            # ① ①层名本身就是 OSM 走廊名（康山联络线：两端都是所、站集映射接
            #    不上，但名字和几何都在）—— 用它自己的外接框提取。走廊太长时
            #    （杭深线 跨 7.6°）退到所邻域小框，只取道岔附近那一段，否则会
            #    把一条跨省长干线灌进合并图。
            if own and own.get("bbox"):
                wb = own["bbox"]
                box = wb
                if (wb[2] - wb[0] > 0.6 or wb[3] - wb[1] > 0.6) and nb:
                    box = [max(nb[0], wb[0]), max(nb[1], wb[1]),
                           min(nb[2], wb[2]), min(nb[3], wb[3])]
                if box[0] < box[2] and box[1] < box[3]:
                    plan.setdefault(o, []).append([round(x, 3) for x in box])
                continue        # 名字已经接上 OSM，不用再按几何猜
            # ② OSM 里根本没有这个名字（路路通 京西联络线 在 OSM 叫
            #    京广高速京西联络线；阜黄黄黄段 干脆没有）：按几何认名，把落在所
            #    邻域框内的那些枢纽量级走廊补进提取。要求"整体落在框内"而不是
            #    "与框相交" —— 相交判据在武汉枢纽能一次命中几百条站场线。
            if not nb:
                continue        # 连邻域框都算不出来（邻居站名有歧义），不猜
            box = padded(nb)
            hits = tight_names_at(box, inv_boxes, None, inside=True)
            # 命中多到这种量级就不是"这个枢纽附近的走廊"，而是"整片站场"
            # （沪春线 附近 71 条、京哈京沈段 附近 53 条）。探针是把几何灌进
            # 合并图的外科口子，不是全国普查，超上限就放弃、留给人工。
            if len(hits) > PROBE_MAX_HITS:
                continue
            for h in hits:
                plan.setdefault(h, []).append([round(x, 3) for x in nb])
    return plan


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--near", type=float, default=0.06, help="无共用顶点时允许的端点对距离(km)")
    ap.add_argument("--only", default="", help="逗号分隔的所名，只算这些")
    ap.add_argument("--emit-probe", action="store_true",
                    help="写「补上几何就能落位」的走廊名与枢纽邻域框到 "
                         "build-cache/llt-junction-probe.json，并打印扫描命令")
    args = ap.parse_args()

    llt_obj = llt_mod.load()
    feas = json.load(open(FEASIBILITY, encoding="utf-8"))
    cache_path, payload = newest_extract_cache()
    artifact = load_js_object(os.path.join(ROOT, "js", "rail-route-data.js"),
                              "var RAIL_ROUTE_DATA")
    have_nodes = {norm_name(n["name"]) for n in artifact["nodes"]}
    way_pts = {nm: [tuple(p) for w in ws for p in w["pts"]]
               for nm, ws in payload["ways"].items()}
    # 探针顶点缓存：与提取缓存同精度（round 6），所以两边能求同一个共用顶点。
    if os.path.exists(PTS_JSON):
        pts_payload = json.load(open(PTS_JSON, encoding="utf-8"))
        for nm, pts in pts_payload.get("ways", {}).items():
            way_pts.setdefault(nm, []).extend(tuple(p) for p in pts)
    cache_names = set(way_pts)
    # 我们的线 → 实际骑到的节点名（区段端点反推），用于按站集重叠映射
    nm_of = {n["id"]: n["name"] for n in artifact["nodes"]}
    ours_stations = {l["id"]: set() for l in artifact["lines"]}
    for s in artifact["segments"]:
        for lid in s["lineIds"]:
            if lid in ours_stations:
                ours_stations[lid] |= {nm_of[s["from"]], nm_of[s["to"]]}
    ours_stations = {k: {norm_name(x) for x in v} for k, v in ours_stations.items()}

    owners = {}
    for line in llt_obj.lines:
        for st in line["stations"]:
            if st["name"].endswith("所"):
                owners.setdefault(st["name"], set()).add(line["name"])

    legs = {r["line"] for r in feas["lines"] if r["in_legs"]}

    # 几何认名要用的两份索引：站名→坐标（判邻域框）、OSM 走廊名→外接框
    inv = json.load(open(INVENTORY, encoding="utf-8")) if os.path.exists(INVENTORY) else {}
    sidx, inv_boxes = {}, []
    for st in inv.get("stations", []):
        sidx.setdefault(norm_name(st["name"]), []).append((st["lon"], st["lat"]))
    inv_boxes = [(nm, w["bbox"]) for nm, w in inv.get("way_names", {}).items()
                 if w.get("bbox")]

    if args.emit_probe:
        plan = probe_plan(llt_obj, ours_stations, cache_names, inv, sidx, artifact, legs)
        _write_json(PROBE_JSON, {"provenance": {"llt": llt_obj.sha256,
                                                "inventory": os.path.basename(INVENTORY)},
                                 "boxes": plan})
        print("探针计划 %d 个走廊名 / %d 个框 → %s"
              % (len(plan), sum(len(v) for v in plan.values()), PROBE_JSON))
        print("扫顶点（一次 PBF 扫描，产物不受影响）：\n  %s" % PTS_CMD)
        return

    only = {x.strip() for x in args.only.split(",") if x.strip()}
    rows = []
    for suo, lines in sorted(owners.items()):
        if norm_name(suo) in have_nodes or norm_name(suo[:-1]) in have_nodes:
            continue                      # OSM 已有节点，不需要这里落位
        if only and suo not in only:
            continue
        geos = []
        for ln in sorted(lines):
            g = owner_geometry(llt_obj, ours_stations, ln, cache_names)
            if not g:
                # 名字对不上、站集也接不上：最后按几何认名（京西联络线 这类
                # 只有两站的联络线，OSM 叫 京广高速京西联络线）
                g = connector_by_geometry(suo, sidx, llt_obj.by_name.get(ln),
                                          cache_names, inv_boxes)
                if g:
                    print("    按几何认名：%s → %s" % (ln, g[0]))
            geos.append((ln, g))
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
        # 所必须同时落在两条邻接线各自的"所邻域"里（①层序列给的站坐标框）。
        # 两条走廊常常在好几个枢纽都相交，共用顶点因此成簇；取交集是把
        # "方向不明"变成"唯一"的几何线索，交集为空或仍多簇就照旧放弃。
        region = None
        for ln in (a_name, b_name):
            nb = neighbour_box_of(suo, llt_obj.by_name.get(ln), sidx)
            if not nb:
                continue
            region = nb if region is None else [
                max(region[0], nb[0]), max(region[1], nb[1]),
                min(region[2], nb[2]), min(region[3], nb[3])]
        if shared:
            # 先把共用顶点收到"两线邻域交集"里再判：两条走廊常常在别处也相交、
            # 甚至在别处并线（康山联络线 与 沪苏湖高铁 共用的 56 个顶点就不在
            # 康山所附近），而所只可能落在两条线各自说的那个位置附近。
            clipped = shared
            if region and region[0] < region[2] and region[1] < region[3]:
                clipped = {p for p in shared if in_box(p, region)} or shared
            clusters = cluster([list(p) for p in clipped])
            if len(clipped) > COLLINEAR_VERTICES:
                # 两条①层条目共用同一段物理走廊（京港合安段 与 京港安九段 都含
                # 合肥南—安庆 正线），交点是一条带而不是一个点：这种"共线"
                # 给不出所的位置，得换邻居线索人工认。
                rows.append({"suo": suo, "owners": [a_name, b_name],
                             "verdict": "collinear",
                             "why": "邻域内共用 %d 个顶点，是共线不是交点"
                                    % len(clipped)})
                continue
            if len(clusters) > 1:
                rows.append({"suo": suo, "owners": [a_name, b_name], "verdict": "ambiguous",
                             "why": "邻域内共用顶点成 %d 簇，方向不明" % len(clusters),
                             "clusters": [[c[0], c[1]] for c in clusters]})
                continue
            coord, n = clusters[0]
            rows.append({"suo": suo, "owners": [a_name, b_name], "verdict": "shared-vertex",
                         "coord": [round(coord[0], 5), round(coord[1], 5)],
                         "evidence": "%d 个共用顶点%s" % (
                             n, "（两线邻域交集内）" if clipped is not shared else ""),
                         "in_legs": bool(legs & {a_name, b_name})})
            continue
        # 没有严格共用顶点：退到"两侧顶点最近"。同样只在两线邻域交集里找，
        # 否则会把几百公里外另一处相交找成"最近的"。
        if region and region[0] < region[2] and region[1] < region[3]:
            a = {p for p in a if in_box(p, region)} or a
            b = {p for p in b if in_box(p, region)} or b
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
