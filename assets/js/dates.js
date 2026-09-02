(function () {
  var list = document.getElementById("dates-list");
  if (!list) return;

  var cachedEvents = null;

  fetch("data/dates.json", { cache: "no-store" })
    .then(function (res) { return res.json(); })
    .then(function (events) { cachedEvents = events || []; render(cachedEvents); })
    .catch(function () { cachedEvents = []; render(cachedEvents); });

  // Date/time strings (month names, day/month order) are baked into the
  // rendered HTML via toLocaleDateString — a later language switch doesn't
  // touch existing text nodes, so re-render from the cached data on
  // "langchange" instead of just re-translating data-i18n labels.
  document.addEventListener("langchange", function () {
    if (cachedEvents) render(cachedEvents);
  });

  var previousDetails = document.getElementById("dates-previous");
  var previousList = document.getElementById("dates-list-previous");
  var moreDetails = document.getElementById("dates-more");
  var moreList = document.getElementById("dates-list-more");

  function render(events) {
    var now = new Date();
    var upcoming = [];
    var previous = [];
    (events || []).forEach(function (e) {
      if (new Date(e.end || e.start) >= now) upcoming.push(e);
      else previous.push(e);
    });
    upcoming.sort(function (a, b) { return new Date(a.start) - new Date(b.start); });
    // Oldest first: the previous-dates list renders directly above the
    // upcoming list, so ascending order flows chronologically straight into
    // the next upcoming gig.
    previous.sort(function (a, b) { return new Date(a.start) - new Date(b.start); });

    if (upcoming.length === 0) {
      list.innerHTML = '<li class="dates-empty" data-i18n="dates.empty">No upcoming dates right now.</li>';
      if (moreDetails) moreDetails.hidden = true;
    } else {
      // Truncated preview (e.g. the homepage): only present when the page
      // provides #dates-more/#dates-list-more and the list carries
      // data-limit — dates.html itself has neither, so it always renders
      // the full list, unaffected.
      var limit = moreDetails && moreList ? parseInt(list.getAttribute("data-limit"), 10) : 0;
      if (limit && upcoming.length > limit) {
        list.innerHTML = upcoming.slice(0, limit).map(renderEvent).join("");
        moreList.innerHTML = upcoming.slice(limit).map(renderEvent).join("");
        moreDetails.hidden = false;
      } else {
        list.innerHTML = upcoming.map(renderEvent).join("");
        if (moreDetails) moreDetails.hidden = true;
      }
    }

    if (previousDetails && previousList) {
      if (previous.length === 0) {
        previousDetails.hidden = true;
        previousList.innerHTML = "";
      } else {
        previousDetails.hidden = false;
        previousList.innerHTML = previous.map(renderEvent).join("");
      }
    }

    if (window.i18nRefresh) window.i18nRefresh();
    // Lets anchor-scroll.js wait for the list to stop growing before it
    // settles on a #dates / #projects / #contact target.
    window.dispatchEvent(new Event("dates:rendered"));
  }

  var ICON_PIN =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/></svg>';
  var ICON_ARROW =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICON_CLOCK =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor"/></svg>';

  function renderEvent(e) {
    var when = e.end ? formatDateRange(e.start, e.end) : formatDate(e.start);
    var hasDetails = !e.allDay || e.location || e.url;

    var summary =
      '<span class="date-when">' + when + "</span>" +
      '<span class="date-title">' + escapeHtml(e.title) + "</span>";

    if (!hasDetails) {
      return '<li><div class="date-summary date-summary--plain">' + summary + "</div></li>";
    }

    var body = "";
    if (!e.allDay) {
      body +=
        '<div class="date-detail">' +
        '<span class="date-detail-icon" role="img" data-i18n-attr="aria-label:dates.time">' + ICON_CLOCK + "</span>" +
        "<span>" + formatTime(e.start) + "</span></div>";
    }
    if (e.location) {
      var locationText = e.location.replace(/\n/g, ", ");
      var mapsQuery = encodeURIComponent(locationText);
      body +=
        '<div class="date-detail">' +
        '<span class="date-detail-icon" role="img" data-i18n-attr="aria-label:dates.location">' + ICON_PIN + "</span>" +
        '<span class="date-location-value">' +
        '<a class="date-link" href="https://www.google.com/maps/search/?api=1&query=' + mapsQuery +
        '" target="_blank" rel="noopener">' + escapeHtml(locationText) + "</a>" +
        "</span></div>" +
        '<div class="date-map"><iframe src="https://www.google.com/maps?q=' + mapsQuery +
        '&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="' +
        escapeAttr(locationText) + '"></iframe></div>';
    }
    if (e.url) {
      body +=
        '<div class="date-detail">' +
        '<span class="date-detail-icon" role="img" data-i18n-attr="aria-label:dates.moreInfo">' + ICON_ARROW + "</span>" +
        '<a class="date-link" href="' + escapeAttr(e.url) + '" target="_blank" rel="noopener">' + escapeHtml(displayUrl(e.url)) + "</a>" +
        "</div>";
    }

    return (
      "<li><details class=\"date-item\">" +
      '<summary class="date-summary">' + summary + "</summary>" +
      '<div class="date-body">' + body + "</div>" +
      "</details></li>"
    );
  }

  function formatDate(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString(document.documentElement.lang || "en", {
      day: "2-digit", month: "short", year: "numeric"
    });
  }

  // Multi-day all-day event (e.g. a festival or cruise). Same month: splice
  // the start day into the front of the end date's own "day" token, so it
  // reads naturally in whatever order the locale uses ("Oct 16–23, 2026" in
  // English, "16.–23. Okt. 2026" in German). Different months/years: two
  // separate short dates joined by an en dash.
  function formatDateRange(startIso, endIso) {
    var lang = document.documentElement.lang || "en";
    var start = new Date(startIso);
    var end = new Date(endIso);
    var sameYear = start.getFullYear() === end.getFullYear();
    var sameMonth = sameYear && start.getMonth() === end.getMonth();

    if (sameMonth) {
      var startDay = start.toLocaleDateString(lang, { day: "2-digit" });
      var parts = new Intl.DateTimeFormat(lang, { day: "2-digit", month: "short", year: "numeric" }).formatToParts(end);
      return parts.map(function (p) {
        return p.type === "day" ? startDay + "–" + p.value : p.value;
      }).join("");
    }

    var startOpts = sameYear ? { day: "2-digit", month: "short" } : { day: "2-digit", month: "short", year: "numeric" };
    var startPart = start.toLocaleDateString(lang, startOpts);
    var endPart = end.toLocaleDateString(lang, { day: "2-digit", month: "short", year: "numeric" });
    return startPart + " – " + endPart;
  }

  function formatTime(iso) {
    var d = new Date(iso);
    return d.toLocaleTimeString(document.documentElement.lang || "en", {
      hour: "2-digit", minute: "2-digit"
    });
  }

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function escapeAttr(str) { return escapeHtml(str); }
  function displayUrl(url) { return String(url || "").replace(/^https?:\/\//i, ""); }
})();
