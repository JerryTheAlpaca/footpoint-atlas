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

  function recordKey(record) {
    if (!record) return '';
    return [
      record.date,
      record.from,
      record.to,
      record.train,
      record.vehicle,
      record.origin,
      record.terminal,
      record.bureau,
    ].join('\0');
  }

  function findRecordIndex(records, record) {
    var list = records || [];
    if (!record) return -1;
    var index = list.indexOf(record);
    if (index !== -1) return index;
    var key = recordKey(record);
    if (!key) return -1;
    for (var i = 0; i < list.length; i++) {
      if (recordKey(list[i]) === key) return i;
    }
    return -1;
  }

  function removeRecord(state, record) {
    var current = state || emptyState();
    var records = (current.records || []).slice();
    var index = findRecordIndex(records, record);
    if (index !== -1) records.splice(index, 1);
    return {
      records: records,
      stations: Object.assign({}, current.stations || {}),
    };
  }

  function replaceRecord(state, oldRecord, newRecord, extraStations) {
    var current = state || emptyState();
    var records = (current.records || []).slice();
    var index = findRecordIndex(records, oldRecord);
    if (index !== -1) records[index] = newRecord;
    return {
      records: records,
      stations: Object.assign({}, current.stations || {}, extraStations || {}),
    };
  }

  function unsavedExtra(base, extra) {
    var fileData = base || emptyState();
    var local = extra || emptyState();
    var seen = {};
    (fileData.records || []).forEach(function (rec) {
      seen[recordKey(rec)] = true;
    });
    var records = (local.records || []).filter(function (rec) {
      return !seen[recordKey(rec)];
    });
    var fileStations = fileData.stations || {};
    var stations = {};
    Object.keys(local.stations || {}).forEach(function (name) {
      if (!fileStations[name]) stations[name] = local.stations[name];
    });
    return { records: records, stations: stations };
  }

  function serializeDataFile(trainData) {
    var payload = {
      records: (trainData && trainData.records) || [],
      stations: (trainData && trainData.stations) || {},
    };
    return 'window.TRAIN_DATA = ' + JSON.stringify(payload, null, 2) + ';\n';
  }

  var WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

  function pad2(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function toIsoDate(year, month, day) {
    return year + '-' + pad2(month) + '-' + pad2(day);
  }

  function parseIsoDate(value) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || '').trim());
    if (!m) return null;
    var year = Number(m[1]);
    var month = Number(m[2]);
    var day = Number(m[3]);
    var dt = new Date(year, month - 1, day);
    if (dt.getFullYear() !== year || dt.getMonth() !== month - 1 || dt.getDate() !== day) {
      return null;
    }
    return { year: year, month: month, day: day };
  }

  function shiftMonth(year, month, delta) {
    var dt = new Date(year, month - 1 + delta, 1);
    return { year: dt.getFullYear(), month: dt.getMonth() + 1 };
  }

  function todayIsoDate() {
    var now = new Date();
    return toIsoDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }

  function normalizeDateInput(raw) {
    var s = String(raw || '').trim();
    if (!s) return '';
    var parsed = parseIsoDate(s);
    if (parsed) return toIsoDate(parsed.year, parsed.month, parsed.day);
    var parts = /^(\d{4})[./-](\d{1,2})[./-](\d{1,2})$/.exec(s);
    if (parts) {
      parsed = parseIsoDate(toIsoDate(Number(parts[1]), Number(parts[2]), Number(parts[3])));
      if (parsed) return toIsoDate(parsed.year, parsed.month, parsed.day);
    }
    parts = /^(\d{4})(\d{2})(\d{2})$/.exec(s);
    if (parts) {
      parsed = parseIsoDate(parts[1] + '-' + parts[2] + '-' + parts[3]);
      if (parsed) return toIsoDate(parsed.year, parsed.month, parsed.day);
    }
    return s;
  }

  function calendarCells(year, month) {
    var firstWeekday = new Date(year, month - 1, 1).getDay();
    var daysInMonth = new Date(year, month, 0).getDate();
    var prev = shiftMonth(year, month, -1);
    var daysPrev = new Date(prev.year, prev.month, 0).getDate();
    var cells = [];
    var i;
    for (i = 0; i < firstWeekday; i++) {
      var day = daysPrev - firstWeekday + 1 + i;
      cells.push({
        year: prev.year,
        month: prev.month,
        day: day,
        iso: toIsoDate(prev.year, prev.month, day),
        inMonth: false,
      });
    }
    for (i = 1; i <= daysInMonth; i++) {
      cells.push({
        year: year,
        month: month,
        day: i,
        iso: toIsoDate(year, month, i),
        inMonth: true,
      });
    }
    var next = shiftMonth(year, month, 1);
    var nextDay = 1;
    while (cells.length < 42) {
      cells.push({
        year: next.year,
        month: next.month,
        day: nextDay,
        iso: toIsoDate(next.year, next.month, nextDay),
        inMonth: false,
      });
      nextDay += 1;
    }
    return cells;
  }

  function bindDatePicker(options) {
    options = options || {};
    var input = options.input;
    var toggle = options.toggle;
    var picker = options.picker;
    var doc = options.document || (typeof document !== 'undefined' ? document : null);
    var noop = { open: function () {}, close: function () {} };
    if (!input || !picker || !doc) return noop;

    var weekdaysEl = picker.querySelector('.date-picker-weekdays');
    var gridEl = picker.querySelector('.date-picker-grid');
    var titleEl = picker.querySelector('.date-picker-title');
    var view = { year: 0, month: 0 };
    var listening = false;

    if (weekdaysEl && !weekdaysEl.childNodes.length) {
      weekdaysEl.innerHTML = WEEKDAYS.map(function (name) {
        return '<span>' + name + '</span>';
      }).join('');
    }

    function close() {
      picker.hidden = true;
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      if (listening) {
        doc.removeEventListener('mousedown', onDocDown, true);
        doc.removeEventListener('keydown', onKey, true);
        listening = false;
      }
    }

    function onDocDown(event) {
      var target = event.target;
      if (picker.contains(target) || input.contains(target) || (toggle && toggle.contains(target))) {
        return;
      }
      close();
    }

    function onKey(event) {
      if (event.key === 'Escape') close();
    }

    function render() {
      if (titleEl) titleEl.textContent = view.year + '年' + view.month + '月';
      if (!gridEl) return;
      var selected = parseIsoDate(input.value);
      var selectedIso = selected ? toIsoDate(selected.year, selected.month, selected.day) : '';
      var today = todayIsoDate();
      gridEl.innerHTML = calendarCells(view.year, view.month)
        .map(function (cell) {
          var cls = 'date-picker-day';
          if (!cell.inMonth) cls += ' is-outside';
          if (cell.iso === today) cls += ' is-today';
          if (cell.iso === selectedIso) cls += ' is-selected';
          return (
            '<button type="button" class="' +
            cls +
            '" data-date="' +
            cell.iso +
            '">' +
            cell.day +
            '</button>'
          );
        })
        .join('');
    }

    function open() {
      var current = parseIsoDate(normalizeDateInput(input.value)) || parseIsoDate(todayIsoDate());
      view.year = current.year;
      view.month = current.month;
      render();
      picker.hidden = false;
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
      if (!listening) {
        doc.addEventListener('mousedown', onDocDown, true);
        doc.addEventListener('keydown', onKey, true);
        listening = true;
      }
    }

    input.addEventListener('focus', open);
    input.addEventListener('blur', function () {
      var next = normalizeDateInput(input.value);
      if (next && next !== input.value) input.value = next;
    });
    if (toggle) {
      toggle.addEventListener('click', function (event) {
        event.preventDefault();
        if (picker.hidden) open();
        else close();
      });
    }
    picker.addEventListener('click', function (event) {
      var nav = event.target.closest('[data-cal-nav]');
      if (nav) {
        var shifted = shiftMonth(view.year, view.month, Number(nav.getAttribute('data-cal-nav')));
        view.year = shifted.year;
        view.month = shifted.month;
        render();
        return;
      }
      var day = event.target.closest('[data-date]');
      if (!day) return;
      input.value = day.getAttribute('data-date');
      if (typeof Event === 'function') {
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
      close();
    });

    return { open: open, close: close };
  }

  root.TrainSettings = {
    STORAGE_KEY: STORAGE_KEY,
    SAVE_API: '/api/save-train-data',
    emptyState: emptyState,
    normalizeRecord: normalizeRecord,
    validateRecord: validateRecord,
    parseCoord: parseCoord,
    mergeTrainData: mergeTrainData,
    load: load,
    save: save,
    addRecord: addRecord,
    recordKey: recordKey,
    findRecordIndex: findRecordIndex,
    removeRecord: removeRecord,
    replaceRecord: replaceRecord,
    unsavedExtra: unsavedExtra,
    serializeDataFile: serializeDataFile,
    toIsoDate: toIsoDate,
    parseIsoDate: parseIsoDate,
    shiftMonth: shiftMonth,
    normalizeDateInput: normalizeDateInput,
    calendarCells: calendarCells,
    bindDatePicker: bindDatePicker,
  };
})(typeof window !== 'undefined' ? window : globalThis);
