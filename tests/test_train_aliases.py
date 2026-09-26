# -*- coding: utf-8 -*-
"""复车次（同列车跨线换号）对应关系的判定测试。

锁住一条踩过的错：12306 czxx 的 station_train_code 只有首站那一行有值，
其余为 None。把"我们站的这对上查到的是另一个号的车"当复车次，其实是
**别趟车**（G1427 的站对上查到 G1426），借它的径路就等于拿别的车当证据
—— 与"来回不一定同路"的教训正面冲突。所以宁可不判。
"""

import os
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))

import fetch_train_aliases as fa  # noqa: E402

# 实测形态：只有首行带号，后面全 None
ORIGIN_ONLY = [("上海虹桥", "G1426"), ("苏州北", None), ("南京南", None),
               ("武汉", None)]
# 真复车次形态：途中换号（当前 12306 数据看不到，用来锁判据本身）
SWITCHED = [("上海虹桥", "G1426"), ("南京南", "G1426"), ("武汉", "G1427"),
            ("长沙南", "G1427")]


class TestCodesFromRows(unittest.TestCase):
    def test_empty_codes_are_dropped(self):
        """实测形态：首站外 station_train_code 为空 → 序列只剩一项。"""
        rows = [{"station_no": str(i + 1), "station_name": s,
                 "station_train_code": c} for i, (s, c) in enumerate(ORIGIN_ONLY)]
        self.assertEqual(fa.codes_from_rows(rows), [("上海虹桥", "G1426")])

    def test_dedupes_consecutive(self):
        rows = [{"station_no": "1", "station_name": "甲", "station_train_code": "K1"},
                {"station_no": "2", "station_name": "乙", "station_train_code": "K1"},
                {"station_no": "3", "station_name": "丙", "station_train_code": "K2"}]
        self.assertEqual([(s, c) for s, c in fa.codes_from_rows(rows)],
                         [("甲", "K1"), ("丙", "K2")])


class TestAliasOf(unittest.TestCase):
    def test_single_number_is_not_an_alias(self):
        """只有首站有号 → 看不出换号 → 不判复车次。"""
        self.assertEqual(fa.alias_of("G1427", ORIGIN_ONLY), [])

    def test_other_train_on_pair_is_not_an_alias(self):
        """站对上只查到 G1426 一趟车：那是别趟车，不能当 G1427 的证据。"""
        self.assertEqual(fa.alias_of("G1427", [("上海虹桥", "G1426")]), [])

    def test_real_mid_route_switch_is_detected(self):
        got = fa.alias_of("G1426", SWITCHED)
        self.assertEqual([a["code"] for a in got], ["G1427"])
        self.assertEqual(got[0]["from_station"], "南京南")
        self.assertEqual(got[0]["first_station"], "武汉")

    def test_blank_codes_ignored(self):
        self.assertEqual(fa.alias_of("K1", [("甲", "K1"), ("乙", ""), ("丙", "")]), [])


if __name__ == "__main__":
    unittest.main()
