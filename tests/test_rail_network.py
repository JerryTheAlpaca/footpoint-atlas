# -*- coding: utf-8 -*-
"""铁路几何与构建模块的行为测试（2026-09-05 审查报告验收项）。

覆盖：
- 平行边（上下行/渡线）：寻径返回松弛选中的边几何，而非端点间第一条边；
- 枢纽补桥：边权为 haversine 公里，半径外缺口不加桥；
- 线路所（via）按显式站对声明插入，站序不再由空间距离猜测；
- 同站对两条不同物理走廊均保留为独立区段，同走廊才合并；
- 端点吸附阈值单位为公里；
- 线路约束白名单含 osm_names/osm_bounds/link_names；
- 列车类别 trains：缺省仅动车组、共走廊合并取并集且顺序恒定。
"""

import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "tools"))

from rail_network.build import (  # noqa: E402
    cut_line_segments,
    insert_via_stops,
    line_allowed_names,
    line_trains,
    NodeRegistry,
)
from rail_network.geometry import (  # noqa: E402
    WayGraph,
    haversine_km,
    polyline_km,
)
from rail_network.lines import BATCH_ORDER, LINES  # noqa: E402


class Node:
    """图测试用的 way 工厂（等价 extract 产物结构）。"""

    @staticmethod
    def way(wid, pts, src=None):
        w = {"id": wid, "pts": [list(p) for p in pts]}
        if src is not None:
            w["src"] = src
        return w


class TestParallelEdges(unittest.TestCase):
    A = [110.0, 30.0]
    B = [110.02, 30.0]

    def test_route_returns_selected_edge_geometry(self):
        """同端点平行边：先放 2.9km 折线、再放 2.2km 直线，寻径必须走直线。"""
        bent = Node.way(1, [self.A, [110.01, 30.008], self.B])
        straight = Node.way(2, [self.A, self.B])
        g = WayGraph([bent, straight])
        route = g.route(self.A, self.B)
        self.assertIsNotNone(route)
        km = polyline_km(route)
        straight_km = haversine_km(self.A, self.B)
        # 修复前：_chain_pts 重查"第一条边"，返回 2.9km 折线。
        self.assertLess(km, straight_km * 1.1)
        self.assertLess(abs(km - straight_km), 0.2)

    def test_fallback_dijkstra_also_uses_selected_edge(self):
        """兜底 _dijkstra_all 的回溯同样按选中边重建折线。"""
        bent = Node.way(1, [self.A, [110.01, 30.008], self.B])
        straight = Node.way(2, [self.A, self.B])
        g = WayGraph([bent, straight])
        dist_map, prev = g._dijkstra_all(g.ways[0]["ends"][0])
        other_end = g.ways[0]["ends"][1]
        found = g._backtrack(prev, g.ways[0]["ends"][0], other_end)
        self.assertIsNotNone(found)
        _nodes, edges = found
        km = polyline_km(g._chain_pts(edges))
        straight_km = haversine_km(self.A, self.B)
        self.assertLess(km, straight_km * 1.1)


class TestBridgeZone(unittest.TestCase):
    def test_bridge_weight_is_geodesic_km(self):
        """虚拟桥边权 = haversine 公里（修复前把 0.001° 当 1km）。"""
        w1 = Node.way(1, [[110.0, 30.0], [110.01, 30.0]])
        w2 = Node.way(2, [[110.011, 30.0], [110.02, 30.0]])
        g = WayGraph([w1, w2])
        n = g.bridge_zone([109.9, 29.9, 110.1, 30.1], max_gap=0.004)
        self.assertEqual(n, 1)
        bridge = g.ways[-1]
        ka, kb = bridge["ends"]
        pa, pb = g.node_pos[ka], g.node_pos[kb]
        expect = haversine_km(pa, pb)
        weights = [w for v, w, wi in g.adj[ka] if v == kb and wi == len(g.ways) - 1]
        self.assertEqual(len(weights), 1)
        self.assertAlmostEqual(weights[0], expect, places=9)
        # 0.001° ≈ 96m：修复前的度数权重只有 ~0.001，数量级错误。
        self.assertGreater(weights[0], 0.05)
        self.assertLess(weights[0], 0.15)

    def test_gap_beyond_radius_is_not_bridged(self):
        w1 = Node.way(1, [[110.0, 30.0], [110.01, 30.0]])
        w2 = Node.way(2, [[110.02, 30.0], [110.03, 30.0]])
        g = WayGraph([w1, w2])
        n = g.bridge_zone([109.9, 29.9, 110.1, 30.1], max_gap=0.004)
        self.assertEqual(n, 0)
        self.assertEqual(len(g.ways), 2)


class TestInsertViaStops(unittest.TestCase):
    def setUp(self):
        self.reg = NodeRegistry()
        self.reg.register("合肥南", [117.2, 31.78], fixed_id="hefei-south")
        self.reg.register("六安", [116.5, 31.75], fixed_id="luan")
        self.reg.register("长安集", [117.1, 31.85], fixed_id="changanji")
        self.reg.register("雷麻店", [116.9, 31.8], fixed_id="leimadian")
        self.stops = [
            ("南京南", [118.7, 31.9], "osm"),
            ("合肥南", [117.2, 31.78], "osm"),
            ("六安", [116.5, 31.75], "osm"),
        ]
        self.line = {"id": "test"}

    def test_via_inserted_between_declared_pair(self):
        """线路所按显式站对声明插入：肥东→合肥南→长安集→雷麻店→六安。"""
        out = insert_via_stops(
            self.stops,
            [{"id": "changanji", "between": ["合肥南", "六安"]},
             {"id": "leimadian", "between": ["长安集", "六安"]}],
            self.reg, self.line)
        names = [s[0] for s in out]
        self.assertEqual(names, ["南京南", "合肥南", "长安集", "雷麻店", "六安"])

    def test_non_adjacent_pair_is_rejected(self):
        """声明的站对不是相邻必须站时直接报错，不再按距离猜插入点。"""
        with self.assertRaises(SystemExit):
            insert_via_stops(
                self.stops,
                [{"id": "changanji", "between": ["南京南", "六安"]}],
                self.reg, self.line)

    def test_legacy_distance_heuristic_would_misorder(self):
        """回归锚：雷麻店到合肥南/六安的距离和更小（旧启发式会插错）。"""
        node = self.reg.by_id["leimadian"]
        dsum_via_leimadian_first = (
            haversine_km(self.stops[1][1], node["coord"]) +
            haversine_km(node["coord"], self.stops[2][1]))
        changanji = self.reg.by_id["changanji"]["coord"]
        dsum_via_changanji_first = (
            haversine_km(self.stops[1][1], changanji) +
            haversine_km(changanji, self.stops[2][1]))
        # 旧算法把距离和最小的雷麻店排前面 → 合肥南→雷麻店→长安集，
        # 与真实站序相反；显式声明是唯一可靠来源。
        self.assertLess(dsum_via_leimadian_first, dsum_via_changanji_first)


def _registry_with(a_name, a_coord, b_name, b_coord):
    reg = NodeRegistry()
    reg.register(a_name, a_coord, fixed_id="node-a")
    reg.register(b_name, b_coord, fixed_id="node-b")
    return reg


class TestSamePairMultiCorridor(unittest.TestCase):
    A = [110.0, 30.0]
    B = [110.4, 30.0]
    NORTH = [[110.0, 30.0], [110.2, 30.05], [110.4, 30.0]]
    SOUTH = [[110.0, 30.0], [110.2, 29.95], [110.4, 30.0]]

    def setUp(self):
        self.line = {"id": "test-line", "name": "测试线",
                     "serviceDate": "2020-01-01"}
        self.resolved = [("甲站", self.A, "osm"), ("乙站", self.B, "osm")]
        self.payload = {"stations": []}

    def _run(self, out_segments, pts, service_date="2020-01-01"):
        blocks = [{"a": "甲站", "b": "乙站", "pts": [list(p) for p in pts],
                   "legacy": None, "serviceDate": service_date}]
        pts_all = [list(p) for p in pts]
        breaks = [("甲站", 0), ("乙站", len(pts_all) - 1)]
        return cut_line_segments(
            self.line, self.resolved, blocks, pts_all, breaks,
            _registry_with("甲站", self.A, "乙站", self.B),
            self.payload, [], out_segments)

    def test_two_corridors_both_kept(self):
        """同站对南/北两条走廊都是独立物理区段，第二条不被丢弃。"""
        out_segments = {}
        self._run(out_segments, self.NORTH)
        self._run(out_segments, self.SOUTH)
        self.assertEqual(len(out_segments), 2)
        ids = sorted(out_segments)
        self.assertNotEqual(ids[0], ids[1])

    def test_same_corridor_merges_lineids(self):
        """同一走廊重复构建只并入 lineIds，不新增区段。"""
        out_segments = {}
        self._run(out_segments, self.NORTH)
        self._run(out_segments, self.SOUTH)
        self._run(out_segments, self.NORTH)
        self.assertEqual(len(out_segments), 2)

    def test_merge_takes_earliest_service_date(self):
        out_segments = {}
        self._run(out_segments, self.NORTH, service_date="2020-01-01")
        first_id = next(iter(out_segments))
        self._run(out_segments, self.NORTH, service_date="2019-01-01")
        self.assertEqual(out_segments[first_id]["serviceDate"], "2019-01-01")


class TestSegmentTrains(unittest.TestCase):
    """列车类别（trains）声明、区段归属与共线合并。"""

    A = [110.0, 30.0]
    B = [110.4, 30.0]
    CORRIDOR = [[110.0, 30.0], [110.2, 30.002], [110.4, 30.0]]

    def _line(self, line_id, **kw):
        line = {"id": line_id, "name": line_id, "serviceDate": "2000-01-01"}
        line.update(kw)
        return line

    def _run(self, line, out_segments):
        resolved = [("甲站", self.A, "osm"), ("乙站", self.B, "osm")]
        blocks = [{"a": "甲站", "b": "乙站",
                   "pts": [list(p) for p in self.CORRIDOR],
                   "legacy": None, "serviceDate": line["serviceDate"]}]
        breaks = [("甲站", 0), ("乙站", len(self.CORRIDOR) - 1)]
        cut_line_segments(
            line, resolved, blocks, [list(p) for p in self.CORRIDOR], breaks,
            _registry_with("甲站", self.A, "乙站", self.B),
            {"stations": []}, [], out_segments)

    def test_default_is_emu_only(self):
        """未声明 trains 的线路（既有高铁清单）不会被普速记录借用。"""
        self.assertEqual(line_trains(self._line("hsr")), ["emu"])
        self.assertEqual(line_trains(self._line("mix", trains=["conv", "emu"])),
                         ["emu", "conv"])

    def test_unknown_kind_fails_loud(self):
        with self.assertRaises(SystemExit):
            line_trains(self._line("bad", trains=["EMU"]))

    def test_segment_carries_line_trains(self):
        for line, expect in ((self._line("conv", trains=["conv"]), ["conv"]),
                             (self._line("hsr"), ["emu"])):
            out = {}
            self._run(line, out)
            self.assertEqual([s["trains"] for s in out.values()], [expect])

    def test_shared_corridor_unions_kinds(self):
        """高铁与既有线共走廊：合并后的区段两类列车都可走行。"""
        out = {}
        self._run(self._line("hsr"), out)
        self._run(self._line("conv", trains=["conv"]), out)
        self.assertEqual(len(out), 1)
        self.assertEqual(next(iter(out.values()))["trains"], ["emu", "conv"])

    def test_merge_order_independent(self):
        """类别并集顺序恒定，不随线路处理顺序变化（产物 diff 才稳定）。"""
        forward, backward = {}, {}
        hsr, conv = self._line("hsr"), self._line("conv", trains=["conv"])
        for line, out in ((hsr, forward), (conv, forward),
                          (conv, backward), (hsr, backward)):
            self._run(line, out)
        self.assertEqual([s["trains"] for s in forward.values()],
                         [s["trains"] for s in backward.values()])
        self.assertEqual(next(iter(forward.values()))["trains"], ["emu", "conv"])


class TestEndpointSnapKm(unittest.TestCase):
    def test_snap_threshold_is_kilometers(self):
        """端点吸附阈值是公里：>2km 的偏移不得改写折线端点。"""
        a_name, b_name = "丙站", "丁站"
        a_coord = [110.0, 30.02]    # 距折线首点 ~2.2km：不许吸附
        b_coord = [110.4, 30.005]   # 距折线尾点 ~0.55km：吸附
        reg = NodeRegistry()
        reg.register(a_name, a_coord, fixed_id="node-c")
        reg.register(b_name, b_coord, fixed_id="node-d")
        pts = [[110.0, 30.0], [110.2, 30.0], [110.4, 30.0]]
        self.assertGreater(haversine_km(pts[0], a_coord), 2.0)
        self.assertLess(haversine_km(pts[-1], b_coord), 2.0)
        line = {"id": "test-line", "name": "测试线", "serviceDate": "2020-01-01"}
        blocks = [{"a": a_name, "b": b_name, "pts": pts,
                   "legacy": None, "serviceDate": "2020-01-01"}]
        out_segments = {}
        cut_line_segments(
            line, [(a_name, a_coord, "osm"), (b_name, b_coord, "osm")],
            blocks, [list(p) for p in pts], [(a_name, 0), (b_name, 2)],
            reg, {"stations": []}, [], out_segments)
        seg = next(iter(out_segments.values()))
        # 修复前 dist(...) < 2.0 的单位是度（~200km），两端都会被改写。
        self.assertEqual(seg["polyline"][0], [110.0, 30.0])
        self.assertEqual(seg["polyline"][-1], [110.4, 30.005])


class TestLineAllowedNames(unittest.TestCase):
    def test_includes_osm_names_bounds_and_links(self):
        line = {
            "osm_names": ["京港高速线"],
            "osm_bounds": {"京九线": [115.75, 28.55, 116.08, 28.95]},
            "link_names": ["沪蓉线"],
        }
        allowed = line_allowed_names(line)
        self.assertIn("京港高速线", allowed)
        self.assertIn("京九线", allowed)
        self.assertIn("沪蓉线", allowed)
        self.assertNotIn("沪宁城际线", allowed)


class TestLineList(unittest.TestCase):
    """线路清单自身的一致性（人工维护的数据文件，构建前先把住关）。"""

    def test_every_line_declares_valid_kinds_and_batch(self):
        for line in LINES:
            kinds = line_trains(line)
            self.assertTrue(kinds, line["id"])
            self.assertTrue(set(kinds) <= {"emu", "conv"}, line["id"])
            self.assertIn(line["batch"], BATCH_ORDER, line["id"])

    def test_line_ids_are_unique(self):
        ids = [line["id"] for line in LINES]
        self.assertEqual(len(ids), len(set(ids)))

    def test_ningrong_carries_both_kinds(self):
        """沪汉蓉通道动车组与普速共用：标两类，否则普速记录在
        汉口—成都东间没有实际径路，只能回退曲线。"""
        line = next(l for l in LINES if l["id"] == "ningrong")
        self.assertEqual(line_trains(line), ["emu", "conv"])

    def test_conventional_lines_have_a_batch(self):
        """批次 F 存在且至少一条线声明 conv：普速网络不能是空承诺。"""
        self.assertIn("F", BATCH_ORDER)
        conv = [l for l in LINES if "conv" in line_trains(l)]
        self.assertTrue(conv)
        for line in conv:
            self.assertTrue(line["stations"], line["id"])


if __name__ == "__main__":
    unittest.main()
