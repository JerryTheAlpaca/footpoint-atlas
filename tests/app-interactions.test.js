const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function loadApp() {
  const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  const sandbox = { document: undefined };
  const fn = new Function('window', 'globalThis', 'document', code + '\nreturn window;');
  return { window: fn(sandbox, sandbox, undefined), code };
}

function fakeNode() {
  const classes = new Set();
  return {
    classes,
    classList: {
      toggle(name, enabled) {
        if (enabled) classes.add(name);
        else classes.delete(name);
      },
    },
  };
}

describe('timeline playback control', () => {
  it('uses timelinePlaying instead of the removed interval timer', () => {
    const { code } = loadApp();
    assert.doesNotMatch(code, /playTimer|clearInterval\(/);
    assert.match(code, /if \(timelinePlaying\) stopPlay\(\);/);
  });
});

describe('reunion collapse', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');

  it('keeps the reunion details collapsed by default and shows summary counts', () => {
    assert.match(html, /id="reunion-summary"/);
    assert.match(html, /id="reunion-vehicle-summary"/);
    assert.match(html, /id="reunion-train-summary"/);
    assert.match(html, /id="reunion-details" class="reunion-details" hidden/);
    assert.match(html, /class="rank-toggle reunion-toggle"[^>]*aria-expanded="false"/);
    assert.match(html, /id="reunion-details"[\s\S]*?id="reunion-vehicles"/);
    assert.match(html, /id="reunion-details"[\s\S]*?id="reunion-trains"/);
  });

  it('hides reunion details until the block is expanded', () => {
    const { code } = loadApp();
    assert.match(code, /var reunionExpanded = false;/);
    assert.match(code, /details\.hidden = !reunionExpanded/);
    assert.match(css, /\.reunion-details\[hidden\]\s*\{\s*display:\s*none;/);
  });
});

describe('reunion record highlighting', () => {
  it('clears the old group before activating the new group', () => {
    const { window } = loadApp();
    const first = fakeNode();
    const second = fakeNode();
    const third = fakeNode();
    first.classes.add('is-selected');
    window.TrainRecords.syncActiveRecordNodes([first, second, third], [first, second]);
    assert.equal(first.classes.has('is-active'), true);
    assert.equal(second.classes.has('is-active'), true);
    assert.equal(third.classes.has('is-active'), false);
    window.TrainRecords.syncActiveRecordNodes([first, second, third], [third]);
    assert.equal(first.classes.has('is-active'), false);
    assert.equal(first.classes.has('is-selected'), true);
    assert.equal(second.classes.has('is-active'), false);
    assert.equal(third.classes.has('is-active'), true);
  });
});

describe('record context menu', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');

  it('adds a floating menu with edit and delete actions', () => {
    assert.match(html, /id="record-context-menu"/);
    assert.match(html, /data-action="edit"/);
    assert.match(html, /data-action="delete"/);
    assert.match(css, /\.record-context-menu/);
  });

  it('binds right-click on ride records to edit or delete', () => {
    const { code } = loadApp();
    assert.match(code, /list\.addEventListener\('contextmenu'/);
    assert.match(code, /function startEditRecord\(/);
    assert.match(code, /function deleteRideRecord\(/);
    assert.match(code, /TrainSettings\.replaceRecord/);
    assert.match(code, /TrainSettings\.removeRecord/);
  });

  it('opens only the trip form when editing a record', () => {
    const { code } = loadApp();
    assert.match(code, /modal\.classList\.toggle\('is-edit', editing \|\| adding\)/);
    assert.match(code, /title\.textContent = editing \? '编辑行程' : adding \? '添加行程' : '设置'/);
    assert.match(css, /\.settings-modal\.is-edit \.settings-nav\s*\{\s*display:\s*none;/);
  });

  it('escapes untrusted record fields in list, reunion and map tooltip HTML', () => {
    const { window } = loadApp();
    window.TrainStats = { trainTypeOf: () => 'emu' };
    const evil = '<img src=x onerror=alert(1)>';
    const item = window.TrainRecords.recordItemHtml(
      {
        rec: {
          date: '2026-08-26',
          from: evil,
          to: '汉口',
          train: evil,
          vehicle: evil,
          bureau: evil,
        },
        index: 0,
      },
      []
    );
    const reunion = window.TrainRecords.reunionItemHtml('train', 0, evil, 2, false, [evil]);
    const tooltip = window.TrainMap.lineTooltip({
      data: { from: evil, to: '汉口', count: 1, records: [{ date: '2026-08-26', train: evil, vehicle: evil, bureau: evil }] },
    });
    for (const html of [item, reunion, tooltip]) {
      assert.doesNotMatch(html, /<img\b/i);
      assert.match(html, /&lt;img/);
    }
  });

  it('uses the server version and refuses stale saves', () => {
    const { code } = loadApp();
    assert.match(code, /baseVersion: trainDataVersion/);
    assert.match(code, /result\.conflict \|\| result\.serverError/);
    assert.match(code, /loadServerData\(\)\.then/);
    assert.match(code, /并写入 js\/data\.js 和 Excel/);
  });
});

describe('trip form Enter key', () => {
  it('advances focus on Enter and only submits from the filled last field', () => {
    const { code } = loadApp();
    assert.match(code, /trip-form'\)\.addEventListener\('keydown', handleTripFormKeydown\)/);
    assert.match(code, /event\.isComposing\) return;/);
    assert.match(code, /var inputs = tripFormInputs\(\);/);
    assert.match(code, /event\.preventDefault\(\);/);
    assert.match(code, /if \(index < inputs\.length - 1\)/);
    assert.match(code, /if \(!input\.value\.trim\(\)\) return;/);
    assert.match(code, /form\.requestSubmit/);
  });
});

describe('annual review train summary', () => {
  it('formats one and tied top train entries', () => {
    const { window, code } = loadApp();
    assert.match(code, /topEntries\(yearStats\.trains\)/);
    assert.equal(window.TrainReview.formatTopTrainSummary([['G1', 3]]), '最常车次 G1 · 3 次');
    assert.equal(
      window.TrainReview.formatTopTrainSummary([
        ['G1', 3],
        ['D2', 3],
      ]),
      '最常车次 G1、D2 · 各 3 次'
    );
    assert.equal(window.TrainReview.formatTopTrainSummary([]), '');
  });
});
