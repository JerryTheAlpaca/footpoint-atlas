#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""全国高铁真实径路网络构建入口。

用法（项目根目录）：
    python tools/build_rail_route_data.py                 # 全部批次
    python tools/build_rail_route_data.py --batches A,B   # 指定批次
    python tools/build_rail_route_data.py --force-extract # 强制重扫 PBF

实现细节见 tools/rail_network/build.py 模块文档。
宁蓉试点 14 区段自提交 8740690 等价迁移，折线不重算。
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from rail_network.build import main  # noqa: E402

if __name__ == "__main__":
    main()
