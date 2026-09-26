// 公开面纪律：提交进仓库的前端文件里，不许出现"用户没坐过的那趟车"的车次号。
//
// 背景：路路通/12306 的经由数据可以当证据用，但站点 atlas.jerrythealpaca.cn 是
// 公开的、且部署不跑生成脚本（产物必须先提交）。所以：
//   1) 线路的**有序站序列**（第三方库的编辑性内容）不进产物；
//   2) 借复车次别名查到的证据，只按用户输入的那个车次落地，别号原文不进产物；
//   3) 逐站 station_train_code 这类字段一旦上界面就会暴露"另一个车次号"，不渲染。
// 本测试把这三条钉死，违例即红。
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const TRAIN_RE = /\b([GDCZTKLYS]\d{1,4})\b/g;

function sliceObject(text, from) {
  // 从 from 起做括号配对（跳过字符串内的括号），取到对象本体；
  // 文件末尾还有 IIFE 的 };root.X=X;}) —— 用 lastIndexOf('}') 会取到那里。
  let depth = 0, inStr = false, esc = false;
  for (let i = from; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === '{') depth += 1;
    else if (c === '}') {
      depth -= 1;
      if (depth === 0) return text.slice(from, i + 1);
    }
  }
  throw new Error('对象括号不配对');
}

function readObj(file, marker) {
  const text = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const start = text.indexOf('{', text.indexOf(marker));
  assert.ok(start >= 0, `${file} 里找不到 ${marker}`);
  return JSON.parse(sliceObject(text, start));
}

const data = readObj('js/data.js', 'window.TRAIN_DATA');
const stops = readObj('js/train-stops.js', 'var TRAIN_STOPS');

// 允许出现的车次号：我们记录里的车次 + 每条记录自己那条 12306 记录里的号。
function codeInsideTrainNo(trainNo) {
  if (typeof trainNo !== 'string' || trainNo.length < 10) return null;
  return trainNo.slice(5, 10).replace(/^0+/, '') || null;
}

const allowed = new Set(Object.keys(data.records.reduce((m, r) => (m[r.train] = 1, m), {})));
for (const [code, entry] of Object.entries(stops.trains || {})) {
  allowed.add(code);
  const inner = codeInsideTrainNo(entry.trainNo);
  if (inner) allowed.add(inner);
}

function publicFiles() {
  const out = [];
  for (const f of fs.readdirSync(path.join(ROOT, 'js'))) {
    if (f.endsWith('.js')) out.push('js/' + f);
  }
  out.push('index.html');
  return out;
}

test('公开前端文件里不出现外来车次号', () => {
  const offenders = [];
  for (const file of publicFiles()) {
    const text = fs.readFileSync(path.join(ROOT, file), 'utf8');
    for (const m of text.matchAll(TRAIN_RE)) {
      if (!allowed.has(m[1])) offenders.push(`${file}: ${m[0]}`);
    }
  }
  assert.deepEqual(offenders, [],
    '这些车次号不属于任何一条乘车记录，不该出现在提交的前端文件里：\n  ' +
    offenders.slice(0, 20).join('\n  '));
});

test('产物不含线路的有序站序列（只含几何自证的区段端点）', () => {
  const rr = readObj('js/rail-route-data.js', 'var RAIL_ROUTE_DATA');
  // lines[].stops 必须由区段端点反推：每条线的 stops 不得多于它自己区段端点集合。
  const endpoints = {};
  for (const seg of rr.segments) {
    for (const lid of seg.lineIds) {
      (endpoints[lid] = endpoints[lid] || new Set()).add(seg.from);
      (endpoints[lid] = endpoints[lid] || new Set()).add(seg.to);
    }
  }
  for (const line of rr.lines) {
    const own = endpoints[line.id] || new Set();
    for (const nid of line.stops || []) {
      assert.ok(own.has(nid),
        `线路 ${line.name} 的 stops 里有 ${nid}，但没有任何本线区段以它为端点：` +
        '说明站序被照抄进了产物，而不是几何自证');
    }
  }
});

test('逐站车次号字段不进任何提交产物', () => {
  for (const file of publicFiles()) {
    const text = fs.readFileSync(path.join(ROOT, file), 'utf8');
    assert.ok(!/station_train_code/.test(text),
      `${file} 出现了 station_train_code：复车次列车这一列会在换线站变成另一个号`);
  }
});
