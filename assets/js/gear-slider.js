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
})();
