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

  function buildAdjacency(maps, date, kind, allowSeg) {
    var adj = {};
    for (var i = 0; i < maps.list.length; i++) {
      var seg = maps.list[i];
      if (!segmentUsable(seg, date, kind)) continue;
      if (allowSeg && !allowSeg(seg)) continue;
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
  // allowSeg：可选谓词，用于把寻径限制在某条走廊内（枚举并行径路时
  // 逐条禁用线路）。
  function shortestPath(fromId, toId, maps, date, kind, allowSeg) {
    var adj = buildAdjacency(maps, date, kind, allowSeg);
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

  // —— 车次经由判定 ——
  // 两站之间常有多条并行线（南京南—上海虹桥 就有 京沪高铁 / 沪宁城际 /
  // 沪宁沿江，还能绕 宁杭+沪杭），单纯按里程取最短会在并行走廊里瞎选。
  // 停靠站序列能直接判出走廊：并行走廊的中间站几乎不相交（京沪高铁停
  // 苏州北/无锡东，沪宁城际停 苏州/无锡，沪宁沿江停 金坛/武进/张家港）。
  // 一站直达没有中间站可判，改用官方累计里程匹配（南京南—上海虹桥 的
  // 京沪高铁 295km / 沪宁城际 311km / 沪宁沿江 333km 各成一簇，簇间距
  // 远大于误差）。都判不出才退回全网最短路，并标记低置信。
  // 站序数据见 js/train-stops.js，由 tools/fetch_train_stops.py 抓取。

  // 枚举并行走廊时，替代径路里程超过最短径路这个倍数就不算候选。
  var CORRIDOR_RATIO = 1.3;
  // 判定里程与官方里程的容差，超出即降为低置信。
  var KM_TOLERANCE = 0.08;

  function trainStopEntry(record) {
    var source = root.TRAIN_STOPS;
    if (!source || !source.trains || !record) return null;
    var entry = source.trains[String(record.train || '').trim()];
    if (!entry || !entry.stops || entry.stops.length < 2) return null;
    return entry;
  }

  // 记录区段在本车次全程站序中的子序列，按行进方向排列。
  // from/to 有一个不在站序里就返回 null：车次号跨运行图会被复用，站序
  // 对不上说明抓到的不是记录当年那趟车，宁可退回最短路也不能判错线。
  function viaStopSequence(entry, fromName, toName) {
    var list = entry.stops;
    var i = list.indexOf(fromName);
    var j = list.indexOf(toName);
    if (i < 0 || j < 0 || i === j) return null;
    return j < i ? list.slice(j, i + 1).reverse() : list.slice(i, j + 1);
  }

  // 记录区段的官方累计里程差（km）。缺任一端的里程则返回 null。
  function viaDistanceKm(entry, fromName, toName) {
    var table = entry.km || {};
    var a = table[fromName];
    var b = table[toName];
    if (typeof a !== 'number' || typeof b !== 'number') return null;
    return Math.abs(b - a);
  }

  function pathKm(segIds, maps) {
    var km = 0;
    for (var i = 0; i < segIds.length; i++) {
      km += Number(maps.byId[segIds[i]].estLengthKm) || 0;
    }
    return km;
  }

  // 逐站链接：相邻停靠站优先取直连区段（多数情况就是一站一区间），
  // 没有直连才在这一跳上跑 Dijkstra。任一跳不通即失败并给出断点。
  function chainViaStops(viaNodes, maps, date, kind) {
    var segIds = [];
    for (var i = 1; i < viaNodes.length; i++) {
      var a = viaNodes[i - 1];
      var b = viaNodes[i];
      var direct = maps.byPair[a.id + '|' + b.id];
      var step = null;
      if (direct && segmentUsable(direct, date, kind)) {
        step = [direct.id];
      } else {
        var path = shortestPath(a.id, b.id, maps, date, kind);
        step = path ? path.segIds : null;
      }
      if (!step) return { gap: [a.name, b.name] };
      segIds = segIds.concat(step);
    }
    if (!segIds.length) return { gap: [viaNodes[0].name, viaNodes[1].name] };
    return { segIds: segIds };
  }

  // 枚举并行走廊：反复禁用当前解用到的线路再求最短路，收集里程可比的
  // 替代径路。用于一站直达、没有中间站可判的情形。
  function corridorCandidates(fromId, toId, maps, date, kind) {
    var best = shortestPath(fromId, toId, maps, date, kind);
    if (!best) return [];
    var bestKm = pathKm(best.segIds, maps);
    var seen = {};
    seen[best.segIds.join('>')] = true;
    var out = [{ segIds: best.segIds, km: bestKm }];
    var lineIds = {};
    for (var i = 0; i < best.segIds.length; i++) {
      var ids = maps.byId[best.segIds[i]].lineIds || [];
      for (var j = 0; j < ids.length; j++) lineIds[ids[j]] = true;
    }
    Object.keys(lineIds).forEach(function (lineId) {
      var alt = shortestPath(fromId, toId, maps, date, kind, function (seg) {
        return (seg.lineIds || []).indexOf(lineId) < 0;
      });
      if (!alt) return;
      var km = pathKm(alt.segIds, maps);
      if (km > bestKm * CORRIDOR_RATIO) return;
      var key = alt.segIds.join('>');
      if (seen[key]) return;
      seen[key] = true;
      out.push({ segIds: alt.segIds, km: km });
    });
    return out;
  }

  // 经由判定。成功返回 { segIds, km, by, officialKm, confidence, note }；
  // 判不出返回 { reason, unknown }——reason 同时就是缺线报告，指出网络里
  // 少了哪一段，是后续补线路清单的输入。
  // by 取值：stops 由中间停靠站判定 / mileage 由里程在多走廊中判定 /
  // unique 网络里只有一条走廊 / shortest 多走廊但无里程，退回最短。
  function resolveVia(record, maps, kind) {
    var fromName = String((record && record.from) || '').trim();
    var toName = String((record && record.to) || '').trim();
    var entry = trainStopEntry(record);
    if (!entry) return { reason: '无站序数据' };
    var seq = viaStopSequence(entry, fromName, toName);
    if (!seq) return { reason: '站序对不上（车次可能已改号或停运）' };
    var fromNode = nodeByName(fromName);
    var toNode = nodeByName(toName);
    if (!fromNode || !toNode) return { reason: '区段两端不在网络里' };

    // 站序里网络不认识的站（尚未收录的线）跳过但记下来，它们正是缺线
    // 线索。跳过不影响判定：约束来自认得的那些站的先后顺序。
    var viaNodes = [fromNode];
    var unknown = [];
    for (var i = 1; i < seq.length - 1; i++) {
      var node = nodeByName(seq[i]);
      if (node) viaNodes.push(node);
      else unknown.push(seq[i]);
    }
    viaNodes.push(toNode);

    var officialKm = viaDistanceKm(entry, fromName, toName);
    var segIds;
    var by;
    if (viaNodes.length > 2) {
      var chained = chainViaStops(viaNodes, maps, record.date, kind);
      if (chained.gap) {
        return {
          reason: '缺线：' + chained.gap[0] + '→' + chained.gap[1] + ' 之间无通路',
          unknown: unknown,
        };
      }
      segIds = chained.segIds;
      by = 'stops';
    } else {
      var candidates = corridorCandidates(fromNode.id, toNode.id, maps,
        record.date, kind);
      if (!candidates.length) return { reason: '两站之间无通路', unknown: unknown };
      var pick = candidates[0];
      if (candidates.length === 1) {
        by = 'unique';
      } else if (officialKm === null) {
        by = 'shortest';
      } else {
        by = 'mileage';
        for (var c = 1; c < candidates.length; c++) {
          if (Math.abs(candidates[c].km - officialKm) <
            Math.abs(pick.km - officialKm)) pick = candidates[c];
        }
      }
      segIds = pick.segIds;
    }

    var km = pathKm(segIds, maps);
    var notes = [];
    var confidence = 'high';
    if (by === 'shortest') {
      confidence = 'low';
      notes.push('一站直达且无官方里程，按最短径路');
    }
    if (officialKm !== null) {
      var dev = Math.abs(km - officialKm) / officialKm;
      if (dev > KM_TOLERANCE) {
        confidence = 'low';
        notes.push('里程与官方差 ' + Math.round(dev * 100) + '%');
      }
    }
    if (unknown.length) notes.push('站序中未收录：' + unknown.join('/'));
    return {
      segIds: segIds,
      km: km,
      by: by,
      officialKm: officialKm,
      confidence: confidence,
      note: notes.length ? notes.join('；') : null,
    };
  }

  // 经由判定汇总：逐条记录给出判定方式或失败原因，是补线路清单的输入。
  function viaDiagnostics(records) {
    var maps = segmentMaps();
    var out = [];
    if (!maps) return out;
    var overrides = (routeData() || {}).overrides;
    var list = records || [];
    for (var i = 0; i < list.length; i++) {
      var record = list[i];
      var kind = recordKind(record);
      if (matchOverride(record, overrides, maps, kind)) {
        out.push({ record: record, by: 'override', confidence: 'high' });
        continue;
      }
      var judged = resolveVia(record, maps, kind);
      out.push(judged.segIds
        ? { record: record, by: judged.by, confidence: judged.confidence, note: judged.note }
        : { record: record, by: 'shortest', confidence: 'low', note: judged.reason });
    }
    return out;
  }

  // —— 单条记录解析：人工覆盖 → 车次经由 → 全网最短路；不可达返回 null ——
  function resolveRecordRoute(record) {
    var maps = segmentMaps();
    if (!maps || !record) return null;
    var kind = recordKind(record);
    var fromName = String(record.from || '').trim();
    var toName = String(record.to || '').trim();
    var fromNode = nodeByName(fromName);
    var toNode = nodeByName(toName);

    var segIds = matchOverride(record, (routeData() || {}).overrides, maps, kind);
    var via = segIds ? { by: 'override', confidence: 'high', note: null } : null;
    if (!segIds) {
      var judged = resolveVia(record, maps, kind);
      if (judged.segIds) {
        segIds = judged.segIds;
        via = { by: judged.by, confidence: judged.confidence, note: judged.note };
      } else {
        if (!fromNode || !toNode) return null;
        var path = shortestPath(fromNode.id, toNode.id, maps, record.date, kind);
        if (!path) return null;
        segIds = path.segIds;
        via = { by: 'shortest', confidence: 'low', note: judged.reason };
      }
    }
    // 首段按行进起点定向：自动寻径与人工覆盖都可能以反方向存储，
    // 不校验会让动画从折线存储起点出发先反向跑（可见折返）。
    var points = stitchPolyline(segIds, maps, fromNode ? fromNode.coord : null);
    if (!points) return null;
    return {
      segIds: segIds,
      points: points,
      km: Math.round(pathKm(segIds, maps) * 100) / 100,
      via: via,
    };
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
    viaStopSequence: viaStopSequence,
    resolveVia: resolveVia,
    viaDiagnostics: viaDiagnostics,
    resolveRecordRoute: resolveRecordRoute,
    aggregateSegments: aggregateSegments,
    mileageSummary: mileageSummary,
    coverageSummary: coverageSummary,
  };

  root.TrainRoutes = TrainRoutes;
})(typeof window !== 'undefined' ? window : globalThis);
