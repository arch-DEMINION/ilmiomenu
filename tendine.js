// Il mio menù — schede a scorrimento laterale con cassetto per le funzioni, tendine per le schede dei professionisti.
(function () {
  // ---------- tendine dei professionisti ----------
  document.querySelectorAll(".acc-card .acc-h").forEach(function (h) {
    h.addEventListener("click", function () {
      var open = h.getAttribute("aria-expanded") !== "true";
      h.setAttribute("aria-expanded", open ? "true" : "false");
      h.closest(".acc-card").classList.toggle("open", open);
    });
  });

  // ---------- striscia di schede ----------
  var strip = document.getElementById("fstrip");
  if (!strip) return;
  var prev = document.querySelector(".fn-prev"), next = document.querySelector(".fn-next");
  function step() { var c = strip.querySelector(".fcard"); return c ? c.getBoundingClientRect().width + 18 : 300; }
  function arrows() {
    prev.disabled = strip.scrollLeft < 8;
    next.disabled = strip.scrollLeft > strip.scrollWidth - strip.clientWidth - 8;
  }
  prev.addEventListener("click", function () { strip.scrollBy({ left: -step() * 2, behavior: "smooth" }); });
  next.addEventListener("click", function () { strip.scrollBy({ left: step() * 2, behavior: "smooth" }); });
  strip.addEventListener("scroll", arrows, { passive: true });
  window.addEventListener("resize", arrows);
  arrows();

  // Trascinamento con il mouse (sul touch ci pensa il browser).
  var down = false, sx = 0, sl = 0, moved = false;
  strip.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse") return;
    down = true; moved = false; sx = e.clientX; sl = strip.scrollLeft;
  });
  window.addEventListener("pointermove", function (e) {
    if (!down) return;
    var dx = e.clientX - sx;
    if (Math.abs(dx) > 6) { moved = true; strip.classList.add("drag"); }
    if (moved) strip.scrollLeft = sl - dx;
  });
  window.addEventListener("pointerup", function () { down = false; setTimeout(function () { strip.classList.remove("drag"); }, 0); });
  strip.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

  // Piccola spinta alla prima visita: la striscia si muove da sola per far capire che scorre.
  var hinted = false;
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    new IntersectionObserver(function (en, io) {
      if (en[0].isIntersecting && !hinted) {
        hinted = true; io.disconnect();
        strip.scrollTo({ left: 90, behavior: "smooth" });
        setTimeout(function () { if (strip.scrollLeft < 120) strip.scrollTo({ left: 0, behavior: "smooth" }); }, 700);
      }
    }, { threshold: 0.6 }).observe(strip);
  }

  // ---------- cassetto ----------
  var dr = document.getElementById("drawer"), panel = dr.querySelector(".dr-panel"), body = document.getElementById("dr-body");
  var btns = Array.prototype.slice.call(strip.querySelectorAll(".fc-btn")), cur = -1, opener = null;
  function fill(i) {
    var b = btns[i], t = b.parentNode.querySelector("template");
    cur = i;
    document.getElementById("dr-n").textContent = String(i + 1).padStart(2, "0");
    document.getElementById("dr-title").textContent = t.dataset.title;
    document.getElementById("dr-sum").textContent = t.dataset.sum;
    body.textContent = "";
    body.appendChild(t.content.cloneNode(true));
    body.scrollTop = 0;
    panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap");
    dr.querySelector(".dr-prev").disabled = i === 0;
    dr.querySelector(".dr-next").disabled = i === btns.length - 1;
  }
  function open(i) {
    opener = document.activeElement;
    fill(i);
    dr.hidden = false;
    document.documentElement.classList.add("noscroll");
    requestAnimationFrame(function () { requestAnimationFrame(function () { dr.classList.add("open"); panel.focus(); }); });
    history.replaceState(null, "", "#" + btns[i].parentNode.id);
  }
  function close() {
    if (dr.hidden) return;
    dr.classList.remove("open");
    document.documentElement.classList.remove("noscroll");
    setTimeout(function () { dr.hidden = true; body.textContent = ""; }, 380);
    if (opener && opener.focus) opener.focus();
    history.replaceState(null, "", location.pathname + location.search + "#funzioni");
  }
  btns.forEach(function (b, i) { b.addEventListener("click", function () { open(i); }); });
  dr.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) close(); });
  dr.querySelector(".dr-prev").addEventListener("click", function () { if (cur > 0) { fill(cur - 1); history.replaceState(null, "", "#" + btns[cur].parentNode.id); } });
  dr.querySelector(".dr-next").addEventListener("click", function () { if (cur < btns.length - 1) { fill(cur + 1); history.replaceState(null, "", "#" + btns[cur].parentNode.id); } });
  document.addEventListener("keydown", function (e) {
    if (dr.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft" && cur > 0) fill(cur - 1);
    else if (e.key === "ArrowRight" && cur < btns.length - 1) fill(cur + 1);
    else if (e.key === "Tab") { // il focus resta dentro il cassetto
      var f = panel.querySelectorAll("button:not([disabled]), a[href]");
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Un link come #manda o #f3 apre direttamente il cassetto giusto.
  function fromHash() {
    var id = location.hash.slice(1), el = id && document.getElementById(id);
    var i = btns.findIndex(function (b) { return b.parentNode === el; });
    if (i >= 0 && dr.hidden) { document.getElementById("funzioni").scrollIntoView(); open(i); }
  }
  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
