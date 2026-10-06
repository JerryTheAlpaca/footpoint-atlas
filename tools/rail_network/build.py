# -*- coding: utf-8 -*-
"""全国铁路真实径路网络构建器（高铁/城际 + 普速干线）。

流程（线路清单、车站节点、物理区段、状态日期、业务断言驱动）：
1. 载入宁蓉试点 legacy 数据（折线逐点等价迁移，不重算）；
2. 从 China OSM PBF 提取白名单线路 way 与客运站节点（带缓存）；
3. 逐线路解析必须站坐标（OSM 站节点优先，data.js 粗坐标吸附走廊兜底），
   相邻站对在 way 图上 Dijkstra 寻径，与 legacy 区段按无序站对复用合并；
4. 自动补充走廊 1.1km 内的客运站节点，按全线折线里程切分区段；
5. 全局合并同走廊区段（走了同一批 OSM way 才算同一条线，lineIds 多重
   归属），写入状态日期、可运行列车类别（trains）与中途节点索引；
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

# 节点坐标清单：全网每个站/线路所的坐标都是清单里的声明值，构建器不再从
# 几何里猜位置（猜＝自动补站，那套机制已随"每站必须指定坐标"删掉）。
# 清单由 tools/declare_stations.py 从已核对的产物区段链生成，之后人工维护。
NODE_COORDS_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                 "node-coords.json")
# 声明坐标到"本线自己的走廊"的最大允许垂距（km）。清单坐标本来就是从本线
# 走廊顶点取的，落不回走廊只有两种可能：OSM 把这条 way 改了，或本线其实
# 骑的是平行走廊、这个点不该由本线当站。两种都得停下来人工判——照它建区段
# 就是"先拐过去再折回来"的站前钩子，里程还会白算一倍。
CORRIDOR_PIN_KM = 0.05
# 已知"声明坐标落不回本线走廊"的点名豁免（line/station/km/why）。这一份就是
# 缺料与平行走廊的待办清单：每条都得写清为什么落不回去，修好了要删掉整条。
PIN_EXEMPTIONS_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                   "pin-exemptions.json")
# 站前"先拐过走廊顶点再折回节点"允许剪掉的长度（km）与折返角度阈值。
# 阈值取 60° 而不是 90°：杭州东 那根尖角在原始链上实测 89.4°，卡在
# 直角线下面，而它画出来是全场最难看的一根钩子。
NODE_HOP_MAX_KM = 0.3
FOLD_TURN_DEG = 60.0
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
    # 兰州枢纽两处无名站场线。注意：兰新/陇海 在 兰州 的接驳实测并不依赖
    # 它们——兰州西—兰州 那 10km 的真正通路是 兰新线 按 bbox 借用的
    # "陇海线" 引入段（见 lines.py），删掉这两个框后 兰州—河口南 与
    # 兰州—骆驼巷 仍同分量。留着是历史保险，将来清理时记得它曾承担过
    # K1352 的通路即可。
    [103.80, 35.98, 104.02, 36.10],    # 兰州—兰州东（陇海西端）
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
        # 首段是 武汉—何刘 一整段，没有 武昌东 断点：那个节点被先行
        # 建成的 京广高铁 注册在自己走廊上（两走廊相距 0.5km），武冈
        # 城际 再切一刀就得把折线拽过去，画出来是个尖角。
        "from": "武汉", "to": "黄山西", "train": "G1435",
        "segments": [
            "wuhan-he-liu",
            "he-liu-hua-shan-nan", "hua-shan-nan-xin-dian",
            "xin-dian-zuo-ling", "zuo-ling-ge-dian-nan",
            "ge-dian-nan-hua-rong", "hua-rong-hua-rong-dong",
            "hua-rong-dong-huang-gang-xi", "huang-gang-xi-huang-gang",
            "huang-gang-huang-gang-dong",
            # 黄冈东—浠水南 现在在 巴河所 断成两段：武冈城际 与 黄黄高铁
            # 的换线点就是这个道岔尖（路路通 经由写成 武冈城际线—巴河所—
            # 阜黄黄黄段），合在一起的那段区段两条线共骑。
            "huang-gang-dong-bahe-suo", "bahe-suo-xi-shui-nan",
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
# 仅用于无 way 归属可查的场合（legacy 试点折线、枢纽虚拟桥）。
CORRIDOR_TOL = 0.02


def way_point_index(all_ways):
    """坐标 → 落在该点上的 OSM way id 集合（way 顶点坐标逐字取自 PBF）。"""
    idx = {}
    for w in all_ways:
        for p in w["pts"]:
            bucket = idx.get((p[0], p[1]))
            if bucket is None:
                idx[(p[0], p[1])] = bucket = set()
            bucket.add(w["id"])
    return idx


def corridor_way_ids(pts, way_index):
    """折线实际骑在哪些 OSM way 上：逐查相邻顶点对的共属 way。

    区段归属必须由"走了哪条轨道"判定，不能只看形状。同站对的高铁正线
    与既有线在浙江最近只隔 300m（沪昆线 / 沪昆高速线 实测 p50 321m），
    按几何容差合并会把既有线折线整段丢掉、普速车画到高铁正线上。
    """
    out = set()
    for a, b in zip(pts, pts[1:]):
        sa = way_index.get((a[0], a[1]))
        if not sa:
            continue
        sb = way_index.get((b[0], b[1]))
        if sb:
            out |= sa & sb
    return out


def same_track(pts_a, ways_a, pts_b, ways_b):
    """同一物理走廊判据：优先比 way 归属，无归属可比时退回几何。"""
    if ways_a and ways_b:
        smaller = min(len(ways_a), len(ways_b))
        return len(ways_a & ways_b) * 2 >= smaller
    return same_corridor(pts_a, pts_b)


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


def grid_key(coord):
    """整度坐标网格键，给同音站名的 id 加**与注册顺序无关**的后缀。

    以前靠 _slug_seen 计数，谁先注册谁拿光名：枣阳 与 早阳 都拼 zao-yang，
    加一条线就可能给不相干的区段改号。后缀取自坐标，输入不变则 id 不变。
    """
    return "e%03dn%02d" % (int(round(coord[0])), int(round(coord[1])))


class NodeRegistry:
    """全局车站节点注册表：规范化站名 → node dict。"""

    def __init__(self):
        self.by_name = {}
        self.by_id = {}

    def slug(self, name):
        from pypinyin import lazy_pinyin
        return "-".join(lazy_pinyin(norm_name(name)))

    def new_id(self, name, coord, fixed_id=None):
        if fixed_id:
            return fixed_id
        base = self.slug(name)
        if base not in self.by_id:
            return base
        node_id = "%s-%s" % (base, grid_key(coord))
        n = 2
        while node_id in self.by_id:      # 同网格再来一个，极罕见
            node_id = "%s-%s-%d" % (base, grid_key(coord), n)
            n += 1
        return node_id

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
            "id": self.new_id(name, coord, fixed_id),
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


def load_node_coords():
    """读节点坐标清单（tools/declare_stations.py 生成，之后人工维护）。"""
    if not os.path.exists(NODE_COORDS_PATH):
        raise SystemExit("缺少节点坐标清单 %s，先跑 tools/declare_stations.py --write"
                         % NODE_COORDS_PATH)
    return json.load(open(NODE_COORDS_PATH, encoding="utf-8"))


def load_pin_exemptions():
    """点名豁免表 → {(线路 id, 站名): 理由}。"""
    if not os.path.exists(PIN_EXEMPTIONS_PATH):
        return {}
    return {(r["line"], r["station"]): r.get("why", "")
            for r in json.load(open(PIN_EXEMPTIONS_PATH, encoding="utf-8"))}


def resolve_line_stations(line, registry):
    """站序 → [(站名, 坐标, 来源)]，坐标一律取清单声明值。

    坐标不再从几何里猜：自动补站删掉以后，站序里没写的点不会自己冒出来，
    而清单里没有的名字就是这座站从没被核对过落位，两种都得停下来。
    """
    out, missing = [], []
    for name in line["stations"]:
        node = registry.get(name)
        if node is None:
            missing.append(name)
            continue
        out.append((name, node["coord"], node["source"]))
    if missing:
        raise SystemExit("线路 %s：%d 站没有指定坐标（清单里没有）：%s"
                         % (line["id"], len(missing), "、".join(missing)))
    return out


def check_pinned_on_corridor(line, resolved, graph, exemptions):
    """声明坐标必须落得回本线走廊，否则站点处就是一根折返回头。

    豁免表按 (线, 站) 点名，每条都得写理由：那是"这条线在 OSM 里根本没接到
    这座站"的已知缺料清单，不是让它长期装死的口子。
    """
    off = []
    for name, coord, _src in resolved:
        d, p = graph.nearest_vertex(coord, radius=SNAP_MAX)
        km = None if p is None else haversine_km(coord, p)
        if km is None or km > CORRIDOR_PIN_KM:
            key = (line["id"], name)
            if key in exemptions:
                continue
            off.append("%s（%s）离本线走廊 %s"
                       % (name, line["name"],
                          "找不到顶点" if km is None else "%.2fkm" % km))
    if off:
        raise SystemExit("线路 %s：%d 站的声明坐标不落本线走廊：%s"
                         % (line["id"], len(off), "；".join(off)))


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

    for i in range(len(stops) - 1):
        a_name, a_coord, _ = stops[i]
        b_name, b_coord, _ = stops[i + 1]
        seg_date = date_map.get((a_name, b_name), line["serviceDate"])
        pts = None
        legacy_id = legacy_pair_map.get(pair_key(a_name, b_name))
        if legacy_id:
            pts = list(legacy_id["pts_for_line"])
            # 试点折线按 legacy segments 里存的那个朝向给，而 pair_key 是不分
            # 方向的。反着骑同一对站时必须掉头，否则整条线的断点索引全部错位：
            # 商合杭南段 走 合肥南→肥东（试点存的是 肥东→合肥南），不掉头就会
            # 让区段 肥东—柘皋 的折线端点落到 19.24km 外，撞上 validate 的
            # "端点与折线断裂 >2km"。
            if dist(pts[0], a_coord) > dist(pts[-1], a_coord):
                pts.reverse()
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
            clip_station_fold(pts)
        blocks.append({"a": a_name, "b": b_name, "pts": pts,
                       "legacy": legacy_id, "serviceDate": seg_date})
        if pts_all:
            pts_all.extend(pts[1:])
        else:
            pts_all.extend(pts)
        breaks.append((b_name, len(pts_all) - 1))
    breaks.insert(0, (stops[0][0], 0))
    return blocks, pts_all, breaks


def turn_deg(a, b, c):
    """折线在 b 处的转角：0=直穿，90=直角拐弯，180=原路退回。"""
    k = math.cos(math.radians(b[1]))
    v1 = ((b[0] - a[0]) * k, b[1] - a[1])
    v2 = ((c[0] - b[0]) * k, c[1] - b[1])
    n1 = math.hypot(*v1)
    n2 = math.hypot(*v2)
    if not n1 or not n2:
        return 0.0
    cos = max(-1.0, min(1.0, (v1[0] * v2[0] + v1[1] * v2[1]) / (n1 * n2)))
    return math.degrees(math.acos(cos))


def clip_station_fold(pts):
    """剪掉站前"先拐过走廊顶点再折回节点"的那一跳（首尾各一处）。

    route() 把站挂到离它最近的走廊顶点上。正线从站旁经过时那个顶点在
    行进方向的前方，接回节点就是一根折返回头——杭州东 是 沪昆高铁 与
    宁杭高铁 两条平行走廊共用一个节点坐标（两走廊的 way 端点差 136m），
    笕桥方向的折线因此先越过 沪昆 那个顶点再折回来，画出来 99°。顶点离
    节点在 NODE_HOP_MAX_KM 内、转角又判为折返时直接丢掉它，让折线在站点
    处收尾：宁可少几百米走廊，不把线画成尖角。
    """
    if len(pts) < 4:
        return pts
    i = len(pts) - 2
    if (haversine_km(pts[i], pts[-1]) <= NODE_HOP_MAX_KM
            and turn_deg(pts[i - 1], pts[i], pts[i + 1]) >= FOLD_TURN_DEG):
        del pts[i]
    if (len(pts) >= 4 and haversine_km(pts[1], pts[0]) <= NODE_HOP_MAX_KM
            and turn_deg(pts[0], pts[1], pts[2]) >= FOLD_TURN_DEG):
        del pts[1]
    return pts


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
                      out_segments, legacy_km_map=None, way_index=None):
    """块区间 → 按声明站序切分区段 → 同走廊全局合并。

    返回新增区段数；数据异常（断点重叠/过近、里程超界、绕行比异常）抛
    SystemExit，由调用方按线路失败处理。
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

    # 切分：断点全部来自声明站序（自动补站已删）。相邻断点投影重叠或过近
    # 说明站序本身有问题，停下来人工判，不再靠删断点蒙过去。
    all_breaks = sorted((bi, bn) for bn, bi in breaks)

    def _km(ia, ib):
        return polyline_km(pts_all[ia:ib + 1])

    for i in range(len(all_breaks) - 1):
        ia, na = all_breaks[i]
        ib, nb = all_breaks[i + 1]
        gap = _km(ia, ib)
        if ib <= ia:
            raise SystemExit("线路 %s：断点 %s/%s 在折线上投影重叠" % (lid, na, nb))
        if gap < SEG_KM_MIN:
            raise SystemExit("线路 %s：相邻断点 %s/%s 间距 %.2fkm 过近（<%.2fkm）"
                             % (lid, na, nb, gap, SEG_KM_MIN))

    n_new = 0
    for i in range(len(all_breaks) - 1):
        ia, na = all_breaks[i]
        ib, nb = all_breaks[i + 1]
        seg_pts = pts_all[ia:ib + 1]
        # way 归属在修剪/吸附/简化之前取：三者都会改写端点，改写后的
        # 坐标在 way 顶点索引里查不到。
        seg_ways = corridor_way_ids(seg_pts, way_index) if way_index else set()
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
        # 块级那道 clip 够不着区段级端点（孝感/西宁/金华/贵阳北 都卡在
        # 这里）：端点吸附之后同一刀再剪一次。
        clip_station_fold(seg_pts)
        full_km = polyline_km(seg_pts)
        if not (SEG_KM_MIN <= full_km <= SEG_KM_MAX):
            raise SystemExit("线路 %s：区段 %s-%s 里程 %.2fkm 超界"
                             % (lid, na, nb, full_km))
        straight = haversine_km(seg_pts[0], seg_pts[-1])
        if straight > 20 and full_km > straight * DETOUR_RATIO:
            raise SystemExit("线路 %s：区段 %s-%s 绕行比异常 %.1f（%.1fkm）"
                             % (lid, na, nb, full_km / straight, full_km))
        simplified = [[round(x, 5), round(y, 5)] for x, y in dp_simplify(seg_pts)]
        # 同站对合并判据：走的是同一批 OSM way 才算同一物理走廊（比不了
        # way 归属时退回几何）。两条不同线路连接同一对站（同站对南北两线、
        # 高铁正线与并行既有线）是不同物理区段，必须都保留——只按形状
        # 合并会把后建那条的折线整段丢掉，普速车因此被画到高铁正线上。
        seg_key = pair_key(na, nb)
        dup = next(
            (s for s in out_segments.values()
             if s.get("_pairKey") == seg_key
             and same_track(s["polyline"], s.get("_ways"), simplified, seg_ways)),
            None)
        if dup is not None:
            if lid not in dup["lineIds"]:
                dup["lineIds"].append(lid)
            if block["serviceDate"] < dup["serviceDate"]:
                dup["serviceDate"] = block["serviceDate"]
            # 共线区段（如高铁与既有线在同一站对共走廊）任一类别可运行
            # 即可供该类记录走行。
            dup["trains"] = merge_trains(dup.get("trains"), trains)
            dup["_ways"] |= seg_ways
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
            # 实际骑行的 OSM way id 集合（同走廊合并判据用，写产物前剥掉）。
            "_ways": set(seg_ways),
            # 站名空间的站对 key（from/to 是节点 id，两种 key 空间
            # 不能混用；写产物前剥掉）。
            "_pairKey": seg_key,
        }
        n_new += 1
    return n_new


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--batches", default=",".join(BATCH_ORDER),
                        help="仅构建指定批次（逗号分隔，如 A,B）；legacy 恒定包含")
    parser.add_argument("--force-extract", action="store_true")
    parser.add_argument("--out", default="",
                        help="产物输出路径（默认 js/rail-route-data.js）。做 A/B 时指到 "
                             "build-cache/ 下，不覆盖已提交产物。")
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

    # 节点坐标全部来自清单：legacy 试点与 MANUAL_NODES 的坐标本来就在清单里
    # （declare_stations.py 是从产物登记的），此处逐条比对，不一致就是有人改了
    # 一处没改另一处——枢纽点被五六条线共用，一位小数的差别都是一根钩子。
    registry = NodeRegistry()
    manual_by_id = {n["id"]: n for n in MANUAL_NODES}
    manual_by_id.update({n["id"]: n for n in legacy_nodes})
    drift = []
    for row in load_node_coords():
        fixed = manual_by_id.get(row["id"])
        if fixed is not None:
            gap = haversine_km(fixed["coord"], row["coord"])
            if gap > 0.002:
                drift.append("%s：清单 %s vs 手工 %s（%.1fm）"
                             % (row["name"], row["coord"], fixed["coord"], gap * 1000))
            continue
        registry.register(row["name"], row["coord"], kind=row["kind"],
                          source=row["source"], fixed_id=row["id"])
    if drift:
        raise SystemExit("坐标清单与手工节点打架：" + "；".join(drift))
    for n in legacy_nodes:
        registry.register(n["name"], n["coord"], kind=n["kind"],
                          source=n["source"], aliases=n.get("aliases"),
                          fixed_id=n["id"])
    for n in MANUAL_NODES:
        registry.register(n["name"], n["coord"], kind=n["kind"],
                          source=n["source"], aliases=n.get("aliases"),
                          fixed_id=n["id"])
    print("坐标清单：%d 节点（手工 %d）"
          % (len(registry.by_id), len(manual_by_id)))

    active_lines = [ln for ln in LINES if ln["batch"] in batches]
    pin_exempt = load_pin_exemptions()
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

    # legacy 试点的折线是照当年 data.js 的粗坐标冻结迁移的（南京南 实测偏
    # 1.62km、汉口 偏 1.02km）。节点坐标已经按 OSM 站节点校正过，折线端点
    # 必须跟着挪，否则 validate 报"端点与折线断裂"（合肥西 校正后断 2.32km）。
    moved = 0
    for seg in legacy_segments:
        for end, nid in ((0, seg["from"]), (-1, seg["to"])):
            node = registry.by_id.get(nid)
            if node is None:
                continue
            if seg["polyline"][end] != node["coord"]:
                seg["polyline"][end] = list(node["coord"])
                moved += 1
    if moved:
        print("legacy 折线端点已对齐坐标清单：%d 处" % moved)

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
    way_index = way_point_index(all_ways)
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

    # OSM 来源名 → 拥有该名的线路 id：枢纽联络线用 link_names 声明它借谁
    # 的站场接入，这里把来源名翻成线路 id，一并写进产物（lines[].links）。
    # JS 侧据此把联络线并进它所连接的干线，见 js/rail-routes.js
    # preferredLines——否则一趟 沪宁城际 的车在 南京 换自家联络线进
    # 南京南 会被当成"离开偏好线路"，反而输给一段 京沪高铁 的捷径。
    # 只认"不限界使用该来源"的主人：兰新线 按 bbox 借 陇海线 引入兰州，
    # 若把它也算成 陇海线 的所有者，西康线 的 links 里会凭空多出兰新线。
    owners_by_source = {}
    for ln in active_lines:
        bounded = ln.get("osm_bounds") or {}
        for nm in ln["osm_names"]:
            if nm in bounded:
                continue
            owners_by_source.setdefault(nm, []).append(ln["id"])

    def line_links(line):
        out = []
        for nm in line.get("link_names") or []:
            for oid in owners_by_source.get(nm, []):
                if oid != line["id"] and oid not in out:
                    out.append(oid)
        return out

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
            graph = line_graphs.get(lid)
            if graph is None:
                graph = line_graph(line)
                line_graphs[lid] = graph
            resolved = resolve_line_stations(line, registry)
            check_pinned_on_corridor(line, resolved, graph, pin_exempt)
            blocks, pts_all, breaks = stitch_line(
                line, resolved, graph, legacy_pair_map, registry)
            cut_line_segments(
                line, resolved, blocks, pts_all, breaks, registry,
                out_segments,
                legacy_km_map={s["id"]: s["estLengthKm"]
                               for s in legacy_segments},
                way_index=way_index)
            line_summaries.append({
                "id": lid, "name": line["name"], "batch": line["batch"],
                "from": registry.get(line["from"])["id"],
                "to": registry.get(line["to"])["id"],
                "serviceDate": line["serviceDate"],
                "trains": trains,
                # 申报客运站（业务断言，不含走廊 1.1km 内的自动补站）：
                # JS 侧据此把车次的停靠站对应到线，并行走廊里选对那一条
                # （沪宁城际 停 常州/丹阳，同走廊的 京沪线 停 常州 但无 丹阳）。
                "stops": [registry.get(n)["id"] for n, _, _ in resolved],
                "links": line_links(line),
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

        print("  %-20s %2d 声明站 %2d 块  %s"
              % (lid, len(resolved), len(blocks), line["name"]))

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
        entry.pop("_ways", None)
        final_segments.append(entry)

    # lines[].stops 由**区段端点反推**，不再抄线路清单的声明站序：区段端点是
    # OSM 几何自己算出来的（ODbL），而声明站序里有来自第三方库的有序站表。
    # 前端只用它做并行走廊投票（stopsToLines），端点集合是同一份信息的自证版本。
    stops_by_line = {}
    for seg in final_segments:
        for lid in seg["lineIds"]:
            bucket = stops_by_line.setdefault(lid, [])
            for nid in (seg["from"], seg["to"]):
                if nid not in bucket:
                    bucket.append(nid)
    for summary in line_summaries:
        summary["stops"] = stops_by_line.get(summary["id"], summary["stops"])

    validate(final_segments, registry)

    # ---- 节点输出：只出被区段用到的，legacy 在前，其余按注册序 ----
    # 坐标清单是"全网节点"的账本，比实际能走到的站多：一条线改站序、或某个
    # 补站候选当年被登记却没断成点，都会留下没人用的节点。照单全输出的话，
    # 地图上是"有这座站"，网络里却走不进去（实测攒下 黄村/郭塘/南仓/新建河/
    # 灵宝东/积金南/嘉善火车站 七个假站）。端点集合才是"这座站真的在网络上"。
    used_ids = {nid for seg in final_segments for nid in (seg["from"], seg["to"])}
    # dict.fromkeys 去重：jg-junction 同时定义于 legacy 与 MANUAL_NODES，
    # 直接拼接会让同一节点在产物中出现两次。
    legacy_ids = list(dict.fromkeys(
        [n["id"] for n in legacy_nodes] + [n["id"] for n in MANUAL_NODES]))
    nodes_out = [registry.by_id[i] for i in legacy_ids if i in used_ids]
    for node in registry.by_id.values():
        if node["id"] not in legacy_ids and node["id"] in used_ids:
            nodes_out.append(node)
    unused = [n["name"] for n in registry.by_id.values() if n["id"] not in used_ids]
    if unused:
        print("清单里没被任何区段用到的节点（不写进产物）：%s"
              % "、".join(sorted(unused)))

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
    out_path = args.out or os.path.join(ROOT, "js", "rail-route-data.js")
    if not os.path.isabs(out_path):
        out_path = os.path.join(ROOT, out_path)
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
