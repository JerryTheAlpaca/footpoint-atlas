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
    assert.equal(stats.stationVisits['南京南'], 4);
    assert.equal(stats.stationVisits['汉口'], 3);
    assert.equal(stats.stationVisits['武汉'], 1);
    assert.equal(stats.vehicleTypes['CR400BF-S'], 2);
    assert.equal(stats.vehicleTypes['CR400BF-Z'], 1);
    assert.equal(stats.vehicleTypes['CR400AF-Z'], 1);
    assert.equal(stats.bureaus['上海局'], 2);
    assert.equal(stats.bureaus['武汉局'], 2);
  });

  it('sums haversine distance and skips stations that lack coordinates', () => {
    const { computeStats } = loadStats();
    const stats = computeStats({
      records: [
        ...records,
        {
          date: '2025-01-01',
          from: '未知站',
          to: '南京南',
          train: 'G999',
          vehicle: 'CRH2A-2001',
          origin: '未知站',
          terminal: '南京南',
          bureau: '上海局',
        },
      ],
      stations,
    });

    assert.ok(stats.mileageKm > 0);
    assert.equal(stats.skippedMissingCoord, 1);
    assert.equal(stats.stationCount, 4);
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

describe('TRAIN_DATA integration', () => {
  it('matches the approved totals 27 / 20 / 16 / 23', () => {
    const { computeStats } = loadStats();
    const sandbox = {};
    const fn = new Function('window', fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8'));
    fn(sandbox);
    const stats = computeStats(sandbox.TRAIN_DATA);

    assert.equal(stats.totalRides, 27);
    assert.equal(stats.stationCount, 20);
    assert.equal(stats.vehicleTypeCount, 16);
    assert.equal(stats.routeCount, 23);
    assert.equal(stats.stationVisits['南京南'], 14);
    assert.equal(stats.routes['汉口→南京南'], 3);
    assert.equal(stats.routes['南京南→汉口'], 3);
    assert.equal(stats.bureaus['上海局'], 10);
    assert.equal(stats.bureaus['广州局'], 6);
    assert.equal(stats.bureaus['武汉局'], 4);
    assert.equal(stats.vehicleTypes['CR400BF-S'], 4);
  });
});
