import json
import os
import threading
import unittest
from datetime import date, timedelta
from unittest import mock
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from tools import emu_lookup, serve


def rows(*pairs):
    return [{"date": day + " 08:00", "emu_no": unit, "train_no": "G2"} for day, unit in pairs]


class TrainVariantsTest(unittest.TestCase):
    def variants(self, text):
        return emu_lookup.train_variants(text)

    def test_plain_and_noisy_input(self):
        self.assertEqual(self.variants("G1737"), ["G1737"])
        self.assertEqual(self.variants(" g1737次 "), ["G1737"])
        self.assertEqual(self.variants("D2294"), ["D2294"])

    def test_compound_pair_gets_prefix_backfilled(self):
        # 复车次省略写法：尾号按首段前缀补全，与上游 NormalizeTrainNo 同规则。
        # 填的区间落在最后那一段上，所以尾号排在最前先查。
        self.assertEqual(self.variants("G45/8"), ["G48", "G45"])
        self.assertEqual(self.variants("G1737/736"), ["G1736", "G1737"])
        self.assertEqual(self.variants("G1737/G1736"), ["G1736", "G1737"])


    def test_non_emu_and_bare_number_are_rejected(self):
        for text in ("K146", "Z45", "1737", "", "G", "普速", "  "):
            self.assertEqual(self.variants(text), [], text)


class TrainNumbersTest(unittest.TestCase):
    def test_conv_heads_are_allowed_for_the_timetable(self):
        # 车号只查动车组，始发/终到走时刻表，普速也放得过去
        self.assertEqual(emu_lookup.train_numbers("K146"), ["K146"])
        self.assertEqual(emu_lookup.train_numbers("Z45次"), ["Z45"])
        self.assertEqual(emu_lookup.train_numbers("1737"), [])

    def test_primary_code_is_the_tail_of_a_compound_pair(self):
        # 省略写法照首段前缀补全："G1736/7" 尾号是 G1737，"G1737/736" 尾号是 G1736
        self.assertEqual(emu_lookup.primary_code("G1736/7"), "G1737")
        self.assertEqual(emu_lookup.primary_code("G1737/736"), "G1736")
        self.assertEqual(emu_lookup.primary_code("D2253/2256"), "D2256")
        self.assertEqual(emu_lookup.primary_code("G2"), "G2")
        self.assertEqual(emu_lookup.primary_code(""), "")


class FormatUnitTest(unittest.TestCase):
    def test_restores_hyphens_used_by_hand_written_records(self):
        cases = {
            "CR400BFZ5267": "CR400BF-Z-5267",
            "CR400BFAS5367": "CR400BF-AS-5367",
            "CR400AFX2542": "CR400AF-X-2542",
            "CR400BF5021": "CR400BF-5021",
            "CRH380BL3503": "CRH380BL-3503",
            "CRH1AA1172": "CRH1A-A-1172",
            "CRH5G5176": "CRH5G-5176",
            "CR200JC5029": "CR200J-C-5029",
            "CRH2A-2179": "CRH2A-2179",      # 已经带号的不再二次加工
        }
        for raw, expected in cases.items():
            self.assertEqual(emu_lookup.format_unit_no(raw), expected, raw)

    def test_cr_series_splits_after_f_or_j(self):
        # 清单没收录的复兴号按通例切：横杠落在 F 或 J 后面
        cases = {
            "CR200JS4001": "CR200JS-4001",       # 特例：S 是型号名的一部分，清单说了算
            "CR350BFZ1001": "CR350BF-Z-1001",    # 没见过的型号走规则
            "CR400BFGH5001": "CR400BF-GH-5001",
            "CR450AFZ0001": "CR450AF-Z-0001",
            "CR400BFZ5267": "CR400BF-Z-5267",
            "CR200JC5029": "CR200J-C-5029",
        }
        for raw, expected in cases.items():
            self.assertEqual(emu_lookup.format_unit_no(raw), expected, raw)

    def test_crh_series_still_uses_the_family_list(self):
        # 和谐号不吃这条规则：CRH380BL 是一整个型号，不切成 CRH380B-L
        cases = {
            "CRH380BL3503": "CRH380BL-3503",
            "CRH380B3633": "CRH380B-3633",
            "CRH1AA1248": "CRH1A-A-1248",
            "CRH2A2179": "CRH2A-2179",
        }
        for raw, expected in cases.items():
            self.assertEqual(emu_lookup.format_unit_no(raw), expected, raw)

    def test_unrecognised_shape_is_kept_as_is(self):
        self.assertEqual(emu_lookup.format_unit_no("未知型号"), "未知型号")
        self.assertEqual(emu_lookup.format_unit_no(""), "")


class UnitsOnDateTest(unittest.TestCase):
    def setUp(self):
        self.data = rows(("2026-10-16", "CR400AFX2547"), ("2026-10-16", "CR400AFX2542"),
                         ("2026-10-15", "CR400AFX2543"))

    def test_same_day_two_units_is_reunion(self):
        self.assertEqual(emu_lookup.units_on_date(self.data, "2026-10-16"),
                         ["CR400AF-X-2542", "CR400AF-X-2547"])

    def test_single_unit_and_missing_day(self):
        self.assertEqual(emu_lookup.units_on_date(self.data, "2026-10-15"), ["CR400AF-X-2543"])
        self.assertEqual(emu_lookup.units_on_date(self.data, "2026-10-14"), [])

    def test_window_lists_logged_days(self):
        self.assertEqual(emu_lookup.logged_dates(self.data), ["2026-10-15", "2026-10-16"])


class InnerTrainNumberTest(unittest.TestCase):
    def test_embedded_number_is_sliced_not_guessed(self):
        self.assertEqual(emu_lookup.inner_train_number("5l000G173603"), "G1736")
        self.assertEqual(emu_lookup.inner_train_number("2400000D4907"), "D49")
        self.assertEqual(emu_lookup.inner_train_number("390000K14602"), "K146")

    def test_short_or_odd_code_returns_empty(self):
        for code in ("", "short", "2400000"):
            self.assertEqual(emu_lookup.inner_train_number(code), "", code)


class LookupVehicleTest(unittest.TestCase):
    def setUp(self):
        emu_lookup.clear_caches()
        self.addCleanup(emu_lookup.clear_caches)
        # 始发/终到另打 12306，别在这些用例里真联网
        patcher = mock.patch.object(
            emu_lookup, "trip_profile",
            return_value={"origin": "", "terminal": "", "matched": False, "reason": "past"})
        patcher.start()
        self.addCleanup(patcher.stop)

    def test_reunion_is_returned_as_one_field_value(self):
        with mock.patch.object(emu_lookup, "railre_rows", return_value=rows(
                ("2026-10-16", "CR400AFX2542"), ("2026-10-16", "CR400AFX2547"))), \
                mock.patch.object(emu_lookup, "alias_numbers", return_value=[]):
            result = emu_lookup.lookup_vehicle("G2", "2026-10-16")
        self.assertTrue(result["matched"])
        self.assertTrue(result["reunion"])
        self.assertEqual(result["value"], "CR400AF-X-2542+CR400AF-X-2547重联")

    def test_missing_day_reports_the_retained_window(self):
        with mock.patch.object(emu_lookup, "railre_rows", return_value=rows(
                ("2025-12-26", "CRH380BL3502"), ("2026-01-25", "CRH380BL3503"))), \
                mock.patch.object(emu_lookup, "alias_numbers", return_value=[]):
            result = emu_lookup.lookup_vehicle("G176", "2026-10-16")
        self.assertFalse(result["matched"])
        self.assertEqual(result["reason"], "outside_window")
        self.assertEqual(result["window"], {"from": "2025-12-26", "to": "2026-01-25"})

    def test_number_without_any_log_says_so(self):
        with mock.patch.object(emu_lookup, "railre_rows", return_value=[]), \
                mock.patch.object(emu_lookup, "alias_numbers", return_value=[]):
            result = emu_lookup.lookup_vehicle("G9999", "2026-10-16")
        self.assertFalse(result["matched"])
        self.assertEqual(result["reason"], "no_log")

    def test_conv_local_train_is_not_queried_at_all(self):
        with mock.patch.object(emu_lookup, "railre_rows") as railre:
            result = emu_lookup.lookup_vehicle("K146", "2026-10-16")
        railre.assert_not_called()
        self.assertEqual(result["reason"], "not_emu")

    def test_upstream_failure_is_not_reported_as_no_data(self):
        with mock.patch.object(emu_lookup, "railre_rows",
                               side_effect=emu_lookup.UpstreamError("连不上")), \
                mock.patch.object(emu_lookup, "alias_numbers", return_value=[]):
            result = emu_lookup.lookup_vehicle("G2", "2026-10-16")
        self.assertFalse(result["matched"])
        self.assertEqual(result["reason"], "upstream")

    def test_alias_is_tried_even_when_the_typed_number_has_older_records(self):
        # 填的号上有记录但缺这天，同样可能是复车次记在另一个号下：照试
        target = (date.today() + timedelta(days=1)).isoformat()

        def fake_rows(number):
            if number == "G1737":
                return rows(("2026-01-05", "CR400BFZ5267"))
            return rows((target, "CR400BFZ5267"))

        with mock.patch.object(emu_lookup, "railre_rows", side_effect=fake_rows), \
                mock.patch.object(emu_lookup, "alias_numbers", return_value=["G1736"]):
            result = emu_lookup.lookup_vehicle("G1737", target, "南京南", "汉口")
        self.assertTrue(result["matched"])
        self.assertTrue(result["viaAlias"])
        self.assertEqual(result["usedTrain"], "G1736")

    def test_past_date_miss_does_not_bother_12306(self):
        with mock.patch.object(emu_lookup, "railre_rows",
                               return_value=rows(("2026-01-05", "CR400BFZ5267"))), \
                mock.patch.object(emu_lookup, "_station_telecodes") as tele, \
                mock.patch.object(emu_lookup, "_left_ticket_rows") as query:
            result = emu_lookup.lookup_vehicle("G176", "2026-10-01")
        self.assertEqual(result["reason"], "outside_window")
        self.assertEqual(result["window"], {"from": "2026-01-05", "to": "2026-01-05"})
        tele.assert_not_called()
        query.assert_not_called()

    def test_compound_input_tries_both_numbers(self):
        seen = []

        def fake_rows(number):
            seen.append(number)
            return rows(("2026-10-16", "CR400AFX2542")) if number == "G48" else []

        with mock.patch.object(emu_lookup, "railre_rows", side_effect=fake_rows), \
                mock.patch.object(emu_lookup, "alias_numbers", return_value=[]):
            result = emu_lookup.lookup_vehicle("G45/8", "2026-10-16")
        # 尾号先查，命中就不必再试首段
        self.assertEqual(seen, ["G48"])
        self.assertTrue(result["matched"])
        self.assertEqual(result["usedTrain"], "G48")
        self.assertEqual(result["tried"], ["G48"])
        self.assertFalse(result["viaAlias"])

    def test_compound_input_falls_back_to_the_head_number(self):
        seen = []

        def fake_rows(number):
            seen.append(number)
            return rows(("2026-10-16", "CR400AFX2542")) if number == "G45" else []

        with mock.patch.object(emu_lookup, "railre_rows", side_effect=fake_rows), \
                mock.patch.object(emu_lookup, "alias_numbers", return_value=[]):
            result = emu_lookup.lookup_vehicle("G45/8", "2026-10-16")
        self.assertEqual(seen, ["G48", "G45"])
        self.assertEqual(result["usedTrain"], "G45")

    def test_alias_number_is_used_only_after_the_typed_number_misses(self):
        target = (date.today() + timedelta(days=1)).isoformat()

        def fake_rows(number):
            return rows((target, "CR400BFZ5267")) if number == "G1736" else []

        with mock.patch.object(emu_lookup, "railre_rows", side_effect=fake_rows), \
                mock.patch.object(emu_lookup, "alias_numbers", return_value=["G1736"]) as alias:
            result = emu_lookup.lookup_vehicle("G1737", target, "南京南", "武汉")
        self.assertTrue(result["matched"])
        self.assertTrue(result["viaAlias"])
        self.assertEqual(result["usedTrain"], "G1736")
        self.assertEqual(alias.call_args[0][0], ["G1737"])
        self.assertEqual(result["tried"], ["G1737", "G1736"])


class TripProfileTest(unittest.TestCase):
    def setUp(self):
        emu_lookup.clear_caches()
        self.addCleanup(emu_lookup.clear_caches)

    def setUp(self):
        emu_lookup.clear_caches()
        self.addCleanup(emu_lookup.clear_caches)
        # 12306 车次查询只回最近两天，用明天的日期才不会哪天都测成 "past"
        self.day = (date.today() + timedelta(days=1)).isoformat()

    def payload(self, *hits):
        return {"status": True, "data": list(hits)}

    def row(self, code, origin, terminal):
        return {"station_train_code": code, "from_station": origin,
                "to_station": terminal, "train_no": "24000" + code}

    def test_the_row_with_this_exact_number_is_the_trip(self):
        # keyword 是前缀匹配：查 G2 会把 G20 一起带回来，必须按号全等挑那一行
        payload = self.payload(self.row("G20", "北京南", "上海虹桥"),
                               self.row("G2", "上海虹桥", "北京南"))
        with mock.patch.object(emu_lookup, "_get", return_value=payload) as get:
            trip = emu_lookup.trip_profile("G2", self.day)
        self.assertEqual((trip["origin"], trip["terminal"]), ("上海虹桥", "北京南"))
        self.assertTrue(trip["matched"])
        get.assert_called_once()

    def test_compound_pair_asks_with_the_tail_number(self):
        payload = self.payload(self.row("G1737", "上海虹桥", "宜昌北"))
        with mock.patch.object(emu_lookup, "_get", return_value=payload) as get:
            emu_lookup.trip_profile("G1736/7", self.day)
        self.assertIn("keyword=G1737", get.call_args[0][0])
        self.assertIn("date=" + self.day.replace("-", ""), get.call_args[0][0])

    def test_date_past_the_window_is_not_reported_as_a_missing_train(self):
        # 实测 12306 只回最近两天：10-14 还有，10-13 起一律空数组，别骂成"没这车次"
        old = (date.today() - timedelta(days=emu_lookup.SEARCH_BACK_DAYS + 30)).isoformat()
        with mock.patch.object(emu_lookup, "_get") as get:
            trip = emu_lookup.trip_profile("G1970", old)
        get.assert_not_called()
        self.assertEqual(trip["reason"], "past")

    def test_no_row_for_that_day_is_a_real_miss(self):
        with mock.patch.object(emu_lookup, "_get", return_value=self.payload()):
            trip = emu_lookup.trip_profile("Z45", self.day)
        self.assertFalse(trip["matched"])
        self.assertEqual(trip["reason"], "no_train")

    def test_upstream_error_is_not_reported_as_no_data(self):
        with mock.patch.object(emu_lookup, "_get",
                               side_effect=emu_lookup.UpstreamError("连不上")):
            trip = emu_lookup.trip_profile("G2", self.day)
        self.assertFalse(trip["matched"])
        self.assertEqual(trip["reason"], "upstream")

    def test_junk_and_bad_date_are_not_queried_at_all(self):
        with mock.patch.object(emu_lookup, "_get") as get:
            self.assertEqual(emu_lookup.trip_profile("动车", self.day)["reason"], "bad_train")
            self.assertEqual(emu_lookup.trip_profile("G2", "20261016")["reason"], "bad_date")
            # 写法像日期但这天不存在
            self.assertEqual(emu_lookup.trip_profile("G2", "2026-02-31")["reason"], "bad_date")
        get.assert_not_called()

    def test_conv_train_still_gets_a_trip(self):
        # 普速没有车号记录，但 12306 知道它的始发终到
        with mock.patch.object(emu_lookup, "railre_rows") as railre, \
                mock.patch.object(emu_lookup, "_get",
                                  return_value=self.payload(self.row("K146", "武昌", "西安"))):
            result = emu_lookup.lookup_vehicle("K146", self.day)
        railre.assert_not_called()
        self.assertEqual(result["reason"], "not_emu")
        self.assertEqual(result["trip"]["origin"], "武昌")
        self.assertEqual(result["trip"]["terminal"], "西安")

    def test_the_two_sources_fail_independently(self):
        with mock.patch.object(emu_lookup, "railre_rows", return_value=rows(
                ("2026-10-16", "CR400AFX2542"))), \
                mock.patch.object(emu_lookup, "alias_numbers", return_value=[]), \
                mock.patch.object(emu_lookup, "trip_profile",
                                  return_value={"origin": "", "terminal": "",
                                                "matched": False, "reason": "past"}):
            result = emu_lookup.lookup_vehicle("G2", "2026-10-16")
        self.assertTrue(result["matched"])
        self.assertFalse(result["trip"]["matched"])


class AliasNumbersTest(unittest.TestCase):
    def setUp(self):
        emu_lookup.clear_caches()
        self.addCleanup(emu_lookup.clear_caches)
        self.future = (date.today() + timedelta(days=1)).isoformat()

    def left_ticket(self, *rows_text):
        return list(rows_text)

    def row(self, code, train_no):
        return "|".join([""] * 2 + [train_no, code] + [""] * 20)

    def test_internal_code_reveals_the_other_half_of_the_pair(self):
        with mock.patch.object(emu_lookup, "_station_telecodes",
                               return_value={"南京南": "NKH", "武汉": "WHN"}), \
                mock.patch.object(emu_lookup, "_left_ticket_rows",
                                  return_value=[self.row("G1737", "5l000G173603"),
                                                self.row("G1043", "24000G104301")]):
            found = emu_lookup.alias_numbers(["G1737"], self.future, "南京南", "武汉")
        self.assertEqual(found, ["G1736"])

    def test_single_number_train_gets_no_alias(self):
        with mock.patch.object(emu_lookup, "_station_telecodes",
                               return_value={"北京西": "BXP", "珠海": "ZHQ"}), \
                mock.patch.object(emu_lookup, "_left_ticket_rows",
                                  return_value=[self.row("G1043", "24000G104301")]):
            found = emu_lookup.alias_numbers(["G1043"], self.future, "北京西", "珠海")
        self.assertEqual(found, [])

    def test_past_date_is_not_asked_of_12306(self):
        with mock.patch.object(emu_lookup, "_station_telecodes") as tele, \
                mock.patch.object(emu_lookup, "_left_ticket_rows") as query:
            found = emu_lookup.alias_numbers(["G1737"], "2026-05-31", "南京南", "武汉")
        self.assertEqual(found, [])
        tele.assert_not_called()
        query.assert_not_called()

    def test_12306_being_blocked_degrades_to_no_alias(self):
        with mock.patch.object(emu_lookup, "_station_telecodes",
                               side_effect=emu_lookup.UpstreamError("12306 拒绝")), \
                mock.patch.object(emu_lookup, "_left_ticket_rows"):
            found = emu_lookup.alias_numbers(["G1737"], self.future, "南京南", "武汉")
        self.assertEqual(found, [])


class RailReFetchTest(unittest.TestCase):
    def setUp(self):
        emu_lookup.clear_caches()
        self.addCleanup(emu_lookup.clear_caches)

    def test_rows_are_cached_so_typing_does_not_rehammer_upstream(self):
        payload = json.dumps([{"date": "2026-10-16 11:32", "emu_no": "CR400AFX2542",
                               "train_no": "G2"}]).encode("utf-8")
        with mock.patch("urllib.request.urlopen") as urlopen_mock:
            urlopen_mock.return_value.__enter__.return_value.read.return_value = payload
            first = emu_lookup.railre_rows("G2")
            second = emu_lookup.railre_rows("G2")
        self.assertEqual(urlopen_mock.call_count, 1)
        self.assertEqual(first, second)
        self.assertEqual(emu_lookup.units_on_date(first, "2026-10-16"), ["CR400AF-X-2542"])

    def test_tls_reset_is_retried_before_calling_it_no_data(self):
        payload = json.dumps([{"date": "2026-10-16 11:32", "emu_no": "CR400AFX2542",
                               "train_no": "G2"}]).encode("utf-8")
        ok = mock.MagicMock()
        ok.__enter__.return_value.read.return_value = payload
        with mock.patch("urllib.request.urlopen",
                        side_effect=[URLError("[SSL: UNEXPECTED_EOF]"), ok]) as urlopen_mock:
            rows = emu_lookup.railre_rows("G2")
        self.assertEqual(urlopen_mock.call_count, 2)
        self.assertEqual(emu_lookup.units_on_date(rows, "2026-10-16"), ["CR400AF-X-2542"])

    def test_non_json_response_raises_upstream_error(self):
        with mock.patch("urllib.request.urlopen") as urlopen_mock:
            urlopen_mock.return_value.__enter__.return_value.read.return_value = b"<html>nope"
            with self.assertRaises(emu_lookup.UpstreamError):
                emu_lookup.railre_rows("G2")

    def test_network_error_raises_upstream_error(self):
        with mock.patch("urllib.request.urlopen", side_effect=OSError("超时")):
            with self.assertRaises(emu_lookup.UpstreamError):
                emu_lookup.railre_rows("G2")


class EmuUnitAuthTest(unittest.TestCase):
    """这个接口会代上游发请求，不能开着给匿名访客用。"""

    def setUp(self):
        serve.AUTH_FAILURES.clear()
        self.env = mock.patch.dict(
            os.environ,
            {
                "TRAIN_AUTH_ENABLED": "1",
                "TRAIN_AUTH_USERNAME": "traveller",
                "TRAIN_AUTH_PASSWORD_HASH": serve.make_password_hash(
                    "a-long-test-password", iterations=2_000, salt=b"0123456789abcdef"
                ),
                "TRAIN_SESSION_SECRET": "test-session-secret-that-is-long-enough",
                "TRAIN_COOKIE_SECURE": "0",
            },
        )
        self.env.start()
        self.httpd = serve.ThreadingHTTPServer(("127.0.0.1", 0), serve.Handler)
        self.httpd.auth_config = serve.load_auth_config()
        self.thread = threading.Thread(target=self.httpd.serve_forever, daemon=True)
        self.thread.start()
        self.base_url = f"http://127.0.0.1:{self.httpd.server_port}"

    def tearDown(self):
        self.httpd.shutdown()
        self.httpd.server_close()
        self.thread.join(timeout=2)
        self.env.stop()
        serve.AUTH_FAILURES.clear()

    def test_anonymous_lookup_is_refused(self):
        request = Request(f"{self.base_url}/api/emu-unit?train=G2&date=2026-10-16")
        try:
            with urlopen(request) as response:
                code, body = response.status, response.read()
        except HTTPError as error:
            code, body = error.code, error.read()
        self.assertEqual(code, 401)
        self.assertFalse(json.loads(body.decode("utf-8"))["ok"])


class EmuUnitRouteTest(unittest.TestCase):
    def setUp(self):
        self.env = mock.patch.dict("os.environ", {"TRAIN_AUTH_ENABLED": "0"})
        self.env.start()
        self.httpd = serve.ThreadingHTTPServer(("127.0.0.1", 0), serve.Handler)
        self.thread = threading.Thread(target=self.httpd.serve_forever, daemon=True)
        self.thread.start()
        self.base_url = f"http://127.0.0.1:{self.httpd.server_port}"

    def tearDown(self):
        self.httpd.shutdown()
        self.httpd.server_close()
        self.thread.join(timeout=2)
        self.env.stop()

    def get(self, train, target, frm="", to=""):
        query = urlencode({"train": train, "date": target, "from": frm, "to": to})
        with urlopen(Request(f"{self.base_url}/api/emu-unit?{query}")) as response:
            return response.status, json.loads(response.read().decode("utf-8"))

    def test_route_passes_the_form_fields_through(self):
        canned = {"matched": True, "value": "CR400AF-X-2542", "units": ["CR400AF-X-2542"],
                  "reunion": False, "usedTrain": "G2", "viaAlias": False, "reason": None}
        with mock.patch.object(serve.emu_lookup, "lookup_vehicle",
                               return_value=canned) as lookup:
            status, body = self.get("G2", "2026-10-16", "北京南", "上海虹桥")
        self.assertEqual(status, 200)
        self.assertTrue(body["ok"])
        self.assertEqual(body["value"], "CR400AF-X-2542")
        self.assertEqual(lookup.call_args[0], ("G2", "2026-10-16", "北京南", "上海虹桥"))

    def test_lookup_crash_still_answers_json(self):
        with mock.patch.object(serve.emu_lookup, "lookup_vehicle",
                               side_effect=RuntimeError("上游格式变了")):
            status, body = self.get("G2", "2026-10-16")
        self.assertEqual(status, 200)
        self.assertFalse(body["ok"])
        self.assertEqual(body["reason"], "upstream")

    def test_long_inputs_are_clipped_before_hitting_upstream(self):
        with mock.patch.object(serve.emu_lookup, "lookup_vehicle",
                               return_value={"matched": False, "reason": "not_emu"}) as lookup:
            self.get("G" + "1" * 60, "2026-10-16" + "9" * 30)
        args = lookup.call_args[0]
        self.assertLessEqual(len(args[0]), 24)
        self.assertLessEqual(len(args[1]), 10)


if __name__ == "__main__":
    unittest.main()
