(function () {
  function setupGallery(gallery) {
    var items = gallery.querySelectorAll(".cover-trigger");
    if (items.length <= 4) return;
    gallery.classList.add("epk-gallery--row");

    var wrap = document.createElement("div");
    wrap.className = "epk-gallery-wrap";
    gallery.parentNode.insertBefore(wrap, gallery);
    wrap.appendChild(gallery);

    var prev = document.createElement("button");
    prev.type = "button";
    prev.className = "gallery-nav gallery-prev";
    prev.setAttribute("aria-label", "Previous photos");
    prev.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    var next = document.createElement("button");
    next.type = "button";
    next.className = "gallery-nav gallery-next";
    next.setAttribute("aria-label", "Next photos");
    next.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    wrap.appendChild(prev);
    wrap.appendChild(next);

    function step() {
      var first = gallery.querySelector(".cover-trigger");
      var second = items[1];
      if (first && second) {
        return second.offsetLeft - first.offsetLeft;
      }
      return gallery.clientWidth;
    }

    function update() {
      var max = gallery.scrollWidth - gallery.clientWidth;
      var overflowing = max > 4;
      prev.hidden = !overflowing || gallery.scrollLeft <= 4;
      next.hidden = !overflowing || gallery.scrollLeft >= max - 4;
    }

    prev.addEventListener("click", function () {
      gallery.scrollBy({ left: -step(), behavior: "smooth" });
    });
    next.addEventListener("click", function () {
      gallery.scrollBy({ left: step(), behavior: "smooth" });
    });
    gallery.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    update();
  }

  document.querySelectorAll(".epk-gallery").forEach(setupGallery);
})();
