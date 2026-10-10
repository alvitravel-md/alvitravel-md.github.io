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
document.addEventListener('click',e=>{
  if(!nav?.classList.contains('open')) return;
  if(nav.contains(e.target)||menuBtn?.contains(e.target)) return;
  nav.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded','false');
  menuBtn?.setAttribute('aria-label','Deschide meniul');
});
document.addEventListener('keydown',e=>{
  if(e.key!=='Escape'||!nav?.classList.contains('open')) return;
  nav.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded','false');
  menuBtn?.setAttribute('aria-label','Deschide meniul');
  menuBtn?.focus();
});

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
document.querySelectorAll('.book-offer,.excursion-trigger').forEach(btn=>btn.addEventListener('click',()=>scrollToBooking(btn.dataset.dest||'',btn.dataset.offer||'')));
document.querySelectorAll('.group-book').forEach(btn=>btn.addEventListener('click',()=>{
  const message=document.getElementById('message');
  if(message) message.value=btn.dataset.group||'Cerere ofertă pentru grup';
}));

document.querySelectorAll('.service-prefill').forEach(btn=>btn.addEventListener('click',()=>{
  const d=document.getElementById('destination');
  const m=document.getElementById('message');
  const wanted=btn.dataset.dest||'Nu sunt sigur';
  if(d){
    const match=[...d.options].find(o=>o.value===wanted);
    if(match) d.value=match.value;
  }
  if(m) m.value=btn.dataset.message||'';
  document.getElementById('booking')?.scrollIntoView({behavior:'smooth',block:'start'});
  setTimeout(()=>document.getElementById('name')?.focus({preventScroll:true}),420);
}));

const callbackForm=document.getElementById('callbackForm');
callbackForm?.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!callbackForm.reportValidity()) return;
  const phone=document.getElementById('callbackPhone')?.value.trim()||'';
  const endpoint=(window.ALVI_LEAD_ENDPOINT||'').trim();
  const button=callbackForm.querySelector('button[type="submit"]');
  const small=callbackForm.querySelector('small');
  if(!phone||!endpoint) return;
  if(button){button.disabled=true;button.textContent='Se trimite…';}
  try{
    const payload=new URLSearchParams({
      siteKey:'alvitravel-web-2026',
      type:'callback',
      phone
    });
    await fetch(endpoint,{
      method:'POST',
      mode:'no-cors',
      headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},
      body:payload.toString(),
      keepalive:true
    });
    callbackForm.reset();
    if(button) button.textContent='Trimis ✓';
    if(small) small.textContent='Numărul a fost trimis. Te contactăm cât mai curând.';
    trackEvent('callback_saved',{source:'homepage'});
    setTimeout(()=>{
      if(button){button.disabled=false;button.textContent='Vreau să fiu sunat';}
    },2200);
  }catch(err){
    console.error('Callback endpoint unavailable',err);
    if(button){button.disabled=false;button.textContent='Încearcă din nou';}
    if(small) small.textContent='Nu am putut trimite numărul. Încearcă din nou.';
    trackEvent('callback_save_error',{source:'homepage'});
  }
});
document.querySelectorAll('.destination-card[data-destination]').forEach(card=>card.addEventListener('click',()=>{
  const d=document.getElementById('destination');
  if(!d) return;
  const wanted=card.dataset.destination||'';
  const match=[...d.options].find(o=>o.value===wanted);
  if(match) d.value=match.value;
}));

const quickForm=document.getElementById('quickForm');
quickForm?.addEventListener('submit',e=>{
  e.preventDefault();
  const d=document.getElementById('qDestination')?.value||'Nu sunt sigur';
  const transport=document.getElementById('qTransport')?.value||'Oricare';
  const dt=document.getElementById('qDate')?.value||'';
  const p=Math.max(1,parseInt(document.getElementById('qPeople')?.value||'2',10)||2);
  const b=document.getElementById('qBudget')?.value||'';
  trackEvent('quick_search_submit',{destination:d,transport,people:p,budget:b||'nespecificat'});
  const destination=document.getElementById('destination');
  const match=destination?[...destination.options].find(o=>o.value===d):null;
  if(match) destination.value=match.value;
  const date=document.getElementById('date'); if(date) date.value=dt;
  const adults=document.getElementById('adults'); if(adults) adults.value=String(p);
  const budget=document.getElementById('budget'); if(budget&&b) budget.value=b;
  const message=document.getElementById('message');
  if(message&&transport&&transport!=='Oricare'&&!message.value.trim()) message.value='Transport preferat: '+transport;
  document.getElementById('booking')?.scrollIntoView({behavior:'smooth',block:'start'});
  setTimeout(()=>document.getElementById('name')?.focus({preventScroll:true}),450);
});

const childrenInput=document.getElementById('children');
const childrenAgesWrap=document.getElementById('childrenAgesWrap');
const childrenAgesList=document.getElementById('childrenAgesList');

function getSelectedChildAges(){
  return [...(childrenAgesList?.querySelectorAll('select[data-child-age]')||[])].map(select=>select.value);
}
function renderChildAgeFields(){
  if(!childrenInput||!childrenAgesWrap||!childrenAgesList) return;
  const previous=getSelectedChildAges();
  const count=Math.max(0,Math.min(10,parseInt(childrenInput.value,10)||0));
  childrenInput.value=String(count);
  childrenAgesList.innerHTML='';
  if(count===0){
    childrenAgesWrap.hidden=true;
    return;
  }
  childrenAgesWrap.hidden=false;
  for(let i=0;i<count;i++){
    const field=document.createElement('div');
    field.className='field child-age-field';
    const label=document.createElement('label');
    label.htmlFor=`childAge${i+1}`;
    label.textContent=`Vârsta copilului ${i+1}`;
    const select=document.createElement('select');
    select.id=`childAge${i+1}`;
    select.name=`childAge${i+1}`;
    select.dataset.childAge=String(i+1);
    select.required=true;
    select.setAttribute('aria-label',`Vârsta copilului ${i+1}`);
    const placeholder=document.createElement('option');
    placeholder.value='';
    placeholder.textContent='Selectează vârsta';
    placeholder.disabled=true;
    placeholder.selected=!previous[i];
    select.appendChild(placeholder);
    for(let age=0;age<=17;age++){
      const option=document.createElement('option');
      option.value=String(age);
      option.textContent=age===0?'Sub 1 an':age===1?'1 an':`${age} ani`;
      if(previous[i]===String(age)) option.selected=true;
      select.appendChild(option);
    }
    field.append(label,select);
    childrenAgesList.appendChild(field);
  }
}
childrenInput?.addEventListener('input',renderChildAgeFields);
childrenInput?.addEventListener('change',renderChildAgeFields);
renderChildAgeFields();

const bookingForm=document.getElementById('bookingForm');
const bookingResult=document.getElementById('bookingResult');
const bookingWhatsApp=document.getElementById('bookingWhatsApp');
const bookingEmail=document.getElementById('bookingEmail');
const bookingEdit=document.getElementById('bookingEdit');

bookingForm?.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!bookingForm.reportValidity()) return;
  if(document.getElementById('website')?.value) return;
  const name=document.getElementById('name')?.value.trim()||'';
  const phone=document.getElementById('phone')?.value.trim()||'';
  const destination=document.getElementById('destination')?.value||'';
  const date=document.getElementById('date')?.value||'flexibilă';
  const adults=document.getElementById('adults')?.value||'1';
  const children=document.getElementById('children')?.value||'0';
  const childAges=getSelectedChildAges();
  const budget=document.getElementById('budget')?.value||'nespecificat';
  const message=document.getElementById('message')?.value.trim()||'-';
  const source=new URLSearchParams(window.location.search).get('utm_source')||document.referrer||window.location.pathname;
  const endpoint=(window.ALVI_LEAD_ENDPOINT||'').trim();
  if(endpoint){
    const payload=new URLSearchParams({
      siteKey:'alvitravel-web-2026',
      website:document.getElementById('website')?.value||'',
      name,phone,destination,date,
      adults:String(Number(adults)||0),
      children:String(Number(children)||0),
      childAges:childAges.join(', '),
      budget,message,source
    });
    try{
      await fetch(endpoint,{
        method:'POST',
        mode:'no-cors',
        headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},
        body:payload.toString(),
        keepalive:true
      });
      trackEvent('lead_saved',{destination});
    }catch(err){
      console.error('Lead endpoint unavailable',err);
      trackEvent('lead_save_error',{destination});
    }
  }
  trackEvent('lead_prepare',{destination,adults:Number(adults)||0,children:Number(children)||0});
  const childAgesLine=childAges.length?`\nVârste copii: ${childAges.map((age,index)=>`Copil ${index+1}: ${age==='0'?'sub 1 an':age+' ani'}`).join(', ')}`:'';
  const text=`Bună ziua, AlviTravel!\n\nDoresc o ofertă de vacanță.\nNume: ${name}\nTelefon: ${phone}\nDestinație: ${destination}\nData: ${date}\nAdulți: ${adults}\nCopii: ${children}${childAgesLine}\nBuget: ${budget}\nDetalii: ${message}`;
  if(bookingWhatsApp) bookingWhatsApp.href=`https://wa.me/37368004449?text=${encodeURIComponent(text)}`;
  if(bookingEmail) bookingEmail.href=`mailto:alvitravel.agency@gmail.com?subject=${encodeURIComponent('Cerere ofertă AlviTravel — '+destination)}&body=${encodeURIComponent(text)}`;
  bookingForm.hidden=true;
  if(bookingResult) bookingResult.hidden=false;
  bookingResult?.scrollIntoView({behavior:'smooth',block:'center'});
});

bookingEdit?.addEventListener('click',()=>{
  if(bookingResult) bookingResult.hidden=true;
  if(bookingForm) bookingForm.hidden=false;
  bookingForm?.scrollIntoView({behavior:'smooth',block:'center'});
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

const pageTranslations={
  en:{
    '🇹🇷 Turcia':'🇹🇷 Turkey','🇬🇷 Grecia':'🇬🇷 Greece','🇪🇬 Egipt':'🇪🇬 Egypt','Blog':'Blog','Despre noi':'About us','Recenzii':'Reviews','Contact':'Contact','Rezervă acum':'Book now','☰':'☰',
    '✈ Din 2015 • Chișinău':'✈ Since 2015 • Chișinău','Vacanțe din Chișinău cu':'Holidays from Chișinău with',
    'Turcia • Grecia • Egipt • Excursii cu plecare din Chișinău. Găsim vacanța potrivită pentru bugetul, perioada și stilul tău de călătorie.':'Turkey • Greece • Egypt • Tours departing from Chișinău. We find the right trip for your budget, dates and travel style.',
    'Vezi ofertele':'View offers','Cere o ofertă':'Request an offer','Alege mai repede':'Choose faster','Ce fel de călătorie cauți?':'What kind of trip are you looking for?','Vacanțe la mare':'Beach holidays','Pentru grupuri':'For groups','Ajută-mă să aleg':'Help me choose','plus oferte personalizate':'plus custom offers','comunicare în 3 limbi':'communication in 3 languages','Te sunăm noi':'We call you','Preferi să vorbești direct cu un consultant?':'Prefer to speak directly with a consultant?','Introdu numărul, iar noi îți pregătim cererea de apel. O confirmi în formular înainte ca datele să fie folosite.':'Enter your number and we will prepare a callback request. You confirm it in the form before your data is used.','Vreau să fiu sunat':'Call me','Nu trimitem datele fără confirmarea ta.':'We do not send your data without your confirmation.','☎ Sună':'☎ Call','experiență':'experience','răspuns rapid':'fast reply',
    'Destinație':'Destination','Transport':'Transport','Data plecării':'Departure date','Persoane':'Travellers','Buget':'Budget','Găsește vacanța':'Find my holiday','Cere preț actual':'Request current price',
    '🇹🇷 Turcia':'🇹🇷 Turkey','🇬🇷 Grecia':'🇬🇷 Greece','🇪🇬 Egipt':'🇪🇬 Egypt','🇧🇬 Bulgaria':'🇧🇬 Bulgaria','🇲🇪 Muntenegru':'🇲🇪 Montenegro','🇷🇴 România':'🇷🇴 Romania','🇪🇸 Spania':'🇪🇸 Spain','🇮🇹 Italia':'🇮🇹 Italy','🇫🇷 Franța':'🇫🇷 France',
    'Excursie':'Tour','Nu sunt sigur':'Not sure','Oricare':'Any','Avion':'Plane','Autocar':'Coach','până la €500':'up to €500',
    'Consultanță rapidă':'Fast consultation','WhatsApp & telefon':'WhatsApp & phone','Vacanțe personalizate':'Tailored holidays','după buget și stil':'by budget and style','Suport pe traseu':'Travel support','înainte și în vacanță':'before and during your trip','30 recenzii Google ↗':'30 Google reviews ↗',
    'Destinații populare':'Popular destinations','9 destinații pentru mare, munte și city break':'9 destinations for seaside, mountains and city breaks','AlviTravel poate organiza vacanțe oriunde. Alege una dintre destinațiile de mai jos sau cere o ofertă pentru orice alt loc.':'AlviTravel can arrange holidays anywhere. Choose one of the destinations below or request an offer for any other place.',
    '🇹🇷 ✈️ Zbor din Chișinău':'🇹🇷 ✈️ Flight from Chișinău','🇬🇷 ✈️ Zbor din Chișinău':'🇬🇷 ✈️ Flight from Chișinău','🇪🇬 ✈️ Zbor din Chișinău':'🇪🇬 ✈️ Flight from Chișinău','🇧🇬 🚌 / ✈️ din Chișinău':'🇧🇬 🚌 / ✈️ from Chișinău','🇲🇪 ✈️ Adriatica':'🇲🇪 ✈️ Adriatic','🇷🇴 🚌 / 🚗 aproape':'🇷🇴 🚌 / 🚗 nearby','🇪🇸 ✈️ City break & mare':'🇪🇸 ✈️ City break & sea','🇮🇹 ✈️ Orașe & coastă':'🇮🇹 ✈️ Cities & coast','🇫🇷 ✈️ City break & Riviera':'🇫🇷 ✈️ City break & Riviera',
    'All Inclusive':'All Inclusive','Soare & mare':'Sun & sea','Soare tot anul':'Year-round sun','Mare & familie':'Sea & family','Mare & munte':'Sea & mountains','Munte & city break':'Mountains & city break','Mediterranean':'Mediterranean','City break & mare':'City break & sea','Orașe & coastă':'Cities & coast',
    'Explorează Turcia →':'Explore Turkey →','Explorează Grecia →':'Explore Greece →','Explorează Egipt →':'Explore Egypt →','Cere ofertă →':'Request offer →',
    'Nisipurile de Aur • Sunny Beach • Nessebar':'Golden Sands • Sunny Beach • Nessebar','Brașov • Sinaia • București • Constanța':'Brașov • Sinaia • Bucharest • Constanța','Roma • Amalfi • Sicilia • Milano':'Rome • Amalfi • Sicily • Milan','Paris • Nisa • Coasta de Azur':'Paris • Nice • French Riviera',
    'Excursii din Chișinău':'Tours from Chișinău','3 idei populare pentru o zi memorabilă':'3 popular ideas for a memorable day','Traseele, datele și transportul se confirmă la cerere în funcție de disponibilitate.':'Routes, dates and transport are confirmed on request, subject to availability.',
    '🍷 Cultură & vin':'🍷 Culture & wine','🍇 Enogastronomic':'🍇 Wine & gastronomy','🏰 Cultural':'🏰 Cultural','O zi cu galerii subterane, peisaje spectaculoase și patrimoniu moldovenesc.':'A day of underground galleries, spectacular scenery and Moldovan heritage.','Combinație de vinuri locale, tradiții și un traseu relaxant în afara Chișinăului.':'Local wines, traditions and a relaxing route outside Chișinău.','Soroca • Cetatea Soroca • Arta Rustică':'Soroca • Soroca Fortress • Rustic Art','Istorie, cetate medievală și obiective culturale într-o excursie de o zi.':'History, a medieval fortress and cultural sights on a one-day trip.','Cere ofertă':'Request offer',
    'Oferte recomandate':'Recommended offers','Vacanțe populare':'Popular holidays','Prețurile sunt orientative și se confirmă în funcție de data plecării, hotel și disponibilitate.':'Prices are indicative and confirmed according to departure date, hotel and availability.','7 nopți':'7 nights','✈️ Zbor incl.':'✈️ Flight incl.','🏨 Hotel 4–5★':'🏨 4–5★ hotel','🏨 Hotel selectat':'🏨 Selected hotel','🏖 Plajă':'🏖 Beach','🏨 Resort 4–5★':'🏨 4–5★ resort','🚌 Transfer':'🚌 Transfer','Zbor, transfer și hotel selectat la cerere.':'Flight, transfer and selected hotel on request.','Hoteluri pentru cupluri, familii și grupuri.':'Hotels for couples, families and groups.','Resorturi, plaje superbe și temperaturi excelente.':'Resorts, beautiful beaches and excellent temperatures.','Vezi detalii':'View details',
    'De ce AlviTravel':'Why AlviTravel','Planificare simplă, suport real':'Simple planning, real support','Un proces clar de la prima întrebare până la revenirea acasă.':'A clear process from your first question until you return home.','Oferte potrivite':'Suitable offers','Filtrăm variantele în funcție de buget, perioadă și preferințe.':'We filter options by budget, dates and preferences.','Hoteluri selectate':'Selected hotels','Comparații clare între locații, regimuri de masă și facilități.':'Clear comparisons of locations, meal plans and facilities.','Comunicare rapidă':'Fast communication','Discuții simple prin WhatsApp, telefon și mesaje directe.':'Easy communication via WhatsApp, phone and direct messages.','Asistență':'Assistance','Suport înainte de plecare și pe parcursul călătoriei.':'Support before departure and throughout the trip.',
    'Pentru grupuri':'For groups','Călătorii organizate pentru școli și companii':'Organized travel for schools and companies','Spune-ne numărul de persoane, perioada și bugetul. Construim o variantă potrivită grupului, fără obligația de a rezerva.':'Tell us the group size, dates and budget. We build a suitable option with no obligation to book.','Excursii pentru elevi și grupuri':'Trips for students and groups','Trasee educative, excursii de o zi și programe adaptate vârstei și dimensiunii grupului.':'Educational routes, day trips and programs adapted to the age and size of the group.','Program adaptat grupului':'Program tailored to the group','Transport și cazare la cerere':'Transport and accommodation on request','Destinații în Moldova, România și Europa':'Destinations in Moldova, Romania and Europe','Cere ofertă pentru grup':'Request a group offer','Călătorii pentru companii':'Corporate travel','City break-uri, team building-uri și deplasări de grup construite în jurul obiectivului și bugetului companiei.':'City breaks, team buildings and group trips built around the company’s goals and budget.','Program personalizat':'Custom program','Opțiuni pentru grupuri mici și mari':'Options for small and large groups','Suport de la alegere până la revenire':'Support from selection to return','Cere ofertă corporate':'Request corporate offer','Din 2015':'Since 2015','experiență în turism':'tourism experience','Despre AlviTravel':'About AlviTravel','Călătorii fără griji, din 2015':'Stress-free travel since 2015','AlviTravel este o agenție de turism din Chișinău care ajută clienții să aleagă vacanțe potrivite pentru bugetul și preferințele lor. Oferim consultanță rapidă, suport și recomandări clare înainte de plecare.':'AlviTravel is a travel agency in Chișinău helping clients choose holidays that match their budget and preferences. We provide fast consultation, support and clear recommendations before departure.','Google rating':'Google rating','recenzii':'reviews','activi din':'active since','Cere consultanță':'Request consultation',
    'Ce spun clienții':'What our clients say','Google: 5.0 ★ • 30 recenzii ↗':'Google: 5.0 ★ • 30 reviews ↗','Google Review':'Google Review','„Personal amabil, profesionist și atent la toate detaliile. Comunicarea a fost excelentă.”':'“Friendly, professional staff attentive to every detail. Communication was excellent.”','„Vacanța a fost organizată impecabil, iar locația din Spania a fost incredibilă.”':'“The holiday was organized flawlessly, and the location in Spain was incredible.”','„Cei mai buni când vine vorba de călătorii reușite. Suport pe tot parcursul traseului.”':'“Excellent for successful trips, with support throughout the journey.”',
    'Rezervare / Cerere ofertă':'Booking / Offer request','Spune-ne ce vacanță îți dorești':'Tell us what kind of holiday you want','Completează cererea aici. Nu te redirecționăm automat — după completare alegi dacă vrei să continui pe WhatsApp, prin apel sau prin email.':'Complete the request here. We will not redirect you automatically — after completing it, you choose WhatsApp, phone or email.','✓ Răspuns rapid':'✓ Fast reply','✓ Recomandări după buget':'✓ Recommendations by budget','✓ Fără obligația de a cumpăra':'✓ No obligation to buy','✓ Potrivit pentru cupluri, familii și grupuri':'✓ Suitable for couples, families and groups','Nume':'Name','Telefon':'Phone','Europa / altă destinație':'Europe / other destination','Data plecării':'Departure date','Adulți':'Adults','Copii':'Children','Buget aproximativ':'Approximate budget','Mesaj':'Message','Continuă cererea':'Continue request','Nu vei fi redirecționat automat către o aplicație externă.':'You will not be redirected automatically to an external app.','(opțional)':'(optional)','Nu știi data exactă? Lasă câmpul liber.':'Not sure of the exact date? Leave this field blank.','✓ Data plecării poate rămâne flexibilă':'✓ Departure date can remain flexible','Confirm că am luat cunoștință de':'I confirm that I have read the','Politica de confidențialitate':'Privacy Policy','privind modul în care sunt folosite datele necesare soluționării cererii mele.':'regarding how the data needed to handle my request is used.','Cererea este pregătită':'Your request is ready','Alege cum vrei să continui. Rămâi pe site până când selectezi una dintre opțiuni.':'Choose how you want to continue. You stay on the site until you select an option.','Sună 060 88 44 46':'Call 060 88 44 46','Email':'Email','← Modifică cererea':'← Edit request',
    'AlviTravel, Chișinău':'AlviTravel, Chișinău','Strada Alexandru cel Bun 7, of. 410, MD-2001, Republica Moldova':'7 Alexandru cel Bun Street, office 410, MD-2001, Republic of Moldova','Vezi pe hartă':'View on map','AlviTravel. Toate drepturile rezervate.':'AlviTravel. All rights reserved.','Confidențialitate':'Privacy','Cookies':'Cookies','Termeni':'Terms','Setări cookies':'Cookie settings','Informații legale':'Legal information',
    'Limba site-ului':'Site language','Sună AlviTravel':'Call AlviTravel','Vezi recenziile AlviTravel pe Google Maps':'View AlviTravel reviews on Google Maps','Harta AlviTravel':'AlviTravel map','Numele tău':'Your name','Hotel, regim de masă, oraș de plecare etc.':'Hotel, meal plan, departure city, etc.'
  },
  ru:{
    '🇹🇷 Turcia':'🇹🇷 Турция','🇬🇷 Grecia':'🇬🇷 Греция','🇪🇬 Egipt':'🇪🇬 Египет','Blog':'Блог','Despre noi':'О нас','Recenzii':'Отзывы','Contact':'Контакты','Rezervă acum':'Забронировать','✈ Din 2015 • Chișinău':'✈ С 2015 года • Кишинёв','Vacanțe din Chișinău cu':'Отдых из Кишинёва с','Turcia • Grecia • Egipt • Excursii cu plecare din Chișinău. Găsim vacanța potrivită pentru bugetul, perioada și stilul tău de călătorie.':'Турция • Греция • Египет • Экскурсии из Кишинёва. Подберём поездку под ваш бюджет, даты и стиль отдыха.','Vezi ofertele':'Смотреть предложения','Cere o ofertă':'Запросить предложение','Alege mai repede':'Выберите быстрее','Ce fel de călătorie cauți?':'Какое путешествие вы ищете?','Vacanțe la mare':'Отдых на море','Pentru grupuri':'Для групп','Ajută-mă să aleg':'Помогите выбрать','plus oferte personalizate':'плюс индивидуальные предложения','comunicare în 3 limbi':'общение на 3 языках','Te sunăm noi':'Мы вам позвоним','Preferi să vorbești direct cu un consultant?':'Предпочитаете поговорить с консультантом?','Introdu numărul, iar noi îți pregătim cererea de apel. O confirmi în formular înainte ca datele să fie folosite.':'Введите номер, и мы подготовим запрос на звонок. Вы подтвердите его в форме до использования данных.','Vreau să fiu sunat':'Перезвоните мне','Nu trimitem datele fără confirmarea ta.':'Мы не отправляем данные без вашего подтверждения.','☎ Sună':'☎ Позвонить','experiență':'опыт','răspuns rapid':'быстрый ответ',
    'Destinație':'Направление','Transport':'Транспорт','Data plecării':'Дата выезда','Persoane':'Путешественники','Buget':'Бюджет','Găsește vacanța':'Найти отдых','Cere preț actual':'Узнать актуальную цену','🇧🇬 Bulgaria':'🇧🇬 Болгария','🇲🇪 Muntenegru':'🇲🇪 Черногория','🇷🇴 România':'🇷🇴 Румыния','🇪🇸 Spania':'🇪🇸 Испания','🇮🇹 Italia':'🇮🇹 Италия','🇫🇷 Franța':'🇫🇷 Франция','Excursie':'Экскурсия','Nu sunt sigur':'Не уверен','Oricare':'Любой','Avion':'Самолёт','Autocar':'Автобус','până la €500':'до €500',
    'Consultanță rapidă':'Быстрая консультация','WhatsApp & telefon':'WhatsApp и телефон','Vacanțe personalizate':'Индивидуальные поездки','după buget și stil':'по бюджету и стилю','Suport pe traseu':'Поддержка в поездке','înainte și în vacanță':'до и во время отдыха','30 recenzii Google ↗':'30 отзывов Google ↗',
    'Destinații populare':'Популярные направления','9 destinații pentru mare, munte și city break':'9 направлений: море, горы и city break','AlviTravel poate organiza vacanțe oriunde. Alege una dintre destinațiile de mai jos sau cere o ofertă pentru orice alt loc.':'AlviTravel может организовать поездку практически куда угодно. Выберите направление ниже или запросите предложение для другого места.',
    '🇹🇷 ✈️ Zbor din Chișinău':'🇹🇷 ✈️ Вылет из Кишинёва','🇬🇷 ✈️ Zbor din Chișinău':'🇬🇷 ✈️ Вылет из Кишинёва','🇪🇬 ✈️ Zbor din Chișinău':'🇪🇬 ✈️ Вылет из Кишинёва','🇧🇬 🚌 / ✈️ din Chișinău':'🇧🇬 🚌 / ✈️ из Кишинёва','🇲🇪 ✈️ Adriatica':'🇲🇪 ✈️ Адриатика','🇷🇴 🚌 / 🚗 aproape':'🇷🇴 🚌 / 🚗 рядом','🇪🇸 ✈️ City break & mare':'🇪🇸 ✈️ City break и море','🇮🇹 ✈️ Orașe & coastă':'🇮🇹 ✈️ Города и побережье','🇫🇷 ✈️ City break & Riviera':'🇫🇷 ✈️ City break и Ривьера',
    'Soare & mare':'Солнце и море','Soare tot anul':'Солнце круглый год','Mare & familie':'Море и семья','Mare & munte':'Море и горы','Munte & city break':'Горы и city break','City break & mare':'City break и море','Orașe & coastă':'Города и побережье','Explorează Turcia →':'Открыть Турцию →','Explorează Grecia →':'Открыть Грецию →','Explorează Egipt →':'Открыть Египет →','Cere ofertă →':'Запросить предложение →',
    'Nisipurile de Aur • Sunny Beach • Nessebar':'Золотые Пески • Sunny Beach • Несебр','Brașov • Sinaia • București • Constanța':'Брашов • Синая • Бухарест • Констанца','Roma • Amalfi • Sicilia • Milano':'Рим • Амальфи • Сицилия • Милан','Paris • Nisa • Coasta de Azur':'Париж • Ницца • Лазурный берег',
    'Excursii din Chișinău':'Экскурсии из Кишинёва','3 idei populare pentru o zi memorabilă':'3 популярных идеи для запоминающегося дня','Traseele, datele și transportul se confirmă la cerere în funcție de disponibilitate.':'Маршруты, даты и транспорт подтверждаются по запросу в зависимости от наличия.','🍷 Cultură & vin':'🍷 Культура и вино','🍇 Enogastronomic':'🍇 Вино и гастрономия','🏰 Cultural':'🏰 Культура','O zi cu galerii subterane, peisaje spectaculoase și patrimoniu moldovenesc.':'День с подземными галереями, красивыми пейзажами и молдавским наследием.','Combinație de vinuri locale, tradiții și un traseu relaxant în afara Chișinăului.':'Местные вина, традиции и спокойный маршрут за пределами Кишинёва.','Soroca • Cetatea Soroca • Arta Rustică':'Сорока • Сорокская крепость • Arta Rustică','Istorie, cetate medievală și obiective culturale într-o excursie de o zi.':'История, средневековая крепость и культурные объекты в однодневной экскурсии.','Cere ofertă':'Запросить предложение',
    'Oferte recomandate':'Рекомендуемые предложения','Vacanțe populare':'Популярный отдых','Prețurile sunt orientative și se confirmă în funcție de data plecării, hotel și disponibilitate.':'Цены ориентировочные и подтверждаются в зависимости от даты выезда, отеля и наличия.','7 nopți':'7 ночей','✈️ Zbor incl.':'✈️ Перелёт включён','🏨 Hotel 4–5★':'🏨 Отель 4–5★','🏨 Hotel selectat':'🏨 Подобранный отель','🏖 Plajă':'🏖 Пляж','🏨 Resort 4–5★':'🏨 Курорт 4–5★','🚌 Transfer':'🚌 Трансфер','Zbor, transfer și hotel selectat la cerere.':'Перелёт, трансфер и отель подбираются по запросу.','Hoteluri pentru cupluri, familii și grupuri.':'Отели для пар, семей и групп.','Resorturi, plaje superbe și temperaturi excelente.':'Курорты, красивые пляжи и отличная погода.','Vezi detalii':'Подробнее',
    'De ce AlviTravel':'Почему AlviTravel','Planificare simplă, suport real':'Простое планирование, реальная поддержка','Un proces clar de la prima întrebare până la revenirea acasă.':'Понятный процесс от первого вопроса до возвращения домой.','Oferte potrivite':'Подходящие предложения','Filtrăm variantele în funcție de buget, perioadă și preferințe.':'Подбираем варианты по бюджету, датам и предпочтениям.','Hoteluri selectate':'Подобранные отели','Comparații clare între locații, regimuri de masă și facilități.':'Понятное сравнение расположения, питания и удобств.','Comunicare rapidă':'Быстрая связь','Discuții simple prin WhatsApp, telefon și mesaje directe.':'Удобное общение через WhatsApp, телефон и сообщения.','Asistență':'Поддержка','Suport înainte de plecare și pe parcursul călătoriei.':'Поддержка до выезда и во время путешествия.',
    'Pentru grupuri':'Для групп','Călătorii organizate pentru școli și companii':'Организованные поездки для школ и компаний','Spune-ne numărul de persoane, perioada și bugetul. Construim o variantă potrivită grupului, fără obligația de a rezerva.':'Сообщите количество людей, период и бюджет. Мы подготовим подходящий вариант без обязательства бронировать.','Excursii pentru elevi și grupuri':'Экскурсии для школьников и групп','Trasee educative, excursii de o zi și programe adaptate vârstei și dimensiunii grupului.':'Образовательные маршруты, однодневные экскурсии и программы с учетом возраста и размера группы.','Program adaptat grupului':'Программа под группу','Transport și cazare la cerere':'Транспорт и проживание по запросу','Destinații în Moldova, România și Europa':'Направления в Молдове, Румынии и Европе','Cere ofertă pentru grup':'Запросить предложение для группы','Călătorii pentru companii':'Поездки для компаний','City break-uri, team building-uri și deplasări de grup construite în jurul obiectivului și bugetului companiei.':'City break, тимбилдинги и групповые поездки с учетом целей и бюджета компании.','Program personalizat':'Индивидуальная программа','Opțiuni pentru grupuri mici și mari':'Варианты для малых и больших групп','Suport de la alegere până la revenire':'Поддержка от выбора до возвращения','Cere ofertă corporate':'Запросить корпоративное предложение','Din 2015':'С 2015 года','experiență în turism':'опыт в туризме','Despre AlviTravel':'Об AlviTravel','Călătorii fără griji, din 2015':'Путешествия без забот с 2015 года','AlviTravel este o agenție de turism din Chișinău care ajută clienții să aleagă vacanțe potrivite pentru bugetul și preferințele lor. Oferim consultanță rapidă, suport și recomandări clare înainte de plecare.':'AlviTravel — туристическое агентство в Кишинёве, которое помогает подобрать отдых по бюджету и предпочтениям. Мы предлагаем быструю консультацию, поддержку и понятные рекомендации перед поездкой.','Google rating':'Рейтинг Google','recenzii':'отзывов','activi din':'работаем с','Cere consultanță':'Получить консультацию',
    'Ce spun clienții':'Что говорят клиенты','Google: 5.0 ★ • 30 recenzii ↗':'Google: 5.0 ★ • 30 отзывов ↗','Google Review':'Отзыв Google','„Personal amabil, profesionist și atent la toate detaliile. Comunicarea a fost excelentă.”':'«Доброжелательный и профессиональный персонал, внимательный к деталям. Общение было отличным.»','„Vacanța a fost organizată impecabil, iar locația din Spania a fost incredibilă.”':'«Отдых был организован безупречно, а место в Испании было невероятным.»','„Cei mai buni când vine vorba de călătorii reușite. Suport pe tot parcursul traseului.”':'«Отличная организация поездок и поддержка на всём маршруте.»',
    'Rezervare / Cerere ofertă':'Бронирование / Запрос','Spune-ne ce vacanță îți dorești':'Расскажите, какой отдых вы хотите','Completează cererea aici. Nu te redirecționăm automat — după completare alegi dacă vrei să continui pe WhatsApp, prin apel sau prin email.':'Заполните заявку здесь. Мы не перенаправляем вас автоматически — после заполнения вы сами выбираете WhatsApp, звонок или email.','✓ Răspuns rapid':'✓ Быстрый ответ','✓ Recomandări după buget':'✓ Рекомендации по бюджету','✓ Fără obligația de a cumpăra':'✓ Без обязательства покупать','✓ Potrivit pentru cupluri, familii și grupuri':'✓ Для пар, семей и групп','Nume':'Имя','Telefon':'Телефон','Europa / altă destinație':'Европа / другое направление','Data plecării':'Дата выезда','Adulți':'Взрослые','Copii':'Дети','Buget aproximativ':'Примерный бюджет','Mesaj':'Сообщение','Continuă cererea':'Продолжить заявку','Nu vei fi redirecționat automat către o aplicație externă.':'Вы не будете автоматически перенаправлены во внешнее приложение.','(opțional)':'(необязательно)','Nu știi data exactă? Lasă câmpul liber.':'Не знаете точную дату? Оставьте поле пустым.','✓ Data plecării poate rămâne flexibilă':'✓ Дата выезда может быть гибкой','Confirm că am luat cunoștință de':'Подтверждаю, что ознакомился(лась) с','Politica de confidențialitate':'Политикой конфиденциальности','privind modul în care sunt folosite datele necesare soluționării cererii mele.':'о том, как используются данные, необходимые для обработки моего запроса.','Cererea este pregătită':'Заявка готова','Alege cum vrei să continui. Rămâi pe site până când selectezi una dintre opțiuni.':'Выберите, как продолжить. Вы останетесь на сайте, пока не выберете один из вариантов.','Sună 060 88 44 46':'Позвонить 060 88 44 46','Email':'Email','← Modifică cererea':'← Изменить заявку',
    'Strada Alexandru cel Bun 7, of. 410, MD-2001, Republica Moldova':'ул. Александру чел Бун 7, офис 410, MD-2001, Республика Молдова','Vezi pe hartă':'Посмотреть на карте','AlviTravel. Toate drepturile rezervate.':'AlviTravel. Все права защищены.','Confidențialitate':'Конфиденциальность','Cookies':'Cookies','Termeni':'Условия','Setări cookies':'Настройки cookies','Informații legale':'Правовая информация',
    'Limba site-ului':'Язык сайта','Sună AlviTravel':'Позвонить AlviTravel','Vezi recenziile AlviTravel pe Google Maps':'Посмотреть отзывы AlviTravel в Google Maps','Harta AlviTravel':'Карта AlviTravel','Numele tău':'Ваше имя','Hotel, regim de masă, oraș de plecare etc.':'Отель, питание, город выезда и т. д.'
  }
};

const originalText=new WeakMap();
const originalAttrs=new WeakMap();

function applyLanguage(langCode){
  const dict=pageTranslations[langCode]||{};
  document.documentElement.lang=langCode==='ro'?'ro-MD':langCode;

  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{
    acceptNode(node){
      if(!node.parentElement||['SCRIPT','STYLE'].includes(node.parentElement.tagName)) return NodeFilter.FILTER_REJECT;
      return node.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
    }
  });
  let node;
  while((node=walker.nextNode())){
    if(!originalText.has(node)) originalText.set(node,node.nodeValue);
    const original=originalText.get(node);
    const key=original.trim();
    const translated=langCode==='ro'?key:(dict[key]||key);
    node.nodeValue=original.replace(key,translated);
  }

  document.querySelectorAll('[placeholder],[aria-label],[title],[alt]').forEach(el=>{
    if(!originalAttrs.has(el)) originalAttrs.set(el,{placeholder:el.getAttribute('placeholder'),aria:el.getAttribute('aria-label'),title:el.getAttribute('title'),alt:el.getAttribute('alt')});
    const orig=originalAttrs.get(el);
    if(orig.placeholder){
      const p=langCode==='ro'?orig.placeholder:(dict[orig.placeholder]||orig.placeholder);
      el.setAttribute('placeholder',p);
    }
    if(orig.aria){
      const a=langCode==='ro'?orig.aria:(dict[orig.aria]||orig.aria);
      el.setAttribute('aria-label',a);
    }
    if(orig.title){
      const t=langCode==='ro'?orig.title:(dict[orig.title]||orig.title);
      el.setAttribute('title',t);
    }
    if(orig.alt){
      const a=langCode==='ro'?orig.alt:(dict[orig.alt]||orig.alt);
      el.setAttribute('alt',a);
    }
  });

  try{localStorage.setItem('alvi_lang',langCode);}catch(_){} window.dispatchEvent(new CustomEvent('alvi-language-change',{detail:{lang:langCode}}));
}

const lang=document.getElementById('lang');
const savedLang=(()=>{try{return localStorage.getItem('alvi_lang')}catch(_){return null}})();
if(savedLang&&['ro','ru','en'].includes(savedLang)){lang.value=savedLang;requestAnimationFrame(()=>applyLanguage(savedLang));}
lang?.addEventListener('change',e=>applyLanguage(e.target.value));

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
    if(typeof applyLanguage==='function') applyLanguage(document.getElementById('lang')?.value||'ro');
    navEl.querySelector('.legal-cookie-btn')?.addEventListener('click',()=>window.AlviCookieConsent?.reset());
  });
}

function improveFormAccessibility(){
  const map=[
    ['qDestination','Destinație'],['qTransport','Transport'],['qDate','Data plecării'],['qPeople','Număr persoane'],['qBudget','Buget'],
    ['name','Nume'],['phone','Telefon'],['destination','Destinație'],['date','Data plecării'],
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


function loadCrispChat(){
  const websiteId=(window.ALVI_CRISP_WEBSITE_ID||'').trim();
  if(!websiteId||window.__alviCrispLoaded) return;
  window.__alviCrispLoaded=true;
  window.$crisp=window.$crisp||[];
  window.CRISP_WEBSITE_ID=websiteId;
  window.$crisp.push(['safe',true]);
  window.$crisp.push(['set','session:data',[[['site','alvitravel.md']]]]);
  const s=document.createElement('script');
  s.src='https://client.crisp.chat/l.js';
  s.async=true;
  s.crossOrigin='anonymous';
  document.head.appendChild(s);
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',loadCrispChat,{once:true});
}else{
  loadCrispChat();
}
