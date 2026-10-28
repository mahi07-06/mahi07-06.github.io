// Theme toggle, mobile menu, abstracts, image placeholders, lightbox, PDF fallback.
(function () {
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  if (!saved) saved = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  root.setAttribute("data-theme", saved);

  document.addEventListener("DOMContentLoaded", function () {
    var t = document.getElementById("theme-toggle");
    var setIcon = function () {
      if (t) t.innerHTML = root.getAttribute("data-theme") === "dark"
        ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    };
    setIcon();
    if (t) t.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      setIcon();
    });

    var m = document.getElementById("menu-toggle"), l = document.querySelector(".nav-links");
    if (m && l) m.addEventListener("click", function () { l.classList.toggle("open"); });

    document.querySelectorAll("[data-abs]").forEach(function (b) {
      b.addEventListener("click", function () {
        var a = document.getElementById(b.getAttribute("data-abs"));
        if (a) a.classList.toggle("open");
      });
    });

    // Images that are not uploaded yet -> labelled placeholder
    document.querySelectorAll("img[data-ph]").forEach(function (img) {
      var swap = function () {
        var d = document.createElement("div");
        d.className = "ph " + (img.className || "");
        d.textContent = img.getAttribute("data-ph");
        img.replaceWith(d);
      };
      if (img.complete && img.naturalWidth === 0) swap(); else img.addEventListener("error", swap);
    });

    // Lightbox for gallery images
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML = "<img alt=''>";
    document.body.appendChild(lb);
    lb.addEventListener("click", function () { lb.classList.remove("open"); });
    document.addEventListener("click", function (e) {
      var img = e.target.closest && e.target.closest(".gallery img");
      if (img) { lb.querySelector("img").src = img.src; lb.classList.add("open"); }
    });

    // PDF pages: show a message if the PDF has not been uploaded yet
    document.querySelectorAll("[data-pdf]").forEach(function (box) {
      var src = box.getAttribute("data-pdf");
      fetch(src, { method: "HEAD" }).then(function (r) {
        if (r.ok) box.innerHTML = '<embed src="' + src + '#view=FitH" type="application/pdf">';
        else throw 0;
      }).catch(function () {
        box.classList.remove("pdf-fullscreen");
        box.innerHTML = '<div class="pdf-missing"><p><i class="fa-regular fa-file-pdf fa-3x"></i></p><p>' +
          box.getAttribute("data-missing") + "</p></div>";
      });
    });

    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  });
})();
