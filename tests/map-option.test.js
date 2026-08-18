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

  it('keeps all lines at the same base width during highlight to avoid flicker', () => {
    const { routeLineWidth } = loadTrainMap();

    assert.equal(routeLineWidth(1, true), routeLineWidth(1, false));
    assert.equal(routeLineWidth(3, true), routeLineWidth(3, false));
  });
});

describe('stationSymbolSize', () => {
  it('grows the station circle as visit count increases', () => {
    const { stationSymbolSize } = loadTrainMap();

    assert.ok(stationSymbolSize(1) > 0);
    assert.ok(stationSymbolSize(3) > stationSymbolSize(1));
    assert.ok(stationSymbolSize(14) > stationSymbolSize(3));
  });

  it('keeps a one-visit station compact and still makes hubs clearly larger', () => {
    const { stationSymbolSize } = loadTrainMap();

    assert.ok(Math.abs(stationSymbolSize(1) - 9.5) < 0.01);
    assert.ok(stationSymbolSize(14) > 18);
    assert.ok(stationSymbolSize(14) < 24);
  });

  it('caps huge hubs so circles do not swallow nearby stations', () => {
    const { stationSymbolSize } = loadTrainMap();

    assert.equal(stationSymbolSize(200), 22);
  });
});

describe('mapLineSeries highlight states', () => {
  it('dims sibling lines via blur state instead of rebuilding the map', () => {
    const { mapLineSeries } = loadTrainMap();
    const series = mapLineSeries('emu', [{ name: '甲→乙|emu', coords: [[0, 0], [1, 1]] }]);

    assert.equal(series.id, 'map-lines-emu');
    assert.equal(series.animation, false);
    assert.equal(series.emphasis.disabled, true);
    assert.equal(series.lineStyle.opacity, 0.75);
  });

  it('uses a brighter highlight color than the resting line', () => {
    const { lineHoverStyle, ROUTE_LINE_STYLES, HIGHLIGHT_LINE_COLORS } = loadTrainMap();
    const emu = lineHoverStyle('emu', true, true, 1.2);
    const conv = lineHoverStyle('conv', true, true, 1.2);

    assert.equal(emu.color, HIGHLIGHT_LINE_COLORS.emu);
    assert.equal(conv.color, HIGHLIGHT_LINE_COLORS.conv);
    assert.notEqual(emu.color, ROUTE_LINE_STYLES.emu.color);
    assert.notEqual(conv.color, ROUTE_LINE_STYLES.conv.color);
    assert.equal(emu.opacity, 1);
  });

  it('keeps sibling lines dimmed while the cursor stays in the record area', () => {
    const { lineHoverStyle, ROUTE_LINE_STYLES } = loadTrainMap();
    const dimmed = lineHoverStyle('emu', false, true, 1.2);
    const restored = lineHoverStyle('emu', false, false, 1.2);

    assert.equal(dimmed.opacity, 0.4);
    assert.equal(dimmed.color, ROUTE_LINE_STYLES.emu.color);
    assert.equal(restored.opacity, 0.75);
  });

  it('highlights with a separate overlay so base lines are not rebuilt', () => {
    const { hoverLineDrawStyle, HIGHLIGHT_LINE_COLORS } = loadTrainMap();
    const style = hoverLineDrawStyle('emu', 1.2);

    assert.equal(style.stroke, HIGHLIGHT_LINE_COLORS.emu);
    assert.equal(style.opacity, 1);
    assert.ok(style.lineWidth > 1.2);
  });

  it('dims the line canvas layer without replacing series data', () => {
    const { lineLayerOpacity } = loadTrainMap();

    assert.equal(lineLayerOpacity(false), 1);
    assert.ok(Math.abs(lineLayerOpacity(true) - 0.4 / 0.75) < 0.0001);
  });

  it('does not dim other lines during timeline playback', () => {
    const { shouldDimMapLines } = loadTrainMap();

    assert.equal(shouldDimMapLines(true, false, null), true);
    assert.equal(shouldDimMapLines(true, true, null), false);
    assert.equal(shouldDimMapLines(false, false, null), false);
    assert.equal(shouldDimMapLines(true, false, 0), false);
  });

  it('uses green solid styling for conv lines', () => {
    const { mapLineSeries, ROUTE_LINE_STYLES } = loadTrainMap();
    const series = mapLineSeries('conv', [{ name: '甲→乙|conv', coords: [[0, 0], [1, 1]] }]);

    assert.equal(series.id, 'map-lines-conv');
    assert.equal(ROUTE_LINE_STYLES.conv.type, 'solid');
    assert.equal(ROUTE_LINE_STYLES.conv.color, '#16a34a');
    assert.notEqual(ROUTE_LINE_STYLES.conv.color, ROUTE_LINE_STYLES.emu.color);
    assert.equal(series.effect.color, '#16a34a');
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
