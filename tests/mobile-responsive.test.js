const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'css', 'style.css'), 'utf8');
const appCode = fs.readFileSync(path.join(root, 'js', 'app.js'), 'utf8');
const motionCode = fs.readFileSync(path.join(root, 'js', 'mobile-animations.js'), 'utf8');

function loadScale() {
  const code = fs.readFileSync(path.join(root, 'js', 'scale.js'), 'utf8');
  const sandbox = { document: undefined };
  const fn = new Function('window', 'globalThis', 'document', code + '\nreturn window.TrainScale;');
  return fn(sandbox, sandbox, undefined);
}

function loadRuntimeScale() {
  const code = fs.readFileSync(path.join(root, 'js', 'scale.js'), 'utf8');
  const attributes = {};
  const app = {
    style: {
      transform: 'translate(-50%, -50%) scale(0.4)',
      removeProperty(name) {
        delete this[name];
      },
    },
    getAttribute(name) {
      return attributes[name] || null;
    },
    setAttribute(name, value) {
      attributes[name] = value;
    },
  };
  const documentRef = {
    readyState: 'loading',
    querySelector() {
      return app;
    },
    addEventListener() {},
  };
  const windowRef = {
    innerWidth: 360,
    innerHeight: 800,
    addEventListener() {},
    dispatchEvent() {},
  };
  const fn = new Function('window', 'globalThis', 'document', code + '\nreturn window.TrainScale;');
  return { scale: fn(windowRef, windowRef, documentRef), app, windowRef };
}

function loadMap() {
  const fn = new Function(
    'window',
    'globalThis',
    'document',
    appCode + '\nreturn window.TrainMap;'
  );
  const sandbox = { document: undefined };
  return fn(sandbox, sandbox, undefined);
}

describe('compact responsive scaling', () => {
  it('uses 1024px as the compact-layout boundary', () => {
    const scale = loadScale();
    assert.equal(scale.COMPACT_BREAKPOINT, 1024);
    assert.equal(scale.isCompactLayout(360), true);
    assert.equal(scale.isCompactLayout(1024), true);
    assert.equal(scale.isCompactLayout(1025), false);
  });

  it('removes the inline desktop transform in compact mode and restores it on desktop', () => {
    const { scale, app, windowRef } = loadRuntimeScale();
    scale.applyPageScale(windowRef);
    assert.equal(app.style.transform, undefined);
    assert.equal(app.getAttribute('data-layout-mode'), 'compact');
    windowRef.innerWidth = 1920;
    windowRef.innerHeight = 1080;
    scale.applyPageScale(windowRef);
    assert.equal(app.style.transform, 'translate(-50%, -50%) scale(1)');
    assert.equal(app.getAttribute('data-layout-mode'), 'desktop');
  });

  it('keeps the desktop map roam default while allowing compact mode to disable it', () => {
    const { buildGeoOption } = loadMap();
    assert.equal(buildGeoOption().roam, true);
    assert.equal(buildGeoOption(undefined, { roam: false }).roam, false);
  });
});

describe('mobile scroll story structure', () => {
  it('orders five scenes for the compact reading flow', () => {
    const scenes = [...html.matchAll(/class="[^"]*mobile-scene[^"]*"[^>]*data-scene="([^"]+)"/g)]
      .map((match) => match[1]);
    assert.deepEqual(scenes, ['overview', 'map', 'ranking', 'reunion', 'records']);
  });

  it('restores page scrolling, proximity snap, safe areas, and natural long-content flow', () => {
    assert.match(css, /@media\s*\(max-width:\s*1024px\)/);
    assert.match(css, /overflow-y:\s*auto;/);
    assert.match(css, /scroll-snap-type:\s*y\s+proximity;/);
    assert.match(css, /scroll-snap-align:\s*start;/);
    assert.match(css, /100svh/);
    assert.match(css, /safe-area-inset-bottom/);
    assert.match(css, /\.record-list\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3/);
    assert.match(css, /\.record-list\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\);/);
    assert.doesNotMatch(css, /scroll-snap-stop:\s*always/);
  });

  it('keeps mobile record actions separate from route playback clicks', () => {
    assert.match(html, /id="record-action-sheet"/);
    assert.match(html, /data-action="edit"/);
    assert.match(html, /data-action="delete"/);
    assert.match(appCode, /class="record-more"/);
    assert.match(appCode, /event\.stopPropagation\(\)/);
    assert.match(appCode, /openRecordActionSheet/);
  });
});

describe('mobile animation controls', () => {
  it('initializes scene states only with IntersectionObserver and uses passive rAF scroll work', () => {
    assert.match(motionCode, /IntersectionObserver/);
    assert.match(motionCode, /addEventListener\('scroll',\s*scheduleParallax,\s*\{\s*passive:\s*true/);
    assert.match(motionCode, /requestAnimationFrame/);
    assert.match(motionCode, /scene-motion-ready/);
  });

  it('supports reduced motion for scenes and data/chart animations', () => {
    assert.match(motionCode, /prefers-reduced-motion/);
    assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    assert.match(appCode, /prefersReducedMotion/);
    assert.match(appCode, /animation: animateMap !== false && !prefersReducedMotion\(\)/);
    assert.match(appCode, /var motionEnabled = !prefersReducedMotion\(\);/);
  });
});
