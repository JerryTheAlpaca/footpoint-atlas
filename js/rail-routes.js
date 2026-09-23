// 铁路网络寻径纯函数（高铁/城际 + 普速干线）。
// 依赖 window.RAIL_ROUTE_DATA（js/rail-route-data.js），不依赖 DOM 与其余业务模块。
// 所有坐标为 [lon, lat]，与 data.js stations、ECharts 一致。
(function (root) {
  'use strict';

  var DISPLAY_STORAGE_KEY = 'train-footprint-map-display';
  var MODE_CURVE = 'curve';
  var MODE_REAL = 'real';
  var VALID_MODES = [MODE_CURVE, MODE_REAL];
  // 列车类别：与 TrainStats.trainTypeOf 同一判定（车次前缀 G/D/C 为动车组）。
  var KIND_EMU = 'emu';
  var KIND_CONV = 'conv';
  // 未标注 trains 的区段视为仅动车组走行（既有高铁/城际产物即此语义）。
  var DEFAULT_KINDS = [KIND_EMU];

  function routeData() {
    return root.RAIL_ROUTE_DATA || null;
  }

  // —— 记录 / 区段的列车类别 ——
  // 普速不得借道只开动车组的高速正线，动车组也不得被新建的普速干线
  // 改道：两类记录各自在可运行的区段子图上寻径，既有径路因此稳定。
  function recordKind(record) {
    var train = String((record && record.train) || '').trim();
    return /^[GDC]/i.test(train) ? KIND_EMU : KIND_CONV;
  }

  function trainsForSegment(seg, linesById) {
    var declared = seg.trains;
    if (!declared || !declared.length) {
      declared = [];
      var ids = seg.lineIds || [];
      for (var i = 0; i < ids.length; i++) {
        var line = linesById[ids[i]];
        if (line && line.trains) declared = declared.concat(line.trains);
      }
    }
    return declared.length ? declared : DEFAULT_KINDS;
  }

  function segmentAllowsKind(seg, kind) {
    if (!seg) return false;
    var kinds = seg.trains || DEFAULT_KINDS;
    for (var i = 0; i < kinds.length; i++) {
      if (kinds[i] === kind) return true;
    }
    return false;
  }

  function isValidMode(value) {
    return value === MODE_CURVE || value === MODE_REAL;
  }

  // —— 显示模式偏好（独立 localStorage key，损坏回退曲线） ——
  function readDisplayMode(storage) {
    if (!storage || typeof storage.getItem !== 'function') return MODE_CURVE;
    var value = null;
    try {
      value = storage.getItem(DISPLAY_STORAGE_KEY);
    } catch (err) {
      value = null;
    }
    return isValidMode(value) ? value : MODE_CURVE;
  }

  function writeDisplayMode(storage, mode) {
    if (!storage || typeof storage.setItem !== 'function') return;
    if (!isValidMode(mode)) return;
    try {
      storage.setItem(DISPLAY_STORAGE_KEY, mode);
    } catch (err) {
      /* 存储不可用时静默忽略 */
    }
  }

  // —— 站名 → 网络节点 ——
  function nodeByName(name) {
    var data = routeData();
    if (!data || !name) return null;
    var wanted = String(name).trim();
    var nodes = data.nodes || [];
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].name === wanted) return nodes[i];
    }
    for (var j = 0; j < nodes.length; j++) {
      var aliases = nodes[j].aliases || [];
      for (var k = 0; k < aliases.length; k++) {
        if (aliases[k] === wanted) return nodes[j];
      }
    }
    return null;
  }

  // —— 站名 → 坐标：网络锚点优先（经线路验证、与区段折线端点一致），
  // 业务站表兜底。曲线模式不应使用本函数消费网络坐标。
  function stationCoord(name, stations) {
    var wanted = String(name || '').trim();
    if (!wanted) return null;
    var node = nodeByName(wanted);
    if (node && node.coord) return node.coord;
    if (stations && Object.prototype.hasOwnProperty.call(stations, wanted)) {
      return stations[wanted];
    }
    return null;
  }

  // —— 区段索引 ——
  function segmentMaps() {
    var data = routeData();
    if (!data) return null;
    var byId = {};
    var byPair = {};
    var linesById = {};
    var segments = data.segments || [];
    (data.lines || []).forEach(function (line) {
      if (line && line.id) linesById[line.id] = line;
    });
    for (var i = 0; i < segments.length; i++) {
      var seg = segments[i];
      seg.trains = trainsForSegment(seg, linesById);
      byId[seg.id] = seg;
      byPair[seg.to + '|' + seg.from] = seg;
      byPair[seg.from + '|' + seg.to] = seg;
    }
    return { byId: byId, byPair: byPair, list: segments };
  }

  // —— 区段在行程日期是否可用（serviceDate 为开通日）且承接该列车类别 ——
  function segmentUsable(seg, date, kind) {
    if (!segmentAllowsKind(seg, kind)) return false;
    if (!date || !seg.serviceDate) return true;
    return seg.serviceDate <= date;
  }

  function buildAdjacency(maps, date, kind) {
    var adj = {};
    for (var i = 0; i < maps.list.length; i++) {
      var seg = maps.list[i];
      if (!segmentUsable(seg, date, kind)) continue;
      (adj[seg.from] = adj[seg.from] || []).push(seg);
      (adj[seg.to] = adj[seg.to] || []).push(seg);
    }
    return adj;
  }

  // —— 人工径路覆盖：specificity = 匹配字段数（date+train+from+to） ——
  // 覆盖必须是一条从出发节点到目的节点的连续完整路径，且每个区段
  // 在行程日期已开通；只给开头一小段、或用不连续 ID 拼凑的覆盖
  // 一律拒绝（回退自动寻径），不能靠坐标远近猜连接方向。
  function overrideSegmentsValid(segIds, maps, record, kind) {
    var fromNode = nodeByName(record.from);
    var toNode = nodeByName(record.to);
    if (!fromNode || !toNode) return false;
    var cur = fromNode.id;
    for (var i = 0; i < segIds.length; i++) {
      var seg = maps.byId[segIds[i]];
      if (!seg) return false;
      if (!segmentUsable(seg, record.date, kind)) return false;
      if (seg.from === cur) cur = seg.to;
      else if (seg.to === cur) cur = seg.from;
      else return false;
    }
    return cur === toNode.id;
  }

  function matchOverride(record, overrides, maps, kind) {
    if (!record || !overrides || !overrides.length) return null;
    var best = null;
    var bestScore = 0;
    for (var i = 0; i < overrides.length; i++) {
      var ov = overrides[i];
      var score = 0;
      if (ov.from && ov.from === record.from) score += 1;
      else continue;
      if (ov.to && ov.to === record.to) score += 1;
      else continue;
      if (ov.date) {
        if (ov.date !== record.date) continue;
        score += 1;
      }
      if (ov.train) {
        if (ov.train !== record.train) continue;
        score += 1;
      }
      var segs = validSegmentIds(ov.segments, maps);
      if (!segs || !overrideSegmentsValid(segs, maps, record, kind)) continue;
      if (score > bestScore) {
        best = segs;
        bestScore = score;
      }
    }
    return best;
  }

  function validSegmentIds(ids, maps) {
    if (!ids || !ids.length) return null;
    for (var i = 0; i < ids.length; i++) {
      if (!maps.byId[ids[i]]) return null;
    }
    return ids.slice();
  }

  // —— Dijkstra 最短路，边权 = estLengthKm，平局取字典序小区段序列 ——
  // date：行程日期；晚于开通日（serviceDate）的区段不参与寻径，
  // 避免历史记录"提前"用上尚未开通的线路（如 2020 年记录走 2024
  // 年开通的池黄高铁）。kind：列车类别；不承接该类别的区段同样不参与。
  function shortestPath(fromId, toId, maps, date, kind) {
    var adj = buildAdjacency(maps, date, kind);
    var dist = {};
    var prevSeg = {};
    var prevNode = {};
    var settled = {};
    dist[fromId] = 0;
    var queue = [{ id: fromId, cost: 0, key: '' }];

    function pathKey(nodeId) {
      var segs = [];
      var cur = nodeId;
      while (prevSeg[cur] !== undefined) {
        segs.unshift(prevSeg[cur].id);
        cur = prevNode[cur];
      }
      return segs.join('>');
    }

    while (queue.length) {
      var minIdx = 0;
      for (var q = 1; q < queue.length; q++) {
        var a = queue[q];
        var b = queue[minIdx];
        if (a.cost < b.cost || (a.cost === b.cost && pathKey(a.id) < pathKey(b.id))) {
          minIdx = q;
        }
      }
      var current = queue.splice(minIdx, 1)[0];
      if (settled[current.id]) continue;
      settled[current.id] = true;
      if (current.id === toId) break;
      var neighbours = adj[current.id] || [];
      for (var i = 0; i < neighbours.length; i++) {
        var seg = neighbours[i];
        var next = seg.from === current.id ? seg.to : seg.from;
        if (settled[next]) continue;
        var nd = current.cost + (Number(seg.estLengthKm) || 0);
        var nextEntry = { id: next, cost: nd, key: pathKey(current.id) + '>' + seg.id };
        var known = dist[next];
        var better = known === undefined || nd < known ||
          (nd === known && nextEntry.key < pathKey(next));
        if (better) {
          dist[next] = nd;
          prevSeg[next] = seg;
          prevNode[next] = current.id;
          queue.push(nextEntry);
        }
      }
    }
    if (!settled[toId]) return null;
    var segIds = [];
    var nodePath = [toId];
    var cur = toId;
    while (prevSeg[cur] !== undefined) {
      segIds.unshift(prevSeg[cur].id);
      cur = prevNode[cur];
      nodePath.unshift(cur);
    }
    return segIds.length ? { segIds: segIds, nodePath: nodePath } : null;
  }

  // —— 按区段序列拼接完整折线（自动处理方向，去除重复连接点） ——
  // startCoord：行进起点坐标，用于定向首段折线（生成方向不保证与
  // 行进方向一致；后续段由已积累末点链式定向，首段必须显式校验）。
  function stitchPolyline(segIds, maps, startCoord) {
    var points = [];
    for (var i = 0; i < segIds.length; i++) {
      var seg = maps.byId[segIds[i]];
      var pts = seg.polyline;
      if (seg.from === seg.to) return null;
      // 生成脚本保证 polyline[0] 邻近 seg.from；进入方向不同则反转。
      // 方向在拼接时由上下文判断：比较已积累末点与折线两端距离。
      if (points.length) {
        var tail = points[points.length - 1];
        var dHead = Math.abs(tail[0] - pts[0][0]) + Math.abs(tail[1] - pts[0][1]);
        var dTail = Math.abs(tail[0] - pts[pts.length - 1][0]) +
          Math.abs(tail[1] - pts[pts.length - 1][1]);
        if (dTail < dHead) pts = pts.slice().reverse();
        points = points.concat(pts.slice(1));
      } else {
        if (startCoord) {
          var sHead = Math.abs(startCoord[0] - pts[0][0]) +
            Math.abs(startCoord[1] - pts[0][1]);
          var sTail = Math.abs(startCoord[0] - pts[pts.length - 1][0]) +
            Math.abs(startCoord[1] - pts[pts.length - 1][1]);
          if (sTail < sHead) pts = pts.slice().reverse();
        }
        points = points.concat(pts);
      }
    }
    return points.length >= 2 ? points : null;
  }

  // —— 单条记录解析：人工覆盖优先，否则自动寻径；不可达返回 null ——
  function resolveRecordRoute(record) {
    var maps = segmentMaps();
    if (!maps || !record) return null;
    var kind = recordKind(record);
    var fromName = String(record.from || '').trim();
    var toName = String(record.to || '').trim();
    var fromNode = nodeByName(fromName);
    var toNode = nodeByName(toName);

    var segIds = matchOverride(record, (routeData() || {}).overrides, maps, kind);
    if (!segIds) {
      if (!fromNode || !toNode) return null;
      var path = shortestPath(fromNode.id, toNode.id, maps, record.date, kind);
      if (!path) return null;
      segIds = path.segIds;
    }
    // 首段按行进起点定向：自动寻径与人工覆盖都可能以反方向存储，
    // 不校验会让动画从折线存储起点出发先反向跑（可见折返）。
    var points = stitchPolyline(segIds, maps, fromNode ? fromNode.coord : null);
    if (!points) return null;
    var km = 0;
    for (var i = 0; i < segIds.length; i++) {
      km += Number(maps.byId[segIds[i]].estLengthKm) || 0;
    }
    return { segIds: segIds, points: points, km: Math.round(km * 100) / 100 };
  }

  // —— 最小物理区段聚合：方向无关，正反向共同累计 ——
  function aggregateSegments(records, resolve) {
    var maps = segmentMaps();
    var result = {};
    if (!maps) return result;
    var fn = typeof resolve === 'function' ? resolve : resolveRecordRoute;
    var list = records || [];
    for (var i = 0; i < list.length; i++) {
      var route = fn(list[i]);
      if (!route) continue;
      for (var j = 0; j < route.segIds.length; j++) {
        var segId = route.segIds[j];
        if (!result[segId]) {
          result[segId] = { segment: maps.byId[segId], count: 0, records: [] };
        }
        result[segId].count += 1;
        result[segId].records.push(list[i]);
      }
    }
    return result;
  }

  // —— 里程汇总：仅统计有真实路径的乘车 ——
  // uncoveredEmu / uncoveredConv：按列车类别分开计未覆盖条数。普速干线
  // 在分批扩充（批次 F），单条尚未连通的普速行程不该否决"总里程"卡；
  // 动车未覆盖则说明网络缺线，属于真漏。
  function mileageSummary(records, resolve) {
    var fn = typeof resolve === 'function' ? resolve : resolveRecordRoute;
    var list = records || [];
    var totalKm = 0;
    var covered = 0;
    var uncoveredEmu = 0;
    var uncoveredConv = 0;
    for (var i = 0; i < list.length; i++) {
      var route = fn(list[i]);
      if (!route) {
        if (recordKind(list[i]) === KIND_EMU) uncoveredEmu += 1;
        else uncoveredConv += 1;
        continue;
      }
      covered += 1;
      totalKm += route.km;
    }
    return {
      total: list.length,
      covered: covered,
      uncoveredEmu: uncoveredEmu,
      uncoveredConv: uncoveredConv,
      totalKm: Math.round(totalKm * 10) / 10,
    };
  }

  // —— 覆盖率汇总 ——
  function coverageSummary(records, resolve) {
    var summary = mileageSummary(records, resolve);
    return {
      matched: summary.covered,
      total: summary.total,
    };
  }

  var TrainRoutes = {
    DISPLAY_STORAGE_KEY: DISPLAY_STORAGE_KEY,
    MODE_CURVE: MODE_CURVE,
    MODE_REAL: MODE_REAL,
    KIND_EMU: KIND_EMU,
    KIND_CONV: KIND_CONV,
    readDisplayMode: readDisplayMode,
    writeDisplayMode: writeDisplayMode,
    recordKind: recordKind,
    segmentAllowsKind: segmentAllowsKind,
    nodeByName: nodeByName,
    stationCoord: stationCoord,
    resolveRecordRoute: resolveRecordRoute,
    aggregateSegments: aggregateSegments,
    mileageSummary: mileageSummary,
    coverageSummary: coverageSummary,
  };

  root.TrainRoutes = TrainRoutes;
})(typeof window !== 'undefined' ? window : globalThis);
