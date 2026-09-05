# -*- coding: utf-8 -*-
"""铁路 way 图寻径与折线几何工具。

自试点 tools/build_rail_route_data.py 移植并保持关键参数：
- way 端点合并容差 5e-4°（渡线/岔区端点差 ~3e-4°，过小会断裂）；
- 连通分量感知的候选端点配对（复线不共享端点的平行链）；
- Dijkstra 以折线 haversine 里程为边权；
- Douglas-Peucker 显示简化容差 0.0009°（约 90m）。
"""

import heapq
import math

# way 端点合并容差（度，约 55m）。
MERGE_TOL = 5e-4
# 候选端点配对半径（度，约 5.5km）：枢纽站 data.js 2 位小数坐标
# 偏离 OSM 正线可达 ~3km（六安实测 0.031°）。
CAND_RADIUS = 0.05
# Douglas-Peucker 显示简化容差（度）。
DP_TOL = 0.0009
# 站坐标贴走廊/顶点切入的最大半径（度，约 6.6km；data.js 粗坐标偏差 ~3km）。
SNAP_MAX = 0.06


# 寻径折线的最大绕行比（超时尝试次优候选对；枢纽长 way 切入可能
# 产生经远端端点的假最短路）。
ROUTE_MAX_RATIO = 5.0
ROUTE_MIN_MARGIN_KM = 20.0


def dist(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])


def haversine_km(a, b):
    lon1, lat1 = a
    lon2, lat2 = b
    r = 6371.0088
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlmb = math.radians(lon2 - lon1)
    h = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlmb / 2) ** 2
    return 2 * r * math.asin(math.sqrt(h))


def polyline_km(pts):
    return sum(haversine_km(pts[i], pts[i + 1]) for i in range(len(pts) - 1))


def dedupe(pts):
    out = [pts[0]]
    for p in pts[1:]:
        if dist(out[-1], p) > 1e-6:
            out.append(p)
    return out


def dp_simplify(pts, tol=DP_TOL):
    """Douglas-Peucker（显式栈，坐标 [lon, lat]，欧氏近似足够）。"""
    if len(pts) < 3:
        return pts[:]
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        lo, hi = stack.pop()
        if hi <= lo + 1:
            continue
        ax, ay = pts[lo]
        bx, by = pts[hi]
        dx, dy = bx - ax, by - ay
        norm = math.hypot(dx, dy) or 1e-12
        best_i, best_d = None, -1.0
        for i in range(lo + 1, hi):
            px, py = pts[i]
            d = abs((px - ax) * dy - (py - ay) * dx) / norm
            if d > best_d:
                best_i, best_d = i, d
        if best_d > tol:
            keep[best_i] = True
            stack.append((lo, best_i))
            stack.append((best_i, hi))
    return [p for p, k in zip(pts, keep) if k]


def _merge_nodes(nodes, pt, tol=MERGE_TOL):
    """将端点按容差合并为图节点（3×3 邻域查询）。"""
    gx, gy = int(pt[0] / tol), int(pt[1] / tol)
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            key = (gx + dx, gy + dy)
            if key in nodes and dist(nodes[key], pt) <= tol:
                return key
    nodes[(gx, gy)] = pt
    return (gx, gy)


class WayGraph:
    """way 端点为节点、way 全长为超边的图。

    - 邻接条目保留 way 索引，寻径后可回查折线；
    - 构建时标注连通分量；寻径仅在两侧同分量的候选端点间进行，
      避免复线上下行分属平行链造成的假性不可达。
    """

    def __init__(self, ways):
        self.ways = ways
        self.node_pos = {}
        adj = {}
        for wi, w in enumerate(ways):
            pts = w["pts"]
            ka = _merge_nodes(self.node_pos, pts[0])
            kb = _merge_nodes(self.node_pos, pts[-1])
            w["ends"] = (ka, kb)
            w_km = polyline_km(pts)
            adj.setdefault(ka, []).append((kb, w_km, wi))
            adj.setdefault(kb, []).append((ka, w_km, wi))
        self.adj = adj
        self.comp_of = {}
        self._recompute_components()
        self._init_vertex_grid()

    def _recompute_components(self):
        self.comp_of = {}
        comp_id = 0
        for k in self.node_pos:
            if k in self.comp_of:
                continue
            frontier = [k]
            self.comp_of[k] = comp_id
            while frontier:
                u = frontier.pop()
                for v, _, _ in self.adj.get(u, ()):
                    if v not in self.comp_of:
                        self.comp_of[v] = comp_id
                        frontier.append(v)
            comp_id += 1

    def bridge_zone(self, bbox, max_gap=0.004):
        """枢纽补桥：bbox 内不同分量的近距端点（<max_gap°）用虚拟直线互连。

        枢纽站内 unnamed 渡线/道岔段常因端点差略超 MERGE_TOL 断成
        小分量，导致实际连通的枢纽走廊寻径失败（南昌乐化 0.0022°
        缺口、合福高速线合肥枢纽 unnamed 链、武汉站出站段）。
        虚拟桥以直线 way 入图；边权为 haversine 公里（与普通边同单位，
        不得把经纬度欧氏距离当权重的数量级错误）。
        max_gap 应保持在 ~0.004°（约 450m）：缺口更大的枢纽应先修
        提取/合并逻辑，而不是放大半径制造未核验的假捷径。
        返回加桥数。
        """
        inside = [k for k, p in self.node_pos.items()
                  if bbox[0] <= p[0] <= bbox[2] and bbox[1] <= p[1] <= bbox[3]]
        # 网格加速：cell = max_gap，3×3 邻域找异分量最近端点。
        grid = {}
        for k in inside:
            p = self.node_pos[k]
            grid.setdefault((int(p[0] / max_gap), int(p[1] / max_gap)),
                            []).append(k)
        added = 0
        seen = set()
        for ka in inside:
            pa = self.node_pos[ka]
            ca = self.comp_of[ka]
            gx, gy = int(pa[0] / max_gap), int(pa[1] / max_gap)
            best = None
            for dx in (-1, 0, 1):
                for dy in (-1, 0, 1):
                    for kb in grid.get((gx + dx, gy + dy), ()):
                        if kb == ka or self.comp_of[kb] == ca:
                            continue
                        pair = (ka, kb) if ka < kb else (kb, ka)
                        if pair in seen:
                            continue
                        d = dist(pa, self.node_pos[kb])
                        if d <= max_gap and (best is None or d < best[0]):
                            best = (d, kb, pair)
            if best is None:
                continue
            d, kb, pair = best
            seen.add(pair)
            bridge_km = haversine_km(pa, self.node_pos[kb])
            w = {"id": -1,
                 "pts": [list(pa), list(self.node_pos[kb])]}
            self.ways.append(w)
            wi = len(self.ways) - 1
            w["ends"] = (ka, kb)
            self.adj.setdefault(ka, []).append((kb, bridge_km, wi))
            self.adj.setdefault(kb, []).append((ka, bridge_km, wi))
            added += 1
        if added:
            self._recompute_components()
        return added

    def _init_vertex_grid(self, cell=0.02):
        """way 全部顶点的均匀网格索引（站节点常贴 way 中部顶点，
        nearest_node 仅覆盖端点，枢纽大站会被误判不在线路上）。"""
        self._vcell = cell
        grid = {}
        for wi, w in enumerate(self.ways):
            for p in w["pts"]:
                grid.setdefault((int(p[0] / cell), int(p[1] / cell)), []).append((wi, p))
        self._vgrid = grid

    def _nearest_vertex_ways(self, pt, radius):
        """半径内最近顶点；返回 (dist, coord, [所属 way 索引...])。

        同位置顶点可能被多条 way 共享（端点重合），全部返回。
        """
        cell = self._vcell
        gx, gy = int(pt[0] / cell), int(pt[1] / cell)
        r = int(math.ceil(radius / cell))
        best_d = None
        for dx in range(-r, r + 1):
            for dy in range(-r, r + 1):
                for _, p in self._vgrid.get((gx + dx, gy + dy), ()):
                    d = dist(p, pt)
                    if d <= radius and (best_d is None or d < best_d):
                        best_d = d
        if best_d is None:
            return None, None, []
        wis = []
        best_p = None
        for dx in range(-r, r + 1):
            for dy in range(-r, r + 1):
                for wi, p in self._vgrid.get((gx + dx, gy + dy), ()):
                    if dist(p, pt) <= best_d + 1e-9:
                        if best_p is None:
                            best_p = list(p)
                        if wi not in wis:
                            wis.append(wi)
        return best_d, best_p, wis

    def nearest_vertex(self, pt, radius):
        """半径内最近的 way 顶点；返回 (dist, [lon, lat]) 或 (None, None)。"""
        d, p, _ = self._nearest_vertex_ways(pt, radius)
        return d, p

    def _side_cands(self, pt):
        """pt 的寻径切入候选 [(d, 图端点key, 预折线段, (way, 顶点)|None)]。

        - 图端点（CAND_RADIUS 内）：预段仅 [pt]，链展开后直线衔接；
        - 最近顶点切入：所属 way 两端点均为候选，预段沿 way 真实顶点
          从 pt 走到端点（OSM 超长 way 中部站离最近端点可达 30km+，
          仅靠端点候选会配对失败）。
        第 4 项记录切入 way 与顶点，供两站吸附同一端点时同 way 直达切分。
        """
        cands = []
        for d, k in sorted((dist(p, pt), k) for k, p in self.node_pos.items()
                           if dist(p, pt) <= CAND_RADIUS):
            cands.append((d, k, [list(pt)], None))
        dv, pv, wis = self._nearest_vertex_ways(pt, radius=SNAP_MAX)
        if dv is not None:
            for wi in wis:
                w = self.ways[wi]
                ka, kb = w["ends"]
                pts = w["pts"]
                idx = next((i for i, q in enumerate(pts) if q == pv), None)
                if idx is None:
                    continue
                v = list(pts[idx])
                if idx > 0:
                    cands.append((dv, ka,
                                  [list(pt)] + [list(q) for q in pts[idx - 1::-1]],
                                  (wi, v)))
                else:
                    cands.append((dv, ka, [list(pt)], (wi, v)))
                if idx < len(pts) - 1:
                    cands.append((dv, kb,
                                  [list(pt)] + [list(q) for q in pts[idx + 1:]],
                                  (wi, v)))
                else:
                    cands.append((dv, kb, [list(pt)], (wi, v)))
        # 同端点去重，保留距离最小者
        best = {}
        for d, k, pre, vw in cands:
            if k not in best or d < best[k][0]:
                best[k] = (d, k, pre, vw)
        return list(best.values())

    def _slice_same_way(self, wi, vf, pt_f, vt, pt_t):
        """同一 way 上两切入顶点间的局部折线（跳过绕端点折返）。"""
        pts = self.ways[wi]["pts"]
        i_f = next((i for i, q in enumerate(pts) if q == vf), None)
        i_t = next((i for i, q in enumerate(pts) if q == vt), None)
        if i_f is None or i_t is None:
            return None
        if i_f == i_t:
            return [list(pt_f), list(pt_t)]
        if i_f < i_t:
            mid = [list(q) for q in pts[i_f + 1:i_t]]
        else:
            mid = [list(q) for q in pts[i_f - 1:i_t:-1]]
        return [list(pt_f)] + mid + [list(pt_t)]

    def _chain_pts(self, edges):
        """Dijkstra 边序列 → 按松弛时选中的边拼接 way 折线。

        前驱保存的是 (前节点, way 索引)：上下行/渡线存在同端点平行边，
        若只记节点序列、拼接时重查"第一条边"，画出来的可能不是寻径
        实际选中的那条（最小复现：2.224km 直线被画成 3.145km 折线）。
        """
        if not edges:
            return []
        chain = []
        for a, b, wi in edges:
            w = self.ways[wi]
            pts = w["pts"]
            ka, kb = w["ends"]
            # 走行方向：链上 a→b 对应 way 的端点序 ka→kb 时正向。
            forward = (a, b) == (ka, kb)
            pts = pts if forward else pts[::-1]
            if chain and dist(chain[-1], pts[0]) <= dist(chain[-1], pts[-1]):
                chain.extend(pts[1:] if chain[-1] == pts[0] else pts)
            else:
                if chain:
                    chain.append(pts[0])
                chain.extend(pts[1:])
        return dedupe(chain)

    def nearest_node(self, pt, radius=CAND_RADIUS):
        """返回 (dist, key)：半径内最近图节点；无则 (None, None)。"""
        best_d, best_k = None, None
        for k, p in self.node_pos.items():
            d = dist(p, pt)
            if d <= radius and (best_d is None or d < best_d):
                best_d, best_k = d, k
        return best_d, best_k

    def dijkstra(self, start, goal):
        """堆优化 Dijkstra，返回 (节点 key 序列, 边序列) 或 None。

        prev[v] = (u, wi)：同时记录前驱节点与松弛选中的 way 索引，
        平行边场景下重建路径必须使用原边而非端点间的第一条边。
        """
        dist_map = {start: 0.0}
        prev = {}
        heap = [(0.0, start)]
        seen = set()
        adj = self.adj
        while heap:
            d, u = heapq.heappop(heap)
            if u in seen:
                continue
            seen.add(u)
            if u == goal:
                nodes = [u]
                edges = []
                while u in prev:
                    pu, wi = prev[u]
                    edges.append((pu, u, wi))
                    u = pu
                    nodes.append(u)
                nodes.reverse()
                edges.reverse()
                return nodes, edges
            for v, w, wi in adj.get(u, ()):
                nd = d + w
                if nd < dist_map.get(v, float("inf")):
                    dist_map[v] = nd
                    prev[v] = (u, wi)
                    heapq.heappush(heap, (nd, v))
        return None

    def route(self, from_pt, to_pt):
        """连通分量感知配对 + Dijkstra（支持 way 中部顶点切入）。

        拼接结果超过绕行比上限（直线 5 倍或 +20km）时视为假最短路，
        尝试次优候选对。快路径（df+dt 前 20 对）全失败后进入兜底：
        对每个起点候选跑全分量单源 Dijkstra 取 mid 最小的端点对——
        枢纽站粗坐标偏离真实场站时（合肥南 [117.29,31.8] 偏合福场
        ~4km），正确端点对按 df+dt 排序在百名开外，按近邻截断会漏。
        """
        fc = self._side_cands(from_pt)
        tc = self._side_cands(to_pt)
        pairs = [(df + dt, kf, kt, pf, pt_, vwf, vwt)
                 for df, kf, pf, vwf in fc
                 for dt, kt, pt_, vwt in tc
                 if self.comp_of.get(kf) == self.comp_of.get(kt)]
        pairs.sort(key=lambda x: x[0])
        straight = haversine_km(from_pt, to_pt)
        limit = max(straight * ROUTE_MAX_RATIO,
                    straight + ROUTE_MIN_MARGIN_KM)
        tried = set()
        for _, kf, kt, pre_f, pre_t, vwf, vwt in pairs[:20]:
            tried.add((kf, kt))
            if kf == kt:
                # 两站吸附至同一端点：同 way 时直达切分，否则经端点折返衔接。
                if vwf is not None and vwt is not None and vwf[0] == vwt[0]:
                    seg = self._slice_same_way(vwf[0], vwf[1],
                                               pre_f[0], vwt[1], pre_t[0])
                    if seg:
                        return dedupe(seg)
                chain = list(pre_f) + list(pre_t)[::-1]
                return dedupe(chain) if chain else None
            found = self.dijkstra(kf, kt)
            if found is None:
                continue
            _path, edges = found
            chain = self._assemble(pre_f, edges, pre_t)
            chain = dedupe(chain)
            if polyline_km(chain) <= limit:
                return chain
        # 兜底：单源全分量 Dijkstra，按 mid 最小尝试。
        for df, kf, pf, vwf in fc:
            if kf not in self.adj:
                continue
            dist_map, prev = self._dijkstra_all(kf)
            rows = []
            for dt, kt, pt_, vwt in tc:
                if (kf, kt) in tried:
                    continue
                if self.comp_of.get(kt) != self.comp_of.get(kf):
                    continue
                if kt not in dist_map:
                    continue
                rows.append((dist_map[kt], kt, pt_, vwt))
            rows.sort(key=lambda x: x[0])
            for _, kt, pt_, vwt in rows[:3]:
                found = self._backtrack(prev, kf, kt)
                if found is None:
                    continue
                _path, edges = found
                chain = self._assemble(pf, edges, pt_)
                chain = dedupe(chain)
                if polyline_km(chain) <= limit:
                    return chain
        return None

    def _assemble(self, pre_f, edges, pre_t):
        """预折线 + Dijkstra 选中边折线 + 反向尾段拼接。"""
        chain = list(pre_f)
        mid = self._chain_pts(edges)
        if mid:
            if chain and dist(chain[-1], mid[0]) <= 1e-9:
                chain.extend(mid[1:])
            else:
                chain.extend(mid)
        tail = list(pre_t)[::-1]          # [kt 端点, ..., to 站]
        if chain and dist(chain[-1], tail[0]) <= 1e-9:
            chain.extend(tail[1:])
        else:
            chain.extend(tail)
        return chain

    def _dijkstra_all(self, start):
        """单源全图 Dijkstra，返回 (dist_map, prev)。

        prev[v] = (u, wi)：与 dijkstra 相同，前驱同时保存所选边。
        """
        dist_map = {start: 0.0}
        prev = {}
        heap = [(0.0, start)]
        seen = set()
        adj = self.adj
        while heap:
            d, u = heapq.heappop(heap)
            if u in seen:
                continue
            seen.add(u)
            for v, w, wi in adj.get(u, ()):
                nd = d + w
                if nd < dist_map.get(v, float("inf")):
                    dist_map[v] = nd
                    prev[v] = (u, wi)
                    heapq.heappush(heap, (nd, v))
        return dist_map, prev

    @staticmethod
    def _backtrack(prev, start, goal):
        """沿 prev 回溯出 start→goal 的 (节点序列, 边序列)。"""
        if goal == start:
            return None
        nodes = [goal]
        edges = []
        u = goal
        while u in prev:
            pu, wi = prev[u]
            edges.append((pu, u, wi))
            u = pu
            nodes.append(u)
        if nodes[-1] != start:
            return None
        nodes.reverse()
        edges.reverse()
        return nodes, edges
