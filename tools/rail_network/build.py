# -*- coding: utf-8 -*-
"""全国铁路真实径路网络构建器（高铁/城际 + 普速干线）。

流程（线路清单、车站节点、物理区段、状态日期、业务断言驱动）：
1. 载入宁蓉试点 legacy 数据（折线逐点等价迁移，不重算）；
2. 从 China OSM PBF 提取白名单线路 way 与客运站节点（带缓存）；
3. 逐线路解析必须站坐标（OSM 站节点优先，data.js 粗坐标吸附走廊兜底），
   相邻站对在 way 图上 Dijkstra 寻径，与 legacy 区段按无序站对复用合并；
4. 自动补充走廊 1.1km 内的客运站节点，按全线折线里程切分区段；
5. 全局合并共享站对区段（lineIds 多重归属），写入状态日期、可运行
   列车类别（trains）与中途节点索引；
6. 硬校验（端点衔接、连通、长度合理、无重复坐标/区段）后原子写出。

产物：js/rail-route-data.js —— window.RAIL_ROUTE_DATA。
"""

import argparse
import json
import math
import os
import re
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from rail_network import extract as extract_mod  # noqa: E402
from rail_network.geometry import (  # noqa: E402
    WayGraph, dist, dp_simplify, haversine_km, polyline_km, SNAP_MAX,
)
from rail_network.lines import (  # noqa: E402
    BATCH_ORDER, LINES, MANUAL_NODES,
)
from rail_network.legacy_ningrong import LEGACY_DATA  # noqa: E402

ROOT = extract_mod.ROOT
ATTRIBUTION = "铁路几何 © OpenStreetMap contributors · ODbL"

# 自动补站的最大走廊距离（度，约 1.1km）。
AUTO_STATION_TOL = 0.01
# 区段长度合理区间（km）。
SEG_KM_MIN, SEG_KM_MAX = 0.3, 300.0
# 相邻站里程与直线距离的最大比值（直线 >20km 才启用）。
DETOUR_RATIO = 3.0

# 枢纽 unnamed way 提取区：站内渡线/道岔区在 OSM 常无名，是枢纽分量
# 缺口的桥接段（南昌乐化 0.2km 缺口、合肥合福-京港间隙、武汉站出站）。
# bbox 从紧，只覆盖枢纽站场，防止全国范围 unnamed 走廊涌入合并图。
UNNAMED_ZONES = [
    [117.19, 31.79, 117.31, 32.07],   # 合肥枢纽（合肥北城—合肥南—肥西）
    [115.845, 28.795, 115.91, 28.86],  # 南昌乐化（昌九城际↔京九线南昌站区）
    [114.40, 30.52, 114.50, 30.61],    # 武汉站出站段（京广场↔武九客专）
    # 兰州枢纽：陇海正线在 兰州东 以西 13km 处断开，该段在 OSM 多为
    # 无名站场线（实测框内 278 条无名 way），不补则西宁—西安 普速无通路。
    [103.80, 35.98, 104.02, 36.10],    # 兰州—兰州东（陇海西端）
    # 兰州西—兰州 8.8km：兰新/兰青 普速正线经 兰州西（该站普速与高铁共用，
    # 站场走廊在 OSM 多为无名 way），不补则 兰州站 接不进兰新走廊，
    # K1352 西宁—西安 无通路。
    [103.68, 36.00, 103.88, 36.10],    # 兰州西—兰州（兰新正线）
]

# 人工径路覆盖（js/rail-routes.js matchOverride 消费）：
# Dijkstra 按 estLengthKm 取最短路，个别车次的真实走向比网络"最短路"略长，
# 需要显式指定区段序列。segments 必须为有效区段 id，按行进方向排列；
# from/to/train/date 匹配字段越多优先级越高。
MANUAL_ROUTE_OVERRIDES = [
    {
        # G1435 武汉→上海虹桥，武汉—黄山西实际走向：
        # 武石/武冈城际 → 黄黄高铁 → 京港高铁安九段 → 宁安城际 → 池黄高铁。
        # 自动寻径取合武+合安北线（约 655km，比南线短约 5km），与实际不符。
        # 黄黄高铁在 hh-junction（黄梅东站西南道岔）并入安九段：列车
        # 转向黄梅东→宿松东，不经黄梅南站。
        "from": "武汉", "to": "黄山西", "train": "G1435",
        "segments": [
            "wuhan-wu-chang-dong", "wu-chang-dong-he-liu",
            "he-liu-hua-shan-nan", "hua-shan-nan-xin-dian",
            "xin-dian-zuo-ling", "zuo-ling-ge-dian-nan",
            "ge-dian-nan-hua-rong", "hua-rong-hua-rong-dong",
            "hua-rong-dong-huang-gang-xi", "huang-gang-xi-huang-gang",
            "huang-gang-huang-gang-dong", "huang-gang-dong-xi-shui-nan",
            "xi-shui-nan-qi-chun-nan", "qi-chun-nan-wu-xue-bei",
            "wu-xue-bei-zhuo-gang", "zhuo-gang-hh-junction",
            "huang-mei-dong-hh-junction", "su-song-dong-huang-mei-dong",
            "tai-hu-nan-su-song-dong", "qian-shan-tai-hu-nan",
            "an-qing-xi-qian-shan", "an-qing-bei-an-qing-xi",
            "an-qing-bei-an-qing", "chi-zhou-an-qing",
            "chi-zhou-jiu-hua-shan", "jiu-hua-shan-huang-shan-xi",
        ],
    },
]


def norm_name(name):
    """规范化站名用于匹配：仅保留汉字并去尾部'站'字。

    OSM 站名常带维吾尔文/英文后缀（哈密 قۇمۇل 等），非汉字部分剥离。
    """
    s = re.sub(r"[^\u4e00-\u9fff]", "", str(name or ""))
    if len(s) > 2 and s.endswith("站"):
        s = s[:-1]
    return s


def pair_norm(name):
    """站对 key 的轻规范化：去空白与尾部'站'字（保留字母，兼容节点 id）。"""
    s = re.sub(r"\s+", "", str(name or ""))
    if len(s) > 2 and s.endswith("站"):
        s = s[:-1]
    return s


def pair_key(a, b):
    return "|".join(sorted([pair_norm(a), pair_norm(b)]))


# 同站对两条折线视为同一物理走廊的最大相互顶点偏差（度，约 2km）。
# 上下行/站场几米差异、Douglas-Peucker 简化抖动都在容差内；
# 真正的另一条走廊（如同站对南北两线）偏差远超此值，必须分开保留。
CORRIDOR_TOL = 0.02


# 列车类别：动车组 / 普速。线路以 trains 声明自身可运行的类别，区段取
# 所属线路并集；JS 侧按记录类别过滤邻接（js/rail-routes.js）。
KIND_EMU, KIND_CONV = "emu", "conv"
KIND_ORDER = (KIND_EMU, KIND_CONV)
# 未声明 trains 的线路按既成语义视为仅动车组走行（高铁/城际正线）。
KIND_DEFAULT = (KIND_EMU,)


def line_trains(line):
    """线路可运行类别（恒定顺序列表）；非法声明直接失败，不静默降级。"""
    kinds = line.get("trains")
    if not kinds:
        return list(KIND_DEFAULT)
    bad = [k for k in kinds if k not in KIND_ORDER]
    if bad:
        raise SystemExit("线路 %s：trains 含未知类别 %s（可用 %s）"
                         % (line.get("id"), bad, "/".join(KIND_ORDER)))
    return merge_trains([], kinds)


def merge_trains(trains, more):
    """类别并集，顺序恒定（避免并集结果随线路处理顺序漂移）。"""
    found = set(trains or []) | set(more or [])
    return [k for k in KIND_ORDER if k in found]


def _point_seg_dist(p, a, b):
    """点到线段距离（度，欧氏近似）。"""
    ax, ay = a
    bx, by = b
    px, py = p
    dx, dy = bx - ax, by - ay
    if dx == 0 and dy == 0:
        return math.hypot(px - ax, py - ay)
    t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)
    t = max(0.0, min(1.0, t))
    return math.hypot(px - (ax + t * dx), py - (ay + t * dy))


def polyline_gap(pts_a, pts_b):
    """两折线的最大相互顶点距离（度）。"""
    def one_way(pts, ref):
        worst = 0.0
        for p in pts:
            d = min(_point_seg_dist(p, ref[i], ref[i + 1])
                    for i in range(len(ref) - 1))
            worst = max(worst, d)
        return worst

    return max(one_way(pts_a, pts_b), one_way(pts_b, pts_a))


def _bbox_list(bb):
    """osm_bounds 值兼容单个 bbox 与 bbox 列表。"""
    if bb and isinstance(bb[0], (list, tuple)):
        return [list(b) for b in bb]
    return [list(bb)]


def way_in_bboxes(way, bboxes):
    """way 有任一顶点落入任一 bbox（与 extract 的限界判定同一规则）。"""
    return any(bb[0] <= x <= bb[2] and bb[1] <= y <= bb[3]
               for bb in bboxes for x, y in way["pts"])


def extract_wanted(active_lines):
    """提取白名单：每个来源名取最宽请求（不限界优先，否则并集 bbox）。

    某条线把"京九线"当全国干线要（不限界）、另一条线只借它枢纽段时，
    提取必须给全量；各线自己的限界在 line_graph 里生效，互不影响。
    """
    bounds = {}
    wide = set()
    for ln in active_lines:
        own = ln.get("osm_bounds") or {}
        for nm in ln["osm_names"]:
            if nm not in own:
                wide.add(nm)
        for nm, bb in own.items():
            bucket = bounds.setdefault(nm, [])
            for b in _bbox_list(bb):
                if b not in bucket:
                    bucket.append(b)
    return {nm: (None if nm in wide else bounds.get(nm))
            for nm in wide | set(bounds)}


def line_ways(all_ways, line):
    """本线寻径图允许的 way：来源属本线（含显式联络），且过本线自己的限界。

    提取按最宽请求给量（见 extract_wanted），所以限界必须在这里过滤：
    "京九线"作为全国普速干线被全量提取后，昌九城际借它只该拿到
    osm_bounds 圈定的南昌枢纽段，否则普速长走廊会进入高铁分线图、
    改变已验收区段的几何。
    """
    allowed = line_allowed_names(line)
    own = line.get("osm_bounds") or {}
    out = []
    for w in all_ways:
        src = w["src"]
        if src not in allowed and src != "__unnamed__":
            continue
        if src in own and not way_in_bboxes(w, _bbox_list(own[src])):
            continue
        out.append(w)
    return out


def line_allowed_names(line):
    """线路约束寻径的 way 来源白名单：本线归属 + 显式枢纽联络。"""
    allowed = set(line["osm_names"])
    allowed.update((line.get("osm_bounds") or {}).keys())
    # link_names：显式允许的枢纽联络/站场接入线（仅限端点大站
    # 接入借用，如 合肥南→肥西 借沪蓉线出站、深圳北借广深港进站）。
    allowed.update(line.get("link_names") or [])
    return allowed


def same_corridor(pts_a, pts_b, tol=CORRIDOR_TOL):
    """同站对合并判据：物理走廊一致（来源轨道链是否同链由折线近似判断）。"""
    if len(pts_a) < 2 or len(pts_b) < 2:
        return False
    return polyline_gap(pts_a, pts_b) <= tol


def load_data_station_coords():
    """从 js/data.js 提取 station 名 → [lon, lat]（2 位小数粗坐标）。"""
    path = os.path.join(ROOT, "js", "data.js")
    code = open(path, encoding="utf-8").read()
    m = re.search(r"window\.TRAIN_DATA\s*=\s*(\{.*?\});\s*$", code, re.S)
    payload = json.loads(m.group(1))
    return payload.get("stations", {})


def build_station_index(osm_stations):
    idx = {}
    for s in osm_stations:
        idx.setdefault(norm_name(s["name"]), []).append(s)
    return idx


class NodeRegistry:
    """全局车站节点注册表：规范化站名 → node dict。"""

    def __init__(self):
        self.by_name = {}
        self.by_id = {}
        self._slug_seen = {}

    def slug(self, name):
        from pypinyin import lazy_pinyin
        base = "-".join(lazy_pinyin(norm_name(name)))
        n = self._slug_seen.get(base, 0)
        self._slug_seen[base] = n + 1
        return base if n == 0 else "%s-%d" % (base, n + 1)

    def register(self, name, coord, kind="station", source="osm",
                 aliases=None, fixed_id=None):
        nm = norm_name(name)
        node = self.by_name.get(nm)
        if node:
            if dist(node["coord"], coord) > SNAP_MAX:
                print("    ! 站坐标漂移 %s：保留 %s，忽略 %s"
                      % (name, node["coord"], coord))
            return node
        node = {
            "id": fixed_id or self.slug(name),
            "name": str(name).strip(),
            "aliases": aliases or [],
            "kind": kind,
            "source": source,
            "coord": [round(coord[0], 5), round(coord[1], 5)],
        }
        self.by_name[nm] = node
        self.by_id[node["id"]] = node
        return node

    def get(self, name):
        return self.by_name.get(norm_name(name))


def match_osm_station(name, station_index, waygraph, ref_pt):
    """按名匹配 OSM 客运站节点；多候选取距参考点最近且贴走廊者。

    贴走廊校验用 way 全部顶点（站场节点常贴正线 way 中部，
    仅查端点会误判枢纽大站缺失）。
    """
    cands = station_index.get(norm_name(name))
    if not cands:
        return None
    ref = ref_pt if ref_pt is not None else cands[0]["coord"]
    for s in sorted(cands, key=lambda s: dist(s["coord"], ref)):
        d, _ = waygraph.nearest_vertex(s["coord"], radius=SNAP_MAX)
        if d is not None:
            return s["coord"]
    return None


def resolve_line_stations(line, station_index, waygraph, data_coords, registry):
    """解析线路必须站坐标，返回 [(站名, coord, src)]。

    优先级：全局注册表（legacy/先行线路已定位的枢纽站直接复用）
    → OSM 站节点 → data.js 粗坐标吸附走廊 → 线路清单 hints 吸附走廊。
    """
    hints = line.get("station_hints", {})
    resolved = []
    missing = []
    for name in line["stations"]:
        ref = resolved[-1][1] if resolved else None
        node = registry.get(name)
        # 复用全局注册站前校验其坐标贴本线走廊，防止同名异站
        # （如天津/浙江曹庄）把别线坐标错位注入本线。
        if node is not None and waygraph.nearest_vertex(
                node["coord"], radius=SNAP_MAX)[0] is not None:
            resolved.append((name, node["coord"], node["source"]))
            continue
        coord = match_osm_station(name, station_index, waygraph, ref)
        src = "osm"
        if coord is None and name in data_coords:
            coord = snap_rough(waygraph, list(data_coords[name]))
            src = "data-snap"
        if coord is None and name in hints:
            coord = snap_rough(waygraph, list(hints[name]))
            src = "hint-snap"
        if coord is None:
            missing.append((name, ref))
            continue
        resolved.append((name, coord, src))
    if missing:
        detail = []
        for name, ref in missing:
            near = ""
            if ref is not None:
                cands = sorted(
                    ((dist(s["coord"], ref), s["name"], s["coord"])
                     for ss in station_index.values() for s in ss),
                    key=lambda x: x[0])[:4]
                near = "；参考点附近站：" + "; ".join(
                    "%s%s" % (c[1], c[2]) for c in cands)
            detail.append("%s（上一站参考 %s）%s" % (name, ref, near))
        raise SystemExit("线路 %s：%d 站无法定位\n  %s"
                         % (line["id"], len(missing), "\n  ".join(detail)))
    return resolved


def snap_rough(waygraph, rough):
    """把粗坐标吸附到 way 最近顶点（全顶点索引）；失败返回 None。"""
    d, p = waygraph.nearest_vertex(rough, radius=SNAP_MAX)
    if d is None:
        return None
    return list(p)


def insert_via_stops(stops, via_specs, registry, line):
    """把 via 线路所插到显式声明的相邻必须站对之间。

    via_specs 每项为 {"id": 节点id, "between": [前站, 后站]}：
    站序由业务声明确定，不再按"到前站+到后站空间距离"猜插入点——
    距离启发式曾把雷麻店插到 合肥南 前面，生成 雷麻店→合肥南 这类
    与真实站序相反的错误长段。
    """
    out = [list(s) for s in stops]
    for spec in via_specs:
        if not isinstance(spec, dict) or "id" not in spec or "between" not in spec:
            raise SystemExit(
                "线路 %s：via_nodes 项需为 {id, between:[前站,后站]}，收到 %r"
                % (line["id"], spec))
        vid = spec["id"]
        node = registry.by_id.get(vid)
        if node is None:
            raise SystemExit("线路 %s：via 节点 %s 未注册" % (line["id"], vid))
        a_name, b_name = spec["between"]
        ia = next((i for i, s in enumerate(out)
                   if norm_name(s[0]) == norm_name(a_name)), None)
        ib = next((i for i, s in enumerate(out)
                   if norm_name(s[0]) == norm_name(b_name)), None)
        if ia is None or ib is None or ib != ia + 1:
            raise SystemExit(
                "线路 %s：via %s 声明的站对 %s→%s 不是站序中的相邻必须站"
                % (line["id"], vid, a_name, b_name))
        out.insert(ib, [node["name"], node["coord"], "via"])
    return [tuple(s) for s in out]


def stitch_line(line, resolved, waygraph, legacy_pair_map, registry):
    """相邻站对寻径，返回 (blocks, 全线折线, 断点列表)。

    block = {"a","b","pts","legacy","serviceDate"}；
    legacy 命中时整段复用试点折线（等价迁移）。
    """
    pts_all = []
    breaks = []          # (站名, 全线折线索引)
    blocks = []
    date_map = {(d["from"], d["to"]): d["serviceDate"]
                for d in line.get("date_overrides", [])}

    stops = list(resolved)
    if line.get("via_nodes"):
        stops = insert_via_stops(stops, line["via_nodes"], registry, line)

    for i in range(len(stops) - 1):
        a_name, a_coord, _ = stops[i]
        b_name, b_coord, _ = stops[i + 1]
        seg_date = date_map.get((a_name, b_name), line["serviceDate"])
        pts = None
        legacy_id = legacy_pair_map.get(pair_key(a_name, b_name))
        if legacy_id:
            pts = list(legacy_id["pts_for_line"])
            legacy_id = legacy_id["seg"]["id"]
        if pts is None:
            pts = waygraph.route(a_coord, b_coord)
            if pts is None:
                raise SystemExit("线路 %s：站对 %s → %s 寻径失败"
                                 % (line["id"], a_name, b_name))
            if dist(pts[0], a_coord) > 1e-9:
                pts.insert(0, list(a_coord))
            if dist(pts[-1], b_coord) > 1e-9:
                pts.append(list(b_coord))
        blocks.append({"a": a_name, "b": b_name, "pts": pts,
                       "legacy": legacy_id, "serviceDate": seg_date})
        if pts_all:
            pts_all.extend(pts[1:])
        else:
            pts_all.extend(pts)
        breaks.append((b_name, len(pts_all) - 1))
    breaks.insert(0, (stops[0][0], 0))
    return blocks, pts_all, breaks


def project_index(pts, coord, max_d):
    """coord 在折线 pts 上的最近顶点索引；超 max_d 返回 None。"""
    best_d, best_i = None, None
    for i, p in enumerate(pts):
        d = dist(p, coord)
        if d <= max_d and (best_d is None or d < best_d):
            best_d, best_i = d, i
    return best_i


def prune_excursions(pts, eps=2.5e-3, min_gap=3):
    """移除折线中的"原地折返"刺。

    走廊寻径在站场/岔区偶发往返毛刺：路径下探某方向支线后再原路
    折回（A→B→C→B→A），画出来是一节多出的断头线。正线区段不会
    二次经过同一位置，故"重访"即可判定为毛刺：保留首次到达，丢弃
    两次访问之间的全部往返点。

    双线区段的去程/回程顶点可能不严格重合（上下行平行、各自采点，
    坐标差可达 ~1e-3°），因此重访判定带容差 eps（约 250m）；
    同时要求重访点与当前点间隔至少 min_gap 个顶点，避免把正常的
    连续密点（相邻点距小于容差）误判为折返。
    """
    out = []
    for p in pts:
        hit = None
        for i, q in enumerate(out):
            if len(out) - i < min_gap:
                break
            if abs(p[0] - q[0]) < eps and abs(p[1] - q[1]) < eps:
                hit = i
        if hit is None:
            out.append(p)
        else:
            del out[hit + 1:]
    return out


def cut_line_segments(line, resolved, blocks, pts_all, breaks, registry,
                      payload, legacy_nodes, out_segments, legacy_km_map=None):
    """块区间 → 自动补站 → 切分区段 → 全局合并。

    返回 (补站数, 新增区段数)；数据异常（must 站断点重叠/过近、
    里程超界、绕行比异常）抛 SystemExit，由调用方按线路失败处理。
    """
    lid = line["id"]
    trains = line_trains(line)

    # 块在全线折线中的区间（首尾相接）。
    block_ranges = []
    start = 0
    for blk in blocks:
        end = start + len(blk["pts"]) - 1
        block_ranges.append((blk, start, end))
        start = end

    # 自动补站：走廊 1.1km 内、仅落在本线新提取（非 legacy）块上。
    auto_added = []
    seen_names = {norm_name(s[0]) for s in resolved}
    seen_names.update(norm_name(n["name"]) for n in legacy_nodes)
    seen_names.update(norm_name(n["name"]) for n in MANUAL_NODES)
    for s in payload["stations"]:
        nm = norm_name(s["name"])
        if nm in seen_names:
            continue
        for blk, lo, hi in block_ranges:
            if blk["legacy"]:
                continue
            window = pts_all[lo:hi + 1]
            idx = project_index(window, s["coord"], AUTO_STATION_TOL)
            if idx is not None:
                auto_added.append((s["name"], lo + idx, s["coord"]))
                seen_names.add(nm)
                break
    kept_auto = []
    must_coords = [c for _, c, _ in resolved]
    for name, gi, coord in auto_added:
        if any(dist(coord, mc) < 0.015 for mc in must_coords):
            # 与必须站同站场（更名站如上海松江/松江南），跳过避免
            # 同位双节点产生零长度区段。
            continue
        node = registry.get(name)
        if node is not None and dist(node["coord"], coord) > SNAP_MAX:
            # 同名异站（已有同名节点且位置明显不同）：跳过注册与断点，
            # 避免 registry 坐标与本线折线位置错位导致校验断裂。
            print("    ! 跳过同名异站 %s（本线 %s，已注册 %s）"
                  % (name, coord, node["coord"]))
            continue
        # 新站以折线投影点注册：节点 coord 与区段折线端点保持一致
        # （OSM 站点原始坐标可偏离轨道 ~1.1km，会导致端点脱钩）。
        proj = [float(pts_all[gi][0]), float(pts_all[gi][1])]
        registry.register(name, proj, source="osm")
        kept_auto.append((name, gi))

    # 切分：must 站断点恒定；auto 断点与相邻断点投影重叠/过近时移除。
    all_breaks = sorted(
        [(gi, name, True) for name, gi in kept_auto] +
        [(bi, bn, False) for bn, bi in breaks])

    def _km(ia, ib):
        return polyline_km(pts_all[ia:ib + 1])

    pruned = True
    while pruned:
        pruned = False
        for i in range(len(all_breaks) - 1):
            ia, na, auto_a = all_breaks[i]
            ib, nb, auto_b = all_breaks[i + 1]
            overlap = ib <= ia
            too_close = (not overlap) and _km(ia, ib) < SEG_KM_MIN
            if not (overlap or too_close):
                continue
            drop = i + 1 if auto_b else (i if auto_a else None)
            if drop is None:
                raise SystemExit("线路 %s：断点 %s/%s %s"
                                 % (lid, na, nb,
                                    "投影重叠" if overlap
                                    else "间距 %.2fkm 过近" % _km(ia, ib)))
            print("    ! 移除过近补站 %s（相邻区段 <%.2fkm）"
                  % (all_breaks[drop][1], SEG_KM_MIN))
            all_breaks.pop(drop)
            pruned = True
            break

    n_new = 0
    for i in range(len(all_breaks) - 1):
        ia, na, _ = all_breaks[i]
        ib, nb, _ = all_breaks[i + 1]
        if ib <= ia:
            continue
        seg_pts = pts_all[ia:ib + 1]
        # legacy 块折线逐点等价迁移，禁用修剪；其余块剪掉折返毛刺。
        block = next(b for b, lo, hi in block_ranges if lo <= ia < hi)
        if not block["legacy"]:
            seg_pts = prune_excursions(seg_pts)
        node_a = registry.get(na)
        node_b = registry.get(nb)
        # 端点吸附：折线首尾统一校正为注册站坐标，保证产物中
        # 「折线端点 == 节点 coord」精确成立（JS 端容差 0.001 度）。
        # 阈值单位是公里（dist 是度：<2.0 度会允许 ~200km 量级的
        # 端点改写，完全掩盖吸附错误），且仅限站场微差范围。
        if haversine_km(seg_pts[0], node_a["coord"]) < 2.0:
            seg_pts[0] = list(node_a["coord"])
        if haversine_km(seg_pts[-1], node_b["coord"]) < 2.0:
            seg_pts[-1] = list(node_b["coord"])
        full_km = polyline_km(seg_pts)
        if not (SEG_KM_MIN <= full_km <= SEG_KM_MAX):
            raise SystemExit("线路 %s：区段 %s-%s 里程 %.2fkm 超界"
                             % (lid, na, nb, full_km))
        straight = haversine_km(seg_pts[0], seg_pts[-1])
        if straight > 20 and full_km > straight * DETOUR_RATIO:
            raise SystemExit("线路 %s：区段 %s-%s 绕行比异常 %.1f（%.1fkm）"
                             % (lid, na, nb, full_km / straight, full_km))
        simplified = [[round(x, 5), round(y, 5)] for x, y in dp_simplify(seg_pts)]
        # 同站对合并判据：物理走廊一致才并入（补 lineIds/开通日期）。
        # 两条不同线路连接同一对站（如同站对南北两线）是不同物理区段，
        # 必须都保留——此前按无序站对直接去重，第二条折线被丢弃，
        # 其 lineIds 却并进第一条，后续选径无法找回备选路线。
        seg_key = pair_key(na, nb)
        dup = next(
            (s for s in out_segments.values()
             if s.get("_pairKey") == seg_key
             and same_corridor(s["polyline"], simplified)),
            None)
        if dup is not None:
            if lid not in dup["lineIds"]:
                dup["lineIds"].append(lid)
            if block["serviceDate"] < dup["serviceDate"]:
                dup["serviceDate"] = block["serviceDate"]
            # 共线区段（如高铁与既有线在同一站对共走廊）任一类别可运行
            # 即可供该类记录走行。
            dup["trains"] = merge_trains(dup.get("trains"), trains)
            continue
        # legacy 块的里程沿用试点固化值（等价迁移：折线与里程均不变）。
        est_km = round(full_km, 2)
        if block["legacy"] and legacy_km_map:
            est_km = legacy_km_map.get(block["legacy"], est_km)
        base_id = block["legacy"] or ("%s-%s" % (node_a["id"], node_b["id"]))
        seg_id = base_id
        n_dup = 2
        while seg_id in out_segments:
            seg_id = "%s-%d" % (base_id, n_dup)
            n_dup += 1
        out_segments[seg_id] = {
            "id": seg_id,
            "name": line["name"],
            "from": node_a["id"], "to": node_b["id"],
            "lineIds": [lid],
            "trains": list(trains),
            "serviceDate": block["serviceDate"],
            "estLengthKm": est_km,
            "polyline": simplified,
            "_legacySeg": block["legacy"],
            # 站名空间的站对 key（from/to 是节点 id，两种 key 空间
            # 不能混用；写产物前剥掉）。
            "_pairKey": seg_key,
        }
        n_new += 1
    return len(kept_auto), n_new


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--batches", default=",".join(BATCH_ORDER),
                        help="仅构建指定批次（逗号分隔，如 A,B）；legacy 恒定包含")
    parser.add_argument("--force-extract", action="store_true")
    args = parser.parse_args(argv)
    batches = [b.strip().upper() for b in args.batches.split(",") if b.strip()]

    # 线路清单的类别声明先行校验：trains 写错是清单笔误，不能让某条
    # optional 线路把它当"提取失败"吞掉。
    trains_by_line = {ln["id"]: line_trains(ln) for ln in LINES}

    legacy_nodes = LEGACY_DATA["nodes"]
    legacy_segments = LEGACY_DATA["segments"]
    legacy_id2name = {n["id"]: n["name"] for n in legacy_nodes}
    legacy_pair_map = {}
    for seg in legacy_segments:
        entry = {
            "seg": seg, "pts_for_line": [list(p) for p in seg["polyline"]],
        }
        # 双键：segments 的 from/to 是 node id，而 stitch_line 用站名查询，
        # 两套键都要注册，否则 legacy 复用静默失效（区段被 OSM 重算，
        # 且未复用的 legacy 附加段与重算区段在 validate 撞车）。
        legacy_pair_map[pair_key(seg["from"], seg["to"])] = entry
        na = legacy_id2name.get(seg["from"])
        nb = legacy_id2name.get(seg["to"])
        if na and nb:
            legacy_pair_map.setdefault(pair_key(na, nb), entry)
    print("legacy 宁蓉：%d 节点 / %d 区段" % (len(legacy_nodes), len(legacy_segments)))

    registry = NodeRegistry()
    for n in legacy_nodes:
        registry.register(n["name"], n["coord"], kind=n["kind"],
                          source=n["source"], aliases=n.get("aliases"),
                          fixed_id=n["id"])
    for n in MANUAL_NODES:
        registry.register(n["name"], n["coord"], kind=n["kind"],
                          source=n["source"], aliases=n.get("aliases"),
                          fixed_id=n["id"])

    data_coords = load_data_station_coords()

    active_lines = [ln for ln in LINES if ln["batch"] in batches]
    # 提取白名单：同名线路可能被不同线借用（"京九线"既被批次 D 的昌九
    # 城际/昌赣按 bbox 借作南昌枢纽接入段，又是批次 F 的全国普速干线）。
    # 提取按最宽请求执行（有一条线不限界就全量取），限界下沉到分线图
    # （line_graph 按各线自己的 osm_bounds 过滤 way），否则后写的 bbox
    # 会覆盖先写的，全国普速干线永远取不到。
    wanted = extract_wanted(active_lines)
    wanted["__unnamed__"] = [list(b) for b in UNNAMED_ZONES]
    payload = extract_mod.extract(wanted, force=args.force_extract)
    ways_by_name = payload["ways"]
    # 来源名"写了但没提取到"必须是可见的：osm_names 只影响提取白名单，
    # link_names 只放行不提取，名字打错或没人全量提取时会静默变成空操作
    # （曾把"余花联络线"只写进 link_names，以为借到了接入段，实际没提取）。
    for line in active_lines:
        silent = [nm for nm in list(line["osm_names"]) + list(line.get("link_names") or [])
                  if nm not in ways_by_name]
        if silent:
            print("    ! %s 来源名无提取结果（检查拼写，或按 osm_bounds 借用）：%s"
                  % (line["id"], silent))
    station_index = build_station_index(payload["stations"])
    meta = payload.get("meta", {})

    # 全网合并图：枢纽站本就是多线交汇，分线建图会在站场端点处断裂；
    # 该图仅用于站坐标贴走廊判定与粗坐标吸附，区段几何始终由分线图
    # （line_graph）寻径得到，因此混入普速干线 way 不会污染高铁区段。
    # 每个 way 记录来源名（osm_names 白名单键），供分线约束寻径使用。
    all_ways = []
    for nm, ws in ways_by_name.items():
        for w in ws:
            w["src"] = nm
            all_ways.append(w)
    # 传入副本：WayGraph 持有列表引用，全局补桥的虚拟 way（无 src）
    # 不得回流进 all_ways，否则分线约束筛选会 KeyError。
    waygraph = WayGraph(list(all_ways))
    # 补桥半径 0.004°（~450m）：只弥合站内渡线/道岔的毫厘级断点。
    # 0.015° 曾一次生成 600 条未核验虚拟桥，且桥权重量级错误时
    # 会制造远短于真实铁路的假捷径。
    n_bridges = sum(waygraph.bridge_zone(list(b), max_gap=0.004) for b in UNNAMED_ZONES)
    n_comps = len(set(waygraph.comp_of.values()))
    print("全局 way 图：%d ways（含枢纽补桥 %d）/%d 端点 / %d 分量"
          % (len(all_ways), n_bridges, len(waygraph.node_pos), n_comps))

    def line_graph(line):
        """线路约束寻径图：仅允许本线 way + 显式联络/枢纽 unnamed 段。

        osm_names 只决定哪些 way 加入全网，不约束"本线区段"该走哪些
        way；用全网图寻径会把任意最短路重新标成本线（京沪南京南→
        镇江南曾混入沪宁城际/仙宁线 95 条 way）。这里把图收缩到本线
        归属（line_allowed_names），另保留 UNNAMED_ZONES 内的
        站内渡线段作为显式允许的枢纽联络。
        提取按最宽请求给量，本线 osm_bounds 在这里过滤：借用的来源名
        只保留限界内的 way，普速长走廊不会进入高铁分线图。
        """
        g = WayGraph(line_ways(all_ways, line))
        for b in UNNAMED_ZONES:
            g.bridge_zone(list(b), max_gap=0.004)
        # 本线声明的节点补桥点：OSM 常把同一正线切成首尾相距几十米的
        # 相邻 way（节点未合并），分线图在此断开。只桥接本线自己的 way，
        # 不影响其他线路的分线图。
        for b in line.get("gap_bridges") or []:
            g.bridge_zone(list(b), max_gap=0.004)
        return g

    line_graphs = {}

    out_segments = {}     # seg_id -> segment dict（含 _legacySeg 内部标记；
                          # 同站对允许多个不同物理走廊的区段共存）
    line_summaries = []
    skipped = []
    failures = []

    for line in active_lines:
        lid = line["id"]
        trains = trains_by_line[lid]
        n_line_ways = sum(len(ways_by_name.get(nm, [])) for nm in line["osm_names"])
        try:
            if not n_line_ways:
                raise SystemExit("OSM 无任何 way（names=%s）" % line["osm_names"])
            resolved = resolve_line_stations(line, station_index, waygraph,
                                             data_coords, registry)
            for name, coord, src in resolved:
                registry.register(name, coord, source=src)
            graph = line_graphs.get(lid)
            if graph is None:
                graph = line_graph(line)
                line_graphs[lid] = graph
            blocks, pts_all, breaks = stitch_line(
                line, resolved, graph, legacy_pair_map, registry)
            n_auto, _n_new = cut_line_segments(
                line, resolved, blocks, pts_all, breaks, registry,
                payload, legacy_nodes, out_segments,
                legacy_km_map={s["id"]: s["estLengthKm"]
                               for s in legacy_segments})
            line_summaries.append({
                "id": lid, "name": line["name"], "batch": line["batch"],
                "from": registry.get(line["from"])["id"],
                "to": registry.get(line["to"])["id"],
                "serviceDate": line["serviceDate"],
                "trains": trains,
            })
        except SystemExit as exc:
            if line.get("optional"):
                print("  [跳过] %s（optional）：%s" % (lid, exc))
                skipped.append({"id": lid, "name": line["name"],
                                "reason": str(exc)})
                continue
            print("  [失败] %s：%s" % (lid, exc))
            failures.append({"id": lid, "reason": str(exc)})
            continue

        print("  %-20s %2d 必须 %2d 块 %2d 补站  %s"
              % (lid, len(resolved), len(blocks), n_auto, line["name"]))

    # ---- legacy 附加区段（绕行线/京广接入段等，不在线路站序中） ----
    covered_legacy = {s.get("_legacySeg") for s in out_segments.values()}
    ningrong_trains = trains_by_line["ningrong"]
    final_segments = []
    for seg in legacy_segments:
        if seg["id"] in covered_legacy:
            # 已被某线 stitch 复用：把宁蓉归属并入该区段，保持
            # 「试点区段 lineIds 必含宁蓉」的等价迁移语义。
            for s in out_segments.values():
                if s["id"] == seg["id"] and "ningrong" not in s["lineIds"]:
                    s["lineIds"].append("ningrong")
                    s["trains"] = merge_trains(s.get("trains"), ningrong_trains)
            continue
        # 同站对且物理走廊一致时才视为已覆盖；走廊不同（另一条线）
        # 则作为独立区段保留，不再按站对静默丢弃。
        existing = [s for s in out_segments.values()
                    if pair_key(s["from"], s["to"])
                    == pair_key(seg["from"], seg["to"])]
        if any(same_corridor(seg["polyline"], s["polyline"]) for s in existing):
            continue
        final_segments.append({
            "id": seg["id"], "name": seg["name"],
            "from": seg["from"], "to": seg["to"],
            "lineIds": ["ningrong"], "trains": list(ningrong_trains),
            "serviceDate": "2009-04-01",
            "estLengthKm": seg["estLengthKm"], "polyline": seg["polyline"],
        })
    for entry in out_segments.values():
        entry.pop("_legacySeg", None)
        entry.pop("_pairKey", None)
        final_segments.append(entry)

    validate(final_segments, registry)

    # ---- 节点输出：legacy 在前，其余按注册序 ----
    # dict.fromkeys 去重：jg-junction 同时定义于 legacy 与 MANUAL_NODES，
    # 直接拼接会让同一节点在产物中出现两次。
    legacy_ids = list(dict.fromkeys(
        [n["id"] for n in legacy_nodes] + [n["id"] for n in MANUAL_NODES]))
    nodes_out = [registry.by_id[i] for i in legacy_ids]
    for node in registry.by_id.values():
        if node["id"] not in legacy_ids:
            nodes_out.append(node)

    lines_out = sorted(line_summaries,
                       key=lambda l: (BATCH_ORDER.index(l["batch"]), l["id"]))
    payload_out = {
        "source": {
            "provider": "OpenStreetMap",
            "snapshotDate": meta.get("snapshotDate", ""),
            "sha256": meta.get("sha256", ""),
            "attribution": ATTRIBUTION,
            "extract": "Geofabrik China OSM PBF 铁路 way 提取；"
                       "宁蓉试点区段自提交 8740690 等价迁移",
            "buildVersion": 3,
            "skippedLines": skipped,
        },
        "lines": lines_out,
        "nodes": nodes_out,
        "segments": final_segments,
        "overrides": MANUAL_ROUTE_OVERRIDES,
    }

    body = json.dumps(payload_out, ensure_ascii=False, indent=1)
    js = (
        "// 由 tools/build_rail_route_data.py 生成，请勿手工编辑。\n"
        "// 全国铁路真实径路网络（高铁/城际 + 普速干线）：\n"
        "// 线路/节点/物理区段/状态日期/可运行列车类别(trains)/覆盖。\n"
        "// 坐标约定：[lon, lat]，与 data.js stations 一致。\n"
        "(function (root) {\n"
        "  'use strict';\n"
        "  var RAIL_ROUTE_DATA = %s;\n"
        "  root.RAIL_ROUTE_DATA = RAIL_ROUTE_DATA;\n"
        "})(typeof window !== 'undefined' ? window : globalThis);\n" % body
    )
    if failures:
        print("\n%d 条线路构建失败，未写出产物：%s"
              % (len(failures), ", ".join(f["id"] for f in failures)))
        sys.exit(1)
    out_path = os.path.join(ROOT, "js", "rail-route-data.js")
    fd, tmp = tempfile.mkstemp(dir=os.path.dirname(out_path), suffix=".tmp")
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        f.write(js)
    os.replace(tmp, out_path)
    print("\n已写出 %s（%.1f KB）：%d 线路 / %d 节点 / %d 区段"
          % (out_path, len(js) / 1024, len(lines_out), len(nodes_out),
             len(final_segments)))
    if skipped:
        print("跳过线路：%s" % ", ".join(s["id"] for s in skipped))


def validate(segments, registry):
    """生成期硬校验：端点衔接、连通、长度、重复。"""
    adj = {}
    for s in segments:
        if s["from"] == s["to"]:
            raise SystemExit("区段 %s 起终点相同" % s["id"])
        for end in (s["from"], s["to"]):
            if end not in registry.by_id:
                raise SystemExit("区段 %s 端点节点缺失：%s" % (s["id"], end))
        adj.setdefault(s["from"], set()).add(s["to"])
        adj.setdefault(s["to"], set()).add(s["from"])
        pts = s["polyline"]
        if len(pts) < 2:
            raise SystemExit("区段 %s 折线过短" % s["id"])
        for i in range(len(pts) - 1):
            if pts[i] == pts[i + 1]:
                raise SystemExit("区段 %s 存在连续重复坐标" % s["id"])
        for end, pt in ((s["from"], pts[0]), (s["to"], pts[-1])):
            want = registry.by_id[end]["coord"]
            gap_deg = dist(pt, want)
            gap_km = haversine_km(pt, want)
            if gap_deg > 1e-6 and gap_km > 2.0 * 111.32 / 111.32:
                # 端点必须与折线相接（同点或近邻），>2km 即断裂。
                raise SystemExit("区段 %s 端点 %s 与折线断裂 %.2fkm"
                                 % (s["id"], end, gap_km))
    seen_ids = set()
    for s in segments:
        # 同站对允许存在多个物理区段（两条线路连接同一对站），
        # 只拒绝完全重复的区段 id。
        if s["id"] in seen_ids:
            raise SystemExit("重复区段 id：%s" % s["id"])
        seen_ids.add(s["id"])
    print("校验通过：%d 区段 / %d 节点" % (len(segments), len(registry.by_id)))


if __name__ == "__main__":
    main()
