/* Orion Placement v2: shared behaviour. Needs assets/data.js loaded first.
   Public API: window.Orion (documented in ../COMPONENTS.md). No external libraries. */
(function () {
  "use strict";
  var D = window.ORION_DATA;
  var doc = document, html = doc.documentElement;
  var ROOT = html.getAttribute("data-root") || "";
  var O = (window.Orion = { data: D, root: ROOT });

  /* ---------- utilities ---------- */
  function $(sel, el) { return (el || doc).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || doc).querySelectorAll(sel)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function m(s) { return '<span class="mark">' + esc(s) + "</span>"; }
  O.$ = $; O.$$ = $$; O.esc = esc; O.m = m;
  /* O.plural(1, "candidate") -> "candidate"; O.plural(3, "candidate") -> "candidates"; third arg for irregular plurals */
  O.plural = function (n, one, many) { return +n === 1 ? one : (many || one + "s"); };
  /* O.count(3, "candidate") -> marked "3" + " candidates" */
  O.count = function (n, one, many) { return m(String(n)) + " " + O.plural(n, one, many); };

  O.fmt = {
    k: function (n) { return "$" + Math.round(n) + "k"; },
    range: function (r) { return "$" + r[0] + "k–$" + r[1] + "k"; },
    money: function (n) { return "$" + Math.round(n).toLocaleString("en-US"); },
    date: function (iso) { var d = new Date(iso + "T12:00:00"); return d.getDate() + " " + ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()] + " " + d.getFullYear(); },
    modes: function (a) { return a.length > 1 ? "On-site or hybrid" : (a[0] === "on-site" ? "On-site" : "Hybrid"); }
  };

  /* ---------- storage (sticky door, city, role, unlock, marks) ---------- */
  var mem = {};
  O.get = function (k) { try { var v = localStorage.getItem("orion." + k); return v == null ? mem[k] : JSON.parse(v); } catch (e) { return mem[k]; } };
  O.set = function (k, v) { mem[k] = v; try { localStorage.setItem("orion." + k, JSON.stringify(v)); } catch (e) {} };

  /* ---------- lookups ---------- */
  O.city = function (slug) { return D.cities.filter(function (c) { return c.slug === slug; })[0]; };
  O.role = function (slug) { return D.roles.filter(function (r) { return r.slug === slug; })[0]; };
  O.band = function (city, role) { return (D.bands[city] || {})[role]; };
  O.candidate = function (id) { return D.candidates.filter(function (c) { return c.id === id; })[0]; };
  O.person = function (id) { return D.people.filter(function (p) { return p.id === id; })[0]; };

  /* ---------- URL map: the 18 prototype pages and the patterns ---------- */
  O.pages = {
    home: "index.html", employers: "employers/index.html", findCandidates: "find-candidates/index.html",
    submitJob: "submit-job/index.html", candidateProfile: "candidate/ep-tx-0412/index.html", fees: "fees/index.html",
    cityHub: "locations/texas/houston/index.html", roleHub: "roles/estate-planning-attorney/index.html",
    leaf: "salaries/estate-planning-attorney/houston-tx/index.html", hiringKit: "hiring-kit/estate-planning-attorney/index.html",
    whereToPost: "where-to-post/houston-tx/index.html", whereToHire: "where-to-hire/houston-tx/index.html",
    candidates: "candidates/index.html", uploadResume: "upload-resume/index.html", salaryCheck: "salary-check/index.html",
    bestFirms: "best-law-firms/houston-tx/index.html", jobs: "jobs/estate-planning-attorney/houston-tx/index.html", about: "about/index.html"
  };
  var BUILT = {}; Object.keys(O.pages).forEach(function (k) { BUILT[O.pages[k]] = true; });
  O.href = function (path) { return ROOT + path; };
  function u(path, label) { return { path: path, built: !!BUILT[path], label: label }; }
  O.url = {
    page: function (key) { return u(O.pages[key]); },
    leaf: function (role, city) { var r = O.role(role), c = O.city(city); return u("salaries/" + role + "/" + city + "/index.html", r.name + " pay in " + c.name); },
    jobs: function (role, city) { var r = O.role(role), c = O.city(city); return u("jobs/" + role + "/" + city + "/index.html", r.name + " jobs in " + c.name); },
    cityHub: function (city) { var c = O.city(city); return u("locations/" + c.stateSlug + "/" + c.citySlug + "/index.html", "Legal recruiters in " + c.name); },
    roleHub: function (role) { return u("roles/" + role + "/index.html", O.role(role).name); },
    hiringKit: function (role) { return u("hiring-kit/" + role + "/index.html"); },
    whereToPost: function (city) { return u("where-to-post/" + city + "/index.html"); },
    whereToHire: function (city) { return u("where-to-hire/" + city + "/index.html"); },
    bestFirms: function (city) { return u("best-law-firms/" + city + "/index.html"); },
    candidate: function (id) { return u("candidate/" + id.toLowerCase() + "/index.html"); }
  };
  O.UNBUILT_MSG = "Prototype: only Houston × estate planning attorney is built.";
  /* O.link(urlObj, innerHtml, attrs): real link if built, otherwise a data-unbuilt link that shows the notice */
  O.link = function (x, inner, attrs, msg) {
    attrs = attrs || "";
    if (x.built) return '<a href="' + O.href(x.path) + '" ' + attrs + ">" + inner + "</a>";
    return '<a href="#" data-unbuilt="' + esc(msg || O.UNBUILT_MSG) + '" ' + attrs + ">" + inner + "</a>";
  };

  /* ---------- toast / prototype notice ---------- */
  var toastEl, toastT;
  O.toast = function (msg) {
    if (!toastEl) { toastEl = doc.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); toastEl.setAttribute("aria-live", "polite"); doc.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  };

  /* ---------- context: sticky city and role (kept in storage for prefills; no header chip since round 3) ---------- */
  O.ctx = function () {
    return { city: O.get("city") || html.getAttribute("data-city") || null, role: O.get("role") || html.getAttribute("data-role") || null };
  };
  O.setCtx = function (city, role) {
    if (city) O.set("city", city); if (role) O.set("role", role);
    doc.dispatchEvent(new CustomEvent("orion:ctx", { detail: O.ctx() }));
  };
  O.options = function (list, sel, labelKey) {
    return list.map(function (x) { return '<option value="' + x.slug + '"' + (x.slug === sel ? " selected" : "") + ">" + esc(x.name + (x.state && labelKey !== "plain" ? ", " + x.state : "")) + "</option>"; }).join("");
  };

  /* ---------- door switch: employer / candidate ---------- */
  O.door = function () { return O.get("door") || html.getAttribute("data-door-default") || "employer"; };
  O.setDoor = function (d) { O.set("door", d); applyDoor(); doc.dispatchEvent(new CustomEvent("orion:door", { detail: d })); };
  function applyDoor() {
    var d = O.door();
    doc.body.setAttribute("data-door-active", d);
    $$("[data-door-set]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-door-set") === d)); });
  }

  /* ---------- sample marks: OFF by default (body.clean); "Show sample marks" turns them on ---------- */
  O.marksOn = function () { return !!O.get("marks"); };
  function applyMarks() {
    var on = O.marksOn();
    doc.body.classList.toggle("clean", !on);
    $$("[data-marks-toggle]").forEach(function (b) { b.textContent = on ? "Hide sample marks" : "Show sample marks"; b.setAttribute("aria-pressed", String(on)); });
  }

  /* ---------- navigation map: the header carries everything the footer carries ---------- */
  var LOGO = '<img src="' + O.href('assets/images/orion-logo.png') + '" alt="Orion Placement" class="logo-img" width="48" height="48">';
  var CHEV = '<svg class="chev" viewBox="0 0 10 10" aria-hidden="true"><path d="M2.2 3.8h5.6a.6.6 0 0 1 .45 1.02l-2.8 3a.6.6 0 0 1-.9 0l-2.8-3A.6.6 0 0 1 2.2 3.8z" fill="currentColor"/></svg>';
  /* candidate-side pages show "Upload resume" as the header button */
  var CAND_PAGES = { candidates: 1, uploadResume: 1, salaryCheck: 1, bestFirms: 1, jobs: 1 };
  function withHash(x, h) { return { path: x.path + h, built: x.built }; }
  /* O.nav(): [{ id, label, items:[[urlObj, name, description]], cols:[[heading, items]], feature:[urlObj, name, desc], aside }] */
  O.nav = function () {
    var P = O.url.page;
    var kindWord = { attorney: "Attorney", paralegal: "Paralegal", staff: "Legal staff" };
    return [
      { id: "emp", label: "For employers", aside: "employer", items: [
        [P("findCandidates"), "Find candidates", "Describe the seat and see screened candidates now"],
        [P("submitJob"), "Submit a job", "Paste your posting; we check the pay and match"],
        [P("fees"), "Fees and guarantee", "One fee, only if you hire, with a calculator"],
        [P("hiringKit"), "Hiring kits", "Posting template, interview questions and a scorecard"],
        [P("whereToPost"), "Where to post a job", "Job boards compared on cost and time to applicants"],
        [P("whereToHire"), "Where to hire from", "Law schools, paralegal programmes and bar groups"],
        [P("employers"), "Employers overview", "How Orion works for small and mid-size firms"]] },
      { id: "cand", label: "For candidates", aside: "candidate", items: [
        [P("jobs"), "Open jobs", "Confidential roles with the pay on every listing"],
        [P("uploadResume"), "Upload your resume", "See matching roles in seconds, in private"],
        [P("salaryCheck"), "Check your salary", "Compare your base with your city and level"],
        [P("bestFirms"), "Best firms to work for", "Small and mid-size firms that publish their pay"],
        [P("candidates"), "Candidates overview", "Free for candidates and confidential from the first call"]] },
      { id: "sal", label: "Salary guides",
        feature: [P("leaf"), "Estate planning attorney pay in Houston", "Bands by years of practice, the median and the source"],
        cols: [
          ["By role", D.roles.map(function (r) { return [O.url.roleHub(r.slug), r.name, (kindWord[r.kind] || "Legal") + " base pay by years, city by city"]; })],
          ["By city", D.cities.map(function (c) { return [withHash(O.url.cityHub(c.slug), "#pay"), c.name + ", " + c.state, "What " + c.name + " firms pay, role by role"]; })]] }
    ];
  };
  function navItem(it, cls) {
    return "<li>" + O.link(it[0], "<b>" + esc(it[1]) + "</b><span>" + esc(it[2]) + "</span>", 'class="' + (cls || "mi") + '"', "Prototype: only Houston × estate planning attorney is built.") + "</li>";
  }
  function megaAside(kind) {
    if (kind === "employer") {
      return '<aside class="mega-aside">' +
        '<div class="mega-aside-talk">' +
          '<span class="eyebrow">Talk it through</span>' +
          '<p>Fifteen minutes with Justin: the seat, the pay, who is available now.</p>' +
          ui.calLink("Book 15 minutes with Justin", "link-arrow") +
        '</div>' +
        '<div class="mega-aside-ctas">' +
          '<a class="btn btn-primary btn-sm btn-block mega-btn-primary" href="' + O.href(O.pages.findCandidates) + '"><span>Find candidates</span><svg class="btn-arrow" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg></a>' +
          '<a class="btn btn-outline btn-sm btn-block mega-btn-outline" href="' + O.href(O.pages.submitJob) + '"><span>Submit a job</span><svg class="btn-arrow" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg></a>' +
        '</div>' +
        '<div class="mega-aside-rating">' +
          ui.rating({ size: "sm", dark: true }) +
        '</div>' +
      '</aside>';
    }
    if (kind === "candidate") {
      return '<aside class="mega-aside">' +
        '<div class="mega-aside-talk">' +
          '<span class="eyebrow">For candidates</span>' +
          '<p>Free for candidates. No firm sees your name until you say yes to a role.</p>' +
        '</div>' +
        '<div class="mega-aside-ctas">' +
          '<a class="btn btn-primary btn-sm btn-block mega-btn-primary" href="' + O.href(O.pages.uploadResume) + '"><span>Upload resume</span><svg class="btn-arrow" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg></a>' +
        '</div>' +
        '<div class="mega-aside-rating">' +
          ui.rating({ size: "sm", dark: true }) +
        '</div>' +
      '</aside>';
    }
    if (kind === "about") return '<aside class="mega-aside"><span class="eyebrow">Since ' + esc(D.trust.since) + "</span><p>" + esc(D.orionLine) + '</p><div class="mega-aside-rating">' + ui.rating({ size: "sm", dark: true }) + "</div></aside>";
    return "";
  }
  function megaBody(g) {
    var h = "";
    if (g.feature) h += '<div class="mega-feature">' + O.link(g.feature[0], '<span class="eyebrow">Featured guide</span><b>' + esc(g.feature[1]) + "</b><span>" + esc(g.feature[2]) + "</span>", 'class="mi mi-feature"') + "</div>";
    if (g.cols) h += g.cols.map(function (c) { return '<div class="mega-col"><h3>' + esc(c[0]) + '</h3><ul class="mega-list compact">' + c[1].map(function (it) { return navItem(it); }).join("") + "</ul></div>"; }).join("");
    if (g.items) h += '<ul class="mega-list' + (g.items.length > 7 ? " cols-2" : "") + '">' + g.items.map(function (it) { return navItem(it); }).join("") + "</ul>";
    return h;
  }
  function headerCta() {
    var page = html.getAttribute("data-page") || "", cand = CAND_PAGES[page] || html.getAttribute("data-header-cta") === "candidate";
    return cand ? { label: "Upload resume", href: O.href(O.pages.uploadResume) } : { label: "Find candidates", href: O.href(O.pages.findCandidates) };
  }
  function buildHeader() {
    var mount = $("#site-header"); if (!mount) return;
    var ribbon = "";
    if (html.getAttribute("data-header") === "minimal") {
      var p = O.person("justin");
      mount.outerHTML = ribbon + '<header class="site-header header-minimal"><div class="wrap"><a class="logo" href="' + O.href(O.pages.home) + '" aria-label="Orion Placement">' + LOGO + "</a>" +
        '<span class="from">Sent by ' + esc(p.name) + ' at Orion<br><a href="' + O.href(O.pages.about) + '#email-check">Is this email from Orion?</a></span></div></header>';
      return;
    }
    var page = html.getAttribute("data-page") || "", groups = O.nav(), cta = headerCta();
    var current = { employers: "emp", findCandidates: "emp", submitJob: "emp", fees: "emp", hiringKit: "emp", whereToPost: "emp", whereToHire: "emp",
      candidates: "cand", uploadResume: "cand", salaryCheck: "cand", bestFirms: "cand", jobs: "cand", leaf: "sal", roleHub: "sal", cityHub: "city", about: "about" }[page];
    var desk = '<nav class="nav" aria-label="Main"><ul class="nav-list">' + groups.map(function (g) {
      return '<li class="nav-item" data-group="' + g.id + '"><button type="button" class="nav-top"' + (current === g.id ? ' data-current="true"' : "") + ' aria-expanded="false" aria-controls="np-' + g.id + '">' + esc(g.label) + CHEV + "</button>" +
        '<div class="mega" id="np-' + g.id + '" hidden><div class="wrap mega-in' + (g.aside ? " has-aside" : "") + (g.cols ? " is-cols" : "") + '"><div class="mega-main">' + megaBody(g) + "</div>" + megaAside(g.aside) + "</div></div></li>";
    }).join("") + "</ul></nav>";
    var phone = '<div class="mnav" id="mnav" role="dialog" aria-modal="true" aria-label="Menu" hidden><div class="mnav-top"><a class="logo" href="' + O.href(O.pages.home) + '" aria-label="Orion Placement">' + LOGO + '</a><button type="button" class="mnav-close" aria-label="Close menu">Close</button></div>' +
      '<div class="mnav-body">' + groups.map(function (g) {
        var items = g.items || [];
        if (g.cols) items = [g.feature].concat(g.cols[0][1]).concat(g.cols[1][1]);
        return '<div class="acc"><button type="button" class="acc-btn" aria-expanded="false" aria-controls="ma-' + g.id + '">' + esc(g.label) + CHEV + '</button><div class="acc-panel" id="ma-' + g.id + '" hidden>' +
          (g.cols ? '<ul class="mega-list compact">' + navItem(g.feature) + '</ul><h3>' + esc(g.cols[0][0]) + '</h3><ul class="mega-list compact">' + g.cols[0][1].map(function (it) { return navItem(it); }).join("") + "</ul><h3>" + esc(g.cols[1][0]) + '</h3><ul class="mega-list compact">' + g.cols[1][1].map(function (it) { return navItem(it); }).join("") + "</ul>"
            : '<ul class="mega-list">' + items.map(function (it) { return navItem(it); }).join("") + "</ul>") + "</div></div>";
      }).join("") + "</div>" +
      '<div class="mnav-foot"><a class="btn btn-primary btn-block" href="' + cta.href + '">' + esc(cta.label) + "</a>" + ui.trustLine(CAND_PAGES[page] ? "candidate" : "employer") + "</div></div>";
    mount.outerHTML = ribbon + '<header class="site-header"><div class="wrap">' +
      '<a class="logo" href="' + O.href(O.pages.home) + '" aria-label="Orion Placement">' + LOGO + "</a>" + desk +
      '<a class="btn btn-primary btn-sm header-cta" href="' + cta.href + '">' + esc(cta.label) + "</a>" +
      '<button type="button" class="menu-btn" aria-expanded="false" aria-controls="mnav">Menu</button>' +
      "</div></header>" + phone;
  }

  /* desktop dropdowns: hover (fine pointers) and click open; Escape, outside click and focus leaving close */
  function navBehaviour() {
    var items = $$(".nav-item"); if (!items.length) return;
    var hoverOK = window.matchMedia && matchMedia("(hover:hover) and (pointer:fine)").matches, timers = {};
    function setOpen(li, on) {
      var b = $(".nav-top", li), p = $(".mega", li);
      b.setAttribute("aria-expanded", String(on)); p.hidden = !on; li.classList.toggle("open", on);
    }
    function closeAll(except) { items.forEach(function (li) { if (li !== except) setOpen(li, false); }); }
    O.closeNav = function () { closeAll(); };
    items.forEach(function (li) {
      var b = $(".nav-top", li), id = li.getAttribute("data-group");
      b.addEventListener("click", function () { var on = b.getAttribute("aria-expanded") !== "true"; closeAll(li); setOpen(li, on); li._clicked = on; });
      b.addEventListener("keydown", function (e) { if (e.key === "ArrowDown") { e.preventDefault(); closeAll(li); setOpen(li, true); var f = $(".mega a", li); if (f) f.focus(); } });
      if (hoverOK) {
        li.addEventListener("mouseenter", function () { clearTimeout(timers[id]); timers[id] = setTimeout(function () { closeAll(li); setOpen(li, true); }, 90); });
        li.addEventListener("mouseleave", function () { clearTimeout(timers[id]); if (li._clicked) return; timers[id] = setTimeout(function () { setOpen(li, false); }, 160); });
      }
      li.addEventListener("focusout", function (e) { if (!li.contains(e.relatedTarget)) { setOpen(li, false); li._clicked = false; } });
    });
    doc.addEventListener("click", function (e) { if (!e.target.closest(".nav-item")) { closeAll(); items.forEach(function (li) { li._clicked = false; }); } });
    doc.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var open = items.filter(function (li) { return li.classList.contains("open"); })[0];
      if (open) { setOpen(open, false); open._clicked = false; $(".nav-top", open).focus(); }
    });

    /* scroll shrink on site-header */
    var header = $(".site-header");
    if (header) {
      function onScroll() {
        if (window.scrollY > 20) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }
  /* phone menu: full screen, five accordions, button pinned at the bottom */
  function phoneMenu() {
    var mb = $(".menu-btn"), mn = $("#mnav"); if (!mb || !mn) return;
    function open(on) {
      mn.hidden = !on; mb.setAttribute("aria-expanded", String(on)); doc.documentElement.classList.toggle("mnav-open", on);
      if (on) { var f = $(".acc-btn", mn); if (f) f.focus(); } else mb.focus();
    }
    mb.addEventListener("click", function () { open(mn.hidden); });
    $(".mnav-close", mn).addEventListener("click", function () { open(false); });
    $$(".acc-btn", mn).forEach(function (b) {
      b.addEventListener("click", function () {
        var on = b.getAttribute("aria-expanded") !== "true";
        $$(".acc-btn", mn).forEach(function (o) { if (o !== b) { o.setAttribute("aria-expanded", "false"); doc.getElementById(o.getAttribute("aria-controls")).hidden = true; } });
        b.setAttribute("aria-expanded", String(on)); doc.getElementById(b.getAttribute("aria-controls")).hidden = !on;
      });
    });
    mn.addEventListener("click", function (e) { var a = e.target.closest("a[href]"); if (a && !a.hasAttribute("data-unbuilt") && a.getAttribute("href").indexOf("#") > -1 && a.pathname === location.pathname) open(false); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && !mn.hidden) open(false); });
    if (window.matchMedia) { var mq = matchMedia("(min-width:1081px)"), f = function () { if (mq.matches && !mn.hidden) open(false); }; if (mq.addEventListener) mq.addEventListener("change", f); }
  }

  function buildFooter() {
    var mount = $("#site-footer"); if (!mount) return;
    var doms = D.sendingDomains.map(m).join(" and ");
    var marksBtn = '<button type="button" data-marks-toggle>Show sample marks</button>';
    if (html.getAttribute("data-header") === "minimal") {
      mount.outerHTML = '<footer class="site-footer footer-minimal"><div class="wrap"><p>Orion emails come only from ' + doms + '. If a message uses another domain, forward it to us before you reply.</p>' +
        '<p class="fm-links"><a href="' + O.href(O.pages.about) + '#email-check">Is this email from Orion?</a><a href="' + O.href(O.pages.about) + '">About Orion</a><a href="' + O.href(O.pages.home) + '">orionplacement.com</a></p><p class="small">Prototype. ' + marksBtn + "</p></div></footer>";
      return;
    }
    function li(x, label, msg) { return "<li>" + O.link(x, esc(label), "", msg) + "</li>"; }
    function pg(k, label) { return li(O.url.page(k), label); }
    var cities = D.cities.map(function (c) { return li(O.url.cityHub(c.slug), c.name); }).join("");
    var roles = D.roles.map(function (r) { return li(O.url.roleHub(r.slug), r.name); }).join("");
    var ab = O.href(O.pages.about);
    mount.outerHTML = '<footer class="site-footer"><div class="wrap"><div class="f-top"><a class="logo" href="' + O.href(O.pages.home) + '" aria-label="Orion Placement">' + LOGO + '</a><p>' + esc(D.orionLine) + "</p>" + ui.rating({ size: "sm", dark: true }) + "</div><div class=\"cols\">" +
      '<div><h2>For employers</h2><ul>' + pg("findCandidates", "Find candidates") + pg("submitJob", "Submit a job") + pg("fees", "Fees and guarantee") + pg("hiringKit", "Hiring kits") + pg("whereToPost", "Where to post a job") + pg("whereToHire", "Where to hire from") + pg("employers", "Employers overview") + "</ul></div>" +
      '<div><h2>For candidates</h2><ul>' + pg("jobs", "Open jobs") + pg("uploadResume", "Upload your resume") + pg("salaryCheck", "Check your salary") + pg("bestFirms", "Best firms to work for") + pg("candidates", "Candidates overview") + "</ul></div>" +
      '<div><details class="fgroup" open><summary><h2>Salary guides</h2></summary><ul>' + pg("leaf", "Estate planning attorney, Houston") + roles + "</ul></details></div>" +
      '<div><details class="fgroup" open><summary><h2>Cities</h2></summary><ul>' + cities + "</ul></details></div>" +
      '<div><h2>About</h2><ul>' + pg("about", "About Orion") + '<li><a href="' + ab + '#reviews">Reviews</a></li><li><a href="' + ab + '#email-check">Is this email from Orion?</a></li><li><a href="' + ab + '#contact">Contact</a></li><li>' + ui.calLink("Book 15 minutes with Justin") + "</li></ul></div>" +
      '</div><div class="base"><p>Orion emails come only from ' + doms + ". If a message uses another domain, forward it to us before you reply.</p>" +
      "<p>Prototype: sample values await Orion's figures. " + marksBtn + "</p></div></div></footer>";
  }

  /* ---------- matching ---------- */
  /* brief: { role, city, years: "any"|"b1"|"b2"|"b3", mode: "any"|"on-site"|"hybrid", pay: number (max base, $k) | null, must: [tags] }
     returns [{ c, checks:[{k,ok}], met, total, inCity }], best first. Hard filters: role, and same state or willing to relocate. */
  O.match = function (brief) {
    var city = O.city(brief.city);
    var eb = D.expBands.filter(function (b) { return b.key === brief.years; })[0];
    return D.candidates.filter(function (c) { return !brief.role || c.role === brief.role; }).map(function (c) {
      var cc = O.city(c.city), checks = [];
      var inCity = !city || c.city === city.slug || c.relocate.indexOf(city.slug) > -1;
      var inState = !city || cc.state === city.state;
      if (city) checks.push({ k: inCity ? "In " + city.name : "Elsewhere in " + city.stateName, ok: inCity });
      if (eb) checks.push({ k: eb.label, ok: c.years >= eb.min && c.years <= eb.max });
      if (brief.mode && brief.mode !== "any") checks.push({ k: brief.mode === "on-site" ? "On-site" : "Hybrid", ok: c.modes.indexOf(brief.mode) > -1 });
      if (brief.pay) checks.push({ k: "Within " + O.fmt.k(brief.pay), ok: c.pay[0] <= brief.pay });
      (brief.must || []).forEach(function (t) { checks.push({ k: t, ok: c.tags.indexOf(t) > -1 }); });
      var met = checks.filter(function (x) { return x.ok; }).length;
      return { c: c, checks: checks, met: met, total: checks.length, inCity: inCity, inState: inState };
    }).filter(function (r) { return r.inCity || r.inState; }).sort(function (a, b) {
      return (b.met / (b.total || 1)) - (a.met / (a.total || 1)) || (b.inCity - a.inCity) || (b.met - a.met);
    });
  };
  /* candidates whose expected pay overlaps a salary (k) */
  O.inBand = function (role, city, pay) {
    return O.match({ role: role, city: city }).filter(function (r) { return r.c.pay[0] <= pay * 1.05 && r.c.pay[1] >= pay * 0.92; });
  };

  /* ---------- band position (plain English) ---------- */
  /* Bars show the middle half of base salaries (25th to 75th percentile). */
  O.position = function (city, role, expKey, val) {
    var b = O.band(city, role), r = b[expKey], eb = D.expBands.filter(function (x) { return x.key === expKey; })[0];
    var pct, where;
    if (val < r[0]) { where = "below"; pct = Math.max(5, Math.round(25 * val / r[0] - (r[0] - val) / 2)); }
    else if (val > r[1]) { where = "above"; pct = Math.min(95, Math.round(75 + (val - r[1]) / 2)); }
    else { where = "in"; pct = Math.round(25 + 50 * (val - r[0]) / (r[1] - r[0])); }
    var txt;
    if (where === "below") txt = "below the usual range for " + eb.label + " (" + O.fmt.range(r) + "). Expect fewer strong candidates to engage.";
    else if (where === "above") txt = "above the usual range for " + eb.label + " (" + O.fmt.range(r) + "). You can expect the strongest candidates to take the call.";
    else txt = "inside the usual range for " + eb.label + " (" + O.fmt.range(r) + "), higher than about " + pct + " in 100 offers at this level.";
    var mine;
    if (where === "below") mine = "Your base is below the usual range for " + eb.label + " (" + O.fmt.range(r) + "). Roles paying more are open now.";
    else if (where === "above") mine = "Your base is above the usual range for " + eb.label + " (" + O.fmt.range(r) + "). Roles at this level are rare; we can tell you when one opens.";
    else mine = "Your base is inside the usual range for " + eb.label + " (" + O.fmt.range(r) + "), higher than about " + pct + " in 100 people at this level. Roles paying more are open now.";
    return { where: where, pct: pct, range: r, median: b.median, text: txt, mine: mine };
  };

  /* ---------- components (each returns HTML or renders into an element) ---------- */
  var ui = (O.ui = {});

  ui.mix = function (mix) {
    return '<div class="mixbar" aria-hidden="true">' + mix.map(function (x) { return '<i style="width:' + x[1] + '%"></i>'; }).join("") + "</div>" +
      '<div class="mixlegend">' + mix.map(function (x) { return "<span>" + m(x[0] + " " + x[1] + "%") + "</span>"; }).join("") + "</div>";
  };

  /* Candidate card. Compact by default (headline, four facts, practice-mix bar, one-line reason, one button "Request profile").
     opts: { result (from O.match), locked, actions: false, long: true (full card: six facts and the legend; candidate profile page only) } */
  ui.candidateCard = function (c, opts) {
    opts = opts || {};
    var r = opts.result, role = O.role(c.role);
    var prof = O.url.candidate(c.id);
    var idHtml = prof.built ? '<a class="id" href="' + O.href(prof.path) + '">' + esc(c.id) + "</a>" : '<span class="id">' + esc(c.id) + "</span>";
    var top = '<div class="cand-top">' + idHtml + '<span class="avail">' + esc(c.availability) + "</span></div>";
    if (opts.locked) {
      return '<article class="cand locked" data-id="' + c.id + '">' + top + "<h3>" + m(c.headline) + '</h3><p class="small muted">' + m(c.years + " years") + " · " + esc(role.name) + '</p><div class="redact" aria-hidden="true"><i></i><i></i><i></i></div>' +
        '<p class="lock-note">Experience, pay and practice mix come with the full profiles.</p></article>';
    }
    var score = r && r.total ? '<p class="score">Meets ' + r.met + " of " + r.total + " " + O.plural(r.total, "must-have") + '</p><ul class="checks">' + r.checks.map(function (x) { return '<li class="' + (x.ok ? "" : "no") + '">' + esc(x.k) + "</li>"; }).join("") + "</ul>" : "";
    var bars = c.bars.length ? c.bars.join(", ") : "Not required";
    var act = opts.actions === false ? "" : '<div class="actions"><button type="button" class="btn btn-line btn-sm btn-block" data-profile="' + c.id + '"><span>Request profile</span><svg class="btn-arrow" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg></button></div>';
    if (opts.long) {
      return '<article class="cand cand-long" data-id="' + c.id + '">' + top + "<h3>" + m(c.headline) + "</h3>" + score +
        facts([["Experience", c.years + " years"], ["Bar", bars], ["Now at", c.firmType + ", " + c.firmSize], ["Based", c.area], ["Works", O.fmt.modes(c.modes)], ["Expects", O.fmt.range(c.pay) + " base"]]) +
        "<div>" + ui.mix(c.mix) + '</div><p class="why">' + m(c.why) + "</p>" + act + "</article>";
    }
    var mixTxt = c.mix.slice(0, 2).map(function (x) { return x[0] + " " + x[1] + "%"; }).join(" · ");
    return '<article class="cand" data-id="' + c.id + '">' + top + "<h3>" + m(c.headline) + "</h3>" + score +
      facts([["Experience", c.years + " years"], ["Bar", bars], ["Based", c.area.replace(/^[^,]+, /, "")], ["Expects", O.fmt.range(c.pay)]]) +
      '<div class="mix-mini"><div class="mixbar" aria-hidden="true">' + c.mix.map(function (x) { return '<i style="width:' + x[1] + '%"></i>'; }).join("") + '</div><span class="mixline">' + m(mixTxt) + "</span></div>" +
      '<p class="why">' + m(c.why) + "</p>" + act + "</article>";
  };

  /* dl.facts with each dt/dd pair in a div (two-column grid on phones); values are sample data, so marked */
  function facts(pairs) { return '<dl class="facts">' + pairs.map(function (p) { return "<div><dt>" + esc(p[0]) + "</dt><dd>" + m(p[1]) + "</dd></div>"; }).join("") + "</dl>"; }
  ui.facts = facts;

  /* A row of candidate cards. On phones only the first two show, plus a "See all n" link. opts: { total, role, city, result: [match results] } */
  ui.candidateRow = function (list, opts) {
    opts = opts || {};
    var html = '<div class="cards' + (list.length > 2 ? " teaser" : "") + '">' + list.map(function (x) { return x.c ? ui.candidateCard(x.c, { result: x }) : ui.candidateCard(x); }).join("") + "</div>";
    var total = Math.max(opts.total || list.length, list.length);
    if (list.length > 2) {
      var h = O.href(O.pages.findCandidates) + "#" + (opts.role ? "role=" + opts.role + "&amp;" : "") + "city=" + (opts.city || "houston-tx");
      html += '<p class="only-sm see-all"><a class="link-arrow" href="' + h + '">See all ' + O.count(total, "candidate") + "</a></p>";
    }
    return html;
  };

  ui.jobCard = function (j) {
    return '<article class="job" data-id="' + j.id + '"><div class="job-top"><span>Confidential employer</span><span>Posted ' + m(O.fmt.date(j.posted)) + "</span></div>" +
      "<h3>" + m(j.title) + '</h3><div class="pay">' + m(O.fmt.range(j.band)) + ' <span class="small muted">base</span></div>' +
      facts([["Firm", j.firmType + ", " + j.firmSize], ["Practice", j.mix], ["Where", j.area + ", " + O.city(j.city).name], ["Works", j.mode === "on-site" ? "On-site" : "Hybrid"], ["Experience", j.years]]) +
      '<div class="actions">' + O.link(O.url.page("uploadResume"), "Apply confidentially", 'class="btn btn-primary btn-sm"') + O.link(O.url.page("uploadResume"), "Am I a fit?", 'class="btn btn-ghost btn-sm"') + "</div></article>";
  };

  /* Band bar. opts: { city, role, highlight: "b1"|"b2"|"b3", marker: number|null }. Returns { setMarker(n|null), setHighlight(key) } */
  ui.bandBar = function (el, opts) {
    var b = O.band(opts.city, opts.role); if (!b) { el.innerHTML = ""; return null; }
    var lo = Math.floor((b.b1[0] * 0.88) / 10) * 10, hi = Math.ceil((b.b3[1] * 1.05) / 10) * 10;
    var span = hi - lo; function x(v) { return Math.max(0, Math.min(100, ((v - lo) / span) * 100)); }
    var gl = [0, 25, 50, 75, 100].map(function (p) { return '<i class="gl" style="left:' + p + '%"></i>'; }).join("");
    var rows = D.expBands.map(function (e) {
      var r = b[e.key];
      return '<div class="band-row" data-key="' + e.key + '"><span class="lab">' + e.label.replace(" years", '<span class="lab-long"> years</span><span class="lab-short"> yrs</span>') + '</span><div class="track">' + gl + '<span class="range" style="left:' + x(r[0]) + "%;width:" + (x(r[1]) - x(r[0])) + '%"></span></div><span class="val">' + m(O.fmt.range(r)) + "</span></div>";
    }).join("");
    var ticks = [0, 25, 50, 75, 100].map(function (p) { return '<span class="t' + p + '" style="left:' + p + '%">' + O.fmt.k(lo + (span * p) / 100) + "</span>"; }).join("");
    var c = O.city(opts.city), role = O.role(opts.role);
    el.classList.add("band-wrap");
    el.innerHTML = '<div class="band" role="img" aria-label="' + esc(role.name + " base salary in " + c.name + " by experience: " + D.expBands.map(function (e) { return e.label + " " + O.fmt.range(b[e.key]); }).join("; ") + "; median " + O.fmt.k(b.median)) + '">' +
      rows + '<div class="band-axis"><span></span><div class="ticks">' + ticks + "</div><span></span></div>" +
      '<div class="lane"><span class="med" style="left:' + x(b.median) + '%"></span><span class="you hidden"><b></b></span></div></div>' +
      '<div class="band-key"><span class="k-range">Middle half of base salaries (25th to 75th percentile)</span><span class="k-med">Median ' + m(O.fmt.k(b.median)) + '</span><span class="k-you">Your number</span></div>';
    var you = $(".you", el);
    var ctl = {
      setMarker: function (v) {
        if (v == null || isNaN(v)) { you.classList.add("hidden"); return; }
        var p = x(v); you.classList.remove("hidden"); you.style.left = p + "%";
        you.classList.toggle("edge-l", p < 12); you.classList.toggle("edge-r", p > 88);
        $("b", you).textContent = O.fmt.k(v);
      },
      setHighlight: function (k) { $$(".band-row", el).forEach(function (r) { r.classList.toggle("active", r.getAttribute("data-key") === k); }); }
    };
    if (opts.highlight) ctl.setHighlight(opts.highlight);
    if (opts.marker != null) ctl.setMarker(opts.marker);
    return ctl;
  };

  ui.termsBox = function (title) {
    var t = D.terms;
    return '<div class="terms-box"><h3>' + esc(title || "What it costs, and when") + "</h3><dl>" +
      "<dt>Fee</dt><dd>" + m(t.fee) + ", only if you hire someone we introduced</dd>" +
      "<dt>Guarantee</dt><dd>" + m(t.guarantee) + ": if the hire leaves within " + m(t.guaranteeDays + " days") + " of starting, we replace them at no charge</dd>" +
      "<dt>When you pay</dt><dd>" + m(t.payment) + "</dd>" +
      "<dt>Upfront</dt><dd>Nothing. No retainer.</dd>" +
      "<dt>Exclusivity</dt><dd>" + m(t.exclusivity) + "</dd></dl>" +
      '<p class="foot">' + O.link(O.url.page("fees"), "Full terms and a fee calculator", 'class="link-arrow"') + "</p></div>";
  };
  ui.termsStrip = function () {
    var t = D.terms;
    return '<div class="terms-strip"><div><b>' + m("20%") + "</b>of first-year base, only if you hire</div><div><b>" + m(t.guaranteeDays + " days") + "</b>replacement guarantee</div><div><b>" + m("On the start date") + "</b>invoice, " + m("due in 30 days") + "</div><div><b>Nothing upfront</b>no retainer, no exclusivity</div></div>";
  };

  /* Confirmation timeline steps. preset: "profiles" | "profile" | "kit" | "guide". vars: { ids, role, city } -> [[when, text, done]] */
  ui.confirmSteps = function (preset, v) {
    v = v || {};
    var role = O.role(v.role || "estate-planning-attorney"), city = O.city(v.city || "houston-tx"), t = D.terms;
    var ids = (v.ids || []).length ? v.ids.join(", ") : "the candidates you picked";
    if (preset === "profile") return [
      ["Now", "Your request is with Justin. Nothing is shared with the candidate's current firm.", true],
      ["Within one business hour", "The full redacted resume for " + ids + ", references on request, and our one-page terms."],
      ["Within one business day", "Justin calls or emails to book an interview at a time that suits you."],
      ["Before the interview", "A one-page agreement to sign online: " + t.fee + ", " + t.guarantee + ", " + t.payment + "."]
    ];
    if (preset === "kit") return [
      ["Now", "The hiring kit is on its way to your inbox.", true],
      ["Each month", "New " + role.short + " candidates in " + city.name + ". Unsubscribe in one click."]
    ];
    if (preset === "guide") return [
      ["Now", "The " + city.name + " legal salary guide (PDF) is on its way to your inbox.", true],
      ["Each quarter", "The updated guide when the bands change. Unsubscribe in one click."]
    ];
    return [
      ["Now", "Your request is with Justin. Nothing is shared with the candidates' current firms.", true],
      ["Within one business hour", "Full redacted profiles for " + ids + " and our one-page terms."],
      ["Within one business day", "Justin confirms the seat with you and books first interviews. You sign the agreement only when you want to meet someone."],
      ["Each month", "New " + role.short + " candidates in " + city.name + ". Unsubscribe in one click."]
    ];
  };
  function stepsHtml(steps) {
    return '<ol class="timeline">' + steps.map(function (s, i) { return '<li class="' + (s[2] ? "done" : "") + '"><span class="when">' + (i === 0 ? esc(s[0]) : m(s[0])) + "</span><p>" + esc(s[1]) + "</p></li>"; }).join("") + "</ol>";
  }
  /* Confirmation block (static use or after a gate). preset as above, or vars.steps to pass your own. */
  ui.confirmation = function (preset, v) {
    v = v || {};
    return '<div class="confirm" role="status" tabindex="-1"><span class="eyebrow">' + esc(v.eyebrow || "Request received") + "</span><h3>Sent to " + esc(v.email || "your inbox") + "</h3>" +
      stepsHtml(v.steps || ui.confirmSteps(preset, v)) + "</div>";
  };

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  /* One-field gate. Email first, a button that says what they get; firm and phone are asked on the confirmation step, optional.
     opts: { title, intro, bullets: [..], button, preset, steps: [[when,text,done]], ids: [], role, city,
             audience: "employer" (work email, default) | "candidate" (personal email), fine, review: "employer"|"candidate"|review id,
             eyebrow, compact: true (no bullets/review), onDone(info) } */
  ui.gate = function (el, opts) {
    opts = opts || {};
    var cand = opts.audience === "candidate", id = "g" + Math.random().toString(36).slice(2, 7);
    var lab = cand ? "Personal email" : "Work email", ph = cand ? "you@gmail.com" : "you@yourfirm.com";
    var fine = opts.fine || (cand ? "Use a personal email, not your work one. We never contact your current firm, and no employer sees your name until you say yes."
      : "No agreement and no fee to see profiles. We never tell a candidate's firm, and candidates do not see your details without your yes.");
    var rv = opts.review ? ui.review(typeof opts.review === "string" && (opts.review === "employer" || opts.review === "candidate") ? pickReview(opts.review) : O.reviewById(opts.review), { compact: true }) : "";
    el.innerHTML = '<form class="gate" novalidate>' + (opts.eyebrow ? '<span class="eyebrow">' + esc(opts.eyebrow) + "</span>" : "") + "<h3>" + esc(opts.title || "Get the full profiles") + "</h3>" +
      (opts.intro ? '<p class="small">' + esc(opts.intro) + "</p>" : "") +
      (opts.bullets && !opts.compact ? '<ul class="ticks">' + opts.bullets.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>" : "") +
      '<div class="gate-row"><div class="field"><label for="' + id + 'e">' + lab + '</label><input id="' + id + 'e" type="email" name="email" autocomplete="email" inputmode="email" required placeholder="' + ph + '" aria-describedby="' + id + 'ee"><span class="err-msg" id="' + id + 'ee" aria-live="polite"></span></div>' +
      '<button class="btn btn-primary" type="submit">' + esc(opts.button || "Send me the full profiles") + "</button></div>" +
      '<p class="fine">' + esc(fine) + "</p>" + (rv && !opts.compact ? '<div class="gate-review">' + rv + "</div>" : "") + "</form>";
    el._gate = opts;
    var f = $("form", el), inp = f.email, err = $("#" + id + "ee", el);
    function check(showEmpty) {
      var v = inp.value.trim(), msg = "";
      if (!v) msg = showEmpty ? (cand ? "Enter your personal email so we can send your matches." : "Enter your work email so we know where to send them.") : "";
      else if (v.indexOf("@") < 0) msg = "That email is missing the @ sign.";
      else if (!EMAIL_RE.test(v)) msg = "That email looks incomplete. Check it reads like " + ph + ".";
      err.textContent = msg; inp.closest(".field").classList.toggle("err", !!msg); inp.setAttribute("aria-invalid", String(!!msg));
      return !msg && !!v;
    }
    inp.addEventListener("blur", function () { if (inp.value.trim()) check(false); });
    inp.addEventListener("input", function () { if (inp.closest(".field").classList.contains("err")) check(false); });
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!check(true)) { inp.focus(); return; }
      var info = { email: inp.value.trim(), at: Date.now(), audience: cand ? "candidate" : "employer" };
      if (!cand) O.set("unlocked", info); else O.set("candidateEmail", info);
      var steps = opts.steps || ui.confirmSteps(opts.preset || "profiles", { ids: opts.ids, role: opts.role, city: opts.city });
      el.innerHTML = ui.confirmation(null, { email: info.email, steps: steps, eyebrow: opts.doneEyebrow }) ;
      var cf = $(".confirm", el);
      cf.insertAdjacentHTML("beforeend", moreForm(id, cand));
      wireMore(el, id, cand, info);
      cf.focus({ preventScroll: true }); cf.scrollIntoView({ block: "nearest" });
      if (opts.onDone) opts.onDone(info);
    });
    return f;
  };
  function moreForm(id, cand) {
    return '<form class="gate-more" novalidate><p><b>' + (cand ? "Add a phone number for a faster reply" : "Add your firm and a phone number for a faster reply") + '</b> <span class="muted">(optional)</span></p>' +
      '<div class="row">' + (cand ? "" : '<div class="field"><label for="' + id + 'f">Firm name</label><input id="' + id + 'f" name="firm" type="text" autocomplete="organization"></div>') +
      '<div class="field"><label for="' + id + 'p">Phone</label><input id="' + id + 'p" name="phone" type="tel" autocomplete="tel" inputmode="tel"><span class="err-msg" id="' + id + 'pe" aria-live="polite"></span></div></div>' +
      '<button class="btn btn-ghost btn-sm" type="submit">Add details</button></form>';
  }
  function wireMore(el, id, cand, info) {
    var f = $(".gate-more", el); if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var ph = f.phone.value.trim(), firm = f.firm ? f.firm.value.trim() : "", pe = $("#" + id + "pe", el);
      var digits = ph.replace(/\D/g, "");
      if (ph && digits.length < 10) { pe.textContent = "That phone number looks short. Include the area code."; f.phone.closest(".field").classList.add("err"); f.phone.focus(); return; }
      if (!ph && !firm) { f.outerHTML = '<p class="gate-thanks">No problem. Everything comes by email.</p>'; return; }
      info.firm = firm; info.phone = ph; O.set(cand ? "candidateEmail" : "unlocked", info);
      f.outerHTML = '<p class="gate-thanks">Thanks. ' + (ph ? "Justin may call " + esc(ph) + " to save you an email." : "Justin will reply with " + esc(firm) + " in the subject line.") + "</p>";
    });
  }
  O.unlocked = function () { return O.get("unlocked"); };

  /* A line at the top of a gate saying what this request brings, and the candidate added to the gate's ids. kind: "profile" | "intro" */
  ui.gateNote = function (g, id, kind) {
    if (!g) return;
    var old = $(".gate-note", g); if (old) old.remove();
    if (g._gate) { g._gate.ids = g._gate.ids || []; if (g._gate.ids.indexOf(id) < 0) g._gate.ids.unshift(id); }
    var u = O.unlocked(), done = !$("form.gate", g);
    var txt = kind === "profile"
      ? (done ? "Full profile for " + m(id) + " is on its way to " + esc(u ? u.email : "your inbox") + "." : "Full profile for " + m(id) + " comes by email. Add your work email below.")
      : (done ? "Intro request for " + m(id) + " is with Justin. He replies to " + esc(u ? u.email : "you") + " within " + m("one business day") + "." : "Intro to " + m(id) + ": Justin asks the candidate and replies by email. Add your work email below.");
    var p = doc.createElement("p"); p.className = "gate-note"; p.setAttribute("role", "status"); p.innerHTML = txt;
    var host = $("form.gate", g) || $(".confirm", g) || g, h = $("h3", host);
    if (h && h.parentNode === host) h.insertAdjacentElement("afterend", p); else host.insertBefore(p, host.firstChild);
  };
  /* "Request profile" (and the older "Request intro"): to this page's gate when one is on the page and shown;
     otherwise to the candidate's profile page when it exists; otherwise to find-candidates with the candidate preselected */
  O.request = function (id, kind) {
    var g = $("#gate");
    if (g && g.offsetParent !== null && g.innerHTML.trim()) {
      O.lastRequest = { id: id, kind: kind };
      doc.dispatchEvent(new CustomEvent("orion:request", { detail: id }));
      ui.gateNote(g, id, kind);
      g.scrollIntoView({ behavior: "smooth", block: "start" });
      var inp = $("input", g); if (inp) setTimeout(function () { inp.focus({ preventScroll: true }); }, 450);
      return;
    }
    var prof = O.url.candidate(id);
    if (prof.built && kind === "profile") location.href = O.href(prof.path) + "#request";
    else location.href = O.href(O.pages.findCandidates) + "#ids=" + id + "&want=" + kind;
  };

  ui.cityPayTable = function (city) {
    var c = O.city(city), bands = D.bands[city] || {};
    var rows = D.roles.filter(function (r) { return bands[r.slug]; }).map(function (r) {
      var b = bands[r.slug], n = O.match({ role: r.slug, city: city }).filter(function (x) { return x.inCity; }).length;
      var range = "$" + b.b1[0] + "k–$" + b.b3[1] + "k";
      return "<tr" + (r.built ? ' class="here"' : "") + '><td data-label="Role">' + O.link(O.url.leaf(r.slug, city), esc(r.name)) + '</td><td class="r" data-label="Base range">' + m(range) +
        '</td><td class="r sm-keep" data-label="Median" data-sm="median">' + m(O.fmt.k(b.median)) + '</td><td class="r" data-label="Typical experience">' + m(b.typical) + '</td><td class="r" data-label="Candidates now">' + m(String(n)) + "</td>" +
        '<td class="sm-cell">' + m(range) + " base · " + m(b.typical) + " · " + O.count(n, "candidate") + "</td></tr>";
    }).join("");
    return '<div class="table-wrap"><table class="data stack-sm rows-sm"><caption class="sr">Base salary by role in ' + esc(c.name) + '</caption><thead><tr><th scope="col">Role</th><th scope="col" class="r">Base range</th><th scope="col" class="r">Median</th><th scope="col" class="r">Typical experience</th><th scope="col" class="r">Candidates now</th></tr></thead><tbody>' + rows + "</tbody></table></div>";
  };
  ui.rolePayTable = function (role, here) {
    var rows = D.cities.filter(function (c) { return O.band(c.slug, role); }).map(function (c) {
      var b = O.band(c.slug, role);
      return "<tr" + (c.slug === here ? ' class="here"' : "") + '><td data-label="City">' + O.link(O.url.leaf(role, c.slug), esc(c.name + ", " + c.state)) + "</td>" +
        D.expBands.map(function (e) { return '<td class="r" data-label="' + e.label + '">' + m(O.fmt.range(b[e.key])) + "</td>"; }).join("") + '<td class="r" data-label="Median">' + m(O.fmt.k(b.median)) + "</td></tr>";
    }).join("");
    return '<div class="table-wrap"><table class="data stack-sm"><caption class="sr">' + esc(O.role(role).name) + ' base salary by city</caption><thead><tr><th scope="col">City</th>' + D.expBands.map(function (e) { return '<th scope="col" class="r">' + e.label + "</th>"; }).join("") + '<th scope="col" class="r">Median</th></tr></thead><tbody>' + rows + "</tbody></table></div>";
  };
  ui.neighbours = function (role, city) {
    var c = O.city(city), r = O.role(role), bands = D.bands[city] || {};
    var left = D.roles.filter(function (x) { return x.slug !== role && bands[x.slug]; }).map(function (x) { return "<li>" + O.link(O.url.leaf(x.slug, city), "<span>" + esc(x.name) + '</span><span class="v">median ' + m(O.fmt.k(bands[x.slug].median)) + "</span>") + "</li>"; }).join("");
    var right = D.cities.filter(function (x) { return x.slug !== city && O.band(x.slug, role); }).map(function (x) { return "<li>" + O.link(O.url.leaf(role, x.slug), "<span>" + esc(x.name + ", " + x.state) + '</span><span class="v">median ' + m(O.fmt.k(O.band(x.slug, role).median)) + "</span>") + "</li>"; }).join("");
    return '<div class="neighbours"><div><h3>Other roles in ' + esc(c.name) + '</h3><ul class="nlist">' + left + "</ul></div><div><h3>" + esc(r.name) + ' pay in other cities</h3><ul class="nlist">' + right + "</ul></div></div>";
  };
  /* Sender block. withDomains adds the sending domains; opts.full adds the Google rating and the Calendly link (cold-email page). */
  ui.sender = function (pid, withDomains, opts) {
    opts = opts || {}; var p = O.person(pid || "justin");
    var portraitContent = p.photo ? '<img src="' + O.href(p.photo) + '" alt="' + esc(p.name) + '" class="portrait-img">' : SIL;
    return '<div class="sender"><div class="portrait sm">' + portraitContent + '</div><div class="who"><b>' + esc(p.name) + "</b>, " + esc(p.title) + " at Orion Placement<p>" + esc(p.note) + "</p>" +
      '<p>Direct line: ' + m(p.phone) + " · " + m(p.email) + "</p>" + (withDomains ? '<p class="keep">Orion emails come only from ' + D.sendingDomains.map(m).join(" and ") + ".</p>" : "") +
      (opts.full ? '<div class="sender-trust">' + ui.rating({ size: "sm" }) + (p.id === "justin" ? ui.calLink("Book 15 minutes with Justin", "link-arrow") : "") + "</div>" : "") + "</div></div>";
  };

  /* ====================== Round 3: trust system and visual modules ====================== */
  /* Line icons: 24px grid, 1.5px stroke, currentColor. ui.icon(name, extraClass) */
  var ICONS = {
    brief: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3h6v3H9zM8.5 11h7M8.5 15h5"/>',
    list: '<rect x="4" y="4" width="16" height="5" rx="1.5"/><rect x="4" y="11" width="16" height="5" rx="1.5"/><path d="M4 20h10"/>',
    calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    percent: '<path d="M6 18L18 6"/><circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>',
    shield: '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    wallet: '<rect x="3.5" y="6" width="17" height="13" rx="2"/><path d="M3.5 10h17M16 14.5h1.5"/>',
    invoice: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
    chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-5M12 16V8M16 16v-3"/>',
    doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
    pin: '<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>',
    post: '<path d="M4 10v4h3l7 4V6L7 10z"/><path d="M17 9.5a3.5 3.5 0 0 1 0 5"/>',
    school: '<path d="M3 9l9-4 9 4-9 4z"/><path d="M7 11v4c0 1.5 2.5 3 5 3s5-1.5 5-3v-4"/>',
    lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
    user: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c1-4 4-6 7-6s6 2 7 6"/>',
    upload: '<path d="M12 16V5M7.5 9.5L12 5l4.5 4.5"/><path d="M5 15v4h14v-4"/>',
    scale: '<path d="M12 4v16M7 20h10M5 8h14"/><path d="M5 8l-2.5 6a3 3 0 0 0 5 0zM19 8l-2.5 6a3 3 0 0 0 5 0z"/>'
  };
  ui.icon = function (name, cls) { return '<svg class="ico' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || ICONS.check) + "</svg>"; };

  var STAR = '<path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z"/>';
  ui.stars = function () { var s = ""; for (var i = 0; i < 5; i++) s += '<svg viewBox="0 0 20 20" aria-hidden="true">' + STAR + "</svg>"; return '<span class="stars" role="img" aria-label="5 out of 5 stars">' + s + "</span>"; };
  /* simple "G" mark drawn here (not Google's logo file) */
  ui.gmark = function () { return '<svg class="gmark" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#fff" stroke="#ddd6c8"/><path d="M17.4 10.6H12v2.9h3c-.4 1.5-1.6 2.4-3 2.4a3.9 3.9 0 1 1 2.6-6.8l2.1-2.1A6.9 6.9 0 1 0 18.9 12c0-.5-.1-1-.2-1.4z" fill="#3c6fd1"/></svg>'; };
  /* Google rating badge. opts: { size: "sm"|"lg", link: true (opens the Google listing), dark: true } */
  ui.rating = function (opts) {
    opts = opts || {}; var T = D.trust;
    var inner = ui.gmark() + "<b>" + esc(T.rating) + "</b>" + ui.stars() + '<span class="rc">' + esc(T.reviews) + " Google reviews</span>";
    var cls = "rating" + (opts.size ? " rating-" + opts.size : "") + (opts.dark ? " on-dark" : "");
    return opts.link ? '<a class="' + cls + '" href="' + T.google + '" target="_blank" rel="noopener">' + inner + '<span class="sr"> (opens Google)</span></a>' : '<span class="' + cls + '">' + inner + "</span>";
  };
  /* Trust line: sits directly under every primary button. kind: "employer" (default) | "candidate" */
  ui.trustLine = function (kind) {
    var tail = kind === "candidate" ? "free for candidates, always confidential" : "no fee unless you hire";
    return '<p class="trust-line">' + ui.stars() + "<span><b>" + esc(D.trust.rating) + " on Google</b> · " + tail + "</span></p>";
  };
  /* Trust bar: four large numbers. kind: "employer" (rating, placements, client firms, since) | "candidate" */
  ui.trustBar = function (kind) {
    var T = D.trust;
    function fmtNum(n) {
      var s = String(n);
      if (s.slice(-1) === "+") {
        return s.slice(0, -1) + '<span class="tb-plus">+</span>';
      }
      return s;
    }
    var cells = kind === "candidate" ? [
      [esc(T.rating), '<div class="tb-stars">' + ui.stars() + '</div><span class="tb-sub">on Google, ' + esc(T.reviews) + " reviews</span>"],
      [esc(T.jonNamed) + '<small class="tb-of"> of ' + esc(T.reviews) + "</small>", '<span class="tb-sub">reviews name Jon, who screens every candidate</span>'],
      ["$0", '<span class="tb-sub">cost to candidates, always</span>'],
      [esc(T.since), '<span class="tb-sub">recruiting since, from ' + esc(T.place.split(",")[0]) + "</span>"]
    ] : [
      [esc(T.rating), '<div class="tb-stars">' + ui.stars() + '</div><span class="tb-sub">on Google, ' + esc(T.reviews) + " reviews</span>"],
      [fmtNum(T.placements), '<span class="tb-sub">attorneys and paralegals placed</span>'],
      [fmtNum(T.clientFirms), '<span class="tb-sub">law firms we have hired for</span>'],
      [esc(T.since), '<span class="tb-sub">recruiting since, from ' + esc(T.place.split(",")[0]) + "</span>"]
    ];
    return '<div class="trustbar">' + cells.map(function (c, idx) {
      return '<div class="tb tb-' + idx + '"><div class="tb-inner"><b class="tb-n">' + c[0] + '</b><div class="tb-l">' + c[1] + '</div></div></div>';
    }).join("") + "</div>";
  };

  /* Reviews: only D.reviews (verbatim). Fragments carry a "[full text to pull]" mark. */
  O.reviewById = function (id) { return D.reviews.filter(function (r) { return r.id === id; })[0]; };
  function pickReview(kind, skip) { return D.reviews.filter(function (r) { return r.kind === kind && (!skip || skip.indexOf(r.id) < 0); })[0]; }
  O.pickReview = pickReview;
  /* Review card. opts: { compact } */
  ui.review = function (r, opts) {
    if (!r) return ""; opts = opts || {};
    var q = (r.lead ? esc(r.lead) + " " : "") + "“" + esc(r.quote) + "”" + (r.fragment ? ' <span class="mark pull">[full text to pull]</span>' : "");
    return '<figure class="review review-' + r.kind + (opts.compact ? " compact" : "") + '" data-review="' + r.id + '"><div class="review-top">' + ui.stars() + '<span class="src">' + ui.gmark() + "Google review</span></div>" +
      "<blockquote><p>" + q + "</p></blockquote><figcaption><b>" + esc(r.name) + '</b><span class="tag">' + (r.kind === "employer" ? "Law firm client" : "Candidate") + "</span></figcaption></figure>";
  };
  /* kind: "employer" | "candidate" | "mixed" (two employer + one candidate). Employer reviews lead on employer pages. */
  ui.reviews = function (kind, limit) {
    var list = kind === "mixed" ? D.reviews.filter(function (r) { return r.kind === "employer"; }).slice(0, 2).concat(D.reviews.filter(function (r) { return r.kind === "candidate"; }).slice(0, 1))
      : D.reviews.filter(function (r) { return r.kind === kind; });
    return '<div class="reviews">' + list.slice(0, limit || 3).map(function (r) { return ui.review(r); }).join("") + "</div>";
  };

  /* People: portrait placeholder (neutral silhouette), name, role line (marked), what they do */
  var SIL = '<svg viewBox="0 0 80 96" aria-hidden="true"><circle cx="40" cy="36" r="15"/><path d="M12 96c2-20 13-32 28-32s26 12 28 32z"/></svg>';
  ui.calLink = function (label, cls) { return '<a class="' + (cls || "cal-link") + '" href="' + D.trust.calendly + '" target="_blank" rel="noopener">' + esc(label || "Book 15 minutes with Justin") + "</a>"; };
  ui.person = function (pid, opts) {
    opts = opts || {}; var p = O.person(pid), T = D.trust;
    var isJustin = pid === "justin";
    var portraitContent = p.photo ? '<img src="' + O.href(p.photo) + '" alt="' + esc(p.name) + '" class="portrait-img">' : SIL;

    var roleBadge = isJustin
      ? '<span class="person-badge badge-strategy"><span class="badge-dot"></span>SEARCH BRIEFING &amp; STRATEGY</span>'
      : '<span class="person-badge badge-screening"><span class="badge-dot"></span>NATIONAL SCREENING &amp; VETTING</span>';

    var quote = isJustin
      ? "Direct founder accountability on every legal mandate. We scope your practice needs once and deliver only screened, top-tier counsel."
      : "Every attorney and paralegal is rigorously pre-screened for bar standing, real matter experience, compensation expectations, and firm fit.";

    var actionSection = isJustin
      ? '<div class="person-cta-wrap">' +
          '<a class="person-cal-btn" href="' + esc(p.calendly || T.calendly) + '" target="_blank" rel="noopener">' +
            '<svg class="cal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' +
            '<span>Book 15 minutes with Justin</span>' +
            '<span class="arr-icon">→</span>' +
          '</a>' +
        '</div>'
      : '<div class="person-cta-wrap">' +
          '<div class="person-review-pill">' +
            ui.stars() +
            '<span class="review-text">Named in <b>' + esc(T.jonNamed) + ' of our ' + esc(T.reviews) + '</b> Google reviews</span>' +
          '</div>' +
        '</div>';

    var contactSection =
      '<div class="person-contacts">' +
        '<a href="tel:' + esc(p.phone.replace(/[^0-9+]/g, "")) + '" class="contact-pill" title="Call directly">' +
          '<svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
          '<span>' + esc(p.phone) + '</span>' +
        '</a>' +
        '<a href="mailto:' + esc(p.email) + '" class="contact-pill" title="Email directly">' +
          '<svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' +
          '<span>' + esc(p.email) + '</span>' +
        '</a>' +
      '</div>';

    return '<article class="person person-card person-' + pid + (opts.row ? " row" : "") + '">' +
      '<div class="person-top-bar">' +
        '<div class="person-avatar-wrap">' +
          '<div class="portrait-ring">' + portraitContent + '</div>' +
          '<span class="verified-badge" title="Verified Founding Partner">' +
            '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>' +
          '</span>' +
        '</div>' +
        '<div class="person-identity">' +
          roleBadge +
          '<h3 class="person-name">' + esc(p.name) + '</h3>' +
          '<p class="person-title">' + esc(p.title) + ' <span class="co-name">· Orion Placement</span></p>' +
        '</div>' +
      '</div>' +
      '<div class="person-body">' +
        '<p class="person-desc">' + esc(p.does || p.note) + '</p>' +
        '<div class="person-quote-box">' +
          '<svg class="quote-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>' +
          '<p class="quote-body">&ldquo;' + quote + '&rdquo;</p>' +
        '</div>' +
        '<div class="person-footer">' +
          contactSection +
          actionSection +
        '</div>' +
      '</div>' +
    '</article>';
  };
  ui.people = function () { return '<div class="people">' + ui.person("justin") + ui.person("jon") + "</div>"; };

  /* Three-step process with mini interface illustrations. kind: "employer" | "candidate" */
  var MOCK = {
    brief: '<div class="mock" aria-hidden="true"><div class="mk-h">Your seat</div><div class="mk-f"><i>Role</i><span>Estate planning attorney</span></div><div class="mk-f"><i>City</i><span>Houston, TX</span></div><div class="mk-chips"><span class="on">Texas bar</span><span class="on">Probate</span><span>Spanish</span></div></div>',
    list: '<div class="mock" aria-hidden="true"><div class="mk-h">Shortlist <em>3 matches</em></div><div class="mk-row"><b>Candidate A</b><i style="width:92%"></i><span>5 of 5</span></div><div class="mk-row"><b>Candidate B</b><i style="width:78%"></i><span>4 of 5</span></div><div class="mk-row"><b>Candidate C</b><i style="width:70%"></i><span>4 of 5</span></div></div>',
    cal: '<div class="mock" aria-hidden="true"><div class="mk-h">Interviews</div><div class="mk-days"><span>Mon</span><span>Tue</span><span class="on">Wed<b>10:00</b></span><span>Thu</span><span>Fri</span></div><div class="mk-ok">' + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>' + "Start date agreed</div></div>",
    upload: '<div class="mock" aria-hidden="true"><div class="mk-h">Your resume</div><div class="mk-drop"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 16V5M7.5 9.5L12 5l4.5 4.5"/><path d="M5 15v4h14v-4"/></svg><span>resume.pdf</span></div><div class="mk-chips"><span class="on">Texas bar</span><span class="on">5 years</span></div></div>',
    jobs: '<div class="mock" aria-hidden="true"><div class="mk-h">Roles for you <em>pay shown</em></div><div class="mk-row"><b>Associate</b><i style="width:80%"></i><span>$120k+</span></div><div class="mk-row"><b>Attorney</b><i style="width:90%"></i><span>$140k+</span></div><div class="mk-row"><b>Senior</b><i style="width:96%"></i><span>$165k+</span></div></div>',
    yes: '<div class="mock" aria-hidden="true"><div class="mk-h">Introduction</div><div class="mk-yes"><span class="mk-q">Share your profile with this firm?</span><span class="mk-btns"><b>Yes</b><i>Not now</i></span></div><div class="mk-ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>Your name stays private until then</div></div>'
  };
  ui.process = function (kind) {
    var T = D.terms;
    var steps = kind === "candidate" ? [
      [esc("Today"), "Send your resume", "Upload it or paste it. We read it and show matching roles with the pay.", MOCK.upload],
      [esc("This week"), "See roles with pay", "Confidential roles at small and mid-size firms, each with its base range.", MOCK.jobs],
      [esc("When you say yes"), "Meet the firm", "We share your profile only with the firms you pick. Free for you.", MOCK.yes]
    ] : [
      [m("Day 0"), "Tell us the seat", "Role, city, years, pay and must-haves. Two minutes on the finder, or 15 minutes with Justin.", MOCK.brief],
      [m("Days 1–5"), "See the shortlist", "Screened candidates with pay, bar admission and notice period. You pick who to meet.", MOCK.list],
      [m("Start date"), "Interview, hire, then pay", "Invoice on the start date, " + m("due in 30 days") + ". " + m(T.guarantee) + " if it does not work out.", MOCK.cal]
    ];
    return '<ol class="process">' + steps.map(function (s, i) {
      return '<li class="process-card">' +
        '<div class="pstep-top">' +
          '<div class="pstep-badge"><span class="pn">0' + (i + 1) + '</span><span class="when">' + s[0] + '</span></div>' +
          (i < 2 ? '<div class="pstep-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg></div>' : '') +
        '</div>' +
        '<div class="pstep-body">' +
          '<h3>' + esc(s[1]) + '</h3>' +
          '<p>' + (i === 2 && kind !== "candidate" ? s[2] : esc(s[2])) + '</p>' +
        '</div>' +
        '<div class="ill">' + s[3] + '</div>' +
      '</li>';
    }).join("") + '</ol>';
  };

  /* Shortlist stack: three overlapping animated candidate cards (hero visual). ids: [front, middle, back] */
  ui.shortlistStack = function (ids, opts) {
    opts = opts || {};
    var list = (ids || ["EP-TX-0412", "EP-TX-0388", "EP-TX-0451"]).map(O.candidate).filter(Boolean);
    var role = O.role(list[0].role), city = O.city(list[0].city);
    function card(c, i) {
      return '<div class="sc sc-card" data-card-idx="' + i + '" data-pos="' + i + '"><div class="sc-top"><span>' + esc(c.id) + '</span><span class="sc-ok">' + ui.icon("check") + "Meets 5 of 5" + '</span></div><b class="sc-h">' + esc(c.headline) + "</b>" +
        '<div class="sc-facts"><span><i>Experience</i>' + esc(c.years + " years") + "</span><span><i>Bar</i>" + esc(c.bars.join(", ") || "n/a") + "</span><span><i>Expects</i>" + esc(O.fmt.range(c.pay)) + "</span><span><i>Notice</i>" + esc(c.availability.replace(/'? notice$/, "")) + "</span></div>" +
        '<div class="mixbar">' + c.mix.map(function (x) { return '<i style="width:' + x[1] + '%"></i>'; }).join("") + "</div></div>";
    }
    var tabs = '<div class="stack3-tabs" role="tablist" aria-label="Candidate selection">' +
      list.map(function (c, i) {
        return '<button type="button" class="tab-pill' + (i === 0 ? " active" : "") + '" data-tab-idx="' + i + '" role="tab" aria-selected="' + (i === 0 ? "true" : "false") + '"><span class="tab-dot"></span>Candidate ' + (i + 1) + '</button>';
      }).join("") +
    '</div>';
    return '<div class="stack3" role="region" aria-label="Example candidate shortlist">' +
      '<div class="stack3-label"><span>Your shortlist</span><span>' + esc(role.name) + " · " + esc(city.name) + "</span></div>" +
      tabs +
      '<div class="stack3-cards">' + list.slice(0, 3).map(card).join("") + "</div>" +
      '<div class="stack3-foot">' + ui.icon("lock") + "Names and firms stay hidden until you ask</div></div>";
  };

  function initShortlistAnimation() {
    var stack = $(".stack3");
    if (!stack) return;
    var cards = Array.from(stack.querySelectorAll(".sc-card"));
    var tabs = Array.from(stack.querySelectorAll(".tab-pill"));
    if (cards.length < 2) return;

    var currentFront = 0;
    var total = cards.length;
    var timer = null;
    var isAnimating = false;
    var pauseUntil = 0;

    function applyPositions(frontIdx) {
      if (isAnimating) return;
      currentFront = (frontIdx + total) % total;
      cards.forEach(function (c, i) {
        c.classList.remove("swiping-out", "reset-to-back");
        var pos = (i - currentFront + total) % total;
        c.setAttribute("data-pos", String(pos));
        c.classList.remove("pos-0", "pos-1", "pos-2");
        c.classList.add("pos-" + pos);
      });
      tabs.forEach(function (tab, i) {
        var active = i === currentFront;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", String(active));
      });
    }

    function rotateNext() {
      if (isAnimating) return;
      var frontCard = cards[currentFront];
      var nextFront = (currentFront + 1) % total;
      if (!frontCard) {
        applyPositions(nextFront);
        return;
      }

      isAnimating = true;

      // 1. Front card swipes out to the right with lift & tilt
      frontCard.classList.add("swiping-out");

      // 2. Immediately bring next cards forward and update tab highlight
      tabs.forEach(function (tab, i) {
        var active = i === nextFront;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", String(active));
      });

      cards.forEach(function (c, i) {
        if (i !== currentFront) {
          var pos = (i - nextFront + total) % total;
          c.setAttribute("data-pos", String(pos));
          c.classList.remove("pos-0", "pos-1", "pos-2");
          c.classList.add("pos-" + pos);
        }
      });

      // 3. Once swipe-out completes, invisibly position front card to the back
      setTimeout(function () {
        frontCard.classList.remove("swiping-out");
        frontCard.classList.add("reset-to-back");

        var backPos = (currentFront - nextFront + total) % total;
        frontCard.setAttribute("data-pos", String(backPos));
        frontCard.classList.remove("pos-0", "pos-1", "pos-2");
        frontCard.classList.add("pos-" + backPos);

        currentFront = nextFront;

        // Next frame: remove reset-to-back so it softly fades into back of deck
        requestAnimationFrame(function () {
          setTimeout(function () {
            frontCard.classList.remove("reset-to-back");
            isAnimating = false;
          }, 20);
        });
      }, 260);
    }

    function startTimer() {
      stopTimer();
      timer = setInterval(function () {
        if (Date.now() < pauseUntil) return;
        rotateNext();
      }, 1800);
    }

    function stopTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    // Only pause briefly (1.4s) on active hover so it stays lively
    stack.addEventListener("mouseenter", function () {
      pauseUntil = Date.now() + 1400;
    });

    tabs.forEach(function (tab, idx) {
      tab.addEventListener("click", function (e) {
        e.preventDefault();
        applyPositions(idx);
        pauseUntil = Date.now() + 2500;
        startTimer();
      });
    });

    cards.forEach(function (card, idx) {
      card.addEventListener("click", function () {
        if (idx !== currentFront) {
          applyPositions(idx);
          pauseUntil = Date.now() + 2500;
          startTimer();
        }
      });
    });

    applyPositions(0);
    startTimer();
  }
  /* Redacted resume sheet: document graphic with real section headings and three highlighted lines */
  ui.resumeSheet = function (id) {
    var c = O.candidate(id || "EP-TX-0412");
    var xp = c.timeline.map(function (t, i) { return '<div class="sx"><span class="sx-when">' + m(t[0]) + '</span><div><b>' + m(t[1]) + '</b> <span class="blur w30"></span><p' + (i === 0 ? ' class="hl"' : "") + ">" + m(t[2]) + "</p>" + (i > 0 ? '<span class="blur w80"></span>' : "") + "</div></div>"; }).join("");
    return '<div class="sheet" role="img" aria-label="Redacted resume preview for ' + esc(c.id) + ': name, firms and school hidden">' +
      '<div class="sheet-head"><div><span class="blur w50 tall"></span><span class="blur w35"></span></div><span class="sheet-tag">' + ui.icon("lock") + "Redacted · " + m(c.id) + "</span></div>" +
      "<h4>Experience</h4>" + xp +
      '<h4>Bar admissions</h4><p class="hl">' + m(c.bars.join(", ") + " (active)") + ' <span class="blur w20"></span></p>' +
      '<div class="sm-drop"><h4>Practice mix</h4>' + ui.mix(c.mix) + "</div>" +
      '<h4>Pay and availability</h4><p class="hl">' + m(O.fmt.range(c.pay) + " base · " + c.availability) + "</p>" +
      '<div class="sm-drop"><h4>Education</h4><p><span class="blur w60"></span></p></div>' +
      '<div class="sheet-foot">Names, schools and firms come with the full profile</div></div>';
  };

  /* Terms tiles: four tiles with a large value each. Values come from data.terms (owner decisions, marked). */
  ui.termsTiles = function () {
    var t = D.terms;
    var tiles = [
      ["percent", m(Math.round(t.feeRate * 100) + "%"), "Fee", "of first-year base salary, only if you hire someone we introduced"],
      ["shield", m(t.guaranteeDays + " days"), "Guarantee", "If the hire leaves in that time, we replace them at no charge"],
      ["wallet", "$0", "Upfront", "No retainer and no exclusivity. Keep your other recruiters"],
      ["invoice", m("Start date"), "When you pay", "Invoice when the hire starts, " + m("due in 30 days")]
    ];
    return '<div class="tiles4">' + tiles.map(function (x) { return '<div class="tt">' + ui.icon(x[0]) + '<span class="tt-k">' + x[2] + '</span><b class="tt-v">' + x[1] + "</b><p>" + x[3] + "</p></div>"; }).join("") + "</div>";
  };

  /* Resource cards: [urlObj, icon, title, one line, what you get] */
  ui.resourceCards = function (list) {
    return '<div class="rcards">' + list.map(function (r) {
      return "<div>" + O.link(r[0], ui.icon(r[1]) + "<h3>" + esc(r[2]) + "</h3><p>" + esc(r[3]) + '</p><p class="rget"><b>You get</b> ' + esc(r[4]) + '</p><span class="rgo">Open' + ui.icon("arrow") + "</span>", 'class="rcard"') + "</div>";
    }).join("") + "</div>";
  };
  ui.resources = function (set) {
    var P = O.url.page;
    var all = {
      leaf: [P("leaf"), "chart", "Salary guides", "What firms pay by role, city and years of practice.", "Bands, the median and the source, free"],
      kit: [P("hiringKit"), "doc", "Hiring kit", "Everything to run the hire yourself, ready to copy.", "Posting, interview questions, scorecard"],
      post: [P("whereToPost"), "post", "Where to post a job", "Job boards compared on cost and speed.", "Cost and time to the first applicant"],
      hire: [P("whereToHire"), "school", "Where to hire from", "Law schools, programmes and bar groups.", "Who to contact and when they hire"],
      fees: [P("fees"), "percent", "Fee calculator", "The fee on your salary, and what the guarantee covers.", "Your number in ten seconds"]
    };
    var keys = set === "city" ? ["post", "hire", "kit"] : set === "employer" ? ["leaf", "kit", "post", "fees"] : ["leaf", "kit", "post", "hire"];
    var list = keys.map(function (k) { return all[k]; });
    if (set === "city") { list[0] = list[0].slice(); list[0][2] = "Where to post in Houston"; list[1] = list[1].slice(); list[1][2] = "Where Houston hires come from"; list[2] = list[2].slice(); list[2][2] = "Hiring kits"; }
    return ui.resourceCards(list);
  };

  /* City and role tiles (browse). Role tiles show the city's median; city tiles the estate planning median. */
  ui.cityTiles = function () {
    return '<div class="tiles">' + D.cities.map(function (c) {
      var b = O.band(c.slug, "estate-planning-attorney");
      return O.link(O.url.cityHub(c.slug), "<b>" + esc(c.name) + "</b><span>" + esc(c.stateName) + (b ? " · median " + m(O.fmt.k(b.median)) : "") + "</span>", 'class="tile"');
    }).join("") + "</div>";
  };
  ui.roleTiles = function (city) {
    city = city || "houston-tx";
    return '<div class="tiles">' + D.roles.map(function (r) {
      var b = O.band(city, r.slug);
      return O.link(O.url.roleHub(r.slug), "<b>" + esc(r.name) + "</b><span>" + (b ? O.city(city).name + " median " + m(O.fmt.k(b.median)) : "Pay by city") + "</span>", 'class="tile"');
    }).join("") + "</div>";
  };

  /* City snapshot card: four numbers */
  ui.snapshot = function (city) {
    var c = O.city(city), s = D.snapshots[city] || {}, b = O.band(city, "estate-planning-attorney");
    var n = O.match({ city: city }).filter(function (r) { return r.inCity; }).length, j = D.jobs.filter(function (x) { return x.city === city; }).length;
    return '<div class="snapshot"><div class="snap-h"><span class="eyebrow">' + esc(c.name) + ' snapshot</span><span class="small muted">' + m(D.asOf) + '</span></div><div class="snap-grid">' +
      '<div><b>' + m(String(n)) + "</b><span>" + O.plural(n, "candidate") + " available now</span></div>" +
      "<div><b>" + (b ? m(O.fmt.k(b.median)) : "") + "</b><span>median base, estate planning attorney</span></div>" +
      "<div><b>" + m(String(j)) + "</b><span>confidential " + O.plural(j, "role") + " open</span></div>" +
      "<div><b>" + m(s.shortlistDays || "5 days") + "</b><span>to a first shortlist</span></div></div></div>";
  };
  /* Stat band: [[big, label]] with large numerals */
  ui.statBand = function (items) { return '<div class="statband">' + items.map(function (x) { return '<div><b>' + x[0] + "</b><span>" + x[1] + "</span></div>"; }).join("") + "</div>"; };

  /* Final call-to-action band. opts: { title, text, button, href, kind: "employer"|"candidate", cal: false to drop the Justin link } */
  ui.ctaBand = function (o) {
    o = o || {}; var cand = o.kind === "candidate";
    var href = o.href || O.href(cand ? O.pages.uploadResume : O.pages.findCandidates);
    var eyebrow = cand ? "CONFIDENTIAL CANDIDATE SEARCH" : "ORION PLACEMENT GUARANTEE";
    var perks = cand
      ? '<div class="cta-perks"><span class="cta-perk"><svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3.5 3.5L13 4"/></svg> 100% confidential</span><span class="cta-perk"><svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3.5 3.5L13 4"/></svg> Free for candidates</span><span class="cta-perk"><svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3.5 3.5L13 4"/></svg> Direct partner access</span></div>'
      : '<div class="cta-perks"><span class="cta-perk"><svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3.5 3.5L13 4"/></svg> No retainer</span><span class="cta-perk"><svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3.5 3.5L13 4"/></svg> Zero fee unless you hire</span><span class="cta-perk"><svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8.5l3.5 3.5L13 4"/></svg> 2-year guarantee</span></div>';
    var calBtn = (o.cal === false || cand) ? "" : '<a class="btn btn-cta-cal" href="' + D.trust.calendly + '" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><span>Book 15 min with Justin</span></a>';

    return '<section class="cta-band"><div class="wrap">' +
      '<div class="cta-card-shell cta-card-compact">' +
        '<div class="cta-col-main cta-copy">' +
          '<div class="cta-eyebrow"><span class="cta-pulse" aria-hidden="true"></span><span>' + eyebrow + '</span></div>' +
          '<h2>' + esc(o.title || (cand ? "See roles that pay what you are worth" : "See candidates for your seat today")) + "</h2>" +
          perks +
        '</div>' +
        '<div class="cta-col-action cta-act">' +
          '<p>' + esc(o.text || (cand ? "Free for candidates. No firm sees your name until you say yes." : "Screened attorneys and paralegals, no retainer, and no fee unless you hire.")) + '</p>' +
          '<div class="cta-actions-row">' +
            '<a class="btn btn-cta-primary btn-light" href="' + href + '"><span>' + esc(o.button || (cand ? "Upload your resume" : "See candidates for my seat")) + '</span><svg class="btn-arrow" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg></a>' +
            calBtn +
          '</div>' +
          '<div class="cta-trust-badge trust-line">' +
            ui.stars() +
            '<span class="cta-trust-text"><b>' + esc(D.trust.rating) + ' on Google</b> · ' + (cand ? "free for candidates, confidential" : "no fee unless you hire") + '</span>' +
          '</div>' +
        '</div>' +
      '</div></div></section>';
  };

  /* ---------- JSON-LD ---------- */
  O.jsonld = function (obj) { var s = doc.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(obj); doc.head.appendChild(s); };
  O.ld = {
    occupation: function (role, city) {
      var r = O.role(role), c = O.city(city), b = O.band(city, role);
      return { "@context": "https://schema.org", "@type": "Occupation", name: r.name, occupationLocation: [{ "@type": "City", name: c.name + ", " + c.stateName }],
        estimatedSalary: [{ "@type": "MonetaryAmountDistribution", name: "base", currency: "USD", duration: "P1Y", percentile25: b.b1[1] * 1000, median: b.median * 1000, percentile75: b.b3[0] * 1000, minValue: b.b1[0] * 1000, maxValue: b.b3[1] * 1000 }],
        experienceRequirements: b.typical, description: r.name + " base salary in " + c.name + ", " + c.state + " (sample data)." };
    },
    jobPosting: function (j) {
      var c = O.city(j.city);
      return { "@context": "https://schema.org", "@type": "JobPosting", title: j.title, datePosted: j.posted, employmentType: "FULL_TIME", description: j.title + " at a confidential " + j.firmType.toLowerCase() + " (" + j.firmSize + "). " + j.mix + ".",
        hiringOrganization: { "@type": "Organization", name: "Confidential employer (via Orion Placement)" }, jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: c.name, addressRegion: c.state, addressCountry: "US" } },
        baseSalary: { "@type": "MonetaryAmount", currency: "USD", value: { "@type": "QuantitativeValue", minValue: j.band[0] * 1000, maxValue: j.band[1] * 1000, unitText: "YEAR" } } };
    },
    faqFromDom: function (root) {
      return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: $$("details", root).map(function (d) { return { "@type": "Question", name: $("summary", d).textContent.trim(), acceptedAnswer: { "@type": "Answer", text: $("p", d).textContent.trim() } }; }) };
    }
  };

  /* ---------- URL hash state for tools ---------- */
  O.hash = {
    get: function () { var o = {}; location.hash.replace(/^#/, "").split("&").forEach(function (p) { if (!p) return; var kv = p.split("="); o[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || ""); }); return o; },
    set: function (o) { var s = Object.keys(o).filter(function (k) { return o[k] !== "" && o[k] != null; }).map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(o[k]); }).join("&"); try { history.replaceState(null, "", "#" + s); } catch (e) { location.hash = s; } }
  };

  /* ---------- declarative mounts: <div data-mount="..."> ---------- */
  function resolve(path) { return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, D); }
  O.mountAll = function (root) {
    $$("[data-mount]", root).forEach(function (el) {
      var t = el.getAttribute("data-mount"), a = function (k) { return el.getAttribute("data-" + k); };
      var ctx = O.ctx(), role = a("role") || ctx.role || "estate-planning-attorney", city = a("city") || ctx.city || "houston-tx";
      if (t === "terms-box") el.innerHTML = ui.termsBox(a("title"));
      else if (t === "terms-strip") el.innerHTML = ui.termsStrip();
      else if (t === "band") el._band = ui.bandBar(el, { role: role, city: city, highlight: a("highlight") });
      else if (t === "candidates") {
        var ids = a("ids"), lim = +(a("limit") || 3);
        var list = ids ? ids.split(",").map(O.candidate) : O.match({ role: role, city: city }).filter(function (r) { return r.inCity; }).map(function (r) { return r.c; });
        var total = O.match({ role: a("role") ? role : null, city: city }).filter(function (r) { return r.inCity; }).length;
        el.innerHTML = ui.candidateRow(list.slice(0, lim), { total: total, role: a("role") ? role : null, city: city });
      }
      else if (t === "jobs") { var js = D.jobs.filter(function (j) { return (!a("role") || j.role === role) && j.city === city; }); el.innerHTML = '<div class="cards">' + js.slice(0, +(a("limit") || 3)).map(ui.jobCard).join("") + "</div>"; }
      else if (t === "city-pay-table") el.innerHTML = ui.cityPayTable(city);
      else if (t === "role-pay-table") el.innerHTML = ui.rolePayTable(role, a("here") || city);
      else if (t === "neighbours") el.innerHTML = ui.neighbours(role, city);
      else if (t === "sender") el.innerHTML = ui.sender(a("person"), a("domains") === "1", { full: a("full") === "1" });
      /* round 3 trust and visual modules */
      else if (t === "trust-line") el.outerHTML = ui.trustLine(a("kind"));
      else if (t === "trust-bar") el.innerHTML = ui.trustBar(a("kind"));
      else if (t === "rating") el.innerHTML = ui.rating({ size: a("size"), link: a("link") === "1" });
      else if (t === "review") el.innerHTML = ui.review(a("id") ? O.reviewById(a("id")) : pickReview(a("kind") || "employer"), { compact: a("compact") === "1" });
      else if (t === "reviews") el.innerHTML = ui.reviews(a("kind") || "mixed", +(a("limit") || 3));
      else if (t === "people") el.innerHTML = ui.people();
      else if (t === "person") el.innerHTML = ui.person(a("person") || "justin");
      else if (t === "process") el.innerHTML = ui.process(a("kind"));
      else if (t === "terms-tiles") el.innerHTML = ui.termsTiles();
      else if (t === "resources") el.innerHTML = ui.resources(a("set"));
      else if (t === "city-tiles") el.innerHTML = ui.cityTiles();
      else if (t === "role-tiles") el.innerHTML = ui.roleTiles(a("city") || city);
      else if (t === "shortlist") el.innerHTML = ui.shortlistStack(a("ids") ? a("ids").split(",") : null);
      else if (t === "resume-sheet") el.innerHTML = ui.resumeSheet(a("id"));
      else if (t === "snapshot") el.innerHTML = ui.snapshot(city);
      else if (t === "cal-link") el.outerHTML = ui.calLink(a("label"), a("class"));
      else if (t === "cta-band") el.outerHTML = ui.ctaBand({ title: a("title"), text: a("text"), button: a("button"), href: a("href"), kind: a("kind"), cal: a("cal") === "0" ? false : undefined });
      else if (t === "domains") el.innerHTML = D.sendingDomains.map(m).join(" and ");
      else if (t === "value") {
        var v = resolve(a("path")), f = a("format");
        el.innerHTML = m(f === "k" ? O.fmt.k(v) : f === "range" ? O.fmt.range(v) : v);
      }
      else if (t === "count") {
        var n = a("what") === "jobs" ? D.jobs.filter(function (j) { return j.city === city && (!a("role") || j.role === role); }).length
          : O.match({ role: a("role") ? role : null, city: city }).filter(function (r) { return r.inCity; }).length;
        el.innerHTML = a("unit") ? O.count(n, a("unit")) : m(String(n));
      }
      else if (t === "faq-ld") O.jsonld(O.ld.faqFromDom(el));
    });
  };

  /* ---------- boot ---------- */
  function boot() {
    if (html.getAttribute("data-city") && !O.get("city")) O.set("city", html.getAttribute("data-city"));
    if (html.getAttribute("data-role") && !O.get("role")) O.set("role", html.getAttribute("data-role"));
    if (html.getAttribute("data-set-ctx") === "force") { if (html.getAttribute("data-city")) O.set("city", html.getAttribute("data-city")); if (html.getAttribute("data-role")) O.set("role", html.getAttribute("data-role")); }
    buildHeader(); buildFooter(); navBehaviour(); phoneMenu();
    /* phones: the footer's long city and role lists start folded (links stay in the page); desktop always shows them */
    if (window.matchMedia) {
      var mq = matchMedia("(max-width:640px)"), setF = function () { $$(".fgroup").forEach(function (d) { d.open = !mq.matches; }); };
      setF(); if (mq.addEventListener) mq.addEventListener("change", setF);
    }
    applyMarks(); applyDoor();
    O.mountAll(doc);
    initShortlistAnimation();
    doc.addEventListener("click", function (e) {
      var a = e.target.closest("a[data-unbuilt]");
      if (a) { e.preventDefault(); O.toast(a.getAttribute("data-unbuilt") || O.UNBUILT_MSG); return; }
      var mt = e.target.closest("[data-marks-toggle]");
      if (mt) { O.set("marks", !O.marksOn()); applyMarks(); return; }
      var ds = e.target.closest("[data-door-set]");
      if (ds) { O.setDoor(ds.getAttribute("data-door-set")); return; }
      var rq = e.target.closest("[data-request]");
      if (rq) O.request(rq.getAttribute("data-request"), "intro");
      var pf = e.target.closest("[data-profile]");
      if (pf) O.request(pf.getAttribute("data-profile"), "profile");
    });
    mbarWatch();
    doc.dispatchEvent(new CustomEvent("orion:ready"));
  }

  /* Sticky mobile bar: hidden (.away) while a button with the same action, or the section it jumps to, is on screen.
     A twin is a .btn in main with the same href or the same text; for "#x" links the #x element counts too. Re-scans when pages re-render. */
  function mbarWatch() {
    var bar = $(".mbar"); if (!bar || !("IntersectionObserver" in window)) return;
    var seen = new Set(), io;
    function cta() { return $$("a,button", bar).filter(function (b) { return getComputedStyle(b).display !== "none"; })[0]; }
    function twins() {
      var a = cta(); if (!a) return [];
      var href = a.getAttribute("href") || "", txt = a.textContent.trim().toLowerCase(), list = [];
      $$("main .btn").forEach(function (b) {
        if (b.closest(".mbar")) return;
        if ((href && b.getAttribute("href") && b.href === a.href) || b.textContent.trim().toLowerCase() === txt) list.push(b);
      });
      if (href.charAt(0) === "#" && href.length > 1) { var t = doc.getElementById(href.slice(1)); if (t) { t._mbarTarget = true; list.push(t); } }
      return list;
    }
    function update() {
      var on = false, H = innerHeight;
      twins().forEach(function (t) {
        if (t.offsetParent === null) return;
        var r = t.getBoundingClientRect(); if (!r.height) return;
        /* a button counts when it is fully in view above the bar; a jump target when it fills the middle of the screen */
        if (t._mbarTarget ? (r.top < H * 0.45 && r.bottom > H * 0.35) : (r.top >= 0 && r.bottom <= H - 72)) on = true;
      });
      bar.classList.toggle("away", on);
    }
    io = new IntersectionObserver(update);
    function scan() { twins().forEach(function (t) { if (!seen.has(t)) { seen.add(t); io.observe(t); } }); update(); }
    scan();
    addEventListener("scroll", function () { if (!scan._t) scan._t = setTimeout(function () { scan._t = 0; update(); }, 80); }, { passive: true });
    new MutationObserver(function () { clearTimeout(scan._m); scan._m = setTimeout(scan, 60); }).observe($("main") || doc.body, { childList: true, subtree: true });
    doc.addEventListener("orion:door", scan);
    new MutationObserver(scan).observe(bar, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["href"] });
  }
  /* site.js is loaded at the end of <body>, so the DOM above it exists: boot now, so inline page scripts that follow can use the rendered header and mounts. */
  boot();
})();

/* ===== Employer page helpers: Orion.b (copy, tabs, parsePosting, addDays) ===== */
(function () {
  "use strict";
  var O = window.Orion, D = O.data, B = (O.b = {});

  /* Copy text to the clipboard; falls back to a hidden textarea. Calls done(ok). */
  B.copy = function (text, done) {
    function fallback() {
      var t = document.createElement("textarea"); t.value = text; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.top = "-1000px";
      document.body.appendChild(t); t.select(); var ok = false; try { ok = document.execCommand("copy"); } catch (e) {} t.remove(); done && done(ok);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { done && done(true); }, fallback);
    else fallback();
  };

  /* Accessible tabs. root contains [role=tablist] > button[role=tab][aria-controls]; onChange(id) */
  B.tabs = function (root, onChange) {
    var tabs = O.$$("[role=tab]", root);
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tab.focus();
      onChange && onChange(tab.getAttribute("aria-controls"));
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var j = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : null;
        if (j == null) return; e.preventDefault(); select(tabs[(j + tabs.length) % tabs.length], true);
      });
    });
    return { select: function (id) { var t = tabs.filter(function (x) { return x.getAttribute("aria-controls") === id; })[0]; if (t) select(t); } };
  };

  /* Read a job posting with simple rules. Returns { role, city, years, lo, hi, mode, must, found:{field:true} } */
  B.parsePosting = function (text) {
    var t = " " + String(text || "").toLowerCase().replace(/[–—]/g, "-") + " ", out = { found: {} };
    D.parseRoles.some(function (r) { if (new RegExp(r[1], "i").test(t)) { out.role = r[0]; out.found.role = true; return true; } });
    D.cities.some(function (c) { if (t.indexOf(c.name.toLowerCase()) > -1) { out.city = c.slug; out.found.city = true; return true; } });
    var y = t.match(/(\d{1,2})\s*\+?\s*(?:(?:-|to)\s*(\d{1,2})\s*)?(?:\+\s*)?years?/);
    if (y) { var n = +y[1]; out.years = n >= 8 ? "b3" : n >= 4 ? "b2" : "b1"; out.found.years = true; }
    var pays = [], re = /\$\s?(\d{2,3})(?:,(\d{3})|\s?k\b)?/g, mm;
    while ((mm = re.exec(t))) { var v = +mm[1]; if (v >= 30 && v <= 500) pays.push(v); }
    if (pays.length) { out.lo = Math.min.apply(null, pays); out.hi = Math.max.apply(null, pays); out.found.pay = true; }
    if (/hybrid|remote/.test(t)) { out.mode = "hybrid"; out.found.mode = true; }
    else if (/on-?site|in-office|in office|in the office/.test(t)) { out.mode = "on-site"; out.found.mode = true; }
    var role = O.role(out.role || "estate-planning-attorney"), list = D.mustHaves[role.slug] || D.mustHaves[role.kind] || [];
    out.must = list.filter(function (tag) { var src = D.parseTags[tag]; return src && new RegExp(src, "i").test(t); });
    return out;
  };

  /* Add days to an ISO date; returns ISO */
  B.addDays = function (iso, n) { var d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
})();

/* ===== Candidate page helpers: window.OC (alias Orion.c): jobCard (with fit checks and hash links), resume reader, job matching, candidate capture form. */
(function () {
  "use strict";
  var O = window.Orion, D = O.data, esc = O.esc, m = O.m;
  var OC = (window.OC = O.c = {});

  /* "3–6 years" -> [3,6]; "8+ years" -> [8,40] */
  OC.yearsRange = function (s) {
    var a = String(s).match(/(\d+)\s*[–-]\s*(\d+)/); if (a) return [+a[1], +a[2]];
    var b = String(s).match(/(\d+)\s*\+/); if (b) return [+b[1], 40];
    return [0, 40];
  };
  OC.expKey = function (y) { y = +y || 0; return y >= 8 ? "b3" : y >= 4 ? "b2" : "b1"; };
  OC.toK = function (v) { v = +String(v || "").replace(/[^\d.]/g, ""); if (!v) return null; return v > 1000 ? v / 1000 : v; };

  /* Job card with optional fit checks; links carry role, city and job id so the upload page can prefill. */
  OC.jobCard = function (j, opts) {
    opts = opts || {};
    var h = O.ui.jobCard(j);
    var q = "#role=" + j.role + "&amp;city=" + j.city + "&amp;job=" + j.id;
    h = h.replace(/href="([^"]*upload-resume\/index\.html)"/g, 'href="$1' + q + '"');
    if (opts.apply) {
      h = h.replace(/<div class="actions">[\s\S]*<\/div><\/article>$/, '<div class="actions"><button type="button" class="btn btn-primary btn-sm" data-apply="' + j.id + '">Apply confidentially</button></div></article>');
    }
    if (opts.result) {
      var r = opts.result;
      var fit = '<p class="score">Fits ' + r.met + " of " + r.total + '</p><ul class="checks">' + r.checks.map(function (x) { return '<li class="' + (x.ok ? "" : "no") + '">' + esc(x.k) + "</li>"; }).join("") + "</ul>" +
        (r.why ? '<p class="why">' + r.why + "</p>" : "");
      h = h.replace("</dl>", "</dl>" + fit);
    } else if (opts.why) h = h.replace("</dl>", '</dl><p class="why">' + opts.why + "</p>");
    return h;
  };

  /* Read resume text into a profile: { role, city, years, tags[], mode, min (k), base (k) } */
  OC.parseResume = function (text) {
    var t = String(text || ""), R = D.resumeRules, p = { role: null, city: null, years: null, tags: [], mode: "any", min: null, base: null };
    for (var i = 0; i < R.roles.length; i++) if (R.roles[i][1].test(t)) { p.role = R.roles[i][0]; break; }
    D.cities.forEach(function (c) { if (!p.city && new RegExp("\\b" + c.name + "\\b", "i").test(t)) p.city = c.slug; });
    var yrs = t.match(/(\d{1,2})\+?\s+years/i);
    var starts = (t.match(/\b(19[89]\d|20[0-2]\d)\b/g) || []).map(Number);
    if (yrs) p.years = +yrs[1]; else if (starts.length) p.years = Math.max(1, 2026 - Math.min.apply(null, starts));
    R.tags.forEach(function (x) { if (x[1].test(t)) p.tags.push(x[0]); });
    var on = /on-?site|in office/i.test(t), hy = /hybrid|remote/i.test(t);
    p.mode = on && hy ? "any" : on ? "on-site" : hy ? "hybrid" : "any";
    var pay = t.match(/(?:base|salary|compensation)[^$\n]*\$\s?([\d,]{2,7})(k)?/i);
    if (pay) { var v = +pay[1].replace(/,/g, ""); p.base = pay[2] ? v : v / 1000; p.min = p.base; }
    return p;
  };

  /* Tags offered for a role (same lists as the employer finder) */
  OC.tagsFor = function (role) { var r = O.role(role); return (D.mustHaves[role] || D.mustHaves[r.kind] || []).slice(); };

  /* Match a profile to confidential jobs. Role is a hard filter; jobs in the same state stay in the list. */
  OC.matchJobs = function (p) {
    var city = O.city(p.city);
    return D.jobs.filter(function (j) { return j.role === p.role && (!city || O.city(j.city).state === city.state); }).map(function (j) {
      var checks = [], yr = OC.yearsRange(j.years), tags = D.jobTags[j.id] || [], why = [];
      var inCity = !city || j.city === city.slug;
      if (city) checks.push({ k: inCity ? "In " + city.name : "In " + O.city(j.city).name, ok: inCity });
      if (p.years != null) { var okY = p.years >= yr[0] - 1 && p.years <= yr[1] + 1; checks.push({ k: j.years, ok: okY }); }
      if (p.mode && p.mode !== "any") checks.push({ k: j.mode === "on-site" ? "On-site" : "Hybrid", ok: j.mode === p.mode });
      if (p.min) { var okP = j.band[1] >= p.min; checks.push({ k: "Up to " + O.fmt.k(j.band[1]), ok: okP }); if (okP && j.band[1] > p.min) why.push("Pays up to " + m(O.fmt.k(j.band[1])) + ", " + m(O.fmt.k(j.band[1] - p.min)) + " above your number."); }
      var have = tags.filter(function (t) { return p.tags.indexOf(t) > -1; });
      tags.forEach(function (t) { checks.push({ k: t, ok: p.tags.indexOf(t) > -1 }); });
      if (have.length) why.push("Asks for " + esc(have.slice(0, 2).join(" and ").toLowerCase().replace("texas bar", "a Texas licence")) + ", which your resume shows.");
      var met = checks.filter(function (x) { return x.ok; }).length;
      return { j: j, checks: checks, met: met, total: checks.length, inCity: inCity, why: why.join(" ") };
    }).sort(function (a, b) { return (b.met / (b.total || 1)) - (a.met / (a.total || 1)) || (b.inCity - a.inCity) || (b.j.band[1] - a.j.band[1]); });
  };

  /* Confirmation timeline for candidate captures. steps: [[when, text, done]] (text is HTML) */
  OC.confirmHtml = function (email, steps, eyebrow) {
    return '<div class="confirm" role="status" tabindex="-1"><span class="eyebrow">' + esc(eyebrow || "Saved") + "</span><h3>Sent to " + esc(email) + "</h3>" +
      '<ol class="timeline">' + steps.map(function (s, i) { return '<li class="' + (s[2] ? "done" : "") + '"><span class="when">' + (i === 0 ? esc(s[0]) : m(s[0])) + "</span><p>" + s[1] + "</p></li>"; }).join("") + "</ol></div>";
  };

  /* Candidate capture: email (+ optional extra fields HTML) -> confirmation.
     opts: { title, intro, button, extra, fine, steps(email, form) -> [[when,text,done]], eyebrow, store, onDone } */
  OC.capture = function (el, opts) {
    var id = "c" + Math.random().toString(36).slice(2, 7);
    el.innerHTML = '<form class="gate" novalidate>' + (opts.title ? "<h3>" + esc(opts.title) + "</h3>" : "") + (opts.intro ? '<p class="small">' + opts.intro + "</p>" : "") +
      '<div class="row"><div class="field"><label for="' + id + 'e">Personal email</label><input id="' + id + 'e" type="email" name="email" autocomplete="email" required placeholder="you@gmail.com"><span class="err-msg hidden" id="' + id + 'ee">Enter an email address like name@gmail.com.</span></div>' +
      (opts.extra || "") + "</div>" +
      '<button class="btn btn-primary" type="submit">' + esc(opts.button || "Send me matches") + "</button>" +
      '<p class="fine">' + (opts.fine || "Use a personal email, not your work one. We never contact your current firm, and no employer sees your name until you say yes to that role.") + "</p></form>";
    var f = O.$("form", el);
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var em = f.email.value.trim(), ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em);
      f.email.closest(".field").classList.toggle("err", !ok); O.$("#" + id + "ee").classList.toggle("hidden", ok); f.email.setAttribute("aria-invalid", String(!ok));
      if (!ok) { f.email.focus(); return; }
      var steps = opts.steps(em, f);
      if (opts.store) O.set(opts.store, { email: em, at: Date.now() });
      el.innerHTML = OC.confirmHtml(em, steps, opts.eyebrow);
      var cf = O.$(".confirm", el); cf.focus({ preventScroll: true }); cf.scrollIntoView({ block: "nearest" });
      if (opts.onDone) opts.onDone(em);
    });
    return f;
  };
})();
