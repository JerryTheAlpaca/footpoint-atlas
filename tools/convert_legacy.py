#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把 build-cache/legacy-ningrong.json（试点 8740690 的 RAIL_ROUTE_DATA）
固化为 tools/rail_network/legacy_ningrong.py 常量模块。

折线逐点原样迁移，保证宁蓉试点几何与解析结果等价。
运行一次即可；输出文件入库，缓存 JSON 不入库。
"""

import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "build-cache", "legacy-ningrong.json")
OUT = os.path.join(ROOT, "tools", "rail_network", "legacy_ningrong.py")

data = json.load(open(SRC, encoding="utf-8"))

body = json.dumps(
    {"nodes": data["nodes"], "segments": data["segments"]},
    ensure_ascii=False, indent=1,
)

header = '''# -*- coding: utf-8 -*-
"""宁蓉走廊试点网络（提交 8740690）的等价迁移数据。

由 tools/convert_legacy.py 从已验收的 js/rail-route-data.js 一次性固化，
折线与 estLengthKm 逐点保持不变 —— 全国构建器直接复用，不再重新提取。
"""

LEGACY_DATA = (
'''

with open(OUT, "w", encoding="utf-8") as f:
    f.write(header + body + ")\n")

print("已写出 %s（%.1f KB）" % (OUT, os.path.getsize(OUT) / 1024))
