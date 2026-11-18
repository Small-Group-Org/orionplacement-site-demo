/* Orion redesign: menu toggle and demo form validation. Forms never send anything. */
(function(){
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
      el.addEventListener(el.type==="checkbox"||el.tagName==="SELECT"?"change":"blur",function(){
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
