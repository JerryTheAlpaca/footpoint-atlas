const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function loadTrainRank() {
  const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  const sandbox = { document: undefined };
  const fn = new Function('window', 'globalThis', 'document', code + '\nreturn window.TrainRank;');
  return fn(sandbox, sandbox, undefined);
}

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

describe('visibleRankEntries', () => {
  const entries = [
    ['上海局', 10],
    ['广州局', 6],
    ['武汉局', 4],
    ['成都局', 3],
    ['北京局', 2],
  ];

  it('shows only the top 3 entries when collapsed', () => {
    const { visibleRankEntries, COLLAPSED_LIMIT } = loadTrainRank();
    assert.equal(COLLAPSED_LIMIT, 3);
    assert.deepEqual(visibleRankEntries(entries, false), [
      ['上海局', 10],
      ['广州局', 6],
      ['武汉局', 4],
    ]);
  });

  it('shows every entry when expanded', () => {
    const { visibleRankEntries } = loadTrainRank();
    assert.deepEqual(visibleRankEntries(entries, true), entries);
  });

  it('returns all entries when there are three or fewer', () => {
    const { visibleRankEntries } = loadTrainRank();
    const shortList = [
      ['上海局', 10],
      ['广州局', 6],
    ];
    assert.deepEqual(visibleRankEntries(shortList, false), shortList);
    assert.deepEqual(visibleRankEntries(shortList, true), shortList);
  });
});

describe('rankChartHeight', () => {
  it('grows with the visible row count so expanded lists have room', () => {
    const { rankChartHeight } = loadTrainRank();
    const collapsed = rankChartHeight(3);
    const expanded = rankChartHeight(16);
    assert.ok(collapsed > 0);
    assert.ok(expanded > collapsed);
    assert.equal(expanded - collapsed, rankChartHeight(16) - rankChartHeight(3));
  });
});

describe('rankToggleHidden', () => {
  it('hides the arrow when the list already fits in the collapsed view', () => {
    const { rankToggleHidden } = loadTrainRank();
    assert.equal(rankToggleHidden(3), true);
    assert.equal(rankToggleHidden(2), true);
    assert.equal(rankToggleHidden(4), false);
  });
});

describe('ranking markup', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

  it('places a compact expand arrow under each ranking chart', () => {
    assert.match(html, /id="vehicle-chart"[\s\S]*?class="rank-toggle"/);
    assert.match(html, /id="station-chart"[\s\S]*?class="rank-toggle"/);
    assert.match(html, /id="bureau-chart"[\s\S]*?class="rank-toggle"/);
    assert.match(html, /<h2>路局排行<\/h2>/);
  });
});

describe('ranking expand animation styles', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');

  it('animates the ranking chart height when expanding or collapsing', () => {
    const block = cssBlock(css, '.side-chart');
    assert.match(block, /transition\s*:\s*height\s+[\d.]+s/);
  });

  it('keeps the toggle as a small arrow instead of a large button', () => {
    const toggle = cssBlock(css, '.rank-toggle');
    assert.equal(hasDecl(toggle, 'height', '\\d+px'), true);
    const height = toggle.match(/height\s*:\s*(\d+)px/);
    assert.ok(height);
    assert.ok(Number(height[1]) <= 22);
  });
});
