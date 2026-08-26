import json
import tempfile
import threading
import unittest
from pathlib import Path
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
        self.old_output = serve.OUTPUT_PATH
        serve.OUTPUT_PATH = self.data_path
        self.httpd = serve.ThreadingHTTPServer(("127.0.0.1", 0), serve.Handler)
        self.thread = threading.Thread(target=self.httpd.serve_forever, daemon=True)
        self.thread.start()
        self.base_url = f"http://127.0.0.1:{self.httpd.server_port}"

    def tearDown(self):
        self.httpd.shutdown()
        self.httpd.server_close()
        self.thread.join(timeout=2)
        serve.OUTPUT_PATH = self.old_output
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


if __name__ == "__main__":
    unittest.main()
