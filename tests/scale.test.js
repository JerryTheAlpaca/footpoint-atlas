const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function loadTrainScale() {
  const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'scale.js'), 'utf8');
  const sandbox = { document: undefined };
  const fn = new Function('window', 'globalThis', 'document', code + '\nreturn window.TrainScale;');
  return fn(sandbox, sandbox, undefined);
}

describe('computeFitScale', () => {
  it('keeps scale 1 on the 1920x1080 design size', () => {
    const { computeFitScale, DESIGN_WIDTH, DESIGN_HEIGHT } = loadTrainScale();
    assert.equal(DESIGN_WIDTH, 1920);
    assert.equal(DESIGN_HEIGHT, 1080);
    assert.equal(computeFitScale(1920, 1080), 1);
  });

  it('scales down uniformly to fit a smaller viewport', () => {
    const { computeFitScale } = loadTrainScale();
    assert.equal(computeFitScale(1366, 768), 768 / 1080);
    assert.equal(computeFitScale(1920, 900), 900 / 1080);
    assert.equal(computeFitScale(1280, 1080), 1280 / 1920);
  });

  it('scales up uniformly on a larger viewport', () => {
    const { computeFitScale } = loadTrainScale();
    assert.equal(computeFitScale(3840, 2160), 2);
  });

  it('falls back to 1 when viewport or design size is invalid', () => {
    const { computeFitScale } = loadTrainScale();
    assert.equal(computeFitScale(0, 1080), 1);
    assert.equal(computeFitScale(1920, -10), 1);
  });
});

describe('buildFitTransform', () => {
  it('centers the page and applies the computed scale', () => {
    const { buildFitTransform } = loadTrainScale();
    assert.equal(buildFitTransform(0.5), 'translate(-50%, -50%) scale(0.5)');
  });
});
