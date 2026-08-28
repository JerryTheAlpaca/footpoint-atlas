(function (root) {
  var activeController = null;

  function reducedMotion(win) {
    return !!(
      win &&
      typeof win.matchMedia === 'function' &&
      win.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function init(doc, win) {
    var documentRef = doc || (root && root.document);
    var windowRef = win || root;
    if (!documentRef || !windowRef) return false;

    if (activeController) activeController.stop();

    var scenes = Array.prototype.slice.call(documentRef.querySelectorAll('.mobile-scene'));
    if (!scenes.length || reducedMotion(windowRef) || typeof windowRef.IntersectionObserver !== 'function') {
      return false;
    }

    var observer;
    var scrollRaf = 0;
    var stopped = false;
    var mediaQuery = typeof windowRef.matchMedia === 'function'
      ? windowRef.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

    function clearMotionState() {
      scenes.forEach(function (scene) {
        scene.classList.remove('scene-motion-ready', 'is-scene-active', 'has-revealed');
        scene.style.removeProperty('--scene-parallax');
      });
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

    function stop(removePreferenceListener) {
      if (!stopped) {
        stopped = true;
        if (observer) observer.disconnect();
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
      observer = new windowRef.IntersectionObserver(function (entries) {
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
        observer.observe(scene);
      });
    } catch (error) {
      clearMotionState();
      return false;
    }

    var controller = { stop: stop };
    activeController = controller;

    windowRef.addEventListener('scroll', scheduleParallax, { passive: true });
    windowRef.addEventListener('resize', scheduleParallax, { passive: true });
    scheduleParallax();

    if (mediaQuery) {
      if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', onMotionPreferenceChange);
      else if (mediaQuery.addListener) mediaQuery.addListener(onMotionPreferenceChange);
    }
    return { stop: stop };
  }

  root.TrainMobileMotion = { init: init };
  if (typeof document === 'undefined') return;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init(document, root);
    });
  } else {
    init(document, root);
  }
})(typeof window !== 'undefined' ? window : globalThis);
