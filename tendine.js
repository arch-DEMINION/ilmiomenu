// Il mio menù — tendine: ogni funzione e ogni scheda per i professionisti si apre solo se la tocchi.
(function () {
  var heads = Array.prototype.slice.call(document.querySelectorAll(".acc-h"));
  function box(h) { return h.closest(".acc, .acc-card"); }
  function set(h, open) {
    h.setAttribute("aria-expanded", open ? "true" : "false");
    box(h).classList.toggle("open", open);
  }
  heads.forEach(function (h) {
    h.addEventListener("click", function () {
      var open = h.getAttribute("aria-expanded") !== "true";
      set(h, open);
      if (open) setTimeout(function () {
        var r = box(h).getBoundingClientRect();
        if (r.top < 70) window.scrollBy({ top: r.top - 76, behavior: "smooth" }); // l'intestazione resta visibile sotto il menù
      }, 60);
      sync();
    });
  });

  // «Apri tutte / Chiudi tutte» per le funzioni.
  var all = document.getElementById("acc-all");
  var fn = Array.prototype.slice.call(document.querySelectorAll("#funzioni .acc-h"));
  function sync() {
    if (!all) return;
    var every = fn.every(function (h) { return h.getAttribute("aria-expanded") === "true"; });
    all.textContent = every ? "Chiudi tutte" : "Apri tutte";
  }
  if (all) all.addEventListener("click", function () {
    var every = fn.every(function (h) { return h.getAttribute("aria-expanded") === "true"; });
    fn.forEach(function (h) { set(h, !every); });
    sync();
  });

  // Un link come #f7 (o #manda) apre la tendina giusta.
  function fromHash() {
    var id = location.hash.slice(1), el = id && document.getElementById(id);
    var a = el && el.closest(".acc");
    if (a) { var h = a.querySelector(".acc-h"); set(h, true); sync(); setTimeout(function () { a.scrollIntoView({ behavior: "smooth", block: "start" }); }, 80); }
  }
  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
