(()=>{
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
// Copy buttons
$$(".copy").forEach(b=>b.addEventListener("click",async()=>{
  try{await navigator.clipboard.writeText(b.dataset.copy);b.textContent="Copied";b.classList.add("done");
    setTimeout(()=>{b.textContent="Copy";b.classList.remove("done")},1800)}catch{b.textContent="Press Ctrl+C"}}));
// Spotlight (desktop pointers)
if(matchMedia("(pointer:fine)").matches)$$(".spot").forEach(el=>el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect();el.style.setProperty("--mx",e.clientX-r.left+"px");el.style.setProperty("--my",e.clientY-r.top+"px")}));
// Netlify Forms via fetch, with a mailto fallback if the request fails (for example locally)
const f=$(".contact-form"),s=$("#status");
if(f){
  if(location.search.includes("sent=1")){s.textContent="Thanks, your message was sent.";s.className="form-status ok"}
  f.addEventListener("submit",async e=>{e.preventDefault();const b=$(".btn",f);b.disabled=true;s.className="form-status";s.textContent="Sending…";
    try{const r=await fetch("/",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams(new FormData(f)).toString()});
      if(!r.ok)throw 0;f.reset();s.textContent="Thanks, your message was sent.";s.className="form-status ok"}
    catch{s.innerHTML='Could not send. Email me directly at <a href="mailto:amondal.dev@gmail.com">amondal.dev@gmail.com</a>.';s.className="form-status err"}
    b.disabled=false})}
})();