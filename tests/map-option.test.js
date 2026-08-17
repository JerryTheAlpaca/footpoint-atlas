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

  it('allows a higher zoom so same-city stations can be distinguished', () => {
    const { buildGeoOption } = loadTrainMap();
    const geo = buildGeoOption();

    assert.equal(geo.scaleLimit.min, 0.8);
    assert.equal(geo.scaleLimit.max, 100);
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

describe('routeLineWidth', () => {
  it('keeps a single ride thin and thickens repeated rides', () => {
    const { routeLineWidth } = loadTrainMap();

    assert.equal(routeLineWidth(1), 1.2);
    assert.ok(routeLineWidth(2) > routeLineWidth(1));
    assert.ok(routeLineWidth(3) > routeLineWidth(2));
    assert.equal(routeLineWidth(3), 3.0);
  });

  it('caps very frequent routes so the map stays readable', () => {
    const { routeLineWidth } = loadTrainMap();

    assert.equal(routeLineWidth(20), 6);
    assert.equal(routeLineWidth(99), 6);
  });

  it('adds extra width when the route is highlighted', () => {
    const { routeLineWidth } = loadTrainMap();

    assert.ok(routeLineWidth(1, true) > routeLineWidth(1, false));
    assert.ok(routeLineWidth(3, true) > routeLineWidth(3, false));
  });
});

describe('stationSymbolSize', () => {
  it('grows the station circle as visit count increases', () => {
    const { stationSymbolSize } = loadTrainMap();

    assert.ok(stationSymbolSize(1) > 0);
    assert.ok(stationSymbolSize(3) > stationSymbolSize(1));
    assert.ok(stationSymbolSize(14) > stationSymbolSize(3));
  });

  it('keeps a one-visit station near the original size and makes hubs clearly larger', () => {
    const { stationSymbolSize } = loadTrainMap();

    assert.ok(Math.abs(stationSymbolSize(1) - 14.5) < 0.01);
    assert.ok(stationSymbolSize(14) >= 32);
  });

  it('caps huge hubs so circles do not swallow nearby stations', () => {
    const { stationSymbolSize } = loadTrainMap();

    assert.equal(stationSymbolSize(200), 36);
  });
});

describe('mapRenderOpts', () => {
  it('does not replace series during ordinary playback updates', () => {
    const { mapRenderOpts } = loadTrainMap();
    const opts = mapRenderOpts(false);

    assert.equal(opts.replaceMerge, undefined);
  });

  it('replaces series only when leaving single-trip playback so extra layers can be dropped', () => {
    const { mapRenderOpts } = loadTrainMap();
    const opts = mapRenderOpts(true);

    assert.deepEqual(opts.replaceMerge, ['series']);
  });
});
