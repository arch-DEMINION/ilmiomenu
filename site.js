// Il mio menù — animazioni allo scroll, trailer e modulo per i tester. Nessuna libreria.
(function () {
  var root = document.documentElement;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("js");

  // Entrata delle sezioni: .reveal diventa .in quando entra nello schermo.
  var items = document.querySelectorAll(".reveal");
  if (still || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    // Ciò che è già nello schermo all'apertura entra subito, anche se l'observer parte in ritardo (scheda in background).
    setTimeout(function () {
      items.forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in"); });
    }, 50);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  // Numeri che contano fino al valore in data-count.
  var counters = document.querySelectorAll("[data-count]");
  function show(el) {
    var end = +el.dataset.count, suffix = el.dataset.suffix || "";
    if (still) { el.textContent = end + suffix; return; }
    var t0 = performance.now(), dur = 1200;
    (function tick(t) {
      var k = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(end * eased) + suffix;
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else counters.forEach(show);

  // Header pieno, barra di avanzamento e parallasse dei telefoni nell'hero.
  var top = document.querySelector(".top"), bar = document.querySelector(".progress");
  var par = still ? [] : Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var ticking = false;
  function onScroll() {
    var y = window.scrollY, h = root.scrollHeight - window.innerHeight;
    if (top) top.classList.toggle("solid", y > 24);
    if (bar) bar.style.setProperty("--p", h > 0 ? (y / h).toFixed(4) : 0);
    for (var i = 0; i < par.length; i++) {
      if (y < window.innerHeight * 1.2) par[i].style.transform = "translate3d(0," + (y * +par[i].dataset.parallax).toFixed(1) + "px,0)";
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  // Trailer: l'iframe di YouTube si carica solo dopo il tocco (niente richieste a Google prima).
  var v = document.querySelector(".video button");
  if (v) v.addEventListener("click", function () {
    var f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + v.dataset.id + "?autoplay=1&rel=0";
    f.title = "Il mio menù: trailer";
    f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    f.allowFullscreen = true;
    v.replaceWith(f);
  });

  // Richiesta per diventare tester: apre la mail già pronta.
  var form = document.getElementById("tf");
  if (form) {
    var mail = document.getElementById("te"), msg = document.getElementById("tm"), err = document.getElementById("terr");
    var P = "Voglio partecipare al test con questa mail: ", edited = false;
    msg.addEventListener("input", function () { edited = msg.value !== P + mail.value.trim(); });
    mail.addEventListener("input", function () {
      mail.removeAttribute("aria-invalid"); err.textContent = "";
      if (!edited) msg.value = P + mail.value.trim();
    });
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var v = mail.value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) {
        mail.setAttribute("aria-invalid", "true");
        err.textContent = "Scrivi un indirizzo email valido, per esempio nome@gmail.com.";
        mail.focus();
        return;
      }
      var body = edited ? msg.value + "\n\nEmail: " + v : msg.value;
      location.href = "mailto:gianlucasperduto2@gmail.com?subject=" +
        encodeURIComponent("Test Il mio menù: richiesta di partecipazione") + "&body=" + encodeURIComponent(body);
    });
  }
})();
