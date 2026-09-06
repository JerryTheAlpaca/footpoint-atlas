(function (root) {
  var NEON = '#00e5ff';
  var GOLD = '#ffd166';
  var CONV = '#16a34a';
  var ROUTE_LINE_STYLES = {
    emu: { color: NEON, type: 'solid', effectColor: GOLD },
    conv: { color: CONV, type: 'solid', effectColor: CONV },
  };
  var HIGHLIGHT_LINE_COLORS = {
    emu: '#ffffff',
    conv: '#bbf7d0',
  };
  var DIMMED_LINE_OPACITY = 0.4;
  var RESTING_LINE_OPACITY = 0.75;
  // 到访次数达到该值的车站才有闪动效果，其余只画静态圆点
  var STATION_RIPPLE_MIN_VISITS = 5;
  var DEFAULT_GEO_CENTER = [104.2, 35.8];
  // 移动端默认视野整体上移一点（中心纬度更低），给右下角"探索地图"按钮留出空间
  var DEFAULT_GEO_CENTER_COMPACT = [104.2, 34.0];
  var DEFAULT_GEO_ZOOM = 1.45;
  var GEO_ZOOM_MIN = 0.8;
  var GEO_ZOOM_MAX = 100;
  var charts = [];
  var rankLayouts = [];
  var mapChart;
  var timelinePlaying = false;
  var tripPlayRaf = null;
  var tripPlayView = null;
  var savedGeoView = null;
  var focusedRecordIndex = null;
  var highlightedRoute = null;
  var mapExploreMode = false;
  var mapRoamEnabled = true;
  var visibleCount = 0;
  var allRecords = [];
  var playRecords = [];
  var typeFilter = 'all';
  var stats;
  var stations = {};
  var mapLineByKey = {};
  var recordLinesDimmed = false;
  var recordAreaActive = false;
  var mapDisplayMode = 'curve';
  var recordRouteByKey = {};
  var reunionTrains = [];
  var reunionVehicles = [];
  var reunionBadges = new Map();
  var reunionExpanded = false;
  var tripDatePicker;
  var rangeStartPicker;
  var rangeEndPicker;
  var editingRecord = null;
  var recordMutating = false;
  var trainDataVersion = null;
  var hoverZrLine = null;
  var layoutRefreshRaf = null;
  var actionSheetRecordIndex = null;
  var LINE_ZLEVEL = 2;
  var HOVER_ZLEVEL = 10;
  // 移动端点线宽松命中的像素容差；真实径路系列优先于曲线回退系列。
  var TAP_LINE_TOLERANCE_PX = 18;
  var TAP_LINE_SERIES_ORDER = ['map-lines-emu-real', 'map-lines-conv-real', 'map-lines-emu', 'map-lines-conv'];

  // compact 显式传参便于测试；运行时不传则按当前视口判定。
  // 移动端关闭 geo 区域的 tooltip，避免点击省份时弹出省份名。
  function buildGeoOption(view, interaction, compact) {
    var roam = true;
    if (interaction && typeof interaction.roam === 'boolean') roam = interaction.roam;
    if (interaction === false) roam = false;
    var compactNow = typeof compact === 'boolean' ? compact : isCompactLayout();
    var suppressGeoTip = compactNow;
    var defaultCenter = compactNow ? DEFAULT_GEO_CENTER_COMPACT : DEFAULT_GEO_CENTER;
    return {
      map: 'china',
      roam: roam,
      zoom: view && typeof view.zoom === 'number' ? view.zoom : DEFAULT_GEO_ZOOM,
      center: view && Array.isArray(view.center) ? view.center : defaultCenter,
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
      tooltip: { show: !suppressGeoTip },
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

  function useCompactMapMarks(override) {
    if (typeof override === 'boolean') return override;
    return isCompactLayout();
  }

  function mapMarkChrome(compact) {
    if (useCompactMapMarks(compact)) {
      return {
        lineEffectSize: 2,
        tripEffectSize: 2.5,
        tripHeadSize: 4,
        stationShadow: 3,
        tripHeadShadow: 5,
        rippleScale: 2.4,
        ringBorder: 1,
        ringExtra: 3,
        hoverExtra: 0.6,
        replayLineWidth: 1.5,
        labelFont: 9,
        labelOffset: -10,
      };
    }
    return {
      lineEffectSize: 4,
      tripEffectSize: 5,
      tripHeadSize: 8,
      stationShadow: 8,
      tripHeadShadow: 12,
      rippleScale: 3.2,
      ringBorder: 2,
      ringExtra: 8,
      hoverExtra: 1.2,
      replayLineWidth: 2.4,
      labelFont: 11,
      labelOffset: -16,
    };
  }

  function routeLineWidth(count, compact) {
    var rides = Math.max(1, Number(count) || 1);
    var compactMarks = useCompactMapMarks(compact);
    var width = compactMarks ? 0.85 + (rides - 1) * 0.6 : 1.2 + (rides - 1) * 0.9;
    var cap = compactMarks ? 3.8 : 6;
    if (width > cap) width = cap;
    return width;
  }

  function stationSymbolSize(visits, compact) {
    var n = Math.max(1, Number(visits) || 1);
    var compactMarks = useCompactMapMarks(compact);
    var size = compactMarks ? 1.6 + Math.sqrt(n) * 1.0 : 3.5 + Math.sqrt(n) * 2.2;
    var cap = compactMarks ? 4.5 : 12;
    if (size > cap) size = cap;
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
    useCompactMapMarks: useCompactMapMarks,
    mapMarkChrome: mapMarkChrome,
    mapLineSeries: mapLineSeries,
    mapStationSeries: mapStationSeries,
    mapRenderOpts: mapRenderOpts,
    ROUTE_LINE_STYLES: ROUTE_LINE_STYLES,
    HIGHLIGHT_LINE_COLORS: HIGHLIGHT_LINE_COLORS,
    lineHoverStyle: lineHoverStyle,
    lineLayerOpacity: lineLayerOpacity,
    hoverLineDrawStyle: hoverLineDrawStyle,
    shouldDimMapLines: shouldDimMapLines,
    lineTooltip: lineTooltip,
    pointSegmentDistanceSq: pointSegmentDistanceSq,
    nearestLineToPixel: nearestLineToPixel,
    lineSeriesEntry: lineSeriesEntry,
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
    var chrome = mapMarkChrome();
    return {
      size: from + (to - from) * a,
      ringSize: newborn
        ? Math.max(chrome.ringBorder + 2, to * 0.8) + a * (to * 1.6 + chrome.ringExtra)
        : to + a * chrome.ringExtra,
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

  function tripFrameColors(trip) {
    return {
      lineColor: trip.lineColor || NEON,
      effectColor: trip.effectColor || GOLD,
    };
  }

  function buildTripPlayFrame(elapsedMs, trip, timing) {
    var tmg = tripPlayTiming(trip, timing);
    var elapsed = Math.max(0, Number(elapsedMs) || 0);
    var polyline =
      trip.routePoints && trip.routePoints.length >= 2
        ? trip.routePoints
        : sampleRoutePolyline(trip.fromCoord, trip.toCoord, ROUTE_CURVENESS, 48);
    var startAppear = trip.startLit ? 1 : appearProgress(elapsed, 0, tmg.appearMs);
    var stations = [];
    var colors = tripFrameColors(trip);
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
    var lineWidth = trip.lineWidth == null ? mapMarkChrome().replayLineWidth : trip.lineWidth;
    var hideOverlayStroke = !!trip.routeLit;

    if (elapsed < tmg.startHoldMs) {
      return Object.assign(colors, {
        phase: 'start',
        drawProgress: 0,
        stations: stations,
        lineCoords: [],
        lineWidth: lineWidth,
        hideOverlayStroke: hideOverlayStroke,
        head: null,
        done: false,
      });
    }

    var raw = tmg.drawMs <= 0 ? 1 : (elapsed - tmg.startHoldMs) / tmg.drawMs;
    if (raw < 1) {
      var progress = easeInOutCubic(raw);
      var lineCoords = slicePolylineByProgress(polyline, progress);
      return Object.assign(colors, {
        phase: 'draw',
        drawProgress: progress,
        stations: stations,
        lineCoords: lineCoords.length >= 2 ? lineCoords : [],
        lineWidth: lineWidth,
        hideOverlayStroke: hideOverlayStroke,
        head: lineCoords.length ? lineCoords[lineCoords.length - 1].slice() : trip.fromCoord.slice(),
        done: false,
      });
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

    return Object.assign(colors, {
      phase: 'end',
      drawProgress: 1,
      stations: stations,
      lineCoords: hideOverlayStroke ? [] : polyline,
      lineWidth: lineWidth,
      hideOverlayStroke: hideOverlayStroke,
      head: null,
      done: done,
    });
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
    escapeHtml: escapeHtml,
    recordItemHtml: recordItemHtml,
    reunionItemHtml: reunionItemHtml,
    syncActiveRecordNodes: function (nodes, activeNodes) {
      var active = activeNodes || [];
      (nodes || []).forEach(function (node) {
        node.classList.toggle('is-active', active.indexOf(node) !== -1);
      });
    },
  };

  function formatTopTrainSummary(entries) {
    var list = Array.isArray(entries) ? entries : [];
    if (!list.length) return '';
    var names = list.map(function (entry) {
      return entry[0];
    });
    var count = list[0][1];
    return '最常车次 ' + names.join('、') + (names.length > 1 ? ' · 各 ' : ' · ') + count + ' 次';
  }

  root.TrainReview = {
    formatTopTrainSummary: formatTopTrainSummary,
  };

  if (typeof document === 'undefined') return;

  function showBootError(message) {
    var el = document.getElementById('boot-error');
    el.hidden = false;
    el.textContent = message;
    document.querySelector('.app').hidden = true;
  }

  function prefersReducedMotion() {
    return !!(
      root &&
      typeof root.matchMedia === 'function' &&
      root.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function isCompactLayout() {
    if (root.TrainScale && typeof root.TrainScale.isCompactLayout === 'function') {
      var size = root.TrainScale.readViewportSize
        ? root.TrainScale.readViewportSize(root)
        : { width: root.innerWidth };
      return root.TrainScale.isCompactLayout(size.width);
    }
    return Number(root.innerWidth) > 0 && Number(root.innerWidth) <= 1024;
  }

  function animateNumber(el, target, suffix) {
    if (prefersReducedMotion()) {
      el.textContent = Math.round(target).toLocaleString('zh-CN') + (suffix || '');
      return;
    }
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

  function routeKey(from, to) {
    return from + '→' + to;
  }

  function lineKey(from, to, type) {
    return routeKey(from, to) + '|' + type;
  }

  function dimLineColor(type) {
    return type === 'conv' ? 'rgba(22, 163, 74, 0.4)' : 'rgba(0, 229, 255, 0.4)';
  }

  function lineHoverStyle(type, isTarget, dimSiblings, width) {
    var style = ROUTE_LINE_STYLES[type] || ROUTE_LINE_STYLES.emu;
    if (isTarget) {
      return {
        color: HIGHLIGHT_LINE_COLORS[type] || HIGHLIGHT_LINE_COLORS.emu,
        width: width,
        opacity: 1,
      };
    }
    return {
      color: style.color,
      width: width,
      opacity: dimSiblings ? DIMMED_LINE_OPACITY : RESTING_LINE_OPACITY,
    };
  }

  function lineLayerOpacity(dimmed) {
    if (!dimmed) return 1;
    return DIMMED_LINE_OPACITY / RESTING_LINE_OPACITY;
  }

  function hoverLineDrawStyle(type, width) {
    return {
      stroke: HIGHLIGHT_LINE_COLORS[type] || HIGHLIGHT_LINE_COLORS.emu,
      lineWidth: (Number(width) || routeLineWidth(1)) + mapMarkChrome().hoverExtra,
      opacity: 1,
    };
  }

  function shouldDimMapLines(areaActive, playing, focusedIndex) {
    var active = areaActive == null ? recordAreaActive : areaActive;
    var isPlaying = playing == null ? timelinePlaying : playing;
    var focused = focusedIndex === undefined ? focusedRecordIndex : focusedIndex;
    return !!active && !isPlaying && focused == null;
  }

  function buildLines(records, skipLineKey) {
    var grouped = {};
    records.forEach(function (rec) {
      var type = window.TrainStats.trainTypeOf(rec);
      var key = lineKey(rec.from, rec.to, type);
      if (!grouped[key]) {
        grouped[key] = { from: rec.from, to: rec.to, type: type, records: [] };
      }
      grouped[key].records.push(rec);
    });

    return Object.keys(grouped)
      .map(function (key) {
        if (skipLineKey && key === skipLineKey) return null;
        var group = grouped[key];
        var style = ROUTE_LINE_STYLES[group.type];
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
          name: key,
          coords: sampleRoutePolyline(fromCoord, toCoord, ROUTE_CURVENESS, 48),
          from: group.from,
          to: group.to,
          route: routeKey(group.from, group.to),
          trainType: group.type,
          count: group.records.length,
          records: group.records,
          lineStyle: {
            color: style.color,
            width: routeLineWidth(group.records.length),
          },
        };
      })
      .filter(Boolean);
  }

  function splitLinesByType(lines) {
    var result = { emu: [], conv: [], emuReal: [], convReal: [] };
    (lines || []).forEach(function (line) {
      var real = !!line.realPath;
      var key = (line.trainType === 'conv' ? 'conv' : 'emu') + (real ? 'Real' : '');
      result[key].push(line);
    });
    return result;
  }

  // ---------------------------------------------------------------------------
  // 真实路径优先模式：按最小物理区段聚合，未覆盖行程回退曲线。
  // ---------------------------------------------------------------------------

  function railSegmentById(segId) {
    var data = window.RAIL_ROUTE_DATA;
    if (!data || !data.segments) return null;
    for (var i = 0; i < data.segments.length; i++) {
      if (data.segments[i].id === segId) return data.segments[i];
    }
    return null;
  }

  function railNodeById(nodeId) {
    var data = window.RAIL_ROUTE_DATA;
    if (!data || !data.nodes) return null;
    for (var i = 0; i < data.nodes.length; i++) {
      if (data.nodes[i].id === nodeId) return data.nodes[i];
    }
    return null;
  }

  function majorityTrainType(records) {
    var emu = 0;
    var conv = 0;
    (records || []).forEach(function (rec) {
      if (window.TrainStats.trainTypeOf(rec) === 'conv') conv += 1;
      else emu += 1;
    });
    return conv > emu ? 'conv' : 'emu';
  }

  // 记录级稳定缓存键：日期+车次+站对。同站对不同车次可能选择
  // 不同径路（人工覆盖按 date/train 区分），以站对为键会让先解析
  // 的记录污染后续同站对记录的热度、悬停与回放。
  function recordCacheKey(rec) {
    return [rec.date || '', rec.train || '', rec.from || '', rec.to || ''].join('|');
  }

  function cachedRecordRoute(rec) {
    var key = recordCacheKey(rec);
    if (recordRouteByKey[key]) return recordRouteByKey[key];
    var route = null;
    if (window.TrainRoutes) {
      try {
        route = window.TrainRoutes.resolveRecordRoute(rec);
      } catch (err) {
        route = null;
      }
    }
    if (route) {
      route.trainType = window.TrainStats.trainTypeOf(rec);
      recordRouteByKey[key] = route;
    }
    return route || null;
  }

  function realRoutesAvailable() {
    return !!(mapDisplayMode === 'real' && window.TrainRoutes && window.RAIL_ROUTE_DATA);
  }

  // 统一坐标入口：真实模式使用经线路验证的网络锚点（与区段折线
  // 端点同源），避免静态标记、悬停与回放读两套坐标（固定基线曾有
  // 19 站与折线差 >100m）。曲线模式继续使用业务站表坐标。
  function displayCoord(name) {
    if (realRoutesAvailable() && window.TrainRoutes.nodeByName) {
      var node = window.TrainRoutes.nodeByName(name);
      if (node && node.coord) return node.coord;
    }
    return stations[name] || null;
  }

  function buildRealLines(records, skipLineKey) {
    recordRouteByKey = {};
    var segGroups = {};
    var fallback = [];
    (records || []).forEach(function (rec) {
      var type = window.TrainStats.trainTypeOf(rec);
      var key = lineKey(rec.from, rec.to, type);
      if (skipLineKey && key === skipLineKey) return;
      var route = cachedRecordRoute(rec);
      if (!route) {
        fallback.push(rec);
        return;
      }
      route.segIds.forEach(function (segId) {
        if (!segGroups[segId]) segGroups[segId] = { segId: segId, records: [] };
        segGroups[segId].records.push(rec);
      });
    });

    var lines = Object.keys(segGroups)
      .map(function (segId) {
        var group = segGroups[segId];
        var seg = railSegmentById(segId);
        if (!seg || !seg.polyline || seg.polyline.length < 2) return null;
        var type = majorityTrainType(group.records);
        var style = ROUTE_LINE_STYLES[type];
        var fromNode = railNodeById(seg.from);
        var toNode = railNodeById(seg.to);
        return {
          id: 'seg:' + segId,
          name: 'seg:' + segId,
          realPath: true,
          coords: seg.polyline,
          from: fromNode ? fromNode.name : seg.from,
          to: toNode ? toNode.name : seg.to,
          railwayName: seg.name,
          route: 'seg:' + segId,
          trainType: type,
          count: group.records.length,
          records: group.records,
          lineStyle: {
            color: style.color,
            width: routeLineWidth(group.records.length),
          },
        };
      })
      .filter(Boolean);

    return buildLines(fallback, skipLineKey).concat(lines);
  }

  function buildDisplayLines(records, skipLineKey) {
    if (realRoutesAvailable()) return buildRealLines(records, skipLineKey);
    return buildLines(records, skipLineKey);
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
        var coord = displayCoord(name);
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
    // 悬停只列乘坐记录本身：日期、车次、出发站-到达站
    var rows = data.records
      .map(function (rec) {
        return (
          escapeHtml(rec.date) +
          '　' +
          escapeHtml(rec.train) +
          '　' +
          escapeHtml(rec.from) +
          '-' +
          escapeHtml(rec.to)
        );
      })
      .join('<br/>');
    return rows;
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

  function mapLineSeries(type, data, isReal) {
    var style = ROUTE_LINE_STYLES[type] || ROUTE_LINE_STYLES.emu;
    return {
      id: 'map-lines-' + type + (isReal ? '-real' : ''),
      name: type === 'conv' ? '普速线路' : '动车线路',
      type: 'lines',
      polyline: true,
      coordinateSystem: 'geo',
      geoIndex: 0,
      zlevel: LINE_ZLEVEL,
      animation: false,
      lineStyle: {
        color: style.color,
        opacity: RESTING_LINE_OPACITY,
      },
      emphasis: { disabled: true },
      // 移动光点只走曲线（含真实模式下的回退曲线），真实径路上不放光点。
      effect: {
        show: !isReal && data.length > 0,
        period: 5,
        trailLength: 0.45,
        color: style.effectColor,
        symbol: 'circle',
        symbolSize: mapMarkChrome().lineEffectSize,
      },
      // show 显式为 true：compact 下 geo.tooltip.show=false 只应压住省份区域名，
      // 不能级联波及挂在地里坐标系上的线路/车站系列 tooltip。
      tooltip: { show: true, formatter: lineTooltip },
      data: data,
    };
  }

  function stationTooltipFormatter(params) {
    return escapeHtml(params.name) + '<br/>到访次数：' + escapeHtml(params.data.visits);
  }

  function mapStationSeries(data) {
    var all = data || [];
    var base = {
      coordinateSystem: 'geo',
      geoIndex: 0,
      zlevel: 3,
      symbolSize: function (val) {
        return stationSymbolSize(val[2]);
      },
      itemStyle: {
        color: NEON,
        shadowBlur: mapMarkChrome().stationShadow,
        shadowColor: NEON,
      },
      label: { show: false },
      tooltip: { show: true, formatter: stationTooltipFormatter },
    };
    return [
      {
        id: 'map-stations',
        name: '车站',
        type: 'scatter',
        data: all.filter(function (d) {
          return (d.visits || 0) < STATION_RIPPLE_MIN_VISITS;
        }),
      },
      {
        id: 'map-stations-ripple',
        name: '常去车站',
        type: 'effectScatter',
        rippleEffect: { brushType: 'stroke', scale: mapMarkChrome().rippleScale, period: 3.6 },
        data: all.filter(function (d) {
          return (d.visits || 0) >= STATION_RIPPLE_MIN_VISITS;
        }),
      },
    ].map(function (series) {
      return Object.assign({}, base, series);
    });
  }

  function emptyTripFrame() {
    return {
      phase: 'start',
      stations: [],
      lineCoords: [],
      lineWidth: mapMarkChrome().replayLineWidth,
      head: null,
    };
  }

  function setLineLayerDimmed(dimmed) {
    if (!mapChart || typeof mapChart.getZr !== 'function') {
      recordLinesDimmed = dimmed;
      return;
    }
    var painter = mapChart.getZr().painter;
    var layer = painter && typeof painter.getLayer === 'function' ? painter.getLayer(LINE_ZLEVEL) : null;
    if (layer && layer.dom) {
      layer.dom.style.opacity = String(lineLayerOpacity(dimmed));
    }
    recordLinesDimmed = dimmed;
  }

  function ensureHoverZrLine() {
    if (hoverZrLine || !mapChart || typeof mapChart.getZr !== 'function') return hoverZrLine;
    var Graphic = window.echarts && window.echarts.graphic;
    var Polyline = Graphic && Graphic.Polyline;
    if (!Polyline) return null;
    hoverZrLine = new Polyline({
      silent: true,
      zlevel: HOVER_ZLEVEL,
      z: 100,
      shape: { points: [] },
      style: { stroke: HIGHLIGHT_LINE_COLORS.emu, lineWidth: mapMarkChrome().replayLineWidth, opacity: 0, lineCap: 'round', lineJoin: 'round' },
    });
    mapChart.getZr().add(hoverZrLine);
    return hoverZrLine;
  }

  // —— 悬停高亮：真实模式按记录级缓存取该线路首条记录的实际径路 ——
  function cachedRouteForLine(line) {
    if (!line || !line.records || !line.records.length) return null;
    for (var i = 0; i < line.records.length; i++) {
      var r = cachedRecordRoute(line.records[i]);
      if (r && r.points && r.points.length >= 2) return r;
    }
    return null;
  }

  function highlightRouteOnMap(lineKey, dimSiblings) {
    if (!mapChart) return;
    var stayDimmed = dimSiblings !== false && shouldDimMapLines();
    if (stayDimmed !== recordLinesDimmed) {
      setLineLayerDimmed(stayDimmed);
    }
    var el = ensureHoverZrLine();
    var line = lineKey ? mapLineByKey[lineKey] : null;
    var routeRec = line && realRoutesAvailable() ? cachedRouteForLine(line) : null;
    var coords = routeRec && routeRec.points ? routeRec.points : line && line.coords ? line.coords : null;
    if (!el) return;
    if (!coords) {
      el.setStyle({ opacity: 0 });
      el.setShape({ points: [] });
      return;
    }
    var points = [];
    var i;
    for (i = 0; i < coords.length; i++) {
      var px = mapChart.convertToPixel({ geoIndex: 0 }, coords[i]);
      if (!px) {
        points = [];
        break;
      }
      points.push(px);
    }
    var type = line ? (line.trainType === 'conv' ? 'conv' : 'emu') : (routeRec && routeRec.trainType === 'conv' ? 'conv' : 'emu');
    var width = line && line.lineStyle && line.lineStyle.width ? line.lineStyle.width : 1.2;
    var draw = hoverLineDrawStyle(type, width);
    el.setShape({ points: points });
    el.setStyle({
      stroke: draw.stroke,
      lineWidth: draw.lineWidth,
      opacity: points.length ? 1 : 0,
      lineCap: 'round',
      lineJoin: 'round',
    });
  }

  function refreshHoverOverlay() {
    var wasDimmed = recordLinesDimmed;
    recordLinesDimmed = false;
    highlightRouteOnMap(highlightedRoute, wasDimmed || recordAreaActive);
  }

  // —— 移动端点线判定：手指点线很难精确命中，这里放宽到以点距折线的像素距离
  // 做宽松命中（命中后弹出该线路的 tooltip），仅在小屏（compact）布局下生效 ——

  function pointSegmentDistanceSq(px, py, ax, ay, bx, by) {
    var dx = bx - ax;
    var dy = by - ay;
    var lenSq = dx * dx + dy * dy;
    var t = lenSq > 0 ? ((px - ax) * dx + (py - ay) * dy) / lenSq : 0;
    if (t < 0) t = 0;
    else if (t > 1) t = 1;
    var cx = ax + t * dx - px;
    var cy = ay + t * dy - py;
    return cx * cx + cy * cy;
  }

  // geo 坐标系无旋转，用两次 convertToPixel 推导线性变换，避免逐点换算。
  function geoPixelTransform(chart) {
    if (!chart || typeof chart.convertToPixel !== 'function') return null;
    var origin = chart.convertToPixel({ geoIndex: 0 }, [0, 0]);
    var step = chart.convertToPixel({ geoIndex: 0 }, [10, 10]);
    if (!origin || !step || step[0] === origin[0] || step[1] === origin[1]) return null;
    return {
      ox: origin[0],
      oy: origin[1],
      sx: (step[0] - origin[0]) / 10,
      sy: (step[1] - origin[1]) / 10,
    };
  }

  function nearestLineToPixel(x, y, tolerance, lines, toPixel) {
    var tolSq = tolerance * tolerance;
    var best = null;
    var bestDistSq = Infinity;
    for (var name in lines) {
      var line = lines[name];
      var coords = line && line.coords;
      if (!coords || coords.length < 2) continue;
      var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (var b = 0; b < coords.length; b++) {
        if (coords[b][0] < minX) minX = coords[b][0];
        if (coords[b][0] > maxX) maxX = coords[b][0];
        if (coords[b][1] < minY) minY = coords[b][1];
        if (coords[b][1] > maxY) maxY = coords[b][1];
      }
      var tl = toPixel([minX, minY]);
      var br = toPixel([maxX, maxY]);
      if (!tl || !br) continue;
      if (
        x < Math.min(tl[0], br[0]) - tolerance ||
        x > Math.max(tl[0], br[0]) + tolerance ||
        y < Math.min(tl[1], br[1]) - tolerance ||
        y > Math.max(tl[1], br[1]) + tolerance
      ) {
        continue;
      }
      var prev = toPixel(coords[0]);
      for (var i = 1; i < coords.length; i++) {
        var p = toPixel(coords[i]);
        var dSq = pointSegmentDistanceSq(x, y, prev[0], prev[1], p[0], p[1]);
        if (dSq < bestDistSq) {
          bestDistSq = dSq;
          best = line;
        }
        prev = p;
      }
    }
    return bestDistSq <= tolSq ? best : null;
  }

  function findLineNearPixel(x, y, tolerance) {
    if (!mapChart) return null;
    var t = geoPixelTransform(mapChart);
    if (!t) return null;
    return nearestLineToPixel(x, y, tolerance, mapLineByKey, function (lonlat) {
      return [t.ox + lonlat[0] * t.sx, t.oy + lonlat[1] * t.sy];
    });
  }

  function lineSeriesEntry(lineName, seriesList) {
    var series = seriesList || [];
    for (var s = 0; s < TAP_LINE_SERIES_ORDER.length; s++) {
      for (var i = 0; i < series.length; i++) {
        if (series[i].id !== TAP_LINE_SERIES_ORDER[s]) continue;
        var data = series[i].data || [];
        for (var j = 0; j < data.length; j++) {
          if (data[j] && data[j].name === lineName) {
            return { seriesIndex: i, dataIndex: j };
          }
        }
      }
    }
    return null;
  }

  function handleLooseLineTap(x, y) {
    if (!mapChart) return;
    var line = findLineNearPixel(x, y, TAP_LINE_TOLERANCE_PX);
    var entry = line ? lineSeriesEntry(line.name, (mapChart.getOption() || {}).series) : null;
    if (entry) {
      mapChart.dispatchAction({ type: 'showTip', seriesIndex: entry.seriesIndex, dataIndex: entry.dataIndex });
    } else {
      mapChart.dispatchAction({ type: 'hideTip' });
    }
  }

  function bindMapTapHit() {
    if (!mapChart || typeof mapChart.getZr !== 'function') return;
    var nativeSeriesHit = false;
    // 点到车站/线路元素时 ECharts 原生行为优先，宽松命中只在没点到任何系列时补位。
    mapChart.on('click', function (params) {
      nativeSeriesHit = !!(params && params.componentType && params.componentType !== 'geo');
    });
    mapChart.getZr().on('click', function (e) {
      if (!isCompactLayout()) return;
      var skip = nativeSeriesHit;
      nativeSeriesHit = false;
      if (skip) return;
      handleLooseLineTap(e.offsetX, e.offsetY);
    });
  }

  function renderMap(viewOverride, replaceSeries) {
    var visible = recordsUpTo(visibleCount);
    paintMapLayers(
      buildDisplayLines(visible),
      buildStations(visible),
      emptyTripFrame(),
      viewOverride || readGeoView(mapChart),
      replaceSeries,
      true
    );
    if (shouldDimMapLines() && highlightedRoute) highlightRouteOnMap(highlightedRoute, true);
  }

  function syncMapDisplayControls() {
    var curveRadio = document.getElementById('map-display-curve');
    var realRadio = document.getElementById('map-display-real');
    if (curveRadio) curveRadio.checked = mapDisplayMode === 'curve';
    if (realRadio) realRadio.checked = mapDisplayMode === 'real';
  }

  // 切换显示模式：保留地图中心、缩放、筛选与时间轴位置；
  // 自动回放中停在当前进度重绘，单次播放中结束动画并恢复地图。
  function setMapDisplayMode(mode) {
    if (mode !== 'curve' && mode !== 'real') return;
    if (mode === mapDisplayMode) return;
    mapDisplayMode = mode;
    if (window.TrainRoutes) {
      window.TrainRoutes.writeDisplayMode(window.localStorage, mode);
    }
    // 切换显示模式时同步默认列车类别筛选：曲线→全部，真实路径优先→动车
    var defaultType = mode === 'real' ? 'emu' : 'all';
    if (typeFilter !== defaultType) {
      typeFilter = defaultType;
      syncTypeFilterButtons();
      applyRangeFilter();
      syncMapDisplayControls();
      return;
    }
    if (timelinePlaying) {
      stopPlay();
    } else if (focusedRecordIndex != null || tripPlayRaf) {
      restoreFullMap();
    } else if (mapChart) {
      renderMap(readGeoView(mapChart), true);
    }
    syncMapDisplayControls();
  }

  function syncMapExploreButton() {
    var button = document.getElementById('map-explore-btn');
    var viewport = document.querySelector('.map-viewport');
    var compact = isCompactLayout();
    if (button) {
      button.hidden = !compact;
      button.textContent = mapExploreMode ? '退出地图' : '探索地图';
      button.setAttribute('aria-pressed', mapExploreMode ? 'true' : 'false');
      button.setAttribute('aria-label', mapExploreMode ? '退出地图探索模式' : '进入地图探索模式');
    }
    if (viewport) viewport.classList.toggle('is-exploring', mapExploreMode);
  }

  function setMapExploreMode(enabled) {
    mapExploreMode = isCompactLayout() && !!enabled;
    syncMapExploreButton();
    if (!mapChart) return;
    mapChart.setOption({ geo: { roam: mapRoamEnabled || mapExploreMode } }, false);
  }

  function bindMapExplore() {
    var button = document.getElementById('map-explore-btn');
    if (!button) return;
    button.addEventListener('click', function () {
      setMapExploreMode(!mapExploreMode);
    });
    syncMapExploreButton();
  }

  function tripLineSeries(name, zlevel, lineStyle, data, showEffect, effectColor) {
    var trailColor = effectColor || GOLD;
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
            color: trailColor,
            symbol: 'circle',
            symbolSize: mapMarkChrome().tripEffectSize,
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
            fontSize: mapMarkChrome().labelFont,
            offset: [0, mapMarkChrome().labelOffset],
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
            borderWidth: mapMarkChrome().ringBorder,
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
    var width = frame.lineWidth == null ? mapMarkChrome().replayLineWidth : frame.lineWidth;
    var lineColor = frame.lineColor || NEON;
    var effectColor = frame.effectColor || GOLD;
    var stationTooltip = {
      show: true,
      formatter: function (params) {
        return escapeHtml(params.name);
      },
    };
    return [
      tripLineSeries(
        'trip-line',
        4,
        {
          color: lineColor,
          width: width,
          opacity: 1,
        },
        lineData,
        // 描绘阶段的移动光点由 trip-head（effectScatter）负责；
        // lines 系列的 effect 光点总是从 polyline 起点开始跑，若在 end 阶段开启，
        // 会导致画完后起点处再次冒出一颗光点向前爬行、随后随下一条线开始而消失。
        false,
        effectColor
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
        symbolSize: mapMarkChrome().tripHeadSize,
        rippleEffect: { brushType: 'stroke', scale: 2.4, period: 2.2 },
        itemStyle: {
          color: effectColor,
          shadowBlur: mapMarkChrome().tripHeadShadow,
          shadowColor: effectColor,
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
    var split = splitLinesByType(lines);
    mapLineByKey = {};
    (lines || []).forEach(function (line) {
      mapLineByKey[line.name] = line;
    });
    recordLinesDimmed = false;
    mapChart.setOption(
      {
        animation: animateMap !== false && !prefersReducedMotion(),
        backgroundColor: 'transparent',
        tooltip: mapTooltipStyle(),
        geo: buildGeoOption(geoView, { roam: mapRoamEnabled || mapExploreMode }),
        series: [
          mapLineSeries('emu', split.emu),
          mapLineSeries('conv', split.conv),
          mapLineSeries('emu', split.emuReal, true),
          mapLineSeries('conv', split.convReal, true),
        ]
          .concat(mapStationSeries(points))
          .concat(tripOverlaySeries(frame, showLabel !== false)),
      },
      mapRenderOpts(replaceSeries)
    );
    if (hoverZrLine) {
      hoverZrLine.setStyle({ opacity: 0 });
      hoverZrLine.setShape({ points: [] });
    }
    setLineLayerDimmed(false);
  }

  function renderTripPlayFrame(frame, geoView, overlay) {
    var bgRecords = overlay && overlay.backgroundRecords ? overlay.backgroundRecords : [];
    paintMapLayers(
      buildDisplayLines(bgRecords, overlay && overlay.skipLineKey),
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
    if (toggle) {
      var freshToggle = toggle.cloneNode(true);
      toggle.parentNode.replaceChild(freshToggle, toggle);
      toggle = freshToggle;
      block.classList.remove('is-expanded');
      toggle.setAttribute('aria-expanded', 'false');
    }
    var existing = window.echarts && typeof window.echarts.getInstanceByDom === 'function'
      ? window.echarts.getInstanceByDom(el)
      : null;
    if (existing) existing.dispose();
    var expanded = false;
    var motionEnabled = !prefersReducedMotion();
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
      motionEnabled = !prefersReducedMotion();
      cancelGrow();
      var visible = visibleRankEntries(entries, expanded);
      var layout = rankExpandLayout(entries.length);

      if (animateHeight && motionEnabled && expanded) {
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

      if (animateHeight && motionEnabled && !expanded) {
        animateClipHeight(clip, layout.fromClip, true, function () {
          if (seq !== paintSeq) return;
          chart.setOption(barOption(visible, delayBase, true, undefined, false));
          layoutForCount(visible.length);
        });
        return;
      }

      chart.setOption(barOption(visible, delayBase, true, undefined, motionEnabled));
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
      chart: chart,
      relayout: function () {
        var visible = visibleRankEntries(entries, expanded);
        layoutForCount(visible.length);
        clip.style.height = rankChartHeight(visible.length) + 'px';
      },
      dispose: function () {
        cancelGrow();
        chart.dispose();
      },
    };
  }

  function renderRecords() {
    hideRecordContextMenu();
    var list = document.getElementById('record-list');
    list.innerHTML = recordsForDisplay(playRecords)
      .map(function (item) {
        return recordItemHtml(item, reunionBadges.get(item.rec) || []);
      })
      .join('');
  }

  function recordItemHtml(item, badges) {
    var rec = item.rec;
    var index = item.index;
    var type = window.TrainStats.trainTypeOf(rec);
    var metaParts = [rec.train];
    if (rec.vehicle) metaParts.push(rec.vehicle);
    if (rec.bureau) metaParts.push(rec.bureau);
    var badgeHtml = (badges || [])
      .map(function (badge) {
        return (
          '<span class="reunion-badge reunion-badge-' +
          escapeHtml(badge.kind) +
          '">' +
          (badge.kind === 'vehicle' ? '车号重逢' : '车次重逢') +
          '×' +
          escapeHtml(badge.count) +
          '</span>'
        );
      })
      .join('');
    var lineKeyValue = lineKey(rec.from, rec.to, type);
    return (
      '<li class="record-item is-' +
      escapeHtml(type) +
      '" data-index="' +
      escapeHtml(index) +
      '" tabindex="0" aria-label="' +
      escapeHtml(rec.date + ' ' + rec.from + ' 到 ' + rec.to + '，' + rec.train) +
      '" data-route="' +
      escapeHtml(rec.from + '→' + rec.to) +
      '" data-type="' +
      escapeHtml(type) +
      '" data-line-key="' +
      escapeHtml(lineKeyValue) +
      '">' +
      '<div class="record-date">' +
      escapeHtml(rec.date) +
      '</div>' +
      '<div class="record-route">' +
      escapeHtml(rec.from) +
      ' → ' +
      escapeHtml(rec.to) +
      '</div>' +
      '<div class="record-meta">' +
      metaParts.map(escapeHtml).join(' · ') +
      badgeHtml +
      '</div>' +
      '<button type="button" class="record-more" data-record-action="more" aria-label="打开此记录的操作菜单"><span aria-hidden="true">···</span></button>' +
      '</li>'
    );
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

  function computeReunions(records) {
    var state = window.TrainStats.buildReunionState(records || []);
    reunionTrains = state.trains;
    reunionVehicles = state.vehicles;
    reunionBadges = state.badges;
  }

  function reunionItemHtml(kind, groupIndex, name, count, sameTrainAndVehicle, rideLines) {
    return (
      '<li class="reunion-item" data-kind="' +
      kind +
      '" data-group="' +
      groupIndex +
      '">' +
      '<div class="reunion-item-head">' +
      '<span class="reunion-item-name">' +
      escapeHtml(name) +
      '</span>' +
      '<span class="reunion-item-count">×' +
      escapeHtml(count) +
      '</span>' +
      (sameTrainAndVehicle ? '<span class="reunion-item-tag">同车重逢</span>' : '') +
      '</div>' +
      '<div class="reunion-item-rides">' +
      rideLines
        .map(function (text) {
          return '<span>' + escapeHtml(text) + '</span>';
        })
        .join('') +
      '</div>' +
      '</li>'
    );
  }

  function setReunionSummaryCount(el, count) {
    if (!el) return;
    el.hidden = count <= 0;
    var value = el.querySelector('.reunion-summary-count');
    if (value) value.textContent = String(count);
  }

  function setReunionExpanded(expanded) {
    var next = !!expanded;
    var wasExpanded = reunionExpanded;
    reunionExpanded = next;
    var block = document.getElementById('reunion-block');
    if (!block) return;
    var details = document.getElementById('reunion-details');
    var toggle = block.querySelector('.reunion-toggle');
    block.classList.toggle('is-expanded', reunionExpanded);
    if (details) details.hidden = !reunionExpanded;
    if (toggle) {
      toggle.setAttribute('aria-expanded', reunionExpanded ? 'true' : 'false');
      toggle.setAttribute('aria-label', reunionExpanded ? '收起相遇重逢' : '展开相遇重逢');
    }
    if (wasExpanded && !reunionExpanded) clearReunionHover();
  }

  function renderReunions() {
    var block = document.getElementById('reunion-block');
    if (!block) return;
    var scene = block.closest('.reunion-scene');
    var vehicleWrap = document.getElementById('reunion-vehicles');
    var trainWrap = document.getElementById('reunion-trains');
    var vehicleList = document.getElementById('reunion-vehicle-list');
    var trainList = document.getElementById('reunion-train-list');
    var hasVehicles = reunionVehicles.length > 0;
    var hasTrains = reunionTrains.length > 0;
    vehicleWrap.hidden = !hasVehicles;
    trainWrap.hidden = !hasTrains;
    block.hidden = !hasVehicles && !hasTrains;
    if (scene) scene.hidden = block.hidden;
    setReunionSummaryCount(document.getElementById('reunion-vehicle-summary'), reunionVehicles.length);
    setReunionSummaryCount(document.getElementById('reunion-train-summary'), reunionTrains.length);
    setReunionExpanded(reunionExpanded);
    if (block.hidden) return;
    vehicleList.innerHTML = reunionVehicles
      .map(function (group, index) {
        return reunionItemHtml(
          'vehicle',
          index,
          group.unit,
          group.count,
          group.sameTrain,
          group.rides.map(function (ride) {
            return ride.date + ' ' + ride.train + ' ' + ride.from + '→' + ride.to;
          })
        );
      })
      .join('');
    trainList.innerHTML = reunionTrains
      .map(function (group, index) {
        return reunionItemHtml(
          'train',
          index,
          group.train,
          group.count,
          group.sameVehicle,
          group.rides.map(function (ride) {
            return (
              ride.date +
              ' ' +
              ride.from +
              '→' +
              ride.to +
              (ride.vehicle ? ' ' + ride.vehicle : '')
            );
          })
        );
      })
      .join('');
  }

  function reunionGroupOf(item) {
    var kind = item.getAttribute('data-kind');
    var groupIndex = Number(item.getAttribute('data-group'));
    var groups = kind === 'vehicle' ? reunionVehicles : reunionTrains;
    return groups[groupIndex] || null;
  }

  function reunionRecordNodes(group) {
    var list = document.getElementById('record-list');
    var nodes = [];
    if (!list || !group) return nodes;
    group.rides.forEach(function (ride) {
      var node = list.querySelector('.record-item[data-index="' + ride.index + '"]');
      if (node) nodes.push(node);
    });
    return nodes;
  }

  function clearReunionHover() {
    var block = document.getElementById('reunion-block');
    recordAreaActive = false;
    if (block) {
      Array.prototype.forEach.call(block.querySelectorAll('.reunion-item'), function (node) {
        node.classList.remove('is-active');
      });
    }
    var list = document.getElementById('record-list');
    if (list) {
      Array.prototype.forEach.call(list.querySelectorAll('.record-item'), function (node) {
        node.classList.remove('is-active');
      });
    }
    if (focusedRecordIndex != null || timelinePlaying) {
      setLineLayerDimmed(false);
      return;
    }
    highlightedRoute = null;
    highlightRouteOnMap(null, false);
  }

  function bindReunionEvents() {
    var block = document.getElementById('reunion-block');
    if (!block) return;
    block.addEventListener('mouseover', function (event) {
      if (focusedRecordIndex != null || timelinePlaying) return;
      var item = event.target.closest('.reunion-item');
      if (!item) return;
      var group = reunionGroupOf(item);
      if (!group) return;
      var latest = group.rides[group.rides.length - 1];
      highlightedRoute = lineKey(latest.from, latest.to, window.TrainStats.trainTypeOf(latest));
      recordAreaActive = true;
      Array.prototype.forEach.call(block.querySelectorAll('.reunion-item'), function (node) {
        node.classList.toggle('is-active', node === item);
      });
      var list = document.getElementById('record-list');
      if (list) {
        window.TrainRecords.syncActiveRecordNodes(
          Array.prototype.slice.call(list.querySelectorAll('.record-item')),
          reunionRecordNodes(group)
        );
      }
      highlightRouteOnMap(highlightedRoute, true);
    });
    block.addEventListener('mouseleave', clearReunionHover);
    block.addEventListener('click', function (event) {
      var item = event.target.closest('.reunion-item');
      if (item) {
        var group = reunionGroupOf(item);
        if (!group) return;
        var latest = group.rides[group.rides.length - 1];
        var playIndex = latest.index;
        markSelectedRecord(playIndex);
        var list = document.getElementById('record-list');
        if (!list) return;
        var node = list.querySelector('.record-item[data-index="' + playIndex + '"]');
        if (node) node.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        return;
      }
      if (event.target.closest('.reunion-toggle, .reunion-summary, h2')) {
        setReunionExpanded(!reunionExpanded);
      }
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
    var type = window.TrainStats.trainTypeOf(rec);
    var style = ROUTE_LINE_STYLES[type];
    var routePoints = null;
    if (realRoutesAvailable()) {
      var route = cachedRecordRoute(rec);
      if (route && route.points && route.points.length >= 2) routePoints = route.points;
    }
    return {
      from: rec.from,
      to: rec.to,
      fromCoord: displayCoord(rec.from),
      toCoord: displayCoord(rec.to),
      routePoints: routePoints,
      trainType: type,
      lineColor: style.color,
      effectColor: style.effectColor,
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
    var fromCoord = displayCoord(rec.from);
    var toCoord = displayCoord(rec.to);
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
    highlightedRoute = lineKey(rec.from, rec.to, window.TrainStats.trainTypeOf(rec));
    tripPlayView = tripPlayGeoView(fromCoord, toCoord);
    markSelectedRecord(index);
    document.getElementById('time-label').textContent =
      '单程回放  ' + rec.date + '  ' + rec.from + ' → ' + rec.to;

    var trip = makeTripModel(rec, []);
    trip.lineWidth = mapMarkChrome().replayLineWidth;
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

  function hideRecordContextMenu() {
    var menu = document.getElementById('record-context-menu');
    if (menu) menu.hidden = true;
  }

  function closeRecordActionSheet() {
    var sheet = document.getElementById('record-action-sheet');
    if (sheet) sheet.hidden = true;
    actionSheetRecordIndex = null;
  }

  function openRecordActionSheet(index) {
    var sheet = document.getElementById('record-action-sheet');
    var rec = playRecords[index];
    if (!sheet || !rec) return;
    actionSheetRecordIndex = index;
    var title = document.getElementById('record-action-title');
    if (title) title.textContent = rec.date + ' · ' + rec.from + ' → ' + rec.to;
    sheet.hidden = false;
    var edit = sheet.querySelector('[data-action="edit"]');
    if (edit && typeof edit.focus === 'function') edit.focus({ preventScroll: true });
  }

  function showRecordContextMenu(event, index) {
    var menu = document.getElementById('record-context-menu');
    if (!menu) return;
    menu.setAttribute('data-index', String(index));
    menu.hidden = false;
    menu.style.visibility = 'hidden';
    menu.style.left = '0px';
    menu.style.top = '0px';
    var width = menu.offsetWidth;
    var height = menu.offsetHeight;
    var pad = 8;
    var x = event.clientX;
    var y = event.clientY;
    if (x + width > window.innerWidth - pad) x = Math.max(pad, window.innerWidth - width - pad);
    if (y + height > window.innerHeight - pad) y = Math.max(pad, window.innerHeight - height - pad);
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.style.visibility = '';
  }

  function bindRecordListEvents() {
    var list = document.getElementById('record-list');
    var panel = list.closest('.record-panel') || list;
    function activateRecordItem(item) {
      if (!item || focusedRecordIndex != null || timelinePlaying) return;
      var lineKeyValue = item.getAttribute('data-line-key');
      if (lineKeyValue === highlightedRoute && recordAreaActive) return;
      highlightedRoute = lineKeyValue;
      recordAreaActive = true;
      Array.prototype.forEach.call(list.querySelectorAll('.record-item'), function (node) {
        node.classList.toggle('is-active', node === item);
      });
      highlightRouteOnMap(lineKeyValue, true);
    }
    list.addEventListener('click', function (event) {
      var more = event.target.closest('.record-more');
      if (more) {
        event.preventDefault();
        event.stopPropagation();
        openRecordActionSheet(Number(more.closest('.record-item').getAttribute('data-index')));
        return;
      }
      var item = event.target.closest('.record-item');
      if (!item) return;
      startTripPlay(Number(item.getAttribute('data-index')));
    });
    list.addEventListener('keydown', function (event) {
      if (event.target.closest('.record-more')) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;
      var item = event.target.closest('.record-item');
      if (!item) return;
      event.preventDefault();
      startTripPlay(Number(item.getAttribute('data-index')));
    });
    list.addEventListener('contextmenu', function (event) {
      var item = event.target.closest('.record-item');
      if (!item) return;
      event.preventDefault();
      if (isCompactLayout()) {
        openRecordActionSheet(Number(item.getAttribute('data-index')));
        return;
      }
      showRecordContextMenu(event, Number(item.getAttribute('data-index')));
    });
    list.addEventListener('scroll', hideRecordContextMenu);
    list.addEventListener('pointerdown', function (event) {
      var item = event.target.closest('.record-item');
      if (item) item.classList.add('is-touching');
    }, { passive: true });
    list.addEventListener('pointerup', function (event) {
      var item = event.target.closest('.record-item');
      if (item) item.classList.remove('is-touching');
    }, { passive: true });
    list.addEventListener('pointercancel', function (event) {
      var item = event.target.closest('.record-item');
      if (item) item.classList.remove('is-touching');
    }, { passive: true });
    panel.addEventListener('mouseenter', function () {
      if (focusedRecordIndex != null || timelinePlaying) return;
      recordAreaActive = true;
      highlightRouteOnMap(highlightedRoute, true);
    });
    list.addEventListener('mouseover', function (event) {
      if (focusedRecordIndex != null || timelinePlaying) return;
      var item = event.target.closest('.record-item');
      if (!item) return;
      activateRecordItem(item);
    });
    list.addEventListener('focusin', function (event) {
      var item = event.target.closest('.record-item');
      if (!item || event.target.closest('.record-more')) return;
      activateRecordItem(item);
    });
    panel.addEventListener('mouseleave', function () {
      recordAreaActive = false;
      Array.prototype.forEach.call(list.querySelectorAll('.record-item'), function (node) {
        node.classList.remove('is-active');
      });
      if (focusedRecordIndex != null || timelinePlaying) {
        setLineLayerDimmed(false);
        return;
      }
      highlightedRoute = null;
      highlightRouteOnMap(null, false);
    });
  }

  function bindRecordContextMenu() {
    var menu = document.getElementById('record-context-menu');
    if (!menu) return;
    menu.addEventListener('contextmenu', function (event) {
      event.preventDefault();
    });
    menu.addEventListener('click', function (event) {
      var btn = event.target.closest('[data-action]');
      if (!btn) return;
      var index = Number(menu.getAttribute('data-index'));
      var action = btn.getAttribute('data-action');
      hideRecordContextMenu();
      var rec = playRecords[index];
      if (!rec) return;
      if (action === 'edit') startEditRecord(rec);
      if (action === 'delete') deleteRideRecord(rec);
    });
    document.addEventListener('click', function (event) {
      if (menu.hidden) return;
      if (event.target.closest('#record-context-menu')) return;
      hideRecordContextMenu();
    });
    document.addEventListener('contextmenu', function (event) {
      if (event.target.closest('#record-context-menu, .record-item')) return;
      hideRecordContextMenu();
    });
  }

  function bindRecordActionSheet() {
    var sheet = document.getElementById('record-action-sheet');
    if (!sheet) return;
    sheet.addEventListener('click', function (event) {
      if (event.target.closest('[data-record-action-close]')) {
        closeRecordActionSheet();
        return;
      }
      var btn = event.target.closest('[data-action]');
      if (!btn) return;
      var record = playRecords[actionSheetRecordIndex];
      var action = btn.getAttribute('data-action');
      closeRecordActionSheet();
      if (!record) return;
      if (action === 'edit') startEditRecord(record);
      if (action === 'delete') deleteRideRecord(record);
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
    if (!rec || !displayCoord(rec.from) || !displayCoord(rec.to)) {
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
    setLineLayerDimmed(false);
    if (hoverZrLine) {
      hoverZrLine.setStyle({ opacity: 0 });
      hoverZrLine.setShape({ points: [] });
    }
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
    document.getElementById('range-year-control').hidden = mode !== 'year';
    document.getElementById('range-custom').hidden = mode !== 'custom';
    syncRangeModeSelect();
    syncRangeYearSelect();
  }

  function syncRangeSelect(selectId, textId, menuId) {
    var select = document.getElementById(selectId);
    var text = document.getElementById(textId);
    var menu = document.getElementById(menuId);
    if (!select || !text || !menu) return;
    var selected = select.options[select.selectedIndex];
    text.textContent = selected ? selected.textContent : '';
    Array.prototype.forEach.call(menu.querySelectorAll('.range-select-option'), function (option) {
      var active = option.getAttribute('data-value') === select.value;
      option.classList.toggle('is-selected', active);
      option.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function syncRangeModeSelect() {
    syncRangeSelect('range-mode', 'range-mode-text', 'range-mode-menu');
  }

  function syncRangeYearSelect() {
    syncRangeSelect('range-year', 'range-year-text', 'range-year-menu');
  }

  function bindRangeSelect(config) {
    var select = document.getElementById(config.selectId);
    var wrap = document.getElementById(config.wrapId);
    var trigger = document.getElementById(config.triggerId);
    var menu = document.getElementById(config.menuId);
    if (!select || !wrap || !trigger || !menu) return;

    function optionNodes() {
      return Array.prototype.slice.call(menu.querySelectorAll('.range-select-option'));
    }

    function selectedOption() {
      var options = optionNodes();
      return options.filter(function (option) {
        return option.getAttribute('data-value') === select.value;
      })[0] || options[0];
    }

    function openMenu(focusTarget) {
      var options = optionNodes();
      menu.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      if (focusTarget === 'first' && options[0]) options[0].focus();
      else if (focusTarget === 'last' && options.length) options[options.length - 1].focus();
      else if (focusTarget === 'selected' && selectedOption()) selectedOption().focus();
    }

    function closeMenu(returnFocus) {
      menu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      if (returnFocus) trigger.focus();
    }

    function chooseOption(option) {
      var value = option && option.getAttribute('data-value');
      if (!value || value === select.value) {
        closeMenu(true);
        return;
      }
      select.value = value;
      config.sync();
      closeMenu(true);
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }

    trigger.addEventListener('click', function () {
      if (menu.hidden) openMenu();
      else closeMenu(false);
    });

    trigger.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        openMenu('selected');
      } else if (event.key === 'Home') {
        event.preventDefault();
        openMenu('first');
      } else if (event.key === 'End') {
        event.preventDefault();
        openMenu('last');
      } else if (event.key === 'Escape' && !menu.hidden) {
        event.preventDefault();
        closeMenu(false);
      }
    });

    menu.addEventListener('click', function (event) {
      var option = event.target.closest('.range-select-option');
      if (option) chooseOption(option);
    });

    menu.addEventListener('keydown', function (event) {
      var options = optionNodes();
      var current = options.indexOf(document.activeElement);
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeMenu(true);
        return;
      }
      if (event.key === 'Tab') {
        closeMenu(false);
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        var active = document.activeElement.closest('.range-select-option');
        if (active) {
          event.preventDefault();
          chooseOption(active);
        }
        return;
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        if (event.key === 'Home') current = 0;
        else if (event.key === 'End') current = options.length - 1;
        else if (event.key === 'ArrowDown') current = (current + 1 + options.length) % options.length;
        else current = (current - 1 + options.length) % options.length;
        if (options[current]) options[current].focus();
      }
    });

    document.addEventListener('mousedown', function (event) {
      if (!menu.hidden && !wrap.contains(event.target)) closeMenu(false);
    });

    config.sync();
  }

  function bindRangeModeSelect() {
    bindRangeSelect({
      selectId: 'range-mode',
      wrapId: 'range-mode-control',
      triggerId: 'range-mode-button',
      menuId: 'range-mode-menu',
      sync: syncRangeModeSelect,
    });
  }

  function bindRangeYearSelect() {
    bindRangeSelect({
      selectId: 'range-year',
      wrapId: 'range-year-control',
      triggerId: 'range-year-button',
      menuId: 'range-year-menu',
      sync: syncRangeYearSelect,
    });
  }

  function currentFilteredRecords() {
    return window.TrainStats.filterRecordsByType(currentRangeRecords(), typeFilter);
  }

  function syncTypeFilterButtons() {
    Array.prototype.forEach.call(document.querySelectorAll('.type-filter-btn'), function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-type') === typeFilter);
    });
  }

  function applyRangeFilter() {
    stopPlay();
    playRecords = currentFilteredRecords();
    recordAreaActive = false;
    highlightedRoute = null;
    setLineLayerDimmed(false);
    computeReunions(playRecords);
    var slider = document.getElementById('time-slider');
    slider.max = String(playRecords.length);
    document.getElementById('play-btn').disabled = playRecords.length === 0;
    renderRecords();
    renderReunions();
    if (playRecords.length === 0) {
      var replaceSeries = focusedRecordIndex != null || tripPlayRaf != null;
      var restoredView = exitTripPlayMode();
      visibleCount = 0;
      slider.value = '0';
      document.getElementById('time-label').textContent = '该筛选条件下无乘车记录';
      renderMap(restoredView, replaceSeries);
      return;
    }
    setVisibleCount(playRecords.length);
  }

  function populateRangeYearMenu(years) {
    // 自定义年份菜单已移除，改用原生 select；保留函数兼容旧调用与测试。
    var menu = document.getElementById('range-year-menu');
    var trigger = document.getElementById('range-year-button');
    if (!menu || !trigger) return;
    menu.innerHTML = years
      .map(function (year) {
        return (
          '<button type="button" class="range-select-option" role="option" data-value="' +
          escapeHtml(year) +
          '" aria-selected="false"><span>' +
          escapeHtml(year) +
          ' 年</span><span class="range-select-check" aria-hidden="true"></span></button>'
        );
      })
      .join('');
    trigger.disabled = years.length === 0;
    syncRangeYearSelect();
  }

  function populateRangeControls() {
    var years = window.TrainStats.listYears(allRecords);
    var yearSelect = document.getElementById('range-year');
    var prevYear = yearSelect.value;
    yearSelect.innerHTML = years
      .map(function (y) {
        return '<option value="' + escapeHtml(y) + '">' + escapeHtml(y) + ' 年</option>';
      })
      .join('');
    if (prevYear && years.indexOf(prevYear) !== -1) yearSelect.value = prevYear;
    else yearSelect.value = years[years.length - 1] || '';
    yearSelect.disabled = years.length === 0;
    populateRangeYearMenu(years);
    if (!allRecords.length) return;
    var first = allRecords[0].date;
    var last = allRecords[allRecords.length - 1].date;
    var start = document.getElementById('range-start');
    var end = document.getElementById('range-end');
    var prevStart = start.value;
    var prevEnd = end.value;
    start.setAttribute('data-min', first);
    start.setAttribute('data-max', last);
    end.setAttribute('data-min', first);
    end.setAttribute('data-max', last);
    function clampDate(value, min, max) {
      if (!value || value < min) return min;
      if (value > max) return max;
      return value;
    }
    start.value = clampDate(prevStart, first, last);
    end.value = clampDate(prevEnd, first, last);
    if (rangeStartPicker) rangeStartPicker.refresh();
    if (rangeEndPicker) rangeEndPicker.refresh();
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
          '" data-year="' + escapeHtml(y) + '">' + escapeHtml(y) + '</button>'
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
    document.getElementById('review-top-train').textContent = formatTopTrainSummary(
      window.TrainStats.topEntries(yearStats.trains)
    );
  }

  function openReview() {
    reviewYear = null;
    renderReview();
    document.getElementById('review-modal').hidden = false;
    scheduleLayoutRefresh();
  }

  function closeReview() {
    document.getElementById('review-modal').hidden = true;
    scheduleLayoutRefresh();
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

  function sortRecords(records) {
    return (records || []).slice().sort(function (a, b) {
      if (a.date === b.date) return 0;
      return a.date < b.date ? -1 : 1;
    });
  }

  function loadMergedData() {
    var base = {
      records: (window.TRAIN_DATA.records || []).slice(),
      stations: Object.assign({}, window.TRAIN_DATA.stations || {}),
    };
    var extra = window.TrainSettings.unsavedExtra(base, window.TrainSettings.load(window.localStorage));
    return window.TrainSettings.mergeTrainData(base, extra);
  }

  function loadServerData() {
    if (typeof fetch !== 'function') return Promise.resolve(false);
    return fetch(window.TrainSettings.DATA_API, { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('data-api');
        return res.json();
      })
      .then(function (payload) {
        if (!payload || !payload.version || !Array.isArray(payload.records) || !payload.stations) {
          throw new Error('data-api-payload');
        }
        window.TRAIN_DATA.records = payload.records;
        window.TRAIN_DATA.stations = payload.stations;
        trainDataVersion = payload.version;
        return true;
      })
      .catch(function () {
        trainDataVersion = null;
        return false;
      });
  }

  function adoptMergedData(merged) {
    stations = merged.stations || {};
    allRecords = sortRecords(merged.records || []);
    stats = window.TrainStats.computeStats({ records: allRecords, stations: stations });
  }

  // 总里程独立于显示模式，按每次乘车的有效真实路径累计；
  // 仅当全部记录都有真实路径时才显示（计划：试点阶段保持隐藏）。
  function mileageCardState() {
    var state = { show: false, text: '' };
    if (!window.TrainRoutes || !window.RAIL_ROUTE_DATA) return state;
    var summary = null;
    try {
      summary = window.TrainRoutes.mileageSummary(allRecords);
    } catch (err) {
      return state;
    }
    if (summary && summary.total > 0 && summary.covered === summary.total) {
      state.show = true;
      state.text = summary.totalKm.toLocaleString('zh-CN') + ' km';
    }
    return state;
  }

  function syncMileageCard() {
    var card = document.getElementById('stat-mileage-card');
    var value = document.getElementById('stat-mileage');
    if (!card || !value) return;
    var state = mileageCardState();
    card.hidden = !state.show;
    var cards = card.parentElement;
    if (cards) cards.classList.toggle('has-mileage', state.show);
    if (state.show) value.textContent = state.text;
  }

  function setStatCards(nextStats, animate) {
    if (animate) {
      animateNumber(document.getElementById('stat-rides'), nextStats.totalRides);
      animateNumber(document.getElementById('stat-stations'), nextStats.stationCount);
      animateNumber(document.getElementById('stat-vehicles'), nextStats.vehicleTypeCount);
    } else {
      document.getElementById('stat-rides').textContent = nextStats.totalRides.toLocaleString('zh-CN');
      document.getElementById('stat-stations').textContent = nextStats.stationCount.toLocaleString('zh-CN');
      document.getElementById('stat-vehicles').textContent = nextStats.vehicleTypeCount.toLocaleString('zh-CN');
    }
    syncMileageCard();
  }

  function disposeRankCharts() {
    rankLayouts.forEach(function (rank) {
      if (rank && typeof rank.dispose === 'function') rank.dispose();
    });
    rankLayouts = [];
    charts = charts.filter(function (chart) {
      return chart === mapChart;
    });
  }

  function rebuildRankCharts() {
    disposeRankCharts();
    rankLayouts = [
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
  }

  function resizeDashboardCharts() {
    rankLayouts.forEach(function (rank) {
      rank.relayout();
    });
    charts.forEach(function (chart) {
      chart.resize();
    });
    refreshHoverOverlay();
  }

  function scheduleLayoutRefresh() {
    if (layoutRefreshRaf) return;
    var callback = function () {
      layoutRefreshRaf = null;
      resizeDashboardCharts();
    };
    layoutRefreshRaf = window.requestAnimationFrame
      ? window.requestAnimationFrame(callback)
      : window.setTimeout(callback, 16);
  }

  function handleLayoutChange(event) {
    var compact = event && event.detail && typeof event.detail.compact === 'boolean'
      ? event.detail.compact
      : isCompactLayout();
    mapRoamEnabled = !compact;
    if (!compact) mapExploreMode = false;
    syncMapExploreButton();
    if (mapChart) {
      if (!timelinePlaying && focusedRecordIndex == null) {
        renderMap();
      } else {
        mapChart.setOption({ geo: { roam: mapRoamEnabled || mapExploreMode } }, false);
      }
    }
    scheduleLayoutRefresh();
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function todayIso() {
    var now = new Date();
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var day = String(now.getDate()).padStart(2, '0');
    return now.getFullYear() + '-' + month + '-' + day;
  }

  function setTripStatus(message, kind) {
    var el = document.getElementById('trip-form-status');
    if (!el) return;
    el.textContent = message || '';
    el.className = 'trip-status' + (kind ? ' is-' + kind : '');
  }

  function syncUnknownStationFields() {
    var from = document.getElementById('trip-from').value.trim();
    var to = document.getElementById('trip-to').value.trim();
    var unknown = [];
    if (from && !stations[from]) unknown.push({ field: 'from', name: from });
    if (to && !stations[to] && to !== from) unknown.push({ field: 'to', name: to });
    var wrap = document.getElementById('trip-unknown-stations');
    var fields = document.getElementById('trip-unknown-fields');
    if (!unknown.length) {
      wrap.hidden = true;
      fields.innerHTML = '';
      return;
    }
    wrap.hidden = false;
    fields.innerHTML = unknown
      .map(function (item) {
        return (
          '<div class="trip-coord-row">' +
          '<span>' +
          escapeHtml(item.name) +
          ' 坐标</span>' +
          '<input id="trip-' +
          item.field +
          '-lng" type="number" step="0.01" placeholder="经度">' +
          '<input id="trip-' +
          item.field +
          '-lat" type="number" step="0.01" placeholder="纬度">' +
          '</div>'
        );
      })
      .join('');
  }

  function resetTripForm() {
    var form = document.getElementById('trip-form');
    if (form) form.reset();
    document.getElementById('trip-date').value = todayIso();
    if (tripDatePicker) tripDatePicker.close();
    syncUnknownStationFields();
  }

  function setTripFormMode(mode) {
    var editing = mode === 'edit';
    var adding = mode === 'add';
    var modal = document.getElementById('settings-modal');
    var title = document.getElementById('settings-title');
    var closeBtn = document.getElementById('settings-close');
    var submitBtn = document.getElementById('trip-submit');
    if (modal) modal.classList.toggle('is-edit', editing || adding);
    if (title) title.textContent = editing ? '编辑行程' : adding ? '添加行程' : '设置';
    if (closeBtn) closeBtn.setAttribute('aria-label', editing ? '关闭编辑' : adding ? '关闭添加行程' : '关闭设置');
    if (submitBtn) submitBtn.textContent = editing ? '保存修改' : '添加行程';
  }

  function clearTripEditMode() {
    editingRecord = null;
    setTripFormMode('settings');
  }

  function openAddTripForm() {
    editingRecord = null;
    setTripFormMode('add');
    resetTripForm();
    showSettingsPanel('trip');
    openSettings();
  }

  function readTripForm() {
    var dateValue = document.getElementById('trip-date').value;
    if (window.TrainSettings.normalizeDateInput) {
      dateValue = window.TrainSettings.normalizeDateInput(dateValue) || dateValue;
    }
    return window.TrainSettings.normalizeRecord({
      date: dateValue,
      from: document.getElementById('trip-from').value,
      to: document.getElementById('trip-to').value,
      train: document.getElementById('trip-train').value,
      vehicle: document.getElementById('trip-vehicle').value,
      origin: document.getElementById('trip-origin').value,
      terminal: document.getElementById('trip-terminal').value,
      bureau: document.getElementById('trip-bureau').value,
    });
  }

  function fillTripForm(record) {
    document.getElementById('trip-date').value = (record && record.date) || todayIso();
    document.getElementById('trip-from').value = (record && record.from) || '';
    document.getElementById('trip-to').value = (record && record.to) || '';
    document.getElementById('trip-train').value = (record && record.train) || '';
    document.getElementById('trip-vehicle').value = (record && record.vehicle) || '';
    document.getElementById('trip-origin').value = (record && record.origin) || '';
    document.getElementById('trip-terminal').value = (record && record.terminal) || '';
    document.getElementById('trip-bureau').value = (record && record.bureau) || '';
    if (tripDatePicker) tripDatePicker.close();
    syncUnknownStationFields();
  }

  function showSettingsPanel(name) {
    Array.prototype.forEach.call(document.querySelectorAll('.settings-nav-btn'), function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-panel') === name);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.settings-panel'), function (panel) {
      panel.hidden = panel.getAttribute('data-panel') !== name;
    });
  }

  function openSettings() {
    hideRecordContextMenu();
    closeReview();
    if (!editingRecord && !document.getElementById('trip-date').value) {
      document.getElementById('trip-date').value = todayIso();
    }
    document.getElementById('settings-modal').hidden = false;
    scheduleLayoutRefresh();
  }

  function closeSettings() {
    if (tripDatePicker) tripDatePicker.close();
    document.getElementById('settings-modal').hidden = true;
    if (editingRecord) {
      clearTripEditMode();
      resetTripForm();
    }
    scheduleLayoutRefresh();
  }

  function extraStationsFromForm(record) {
    var extra = {};
    ['from', 'to'].forEach(function (field) {
      var name = record[field];
      if (!name || stations[name]) return;
      var lng = document.getElementById('trip-' + field + '-lng');
      var lat = document.getElementById('trip-' + field + '-lat');
      if (!lng || !lat) return;
      var coord = window.TrainSettings.parseCoord(lng.value, lat.value);
      if (coord) extra[name] = coord;
    });
    return extra;
  }

  function missingStationNames(record, extraStations) {
    var names = [];
    [record.from, record.to].forEach(function (name) {
      if (!name) return;
      if (stations[name] || (extraStations && extraStations[name])) return;
      if (names.indexOf(name) === -1) names.push(name);
    });
    return names;
  }

  function refreshDashboard(animateStats) {
    adoptMergedData(loadMergedData());
    setStatCards(stats, !!animateStats);
    rebuildRankCharts();
    populateRangeControls();
    applyRangeFilter();
    if (window.TrainScale) window.TrainScale.applyPageScale();
    rankLayouts.forEach(function (rank) {
      rank.relayout();
    });
    charts.forEach(function (chart) {
      chart.resize();
    });
  }

  function persistTrainData(merged) {
    var payload = {
      baseVersion: trainDataVersion,
      records: merged.records,
      stations: merged.stations,
    };
    return fetch(window.TrainSettings.SAVE_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.text().then(function (text) {
          var body = {};
          try {
            body = text ? JSON.parse(text) : {};
          } catch (err) {
            body = {};
          }
          if (res.status === 409 || res.status === 428 || body.conflict) {
            return {
              wroteFile: false,
              conflict: true,
              error: body.error || '数据已在其他标签页更新，请刷新后重试。',
            };
          }
          if (res.status === 404 || res.status === 405) {
            return { wroteFile: false, offline: true };
          }
          if (!res.ok) {
            return {
              wroteFile: false,
              serverError: true,
              error: body.error || '保存接口返回错误。',
            };
          }
          if (!body.version) throw new Error('save-api-payload');
          trainDataVersion = body.version;
          return { wroteFile: true };
        });
      })
      .catch(function () {
        return { wroteFile: false, offline: true };
      });
  }

  function rememberMergedFile(merged) {
    window.TRAIN_DATA.records = (merged.records || []).slice();
    window.TRAIN_DATA.stations = Object.assign({}, merged.stations || {});
    try {
      window.localStorage.removeItem(window.TrainSettings.STORAGE_KEY);
    } catch (err) {
      /* ignore */
    }
  }

  function currentDataState() {
    return {
      records: allRecords.slice(),
      stations: Object.assign({}, stations),
    };
  }

  function extraOverlayFor(merged) {
    return window.TrainSettings.unsavedExtra(
      {
        records: (window.TRAIN_DATA.records || []).slice(),
        stations: Object.assign({}, window.TRAIN_DATA.stations || {}),
      },
      merged
    );
  }

  function recordBelongsToFile(record) {
    return (window.TRAIN_DATA.records || []).indexOf(record) !== -1;
  }

  function persistStatusMessage(wroteFile, missing, action) {
    var verb = action === 'edit' ? '保存修改' : action === 'delete' ? '删除' : '添加行程';
    if (wroteFile) {
      if (missing && missing.length) {
        return '已写入 data.js 和 Excel。缺坐标的车站（' + missing.join('、') + '）暂不显示在地图上。';
      }
      return action === 'edit'
        ? '已保存修改，并写入 js/data.js 和 Excel。'
        : action === 'delete'
          ? '已删除记录，并写入 js/data.js 和 Excel。'
          : '已添加行程，并写入 js/data.js 和 Excel。';
    }
    if (missing && missing.length) {
      return '已暂存在本机。未能写入 data.js，请用 python tools/serve.py 打开本页。缺坐标：' + missing.join('、');
    }
    return '已暂存在本机。未能写入 data.js，请用 python tools/serve.py 打开本页后再' + verb + '。';
  }

  function startEditRecord(record) {
    editingRecord = record;
    setTripFormMode('edit');
    fillTripForm(record);
    setTripStatus('', '');
    openSettings();
  }

  function deleteRideRecord(record) {
    var summary = record.date + '  ' + record.from + ' → ' + record.to + '  ' + record.train;
    if (!window.confirm('确定删除这条乘车记录？\n' + summary)) return;
    if (recordMutating) return;
    if (window.TrainSettings.findRecordIndex(allRecords, record) === -1) return;
    var merged = window.TrainSettings.removeRecord(currentDataState(), record);
    merged.records = sortRecords(merged.records);
    var extra = extraOverlayFor(merged);
    var allowLocalFallback = !recordBelongsToFile(record);
    recordMutating = true;
    persistTrainData(merged)
      .then(function (result) {
        if (result.wroteFile) {
          rememberMergedFile(merged);
        } else if (result.conflict || result.serverError) {
          window.alert(result.error || '保存失败，请刷新后重试。');
          return;
        } else if (!allowLocalFallback) {
          window.alert('未能写入 data.js，请用 python tools/serve.py 打开本页后再删除。');
          return;
        } else {
          try {
            window.TrainSettings.save(extra, window.localStorage);
          } catch (err) {
            window.alert('无法保存到本机存储，请检查浏览器是否允许本地存储。');
            return;
          }
        }
        refreshDashboard(false);
      })
      .finally(function () {
        recordMutating = false;
      });
  }

  function submitTripForm(event) {
    event.preventDefault();
    if (recordMutating) return;
    var record = readTripForm();
    var checked = window.TrainSettings.validateRecord(record);
    if (!checked.ok) {
      setTripStatus(Object.keys(checked.errors).map(function (key) {
        return checked.errors[key];
      }).join('；'), 'error');
      return;
    }
    var extraStations = extraStationsFromForm(record);
    var editing = editingRecord;
    var extra;
    var merged;
    var allowLocalFallback = true;
    if (editing) {
      if (window.TrainSettings.findRecordIndex(allRecords, editing) === -1) {
        setTripStatus('找不到要修改的记录，请刷新后重试。', 'error');
        return;
      }
      merged = window.TrainSettings.replaceRecord(currentDataState(), editing, record, extraStations);
      merged.records = sortRecords(merged.records);
      extra = extraOverlayFor(merged);
      allowLocalFallback = !recordBelongsToFile(editing);
    } else {
      var base = {
        records: (window.TRAIN_DATA.records || []).slice(),
        stations: Object.assign({}, window.TRAIN_DATA.stations || {}),
      };
      extra = window.TrainSettings.addRecord(
        window.TrainSettings.unsavedExtra(base, window.TrainSettings.load(window.localStorage)),
        record,
        extraStations
      );
      merged = window.TrainSettings.mergeTrainData(base, extra);
      merged.records = sortRecords(merged.records);
    }
    var submitBtn = document.getElementById('trip-submit');
    if (submitBtn) submitBtn.disabled = true;
    recordMutating = true;
    persistTrainData(merged)
      .then(function (result) {
        if (result.wroteFile) {
          rememberMergedFile(merged);
        } else if (result.conflict || result.serverError) {
          setTripStatus(result.error || '保存失败，请刷新后重试。', 'error');
          return;
        } else if (!allowLocalFallback) {
          setTripStatus('未能写入 data.js，请用 python tools/serve.py 打开本页后再修改。', 'error');
          return;
        } else {
          try {
            window.TrainSettings.save(extra, window.localStorage);
          } catch (err) {
            setTripStatus('无法保存到本机存储，请检查浏览器是否允许本地存储。', 'error');
            return;
          }
        }
        refreshDashboard(false);
        var missing = missingStationNames(record, extraStations);
        if (editing) {
          clearTripEditMode();
          resetTripForm();
          closeSettings();
          return;
        }
        resetTripForm();
        setTripStatus(persistStatusMessage(result.wroteFile, missing, 'add'), 'ok');
      })
      .finally(function () {
        recordMutating = false;
        if (submitBtn) submitBtn.disabled = false;
      });
  }

  function bindRangeDatePickers() {
    rangeStartPicker = window.TrainSettings.bindDatePicker({
      input: document.getElementById('range-start'),
      toggle: document.getElementById('range-start-toggle'),
      picker: document.getElementById('range-start-picker'),
      document: document,
    });
    rangeEndPicker = window.TrainSettings.bindDatePicker({
      input: document.getElementById('range-end'),
      toggle: document.getElementById('range-end-toggle'),
      picker: document.getElementById('range-end-picker'),
      document: document,
    });
  }

  function bindSettingsEvents() {
    document.getElementById('settings-btn').addEventListener('click', function () {
      if (editingRecord) {
        clearTripEditMode();
        resetTripForm();
      }
      setTripFormMode('settings');
      openSettings();
    });
    document.getElementById('add-trip-btn').addEventListener('click', openAddTripForm);
    document.getElementById('settings-close').addEventListener('click', closeSettings);
    document.querySelector('#settings-modal .settings-backdrop').addEventListener('click', closeSettings);
    document.getElementById('settings-nav').addEventListener('click', function (event) {
      var btn = event.target.closest('.settings-nav-btn');
      if (!btn) return;
      showSettingsPanel(btn.getAttribute('data-panel'));
    });
    document.getElementById('trip-from').addEventListener('input', syncUnknownStationFields);
    document.getElementById('trip-to').addEventListener('input', syncUnknownStationFields);
    document.getElementById('trip-form').addEventListener('submit', submitTripForm);
    var mapDisplayControls = document.getElementById('map-display-options');
    if (mapDisplayControls) {
      mapDisplayControls.addEventListener('change', function (event) {
        var input = event.target.closest('input[name="map-display-mode"]');
        if (!input) return;
        setMapDisplayMode(input.value);
      });
    }
    tripDatePicker = window.TrainSettings.bindDatePicker({
      input: document.getElementById('trip-date'),
      toggle: document.getElementById('trip-date-toggle'),
      picker: document.getElementById('trip-date-picker'),
      document: document,
    });
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
    if (!window.TRAIN_DATA || !window.TrainStats || !window.TrainSettings) {
      showBootError('未能加载乘车数据或脚本，请确认 js/data.js、js/stats.js 与 js/settings.js 存在后刷新页面。');
      return;
    }

    mapRoamEnabled = !isCompactLayout();
    window.addEventListener('train-layout-change', handleLayoutChange);
    window.addEventListener('resize', function () {
      if (window.TrainScale) window.TrainScale.applyPageScale();
      scheduleLayoutRefresh();
    }, { passive: true });
    window.addEventListener('orientationchange', scheduleLayoutRefresh, { passive: true });

    loadServerData().then(function () {
      adoptMergedData(loadMergedData());
      playRecords = allRecords;
      computeReunions(playRecords);
      setStatCards(stats, true);

    if (window.TrainScale) window.TrainScale.applyPageScale();

    echarts.registerMap('china', window.CHINA_GEOJSON);
    mapChart = echarts.init(document.getElementById('map-chart'));
    charts.push(mapChart);
    mapChart.on('georoam', refreshHoverOverlay);
    bindMapTapHit();

    rebuildRankCharts();
    bindMapExplore();
    if (window.TrainRoutes) {
      mapDisplayMode = window.TrainRoutes.readDisplayMode(window.localStorage);
    }
    syncMapDisplayControls();
    renderRecords();
    bindRecordListEvents();
    bindRecordContextMenu();
    bindRecordActionSheet();
    renderReunions();
    bindReunionEvents();
    bindSettingsEvents();

    populateRangeControls();
    bindRangeDatePickers();
    syncRangeControls();
    document.getElementById('range-mode').addEventListener('change', function () {
      syncRangeControls();
      applyRangeFilter();
    });
    bindRangeModeSelect();
    bindRangeYearSelect();
    document.getElementById('range-year').addEventListener('change', function () {
      syncRangeYearSelect();
      applyRangeFilter();
    });
    document.getElementById('range-start').addEventListener('change', applyRangeFilter);
    document.getElementById('range-end').addEventListener('change', applyRangeFilter);

    Array.prototype.forEach.call(document.querySelectorAll('.type-filter-btn'), function (btn) {
      btn.addEventListener('click', function () {
        typeFilter = btn.getAttribute('data-type') || 'all';
        syncTypeFilterButtons();
        applyRangeFilter();
      });
    });
    syncTypeFilterButtons();

    var slider = document.getElementById('time-slider');
    slider.max = String(playRecords.length);
    slider.addEventListener('input', function () {
      stopPlay();
      setVisibleCount(Number(slider.value));
    });
    document.getElementById('play-btn').addEventListener('click', function () {
      if (timelinePlaying) stopPlay();
      else startPlay();
    });

    document.getElementById('review-btn').addEventListener('click', function () {
      closeSettings();
      openReview();
    });
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
      if (event.key !== 'Escape') return;
      var sheet = document.getElementById('record-action-sheet');
      if (sheet && !sheet.hidden) {
        closeRecordActionSheet();
        return;
      }
      var menu = document.getElementById('record-context-menu');
      if (menu && !menu.hidden) {
        hideRecordContextMenu();
        return;
      }
      if (focusedRecordIndex != null) {
        restoreFullMap();
        return;
      }
      if (!document.getElementById('settings-modal').hidden) {
        closeSettings();
        return;
      }
      closeReview();
    });

    setVisibleCount(playRecords.length);

    if (window.TrainScale) window.TrainScale.applyPageScale();
    resizeDashboardCharts();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(typeof window !== 'undefined' ? window : globalThis);
