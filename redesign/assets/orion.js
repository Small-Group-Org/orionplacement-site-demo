/* Orion redesign: menu toggle and demo form validation. Forms never send anything. */
(function(){
  // ---- motion: reveal on scroll, gold line draw, count-up ----
  var root=document.documentElement;root.classList.add("js");
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets=[].slice.call(document.querySelectorAll("[data-reveal],.draw-line"));
  // stagger children of [data-stagger]
  [].slice.call(document.querySelectorAll("[data-stagger]")).forEach(function(g){
    [].slice.call(g.children).forEach(function(c,i){c.setAttribute("data-reveal","");c.style.transitionDelay=(i*90)+"ms";targets.push(c);});
  });
  function count(el){
    var to=parseFloat(el.getAttribute("data-count")),dec=(el.getAttribute("data-count").split(".")[1]||"").length;
    var pre=el.getAttribute("data-prefix")||"",suf=el.getAttribute("data-suffix")||"";
    if(reduce){el.textContent=pre+to.toFixed(dec)+suf;return;}
    var t0=null,d=1400;
    function step(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/d),e=1-Math.pow(1-k,3);el.textContent=pre+(to*e).toFixed(dec)+suf;if(k<1)requestAnimationFrame(step);}
    requestAnimationFrame(step);
  }
  var counters=[].slice.call(document.querySelectorAll("[data-count]"));
  if(!("IntersectionObserver" in window)||reduce){
    targets.forEach(function(t){t.classList.add("in");});counters.forEach(count);
  }else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{rootMargin:"0px 0px -8% 0px",threshold:.08});
    targets.forEach(function(t){io.observe(t);});
    var co=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){count(e.target);co.unobserve(e.target);}});},{threshold:.4});
    counters.forEach(function(c){co.observe(c);});
  }

  var btn=document.querySelector(".menu-btn"),nav=document.getElementById("site-nav");
  if(btn&&nav){
    btn.addEventListener("click",function(){var open=nav.classList.toggle("open");btn.setAttribute("aria-expanded",open?"true":"false");});
    document.addEventListener("keydown",function(e){if(e.key==="Escape"&&nav.classList.contains("open")){nav.classList.remove("open");btn.setAttribute("aria-expanded","false");btn.focus();}});
  }

  // <form data-demo> : fields with [required] get checked; .field wrapper shows .err.
  // On success the closest [data-sent-scope] (or the form's parent) gets .sent.
  var emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function valid(el){
    if(el.type==="checkbox")return el.checked;
    var v=(el.value||"").trim();
    if(!v)return false;
    if(el.type==="email")return emailRe.test(v);
    return true;
  }
  function mark(el){
    var ok=valid(el),f=el.closest(".field");
    if(f)f.classList.toggle("has-error",!ok);
    el.setAttribute("aria-invalid",ok?"false":"true");
    return ok;
  }
  document.querySelectorAll("form[data-demo]").forEach(function(form){
    form.setAttribute("novalidate","");
    var req=[].slice.call(form.querySelectorAll("[required]"));
    req.forEach(function(el){
      // clear errors while typing, not on blur: a blur-time layout shift made the submit click miss
      el.addEventListener(el.type==="checkbox"||el.tagName==="SELECT"?"change":"input",function(){
        var f=el.closest(".field");if(f&&f.classList.contains("has-error"))mark(el);});
    });
    form.addEventListener("submit",function(e){
      e.preventDefault();var first=null;
      req.forEach(function(el){if(!mark(el)&&!first)first=el;});
      if(first){first.focus();return;}
      var scope=form.closest("[data-sent-scope]")||form.parentElement;
      scope.classList.add("sent");
      var done=scope.querySelector(".done");if(done){done.setAttribute("tabindex","-1");done.focus();}
      form.dispatchEvent(new CustomEvent("demo:sent",{bubbles:true}));
    });
  });
})();
