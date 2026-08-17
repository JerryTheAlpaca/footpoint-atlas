(function (root) {
  var DESIGN_WIDTH = 1920;
  var DESIGN_HEIGHT = 1080;

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
    app.style.transform = buildFitTransform(scale);
    return scale;
  }

  function bindPageScale(win) {
    var target = win || root;
    applyPageScale(target);
    if (!target || typeof target.addEventListener !== 'function') return;
    target.addEventListener('resize', function () {
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
    computeFitScale: computeFitScale,
    buildFitTransform: buildFitTransform,
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
