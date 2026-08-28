const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'css', 'style.css'), 'utf8');
const appCode = fs.readFileSync(path.join(root, 'js', 'app.js'), 'utf8');
const motionCode = fs.readFileSync(path.join(root, 'js', 'mobile-animations.js'), 'utf8');
const layoutCode = fs.readFileSync(path.join(root, 'js', 'mobile-layout.js'), 'utf8');

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

function loadMotionRuntime() {
  const frames = [];
  const observedCards = [];
  const scene = {
    classList: {
      add() {},
      remove() {},
      toggle() {},
    },
    style: { setProperty() {}, removeProperty() {} },
    getBoundingClientRect() {
      return { top: 0, height: 800 };
    },
  };

  function makeCard(box) {
    const classes = new Set();
    return {
      isConnected: true,
      _classes: classes,
      classList: {
        add(name) { classes.add(name); },
        remove(name) { classes.delete(name); },
        contains(name) { return classes.has(name); },
        toggle(name, on) {
          if (on) classes.add(name);
          else classes.delete(name);
        },
      },
      getBoundingClientRect() {
        return {
          top: box.top,
          bottom: box.bottom,
          height: box.height,
          left: 0,
          right: 360,
          width: 360,
        };
      },
    };
  }

  const cards = [
    makeCard({ top: 80, bottom: 180, height: 100 }),
    makeCard({ top: 900, bottom: 1000, height: 100 }),
  ];
  const list = { children: [] };
  let mutationCallback = null;
  const documentRef = {
    readyState: 'loading',
    querySelectorAll(selector) {
      if (selector === '.mobile-scene') return [scene];
      if (String(selector).indexOf('.stat-card') !== -1) return cards.concat(list.children);
      return [];
    },
    getElementById(id) {
      return id === 'record-list' ? list : null;
    },
    addEventListener() {},
  };
  const windowRef = {
    document: documentRef,
    innerWidth: 360,
    innerHeight: 800,
    TrainScale: {
      isCompactLayout(width) {
        return width <= 1024;
      },
      readViewportSize() {
        return { width: 360, height: 800 };
      },
    },
    matchMedia() {
      return {
        matches: false,
        addEventListener() {},
        removeEventListener() {},
      };
    },
    IntersectionObserver: function IntersectionObserver() {
      this.observe = (node) => {
        if (node !== scene) observedCards.push(node);
      };
      this.unobserve = () => {};
      this.disconnect = () => {};
    },
    MutationObserver: function MutationObserver(callback) {
      mutationCallback = callback;
      this.observe = () => {};
      this.disconnect = () => {};
    },
    requestAnimationFrame(fn) {
      frames.push(fn);
      return frames.length;
    },
    cancelAnimationFrame() {},
    addEventListener() {},
    removeEventListener() {},
  };
  const fn = new Function(
    'window',
    'globalThis',
    'document',
    motionCode + '\nreturn window.TrainMobileMotion;'
  );
  return {
    api: fn(windowRef, windowRef, documentRef),
    cards,
    list,
    observedCards,
    makeCard,
    documentRef,
    windowRef,
    get mutationCallback() {
      return mutationCallback;
    },
    flushFrame() {
      frames.splice(0).forEach((frame) => frame());
    },
  };
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
  it('orders three pages for the compact reading flow', () => {
    const scenes = [...html.matchAll(/class="[^"]*mobile-scene[^"]*"[^>]*data-scene="([^"]+)"/g)]
      .map((match) => match[1]);
    assert.deepEqual(scenes, ['footprint', 'insights', 'records']);
  });

  it('groups title, stats and map first, then rankings, then trip records on compact screens', () => {
    assert.match(layoutCode, /pageFootprint\.appendChild\(nodes\.header\)/);
    assert.match(layoutCode, /pageFootprint\.appendChild\(nodes\.stats\)/);
    assert.match(layoutCode, /pageFootprint\.appendChild\(nodes\.map\)/);
    assert.match(layoutCode, /pageInsights\.appendChild\(nodes\.ranking\)/);
    assert.match(layoutCode, /pageInsights\.appendChild\(nodes\.reunion\)/);
    assert.match(layoutCode, /pageRecords\.appendChild\(nodes\.records\)/);
    assert.match(html, /<h2>行程数据<\/h2>/);
    assert.match(html, /<h2>相遇重逢<\/h2>/);
    assert.doesNotMatch(appCode, /缘分重逢/);
  });

  it('restores page scrolling, proximity snap, and safe areas', () => {
    assert.match(css, /@media\s*\(max-width:\s*1024px\)/);
    assert.match(css, /overflow-y:\s*auto;/);
    assert.match(css, /scroll-snap-type:\s*y proximity/);
    assert.match(css, /scroll-snap-align:\s*start/);
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
    assert.match(appCode, />···<\/span>/);
    assert.doesNotMatch(appCode, />更多<\/button>/);
    assert.match(appCode, /event\.stopPropagation\(\)/);
    assert.match(appCode, /openRecordActionSheet/);
  });

  it('keeps compact controls unobtrusive and aligned', () => {
    assert.match(html, /<button id="settings-btn" type="button">设置<\/button>/);
    assert.match(html, /class="map-frame">[\s\S]*?class="map-viewport">[\s\S]*?<\/div>\s*<\/div>\s*<button id="map-explore-btn"/);
    assert.match(html, /class="record-panel-head">[\s\S]*?<h2>行程数据<\/h2>[\s\S]*?id="add-trip-btn"/);
    assert.match(css, /@media\s*\(max-width:\s*1024px\)[\s\S]*?#settings-btn\s*\{\s*display:\s*none;/);
    assert.match(css, /\.title-wrap\s*\{[\s\S]*?align-items:\s*center;/);
    assert.match(css, /\.title-actions\s*\{[\s\S]*?justify-content:\s*center;/);
    assert.match(css, /\.map-frame\s*\{[\s\S]*?border-radius:\s*calc\(var\(--card-radius\) - 1px\)/);
    assert.match(css, /\.map-explore-btn\s*\{[\s\S]*?position:\s*absolute;/);
    assert.match(css, /\.map-explore-btn\s*\{[\s\S]*?backdrop-filter:\s*blur/);
    assert.match(css, /grid-template-areas:\s*"label mode types";/);
    assert.match(css, /\.record-more\s*\{[\s\S]*?width:\s*32px;[\s\S]*?border:\s*0;[\s\S]*?background:\s*transparent;/);
    assert.match(appCode, /getElementById\('add-trip-btn'\)\.addEventListener\('click', openAddTripForm\)/);
  });

  it('uses premium card styling, segmented filters, and press feedback on compact screens', () => {
    assert.match(css, /--card-radius:\s*18px/);
    assert.match(css, /\.type-filter\s*\{[\s\S]*?border-radius:\s*999px/);
    assert.match(css, /\.type-filter-btn\.is-active\s*\{[\s\S]*?background:\s*rgba\(0, 229, 255, 0\.16\)/);
    assert.match(css, /#trip-submit\s*\{[\s\S]*?linear-gradient\(135deg/);
    assert.match(css, /\.rank-toggle\s*\{[\s\S]*?width:\s*36px;[\s\S]*?border:\s*0;[\s\S]*?background:\s*transparent;/);
    assert.match(css, /:active\s*\{\s*transform:\s*scale\(0\.96\)/);
    assert.match(css, /\.record-item\.is-touching\s*\{[\s\S]*?transform:\s*scale\(0\.985\)/);
    assert.match(css, /@keyframes\s+mobile-sheet-rise/);
  });
});

describe('mobile animation controls', () => {
  it('initializes scene states only with IntersectionObserver and uses passive rAF scroll work', () => {
    assert.match(motionCode, /IntersectionObserver/);
    assert.match(motionCode, /addEventListener\('scroll',\s*scheduleParallax,\s*\{\s*passive:\s*true/);
    assert.match(motionCode, /requestAnimationFrame/);
    assert.match(motionCode, /scene-motion-ready/);
  });

  it('reveals each card once as it enters the viewport', () => {
    assert.match(motionCode, /CARD_SELECTOR/);
    assert.match(motionCode, /\.stat-card, \.map-panel/);
    assert.match(motionCode, /\.record-item/);
    assert.match(motionCode, /classList\.add\('card-motion-ready'\)/);
    assert.match(motionCode, /classList\.add\('has-revealed'\)/);
    assert.match(motionCode, /MutationObserver/);
    assert.match(css, /\.card-motion-ready\.has-revealed\s*\{\s*opacity:\s*1/);
    assert.doesNotMatch(css, /opacity:\s*0\.48/);
  });

  it('supports reduced motion for scenes and data/chart animations', () => {
    assert.match(motionCode, /prefers-reduced-motion/);
    assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    assert.match(css, /scroll-snap-type:\s*none/);
    assert.match(appCode, /prefersReducedMotion/);
    assert.match(appCode, /animation: animateMap !== false && !prefersReducedMotion\(\)/);
    assert.match(appCode, /var motionEnabled = !prefersReducedMotion\(\);/);
  });

  it('animates in-view cards on compact screens and observes newly rendered records', () => {
    const motion = loadMotionRuntime();
    const result = motion.api.init(motion.documentRef, motion.windowRef);
    assert.ok(result);
    assert.equal(motion.cards[0]._classes.has('card-motion-ready'), true);
    assert.equal(motion.cards[1]._classes.has('card-motion-ready'), true);
    motion.flushFrame();
    assert.equal(motion.cards[0]._classes.has('has-revealed'), true);
    assert.equal(motion.observedCards.includes(motion.cards[1]), true);

    const lateCard = motion.makeCard({ top: 900, bottom: 968, height: 68 });
    motion.list.children.push(lateCard);
    motion.mutationCallback();
    assert.equal(lateCard._classes.has('card-motion-ready'), true);
    assert.equal(motion.observedCards.includes(lateCard), true);
    result.stop();
  });
});
