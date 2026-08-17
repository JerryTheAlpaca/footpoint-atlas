const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function cssBlock(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(escaped + '\\s*\\{([\\s\\S]*?)\\}'));
  assert.ok(match, 'missing CSS rule for ' + selector);
  return match[1];
}

function hasDecl(block, property, value) {
  const re = new RegExp('(?:^|\\n)\\s*' + property + '\\s*:\\s*' + value + '\\s*;');
  return re.test(block);
}

function loadTrainRecords() {
  const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  const sandbox = { document: undefined };
  const fn = new Function('window', 'globalThis', 'document', code + '\nreturn window.TrainRecords;');
  return fn(sandbox, sandbox, undefined);
}

describe('map vs playback timeline stacking', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');

  it('clips the map chart so ECharts canvases cannot paint over the timeline', () => {
    const block = cssBlock(css, '.map-chart');
    assert.equal(hasDecl(block, 'overflow', 'hidden'), true);
    assert.equal(hasDecl(block, 'min-height', '0'), true);
  });

  it('keeps the playback bar in a higher stacking layer than the map canvas', () => {
    const mapBlock = cssBlock(css, '.map-chart');
    const timelineBlock = cssBlock(css, '.timeline');
    assert.equal(hasDecl(mapBlock, 'position', 'relative'), true);
    assert.equal(hasDecl(mapBlock, 'z-index', '0'), true);
    assert.equal(hasDecl(timelineBlock, 'position', 'relative'), true);
    assert.equal(hasDecl(timelineBlock, 'z-index', '1'), true);
  });
});

describe('ride records in the right sidebar', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');

  it('places the record panel inside the side panel, not below the map', () => {
    const sideStart = html.indexOf('<aside class="side-panel">');
    const sideEnd = html.indexOf('</aside>');
    const recordStart = html.indexOf('<section class="record-panel">');
    assert.ok(sideStart !== -1 && sideEnd !== -1 && recordStart !== -1);
    assert.ok(recordStart > sideStart && recordStart < sideEnd);
    assert.equal(/<\/main>\s*<section class="record-panel">/.test(html), false);
  });

  it('gives the map the remaining page height without a bottom record row', () => {
    const block = cssBlock(css, '.app');
    assert.equal(hasDecl(block, 'grid-template-rows', 'auto minmax\\(0, 1fr\\)'), true);
    assert.equal(hasDecl(block, 'grid-template-rows', 'auto minmax\\(0, 1fr\\) auto'), false);
  });

  it('lays out ride records in 3 columns filling downward', () => {
    const block = cssBlock(css, '.record-list');
    assert.equal(hasDecl(block, 'grid-template-columns', 'repeat\\(3, minmax\\(0, 1fr\\)\\)'), true);
    assert.equal(/grid-auto-flow\s*:\s*column/.test(block), false);
    assert.equal(/grid-template-rows\s*:\s*repeat\(3/.test(block), false);
  });

  it('shows newest records first while keeping playback indices', () => {
    const { recordsForDisplay } = loadTrainRecords();
    const records = [{ date: '2024-01-01' }, { date: '2025-06-01' }, { date: '2026-08-01' }];
    assert.deepEqual(
      recordsForDisplay(records).map(function (item) {
        return [item.rec.date, item.index];
      }),
      [
        ['2026-08-01', 2],
        ['2025-06-01', 1],
        ['2024-01-01', 0],
      ]
    );
  });
});
