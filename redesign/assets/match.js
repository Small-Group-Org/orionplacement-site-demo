/* The match animation. Needs #match, #mStage, #mList, #mRev, #mHit, #mDone, #mReplay. */
(function(){
  var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches,$=function(id){return document.getElementById(id)};
  if(!$("match"))return;
  /* ---- 1. the match ---- */
  var pool=[
    {id:"EP-0412",yrs:"5 yrs",line:"Estate planning · trusts and probate",pay:"$125k–$140k",c:[1,1,1]},
    {id:"LIT-0390",yrs:"4 yrs",line:"Civil litigation · discovery and motions",pay:"$115k–$130k",c:[0,1,1]},
    {id:"EP-0377",yrs:"6 yrs",line:"Estate planning · wills and trusts",pay:"$130k–$145k",c:[1,1,1]},
    {id:"EP-0502",yrs:"9 yrs",line:"Estate planning · high-net-worth",pay:"$170k–$185k",c:[1,0,0]},
    {id:"EP-0455",yrs:"4 yrs",line:"Estate planning · probate litigation",pay:"$120k–$135k",c:[1,1,1]}
  ];
  var crit=["Practice area","4–7 years","Pay in range"];
  var stage=$("mStage"),list=$("mList"),rev=$("mRev"),hit=$("mHit"),done=$("mDone"),timers=[];
  function T(fn,ms){timers.push(setTimeout(fn,ms));}
  function card(p){var d=document.createElement("div");d.className="m-cand in";
    d.innerHTML='<div><p class="m-id">'+p.id+'</p><span class="m-name"></span><p class="m-line">'+p.yrs+' · '+p.line+'</p><p class="m-line" style="color:var(--muted)">Target '+p.pay+'</p></div><ul class="m-crit">'+crit.map(function(c){return '<li><i></i>'+c+'</li>'}).join("")+'</ul><span class="m-verdict"></span>';return d;}
  function addShort(p){var li=document.createElement("li");li.innerHTML='<span class="ck">✓</span><span><b>'+p.id+'</b> &nbsp;'+p.yrs+'</span><span class="pay">'+p.pay+'</span>';list.appendChild(li);}
  function run(){
    timers.forEach(clearTimeout);timers=[];stage.innerHTML="";list.innerHTML="";rev.textContent="0";hit.textContent="0";done.classList.remove("on");
    if(reduce){pool.forEach(function(p){if(p.c.every(Boolean))addShort(p)});rev.textContent="5";hit.textContent="3";done.classList.add("on");return;}
    var t=400,n=0,m=0;
    pool.forEach(function(p){
      var el;T(function(){stage.innerHTML="";el=card(p);stage.appendChild(el);},t);
      p.c.forEach(function(ok,k){T(function(){var li=el.querySelectorAll(".m-crit li")[k];li.classList.add(ok?"ok":"no");li.querySelector("i").textContent=ok?"✓":"✕";},t+350+k*230);});
      var good=p.c.every(Boolean);
      T(function(){var v=el.querySelector(".m-verdict");v.textContent=good?"Match":"Set aside";v.classList.add(good?"ok":"no");n++;rev.textContent=n;},t+1100);
      T(function(){el.classList.add(good?"out-ok":"out-no");if(good){m++;hit.textContent=m;addShort(p);}},t+1550);
      t+=1850;
    });
    T(function(){stage.innerHTML='<div class="m-cand" style="display:flex;align-items:center;justify-content:center;text-align:center;color:var(--muted);font-size:14px">5 profiles reviewed against your seat.<br>3 go on your shortlist.</div>';done.classList.add("on");},t);
  }
  var started=false,mio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&!started){started=true;run();}})},{threshold:.4});
  mio.observe($("match"));$("mReplay").addEventListener("click",run);

})();
