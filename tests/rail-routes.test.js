const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

function loadScript(sandbox, file) {
  const code = fs.readFileSync(path.join(ROOT, 'js', file), 'utf8');
  const fn = new Function('window', 'globalThis', code);
  fn(sandbox, sandbox);
}

function loadRoutes(overrides) {
  const sandbox = {};
  loadScript(sandbox, 'data.js');
  loadScript(sandbox, 'rail-route-data.js');
  if (overrides) {
    sandbox.RAIL_ROUTE_DATA = overrides;
  }
  loadScript(sandbox, 'rail-routes.js');
  return sandbox;
}

function loadData() {
  const sandbox = {};
  loadScript(sandbox, 'data.js');
  return sandbox.TRAIN_DATA;
}

// app.js 中某个顶层函数的源码体。全文正则在跨函数处会误判（[\s\S]*? 能
// 一路吃到后文的同名语句），函数体级别的行为断言必须先界定范围。
function functionBody(code, name) {
  const start = code.indexOf('function ' + name + '(');
  if (start < 0) return '';
  const end = code.indexOf('\n  }', start);
  return code.slice(start, end < 0 ? code.length : end);
}

function fakeStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    _map: map,
  };
}

function pilotRecords() {
  const data = loadData();
  const corridor = new Set(['南京南', '合肥南', '合肥西', '六安', '汉口', '武汉']);
  return data.records.filter((r) => corridor.has(r.from) && corridor.has(r.to));
}

// 计划文档规定的走廊粗粒度计数：范围 → 该范围内每个最小区段的乘坐次数。
const CORRIDOR_SEGMENTS = {
  '南京南—合肥南': ['njnj-quanjiao', 'quanjiao-feidong', 'feidong-hefei-south'],
  '合肥南—长安集': ['hefei-south-changanji'],
  '合肥西—长安集': ['hefei-west-changanji'],
  '长安集—六安': ['changanji-leimadian', 'leimadian-luan'],
  '六安—横店东': ['luan-jinzhai', 'jinzhai-macheng-north', 'macheng-north-honganxi', 'honganxi-hengdian-east'],
  '横店东—汉口': ['hengdian-east-hankou'],
  '横店东—武汉': ['hengdian-east-jg-junction', 'jg-junction-wuhan'],
};
const CORRIDOR_COUNTS = {
  '南京南—合肥南': 8,
  '合肥南—长安集': 9,
  '合肥西—长安集': 1,
  '长安集—六安': 10,
  '六安—横店东': 10,
  '横店东—汉口': 7,
  '横店东—武汉': 3,
};

describe('rail network data integrity', () => {
  const data = loadData();

  it('exposes source snapshot and OSM attribution', () => {
    const { RAIL_ROUTE_DATA } = loadRoutes();
    assert.equal(RAIL_ROUTE_DATA.source.provider, 'OpenStreetMap');
    assert.match(RAIL_ROUTE_DATA.source.snapshotDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(RAIL_ROUTE_DATA.source.attribution, /OpenStreetMap contributors/);
  });

  it('gives every node a unique stable id and a unique station name', () => {
    const { RAIL_ROUTE_DATA } = loadRoutes();
    const nodes = RAIL_ROUTE_DATA.nodes;
    const ids = new Set(nodes.map((n) => n.id));
    const names = new Set(nodes.map((n) => n.name));
    assert.equal(ids.size, nodes.length);
    assert.equal(names.size, nodes.length);
    nodes.forEach((n) => {
      assert.ok(Array.isArray(n.coord) && n.coord.length === 2, n.id);
      assert.ok(['station', 'junction'].includes(n.kind), n.id);
    });
  });

  it('includes pilot passenger stations as nodes', () => {
    const { RAIL_ROUTE_DATA } = loadRoutes();
    const names = new Set(RAIL_ROUTE_DATA.nodes.map((n) => n.name));
    for (const name of ['南京南', '全椒', '肥东', '合肥南', '合肥西', '六安', '金寨', '麻城北', '红安西', '横店东', '汉口', '武汉']) {
      assert.ok(names.has(name), 'missing node ' + name);
    }
  });

  it('connects every segment polyline to its node coordinates', () => {
    const { RAIL_ROUTE_DATA } = loadRoutes();
    const byId = new Map(RAIL_ROUTE_DATA.nodes.map((n) => [n.id, n]));
    RAIL_ROUTE_DATA.segments.forEach((seg) => {
      assert.ok(byId.has(seg.from), seg.id + ' from');
      assert.ok(byId.has(seg.to), seg.id + ' to');
      assert.ok(Array.isArray(seg.polyline) && seg.polyline.length >= 2, seg.id + ' polyline');
      const head = seg.polyline[0];
      const tail = seg.polyline[seg.polyline.length - 1];
      const fromCoord = byId.get(seg.from).coord;
      const toCoord = byId.get(seg.to).coord;
      assert.ok(Math.hypot(head[0] - fromCoord[0], head[1] - fromCoord[1]) < 0.001, seg.id + ' head');
      assert.ok(Math.hypot(tail[0] - toCoord[0], tail[1] - toCoord[1]) < 0.001, seg.id + ' tail');
    });
  });

  it('has positive lengths and no duplicated consecutive points', () => {
    const { RAIL_ROUTE_DATA } = loadRoutes();
    RAIL_ROUTE_DATA.segments.forEach((seg) => {
      assert.ok(seg.estLengthKm > 0, seg.id + ' length');
      for (let i = 1; i < seg.polyline.length; i++) {
        const a = seg.polyline[i - 1];
        const b = seg.polyline[i];
        assert.ok(a[0] !== b[0] || a[1] !== b[1], seg.id + ' duplicate at ' + i);
      }
    });
  });

  it('keeps the corridor connected between major hubs', () => {
    const { TrainRoutes } = loadRoutes();
    const hubs = ['合肥南', '合肥西', '六安', '麻城北', '横店东', '汉口', '武汉'];
    for (const hub of hubs) {
      const route = TrainRoutes.resolveRecordRoute({ from: '南京南', to: hub, train: 'G0', date: '2026-01-01' });
      assert.ok(route, '南京南 -> ' + hub + ' should route');
    }
  });
});

describe('automatic routing', () => {
  const { TrainRoutes, RAIL_ROUTE_DATA } = loadRoutes();

  it('resolves 南京南→麻城北 without explicit configuration and stops there', () => {
    const route = TrainRoutes.resolveRecordRoute({ from: '南京南', to: '麻城北', train: 'G1', date: '2026-01-01' });
    assert.ok(route);
    const segById = new Map(RAIL_ROUTE_DATA.segments.map((s) => [s.id, s]));
    const lastSeg = segById.get(route.segIds[route.segIds.length - 1]);
    assert.ok(lastSeg.from === 'macheng-north' || lastSeg.to === 'macheng-north');
  });

  it('reverses segments for 麻城北→南京南', () => {
    const out = TrainRoutes.resolveRecordRoute({ from: '南京南', to: '麻城北', train: 'G1', date: '2026-01-01' });
    const back = TrainRoutes.resolveRecordRoute({ from: '麻城北', to: '南京南', train: 'G2', date: '2026-01-01' });
    assert.ok(out && back);
    assert.deepEqual(back.segIds, out.segIds.slice().reverse());
  });

  it('orients the first segment along the travel direction (no animation backtrack)', () => {
    // 回归：xi-ning-bei-da-tong-xi 与 leimadian-luan 的折线存储方向
    // 与行进方向相反，首段不定向会让动画先反向跑（可见折返）。
    const byName = new Map(RAIL_ROUTE_DATA.nodes.map((n) => [n.name, n]));
    const cases = [
      { date: '2023-08-03', from: '大通西', to: '西宁', train: 'D9914' },
      { date: '2026-05-29', from: '六安', to: '南京南', train: 'G678' },
    ];
    for (const rec of cases) {
      const route = TrainRoutes.resolveRecordRoute(rec);
      assert.ok(route, rec.from + ' -> ' + rec.to);
      const fromCoord = byName.get(rec.from).coord;
      const toCoord = byName.get(rec.to).coord;
      const head = route.points[0];
      const tail = route.points[route.points.length - 1];
      assert.ok(
        Math.hypot(head[0] - fromCoord[0], head[1] - fromCoord[1]) < 0.001,
        rec.from + ' route should start at the origin station'
      );
      assert.ok(
        Math.hypot(tail[0] - toCoord[0], tail[1] - toCoord[1]) < 0.001,
        rec.to + ' route should end at the destination station'
      );
    }
  });

  it('routes 南京南→武汉 via 横店东 onto the Jingguang line', () => {
    const route = TrainRoutes.resolveRecordRoute({ from: '南京南', to: '武汉', train: 'G1427', date: '2026-07-19' });
    assert.ok(route);
    assert.ok(route.segIds.includes('hengdian-east-jg-junction'));
    assert.ok(route.segIds.includes('jg-junction-wuhan'));
    assert.ok(!route.segIds.includes('hengdian-east-hankou'));
  });

  it('routes 南京南→汉口 without entering the Wuhan branch', () => {
    const route = TrainRoutes.resolveRecordRoute({ from: '南京南', to: '汉口', train: 'G599', date: '2025-10-08' });
    assert.ok(route);
    assert.ok(route.segIds.includes('hengdian-east-hankou'));
    assert.ok(!route.segIds.includes('hengdian-east-jg-junction'));
    assert.ok(!route.segIds.includes('jg-junction-wuhan'));
  });

  it('routes 合肥西→武汉 through the Hefei-west bypass into 长安集', () => {
    const route = TrainRoutes.resolveRecordRoute({ from: '合肥西', to: '武汉', train: 'G1747', date: '2026-04-13' });
    assert.ok(route);
    assert.equal(route.segIds[0], 'hefei-west-changanji');
    assert.ok(route.segIds.includes('hengdian-east-jg-junction'));
  });

  // 四节点测试网：甲—乙—丁（北线 31km）与 甲—丙—丁（南线 16km，
  // 丙—丁 2024-04-26 开通）。审查报告的验收样例网络。
  function miniNetwork() {
    return {
      nodes: [
        { id: 'a', name: '甲', kind: 'station', coord: [110.0, 30.0] },
        { id: 'b', name: '乙', kind: 'station', coord: [110.1, 30.0] },
        { id: 'c', name: '丙', kind: 'station', coord: [110.05, 30.1] },
        { id: 'd', name: '丁', kind: 'station', coord: [110.2, 30.1] },
      ],
      segments: [
        { id: 'ab', name: '北线', from: 'a', to: 'b', lineIds: ['n'], serviceDate: '2010-01-01', estLengthKm: 11, polyline: [[110.0, 30.0], [110.1, 30.0]] },
        { id: 'bd', name: '北线', from: 'b', to: 'd', lineIds: ['n'], serviceDate: '2010-01-01', estLengthKm: 20, polyline: [[110.1, 30.0], [110.2, 30.1]] },
        { id: 'ac', name: '南线', from: 'a', to: 'c', lineIds: ['s'], serviceDate: '2010-01-01', estLengthKm: 8, polyline: [[110.0, 30.0], [110.05, 30.1]] },
        { id: 'cd', name: '南线', from: 'c', to: 'd', lineIds: ['s'], serviceDate: '2024-04-26', estLengthKm: 8, polyline: [[110.05, 30.1], [110.2, 30.1]] },
      ],
      overrides: [],
    };
  }

  it('rejects a partial override that does not reach the destination', () => {
    // 覆盖 甲→丁 只给 甲→乙 一段：不连续/不完整，必须拒绝并回退自动。
    const mini = miniNetwork();
    mini.overrides = [{ from: '甲', to: '丁', segments: ['ab'] }];
    const Routes = loadRoutes(mini).TrainRoutes;
    const route = Routes.resolveRecordRoute({ from: '甲', to: '丁', train: 'G1', date: '2025-01-01' });
    assert.ok(route);
    assert.deepEqual(route.segIds, ['ac', 'cd']);
  });

  it('rejects a valid-id override with disconnected segments', () => {
    const mini = miniNetwork();
    mini.overrides = [{ from: '甲', to: '丁', segments: ['ab', 'cd'] }];
    const Routes = loadRoutes(mini).TrainRoutes;
    const route = Routes.resolveRecordRoute({ from: '甲', to: '丁', train: 'G1', date: '2025-01-01' });
    assert.ok(route);
    assert.deepEqual(route.segIds, ['ac', 'cd']);
  });

  it('rejects an override whose segment opens after the trip date', () => {
    const mini = miniNetwork();
    mini.overrides = [{ from: '甲', to: '丁', train: 'G1', segments: ['ac', 'cd'] }];
    const Routes = loadRoutes(mini).TrainRoutes;
    const early = Routes.resolveRecordRoute({ from: '甲', to: '丁', train: 'G1', date: '2020-01-01' });
    assert.deepEqual(early.segIds, ['ab', 'bd']);
    const late = Routes.resolveRecordRoute({ from: '甲', to: '丁', train: 'G1', date: '2025-01-01' });
    assert.deepEqual(late.segIds, ['ac', 'cd']);
  });

  it('applies a complete override even when auto routing is shorter', () => {
    const mini = miniNetwork();
    mini.overrides = [{ from: '甲', to: '丁', train: 'G9', segments: ['ab', 'bd'] }];
    const Routes = loadRoutes(mini).TrainRoutes;
    const route = Routes.resolveRecordRoute({ from: '甲', to: '丁', train: 'G9', date: '2025-01-01' });
    assert.deepEqual(route.segIds, ['ab', 'bd']);
    // 同站对不同车次互不影响：G1 无覆盖，走自动最短路。
    const other = Routes.resolveRecordRoute({ from: '甲', to: '丁', train: 'G1', date: '2025-01-01' });
    assert.deepEqual(other.segIds, ['ac', 'cd']);
  });

  it('never routes a historical trip over a segment that is not yet open', () => {
    const mini = miniNetwork();
    const Routes = loadRoutes(mini).TrainRoutes;
    const early = Routes.resolveRecordRoute({ from: '甲', to: '丁', train: 'G1', date: '2020-01-01' });
    assert.deepEqual(early.segIds, ['ab', 'bd']);
    const late = Routes.resolveRecordRoute({ from: '甲', to: '丁', train: 'G1', date: '2025-01-01' });
    assert.deepEqual(late.segIds, ['ac', 'cd']);
  });

  it('applies the G1435 manual override as a complete contiguous path', () => {
    const { TrainRoutes, RAIL_ROUTE_DATA } = loadRoutes();
    const route = TrainRoutes.resolveRecordRoute({ from: '武汉', to: '黄山西', train: 'G1435', date: '2026-08-12' });
    assert.ok(route);
    const override = RAIL_ROUTE_DATA.overrides.find((o) => o.train === 'G1435');
    assert.ok(override);
    assert.deepEqual(route.segIds, override.segments);
    const lastSeg = RAIL_ROUTE_DATA.segments.find((s) => s.id === route.segIds[route.segIds.length - 1]);
    const huangshanxi = RAIL_ROUTE_DATA.nodes.find((n) => n.name === '黄山西');
    assert.ok(lastSeg.from === huangshanxi.id || lastSeg.to === huangshanxi.id);
  });

  it('returns null for unknown stations and for disconnected networks', () => {
    assert.equal(
      TrainRoutes.resolveRecordRoute({ from: '火星站', to: '汉口', train: 'G1', date: '2026-01-01' }),
      null
    );

    // 全国网络连通性高，删除单个区段仍可绕行；改用仅保留单段的
    // 小子网来验证断网时回退 null。
    const isolated = JSON.parse(JSON.stringify(RAIL_ROUTE_DATA));
    isolated.segments = isolated.segments.filter((s) => s.id === 'njnj-quanjiao');
    const Routes = loadRoutes(isolated).TrainRoutes;
    assert.equal(Routes.resolveRecordRoute({ from: '南京南', to: '汉口', train: 'G1', date: '2026-01-01' }), null);
  });

  it('prefers network anchors over TRAIN_DATA stations for stationCoord', () => {
    // 真实模式坐标统一入口：网络节点（与区段折线端点同源）优先。
    assert.deepEqual(TrainRoutes.stationCoord('麻城北', loadData().stations), [114.9793, 31.1893]);
    assert.deepEqual(TrainRoutes.stationCoord('不存在', loadData().stations), null);
    // 普速干线并入后 杭州（城站）也有网络锚点，2 位小数粗坐标不再优先。
    const data = loadData();
    assert.deepEqual(TrainRoutes.stationCoord('杭州', data.stations), [120.17835, 30.24597]);
    assert.notDeepEqual(TrainRoutes.stationCoord('杭州', data.stations), data.stations['杭州']);
    // 真正网络外的站仍回退业务站表。
    assert.deepEqual(TrainRoutes.stationCoord('某外站', { 某外站: [100, 30] }), [100, 30]);
  });
});

describe('train-kind segment filtering', () => {
  // 类别过滤测试网：北线为仅开动车组的高速正线（31km），南线为普速
  // 干线（16km）。不做类别过滤，动车记录会被更短的普速南线改道、
  // 普速记录则会借道只开动车组的高速正线——两类错误都不可见地改变径路。
  function kindNetwork(overrides) {
    const cfg = Object.assign(
      { north: ['emu'], south: ['conv'] },
      overrides || {}
    );
    return {
      lines: [
        { id: 'hsr', name: '高速正线', trains: cfg.north },
        { id: 'conv', name: '普速干线', trains: cfg.south },
      ],
      nodes: [
        { id: 'a', name: '甲', kind: 'station', coord: [110.0, 30.0] },
        { id: 'b', name: '乙', kind: 'station', coord: [110.1, 30.0] },
        { id: 'c', name: '丙', kind: 'station', coord: [110.05, 30.1] },
        { id: 'd', name: '丁', kind: 'station', coord: [110.2, 30.1] },
      ],
      segments: [
        { id: 'ab', name: '高速正线', from: 'a', to: 'b', lineIds: ['hsr'], serviceDate: '2012-12-01', estLengthKm: 11, polyline: [[110.0, 30.0], [110.1, 30.0]] },
        { id: 'bd', name: '高速正线', from: 'b', to: 'd', lineIds: ['hsr'], serviceDate: '2012-12-01', estLengthKm: 20, polyline: [[110.1, 30.0], [110.2, 30.1]] },
        { id: 'ac', name: '普速干线', from: 'a', to: 'c', lineIds: ['conv'], serviceDate: '1996-09-01', estLengthKm: 8, polyline: [[110.0, 30.0], [110.05, 30.1]] },
        { id: 'cd', name: '普速干线', from: 'c', to: 'd', lineIds: ['conv'], serviceDate: '1996-09-01', estLengthKm: 8, polyline: [[110.05, 30.1], [110.2, 30.1]] },
      ],
      overrides: [],
    };
  }

  function routes(overrides) {
    return loadRoutes(kindNetwork(overrides)).TrainRoutes;
  }

  it('classifies G/D/C as emu and K/T/Z/numeric as conv', () => {
    const { TrainRoutes } = loadRoutes();
    for (const train of ['G172', 'D2256', 'C1234']) {
      assert.equal(TrainRoutes.recordKind({ train }), TrainRoutes.KIND_EMU, train);
    }
    for (const train of ['K1352', 'Z45', 'T123', '1462']) {
      assert.equal(TrainRoutes.recordKind({ train }), TrainRoutes.KIND_CONV, train);
    }
  });

  it('keeps emu trips off the shorter conv-only corridor', () => {
    const route = routes().resolveRecordRoute({ from: '甲', to: '丁', train: 'G1', date: '2026-01-01' });
    assert.deepEqual(route.segIds, ['ab', 'bd']);
  });

  it('routes conv trips over the conv corridor they actually run on', () => {
    const route = routes().resolveRecordRoute({ from: '甲', to: '丁', train: 'K82', date: '2026-01-01' });
    assert.deepEqual(route.segIds, ['ac', 'cd']);
  });

  it('returns null when a conv trip has no conv-capable path', () => {
    // 全网只开动车组 → 普速记录无实际径路，前端回退曲线。
    const R = routes({ north: ['emu'], south: ['emu'] });
    assert.equal(R.resolveRecordRoute({ from: '甲', to: '丁', train: 'K82', date: '2026-01-01' }), null);
    assert.ok(R.resolveRecordRoute({ from: '甲', to: '丁', train: 'G1', date: '2026-01-01' }));
  });

  it('shares a mixed-traffic corridor with both kinds', () => {
    // 沪汉蓉一类走廊：区段 lineIds 并集含两类列车即可双方共同走行，
    // 正反向共同累计热度。
    const R = routes({ north: ['emu'], south: ['emu', 'conv'] });
    assert.deepEqual(R.resolveRecordRoute({ from: '甲', to: '丁', train: 'G1', date: '2026-01-01' }).segIds, ['ac', 'cd']);
    assert.deepEqual(R.resolveRecordRoute({ from: '甲', to: '丁', train: 'K82', date: '2026-01-01' }).segIds, ['ac', 'cd']);
  });

  it('honours segment-level trains over the line declaration', () => {
    // 共线走廊（高铁正线与既有线同走一段）由构建器把区段 trains 并成
    // 两类；区段自带 trains 时以区段为准，不再回看线路声明。
    const net = kindNetwork();
    net.segments[0].trains = ['emu', 'conv'];
    const R = loadRoutes(net).TrainRoutes;
    const emu = R.resolveRecordRoute({ from: '甲', to: '乙', train: 'G1', date: '2026-01-01' });
    const conv = R.resolveRecordRoute({ from: '甲', to: '乙', train: 'K1', date: '2026-01-01' });
    assert.deepEqual(emu.segIds, ['ab']);
    assert.deepEqual(conv.segIds, ['ab']);
    // 乙—丁 仍仅动车组走行：普速续不上，只能改走普速南线。
    const convThrough = R.resolveRecordRoute({ from: '甲', to: '丁', train: 'K1', date: '2026-01-01' });
    assert.deepEqual(convThrough.segIds, ['ac', 'cd']);
  });

  it('defaults undecorated data to emu-only so existing products keep routing', () => {
    // 现行已发布产物没有 trains 字段：必须保持"仅动车组"语义，否则
    // 新建普速干线会静默改变既有高铁记录的径路。
    const net = kindNetwork();
    delete net.lines;
    const R = loadRoutes(net).TrainRoutes;
    assert.deepEqual(R.resolveRecordRoute({ from: '甲', to: '丁', train: 'G1', date: '2026-01-01' }).segIds, ['ac', 'cd']);
    assert.equal(R.resolveRecordRoute({ from: '甲', to: '丁', train: 'K1', date: '2026-01-01' }), null);
  });

  it('rejects an override whose segments the train kind cannot use', () => {
    const net = kindNetwork();
    net.overrides = [{ from: '甲', to: '丁', train: 'K82', segments: ['ab', 'bd'] }];
    const R = loadRoutes(net).TrainRoutes;
    assert.deepEqual(R.resolveRecordRoute({ from: '甲', to: '丁', train: 'K82', date: '2026-01-01' }).segIds, ['ac', 'cd']);
  });

  it('reports uncovered trips by kind so a conv gap does not veto the mileage card', () => {
    // 全网暂无普速可走（线路清单还在扩充）：未覆盖只算在普速头上，
    // 动车一条不缺，"估算总里程"卡照旧显示。
    const R = routes({ north: ['emu'], south: ['emu'] });
    const summary = R.mileageSummary([
      { from: '甲', to: '丁', train: 'G1', date: '2026-01-01' },
      { from: '甲', to: '丁', train: 'K1', date: '2026-01-01' },
      { from: '乙', to: '戊', train: 'Z9', date: '2026-01-01' },
    ]);
    assert.equal(summary.covered, 1);
    assert.equal(summary.uncoveredEmu, 0);
    assert.equal(summary.uncoveredConv, 2);
  });
});

describe('pilot corridor counts', () => {
  it('matches the planned coarse-grained segment counts for the 11 trips', () => {
    const { TrainRoutes } = loadRoutes();
    const recs = pilotRecords();
    assert.equal(recs.length, 11);
    const aggregated = TrainRoutes.aggregateSegments(recs);
    for (const [corridor, segIds] of Object.entries(CORRIDOR_SEGMENTS)) {
      for (const segId of segIds) {
        assert.equal(
          aggregated[segId] ? aggregated[segId].count : 0,
          CORRIDOR_COUNTS[corridor],
          corridor + ' / ' + segId
        );
      }
    }
  });

  it('covers all 37 records with a real path', () => {
    const { TrainRoutes } = loadRoutes();
    const data = loadData();
    const coverage = TrainRoutes.coverageSummary(data.records);
    assert.equal(coverage.total, 37);
    // 批次 F 补上 兰州西—兰州（借 陇海线 引入段）与 大旬联络线 后，
    // 最后一条不通的 K1352 西宁→西安 也出了实际路径。
    assert.equal(coverage.matched, 37);
  });

  it('counts direction-agnostic usage and keeps record references', () => {
    const { TrainRoutes } = loadRoutes();
    const recs = pilotRecords();
    const aggregated = TrainRoutes.aggregateSegments(recs);
    const group = aggregated['njnj-quanjiao'];
    assert.equal(group.count, 8);
    assert.equal(group.records.length, 8);
    group.records.forEach((rec) => {
      assert.ok(rec.date && rec.train);
    });
  });

  it('sums mileage over every record with a real path', () => {
    const { TrainRoutes } = loadRoutes();
    const data = loadData();
    const summary = TrainRoutes.mileageSummary(data.records);
    assert.equal(summary.total, 37);
    assert.equal(summary.covered, 37);
    assert.ok(summary.totalKm > 0);
    assert.equal(summary.uncoveredEmu, 0);
    assert.equal(summary.uncoveredConv, 0);
    const onlyPilot = TrainRoutes.mileageSummary(pilotRecords());
    assert.equal(onlyPilot.covered, 11);
    assert.ok(onlyPilot.totalKm > 0);
    // 宁蓉走廊里程是全国总量的一部分（试点结果保持不变）。
    assert.ok(onlyPilot.totalKm < summary.totalKm);
  });

  it('matches the timetable mileage at every K148 checkpoint', () => {
    // 拿中途站逐点核，不拿总里程核：总里程会让别处的少算和枢纽里的
    // 多绕互相抵消，看着准其实两头都错。时刻表（K148 自西安起）
    // 西安东 30 / 引镇 44 / 镇安 141 / 旬阳北 214 / 安康 265。
    // 西安—引镇 以前绕 窑村 得 51.6km，补上"田灞联络线"直连
    // 灞桥—田王 之后才落到 44km 一档。
    const sandbox = loadRoutes();
    loadScript(sandbox, 'train-stops.js');
    const TrainRoutes = sandbox.TrainRoutes;
    const official = { '西安东': 30, '引镇': 44, '镇安': 141,
      '旬阳北': 214, '安康': 265 };
    for (const stop of Object.keys(official)) {
      const route = TrainRoutes.resolveRecordRoute(
        { from: '西安', to: stop, train: 'K148', date: '2026-05-03' });
      assert.ok(route, '西安→' + stop + ' 不可达');
      assert.ok(Math.abs(route.km - official[stop]) / official[stop] < 0.05,
        '西安→' + stop + ' 网络 ' + route.km + 'km，时刻表 ' +
        official[stop] + 'km，差超 5%');
    }
  });
});

describe('display mode preference', () => {
  it('defaults to curve when storage is empty or broken', () => {
    const { TrainRoutes } = loadRoutes();
    assert.equal(TrainRoutes.DISPLAY_STORAGE_KEY, 'train-footprint-map-display');
    assert.equal(TrainRoutes.readDisplayMode(null), 'curve');
    assert.equal(TrainRoutes.readDisplayMode(fakeStorage()), 'curve');

    const broken = fakeStorage();
    broken.setItem('train-footprint-map-display', '{"weird": true');
    assert.equal(TrainRoutes.readDisplayMode(broken), 'curve');
    const junk = fakeStorage();
    junk.setItem('train-footprint-map-display', 'turbo');
    assert.equal(TrainRoutes.readDisplayMode(junk), 'curve');
  });

  it('persists real mode and survives reload', () => {
    const { TrainRoutes } = loadRoutes();
    const storage = fakeStorage();
    TrainRoutes.writeDisplayMode(storage, 'real');
    assert.equal(TrainRoutes.readDisplayMode(storage), 'real');
    TrainRoutes.writeDisplayMode(storage, 'curve');
    assert.equal(TrainRoutes.readDisplayMode(storage), 'curve');
  });

  it('ignores invalid mode writes and never touches ride data storage', () => {
    const { TrainRoutes } = loadRoutes();
    const storage = fakeStorage();
    TrainRoutes.writeDisplayMode(storage, 'real');
    TrainRoutes.writeDisplayMode(storage, 'hacker');
    assert.equal(TrainRoutes.readDisplayMode(storage), 'real');
    assert.ok(!storage._map.has('train-footprint-user'));
  });
});

describe('map display integration', () => {
  const appCode = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(ROOT, 'css', 'style.css'), 'utf8');

  it('loads the route modules before app.js', () => {
    const order = [
      html.indexOf('js/rail-route-data.js'),
      html.indexOf('js/rail-routes.js'),
      html.indexOf('js/app.js'),
    ];
    assert.ok(order.every((i) => i > 0));
    assert.ok(order[0] < order[1] && order[1] < order[2]);
  });

  it('renders real-path aggregation through buildDisplayLines with curve fallback', () => {
    assert.match(appCode, /function buildRealLines\(/);
    assert.match(appCode, /function buildDisplayLines\(/);
    assert.match(appCode, /buildDisplayLines\(visible\)/);
    assert.match(appCode, /buildDisplayLines\(bgRecords, overlay && overlay\.skipLineKey\)/);
    assert.match(appCode, /realRoutesAvailable\(\)/);
  });

  it('highlights hovered records with the stitched real path', () => {
    assert.match(appCode, /recordRouteByKey/);
    assert.match(appCode, /routeRec && routeRec\.points/);
  });

  it('caches record routes at record level, not per station pair', () => {
    // 同站对不同车次可能选径不同：缓存键必须含 date+train+from+to。
    assert.match(appCode, /function recordCacheKey\(/);
    assert.match(appCode, /cachedRecordRoute\(rec\)/);
    assert.doesNotMatch(appCode, /cachedRecordRoute\(rec,\s*key\)/);
    assert.doesNotMatch(appCode, /cachedRecordRoute\(rec,\s*lineKey\(/);
  });

  it('uses one unified coordinate entry for real-mode markers and replay', () => {
    assert.match(appCode, /function displayCoord\(/);
    assert.match(appCode, /var coord = displayCoord\(name\);/);
    assert.match(appCode, /fromCoord: displayCoord\(rec\.from\),/);
    assert.match(appCode, /var fromCoord = displayCoord\(rec\.from\);/);
  });

  it('replays trips along routePoints when available', () => {
    assert.match(appCode, /routePoints: routePoints/);
    assert.match(appCode, /trip\.routePoints && trip\.routePoints\.length >= 2/);
  });

  it('switches modes preserving view and handles in-flight playback', () => {
    assert.match(appCode, /function setMapDisplayMode\(/);
    assert.match(appCode, /setMapDisplayMode[\s\S]*?TrainRoutes\.writeDisplayMode\(window\.localStorage, mode\)/);
    assert.match(appCode, /setMapDisplayMode[\s\S]*?if \(timelinePlaying\) \{\s*stopPlay\(\);/);
    assert.match(appCode, /setMapDisplayMode[\s\S]*?restoreFullMap\(\);/);
    assert.match(appCode, /setMapDisplayMode[\s\S]*?renderMap\(readGeoView\(mapChart\), true\)/);
  });

  it('shows the OSM attribution in the settings panel', () => {
    assert.doesNotMatch(html, /id="map-osm-attribution"/);
    assert.doesNotMatch(appCode, /syncOsmAttribution/);
    assert.match(html, /settings-panel" data-panel="display"[\s\S]*?铁路几何数据 © OpenStreetMap contributors · ODbL/);
  });

  it('adds the map display settings panel', () => {
    assert.match(html, /data-panel="display">地图显示</);
    assert.match(html, /id="map-display-options"/);
    assert.match(html, /id="map-display-curve"[\s\S]*?value="curve"/);
    assert.match(html, /id="map-display-real"[\s\S]*?value="real"/);
    assert.doesNotMatch(html, /id="map-display-coverage"/);
    assert.doesNotMatch(appCode, /真实路径已覆盖/);
    assert.doesNotMatch(appCode, /mapDisplayCoverageText/);
    assert.match(appCode, /syncMapDisplayControls\(\)/);
    assert.match(appCode, /setMapDisplayMode[\s\S]*?syncTypeFilterButtons\(\);/);
  });

  it('keeps the train-type filter when switching display modes', () => {
    // 普速行程同样有实际径路：进入"真实路径优先"不再把车型筛选强制
    // 切成动车，模式切换只重绘地图，不改动用户选中的类别。
    const body = functionBody(appCode, 'setMapDisplayMode');
    assert.ok(body, 'setMapDisplayMode 函数体未找到');
    assert.doesNotMatch(body, /typeFilter\s*=/);
    assert.doesNotMatch(body, /syncTypeFilterButtons/);
    assert.doesNotMatch(body, /applyRangeFilter/);
    assert.match(body, /renderMap\(readGeoView\(mapChart\), true\)/);
  });

  it('hides the mileage card when an emu trip has no real path', () => {
    assert.match(html, /id="stat-mileage-card"[^>]*hidden/);
    assert.match(html, /id="stat-mileage"/);
    assert.match(appCode, /mileageCardState\(\)/);
    const body = functionBody(appCode, 'mileageCardState');
    // 完整性只按动车组判定：普速干线分批扩充，未连通的普速行程不否决卡片。
    assert.match(body, /summary\.uncoveredEmu === 0/);
    assert.doesNotMatch(body, /covered === summary\.total/);
    assert.match(appCode, /cards\.classList\.toggle\('has-mileage', state\.show\)/);
    assert.match(css, /\.stat-cards\.has-mileage\s*\{[^}]*repeat\(4, var\(--stat-card-width\)\)/);
    assert.match(css, /@media\s*\(max-width:\s*1024px\)[\s\S]*?\.stat-cards\.has-mileage\s*\{[^}]*repeat\(2, minmax\(0, 1fr\)\)/);
  });

  it('registers the pilot passenger stations into the standard coordinate source', () => {
    const data = loadData();
    for (const name of ['全椒', '肥东', '金寨', '麻城北', '红安西']) {
      assert.ok(Array.isArray(data.stations[name]), 'missing coord for ' + name);
    }
  });
});

describe('train via resolution', () => {
  function loadWithStops(overrides) {
    const sandbox = loadRoutes(overrides);
    loadScript(sandbox, 'train-stops.js');
    return sandbox;
  }

  function withStops(sandbox, trains) {
    sandbox.TRAIN_STOPS = { meta: {}, trains: trains };
    return sandbox.TrainRoutes;
  }

  // 并行走廊测试网：甲—乙—丁（北线 100km）与 甲—丙—丁（南线 110km）。
  // 南线更长，所以纯最短路必选北线；判据必须能把停在丙的车判到南线。
  // 里程比 1.1，落在真实走廊的范围内（南京南—上海虹桥 295/311/333）。
  function corridorNetwork() {
    return {
      nodes: [
        { id: 'a', name: '甲', kind: 'station', coord: [110.0, 30.0] },
        { id: 'b', name: '乙', kind: 'station', coord: [110.5, 30.0] },
        { id: 'c', name: '丙', kind: 'station', coord: [110.5, 30.5] },
        { id: 'd', name: '丁', kind: 'station', coord: [111.0, 30.0] },
      ],
      segments: [
        { id: 'ab', name: '北线', from: 'a', to: 'b', lineIds: ['n'], serviceDate: '2010-01-01', estLengthKm: 40, polyline: [[110.0, 30.0], [110.5, 30.0]] },
        { id: 'bd', name: '北线', from: 'b', to: 'd', lineIds: ['n'], serviceDate: '2010-01-01', estLengthKm: 60, polyline: [[110.5, 30.0], [111.0, 30.0]] },
        { id: 'ac', name: '南线', from: 'a', to: 'c', lineIds: ['s'], serviceDate: '2010-01-01', estLengthKm: 55, polyline: [[110.0, 30.0], [110.5, 30.5]] },
        { id: 'cd', name: '南线', from: 'c', to: 'd', lineIds: ['s'], serviceDate: '2010-01-01', estLengthKm: 55, polyline: [[110.5, 30.5], [111.0, 30.0]] },
      ],
      overrides: [],
    };
  }

  const record = { from: '甲', to: '丁', train: 'G1', date: '2025-01-01' };

  it('picks the longer corridor when the train stopped on it', () => {
    // 无站序时最短路选北线（100km）；停靠站里有丙就必须改判南线（110km）。
    const plain = loadRoutes(corridorNetwork()).TrainRoutes;
    assert.deepEqual(plain.resolveRecordRoute(record).segIds, ['ab', 'bd']);

    const Routes = withStops(loadRoutes(corridorNetwork()), {
      G1: { trainNo: 'x', asOf: '2025-01-01', stops: ['甲', '丙', '丁'] },
    });
    const route = Routes.resolveRecordRoute(record);
    assert.deepEqual(route.segIds, ['ac', 'cd']);
    assert.equal(route.via.by, 'stops');
    assert.equal(route.via.confidence, 'high');
  });

  it('reads the stop sequence in travel direction either way', () => {
    const Routes = withStops(loadRoutes(corridorNetwork()), {
      G1: { trainNo: 'x', asOf: '2025-01-01', stops: ['丁', '丙', '甲'] },
    });
    assert.deepEqual(Routes.resolveRecordRoute(record).segIds, ['ac', 'cd']);
  });

  it('breaks a nonstop tie with the official cumulative mileage', () => {
    // 甲→丁 一站直达，没有中间站可判，只能靠里程：100→北线，110→南线。
    const north = withStops(loadRoutes(corridorNetwork()), {
      G1: { trainNo: 'x', asOf: '2025-01-01', stops: ['甲', '丁'], km: { 甲: 0, 丁: 100 } },
    });
    const northRoute = north.resolveRecordRoute(record);
    assert.deepEqual(northRoute.segIds, ['ab', 'bd']);
    assert.equal(northRoute.via.by, 'mileage');

    const south = withStops(loadRoutes(corridorNetwork()), {
      G1: { trainNo: 'x', asOf: '2025-01-01', stops: ['甲', '丁'], km: { 甲: 0, 丁: 110 } },
    });
    const southRoute = south.resolveRecordRoute(record);
    assert.deepEqual(southRoute.segIds, ['ac', 'cd']);
    assert.equal(southRoute.via.by, 'mileage');
    assert.equal(southRoute.via.confidence, 'high');
  });

  it('flags a nonstop without mileage as low confidence', () => {
    const Routes = withStops(loadRoutes(corridorNetwork()), {
      G1: { trainNo: 'x', asOf: '2025-01-01', stops: ['甲', '丁'] },
    });
    const route = Routes.resolveRecordRoute(record);
    assert.deepEqual(route.segIds, ['ab', 'bd']);
    assert.equal(route.via.by, 'shortest');
    assert.equal(route.via.confidence, 'low');
  });

  it('refuses to judge when the record stations are not on the stop list', () => {
    // 车次号跨运行图会被复用：站序里没有 甲/丁 就说明这不是当年那趟车，
    // 必须退回最短路并标记低置信，绝不能拿别的车的经由套用。
    const Routes = withStops(loadRoutes(corridorNetwork()), {
      G1: { trainNo: 'x', asOf: '2025-01-01', stops: ['戊', '己', '庚'] },
    });
    const route = Routes.resolveRecordRoute(record);
    assert.deepEqual(route.segIds, ['ab', 'bd']);
    assert.equal(route.via.by, 'shortest');
    assert.equal(route.via.confidence, 'low');
  });

  it('keeps judging when only an intermediate station is missing from the network', () => {
    // 站序里出现未收录的站（缺线）不该否决整条判定：约束来自认得的站，
    // 未收录的站名要写进 note，作为补线路清单的输入。
    const Routes = withStops(loadRoutes(corridorNetwork()), {
      G1: { trainNo: 'x', asOf: '2025-01-01', stops: ['甲', '乙', '未知站', '丁'] },
    });
    const route = Routes.resolveRecordRoute(record);
    assert.deepEqual(route.segIds, ['ab', 'bd']);
    assert.equal(route.via.by, 'stops');
    assert.match(route.via.note, /未知站/);
  });

  it('slices the record segment out of the whole-train stop list', () => {
    const sandbox = loadRoutes(corridorNetwork());
    const entry = { stops: ['始发', '甲', '丙', '丁', '终到'] };
    const seq = sandbox.TrainRoutes.viaStopSequence;
    assert.deepEqual(seq(entry, '甲', '丁'), ['甲', '丙', '丁']);
    assert.deepEqual(seq(entry, '丁', '甲'), ['丁', '丙', '甲']);
    // 站序里没有的站、以及起终点同站，都判为不可用。
    assert.equal(seq(entry, '甲', '不存在'), null);
    assert.equal(seq(entry, '甲', '甲'), null);
  });

  it('routes a real record onto the corridor its stops belong to', () => {
    // G7726 无锡→南京南 停 昆山南/苏州/无锡/常州/丹阳 —— 全是沪宁城际的站；
    // 京沪高铁在同走廊停的是 苏州北/无锡东/丹阳北/镇江南，站名不同，不能混。
    // 末段借京沪高铁经六摆渡进南京南是真实径路（该车接着转宁安城际），
    // 所以断言的是"不得经过京沪高铁的并行停靠站"，而非"一段都不许上"。
    const sandbox = loadWithStops();
    const lines = sandbox.RAIL_ROUTE_DATA.lines;
    const intercity = lines.find(l => l.name.indexOf('沪宁城际') >= 0
      && l.name.indexOf('联络线') < 0);
    assert.ok(intercity, '产物里应有沪宁城际本线');

    const record = { from: '无锡', to: '南京南', train: 'G7726', date: '2023-10-02' };
    const route = sandbox.TrainRoutes.resolveRecordRoute(record);
    assert.ok(route);
    assert.equal(route.via.by, 'stops');

    const byId = {};
    sandbox.RAIL_ROUTE_DATA.segments.forEach(s => { byId[s.id] = s; });
    const nodeName = {};
    sandbox.RAIL_ROUTE_DATA.nodes.forEach(n => { nodeName[n.id] = n.name; });
    const passed = route.segIds.map(id => nodeName[byId[id].from])
      .concat(nodeName[byId[route.segIds[route.segIds.length - 1]].to]);

    for (const jinghuStop of ['无锡东', '苏州北', '丹阳北', '镇江南']) {
      assert.ok(passed.indexOf(jinghuStop) < 0,
        '沪宁城际的车不该停 ' + jinghuStop + '（京沪高铁站）');
    }
    assert.ok(passed.indexOf('常州') >= 0 && passed.indexOf('丹阳') >= 0,
      '应经过沪宁城际的 常州/丹阳');

    // 网络里程与官方累计里程差应在容差内（官方 311-126=185km）。
    const entry = sandbox.TRAIN_STOPS.trains.G7726;
    const official = entry.km['南京南'] - entry.km['无锡'];
    assert.ok(Math.abs(route.km - official) / official < 0.08,
      '里程偏差过大：网络 ' + route.km + ' vs 官方 ' + official);
  });
});
