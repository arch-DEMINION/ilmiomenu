// Il mio menù — funzioni: scorrendo la pagina le schede scorrono di lato (sezione ferma), toccandone una si apre sul posto.
// Tendine per le schede dei professionisti.
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
  var root = document.documentElement;
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var view = pin.querySelector(".hp-view");
  var cards = Array.prototype.slice.call(strip.querySelectorAll(".fcard"));
  var dist = 0, mode = !still; // mode: la pagina guida lo scorrimento laterale; altrimenti la striscia scorre con il dito
  if (mode) root.classList.add("hp-on");

  function pinTop() { return pin.getBoundingClientRect().top + window.scrollY; }
  function layout() {
    if (!mode) { pin.style.height = ""; return; }
    dist = Math.max(0, strip.scrollWidth - view.clientWidth);
    pin.style.height = (window.innerHeight + dist) + "px";
    draw();
  }
  function draw() {
    if (!mode) return;
    var y = Math.max(0, Math.min(dist, -pin.getBoundingClientRect().top));
    strip.style.transform = "translate3d(" + (-y).toFixed(1) + "px,0,0)";
  }
  var tick = false;
  window.addEventListener("scroll", function () { if (!tick) { tick = true; requestAnimationFrame(function () { tick = false; draw(); }); } }, { passive: true });
  window.addEventListener("resize", layout);
  if ("ResizeObserver" in window) new ResizeObserver(layout).observe(strip);
  layout();

  // Porta la scheda a sinistra, dentro lo schermo.
  function reveal(li) {
    var pad = parseFloat(getComputedStyle(strip).paddingLeft) || 0;
    if (mode) {
      var x = Math.max(0, Math.min(dist, li.offsetLeft - pad));
      window.scrollTo({ top: pinTop() + x, behavior: "smooth" });
    } else strip.scrollTo({ left: li.offsetLeft - pad, behavior: "smooth" });
  }

  function fill(li) {
    var d = li.querySelector(".fc-detail");
    d.textContent = "";
    d.appendChild(li.querySelector("template").content.cloneNode(true));
  }
  function setOpen(li, open) {
    var b = li.querySelector(".fc-btn");
    b.setAttribute("aria-expanded", open ? "true" : "false");
    li.classList.toggle("open", open);
    if (open) fill(li);
    else setTimeout(function () { if (!li.classList.contains("open")) li.querySelector(".fc-detail").textContent = ""; }, 450);
  }
  function toggle(li) {
    var willOpen = !li.classList.contains("open");
    cards.forEach(function (c) { if (c !== li && c.classList.contains("open")) setOpen(c, false); });
    setOpen(li, willOpen);
    layout();
    if (willOpen) { setTimeout(function () { layout(); reveal(li); }, 60); }
    history.replaceState(null, "", willOpen ? "#" + li.id : location.pathname + location.search);
  }
  cards.forEach(function (li) { li.querySelector(".fc-btn").addEventListener("click", function () { toggle(li); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var o = cards.filter(function (c) { return c.classList.contains("open"); })[0];
    if (o) { toggle(o); o.querySelector(".fc-btn").focus(); }
  });

  // Un link come #manda apre direttamente la scheda giusta.
  function fromHash() {
    var id = location.hash.slice(1), li = id && cards.filter(function (c) { return c.id === id; })[0];
    if (!li || li.classList.contains("open")) return;
    window.scrollTo(0, pinTop());
    setOpen(li, true); layout();
    setTimeout(function () { layout(); reveal(li); }, 120);
  }
  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
