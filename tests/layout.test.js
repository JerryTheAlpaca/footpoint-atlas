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
