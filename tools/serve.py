"""本地预览，并把设置页新增的行程写回 js/data.js。

在项目根目录运行：

    python tools/serve.py
    python tools/serve.py 8765

然后打开提示的地址。直接双击 index.html 或使用普通静态服务器时，
浏览器写不了磁盘，行程会先暂存在本机。
"""

from __future__ import annotations

import json
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from excel_to_js import OUTPUT_PATH, write_data_js  # noqa: E402

RECORD_FIELDS = ("date", "from", "to", "train", "vehicle", "origin", "terminal", "bureau")


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
        clean_records.append(item)

    clean_stations = {}
    for name, coord in stations.items():
        if not isinstance(coord, (list, tuple)) or len(coord) < 2:
            raise ValueError(f"车站坐标无效：{name}")
        clean_stations[str(name)] = [float(coord[0]), float(coord[1])]
    return clean_records, clean_stations


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_POST(self) -> None:
        path = self.path.split("?", 1)[0]
        if path != "/api/save-train-data":
            self.send_error(404)
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(max(0, length)).decode("utf-8")
            records, stations = sanitize_payload(json.loads(raw))
            write_data_js(records, stations, OUTPUT_PATH)
        except Exception as exc:
            body = json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False).encode("utf-8")
            self.send_response(400)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        body = b'{"ok":true}'
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main() -> None:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    httpd = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"打开 http://127.0.0.1:{port}/")
    print("新增行程会写入 js/data.js")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止")
        httpd.server_close()


if __name__ == "__main__":
    main()
