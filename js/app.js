(function (root) {
  var NEON = '#00e5ff';
  var GOLD = '#ffd166';
  var DEFAULT_GEO_CENTER = [104.2, 35.8];
  var DEFAULT_GEO_ZOOM = 1.45;
  var GEO_ZOOM_MIN = 0.8;
  var GEO_ZOOM_MAX = 100;
  var charts = [];
  var mapChart;
  var playTimer = null;
  var timelinePlaying = false;
  var tripPlayRaf = null;
  var tripPlayView = null;
  var savedGeoView = null;
  var focusedRecordIndex = null;
  var highlightedRoute = null;
  var visibleCount = 0;
  var allRecords = [];
  var playRecords = [];
  var stats;
  var stations = {};

  function buildGeoOption(view) {
    return {
      map: 'china',
      roam: true,
      zoom: view && typeof view.zoom === 'number' ? view.zoom : DEFAULT_GEO_ZOOM,
      center: view && Array.isArray(view.center) ? view.center : DEFAULT_GEO_CENTER,
      scaleLimit: { min: GEO_ZOOM_MIN, max: GEO_ZOOM_MAX },
      itemStyle: {
        areaColor: '#071525',
        borderColor: '#1a6f9c',
        borderWidth: 1,
        shadowColor: 'rgba(0, 229, 255, 0.18)',
        shadowBlur: 16,
      },
      emphasis: {
        itemStyle: { areaColor: '#0c2d4d' },
        label: { show: false },
      },
      label: { show: false },
    };
  }

  function readGeoView(chart) {
    if (!chart || typeof chart.getOption !== 'function') return null;
    var option = chart.getOption();
    var geo = option && option.geo && option.geo[0];
    if (!geo) return null;
    return {
      center: geo.center,
      zoom: geo.zoom,
    };
  }

  function routeLineWidth(count) {
    var rides = Math.max(1, Number(count) || 1);
    var width = 1.2 + (rides - 1) * 0.9;
    if (width > 6) width = 6;
    return width;
  }

  function stationSymbolSize(visits) {
    var n = Math.max(1, Number(visits) || 1);
    var size = 5.5 + Math.sqrt(n) * 4;
    if (size > 22) size = 22;
    return size;
  }

  var RANK_COLLAPSED_LIMIT = 3;
  var RANK_ROW_HEIGHT = 28;
  var RANK_CHART_PADDING = 16;
  var RANK_GROW_HOLD_MS = 50;

  function visibleRankEntries(entries, expanded, limit) {
    var list = Array.isArray(entries) ? entries : [];
    var cap = limit == null ? RANK_COLLAPSED_LIMIT : limit;
    if (expanded) return list.slice();
    return list.slice(0, cap);
  }

  function rankChartHeight(visibleCount) {
    var n = Math.max(1, Number(visibleCount) || 0);
    return RANK_CHART_PADDING + n * RANK_ROW_HEIGHT;
  }

  function rankExpandLayout(totalCount, limit) {
    var cap = limit == null ? RANK_COLLAPSED_LIMIT : limit;
    var collapsedCount = Math.min(Math.max(0, Number(totalCount) || 0), cap);
    var fullCount = Math.max(collapsedCount, Number(totalCount) || 0);
    return {
      fromClip: rankChartHeight(Math.max(1, collapsedCount)),
      toClip: rankChartHeight(Math.max(1, fullCount)),
      content: rankChartHeight(Math.max(1, fullCount)),
    };
  }

  function rankToggleHidden(totalCount, limit) {
    var cap = limit == null ? RANK_COLLAPSED_LIMIT : limit;
    return (Number(totalCount) || 0) <= cap;
  }

  function rankLabelWidth(text) {
    var s = String(text || '');
    var width = 0;
    for (var i = 0; i < s.length; i += 1) {
      width += s.charCodeAt(i) > 255 ? 12 : 8.2;
    }
    return width;
  }

  function rankGridLeft(entries) {
    var max = 0;
    (entries || []).forEach(function (item) {
      var width = rankLabelWidth(item && item[0]);
      if (width > max) max = width;
    });
    return Math.max(72, Math.ceil(max) + 18);
  }

  function rankBarValues(entries, grown, keepCount) {
    var keep = grown ? Number.POSITIVE_INFINITY : keepCount || 0;
    return (entries || []).map(function (item, idx) {
      return {
        name: item[0],
        value: idx < keep ? item[1] : 0,
      };
    });
  }

  function rankGrowFrom(entries) {
    return rankBarValues(entries, false);
  }

  function rankAxisMax(entries) {
    var max = 1;
    (entries || []).forEach(function (item) {
      var n = Number(item && item[1]) || 0;
      if (n > max) max = n;
    });
    return max;
  }

  function rankAnimation(enabled) {
    return {
      animation: true,
      animationDuration: enabled ? 900 : 0,
      animationDurationUpdate: enabled ? 720 : 0,
      animationEasing: 'cubicOut',
      animationEasingUpdate: 'cubicOut',
    };
  }

  function rankTweenValues(from, to, t) {
    var k = Math.max(0, Math.min(1, Number(t) || 0));
    return (to || []).map(function (item, idx) {
      var start = from && from[idx] ? Number(from[idx].value) || 0 : 0;
      var end = Number(item.value) || 0;
      return {
        name: item.name,
        value: start + (end - start) * k,
      };
    });
  }

  function rankGrowOption(entries) {
    return Object.assign(rankAnimation(true), {
      animationDuration: 720,
      animationDurationUpdate: 720,
      series: [
        {
          id: 'rank-bars',
          data: rankBarValues(entries, true),
          animationDelayUpdate: function (idx) {
            return idx * 40;
          },
        },
      ],
    });
  }

  function mapRenderOpts(replaceSeries) {
    return replaceSeries ? { replaceMerge: ['series'] } : {};
  }

  root.TrainMap = {
    buildGeoOption: buildGeoOption,
    readGeoView: readGeoView,
    routeLineWidth: routeLineWidth,
    stationSymbolSize: stationSymbolSize,
    mapRenderOpts: mapRenderOpts,
  };

  root.TrainRank = {
    COLLAPSED_LIMIT: RANK_COLLAPSED_LIMIT,
    GROW_HOLD_MS: RANK_GROW_HOLD_MS,
    visibleRankEntries: visibleRankEntries,
    rankChartHeight: rankChartHeight,
    rankExpandLayout: rankExpandLayout,
    rankToggleHidden: rankToggleHidden,
    rankGridLeft: rankGridLeft,
    rankBarValues: rankBarValues,
    rankGrowFrom: rankGrowFrom,
    rankAxisMax: rankAxisMax,
    rankAnimation: rankAnimation,
    rankTweenValues: rankTweenValues,
    rankGrowOption: rankGrowOption,
  };

  var ROUTE_CURVENESS = 0.22;
  var TRIP_PLAY_TIMING = {
    appearMs: 1200,
    startHoldMs: 1600,
    drawMs: 2400,
  };
  var TIMELINE_PLAY_TIMING = {
    appearMs: 420,
    startHoldMs: 560,
    drawMs: 2000,
  };

  function quadraticControlPoint(from, to, curveness) {
    var t = curveness == null ? ROUTE_CURVENESS : curveness;
    return [
      (from[0] + to[0]) / 2 - (from[1] - to[1]) * t,
      (from[1] + to[1]) / 2 - (to[0] - from[0]) * t,
    ];
  }

  function sampleQuadratic(p0, p1, p2, t) {
    var u = 1 - t;
    return [
      u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
      u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
    ];
  }

  function sampleRoutePolyline(from, to, curveness, steps) {
    var n = Math.max(1, Number(steps) || 32);
    var control = quadraticControlPoint(from, to, curveness);
    var points = [];
    for (var i = 0; i <= n; i += 1) {
      points.push(sampleQuadratic(from, control, to, i / n));
    }
    points[0] = from.slice();
    points[n] = to.slice();
    return points;
  }

  function slicePolylineByProgress(points, progress) {
    if (!points || !points.length) return [];
    if (progress <= 0) return [points[0].slice()];
    if (progress >= 1) {
      return points.map(function (p) {
        return p.slice();
      });
    }
    var lengths = [0];
    var total = 0;
    for (var i = 1; i < points.length; i += 1) {
      total += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
      lengths.push(total);
    }
    if (total === 0) return [points[0].slice()];
    var target = total * progress;
    var result = [points[0].slice()];
    for (var i = 1; i < points.length; i += 1) {
      if (lengths[i] < target) {
        result.push(points[i].slice());
      } else {
        var seg = lengths[i] - lengths[i - 1];
        var t = seg === 0 ? 1 : (target - lengths[i - 1]) / seg;
        result.push([
          points[i - 1][0] + (points[i][0] - points[i - 1][0]) * t,
          points[i - 1][1] + (points[i][1] - points[i - 1][1]) * t,
        ]);
        break;
      }
    }
    return result;
  }

  function easeInOutCubic(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function easeOutCubic(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return 1 - Math.pow(1 - t, 3);
  }

  function appearProgress(elapsed, startAt, duration) {
    return easeOutCubic((elapsed - startAt) / duration);
  }

  function tripSkipStations(prevVisits, rec) {
    var visits = prevVisits || {};
    var skip = {};
    if (rec && rec.from && !visits[rec.from]) skip[rec.from] = true;
    if (rec && rec.to && !visits[rec.to]) skip[rec.to] = true;
    return skip;
  }

  function tripPlayTiming(trip, timing) {
    var tmg = timing || TRIP_PLAY_TIMING;
    return {
      appearMs: tmg.appearMs,
      startHoldMs: trip && trip.startLit ? 0 : tmg.startHoldMs,
      drawMs: tmg.drawMs,
      endAppearMs: trip && trip.endLit ? 0 : tmg.appearMs,
    };
  }

  function tripStationAppearStyle(appear, fromSize, toSize) {
    var a = Math.max(0, Math.min(1, Number(appear) || 0));
    var from = Math.max(0, Number(fromSize) || 0);
    var to = toSize == null ? stationSymbolSize(1) : Math.max(0, Number(toSize));
    var newborn = from < 0.5;
    return {
      size: from + (to - from) * a,
      ringSize: newborn ? Math.max(4, to * 0.8) + a * (to * 1.6 + 8) : to + a * 8,
      ringOpacity: a <= 0 || a >= 1 ? 0 : (1 - a) * (newborn ? 0.9 : 0.4),
    };
  }

  function tripStationPoint(name, coord, appear, fromSize, toSize, visits) {
    return {
      name: name,
      value: coord.concat([visits || 1]),
      visits: visits || 1,
      appear: appear,
      fromSize: fromSize || 0,
      toSize: toSize == null ? stationSymbolSize(1) : toSize,
    };
  }

  function buildTripPlayFrame(elapsedMs, trip, timing) {
    var tmg = tripPlayTiming(trip, timing);
    var elapsed = Math.max(0, Number(elapsedMs) || 0);
    var polyline = sampleRoutePolyline(trip.fromCoord, trip.toCoord, ROUTE_CURVENESS, 48);
    var startAppear = trip.startLit ? 1 : appearProgress(elapsed, 0, tmg.appearMs);
    var stations = [];
    if (!trip.startLit) {
      stations.push(
        tripStationPoint(
          trip.from,
          trip.fromCoord,
          startAppear,
          trip.startFromSize,
          trip.startToSize,
          trip.startVisits
        )
      );
    }
    var arriveAt = tmg.startHoldMs + tmg.drawMs;
    var done = elapsed >= arriveAt + tmg.endAppearMs;
    var lineWidth = trip.lineWidth == null ? 2.4 : trip.lineWidth;
    var hideOverlayStroke = !!trip.routeLit;

    if (elapsed < tmg.startHoldMs) {
      return {
        phase: 'start',
        drawProgress: 0,
        stations: stations,
        lineCoords: [],
        lineWidth: lineWidth,
        hideOverlayStroke: hideOverlayStroke,
        head: null,
        done: false,
      };
    }

    var raw = tmg.drawMs <= 0 ? 1 : (elapsed - tmg.startHoldMs) / tmg.drawMs;
    if (raw < 1) {
      var progress = easeInOutCubic(raw);
      var lineCoords = slicePolylineByProgress(polyline, progress);
      return {
        phase: 'draw',
        drawProgress: progress,
        stations: stations,
        lineCoords: lineCoords.length >= 2 ? lineCoords : [],
        lineWidth: lineWidth,
        hideOverlayStroke: hideOverlayStroke,
        head: lineCoords.length ? lineCoords[lineCoords.length - 1].slice() : trip.fromCoord.slice(),
        done: false,
      };
    }

    if (!trip.endLit) {
      stations = stations.concat([
        tripStationPoint(
          trip.to,
          trip.toCoord,
          appearProgress(elapsed, arriveAt, tmg.endAppearMs || tmg.appearMs),
          trip.endFromSize,
          trip.endToSize,
          trip.endVisits
        ),
      ]);
    }

    return {
      phase: 'end',
      drawProgress: 1,
      stations: stations,
      lineCoords: hideOverlayStroke ? [] : polyline,
      lineWidth: lineWidth,
      hideOverlayStroke: hideOverlayStroke,
      head: null,
      done: done,
    };
  }

  function tripPlayGeoView(fromCoord, toCoord) {
    var center = [(fromCoord[0] + toCoord[0]) / 2, (fromCoord[1] + toCoord[1]) / 2];
    var lngSpan = Math.abs(fromCoord[0] - toCoord[0]);
    var latSpan = Math.abs(fromCoord[1] - toCoord[1]);
    var span = Math.max(lngSpan, latSpan, 0.25) * 2.2;
    var zoom = 55 / span;
    if (zoom < GEO_ZOOM_MIN) zoom = GEO_ZOOM_MIN;
    if (zoom > GEO_ZOOM_MAX) zoom = GEO_ZOOM_MAX;
    return { center: center, zoom: zoom };
  }

  function recordsForDisplay(records) {
    return (records || [])
      .map(function (rec, index) {
        return { rec: rec, index: index };
      })
      .reverse();
  }

  root.TrainTripPlay = {
    ROUTE_CURVENESS: ROUTE_CURVENESS,
    TRIP_PLAY_TIMING: TRIP_PLAY_TIMING,
    TIMELINE_PLAY_TIMING: TIMELINE_PLAY_TIMING,
    quadraticControlPoint: quadraticControlPoint,
    sampleRoutePolyline: sampleRoutePolyline,
    slicePolylineByProgress: slicePolylineByProgress,
    tripSkipStations: tripSkipStations,
    tripStationAppearStyle: tripStationAppearStyle,
    buildTripPlayFrame: buildTripPlayFrame,
    tripPlayGeoView: tripPlayGeoView,
  };

  root.TrainRecords = {
    recordsForDisplay: recordsForDisplay,
  };

  if (typeof document === 'undefined') return;

  function showBootError(message) {
    var el = document.getElementById('boot-error');
    el.hidden = false;
    el.textContent = message;
    document.querySelector('.app').hidden = true;
  }

  function animateNumber(el, target, suffix) {
    var start = performance.now();
    var duration = 1200;
    function tick(now) {
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - (1 - t) * (1 - t);
      el.textContent = Math.round(target * eased).toLocaleString('zh-CN') + (suffix || '');
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function warnMissingStation(name) {
    console.warn('车站缺少坐标，已跳过该点：' + name);
  }

  function recordsUpTo(count) {
    return playRecords.slice(0, count);
  }

  function buildLines(records, skipRoute) {
    var grouped = {};
    records.forEach(function (rec) {
      var key = rec.from + '→' + rec.to;
      if (!grouped[key]) grouped[key] = { from: rec.from, to: rec.to, records: [] };
      grouped[key].records.push(rec);
    });

    return Object.keys(grouped)
      .map(function (key) {
        if (skipRoute && key === skipRoute) return null;
        var group = grouped[key];
        var fromCoord = stations[group.from];
        var toCoord = stations[group.to];
        if (!fromCoord) {
          warnMissingStation(group.from);
          return null;
        }
        if (!toCoord) {
          warnMissingStation(group.to);
          return null;
        }
        return {
          id: key,
          coords: sampleRoutePolyline(fromCoord, toCoord, ROUTE_CURVENESS, 48),
          from: group.from,
          to: group.to,
          route: key,
          count: group.records.length,
          records: group.records,
          lineStyle: {
            color: highlightedRoute && highlightedRoute !== key ? 'rgba(0, 229, 255, 0.18)' : NEON,
            width: routeLineWidth(group.records.length),
            opacity: highlightedRoute === key ? 1 : 0.75,
          },
        };
      })
      .filter(Boolean);
  }

  function buildStations(records, skipNames) {
    var visits = {};
    records.forEach(function (rec) {
      visits[rec.from] = (visits[rec.from] || 0) + 1;
      visits[rec.to] = (visits[rec.to] || 0) + 1;
    });
    return Object.keys(visits)
      .map(function (name) {
        if (skipNames && skipNames[name]) return null;
        var coord = stations[name];
        if (!coord) {
          warnMissingStation(name);
          return null;
        }
        return {
          name: name,
          value: coord.concat([visits[name]]),
          visits: visits[name],
        };
      })
      .filter(Boolean);
  }

  function lineTooltip(params) {
    var data = params.data;
    if (!data || !data.records) return '';
    var rows = data.records
      .map(function (rec) {
        return (
          rec.date +
          '　' +
          rec.train +
          '<br/>车型：' +
          rec.vehicle +
          '<br/>路局：' +
          rec.bureau
        );
      })
      .join('<br/><br/>');
    return (
      data.from +
      ' → ' +
      data.to +
      '<br/>该线路乘坐次数：' +
      data.count +
      '<br/><br/>' +
      rows
    );
  }

  function mapTooltipStyle() {
    return {
      trigger: 'item',
      backgroundColor: 'rgba(5, 12, 28, 0.92)',
      borderColor: NEON,
      borderRadius: 8,
      textStyle: { color: '#e8f6ff', fontSize: 12 },
    };
  }

  function mapLineSeries(data) {
    return {
      id: 'map-lines',
      name: '线路',
      type: 'lines',
      polyline: true,
      coordinateSystem: 'geo',
      geoIndex: 0,
      zlevel: 2,
      effect: {
        show: data.length > 0,
        period: 5,
        trailLength: 0.45,
        color: GOLD,
        symbol: 'pin',
        symbolSize: 4,
      },
      tooltip: { formatter: lineTooltip },
      data: data,
    };
  }

  function mapStationSeries(data) {
    return {
      id: 'map-stations',
      name: '车站',
      type: 'effectScatter',
      coordinateSystem: 'geo',
      geoIndex: 0,
      zlevel: 3,
      rippleEffect: { brushType: 'stroke', scale: 3.2, period: 3.6 },
      symbolSize: function (val) {
        return stationSymbolSize(val[2]);
      },
      itemStyle: {
        color: NEON,
        shadowBlur: 8,
        shadowColor: NEON,
      },
      label: { show: false },
      tooltip: {
        formatter: function (params) {
          return params.name + '<br/>到访次数：' + params.data.visits;
        },
      },
      data: data,
    };
  }

  function emptyTripFrame() {
    return {
      phase: 'start',
      stations: [],
      lineCoords: [],
      lineWidth: 2.4,
      head: null,
    };
  }

  function renderMap(viewOverride, replaceSeries, animate) {
    var visible = recordsUpTo(visibleCount);
    paintMapLayers(
      buildLines(visible),
      buildStations(visible),
      emptyTripFrame(),
      viewOverride || readGeoView(mapChart),
      replaceSeries,
      animate !== false
    );
  }

  function renderMapForHighlight() {
    renderMap(null, false, false);
  }

  function tripLineSeries(name, zlevel, lineStyle, data, showEffect) {
    return {
      id: name,
      name: name,
      type: 'lines',
      polyline: true,
      coordinateSystem: 'geo',
      geoIndex: 0,
      zlevel: zlevel,
      silent: true,
      animation: false,
      effect: showEffect
        ? {
            show: true,
            period: 2.4,
            trailLength: 0.55,
            color: GOLD,
            symbol: 'circle',
            symbolSize: 5,
          }
        : { show: false },
      lineStyle: lineStyle,
      data: data,
    };
  }

  function tripStationRenderData(stations, growing, showLabel) {
    return (stations || [])
      .filter(function (station) {
        return growing ? station.appear < 1 : station.appear >= 1;
      })
      .map(function (station) {
        var style = tripStationAppearStyle(station.appear, station.fromSize, station.toSize);
        return {
          name: station.name,
          value: station.value,
          visits: station.visits,
          appear: station.appear,
          symbolSize: style.size,
          itemStyle: {
            color: NEON,
            opacity: station.fromSize > 0 ? 1 : Math.min(1, station.appear * 1.4),
          },
          label: {
            show: showLabel && station.appear > 0.5,
            formatter: '{b}',
            color: '#e8f6ff',
            fontSize: 11,
            offset: [0, -16],
          },
        };
      });
  }

  function tripStationRingData(stations) {
    return (stations || [])
      .map(function (station) {
        var style = tripStationAppearStyle(station.appear, station.fromSize, station.toSize);
        return {
          name: station.name,
          value: station.value,
          symbolSize: style.ringSize,
          itemStyle: {
            color: 'transparent',
            borderColor: NEON,
            borderWidth: 2,
            opacity: style.ringOpacity,
          },
        };
      })
      .filter(function (item) {
        return item.itemStyle.opacity > 0;
      });
  }

  function tripOverlaySeries(frame, showLabel) {
    var lineData =
      frame.hideOverlayStroke || frame.lineCoords.length < 2 ? [] : [{ coords: frame.lineCoords }];
    var headData = frame.head
      ? [{ name: '', value: frame.head.concat([1]), visits: 1 }]
      : [];
    var width = frame.lineWidth == null ? 2.4 : frame.lineWidth;
    var stationTooltip = {
      formatter: function (params) {
        return params.name;
      },
    };
    return [
      tripLineSeries(
        'trip-line',
        4,
        {
          color: NEON,
          width: width,
          opacity: 1,
        },
        lineData,
        frame.phase === 'end'
      ),
      {
        id: 'trip-head',
        name: '线头',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        geoIndex: 0,
        zlevel: 5,
        silent: true,
        animation: false,
        symbol: 'circle',
        symbolSize: 8,
        rippleEffect: { brushType: 'stroke', scale: 2.4, period: 2.2 },
        itemStyle: {
          color: GOLD,
          shadowBlur: 12,
          shadowColor: GOLD,
        },
        label: { show: false },
        data: headData,
      },
      {
        id: 'trip-rings',
        name: '车站光环',
        type: 'scatter',
        coordinateSystem: 'geo',
        geoIndex: 0,
        zlevel: 6,
        silent: true,
        animation: false,
        symbol: 'circle',
        label: { show: false },
        data: tripStationRingData(frame.stations),
      },
      {
        id: 'trip-appearing',
        name: '车站出现',
        type: 'scatter',
        coordinateSystem: 'geo',
        geoIndex: 0,
        zlevel: 7,
        animation: false,
        symbol: 'circle',
        tooltip: stationTooltip,
        data: tripStationRenderData(frame.stations, true, showLabel),
      },
      {
        id: 'trip-stations',
        name: '行程车站',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        geoIndex: 0,
        zlevel: 7,
        animation: false,
        symbol: 'circle',
        rippleEffect: { brushType: 'stroke', scale: 2.8, period: 3.2 },
        tooltip: stationTooltip,
        data: tripStationRenderData(frame.stations, false, showLabel),
      },
    ];
  }

  function paintMapLayers(lines, points, frame, geoView, replaceSeries, animateMap, showLabel) {
    mapChart.setOption(
      {
        animation: animateMap !== false,
        backgroundColor: 'transparent',
        tooltip: mapTooltipStyle(),
        geo: buildGeoOption(geoView),
        series: [mapLineSeries(lines), mapStationSeries(points)].concat(
          tripOverlaySeries(frame, showLabel !== false)
        ),
      },
      mapRenderOpts(replaceSeries)
    );
  }

  function renderTripPlayFrame(frame, geoView, overlay) {
    var bgRecords = overlay && overlay.backgroundRecords ? overlay.backgroundRecords : [];
    paintMapLayers(
      buildLines(bgRecords, overlay && overlay.skipRoute),
      buildStations(bgRecords, overlay && overlay.skipStations),
      frame,
      geoView,
      false,
      false,
      !(overlay && overlay.keepLiveView)
    );
  }

  function renderTripOverlayOnly(frame, showLabel) {
    mapChart.setOption({
      animation: false,
      series: tripOverlaySeries(frame, showLabel),
    });
  }

  function axisStyle() {
    return {
      axisLabel: { color: '#9fdfff', fontSize: 11 },
      axisLine: { lineStyle: { color: 'rgba(0, 229, 255, 0.25)' } },
      splitLine: { show: false },
    };
  }

  function barOption(entries, delayBase, grown, keepCount, enableAnimation) {
    var left = rankGridLeft(entries);
    return Object.assign(rankAnimation(enableAnimation !== false), {
      grid: { left: left, right: 36, top: 8, bottom: 8 },
      xAxis: Object.assign({ type: 'value', minInterval: 1, max: rankAxisMax(entries) }, axisStyle()),
      yAxis: Object.assign({}, axisStyle(), {
        type: 'category',
        inverse: true,
        data: entries.map(function (item) {
          return item[0];
        }),
          axisLabel: {
            color: '#c6ecff',
            fontSize: 11,
            interval: 0,
            hideOverlap: false,
            overflow: 'none',
            ellipsis: '',
          },
      }),
      series: [
        {
          id: 'rank-bars',
          type: 'bar',
          data: rankBarValues(entries, grown !== false, keepCount),
          barWidth: 10,
          animationDelay: function (idx) {
            return idx * delayBase;
          },
          animationDelayUpdate: function (idx) {
            return idx * 40;
          },
          itemStyle: {
            borderRadius: [0, 6, 6, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#044b6e' },
              { offset: 1, color: NEON },
            ]),
          },
          label: {
            show: true,
            position: 'right',
            color: GOLD,
            fontSize: 11,
            formatter: function (params) {
              var n = Math.round(Number(params.value) || 0);
              return n ? String(n) : '';
            },
          },
        },
      ],
    });
  }

  function animateClipHeight(clip, targetHeight, animate, onDone) {
    var next = Math.round(targetHeight);
    var from = Math.round(clip.getBoundingClientRect().height);
    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      if (onDone) onDone();
    }
    if (!animate || Math.abs(from - next) < 1) {
      clip.style.height = next + 'px';
      finish();
      return false;
    }
    clip.style.height = from + 'px';
    clip.offsetHeight;
    clip.style.height = next + 'px';
    function onEnd(event) {
      if (event.target !== clip || event.propertyName !== 'height') return;
      clip.removeEventListener('transitionend', onEnd);
      finish();
    }
    clip.addEventListener('transitionend', onEnd);
    setTimeout(finish, 520);
    return true;
  }

  function bindRankChart(el, entries, delayBase) {
    var clip = el.parentElement;
    var block = el.closest('.chart-block');
    var toggle = block ? block.querySelector('.rank-toggle') : null;
    var expanded = false;
    var paintSeq = 0;
    var growRaf = 0;
    var growTimer = 0;
    var startCount = Math.min(entries.length, RANK_COLLAPSED_LIMIT) || 1;
    el.style.height = rankChartHeight(startCount) + 'px';
    clip.style.height = rankChartHeight(startCount) + 'px';
    var chart = echarts.init(el);
    charts.push(chart);

    function layoutForCount(count) {
      el.style.height = rankChartHeight(count) + 'px';
      chart.resize();
    }

    function cancelGrow() {
      if (growRaf) {
        cancelAnimationFrame(growRaf);
        growRaf = 0;
      }
      if (growTimer) {
        clearTimeout(growTimer);
        growTimer = 0;
      }
    }

    function growBars(seq, visible) {
      var from = rankGrowFrom(visible);
      var to = rankBarValues(visible, true);
      var axisMax = rankAxisMax(visible);
      var startedAt = null;
      var duration = 720;
      function frame(now) {
        if (seq !== paintSeq) {
          growRaf = 0;
          return;
        }
        if (startedAt == null) startedAt = now;
        var t = Math.min(1, (now - startedAt) / duration);
        var eased = 1 - Math.pow(1 - t, 3);
        chart.setOption({
          animation: false,
          xAxis: { max: axisMax },
          series: [{ id: 'rank-bars', data: rankTweenValues(from, to, eased) }],
        });
        if (t < 1) growRaf = requestAnimationFrame(frame);
        else growRaf = 0;
      }
      growRaf = requestAnimationFrame(frame);
    }

    function paint(animateHeight) {
      var seq = (paintSeq += 1);
      cancelGrow();
      var visible = visibleRankEntries(entries, expanded);
      var layout = rankExpandLayout(entries.length);

      if (animateHeight && expanded) {
        layoutForCount(visible.length);
        chart.setOption(barOption(visible, delayBase, false, 0, false));
        chart.resize();
        animateClipHeight(clip, layout.toClip, true, function () {
          if (seq !== paintSeq || !expanded) return;
          growTimer = setTimeout(function () {
            growTimer = 0;
            if (seq !== paintSeq || !expanded) return;
            growBars(seq, visible);
          }, RANK_GROW_HOLD_MS);
        });
        return;
      }

      if (animateHeight && !expanded) {
        animateClipHeight(clip, layout.fromClip, true, function () {
          if (seq !== paintSeq) return;
          chart.setOption(barOption(visible, delayBase, true, undefined, false));
          layoutForCount(visible.length);
        });
        return;
      }

      chart.setOption(barOption(visible, delayBase, true));
      layoutForCount(visible.length);
      clip.style.height = rankChartHeight(visible.length) + 'px';
      chart.resize();
    }

    if (toggle) {
      var hideToggle = rankToggleHidden(entries.length);
      toggle.hidden = hideToggle;
      if (!hideToggle) {
        var title = block.querySelector('h2');
        var name = title ? title.textContent : '排行';
        toggle.addEventListener('click', function () {
          expanded = !expanded;
          block.classList.toggle('is-expanded', expanded);
          toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
          toggle.setAttribute('aria-label', expanded ? '收起' + name : '展开' + name);
          paint(true);
        });
      }
    }

    paint(false);
    return {
      relayout: function () {
        var visible = visibleRankEntries(entries, expanded);
        layoutForCount(visible.length);
        clip.style.height = rankChartHeight(visible.length) + 'px';
      },
    };
  }

  function renderRecords() {
    var list = document.getElementById('record-list');
    list.innerHTML = recordsForDisplay(playRecords)
      .map(function (item) {
        var rec = item.rec;
        var index = item.index;
        return (
          '<li class="record-item" data-index="' +
          index +
          '" data-route="' +
          rec.from +
          '→' +
          rec.to +
          '">' +
          '<div class="record-date">' +
          rec.date +
          '</div>' +
          '<div class="record-route">' +
          rec.from +
          ' → ' +
          rec.to +
          '</div>' +
          '<div class="record-meta">' +
          rec.train +
          ' · ' +
          rec.vehicle +
          ' · ' +
          rec.bureau +
          '</div>' +
          '</li>'
        );
      })
      .join('');
  }

  function clearRecordSelection() {
    var list = document.getElementById('record-list');
    if (!list) return;
    Array.prototype.forEach.call(list.querySelectorAll('.record-item'), function (node) {
      node.classList.remove('is-active');
      node.classList.remove('is-selected');
    });
  }

  function markSelectedRecord(index) {
    var list = document.getElementById('record-list');
    Array.prototype.forEach.call(list.querySelectorAll('.record-item'), function (node) {
      var selected = Number(node.getAttribute('data-index')) === index;
      node.classList.toggle('is-selected', selected);
      node.classList.toggle('is-active', selected);
    });
  }

  function refreshTimeLabel() {
    var count = visibleCount;
    var label = document.getElementById('time-label');
    if (count <= 0) {
      label.textContent = '尚未出发';
    } else if (count >= playRecords.length) {
      var prefix = playRecords.length === allRecords.length ? '全部足迹 ' : '本段足迹 ';
      label.textContent = prefix + playRecords[0].date.slice(0, 7) + ' → ' + playRecords[count - 1].date.slice(0, 7);
    } else {
      var rec = playRecords[count - 1];
      label.textContent = rec.date + '  ' + rec.from + ' → ' + rec.to;
    }
  }

  function exitTripPlayMode() {
    if (tripPlayRaf == null && focusedRecordIndex == null) return null;
    if (tripPlayRaf) {
      cancelAnimationFrame(tripPlayRaf);
      tripPlayRaf = null;
    }
    var view = savedGeoView;
    savedGeoView = null;
    tripPlayView = null;
    focusedRecordIndex = null;
    highlightedRoute = null;
    clearRecordSelection();
    return view;
  }

  function restoreFullMap() {
    var view = exitTripPlayMode();
    refreshTimeLabel();
    renderMap(view, true);
  }

  function stationVisitMap(records) {
    var visits = {};
    (records || []).forEach(function (rec) {
      visits[rec.from] = (visits[rec.from] || 0) + 1;
      visits[rec.to] = (visits[rec.to] || 0) + 1;
    });
    return visits;
  }

  function directedRouteCount(records, from, to) {
    var n = 0;
    (records || []).forEach(function (rec) {
      if (rec.from === from && rec.to === to) n += 1;
    });
    return n;
  }

  function makeTripModel(rec, settled, lineWidth) {
    var prevVisits = stationVisitMap(settled);
    var nextVisits = stationVisitMap((settled || []).concat([rec]));
    return {
      from: rec.from,
      to: rec.to,
      fromCoord: stations[rec.from],
      toCoord: stations[rec.to],
      startLit: !!prevVisits[rec.from],
      endLit: !!prevVisits[rec.to],
      routeLit: directedRouteCount(settled, rec.from, rec.to) > 0,
      startFromSize: prevVisits[rec.from] ? stationSymbolSize(prevVisits[rec.from]) : 0,
      startToSize: stationSymbolSize(nextVisits[rec.from] || 1),
      startVisits: nextVisits[rec.from] || 1,
      endFromSize: prevVisits[rec.to] ? stationSymbolSize(prevVisits[rec.to]) : 0,
      endToSize: stationSymbolSize(nextVisits[rec.to] || 1),
      endVisits: nextVisits[rec.to] || 1,
      lineWidth: lineWidth == null ? routeLineWidth(directedRouteCount(settled, rec.from, rec.to) + 1) : lineWidth,
    };
  }

  function runTripOverlay(opts) {
    var trip = opts.trip;
    var timing = opts.timing;
    var overlay = opts.overlay;
    if (tripPlayRaf) {
      cancelAnimationFrame(tripPlayRaf);
      tripPlayRaf = null;
    }
    function view() {
      return overlay && overlay.keepLiveView ? readGeoView(mapChart) : opts.geoView;
    }
    renderTripPlayFrame(buildTripPlayFrame(0, trip, timing), view(), overlay);
    var start = performance.now();
    function tick(now) {
      if (opts.isActive && !opts.isActive()) return;
      var frame = buildTripPlayFrame(now - start, trip, timing);
      renderTripOverlayOnly(frame, !(overlay && overlay.keepLiveView));
      if (!frame.done) {
        tripPlayRaf = requestAnimationFrame(tick);
      } else {
        tripPlayRaf = null;
        if (opts.onDone) opts.onDone();
      }
    }
    tripPlayRaf = requestAnimationFrame(tick);
  }

  function startTripPlay(index) {
    var rec = playRecords[index];
    if (!rec) return;
    var fromCoord = stations[rec.from];
    var toCoord = stations[rec.to];
    if (!fromCoord) {
      warnMissingStation(rec.from);
      return;
    }
    if (!toCoord) {
      warnMissingStation(rec.to);
      return;
    }

    stopPlay();
    if (focusedRecordIndex == null) {
      savedGeoView = readGeoView(mapChart);
    }

    focusedRecordIndex = index;
    highlightedRoute = rec.from + '→' + rec.to;
    tripPlayView = tripPlayGeoView(fromCoord, toCoord);
    markSelectedRecord(index);
    document.getElementById('time-label').textContent =
      '单程回放  ' + rec.date + '  ' + rec.from + ' → ' + rec.to;

    var trip = makeTripModel(rec, []);
    trip.lineWidth = 2.4;
    runTripOverlay({
      trip: trip,
      timing: TRIP_PLAY_TIMING,
      geoView: tripPlayView,
      overlay: { backgroundRecords: [] },
      isActive: function () {
        return focusedRecordIndex === index;
      },
    });
  }

  function bindRecordListEvents() {
    var list = document.getElementById('record-list');
    list.addEventListener('click', function (event) {
      var item = event.target.closest('.record-item');
      if (!item) return;
      startTripPlay(Number(item.getAttribute('data-index')));
    });
    list.addEventListener('mouseover', function (event) {
      if (focusedRecordIndex != null || timelinePlaying) return;
      var item = event.target.closest('.record-item');
      if (!item) return;
      var route = item.getAttribute('data-route');
      if (route === highlightedRoute) return;
      highlightedRoute = route;
      Array.prototype.forEach.call(list.querySelectorAll('.record-item'), function (node) {
        node.classList.toggle('is-active', node === item);
      });
      renderMapForHighlight();
    });
    list.addEventListener('mouseleave', function () {
      if (focusedRecordIndex != null || timelinePlaying) return;
      if (highlightedRoute == null) return;
      highlightedRoute = null;
      Array.prototype.forEach.call(list.querySelectorAll('.record-item'), function (node) {
        node.classList.remove('is-active');
      });
      renderMapForHighlight();
    });
  }

  function setVisibleCount(count) {
    var replaceSeries = focusedRecordIndex != null;
    var restoredView = exitTripPlayMode();
    if (tripPlayRaf) {
      cancelAnimationFrame(tripPlayRaf);
      tripPlayRaf = null;
    }
    visibleCount = count;
    document.getElementById('time-slider').value = String(count);
    refreshTimeLabel();
    renderMap(restoredView, replaceSeries);
  }

  function stopPlay() {
    var wasPlaying = timelinePlaying;
    timelinePlaying = false;
    if (playTimer) {
      clearInterval(playTimer);
      playTimer = null;
    }
    if (wasPlaying && focusedRecordIndex == null && tripPlayRaf) {
      cancelAnimationFrame(tripPlayRaf);
      tripPlayRaf = null;
      renderMap();
    }
    document.getElementById('play-btn').textContent = '播放';
  }

  function animateTimelineRecord(index) {
    if (!timelinePlaying) return;
    if (index >= playRecords.length) {
      stopPlay();
      return;
    }
    var rec = playRecords[index];
    if (!rec || !stations[rec.from] || !stations[rec.to]) {
      visibleCount = index + 1;
      document.getElementById('time-slider').value = String(visibleCount);
      refreshTimeLabel();
      renderMap();
      animateTimelineRecord(index + 1);
      return;
    }

    visibleCount = index + 1;
    document.getElementById('time-slider').value = String(visibleCount);
    refreshTimeLabel();

    var settled = recordsUpTo(index);
    var trip = makeTripModel(rec, settled);
    var backgroundRecords = trip.routeLit ? settled.concat([rec]) : settled;
    runTripOverlay({
      trip: trip,
      timing: TIMELINE_PLAY_TIMING,
      overlay: {
        backgroundRecords: backgroundRecords,
        skipStations: tripSkipStations(stationVisitMap(settled), rec),
        keepLiveView: true,
      },
      isActive: function () {
        return timelinePlaying && focusedRecordIndex == null && visibleCount === index + 1;
      },
      onDone: function () {
        if (!timelinePlaying) return;
        renderMap();
        animateTimelineRecord(index + 1);
      },
    });
  }

  function startPlay() {
    if (playRecords.length === 0) return;
    var restored = exitTripPlayMode();
    if (restored) renderMap(restored, true);
    if (visibleCount >= playRecords.length) {
      visibleCount = 0;
      document.getElementById('time-slider').value = '0';
      refreshTimeLabel();
      renderMap();
    }
    timelinePlaying = true;
    document.getElementById('play-btn').textContent = '暂停';
    animateTimelineRecord(visibleCount);
  }

  function currentRangeRecords() {
    var mode = document.getElementById('range-mode').value;
    if (mode === 'year') {
      return window.TrainStats.recordsByYear(allRecords, document.getElementById('range-year').value);
    }
    if (mode === 'custom') {
      return window.TrainStats.filterRecordsByRange(
        allRecords,
        document.getElementById('range-start').value,
        document.getElementById('range-end').value
      );
    }
    return allRecords;
  }

  function syncRangeControls() {
    var mode = document.getElementById('range-mode').value;
    document.getElementById('range-year').hidden = mode !== 'year';
    document.getElementById('range-start').hidden = mode !== 'custom';
    document.getElementById('range-end').hidden = mode !== 'custom';
  }

  function applyRangeFilter() {
    stopPlay();
    playRecords = currentRangeRecords();
    var slider = document.getElementById('time-slider');
    slider.max = String(playRecords.length);
    document.getElementById('play-btn').disabled = playRecords.length === 0;
    renderRecords();
    if (playRecords.length === 0) {
      var replaceSeries = focusedRecordIndex != null || tripPlayRaf != null;
      var restoredView = exitTripPlayMode();
      visibleCount = 0;
      slider.value = '0';
      document.getElementById('time-label').textContent = '该时间段无乘车记录';
      renderMap(restoredView, replaceSeries);
      return;
    }
    setVisibleCount(playRecords.length);
  }

  function populateRangeControls() {
    var years = window.TrainStats.listYears(allRecords);
    var yearSelect = document.getElementById('range-year');
    yearSelect.innerHTML = years
      .map(function (y) {
        return '<option value="' + y + '">' + y + ' 年</option>';
      })
      .join('');
    yearSelect.value = years[years.length - 1];
    var first = allRecords[0].date;
    var last = allRecords[allRecords.length - 1].date;
    var start = document.getElementById('range-start');
    var end = document.getElementById('range-end');
    start.min = first;
    start.max = last;
    start.value = first;
    end.min = first;
    end.max = last;
    end.value = last;
  }

  var reviewYear = null;

  function renderTopLines(container, entries, fallback) {
    container.textContent = '';
    if (!entries.length) {
      container.textContent = fallback;
      return;
    }
    entries.forEach(function (entry) {
      var line = document.createElement('span');
      line.className = 'review-top-line';
      line.textContent = entry[0];
      container.appendChild(line);
    });
  }

  function renderReview() {
    var years = window.TrainStats.listYears(allRecords);
    if (!reviewYear || years.indexOf(reviewYear) === -1) {
      reviewYear = years[years.length - 1];
    }
    var yearRecords = window.TrainStats.recordsByYear(allRecords, reviewYear);
    var yearStats = window.TrainStats.computeStats({ records: yearRecords, stations: stations });

    document.getElementById('review-years').innerHTML = years
      .map(function (y) {
        return (
          '<button type="button" class="review-year-btn' +
          (y === reviewYear ? ' is-active' : '') +
          '" data-year="' + y + '">' + y + '</button>'
        );
      })
      .join('');
    document.getElementById('review-title').textContent = reviewYear + ' 年度回顾';
    animateNumber(document.getElementById('review-rides'), yearStats.totalRides);
    animateNumber(document.getElementById('review-stations'), yearStats.stationCount);

    var topStations = window.TrainStats.topEntries(yearStats.stationVisits);
    renderTopLines(document.getElementById('review-top-station'), topStations, '-');
    document.getElementById('review-top-station-count').textContent = topStations.length
      ? '到访 ' + topStations[0][1] + ' 次'
      : '';

    var topRoutes = window.TrainStats.topEntries(yearStats.lineRoutes);
    renderTopLines(document.getElementById('review-top-route'), topRoutes, '-');
    document.getElementById('review-top-train').textContent = topRoutes.length
      ? '乘坐 ' + topRoutes[0][1] + ' 次'
      : '';
  }

  function openReview() {
    reviewYear = null;
    renderReview();
    document.getElementById('review-modal').hidden = false;
  }

  function closeReview() {
    document.getElementById('review-modal').hidden = true;
  }

  function replayReviewYear() {
    var year = reviewYear;
    closeReview();
    document.getElementById('range-mode').value = 'year';
    syncRangeControls();
    document.getElementById('range-year').value = year;
    applyRangeFilter();
    setVisibleCount(0);
    startPlay();
  }

  function boot() {
    if (!window.echarts) {
      showBootError('未能加载 ECharts 库（lib/echarts.min.js），请确认文件存在后刷新页面。');
      return;
    }
    if (!window.CHINA_GEOJSON) {
      showBootError('未能加载中国地图数据（map/china.json），请确认文件存在后刷新页面。');
      return;
    }
    if (!window.TRAIN_DATA || !window.TrainStats) {
      showBootError('未能加载乘车数据或统计脚本，请确认 js/data.js 与 js/stats.js 存在后刷新页面。');
      return;
    }

    stations = window.TRAIN_DATA.stations || {};
    allRecords = (window.TRAIN_DATA.records || []).slice().sort(function (a, b) {
      if (a.date === b.date) return 0;
      return a.date < b.date ? -1 : 1;
    });
    playRecords = allRecords;
    stats = window.TrainStats.computeStats(window.TRAIN_DATA);

    animateNumber(document.getElementById('stat-rides'), stats.totalRides);
    animateNumber(document.getElementById('stat-stations'), stats.stationCount);
    animateNumber(document.getElementById('stat-vehicles'), stats.vehicleTypeCount);

    if (window.TrainScale) window.TrainScale.applyPageScale();

    echarts.registerMap('china', window.CHINA_GEOJSON);
    mapChart = echarts.init(document.getElementById('map-chart'));
    charts.push(mapChart);

    var rankLayouts = [
      bindRankChart(
        document.getElementById('vehicle-chart'),
        window.TrainStats.sortedEntries(stats.vehicleTypes),
        90
      ),
      bindRankChart(
        document.getElementById('station-chart'),
        window.TrainStats.sortedEntries(stats.stationVisits),
        70
      ),
      bindRankChart(
        document.getElementById('bureau-chart'),
        window.TrainStats.sortedEntries(stats.bureaus),
        80
      ),
    ];
    renderRecords();
    bindRecordListEvents();

    populateRangeControls();
    syncRangeControls();
    document.getElementById('range-mode').addEventListener('change', function () {
      syncRangeControls();
      applyRangeFilter();
    });
    document.getElementById('range-year').addEventListener('change', applyRangeFilter);
    document.getElementById('range-start').addEventListener('change', applyRangeFilter);
    document.getElementById('range-end').addEventListener('change', applyRangeFilter);

    var slider = document.getElementById('time-slider');
    slider.max = String(playRecords.length);
    slider.addEventListener('input', function () {
      stopPlay();
      setVisibleCount(Number(slider.value));
    });
    document.getElementById('play-btn').addEventListener('click', function () {
      if (playTimer) stopPlay();
      else startPlay();
    });

    document.getElementById('review-btn').addEventListener('click', openReview);
    document.getElementById('review-close').addEventListener('click', closeReview);
    document.getElementById('review-play').addEventListener('click', replayReviewYear);
    document.querySelector('#review-modal .review-backdrop').addEventListener('click', closeReview);
    document.getElementById('review-years').addEventListener('click', function (event) {
      var btn = event.target.closest('.review-year-btn');
      if (!btn) return;
      reviewYear = btn.getAttribute('data-year');
      renderReview();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        if (focusedRecordIndex != null) {
          restoreFullMap();
          return;
        }
        closeReview();
      }
    });

    setVisibleCount(playRecords.length);

    if (window.TrainScale) window.TrainScale.applyPageScale();
    rankLayouts.forEach(function (rank) {
      rank.relayout();
    });
    charts.forEach(function (chart) {
      chart.resize();
    });

    window.addEventListener('resize', function () {
      if (window.TrainScale) window.TrainScale.applyPageScale();
      rankLayouts.forEach(function (rank) {
        rank.relayout();
      });
      charts.forEach(function (chart) {
        chart.resize();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(typeof window !== 'undefined' ? window : globalThis);
