(()=>{
const fine=matchMedia("(pointer:fine)").matches;
if(!fine)return;
// Cursor spotlight on cards
document.querySelectorAll(".spot").forEach(el=>el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect();el.style.setProperty("--mx",e.clientX-r.left+"px");el.style.setProperty("--my",e.clientY-r.top+"px")}));
})();