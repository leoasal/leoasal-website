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
    strip.scrollBy({ left: step * strip.clientWidth, behavior: "smooth" });
  });
})();
