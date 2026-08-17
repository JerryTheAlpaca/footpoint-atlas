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

describe('rankGridLeft', () => {
  it('leaves enough room for long vehicle type names such as CR400BF-AS', () => {
    const { rankGridLeft } = loadTrainRank();
    const left = rankGridLeft([
      ['CR400BF-AS', 4],
      ['CR400BF-AZ', 1],
      ['CRH380BL', 2],
    ]);
    assert.ok(left > 72, 'left grid was ' + left);
  });

  it('keeps a compact margin for short Chinese labels', () => {
    const { rankGridLeft } = loadTrainRank();
    assert.equal(rankGridLeft([['南京南', 14], ['上海局', 10]]), 72);
  });
});

describe('rankBarValues', () => {
  const entries = [
    ['CR400BF-S', 4],
    ['CR400AF-Z', 3],
  ];

  it('starts from zero so newly expanded bars can grow in', () => {
    const { rankBarValues } = loadTrainRank();
    assert.deepEqual(rankBarValues(entries, false), [
      { name: 'CR400BF-S', value: 0 },
      { name: 'CR400AF-Z', value: 0 },
    ]);
  });

  it('uses the real counts after the grow-in animation', () => {
    const { rankBarValues } = loadTrainRank();
    assert.deepEqual(rankBarValues(entries, true), [
      { name: 'CR400BF-S', value: 4 },
      { name: 'CR400AF-Z', value: 3 },
    ]);
  });

  it('keeps the already visible top rows and starts new rows at zero', () => {
    const { rankBarValues, COLLAPSED_LIMIT } = loadTrainRank();
    const list = [
      ['CR400BF-S', 4],
      ['CR400AF-Z', 3],
      ['CRH380BL', 2],
      ['CR400BF-AS', 1],
      ['CRH1A-A', 1],
    ];
    assert.deepEqual(rankBarValues(list, false, COLLAPSED_LIMIT), [
      { name: 'CR400BF-S', value: 4 },
      { name: 'CR400AF-Z', value: 3 },
      { name: 'CRH380BL', value: 2 },
      { name: 'CR400BF-AS', value: 0 },
      { name: 'CRH1A-A', value: 0 },
    ]);
  });
});

describe('rankGrowOption', () => {
  it('only patches series values so ECharts can animate width instead of redrawing axes', () => {
    const { rankGrowOption } = loadTrainRank();
    const option = rankGrowOption([
      ['CR400BF-S', 4],
      ['CR400BF-AS', 1],
    ]);
    assert.equal(option.yAxis, undefined);
    assert.deepEqual(option.series[0].data, [
      { name: 'CR400BF-S', value: 4 },
      { name: 'CR400BF-AS', value: 1 },
    ]);
    assert.ok(option.animationDurationUpdate >= 600);
  });

  it('turns animation back on so bars can grow after the seed option disabled it', () => {
    const { rankGrowOption } = loadTrainRank();
    const option = rankGrowOption([['CR400BF-S', 4]]);
    assert.equal(option.animation, true);
    assert.ok(option.animationDuration >= 600);
    assert.ok(option.animationDurationUpdate >= 600);
  });
});

describe('rankAnimation', () => {
  it('keeps animation enabled while seeding zeros so later growth can interpolate', () => {
    const { rankAnimation } = loadTrainRank();
    const quiet = rankAnimation(false);
    assert.equal(quiet.animation, true);
    assert.equal(quiet.animationDuration, 0);
    assert.equal(quiet.animationDurationUpdate, 0);
  });
});

describe('rankTweenValues', () => {
  const list = [
    ['CR400BF-S', 4],
    ['CR400AF-Z', 3],
    ['CRH380BL', 2],
    ['CR400BF-AS', 1],
  ];

  it('grows every row from zero including the already visible top bars', () => {
    const { rankBarValues, rankTweenValues } = loadTrainRank();
    const from = rankBarValues(list, false);
    const to = rankBarValues(list, true);
    const start = rankTweenValues(from, to, 0);
    const mid = rankTweenValues(from, to, 0.5);
    const end = rankTweenValues(from, to, 1);
    assert.equal(start[0].value, 0);
    assert.equal(start[3].value, 0);
    assert.equal(mid[0].value, 2);
    assert.equal(mid[3].value, 0.5);
    assert.equal(end[0].value, 4);
    assert.equal(end[3].value, 1);
  });
});

describe('rankGrowFrom', () => {
  it('starts every visible bar at zero including the top three', () => {
    const { rankGrowFrom } = loadTrainRank();
    assert.deepEqual(
      rankGrowFrom([
        ['CR400BF-S', 4],
        ['CR400AF-Z', 3],
        ['CRH380BL', 2],
        ['CR400BF-AS', 1],
      ]),
      [
        { name: 'CR400BF-S', value: 0 },
        { name: 'CR400AF-Z', value: 0 },
        { name: 'CRH380BL', value: 0 },
        { name: 'CR400BF-AS', value: 0 },
      ]
    );
  });
});

describe('rankAxisMax', () => {
  it('locks the value axis to the largest count so bars can grow against a stable scale', () => {
    const { rankAxisMax } = loadTrainRank();
    assert.equal(rankAxisMax([['CR400BF-S', 4], ['CR400BF-AS', 1]]), 4);
    assert.equal(rankAxisMax([]), 1);
  });
});

describe('rankGrowHold', () => {
  it('waits after the list expands before the bar growth starts', () => {
    const { GROW_HOLD_MS } = loadTrainRank();
    assert.equal(GROW_HOLD_MS, 50);
  });
});

describe('rankExpandLayout', () => {
  it('keeps a fixed row pitch so the list can clip-reveal instead of stretching bars', () => {
    const { rankExpandLayout, rankChartHeight, COLLAPSED_LIMIT } = loadTrainRank();
    const layout = rankExpandLayout(16);
    assert.deepEqual(layout, {
      fromClip: rankChartHeight(COLLAPSED_LIMIT),
      toClip: rankChartHeight(16),
      content: rankChartHeight(16),
    });
    assert.ok(layout.toClip > layout.fromClip);
    assert.equal(layout.content, layout.toClip);
  });
});

describe('ranking markup', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

  it('places a compact expand arrow under each ranking chart', () => {
    assert.match(html, /class="rank-clip"[\s\S]*?id="vehicle-chart"/);
    assert.match(html, /class="rank-clip"[\s\S]*?id="station-chart"/);
    assert.match(html, /class="rank-clip"[\s\S]*?id="bureau-chart"/);
    assert.match(html, /id="vehicle-chart"[\s\S]*?class="rank-toggle"/);
    assert.match(html, /id="station-chart"[\s\S]*?class="rank-toggle"/);
    assert.match(html, /id="bureau-chart"[\s\S]*?class="rank-toggle"/);
    assert.match(html, /<h2>路局排行<\/h2>/);
  });
});

describe('ranking expand animation styles', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');

  it('animates the ranking clip height when expanding or collapsing', () => {
    const block = cssBlock(css, '.rank-clip');
    assert.match(block, /overflow\s*:\s*hidden/);
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
