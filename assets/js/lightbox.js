(function () {
  var overlay = null;
  var items = [];
  var index = 0;
  var ANIM_MS = 300;
  var track = null;
  var stageWidth = 0;
  var dragStartX = null;
  var dragStartY = null;
  var dragging = false;
  var dragX = 0;

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button type="button" class="lightbox-nav lightbox-prev" aria-label="Previous image">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<div class="lightbox-content">' +
      '<div class="lightbox-stage">' +
      '<div class="lightbox-track">' +
      '<div class="lightbox-slide"></div>' +
      '<div class="lightbox-slide"></div>' +
      '<div class="lightbox-slide"></div>' +
      "</div>" +
      "</div>" +
      '<p class="lightbox-credit" hidden></p>' +
      "</div>" +
      '<button type="button" class="lightbox-nav lightbox-next" aria-label="Next image">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
    document.body.appendChild(overlay);

    track = overlay.querySelector(".lightbox-track");

    overlay.addEventListener("click", function (e) {
      if (e.target.closest(".lightbox-prev")) {
        e.stopPropagation();
        go(-1);
        return;
      }
      if (e.target.closest(".lightbox-next")) {
        e.stopPropagation();
        go(1);
        return;
      }
      if (e.target === overlay || e.target.classList.contains("lightbox-close")) {
        close();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (!overlay.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    });

    var stage = overlay.querySelector(".lightbox-stage");

    stage.addEventListener(
      "touchstart",
      function (e) {
        if (e.touches.length !== 1 || items.length <= 1) return;
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
        dragging = false;
        dragX = 0;
        stageWidth = stage.getBoundingClientRect().width;
      },
      { passive: true }
    );

    stage.addEventListener(
      "touchmove",
      function (e) {
        if (dragStartX === null) return;
        var touch = e.touches[0];
        var dx = touch.clientX - dragStartX;
        var dy = touch.clientY - dragStartY;
        if (!dragging) {
          if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
          if (Math.abs(dy) > Math.abs(dx)) {
            dragStartX = null;
            return;
          }
          dragging = true;
          track.style.transition = "none";
        }
        e.preventDefault();
        dragX = dx;
        track.style.transform = "translateX(calc(-33.3333% + " + dx + "px))";
      },
      { passive: false }
    );

    stage.addEventListener("touchend", function () {
      if (dragStartX === null) return;
      var wasDragging = dragging;
      dragStartX = null;
      dragStartY = null;
      dragging = false;
      if (!wasDragging) return;

      var threshold = Math.min(90, stageWidth * 0.18);
      if (dragX <= -threshold) {
        settleTo(-66.6667, 1);
      } else if (dragX >= threshold) {
        settleTo(0, -1);
      } else {
        settleTo(-33.3333, 0);
      }
    });

    return overlay;
  }

  function settleTo(targetPercent, step) {
    track.style.transition = "transform " + ANIM_MS + "ms ease";
    track.style.transform = "translateX(" + targetPercent + "%)";
    window.setTimeout(function () {
      if (step) index = (index + step + items.length) % items.length;
      renderSlides();
      track.style.transition = "none";
      track.style.transform = "translateX(-33.3333%)";
    }, ANIM_MS);
  }

  // Video items (data-lightbox-video) only get real playback in the centered
  // slide (offset 0) — side slides always show the poster (data-lightbox-poster)
  // as a plain image, same as everything else. Keeps the swipe/drag mechanics
  // below untouched (they only ever animate <img>-shaped content) and avoids
  // autoplaying an off-screen video during the transition.
  function fillSlide(i, offset) {
    var slide = overlay.querySelectorAll(".lightbox-slide")[offset + 1];
    var trigger = items[(i + offset + items.length * 2) % items.length];
    var triggerImg = trigger.tagName === "IMG" ? trigger : trigger.querySelector("img");
    var isVideo = trigger.hasAttribute("data-lightbox-video");
    var playVideo = isVideo && offset === 0;
    var src = playVideo
      ? trigger.getAttribute("data-lightbox")
      : isVideo
      ? trigger.getAttribute("data-lightbox-poster")
      : trigger.getAttribute("data-lightbox");
    var alt = triggerImg ? triggerImg.alt : "";

    var wantTag = playVideo ? "VIDEO" : "IMG";
    var el = slide.firstElementChild;
    if (!el || el.tagName !== wantTag) {
      slide.innerHTML = "";
      el = document.createElement(playVideo ? "video" : "img");
      el.className = "lightbox-img";
      if (playVideo) {
        el.muted = true;
        el.loop = true;
        el.playsInline = true;
        el.autoplay = true;
      }
      slide.appendChild(el);
    }
    if (playVideo) {
      el.setAttribute("aria-label", alt);
    } else {
      el.alt = alt;
    }
    if (el.getAttribute("src") !== src) {
      el.src = src;
    }
  }

  function renderSlides() {
    fillSlide(index, -1);
    fillSlide(index, 0);
    fillSlide(index, 1);
    renderChrome();
  }

  function renderChrome() {
    var ov = overlay;
    var trigger = items[index];
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

  function go(step) {
    if (!items.length || items.length <= 1) return;
    settleTo(step > 0 ? -66.6667 : 0, step);
  }

  function open(trigger) {
    var group = trigger.closest(".epk-gallery, .epk-covers");
    var scope = group || document;
    items = Array.prototype.slice.call(scope.querySelectorAll("[data-lightbox]"));
    if (!items.length) items = [trigger];
    index = items.indexOf(trigger);
    if (index === -1) index = 0;
    var ov = ensureOverlay();
    track.style.transition = "none";
    track.style.transform = "translateX(-33.3333%)";
    renderSlides();
    ov.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    var video = overlay.querySelector(".lightbox-slide video");
    if (video) video.pause();
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
