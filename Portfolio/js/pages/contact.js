
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
  const b=$(".send-btn",f),label=$(".send-label",f);
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  let resetTimer;

  // Button states: idle, sending (spinner), sent (tick), error.
  // "sent" and "error" return to idle after a few seconds.
  const setState=(state,text)=>{
    b.dataset.state=state;
    label.textContent=text;
    f.classList.toggle("sent",state==="sent");
    clearTimeout(resetTimer);
    if(state==="sent"||state==="error")
      resetTimer=setTimeout(()=>setState("idle","Send message"),4000);
  };

  const showSent=()=>{
    f.reset();
    s.textContent="Thanks, your message was sent.";
    s.className="form-status ok";
    setState("sent","Message sent");
  };

  f.addEventListener("submit",async e=>{
    e.preventDefault();

    const fd=new FormData(f);

    // Honeypot: bots fill this field, real users leave it empty
    if(fd.get("bot-field")){
      showSent();
      return;
    }

    b.disabled=true;
    setState("sending","Sending…");

    s.className="form-status";
    s.textContent="Sending your message…";

    // Prepare Google Forms submission
    const body=new FormData();

    body.append(ENTRY.name,fd.get("name"));
    body.append(ENTRY.email,fd.get("email"));
    body.append(ENTRY.message,fd.get("message"));

    try{
      // Submit to Google Forms
      // no-cors prevents reading Google's response.
      // The short wait keeps the spinner on screen long enough to register.
      await Promise.all([
        fetch(GOOGLE_URL,{
          method:"POST",
          mode:"no-cors",
          body:body
        }),
        wait(700)
      ]);

      showSent();

    }catch(error){
      s.innerHTML="Could not send. "+MAIL;
      s.className="form-status err";
      setState("error","Try again");
    }

    b.disabled=false;
  });
}
})();
