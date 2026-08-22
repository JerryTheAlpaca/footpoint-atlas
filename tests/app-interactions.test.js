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
