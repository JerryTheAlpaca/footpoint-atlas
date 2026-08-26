const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function loadSettings() {
  const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'settings.js'), 'utf8');
  const sandbox = {};
  const fn = new Function('window', 'globalThis', code + '\nreturn window.TrainSettings;');
  return fn(sandbox, sandbox);
}

function memoryStorage(initial) {
  const data = Object.assign({}, initial);
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
    },
    setItem(key, value) {
      data[key] = String(value);
    },
    removeItem(key) {
      delete data[key];
    },
  };
}

const validRecord = {
  date: '2026-08-26',
  from: '南京南',
  to: '汉口',
  train: 'G599',
  vehicle: 'CR400BF-Z',
  origin: '上海虹桥',
  terminal: '汉口',
  bureau: '上海局',
};

describe('TrainSettings.mergeTrainData', () => {
  it('concatenates extra records and overlays extra station coords', () => {
    const { mergeTrainData } = loadSettings();
    const merged = mergeTrainData(
      {
        records: [{ date: '2023-01-01', from: '南京南', to: '武汉' }],
        stations: { 南京南: [118.81, 31.97], 武汉: [114.42, 30.61] },
      },
      {
        records: [validRecord],
        stations: { 汉口: [114.26, 30.62] },
      }
    );
    assert.equal(merged.records.length, 2);
    assert.equal(merged.records[1].train, 'G599');
    assert.deepEqual(merged.stations['汉口'], [114.26, 30.62]);
    assert.deepEqual(merged.stations['南京南'], [118.81, 31.97]);
  });
});

describe('TrainSettings.normalizeRecord / validateRecord', () => {
  it('trims fields and keeps the existing record shape', () => {
    const { normalizeRecord } = loadSettings();
    assert.deepEqual(
      normalizeRecord({
        date: ' 2026-08-26 ',
        from: ' 南京南',
        to: '汉口 ',
        train: ' G599 ',
        vehicle: ' CR400BF-Z ',
        origin: ' 上海虹桥 ',
        terminal: ' 汉口 ',
        bureau: ' 上海局 ',
      }),
      validRecord
    );
  });

  it('rejects missing date, stations, or train', () => {
    const { validateRecord } = loadSettings();
    const result = validateRecord({
      date: '',
      from: '',
      to: '',
      train: '',
      vehicle: '',
      origin: '',
      terminal: '',
      bureau: '',
    });
    assert.equal(result.ok, false);
    assert.ok(result.errors.date);
    assert.ok(result.errors.from);
    assert.ok(result.errors.to);
    assert.ok(result.errors.train);
  });

  it('accepts a complete ride record', () => {
    const { validateRecord } = loadSettings();
    assert.deepEqual(validateRecord(validRecord), { ok: true, errors: {} });
  });
});

describe('TrainSettings storage', () => {
  it('returns an empty state when storage is empty or invalid', () => {
    const { load, STORAGE_KEY } = loadSettings();
    assert.deepEqual(load(memoryStorage()), { records: [], stations: {} });
    assert.deepEqual(load(memoryStorage({ [STORAGE_KEY]: '{not json' })), { records: [], stations: {} });
  });

  it('round-trips extra records and stations', () => {
    const { save, load } = loadSettings();
    const storage = memoryStorage();
    const state = {
      records: [validRecord],
      stations: { 汉口: [114.26, 30.62] },
    };
    save(state, storage);
    assert.deepEqual(load(storage), state);
  });

  it('appends a record and optional new station coords', () => {
    const { addRecord } = loadSettings();
    const next = addRecord(
      { records: [], stations: {} },
      validRecord,
      { 南京南: [118.81, 31.97], 汉口: [114.26, 30.62] }
    );
    assert.equal(next.records.length, 1);
    assert.equal(next.records[0].train, 'G599');
    assert.deepEqual(next.stations['南京南'], [118.81, 31.97]);
  });
});

describe('TrainSettings.serializeDataFile', () => {
  it('writes a window.TRAIN_DATA assignment in the Excel export format', () => {
    const { serializeDataFile } = loadSettings();
    const text = serializeDataFile({
      records: [validRecord],
      stations: { 南京南: [118.81, 31.97], 汉口: [114.26, 30.62] },
    });
    assert.ok(text.startsWith('window.TRAIN_DATA = '));
    assert.ok(text.endsWith(';\n'));
    const parsed = JSON.parse(text.slice('window.TRAIN_DATA = '.length, -2));
    assert.deepEqual(parsed.records, [validRecord]);
    assert.deepEqual(parsed.stations['汉口'], [114.26, 30.62]);
  });
});

describe('TrainSettings.unsavedExtra', () => {
  it('keeps only extra records and stations that are not already in the file data', () => {
    const { unsavedExtra } = loadSettings();
    const extra = unsavedExtra(
      {
        records: [validRecord],
        stations: { 南京南: [118.81, 31.97], 汉口: [114.26, 30.62] },
      },
      {
        records: [validRecord, Object.assign({}, validRecord, { train: 'G1' })],
        stations: { 汉口: [114.26, 30.62], 武汉: [114.42, 30.61] },
      }
    );
    assert.equal(extra.records.length, 1);
    assert.equal(extra.records[0].train, 'G1');
    assert.deepEqual(Object.keys(extra.stations), ['武汉']);
  });
});

describe('settings page structure', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

  it('adds a settings entry next to yearly review and a sectioned settings page', () => {
    assert.match(html, /id="settings-btn"/);
    assert.match(html, /id="settings-modal"/);
    assert.match(html, /id="settings-nav"/);
    assert.match(html, /data-panel="trip"/);
    assert.match(html, /id="settings-panel-trip"/);
    assert.match(html, /id="trip-form"/);
    assert.match(html, /id="trip-date"/);
    assert.match(html, /id="trip-from"/);
    assert.match(html, /id="trip-to"/);
    assert.match(html, /id="trip-train"/);
  });

  it('loads the settings script before app.js', () => {
    const settingsAt = html.indexOf('js/settings.js');
    const appAt = html.indexOf('js/app.js');
    assert.ok(settingsAt !== -1 && appAt !== -1);
    assert.ok(settingsAt < appAt);
  });
});
