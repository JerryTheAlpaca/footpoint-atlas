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
# "客线/货线"必须锚在词尾：不锚会把 武九客专线（客运专线，正儿八经的走廊）
# 当成站场到发线杀掉。
YARD_EXTRA = re.compile(
    r"\d+道$|走行|动车|渡线|客线$|货线$|安全线|整备场"
    r"|专用线|专用铁路|军用|观光|地铁|有轨")

# YARD_NOISE 的 专线$ 是给"××厂专线"准备的，但 OSM 里 武九客专线/石太客专线
# 这类是**客运专线**，是正儿八经的干线走廊（武九客专线 就在我们的提取里）。
PASSENGER_DEDICATED = re.compile(r"客(运)?专线$")


def is_yard_noise(name):
    if PASSENGER_DEDICATED.search(name):
        return False
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


def in_box(p, box):
    return box[0] <= p[0] <= box[2] and box[1] <= p[1] <= box[3]


def boxes_intersect(a, b):
    return not (a[0] > b[2] or a[2] < b[0] or a[1] > b[3] or a[3] < b[1])


# 线路"种类"词，不是地名：拿它们当词干会把 京西联络线 认成任何一条"××络线"，
# 也会让 武石城际线 误配 武咸城际线（共有的只是"际线"这个后缀）。
GENERIC_STEMS = {"联络", "络线", "高速", "城际", "际线", "客专", "铁路", "专线",
                 "上行", "下行", "支线", "疏解", "客车", "货车", "直通", "外绕",
                 "绕行", "客线", "货线", "二线", "三线", "引入", "到发"}


def stems(name):
    n = norm_name(name)
    return {n[i:i + 2] for i in range(len(n) - 1)} - GENERIC_STEMS


def suo_anchor(suo, owners, llt_obj, sidx):
    """所的估计位置 + 它的紧邻站坐标。

    为什么必须跨条目取平均：所常排在①层序列的头或尾（巴河所 就是
    阜黄黄黄段 的第一站），那一条目里它只有一侧有邻居，"邻站外接框"整个偏到
    别处去 —— 巴河所 因此被认成 38 公里外的 西塞山电厂专用线。用两条邻接线
    各自的紧邻站（巴河所：武冈城际线 的 黄冈东 + 阜黄黄黄段 的 浠水南）取平均，
    所就落在它们中间。
    """
    coords = []
    for o in owners:
        entry = llt_obj.by_name.get(o)
        if not entry:
            continue
        seq = [s["name"] for s in entry["stations"]]
        i = next((k for k, n in enumerate(seq) if norm_name(n) == norm_name(suo)), None)
        if i is None:
            continue
        nb = [seq[j] for j in (i - 1, i + 1) if 0 <= j < len(seq)]
        for n in nb:
            cands = sidx.get(norm_name(n), [])
            if len(cands) == 1:       # 名字有歧义就不采信
                coords.append(cands[0])
    if not coords:
        return None, []
    centre = [sum(c[k] for c in coords) / len(coords) for k in (0, 1)]
    return centre, coords


def suo_box(suo, owners, llt_obj, sidx, min_km=15.0, max_km=45.0):
    """以所本身为中心的邻域框：半径跟着"所到紧邻站"的实际距离走。"""
    centre, coords = suo_anchor(suo, owners, llt_obj, sidx)
    if centre is None:
        return None
    r_km = min(max_km, max(min_km, 1.3 * min(km_between(centre, c) for c in coords)))
    d = r_km / 111.32
    return [round(centre[0] - d, 3), round(centre[1] - d, 3),
            round(centre[0] + d, 3), round(centre[1] + d, 3)]


def names_by_geometry(box, llt_name, inv_boxes):
    """路路通线名 → 位置上对得上的 OSM 走廊名 + 匹配置信度（不做可用性过滤）。

    四条通道，都要求走廊与所的邻域框真的相交/落在里面：
      4 = 同名，或整名互相包含（京西联络线 ⊂ 京广高速京西联络线 —— OSM 常给
          联络线加"属于哪条正线"的前缀）；
      3 = 站集重叠映射到我们的线路后带来的 osm_names（见 owner_geometry）；
      2 = 二字词干相同（阜黄黄黄段 ↔ 阜黄高速线 —— 这条线跨 0.9x2.9 度，永远
          塞不进"紧框"判据，只能靠名字的词根接上）；
      1 = 紧框（OSM 与路路通完全不同名，如 沪苏湖高铁 附近那条 康山联络线）。
    置信度是给 attribute() 做归属用的：一条 OSM 走廊只能认给一条①层线，
    文字证据（4）必须压过映射证据（3），否则 杜家坎所 的两条邻接线会在
    京广高速京西联络线 上并列，两边都拿不到几何。
    """
    my = stems(llt_name)
    hits = []
    for nm, wb in inv_boxes:
        if not boxes_intersect(box, wb):
            continue
        if is_yard_noise(nm):         # 到发线/走行线/电厂专用线不是走廊
            continue
        if nm == llt_name or (min(len(nm), len(llt_name)) >= 3
                             and (llt_name in nm or nm in llt_name)):
            hits.append((nm, 4))
            continue
        if my & stems(nm):
            hits.append((nm, 2))
            continue
        # 紧框：只有"枢纽量级的小框、且整体落在所的邻域里"才认。
        if wb[2] - wb[0] < 0.5 and wb[3] - wb[1] < 0.5 and in_box(wb, box):
            hits.append((nm, 1))
    return hits


def attribute(raw):
    """把 OSM 走廊名**归属**到匹配度最高的那条①层线，一个名只认一条。

    为什么必须归属而不是"两边共用"：同一份几何认给两条线，求交就是自己跟
    自己共用，会假报成共线带（妙西镇所 的 合杭高铁 与 康山联络线 都只认得出
    康山联络线）。归属之后剩下的交集才是真的"两条走廊相接"。
    两条线并列最高分就说明这条走廊认不准，哪边都不给。
    """
    best = {}
    for owner, cands in raw:
        for nm, score in cands:
            cur = best.get(nm)
            if cur is None or score > cur[0]:
                best[nm] = [score, {owner}]
            elif score == cur[0]:
                best[nm][1].add(owner)
    out = []
    for owner, cands in raw:
        got = sorted({nm for nm, _ in cands if best[nm][1] == {owner}})
        if got:
            out.append((owner, got))
    return out


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


def geometry_for(suo, owners, o, llt_obj, ours_stations, sidx, inv_boxes, way_pts):
    """①层条目 o 在这个所附近能当几何用的 OSM 走廊名 + 邻域框 + 顶点到没到手。

    covered=False 有两种含义，都得进探针清单去补几何：
      · 名字接上了但顶点不在这附近 —— 杜家坎所 的 京广高铁，我们提取到的那一段
        在 1000 公里外的武汉（北京段从来没要过）；
      · 名字根本没接上 —— 阜黄黄黄段 在 OSM 叫 阜黄高速线。
    """
    box = suo_box(suo, owners, llt_obj, sidx)
    if not box:
        return [], None, False
    cands = [(n, 3) for n in
             owner_geometry(llt_obj, ours_stations, o, set(way_pts))]
    cands += names_by_geometry(box, o, inv_boxes)
    best = {}
    for nm, score in cands:               # 同名多条通道：取最高分
        best[nm] = max(score, best.get(nm, 0))
    cands = sorted(best.items())
    covered = any(in_box(p, box) for nm, _ in cands for p in way_pts.get(nm, ()))
    return cands, box, covered


def probe_plan(llt_obj, ours_stations, way_pts, inv, sidx, artifact, legs):
    """列出"补上几何就能落位"的走廊名 + 该补哪一块邻域。

    要补的判据是"**归属给这条①层线**的走廊，顶点没落在所的邻域里"，不是
    "随便哪个候选名在附近有顶点" —— 后者在枢纽里几乎恒真（京广高铁 在北京
    一带能擦到 28 条候选），那样探针清单会直接空掉。
    """
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
        if not (lines & legs) or len(lines) < 2:
            continue
        box = suo_box(s, lines, llt_obj, sidx)
        if not box:
            continue
        raw = []
        for o in sorted(lines):
            cands, _, _ = geometry_for(s, lines, o, llt_obj, ours_stations,
                                       sidx, inv_boxes, way_pts)
            if cands:
                raw.append((o, cands))
        got = dict(attribute(raw))
        for o, cands in raw:
            own = got.get(o, [])
            if any(in_box(p, box) for nm in own for p in way_pts.get(nm, ())):
                continue        # 这条线自己的几何已经到所附近，不用补
            todo = [nm for nm, _ in cands
                    if not any(in_box(p, box) for p in way_pts.get(nm, ()))]
            for nm in sorted(set(todo))[:PROBE_MAX_HITS]:
                plan.setdefault(nm, []).append(box)
    return plan


def junction_complex(clusters, centre, max_km=1.5):
    """把"同一处疏解区的多组道岔尖"收成一个点。

    一条联络线接入正线时是上下行各一道岔（康山所 的两簇相距 650m、南店所 430m），
    这不是"方向不明"，而是同一个所的两股道岔 —— 我们的网络一个所只要一个节点，
    两簇都在同样的两条走廊之间换线，取离所邻域中心近的那一组。
    簇与簇之间超过 max_km 就真的是两处地方（比如一条长联络线的两端），
    那种才叫方向不明，不能挑。
    """
    if len(clusters) < 2 or centre is None:
        return clusters
    if max(km_between(a[0], b[0]) for a in clusters for b in clusters) > max_km:
        return clusters
    return [min(clusters, key=lambda c: km_between(c[0], centre))]


def judge_pair(suo, a_pair, b_pair, region, way_pts, way_tips, legs, near_km):
    """判一对邻接线给不给得出所的位置，返回一行候选（含 verdict/原因）。"""
    a_name, a_g = a_pair
    b_name, b_g = b_pair
    # 两边的走廊名在 attribute() 里已经保证不重复（一条 OSM 走廊只认给匹配度
    # 最高的那条①层线），所以这里的交集就是"两条不同的走廊相接"，不会是自己
    # 跟自己共用（那正是 妙西镇所 曾被假报成共线带的原因）。
    a = {p for nm in a_g for p in way_pts[nm]}
    b = {p for nm in b_g for p in way_pts[nm]}
    tip_pts = {p for nm in a_g + b_g for p in way_tips.get(nm, ())}
    base = {"suo": suo, "owners": [a_name, b_name],
            "in_legs": bool(legs & {a_name, b_name})}
    if not (a and b):
        return dict(base, verdict="same-corridor", why="两边都没有可用顶点")
    shared = a & b
    # 两条走廊常常在好几个枢纽都相交、甚至在别处并线，所以先把共用顶点收到
    # 所自己的邻域框里再判；框算不出来（紧邻站同名歧义）就照旧用全量。
    clipped = ({p for p in shared if in_box(p, region)} if region else set()) or shared
    if shared:
        # 道岔尖判据：线路所就是两条走廊的**端点**相接处；两条线并线跑一段
        # 再分开的话，重叠的是 way 的内部顶点。所以共用顶点多到像并线、或者
        # 成好几簇时，先只看"两侧走廊的端点"，端点里只剩一处就是所。
        centre = ([(region[0] + region[2]) / 2, (region[1] + region[3]) / 2]
                  if region else None)
        tips = {p for p in clipped if p in tip_pts}
        tc = cluster([list(p) for p in tips]) if tips else []
        tc_all = len(tc)
        tc = junction_complex(tc, centre)
        if tc_all and len(tc) == 1:
            return dict(base, verdict="shared-vertex",
                        coord=[round(tc[0][0][0], 5), round(tc[0][0][1], 5)],
                        evidence="%d 个共用的走廊端点（道岔尖%s）" % (
                            tc[0][1],
                            "，同处疏解区的 %d 组取近所中心一组" % tc_all if tc_all > 1 else ""))
        clusters = junction_complex(cluster([list(p) for p in clipped]), centre)
        if len(clipped) > COLLINEAR_VERTICES:
            # 两条①层条目共用同一段物理走廊（京港合安段 与 京港安九段 都含
            # 合肥南—安庆 正线），交点是一条带而不是一个点：这种"共线"
            # 给不出所的位置，得换邻居线索人工认。
            return dict(base, verdict="collinear",
                        why="邻域内共用 %d 个顶点（端点 %d 处，不成唯一），"
                            "是共线不是交点" % (len(clipped), len(tc)))
        if len(clusters) > 1:
            return dict(base, verdict="ambiguous",
                        clusters=[[c[0], c[1]] for c in clusters],
                        why="邻域内共用顶点成 %d 簇（端点 %d 处），方向不明"
                            % (len(clusters), len(tc)))
        coord, n = clusters[0]
        return dict(base, verdict="shared-vertex",
                    coord=[round(coord[0], 5), round(coord[1], 5)],
                    evidence="%d 个共用顶点%s" % (
                        n, "（所邻域内）" if clipped is not shared else ""))
    # 没有严格共用顶点：退到"两侧顶点最近"。同样只在所邻域里找，否则会把几百
    # 公里外另一处相交说成"最近的"。
    aa = ({p for p in a if in_box(p, region)} or a) if region else a
    bb = ({p for p in b if in_box(p, region)} or b) if region else b
    best = min(((km_between(pa, pb), pa, pb) for pa in aa for pb in bb),
               key=lambda x: x[0], default=None)
    if best and best[0] <= near_km:
        return dict(base, verdict="near-endpoint",
                    coord=[round(best[1][0], 5), round(best[1][1], 5)],
                    evidence="两侧顶点最近 %.0fm" % (best[0] * 1000))
    return dict(base, verdict="no-contact",
                why="两走廊最近 %.0fm，超阈值" % ((best[0] if best else 9e9) * 1000))


def reclaim_taken(rows):
    """联络线的两端是两个不同的所：一端已经被别的所判走，另一端就该留给它。

    康山联络线 与 合杭高铁/沪苏湖高铁 各共用一个端点 —— 那本来就是 妙西镇所
    和 康山所 两个所。所以"共用端点成 2 簇"不是死局：把已经被占掉的那一簇
    排除，剩下的就是本所。这不是"离得近就挪过去"，而是一条道岔只能属于一个所。
    """
    taken = [r["coord"] for r in rows
             if r["verdict"] in ("shared-vertex", "near-endpoint") and r.get("coord")]
    for r in rows:
        if r["verdict"] != "ambiguous":
            continue
        free = [c for c in r.get("clusters", [])
                if not any(km_between(c[0], t) <= 0.3 for t in taken)]
        if len(free) != 1:
            continue
        coord, n = free[0]
        r["verdict"] = "shared-vertex"
        r["coord"] = [round(coord[0], 5), round(coord[1], 5)]
        r["evidence"] = "%d 个共用端点（同一份几何的另一端已是别的所）" % n
        r.pop("clusters", None)
        r.pop("why", None)


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
    # 顶点表 + 端点表。端点单独存：线路所就是走廊端点相接的地方，所以"这条 way
    # 是不是整条存进来的"决定了它的两头能不能当道岔尖用。
    way_pts, way_tips = {}, {}

    def add_way(nm, pts, whole=True):
        pts = [tuple(p) for p in pts]
        if len(pts) < 2:
            return
        way_pts.setdefault(nm, []).extend(pts)
        if whole:
            way_tips.setdefault(nm, set()).update((pts[0], pts[-1]))

    for nm, ws in payload["ways"].items():
        for w in ws:
            add_way(nm, w["pts"])
    # 探针顶点缓存：与提取缓存同精度（round 6），所以两边能求同一个共用顶点。
    if os.path.exists(PTS_JSON):
        pts_payload = json.load(open(PTS_JSON, encoding="utf-8"))
        for nm, ws in pts_payload.get("ways", {}).items():
            for w in ws:
                add_way(nm, w["pts"], w.get("whole", True))
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
        plan = probe_plan(llt_obj, ours_stations, way_pts, inv, sidx, artifact, legs)
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
        # 所的邻域框：以所本身为中心（中心取两条邻接线各自紧邻站的平均）
        region = suo_box(suo, lines, llt_obj, sidx)
        # 每条①层线先出候选走廊名（带置信度），再归属：一条 OSM 走廊只认给
        # 匹配度最高的那条线，剩下的几何才是"两条不同的走廊"。
        raw, uncovered = [], []
        for ln in sorted(lines):
            cands, _, covered = geometry_for(suo, lines, ln, llt_obj, ours_stations,
                                             sidx, inv_boxes, way_pts)
            if not cands:
                continue
            raw.append((ln, cands))
            if not covered:
                uncovered.append(ln)
        usable = [(ln, [n for n in got if way_pts.get(n)]) for ln, got in attribute(raw)]
        usable = [(ln, got) for ln, got in usable if got]
        for ln, got in usable:
            if got != [ln]:
                print("    几何认名：%s → %s%s" % (ln, "、".join(got),
                      "（顶点还没到所附近）" if ln in uncovered else ""))
        if len(usable) < 2:
            rows.append({"suo": suo, "owners": sorted(lines), "verdict": "no-partner",
                         "why": "邻接线里只有 %d 条认得出独立的 OSM 走廊" % len(usable)})
            continue
        # 一个所常有两条以上邻接线：两两配对试，有一对判得出交点就算落位。
        pairs = [(usable[i], usable[j])
                 for i in range(len(usable)) for j in range(i + 1, len(usable))]
        verdicts = [judge_pair(suo, x[0], x[1], region, way_pts, way_tips,
                               legs, args.near) for x in pairs]
        for v in verdicts:
            if v["verdict"] in ("shared-vertex", "near-endpoint"):
                break                    # 有一对判得出来就算落位
        else:
            rank = {"same-corridor": 0, "no-contact": 1, "collinear": 2,
                    "ambiguous": 3}
            v = max(verdicts, key=lambda r: rank.get(r["verdict"], -1))
        rows.append(v)

    reclaim_taken(rows)
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
