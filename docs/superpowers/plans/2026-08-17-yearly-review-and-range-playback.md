# 按范围回放 + 年度回顾 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 足迹回放支持全部/按年份/自定义时间段三种范围，并新增按年份展示乘坐次数、到访车站、最常到访车站、最常乘坐线路（区间+车次）的年度回顾弹窗，两者通过「回放这一年」联动。

**Architecture:** 纯函数（年份枚举、范围过滤、车次计数）放进 `js/stats.js` 并用 node:test 单测（TDD）；`js/app.js` 引入 `playRecords`（当前回放范围）状态，地图与记录列表基于它渲染；年度回顾为 `.app` 内的全屏遮罩弹窗，复用 `computeStats` 计算单年数据。

**Tech Stack:** 原生 HTML/CSS/JS + ECharts 5（本地），测试用 `node --test`（node:test + assert）。

## Global Constraints

- 纯前端离线页面，禁止引入新依赖、禁止 fetch（兼容 `file://` 直开）
- 数据结构 `window.TRAIN_DATA` 不变
- 筛选只影响地图回放与乘车记录列表；顶部统计卡与右侧排行图保持全量
- 提交信息使用中文、遵循 `feat: / fix: / docs:` 前缀风格
- 验证命令：`node --test`（在仓库根目录执行，需全绿）

---

### Task 1: stats.js 纯函数与车次计数（TDD）

**Files:**
- Modify: `js/stats.js`
- Test: `tests/stats.test.js`

**Interfaces:**
- Produces（后续任务依赖）:
  - `TrainStats.listYears(records) -> string[]`：去重升序年份，如 `['2023','2024','2025','2026']`
  - `TrainStats.recordsByYear(records, year) -> record[]`：`year` 为 `'2026'` 字符串
  - `TrainStats.filterRecordsByRange(records, start, end) -> record[]`：含边界；`start`/`end` 为 `'YYYY-MM-DD'` 或空字符串
  - `computeStats` 返回值新增 `trains`（车车次 → 次数 map）

- [ ] **Step 1: 写失败测试**（追加到 `tests/stats.test.js` 末尾）

```js
describe('listYears / recordsByYear / filterRecordsByRange', () => {
  const recs = [
    { date: '2023-08-04', from: '汉口', to: '南京南', train: 'G1' },
    { date: '2024-01-01', from: '南京南', to: '汉口', train: 'G2' },
    { date: '2026-02-01', from: '汉口', to: '武汉', train: 'G3' },
    { date: '2026-08-16', from: '武汉', to: '南京南', train: 'G3' },
  ];

  it('listYears returns sorted unique years', () => {
    const { listYears } = loadStats();
    assert.deepEqual(listYears(recs), ['2023', '2024', '2026']);
    assert.deepEqual(listYears([]), []);
  });

  it('recordsByYear filters by year prefix', () => {
    const { recordsByYear } = loadStats();
    assert.equal(recordsByYear(recs, '2026').length, 2);
    assert.equal(recordsByYear(recs, '2025').length, 0);
  });

  it('filterRecordsByRange keeps boundaries and supports open ends', () => {
    const { filterRecordsByRange } = loadStats();
    assert.equal(filterRecordsByRange(recs, '2024-01-01', '2026-02-01').length, 2);
    assert.equal(filterRecordsByRange(recs, '', '2023-12-31').length, 1);
    assert.equal(filterRecordsByRange(recs, '2025-01-01', '').length, 2);
    assert.equal(filterRecordsByRange(recs, '', '').length, 4);
    assert.equal(filterRecordsByRange(recs, '2030-01-01', '2030-12-31').length, 0);
  });
});

describe('computeStats trains', () => {
  it('counts rides per train number', () => {
    const { computeStats } = loadStats();
    const stats = computeStats({
      records: [
        { date: '2026-01-01', from: '汉口', to: '南京南', train: 'G1', vehicle: 'CR400BF-S-0001', bureau: '上海局' },
        { date: '2026-01-02', from: '汉口', to: '南京南', train: 'G1', vehicle: 'CR400BF-S-0002', bureau: '上海局' },
        { date: '2026-01-03', from: '汉口', to: '南京南', train: 'G2', vehicle: 'CR400BF-S-0003', bureau: '上海局' },
      ],
      stations: { 汉口: [114.26, 30.62], 南京南: [118.81, 31.97] },
    });
    assert.equal(stats.trains['G1'], 2);
    assert.equal(stats.trains['G2'], 1);
  });
});
```

- [ ] **Step 2: 运行确认失败**

Run: `node --test`
Expected: FAIL（`listYears is not a function` 等）

- [ ] **Step 3: 实现**（`js/stats.js`）

`computeStats` 的 forEach 内加 `bump(trains, record.train, 1);`（先声明 `const trains = {};`），返回值加 `trains: trains`。文件尾部新增：

```js
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
```

并在 `root.TrainStats` 导出中追加 `listYears`、`recordsByYear`、`filterRecordsByRange`。

- [ ] **Step 4: 运行确认通过**

Run: `node --test`
Expected: PASS（含原有 TRAIN_DATA 集成测试 27/20/16/23 不受影响）

- [ ] **Step 5: Commit**

```bash
git add js/stats.js tests/stats.test.js
git commit -m "feat: 统计模块支持按年份/时间段筛选与车次计数"
```

---

### Task 2: 页面结构与样式（筛选栏 + 年度回顾弹窗）

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

**Interfaces:**
- Produces（Task 3/4 依赖的 DOM id）：
  - `#range-mode`（select: all/year/custom）、`#range-year`、`#range-start`、`#range-end`
  - `#review-btn`、`#review-modal`、`#review-title`、`#review-years`、`#review-rides`、`#review-stations`、`#review-top-station`、`#review-top-station-count`、`#review-top-route`、`#review-top-train`、`#review-play`、`#review-close`
  - `.timeline-controls` 包裹原播放按钮/滑块/标签

- [ ] **Step 1: 修改 index.html**

header 的 `.title-wrap` 内 `<h1>` 后加：

```html
<button id="review-btn" type="button">年度回顾</button>
```

`.timeline` 改为两行结构：

```html
<div class="timeline">
  <div class="timeline-filter">
    <label for="range-mode">回放范围</label>
    <select id="range-mode">
      <option value="all">全部</option>
      <option value="year">按年份</option>
      <option value="custom">自定义时间段</option>
    </select>
    <select id="range-year" hidden></select>
    <input id="range-start" type="date" hidden>
    <input id="range-end" type="date" hidden>
  </div>
  <div class="timeline-controls">
    <button id="play-btn" type="button" aria-label="播放或暂停时间轴">播放</button>
    <input id="time-slider" type="range" min="0" value="0">
    <span id="time-label">准备回放</span>
  </div>
</div>
```

`</div><!-- .app -->` 之前加弹窗：

```html
<div id="review-modal" class="review-modal" hidden>
  <div class="review-backdrop" data-review-close></div>
  <div class="review-dialog" role="dialog" aria-modal="true" aria-labelledby="review-title">
    <div class="review-header">
      <h2 id="review-title">年度回顾</h2>
      <button id="review-close" type="button" aria-label="关闭年度回顾">×</button>
    </div>
    <div id="review-years" class="review-years"></div>
    <div class="review-cards">
      <article class="review-card">
        <span class="stat-label">乘坐次数</span>
        <strong id="review-rides" class="stat-value">0</strong>
      </article>
      <article class="review-card">
        <span class="stat-label">到访车站</span>
        <strong id="review-stations" class="stat-value">0</strong>
      </article>
      <article class="review-card">
        <span class="stat-label">最常到访车站</span>
        <strong id="review-top-station" class="stat-value review-text">-</strong>
        <span id="review-top-station-count" class="stat-note"></span>
      </article>
      <article class="review-card">
        <span class="stat-label">最常乘坐线路</span>
        <strong id="review-top-route" class="stat-value review-text">-</strong>
        <span id="review-top-train" class="stat-note"></span>
      </article>
    </div>
    <div class="review-actions">
      <button id="review-play" type="button">▶ 回放这一年</button>
    </div>
  </div>
</div>
```

- [ ] **Step 2: 追加 css/style.css**

```css
.title-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

#review-btn,
#review-play {
  height: 32px;
  padding: 0 18px;
  border: 1px solid var(--cyan);
  background: rgba(0, 229, 255, 0.08);
  color: var(--cyan);
  cursor: pointer;
  letter-spacing: 0.12em;
}

#review-btn:hover,
#review-play:hover {
  background: rgba(0, 229, 255, 0.18);
}

.timeline {
  display: grid;
  grid-template-rows: auto auto;
  gap: 8px;
  padding: 10px 14px 12px;
  border-top: 1px solid var(--line);
}

.timeline-filter {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
  font-size: 12px;
}

.timeline-filter select,
.timeline-filter input {
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--line);
  background: rgba(0, 20, 40, 0.6);
  color: var(--text);
  font-size: 12px;
  color-scheme: dark;
}

.timeline-controls {
  display: grid;
  grid-template-columns: 72px 1fr auto;
  align-items: center;
  gap: 12px;
}

#play-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.review-modal {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: grid;
  place-items: center;
}

.review-modal[hidden] {
  display: none;
}

.review-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(3, 6, 16, 0.82);
}

.review-dialog {
  position: relative;
  width: 760px;
  padding: 26px 30px 24px;
  background: var(--bg-elev);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.review-header h2 {
  margin: 0;
  color: var(--cyan-dim);
  letter-spacing: 0.16em;
}

#review-close {
  border: none;
  background: none;
  color: var(--muted);
  font-size: 26px;
  cursor: pointer;
}

#review-close:hover {
  color: var(--cyan);
}

.review-years {
  display: flex;
  gap: 10px;
  margin: 18px 0;
}

.review-year-btn {
  padding: 6px 20px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--text);
  cursor: pointer;
  letter-spacing: 0.1em;
}

.review-year-btn.is-active {
  border-color: var(--cyan);
  background: rgba(0, 229, 255, 0.14);
  color: var(--cyan);
}

.review-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.review-card {
  padding: 14px 16px;
  background: rgba(0, 20, 40, 0.45);
  border: 1px solid var(--line);
}

.review-text {
  font-size: 20px;
  white-space: nowrap;
}

.review-actions {
  margin-top: 22px;
  text-align: center;
}
```

同时删除旧 `.timeline` 规则（被上面的新规则替代）。

- [ ] **Step 3: 浏览器目检**

用浏览器打开 `index.html`，确认筛选栏/按钮/弹窗结构渲染正常（逻辑在后续任务接入，此时控件不生效属预期）。

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: 添加回放范围筛选栏与年度回顾弹窗结构样式"
```

---

### Task 3: app.js 范围回放逻辑

**Files:**
- Modify: `js/app.js`

**Interfaces:**
- Consumes: Task 1 的 `listYears`/`recordsByYear`/`filterRecordsByRange`，Task 2 的 DOM id
- Produces: `applyRangeFilter()`、`syncRangeControls()`、`playRecords` 状态；Task 4 的「回放这一年」复用

- [ ] **Step 1: 状态与筛选函数**

顶部变量 `sortedRecords` 改名/拆分：`allRecords`（全量排序）、`playRecords`（当前范围）。`recordsUpTo`、`setVisibleCount`、`startPlay` 中的 `sortedRecords` 全部改为 `playRecords`。

`setVisibleCount` 完整标签分支中「全部足迹」前缀改为按是否筛选区分：

```js
var prefix = playRecords.length === allRecords.length ? '全部足迹 ' : '本段足迹 ';
label.textContent = prefix + playRecords[0].date.slice(0, 7) + ' → ' + playRecords[count - 1].date.slice(0, 7);
```

新增：

```js
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
    .map(function (y) { return '<option value="' + y + '">' + y + ' 年</option>'; })
    .join('');
  yearSelect.value = years[years.length - 1];
  var first = allRecords[0].date;
  var last = allRecords[allRecords.length - 1].date;
  var start = document.getElementById('range-start');
  var end = document.getElementById('range-end');
  start.min = first; start.max = last; start.value = first;
  end.min = first; end.max = last; end.value = last;
}
```

- [ ] **Step 2: renderRecords 基于 playRecords，事件只绑一次**

`renderRecords()` 内 `sortedRecords.map` 改为 `playRecords.map`；两个 `addEventListener` 从 `renderRecords` 移到 `boot()`（事件委托不依赖 innerHTML，避免重复绑定）。

- [ ] **Step 3: boot() 接线**

`boot()` 中：`sortedRecords = ...` 改为 `allRecords = ...`（同样排序逻辑），其后 `playRecords = allRecords`；`populateRangeControls()`；`syncRangeControls()`；为 `#range-mode`、`#range-year`、`#range-start`、`#range-end` 绑定 change（mode 变化时先 `syncRangeControls()` 再 `applyRangeFilter()`，其余直接 `applyRangeFilter()`）；滑块 `slider.max` 用 `playRecords.length`；末尾 `setVisibleCount(playRecords.length)`。

- [ ] **Step 4: 运行测试 + 浏览器验证**

Run: `node --test`（应仍全绿，app.js 无单测覆盖，防止语法错误：`node --check js/app.js`）
浏览器验证：切年份 → 地图与记录列表只显示该年；自定义时间段 → 同上；播放按钮在范围内从头回放；空范围显示提示且播放禁用。

- [ ] **Step 5: Commit**

```bash
git add js/app.js
git commit -m "feat: 足迹回放支持全部/按年份/自定义时间段范围"
```

---

### Task 4: 年度回顾弹窗逻辑与联动

**Files:**
- Modify: `js/app.js`

**Interfaces:**
- Consumes: Task 1 `computeStats`（含 `trains`）/ `listYears` / `recordsByYear` / `sortedEntries`；Task 3 `applyRangeFilter` / `syncRangeControls` / `startPlay` / `setVisibleCount`

- [ ] **Step 1: 弹窗逻辑**（app.js 新增）

```js
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

  var topRoute = topEntry(yearStats.routes);
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
```

- [ ] **Step 2: boot() 绑定事件**

```js
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
```

- [ ] **Step 3: 验证**

Run: `node --test`、`node --check js/app.js`
浏览器验证：打开弹窗默认最新年；切换年份数据刷新；「回放这一年」关闭弹窗、范围切到该年并自动播放；Esc/遮罩/× 均可关闭。

- [ ] **Step 4: Commit**

```bash
git add js/app.js
git commit -m "feat: 新增年度回顾弹窗并支持一键回放该年足迹"
```

---

### Task 5: 整体验证

- [ ] **Step 1:** `node --test` 全绿；`node --check js/app.js`、`node --check js/stats.js` 无语法错误
- [ ] **Step 2:** 浏览器完整走查：全部/年份/自定义三种回放范围、空范围提示、年度回顾四项统计、联动回放、Esc 关闭
