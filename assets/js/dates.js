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

  function render(events) {
    var now = new Date();
    var upcoming = (events || [])
      .filter(function (e) { return new Date(e.end || e.start) >= now; })
      .sort(function (a, b) { return new Date(a.start) - new Date(b.start); });

    if (upcoming.length === 0) {
      list.innerHTML = '<li class="dates-empty" data-i18n="dates.empty">No upcoming dates right now.</li>';
      if (window.i18nRefresh) window.i18nRefresh();
      return;
    }

    list.innerHTML = upcoming.map(renderEvent).join("");

    if (window.i18nRefresh) window.i18nRefresh();
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

  // Multi-day all-day event (e.g. a festival or cruise): "1.–14. Aug 2026"
  // when both ends fall in the same month, "28. Jul – 3. Aug 2026" otherwise.
  function formatDateRange(startIso, endIso) {
    var lang = document.documentElement.lang || "en";
    var start = new Date(startIso);
    var end = new Date(endIso);
    var sameMonth = start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth();
    var endPart = end.toLocaleDateString(lang, { day: "2-digit", month: "short", year: "numeric" });
    if (sameMonth) {
      var startDay = start.toLocaleDateString(lang, { day: "2-digit" });
      return startDay + "–" + endPart;
    }
    var startPart = start.toLocaleDateString(lang, { day: "2-digit", month: "short" });
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
