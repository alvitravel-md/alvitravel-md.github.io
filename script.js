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
document.querySelectorAll('.book-offer,.excursion-trigger').forEach(btn=>btn.addEventListener('click',()=>scrollToBooking(btn.dataset.dest||'',btn.dataset.offer||'')));
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
  const dt=document.getElementById('qDate')?.value||'flexibilă';
  const p=document.getElementById('qPeople')?.value||'2';
  const b=document.getElementById('qBudget')?.value||'nespecificat';
  trackEvent('quick_search_submit',{destination:d,transport,people:p,budget:b});
  const text=`Bună ziua, AlviTravel!

Doresc o ofertă de vacanță.
Destinație: ${d}
Transport: ${transport}
Data plecării: ${dt}
Persoane: ${p}
Buget: ${b}

Vă rog să-mi recomandați cele mai bune variante disponibile.`;
  window.open(`https://wa.me/37368004449?text=${encodeURIComponent(text)}`,'_blank','noopener');
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

const pageTranslations={
  en:{
    'Rezervă acum':'Book now','Destinații':'Destinations','Excursii':'Excursions','Oferte':'Offers','Blog':'Blog',
    'Vacanțe din Chișinău cu ':'Holidays from Chișinău with ','Din 2015 • Chișinău':'Since 2015 • Chișinău',
    'Turcia • Grecia • Egipt • Excursii cu plecare din Chișinău. Găsim vacanța potrivită pentru bugetul, perioada și stilul tău de călătorie.':'Turkey • Greece • Egypt • Tours departing from Chișinău. We find the right trip for your budget, dates and travel style.',
    'Vezi ofertele':'View offers','Cere o ofertă':'Request an offer','experiență':'experience','răspuns rapid':'fast reply',
    'Destinație':'Destination','Transport':'Transport','Data plecării':'Departure date','Persoane':'Travellers','Buget':'Budget','Găsește vacanța':'Find my holiday',
    'Oricare':'Any','Avion':'Plane','Autocar':'Coach','Nu sunt sigur':'Not sure','Excursie':'Tour',
    'până la €500':'up to €500',
    'Consultanță rapidă':'Fast consultation','WhatsApp & telefon':'WhatsApp & phone','Vacanțe personalizate':'Tailored holidays','după buget și stil':'by budget and style',
    'Suport pe traseu':'Travel support','înainte și în vacanță':'before and during your trip','28 recenzii Google ↗':'28 Google reviews ↗',
    'Destinații populare':'Popular destinations','Alege următoarea ta escapadă':'Choose your next getaway',
    '6 destinații recomandate pentru mare, relaxare și aventură. Putem organiza și alte destinații la cerere.':'6 recommended destinations for seaside, relaxation and adventure. We can arrange other destinations on request.',
    'Zbor din Chișinău':'Flight from Chișinău','Autocar / ✈️ Avion':'Coach / ✈️ Plane','Zbor':'Flight',
    'All Inclusive':'All Inclusive','Soare & mare':'Sun & sea','Soare tot anul':'Year-round sun','Mare & familie':'Sea & family','Mare & munte':'Sea & mountains','City break & mare':'City break & sea',
    'Explorează Turcia →':'Explore Turkey →','Explorează Grecia →':'Explore Greece →','Explorează Egipt →':'Explore Egypt →','Cere ofertă →':'Request offer →',
    'Căutăm pachete și pentru ':'We also find packages for ',' și orice altă destinație disponibilă la cerere.':' and any other destination available on request.',
    'Excursii din Chișinău':'Tours from Chișinău','3 idei populare pentru o zi memorabilă':'3 popular ideas for a memorable day',
    'Traseele, datele și transportul se confirmă la cerere în funcție de disponibilitate.':'Routes, dates and transport are confirmed on request, subject to availability.',
    'Cultură & vin':'Culture & wine','Enogastronomic':'Wine & gastronomy','Cultural':'Cultural',
    'O zi cu galerii subterane, peisaje spectaculoase și patrimoniu moldovenesc.':'A day of underground galleries, spectacular scenery and Moldovan heritage.',
    'Combinație de vinuri locale, tradiții și un traseu relaxant în afara Chișinăului.':'Local wines, traditions and a relaxing route outside Chișinău.',
    'Istorie, meșteșuguri și obiective culturale într-o excursie de o zi.':'History, crafts and cultural sights on a one-day trip.',
    'Oferte recomandate':'Recommended offers','Vacanțe populare':'Popular holidays',
    'Prețurile sunt orientative și se confirmă în funcție de data plecării, hotel și disponibilitate.':'Prices are indicative and confirmed according to departure date, hotel and availability.',
    '7 nopți':'7 nights','Zbor incl.':'Flight incl.','Hotel 4–5★':'4–5★ hotel','Hotel selectat':'Selected hotel','Resort 4–5★':'4–5★ resort',
    'Masă la alegere':'Meal plan choice','Transfer':'Transfer','Cere ofertă':'Request offer','Vezi detalii →':'View details →',
    'Zbor, transfer și hotel selectat la cerere.':'Flight, transfer and selected hotel on request.','Hoteluri pentru cupluri, familii și grupuri.':'Hotels for couples, families and groups.',
    'Resorturi, plaje superbe și temperaturi excelente.':'Resorts, beautiful beaches and excellent temperatures.',
    'De ce AlviTravel':'Why AlviTravel','Planificare simplă, suport real':'Simple planning, real support','Un proces clar de la prima întrebare până la revenirea acasă.':'A clear process from your first question until you return home.',
    'Oferte potrivite':'Suitable offers','Filtrăm variantele în funcție de buget, perioadă și preferințe.':'We filter options by budget, dates and preferences.',
    'Hoteluri selectate':'Selected hotels','Comparații clare între locații, regimuri de masă și facilități.':'Clear comparisons of locations, meal plans and facilities.',
    'Comunicare rapidă':'Fast communication','Discuții simple prin WhatsApp, telefon și mesaje directe.':'Easy communication via WhatsApp, phone and direct messages.',
    'Asistență':'Assistance','Suport înainte de plecare și pe parcursul călătoriei.':'Support before departure and throughout the trip.',
    'Despre AlviTravel':'About AlviTravel','Călătorii fără griji, din 2015':'Stress-free travel since 2015',
    'AlviTravel este o agenție de turism din Chișinău care ajută clienții să aleagă vacanțe potrivite pentru bugetul și preferințele lor. Oferim consultanță rapidă, suport și recomandări clare înainte de plecare.':'AlviTravel is a travel agency in Chișinău helping clients choose holidays that match their budget and preferences. We provide fast consultation, support and clear recommendations before departure.',
    'Google rating':'Google rating','recenzii':'reviews','activi din':'active since','Cere consultanță':'Request consultation',
    'Recenzii':'Reviews','Ce spun clienții':'What our clients say','Rating Google: 5.0 / 5':'Google rating: 5.0 / 5',
    'Rezervare / Cerere ofertă':'Booking / Offer request','Spune-ne ce vacanță îți dorești':'Tell us what kind of holiday you want',
    'Completează formularul, iar cererea este pregătită automat pentru WhatsApp.':'Complete the form and your request will be prepared automatically for WhatsApp.',
    'Răspuns rapid':'Fast reply','Recomandări după buget':'Recommendations by budget','Fără obligația de a cumpăra':'No obligation to buy','Potrivit pentru cupluri, familii și grupuri':'Suitable for couples, families and groups',
    'Nume':'Name','Telefon':'Phone','Perioada':'Period','Adulți':'Adults','Copii':'Children','Buget aproximativ':'Approximate budget','Mesaj':'Message',
    'Trimite cererea pe WhatsApp':'Send request on WhatsApp','Datele introduse sunt folosite doar pentru pregătirea mesajului către AlviTravel.':'The entered data is used only to prepare your message to AlviTravel.',
    'Contact':'Contact','Vezi pe hartă':'View on map'
  },
  ru:{
    'Rezervă acum':'Забронировать','Destinații':'Направления','Excursii':'Экскурсии','Oferte':'Предложения','Blog':'Блог',
    'Vacanțe din Chișinău cu ':'Отдых из Кишинёва с ','Din 2015 • Chișinău':'С 2015 года • Кишинёв',
    'Turcia • Grecia • Egipt • Excursii cu plecare din Chișinău. Găsim vacanța potrivită pentru bugetul, perioada și stilul tău de călătorie.':'Турция • Греция • Египет • Экскурсии из Кишинёва. Подберём путешествие под ваш бюджет, даты и стиль отдыха.',
    'Vezi ofertele':'Смотреть предложения','Cere o ofertă':'Запросить предложение','experiență':'опыт','răspuns rapid':'быстрый ответ',
    'Destinație':'Направление','Transport':'Транспорт','Data plecării':'Дата выезда','Persoane':'Путешественники','Buget':'Бюджет','Găsește vacanța':'Найти отдых',
    'Oricare':'Любой','Avion':'Самолёт','Autocar':'Автобус','Nu sunt sigur':'Не уверен','Excursie':'Экскурсия','până la €500':'до €500',
    'Consultanță rapidă':'Быстрая консультация','WhatsApp & telefon':'WhatsApp и телефон','Vacanțe personalizate':'Индивидуальные поездки','după buget și stil':'по бюджету и стилю',
    'Suport pe traseu':'Поддержка в поездке','înainte și în vacanță':'до и во время отдыха','28 recenzii Google ↗':'28 отзывов Google ↗',
    'Destinații populare':'Популярные направления','Alege următoarea ta escapadă':'Выберите следующую поездку',
    '6 destinații recomandate pentru mare, relaxare și aventură. Putem organiza și alte destinații la cerere.':'6 рекомендуемых направлений для моря, отдыха и приключений. Другие направления организуем по запросу.',
    'Zbor din Chișinău':'Вылет из Кишинёва','Autocar / ✈️ Avion':'Автобус / ✈️ Самолёт','Zbor':'Самолёт',
    'Soare & mare':'Солнце и море','Soare tot anul':'Солнце круглый год','Mare & familie':'Море и семья','Mare & munte':'Море и горы','City break & mare':'Сити-брейк и море',
    'Explorează Turcia →':'Открыть Турцию →','Explorează Grecia →':'Открыть Грецию →','Explorează Egipt →':'Открыть Египет →','Cere ofertă →':'Запросить предложение →',
    'Excursii din Chișinău':'Экскурсии из Кишинёва','3 idei populare pentru o zi memorabilă':'3 популярных идеи для запоминающегося дня',
    'Traseele, datele și transportul se confirmă la cerere în funcție de disponibilitate.':'Маршруты, даты и транспорт подтверждаются по запросу в зависимости от наличия.',
    'Cultură & vin':'Культура и вино','Enogastronomic':'Вино и гастрономия','Cultural':'Культурная',
    'Oferte recomandate':'Рекомендуемые предложения','Vacanțe populare':'Популярный отдых',
    'Prețurile sunt orientative și se confirmă în funcție de data plecării, hotel și disponibilitate.':'Цены ориентировочные и подтверждаются в зависимости от даты выезда, отеля и наличия.',
    '7 nopți':'7 ночей','Zbor incl.':'Перелёт включён','Hotel 4–5★':'Отель 4–5★','Hotel selectat':'Подобранный отель','Resort 4–5★':'Курорт 4–5★',
    'Masă la alegere':'Питание на выбор','Transfer':'Трансфер','Cere ofertă':'Запросить предложение','Vezi detalii →':'Подробнее →',
    'Zbor, transfer și hotel selectat la cerere.':'Перелёт, трансфер и отель подбираются по запросу.','Hoteluri pentru cupluri, familii și grupuri.':'Отели для пар, семей и групп.','Resorturi, plaje superbe și temperaturi excelente.':'Курорты, красивые пляжи и отличная погода.',
    'De ce AlviTravel':'Почему AlviTravel','Planificare simplă, suport real':'Простое планирование, реальная поддержка','Un proces clar de la prima întrebare până la revenirea acasă.':'Понятный процесс от первого вопроса до возвращения домой.',
    'Oferte potrivite':'Подходящие предложения','Hoteluri selectate':'Подобранные отели','Comunicare rapidă':'Быстрая связь','Asistență':'Поддержка',
    'Despre AlviTravel':'Об AlviTravel','Călătorii fără griji, din 2015':'Путешествия без забот с 2015 года','Google rating':'Рейтинг Google','recenzii':'отзывов','activi din':'работаем с','Cere consultanță':'Получить консультацию',
    'Recenzii':'Отзывы','Ce spun clienții':'Что говорят клиенты','Rating Google: 5.0 / 5':'Рейтинг Google: 5.0 / 5',
    'Rezervare / Cerere ofertă':'Бронирование / Запрос','Spune-ne ce vacanță îți dorești':'Расскажите, какой отдых вы хотите',
    'Completează formularul, iar cererea este pregătită automat pentru WhatsApp.':'Заполните форму, и запрос автоматически подготовится для WhatsApp.',
    'Răspuns rapid':'Быстрый ответ','Recomandări după buget':'Рекомендации по бюджету','Fără obligația de a cumpăra':'Без обязательства покупать','Potrivit pentru cupluri, familii și grupuri':'Подходит для пар, семей и групп',
    'Nume':'Имя','Telefon':'Телефон','Perioada':'Период','Adulți':'Взрослые','Copii':'Дети','Buget aproximativ':'Примерный бюджет','Mesaj':'Сообщение',
    'Trimite cererea pe WhatsApp':'Отправить запрос в WhatsApp','Contact':'Контакты','Vezi pe hartă':'Посмотреть на карте'
  }
};

// Homepage 2026-10-07 translation additions
Object.assign(pageTranslations.en,{
  'Turcia':'Turkey','Grecia':'Greece','Egipt':'Egypt','Bulgaria':'Bulgaria','Muntenegru':'Montenegro','România':'Romania','Spania':'Spain','Italia':'Italy','Europa':'Europe','Moldova':'Moldova','Despre noi':'About us','Contact':'Contact',
  '6 idei pentru mare, munte și city break':'6 ideas for sea, mountains and city breaks',
  'AlviTravel poate organiza vacanțe oriunde. Acestea sunt doar câteva dintre direcțiile cerute frecvent.':'AlviTravel can arrange trips anywhere. These are just some frequently requested destinations.',
  '✈️ Zbor din Chișinău':'✈️ Flight from Chișinău','🚌 / ✈️ din Chișinău':'🚌 / ✈️ from Chișinău','✈️ Vacanță la Adriatică':'✈️ Adriatic holiday','✈️ City break & sejur':'✈️ City break & stay',
  'România • Spania • Italia':'Romania • Spain • Italy','Mare, munte, circuite și city break-uri':'Sea, mountains, tours and city breaks',
  '3 trasee populare pentru o escapadă':'3 popular routes for a quick escape',
  'Plecări și programe în funcție de sezon și disponibilitate. Putem organiza și alte trasee la cerere.':'Departures and itineraries depend on season and availability. Other routes can be arranged on request.',
  'Iași • City break & shopping':'Iași • City break & shopping','O escapadă practică de o zi sau weekend, cu program adaptat grupului.':'A practical day trip or weekend escape with a schedule adapted to the group.',
  'Brașov • Peleș • Sinaia':'Brașov • Peleș • Sinaia','Munți, castele și orașe istorice într-un circuit potrivit pentru weekend.':'Mountains, castles and historic towns in a weekend-friendly circuit.',
  'Orheiul Vechi • Cricova':'Orheiul Vechi • Cricova','Un traseu local clasic pentru natură, istorie și experiențe vinicole.':'A classic local route for nature, history and wine experiences.',
  'Cere programul':'Request itinerary','28 recenzii Google':'28 Google reviews','Google: 5.0 ★ • 28 recenzii ↗':'Google: 5.0 ★ • 28 reviews ↗',
  'Vezi detalii':'View details','Cere ofertă':'Request offer','Zbor incl.':'Flight incl.','Hotel selectat':'Selected hotel','Plajă':'Beach','Resort 4–5★':'4–5★ resort'
});
Object.assign(pageTranslations.ru,{
  'Turcia':'Турция','Grecia':'Греция','Egipt':'Египет','Bulgaria':'Болгария','Muntenegru':'Черногория','România':'Румыния','Spania':'Испания','Italia':'Италия','Europa':'Европа','Moldova':'Молдова','Despre noi':'О нас','Contact':'Контакты',
  '6 idei pentru mare, munte și city break':'6 идей: море, горы и city break',
  'AlviTravel poate organiza vacanțe oriunde. Acestea sunt doar câteva dintre direcțiile cerute frecvent.':'AlviTravel может организовать поездку практически куда угодно. Это лишь несколько популярных направлений.',
  '✈️ Zbor din Chișinău':'✈️ Вылет из Кишинёва','🚌 / ✈️ din Chișinău':'🚌 / ✈️ из Кишинёва','✈️ Vacanță la Adriatică':'✈️ Отдых на Адриатике','✈️ City break & sejur':'✈️ City break и отдых',
  'România • Spania • Italia':'Румыния • Испания • Италия','Mare, munte, circuite și city break-uri':'Море, горы, туры и city break',
  '3 trasee populare pentru o escapadă':'3 популярных маршрута для короткой поездки',
  'Plecări și programe în funcție de sezon și disponibilitate. Putem organiza și alte trasee la cerere.':'Выезды и программы зависят от сезона и наличия мест. По запросу организуем и другие маршруты.',
  'Iași • City break & shopping':'Яссы • City break и шопинг','O escapadă practică de o zi sau weekend, cu program adaptat grupului.':'Практичная поездка на день или выходные с программой под группу.',
  'Brașov • Peleș • Sinaia':'Брашов • Пелеш • Синая','Munți, castele și orașe istorice într-un circuit potrivit pentru weekend.':'Горы, замки и исторические города в маршруте на выходные.',
  'Orheiul Vechi • Cricova':'Старый Орхей • Крикова','Un traseu local clasic pentru natură, istorie și experiențe vinicole.':'Классический местный маршрут: природа, история и винные впечатления.',
  'Cere programul':'Запросить программу','28 recenzii Google':'28 отзывов Google','Google: 5.0 ★ • 28 recenzii ↗':'Google: 5.0 ★ • 28 отзывов ↗',
  'Vezi detalii':'Подробнее','Cere ofertă':'Запросить','Zbor incl.':'Перелёт включён','Hotel selectat':'Подобранный отель','Plajă':'Пляж','Resort 4–5★':'Курорт 4–5★'
});

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

  document.querySelectorAll('[placeholder],[aria-label]').forEach(el=>{
    if(!originalAttrs.has(el)) originalAttrs.set(el,{placeholder:el.getAttribute('placeholder'),aria:el.getAttribute('aria-label')});
    const orig=originalAttrs.get(el);
    if(orig.placeholder){
      const p=langCode==='ro'?orig.placeholder:(dict[orig.placeholder]||orig.placeholder);
      el.setAttribute('placeholder',p);
    }
    if(orig.aria){
      const a=langCode==='ro'?orig.aria:(dict[orig.aria]||orig.aria);
      el.setAttribute('aria-label',a);
    }
  });

  try{localStorage.setItem('alvi_lang',langCode);}catch(_){}
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
    navEl.querySelector('.legal-cookie-btn')?.addEventListener('click',()=>window.AlviCookieConsent?.reset());
  });
}

function improveFormAccessibility(){
  const map=[
    ['qDestination','Destinație'],['qTransport','Transport'],['qDate','Data plecării'],['qPeople','Număr persoane'],['qBudget','Buget'],
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
