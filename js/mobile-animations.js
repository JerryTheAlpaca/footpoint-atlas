(function (root) {
  var CARD_SELECTOR =
    '.stat-card, .map-panel, .ranking-scene .chart-block, .reunion-scene .chart-block, .record-panel-head, .record-item';
  var activeController = null;

  function reducedMotion(win) {
    return !!(
      win &&
      typeof win.matchMedia === 'function' &&
      win.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function isCompact(win) {
    var target = win || root;
    if (target && target.TrainScale && typeof target.TrainScale.isCompactLayout === 'function') {
      var size = target.TrainScale.readViewportSize
        ? target.TrainScale.readViewportSize(target)
        : { width: target.innerWidth };
      return target.TrainScale.isCompactLayout(size.width);
    }
    return Number(target && target.innerWidth) > 0 && Number(target.innerWidth) <= 1024;
  }

  function collectCards(documentRef) {
    return Array.prototype.slice.call(documentRef.querySelectorAll(CARD_SELECTOR));
  }

  function init(doc, win) {
    var documentRef = doc || (root && root.document);
    var windowRef = win || root;
    if (!documentRef || !windowRef) return false;

    if (activeController) activeController.stop();

    var scenes = Array.prototype.slice.call(documentRef.querySelectorAll('.mobile-scene'));
    if (
      !scenes.length ||
      !isCompact(windowRef) ||
      reducedMotion(windowRef) ||
      typeof windowRef.IntersectionObserver !== 'function'
    ) {
      return false;
    }

    var sceneObserver;
    var cardObserver;
    var listObserver;
    var observedCards = [];
    var scrollRaf = 0;
    var stopped = false;
    var mediaQuery = typeof windowRef.matchMedia === 'function'
      ? windowRef.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    var recordList = documentRef.getElementById('record-list');

    function clearMotionState() {
      scenes.forEach(function (scene) {
        scene.classList.remove('scene-motion-ready', 'is-scene-active', 'has-revealed');
        scene.style.removeProperty('--scene-parallax');
      });
      observedCards.forEach(function (card) {
        card.classList.remove('card-motion-ready', 'has-revealed');
      });
      observedCards = [];
    }

    function updateParallax() {
      scrollRaf = 0;
      var viewportHeight = windowRef.innerHeight || 1;
      var viewportCenter = viewportHeight / 2;
      scenes.forEach(function (scene) {
        var rect = scene.getBoundingClientRect();
        var distance = (rect.top + rect.height / 2 - viewportCenter) / viewportHeight;
        var offset = Math.max(-8, Math.min(8, distance * -8));
        scene.style.setProperty('--scene-parallax', offset.toFixed(2) + 'px');
      });
    }

    function scheduleParallax() {
      if (scrollRaf) return;
      scrollRaf = windowRef.requestAnimationFrame
        ? windowRef.requestAnimationFrame(updateParallax)
        : windowRef.setTimeout(updateParallax, 16);
    }

    function pruneObservedCards() {
      observedCards = observedCards.filter(function (card) {
        if (card.isConnected) return true;
        if (cardObserver) cardObserver.unobserve(card);
        card.classList.remove('card-motion-ready', 'has-revealed');
        return false;
      });
    }

    function revealCard(card) {
      card.classList.add('has-revealed');
      if (cardObserver) cardObserver.unobserve(card);
    }

    function observeCard(card) {
      if (stopped || observedCards.indexOf(card) !== -1) return;
      observedCards.push(card);
      card.classList.add('card-motion-ready');

      var viewportHeight = windowRef.innerHeight || 0;
      var rect = card.getBoundingClientRect();
      var alreadyVisible = rect.bottom > 0 && rect.top < viewportHeight * 0.92;
      if (alreadyVisible) {
        if (windowRef.requestAnimationFrame) {
          windowRef.requestAnimationFrame(function () {
            if (!stopped) revealCard(card);
          });
        } else {
          revealCard(card);
        }
        return;
      }
      if (cardObserver) cardObserver.observe(card);
    }

    function observeCards() {
      pruneObservedCards();
      collectCards(documentRef).forEach(observeCard);
    }

    function stop(removePreferenceListener) {
      if (!stopped) {
        stopped = true;
        if (sceneObserver) sceneObserver.disconnect();
        if (cardObserver) cardObserver.disconnect();
        if (listObserver) listObserver.disconnect();
        if (scrollRaf) {
          if (windowRef.cancelAnimationFrame) windowRef.cancelAnimationFrame(scrollRaf);
          else windowRef.clearTimeout(scrollRaf);
          scrollRaf = 0;
        }
        windowRef.removeEventListener('scroll', scheduleParallax);
        windowRef.removeEventListener('resize', scheduleParallax);
        clearMotionState();
      }
      if (removePreferenceListener !== false && mediaQuery) {
        if (mediaQuery.removeEventListener) mediaQuery.removeEventListener('change', onMotionPreferenceChange);
        else if (mediaQuery.removeListener) mediaQuery.removeListener(onMotionPreferenceChange);
      }
      if (removePreferenceListener !== false && activeController === controller) activeController = null;
    }

    function onMotionPreferenceChange(event) {
      if (event.matches) {
        stop(false);
      } else if (stopped) {
        init(documentRef, windowRef);
      }
    }

    try {
      sceneObserver = new windowRef.IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle(
            'is-scene-active',
            entry.isIntersecting && entry.intersectionRatio >= 0.12
          );
          if (entry.isIntersecting) {
            entry.target.classList.add('has-revealed');
          }
        });
        scheduleParallax();
      }, {
        root: null,
        rootMargin: '-5% 0px -15% 0px',
        threshold: [0, 0.12, 0.5],
      });
      scenes.forEach(function (scene) {
        scene.classList.add('scene-motion-ready');
        sceneObserver.observe(scene);
      });

      cardObserver = new windowRef.IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) revealCard(entry.target);
        });
      }, {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: [0, 0.08, 0.2],
      });
      observeCards();
    } catch (error) {
      clearMotionState();
      return false;
    }

    if (recordList && typeof windowRef.MutationObserver === 'function') {
      listObserver = new windowRef.MutationObserver(function () {
        observeCards();
      });
      listObserver.observe(recordList, { childList: true });
    }

    var controller = { stop: stop, observeCards: observeCards };
    activeController = controller;

    windowRef.addEventListener('scroll', scheduleParallax, { passive: true });
    windowRef.addEventListener('resize', scheduleParallax, { passive: true });
    scheduleParallax();

    if (mediaQuery) {
      if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', onMotionPreferenceChange);
      else if (mediaQuery.addListener) mediaQuery.addListener(onMotionPreferenceChange);
    }
    return { stop: stop, observeCards: observeCards };
  }

  root.TrainMobileMotion = {
    init: init,
    CARD_SELECTOR: CARD_SELECTOR,
  };
  if (typeof document === 'undefined') return;
  root.addEventListener('train-layout-change', function (event) {
    var compact = event && event.detail && typeof event.detail.compact === 'boolean'
      ? event.detail.compact
      : isCompact(root);
    if (compact) init(document, root);
    else if (activeController) activeController.stop();
  });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init(document, root);
    });
  } else {
    init(document, root);
  }
})(typeof window !== 'undefined' ? window : globalThis);
