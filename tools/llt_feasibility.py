#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""路路通 ①层站序 → 我们线网的可行性闭包报告（阶段 0）。

回答三个问题，供人决定"哪些线可以换成声明式站序、哪些必须继续手工"：

1. 需要铺多大：从"35 个车次逐段用到的线路"出发，并入现有 45 条线的对应条目、
   全国干线规则筛出的条目、武汉周边与长三角框内的条目，再沿"共享线路所"做
   1-hop 闭包（所的定义就是两线交点，只筛干线会让大半所无处落位）。
2. 站能不能落位：①层每个站先在 OSM 命名站节点里找同名（这是唯一有坐标的来源），
   找不到的若是"×所"，看它的两条邻接线是否都有几何来源 —— 有则可按共用 OSM
   顶点落位（就是把 旬阳联络线/汉丹客车联络线 那两处手工做法自动化）。
3. 走廊拼不拼得出：线名与 OSM way 名系统性不同（宁蓉线↔沪蓉线，重合仅 19/65），
   所以按站集合重叠把①层条目映射到我们的线，用我们已有的 osm_names 当几何来源；
   映射不上且本名在 OSM 也没有 way 的，判"不可行"，不硬接。

输出全部落在 gitignored 的 build-cache/：报告不进库、站序不进产物。
用法：python tools/llt_feasibility.py [--inventory build-cache/osm-rail-inventory.json]
"""

import argparse
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "tools"))

from rail_network import llt as llt_mod  # noqa: E402
from rail_network.build import norm_name  # noqa: E402
from rail_network.lines import LINES  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE_DIR = os.path.join(ROOT, "build-cache")
INVENTORY = os.path.join(CACHE_DIR, "osm-rail-inventory.json")
VIA = os.path.join(CACHE_DIR, "llt-via.json")

# 用户定的铺开范围：现有线 + 武汉周边 + 长三角 + 全国干线。
REGIONS = {
    "武汉周边": (113.6, 30.15, 115.1, 31.55),
    "长三角": (118.4, 29.4, 122.3, 32.3),
}
TRUNK_MIN_STATIONS = 15
# 全国干线规则的排除项：联络线/分段/环线/绕行/整备设施不是"干线"。
TRUNK_EXCLUDE = re.compile(r"联络|绕行|环线|动车所|动车段|机务|车辆|检修|疏解|^.{2,3}段$")
# 落位率门槛：低于此值的线本轮不切换（阶段 1 的准入线）。
PLACE_MIN_RATIO = 0.9


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def station_index(inventory):
    """规范化 OSM 站名 → [节点]，用于判"这个站有没有坐标"。"""
    idx = {}
    for st in inventory.get("stations", []):
        idx.setdefault(norm_name(st["name"]), []).append(st)
    return idx


def our_line_stations(artifact_path):
    """我们产物里每条线实际骑到的节点名（区段端点反推，含自动补站）。"""
    data = load_json(artifact_path) if artifact_path.endswith(".json") else None
    if data is None:
        text = open(artifact_path, encoding="utf-8").read()
        start = text.index("{", text.index("var RAIL_ROUTE_DATA"))
        data = json.JSONDecoder().raw_decode(text[start:])[0]
    name_of = {n["id"]: n["name"] for n in data["nodes"]}
    out = {l["id"]: set() for l in data["lines"]}
    for seg in data["segments"]:
        for lid in seg["lineIds"]:
            if lid in out:
                out[lid] |= {name_of[seg["from"]], name_of[seg["to"]]}
    meta = {l["id"]: l["name"] for l in data["lines"]}
    return out, meta


def map_llt_to_our(ours, llt_lines):
    """①层条目 → 我们的线（可多条），按"该条目的站被我们这条线覆盖多少"打分。

    llt 线名与 OSM 线名系统性不同（宁蓉线↔沪蓉线，名字重合仅 19/65），只能按
    站集重叠映射。覆盖门槛 0.6 且至少 2 个共享站，两站的联络线（襄樊东线=襄州+
    襄阳）才算得上汉丹线。
    """
    mine_norm = {lid: {norm_name(x) for x in names} for lid, names in ours.items()}
    out = {}
    for name, sts in llt_lines.items():
        # 分母用"非所站"：我们的 stops 只申报客运站，线路所本来就不在里面（这正是
        # 重构要补的东西）。拿全量站当分母，所越密的线越映射不上，会把 阜黄黄黄段
        # 这种明明有 阜黄高速线 的线误判成"无几何来源"。
        plain = {norm_name(s["name"]) for s in sts if not s["name"].endswith("所")}
        if not plain:
            continue
        scored = []
        for lid, mine in mine_norm.items():
            inter = len(plain & mine)
            # 双向覆盖都要够：只看"①层条目被我们的线覆盖"会让 武津线、下隔线
            # 这类两站小条目顺带映射到 京沪线/汉丹线 这种大线上，真按它改站序
            # 就把不相干的走廊插进骨架了。
            if inter >= 2 and min(inter / len(plain), inter / len(mine)) >= 0.5:
                scored.append((round(inter / len(plain), 3), inter, lid))
        scored.sort(reverse=True)
        if scored:
            out[name] = [s[2] for s in scored[:3]]
    return out


def leg_line_names(llt_obj, codes):
    """给定车次集合，逐段解释出的 ①层线路名全集。"""
    names = set()
    for code in codes:
        for rec in llt_obj.routes_for_code(code):
            seq = llt_obj.sequence(rec)
            for a, b in zip(seq, seq[1:]):
                cand = llt_obj.leg_candidates(a, b)
                names.update(n for n, _, _ in cand)
    return names


# OSM 里 railway=rail 的"名字"有大量站场轨道/附属线（禁溜线、整备线、10道、机待线、
# 货物线…），它们不是走廊，混进候选名单会把人带偏；先滤掉。
YARD_NOISE = re.compile(
    r"^\d+道$|^[关联]?-?\d+线$|禁溜|整备|机待|机走|走行|安全线|货物线|牵出|试验|试车"
    r"|装卸|装车|卸车|存车|存放|客修|检修|加冰|油库|煤塔|站台|雨棚|便线|专线$|材料")


def stem_shared(llt_name, way_name):
    """两个名字有没有共享的 2 字词干（大西高铁↔大西高速线、临哈临额段↔临哈线）。"""
    a, b = norm_name(llt_name), norm_name(way_name)
    return any(a[i:i + 2] in b for i in range(len(a) - 1))


def line_bbox(stations, sidx):
    xs, ys = [], []
    for s in stations:
        for node in sidx.get(norm_name(s), []):
            xs.append(node["lon"])
            ys.append(node["lat"])
    if not xs:
        return None
    return [min(xs), min(ys), max(xs), max(ys)]


def station_points(names, sidx):
    """已落位站的坐标集合（同名多节点全取，交给外接框去判覆盖）。"""
    pts = []
    for n in names:
        for node in sidx.get(norm_name(n), []):
            pts.append((node["lon"], node["lat"]))
    return pts


def in_any_region(box, regions):
    if not box:
        return None
    for label, (x1, y1, x2, y2) in regions.items():
        if box[0] <= x2 and box[2] >= x1 and box[1] <= y2 and box[3] >= y1:
            return label
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--inventory", default=INVENTORY,
                    help="OSM 走廊/站命名清单（tools/probe_rail_names.py --dump 生成）")
    ap.add_argument("--artifact", default=os.path.join(ROOT, "js", "rail-route-data.js"))
    ap.add_argument("--via", default=VIA,
                    help="车次经由导出（tools/rail_network/llt.py --dump-via 生成），"
                         "用于分区有证据/无证据车次")
    ap.add_argument("--out-txt", default=os.path.join(CACHE_DIR, "_llt_feasibility.txt"))
    ap.add_argument("--out-json", default=os.path.join(CACHE_DIR, "llt-feasibility.json"))
    args = ap.parse_args()

    if not os.path.exists(args.inventory):
        raise SystemExit("缺少 %s：先跑 python tools/probe_rail_names.py --dump %s"
                         % (args.inventory, args.inventory))
    llt_obj = llt_mod.load()
    inv = load_json(args.inventory)
    sidx = station_index(inv)
    way_names = set(inv.get("way_names", {}).keys())
    our_stations, our_names = our_line_stations(args.artifact)
    llt_lines = {l["name"]: l["stations"] for l in llt_obj.lines}
    codes = sorted(our_codes())
    via = load_json(args.via).get("trains", {}) if os.path.exists(args.via) else {}

    # --- 种子集 ---
    legs = leg_line_names(llt_obj, codes)
    llt_to_our = map_llt_to_our(our_stations, llt_lines)
    trunk = {n for n, s in llt_lines.items()
             if len(s) >= TRUNK_MIN_STATIONS and not TRUNK_EXCLUDE.search(n)}
    region_hits = {}
    for n, s in llt_lines.items():
        hit = in_any_region(line_bbox([x["name"] for x in s], sidx), REGIONS)
        if hit:
            region_hits[n] = hit
    seed = set(legs) | set(llt_to_our) | trunk | set(region_hits)

    # 1-hop 闭包：种子里的"所"是两线交点，其邻接线也得在候选内，否则
    # "按两线共用顶点落位"没有第二个几何来源。只并入本身够格的线（干线/
    # 区域/车次用到），全量顺所扩散会把大半张网拉进来，不做。
    owners = {}
    for n, s in llt_lines.items():
        for st in s:
            if st["name"].endswith("所"):
                owners.setdefault(st["name"], set()).add(n)
    eligible = legs | trunk | set(region_hits) | set(llt_to_our)
    closure = set(seed)
    for _ in range(3):
        added = set()
        for name in closure:
            for st in llt_lines[name]:
                if st["name"].endswith("所"):
                    added |= {o for o in owners.get(st["name"], ())
                              if o not in closure and o in eligible}
        if not added:
            break
        closure |= added

    # --- 逐线判定 ---
    osm_src = {l["id"]: l["osm_names"] for l in LINES}
    # 分档口径（关键）：普通站要有 OSM 同名节点才叫"落得了位"；线路所不算失败，
    # 它的定义就是两条走廊的交点，能不能落位取决于"邻接线有没有几何来源"。
    # 把两件事混成一个落位率，会把 康山联络线(康山所+妙西镇所) 判成"不可行"，
    # 而那恰恰是最该自动落位的一类。
    geo_of = {}
    for name in sorted(closure):
        if name in way_names:
            geo_of[name] = "osm_name"
            continue
        have = []
        for lid in llt_to_our.get(name, []):
            have += [x for x in osm_src.get(lid, []) if x in way_names]
        have = sorted(set(have))
        geo_of[name] = ("our_osm_names:" + ",".join(have)) if have else "none"

    # geometry=none 不等于"OSM 里没这条走廊"：本表只认"线名相同"和"我们的线已
    # 白名单"两条路。OSM 清单里有 3,208 个命名走廊，按"这条线有多少个已落位站
    # 落在该走廊外接框内"再找一批候选名，交给人认一次就能填进 osm_names ——
    # 把死路变成待办。
    way_boxes = [(n, v["bbox"]) for n, v in inv.get("way_names", {}).items()
                 if v.get("bbox") and v["bbox"][2] > v["bbox"][0]]
    cand_geo = {}
    for name in sorted(closure):
        if geo_of[name] != "none":
            continue
        pts = station_points([s["name"] for s in llt_lines[name]], sidx)
        if not pts:
            continue
        hits = []
        for wn, wb in way_boxes:
            if YARD_NOISE.search(wn):
                continue
            cov = sum(1 for lon, lat in pts
                      if wb[0] <= lon <= wb[2] and wb[1] <= lat <= wb[3])
            if not cov:
                continue
            span = (wb[2] - wb[0]) + (wb[3] - wb[1])
            # 排序：词干相同优先（广湛高铁↔广湛高速线），其次覆盖站数，最后小框。
            # 只看覆盖数会让横跨全国的 小新联络线 之类到处霸榜。
            hits.append((0 if stem_shared(name, wn) else 1, -cov, span, wn))
        hits.sort()
        cand_geo[name] = [(h[3], -h[1]) for h in hits[:6]]

    rows = []
    for name in sorted(closure):
        sts = llt_lines[name]
        plain = [s["name"] for s in sts if not s["name"].endswith("所")]
        suo = [s["name"] for s in sts if s["name"].endswith("所")]
        placed = [s for s in plain if sidx.get(norm_name(s))]
        missing = [s for s in plain if not sidx.get(norm_name(s))]
        ambiguous = [s for s in placed if len(sidx.get(norm_name(s), [])) > 1]
        geo = geo_of[name]
        # 所：邻接线（①层里也含这个所的条目）有几何来源即可按共用顶点落位
        placeable_suo, human_suo = [], []
        for s in suo:
            partners = [o for o in owners.get(s, ()) if o != name]
            ok = [o for o in partners if geo_of.get(o, "none") != "none"]
            (placeable_suo if ok else human_suo).append(s)
        ratio = len(placed) / len(plain) if plain else 1.0
        if geo == "none" or ratio < 0.7:
            verdict = "blocked"
        elif ratio >= PLACE_MIN_RATIO and not human_suo:
            verdict = "auto"
        else:
            verdict = "manual"
        rows.append({
            "line": name, "stations": len(sts), "plain": len(plain), "placed": len(placed),
            "junctions": len(suo), "junction_placeable": placeable_suo,
            "junction_human": human_suo,
            "ratio": round(ratio, 3), "geometry": geo,
            "ours": (llt_to_our.get(name) or [None])[0],
            "ours_all": llt_to_our.get(name, []),
            "region": region_hits.get(name),
            "in_legs": name in legs, "is_trunk": name in trunk,
            "ambiguous_names": ambiguous, "missing": missing,
            "geo_candidates": cand_geo.get(name, []),
            "verdict": verdict,
        })

    frozen = sorted([c for c in codes if not (via.get(c) or {}).get("found")])
    counts = {k: sum(1 for r in rows if r["verdict"] == k) for k in ("auto", "manual", "blocked")}
    lines_in_legs = sum(1 for r in rows if r["in_legs"])

    with open(args.out_json, "w", encoding="utf-8") as f:
        json.dump({"provenance": {"llt": llt_obj.sha256, "dataVersion": llt_obj.data_version,
                                  "osmInventory": inv.get("sha256"),
                                  "osmWayNames": len(way_names),
                                  "osmStations": len(sidx)},
                   "summary": {"closure_lines": len(rows), "legs_lines": lines_in_legs,
                               "verdicts": counts, "frozen_codes": frozen},
                   "lines": rows}, f, ensure_ascii=False, indent=1)

    out = []
    add = out.append
    add("=== 路路通 ①层可行性闭包（数据版本 %s，routes.dat %s…，OSM 走廊名 %d 个）===" % (
        llt_obj.data_version, (llt_obj.sha256 or "")[:12], len(way_names)))
    add("闭包线路 %d 条（其中 35 车次逐段用到 %d 条）；判定 全自动 %d / 需人工 %d / 不可行 %d"
        % (len(rows), lines_in_legs, counts["auto"], counts["manual"], counts["blocked"]))
    add("无经由证据的车次（冻结名单，%d 个）：%s" % (len(frozen), " ".join(frozen)))
    add("")
    add("%-28s %4s %5s %6s  %-32s %s" % ("线名", "站数", "落位", "落位率", "几何来源 | 我们的线", "判定"))
    for r in sorted(rows, key=lambda x: (x["verdict"], -x["stations"])):
        add("%-28s %4d %5d %5.0f%%  %-32s %s" % (
            r["line"], r["stations"], r["placed"], 100 * r["ratio"],
            ((r["geometry"] if r["geometry"] != "none" else "缺")[:30]
             + (" | " + r["ours"] if r["ours"] else "")), r["verdict"]))
    add("")
    add("--- 落不了位的站（按线，最多各 12 个）---")
    for r in rows:
        if r["missing"]:
            add("%-26s 缺 %2d 个：%s" % (r["line"], len(r["missing"]), " ".join(r["missing"][:12])))
    add("")
    add("--- 落不了位且邻接线也不在闭包里的所（须人工，或先把邻接线补进候选）---")
    for r in rows:
        if r["junction_human"]:
            add("%-26s %s" % (r["line"], " ".join(r["junction_human"])))
    add("")
    add("--- 无几何来源的线 + OSM 候选走廊名（认一次就能填进 osm_names；括号为覆盖到的站数）---")
    add("    注：这里的\u201c无几何来源\u201d只代表本表没证明它有几何，不等于 OSM 里没有。")
    for r in rows:
        if r["geometry"] != "none":
            continue
        cand = "、".join("%s(%d)" % (n, c) for n, c in r["geo_candidates"]) or "无候选"
        add("%-20s 站%3d 落%3d  覆盖它的OSM走廊名候选：%s"
          % (r["line"], r["stations"], r["placed"], cand[:150]))
    add("")
    add("--- OSM 同名多节点（阶段 1 要靠几何/位置定身份的这些站，注意略号是站场级不能当主键）---")
    for name, lst in [(r["line"], r["ambiguous_names"]) for r in rows if r["ambiguous_names"]][:40]:
        add("%-26s %s" % (name, " ".join(lst)))
    add("")
    add("准入线（落位率≥%.0f%%、有几何来源、无需人工的所）→ 可进阶段 1 换声明式站序：%d 条"
        % (100 * PLACE_MIN_RATIO, counts["auto"]))
    with open(args.out_txt, "w", encoding="utf-8") as f:
        f.write("\n".join(out) + "\n")
    print("报告：%s（%d 行）与 %s" % (args.out_txt, len(rows), args.out_json))
    print("闭包 %d 条线：全自动 %d，需人工 %d，不可行 %d；35 车次用到 %d 条"
          % (len(rows), counts["auto"], counts["manual"], counts["blocked"], lines_in_legs))
    print("冻结车次 %d 个：%s" % (len(frozen), " ".join(frozen)))


def our_codes():
    """js/data.js 里的车次集合。"""
    text = open(os.path.join(ROOT, "js", "data.js"), encoding="utf-8").read()
    m = re.search(r"window\.TRAIN_DATA\s*=\s*(\{.*?\});\s*$", text, re.S)
    return {r["train"] for r in json.loads(m.group(1))["records"]}


if __name__ == "__main__":
    main()
