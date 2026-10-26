(function(){
  const pages=[["index.html","Regu Charizard"],["anggota.html","Anggota"],["bindamping.html","Bindamping"],["sambarata.html","Sambarata"],["parisada.html","Tentang PARISADA"]];
  const cur=document.body.dataset.page;

  // layout shell
  document.body.insertAdjacentHTML("afterbegin",
   `<div class="curtain"></div><div id="progress"></div><canvas id="embers"></canvas>
    <header class="nav"><div class="wrap">
      <a class="brand" href="index.html"><span class="logo"><img src="assets/logo.png" alt="Logo Regu Charizard"></span><span><b>REGU CHARIZARD</b><small>SAMBARATA SCOUT KHAIRUL ULUM</small></span></a>
      <nav class="menu" id="menu">${pages.map(p=>`<a href="${p[0]}" class="${p[0]===cur?'active':''}">${p[1]}</a>`).join("")}</nav>
      <button id="burger" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
    </div></header>`);
  document.body.insertAdjacentHTML("beforeend",`<footer><div class="wrap">© 2026 Regu Charizard | Crafted by Fathul Amin | Sambarata Scout – Khairul Ulum.</div></footer>`);

  const menu=document.getElementById("menu"),burger=document.getElementById("burger");
  burger.onclick=()=>{menu.classList.toggle("open");burger.firstChild.className=menu.classList.contains("open")?"fa-solid fa-xmark":"fa-solid fa-bars"};

  // page leave transition
  const curtain=document.querySelector(".curtain");
  document.addEventListener("click",e=>{
    const a=e.target.closest("a[href$='.html']");
    if(!a||e.ctrlKey||e.metaKey||a.target)return;
    e.preventDefault();curtain.style.animation="none";curtain.className="curtain leave";curtain.style.pointerEvents="auto";
    setTimeout(()=>location.href=a.href,380);
  });
  window.addEventListener("pageshow",e=>{if(e.persisted){curtain.className="curtain";curtain.style.animation=""}});

  // scroll progress
  const bar=document.getElementById("progress");
  addEventListener("scroll",()=>{const h=document.documentElement;bar.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight||1)*100)+"%"},{passive:true});

  // reveal
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.12});
  window.observeReveals=()=>document.querySelectorAll(".reveal:not(.in)").forEach((el,i)=>{io.observe(el)});
  observeReveals();

  // glow follow + 3D tilt
  window.bindFx=()=>document.querySelectorAll(".glass:not([data-fx])").forEach(c=>{
    c.dataset.fx=1;
    c.addEventListener("pointermove",e=>{const r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
      c.style.setProperty("--mx",x+"px");c.style.setProperty("--my",y+"px");
      if(c.dataset.tilt!=="off"&&e.pointerType==="mouse"){c.style.transform=`perspective(900px) rotateX(${((y/r.height)-.5)*-6}deg) rotateY(${((x/r.width)-.5)*6}deg) translateY(-4px)`}});
    c.addEventListener("pointerleave",()=>{c.style.transform=""});
  });
  bindFx();

  // counters
  document.querySelectorAll("[data-count]").forEach(el=>{
    const to=+el.dataset.count,suf=el.dataset.suffix||"";
    new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){o.disconnect();const t0=performance.now();
      (function f(t){const p=Math.min((t-t0)/1400,1);el.textContent=Math.round(to*(1-Math.pow(1-p,3)))+suf;if(p<1)requestAnimationFrame(f)})(t0)}}).observe(el);
  });

  // embers
  const cv=document.getElementById("embers"),cx=cv.getContext("2d");let W,H,P=[];
  const size=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight};size();addEventListener("resize",size);
  const mk=(init)=>({x:Math.random()*W,y:init?Math.random()*H:H+10,r:Math.random()*2.4+.6,vy:Math.random()*.9+.3,vx:(Math.random()-.5)*.4,a:Math.random()*.7+.3,ph:Math.random()*6.28});
  const N=innerWidth<700?35:70;for(let i=0;i<N;i++)P.push(mk(true));
  if(!matchMedia("(prefers-reduced-motion:reduce)").matches)(function loop(){
    cx.clearRect(0,0,W,H);
    for(const p of P){p.y-=p.vy;p.ph+=.03;p.x+=p.vx+Math.sin(p.ph)*.4;p.a-=.0014;
      if(p.y<-10||p.a<=0)Object.assign(p,mk(false));
      const g=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);
      g.addColorStop(0,`rgba(255,${150+p.r*30|0},40,${p.a})`);g.addColorStop(1,"rgba(255,80,20,0)");
      cx.fillStyle=g;cx.beginPath();cx.arc(p.x,p.y,p.r*4,0,6.28);cx.fill()}
    requestAnimationFrame(loop)})();
})();
