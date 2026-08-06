(function () {
  var overlay = null;

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
      '<img class="lightbox-img" alt="">';
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target.classList.contains("lightbox-close")) {
        close();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    return overlay;
  }

  function open(src, alt) {
    var ov = ensureOverlay();
    var img = ov.querySelector(".lightbox-img");
    img.src = src;
    img.alt = alt || "";
    ov.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-lightbox]");
    if (!trigger) return;
    e.preventDefault();
    var img = trigger.tagName === "IMG" ? trigger : trigger.querySelector("img");
    open(trigger.getAttribute("data-lightbox"), img ? img.alt : "");
  });
})();
