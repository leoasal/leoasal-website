(function () {
  // Soft horizontal scrolling for the photo rows and the Gear strip.
  // Usage: window.softScrollBy(el, deltaX) / window.softScrollTo(el, x).
  //
  // Technique (FLIP): jump the real scroll position to the target at once, but
  // offset every child by the distance it just "travelled" with a transform,
  // then let a CSS transition slide the transforms back to 0. Transform
  // transitions run on the compositor/GPU, so the glide stays smooth even if
  // the main thread is busy decoding big photos (a per-frame scrollLeft loop
  // stuttered in exactly that case).
  var DURATION_MS = 850;
  var EASING = "cubic-bezier(0.65, 0, 0.35, 1)"; // ease-in-out
  var running = new WeakMap();

  function finish(el) {
    var job = running.get(el);
    if (!job) return;
    clearTimeout(job.timer);
    job.kids.forEach(function (k) {
      k.style.transition = "";
      k.style.transform = "";
      k.style.willChange = "";
    });
    el.style.scrollSnapType = job.snap;
    el.removeEventListener("wheel", job.stop);
    el.removeEventListener("touchstart", job.stop);
    el.removeEventListener("pointerdown", job.stop);
    running.delete(el);
  }

  function softScrollTo(el, target) {
    finish(el);
    var max = el.scrollWidth - el.clientWidth;
    target = Math.max(0, Math.min(max, target));
    var from = el.scrollLeft;
    var delta = target - from;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var kids = Array.prototype.slice.call(el.children);
    if (reduce || Math.abs(delta) < 2 || !kids.length) {
      el.scrollLeft = target;
      return;
    }

    var job = {
      kids: kids,
      snap: el.style.scrollSnapType,
      stop: function () { finish(el); },
      timer: 0
    };
    running.set(el, job);

    // 1. jump the scroll position (snap off so nothing re-snaps meanwhile)
    el.style.scrollSnapType = "none";
    var prevBehavior = el.style.scrollBehavior;
    el.style.scrollBehavior = "auto";
    el.scrollLeft = target;
    el.style.scrollBehavior = prevBehavior;

    // 2. keep the old picture: shift every child back by the jump
    kids.forEach(function (k) {
      k.style.willChange = "transform";
      k.style.transition = "none";
      k.style.transform = "translate3d(" + delta + "px,0,0)";
    });
    void el.offsetWidth; // commit the starting state

    // 3. glide to the new position (GPU transition)
    kids.forEach(function (k) {
      k.style.transition = "transform " + DURATION_MS + "ms " + EASING;
      k.style.transform = "translate3d(0,0,0)";
    });

    el.addEventListener("wheel", job.stop, { passive: true });
    el.addEventListener("touchstart", job.stop, { passive: true });
    el.addEventListener("pointerdown", job.stop, { passive: true });
    job.timer = setTimeout(function () { finish(el); }, DURATION_MS + 80);
  }

  window.softScrollTo = softScrollTo;
  window.softScrollBy = function (el, dx) { softScrollTo(el, el.scrollLeft + dx); };
})();
