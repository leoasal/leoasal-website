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

  // Lazy videos (<video data-src>): start loading/playing only once they are
  // actually on screen. A video that starts while hidden inside an off-screen
  // slide can stay blank, and this also saves the download on page load.
  var lazyVideos = Array.prototype.slice.call(strip.querySelectorAll("video[data-src]"));
  function startVideo(v) {
    if (!v.getAttribute("src")) {
      v.src = v.getAttribute("data-src");
      v.addEventListener("canplay", function () {
        var q = v.play();
        if (q && q.catch) q.catch(function () {});
      }, { once: true });
      v.load();
    }
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }
  if (lazyVideos.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) startVideo(e.target); // never paused again: it is a short silent loop
        });
      }, { threshold: 0.25 });
      lazyVideos.forEach(function (v) { io.observe(v); });
    } else {
      lazyVideos.forEach(startVideo);
    }
  }
})();
