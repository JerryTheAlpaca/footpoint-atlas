(function (root) {
  var DESIGN_WIDTH = 1920;
  var DESIGN_HEIGHT = 1080;
  var COMPACT_BREAKPOINT = 1024;

  function computeFitScale(viewportWidth, viewportHeight, designWidth, designHeight) {
    var dw = designWidth == null ? DESIGN_WIDTH : designWidth;
    var dh = designHeight == null ? DESIGN_HEIGHT : designHeight;
    if (!(viewportWidth > 0) || !(viewportHeight > 0) || !(dw > 0) || !(dh > 0)) {
      return 1;
    }
    return Math.min(viewportWidth / dw, viewportHeight / dh);
  }

  function buildFitTransform(scale) {
    return 'translate(-50%, -50%) scale(' + scale + ')';
  }

  function isCompactLayout(viewportWidth, breakpoint) {
    var width = Number(viewportWidth);
    var limit = breakpoint == null ? COMPACT_BREAKPOINT : Number(breakpoint);
    return width > 0 && width <= limit;
  }

  function readViewportSize(win) {
    var target = win || root;
    var viewport = target && target.visualViewport;
    if (viewport && viewport.width > 0 && viewport.height > 0) {
      return { width: viewport.width, height: viewport.height };
    }
    return {
      width: target && target.innerWidth,
      height: target && target.innerHeight,
    };
  }

  function applyPageScale(win) {
    if (typeof document === 'undefined') return 1;
    var app = document.querySelector('.app');
    if (!app) return 1;
    var size = readViewportSize(win);
    var scale = computeFitScale(size.width, size.height);
    var compact = isCompactLayout(size.width);
    if (compact) {
      app.style.removeProperty('position');
      app.style.removeProperty('left');
      app.style.removeProperty('top');
      app.style.removeProperty('width');
      app.style.removeProperty('height');
      app.style.removeProperty('transform');
    } else {
      app.style.transform = buildFitTransform(scale);
    }
    var previousLayout = app.getAttribute('data-layout-mode');
    var nextLayout = compact ? 'compact' : 'desktop';
    app.setAttribute('data-layout-mode', nextLayout);
    if (previousLayout !== nextLayout && win && typeof win.dispatchEvent === 'function') {
      var event;
      var detail = { compact: compact, width: size.width, height: size.height };
      if (typeof win.CustomEvent === 'function') {
        event = new win.CustomEvent('train-layout-change', { detail: detail });
      } else if (document.createEvent) {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent('train-layout-change', false, false, detail);
      }
      if (event) win.dispatchEvent(event);
    }
    return scale;
  }

  function bindPageScale(win) {
    var target = win || root;
    applyPageScale(target);
    if (!target || typeof target.addEventListener !== 'function') return;
    target.addEventListener('resize', function () {
      applyPageScale(target);
    });
    target.addEventListener('orientationchange', function () {
      applyPageScale(target);
    });
    if (target.visualViewport) {
      target.visualViewport.addEventListener('resize', function () {
        applyPageScale(target);
      });
    }
  }

  root.TrainScale = {
    DESIGN_WIDTH: DESIGN_WIDTH,
    DESIGN_HEIGHT: DESIGN_HEIGHT,
    COMPACT_BREAKPOINT: COMPACT_BREAKPOINT,
    computeFitScale: computeFitScale,
    buildFitTransform: buildFitTransform,
    isCompactLayout: isCompactLayout,
    isCompactViewport: isCompactLayout,
    readViewportSize: readViewportSize,
    applyPageScale: applyPageScale,
    bindPageScale: bindPageScale,
  };

  if (typeof document === 'undefined') return;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      bindPageScale(root);
    });
  } else {
    bindPageScale(root);
  }
})(typeof window !== 'undefined' ? window : globalThis);
