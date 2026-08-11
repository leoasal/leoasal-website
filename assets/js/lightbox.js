(function () {
  var overlay = null;
  var items = [];
  var index = 0;

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button type="button" class="lightbox-nav lightbox-prev" aria-label="Previous image">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<img class="lightbox-img" alt="">' +
      '<button type="button" class="lightbox-nav lightbox-next" aria-label="Next image">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (e) {
      if (e.target.closest(".lightbox-prev")) {
        e.stopPropagation();
        show(index - 1);
        return;
      }
      if (e.target.closest(".lightbox-next")) {
        e.stopPropagation();
        show(index + 1);
        return;
      }
      if (e.target === overlay || e.target.classList.contains("lightbox-close")) {
        close();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (!overlay.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
    return overlay;
  }

  function show(i) {
    if (!items.length) return;
    index = (i + items.length) % items.length;
    var ov = ensureOverlay();
    var img = ov.querySelector(".lightbox-img");
    var trigger = items[index];
    var triggerImg = trigger.tagName === "IMG" ? trigger : trigger.querySelector("img");
    img.src = trigger.getAttribute("data-lightbox");
    img.alt = triggerImg ? triggerImg.alt : "";
    var multi = items.length > 1;
    ov.querySelector(".lightbox-prev").style.display = multi ? "" : "none";
    ov.querySelector(".lightbox-next").style.display = multi ? "" : "none";
  }

  function open(trigger) {
    var group = trigger.closest(".epk-gallery, .epk-covers");
    var scope = group || document;
    items = Array.prototype.slice.call(scope.querySelectorAll("[data-lightbox]"));
    if (!items.length) items = [trigger];
    index = items.indexOf(trigger);
    if (index === -1) index = 0;
    var ov = ensureOverlay();
    show(index);
    ov.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    if (items[index]) {
      items[index].scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-lightbox]");
    if (!trigger) return;
    e.preventDefault();
    open(trigger);
  });
})();
