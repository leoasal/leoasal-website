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

    list.innerHTML = upcoming.map(function (e) {
      var when = formatDate(e.start);
      var where = e.location ? " — " + escapeHtml(e.location) : "";
      var titleHtml = e.url
        ? '<a href="' + escapeAttr(e.url) + '" target="_blank" rel="noopener">' + escapeHtml(e.title) + "</a>"
        : escapeHtml(e.title);
      return (
        '<li><span class="date-when">' + when + '</span>' +
        '<span class="date-what">' + titleHtml + where + "</span></li>"
      );
    }).join("");

    if (window.i18nRefresh) window.i18nRefresh();
  }

  function formatDate(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString(document.documentElement.lang || "en", {
      day: "2-digit", month: "short", year: "numeric"
    });
  }

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function escapeAttr(str) { return escapeHtml(str); }
})();
