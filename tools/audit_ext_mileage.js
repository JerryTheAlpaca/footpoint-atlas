// 用第三方线路里程表（CRTransfer rts.json，791 条线逐站累计里程）核对区段里程。
// 只取"在官方表里就是相邻两站"的站对，官方本段 = 后站累计 − 前站累计。
// 里程量化到整数 km，所以只适合量 ≥8km 的区段；短段用它判是噪声。
// 用法：node tools/audit_ext_mileage.js [产物路径] [--show N]
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const argv = process.argv.slice(2);
const positional = argv.filter(a => !a.startsWith('-'));
const ART = positional[0] || 'js/rail-route-data.js';
const showArg = argv.find(a => /^--show=\d+$/.test(a));
const SHOW = showArg ? +showArg.split('=')[1] : 20;

function load(sandbox, file) {
  new Function('window', 'globalThis', fs.readFileSync(path.join(ROOT, file), 'utf8'))(sandbox, sandbox);
}
const s = {};
load(s, 'js/data.js');
load(s, ART);
const norm = n => String(n).replace(/[^\u4e00-\u9fff]/g, '').replace(/(.)站$/, '$1');

const rts = JSON.parse(fs.readFileSync(path.join(ROOT, 'build-cache/ext/rts.json'), 'utf-8'));
const legs = {};                     // "a|b" → 官方本段 km（含来源线名）
for (const line of rts.l) {
  const st = line.s || [];
  if (line.n === '线路名') continue;
  for (let i = 1; i < st.length; i++) {
    const a = norm(st[i - 1].n), b = norm(st[i].n);
    const d = st[i].d - st[i - 1].d;
    if (!a || !b || !isFinite(d) || d < 0) continue;
    const k = [a, b].sort().join('|');
    if (!(k in legs) || Math.abs(legs[k].km - d) > Math.abs(d - legs[k].km)) legs[k] = { km: d, line: line.n };
  }
}

const nameOf = {}, lineName = {};
s.RAIL_ROUTE_DATA.nodes.forEach(n => { nameOf[n.id] = n.name; });
s.RAIL_ROUTE_DATA.lines.forEach(l => { lineName[l.id] = l.name; });

const rows = [];
for (const seg of s.RAIL_ROUTE_DATA.segments) {
  const a = norm(nameOf[seg.from]), b = norm(nameOf[seg.to]);
  const hit = legs[[a, b].sort().join('|')];
  if (!hit || seg.estLengthKm < 8 || hit.km < 8) continue;
  rows.push({
    seg: a + '—' + b, id: seg.id, ext: hit.km, net: seg.estLengthKm,
    d: +(seg.estLengthKm - hit.km).toFixed(2),
    ratio: +(seg.estLengthKm / hit.km).toFixed(3),
    lines: (seg.lineIds || []).map(i => lineName[i]).join('+'),
  });
}
rows.sort((x, y) => Math.abs(y.d) - Math.abs(x.d));
const absSum = rows.reduce((a, r) => a + Math.abs(r.d), 0);
const signed = rows.reduce((a, r) => a + r.d, 0);
const ratios = rows.map(r => r.ratio).sort((a, b) => a - b);
console.log(`匹配到官方相邻站对 ${rows.length} 段（≥8km）：|Δ| 合计 ${absSum.toFixed(1)}km，`
  + `平均 Δ ${(signed / rows.length).toFixed(2)}km，中位比值 ${ratios[Math.floor(ratios.length / 2)]}`);
console.log(`Δ>3km 的 ${rows.filter(r => Math.abs(r.d) > 3).length} 段，Δ>10km 的 ${rows.filter(r => Math.abs(r.d) > 10).length} 段`);
console.log('区段                   官方  网络     Δ    比值  线路');
for (const r of rows.slice(0, SHOW)) {
  console.log(`  ${r.seg.padEnd(22)} ${String(r.ext).padStart(4)} ${String(r.net).padStart(7)} `
    + `${String((r.d > 0 ? '+' : '') + r.d).padStart(7)} ${String(r.ratio).padStart(6)}  ${r.lines}`);
}
fs.writeFileSync(path.join(ROOT, 'build-cache/ext-mileage-' + path.basename(ART) + '.json'),
  JSON.stringify({ rows, summary: { n: rows.length, absSum: +absSum.toFixed(1),
    meanD: +(signed / rows.length).toFixed(3),
    medianRatio: ratios[Math.floor(ratios.length / 2)] } }, null, 1));
