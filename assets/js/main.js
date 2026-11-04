/* =========================================================
   M2E École Polytechnique — scripts du site (sans dépendance)
   ========================================================= */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  /* ---------- Configuration ----------
     Les formulaires envoient la demande sur WhatsApp (numéro principal).
     Pour recevoir aussi les demandes par e-mail sans ouvrir WhatsApp,
     renseignez FORM_ENDPOINT avec l'URL d'un service comme Formspree
     (ex. "https://formspree.io/f/xxxxxx"). */
  var CONFIG = {
    WHATSAPP: "23566373567",
    EMAIL: "m2e.ecole.polytech@gmail.com",
    FORM_ENDPOINT: ""
  };

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Header : ombre au défilement + menu mobile ---------- */
  var header = $(".site-header");
  var toTop = $(".to-top");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 10);
    if (toTop) toTop.classList.toggle("is-visible", y > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  var toggle = $(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$(".nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- Apparition au défilement ---------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Compteurs animés ---------- */
  var counters = $$("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, end = parseInt(el.getAttribute("data-count"), 10), start = null, dur = 1400;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- Diaporama du hero ---------- */
  var slides = $$(".hero__slide");
  var dots = $$(".hero__dots button");
  if (slides.length > 1) {
    var cur = 0, timer;
    function go(i) {
      slides[cur].classList.remove("is-active"); if (dots[cur]) dots[cur].classList.remove("is-active");
      cur = (i + slides.length) % slides.length;
      slides[cur].classList.add("is-active"); if (dots[cur]) dots[cur].classList.add("is-active");
    }
    function play() { timer = setInterval(function () { go(cur + 1); }, 6500); }
    dots.forEach(function (d, i) { d.addEventListener("click", function () { clearInterval(timer); go(i); play(); }); });
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) play();
  }

  /* ---------- Sous-navigation active (page Filières) ---------- */
  var subLinks = $$(".subnav a");
  if (subLinks.length && "IntersectionObserver" in window) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          subLinks.forEach(function (l) {
            var on = l.getAttribute("href") === "#" + en.target.id;
            l.classList.toggle("is-active", on);
            if (on && l.scrollIntoView && window.innerWidth < 900) {
              l.parentNode.scrollTo({ left: l.offsetLeft - 20, behavior: "smooth" });
            }
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    subLinks.forEach(function (l) { var t = $(l.getAttribute("href")); if (t) sio.observe(t); });
  }

  /* ---------- Filtres (actualités / galerie) ---------- */
  $$("[data-filter-group]").forEach(function (group) {
    var target = group.getAttribute("data-filter-group");
    var btns = $$(".filter-btn", group);
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        btns.forEach(function (b) { b.classList.toggle("is-active", b === btn); b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
        $$('[data-group="' + target + '"]').forEach(function (item) {
          var cats = (item.getAttribute("data-cat") || "").split(" ");
          item.classList.toggle("is-hidden", f !== "all" && cats.indexOf(f) === -1);
        });
      });
    });
  });

  /* ---------- Lightbox de la galerie ---------- */
  var lb = $(".lightbox");
  if (lb) {
    var items = $$(".gallery__item"), idx = 0;
    var lbImg = $("img", lb), lbCap = $(".lightbox__cap", lb), lastFocus;
    function visible() { return items.filter(function (i) { return !i.classList.contains("is-hidden"); }); }
    function show(i) {
      var list = visible(); if (!list.length) return;
      idx = (i + list.length) % list.length;
      var it = list[idx];
      lbImg.src = it.getAttribute("data-full");
      lbImg.alt = $("img", it).alt;
      lbCap.textContent = $("figcaption", it) ? $("figcaption", it).textContent : "";
    }
    function open(it) {
      lastFocus = document.activeElement;
      show(visible().indexOf(it));
      lb.classList.add("is-open"); document.body.style.overflow = "hidden";
      $(".modal-close", lb).focus();
    }
    function close() { lb.classList.remove("is-open"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
    items.forEach(function (it) { it.addEventListener("click", function () { open(it); }); });
    $(".lightbox__prev", lb).addEventListener("click", function () { show(idx - 1); });
    $(".lightbox__next", lb).addEventListener("click", function () { show(idx + 1); });
    $(".modal-close", lb).addEventListener("click", close);
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------- Fenêtre article (actualités) ---------- */
  var modal = $(".article-modal");
  if (modal) {
    var mLast;
    function openArticle(id) {
      var tpl = document.getElementById(id); if (!tpl) return;
      mLast = document.activeElement;
      $(".article-modal__inner", modal).innerHTML = tpl.innerHTML;
      modal.classList.add("is-open"); document.body.style.overflow = "hidden";
      $(".modal-close", modal).focus();
      if (history.replaceState) history.replaceState(null, "", "#" + id.replace("tpl-", ""));
    }
    function closeArticle() {
      modal.classList.remove("is-open"); document.body.style.overflow = "";
      if (history.replaceState) history.replaceState(null, "", location.pathname);
      if (mLast) mLast.focus();
    }
    $$("[data-article]").forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); openArticle(a.getAttribute("data-article")); });
    });
    $(".modal-close", modal).addEventListener("click", closeArticle);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeArticle(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("is-open")) closeArticle(); });
    if (location.hash && document.getElementById("tpl-" + location.hash.slice(1))) openArticle("tpl-" + location.hash.slice(1));
  }

  /* ---------- Pré-sélection via l'URL (?filiere=...) ---------- */
  var params = new URLSearchParams(location.search);
  $$("select[data-prefill]").forEach(function (sel) {
    var v = params.get(sel.getAttribute("data-prefill"));
    if (v) $$("option", sel).forEach(function (o) { if (o.value === v) sel.value = v; });
  });

  /* ---------- Formulaires ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^[+0-9 ().-]{8,20}$/;

  function validateField(field) {
    var input = $("input, select, textarea", field);
    if (!input || input.type === "checkbox" && !input.required) return true;
    var v = (input.type === "checkbox") ? input.checked : input.value.trim();
    var ok = true;
    if (input.required && !v) ok = false;
    else if (v && input.type === "email" && !EMAIL_RE.test(v)) ok = false;
    else if (v && input.type === "tel" && !PHONE_RE.test(v)) ok = false;
    field.classList.toggle("has-error", !ok);
    input.setAttribute("aria-invalid", ok ? "false" : "true");
    return ok;
  }

  function buildMessage(form) {
    var title = form.getAttribute("data-title") || "Demande";
    var lines = ["*" + title + " — M2E École Polytechnique*", ""];
    $$("[name]", form).forEach(function (el) {
      if (el.classList.contains("hp-input") || el.type === "submit") return;
      if (el.type === "checkbox" && !el.checked) return;
      if (el.type === "radio" && !el.checked) return;
      var v = el.type === "checkbox" ? "Oui" : el.value.trim();
      if (!v) return;
      var label = el.getAttribute("data-label") || el.name;
      lines.push("• " + label + " : " + v);
    });
    return lines.join("\n");
  }

  $$("form[data-form]").forEach(function (form) {
    var fields = $$(".field", form);
    fields.forEach(function (f) {
      var inp = $("input, select, textarea", f);
      if (inp) {
        inp.addEventListener("blur", function () { if (inp.value) validateField(f); });
        inp.addEventListener("input", function () { if (f.classList.contains("has-error")) validateField(f); });
        inp.addEventListener("change", function () { if (f.classList.contains("has-error")) validateField(f); });
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var hp = $(".hp-input", form);
      if (hp && hp.value) return; // anti-spam
      var ok = true, first = null;
      fields.forEach(function (f) { if (!validateField(f)) { ok = false; if (!first) first = f; } });
      if (!ok) { var fi = $("input, select, textarea", first); if (fi) fi.focus(); return; }

      var msg = buildMessage(form);
      var waUrl = "https://wa.me/" + CONFIG.WHATSAPP + "?text=" + encodeURIComponent(msg);
      var subject = encodeURIComponent((form.getAttribute("data-title") || "Demande") + " — site M2E");
      var mailUrl = "mailto:" + CONFIG.EMAIL + "?subject=" + subject + "&body=" + encodeURIComponent(msg.replace(/\*/g, ""));

      var success = form.parentNode.querySelector(".form-success");
      function finish() {
        if (success) {
          var wa = $("[data-wa-link]", success), ml = $("[data-mail-link]", success);
          if (wa) wa.href = waUrl;
          if (ml) ml.href = mailUrl;
          form.style.display = "none";
          success.classList.add("is-visible");
          success.setAttribute("tabindex", "-1"); success.focus();
        }
      }

      if (CONFIG.FORM_ENDPOINT) {
        var btn = $("[type=submit]", form); if (btn) { btn.disabled = true; btn.textContent = "Envoi en cours…"; }
        fetch(CONFIG.FORM_ENDPOINT, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
          .then(function () { finish(); })
          .catch(function () { finish(); window.open(waUrl, "_blank", "noopener"); });
      } else {
        window.open(waUrl, "_blank", "noopener");
        finish();
      }
    });
  });

  $$("[data-form-reset]").forEach(function (b) {
    b.addEventListener("click", function () {
      var success = b.closest(".form-success"), form = success.parentNode.querySelector("form");
      form.reset(); form.style.display = ""; success.classList.remove("is-visible");
    });
  });

  /* ---------- Année du pied de page ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
