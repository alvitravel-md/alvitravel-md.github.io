(function(){
  const KEY='alvi_cookie_consent';
  const GA_ID='G-T6BV3XLH2B';

  function getChoice(){
    try{return localStorage.getItem(KEY);}catch(e){return null;}
  }
  function setChoice(value){
    try{localStorage.setItem(KEY,value);}catch(e){}
  }
  function loadAnalytics(){
    if(window.__alviAnalyticsLoaded) return;
    window.__alviAnalyticsLoaded=true;
    window.dataLayer=window.dataLayer||[];
    window.gtag=window.gtag||function(){dataLayer.push(arguments);};
    const s=document.createElement('script');
    s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id='+GA_ID;
    document.head.appendChild(s);
    window.gtag('js',new Date());
    window.gtag('config',GA_ID,{anonymize_ip:true});
  }
  function removeBanner(){
    document.getElementById('alvi-cookie-banner')?.remove();
  }
  function showBanner(){
    if(document.getElementById('alvi-cookie-banner')) return;
    const wrap=document.createElement('div');
    wrap.id='alvi-cookie-banner';
    wrap.setAttribute('role','dialog');
    wrap.setAttribute('aria-live','polite');
    wrap.setAttribute('aria-label','Preferințe cookie');
    wrap.innerHTML=`
      <div class="alvi-cookie-inner">
        <div class="alvi-cookie-copy">
          <strong>Confidențialitatea ta contează</strong>
          <span>Folosim Google Analytics numai dacă accepți cookie-urile de analiză. Cookie-urile strict necesare funcționării site-ului nu pot fi dezactivate. <a href="/cookies.html">Detalii</a></span>
        </div>
        <div class="alvi-cookie-actions">
          <button type="button" data-cookie="reject">Doar necesare</button>
          <button type="button" class="primary" data-cookie="accept">Acceptă analiza</button>
        </div>
      </div>`;
    const style=document.createElement('style');
    style.id='alvi-cookie-style';
    style.textContent=`
      #alvi-cookie-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;font-family:Manrope,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      .alvi-cookie-inner{max-width:1100px;margin:auto;background:#fff;border:1px solid #dce6f0;border-radius:18px;box-shadow:0 18px 60px rgba(7,56,111,.2);padding:18px;display:flex;gap:18px;align-items:center;justify-content:space-between}
      .alvi-cookie-copy{display:flex;flex-direction:column;gap:5px;color:#0d2138}
      .alvi-cookie-copy strong{font-size:15px}.alvi-cookie-copy span{font-size:13px;line-height:1.55;color:#66788d}.alvi-cookie-copy a{color:#0a63c7;font-weight:700}
      .alvi-cookie-actions{display:flex;gap:9px;flex-wrap:wrap;flex-shrink:0}.alvi-cookie-actions button{border:1px solid #dce6f0;background:#fff;color:#0d2138;border-radius:11px;padding:11px 14px;font-weight:800;cursor:pointer}.alvi-cookie-actions .primary{background:#0a63c7;color:#fff;border-color:#0a63c7}
      @media(max-width:760px){.alvi-cookie-inner{align-items:stretch;flex-direction:column}.alvi-cookie-actions{width:100%}.alvi-cookie-actions button{flex:1}}
    `;
    document.head.appendChild(style);
    document.body.appendChild(wrap);
    wrap.querySelector('[data-cookie="accept"]').addEventListener('click',()=>{setChoice('accepted');loadAnalytics();removeBanner();});
    wrap.querySelector('[data-cookie="reject"]').addEventListener('click',()=>{setChoice('rejected');removeBanner();});
  }

  window.AlviCookieConsent={
    open:function(){showBanner();},
    reset:function(){try{localStorage.removeItem(KEY);}catch(e){} showBanner();}
  };

  const choice=getChoice();
  if(choice==='accepted') loadAnalytics();
  else if(!choice) {
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',showBanner,{once:true});
    else showBanner();
  }
})();