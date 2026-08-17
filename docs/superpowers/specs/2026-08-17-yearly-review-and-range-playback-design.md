# 按范围回放 + 年度回顾 设计文档

日期：2026-08-17
状态：已获用户批准

## 背景

现有页面（`index.html` + `js/app.js`）的时间轴回放只能覆盖全部乘车记录，无法聚焦某一年或某段时间；统计也只有全量口径。本次新增两个联动功能。

## 功能一：按范围回放足迹动画

### UI

时间轴控件（`.timeline`）上方新增一行筛选栏 `.timeline-filter`：

- 范围模式下拉 `#range-mode`：`全部` / `按年份` / `自定义时间段`
- 年份下拉 `#range-year`：按数据动态生成（当前为 2023–2026），仅「按年份」模式显示
- 开始/结束日期框 `#range-start` / `#range-end`：仅「自定义时间段」模式显示，min/max 限定在数据日期范围内

### 交互逻辑

- `app.js` 维护 `playRecords`（当前回放范围，`allRecords` 的子集）；`visibleCount`、滑块、时间标签、地图、乘车记录列表全部基于 `playRecords`
- 切换模式/年份/日期：停止播放 → 重算 `playRecords` → `visibleCount = playRecords.length`（直接展示该范围全貌）→ 记录列表同步刷新
- 点「播放」在当前范围内从 0 逐步回放
- 顶部统计卡与右侧三个排行图保持全量统计，不随筛选变化
- 范围为空：时间标签提示"该时间段无乘车记录"，禁用播放按钮

## 功能二：年度回顾弹窗

### UI

- 入口：header 标题旁「年度回顾」按钮 `#review-btn`
- 全屏遮罩弹窗 `#review-modal`：
  - 顶部一排年份切换按钮（动态生成，默认选中最新年份）
  - 四张统计卡：乘坐次数、到访车站数、最常到访车站（站名 + 次数）、最常乘坐线路（区间 A→B N 次 + 最乘车次 Gxxx M 次）
  - 底部「▶ 回放这一年」按钮：关闭弹窗，回放范围切到该年份并自动开始播放
- 关闭方式：× 按钮、点击遮罩、Esc 键

### 数据口径

- 「最常乘坐的线路」同时展示乘车区间（from→to）与车次两个维度（用户确认）
- 某年无记录时不生成该年份按钮

## 技术实现

### `js/stats.js`（纯函数，可单测）

- `listYears(records)` → 去重升序年份数组，如 `['2023','2024','2025','2026']`
- `filterRecordsByRange(records, start, end)` → 子集，含边界；start/end 可为空字符串
- `recordsByYear(records, year)` → 该年子集
- `computeStats` 返回值新增 `trains`（车频次计数 map），向后兼容

### `js/app.js`

- `boot()` 内排序结果存为 `allRecords`；`applyRangeFilter()` 计算 `playRecords` 并刷新滑块上限、记录列表、地图
- `renderRecords()` 改为渲染 `playRecords`
- 新增弹窗渲染/开关逻辑与「回放这一年」联动（设置范围模式+年份后 `startPlay()`）

### `index.html` / `css/style.css`

- 筛选栏、年度回顾按钮、弹窗结构与霓虹深色风样式

### 测试

- `tests/stats.test.js` 补充 `listYears` / `filterRecordsByRange` / `recordsByYear` / `trains` 计数的用例
- 验证命令：`node --test`

## 改动文件

- `js/stats.js`、`js/app.js`、`index.html`、`css/style.css`、`tests/stats.test.js`
- 不动：`js/data.js`（数据结构不变）、`js/scale.js`、`lib/`、`map/`
