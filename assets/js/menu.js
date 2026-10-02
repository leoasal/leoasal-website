(function () {
  // Dropdown menu in the header bar: the hamburger toggles .menu-panel.
  var toggle = document.querySelector(".menu-toggle");
  var panel = document.getElementById("menu-panel");
  if (!toggle || !panel) return;

  // Narrow screens: the social icons move from the bar into the dropdown.
  var social = document.querySelector(".header-actions .site-social");
  var actions = document.querySelector(".header-actions");
  if (social && actions && window.matchMedia) {
    var narrow = window.matchMedia("(max-width: 479px)");
    var place = function () {
      if (narrow.matches) panel.appendChild(social);
      else actions.insertBefore(social, actions.firstChild);
    };
    place();
    if (narrow.addEventListener) narrow.addEventListener("change", place);
  }

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    panel.classList.toggle("is-open", open);
  }

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // A click on a menu entry closes the panel (anchor-scroll.js handles the scroll).
  panel.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });

  // Click outside or Esc closes it as well.
  document.addEventListener("click", function (e) {
    if (!panel.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });
})();
