// 产物回归验收：同一批记录，分别用"改造前的产物 + 改造前的解析逻辑"与
// "新产物 + 新经由判定"解析，逐条对比。用法：node tools/diag_artifact_diff.js
// 基线产物：build-cache/rail-route-data.before-xunyang.js（已提交、用户核对过）
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const BASELINE = path.join(ROOT, 'build-cache', 'rail-route-data.before-xunyang.js');

function loadScript(sandbox, file) {
  const code = fs.readFileSync(path.join(ROOT, 'js', file), 'utf8');
  new Function('window', 'globalThis', code)(sandbox, sandbox);
}
function loadScriptAt(sandbox, absPath, varName) {
  const code = fs.readFileSync(absPath, 'utf8');
  new Function('window', 'globalThis', code)(sandbox, sandbox);
}

// A：基线产物 + 不加载站序 = 完全等同改造前的行为。
const A = {};
loadScript(A, 'data.js');
loadScriptAt(A, BASELINE);
loadScript(A, 'rail-routes.js');

// B：新产物 + 站序 = 改造后的行为。
const B = {};
loadScript(B, 'data.js');
loadScript(B, 'rail-route-data.js');
loadScript(B, 'train-stops.js');
loadScript(B, 'rail-routes.js');

function index(sb) {
  const seg = {}, node = {}, line = {};
  sb.RAIL_ROUTE_DATA.segments.forEach(s => { seg[s.id] = s; });
  sb.RAIL_ROUTE_DATA.nodes.forEach(n => { node[n.id] = n.name; });
  sb.RAIL_ROUTE_DATA.lines.forEach(l => { line[l.id] = l.name; });
  return { seg, node, line };
}
const ia = index(A), ib = index(B);
const names = (ix, segIds) => [...new Set(segIds.flatMap(id => (ix.seg[id].lineIds || [])))]
  .map(id => ix.line[id] || id).join(' + ');

const records = B.TRAIN_DATA.records;
const out = [];
let same = 0, diff = 0;
for (const r of records) {
  const a = A.TrainRoutes.resolveRecordRoute(r);
  const b = B.TrainRoutes.resolveRecordRoute(r);
  const tag = `${r.date} ${r.train} ${r.from}→${r.to}`;
  if (!a && !b) { out.push(`=  ${tag}  两边都不通`); same++; continue; }
  if (!a || !b) { out.push(`★  ${tag}  一边不通（旧${a ? '通' : '不通'}/新${b ? '通' : '不通'}）`); diff++; continue; }
  if (a.segIds.join('>') === b.segIds.join('>')) { same++; out.push(`=  ${tag}  ${b.km}km [${b.via.by}]`); continue; }
  diff++;
  out.push(`★  ${tag}  旧 ${a.km}km → 新 ${b.km}km [${b.via.by}]${b.via.note ? ' · ' + b.via.note : ''}`);
  out.push(`     旧线路: ${names(ia, a.segIds)}`);
  out.push(`     新线路: ${names(ib, b.segIds)}`);
  const sa = new Set(a.segIds), sbSet = new Set(b.segIds);
  const added = [...sbSet].filter(x => !sa.has(x));
  const removed = [...sa].filter(x => !sbSet.has(x));
  if (added.length) out.push(`     新增区段: ${added.map(x => `${ib.node[ib.seg[x].from]}-${ib.node[ib.seg[x].to]}(${ib.seg[x].estLengthKm}km)`).join(', ')}`);
  if (removed.length) out.push(`     移除区段: ${removed.map(x => `${ia.node[ia.seg[x].from]}-${ia.node[ia.seg[x].to]}(${ia.seg[x].estLengthKm}km)`).join(', ')}`);
}
out.push('');
out.push(`=== 产物回归验收 ===  与基线一致 ${same} 条 / 有差异 ${diff} 条（共 ${records.length} 条）`);
out.push(`基线：${path.basename(BASELINE)}  ${ia.seg && Object.keys(ia.seg).length} 区段`);
out.push(`新产物：rail-route-data.js  ${Object.keys(ib.seg).length} 区段 / ${Object.keys(ib.node).length} 节点`);
fs.writeFileSync(path.join(ROOT, 'build-cache', '_artifact_diff.txt'), out.join('\n'), 'utf8');
console.log('written');
