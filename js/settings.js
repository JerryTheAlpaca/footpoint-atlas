(function (root) {
  var STORAGE_KEY = 'train-footprint-user';

  function emptyState() {
    return { records: [], stations: {} };
  }

  function field(raw, key) {
    return String((raw && raw[key]) || '').trim();
  }

  function normalizeRecord(raw) {
    return {
      date: field(raw, 'date'),
      from: field(raw, 'from'),
      to: field(raw, 'to'),
      train: field(raw, 'train'),
      vehicle: field(raw, 'vehicle'),
      origin: field(raw, 'origin'),
      terminal: field(raw, 'terminal'),
      bureau: field(raw, 'bureau'),
    };
  }

  function validateRecord(record) {
    var errors = {};
    if (!record || !/^\d{4}-\d{2}-\d{2}$/.test(record.date || '')) {
      errors.date = '请填写日期';
    }
    if (!record || !record.from) errors.from = '请填写出发站';
    if (!record || !record.to) errors.to = '请填写到达站';
    if (!record || !record.train) errors.train = '请填写车次';
    return {
      ok: Object.keys(errors).length === 0,
      errors: errors,
    };
  }

  function parseCoord(lng, lat) {
    var x = Number(String(lng == null ? '' : lng).trim());
    var y = Number(String(lat == null ? '' : lat).trim());
    if (!isFinite(x) || !isFinite(y)) return null;
    if (x < -180 || x > 180 || y < -90 || y > 90) return null;
    return [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
  }

  function mergeTrainData(base, extra) {
    var a = base || {};
    var b = extra || {};
    return {
      records: (a.records || []).concat(b.records || []),
      stations: Object.assign({}, a.stations || {}, b.stations || {}),
    };
  }

  function load(storage) {
    if (!storage || typeof storage.getItem !== 'function') return emptyState();
    try {
      var raw = storage.getItem(STORAGE_KEY);
      if (!raw) return emptyState();
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return emptyState();
      return {
        records: Array.isArray(parsed.records) ? parsed.records : [],
        stations:
          parsed.stations && typeof parsed.stations === 'object' && !Array.isArray(parsed.stations)
            ? parsed.stations
            : {},
      };
    } catch (err) {
      return emptyState();
    }
  }

  function save(state, storage) {
    if (!storage || typeof storage.setItem !== 'function') return;
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        records: (state && state.records) || [],
        stations: (state && state.stations) || {},
      })
    );
  }

  function addRecord(state, record, extraStations) {
    var current = state || emptyState();
    return {
      records: (current.records || []).concat([record]),
      stations: Object.assign({}, current.stations || {}, extraStations || {}),
    };
  }

  root.TrainSettings = {
    STORAGE_KEY: STORAGE_KEY,
    emptyState: emptyState,
    normalizeRecord: normalizeRecord,
    validateRecord: validateRecord,
    parseCoord: parseCoord,
    mergeTrainData: mergeTrainData,
    load: load,
    save: save,
    addRecord: addRecord,
  };
})(typeof window !== 'undefined' ? window : globalThis);
