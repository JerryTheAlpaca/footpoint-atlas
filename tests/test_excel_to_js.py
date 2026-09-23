import tempfile
import unittest
import stat
from pathlib import Path

from tools import excel_to_js


SAMPLE_RECORDS = [
    {
        "date": "2023-07-27",
        "from": "南京南",
        "to": "兰州西",
        "train": "G1970",
        "vehicle": "CRH380BL",
        "origin": "上海虹桥",
        "terminal": "兰州西",
        "bureau": "上海局",
    },
    {
        "date": "2026-08-16",
        "from": "杭州东",
        "to": "南京南",
        "train": "D2294",
        "vehicle": "",
        "origin": "深圳北",
        "terminal": "南京南",
        "bureau": "广州局",
    },
]


class ExcelWriteTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.excel_path = Path(self.temp_dir.name) / "rides.xlsx"

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_date_format_drops_leading_zeros(self):
        self.assertEqual(excel_to_js.format_excel_date("2023-07-27"), "2023.7.27")
        self.assertEqual(excel_to_js.format_excel_date("2026-08-16"), "2026.8.16")

    def test_data_paths_use_a_separate_deployment_directory(self):
        data_dir = Path(self.temp_dir.name) / "persistent-data"
        excel_path, output_path = excel_to_js.data_paths(data_dir)
        self.assertEqual(excel_path, data_dir.resolve() / "火车乘车记录.xlsx")
        self.assertEqual(output_path, data_dir.resolve() / "data.js")

    def test_write_data_js_preserves_existing_file_mode(self):
        output_path = Path(self.temp_dir.name) / "data.js"
        output_path.write_text("old", encoding="utf-8")
        output_path.chmod(0o644)
        existing_mode = stat.S_IMODE(output_path.stat().st_mode)
        excel_to_js.write_data_js(SAMPLE_RECORDS, {}, output_path)
        self.assertEqual(stat.S_IMODE(output_path.stat().st_mode), existing_mode)

    def test_write_then_read_roundtrip_and_shrinks_rows(self):
        excel_to_js.write_records(SAMPLE_RECORDS, self.excel_path)
        self.assertEqual(excel_to_js.read_records(self.excel_path), SAMPLE_RECORDS)

        workbook = excel_to_js.openpyxl.load_workbook(self.excel_path)
        sheet = workbook[workbook.sheetnames[0]]
        self.assertEqual(sheet.title, "乘车记录")
        self.assertEqual([cell.value for cell in sheet[1]], list(excel_to_js.HEADERS))
        self.assertEqual(sheet["A2"].value, "2023.7.27")
        self.assertEqual(sheet["E3"].value, None)
        self.assertEqual(sheet.max_row, 3)

        excel_to_js.write_records(SAMPLE_RECORDS[:1], self.excel_path)
        self.assertEqual(excel_to_js.read_records(self.excel_path), SAMPLE_RECORDS[:1])
        workbook = excel_to_js.openpyxl.load_workbook(self.excel_path)
        sheet = workbook[workbook.sheetnames[0]]
        self.assertEqual(sheet.max_row, 2)
        self.assertEqual(sheet["A3"].value, None)

    def test_roundtrip_matches_project_excel(self):
        source = excel_to_js.EXCEL_PATH
        if not source.exists():
            self.skipTest("项目 Excel 不存在")
        original = excel_to_js.read_records(source)
        excel_to_js.write_records(original, self.excel_path)
        self.assertEqual(excel_to_js.read_records(self.excel_path), original)


class StationCoordLookupTests(unittest.TestCase):
    """站名坐标：手工表优先，铁路网络节点锚点兜底。"""

    def test_network_nodes_supply_coords_for_line_stations(self):
        coords = excel_to_js.network_station_coords()
        # 宁蓉试点站与徐兰高铁沿线站都只在网络里有坐标。
        for name in ("麻城北", "天水南", "宝鸡南"):
            self.assertEqual(len(coords[name]), 2, name)

    def test_stations_for_falls_back_to_network_anchor(self):
        rec = {**SAMPLE_RECORDS[0], "from": "天水南", "to": "宝鸡南"}
        out = excel_to_js.stations_for([rec])
        network = excel_to_js.network_station_coords()
        self.assertEqual(out["天水南"], network["天水南"])

    def test_manual_table_wins_over_network_anchor(self):
        # 手工表里 2 位小数粗坐标是按正线校准过的历史值，不能被覆盖。
        lookup = excel_to_js.station_coord_lookup()
        for name, coord in excel_to_js.STATION_COORDS.items():
            self.assertEqual(lookup[name], coord)

    def test_unparseable_or_missing_route_data_is_tolerated(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.assertEqual(
                excel_to_js.network_station_coords(Path(tmp) / "rail-route-data.js"), {}
            )
            broken = Path(tmp) / "rail-route-data.js"
            broken.write_text("(function(){ var RAIL_ROUTE_DATA = {\"nodes\": [oops};", "utf-8")
            self.assertEqual(excel_to_js.network_station_coords(broken), {})


if __name__ == "__main__":
    unittest.main()
