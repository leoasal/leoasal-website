(function () {
  // Soft horizontal scrolling for the photo rows and the Gear strip: a longer
  // ease-in-out glide instead of the browser's short built-in "smooth" scroll.
  // Usage: window.softScrollBy(el, deltaX) / window.softScrollTo(el, x).
  var DURATION_MS = 850;
  var running = new WeakMap();

  function ease(t) {
    // easeInOutCubic
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function cancel(el) {
    var job = running.get(el);
    if (!job) return;
    cancelAnimationFrame(job.raf);
    el.style.scrollSnapType = job.snap;
    el.style.scrollBehavior = job.behavior;
    el.removeEventListener("wheel", job.stop);
    el.removeEventListener("touchstart", job.stop);
    el.removeEventListener("pointerdown", job.stop);
    running.delete(el);
  }

  function softScrollTo(el, target) {
    cancel(el);
    var max = el.scrollWidth - el.clientWidth;
    target = Math.max(0, Math.min(max, target));
    var from = el.scrollLeft;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || Math.abs(target - from) < 2) {
      el.scrollLeft = target;
      return;
    }

    var job = {
      snap: el.style.scrollSnapType,
      behavior: el.style.scrollBehavior,
      stop: function () { cancel(el); },
      raf: 0
    };
    running.set(el, job);
    // Snap points and CSS smooth-scroll would fight the per-frame positions.
    el.style.scrollSnapType = "none";
    el.style.scrollBehavior = "auto";
    el.addEventListener("wheel", job.stop, { passive: true });
    el.addEventListener("touchstart", job.stop, { passive: true });
    el.addEventListener("pointerdown", job.stop, { passive: true });

    var start = null;
    function frame(now) {
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / DURATION_MS);
      el.scrollLeft = from + (target - from) * ease(t);
      if (t < 1) {
        job.raf = requestAnimationFrame(frame);
      } else {
        cancel(el);
        el.scrollLeft = target; // snap restored: lands exactly on a snap point
      }
    }
    job.raf = requestAnimationFrame(frame);
  }

  window.softScrollTo = softScrollTo;
  window.softScrollBy = function (el, dx) { softScrollTo(el, el.scrollLeft + dx); };
})();
