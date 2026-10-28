// Theme toggle (remembers choice), mobile menu, and image placeholders.
(function () {
  const root = document.documentElement;
  try {
    const saved = localStorage.getItem("theme");
    if (saved) root.setAttribute("data-theme", saved);
  } catch (e) {}

  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.querySelector(".theme-btn");
    const isDark = () =>
      root.getAttribute("data-theme") === "dark" ||
      (!root.getAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
    const setIcon = () => { if (btn) btn.textContent = isDark() ? "☀" : "☾"; };
    setIcon();
    if (btn) btn.addEventListener("click", function () {
      const next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      setIcon();
    });

    const menu = document.querySelector(".menu-btn");
    const links = document.querySelector(".nav-links");
    if (menu && links) menu.addEventListener("click", () => links.classList.toggle("open"));

    // Missing project / paper images -> labelled placeholder
    document.querySelectorAll("img[data-ph]").forEach(function (img) {
      const swap = function () {
        const d = document.createElement("div");
        d.className = "ph";
        d.textContent = img.getAttribute("data-ph");
        img.replaceWith(d);
      };
      if (img.complete && img.naturalWidth === 0) swap();
      else img.addEventListener("error", swap);
    });

    // Missing profile photo -> initials
    const av = document.querySelector("img.avatar");
    if (av) {
      const swapAv = function () {
        const d = document.createElement("div");
        d.className = "avatar-fallback";
        d.textContent = "MS";
        av.replaceWith(d);
      };
      if (av.complete && av.naturalWidth === 0) swapAv();
      else av.addEventListener("error", swapAv);
    }

    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  });
})();
