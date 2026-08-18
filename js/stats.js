(function (root) {
  function extractVehicleType(raw) {
    return String(raw || '')
      .trim()
      .replace(/重联/g, '')
      .replace(/-\d+$/, '');
  }

  function vehicleTypesFromRecord(vehicle) {
    const types = String(vehicle || '')
      .split('+')
      .map(extractVehicleType)
      .filter(Boolean);
    return Array.from(new Set(types));
  }

  function bump(map, key, amount) {
    map[key] = (map[key] || 0) + amount;
  }

  function routeLineKey(from, to) {
    return [from, to].sort((a, b) => a.localeCompare(b, 'zh-CN')).join('↔');
  }

  function trainTypeOf(record) {
    var train = String((record && record.train) || '').trim();
    return /^[GDC]/i.test(train) ? 'emu' : 'conv';
  }

  function filterRecordsByType(records, type) {
    if (!type || type === 'all') return (records || []).slice();
    return (records || []).filter(function (record) {
      return trainTypeOf(record) === type;
    });
  }

  function computeStats(trainData) {
    const records = (trainData && trainData.records) || [];
    const routes = {};
    const lineRoutes = {};
    const stationVisits = {};
    const vehicleTypes = {};
    const bureaus = {};
    const trains = {};
    const stationNames = new Set();

    records.forEach((record) => {
      const from = record.from;
      const to = record.to;
      stationNames.add(from);
      stationNames.add(to);
      bump(routes, from + '→' + to, 1);
      bump(lineRoutes, routeLineKey(from, to), 1);
      bump(stationVisits, from, 1);
      bump(stationVisits, to, 1);
      bump(bureaus, record.bureau, 1);
      bump(trains, record.train, 1);
      vehicleTypesFromRecord(record.vehicle).forEach((type) => {
        bump(vehicleTypes, type, 1);
      });
    });

    return {
      totalRides: records.length,
      routeCount: Object.keys(routes).length,
      stationCount: stationNames.size,
      vehicleTypeCount: Object.keys(vehicleTypes).length,
      routes: routes,
      lineRoutes: lineRoutes,
      stationVisits: stationVisits,
      vehicleTypes: vehicleTypes,
      bureaus: bureaus,
      trains: trains,
    };
  }

  function listYears(records) {
    const years = new Set();
    (records || []).forEach((record) => {
      if (record && typeof record.date === 'string' && record.date.length >= 4) {
        years.add(record.date.slice(0, 4));
      }
    });
    return Array.from(years).sort();
  }

  function recordsByYear(records, year) {
    const target = String(year);
    return (records || []).filter(
      (record) => record && typeof record.date === 'string' && record.date.slice(0, 4) === target
    );
  }

  function filterRecordsByRange(records, start, end) {
    const startDate = start || '';
    const endDate = end || '';
    return (records || []).filter((record) => {
      if (!record || typeof record.date !== 'string') return false;
      if (startDate && record.date < startDate) return false;
      if (endDate && record.date > endDate) return false;
      return true;
    });
  }

  function sortedEntries(map, limit) {
    return Object.keys(map)
      .map(function (key) {
        return [key, map[key]];
      })
      .sort(function (a, b) {
        if (b[1] !== a[1]) return b[1] - a[1];
        return a[0].localeCompare(b[0], 'zh-CN');
      })
      .slice(0, limit || undefined);
  }

  function topEntries(map) {
    var entries = sortedEntries(map);
    if (!entries.length) return [];
    var maxCount = entries[0][1];
    return entries.filter(function (entry) {
      return entry[1] === maxCount;
    });
  }

  root.TrainStats = {
    extractVehicleType: extractVehicleType,
    vehicleTypesFromRecord: vehicleTypesFromRecord,
    trainTypeOf: trainTypeOf,
    filterRecordsByType: filterRecordsByType,
    computeStats: computeStats,
    routeLineKey: routeLineKey,
    listYears: listYears,
    recordsByYear: recordsByYear,
    filterRecordsByRange: filterRecordsByRange,
    sortedEntries: sortedEntries,
    topEntries: topEntries,
  };
})(typeof window !== 'undefined' ? window : globalThis);
