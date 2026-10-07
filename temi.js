// Il mio menù — laboratorio dei temi: una piccola copia della Lista della spesa che cambia tema, stile delle icone,
// spunte, coriandoli, festa e medaglie come l'app. Colori presi da Assets/UI/Theme*.uss, effetti da Ui.cs (Decos).
(function () {
  var mock = document.getElementById("mock");
  if (!mock) return;
  var box = document.getElementById("mockbox");
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var PAL = {"default": {"bg": "#15100C", "surface": "#2A2019", "surface-alt": "#3A2D23", "border": "#5A4636", "text": "#F5EDE4", "muted": "#B8A99A", "primary": "#E8873A", "on-primary": "#1A1410", "primary-text": "#E8873A", "success": "#4FAE7C", "success-text": "#7FD9A6", "gold": "#F2C94C", "urgent-bg": "#3A2518", "divider": "rgba(90, 70, 54, 0.6)", "check-border": "#8C7B6C"}, "scuro": {"bg": "#0A0A0C", "surface": "#1B1B20", "surface-alt": "#26262D", "border": "#3A3A43", "text": "#F1F1F4", "muted": "#A5A5B0", "primary": "#E8873A", "on-primary": "#1A1410", "primary-text": "#E8873A", "success": "#4FAE7C", "success-text": "#7FD9A6", "gold": "#F2C94C", "urgent-bg": "#2E1F13", "divider": "rgba(255, 255, 255, 0.08)", "check-border": "#70707C"}, "chiaro": {"bg": "#EEF4FF", "surface": "#FFFFFF", "surface-alt": "#E6EEFB", "border": "#D3E0F7", "text": "#0F1B33", "muted": "#5A6B8C", "primary": "#3D8BFF", "on-primary": "#06122B", "primary-text": "#1D5FD6", "success": "#3FA06E", "success-text": "#2B7A51", "gold": "#E0A91E", "urgent-bg": "#FFF1E3", "divider": "#E3EBF8", "check-border": "#A9B9D6"}, "ocra": {"bg": "#FAF3E1", "surface": "#FFFFFF", "surface-alt": "#F7ECD2", "border": "#EADCB6", "text": "#2B2623", "muted": "#7A6A55", "primary": "#D4A12A", "on-primary": "#1F1C18", "primary-text": "#8C6510", "success": "#3FA06E", "success-text": "#2B7A51", "gold": "#D4A12A", "urgent-bg": "#FFF1DA", "divider": "#F1E6CC", "check-border": "#C8B488"}, "salvia": {"bg": "#EEF1EA", "surface": "#FFFFFF", "surface-alt": "#E3E9DD", "border": "#D2DBC9", "text": "#1E2A20", "muted": "#5B6B5C", "primary": "#4F7A52", "on-primary": "#FFFFFF", "primary-text": "#3A5A40", "success": "#2F8F83", "success-text": "#1F6E64", "gold": "#D4A12A", "urgent-bg": "#FFF1DA", "divider": "#E4EADF", "check-border": "#A9B8A0"}, "cipria": {"bg": "#FFF1F4", "surface": "#FFFFFF", "surface-alt": "#FBE3EA", "border": "#F3D9E1", "text": "#3A2230", "muted": "#8B6A79", "primary": "#C94F77", "on-primary": "#FFFFFF", "primary-text": "#A93C63", "success": "#3FA06E", "success-text": "#2B7A51", "gold": "#D4A12A", "urgent-bg": "#FFF0E0", "divider": "#F7E4EA", "check-border": "#D2A9B8"}, "mirtillo": {"bg": "#16162A", "surface": "#22223B", "surface-alt": "#2D2D4A", "border": "#4A4E69", "text": "#F2E9E4", "muted": "#B4AAB8", "primary": "#B79CED", "on-primary": "#1B1530", "primary-text": "#C9B5F5", "success": "#4FAE7C", "success-text": "#7FD9A6", "gold": "#F2C94C", "urgent-bg": "#33243A", "divider": "rgba(74, 78, 105, 0.6)", "check-border": "#7E7A96"}, "prugna": {"bg": "#1E1420", "surface": "#2C1E2F", "surface-alt": "#3A2840", "border": "#47324B", "text": "#F7E9EF", "muted": "#BFA3B2", "primary": "#F28DB2", "on-primary": "#1E1420", "primary-text": "#F7A8C6", "success": "#4FAE7C", "success-text": "#7FD9A6", "gold": "#F2C94C", "urgent-bg": "#3A2433", "divider": "rgba(71, 50, 75, 0.7)", "check-border": "#8E7486"}, "fumetto": {"bg": "#FFF4D6", "surface": "#FFFFFF", "surface-alt": "#FFE9B0", "border": "#1B1B1B", "text": "#1B1B1B", "muted": "#5E5140", "primary": "#FF5A36", "on-primary": "#FFFFFF", "primary-text": "#C93A18", "success": "#1FA97E", "success-text": "#0F6E50", "gold": "#FFC83D", "urgent-bg": "#FFE3C2", "divider": "rgba(27, 27, 27, 0.25)", "check-border": "#1B1B1B"}, "quaderno": {"bg": "#FBF8F1", "surface": "#FFFFFF", "surface-alt": "#F1EEE4", "border": "#C9D2E2", "text": "#26324A", "muted": "#5B6B88", "primary": "#2B4C8C", "on-primary": "#FFFFFF", "primary-text": "#2B4C8C", "success": "#2F8F6B", "success-text": "#1F6B50", "gold": "#E3B100", "urgent-bg": "#FFF6C2", "divider": "#D6DDEA", "check-border": "#8A96AD"}, "salagiochi": {"bg": "#12122A", "surface": "#1E1E44", "surface-alt": "#2A2A55", "border": "#4B4B8F", "text": "#EDEBFF", "muted": "#9A9AD0", "primary": "#FFD23F", "on-primary": "#12122A", "primary-text": "#FFD23F", "success": "#3EE6A5", "success-text": "#3EE6A5", "gold": "#FFD23F", "urgent-bg": "#3A2A44", "divider": "rgba(75, 75, 143, 0.7)", "check-border": "#8E8EC8"}, "neon": {"bg": "#140C28", "surface": "#1C1238", "surface-alt": "#2A1B52", "border": "#7C4DFF", "text": "#F4EEFF", "muted": "#A99CD6", "primary": "#FF3DCB", "on-primary": "#140C28", "primary-text": "#FF7FDA", "success": "#38F5FF", "success-text": "#38F5FF", "gold": "#FFD84A", "urgent-bg": "#3A1B4A", "divider": "rgba(124, 77, 255, 0.5)", "check-border": "#A99CD6"}, "progetto": {"bg": "#18468C", "surface": "#1D4F9E", "surface-alt": "#2459A8", "border": "#8FB0E0", "text": "#EEF6FF", "muted": "#B4CDF0", "primary": "#FFD54A", "on-primary": "#18468C", "primary-text": "#FFD54A", "success": "#7FE3B0", "success-text": "#9BF0C4", "gold": "#FFD54A", "urgent-bg": "#2A5FB0", "divider": "rgba(238, 246, 255, 0.3)", "check-border": "#B4CDF0"}, "batuffolo": {"bg": "#F6F1E7", "surface": "#FFFDF8", "surface-alt": "#EFE6D6", "border": "#E2D3BC", "text": "#3B2F25", "muted": "#7A6957", "primary": "#B05E2A", "on-primary": "#FFFFFF", "primary-text": "#8F4A1E", "success": "#6F8F4E", "success-text": "#4F6B34", "gold": "#E9B23C", "urgent-bg": "#FBE3CC", "divider": "#EADFCD", "check-border": "#BBA78E"}, "giardino": {"bg": "#EEF0E6", "surface": "#FBFBF5", "surface-alt": "#E2E6D6", "border": "#CBD2B8", "text": "#262B1E", "muted": "#60664F", "primary": "#5F6E2E", "on-primary": "#FFFFFF", "primary-text": "#4E5B22", "success": "#3F8F7A", "success-text": "#2C6E5D", "gold": "#C9973A", "urgent-bg": "#F5E4C8", "divider": "#DDE2CF", "check-border": "#A3AA8E"}, "puntocroce": {"bg": "#F5EFE3", "surface": "#FFFCF5", "surface-alt": "#ECE3D2", "border": "#E3D6C2", "text": "#33272A", "muted": "#76656A", "primary": "#B23A48", "on-primary": "#FFFFFF", "primary-text": "#9A2F3D", "success": "#5E7A55", "success-text": "#46613F", "gold": "#D9A441", "urgent-bg": "#F6E2C6", "divider": "#E6DCCB", "check-border": "#B9A9A0"}};

  // id, nome, gruppo, stile icone, e ciò che il tema cambia oltre ai colori (come nell'app).
  var T = [
    ["default", "Predefinito", "c", "3d", "Il tema di partenza: notte calda con l'arancio come accento."],
    ["chiaro", "Blu", "c", "3d", "Pagina gelata, schede bianche e blu elettrico per i pulsanti."],
    ["scuro", "Scuro", "c", "3d", "Nero neutro, pensato per gli schermi OLED."],
    ["ocra", "Ocra", "c", "3d", "Giallo ocra su pergamena e bianco."],
    ["salvia", "Salvia", "c", "3d", "Verde salvia, calmo e naturale."],
    ["mirtillo", "Mirtillo", "c", "3d", "Notte indaco con un solo colore vivo: la lavanda."],
    ["cipria", "Cipria", "c", "3d", "Nuovo. Rosa cipria su bianco, morbido e luminoso."],
    ["prugna", "Prugna", "c", "3d", "Nuovo. Notte color prugna con accento rosa, per la sera."],
    ["fumetto", "Fumetto", "s", "fumetto", "Bordi neri spessi, colori pieni, titoli da copertina. Il pasto segnato fa «GNAM!»."],
    ["quaderno", "Quaderno", "s", "quaderno", "Sfondo a quadretti e titoli scritti a mano. Il pasto segnato prende «Bravo!»."],
    ["salagiochi", "Sala giochi", "s", "pixel", "Toni scuri, spigoli vivi e titoli pixel. Il pasto segnato dà «+1UP»."],
    ["neon", "Neon", "s", "neon", "Muro scuro, insegne magenta e azzurre che si accendono, scintille al posto dei coriandoli."],
    ["progetto", "Progetto", "s", "progetto", "Linee su carta blu da disegno tecnico. Il pasto segnato viene «APPROVATO»."],
    ["batuffolo", "Batuffolo", "s", "adesivo", "Nuovo. Un gatto come mascotte, zampette sullo sfondo e al posto delle spunte, un album di animali da collezionare con le medaglie."],
    ["giardino", "Giardino", "s", "acquerello", "Nuovo. Un erbario: foglie come spunte e coriandoli, e le medaglie sono piante che crescono settimana dopo settimana."],
    ["puntocroce", "Punto croce", "s", "puntocroce", "Nuovo. Tela di lino con cuciture rosse sulle schede, spunta a punto croce e coriandoli di filo."]
  ];

  // Dettagli dei temi speciali: font, forma delle schede, sfondo, spunta, coriandoli, festa, mascotte.
  var X = {
    fumetto: { font: "Lilita One", tc: "#1B1B1B", r: 10, bw: 3, bc: "#1B1B1B", br: 12, shadow: "3px 3px 0 #1B1B1B", conf: ["stella", "lampo"], col: ["#FF5A36", "#FFC83D", "#1FA97E", "#1B1B1B"], party: "GNAM!", win: "WOW!", mascot: "fumetto", mr: "50%" },
    quaderno: { font: "Caveat", tc: "#2B4C8C", r: 6, bw: 1.5, br: 6, bg: ["quadretti", 40], conf: [], col: ["#FFE46B", "#9CC3FF", "#FFB3B5", "#B9E4C9"], party: "Bravo!", win: "10 e lode", mascot: "quaderno", mr: "50%", big: 1.2 },
    salagiochi: { font: "Silkscreen", tc: "#FFD23F", r: 0, bw: 3, br: 0, conf: ["pixel"], col: ["#FFD23F", "#3EE6A5", "#FF4F9A", "#6EC3FF"], party: "+1UP", win: "LEVEL UP!", mascot: "salagiochi", mr: "0", small: 0.78 },
    neon: { font: "Righteous", tc: "#FF3DCB", r: 14, bw: 2, br: 14, glow: "0 0 12px rgba(124,77,255,.55)", bg: ["neon_griglia", 56], conf: ["scintilla"], col: ["#FF3DCB", "#38F5FF", "#FFD84A"], party: "OK!", win: "WOW!", mascot: "neon", mr: "50%" },
    progetto: { font: "Share Tech Mono", tc: "#EEF6FF", r: 2, bw: 1.5, br: 2, bg: ["progetto_griglia", 100], conf: ["triangolo", "cerchio"], col: ["#EEF6FF", "#FFD54A"], party: "APPROVATO", win: "COLLAUDATO", mascot: "progetto", mr: "4px" },
    batuffolo: { font: "Sniglet", tc: "#8F4A1E", r: 24, bw: 2.5, bc: "#E2D3BC", br: 26, bg: ["zampette", 84], tick: "zampa", conf: ["zampa"], col: ["#B05E2A", "#6F8F4E", "#E9B23C", "#8C5A3C"], partyMascot: true, mascot: "batuffolo", badge: "zzz", mr: "50%" },
    giardino: { font: "Young Serif", tc: "#3F4A1C", r: 20, bw: 1.5, bc: "#CBD2B8", br: 24, bg: ["foglie", 110], tick: "foglia", conf: ["foglia"], col: ["#5F6E2E", "#98A869", "#B5894A", "#7E8C54"], mascot: "giardino", mr: "50%" },
    puntocroce: { font: "Delius", tc: "#9A2F3D", r: 10, bw: 1.5, bc: "#E3D6C2", br: 8, bg: ["lino", 48], tick: "croce", seam: 1, conf: ["croce"], col: ["#B23A48", "#5E7A55", "#D9A441", "#2F5D9E"], mascot: "puntocroce", mr: "6px" }
  };
  var DEFAULT_COL = ["#E8873A", "#F2C94C", "#6FCF97", "#56CCF2", "#EB8FA0", "#BB6BD9"];

  var STYLES = [["tema", "Come il tema"], ["3d", "3D"], ["fumetto", "Fumetto"], ["quaderno", "Quaderno"], ["pixel", "Pixel"], ["neon", "Neon"], ["progetto", "Progetto"],
    ["adesivo", "Adesivo"], ["pastello", "Pastello"], ["acquerello", "Acquerello"], ["puntocroce", "Punto croce"], ["lucciola", "Lucciola"]];
  var NEW_STYLES = { adesivo: 1, pastello: 1, acquerello: 1, puntocroce: 1, lucciola: 1 };
  var FOODS = [["avocado", "Avocado", "2 pz"], ["salmon", "Salmone", "300 g"], ["strawberry", "Fragole", "250 g"], ["croissant", "Croissant integrale", "1 pz"]];
  var ICON_BG = { neon: "#140C28", progetto: "#18468C" };

  var theme = "default", styleChoice = "tema", ticked = {};
  var $ = function (id) { return document.getElementById(id); };
  var info = $("tinfo"), list = $("m-list");

  function themeDef(id) { return T.filter(function (t) { return t[0] === id; })[0]; }
  function iconStyle() { return styleChoice === "tema" ? themeDef(theme)[3] : styleChoice; }
  function icon(food) { return "img/icons/" + iconStyle() + "-" + food + ".webp"; }

  function swatch(id) { var p = PAL[id]; return "linear-gradient(135deg," + p.bg + " 50%," + p.primary + " 50%)"; }

  // ---------- selettori ----------
  function chip(parent, label, on, extra) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "chip" + (on ? " on" : "");
    b.setAttribute("role", "radio"); b.setAttribute("aria-checked", on ? "true" : "false");
    b.innerHTML = (extra && extra.sw ? '<i style="background:' + extra.sw + '"></i>' : "") + "<span></span>" + (extra && extra.isNew ? "<em>nuovo</em>" : "");
    b.children[extra && extra.sw ? 1 : 0].textContent = label;
    parent.appendChild(b);
    return b;
  }
  var themeChips = {};
  T.forEach(function (t) {
    var b = chip($(t[2] === "c" ? "chips-classic" : "chips-special"), t[1], t[0] === theme, { sw: swatch(t[0]), isNew: /^Nuovo/.test(t[4]) });
    b.addEventListener("click", function () { setTheme(t[0], true); });
    themeChips[t[0]] = b;
  });
  function markChips() {
    Object.keys(themeChips).forEach(function (k) { var on = k === theme; themeChips[k].classList.toggle("on", on); themeChips[k].setAttribute("aria-checked", on); });
  }

  // ---------- tema ----------
  function setTheme(id, confetti) {
    theme = id;
    var p = PAL[id], x = X[id] || {};
    Object.keys(p).forEach(function (k) { mock.style.setProperty("--" + k, p[k]); });
    var s = mock.style;
    s.setProperty("--font", x.font ? "'" + x.font + "', Nunito, sans-serif" : "Nunito, sans-serif");
    s.setProperty("--tc", x.tc || p.text);
    s.setProperty("--r", (x.r != null ? x.r : 16) + "px");
    s.setProperty("--bw", (x.bw || 1) + "px");
    s.setProperty("--bc", x.bc || p.border);
    s.setProperty("--br", (x.br != null ? x.br : 14) + "px");
    s.setProperty("--shadow", x.shadow || x.glow || "none");
    s.setProperty("--mr", x.mr || "50%");
    s.setProperty("--tsize", (x.big || x.small || 1) * 100 + "%");
    s.setProperty("--pat", x.bg ? "url(img/themes/" + x.bg[0] + ".png)" : "none");
    s.setProperty("--pat-size", x.bg ? (id === "batuffolo" || id === "giardino" || id === "puntocroce" || id === "quaderno" ? x.bg[1] : x.bg[1]) + "px" : "auto");
    s.setProperty("--tick", x.tick ? "url(img/themes/spunta_" + x.tick + ".png)" : "none");
    mock.dataset.theme = id;
    mock.classList.toggle("seam", !!x.seam);
    mock.classList.toggle("ticks-img", !!x.tick);
    mock.classList.toggle("light", isLight(p.bg));
    info.textContent = themeDef(id)[4];
    info.dataset.new = /^Nuovo/.test(themeDef(id)[4]) ? "1" : "";
    drawIcons(); drawMedals(); drawDone(); markChips();
    if (confetti && !still) burst(14);
  }
  function isLight(hex) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    return (r * 299 + g * 587 + b * 114) / 1000 > 140;
  }

  // ---------- lista ----------
  function drawList() {
    list.textContent = "";
    FOODS.forEach(function (f) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "m-row" + (ticked[f[0]] ? " done" : "");
      b.setAttribute("role", "checkbox"); b.setAttribute("aria-checked", ticked[f[0]] ? "true" : "false");
      b.dataset.food = f[0];
      b.innerHTML = '<span class="m-check"><i class="m-tick"></i></span><span class="m-ico"><img alt="" width="40" height="40"></span><span class="m-name"></span><span class="m-qty"></span>';
      b.children[2].textContent = f[1]; b.children[3].textContent = f[2];
      b.addEventListener("click", function () { toggle(f[0]); });
      list.appendChild(b);
    });
    drawIcons();
  }
  function drawIcons() {
    var st = iconStyle();
    Array.prototype.forEach.call(list.children, function (row) {
      var img = row.querySelector("img"), ico = row.querySelector(".m-ico");
      img.src = icon(row.dataset.food);
      ico.style.background = ICON_BG[st] || "";
    });
  }
  function toggle(food) {
    ticked[food] = !ticked[food];
    var n = FOODS.filter(function (f) { return ticked[f[0]]; }).length;
    drawListState(n);
    if (ticked[food] && !still) burst(5, rowPoint(food));
    if (n === FOODS.length) { drawDone(); party(true); burst(26); }
  }
  function drawListState(n) {
    Array.prototype.forEach.call(list.children, function (row) {
      var on = !!ticked[row.dataset.food];
      row.classList.toggle("done", on); row.setAttribute("aria-checked", on ? "true" : "false");
    });
    $("m-sub").textContent = n + " su " + FOODS.length + " nel carrello";
    drawDone();
  }
  function rowPoint(food) {
    var row = list.querySelector('[data-food="' + food + '"]'), m = mock.getBoundingClientRect(), r = row.getBoundingClientRect(), k = m.width / 390;
    return { x: (r.left - m.left) / k + 30, y: (r.top - m.top) / k + 28 };
  }
  function drawDone() {
    var all = FOODS.every(function (f) { return ticked[f[0]]; });
    $("m-done").hidden = !all;
    var x = X[theme] || {};
    if (x.mascot) $("m-mascot-img").src = "img/mascot/" + x.mascot + ".webp";
    $("m-mascot-img").hidden = !x.mascot;
    var bd = $("m-mascot-badge");
    bd.hidden = !x.badge; if (x.badge) bd.src = "img/mascot/" + x.badge + ".webp";
    $("m-done").classList.toggle("nomascot", !x.mascot);
  }

  // ---------- medaglie ----------
  var ALBUM = ["hamster", "dog_face", "owl", "fox", "bear", "rabbit_face"];
  var PIANTE = ["seedling", "herb", "potted_plant", "deciduous_tree", "tulip", "sunflower"];
  function drawMedals() {
    var m = $("m-medals"); m.textContent = ""; m.className = "m-medals " + (theme === "puntocroce" ? "ribbons" : "");
    for (var i = 0; i < 6; i++) {
      var d = document.createElement("span"), on = i < 4;
      d.className = "m-medal" + (on ? "" : " off");
      if (theme === "batuffolo") d.innerHTML = '<img alt="" src="img/mascot/album-' + ALBUM[i] + '.webp" width="40" height="40">';
      else if (theme === "giardino") d.innerHTML = '<img alt="" src="img/mascot/piante-' + PIANTE[on ? i : 0] + '.webp" width="40" height="40">';
      else d.innerHTML = "<b>" + (on ? "★" : "") + "</b>";
      m.appendChild(d);
    }
  }

  // ---------- festa e coriandoli ----------
  var fx = $("m-fx");
  function burst(n, at) {
    if (still) return;
    var x = X[theme] || {}, cols = x.col || DEFAULT_COL, shapes = x.conf || [];
    for (var i = 0; i < n; i++) {
      var c = document.createElement("i");
      c.className = "m-conf";
      var sx = at ? at.x + (Math.random() - .5) * 60 : Math.random() * 390;
      var sy = at ? at.y : -20 - Math.random() * 40;
      c.style.cssText = "left:" + sx + "px;top:" + sy + "px;background:" + cols[i % cols.length] +
        ";--dx:" + Math.round((Math.random() - .5) * (at ? 200 : 90)) + "px;--dy:" + Math.round(at ? 90 + Math.random() * 140 : 560 + Math.random() * 240) +
        "px;--rot:" + Math.round(Math.random() * 540 - 270) + "deg;animation-duration:" + (at ? 900 + Math.random() * 500 : 1500 + Math.random() * 1100) + "ms";
      if (shapes.length) {
        var u = "url(img/themes/confetti_" + shapes[i % shapes.length] + ".png)";
        c.style.webkitMaskImage = c.style.maskImage = u;
        c.classList.add("shape");
      }
      fx.appendChild(c);
      setTimeout(function (el) { el.remove(); }.bind(null, c), 2800);
    }
  }
  function party(win) {
    var x = X[theme] || {}, el = document.createElement("div");
    if (x.partyMascot) {
      el.className = "m-party mascot";
      el.innerHTML = '<img alt="" src="img/mascot/batuffolo.webp" width="120" height="120"><img alt="" class="pb" src="img/mascot/' + (win ? "sparkles" : "heart") + '.webp" width="48" height="48">';
    } else if (win ? x.win : x.party) {
      el.className = "m-party word"; el.textContent = win ? x.win : x.party;
    } else return;
    fx.appendChild(el);
    setTimeout(function () { el.remove(); }, 1500);
  }
  $("m-eat").addEventListener("click", function () { party(false); burst(22); });

  // ---------- adattamento alla larghezza ----------
  function fit() { box.style.setProperty("--k", (box.clientWidth / 390).toFixed(4)); }
  fit();
  if ("ResizeObserver" in window) new ResizeObserver(fit).observe(box); else window.addEventListener("resize", fit);

  drawList();
  setTheme("default", false);
})();
