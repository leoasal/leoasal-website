(function () {
  // Sticky header height; same value as the CSS scroll-margin-top of the
  // sections (--header-h), so arrival and clicks land flush under the header.
  var HEADER_OFFSET = (document.querySelector(".site-header") || { offsetHeight: 65 }).offsetHeight;

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
      setTimeout(settle, 900);
    }

    // Content above the target (dates list, lazy images) can still grow after
    // the glide and push the section down — keep it flush for a moment.
    function settle() {
      var until = performance.now() + 2500;
      (function fix() {
        if (userTookOver || performance.now() > until) return;
        var margin = parseFloat(getComputedStyle(target).scrollMarginTop) || HEADER_OFFSET;
        var want = Math.max(0, absTop(target) - margin);
        if (Math.abs(window.pageYOffset - want) > 2) window.scrollTo(0, want);
        requestAnimationFrame(fix);
      })();
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

  // ---- Side rail visibility -------------------------------------------------
  // Hidden on load. Shown while scrolling (fades out HIDE_DELAY_MS after the
  // last scroll event) and whenever the pointer moves anywhere on the page
  // (fades out POINTER_IDLE_MS after it stops). Hovering the rail itself and
  // keyboard focus keep it visible via CSS.
  var rail = document.querySelector(".side-rail");
  if (rail) {
    var HIDE_DELAY_MS = 400;
    var POINTER_IDLE_MS = 1500;
    function showWhileActive(cls, delay) {
      var timer;
      return function () {
        rail.classList.add(cls);
        clearTimeout(timer);
        timer = setTimeout(function () { rail.classList.remove(cls); }, delay);
      };
    }
    window.addEventListener("scroll", showWhileActive("is-visible", HIDE_DELAY_MS), { passive: true });
    window.addEventListener("mousemove", showWhileActive("is-pointer-active", POINTER_IDLE_MS), { passive: true });
  }

  // ---- Scrollspy + side rail ------------------------------------------------
  // The rail's bar follows the scroll position continuously: between two
  // section "landing" positions it is interpolated between the two matching
  // marker centres, so it glides proportionally while you scroll. The bar can
  // also be dragged — the inverse mapping (rail Y -> scroll position) is used.
  var spyIds = ["home", "blog", "bio", "dates", "projects", "gear", "contact"];
  var spySections = spyIds
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  var railTrack = document.querySelector(".side-rail-track");
  var railIndicator = document.querySelector(".side-rail-indicator");

  // Vertical centre of a link relative to the top of the rail track.
  function railCentres(ids) {
    var tr = railTrack.getBoundingClientRect();
    return ids.map(function (id) {
      var a = document.querySelector('.side-rail a[href="#' + id + '"]');
      if (!a) return null;
      var r = a.getBoundingClientRect();
      return r.top - tr.top + r.height / 2;
    });
  }

  function placeIndicator(centre) {
    railIndicator.style.transform =
      "translateY(" + (centre - railIndicator.offsetHeight / 2) + "px)";
    railIndicator.style.opacity = 1;
  }

  if (spySections.length) {
    var linksFor = {};
    spySections.forEach(function (sec) {
      linksFor[sec.id] = Array.prototype.slice.call(document.querySelectorAll(
        '.site-nav a[href="#' + sec.id + '"], .mobile-nav a[href="#' + sec.id + '"], .side-rail a[href="#' + sec.id + '"]'
      ));
    });

    // Scroll position at which each section lands flush under the header
    // (clamped: the last sections can't scroll further than the page end).
    function landingPositions() {
      var max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      return spySections.map(function (sec) {
        var margin = parseFloat(getComputedStyle(sec).scrollMarginTop) || 0;
        return Math.min(max, Math.max(0, absTop(sec) - margin));
      });
    }

    var activeId;
    function setActive(id) {
      if (id === activeId) return;
      activeId = id;
      spySections.forEach(function (sec) {
        var on = sec.id === id;
        linksFor[sec.id].forEach(function (a) {
          if (on) a.setAttribute("aria-current", "location");
          else if (a.getAttribute("aria-current") === "location") a.removeAttribute("aria-current");
        });
      });
    }

    function evaluateSpy() {
      var y = window.pageYOffset;
      var pos = landingPositions();
      var i = 0;
      for (var k = 0; k < pos.length; k++) {
        if (pos[k] <= y + 1) i = k; else break;
      }
      var t = 0;
      if (i < pos.length - 1 && pos[i + 1] > pos[i]) {
        t = Math.min(1, Math.max(0, (y - pos[i]) / (pos[i + 1] - pos[i])));
      }
      setActive(spySections[t >= 0.5 ? i + 1 : i].id);

      if (railTrack && railIndicator && railTrack.offsetHeight) {
        var c = railCentres(spyIds.filter(function (id) { return document.getElementById(id); }));
        if (c[i] != null) {
          var next = i < c.length - 1 && c[i + 1] != null ? c[i + 1] : c[i];
          placeIndicator(c[i] + t * (next - c[i]));
        }
      }
    }

    var ticking = false;
    function requestSpy() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; evaluateSpy(); });
    }

    window.addEventListener("scroll", requestSpy, { passive: true });
    window.addEventListener("resize", requestSpy, { passive: true });
    window.addEventListener("load", evaluateSpy);
    window.addEventListener("dates:rendered", evaluateSpy);
    evaluateSpy();

    // Drag the bar to scroll the page.
    if (railTrack && railIndicator) {
      railTrack.classList.add("is-draggable");
      var dragging = false;

      function scrollToRailY(clientY) {
        var ids = spyIds.filter(function (id) { return document.getElementById(id); });
        var c = railCentres(ids);
        var pos = landingPositions();
        var py = clientY - railTrack.getBoundingClientRect().top;
        py = Math.min(c[c.length - 1], Math.max(c[0], py));
        // Small magnetic zone: aiming at a marker lands exactly on it.
        for (var m = 0; m < c.length; m++) {
          if (Math.abs(py - c[m]) <= 6) { py = c[m]; break; }
        }
        var j = 0;
        for (var k = 0; k < c.length; k++) { if (c[k] <= py) j = k; else break; }
        var t = j < c.length - 1 ? (py - c[j]) / (c[j + 1] - c[j]) : 0;
        var y = pos[j] + (j < pos.length - 1 ? t * (pos[j + 1] - pos[j]) : 0);
        window.scrollTo({ top: y, behavior: "instant" });
      }

      railIndicator.addEventListener("pointerdown", function (e) {
        dragging = true;
        railIndicator.setPointerCapture(e.pointerId);
        railTrack.classList.add("is-dragging");
        e.preventDefault();
      });
      railIndicator.addEventListener("pointermove", function (e) {
        if (dragging) scrollToRailY(e.clientY);
      });
      function endDrag(e) {
        if (!dragging) return;
        dragging = false;
        railTrack.classList.remove("is-dragging");
        if (railIndicator.hasPointerCapture(e.pointerId)) railIndicator.releasePointerCapture(e.pointerId);
      }
      railIndicator.addEventListener("pointerup", endDrag);
      railIndicator.addEventListener("pointercancel", endDrag);
    }
  }
})();
