const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function loadTrainMap() {
  const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  const sandbox = { document: undefined };
  const fn = new Function('window', 'globalThis', 'document', code + '\nreturn window.TrainMap;');
  return fn(sandbox, sandbox, undefined);
}

describe('buildGeoOption', () => {
  it('enables roam with geographic center/zoom instead of layoutCenter/layoutSize', () => {
    const { buildGeoOption } = loadTrainMap();
    const geo = buildGeoOption();

    assert.equal(geo.roam, true);
    assert.equal(geo.map, 'china');
    assert.ok(Array.isArray(geo.center));
    assert.equal(geo.center.length, 2);
    assert.equal(typeof geo.zoom, 'number');
    assert.equal(geo.layoutCenter, undefined);
    assert.equal(geo.layoutSize, undefined);
  });

  it('keeps the current view so later setOption calls do not reset user zoom', () => {
    const { buildGeoOption } = loadTrainMap();
    const geo = buildGeoOption({
      center: [118.81, 31.97],
      zoom: 3.2,
    });

    assert.deepEqual(geo.center, [118.81, 31.97]);
    assert.equal(geo.zoom, 3.2);
    assert.equal(geo.layoutCenter, undefined);
    assert.equal(geo.layoutSize, undefined);
  });
});

describe('readGeoView', () => {
  it('reads center and zoom from the live chart option', () => {
    const { readGeoView } = loadTrainMap();
    const view = readGeoView({
      getOption: function () {
        return {
          geo: [{ center: [104.2, 35.6], zoom: 2.1 }],
        };
      },
    });

    assert.deepEqual(view, { center: [104.2, 35.6], zoom: 2.1 });
  });
});
