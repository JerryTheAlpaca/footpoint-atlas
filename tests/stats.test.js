const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function loadStats() {
  const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'stats.js'), 'utf8');
  const sandbox = {};
  const fn = new Function('window', 'globalThis', code + '\nreturn window.TrainStats;');
  return fn(sandbox, sandbox);
}

describe('trainTypeOf', () => {
  it('classifies G/D/C trains as emu', () => {
    const { trainTypeOf } = loadStats();
    assert.equal(trainTypeOf({ train: 'G123' }), 'emu');
    assert.equal(trainTypeOf({ train: 'D2256' }), 'emu');
    assert.equal(trainTypeOf({ train: 'C1234' }), 'emu');
  });

  it('classifies K/T/Z and numeric trains as conv', () => {
    const { trainTypeOf } = loadStats();
    assert.equal(trainTypeOf({ train: 'K1352' }), 'conv');
    assert.equal(trainTypeOf({ train: 'Z45' }), 'conv');
    assert.equal(trainTypeOf({ train: 'T123' }), 'conv');
  });
});

describe('filterRecordsByType', () => {
  const recs = [
    { train: 'G1' },
    { train: 'K1' },
    { train: 'D2' },
    { train: 'Z3' },
  ];

  it('returns all records when type is all or empty', () => {
    const { filterRecordsByType } = loadStats();
    assert.equal(filterRecordsByType(recs, 'all').length, 4);
    assert.equal(filterRecordsByType(recs, '').length, 4);
  });

  it('filters emu and conv records', () => {
    const { filterRecordsByType } = loadStats();
    assert.equal(filterRecordsByType(recs, 'emu').length, 2);
    assert.equal(filterRecordsByType(recs, 'conv').length, 2);
  });
});

describe('extractVehicleType', () => {
  it('strips the trailing car number from a CR400 series code', () => {
    const { extractVehicleType } = loadStats();
    assert.equal(extractVehicleType('CR400BF-Z-3131'), 'CR400BF-Z');
  });

  it('keeps letter suffixes such as BL and AS', () => {
    const { extractVehicleType } = loadStats();
    assert.equal(extractVehicleType('CRH380BL-3530'), 'CRH380BL');
    assert.equal(extractVehicleType('CR400BF-AS-5367'), 'CR400BF-AS');
    assert.equal(extractVehicleType('CRH1A-A-1172'), 'CRH1A-A');
  });
});

describe('vehicleTypesFromRecord', () => {
  it('splits coupled cars on + and drops the 重联 suffix', () => {
    const { vehicleTypesFromRecord } = loadStats();
    assert.deepEqual(
      vehicleTypesFromRecord('CR400AF-S-2362+CR400AF-S-2367重联'),
      ['CR400AF-S']
    );
  });

  it('counts each distinct model once when both coupled cars share a type', () => {
    const { vehicleTypesFromRecord } = loadStats();
    assert.deepEqual(
      vehicleTypesFromRecord('CR400BF-Z-3147+CR400BF-Z-5267重联'),
      ['CR400BF-Z']
    );
  });
});

describe('computeStats', () => {
  const stations = {
    南京南: [118.81, 31.97],
    汉口: [114.26, 30.62],
    武汉: [114.42, 30.61],
  };

  const records = [
    {
      date: '2023-08-04',
      from: '汉口',
      to: '南京南',
      train: 'G123',
      vehicle: 'CR400BF-S-0001',
      origin: '汉口',
      terminal: '南京南',
      bureau: '上海局',
    },
    {
      date: '2023-08-05',
      from: '汉口',
      to: '南京南',
      train: 'G124',
      vehicle: 'CR400BF-Z-3147+CR400BF-Z-5267重联',
      origin: '汉口',
      terminal: '南京南',
      bureau: '上海局',
    },
    {
      date: '2024-01-01',
      from: '南京南',
      to: '汉口',
      train: 'G125',
      vehicle: 'CR400BF-S-0002',
      origin: '南京南',
      terminal: '汉口',
      bureau: '武汉局',
    },
    {
      date: '2024-06-01',
      from: '武汉',
      to: '南京南',
      train: 'G126',
      vehicle: 'CR400AF-Z-0212',
      origin: '武汉',
      terminal: '南京南',
      bureau: '武汉局',
    },
  ];

  it('counts rides, directed routes, stations, vehicle types and bureaus', () => {
    const { computeStats } = loadStats();
    const stats = computeStats({ records, stations });

    assert.equal(stats.totalRides, 4);
    assert.equal(stats.routeCount, 3);
    assert.equal(stats.stationCount, 3);
    assert.equal(stats.vehicleTypeCount, 3);
    assert.equal(stats.routes['汉口→南京南'], 2);
    assert.equal(stats.routes['南京南→汉口'], 1);
    assert.equal(stats.lineRoutes['汉口↔南京南'], 3);
    assert.equal(stats.lineRoutes['南京南↔武汉'], 1);
    assert.equal(stats.stationVisits['南京南'], 4);
    assert.equal(stats.stationVisits['汉口'], 3);
    assert.equal(stats.stationVisits['武汉'], 1);
    assert.equal(stats.vehicleTypes['CR400BF-S'], 2);
    assert.equal(stats.vehicleTypes['CR400BF-Z'], 1);
    assert.equal(stats.vehicleTypes['CR400AF-Z'], 1);
    assert.equal(stats.bureaus['上海局'], 2);
    assert.equal(stats.bureaus['武汉局'], 2);
  });

});

describe('listYears / recordsByYear / filterRecordsByRange', () => {
  const recs = [
    { date: '2023-08-04', from: '汉口', to: '南京南', train: 'G1' },
    { date: '2024-01-01', from: '南京南', to: '汉口', train: 'G2' },
    { date: '2026-02-01', from: '汉口', to: '武汉', train: 'G3' },
    { date: '2026-08-16', from: '武汉', to: '南京南', train: 'G3' },
  ];

  it('listYears returns sorted unique years', () => {
    const { listYears } = loadStats();
    assert.deepEqual(listYears(recs), ['2023', '2024', '2026']);
    assert.deepEqual(listYears([]), []);
  });

  it('recordsByYear filters by year prefix', () => {
    const { recordsByYear } = loadStats();
    assert.equal(recordsByYear(recs, '2026').length, 2);
    assert.equal(recordsByYear(recs, '2025').length, 0);
  });

  it('filterRecordsByRange keeps boundaries and supports open ends', () => {
    const { filterRecordsByRange } = loadStats();
    assert.equal(filterRecordsByRange(recs, '2024-01-01', '2026-02-01').length, 2);
    assert.equal(filterRecordsByRange(recs, '', '2023-12-31').length, 1);
    assert.equal(filterRecordsByRange(recs, '2025-01-01', '').length, 2);
    assert.equal(filterRecordsByRange(recs, '', '').length, 4);
    assert.equal(filterRecordsByRange(recs, '2030-01-01', '2030-12-31').length, 0);
  });
});

describe('routeLineKey', () => {
  it('treats both directions as the same line', () => {
    const { routeLineKey } = loadStats();
    assert.equal(routeLineKey('南京南', '北京南'), '北京南↔南京南');
    assert.equal(routeLineKey('北京南', '南京南'), '北京南↔南京南');
  });
});

describe('computeStats trains', () => {
  it('counts rides per train number', () => {
    const { computeStats } = loadStats();
    const stats = computeStats({
      records: [
        { date: '2026-01-01', from: '汉口', to: '南京南', train: 'G1', vehicle: 'CR400BF-S-0001', bureau: '上海局' },
        { date: '2026-01-02', from: '汉口', to: '南京南', train: 'G1', vehicle: 'CR400BF-S-0002', bureau: '上海局' },
        { date: '2026-01-03', from: '汉口', to: '南京南', train: 'G2', vehicle: 'CR400BF-S-0003', bureau: '上海局' },
      ],
      stations: { 汉口: [114.26, 30.62], 南京南: [118.81, 31.97] },
    });
    assert.equal(stats.trains['G1'], 2);
    assert.equal(stats.trains['G2'], 1);
  });
});

describe('splitVehicleUnits', () => {
  it('splits coupled units, strips 重联 and keeps only numbered units', () => {
    const { splitVehicleUnits } = loadStats();
    assert.deepEqual(
      splitVehicleUnits('CRH1A-A-1172+CRH1A-A-1248重联'),
      ['CRH1A-A-1172', 'CRH1A-A-1248']
    );
  });

  it('drops bare model codes without a serial number', () => {
    const { splitVehicleUnits } = loadStats();
    assert.deepEqual(splitVehicleUnits('CR400BF'), []);
    assert.deepEqual(splitVehicleUnits('CRH380BL'), []);
  });

  it('dedupes repeated units and tolerates empty input', () => {
    const { splitVehicleUnits } = loadStats();
    assert.deepEqual(splitVehicleUnits('CRH1A-1001+CRH1A-1001'), ['CRH1A-1001']);
    assert.deepEqual(splitVehicleUnits(''), []);
    assert.deepEqual(splitVehicleUnits(null), []);
    assert.deepEqual(splitVehicleUnits(undefined), []);
  });
});

describe('findRepeatedTrains', () => {
  const recs = [
    { date: '2026-01-18', from: '汉口', to: '南京南', train: 'D2256', vehicle: 'CRH3A-3100' },
    { date: '2026-04-11', from: '汉口', to: '合肥南', train: 'G678', vehicle: 'CR400BF-Z-3129' },
    { date: '2026-05-29', from: '六安', to: '南京南', train: 'G678', vehicle: 'CR400BF-AZ-5254' },
    { date: '2026-07-14', from: '汉口', to: '南京南', train: 'D2256', vehicle: 'CRH3A-3100' },
    { date: '2026-08-01', from: '南京南', to: '汉口', train: 'G1', vehicle: 'CR400AF-0001' },
  ];

  it('keeps only trains ridden at least twice, sorted by count then latest date', () => {
    const { findRepeatedTrains } = loadStats();
    const result = findRepeatedTrains(recs);
    assert.equal(result.length, 2);
    assert.deepEqual(result.map((g) => g.train), ['D2256', 'G678']);
    assert.equal(result[0].count, 2);
    assert.deepEqual(result[0].rides.map((r) => r.date), ['2026-01-18', '2026-07-14']);
    assert.deepEqual(result[0].rides.map((r) => r.index), [0, 3]);
  });

  it('flags sameVehicle only when numbered units intersect across rides', () => {
    const { findRepeatedTrains } = loadStats();
    const result = findRepeatedTrains(recs);
    const d2256 = result.find((g) => g.train === 'D2256');
    const g678 = result.find((g) => g.train === 'G678');
    assert.equal(d2256.sameVehicle, true);
    assert.equal(g678.sameVehicle, false);
  });

  it('treats bare model codes as no shared vehicle and ignores bad input', () => {
    const { findRepeatedTrains } = loadStats();
    const result = findRepeatedTrains([
      { date: '2023-08-04', from: '西安北', to: '郑州东', train: 'G56', vehicle: 'CR400BF' },
      { date: '2023-08-05', from: '杭州西', to: '南京南', train: 'G56', vehicle: 'CR400BF' },
      { date: '2023-08-06', from: '南京南', to: '汉口', train: '', vehicle: 'CR400BF-0001' },
      null,
    ]);
    assert.equal(result.length, 1);
    assert.equal(result[0].train, 'G56');
    assert.equal(result[0].sameVehicle, false);
    assert.deepEqual(findRepeatedTrains([]), []);
    assert.deepEqual(findRepeatedTrains(null), []);
  });

  it('detects a shared unit through coupled consists', () => {
    const { findRepeatedTrains } = loadStats();
    const result = findRepeatedTrains([
      { date: '2026-01-01', from: '汉口', to: '南京南', train: 'D9', vehicle: 'CRH1A-A-1172+CRH1A-A-1248重联' },
      { date: '2026-02-01', from: '汉口', to: '南京南', train: 'D9', vehicle: 'CRH1A-A-1248+CRH1A-A-2000重联' },
    ]);
    assert.equal(result.length, 1);
    assert.equal(result[0].sameVehicle, true);
  });
});

describe('findRepeatedVehicles', () => {
  const recs = [
    { date: '2026-01-18', from: '汉口', to: '南京南', train: 'D2256', vehicle: 'CRH3A-3100' },
    { date: '2026-04-11', from: '汉口', to: '合肥南', train: 'G678', vehicle: 'CR400BF-Z-3129' },
    { date: '2026-07-14', from: '汉口', to: '南京南', train: 'D2256', vehicle: 'CRH3A-3100' },
    { date: '2026-08-01', from: '南京南', to: '汉口', train: 'G1', vehicle: 'CR400AF-0001' },
  ];

  it('keeps only units seen at least twice and flags sameTrain', () => {
    const { findRepeatedVehicles } = loadStats();
    const result = findRepeatedVehicles(recs);
    assert.equal(result.length, 1);
    assert.equal(result[0].unit, 'CRH3A-3100');
    assert.equal(result[0].count, 2);
    assert.equal(result[0].sameTrain, true);
    assert.deepEqual(result[0].rides.map((r) => r.index), [0, 2]);
  });

  it('tracks each coupled unit independently and flags cross-train reunions', () => {
    const { findRepeatedVehicles } = loadStats();
    const result = findRepeatedVehicles([
      { date: '2026-01-01', from: '汉口', to: '南京南', train: 'D1', vehicle: 'CRH1A-A-1172+CRH1A-A-1248重联' },
      { date: '2026-02-01', from: '南京南', to: '汉口', train: 'D2', vehicle: 'CRH1A-A-1172' },
    ]);
    assert.equal(result.length, 1);
    assert.equal(result[0].unit, 'CRH1A-A-1172');
    assert.equal(result[0].sameTrain, false);
  });

  it('ignores bare model codes and empty input', () => {
    const { findRepeatedVehicles } = loadStats();
    assert.deepEqual(
      findRepeatedVehicles([
        { date: '2023-08-04', from: '西安北', to: '郑州东', train: 'G56', vehicle: 'CR400BF' },
        { date: '2023-08-05', from: '杭州西', to: '南京南', train: 'G254', vehicle: 'CR400BF' },
      ]),
      []
    );
    assert.deepEqual(findRepeatedVehicles([]), []);
    assert.deepEqual(findRepeatedVehicles(null), []);
  });
});

describe('topEntries', () => {
  it('returns every entry tied for the highest count', () => {
    const { topEntries } = loadStats();
    assert.deepEqual(
      topEntries({ 南京南: 4, 汉口: 3, 武汉: 3 }),
      [
        ['南京南', 4],
      ]
    );
    assert.deepEqual(
      topEntries({ 南京南: 4, 汉口: 4, 武汉: 3 }),
      [
        ['汉口', 4],
        ['南京南', 4],
      ]
    );
    assert.deepEqual(topEntries({}), []);
  });
});

describe('buildReunionState', () => {
  const records = [
    { date: '2026-01-01', from: '汉口', to: '南京南', train: 'D1', vehicle: 'CRH1A-A-1172' },
    { date: '2026-02-01', from: '南京南', to: '汉口', train: 'D2', vehicle: 'CRH1A-A-2000' },
    { date: '2026-03-01', from: '汉口', to: '南京南', train: 'D1', vehicle: 'CRH1A-A-1172' },
  ];

  it('uses the supplied filtered records as the index and badge source', () => {
    const { buildReunionState } = loadStats();
    const state = buildReunionState(records);
    assert.deepEqual(state.trains.map((group) => group.train), ['D1']);
    assert.deepEqual(state.trains[0].rides.map((ride) => ride.index), [0, 2]);
    assert.deepEqual(state.vehicles.map((group) => group.unit), ['CRH1A-A-1172']);
    assert.equal(state.badges.has(records[0]), false);
    assert.equal(state.badges.has(records[1]), false);
    assert.deepEqual(state.badges.get(records[2]), [
      { kind: 'train', count: 2 },
      { kind: 'vehicle', count: 2 },
    ]);
  });

  it('drops groups and badges when the active filter leaves only one ride', () => {
    const { buildReunionState } = loadStats();
    const state = buildReunionState(records.slice(0, 1));
    assert.deepEqual(state.trains, []);
    assert.deepEqual(state.vehicles, []);
    assert.equal(state.badges.size, 0);
  });
});

describe('TRAIN_DATA integration', () => {
  it('matches the Excel-synced totals 37 / 30 / 17 / 33', () => {
    const { computeStats } = loadStats();
    const sandbox = {};
    const fn = new Function('window', fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8'));
    fn(sandbox);
    const stats = computeStats(sandbox.TRAIN_DATA);
    const data = sandbox.TRAIN_DATA;

    for (const rec of data.records) {
      assert.ok(data.stations[rec.from], 'missing coord for ' + rec.from);
      assert.ok(data.stations[rec.to], 'missing coord for ' + rec.to);
    }

    assert.equal(stats.totalRides, 37);
    assert.equal(stats.stationCount, 30);
    assert.equal(stats.vehicleTypeCount, 17);
    assert.equal(stats.routeCount, 33);
    assert.equal(stats.stationVisits['南京南'], 16);
    assert.equal(stats.routes['汉口→南京南'], 3);
    assert.equal(stats.routes['南京南→汉口'], 3);
    assert.equal(stats.lineRoutes['汉口↔南京南'], 6);
    assert.equal(stats.bureaus['上海局'], 12);
    assert.equal(stats.bureaus['广州局'], 8);
    assert.equal(stats.bureaus['武汉局'], 7);
    assert.equal(stats.bureaus['乌鲁木齐局'], 1);
    assert.equal(stats.vehicleTypes['CR400BF-S'], 4);
  });
});
