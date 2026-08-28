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

  it('rejects impossible calendar dates', () => {
    const { validateRecord } = loadSettings();
    assert.equal(validateRecord(Object.assign({}, validRecord, { date: '2026-99-99' })).ok, false);
    assert.equal(validateRecord(Object.assign({}, validRecord, { date: '2025-02-29' })).ok, false);
    assert.equal(validateRecord(Object.assign({}, validRecord, { date: '2024-02-29' })).ok, true);
  });
});

describe('TrainSettings.parseCoord', () => {
  it('does not turn blank coordinate fields into zero', () => {
    const { parseCoord } = loadSettings();
    assert.equal(parseCoord('', ''), null);
    assert.equal(parseCoord('120.2', ''), null);
    assert.deepEqual(parseCoord('0', '0'), [0, 0]);
    assert.equal(parseCoord('181', '0'), null);
    assert.equal(parseCoord('abc', '0'), null);
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

describe('TrainSettings.replaceRecord / removeRecord', () => {
  it('replaces a record by object identity and keeps later siblings', () => {
    const { replaceRecord, findRecordIndex } = loadSettings();
    const first = Object.assign({}, validRecord, { train: 'G1' });
    const second = Object.assign({}, validRecord, { train: 'G2' });
    const next = replaceRecord(
      { records: [first, second], stations: { 南京南: [118.81, 31.97] } },
      second,
      Object.assign({}, validRecord, { train: 'G3' }),
      { 汉口: [114.26, 30.62] }
    );
    assert.equal(next.records[0].train, 'G1');
    assert.equal(next.records[1].train, 'G3');
    assert.equal(findRecordIndex(next.records, second), -1);
    assert.deepEqual(next.stations['汉口'], [114.26, 30.62]);
  });

  it('falls back to field matching when the same object is not in the list', () => {
    const { replaceRecord, removeRecord, recordKey } = loadSettings();
    const stored = Object.assign({}, validRecord);
    const copy = Object.assign({}, validRecord);
    assert.equal(recordKey(stored), recordKey(copy));
    const replaced = replaceRecord(
      { records: [stored], stations: {} },
      copy,
      Object.assign({}, validRecord, { train: 'G9' })
    );
    assert.equal(replaced.records[0].train, 'G9');
    const removed = removeRecord({ records: [stored], stations: {} }, copy);
    assert.equal(removed.records.length, 0);
  });

  it('leaves records unchanged when the target cannot be found', () => {
    const { removeRecord, replaceRecord } = loadSettings();
    const original = { records: [validRecord], stations: {} };
    const missing = Object.assign({}, validRecord, { train: 'Z1' });
    assert.equal(removeRecord(original, missing).records.length, 1);
    assert.equal(replaceRecord(original, missing, validRecord).records[0].train, 'G599');
  });
});

describe('settings page structure', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');
  const app = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');

  it('keeps desktop settings and adds a shared add-trip entry', () => {
    assert.match(html, /<button id="settings-btn" type="button">设置<\/button>/);
    assert.match(html, /id="add-trip-btn"[^>]*>添加行程<\/button>/);
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

  it('uses a custom calendar instead of the native date popup', () => {
    assert.match(html, /id="trip-date-picker"/);
    assert.match(html, /id="trip-date-toggle"/);
    assert.doesNotMatch(html, /id="trip-date"[^>]*type="date"/);
    assert.match(html, /id="range-start-picker"/);
    assert.match(html, /id="range-end-picker"/);
    assert.doesNotMatch(html, /id="range-start"[^>]*type="date"/);
    assert.doesNotMatch(html, /id="range-end"[^>]*type="date"/);
  });

  it('uses a rounded custom menu instead of the native range dropdown', () => {
    assert.match(html, /id="range-mode" hidden aria-hidden="true"/);
    assert.match(html, /id="range-mode-button"[^>]*aria-haspopup="listbox"/);
    assert.match(html, /id="range-mode-menu"[^>]*role="listbox"/);
    assert.match(html, /id="range-year" hidden aria-hidden="true"/);
    assert.match(html, /id="range-year-button"[^>]*aria-haspopup="listbox"/);
    assert.match(html, /id="range-year-menu"[^>]*role="listbox"/);
    assert.match(html, /class="range-select-option is-selected"[^>]*role="option"/);
    assert.match(css, /\.range-select-menu\s*\{[\s\S]*?border-radius:\s*11px/);
    assert.match(css, /\.range-year-menu\s*\{[\s\S]*?width:\s*112px/);
    assert.match(css, /\.range-select-option\.is-selected/);
    assert.match(app, /function bindRangeModeSelect\(\)/);
    assert.match(app, /function bindRangeYearSelect\(\)/);
    assert.match(app, /function populateRangeYearMenu\(years\)/);
    assert.match(app, /select\.dispatchEvent\(new Event\('change'/);
  });
});

describe('TrainSettings date helpers', () => {
  it('parses and pads ISO dates, and rejects invalid days', () => {
    const { parseIsoDate, toIsoDate, normalizeDateInput } = loadSettings();
    assert.deepEqual(parseIsoDate('2026-08-26'), { year: 2026, month: 8, day: 26 });
    assert.equal(parseIsoDate('2026-02-31'), null);
    assert.equal(toIsoDate(2026, 8, 6), '2026-08-06');
    assert.equal(normalizeDateInput('2026/8/26'), '2026-08-26');
    assert.equal(normalizeDateInput('20260826'), '2026-08-26');
  });

  it('builds a six-week calendar grid for August 2026', () => {
    const { calendarCells, shiftMonth } = loadSettings();
    assert.deepEqual(shiftMonth(2026, 1, -1), { year: 2025, month: 12 });
    const cells = calendarCells(2026, 8);
    assert.equal(cells.length, 42);
    assert.equal(cells[0].iso, '2026-07-26');
    assert.equal(cells[0].inMonth, false);
    assert.equal(cells[6].iso, '2026-08-01');
    assert.equal(cells[6].inMonth, true);
    assert.equal(cells[36].iso, '2026-08-31');
    assert.equal(cells[37].iso, '2026-09-01');
    assert.equal(cells[41].iso, '2026-09-05');
  });
});
