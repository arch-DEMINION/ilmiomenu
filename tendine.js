// Il mio menù — funzioni: scorrendo la pagina in verticale le schede scorrono di lato (sezione ferma).
// Ogni scheda è già aperta; «Approfondisci» fa salire dentro la scheda tutti i dettagli. Più le tendine dei professionisti.
(function () {
  document.querySelectorAll(".acc-card .acc-h").forEach(function (h) {
    h.addEventListener("click", function () {
      var open = h.getAttribute("aria-expanded") !== "true";
      h.setAttribute("aria-expanded", open ? "true" : "false");
      h.closest(".acc-card").classList.toggle("open", open);
    });
  });

  var pin = document.getElementById("hpin"), strip = document.getElementById("fstrip");
  if (!pin || !strip) return;
  var root = document.documentElement, view = pin.querySelector(".hp-view");
  var pinned = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (pinned) root.classList.add("hp-on");
  var cards = Array.prototype.slice.call(strip.querySelectorAll(".fcard")), N = cards.length;
  var range = document.getElementById("hp-range"), lab = document.getElementById("hp-n"), labT = document.getElementById("hp-t");
  var prevB = document.querySelector(".hp-prev"), nextB = document.querySelector(".hp-next");
  var dist = 0, cur = -1;
  // Quanti px di pagina per ogni px laterale: meno di 1, così la sezione non diventa lunghissima.
  function K() { return window.innerWidth < 760 ? 0.6 : 0.5; }
  range.min = 0; range.max = 1000; range.step = 1;

  // ---------- «Approfondisci» ----------
  function setMore(li, open) {
    var panel = li.querySelector(".fc-panel"), btn = li.querySelector(".fc-more");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) { panel.hidden = false; void panel.offsetWidth; li.classList.add("more"); panel.querySelector(".fc-close").focus({ preventScroll: true }); }
    else {
      li.classList.remove("more");
      setTimeout(function () { if (!li.classList.contains("more")) panel.hidden = true; }, 460);
      btn.focus({ preventScroll: true });
    }
  }
  cards.forEach(function (li) {
    li.querySelector(".fc-more").addEventListener("click", function () { setMore(li, true); });
    li.querySelector(".fc-close").addEventListener("click", function () { setMore(li, false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    cards.forEach(function (li) { if (li.classList.contains("more")) setMore(li, false); });
  });

  // ---------- scorrimento laterale guidato dalla pagina ----------
  function pinTop() { return pin.getBoundingClientRect().top + window.scrollY; }
  function shift() { return pinned ? Math.max(0, Math.min(dist, -pin.getBoundingClientRect().top / K())) : view.scrollLeft; }
  function layout() {
    dist = Math.max(0, strip.scrollWidth - view.clientWidth);
    if (pinned) pin.style.height = Math.round(window.innerHeight + dist * K()) + "px";
    draw();
  }
  function draw() {
    var x = shift();
    if (pinned) strip.style.transform = "translate3d(" + (-x).toFixed(1) + "px,0,0)";
    var p = dist ? x / dist : 0;
    range.value = Math.round(p * 1000);
    range.style.setProperty("--pct", (p * 100).toFixed(2) + "%");
    // scheda più vicina al centro: etichetta e frecce
    var mid = x + view.clientWidth / 2, best = 0, bd = Infinity;
    cards.forEach(function (c, k) {
      var off = c.offsetLeft + c.offsetWidth / 2 - mid, d = Math.abs(off);
      if (d < bd) { bd = d; best = k; }
      // posizione rispetto al centro (-1 a sinistra, 1 a destra): guida zoom e parallasse dei telefoni
      var r = Math.max(-1.5, Math.min(1.5, off / c.offsetWidth));
      if (Math.abs(r) < 1.5 || c._r !== r) { c.style.setProperty("--d", r.toFixed(3)); c._r = r; }
    });
    cards.forEach(function (c, k) { c.classList.toggle("focus", k === best); });
    if (best !== cur) {
      cur = best;
      lab.textContent = (cur + 1) + " / " + N;
      labT.textContent = cards[cur].querySelector(".fc-t b").textContent;
    }
    prevB.disabled = x <= 2; nextB.disabled = x >= dist - 2;
  }
  // Spostamento laterale x (in px) che porta la scheda i al centro.
  function xOf(i) { var c = cards[i]; return Math.max(0, Math.min(dist, c.offsetLeft + c.offsetWidth / 2 - view.clientWidth / 2)); }
  function goX(x, instant) {
    if (pinned) window.scrollTo({ top: pinTop() + x * K() + 1, behavior: instant ? "auto" : "smooth" });
    else view.scrollTo({ left: x, behavior: instant ? "auto" : "smooth" });
  }

  var tick = false;
  function onScroll() { if (!tick) { tick = true; requestAnimationFrame(function () { tick = false; draw(); }); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  view.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", layout);
  if ("ResizeObserver" in window) new ResizeObserver(layout).observe(strip);

  range.addEventListener("input", function () { goX(+range.value / 1000 * dist, true); });
  // Le frecce portano alla scheda precedente o successiva rispetto a quella al centro.
  prevB.addEventListener("click", function () {
    var x = shift(), i = cur;
    while (i > 0 && xOf(i) >= x - 4) i--;
    goX(xOf(i));
  });
  nextB.addEventListener("click", function () {
    var x = shift(), i = cur;
    while (i < N - 1 && xOf(i) <= x + 4) i++;
    goX(xOf(i));
  });

  layout();
  // Un link come #manda porta direttamente a quella scheda.
  function fromHash() {
    var id = location.hash.slice(1), i = cards.findIndex(function (c) { return c.id === id; });
    if (i < 0) return;
    if (pinned) { layout(); window.scrollTo(0, pinTop() + xOf(i) * K() + 1); } else { document.getElementById("funzioni").scrollIntoView(); goX(xOf(i), true); }
  }
  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
