const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function loadSettings() {
  const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'settings.js'), 'utf8');
  const sandbox = {};
  const fn = new Function('window', 'globalThis', code + '\nreturn window.TrainSettings;');
  return fn(sandbox, sandbox);
}

const settingsCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'settings.js'), 'utf8');
const settings = loadSettings();
const appCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');

function sliceFunction(name, nextName) {
  const start = appCode.indexOf('  function ' + name);
  const end = appCode.indexOf('  function ' + nextName);
  assert.ok(start > 0 && end > start, name + ' 没按预期排在 ' + nextName + ' 前面');
  return appCode.slice(start, end);
}

function loadLookupNoteLogic() {
  return new Function(sliceFunction('tripLookupNote', 'setLookupNote') + '\nreturn tripLookupNote;')();
}

function makeStatusEl() {
  return {
    textContent: '',
    className: 'trip-status',
    attrs: {},
    getAttribute(name) {
      return Object.prototype.hasOwnProperty.call(this.attrs, name) ? this.attrs[name] : null;
    },
    setAttribute(name, v) { this.attrs[name] = String(v); },
    removeAttribute(name) { delete this.attrs[name]; },
  };
}

function loadSetLookupNote() {
  const el = makeStatusEl();
  const document = { getElementById: (id) => (id === 'trip-form-status' ? el : null) };
  const body = sliceFunction('setLookupNote', 'applyTripLookup');
  const fn = new Function('document', body + '\nreturn setLookupNote;')(document);
  fn.element = el;
  return fn;
}

describe('车号查询的客户端判据', () => {
  it('走服务端代理，不在前端直连上游', () => {
    assert.equal(settings.EMU_API, '/api/emu-unit');
    assert.doesNotMatch(appCode, /https?:\/\/api\.rail\.re/);
    assert.doesNotMatch(appCode, /https?:\/\/kyfw\.12306\.cn/);
    assert.doesNotMatch(appCode, /https?:\/\/data\.railgo\.zenglingkun\.cn/);
    assert.match(appCode, /window\.TrainSettings\.EMU_API \+ query/);
  });

  it('写法像车次才发查询，纯数字与乱写法静默', () => {
    for (const text of ['D2294', 'G1970', ' g1737次 ', 'K146', 'Z45次', 'S1', 'G1737/736', 'K1352/3']) {
      assert.equal(settings.isQueryableTrain(text), true, text);
    }
    for (const text of ['1737', '', 'G', '动车', 'G1737/G1736/', 'G1737/736/735/734/733']) {
      assert.equal(settings.isQueryableTrain(text), false, text);
    }
    assert.match(appCode, /window\.TrainSettings\.isQueryableTrain\(train\)/);
  });

  it('车号算不算动车组由服务端判，前端不复制正则', () => {
    assert.doesNotMatch(appCode, /isEmuTrain/);
    assert.doesNotMatch(settingsCode, /\[GDC\]/);
  });

  it('复车次写法整串放过，拆号交给服务端', () => {
    assert.equal(settings.isQueryableTrain('G1737/736'), true);
    assert.equal(settings.isQueryableTrain('G1737/G1736'), true);
    assert.equal(settings.isQueryableTrain('G1737/736/735/734/733'), false);
    assert.equal(settings.isQueryableTrain('G1737/G1736/'), false);
  });
});

describe('自动填充只填空着或自己填过的框', () => {
  it('用手打内容当界标，覆盖前先比对', () => {
    assert.match(appCode, /function autoFillAllowed\(input\)/);
    assert.match(appCode, /var auto = input\.getAttribute\('data-emu-auto'\) \|\| '';/);
    assert.match(appCode, /return !input\.value\.trim\(\) \|\| auto === input\.value;/);
    assert.match(appCode, /if \(!input \|\| !autoFillAllowed\(input\)\) return;/);
    assert.match(appCode, /if \(!anyAutoFillAllowed\(\)\) return;/);
  });

  it('车号、车次始发、车次终到各归一个框，担当路局不自动填', () => {
    assert.match(
      appCode,
      /var AUTO_FILL_FIELDS = \['trip-vehicle', 'trip-origin', 'trip-terminal'\];/
    );
    assert.doesNotMatch(appCode, /writeAutoField\('trip-bureau'/);
  });

  it('编辑老记录不自动改它，清空自动填过的框才视为要重查', () => {
    assert.match(appCode, /if \(editingRecord && !force\) return;/);
    assert.match(appCode, /if \(!box\.value\.trim\(\)\) scheduleVehicleLookup\(true\);/);
  });

  it('慢响应不能盖掉后来的输入', () => {
    assert.match(appCode, /var token = emuLookupToken;/);
    assert.match(appCode, /if \(token === emuLookupToken\) applyTripLookup\(result\);/);
  });

  it('换车次后查不到就把自己填过的值清掉，不留上一个号的旧数据', () => {
    const fill = appCode.slice(
      appCode.indexOf('function applyTripLookup'),
      appCode.indexOf('function requestVehicleLookup')
    );
    assert.ok(fill.length > 0);
    assert.match(fill, /writeAutoField\('trip-vehicle', result\.matched \? result\.value : ''\);/);
    assert.match(fill, /writeAutoField\('trip-origin', trip\.matched \? trip\.origin : ''\);/);
    assert.match(fill, /writeAutoField\('trip-terminal', trip\.matched \? trip\.terminal : ''\);/);
    // 上游不通是"不知道"，不是"没有"，那种情况不清
    assert.match(fill, /if \(result\.reason !== 'upstream'\)/);
    assert.match(fill, /if \(trip\.reason !== 'upstream'\)/);
  });

  it('写回和清空都同步挪走"自己填过"的标记', () => {
    const write = appCode.slice(
      appCode.indexOf('function writeAutoField'),
      appCode.indexOf('function anyAutoFillAllowed')
    );
    assert.match(write, /input\.value = text;/);
    assert.match(write, /input\.setAttribute\('data-emu-auto', text\);/);
    assert.match(write, /input\.removeAttribute\('data-emu-auto'\);/);
  });

  it('查不到就在状态行写明白，都查到了不吭声', () => {
    const note = loadLookupNoteLogic();
    const both = { matched: true, value: 'CR400AF-2050', reason: null, trip: { matched: true, origin: '上海虹桥', terminal: '兰州西', reason: null } };
    assert.equal(note(both, 'G1970'), '');

    const neither = { matched: false, value: null, reason: 'no_log', trip: { matched: false, reason: 'no_train' } };
    assert.equal(note(neither, 'G0000'), '没查到 G0000：12306 和车组记录里都没有');

    const conv = { matched: false, value: null, reason: 'not_emu', trip: { matched: true, reason: null } };
    assert.equal(note(conv, 'K146'), '普速车次没有车组记录，只填了始发和终到');

    const stale = { matched: false, value: null, reason: 'outside_window', trip: { matched: true, reason: null } };
    assert.match(note(stale, 'G176'), /只留最近约 30 天/);

    const noTrip = { matched: true, value: 'CR400AF-2050', reason: null, trip: { matched: false, reason: 'no_train' } };
    assert.equal(note(noTrip, 'G1970'), '没查到这趟车在 12306 的这天，始发和终到手写');

    // 12306 只回最近两天：老日期要说"它不给了"，不能报成"没这个车次"
    const past = { matched: true, value: 'CR400AF-2050', reason: null, trip: { matched: false, reason: 'past' } };
    assert.match(note(past, 'G1970'), /已经不给了/);
    assert.doesNotMatch(note(past, 'G1970'), /没查到/);
    const pastBoth = { matched: false, value: null, reason: 'no_log', trip: { matched: false, reason: 'past' } };
    assert.match(note(pastBoth, 'G1970'), /已经不给了/);

    // 网络不通不能写成"没查到"，那是两回事
    const down = { matched: false, value: null, reason: 'upstream', trip: { matched: false, reason: 'upstream' } };
    assert.doesNotMatch(note(down, 'G1970'), /没查到/);
    assert.match(note(down, 'G1970'), /没连上/);
  });

  it('状态行只改自己写过的话，不抢校验和保存结果', () => {
    const setNote = loadSetLookupNote();
    const el = setNote.element;
    setNote('没查到 G0000：时刻表和车组记录里都没有');
    assert.equal(el.textContent, '没查到 G0000：时刻表和车组记录里都没有');
    assert.equal(el.className, 'trip-status');

    // 别人（校验/保存）占了这一行，提示不许盖
    el.textContent = '请填写有效日期';
    el.removeAttribute('data-lookup-note');
    setNote('没查到 K146');
    assert.equal(el.textContent, '请填写有效日期');

    // 自己写过的可以被下一句替换或清空
    el.textContent = '没查到 K146';
    el.setAttribute('data-lookup-note', '没查到 K146');
    setNote('');
    assert.equal(el.textContent, '');
  });

  it('换车次先撤掉上一句提示，写完提示和填框是同一次', () => {
    const apply = appCode.slice(
      appCode.indexOf('function applyTripLookup'),
      appCode.indexOf('function requestVehicleLookup')
    );
    assert.match(apply, /setLookupNote\(tripLookupNote\(result, document\.getElementById\('trip-train'\)\.value\.trim\(\)\)\);/);
    const schedule = appCode.slice(
      appCode.indexOf('function scheduleVehicleLookup'),
      appCode.indexOf('function resetTripForm')
    );
    assert.match(schedule, /emuLookupKey = key;\s*setLookupNote\(''\);\s*requestVehicleLookup\(\);/);
  });
});
