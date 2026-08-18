"""从 火车乘车记录.xlsx 生成 js/data.js。

网页只读取 js/data.js，不会直接打开 Excel。
在 Excel 里改完记录后，于项目根目录运行：

    python tools/excel_to_js.py

然后刷新浏览器即可。

如果出现尚未收录坐标的新车站，脚本会列出站名并退出；
把该站的 [经度, 纬度] 补进 STATION_COORDS 后再跑一次。
"""

from __future__ import annotations

import json
import sys
from datetime import datetime
from pathlib import Path

try:
    import openpyxl
except ImportError:
    sys.stderr.write("需要 openpyxl：pip install openpyxl\n")
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
EXCEL_PATH = ROOT / "火车乘车记录.xlsx"
OUTPUT_PATH = ROOT / "js" / "data.js"

# 与现有 data.js 同一精度（约 1km），足够全国地图展示。
STATION_COORDS = {
    "临平南": [120.3, 30.42],
    "六安": [116.51, 31.76],
    "北京": [116.43, 39.9],
    "北京南": [116.38, 39.87],
    "南京南": [118.81, 31.97],
    "合肥南": [117.29, 31.8],
    "合肥西": [117.21, 31.86],
    "天河机场": [114.21, 30.78],
    "成都东": [104.14, 30.63],
    "无锡": [120.3, 31.59],
    "无锡东": [120.43, 31.59],
    "杭州东": [120.21, 30.29],
    "杭州西": [119.98, 30.3],
    "武汉": [114.42, 30.61],
    "汉口": [114.26, 30.62],
    "江宁": [118.89, 31.83],
    "衡山西": [112.52, 27.25],
    "衡阳东": [112.65, 26.9],
    "郑州东": [113.78, 34.76],
    "黄山北": [118.29, 29.83],
    "黄山西": [118.0, 29.72],
    "兰州西": [103.75, 36.07],
    "大通西": [101.67, 36.97],
    "西宁": [101.81, 36.62],
    "西安北": [108.93, 34.38],
    "香港西九龙": [114.17, 22.3],
    "深圳北": [114.02, 22.61],
    "广州南": [113.26, 22.99],
}


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


def read_records() -> list[dict]:
    workbook = openpyxl.load_workbook(EXCEL_PATH, data_only=True)
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
    names = sorted({rec["from"] for rec in records} | {rec["to"] for rec in records})
    missing = [name for name in names if name not in STATION_COORDS]
    if missing:
        sys.stderr.write("以下车站还没有坐标，请补进 tools/excel_to_js.py 的 STATION_COORDS：\n")
        for name in missing:
            sys.stderr.write(f"  - {name}\n")
        sys.exit(1)
    return {name: STATION_COORDS[name] for name in names}


def main() -> None:
    if not EXCEL_PATH.exists():
        sys.stderr.write(f"找不到 Excel：{EXCEL_PATH}\n")
        sys.exit(1)

    records = read_records()
    if not records:
        sys.stderr.write("Excel 里没有乘车记录。\n")
        sys.exit(1)

    payload = {"records": records, "stations": stations_for(records)}
    body = json.dumps(payload, ensure_ascii=False, indent=2)
    OUTPUT_PATH.write_text("window.TRAIN_DATA = " + body + ";\n", encoding="utf-8")
    print(f"已写入 {OUTPUT_PATH.relative_to(ROOT)}：{len(records)} 条记录，{len(payload['stations'])} 个车站。")


if __name__ == "__main__":
    main()
