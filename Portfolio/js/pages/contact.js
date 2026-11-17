
(()=>{
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];

// Copy buttons
$$(".copy").forEach(b=>b.addEventListener("click",async()=>{
  try{
    await navigator.clipboard.writeText(b.dataset.copy);
    b.textContent="Copied";
    b.classList.add("done");

    setTimeout(()=>{
      b.textContent="Copy";
      b.classList.remove("done")
    },1800)
  }catch{
    b.textContent="Press Ctrl+C"
  }
}));

// Spotlight (desktop pointers)
if(matchMedia("(pointer:fine)").matches)
  $$(".spot").forEach(el=>el.addEventListener("pointermove",e=>{
    const r=el.getBoundingClientRect();
    el.style.setProperty("--mx",e.clientX-r.left+"px");
    el.style.setProperty("--my",e.clientY-r.top+"px")
  }));

// Google Forms integration
const GOOGLE_URL="https://docs.google.com/forms/d/e/1FAIpQLSe_Yg71A_0Dr1aON4exGV9zBtlJR3IfJjZpomS3R-1nj3sMEQ/formResponse";

const ENTRY={
  name:"entry.599346107",
  email:"entry.1602260867",
  message:"entry.13142223"
};

const MAIL='Email me directly at <a href="mailto:amondal.dev@gmail.com">amondal.dev@gmail.com</a>.';

// Contact form
const f=$(".contact-form"),s=$("#status");

if(f){
  f.addEventListener("submit",async e=>{
    e.preventDefault();

    const fd=new FormData(f);

    // Honeypot: bots fill this field, real users leave it empty
    if(fd.get("bot-field")){
      f.reset();
      s.textContent="Thanks, your message was sent.";
      s.className="form-status ok";
      return;
    }

    const b=$(".btn",f);
    b.disabled=true;

    s.className="form-status";
    s.textContent="Sending…";

    // Prepare Google Forms submission
    const body=new FormData();

    body.append(ENTRY.name,fd.get("name"));
    body.append(ENTRY.email,fd.get("email"));
    body.append(ENTRY.message,fd.get("message"));

    try{
      // Submit to Google Forms
      // no-cors prevents reading Google's response
      await fetch(GOOGLE_URL,{
        method:"POST",
        mode:"no-cors",
        body:body
      });

      f.reset();
      s.textContent="Thanks, your message was sent.";
      s.className="form-status ok";

    }catch(error){
      s.innerHTML="Could not send. "+MAIL;
      s.className="form-status err";
    }

    b.disabled=false;
  });
}
})();
