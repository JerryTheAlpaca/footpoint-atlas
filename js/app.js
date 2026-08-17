(function (root) {
  var NEON = '#00e5ff';
  var GOLD = '#ffd166';
  var DEFAULT_GEO_CENTER = [104.2, 35.8];
  var DEFAULT_GEO_ZOOM = 1.45;
  var GEO_ZOOM_MIN = 0.8;
  var GEO_ZOOM_MAX = 24;
  var charts = [];
  var mapChart;
  var playTimer = null;
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

  root.TrainMap = {
    buildGeoOption: buildGeoOption,
    readGeoView: readGeoView,
    routeLineWidth: routeLineWidth,
    stationSymbolSize: stationSymbolSize,
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
            curveness: 0.22,
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

  function renderMap() {
    var visible = recordsUpTo(visibleCount);
    var lines = buildLines(visible);
    var points = buildStations(visible);
    mapChart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(5, 12, 28, 0.92)',
        borderColor: NEON,
        textStyle: { color: '#e8f6ff', fontSize: 12 },
      },
      geo: buildGeoOption(readGeoView(mapChart)),
      series: [
        {
          name: '线路',
          type: 'lines',
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
          tooltip: {
            formatter: function (params) {
              return params.name + '<br/>到访次数：' + params.data.visits;
            },
          },
          data: points,
        },
      ],
    });
  }

  function axisStyle() {
    return {
      axisLabel: { color: '#9fdfff', fontSize: 11 },
      axisLine: { lineStyle: { color: 'rgba(0, 229, 255, 0.25)' } },
      splitLine: { show: false },
    };
  }

  function renderBars(el, entries, delayBase) {
    var chart = echarts.init(el);
    charts.push(chart);
    chart.setOption({
      animationDuration: 900,
      grid: { left: 72, right: 28, top: 8, bottom: 18 },
      xAxis: Object.assign({ type: 'value', minInterval: 1 }, axisStyle()),
      yAxis: Object.assign(
        {
          type: 'category',
          inverse: true,
          data: entries.map(function (item) {
            return item[0];
          }),
          axisLabel: { color: '#c6ecff', fontSize: 11 },
        },
        axisStyle()
      ),
      series: [
        {
          type: 'bar',
          data: entries.map(function (item) {
            return item[1];
          }),
          barWidth: 10,
          animationDelay: function (idx) {
            return idx * delayBase;
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#044b6e' },
              { offset: 1, color: NEON },
            ]),
          },
          label: { show: true, position: 'right', color: GOLD, fontSize: 11 },
        },
      ],
    });
  }

  function renderBureau(el, entries) {
    var chart = echarts.init(el);
    charts.push(chart);
    chart.setOption({
      animationDuration: 1100,
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          roseType: 'area',
          radius: ['18%', '72%'],
          center: ['50%', '55%'],
          data: entries.map(function (item) {
            return { name: item[0], value: item[1] };
          }),
          label: { color: '#c6ecff', fontSize: 11, formatter: '{b} {c}' },
          itemStyle: {
            borderColor: '#050814',
            borderWidth: 2,
          },
          color: ['#00e5ff', '#3aa0ff', '#7adfff', '#ffd166', '#5ee0b5', '#c084fc', '#f472b6'],
        },
      ],
    });
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

  function bindRecordListEvents() {
    var list = document.getElementById('record-list');
    list.addEventListener('mouseover', function (event) {
      var item = event.target.closest('.record-item');
      if (!item) return;
      highlightedRoute = item.getAttribute('data-route');
      Array.prototype.forEach.call(list.querySelectorAll('.record-item'), function (node) {
        node.classList.toggle('is-active', node === item);
      });
      renderMap();
    });
    list.addEventListener('mouseleave', function () {
      highlightedRoute = null;
      Array.prototype.forEach.call(list.querySelectorAll('.record-item'), function (node) {
        node.classList.remove('is-active');
      });
      renderMap();
    });
  }

  function setVisibleCount(count) {
    visibleCount = count;
    document.getElementById('time-slider').value = String(count);
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
    renderMap();
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
    if (visibleCount >= playRecords.length) setVisibleCount(0);
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
      visibleCount = 0;
      slider.value = '0';
      document.getElementById('time-label').textContent = '该时间段无乘车记录';
      renderMap();
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

    renderBars(
      document.getElementById('vehicle-chart'),
      window.TrainStats.sortedEntries(stats.vehicleTypes, 10),
      90
    );
    renderBars(
      document.getElementById('station-chart'),
      window.TrainStats.sortedEntries(stats.stationVisits, 10),
      70
    );
    renderBureau(document.getElementById('bureau-chart'), window.TrainStats.sortedEntries(stats.bureaus));
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
      if (event.key === 'Escape') closeReview();
    });

    setVisibleCount(playRecords.length);

    if (window.TrainScale) window.TrainScale.applyPageScale();

    window.addEventListener('resize', function () {
      if (window.TrainScale) window.TrainScale.applyPageScale();
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
