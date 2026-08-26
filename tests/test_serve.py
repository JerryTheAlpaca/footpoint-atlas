import json
import tempfile
import threading
import unittest
from pathlib import Path
from unittest import mock
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from tools import serve


class ServeApiTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.data_path = Path(self.temp_dir.name) / "data.js"
        serve.write_data_js(
            [
                {
                    "date": "2026-08-26",
                    "from": "南京南",
                    "to": "汉口",
                    "train": "G599",
                    "vehicle": "",
                    "origin": "",
                    "terminal": "",
                    "bureau": "",
                }
            ],
            {"南京南": [118.81, 31.97], "汉口": [114.26, 30.62]},
            self.data_path,
        )
        self.excel_path = Path(self.temp_dir.name) / "rides.xlsx"
        serve.write_records(
            [
                {
                    "date": "2026-08-26",
                    "from": "南京南",
                    "to": "汉口",
                    "train": "G599",
                    "vehicle": "",
                    "origin": "",
                    "terminal": "",
                    "bureau": "",
                }
            ],
            self.excel_path,
        )
        self.old_output = serve.OUTPUT_PATH
        self.old_excel = serve.EXCEL_PATH
        serve.OUTPUT_PATH = self.data_path
        serve.EXCEL_PATH = self.excel_path
        self.httpd = serve.ThreadingHTTPServer(("127.0.0.1", 0), serve.Handler)
        self.thread = threading.Thread(target=self.httpd.serve_forever, daemon=True)
        self.thread.start()
        self.base_url = f"http://127.0.0.1:{self.httpd.server_port}"

    def tearDown(self):
        self.httpd.shutdown()
        self.httpd.server_close()
        self.thread.join(timeout=2)
        serve.OUTPUT_PATH = self.old_output
        serve.EXCEL_PATH = self.old_excel
        self.temp_dir.cleanup()

    def get_snapshot(self):
        with urlopen(self.base_url + "/api/train-data") as response:
            return json.loads(response.read().decode("utf-8"))

    def post(self, payload):
        request = Request(
            self.base_url + "/api/save-train-data",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urlopen(request) as response:
                return response.status, json.loads(response.read().decode("utf-8"))
        except HTTPError as error:
            return error.code, json.loads(error.read().decode("utf-8"))

    def test_matching_version_saves_and_stale_version_is_rejected(self):
        snapshot = self.get_snapshot()
        payload = {
            "baseVersion": snapshot["version"],
            "records": snapshot["records"]
            + [
                {
                    "date": "2026-08-27",
                    "from": "汉口",
                    "to": "武汉",
                    "train": "G1",
                    "vehicle": "",
                    "origin": "",
                    "terminal": "",
                    "bureau": "",
                }
            ],
            "stations": dict(snapshot["stations"], 武汉=[114.42, 30.61]),
        }
        status, saved = self.post(payload)
        self.assertEqual(status, 200)
        self.assertTrue(saved["version"])
        changed_bytes = self.data_path.read_bytes()

        stale_payload = dict(payload, baseVersion=snapshot["version"])
        stale_payload["records"] = snapshot["records"]
        status, conflict = self.post(stale_payload)
        self.assertEqual(status, 409)
        self.assertTrue(conflict["conflict"])
        self.assertEqual(self.data_path.read_bytes(), changed_bytes)

    def test_save_writes_excel_and_edit_replaces_row(self):
        from tools import excel_to_js

        snapshot = self.get_snapshot()
        added = {
            "date": "2026-08-27",
            "from": "汉口",
            "to": "武汉",
            "train": "G1",
            "vehicle": "CR400AF",
            "origin": "北京西",
            "terminal": "武汉",
            "bureau": "武汉局",
        }
        status, saved = self.post(
            {
                "baseVersion": snapshot["version"],
                "records": snapshot["records"] + [added],
                "stations": dict(snapshot["stations"], 武汉=[114.42, 30.61]),
            }
        )
        self.assertEqual(status, 200)
        self.assertTrue(saved["version"])
        self.assertEqual(excel_to_js.read_records(self.excel_path)[-1], added)

        edited = dict(added, train="G2", vehicle="CR400BF")
        status, _ = self.post(
            {
                "baseVersion": saved["version"],
                "records": [snapshot["records"][0], edited],
                "stations": dict(snapshot["stations"], 武汉=[114.42, 30.61]),
            }
        )
        self.assertEqual(status, 200)
        self.assertEqual(excel_to_js.read_records(self.excel_path), [snapshot["records"][0], edited])

    def test_server_rejects_invalid_dates_and_coordinates(self):
        with self.assertRaises(ValueError):
            serve.sanitize_payload(
                {
                    "records": [
                        {"date": "2026-99-99", "from": "A", "to": "B", "train": "G1"}
                    ],
                    "stations": {},
                }
            )
        with self.assertRaises(ValueError):
            serve.sanitize_payload(
                {
                    "records": [],
                    "stations": {"A": [float("nan"), 0]},
                }
            )


class ServeArgTests(unittest.TestCase):
    def test_default_port_does_not_open_browser(self):
        args = serve.parse_args([])
        self.assertEqual(args.port, 8765)
        self.assertEqual(args.host, "127.0.0.1")
        self.assertFalse(args.open_browser)

    def test_positional_port_and_open_flag(self):
        args = serve.parse_args(["9000", "--open"])
        self.assertEqual(args.port, 9000)
        self.assertTrue(args.open_browser)

    def test_open_flag_without_port(self):
        args = serve.parse_args(["--open"])
        self.assertEqual(args.port, 8765)
        self.assertTrue(args.open_browser)

    def test_host_can_be_set_for_container_deployment(self):
        args = serve.parse_args(["8765", "--host", "0.0.0.0"])
        self.assertEqual(args.host, "0.0.0.0")

    def test_port_in_use_opens_existing_page(self):
        with mock.patch.object(serve, "ThreadingHTTPServer", side_effect=OSError):
            with mock.patch.object(serve.webbrowser, "open") as opener:
                serve.main(["8765", "--open"])
        opener.assert_called_once_with("http://127.0.0.1:8765/")

    def test_port_in_use_without_open_does_not_launch_browser(self):
        with mock.patch.object(serve, "ThreadingHTTPServer", side_effect=OSError):
            with mock.patch.object(serve.webbrowser, "open") as opener:
                serve.main(["8765"])
        opener.assert_not_called()


if __name__ == "__main__":
    unittest.main()
