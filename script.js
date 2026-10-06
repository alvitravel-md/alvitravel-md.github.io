function trackEvent(name,params={}){
  if(typeof window.gtag==='function') window.gtag('event',name,params);
}

document.addEventListener('click',e=>{
  const a=e.target.closest('a');
  if(!a) return;
  const href=a.getAttribute('href')||'';
  if(href.startsWith('https://wa.me/')) trackEvent('whatsapp_click',{link_url:href,link_text:(a.textContent||'').trim()});
  else if(href.startsWith('tel:')) trackEvent('phone_click',{phone_number:href.replace('tel:','')});
  else if(href.includes('instagram.com/alvitravel.agency')) trackEvent('instagram_click',{link_url:href});
  else if(href.startsWith('mailto:')) trackEvent('email_click',{email:href.replace('mailto:','')});
});

const menuBtn=document.getElementById('menuBtn');
const nav=document.getElementById('nav');
if(menuBtn){
  menuBtn.setAttribute('aria-label','Deschide meniul');
  menuBtn.setAttribute('aria-controls','nav');
  menuBtn.setAttribute('aria-expanded','false');
  menuBtn.addEventListener('click',()=>{
    const open=nav?.classList.toggle('open')||false;
    menuBtn.setAttribute('aria-expanded',String(open));
    menuBtn.setAttribute('aria-label',open?'Închide meniul':'Deschide meniul');
  });
}
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>{
  nav?.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded','false');
  menuBtn?.setAttribute('aria-label','Deschide meniul');
}));

const year=document.getElementById('year');
if(year) year.textContent=new Date().getFullYear();

function scrollToBooking(dest='',offer=''){
  const d=document.getElementById('destination');
  const m=document.getElementById('message');
  if(d&&dest) d.value=dest;
  if(m&&offer) m.value=`Sunt interesat(ă) de oferta: ${offer}.`;
  document.getElementById('booking')?.scrollIntoView({behavior:'smooth',block:'start'});
}
document.querySelectorAll('.offer-trigger').forEach(btn=>btn.addEventListener('click',()=>scrollToBooking(btn.dataset.dest,'')));
document.querySelectorAll('.book-offer').forEach(btn=>btn.addEventListener('click',()=>scrollToBooking(btn.dataset.dest||'',btn.dataset.offer||'')));

const quickForm=document.getElementById('quickForm');
quickForm?.addEventListener('submit',e=>{
  e.preventDefault();
  const d=document.getElementById('qDestination')?.value||'';
  const dt=document.getElementById('qDate')?.value||'';
  const p=document.getElementById('qPeople')?.value||'2';
  const b=document.getElementById('qBudget')?.value||'';
  trackEvent('quick_search_submit',{destination:d,people:p,budget:b});
  const destination=document.getElementById('destination');
  const date=document.getElementById('date');
  const adults=document.getElementById('adults');
  const budget=document.getElementById('budget');
  if(destination) destination.value=d;
  if(date) date.value=dt;
  if(adults) adults.value=p==='5+'?5:p;
  if(budget) budget.value=b;
  document.getElementById('booking')?.scrollIntoView({behavior:'smooth',block:'start'});
});

const bookingForm=document.getElementById('bookingForm');
bookingForm?.addEventListener('submit',e=>{
  e.preventDefault();
  const name=document.getElementById('name')?.value.trim()||'';
  const phone=document.getElementById('phone')?.value.trim()||'';
  const destination=document.getElementById('destination')?.value||'';
  const date=document.getElementById('date')?.value||'flexibilă';
  const adults=document.getElementById('adults')?.value||'1';
  const children=document.getElementById('children')?.value||'0';
  const budget=document.getElementById('budget')?.value||'nespecificat';
  const message=document.getElementById('message')?.value.trim()||'-';
  trackEvent('lead_submit',{destination,adults:Number(adults)||0,children:Number(children)||0});
  const text=`Bună ziua, AlviTravel!\n\nDoresc o ofertă de vacanță.\nNume: ${name}\nTelefon: ${phone}\nDestinație: ${destination}\nData: ${date}\nAdulți: ${adults}\nCopii: ${children}\nBuget: ${budget}\nDetalii: ${message}`;
  window.open(`https://wa.me/37368004449?text=${encodeURIComponent(text)}`,'_blank','noopener');
});

function applyBookingUrlState(){
  const params=new URLSearchParams(window.location.search);
  const preDest=params.get('destination');
  const destinationSelect=document.getElementById('destination');
  if(preDest&&destinationSelect){
    const match=[...destinationSelect.options].find(o=>o.value.toLowerCase()===preDest.toLowerCase());
    if(match) destinationSelect.value=match.value;
  }
  if(window.location.hash==='#booking'){
    requestAnimationFrame(()=>setTimeout(()=>document.getElementById('booking')?.scrollIntoView({behavior:'smooth',block:'start'}),220));
  }
}
applyBookingUrlState();
window.addEventListener('load',applyBookingUrlState);

const translations={
  en:{reserve:'Book now',heroTitle:'Holidays from Chișinău with AlviTravel',heroText:'Turkey • Greece • Egypt • Excursions departing from Chișinău. We find the right holiday for your budget, dates and travel style.'},
  ru:{reserve:'Забронировать',heroTitle:'Отдых из Кишинёва с AlviTravel',heroText:'Турция • Греция • Египет • Экскурсии с вылетом из Кишинёва. Подберем отдых под ваш бюджет, даты и предпочтения.'},
  ro:{reserve:'Rezervă acum',heroTitle:'Vacanțe din Chișinău cu AlviTravel',heroText:'Turcia • Grecia • Egipt • Excursii cu plecare din Chișinău. Găsim vacanța potrivită pentru bugetul, perioada și stilul tău de călătorie.'}
};
const lang=document.getElementById('lang');
lang?.addEventListener('change',e=>{
  const t=translations[e.target.value];
  if(!t) return;
  const reserve=document.querySelector('.nav-actions .btn-small');
  if(reserve) reserve.textContent=t.reserve;
  const title=document.querySelector('.hero h1');
  if(title) title.innerHTML=t.heroTitle.replace('AlviTravel','<span>AlviTravel</span>');
  const heroP=document.querySelector('.hero p');
  if(heroP) heroP.textContent=t.heroText;
});

function openGmailApp(event){
  if(event) event.preventDefault();
  trackEvent('email_click',{email:'alvitravel.agency@gmail.com'});
  const email='alvitravel.agency@gmail.com';
  const ua=navigator.userAgent||navigator.vendor||window.opera||'';
  if(/Android/i.test(ua)){
    window.location.href='intent://co?to='+encodeURIComponent(email)+'#Intent;scheme=googlegmail;package=com.google.android.gm;end';
    return false;
  }
  if(/iPhone|iPad|iPod/i.test(ua)){
    window.location.href='googlegmail://co?to='+encodeURIComponent(email);
    setTimeout(()=>{window.location.href='mailto:'+email;},1200);
    return false;
  }
  window.location.href='mailto:'+email;
  return false;
}

function ensureLegalLinks(){
  document.querySelectorAll('footer .footer-inner').forEach(footer=>{
    if(footer.querySelector('.legal-links')) return;
    const navEl=document.createElement('nav');
    navEl.className='legal-links';
    navEl.setAttribute('aria-label','Informații legale');
    navEl.innerHTML='<a href="/confidentialitate.html">Confidențialitate</a><a href="/cookies.html">Cookies</a><a href="/termeni.html">Termeni</a><button type="button" class="legal-cookie-btn">Setări cookies</button>';
    footer.appendChild(navEl);
    navEl.querySelector('.legal-cookie-btn')?.addEventListener('click',()=>window.AlviCookieConsent?.reset());
  });
}

function improveFormAccessibility(){
  const map=[
    ['qDestination','Destinație'],['qDate','Data plecării'],['qPeople','Număr persoane'],['qBudget','Buget'],
    ['name','Nume'],['phone','Telefon'],['destination','Destinație'],['date','Perioada'],
    ['adults','Adulți'],['children','Copii'],['budget','Buget aproximativ'],['message','Mesaj']
  ];
  map.forEach(([id,labelText])=>{
    const el=document.getElementById(id);
    if(!el) return;
    const label=el.closest('.field')?.querySelector('label');
    if(label) label.setAttribute('for',id);
    if(!el.getAttribute('name')) el.setAttribute('name',id);
    if(!el.getAttribute('aria-label')) el.setAttribute('aria-label',labelText);
  });
  document.getElementById('name')?.setAttribute('autocomplete','name');
  document.getElementById('phone')?.setAttribute('autocomplete','tel');
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',()=>{ensureLegalLinks();improveFormAccessibility();},{once:true});
}else{
  ensureLegalLinks();
  improveFormAccessibility();
}
