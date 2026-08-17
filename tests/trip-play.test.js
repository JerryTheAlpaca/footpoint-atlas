const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function loadTrainTripPlay() {
  const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
  const sandbox = { document: undefined };
  const fn = new Function('window', 'globalThis', 'document', code + '\nreturn window.TrainTripPlay;');
  return fn(sandbox, sandbox, undefined);
}

const trip = {
  from: '南京南',
  to: '上海虹桥',
  fromCoord: [118.8, 31.97],
  toCoord: [121.32, 31.19],
};

describe('sampleRoutePolyline', () => {
  it('starts at the origin and ends at the destination', () => {
    const { sampleRoutePolyline } = loadTrainTripPlay();
    const points = sampleRoutePolyline(trip.fromCoord, trip.toCoord, 0.22, 32);

    assert.equal(points.length, 33);
    assert.deepEqual(points[0], trip.fromCoord);
    assert.deepEqual(points[points.length - 1], trip.toCoord);
  });

  it('bends away from the straight midpoint using ECharts curveness', () => {
    const { sampleRoutePolyline, quadraticControlPoint } = loadTrainTripPlay();
    const points = sampleRoutePolyline(trip.fromCoord, trip.toCoord, 0.22, 32);
    const mid = points[16];
    const straight = [
      (trip.fromCoord[0] + trip.toCoord[0]) / 2,
      (trip.fromCoord[1] + trip.toCoord[1]) / 2,
    ];
    const control = quadraticControlPoint(trip.fromCoord, trip.toCoord, 0.22);

    assert.notDeepEqual(mid, straight);
    assert.ok(Math.abs(mid[0] - straight[0]) > 0.05);
    assert.ok(Math.abs(control[0] - straight[0]) > 0.05);
  });
});

describe('slicePolylineByProgress', () => {
  it('returns only the start point before the line begins', () => {
    const { sampleRoutePolyline, slicePolylineByProgress } = loadTrainTripPlay();
    const points = sampleRoutePolyline(trip.fromCoord, trip.toCoord, 0.22, 20);
    const sliced = slicePolylineByProgress(points, 0);

    assert.equal(sliced.length, 1);
    assert.deepEqual(sliced[0], trip.fromCoord);
  });

  it('returns the full polyline at progress 1', () => {
    const { sampleRoutePolyline, slicePolylineByProgress } = loadTrainTripPlay();
    const points = sampleRoutePolyline(trip.fromCoord, trip.toCoord, 0.22, 20);
    const sliced = slicePolylineByProgress(points, 1);

    assert.equal(sliced.length, points.length);
    assert.deepEqual(sliced[sliced.length - 1], trip.toCoord);
  });

  it('grows from the start and does not reach the end at halfway', () => {
    const { sampleRoutePolyline, slicePolylineByProgress } = loadTrainTripPlay();
    const points = sampleRoutePolyline(trip.fromCoord, trip.toCoord, 0.22, 40);
    const sliced = slicePolylineByProgress(points, 0.5);
    const head = sliced[sliced.length - 1];
    const end = trip.toCoord;

    assert.ok(sliced.length >= 2);
    assert.deepEqual(sliced[0], trip.fromCoord);
    assert.ok(Math.hypot(head[0] - end[0], head[1] - end[1]) > 0.3);
  });
});

describe('tripStationAppearStyle', () => {
  it('starts the circle at size 0 and grows it to the full station size', () => {
    const { tripStationAppearStyle } = loadTrainTripPlay();

    assert.equal(tripStationAppearStyle(0).size, 0);
    assert.equal(tripStationAppearStyle(0).ringOpacity, 0);
    assert.ok(tripStationAppearStyle(0.4).size > 0);
    assert.ok(tripStationAppearStyle(0.4).size < tripStationAppearStyle(1).size);
    assert.ok(tripStationAppearStyle(0.4).ringOpacity > 0);
    assert.equal(tripStationAppearStyle(1).ringOpacity, 0);
    assert.ok(tripStationAppearStyle(1).size >= 16);
  });
});

describe('buildTripPlayFrame', () => {
  it('shows only the start station at t=0, with no line and no destination', () => {
    const { buildTripPlayFrame } = loadTrainTripPlay();
    const frame = buildTripPlayFrame(0, trip);

    assert.equal(frame.phase, 'start');
    assert.equal(frame.stations.length, 1);
    assert.equal(frame.stations[0].name, '南京南');
    assert.equal(frame.stations[0].appear, 0);
    assert.equal(frame.lineCoords.length, 0);
    assert.equal(frame.head, null);
    assert.equal(frame.done, false);
  });

  it('grows the start circle during the appear window before the line starts', () => {
    const { buildTripPlayFrame, TRIP_PLAY_TIMING } = loadTrainTripPlay();
    const mid = buildTripPlayFrame(TRIP_PLAY_TIMING.appearMs * 0.45, trip);
    const ready = buildTripPlayFrame(TRIP_PLAY_TIMING.appearMs, trip);

    assert.equal(mid.phase, 'start');
    assert.ok(mid.stations[0].appear > 0);
    assert.ok(mid.stations[0].appear < 1);
    assert.equal(mid.lineCoords.length, 0);
    assert.equal(ready.stations[0].appear, 1);
    assert.equal(ready.lineCoords.length, 0);
  });

  it('keeps the destination hidden while the start station is held', () => {
    const { buildTripPlayFrame, TRIP_PLAY_TIMING } = loadTrainTripPlay();
    const frame = buildTripPlayFrame(TRIP_PLAY_TIMING.startHoldMs - 1, trip);

    assert.equal(frame.phase, 'start');
    assert.equal(frame.stations.length, 1);
    assert.equal(frame.stations[0].appear, 1);
    assert.equal(frame.lineCoords.length, 0);
    assert.equal(
      frame.stations.some(function (s) {
        return s.name === '上海虹桥';
      }),
      false
    );
  });

  it('draws a partial glowing line after the start hold, still without the end station', () => {
    const { buildTripPlayFrame, TRIP_PLAY_TIMING } = loadTrainTripPlay();
    const elapsed = TRIP_PLAY_TIMING.startHoldMs + TRIP_PLAY_TIMING.drawMs * 0.4;
    const frame = buildTripPlayFrame(elapsed, trip);
    const end = trip.toCoord;
    const head = frame.lineCoords[frame.lineCoords.length - 1];

    assert.equal(frame.phase, 'draw');
    assert.equal(frame.stations.length, 1);
    assert.equal(frame.stations[0].name, '南京南');
    assert.ok(frame.lineCoords.length >= 2);
    assert.ok(frame.head);
    assert.ok(Math.hypot(head[0] - end[0], head[1] - end[1]) > 0.2);
  });

  it('reveals the destination only after the line has arrived', () => {
    const { buildTripPlayFrame, TRIP_PLAY_TIMING } = loadTrainTripPlay();
    const elapsed = TRIP_PLAY_TIMING.startHoldMs + TRIP_PLAY_TIMING.drawMs;
    const frame = buildTripPlayFrame(elapsed, trip);

    assert.equal(frame.phase, 'end');
    assert.equal(frame.stations.length, 2);
    assert.equal(frame.stations[0].name, '南京南');
    assert.equal(frame.stations[0].appear, 1);
    assert.equal(frame.stations[1].name, '上海虹桥');
    assert.equal(frame.stations[1].appear, 0);
    assert.deepEqual(frame.lineCoords[frame.lineCoords.length - 1], trip.toCoord);
    assert.equal(frame.head, null);
    assert.equal(frame.done, false);
  });

  it('grows the destination circle after the line arrives', () => {
    const { buildTripPlayFrame, TRIP_PLAY_TIMING } = loadTrainTripPlay();
    const arrive = TRIP_PLAY_TIMING.startHoldMs + TRIP_PLAY_TIMING.drawMs;
    const mid = buildTripPlayFrame(arrive + TRIP_PLAY_TIMING.appearMs * 0.45, trip);
    const done = buildTripPlayFrame(arrive + TRIP_PLAY_TIMING.appearMs, trip);

    assert.equal(mid.phase, 'end');
    assert.equal(mid.stations[0].appear, 1);
    assert.ok(mid.stations[1].appear > 0);
    assert.ok(mid.stations[1].appear < 1);
    assert.equal(mid.done, false);
    assert.equal(done.stations[1].appear, 1);
    assert.equal(done.done, true);
  });
});

describe('tripPlayGeoView', () => {
  it('centers between the two stations and zooms in more for short trips', () => {
    const { tripPlayGeoView } = loadTrainTripPlay();
    const shortView = tripPlayGeoView(trip.fromCoord, trip.toCoord);
    const longView = tripPlayGeoView([87.6, 43.8], [121.5, 31.2]);

    assert.ok(Math.abs(shortView.center[0] - (118.8 + 121.32) / 2) < 0.01);
    assert.ok(Math.abs(shortView.center[1] - (31.97 + 31.19) / 2) < 0.01);
    assert.ok(shortView.zoom > longView.zoom);
    assert.ok(shortView.zoom > 3);
  });
});
