"""从 火车乘车记录.xlsx 生成 js/data.js。

网页只读取 js/data.js，不会直接打开 Excel。
在 Excel 里改完记录后，于项目根目录运行：

    python tools/excel_to_js.py

然后刷新浏览器即可。

用 python tools/serve.py 打开网页后，添加 / 编辑 / 删除行程会同时写回
js/data.js 和本表。

如果出现尚未收录坐标的新车站，脚本会列出站名并退出；
把该站的 [经度, 纬度] 补进 STATION_COORDS 后再跑一次。
"""

from __future__ import annotations

import json
import os
import stat
import sys
import tempfile
from datetime import datetime
from pathlib import Path

try:
    import openpyxl
    from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
    from openpyxl.utils import get_column_letter
except ImportError:
    sys.stderr.write("需要 openpyxl：pip install openpyxl\n")
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]


def data_paths(data_dir: str | os.PathLike[str] | None = None) -> tuple[Path, Path]:
    """Return the Excel and JavaScript data paths for local or deployed use."""
    configured = data_dir if data_dir is not None else os.environ.get("TRAIN_DATA_DIR")
    if configured:
        directory = Path(configured).expanduser().resolve()
        return directory / "火车乘车记录.xlsx", directory / "data.js"
    return ROOT / "火车乘车记录.xlsx", ROOT / "js" / "data.js"


EXCEL_PATH, OUTPUT_PATH = data_paths()
SHEET_TITLE = "乘车记录"
HEADERS = ("日期", "发站", "到站", "车次", "车号", "始发站", "终到站", "担当路局")
RECORD_KEYS = ("date", "from", "to", "train", "vehicle", "origin", "terminal", "bureau")
COLUMN_WIDTHS = (12, 14, 12, 10, 38, 14, 14, 12)
HEADER_ROW_HEIGHT = 25
DATA_ROW_HEIGHT = 20
_THIN = Border(
    left=Side(style="thin"),
    right=Side(style="thin"),
    top=Side(style="thin"),
    bottom=Side(style="thin"),
)
_CENTER = Alignment(horizontal="center", vertical="center")
_HEADER_FONT = Font(name="微软雅黑", size=11, bold=True, color="FFFFFF")
_DATA_FONT = Font(name="微软雅黑", size=10)
_HEADER_FILL = PatternFill("solid", fgColor="4472C4")
_DATA_FILL = PatternFill("solid", fgColor="FFFFFF")

# 与现有 data.js 同一精度（约 1km），足够全国地图展示。
STATION_COORDS = {
    "全椒": [118.28, 32.06],
    "肥东": [117.48, 31.86],
    "金寨": [115.97, 31.63],
    "麻城北": [114.98, 31.19],
    "红安西": [114.63, 31.01],
    # 以下坐标与 js/rail-route-data.js 网络节点（OSM，压线）一致：
    # 2 位小数粗坐标曾导致标记漂出线路（衡山西 26km、黄山西 62km 等），
    # 故这些站采用完整精度。
    "临平南": [120.28961, 30.38186],
    # 六安：2 位粗坐标 [116.52, 31.73] 偏离沪蓉线正线 ~2.8km（偏东北），
    # 修正为 OSM 六安站节点吸附正线顶点（way 760908118，OSM 2026-09 快照），
    # 与 rail-route-data.js luan 节点坐标一致。
    "六安": [116.49729, 31.71769],
    "北京": [116.43, 39.9],
    "北京南": [116.38, 39.87],
    "南京南": [118.81, 31.97],
    "合肥南": [117.29, 31.8],
    "合肥西": [117.21, 31.86],
    "天河机场": [114.21, 30.78],
    "成都东": [104.14, 30.63],
    "无锡": [120.3, 31.59],
    "无锡东": [120.45549, 31.59881],
    "杭州东": [120.21, 30.29],
    "杭州西": [119.98, 30.3],
    "武汉": [114.42, 30.61],
    "汉口": [114.26, 30.62],
    "江宁": [118.89392, 31.9387],
    "衡山西": [112.78379, 27.2511],
    "衡阳东": [112.70449, 26.8997],
    "郑州东": [113.78, 34.76],
    "黄山北": [118.26734, 29.81834],
    "黄山西": [118.08466, 30.27973],
    "兰州西": [103.75, 36.07],
    "大通西": [101.67, 36.97],
    "西宁": [101.81, 36.62],
    "西安": [108.97, 34.28],
    "西安北": [108.93, 34.38],
    "武昌": [114.32, 30.53],
    "杭州": [120.18, 30.24],
    "香港西九龙": [114.17, 22.3],
    "深圳北": [114.02, 22.61],
    "广州南": [113.26, 22.99],
}

# 宁蓉走廊铁路网络试点收录的客运站（与 js/rail-route-data.js 节点一致）：
# 以后新增"南京南→麻城北"等行程时不再要求手工补坐标。
NETWORK_STATION_NAMES = {"全椒", "肥东", "金寨", "麻城北", "红安西"}


def normalize_date(value) -> str:
    if isinstance(value, datetime):
        return value.strftime("%Y-%m-%d")
    text = str(value).strip().replace("/", ".")
    parts = text.split(".")
    if len(parts) != 3:
        raise ValueError(f"无法解析日期: {value!r}")
    year, month, day = (int(parts[0]), int(parts[1]), int(parts[2]))
    return f"{year:04d}-{month:02d}-{day:02d}"


def cell_text(value) -> str:
    if value is None:
        return ""
    return str(value).strip()


def format_excel_date(iso: str) -> str:
    year, month, day = (int(part) for part in iso.split("-"))
    return f"{year}.{month}.{day}"


def read_records(path: Path | None = None) -> list[dict]:
    workbook = openpyxl.load_workbook(path or EXCEL_PATH, data_only=True)
    sheet = workbook[workbook.sheetnames[0]]
    records = []
    for row in sheet.iter_rows(min_row=2, values_only=True):
        if not row or not row[0]:
            continue
        records.append(
            {
                "date": normalize_date(row[0]),
                "from": cell_text(row[1]),
                "to": cell_text(row[2]),
                "train": cell_text(row[3]),
                "vehicle": cell_text(row[4]),
                "origin": cell_text(row[5]),
                "terminal": cell_text(row[6]),
                "bureau": cell_text(row[7]),
            }
        )
    return records


def stations_for(records: list[dict]) -> dict[str, list[float]]:
    # 记录中出现的车站 + 铁路网络试点收录的客运站：
    # 以后新增"南京南→麻城北"等行程时不再要求手工补坐标。
    names = {rec["from"] for rec in records} | {rec["to"] for rec in records}
    names |= NETWORK_STATION_NAMES
    ordered = sorted(names)
    missing = [name for name in ordered if name not in STATION_COORDS]
    if missing:
        sys.stderr.write("以下车站还没有坐标，请补进 tools/excel_to_js.py 的 STATION_COORDS：\n")
        for name in missing:
            sys.stderr.write(f"  - {name}\n")
        sys.exit(1)
    return {name: STATION_COORDS[name] for name in ordered}


def write_data_js(records: list[dict], stations: dict, path: Path = OUTPUT_PATH) -> None:
    payload = {
        "records": records,
        "stations": {name: stations[name] for name in sorted(stations)},
    }
    body = json.dumps(payload, ensure_ascii=False, indent=2)
    temp_path: Path | None = None
    existing_mode = stat.S_IMODE(path.stat().st_mode) if path.exists() else None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            dir=path.parent,
            prefix=f".{path.name}.",
            suffix=".tmp",
            delete=False,
        ) as handle:
            temp_path = Path(handle.name)
            handle.write("window.TRAIN_DATA = " + body + ";\n")
            handle.flush()
            os.fsync(handle.fileno())
        if existing_mode is not None:
            os.chmod(temp_path, existing_mode)
        os.replace(temp_path, path)
        temp_path = None
    finally:
        if temp_path is not None:
            temp_path.unlink(missing_ok=True)


def _style_header_cell(cell) -> None:
    cell.font = _HEADER_FONT
    cell.fill = _HEADER_FILL
    cell.alignment = _CENTER
    cell.border = _THIN


def _style_data_cell(cell) -> None:
    cell.font = _DATA_FONT
    cell.fill = _DATA_FILL
    cell.alignment = _CENTER
    cell.border = _THIN


def _write_header(sheet) -> None:
    sheet.row_dimensions[1].height = HEADER_ROW_HEIGHT
    for index, title in enumerate(HEADERS, start=1):
        cell = sheet.cell(1, index, title)
        _style_header_cell(cell)
    for index, width in enumerate(COLUMN_WIDTHS, start=1):
        sheet.column_dimensions[get_column_letter(index)].width = width


def _record_row_values(record: dict) -> list:
    values = []
    for key in RECORD_KEYS:
        if key == "date":
            values.append(format_excel_date(record["date"]))
            continue
        text = str(record.get(key, "") or "").strip()
        values.append(text or None)
    return values


def _atomic_save_workbook(workbook, path: Path) -> None:
    temp_path: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            dir=path.parent,
            prefix=f".{path.name}.",
            suffix=".xlsx.tmp",
            delete=False,
        ) as handle:
            temp_path = Path(handle.name)
        workbook.save(temp_path)
        try:
            os.replace(temp_path, path)
        except PermissionError as exc:
            raise PermissionError("无法写入 Excel，请先关闭「火车乘车记录.xlsx」后再保存。") from exc
        temp_path = None
    finally:
        if temp_path is not None:
            temp_path.unlink(missing_ok=True)


def write_records(records: list[dict], path: Path | None = None) -> None:
    target = path or EXCEL_PATH
    if target.exists():
        workbook = openpyxl.load_workbook(target)
        sheet = workbook[workbook.sheetnames[0]]
    else:
        workbook = openpyxl.Workbook()
        sheet = workbook.active
        sheet.title = SHEET_TITLE

    if sheet.max_row < 1 or not cell_text(sheet.cell(1, 1).value):
        _write_header(sheet)

    for index, record in enumerate(records, start=2):
        sheet.row_dimensions[index].height = DATA_ROW_HEIGHT
        for col, value in enumerate(_record_row_values(record), start=1):
            cell = sheet.cell(index, col, value)
            _style_data_cell(cell)

    leftover = sheet.max_row - (len(records) + 1)
    if leftover > 0:
        sheet.delete_rows(len(records) + 2, leftover)

    _atomic_save_workbook(workbook, target)


def main() -> None:
    if not EXCEL_PATH.exists():
        sys.stderr.write(f"找不到 Excel：{EXCEL_PATH}\n")
        sys.exit(1)

    records = read_records()
    if not records:
        sys.stderr.write("Excel 里没有乘车记录。\n")
        sys.exit(1)

    payload = {"records": records, "stations": stations_for(records)}
    write_data_js(payload["records"], payload["stations"])
    print(f"已写入 {OUTPUT_PATH.relative_to(ROOT)}：{len(records)} 条记录，{len(payload['stations'])} 个车站。")


if __name__ == "__main__":
    main()
