#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""线路所落位判据的回归测试（不碰 PBF，只测纯函数）。

钉住的都是这轮踩过的真实坑：
  · 巴河所 被 西塞山电厂专用线 冒充走廊（差 38 公里）；
  · 武石城际线 误配 武咸城际线（共有的只是"际线"这个后缀）；
  · 杜家坎所 的两条邻接线在 京广高速京西联络线 上归属并列，两边都拿不到几何；
  · 妙西镇所 与 康山所 共用一条联络线的两端，不能把自己跟自己求交集。
"""

import os
import sys
import types
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(
    os.path.abspath(__file__))), "tools"))

import llt_junctions as J  # noqa: E402


def entry(*names):
    return {"stations": [{"name": n} for n in names]}


def llt_obj(**entries):
    return types.SimpleNamespace(by_name=dict(entries))


SIDX = {
    "黄冈东": [(114.98118, 30.509214)],
    "浠水南": [(115.235417, 30.413671)],
    "武汉北": [(114.28, 30.66)],          # 同名两处 → 有歧义，不采信
    "武汉北2": [(114.30, 30.66)],
    "某站": [(120.10, 30.75)],
    "另一站": [(119.95, 30.85)],
}
# 歧义站要真的重复才算歧义
SIDX["武汉北"] = [(114.28, 30.66), (115.9, 30.1)]


class Naming(unittest.TestCase):
    def test_telecode_yard_noise_is_not_a_corridor(self):
        # 电厂/军工/地铁/观光线不能当所的定位线索
        for nm in ("西塞山电厂专用线", "白云军用线", "广州地铁22号线",
                   "千岛湖站1道", "丰台动车走行A线", "南昆上行客线"):
            self.assertTrue(J.is_yard_noise(nm), nm)

    def test_keystone_names_survive_the_noise_filter(self):
        # 客专线是"客运专线"，不是站场到发线：不能被 客线$ 之前的写法误杀
        for nm in ("武九客专线", "康山联络线", "阜黄高速线", "滠武线"):
            self.assertFalse(J.is_yard_noise(nm), nm)

    def test_generic_suffix_is_not_a_stem(self):
        # 武石城际线 ↔ 武咸城际线 只共有"际线"，不算同名证据
        self.assertFalse(J.stems("武石城际线") & J.stems("武咸城际线"))
        # 而 阜黄黄黄段 ↔ 阜黄高速线 共有地名词根 阜黄
        self.assertIn("阜黄", J.stems("阜黄黄黄段") & J.stems("阜黄高速线"))

    def _names(self, box, llt_name, inv):
        return dict(J.names_by_geometry(box, llt_name, list(inv.items())))

    def test_whole_name_containment_beats_stem(self):
        inv = {"京广高速京西联络线": [116.20, 39.83, 116.24, 39.86],
               "京广线": [116.0, 39.5, 116.5, 40.2],
               "武咸城际线": [114.3, 30.4, 114.5, 30.6]}
        scores = self._names([116.05, 39.56, 116.39, 39.9], "京西联络线", inv)
        self.assertEqual(scores.get("京广高速京西联络线"), 4)
        self.assertIsNone(scores.get("武咸城际线"))

    def test_long_trunk_matches_by_stem_inside_the_box(self):
        # 阜黄高速线 跨 0.9x2.9 度，紧框判据永远不收它，只能靠词根
        box = [114.95, 30.31, 115.26, 30.62]
        inv = {"阜黄高速线": [115.05, 30.0, 115.96, 32.88],
               "京九线": [114.9, 29.9, 115.3, 36.0]}
        self.assertEqual(self._names(box, "阜黄黄黄段", inv).get("阜黄高速线"), 2)
        self.assertIsNone(self._names(box, "阜黄黄黄段", inv).get("京九线"))


class Anchoring(unittest.TestCase):
    def test_box_is_centred_on_the_junction_not_on_its_neighbours(self):
        # 巴河所 是 阜黄黄黄段 的第一站：只看这一条目，框会整个偏到下游去
        obj = llt_obj(**{"武冈城际线": entry("黄冈东", "巴河所"),
                         "阜黄黄黄段": entry("巴河所", "浠水南")})
        box = J.suo_box("巴河所", {"武冈城际线", "阜黄黄黄段"}, obj, SIDX)
        self.assertTrue(box[0] < 115.11 < box[2] and box[1] < 30.46 < box[3], box)

    def test_ambiguous_station_names_are_dropped_not_average(self):
        # 武汉北 有两处坐标 → 不能拿它定位置
        obj = llt_obj(**{"甲线": entry("武汉北", "楠姆庙所"),
                         "乙线": entry("楠姆庙所", "某站")})
        centre, coords = J.suo_anchor("楠姆庙所", {"甲线", "乙线"}, obj, SIDX)
        self.assertNotIn((114.28, 30.66), coords)
        self.assertNotIn((115.9, 30.1), coords)


class Attribution(unittest.TestCase):
    def test_one_way_belongs_to_one_line(self):
        # 合杭高铁 与 康山联络线 都猜得到 康山联络线：整名包含的那条才拿得到
        out = dict(J.attribute([
            ("合杭高铁", [("康山联络线", 1), ("合杭高速线", 2)]),
            ("康山联络线", [("康山联络线", 4)]),
        ]))
        self.assertEqual(out["康山联络线"], ["康山联络线"])
        self.assertEqual(out["合杭高铁"], ["合杭高速线"])

    def test_tie_loses_everything_rather_than_guess(self):
        out = dict(J.attribute([("甲线", [("某线", 2)]), ("乙线", [("某线", 2)])]))
        self.assertEqual(out, {})


class ComplexMerging(unittest.TestCase):
    def test_two_switches_of_one_layover_are_one_junction(self):
        clusters = [[[120.04194, 30.81872], 1], [[120.04851, 30.81897], 1]]
        picked = J.junction_complex(clusters, [120.0485, 30.8190])
        self.assertEqual(len(picked), 1)
        self.assertEqual(picked[0][0], [120.04851, 30.81897])

    def test_two_ends_of_a_long_connector_stay_ambiguous(self):
        # 一条长联络线的两端是两个不同的所，隔 20 公里，不能挑一个交差
        clusters = [[[116.9, 30.6], 1], [[117.1, 30.75], 1]]
        self.assertEqual(len(J.junction_complex(clusters, [116.91, 30.61])), 2)


if __name__ == "__main__":
    unittest.main()
