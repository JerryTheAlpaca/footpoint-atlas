// 移动端地图交互冒烟验证：
// 1) 页面无 JS 错误（favicon 404 忽略）
// 2) 点击省份（远离线路）不弹省份名 tooltip
// 3) 点击偏离线路 10px 的位置（原生命中不了）能宽松命中并弹出该线路 tooltip
const { chromium, devices } = require('playwright');

const CHROME = 'C:\\Users\\zhang\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe';

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const context = await browser.newContext({
    ...devices['iPhone 13'],
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push('pageerror: ' + String(err)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('console: ' + msg.text());
  });
  page.on('response', (res) => {
    if (res.status() >= 400 && !/favicon/i.test(res.url())) errors.push('http ' + res.status() + ': ' + res.url());
  });

  await page.goto('http://127.0.0.1:8137/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);
  // 地图滚进视口，坐标换算才是纯 rect + 局部像素
  await page.evaluate(() => {
    document.getElementById('map-chart').scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(800);

  const target = await page.evaluate(() => {
    const el = document.getElementById('map-chart');
    const chart = window.echarts.getInstanceByDom(el);
    const opt = chart.getOption();
    const geo = opt.geo[0];
    let best = null;
    for (const s of opt.series) {
      if (!s.id || s.id.indexOf('map-lines-') !== 0 || !s.data) continue;
      for (const item of s.data) {
        if (!item || !item.coords || item.coords.length < 2) continue;
        const p0 = chart.convertToPixel({ geoIndex: 0 }, item.coords[0]);
        const p1 = chart.convertToPixel({ geoIndex: 0 }, item.coords[item.coords.length - 1]);
        const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
        if (!best || len > best.len) best = { len, name: item.name, p0, p1 };
      }
    }
    const rect = el.getBoundingClientRect();
    const far = chart.convertToPixel({ geoIndex: 0 }, [96.5, 35.8]);
    return {
      geoTipShow: geo.tooltip ? geo.tooltip.show : null,
      name: best ? best.name : null,
      len: best ? best.len : 0,
      tapX: best ? rect.left + best.p0[0] + (best.p1[0] - best.p0[0]) * 0.5 : 0,
      tapY: best ? rect.top + best.p0[1] + (best.p1[1] - best.p0[1]) * 0.5 - 10 : 0,
      farX: rect.left + far[0],
      farY: rect.top + far[1],
      rect: { left: rect.left, top: rect.top, w: rect.width, h: rect.height },
    };
  });
  if (!target.name) throw new Error('no long enough line found on screen');

  const readTooltips = () =>
    page.evaluate(() => {
      const el = document.getElementById('map-chart');
      const hits = [];
      el.querySelectorAll('div').forEach((d) => {
        // tooltip 隐藏后 innerHTML 仍在 DOM 里，必须排除 visibility:hidden
        if (d.style && d.style.position === 'absolute' && d.style.visibility !== 'hidden' && d.textContent.trim()) {
          hits.push(d.textContent.trim().slice(0, 120));
        }
      });
      return hits;
    });

  // --- 1) 点击偏离线中点 10px（原生命中不了）：宽松命中应弹出线路 tooltip
  await page.touchscreen.tap(target.tapX, target.tapY);
  await page.waitForTimeout(900);
  const tipAfterLineTap = await readTooltips();

  // --- 2) 点击远离线路的省份区域：不应出现任何 tooltip
  await page.touchscreen.tap(target.farX, target.farY);
  await page.waitForTimeout(900);
  const tipAfterProvinceTap = await readTooltips();

  const errorsRelevant = errors.filter((e) => !/favicon/i.test(e) && !/status of 404/.test(e));

  console.log('=== 结果 ===');
  console.log('geo.tooltip.show (期望 false):', target.geoTipShow);
  console.log('目标线:', target.name, '屏幕长度', Math.round(target.len), 'px');
  console.log('点击坐标(视口):', Math.round(target.tapX), Math.round(target.tapY));
  console.log('离线 10px 点击后 tooltip:', JSON.stringify(tipAfterLineTap));
  console.log('点击省份后 tooltip:', JSON.stringify(tipAfterProvinceTap));
  console.log('错误(忽略 favicon):', errorsRelevant.length ? errorsRelevant : '无');

  await page.screenshot({ path: '.workbuddy/verify-mobile-map.png' });
  await browser.close();

  // 线路 tooltip 内容是行程记录文本（如 "2023-07-27　G1970　南京南-兰州西"），不含箭头
  const lineOk = tipAfterLineTap.length > 0;
  const provinceOk = tipAfterProvinceTap.length === 0;
  console.log('=== 判定 ===');
  console.log('宽松点线命中:', lineOk ? 'PASS' : 'FAIL');
  console.log('省份名已屏蔽:', provinceOk ? 'PASS' : 'FAIL');
  console.log('无 JS 错误:', errorsRelevant.length === 0 ? 'PASS' : 'FAIL');
  process.exit(lineOk && provinceOk && errorsRelevant.length === 0 ? 0 : 1);
})();
