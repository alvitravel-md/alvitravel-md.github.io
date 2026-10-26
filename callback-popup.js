/* AlviTravel callback popup — isolated from chat */
(() => {
  const css = `
  .alvi-pop-backdrop{position:fixed;inset:0;background:rgba(6,20,41,.64);backdrop-filter:blur(5px);z-index:2147482000;display:none;align-items:center;justify-content:center;padding:20px}
  .alvi-pop-backdrop.is-open{display:flex}
  .alvi-pop-card{position:relative;width:min(100%,440px);max-height:calc(100dvh - 32px);overflow:auto;background:#fff;border-radius:25px;box-shadow:0 30px 90px rgba(0,0,0,.28);font-family:Manrope,Arial,sans-serif;color:#193453}
  .alvi-pop-head{padding:35px 30px 28px;background:linear-gradient(120deg,#0067cc,#19b2c0);color:white;position:relative;overflow:hidden}
  .alvi-pop-head::after{content:'✈';position:absolute;right:22px;bottom:-38px;font-size:150px;opacity:.12;transform:rotate(-22deg)}
  .alvi-pop-head img{display:block;width:62px;height:62px;object-fit:contain;background:white;padding:7px;border-radius:18px;margin-bottom:15px}
  .alvi-pop-head h2{font-size:26px;line-height:1.15;margin:0 35px 10px 0;color:#fff}
  .alvi-pop-head p{font-size:14px;line-height:1.55;margin:0;color:#edfaff}
  .alvi-pop-close{position:absolute;right:15px;top:13px;width:40px;height:40px;border:0;border-radius:50%;background:#ffffff30;color:#fff;font-size:26px;cursor:pointer;z-index:2}
  .alvi-pop-form{padding:28px 30px 30px;display:grid;gap:13px}
  .alvi-pop-form label{font-size:13px;font-weight:700}
  .alvi-pop-form input[type=text],.alvi-pop-form input[type=tel]{width:100%;box-sizing:border-box;height:49px;padding:0 15px;border:1px solid #dce5ef;border-radius:13px;background:#f7f9fc;color:#172b47;font:inherit;font-size:15px;outline-offset:2px}
  .alvi-pop-consent{display:flex;align-items:flex-start;gap:10px;font-size:11px;line-height:1.55;color:#62728a}
  .alvi-pop-consent input{margin-top:3px;accent-color:#0078d8}
  .alvi-pop-submit{background:linear-gradient(110deg,#1163d8,#0ab7bd);border:0;color:#fff;font:inherit;font-weight:800;padding:16px;border-radius:14px;cursor:pointer}
  .alvi-pop-submit:disabled{opacity:.65;cursor:wait}
  .alvi-pop-status{min-height:19px;margin:0;font-size:12px}
  @media(max-width:480px){.alvi-pop-backdrop{padding:12px}.alvi-pop-card{border-radius:20px}.alvi-pop-head{padding:27px 22px}.alvi-pop-form{padding:22px}.alvi-pop-head h2{font-size:22px}}
  @media(prefers-reduced-motion:reduce){.alvi-pop-backdrop{backdrop-filter:none}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
  const overlay=document.createElement('div');
  overlay.className='alvi-pop-backdrop';overlay.id='alviConsultationPopup';
  overlay.innerHTML=`<section class="alvi-pop-card" role="dialog" aria-modal="true" aria-labelledby="alviPopTitle">
    <div class="alvi-pop-head"><button class="alvi-pop-close" type="button" aria-label="Închide">×</button>
      <img src="/logo.png" alt="AlviTravel">
      <h2 id="alviPopTitle">Lasă-ne numărul tău</h2>
      <p>Un consultant AlviTravel te va contacta pentru a găsi vacanța perfectă.</p>
    </div>
    <form class="alvi-pop-form" id="alviPopForm">
      <label for="alviPopName">Nume și prenume</label>
      <input id="alviPopName" type="text" name="name" placeholder="Nume Prenume" autocomplete="name" maxlength="100" required>
      <label for="alviPopPhone">Număr de telefon</label>
      <input id="alviPopPhone" type="tel" name="phone" placeholder="+373 6x xxx xxx" autocomplete="tel" inputmode="tel" minlength="8" maxlength="22" pattern="[+0-9 ()-]{8,22}" required>
      <label class="alvi-pop-consent"><input type="checkbox" required><span>Sunt de acord ca AlviTravel să prelucreze numele și numărul meu pentru a mă contacta privind această solicitare.</span></label>
      <button class="alvi-pop-submit" type="submit">Vreau consultație →</button>
      <p class="alvi-pop-status" role="status" aria-live="polite"></p>
    </form>
  </section>`;
  document.body.appendChild(overlay);
  const form=overlay.querySelector('form');
  const status=overlay.querySelector('.alvi-pop-status');
  const close=()=>{overlay.classList.remove('is-open');document.body.style.removeProperty('overflow');sessionStorage.setItem('alvi-popup-dismissed','1')};
  overlay.querySelector('.alvi-pop-close').addEventListener('click',close);
  overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('is-open'))close()});
  const open=()=>{if(overlay.classList.contains('is-open'))return;overlay.classList.add('is-open');document.body.style.overflow='hidden';overlay.querySelector('.alvi-pop-close').focus()};
  window.openAlviConsultation=open;
  form.addEventListener('submit',async e=>{
    e.preventDefault();if(!form.reportValidity())return;
    const endpoint=window.ALVI_LEAD_ENDPOINT||'';
    if(!endpoint){status.textContent='Serviciul nu este disponibil momentan. Sună la 060 88 44 46.';return}
    const name=form.elements.name.value.trim(),phone=form.elements.phone.value.trim();
    if(!name||!phone)return;
    const button=form.querySelector('button[type=submit]');button.disabled=true;button.textContent='Se trimite…';status.textContent='';
    try{
      const payload=new URLSearchParams({siteKey:'alvitravel-web-2026',name,phone,destination:'',date:'',adults:'0',children:'0',childAges:'',budget:'',message:'Solicitare consultație din popup',source:'callback-popup'});
      await fetch(endpoint,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:payload.toString(),keepalive:true});
      status.textContent='Cererea a fost transmisă. Te vom contacta cât mai curând.';
      button.textContent='Trimis ✓';form.reset();sessionStorage.setItem('alvi-popup-dismissed','1');
      setTimeout(()=>{overlay.classList.remove('is-open');document.body.style.removeProperty('overflow')},2300);
    }catch(err){status.textContent='Nu am putut trimite cererea. Încearcă din nou.';button.disabled=false;button.textContent='Vreau consultație →'}
  });
  const show=()=>{if(sessionStorage.getItem('alvi-popup-dismissed')||sessionStorage.getItem('alvi-popup-shown'))return;sessionStorage.setItem('alvi-popup-shown','1');open()};
  setTimeout(show,12000);
})();
