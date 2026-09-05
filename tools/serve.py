"""本地预览，并把设置页的行程写回 js/data.js 和 Excel。

在项目根目录运行：

    python tools/serve.py
    python tools/serve.py 8765
    python tools/serve.py 8765 --open

然后打开提示的地址。直接双击 index.html 或使用普通静态服务器时，
浏览器写不了磁盘，行程会先暂存在本机。
"""

from __future__ import annotations

import argparse
import base64
import binascii
import html
import hashlib
import hmac
import json
import math
import os
import re
import secrets
import shutil
import sys
import threading
import time
import webbrowser
from dataclasses import dataclass
from datetime import date
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from http.cookies import SimpleCookie
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, quote, unquote, urlencode, urlsplit
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from excel_to_js import EXCEL_PATH, OUTPUT_PATH, write_data_js, write_records  # noqa: E402

RECORD_FIELDS = ("date", "from", "to", "train", "vehicle", "origin", "terminal", "bureau")
DATE_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")
DATA_LOCK = threading.Lock()
AUTH_LOCK = threading.Lock()
AUTH_FAILURES: dict[str, list[float]] = {}
PASSWORD_HASH_PATTERN = re.compile(r"^pbkdf2_sha256\.(\d+)\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)$")
PUBLIC_PATHS = frozenset({"/login", "/healthz"})
STATIC_PREFIXES = ("/css/", "/js/", "/lib/", "/map/")
STATIC_FILES = frozenset({"/", "/index.html", "/favicon.ico", "/图标.ico", "/图标.png"})
MAX_REQUEST_BYTES = 1024 * 1024


@dataclass(frozen=True)
class AuthConfig:
    enabled: bool
    username: str = ""
    password_hash: str = ""
    session_secret: bytes = b""
    session_ttl: int = 12 * 60 * 60
    cookie_secure: bool = False
    trust_proxy: bool = False
    sso_session_url: str = ""
    sso_logout_url: str = ""
    sso_login_url: str = ""
    sso_public_origin: str = ""
    sso_cookie_name: str = "__Secure-jerry_session"
    sso_cookie_domain: str = ".jerrythealpaca.cn"

    @property
    def sso_enabled(self) -> bool:
        return bool(self.sso_session_url)


def env_flag(name: str, default: bool = False) -> bool:
    value = os.environ.get(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def load_auth_config() -> AuthConfig:
    if not env_flag("TRAIN_AUTH_ENABLED"):
        return AuthConfig(enabled=False)

    username = os.environ.get("TRAIN_AUTH_USERNAME", "").strip()
    sso_session_url = os.environ.get("TRAIN_SSO_SESSION_URL", "").strip()
    if sso_session_url:
        sso_logout_url = os.environ.get("TRAIN_SSO_LOGOUT_URL", "").strip()
        sso_login_url = os.environ.get("TRAIN_SSO_LOGIN_URL", "").strip()
        sso_public_origin = os.environ.get("TRAIN_SSO_PUBLIC_ORIGIN", "").strip().rstrip("/")
        sso_cookie_name = os.environ.get(
            "TRAIN_SSO_COOKIE_NAME", "__Secure-jerry_session"
        ).strip()
        sso_cookie_domain = os.environ.get(
            "TRAIN_SSO_COOKIE_DOMAIN", ".jerrythealpaca.cn"
        ).strip()
        required_urls = {
            "TRAIN_SSO_SESSION_URL": sso_session_url,
            "TRAIN_SSO_LOGOUT_URL": sso_logout_url,
            "TRAIN_SSO_LOGIN_URL": sso_login_url,
            "TRAIN_SSO_PUBLIC_ORIGIN": sso_public_origin,
        }
        for name, value in required_urls.items():
            parsed = urlsplit(value)
            if (
                parsed.scheme not in {"http", "https"}
                or not parsed.netloc
                or parsed.username
                or parsed.password
                or parsed.fragment
            ):
                raise ValueError(f"{name} 必须是完整的 HTTP(S) URL")
        public_origin = urlsplit(sso_public_origin)
        if (
            public_origin.scheme != "https"
            or public_origin.path not in {"", "/"}
            or public_origin.query
        ):
            raise ValueError("TRAIN_SSO_PUBLIC_ORIGIN 必须是 HTTPS Origin，不能包含路径或查询")
        if urlsplit(sso_login_url).scheme != "https":
            raise ValueError("TRAIN_SSO_LOGIN_URL 必须使用 HTTPS")
        if not re.fullmatch(r"[A-Za-z0-9_-]+", sso_cookie_name):
            raise ValueError("TRAIN_SSO_COOKIE_NAME 格式无效")
        if not re.fullmatch(r"\.[A-Za-z0-9.-]+", sso_cookie_domain):
            raise ValueError("TRAIN_SSO_COOKIE_DOMAIN 格式无效")
        return AuthConfig(
            enabled=True,
            username=username,
            cookie_secure=env_flag("TRAIN_COOKIE_SECURE", True),
            trust_proxy=env_flag("TRAIN_TRUST_PROXY"),
            sso_session_url=sso_session_url,
            sso_logout_url=sso_logout_url,
            sso_login_url=sso_login_url,
            sso_public_origin=sso_public_origin,
            sso_cookie_name=sso_cookie_name,
            sso_cookie_domain=sso_cookie_domain,
        )

    password_hash = os.environ.get("TRAIN_AUTH_PASSWORD_HASH", "").strip()
    secret = os.environ.get("TRAIN_SESSION_SECRET", "").encode("utf-8")
    if not username:
        raise ValueError("启用登录后必须设置 TRAIN_AUTH_USERNAME")
    if not PASSWORD_HASH_PATTERN.fullmatch(password_hash):
        raise ValueError("TRAIN_AUTH_PASSWORD_HASH 格式无效，请使用 tools/make_password_hash.py 生成")
    if len(secret) < 32:
        raise ValueError("TRAIN_SESSION_SECRET 至少需要 32 个字符")
    try:
        session_ttl = int(os.environ.get("TRAIN_SESSION_TTL_SECONDS", str(12 * 60 * 60)))
    except ValueError as exc:
        raise ValueError("TRAIN_SESSION_TTL_SECONDS 必须是整数") from exc
    if not 300 <= session_ttl <= 30 * 24 * 60 * 60:
        raise ValueError("TRAIN_SESSION_TTL_SECONDS 必须在 300 到 2592000 之间")
    return AuthConfig(
        enabled=True,
        username=username,
        password_hash=password_hash,
        session_secret=secret,
        session_ttl=session_ttl,
        cookie_secure=env_flag("TRAIN_COOKIE_SECURE", True),
        trust_proxy=env_flag("TRAIN_TRUST_PROXY"),
    )


def b64encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("ascii")


def b64decode(value: str) -> bytes:
    return base64.urlsafe_b64decode(value + "=" * (-len(value) % 4))


def make_password_hash(password: str, *, iterations: int = 600_000, salt: bytes | None = None) -> str:
    if not password:
        raise ValueError("密码不能为空")
    actual_salt = salt or secrets.token_bytes(18)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), actual_salt, iterations)
    return f"pbkdf2_sha256.{iterations}.{b64encode(actual_salt)}.{b64encode(digest)}"


def verify_password(password: str, encoded: str) -> bool:
    match = PASSWORD_HASH_PATTERN.fullmatch(encoded)
    if not match:
        return False
    try:
        iterations = int(match.group(1))
        salt = b64decode(match.group(2))
        expected = b64decode(match.group(3))
        actual = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
    except (ValueError, TypeError, binascii.Error):
        return False
    return hmac.compare_digest(actual, expected)


def make_session(config: AuthConfig, username: str, now: int | None = None) -> str:
    payload = {
        "u": username,
        "exp": (int(time.time()) if now is None else now) + config.session_ttl,
        "n": secrets.token_urlsafe(12),
    }
    encoded = b64encode(json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8"))
    signature = b64encode(hmac.new(config.session_secret, encoded.encode("ascii"), hashlib.sha256).digest())
    return f"{encoded}.{signature}"


def session_username(config: AuthConfig, token: str, now: int | None = None) -> str | None:
    try:
        encoded, supplied_signature = token.split(".", 1)
        expected_signature = b64encode(
            hmac.new(config.session_secret, encoded.encode("ascii"), hashlib.sha256).digest()
        )
        if not hmac.compare_digest(supplied_signature, expected_signature):
            return None
        payload = json.loads(b64decode(encoded).decode("utf-8"))
        current = int(time.time()) if now is None else now
        if payload.get("u") != config.username or int(payload.get("exp", 0)) <= current:
            return None
        return config.username
    except (ValueError, TypeError, KeyError, json.JSONDecodeError, UnicodeDecodeError, binascii.Error):
        return None


@dataclass(frozen=True)
class SsoSession:
    username: str
    set_cookies: tuple[str, ...] = ()


def sso_session(config: AuthConfig, token: str) -> SsoSession | None:
    if not config.sso_enabled or not token:
        return None
    request = Request(
        config.sso_session_url,
        headers={"Cookie": f"{config.sso_cookie_name}={token}"},
        method="GET",
    )
    try:
        with urlopen(request, timeout=3) as response:
            payload = json.loads(response.read().decode("utf-8"))
            set_cookies = tuple(response.headers.get_all("Set-Cookie") or ())
    except (HTTPError, URLError, TimeoutError, ValueError, json.JSONDecodeError, UnicodeDecodeError):
        return None
    try:
        username = payload["data"]["user"]["username"]
    except (KeyError, TypeError):
        return None
    if not isinstance(username, str) or not username:
        return None
    if config.username and not hmac.compare_digest(username, config.username):
        return None
    return SsoSession(username=username, set_cookies=set_cookies)


def sso_session_username(config: AuthConfig, token: str) -> str | None:
    session = sso_session(config, token)
    return session.username if session else None


def sso_login_location(config: AuthConfig, return_to: str | None) -> str:
    target = f"{config.sso_public_origin}{safe_return_to(return_to)}"
    return f"{config.sso_login_url}?{urlencode({'return_to': target})}"


def safe_return_to(value: str | None) -> str:
    target = value or "/"
    parsed = urlsplit(target)
    if (
        not target.startswith("/")
        or target.startswith("//")
        or parsed.scheme
        or parsed.netloc
        or "\\" in target
        or any(ord(char) < 32 or ord(char) == 127 for char in target)
    ):
        return "/"
    return target


def login_page(return_to: str = "/", error: str = "") -> bytes:
    escaped_return = html.escape(safe_return_to(return_to), quote=True)
    error_html = f'<p class="error" role="alert">{html.escape(error)}</p>' if error else ""
    document = f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>登录 · 我的火车足迹</title>
  <style>
    :root {{ color-scheme: dark; font-family: Inter, "Microsoft YaHei", system-ui, sans-serif; }}
    * {{ box-sizing: border-box; }}
    body {{ margin: 0; min-height: 100vh; display: grid; place-items: center; color: #eafcff;
      background: radial-gradient(circle at 50% 15%, #123c5c 0, #071725 38%, #030b12 75%); }}
    main {{ width: min(92vw, 410px); padding: 38px 34px; border: 1px solid rgba(0,229,255,.32);
      border-radius: 22px; background: rgba(4,20,32,.88); box-shadow: 0 28px 80px rgba(0,0,0,.45), 0 0 36px rgba(0,229,255,.08); }}
    .mark {{ width: 46px; height: 4px; border-radius: 9px; background: #00e5ff; box-shadow: 0 0 18px #00e5ff; }}
    h1 {{ margin: 22px 0 8px; font-size: 28px; letter-spacing: .04em; }}
    label {{ display: block; margin: 15px 0 7px; color: #bad6e5; font-size: 14px; }}
    input {{ width: 100%; padding: 12px 13px; border: 1px solid #28536d; border-radius: 10px; color: #fff;
      background: #071827; outline: none; font: inherit; }}
    input:focus {{ border-color: #00e5ff; box-shadow: 0 0 0 3px rgba(0,229,255,.12); }}
    button {{ width: 100%; margin-top: 24px; padding: 13px; border: 0; border-radius: 10px; cursor: pointer;
      color: #00141c; background: #00e5ff; font: 700 15px inherit; box-shadow: 0 8px 28px rgba(0,229,255,.2); }}
    button:hover {{ background: #4cefff; }}
    .error {{ margin: 0 0 12px; padding: 10px 12px; border-radius: 9px; color: #ffd9d9; background: rgba(239,68,68,.18); }}
  </style>
</head>
<body>
  <main>
    <div class="mark" aria-hidden="true"></div>
    <h1>我的火车足迹</h1>
    {error_html}
    <form method="post" action="/login">
      <input type="hidden" name="return_to" value="{escaped_return}">
      <label for="username">账号</label>
      <input id="username" name="username" autocomplete="username" required autofocus>
      <label for="password">密码</label>
      <input id="password" name="password" type="password" autocomplete="current-password" required>
      <button type="submit">登录</button>
    </form>
  </main>
</body>
</html>"""
    return document.encode("utf-8")


def data_version(path: Path | None = None) -> str:
    target = path or OUTPUT_PATH
    return hashlib.sha256(target.read_bytes()).hexdigest()


def initialize_deployment_data() -> None:
    """Seed an empty deployment volume from the repository's current data."""
    if not os.environ.get("TRAIN_DATA_DIR"):
        return
    EXCEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    initial_files = ((ROOT / "火车乘车记录.xlsx", EXCEL_PATH), (ROOT / "js" / "data.js", OUTPUT_PATH))
    for source, target in initial_files:
        if not target.exists():
            shutil.copy2(source, target)


def read_data_file(path: Path | None = None) -> tuple[bytes, list[dict], dict]:
    target = path or OUTPUT_PATH
    raw = target.read_bytes()
    prefix = "window.TRAIN_DATA = "
    text = raw.decode("utf-8")
    if not text.startswith(prefix):
        raise ValueError("data.js 格式无效")
    body = text[len(prefix) :].strip()
    if body.endswith(";"):
        body = body[:-1].rstrip()
    payload = json.loads(body)
    records, stations = sanitize_payload(payload)
    return raw, records, stations


def sanitize_payload(payload: object) -> tuple[list[dict], dict]:
    if not isinstance(payload, dict):
        raise ValueError("payload 必须是对象")
    records = payload.get("records")
    stations = payload.get("stations")
    if not isinstance(records, list) or not isinstance(stations, dict):
        raise ValueError("缺少 records 或 stations")

    clean_records = []
    for rec in records:
        if not isinstance(rec, dict):
            raise ValueError("记录格式无效")
        item = {key: str(rec.get(key, "") or "").strip() for key in RECORD_FIELDS}
        if not item["date"] or not item["from"] or not item["to"] or not item["train"]:
            raise ValueError("记录缺少日期、车站或车次")
        if not DATE_PATTERN.fullmatch(item["date"]):
            raise ValueError("日期格式无效")
        try:
            date.fromisoformat(item["date"])
        except ValueError as exc:
            raise ValueError("日期无效") from exc
        clean_records.append(item)

    clean_stations = {}
    for name, coord in stations.items():
        if not isinstance(coord, (list, tuple)) or len(coord) < 2:
            raise ValueError(f"车站坐标无效：{name}")
        try:
            lng = float(coord[0])
            lat = float(coord[1])
        except (TypeError, ValueError) as exc:
            raise ValueError(f"车站坐标无效：{name}") from exc
        if not math.isfinite(lng) or not math.isfinite(lat) or not (-180 <= lng <= 180) or not (-90 <= lat <= 90):
            raise ValueError(f"车站坐标无效：{name}")
        clean_stations[str(name)] = [lng, lat]
    return clean_records, clean_stations


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self._sso_set_cookies: list[str] = []
        super().__init__(*args, directory=str(ROOT), **kwargs)

    @property
    def auth_config(self) -> AuthConfig:
        configured = getattr(self.server, "auth_config", None)
        return configured if configured is not None else load_auth_config()

    def end_headers(self) -> None:
        for cookie in self._sso_set_cookies:
            self.send_header("Set-Cookie", cookie)
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Content-Security-Policy", "frame-ancestors 'none'; base-uri 'none'; object-src 'none'")
        super().end_headers()

    def send_json(self, status: int, payload: object, *, cache: str = "no-store") -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", cache)
        self.end_headers()
        self.wfile.write(body)

    def send_html(self, status: int, body: bytes) -> None:
        self.send_response(status)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def redirect(self, location: str, status: int = 303) -> None:
        self.send_response(status)
        self.send_header("Location", location)
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def cookie_value(self, name: str) -> str:
        try:
            cookie = SimpleCookie(self.headers.get("Cookie", ""))
            morsel = cookie.get(name)
            return morsel.value if morsel else ""
        except Exception:
            return ""

    def current_user(self) -> str | None:
        config = self.auth_config
        if not config.enabled:
            return "local"
        if config.sso_enabled:
            session = sso_session(config, self.cookie_value(config.sso_cookie_name))
            if session is None:
                return None
            for cookie in session.set_cookies:
                if cookie not in self._sso_set_cookies:
                    self._sso_set_cookies.append(cookie)
            return session.username
        return session_username(config, self.cookie_value("train_session"))

    def client_key(self) -> str:
        if self.auth_config.trust_proxy:
            forwarded = self.headers.get("X-Real-IP", "").strip()
            if forwarded:
                return forwarded
        return self.client_address[0]

    def login_blocked(self) -> tuple[bool, int]:
        now = time.monotonic()
        key = self.client_key()
        with AUTH_LOCK:
            recent = [stamp for stamp in AUTH_FAILURES.get(key, []) if now - stamp < 10 * 60]
            AUTH_FAILURES[key] = recent
            if len(recent) < 5:
                return False, 0
            retry_after = max(1, int(10 * 60 - (now - recent[0])))
            return True, retry_after

    def record_login_failure(self) -> None:
        with AUTH_LOCK:
            AUTH_FAILURES.setdefault(self.client_key(), []).append(time.monotonic())

    def clear_login_failures(self) -> None:
        with AUTH_LOCK:
            AUTH_FAILURES.pop(self.client_key(), None)

    def is_api_path(self, path: str) -> bool:
        return path.startswith("/api/")

    def require_auth(self, path: str) -> bool:
        config = self.auth_config
        if not config.enabled or path in PUBLIC_PATHS:
            return True
        if self.current_user():
            return True
        if self.is_api_path(path):
            self.send_json(401, {"ok": False, "error": "请先登录"})
        else:
            if config.sso_enabled:
                self.redirect(sso_login_location(config, self.path), 302)
            else:
                target = quote(safe_return_to(self.path), safe="/?=&%")
                self.redirect(f"/login?return_to={target}", 302)
        return False

    def request_origin_is_same(self) -> bool:
        if not self.auth_config.enabled:
            return True
        origin = self.headers.get("Origin", "").strip()
        referer = self.headers.get("Referer", "").strip()
        candidate = origin or referer
        if not candidate:
            return False
        parsed = urlsplit(candidate)
        return parsed.netloc == self.headers.get("Host", "") and parsed.scheme in {"http", "https"}

    def read_body(self, maximum: int = MAX_REQUEST_BYTES) -> bytes:
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError as exc:
            raise ValueError("Content-Length 无效") from exc
        if length < 0 or length > maximum:
            raise ValueError("请求内容过大")
        return self.rfile.read(length)

    def translate_path(self, path: str) -> str:
        if unquote(path.split("?", 1)[0]) == "/js/data.js":
            return str(OUTPUT_PATH)
        return super().translate_path(path)

    # 静态文件走 SimpleHTTPRequestHandler 默认逻辑，原本不发 Cache-Control，
    # 浏览器会按启发式缓存（Last-Modified 时长的 10%）把旧 JS 留上数天，
    # 导致数据更新后重启服务仍显示旧折线。此处为这类响应补上 no-store。
    _static_response = False

    def end_headers(self) -> None:
        if self._static_response:
            self._static_response = False
            self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def static_path_allowed(self, path: str) -> bool:
        decoded = unquote(path)
        if "\x00" in decoded or "\\" in decoded or ".." in decoded.split("/"):
            return False
        if decoded in STATIC_FILES:
            return True
        return any(decoded.startswith(prefix) for prefix in STATIC_PREFIXES)

    def do_HEAD(self) -> None:
        path = self.path.split("?", 1)[0]
        if path == "/healthz":
            self.send_response(204)
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            return
        if path == "/login":
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            return
        if not self.require_auth(path):
            return
        if not self.static_path_allowed(path):
            self.send_error(404)
            return
        self._static_response = True
        super().do_HEAD()

    def do_GET(self) -> None:
        path = self.path.split("?", 1)[0]
        if path == "/healthz":
            self.send_json(200, {"ok": True})
            return
        if path == "/login":
            if self.auth_config.sso_enabled:
                return_to = parse_qs(urlsplit(self.path).query).get("return_to", ["/"])[0]
                if self.current_user():
                    self.redirect(safe_return_to(return_to))
                else:
                    self.redirect(sso_login_location(self.auth_config, return_to), 302)
                return
            if self.auth_config.enabled and self.current_user():
                self.redirect(safe_return_to(parse_qs(urlsplit(self.path).query).get("return_to", ["/"])[0]))
                return
            return_to = parse_qs(urlsplit(self.path).query).get("return_to", ["/"])[0]
            self.send_html(200, login_page(return_to))
            return
        if path == "/api/auth-status":
            config = self.auth_config
            username = self.current_user() if config.enabled else None
            self.send_json(
                200,
                {"ok": True, "enabled": config.enabled, "authenticated": bool(username), "username": username},
            )
            return
        if not self.require_auth(path):
            return
        if path != "/api/train-data":
            if not self.static_path_allowed(path):
                self.send_error(404)
                return
            self._static_response = True
            super().do_GET()
            return
        try:
            with DATA_LOCK:
                raw, records, stations = read_data_file(OUTPUT_PATH)
                version = hashlib.sha256(raw).hexdigest()
        except Exception as exc:
            self.send_json(500, {"ok": False, "error": str(exc)})
            return
        self.send_json(
            200,
            {"ok": True, "version": version, "records": records, "stations": stations},
        )

    def do_POST(self) -> None:
        path = self.path.split("?", 1)[0]
        if path == "/login":
            self.handle_login()
            return
        if not self.require_auth(path):
            return
        if not self.request_origin_is_same():
            self.send_json(403, {"ok": False, "error": "请求来源无效"})
            return
        if path == "/logout":
            if self.auth_config.sso_enabled:
                self.handle_sso_logout()
                return
            self.send_response(303)
            self.send_header("Location", "/login")
            self.send_header(
                "Set-Cookie",
                "train_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0"
                + ("; Secure" if self.auth_config.cookie_secure else ""),
            )
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return
        if path != "/api/save-train-data":
            self.send_error(404)
            return
        try:
            raw = self.read_body().decode("utf-8")
            payload = json.loads(raw)
            if not isinstance(payload, dict):
                raise ValueError("payload 必须是对象")
            base_version = payload.get("baseVersion") if isinstance(payload, dict) else None
            if not isinstance(base_version, str) or not base_version:
                self.send_json(
                    428,
                    {"ok": False, "conflict": True, "error": "页面版本已过期，请刷新后重试。"},
                )
                return
            records, stations = sanitize_payload(payload)
            with DATA_LOCK:
                current_raw, _, _ = read_data_file(OUTPUT_PATH)
                current_version = hashlib.sha256(current_raw).hexdigest()
                if base_version != current_version:
                    self.send_json(
                        409,
                        {
                            "ok": False,
                            "conflict": True,
                            "version": current_version,
                            "error": "数据已在其他标签页更新，请刷新后重试。",
                        },
                    )
                    return
                write_records(records, EXCEL_PATH)
                write_data_js(records, stations, OUTPUT_PATH)
                next_version = data_version(OUTPUT_PATH)
        except Exception as exc:
            self.send_json(400, {"ok": False, "error": str(exc)})
            return
        self.send_json(200, {"ok": True, "version": next_version})

    def handle_login(self) -> None:
        config = self.auth_config
        if not config.enabled:
            self.redirect("/")
            return
        if config.sso_enabled:
            self.redirect(sso_login_location(config, "/"))
            return
        blocked, retry_after = self.login_blocked()
        try:
            form = parse_qs(self.read_body(16 * 1024).decode("utf-8"), keep_blank_values=True)
        except (ValueError, UnicodeDecodeError):
            self.send_html(400, login_page("/", "登录请求无效。"))
            return
        return_to = safe_return_to(form.get("return_to", ["/"])[0])
        if blocked:
            body = login_page(return_to, "尝试次数过多，请稍后再试。")
            self.send_response(429)
            self.send_header("Retry-After", str(retry_after))
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)
            return
        username = form.get("username", [""])[0]
        password = form.get("password", [""])[0]
        username_ok = hmac.compare_digest(username.encode("utf-8"), config.username.encode("utf-8"))
        password_ok = verify_password(password, config.password_hash)
        if not (username_ok and password_ok):
            self.record_login_failure()
            self.send_html(401, login_page(return_to, "账号或密码不正确。"))
            return
        self.clear_login_failures()
        token = make_session(config, config.username)
        self.send_response(303)
        self.send_header("Location", return_to)
        self.send_header(
            "Set-Cookie",
            f"train_session={token}; Path=/; HttpOnly; SameSite=Strict; Max-Age={config.session_ttl}"
            + ("; Secure" if config.cookie_secure else ""),
        )
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def handle_sso_logout(self) -> None:
        config = self.auth_config
        token = self.cookie_value(config.sso_cookie_name)
        if token:
            request = Request(
                config.sso_logout_url,
                data=b"",
                headers={
                    "Cookie": f"{config.sso_cookie_name}={token}",
                    "Origin": config.sso_public_origin,
                },
                method="POST",
            )
            try:
                with urlopen(request, timeout=3) as response:
                    if response.status != 200:
                        raise ValueError("中心登录服务拒绝退出请求")
            except (HTTPError, URLError, TimeoutError, ValueError):
                self.send_json(502, {"ok": False, "error": "暂时无法退出，请稍后重试"})
                return

        self.send_response(303)
        self.send_header("Location", config.sso_login_url)
        secure = "; Secure" if config.cookie_secure else ""
        self.send_header(
            "Set-Cookie",
            f"{config.sso_cookie_name}=; Domain={config.sso_cookie_domain}; Path=/; "
            f"HttpOnly; SameSite=Lax; Max-Age=0{secure}",
        )
        self.send_header(
            "Set-Cookie",
            f"train_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0{secure}",
        )
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", "0")
        self.end_headers()


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="本地预览火车足迹")
    parser.add_argument("port", nargs="?", type=int, default=8765)
    parser.add_argument(
        "--host",
        default=os.environ.get("TRAIN_BIND_HOST", "127.0.0.1"),
        help="监听地址；容器部署时使用 0.0.0.0",
    )
    parser.add_argument(
        "--open",
        dest="open_browser",
        action="store_true",
        help="端口就绪后再打开浏览器",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> None:
    args = parse_args(argv)
    display_host = "127.0.0.1" if args.host == "0.0.0.0" else args.host
    url = f"http://{display_host}:{args.port}/"
    try:
        auth_config = load_auth_config()
        initialize_deployment_data()
    except ValueError as exc:
        raise SystemExit(f"登录配置错误：{exc}") from exc
    except OSError as exc:
        raise SystemExit(f"无法初始化部署数据：{exc}") from exc
    try:
        httpd = ThreadingHTTPServer((args.host, args.port), Handler)
        httpd.auth_config = auth_config
    except OSError:
        print(f"端口 {args.port} 已在使用，打开已有页面：{url}")
        if args.open_browser:
            webbrowser.open(url)
        return
    print(f"打开 {url}")
    print("登录保护已启用" if auth_config.enabled else "本地模式：未启用登录")
    print("新增 / 编辑 / 删除行程会写入 js/data.js 和 Excel")
    if args.open_browser:
        threading.Thread(target=webbrowser.open, args=(url,), daemon=True).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止")
        httpd.server_close()


if __name__ == "__main__":
    main()
