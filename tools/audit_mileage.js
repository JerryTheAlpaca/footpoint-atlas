// 里程体检：沿每条记录**自己解出的区段链**逐站累加网络里程，与时刻表官方
// 逐站里程对账。总里程会把"这里少算"和"那里多绕"抵消，逐站才看得出是从哪
// 一段开始歪；而重新解析任意站对得到的往往是另一条径路，不能用来量本段。
// 用法：node tools/audit_mileage.js [产物路径] [--all]
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const argv = process.argv.slice(2);
const ART = (argv.find(a => !a.startsWith('--'))) || 'js/rail-route-data.js';
const SHOW_ALL = argv.includes('--all');

function load(sandbox, file) {
  new Function('window', 'globalThis', fs.readFileSync(path.join(ROOT, file), 'utf8'))(sandbox, sandbox);
}
const s = {};
load(s, 'js/data.js');
load(s, ART);
load(s, 'js/train-stops.js');
load(s, 'js/rail-routes.js');

const segOf = {}, nameOf = {}, lineName = {};
s.RAIL_ROUTE_DATA.segments.forEach(x => { segOf[x.id] = x; });
s.RAIL_ROUTE_DATA.nodes.forEach(n => { nameOf[n.id] = n.name; });
s.RAIL_ROUTE_DATA.lines.forEach(l => { lineName[l.id] = l.name; });
const trains = s.TRAIN_STOPS.trains;

// 时刻表站名与网络节点名可能差"站"字与更名，按 build 的规范化对齐
const norm = n => String(n).replace(/[^\u4e00-\u9fff]/g, '')
  .replace(/(.)站$/, '$1');
const alias = { '松江南': '上海松江', '戈江': '弋江' };

const rows = [];
for (const rec of s.TRAIN_DATA.records) {
  const entry = trains[rec.train];
  if (!entry || !entry.km) continue;
  const kmOff = {};
  Object.keys(entry.km).forEach(k => { kmOff[norm(k)] = entry.km[k]; });
  const route = s.TrainRoutes.resolveRecordRoute(rec);
  if (!route) continue;
  // 沿区段链累加：区段的 from/to 是按建网方向固定的，列车可能反着骑，
  // 所以"下一站"要用上一个节点去配，不能一律取 seg.to。
  let cum = 0, prev = null;
  const cumAt = {};
  route.segIds.forEach((id, i) => {
    const seg = segOf[id];
    if (!seg) return;
    const next = prev === null ? seg.from
      : (seg.from === prev ? seg.to : seg.from);
    cum += seg.estLengthKm;
    cumAt[norm(nameOf[next])] = +cum.toFixed(2);
    if (i === 0) cumAt[norm(nameOf[seg.from])] = 0;
    prev = next;
  });
  const base = kmOff[norm(rec.from)];
  if (base == null) {
    rows.push({ train: rec.train, stop: rec.from, err: '时刻表里不从这个站载客' });
    continue;
  }
  // 时刻表可能是反着排的（同一车次号往返共用一张表）：拿本记录终点判朝向，
  // 官方里程比起点小就是反向，累计要按 base − km[X] 算。
  const dest = rec.to ? norm(rec.to) : null;
  const flip = !!(dest && kmOff[dest] != null && kmOff[dest] < base);
  Object.keys(cumAt).forEach(n => {
    if (kmOff[n] == null) return;
    const off = flip ? base - kmOff[n] : kmOff[n] - base;
    if (off < 0) return;
    rows.push({ train: rec.train, from: rec.from, direction: flip ? 'reverse' : 'same',
      stop: nameOf[s.RAIL_ROUTE_DATA.nodes.find(x => norm(x.name) === n).id],
      cumNet: cumAt[n], cumOff: +off.toFixed(2),
      leg: +(cumAt[n] - off).toFixed(2), err: null });
  });
}

const measured = rows.filter(r => !r.err);
const bad = measured.filter(r => Math.abs(r.leg) > 3)
  .sort((a, b) => Math.abs(b.leg) - Math.abs(a.leg));
console.log(`记录 ${s.TRAIN_DATA.records.length} 条里可比对账点 ${measured.length} 个`
  + `（时刻表不匹配 ${rows.length - measured.length}），累计漂移 >3km 的 ${bad.length} 个`);
if (SHOW_ALL) {
  console.log('车次     到站         官方累计   网络累计     Δ');
  for (const r of bad.slice(0, 60)) {
    console.log(`${r.train.padEnd(9)} ${String(r.stop).padEnd(11)} `
      + `${String(r.cumOff).padStart(9)} ${String(r.cumNet).padStart(10)} `
      + `${String((r.leg > 0 ? '+' : '') + r.leg).padStart(9)}`);
  }
}
// 单调化：找每个车次"开始掉队"的那一站（前一段还对得上，这一站突然偏）
const perTrain = {};
measured.forEach(r => { (perTrain[r.train] = perTrain[r.train] || []).push(r); });
console.log('\n== 每趟车的偏差走向（首次越界的那一段是重点）==');
for (const [t, list] of Object.entries(perTrain)) {
  list.sort((a, b) => a.cumOff - b.cumOff);
  let prev = 0, jump = null;
  for (const r of list) {
    if (Math.abs(r.leg - prev) > 3 && !jump) jump = r;
    prev = r.leg;
  }
  const last = list[list.length - 1];
  if (!last) continue;
  console.log(`  ${t.padEnd(9)} 到 ${String(last.stop).padEnd(10)} 官方 ${String(last.cumOff).padStart(5)}km `
    + `网络 ${last.cumNet.toFixed(1)}km  末累计 Δ${last.leg > 0 ? '+' : ''}${last.leg}`
    + (jump ? `   首越界@${jump.stop} Δ${jump.leg}` : ''));
}
// 汇总指标：全部对账点的 |累计漂移| 之和与最大值，用来比两版产物谁更贴时刻表
const sumAbs = measured.reduce((a, r) => a + Math.abs(r.leg), 0);
const maxAbs = measured.reduce((a, r) => Math.max(a, Math.abs(r.leg)), 0);
console.log(`\n== 汇总：|累计漂移| 合计 ${sumAbs.toFixed(1)}km，`
  + `单点最大 ${maxAbs.toFixed(1)}km，中位数 `
  + `${measured.map(r => Math.abs(r.leg)).sort((a, b) => a - b)[Math.floor(measured.length / 2)].toFixed(2)}km ==`);
fs.writeFileSync(path.join(ROOT, 'build-cache/mileage-audit.json'),
  JSON.stringify({ rows, summary: { sumAbs: +sumAbs.toFixed(1), maxAbs: +maxAbs.toFixed(1),
    points: measured.length } }, null, 1));
console.log('已写出 build-cache/mileage-audit.json');
