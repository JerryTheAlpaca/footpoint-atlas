# -*- coding: utf-8 -*-
"""routes.dat 解析器（tools/rail_network/llt.py）的行为测试。

覆盖：
- 大端读数与两层结构；消费字节数必须等于文件长度（截断即报）；
- 第 0 行列名行被跳过，且被当作格式改版的哨兵；
- 逐段线路名必须双向查包含（只查正向会把大半段误判成无解）；
- ②层终点站另存字段，接在点列末位才是全程（K146 点列止于灞桥）；
- ①层站序补齐中间站（池州→黟县东 之间补出 九华山、黄山西）；
- 相邻决策点序列去重（D2256 的 合川 重复出现）；
- 线路名重复、train_no 长度异常都判为格式漂移，不静默降级。

数据文件不进库，缺失时整组跳过。
"""

import os
import struct
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))

from rail_network import llt  # noqa: E402
from rail_network.llt import LltFormatDrift  # noqa: E402

ROUTES = os.path.join(ROOT, "build-cache", "llt_probe", "db", "routes.dat")
# 指纹测试只针对这份快照：数据刷新后这些精确数字应当由人复核再更新。
SNAPSHOT_SHA256 = "48b4054a26ff084a77e835f396404e3c6c32c01e6ed216dd0a6b7663f73e86e9"
SNAPSHOT_STATS = {
    "line_entries": 790,        # 791 条含第 0 行列名行
    "station_slots": 7293,
    "distinct_stations": 5396,
    "distinct_telecodes": 5447,
    "train_records": 18354,
    "distinct_codes": 16693,
    "total": 1473839,
}

has_data = os.path.exists(ROUTES)


@unittest.skipUnless(has_data, "缺少 build-cache/llt_probe/db/routes.dat")
class TestParseStructure(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.llt = llt.load(ROUTES)

    def test_consumes_every_byte(self):
        """两层读完必须正好走到文件尾，多一字节少一字节都是读歪了。"""
        self.assertEqual(self.llt.consumed, self.llt.total)
        self.assertGreaterEqual(self.llt.total, 1000000)

    def test_header_row_skipped_and_telecodes_present(self):
        names = [l["name"] for l in self.llt.lines]
        self.assertNotIn(llt.HEADER_LINE_NAME, names)
        self.assertIn("京广线", names)
        # 每个站带 3 字母略号（电报码），这是主键换源的根据
        sample = self.llt.by_name["滠武线"]["stations"]
        self.assertEqual([s["name"] for s in sample],
                         ["丹水池", "滠口", "楠姆庙所", "武汉", "肖马杨所", "何刘"])
        self.assertEqual(sample[4]["telecode"], "EEN")
        self.assertTrue(all(len(s["telecode"]) == 3 for s in sample))

    @unittest.skipUnless(has_data and llt.sha256_of(ROUTES) == SNAPSHOT_SHA256,
                         "routes.dat 不是测试所 pin 的那份快照")
    def test_snapshot_fingerprint(self):
        st = self.llt.stats()
        for k, v in SNAPSHOT_STATS.items():
            self.assertEqual(st[k], v, "①/②层规模变化：%s" % k)
        self.assertEqual(self.llt.data_version, "20261003")
        # 保留字段只应有 -1（正文）与 0（列名行那一个槽位）
        self.assertEqual(sorted(self.llt.reserved_histogram), [-1, 0])


class TestTrainCode(unittest.TestCase):
    def test_zero_padded_field(self):
        cases = {"4e000G143503": "G1435", "2400000D4907": "D49",
                 "390000K14602": "K146", "76000D22560I": "D2256",
                 "6i0000G39000": "G390"}
        for no, want in cases.items():
            self.assertEqual(llt.train_code(no), want)

    def test_rejects_short(self):
        with self.assertRaises(LltFormatDrift):
            llt.train_code("G1435")


@unittest.skipUnless(has_data, "缺少 build-cache/llt_probe/db/routes.dat")
class TestLegEntry(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.llt = llt.load(ROUTES)

    def test_backward_containment_counts(self):
        """线路条目站序可能与行车方向相反，正向查会漏。"""
        got = self.llt.leg_entry("武昌", "汉西")
        self.assertIsNotNone(got, "反向包含必须能命中")
        name, ia, ib = got
        self.assertEqual(name, "京广线")
        self.assertGreater(ia, ib)

    def test_min_span_wins(self):
        name, ia, ib = self.llt.leg_entry("新墩", "襄州")
        self.assertEqual(name, "汉丹线")

    def test_unknown_pair_returns_none(self):
        self.assertIsNone(self.llt.leg_entry("不存在的站甲", "不存在的站乙"))

    def test_k148_every_leg_has_a_line(self):
        """K148 逐段都能被①层线路解释，含手工核对过的两处枢纽。"""
        seq = self.llt.sequence(self.llt.routes_for_code("K148")[0])
        self.assertEqual(seq, ["西安", "灞桥", "田王", "大岭铺", "旬阳", "安康",
                               "老河口东", "襄阳北", "襄阳", "襄州", "新墩", "汉西", "武昌"])
        for a, b in zip(seq, seq[1:]):
            got = self.llt.leg_entry(a, b)
            self.assertIsNotNone(got, "%s→%s 应能配上线路名" % (a, b))
            if got == llt.AMBIGUOUS:
                self.assertTrue(self.llt.leg_is_shared(a, b),
                                "%s→%s 多解但不是共线，得单独当歧义处理" % (a, b))
        self.assertEqual(self.llt.leg_entry("襄州", "襄阳")[0], "襄樊东线")
        self.assertEqual(self.llt.leg_entry("汉西", "新墩")[0], "汉西联络线")
        self.assertEqual(self.llt.leg_entry("旬阳", "安康")[0], "襄渝线")

    def test_shared_corridor_is_not_a_fork(self):
        """西安→灞桥 被 宁西西合段 与 陇海线 同跨度覆盖：共线，不是分岔。"""
        self.assertEqual(self.llt.leg_entry("西安", "灞桥"), llt.AMBIGUOUS)
        self.assertTrue(self.llt.leg_is_shared("西安", "灞桥"))
        self.assertEqual(sorted(n for n, _, _ in self.llt.leg_candidates("西安", "灞桥")),
                         ["宁西西合段", "陇海线"])


@unittest.skipUnless(has_data, "缺少 build-cache/llt_probe/db/routes.dat")
class TestSpine(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.llt = llt.load(ROUTES)

    def test_terminal_is_separate_field(self):
        rec = self.llt.routes_for_code("K146")[0]
        pts = [p["name"] for p in rec["points"]]
        self.assertEqual(pts[-1], "灞桥")
        self.assertEqual(rec["terminal"], "西安")
        self.assertEqual(self.llt.sequence(rec)[-1], "西安")

    def test_spine_fills_intermediate_stations(self):
        rec = self.llt.routes_for_code("G1435")[0]
        names = [r["name"] for r in self.llt.spine(rec)]
        i_cz = names.index("池州")
        i_yx = names.index("黟县东")
        between = names[i_cz + 1:i_yx]
        self.assertIn("黄山西", between, "池黄高铁 的中间站必须被补出来")
        self.assertIn("九华山", between)

    def test_decision_flags(self):
        rec = self.llt.routes_for_code("G1435")[0]
        rows = self.llt.spine(rec)
        seq = self.llt.sequence(rec)
        marked = {r["name"] for r in rows if r["decision"]}
        self.assertTrue(set(seq).issubset(marked), "②层的点必须都标成决策点")
        for r in rows:
            if not r["decision"]:
                self.assertNotIn(r["name"], seq, "补出来的中间站不该同时是决策点")

    def test_repeated_point_deduped(self):
        """D2256 的点列里 合川 出现两次（同站两次记录），序列要压掉邻接重复。"""
        recs = self.llt.routes_for_code("D2256")
        self.assertTrue(recs)
        for rec in recs:
            seq = self.llt.sequence(rec)
            self.assertTrue(all(a != b for a, b in zip(seq, seq[1:])),
                            "相邻不应重复：%s" % seq)


@unittest.skipUnless(has_data, "缺少 build-cache/llt_probe/db/routes.dat")
class TestFormatDrift(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(ROUTES, "rb") as f:
            cls.data = f.read()

    def test_truncated_file_raises_with_offset(self):
        with self.assertRaises(LltFormatDrift):
            llt.parse(self.data[:-1])

    def test_header_row_tamper_raises(self):
        bad = bytearray(self.data)
        # 列名行的 "线路名" 改成别的字，应判改版
        bad[9] = ord("X")
        with self.assertRaises(LltFormatDrift):
            llt.parse(bytes(bad))

    def test_little_endian_misread_raises(self):
        """把开头的条数按小端读会得到荒谬数字；解析器走大端，坏数据必须报错。"""
        bogus = struct.pack(">I", 386072576) + self.data[4:]
        with self.assertRaises(LltFormatDrift):
            llt.parse(bogus)

    def test_duplicate_line_name_raises(self):
        """线路名重复会让按名索引静默丢一条线，必须报错而不是覆盖。"""
        parsed = llt.parse(self.data)
        dup = dict(parsed["lines"][0])
        dup["stations"] = list(dup["stations"])
        parsed["lines"].insert(5, dup)
        with self.assertRaises(LltFormatDrift):
            llt.Llt(parsed)


if __name__ == "__main__":
    unittest.main()
