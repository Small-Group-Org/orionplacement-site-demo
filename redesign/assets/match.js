/* The match animation. Needs #match, #mStage, #mList, #mRev, #mHit, #mDone, #mReplay.
   Optional: #mTitle, #mTags, #mDoneText (seat card text) and #mSeats (practice buttons, data-seat="key")
   to replay the match for another seat; #mPeek gets a static copy of the shortlist (mobile). */
(function(){
  var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches,$=function(id){return document.getElementById(id)};
  if(!$("match"))return;
  var SEATS={
    estate:{title:"Estate planning associate",tags:["4–7 years","$125k–$145k","Trusts and probate","On-site or hybrid"],crit:["Estate planning","4–7 years","Pay in range"],pool:[
      {id:"EP-0412",yrs:"5 yrs",line:"Estate planning · trusts and probate",pay:"$125k–$140k",c:[1,1,1]},
      {id:"EP-0502",yrs:"9 yrs",line:"Estate planning · high-net-worth",pay:"$170k–$185k",c:[1,0,0]},
      {id:"EP-0377",yrs:"6 yrs",line:"Estate planning · wills and trusts",pay:"$130k–$145k",c:[1,1,1]},
      {id:"EP-0455",yrs:"4 yrs",line:"Estate planning · probate litigation",pay:"$120k–$135k",c:[1,1,1]}]},
    lit:{title:"Civil litigation associate",tags:["3–6 years","$115k–$140k","Discovery and motions","Dallas or hybrid"],crit:["Litigation","3–6 years","Pay in range"],pool:[
      {id:"LIT-0390",yrs:"4 yrs",line:"Civil litigation · discovery and motions",pay:"$115k–$130k",c:[1,1,1]},
      {id:"LIT-0441",yrs:"2 yrs",line:"Insurance defense · written discovery",pay:"$95k–$105k",c:[1,0,0]},
      {id:"LIT-0422",yrs:"6 yrs",line:"Commercial litigation · depositions",pay:"$130k–$140k",c:[1,1,1]},
      {id:"LIT-0367",yrs:"5 yrs",line:"Civil litigation · two bench trials",pay:"$120k–$135k",c:[1,1,1]}]},
    re:{title:"Commercial real estate associate",tags:["3–6 years","$115k–$140k","Leasing and acquisitions","On-site"],crit:["Real estate","3–6 years","Pay in range"],pool:[
      {id:"RE-0274",yrs:"5 yrs",line:"Commercial real estate · leasing",pay:"$120k–$135k",c:[1,1,1]},
      {id:"RE-0219",yrs:"4 yrs",line:"Residential closings · title",pay:"$90k–$100k",c:[0,1,0]},
      {id:"RE-0306",yrs:"3 yrs",line:"Acquisitions · due diligence",pay:"$115k–$125k",c:[1,1,1]},
      {id:"RE-0288",yrs:"6 yrs",line:"Development · financing",pay:"$130k–$140k",c:[1,1,1]}]},
    corp:{title:"Corporate associate",tags:["2–5 years","$105k–$130k","Entities and small M&A","Hybrid"],crit:["Corporate","2–5 years","Pay in range"],pool:[
      {id:"CORP-0518",yrs:"3 yrs",line:"Corporate · entity formation and M&A",pay:"$110k–$125k",c:[1,1,1]},
      {id:"CORP-0533",yrs:"8 yrs",line:"Corporate · private equity",pay:"$190k–$210k",c:[1,0,0]},
      {id:"CORP-0497",yrs:"4 yrs",line:"Corporate · financing and contracts",pay:"$115k–$130k",c:[1,1,1]},
      {id:"CORP-0541",yrs:"2 yrs",line:"Corporate · governance and startups",pay:"$105k–$115k",c:[1,1,1]}]},
    para:{title:"Litigation paralegal",tags:["5+ years","$62k–$78k","Trial prep and e-discovery","On-site"],crit:["Litigation","5+ years","Pay in range"],pool:[
      {id:"PL-0231",yrs:"8 yrs",line:"Litigation paralegal · e-discovery",pay:"$68k–$75k",c:[1,1,1]},
      {id:"PL-0258",yrs:"3 yrs",line:"Family law paralegal · filings",pay:"$50k–$56k",c:[0,0,1]},
      {id:"PL-0244",yrs:"6 yrs",line:"Litigation paralegal · trial binders",pay:"$64k–$70k",c:[1,1,1]},
      {id:"PL-0262",yrs:"11 yrs",line:"Senior litigation paralegal",pay:"$72k–$78k",c:[1,1,1]}]}
  };
  var seat=SEATS.estate;
  var stage=$("mStage"),list=$("mList"),rev=$("mRev"),hit=$("mHit"),done=$("mDone"),timers=[];
  function T(fn,ms){timers.push(setTimeout(fn,ms));}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]});}
  function card(p){var d=document.createElement("div");d.className="m-cand in";
    d.innerHTML='<div><p class="m-id">'+esc(p.id)+'</p><span class="m-name"></span><p class="m-line">'+esc(p.yrs)+' · '+esc(p.line)+'</p><p class="m-line" style="color:var(--muted)">Target '+esc(p.pay)+'</p></div><ul class="m-crit">'+seat.crit.map(function(c){return '<li><i></i>'+esc(c)+'</li>'}).join("")+'</ul><span class="m-verdict"></span>';return d;}
  function row(p){return '<span class="ck">✓</span><span><b>'+esc(p.id)+'</b> &nbsp;'+esc(p.yrs)+'</span><span class="pay">'+esc(p.pay)+'</span>';}
  function addShort(p){var li=document.createElement("li");li.innerHTML=row(p);list.appendChild(li);}
  function good(p){return p.c.every(Boolean);}
  function paintSeat(){
    if($("mTitle"))$("mTitle").textContent=seat.title;
    if($("mTags"))$("mTags").innerHTML=seat.tags.map(function(t){return "<span>"+esc(t)+"</span>"}).join("");
    var m=seat.pool.filter(good);
    if($("mDoneText"))$("mDoneText").textContent=m.length+" matches, screened by Jon";
    if($("mPeek"))$("mPeek").innerHTML=m.map(function(p){return "<li>"+row(p)+"</li>"}).join("");
    if($("mPeekSeat"))$("mPeekSeat").textContent=seat.title;
  }
  function run(){
    timers.forEach(clearTimeout);timers=[];stage.innerHTML="";list.innerHTML="";rev.textContent="0";hit.textContent="0";done.classList.remove("on");
    var total=seat.pool.length,matched=seat.pool.filter(good).length;
    if(reduce){seat.pool.forEach(function(p){if(good(p))addShort(p)});rev.textContent=total;hit.textContent=matched;done.classList.add("on");return;}
    var t=300,n=0,m=0;
    seat.pool.forEach(function(p){
      var el,ok=good(p);T(function(){stage.innerHTML="";el=card(p);stage.appendChild(el);},t);
      p.c.forEach(function(v,k){T(function(){var li=el.querySelectorAll(".m-crit li")[k];li.classList.add(v?"ok":"no");li.querySelector("i").textContent=v?"✓":"✕";},t+300+k*180);});
      T(function(){var v=el.querySelector(".m-verdict");v.textContent=ok?"Match":"Set aside";v.classList.add(ok?"ok":"no");n++;rev.textContent=n;},t+900);
      T(function(){el.classList.add(ok?"out-ok":"out-no");if(ok){m++;hit.textContent=m;addShort(p);}},t+1250);
      t+=1500;
    });
    T(function(){stage.innerHTML='<div class="m-cand" style="display:flex;align-items:center;justify-content:center;text-align:center;color:var(--muted);font-size:14px">'+total+' profiles reviewed against your seat.<br>'+matched+' go on your shortlist.</div>';done.classList.add("on");},t);
  }
  paintSeat();
  var started=false,mio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&!started){started=true;run();}})},{threshold:.4});
  mio.observe($("match"));$("mReplay").addEventListener("click",run);
  var chips=$("mSeats");
  if(chips){[].slice.call(chips.querySelectorAll("button[data-seat]")).forEach(function(b){b.addEventListener("click",function(){
    var k=b.getAttribute("data-seat");if(!SEATS[k])return;seat=SEATS[k];
    [].slice.call(chips.querySelectorAll("button")).forEach(function(x){x.setAttribute("aria-pressed",x===b?"true":"false")});
    paintSeat();started=true;run();});});}
})();
