(function () {
  var LANGS = ["en", "de", "es"];
  var DEFAULT_LANG = "en";
  var lang = localStorage.getItem("lang");
  if (LANGS.indexOf(lang) === -1) lang = DEFAULT_LANG;

  applyLang(lang);

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-lang]");
    if (!btn) return;
    var newLang = btn.getAttribute("data-lang");
    if (LANGS.indexOf(newLang) === -1) return;
    localStorage.setItem("lang", newLang);
    applyLang(newLang);
  });

  function applyLang(l) {
    fetch("assets/i18n/" + l + ".json", { cache: "no-store" })
      .then(function (res) { return res.json(); })
      .then(function (dict) {
        document.documentElement.lang = l;
        window.__i18nDict = dict;
        document.querySelectorAll("[data-i18n]").forEach(function (el) {
          var key = el.getAttribute("data-i18n");
          if (dict[key] != null) el.innerHTML = dict[key];
        });
        document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
          var spec = el.getAttribute("data-i18n-attr").split(":");
          var attr = spec[0], key = spec[1];
          if (dict[key] != null) el.setAttribute(attr, dict[key]);
        });
        document.querySelectorAll("[data-lang]").forEach(function (btn) {
          var active = btn.getAttribute("data-lang") === l;
          btn.setAttribute("aria-pressed", active ? "true" : "false");
        });
      })
      .catch(function (err) { console.error("i18n load failed:", err); });
  }

  window.i18nRefresh = function () {
    var dict = window.__i18nDict;
    if (!dict) {
      // i18n.json hasn't loaded yet — try again shortly instead of skipping.
      setTimeout(window.i18nRefresh, 50);
      return;
    }
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.innerHTML = dict[key];
    });
  };
})();
