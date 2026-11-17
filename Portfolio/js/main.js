const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const page=location.pathname.split("/").pop()||"index.html";
const links=[["Home","index.html"],["About","about.html"],["Projects","projects.html"],["Experience","about.html#experience"],["Contact","contact.html"]];
document.body.insertAdjacentHTML("afterbegin",`<div id="bar"></div><div class="glow" aria-hidden="true"></div><header><nav class="nav" aria-label="Main"><a class="logo" href="index.html">avishek<b>.</b>mondal</a><button id="burger" aria-expanded="false" aria-controls="menu">Menu</button><ul id="menu">${links.map(([n,h])=>`<li><a href="${h}"${h===page?' aria-current="page"':""}>${n}</a></li>`).join("")}</ul><a class="btn" href="projects.html">Explore Projects</a></nav></header>`);
document.body.insertAdjacentHTML("beforeend",`<footer id="contact"><div class="wrap"><h2>Let’s talk</h2><p class="lead">Open to conversations about software, AI and robotics.</p><p><a class="btn" href="contact.html">Get in touch</a> <a class="btn ghost" href="https://github.com/MrAvishek" rel="noopener">GitHub</a> <a class="btn ghost" href="https://www.linkedin.com/in/avishek-mondal-ovi/" rel="noopener">LinkedIn</a></p><p class="ph" style="margin-top:20px"><a href="mailto:amondal.dev@gmail.com">amondal.dev@gmail.com</a></p></div></footer>`);
$("#burger").onclick=e=>{const o=$("#menu").classList.toggle("open");e.target.setAttribute("aria-expanded",o)};
addEventListener("scroll",()=>{$("#bar").style.width=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)*100+"%"},{passive:true});
const still=matchMedia("(prefers-reduced-motion:reduce)").matches;
if(!still&&matchMedia("(pointer:fine)").matches)addEventListener("pointermove",e=>{const g=$(".glow");g.style.left=e.clientX+"px";g.style.top=e.clientY+"px"});
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.15});
$$(".rv").forEach(e=>io.observe(e));
const grid=$("#grid");
if(grid){const P=window.PROJECTS,dlg=$("#dlg"),lim=+grid.dataset.limit||99,cats=["All",...new Set(P.map(p=>p.c))];
grid.innerHTML=P.slice(0,lim).map((p,i)=>`<button class="card" data-c="${p.c}" data-i="${i}">${p.img?`<img class="thumb" src="${p.img}" alt="${p.t} screenshot" width="600" height="375" loading="lazy">`:""}<small>${p.c}</small><h3>${p.t}</h3><p>${p.d.slice(0,110)}…</p><div class="tags">${p.k.slice(0,3).map(k=>`<span>${k}</span>`).join("")}</div></button>`).join("");
const fl=$("#filters");
if(fl){fl.innerHTML=cats.map((c,i)=>`<button aria-pressed="${!i}">${c}</button>`).join("");
fl.onclick=e=>{const b=e.target.closest("button");if(!b)return;$$("button",fl).forEach(x=>x.setAttribute("aria-pressed",x===b));$$(".card",grid).forEach(c=>{const s=b.textContent==="All"||c.dataset.c===b.textContent;c.classList.toggle("hide",!s);c.classList.remove("in");if(s)requestAnimationFrame(()=>c.classList.add("in"))})}}
grid.onclick=e=>{const c=e.target.closest(".card");if(!c)return;const p=P[c.dataset.i];
$("#dbody").innerHTML=`${p.img?`<img class="dimg" src="${p.img}" alt="${p.t} screenshot" loading="lazy">`:""}<small style="color:var(--cy)">${p.c}</small><h3 style="font-size:1.6rem">${p.t}</h3><p style="color:var(--mut);margin:10px 0">${p.d}</p>${p.f.length?`<div class="flow" aria-label="Workflow">${p.f.map(s=>`<span>${s}</span>`).join("<em>→</em>")}</div>`:""}<div class="tags">${p.k.map(k=>`<span>${k}</span>`).join("")}</div><p style="margin-top:20px"><a class="btn" href="${p.g}" rel="noopener">View on GitHub</a> ${p.demo?`<a class="btn ghost" href="${p.demo}" rel="noopener">Watch demo</a> `:""}<button class="btn ghost" id="x">Close</button></p>`;dlg.showModal();$("#x").onclick=()=>dlg.close()};
dlg.onclick=e=>{if(e.target===dlg)dlg.close()}}
