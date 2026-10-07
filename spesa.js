// Il mio menù — prova interattiva di «Manda la spesa». Il messaggio è costruito come nell'app (ShoppingListText.cs):
// titoli in *grassetto*, una riga per alimento, solo ciò che non è ancora nel carrello, firma in _corsivo_.
(function () {
  var root = document.getElementById("sd");
  if (!root) return;

  var GIORNI = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
  var MESI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
  var EMOJI = { "Urgenti": "⏰", "Frutta e verdura": "🥦", "Pane e cereali": "🍞", "Dispensa": "🥫", "Extra": "✍️" };
  var ITEMS = [
    ["Urgenti", "Yogurt greco", "2 pz", false],
    ["Urgenti", "Petto di pollo", "300 g", false],
    ["Urgenti", "Insalata", "1 pz", false],
    ["Frutta e verdura", "Zucchine", "500 g", false],
    ["Frutta e verdura", "Mele", "4 pz", true],
    ["Pane e cereali", "Farro", "250 g", false],
    ["Dispensa", "Olio extravergine", "q.b.", false],
    ["Extra", "Carta da forno", "", false]
  ].map(function (r) { return { sec: r[0], name: r[1], qty: r[2], inCart: r[3] }; });

  var mode = "all";
  var list = root.querySelector(".sd-list");
  var bubble = root.querySelector(".sd-bubble");
  var toast = root.querySelector(".sd-toast");
  var choices = root.querySelectorAll(".sd-choice");
  var toastTimer;

  var now = new Date();
  var day = GIORNI[now.getDay()] + " " + now.getDate() + " " + MESI[now.getMonth()];

  function say(t) {
    toast.textContent = t;
    toast.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("on"); }, 2600);
  }

  function sections(onlyUrgent) {
    var out = [], idx = {};
    ITEMS.forEach(function (it) {
      if (it.inCart || (onlyUrgent && it.sec !== "Urgenti")) return;
      if (!(it.sec in idx)) { idx[it.sec] = out.length; out.push({ sec: it.sec, rows: [] }); }
      out[idx[it.sec]].rows.push(it);
    });
    return out;
  }

  function count(onlyUrgent) {
    return sections(onlyUrgent).reduce(function (n, p) { return n + p.rows.length; }, 0);
  }

  function build(onlyUrgent) {
    var parts = sections(onlyUrgent), n = count(onlyUrgent);
    if (!n) return "";
    var t = (onlyUrgent ? "🛒 *Spesa urgente*" : "🛒 *Lista della spesa*") + "\n";
    t += day + " · " + (n === 1 ? "1 cosa da prendere" : n + " cose da prendere") + "\n";
    parts.forEach(function (p) {
      t += "\n" + (EMOJI[p.sec] ? EMOJI[p.sec] + " " : "") + (p.sec === "Urgenti" ? "*URGENTI* · per oggi e domani" : "*" + p.sec + "*") + "\n";
      p.rows.forEach(function (r) { t += "• " + r.name + (r.qty ? " — " + r.qty : "") + "\n"; });
    });
    return t + "\n_Fatta con Il mio menù_";
  }

  function html(msg) {
    var safe = msg.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    safe = safe.replace(/\*([^*\n]+)\*/g, "<b>$1</b>");
    return safe.replace(/(^|\s)_([^_\n]+)_/gm, "$1<i>$2</i>");
  }

  function drawList() {
    list.textContent = "";
    var last = "";
    ITEMS.forEach(function (it) {
      if (it.sec !== last) {
        last = it.sec;
        var h = document.createElement("div");
        h.className = "sd-sec";
        h.textContent = it.sec;
        list.appendChild(h);
      }
      var b = document.createElement("button");
      b.type = "button";
      b.className = "sd-item" + (it.inCart ? " done" : "");
      b.setAttribute("role", "checkbox");
      b.setAttribute("aria-checked", it.inCart ? "true" : "false");
      b.innerHTML = '<span class="sd-box"></span><span class="sd-name"></span><span class="sd-qty"></span>';
      b.children[1].textContent = it.name;
      b.children[2].textContent = it.qty;
      b.addEventListener("click", function () { it.inCart = !it.inCart; refresh(); });
      list.appendChild(b);
    });
  }

  function refresh() {
    drawList();
    var u = count(true), a = count(false);
    if (mode === "urgent" && !u) mode = "all";
    choices[0].querySelector("small").textContent = u ? (u === 1 ? "1 cosa" : u + " cose") : "niente di urgente";
    choices[1].querySelector("small").textContent = a ? (a === 1 ? "1 cosa" : a + " cose") : "niente da prendere";
    choices[0].disabled = !u;
    choices.forEach(function (c) {
      var on = c.dataset.mode === mode;
      c.classList.toggle("on", on);
      c.setAttribute("aria-checked", on ? "true" : "false");
    });
    var msg = build(mode === "urgent");
    root.classList.remove("is-sent");
    bubble.classList.toggle("empty", !msg);
    bubble.innerHTML = msg ? html(msg) : "Hai già tutto nel carrello: non c'è niente da mandare.";
    root.querySelector(".sd-send").disabled = root.querySelector(".sd-copy").disabled = !msg;
  }

  choices.forEach(function (c) {
    c.addEventListener("click", function () { mode = c.dataset.mode; refresh(); });
  });

  root.querySelector(".sd-copy").addEventListener("click", function () {
    var msg = build(mode === "urgent");
    function ok() { say("Lista copiata"); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(msg).then(ok, ok);
    else {
      var ta = document.createElement("textarea");
      ta.value = msg; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      ta.remove(); ok();
    }
  });

  root.querySelector(".sd-send").addEventListener("click", function () {
    root.classList.add("is-sent");
    say("Nell'app si apre WhatsApp (o l'app che scegli). Qui è solo una prova.");
    setTimeout(function () { root.classList.remove("is-sent"); }, 2600);
  });

  refresh();
})();
