import json
import os
import tempfile
import threading
import unittest
from http.cookiejar import CookieJar
from pathlib import Path
from unittest import mock
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import HTTPCookieProcessor, Request, build_opener, urlopen

from tools import serve


class ServeApiTests(unittest.TestCase):
    def setUp(self):
        self.auth_env = mock.patch.dict(os.environ, {"TRAIN_AUTH_ENABLED": "0"})
        self.auth_env.start()
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
        self.auth_env.stop()
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

    def test_empty_deployment_data_directory_is_seeded(self):
        with tempfile.TemporaryDirectory() as directory:
            excel_path = Path(directory) / "火车乘车记录.xlsx"
            data_path = Path(directory) / "data.js"
            with mock.patch.dict(os.environ, {"TRAIN_DATA_DIR": directory}):
                with mock.patch.object(serve, "EXCEL_PATH", excel_path):
                    with mock.patch.object(serve, "OUTPUT_PATH", data_path):
                        serve.initialize_deployment_data()
            self.assertEqual(excel_path.read_bytes(), (serve.ROOT / "火车乘车记录.xlsx").read_bytes())
            self.assertEqual(data_path.read_bytes(), (serve.ROOT / "js" / "data.js").read_bytes())


class ServeAuthenticationTests(unittest.TestCase):
    def setUp(self):
        serve.AUTH_FAILURES.clear()
        password_hash = serve.make_password_hash(
            "a-long-test-password", iterations=2_000, salt=b"0123456789abcdef"
        )
        self.auth_env = mock.patch.dict(
            os.environ,
            {
                "TRAIN_AUTH_ENABLED": "1",
                "TRAIN_AUTH_USERNAME": "traveller",
                "TRAIN_AUTH_PASSWORD_HASH": password_hash,
                "TRAIN_SESSION_SECRET": "test-session-secret-that-is-long-enough",
                "TRAIN_COOKIE_SECURE": "0",
            },
        )
        self.auth_env.start()
        self.httpd = serve.ThreadingHTTPServer(("127.0.0.1", 0), serve.Handler)
        self.httpd.auth_config = serve.load_auth_config()
        self.thread = threading.Thread(target=self.httpd.serve_forever, daemon=True)
        self.thread.start()
        self.base_url = f"http://127.0.0.1:{self.httpd.server_port}"
        self.cookies = CookieJar()
        self.opener = build_opener(HTTPCookieProcessor(self.cookies))

    def tearDown(self):
        self.httpd.shutdown()
        self.httpd.server_close()
        self.thread.join(timeout=2)
        self.auth_env.stop()
        serve.AUTH_FAILURES.clear()

    def request_status(self, request):
        try:
            with self.opener.open(request) as response:
                return response.status, response.read()
        except HTTPError as error:
            return error.code, error.read()

    def login(self):
        body = urlencode(
            {"username": "traveller", "password": "a-long-test-password", "return_to": "/"}
        ).encode("utf-8")
        return self.request_status(
            Request(
                self.base_url + "/login",
                data=body,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                method="POST",
            )
        )

    def test_page_redirects_to_login_and_api_returns_401(self):
        status, page = self.request_status(self.base_url + "/")
        self.assertEqual(status, 200)
        self.assertIn("登录 · 我的火车足迹", page.decode("utf-8"))

        status, payload = self.request_status(self.base_url + "/api/train-data")
        self.assertEqual(status, 401)
        self.assertEqual(json.loads(payload)["error"], "请先登录")

    def test_login_sets_session_and_allows_the_dashboard(self):
        status, page = self.login()
        self.assertEqual(status, 200)
        self.assertIn("<title>我的火车足迹</title>", page.decode("utf-8"))
        self.assertTrue(any(cookie.name == "train_session" for cookie in self.cookies))

        status, payload = self.request_status(self.base_url + "/api/auth-status")
        self.assertEqual(status, 200)
        auth_status = json.loads(payload)
        self.assertTrue(auth_status["authenticated"])
        self.assertEqual(auth_status["username"], "traveller")

    def test_authenticated_server_does_not_expose_repository_files(self):
        self.login()
        status, _ = self.request_status(self.base_url + "/README.md")
        self.assertEqual(status, 404)

    def test_cross_origin_write_is_rejected_and_same_origin_logout_clears_cookie(self):
        self.login()
        status, payload = self.request_status(
            Request(
                self.base_url + "/api/save-train-data",
                data=b"{}",
                headers={"Content-Type": "application/json", "Origin": "https://example.com"},
                method="POST",
            )
        )
        self.assertEqual(status, 403)
        self.assertEqual(json.loads(payload)["error"], "请求来源无效")

        status, page = self.request_status(
            Request(
                self.base_url + "/logout",
                data=b"",
                headers={"Origin": self.base_url},
                method="POST",
            )
        )
        self.assertEqual(status, 200)
        self.assertIn("登录 · 我的火车足迹", page.decode("utf-8"))
        self.assertFalse(any(cookie.name == "train_session" for cookie in self.cookies))

    def test_session_signature_and_safe_return_path(self):
        config = self.httpd.auth_config
        token = serve.make_session(config, config.username, now=100)
        self.assertEqual(serve.session_username(config, token, now=101), config.username)
        self.assertIsNone(serve.session_username(config, token + "x", now=101))
        self.assertIsNone(serve.session_username(config, token, now=100 + config.session_ttl + 1))
        self.assertEqual(serve.safe_return_to("https://example.com/steal"), "/")
        self.assertEqual(serve.safe_return_to("//example.com/steal"), "/")
        self.assertEqual(serve.safe_return_to("/records?year=2026"), "/records?year=2026")


class ServeSsoTests(unittest.TestCase):
    def sso_config(self):
        with mock.patch.dict(
            os.environ,
            {
                "TRAIN_AUTH_ENABLED": "1",
                "TRAIN_AUTH_USERNAME": "jerry",
                "TRAIN_SSO_SESSION_URL": "http://ledger-auth:3000/api/auth/session",
                "TRAIN_SSO_LOGOUT_URL": "http://ledger-auth:3000/api/auth/logout",
                "TRAIN_SSO_LOGIN_URL": "https://auth.jerrythealpaca.cn/login",
                "TRAIN_SSO_PUBLIC_ORIGIN": "https://atlas.jerrythealpaca.cn",
                "TRAIN_SSO_COOKIE_NAME": "__Secure-jerry_session",
                "TRAIN_SSO_COOKIE_DOMAIN": ".jerrythealpaca.cn",
            },
            clear=True,
        ):
            return serve.load_auth_config()

    def test_sso_config_does_not_require_legacy_password_secret(self):
        config = self.sso_config()
        self.assertTrue(config.enabled)
        self.assertTrue(config.sso_enabled)
        self.assertEqual(config.username, "jerry")

    def test_sso_session_is_verified_by_central_auth(self):
        config = self.sso_config()
        response = mock.MagicMock()
        response.__enter__.return_value.read.return_value = json.dumps(
            {"data": {"user": {"id": "user-1", "username": "jerry"}}}
        ).encode("utf-8")

        with mock.patch.object(serve, "urlopen", return_value=response) as opener:
            self.assertEqual(serve.sso_session_username(config, "secret-token"), "jerry")

        request = opener.call_args.args[0]
        self.assertEqual(request.get_header("Cookie"), "__Secure-jerry_session=secret-token")
        self.assertEqual(opener.call_args.kwargs["timeout"], 3)

    def test_sso_rejects_wrong_user_and_builds_whitelisted_return_url(self):
        config = self.sso_config()
        response = mock.MagicMock()
        response.__enter__.return_value.read.return_value = json.dumps(
            {"data": {"user": {"id": "user-2", "username": "someone-else"}}}
        ).encode("utf-8")

        with mock.patch.object(serve, "urlopen", return_value=response):
            self.assertIsNone(serve.sso_session_username(config, "secret-token"))

        location = serve.sso_login_location(config, "/?year=2026")
        self.assertIn("https%3A%2F%2Fatlas.jerrythealpaca.cn%2F%3Fyear%3D2026", location)
        self.assertEqual(
            serve.sso_login_location(config, "https://example.com/steal"),
            "https://auth.jerrythealpaca.cn/login?return_to=https%3A%2F%2Fatlas.jerrythealpaca.cn%2F",
        )


if __name__ == "__main__":
    unittest.main()
