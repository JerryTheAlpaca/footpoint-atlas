(function (root) {
  function getNodes(doc) {
    if (!doc) return null;
    return {
      app: doc.querySelector('.app'),
      main: doc.querySelector('.main'),
      header: doc.querySelector('.header'),
      stats: doc.querySelector('.stat-cards'),
      map: doc.querySelector('.map-panel'),
      side: doc.querySelector('.side-panel'),
      ranking: doc.querySelector('.ranking-scene'),
      reunion: doc.querySelector('.reunion-scene'),
      records: doc.querySelector('.record-scene'),
      pageFootprint: doc.getElementById('mobile-page-footprint'),
      pageInsights: doc.getElementById('mobile-page-insights'),
      pageRecords: doc.getElementById('mobile-page-records'),
    };
  }

  function hasRequiredNodes(nodes) {
    return !!(
      nodes && nodes.app && nodes.main && nodes.header && nodes.stats && nodes.map && nodes.side &&
      nodes.ranking && nodes.reunion && nodes.records && nodes.pageFootprint &&
      nodes.pageInsights && nodes.pageRecords
    );
  }

  function compactLayout(win) {
    var target = win || root;
    if (target && target.TrainScale && typeof target.TrainScale.isCompactLayout === 'function') {
      var size = target.TrainScale.readViewportSize
        ? target.TrainScale.readViewportSize(target)
        : { width: target.innerWidth };
      return target.TrainScale.isCompactLayout(size.width);
    }
    return Number(target && target.innerWidth) > 0 && Number(target.innerWidth) <= 1024;
  }

  function moveToCompact(nodes) {
    nodes.pageFootprint.hidden = false;
    nodes.pageInsights.hidden = false;
    nodes.pageRecords.hidden = false;

    nodes.pageFootprint.appendChild(nodes.header);
    nodes.pageFootprint.appendChild(nodes.map);
    nodes.pageInsights.appendChild(nodes.stats);
    nodes.pageInsights.appendChild(nodes.ranking);
    nodes.pageInsights.appendChild(nodes.reunion);
    nodes.pageRecords.appendChild(nodes.records);
    nodes.main.hidden = true;
  }

  function moveToDesktop(nodes) {
    nodes.main.hidden = false;
    nodes.app.insertBefore(nodes.header, nodes.main);
    nodes.header.appendChild(nodes.stats);
    nodes.main.insertBefore(nodes.map, nodes.side);
    nodes.side.appendChild(nodes.ranking);
    nodes.side.appendChild(nodes.reunion);
    nodes.side.appendChild(nodes.records);

    nodes.pageFootprint.hidden = true;
    nodes.pageInsights.hidden = true;
    nodes.pageRecords.hidden = true;
  }

  function sync(doc, win, compactOverride) {
    var nodes = getNodes(doc || (root && root.document));
    if (!hasRequiredNodes(nodes)) return false;
    var compact = typeof compactOverride === 'boolean' ? compactOverride : compactLayout(win);
    var current = nodes.app.getAttribute('data-story-layout');
    var next = compact ? 'compact' : 'desktop';
    if (current === next) return next;
    if (compact) moveToCompact(nodes);
    else moveToDesktop(nodes);
    nodes.app.setAttribute('data-story-layout', next);
    return next;
  }

  root.TrainMobileLayout = {
    compactLayout: compactLayout,
    sync: sync,
  };

  if (typeof document === 'undefined') return;
  root.addEventListener('train-layout-change', function (event) {
    var compact = event && event.detail && typeof event.detail.compact === 'boolean'
      ? event.detail.compact
      : undefined;
    sync(document, root, compact);
  });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      sync(document, root);
    });
  } else {
    sync(document, root);
  }
})(typeof window !== 'undefined' ? window : globalThis);
