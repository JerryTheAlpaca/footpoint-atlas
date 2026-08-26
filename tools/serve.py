"""本地预览，并把设置页的行程写回 js/data.js 和 Excel。

在项目根目录运行：

    python tools/serve.py
    python tools/serve.py 8765

然后打开提示的地址。直接双击 index.html 或使用普通静态服务器时，
浏览器写不了磁盘，行程会先暂存在本机。
"""

from __future__ import annotations

import json
import hashlib
import math
import re
import sys
import threading
from datetime import date
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from excel_to_js import EXCEL_PATH, OUTPUT_PATH, write_data_js, write_records  # noqa: E402

RECORD_FIELDS = ("date", "from", "to", "train", "vehicle", "origin", "terminal", "bureau")
DATE_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")
DATA_LOCK = threading.Lock()


def data_version(path: Path | None = None) -> str:
    target = path or OUTPUT_PATH
    return hashlib.sha256(target.read_bytes()).hexdigest()


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
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_json(self, status: int, payload: object) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        path = self.path.split("?", 1)[0]
        if path != "/api/train-data":
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
        if path != "/api/save-train-data":
            self.send_error(404)
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(max(0, length)).decode("utf-8")
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


def main() -> None:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    httpd = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"打开 http://127.0.0.1:{port}/")
    print("新增 / 编辑 / 删除行程会写入 js/data.js 和 Excel")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止")
        httpd.server_close()


if __name__ == "__main__":
    main()
