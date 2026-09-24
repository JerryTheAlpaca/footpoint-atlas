// 经由判定 A/B 诊断：同一批记录分别用"旧的纯最短路"与"新的经由判定"解析，
// 逐条对比 segIds。用法：node tools/diag_via.js
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function loadScript(sandbox, file) {
  const code = fs.readFileSync(path.join(ROOT, 'js', file), 'utf8');
  new Function('window', 'globalThis', code)(sandbox, sandbox);
}

// A：不加载 train-stops.js，resolveVia 拿不到站序，等价于改造前的行为。
const legacy = {};
loadScript(legacy, 'data.js');
loadScript(legacy, 'rail-route-data.js');
loadScript(legacy, 'rail-routes.js');

// B：完整加载，走经由判定。
const now = {};
loadScript(now, 'data.js');
loadScript(now, 'rail-route-data.js');
loadScript(now, 'train-stops.js');
loadScript(now, 'rail-routes.js');

const records = now.TRAIN_DATA.records;
const linesById = {};
now.RAIL_ROUTE_DATA.lines.forEach(l => { linesById[l.id] = l.name; });
const segById = {};
now.RAIL_ROUTE_DATA.segments.forEach(s => { segById[s.id] = s; });
const nameOf = segIds => [...new Set(segIds.flatMap(id => segById[id].lineIds || []))]
  .map(id => linesById[id] || id).join(' + ');

const diag = now.TrainRoutes.viaDiagnostics(records);
let same = 0, diff = 0, unresolved = 0;
const out = [];
for (let i = 0; i < records.length; i++) {
  const r = records[i];
  const a = legacy.TrainRoutes.resolveRecordRoute(r);
  const b = now.TrainRoutes.resolveRecordRoute(r);
  const d = diag[i];
  const tag = `${r.date} ${r.train} ${r.from}→${r.to}`;
  if (!b) { out.push(`不通  ${tag}`); unresolved++; continue; }
  const aIds = a ? a.segIds.join('>') : '(无)';
  const bIds = b.segIds.join('>');
  const via = b.via || {};
  const flag = via.confidence === 'low' ? '低置信' : '  ok  ';
  if (aIds === bIds) {
    same++;
    out.push(`${flag} ${tag}  [${via.by}] 与旧解一致 ${b.km}km${via.note ? ' · ' + via.note : ''}`);
  } else {
    diff++;
    out.push(`★改动 ${tag}  [${via.by}] ${b.km}km${via.note ? ' · ' + via.note : ''}`);
    out.push(`      旧: ${a ? a.km + 'km ' : ''}[${a ? nameOf(a.segIds) : '无'}]`);
    out.push(`      新: [${nameOf(b.segIds)}]`);
  }
  if (d && d.by === 'shortest' && d.note) out.push(`      判定退回原因: ${d.note}`);
}

// 缺线清单：站序里出现、但网络里不存在的站名，按频次排序。
// 这是补线路/补节点的直接输入，不用靠猜。
const missing = {};
records.forEach(r => {
  const entry = now.TRAIN_STOPS && now.TRAIN_STOPS.trains[r.train];
  if (!entry) return;
  const seq = now.TrainRoutes.viaStopSequence(entry, r.from, r.to);
  if (!seq) return;
  seq.forEach(s => {
    if (!now.TrainRoutes.nodeByName(s)) missing[s] = (missing[s] || 0) + 1;
  });
});
out.push('');
out.push(`=== 汇总 ===  与旧解一致 ${same} 条 / 有改动 ${diff} 条 / 不可达 ${unresolved} 条`);
const byKind = {};
diag.forEach(d => { byKind[d.by] = (byKind[d.by] || 0) + 1; });
out.push('判定方式分布: ' + Object.entries(byKind).map(([k, v]) => `${k}=${v}`).join('  '));
out.push('低置信: ' + diag.filter(d => d.confidence === 'low').length + ' 条');
const missingList = Object.entries(missing).sort((a, b) => b[1] - a[1]);
out.push('');
out.push('=== 缺线清单（站序里有、网络里没有的站）===');
out.push(missingList.length
  ? missingList.map(([s, n]) => `${s}×${n}`).join('  ')
  : '无');
fs.writeFileSync(path.join(__dirname, '..', 'build-cache', '_diag_via.txt'),
  out.join('\n'), 'utf8');
console.log(out.join('\n'));
