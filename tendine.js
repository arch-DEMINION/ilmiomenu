// Il mio menù — funzioni: la pagina fa scorrere le schede di lato e ognuna si apre da sola al centro dello schermo.
// Si può anche usare il cursore, le frecce o toccare una scheda. Più le tendine per le schede dei professionisti.
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
  var root = document.documentElement, stage = pin.querySelector(".hpin-stage"), view = pin.querySelector(".hp-view");
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pinned = !still; // la pagina guida le schede; altrimenti solo cursore, frecce e tocco
  if (pinned) root.classList.add("hp-on");
  var cards = Array.prototype.slice.call(strip.querySelectorAll(".fcard"));
  var N = cards.length, cur = -1;
  var range = document.getElementById("hp-range"), lab = document.getElementById("hp-n"), labT = document.getElementById("hp-t");
  var prevB = document.querySelector(".hp-prev"), nextB = document.querySelector(".hp-next");
  var GAP = 18, STEP_MIN = 300;
  range.max = N - 1;

  function pinTop() { return pin.getBoundingClientRect().top + window.scrollY; }
  function step() { return Math.max(STEP_MIN, window.innerHeight * 0.42); }
  function layout() {
    var ow = Math.min(1000, window.innerWidth - 36);
    stage.style.setProperty("--ow", ow + "px");
    if (pinned) pin.style.height = Math.round(window.innerHeight + (N - 1) * step()) + "px";
    center(false);
  }

  // Sposta la striscia in modo che la scheda aperta stia al centro della vista.
  function center() {
    if (cur < 0) return;
    var cw = Math.min(290, window.innerWidth * 0.78), ow = Math.min(1000, window.innerWidth - 36); // come in CSS: min(78vw, 290px) e --ow
    var x = cur * (cw + GAP) + ow / 2;
    strip.style.transform = "translate3d(" + Math.round(view.clientWidth / 2 - x) + "px,0,0)";
  }

  function fill(li) {
    var d = li.querySelector(".fc-detail");
    d.textContent = "";
    d.appendChild(li.querySelector("template").content.cloneNode(true));
  }
  function setIndex(i) {
    i = Math.max(0, Math.min(N - 1, i));
    if (i === cur) return;
    var old = cards[cur];
    if (old) {
      old.classList.remove("open");
      old.querySelector(".fc-btn").setAttribute("aria-expanded", "false");
      setTimeout(function () { if (!old.classList.contains("open")) old.querySelector(".fc-detail").textContent = ""; }, 520);
    }
    cur = i;
    var li = cards[i];
    li.classList.add("open");
    li.querySelector(".fc-btn").setAttribute("aria-expanded", "true");
    fill(li);
    center();
    range.value = i;
    range.style.setProperty("--pct", (N > 1 ? i / (N - 1) * 100 : 0) + "%");
    lab.textContent = (i + 1) + " / " + N;
    labT.textContent = li.querySelector(".fc-t b").textContent;
    prevB.disabled = i === 0; nextB.disabled = i === N - 1;
  }

  // Scorrimento della pagina -> scheda attiva.
  var tick = false;
  function fromScroll() {
    tick = false;
    if (!pinned) return;
    var r = pin.getBoundingClientRect(), span = r.height - window.innerHeight;
    if (r.top > window.innerHeight || r.bottom < 0) return;
    var p = Math.max(0, Math.min(1, -r.top / span));
    setIndex(Math.round(p * (N - 1)));
  }
  window.addEventListener("scroll", function () { if (!tick) { tick = true; requestAnimationFrame(fromScroll); } }, { passive: true });
  window.addEventListener("resize", function () { layout(); fromScroll(); });

  // Cursore, frecce e tocco: in modalità «pagina guida» spostano la pagina, altrimenti cambiano scheda direttamente.
  function goTo(i, instant) {
    i = Math.max(0, Math.min(N - 1, i));
    if (pinned) {
      var span = pin.offsetHeight - window.innerHeight;
      var inView = pin.getBoundingClientRect().top <= 0 && pin.getBoundingClientRect().bottom >= window.innerHeight;
      window.scrollTo({ top: pinTop() + span * (i / (N - 1)) + 1, behavior: instant || !inView ? "auto" : "smooth" });
      if (!inView) setIndex(i);
    } else setIndex(i);
  }
  range.addEventListener("input", function () { goTo(+range.value, true); });
  prevB.addEventListener("click", function () { goTo(cur - 1); });
  nextB.addEventListener("click", function () { goTo(cur + 1); });
  cards.forEach(function (li, i) { li.querySelector(".fc-btn").addEventListener("click", function () { if (i !== cur) goTo(i); }); });
  stage.addEventListener("keydown", function (e) {
    if (e.target === range) return; // il cursore usa già le sue frecce
    if (e.key === "ArrowLeft") { goTo(cur - 1); e.preventDefault(); }
    else if (e.key === "ArrowRight") { goTo(cur + 1); e.preventDefault(); }
  });

  layout();
  setIndex(0);
  // Un link come #manda porta direttamente a quella scheda.
  function fromHash() {
    var id = location.hash.slice(1), i = cards.findIndex(function (c) { return c.id === id; });
    if (i < 0) return;
    if (pinned) { window.scrollTo(0, pinTop()); setIndex(i); setTimeout(function () { goTo(i, true); }, 50); } else { document.getElementById("funzioni").scrollIntoView(); setIndex(i); }
  }
  window.addEventListener("hashchange", fromHash);
  fromHash();
  fromScroll();
})();
