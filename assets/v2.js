/* Orion Placement v2 design layer, loaded on every page AFTER assets/site.js (which builds the header, mega menu,
   footer and mounts, and keeps all their behaviour). Shared on every page: 3. scroll reveals.
   Home only (html[data-page=home]; each is a no-op elsewhere): 1, 2 and 2b re-present a few home mounts:
   1. Hero shortlist deck: the site.js shortlist (tabs + 1.8s swipe) is replaced by a calmer stacked deck
      built from data.js: one sample candidate per role (ids on the mount), no city shown. Each 7s the front card's text fades out, the card slips to
      the back and the next one rises from behind (850ms); a hairline under the deck shows the time left.
      Pauses on hover and keyboard focus. Under reduced motion it stays on the first card (no auto-advance).
   2. Reviews: long quotes are clamped with a "Read more" toggle (the full verbatim text stays in the page).
   3. Scroll reveals: section heads and blocks fade/translate up once (800ms ease), via IntersectionObserver.
   No dependency other than the DOM site.js renders; safe to omit (the page stays fully readable). */
(function () {
  "use strict";
  var doc = document, html = doc.documentElement, O = window.Orion;
  var HOME = html.getAttribute("data-page") === "home";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- 1. hero shortlist deck ---------- */
  /* One sample candidate per role (ids on the mount, all from data.js). No city is shown on the card. */
  var HOLD = 7000;           /* time a card stays in front (ms); set in CSS as the progress hairline duration */
  var FADE = 320;            /* outgoing text fades before the cards move (ms), so text never overlaps */
  function deck() {
    var mount = doc.querySelector('.hero3 [data-mount="shortlist"]');
    if (!mount || !O || !O.candidate) return;
    var ids = (mount.getAttribute("data-ids") || "").split(",").filter(Boolean);
    var list = ids.map(O.candidate).filter(Boolean);
    if (!list.length) return;
    var n = list.length, mk = O.m || esc;
    var check = O.ui && O.ui.icon ? O.ui.icon("check") : "";
    function fact(k, v, wide) { return "<div" + (wide ? ' class="wide"' : "") + "><dt>" + esc(k) + "</dt><dd>" + mk(v) + "</dd></div>"; }
    function card(c, i) {
      var role = O.role(c.role);
      var bar = c.bars && c.bars.length ? c.bars.join(", ") : "Not required";
      var mix = c.mix.slice(0, 2).map(function (x) { return x[0] + " " + x[1] + "%"; }).join(" · ");
      return '<article class="dk-card" data-pos="' + Math.min(i, 2) + '" aria-hidden="' + (i ? "true" : "false") + '" aria-roledescription="slide" aria-label="Candidate ' + (i + 1) + " of " + n + '">' +
        '<div class="dk-in">' +
        '<div class="dk-top"><span class="dk-id">' + esc(c.id) + '</span><span class="dk-ok">' + check + "Meets 5 of 5</span></div>" +
        '<span class="dk-role">' + esc(role ? role.name : "") + "</span>" +
        '<b class="dk-h">' + mk(c.headline) + "</b>" +
        '<div class="dk-mix"><div class="mixbar" aria-hidden="true">' + c.mix.map(function (x) { return '<i style="width:' + x[1] + '%"></i>'; }).join("") + '</div><span>' + mk(mix) + "</span></div>" +
        '<dl class="dk-facts">' + fact("Experience", c.years + " years") + fact("Bar", bar) + fact("Expects", O.fmt.range(c.pay) + " base") + fact("Notice", c.availability) +
        fact("Now at", c.firmType + ", " + c.firmSize, true) + "</dl></div></article>";
    }
    mount.innerHTML = '<div class="deck" role="region" aria-roledescription="carousel" aria-label="Example candidate shortlist">' +
      '<div class="deck-head"><span>Your shortlist</span><span class="deck-count" aria-hidden="true"><b>1</b> / ' + n + "</span></div>" +
      '<div class="deck-cards">' + list.map(card).join("") + "</div>" +
      '<div class="deck-progress" aria-hidden="true"><i></i></div></div>';

    var root = mount.firstChild, cards = [].slice.call(root.querySelectorAll(".dk-card")),
      bar = root.querySelector(".deck-progress i"),
      count = root.querySelector(".deck-count b");
    var front = 0, busy = false, hover = false, focus = false;
    function place() {
      cards.forEach(function (c, k) {
        var pos = (k - front + n) % n;
        c.setAttribute("data-pos", String(Math.min(pos, 2)));   /* everything past the third card waits at the back */
        c.style.zIndex = String(n - pos);
        c.setAttribute("aria-hidden", pos === 0 ? "false" : "true");
        c.classList.remove("leaving");
      });
      if (count) count.textContent = String(front + 1);
    }
    function restartBar() {
      if (reduce || !bar) return;
      bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = "";
    }
    function go(i) {
      i = (i + n) % n;
      if (i === front || busy) return;
      if (reduce) { front = i; place(); return; }
      busy = true;
      cards[front].classList.add("leaving");          /* phase 1: text out */
      setTimeout(function () { front = i; place(); restartBar(); setTimeout(function () { busy = false; }, 900); }, FADE);
    }
    function setPaused() { root.classList.toggle("paused", hover || focus); }
    if (!reduce && n > 1 && bar) {
      bar.addEventListener("animationend", function () { go(front + 1); });
      root.classList.add("auto");
    }
    root.addEventListener("mouseenter", function () { hover = true; setPaused(); });
    root.addEventListener("mouseleave", function () { hover = false; setPaused(); });
    root.addEventListener("focusin", function () { focus = true; setPaused(); });
    root.addEventListener("focusout", function (e) { if (!root.contains(e.relatedTarget)) { focus = false; setPaused(); } });
    place();
  }

  /* ---------- 2. reviews: clamp long verbatim quotes behind "Read more" ---------- */
  function reviewsMore() {
    var figs = [].slice.call(doc.querySelectorAll("#reviews .review"));
    if (!figs.length) return;
    figs.forEach(function (f, i) {
      var p = f.querySelector("blockquote p"); if (!p) return;
      p.id = p.id || "rv-q-" + i;
      p.classList.add("clamp");
      var b = doc.createElement("button");
      b.type = "button"; b.className = "rv-more"; b.hidden = true;
      b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-controls", p.id);
      b.textContent = "Read more";
      b.addEventListener("click", function () {
        var open = f.classList.toggle("open");
        b.setAttribute("aria-expanded", String(open));
        b.textContent = open ? "Show less" : "Read more";
      });
      f.querySelector("blockquote").appendChild(b);
    });
    function check() {
      figs.forEach(function (f) {
        var p = f.querySelector("blockquote p.clamp"), b = f.querySelector(".rv-more");
        if (!p || !b || f.classList.contains("open")) return;
        b.hidden = !(p.scrollHeight > p.clientHeight + 2);
      });
    }
    check();
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(check);
    var t; window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(check, 150); });
  }

  /* ---------- 3. reveal on scroll ---------- */
  var REVEAL = [
    ".hero3 .wrap > div",
    ".trust-strip .tb",
    ".sec-head-premium",
    ".process-card", ".tiles4 .tt", ".cards .cand", ".reviews .review", ".people .person-card",
    ".post-job-band", ".rcards > div", ".browse > div", ".cand-band", ".faq details",
    ".cta-band .cta-card-shell", ".sec-foot", ".who-trust-strip",
    /* inner pages (tools, forms and gates are never hidden) */
    ".phero > .wrap > *", ".sec-head", ".block .cards > .cand", ".block .cards > .job", ".levers > .lever", ".statband > div",
    ".steps-line > li", ".block .terms-box", ".neighbours > div", ".ways > li", ".block .table-wrap", ".block .sheet"
  ].join(",");
  function reveal() {
    if (reduce || !("IntersectionObserver" in window)) return;
    var els = [].slice.call(doc.querySelectorAll(REVEAL)).filter(function (el) {
      return !el.matches("form,.tool-form,.dropzone") && !el.querySelector("form,.tool-form,.dropzone,#gate");
    });
    if (!els.length) return;
    html.classList.add("v2-reveal");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) {
      /* stagger siblings in the same row by 90ms so a grid settles in gently */
      var sib = el.parentNode ? [].indexOf.call(el.parentNode.children, el) : 0;
      el.style.setProperty("--rv-delay", Math.min(sib, 4) * 90 + "ms");
      el.classList.add("rv");
      io.observe(el);
    });
    /* anything already on screen at load shows at once (no flash of hidden hero) */
    requestAnimationFrame(function () {
      els.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add("in"); });
    });
  }

  /* ---------- 2b. recruiter cards: keep the pull-quote to one sentence (Justin's second sentence is dropped) ---------- */
  function shortQuotes() {
    [].forEach.call(doc.querySelectorAll("#who-we-are .quote-body"), function (q) {
      var t = q.textContent, m = t.match(/^(\u201C?[^.]+\.)\s+\S/);
      if (m) q.textContent = m[1] + "\u201D";
    });
  }

  if (HOME) { deck(); reviewsMore(); shortQuotes(); }
  reveal();
})();
