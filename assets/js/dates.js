(function () {
  var list = document.getElementById("dates-list");
  if (!list) return;

  fetch("data/dates.json", { cache: "no-store" })
    .then(function (res) { return res.json(); })
    .then(render)
    .catch(function () { render([]); });

  function render(events) {
    var now = new Date();
    var upcoming = (events || [])
      .filter(function (e) { return new Date(e.start) >= now; })
      .sort(function (a, b) { return new Date(a.start) - new Date(b.start); });

    if (upcoming.length === 0) {
      list.innerHTML = '<li class="dates-empty" data-i18n="dates.empty">No upcoming dates right now.</li>';
      if (window.i18nRefresh) window.i18nRefresh();
      return;
    }

    list.innerHTML = upcoming.map(renderEvent).join("");

    if (window.i18nRefresh) window.i18nRefresh();
  }

  function renderEvent(e) {
    var when = formatDate(e.start);
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
        '<div class="date-detail"><span class="date-detail-label" data-i18n="dates.time">Time</span>' +
        "<span>" + formatTime(e.start) + "</span></div>";
    }
    if (e.location) {
      var locationText = e.location.replace(/\n/g, ", ");
      var mapsQuery = encodeURIComponent(locationText);
      body +=
        '<div class="date-detail"><span class="date-detail-label" data-i18n="dates.location">Location</span>' +
        '<span class="date-location-value">' +
        '<a class="date-link" href="https://www.google.com/maps/search/?api=1&query=' + mapsQuery +
        '" target="_blank" rel="noopener">' + escapeHtml(locationText) + "</a>" +
        ' <a class="date-link date-link-secondary" href="https://maps.apple.com/?q=' + mapsQuery +
        '" target="_blank" rel="noopener">(Apple Maps)</a>' +
        "</span></div>";
    }
    if (e.url) {
      body +=
        '<div class="date-detail"><span class="date-detail-label" data-i18n="dates.website">Website</span>' +
        '<a class="date-link" href="' + escapeAttr(e.url) + '" target="_blank" rel="noopener">' +
        escapeHtml(e.url) + "</a></div>";
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
})();
