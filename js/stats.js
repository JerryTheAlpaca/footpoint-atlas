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

  function splitVehicleUnits(vehicle) {
    const seen = new Set();
    return String(vehicle || '')
      .replace(/重联/g, '')
      .split('+')
      .map(function (unit) {
        return unit.trim();
      })
      .filter(function (unit) {
        if (!/-\d+$/.test(unit) || seen.has(unit)) return false;
        seen.add(unit);
        return true;
      });
  }

  function byRideDate(a, b) {
    const da = String(a.date || '');
    const db = String(b.date || '');
    if (da !== db) return da < db ? -1 : 1;
    return a.index - b.index;
  }

  function reunionGroupSort(a, b) {
    if (b.count !== a.count) return b.count - a.count;
    const da = String(a.rides[a.rides.length - 1].date || '');
    const db = String(b.rides[b.rides.length - 1].date || '');
    if (da !== db) return da < db ? 1 : -1;
    return String(a.key).localeCompare(String(b.key));
  }

  function sharedUnitsAcrossRides(rides) {
    let common = null;
    for (let i = 0; i < rides.length; i++) {
      const units = splitVehicleUnits(rides[i].vehicle);
      common = common === null ? units : common.filter((unit) => units.indexOf(unit) !== -1);
      if (!common.length) return false;
    }
    return common !== null && common.length > 0;
  }

  function findRepeatedTrains(records) {
    const groups = {};
    (records || []).forEach(function (record, index) {
      if (!record) return;
      const train = String(record.train || '').trim();
      if (!train) return;
      if (!groups[train]) groups[train] = [];
      groups[train].push({
        index: index,
        date: record.date,
        from: record.from,
        to: record.to,
        vehicle: record.vehicle,
      });
    });
    return Object.keys(groups)
      .filter(function (train) {
        return groups[train].length >= 2;
      })
      .map(function (train) {
        const rides = groups[train].slice().sort(byRideDate);
        return {
          key: train,
          train: train,
          count: rides.length,
          rides: rides,
          sameVehicle: sharedUnitsAcrossRides(rides),
        };
      })
      .sort(reunionGroupSort);
  }

  function findRepeatedVehicles(records) {
    const groups = {};
    (records || []).forEach(function (record, index) {
      if (!record) return;
      splitVehicleUnits(record.vehicle).forEach(function (unit) {
        if (!groups[unit]) groups[unit] = [];
        groups[unit].push({
          index: index,
          date: record.date,
          train: record.train,
          from: record.from,
          to: record.to,
        });
      });
    });
    return Object.keys(groups)
      .filter(function (unit) {
        return groups[unit].length >= 2;
      })
      .map(function (unit) {
        const rides = groups[unit].slice().sort(byRideDate);
        const sameTrain = rides.every(function (ride) {
          return ride.train === rides[0].train;
        });
        return {
          key: unit,
          unit: unit,
          count: rides.length,
          rides: rides,
          sameTrain: sameTrain,
        };
      })
      .sort(reunionGroupSort);
  }

  function buildReunionState(records) {
    const source = records || [];
    const trains = findRepeatedTrains(source);
    const vehicles = findRepeatedVehicles(source);
    const badges = new Map();

    function addBadge(group, kind) {
      group.rides.forEach(function (ride, position) {
        if (position === 0) return;
        const record = source[ride.index];
        if (!record) return;
        if (!badges.has(record)) badges.set(record, []);
        badges.get(record).push({ kind: kind, count: position + 1 });
      });
    }

    trains.forEach(function (group) {
      addBadge(group, 'train');
    });
    vehicles.forEach(function (group) {
      addBadge(group, 'vehicle');
    });
    return { trains: trains, vehicles: vehicles, badges: badges };
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
    splitVehicleUnits: splitVehicleUnits,
    findRepeatedTrains: findRepeatedTrains,
    findRepeatedVehicles: findRepeatedVehicles,
    buildReunionState: buildReunionState,
    sortedEntries: sortedEntries,
    topEntries: topEntries,
  };
})(typeof window !== 'undefined' ? window : globalThis);
