(function () {
  function scrollToHash(hash, behavior) {
    var target = hash && document.querySelector(hash);
    if (!target) return;
    target.scrollIntoView({ block: "start", behavior: behavior || "smooth" });
    // Native anchor navigation moves focus to the target; since we're
    // intercepting the click ourselves (for the smooth scroll), restore
    // that manually — otherwise keyboard/screen-reader users (notably via
    // the skip-link) lose their place.
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }

  if (location.hash) {
    // Arriving here via a redirect stub (bio.html etc.) or a cross-page nav
    // link — native fragment scroll-on-load isn't reliable together with
    // scroll-behavior:smooth, so do it ourselves once layout has settled.
    // Instant, not smooth: this is a fresh page load, not an in-page
    // transition, so there's nothing to animate from.
    setTimeout(function () {
      scrollToHash(location.hash, "instant");
    }, 60);
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var hash = link.getAttribute("href");
    if (!document.querySelector(hash)) return;
    e.preventDefault();
    history.pushState(null, "", hash);
    scrollToHash(hash);
  });
})();
