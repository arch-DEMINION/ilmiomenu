// Il mio menù — animazioni legate alla rotella: sfoglia degli stili delle icone e dei temi speciali, piccola parallasse dei telefoni.
(function () {
  var root = document.documentElement;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // restano la griglia e la galleria statiche
  root.classList.add("pinon");
  var clamp = function (v) { return Math.max(0, Math.min(1, v)); };
  function progress(el) { var r = el.getBoundingClientRect(); return clamp((-r.top / (r.height - window.innerHeight) - 0.06) / 0.88); }

  // ---------- una icona, undici stili ----------
  var STY = [["3d", "3D", 0, "#fff"], ["fumetto", "Fumetto", 0, "#FFF4D6"], ["quaderno", "Quaderno", 0, "#FBF8F1"], ["pixel", "Pixel", 0, "#12122A"],
    ["neon", "Neon", 0, "#140C28"], ["progetto", "Progetto", 0, "#18468C"], ["adesivo", "Adesivo", 1, "#F6F1E7"], ["pastello", "Pastello", 1, "#FFF1F4"],
    ["acquerello", "Acquerello", 1, "#EEF0E6"], ["puntocroce", "Punto croce", 1, "#F5EFE3"], ["lucciola", "Lucciola", 1, "#1E1420"]];
  var FOOD = ["avocado", "salmon", "strawberry", "croissant"];
  var pi = document.getElementById("pin-icons");
  if (pi) {
    var tile = document.getElementById("itile"), nameEl = document.getElementById("iname"), newEl = document.getElementById("inew"), dots = document.getElementById("idots");
    var layers = [];
    FOOD.forEach(function (f) {
      var slot = document.createElement("div"); slot.className = "islot";
      STY.forEach(function (s, i) {
        var im = new Image(); im.src = "img/icons/" + s[0] + "-" + f + ".webp"; im.alt = ""; im.width = im.height = 128; im.decoding = "async";
        slot.appendChild(im); (layers[i] = layers[i] || []).push(im);
      });
      tile.appendChild(slot);
    });
    STY.forEach(function (s, i) {
      var d = document.createElement("span"); d.textContent = s[1]; dots.appendChild(d);
    });
    var dotEls = dots.children, lastI = -1;
    function drawIcons() {
      var pos = progress(pi) * (STY.length - 1), idx = Math.round(pos);
      for (var i = 0; i < STY.length; i++) {
        var o = Math.max(0, 1 - Math.abs(i - pos) * 1.6);
        for (var k = 0; k < layers[i].length; k++) {
          layers[i][k].style.opacity = o;
          layers[i][k].style.transform = "scale(" + (0.82 + 0.18 * o) + ") rotate(" + ((i - pos) * 14) + "deg)";
        }
      }
      if (idx !== lastI) {
        lastI = idx;
        nameEl.textContent = STY[idx][1]; newEl.hidden = !STY[idx][2];
        tile.style.setProperty("--tile", STY[idx][3]);
        for (var j = 0; j < dotEls.length; j++) dotEls[j].classList.toggle("on", j === idx);
      }
    }
    pi._draw = drawIcons;
  }

  // ---------- cinque temi speciali, dal vivo ----------
  var TH = [["fumetto", "Fumetto", "#FFF4D6", "Bordi neri spessi, colori pieni e titoli da copertina."],
    ["quaderno", "Quaderno", "#FBF8F1", "Quadretti e titoli scritti a mano, come sul banco."],
    ["salagiochi", "Sala giochi", "#12122A", "Toni scuri e titoli pixel, con il bonus +1UP."],
    ["neon", "Neon", "#140C28", "Insegne magenta e azzurre che si accendono nella notte."],
    ["progetto", "Progetto", "#18468C", "Linee bianche su carta blu, come un disegno tecnico."]];
  var pt = document.getElementById("pin-themes");
  if (pt) {
    var deck = document.getElementById("deck"), dn = document.getElementById("dname"), di = document.getElementById("dinfo"), dd = document.getElementById("ddots");
    var figs = TH.map(function (t) {
      var f = document.createElement("div"); f.className = "dphone";
      f.innerHTML = '<div class="phone"><img src="img/' + t[0] + '.webp" alt="Tema ' + t[1] + '" width="540" height="1169" decoding="async"></div>';
      deck.appendChild(f);
      var d = document.createElement("span"); d.textContent = t[1]; dd.appendChild(d);
      return f;
    });
    var ddEls = dd.children, lastT = -1;
    function light(hex) { var n = parseInt(hex.slice(1), 16); return (((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000) > 140; }
    function drawThemes() {
      var pos = progress(pt) * (TH.length - 1), idx = Math.round(pos), w = deck.clientWidth;
      figs.forEach(function (f, i) {
        var d = i - pos, a = Math.abs(d), step = Math.min(w * 0.46, 250);
        f.style.transform = "translateX(" + (d * step).toFixed(1) + "px) scale(" + (1 - Math.min(a, 2) * 0.17).toFixed(3) + ") rotate(" + (d * 5).toFixed(2) + "deg)";
        f.style.opacity = Math.max(0, 1 - Math.max(0, a - 1) * 0.9 - a * 0.18).toFixed(2);
        f.style.zIndex = 10 - Math.round(a * 2);
      });
      if (idx !== lastT) {
        lastT = idx;
        dn.textContent = TH[idx][1]; di.textContent = TH[idx][3];
        pt.style.setProperty("--stage", TH[idx][2]);
        pt.classList.toggle("lightbg", light(TH[idx][2]));
        for (var j = 0; j < ddEls.length; j++) ddEls[j].classList.toggle("on", j === idx);
      }
    }
    pt._draw = drawThemes;
  }

  // ---------- parallasse leggera dei telefoni nelle funzioni ----------
  var phones = Array.prototype.slice.call(document.querySelectorAll(".feature .phones .phone:nth-child(2), .feature .phones .phone:nth-child(1)"));
  function drawParallax() {
    var h = window.innerHeight;
    phones.forEach(function (p, i) {
      var r = p.getBoundingClientRect(); if (r.bottom < -100 || r.top > h + 100) return;
      var k = (r.top + r.height / 2 - h / 2) / h; // da -1 a 1
      p.style.translate = "0 " + (k * (p.matches(":nth-child(2)") ? -34 : 22)).toFixed(1) + "px";
    });
  }

  var ticking = false;
  function frame() {
    ticking = false;
    var h = window.innerHeight;
    [pi, pt].forEach(function (el) {
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (r.bottom > -h && r.top < h * 2) el._draw();
    });
    drawParallax();
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  window.addEventListener("resize", frame);
  frame();
})();
