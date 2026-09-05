# -*- coding: utf-8 -*-
"""全国高铁真实径路网络构建包。

以"线路清单、车站节点、物理区段、状态日期、业务断言"驱动，
从 Geofabrik China OSM PBF 提取铁路几何，生成离线
window.RAIL_ROUTE_DATA（js/rail-route-data.js）。
"""
