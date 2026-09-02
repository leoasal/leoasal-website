(function () {
  var HEADER_OFFSET = 80; // keep in sync with .home-section scroll-margin-top

  function absTop(el) {
    return el.getBoundingClientRect().top + window.pageYOffset;
  }

  function parkFocus(el) {
    // Intercepting the click (or handling arrival ourselves) skips the
    // native focus jump — restore it so keyboard/screen-reader users keep
    // their place. The visible ring is suppressed in CSS for these targets.
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }

  var target = location.hash ? document.querySelector(location.hash) : null;

  if (target) {
    // Arrival via a cross-page nav link or a redirect stub (bio.html …).
    // Rather than let the browser smooth-scroll the whole page from the top
    // (hectic) or hard-cut to the section (janky, and it fights the async
    // dates list settling the layout), land just short of the section right
    // away and glide the last short stretch once everything has settled.
    var done = false;
    var userTookOver = false;
    ["wheel", "touchstart", "keydown"].forEach(function (ev) {
      window.addEventListener(ev, function () { userTookOver = true; }, { passive: true, once: true });
    });

    var restingTop = function () {
      return Math.max(0, absTop(target) - HEADER_OFFSET - 110);
    };

    function preposition() {
      if (done || userTookOver) return;
      var want = restingTop();
      if (Math.abs(window.pageYOffset - want) > 2) window.scrollTo(0, want);
    }

    // Hold position ~110px above the target through every layout shift…
    (function keep() {
      preposition();
      if (!done && !userTookOver) requestAnimationFrame(keep);
    })();

    // …then, once the page and the dates list are both ready, animate the
    // final ~110px. Short and consistent regardless of how far down the
    // section sits — a gentle settle, not a full-page journey.
    var pageLoaded = false;
    var datesReady = !document.getElementById("dates-list");

    function glide() {
      if (done || userTookOver || !pageLoaded || !datesReady) return;
      done = true;
      window.scrollTo(0, restingTop());
      requestAnimationFrame(function () {
        target.scrollIntoView({ block: "start", behavior: "smooth" });
        parkFocus(target);
      });
    }

    window.addEventListener("load", function () { pageLoaded = true; glide(); });
    window.addEventListener("dates:rendered", function () { datesReady = true; glide(); });
    setTimeout(function () { pageLoaded = datesReady = true; glide(); }, 1200);
  }

  // In-page nav clicks: smooth scroll so it feels like manual scrolling.
  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var hash = link.getAttribute("href");
    var el = document.querySelector(hash);
    if (!el) return;
    e.preventDefault();
    history.pushState(null, "", hash);
    el.scrollIntoView({ block: "start", behavior: "smooth" });
    parkFocus(el);
  });
})();
