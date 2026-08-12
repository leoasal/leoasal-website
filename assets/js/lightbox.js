(function () {
  var overlay = null;
  var items = [];
  var index = 0;
  var ANIM_MS = 220;
  var ANIM_DIST = 36;

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button type="button" class="lightbox-nav lightbox-prev" aria-label="Previous image">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<div class="lightbox-content">' +
      '<img class="lightbox-img" alt="">' +
      '<p class="lightbox-credit" hidden></p>' +
      '</div>' +
      '<button type="button" class="lightbox-nav lightbox-next" aria-label="Next image">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (e) {
      if (e.target.closest(".lightbox-prev")) {
        e.stopPropagation();
        show(index - 1, "prev");
        return;
      }
      if (e.target.closest(".lightbox-next")) {
        e.stopPropagation();
        show(index + 1, "next");
        return;
      }
      if (e.target === overlay || e.target.classList.contains("lightbox-close")) {
        close();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (!overlay.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1, "prev");
      if (e.key === "ArrowRight") show(index + 1, "next");
    });

    var touchStartX = null;
    var touchStartY = null;

    overlay.addEventListener(
      "touchstart",
      function (e) {
        if (e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      },
      { passive: true }
    );

    overlay.addEventListener(
      "touchend",
      function (e) {
        if (touchStartX === null) return;
        var touch = e.changedTouches[0];
        var dx = touch.clientX - touchStartX;
        var dy = touch.clientY - touchStartY;
        touchStartX = null;
        touchStartY = null;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          e.preventDefault();
          if (dx < 0) show(index + 1, "next");
          else show(index - 1, "prev");
        }
      },
      { passive: false }
    );
    return overlay;
  }

  function renderImage(ov, trigger) {
    var img = ov.querySelector(".lightbox-img");
    var triggerImg = trigger.tagName === "IMG" ? trigger : trigger.querySelector("img");
    img.src = trigger.getAttribute("data-lightbox");
    img.alt = triggerImg ? triggerImg.alt : "";
  }

  function renderChrome(ov, trigger) {
    var multi = items.length > 1;
    ov.querySelector(".lightbox-prev").style.display = multi ? "" : "none";
    ov.querySelector(".lightbox-next").style.display = multi ? "" : "none";

    var galleryEl = trigger.closest(".epk-gallery");
    function creditAttr(name) {
      return trigger.getAttribute(name) || (galleryEl && galleryEl.getAttribute(name));
    }
    var credit = creditAttr("data-credit");
    var creditName = creditAttr("data-credit-name");
    var creditUrl = creditAttr("data-credit-url");
    var creditEl = ov.querySelector(".lightbox-credit");
    if (credit) {
      creditEl.innerHTML = "";
      creditEl.appendChild(document.createTextNode(creditName ? credit + " " : credit));
      if (creditName) {
        if (creditUrl) {
          var link = document.createElement("a");
          link.href = creditUrl;
          link.target = "_blank";
          link.rel = "noopener";
          link.textContent = creditName;
          creditEl.appendChild(link);
        } else {
          creditEl.appendChild(document.createTextNode(creditName));
        }
      }
      creditEl.hidden = false;
    } else {
      creditEl.textContent = "";
      creditEl.hidden = true;
    }
  }

  function show(i, direction) {
    if (!items.length) return;
    var newIndex = (i + items.length) % items.length;
    var ov = ensureOverlay();
    var img = ov.querySelector(".lightbox-img");

    if (!direction) {
      index = newIndex;
      var trigger = items[index];
      renderImage(ov, trigger);
      renderChrome(ov, trigger);
      return;
    }

    var outX = direction === "next" ? -ANIM_DIST : ANIM_DIST;
    var inX = direction === "next" ? ANIM_DIST : -ANIM_DIST;

    img.style.transition = "transform " + ANIM_MS + "ms ease, opacity " + ANIM_MS + "ms ease";
    img.style.transform = "translateX(" + outX + "px)";
    img.style.opacity = "0";

    window.setTimeout(function () {
      index = newIndex;
      var nextTrigger = items[index];
      renderImage(ov, nextTrigger);
      renderChrome(ov, nextTrigger);

      img.style.transition = "none";
      img.style.transform = "translateX(" + inX + "px)";
      // eslint-disable-next-line no-unused-expressions
      img.offsetWidth;

      window.setTimeout(function () {
        img.style.transition = "transform " + ANIM_MS + "ms ease, opacity " + ANIM_MS + "ms ease";
        img.style.transform = "translateX(0)";
        img.style.opacity = "1";
      }, 16);
    }, ANIM_MS);
  }

  function open(trigger) {
    var group = trigger.closest(".epk-gallery, .epk-covers");
    var scope = group || document;
    items = Array.prototype.slice.call(scope.querySelectorAll("[data-lightbox]"));
    if (!items.length) items = [trigger];
    index = items.indexOf(trigger);
    if (index === -1) index = 0;
    var ov = ensureOverlay();
    var img = ov.querySelector(".lightbox-img");
    img.style.transition = "none";
    img.style.transform = "translateX(0)";
    img.style.opacity = "1";
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
