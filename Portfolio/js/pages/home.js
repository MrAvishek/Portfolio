(()=>{
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const still=matchMedia("(prefers-reduced-motion:reduce)").matches,fine=matchMedia("(pointer:fine)").matches;
const m={x:-999,y:-999},hero=$(".hero"),orb=$(".orbit");

// Pointer: feeds the particle field and nudges the orbit
if(hero&&fine&&!still){
  hero.addEventListener("pointermove",e=>{const r=hero.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top;
    if(orb)orb.style.transform=`translate(${(m.x/r.width-.5)*-16}px,${(m.y/r.height-.5)*-16}px)`});
  hero.addEventListener("pointerleave",()=>{m.x=m.y=-999;if(orb)orb.style.transform=""});
}

// 1. Particle network
const cv=$("#field");
if(cv){const ctx=cv.getContext("2d");let w,h,pts=[],vis=true,raf;
  const size=()=>{const d=Math.min(devicePixelRatio||1,2);w=cv.clientWidth;h=cv.clientHeight;cv.width=w*d;cv.height=h*d;ctx.setTransform(d,0,0,d,0,0);
    pts=Array.from({length:Math.round(Math.min(70,w*h/16000))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3}))};
  const draw=()=>{ctx.clearRect(0,0,w,h);
    for(let i=0;i<pts.length;i++){const a=pts[i];
      if(!still){a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>w)a.vx*=-1;if(a.y<0||a.y>h)a.vy*=-1}
      ctx.fillStyle="rgba(182,255,60,.7)";ctx.beginPath();ctx.arc(a.x,a.y,1.6,0,6.3);ctx.fill();
      for(let j=i+1;j<pts.length;j++){const b=pts[j],d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<120){ctx.strokeStyle=`rgba(139,124,255,${(1-d/120)*.35})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}
      const dm=Math.hypot(a.x-m.x,a.y-m.y);
      if(dm<150){ctx.strokeStyle=`rgba(182,255,60,${(1-dm/150)*.5})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(m.x,m.y);ctx.stroke()}}
  };
  const loop=()=>{draw();if(vis&&!still)raf=requestAnimationFrame(loop)};
  size();draw();
  let t;addEventListener("resize",()=>{clearTimeout(t);t=setTimeout(()=>{size();draw()},150)});
  new IntersectionObserver(([e])=>{vis=e.isIntersecting;cancelAnimationFrame(raf);if(vis&&!still)loop()}).observe(cv);
}

// 2. Typed status line (project names only)
const ty=$("#typed");
if(ty){const L=["agentic RAG workflows","U-Net segmentation on satellite data","vector search over HR documents","ESP32-CAM robots"];
  if(still)ty.textContent=L[0];
  else{let i=0,c=0,del=false;
    const tick=()=>{const s=L[i];ty.textContent=s.slice(0,c);
      if(!del&&c===s.length){del=true;return setTimeout(tick,1600)}
      if(del&&c===0){del=false;i=(i+1)%L.length}
      c+=del?-1:1;setTimeout(tick,del?25:55)};tick()}}

// 3. Card tilt (desktop only)
const g=$("#grid");
if(g&&fine&&!still){
  g.addEventListener("pointermove",e=>{const c=e.target.closest(".card");if(!c)return;const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    c.style.transform=`perspective(1000px) rotateX(${-y*4}deg) rotateY(${x*5}deg) translateY(-6px)`});
  g.addEventListener("pointerout",e=>{const c=e.target.closest(".card");if(c)c.style.transform=""});
}
})();