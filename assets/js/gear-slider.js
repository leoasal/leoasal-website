(function () {
  // Gear section: brands sit side by side in a scroll-snap strip; the arrow
  // bars (.gear-toggle) scroll one slide left/right. Swiping/trackpad
  // scrolling works natively through scroll-snap.
  var strip = document.getElementById("gear-slides");
  if (!strip) return;

  strip.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-gear-step]");
    if (!btn) return;
    var step = parseInt(btn.getAttribute("data-gear-step"), 10) || 0;
    var dx = step * strip.clientWidth;
    if (window.softScrollBy) window.softScrollBy(strip, dx);
    else strip.scrollBy({ left: dx, behavior: "smooth" });
  });

  // Warm up: the off-screen slides' photos are lazy-loaded; fetch + decode them
  // once the page is idle so the glide never waits on a big image.
  function warm() {
    strip.querySelectorAll("img").forEach(function (img) {
      img.loading = "eager";
      if (img.decode) img.decode().catch(function () {});
    });
  }
  window.addEventListener("load", function () {
    if (window.requestIdleCallback) window.requestIdleCallback(warm, { timeout: 2500 });
    else setTimeout(warm, 1200);
  });

  // Videos with data-play-when-visible keep preload="none" (poster only, no
  // download on page load) and start playing once they are on screen. They have
  // a normal src, so without this script the poster still shows and the
  // lightbox still plays them. (A video that autoplays while hidden inside an
  // off-screen slide, or with preload="metadata", stayed blank.)
  var lazyVideos = Array.prototype.slice.call(strip.querySelectorAll("video[data-play-when-visible]"));
  var inView = new WeakSet();
  function startVideo(v) {
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }
  function playVisible() {
    lazyVideos.forEach(function (v) { if (inView.has(v) && v.paused) startVideo(v); });
  }
  if (lazyVideos.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { inView.add(e.target); startVideo(e.target); }
        else inView.delete(e.target);
      });
    }, { threshold: 0.25 });
    lazyVideos.forEach(function (v) {
      io.observe(v);
      // The browser may pause it again while the slide is still mid-glide
      // (counted as "not visible" for a moment): restart if it is in view.
      v.addEventListener("pause", function () { setTimeout(playVisible, 150); });
    });
    // ...and once more after every slide change has settled.
    strip.addEventListener("click", function (e) {
      if (e.target.closest("[data-gear-step]")) setTimeout(playVisible, 1000);
    });
  }
})();
