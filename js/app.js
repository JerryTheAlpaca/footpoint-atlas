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

  function routeLineWidth(count, highlighted) {
    var rides = Math.max(1, Number(count) || 1);
    var width = 1.2 + (rides - 1) * 0.9;
    if (width > 6) width = 6;
    if (highlighted) width += 1.4;
    return width;
  }

  function stationSymbolSize(visits) {
    var n = Math.max(1, Number(visits) || 1);
    var size = 8 + Math.sqrt(n) * 6.5;
    if (size > 36) size = 36;
    return size;
  }

  var RANK_COLLAPSED_LIMIT = 3;
  var RANK_ROW_HEIGHT = 28;
  var RANK_CHART_PADDING = 16;

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

  function rankGrowOption(entries) {
    return {
      animationDurationUpdate: 720,
      animationEasingUpdate: 'cubicOut',
      series: [
        {
          id: 'rank-bars',
          data: rankBarValues(entries, true),
          animationDelayUpdate: function (idx) {
            return idx * 40;
          },
        },
      ],
    };
  }

  root.TrainMap = {
    buildGeoOption: buildGeoOption,
    readGeoView: readGeoView,
    routeLineWidth: routeLineWidth,
    stationSymbolSize: stationSymbolSize,
  };

  root.TrainRank = {
    COLLAPSED_LIMIT: RANK_COLLAPSED_LIMIT,
    visibleRankEntries: visibleRankEntries,
    rankChartHeight: rankChartHeight,
    rankToggleHidden: rankToggleHidden,
    rankGridLeft: rankGridLeft,
    rankBarValues: rankBarValues,
    rankGrowOption: rankGrowOption,
  };

  var ROUTE_CURVENESS = 0.22;
  var TRIP_PLAY_TIMING = {
    startHoldMs: 520,
    drawMs: 2400,
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

  function tripStationPoint(name, coord) {
    return {
      name: name,
      value: coord.concat([1]),
      visits: 1,
    };
  }

  function buildTripPlayFrame(elapsedMs, trip, timing) {
    var tmg = timing || TRIP_PLAY_TIMING;
    var elapsed = Math.max(0, Number(elapsedMs) || 0);
    var polyline = sampleRoutePolyline(trip.fromCoord, trip.toCoord, ROUTE_CURVENESS, 48);
    var stations = [tripStationPoint(trip.from, trip.fromCoord)];

    if (elapsed < tmg.startHoldMs) {
      return {
        phase: 'start',
        drawProgress: 0,
        stations: stations,
        lineCoords: [],
        head: null,
      };
    }

    var raw = (elapsed - tmg.startHoldMs) / tmg.drawMs;
    if (raw < 1) {
      var progress = easeInOutCubic(raw);
      var lineCoords = slicePolylineByProgress(polyline, progress);
      return {
        phase: 'draw',
        drawProgress: progress,
        stations: stations,
        lineCoords: lineCoords.length >= 2 ? lineCoords : [],
        head: lineCoords.length ? lineCoords[lineCoords.length - 1].slice() : trip.fromCoord.slice(),
      };
    }

    return {
      phase: 'end',
      drawProgress: 1,
      stations: stations.concat([tripStationPoint(trip.to, trip.toCoord)]),
      lineCoords: polyline,
      head: null,
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

  root.TrainTripPlay = {
    ROUTE_CURVENESS: ROUTE_CURVENESS,
    TRIP_PLAY_TIMING: TRIP_PLAY_TIMING,
    quadraticControlPoint: quadraticControlPoint,
    sampleRoutePolyline: sampleRoutePolyline,
    slicePolylineByProgress: slicePolylineByProgress,
    buildTripPlayFrame: buildTripPlayFrame,
    tripPlayGeoView: tripPlayGeoView,
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

  function buildLines(records) {
    var grouped = {};
    records.forEach(function (rec) {
      var key = rec.from + '→' + rec.to;
      if (!grouped[key]) grouped[key] = { from: rec.from, to: rec.to, records: [] };
      grouped[key].records.push(rec);
    });

    return Object.keys(grouped)
      .map(function (key) {
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
          coords: [fromCoord, toCoord],
          from: group.from,
          to: group.to,
          route: key,
          count: group.records.length,
          records: group.records,
          lineStyle: {
            color: highlightedRoute && highlightedRoute !== key ? 'rgba(0, 229, 255, 0.18)' : NEON,
            width: routeLineWidth(group.records.length, highlightedRoute === key),
            opacity: highlightedRoute === key ? 1 : 0.75,
            curveness: ROUTE_CURVENESS,
          },
        };
      })
      .filter(Boolean);
  }

  function buildStations(records) {
    var visits = {};
    records.forEach(function (rec) {
      visits[rec.from] = (visits[rec.from] || 0) + 1;
      visits[rec.to] = (visits[rec.to] || 0) + 1;
    });
    return Object.keys(visits)
      .map(function (name) {
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

  function renderMap(viewOverride) {
    var visible = recordsUpTo(visibleCount);
    var lines = buildLines(visible);
    var points = buildStations(visible);
    mapChart.setOption(
      {
        animation: true,
        backgroundColor: 'transparent',
        tooltip: mapTooltipStyle(),
        geo: buildGeoOption(viewOverride || readGeoView(mapChart)),
        series: [
          {
            name: '线路',
            type: 'lines',
            polyline: false,
            coordinateSystem: 'geo',
            geoIndex: 0,
            zlevel: 2,
            effect: {
              show: true,
              period: 5,
              trailLength: 0.45,
              color: GOLD,
              symbol: 'pin',
              symbolSize: 5,
            },
            tooltip: { formatter: lineTooltip },
            data: lines,
          },
          {
            name: '车站',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            geoIndex: 0,
            zlevel: 3,
            rippleEffect: { brushType: 'stroke', scale: 3.4, period: 3.6 },
            symbolSize: function (val) {
              return stationSymbolSize(val[2]);
            },
            itemStyle: {
              color: NEON,
              shadowBlur: 12,
              shadowColor: NEON,
            },
            label: { show: false },
            tooltip: {
              formatter: function (params) {
                return params.name + '<br/>到访次数：' + params.data.visits;
              },
            },
            data: points,
          },
        ],
      },
      { replaceMerge: ['series'] }
    );
  }

  function tripLineSeries(name, zlevel, lineStyle, data, showEffect) {
    return {
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
            symbolSize: 6,
          }
        : { show: false },
      lineStyle: lineStyle,
      data: data,
    };
  }

  function renderTripPlayFrame(frame, geoView) {
    var lineData = frame.lineCoords.length >= 2 ? [{ coords: frame.lineCoords }] : [];
    var headData = frame.head
      ? [{ name: '', value: frame.head.concat([1]), visits: 1 }]
      : [];
    mapChart.setOption(
      {
        animation: false,
        backgroundColor: 'transparent',
        tooltip: mapTooltipStyle(),
        geo: buildGeoOption(geoView),
        series: [
          tripLineSeries(
            '线路',
            3,
            {
              color: NEON,
              width: 2.4,
              opacity: 1,
            },
            lineData,
            frame.phase === 'end'
          ),
          {
            name: '线头',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            geoIndex: 0,
            zlevel: 4,
            silent: true,
            animation: false,
            symbol: 'circle',
            symbolSize: 11,
            rippleEffect: { brushType: 'stroke', scale: 2.6, period: 2.2 },
            itemStyle: {
              color: GOLD,
              shadowBlur: 18,
              shadowColor: GOLD,
            },
            label: { show: false },
            data: headData,
          },
          {
            name: '车站',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            geoIndex: 0,
            zlevel: 5,
            animation: false,
            symbol: 'circle',
            rippleEffect: { brushType: 'stroke', scale: 3.2, period: 3.2 },
            symbolSize: 16,
            itemStyle: {
              color: NEON,
              shadowBlur: 16,
              shadowColor: NEON,
            },
            label: {
              show: true,
              formatter: '{b}',
              color: '#e8f6ff',
              fontSize: 12,
              offset: [0, -18],
            },
            tooltip: {
              formatter: function (params) {
                return params.name;
              },
            },
            data: frame.stations,
          },
        ],
      },
      { replaceMerge: ['series'] }
    );
  }

  function axisStyle() {
    return {
      axisLabel: { color: '#9fdfff', fontSize: 11 },
      axisLine: { lineStyle: { color: 'rgba(0, 229, 255, 0.25)' } },
      splitLine: { show: false },
    };
  }

  function barOption(entries, delayBase, grown, keepCount) {
    var left = rankGridLeft(entries);
    return {
      animation: true,
      animationDuration: 900,
      animationDurationUpdate: 720,
      animationEasing: 'cubicOut',
      animationEasingUpdate: 'cubicOut',
      grid: { left: left, right: 36, top: 8, bottom: 8 },
      xAxis: Object.assign({ type: 'value', minInterval: 1 }, axisStyle()),
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
              return params.value ? String(params.value) : '';
            },
          },
        },
      ],
    };
  }

  function collapsedRankChartHeight(el) {
    var block = el.closest('.chart-block');
    var panel = document.querySelector('.side-panel');
    if (!panel || !block) return rankChartHeight(RANK_COLLAPSED_LIMIT);
    var gap = parseFloat(window.getComputedStyle(panel).gap) || 12;
    var blocks = panel.querySelectorAll('.chart-block');
    var title = block.querySelector('h2');
    var toggle = block.querySelector('.rank-toggle');
    var styles = window.getComputedStyle(block);
    var chrome =
      (parseFloat(styles.paddingTop) || 0) +
      (parseFloat(styles.paddingBottom) || 0) +
      (title ? title.offsetHeight : 18) +
      4 +
      (toggle && !toggle.hidden ? toggle.offsetHeight || 16 : 0);
    var available = panel.clientHeight - gap * Math.max(0, blocks.length - 1);
    var slot = available / Math.max(1, blocks.length) - chrome;
    return Math.max(rankChartHeight(RANK_COLLAPSED_LIMIT), Math.floor(slot));
  }

  function setRankChartHeight(el, chart, targetHeight, animate, onDone) {
    var next = Math.round(targetHeight);
    var from = Math.round(el.getBoundingClientRect().height);
    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      if (chart) chart.resize();
      if (onDone) onDone();
    }
    if (!animate || Math.abs(from - next) < 1) {
      el.style.height = next + 'px';
      finish();
      return false;
    }
    el.style.height = from + 'px';
    el.offsetHeight;
    el.style.height = next + 'px';
    function onEnd(event) {
      if (event.target !== el || event.propertyName !== 'height') return;
      el.removeEventListener('transitionend', onEnd);
      finish();
    }
    el.addEventListener('transitionend', onEnd);
    setTimeout(finish, 480);
    return true;
  }

  function bindRankChart(el, entries, delayBase) {
    var block = el.closest('.chart-block');
    var toggle = block ? block.querySelector('.rank-toggle') : null;
    var expanded = false;
    var paintSeq = 0;
    var collapsedHeight = collapsedRankChartHeight(el);
    el.style.height = collapsedHeight + 'px';
    var chart = echarts.init(el);
    charts.push(chart);

    function currentHeight() {
      var visible = visibleRankEntries(entries, expanded);
      if (!expanded) return collapsedHeight;
      return Math.max(collapsedHeight, rankChartHeight(visible.length));
    }

    function growAfterLayout(seq, visible) {
      if (seq !== paintSeq) return;
      setTimeout(function () {
        if (seq !== paintSeq || !expanded) return;
        chart.setOption(rankGrowOption(visible));
      }, 50);
    }

    function paint(animateHeight) {
      var seq = (paintSeq += 1);
      var visible = visibleRankEntries(entries, expanded);
      if (animateHeight && expanded) {
        chart.setOption(barOption(visible, delayBase, false, RANK_COLLAPSED_LIMIT));
        setRankChartHeight(el, chart, currentHeight(), true, function () {
          growAfterLayout(seq, visible);
        });
        return;
      }
      chart.setOption(barOption(visible, delayBase, true));
      setRankChartHeight(el, chart, currentHeight(), animateHeight);
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
        collapsedHeight = collapsedRankChartHeight(el);
        setRankChartHeight(el, chart, currentHeight(), false);
      },
    };
  }

  function renderRecords() {
    var list = document.getElementById('record-list');
    list.innerHTML = playRecords
      .map(function (rec, index) {
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
    renderMap(view);
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
    if (tripPlayRaf) {
      cancelAnimationFrame(tripPlayRaf);
      tripPlayRaf = null;
    }
    if (focusedRecordIndex == null) {
      savedGeoView = readGeoView(mapChart);
    }

    focusedRecordIndex = index;
    highlightedRoute = rec.from + '→' + rec.to;
    tripPlayView = tripPlayGeoView(fromCoord, toCoord);
    markSelectedRecord(index);
    document.getElementById('time-label').textContent =
      '单程回放  ' + rec.date + '  ' + rec.from + ' → ' + rec.to;

    var trip = {
      from: rec.from,
      to: rec.to,
      fromCoord: fromCoord,
      toCoord: toCoord,
    };
    renderTripPlayFrame(buildTripPlayFrame(0, trip), tripPlayView);

    var start = performance.now();
    function tick(now) {
      if (focusedRecordIndex !== index) return;
      var frame = buildTripPlayFrame(now - start, trip);
      renderTripPlayFrame(frame, tripPlayView);
      if (frame.phase !== 'end') {
        tripPlayRaf = requestAnimationFrame(tick);
      } else {
        tripPlayRaf = null;
      }
    }
    tripPlayRaf = requestAnimationFrame(tick);
  }

  function bindRecordListEvents() {
    var list = document.getElementById('record-list');
    list.addEventListener('click', function (event) {
      var item = event.target.closest('.record-item');
      if (!item) return;
      startTripPlay(Number(item.getAttribute('data-index')));
    });
    list.addEventListener('mouseover', function (event) {
      if (focusedRecordIndex != null) return;
      var item = event.target.closest('.record-item');
      if (!item) return;
      highlightedRoute = item.getAttribute('data-route');
      Array.prototype.forEach.call(list.querySelectorAll('.record-item'), function (node) {
        node.classList.toggle('is-active', node === item);
      });
      renderMap();
    });
    list.addEventListener('mouseleave', function () {
      if (focusedRecordIndex != null) return;
      highlightedRoute = null;
      Array.prototype.forEach.call(list.querySelectorAll('.record-item'), function (node) {
        node.classList.remove('is-active');
      });
      renderMap();
    });
  }

  function setVisibleCount(count) {
    var restoredView = exitTripPlayMode();
    visibleCount = count;
    document.getElementById('time-slider').value = String(count);
    refreshTimeLabel();
    renderMap(restoredView);
  }

  function stopPlay() {
    if (playTimer) {
      clearInterval(playTimer);
      playTimer = null;
    }
    document.getElementById('play-btn').textContent = '播放';
  }

  function startPlay() {
    if (playRecords.length === 0) return;
    if (visibleCount >= playRecords.length) {
      setVisibleCount(0);
    } else if (focusedRecordIndex != null) {
      restoreFullMap();
    }
    document.getElementById('play-btn').textContent = '暂停';
    playTimer = setInterval(function () {
      if (visibleCount >= playRecords.length) {
        stopPlay();
        return;
      }
      setVisibleCount(visibleCount + 1);
    }, 650);
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
      var restoredView = exitTripPlayMode();
      visibleCount = 0;
      slider.value = '0';
      document.getElementById('time-label').textContent = '该时间段无乘车记录';
      renderMap(restoredView);
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

  function topEntry(map) {
    var entries = window.TrainStats.sortedEntries(map, 1);
    return entries.length ? entries[0] : null;
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

    var topStation = topEntry(yearStats.stationVisits);
    document.getElementById('review-top-station').textContent = topStation ? topStation[0] : '-';
    document.getElementById('review-top-station-count').textContent = topStation
      ? '到访 ' + topStation[1] + ' 次'
      : '';

    var topRoute = topEntry(yearStats.lineRoutes);
    var topTrain = topEntry(yearStats.trains);
    document.getElementById('review-top-route').textContent = topRoute ? topRoute[0] : '-';
    document.getElementById('review-top-train').textContent =
      (topRoute ? '乘坐 ' + topRoute[1] + ' 次' : '') +
      (topTrain ? ' · 最乘车次 ' + topTrain[0] + '（' + topTrain[1] + ' 次）' : '');
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
    animateNumber(document.getElementById('stat-mileage'), Math.round(stats.mileageKm));

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
