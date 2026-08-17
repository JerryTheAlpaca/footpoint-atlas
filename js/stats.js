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

  function haversineKm(fromCoord, toCoord) {
    const R = 6371;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(toCoord[1] - fromCoord[1]);
    const dLng = toRad(toCoord[0] - fromCoord[0]);
    const lat1 = toRad(fromCoord[1]);
    const lat2 = toRad(toCoord[1]);
    const h =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
  }

  function bump(map, key, amount) {
    map[key] = (map[key] || 0) + amount;
  }

  function computeStats(trainData) {
    const records = (trainData && trainData.records) || [];
    const stations = (trainData && trainData.stations) || {};
  const routes = {};
  const stationVisits = {};
  const vehicleTypes = {};
  const bureaus = {};
  const trains = {};
    const stationNames = new Set();
    let mileageKm = 0;
    let skippedMissingCoord = 0;

    records.forEach((record) => {
      const from = record.from;
      const to = record.to;
      stationNames.add(from);
      stationNames.add(to);
      bump(routes, from + '→' + to, 1);
      bump(stationVisits, from, 1);
      bump(stationVisits, to, 1);
      bump(bureaus, record.bureau, 1);
      bump(trains, record.train, 1);
      vehicleTypesFromRecord(record.vehicle).forEach((type) => {
        bump(vehicleTypes, type, 1);
      });

      const fromCoord = stations[from];
      const toCoord = stations[to];
      if (!fromCoord || !toCoord) {
        skippedMissingCoord += 1;
        return;
      }
      mileageKm += haversineKm(fromCoord, toCoord);
    });

    return {
      totalRides: records.length,
      routeCount: Object.keys(routes).length,
      stationCount: stationNames.size,
      vehicleTypeCount: Object.keys(vehicleTypes).length,
      routes: routes,
      stationVisits: stationVisits,
      vehicleTypes: vehicleTypes,
      bureaus: bureaus,
      trains: trains,
      mileageKm: mileageKm,
      skippedMissingCoord: skippedMissingCoord,
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

  root.TrainStats = {
    extractVehicleType: extractVehicleType,
    vehicleTypesFromRecord: vehicleTypesFromRecord,
    haversineKm: haversineKm,
    computeStats: computeStats,
    listYears: listYears,
    recordsByYear: recordsByYear,
    filterRecordsByRange: filterRecordsByRange,
    sortedEntries: sortedEntries,
  };
})(typeof window !== 'undefined' ? window : globalThis);
