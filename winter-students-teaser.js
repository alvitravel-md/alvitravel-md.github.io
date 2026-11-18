/* AlviTravel winter student-trip teaser. Reveal date is not yet confirmed. */
(function(){
  'use strict';
  var root=document.getElementById('winterStudentReveal');
  if(!root)return;
  // 23 Nov 2026 is the BEGINNING of the announcement week in Moldova;
  // it is deliberately not claimed to be the exact announcement time.
  var countdownTo=Date.parse('2026-11-23T00:00:00+02:00');
  var i18n={
    ro:{
      eyebrow:'ALVITRAVEL × STUDENȚI',
      badge:'REVEAL SĂPTĂMÂNA VIITOARE',
      title:'O iarnă care merită',
      titleAccent:'să devină legendă.',
      intro:'Pauză de la sesiune? Pregătim o escapadă de iarnă exclusiv pentru studenți: munți înzăpeziți, vibe de ski & snowboard și o gașcă de tineri gata de amintiri memorabile. Destinația rămâne deocamdată secretă.',
      chipMountains:'🏔 Munți & zăpadă',
      chipSki:'🏂 Ski & snowboard',
      chipStudents:'🎓 Exclusiv studenți',
      chipFriends:'✨ Gașcă & distracție',
      timerHeading:'Până începe săptămâna dezvăluirii',
      days:'Zile',hours:'Ore',minutes:'Minute',seconds:'Secunde',
      after:'Săptămâna dezvăluirii a început! Urmărește AlviTravel pentru anunț.',
      cta:'Vreau să aflu primul',
      instagram:'Urmărește pe Instagram',
      fine:'Locul, data plecării, prețul special și programul vor fi anunțate în săptămâna 23–29 noiembrie. Nu sunt încă deschise înscrierile.',
      mystery:'SECRET PÂNĂ LA REVEAL',
      mysteryWhere:'Unde? 🔒',mysteryWhen:'Când? 🔒',mysteryPrice:'Ce preț? 🔒',
      illustration:'Imagine ilustrativă',
      whatsapp:'Salut! Vreau să aflu când AlviTravel anunță excursia de iarnă pentru studenți. Mă puteți ține la curent?'
    },
    ru:{
      eyebrow:'ALVITRAVEL × СТУДЕНТЫ',
      badge:'АНОНС НА СЛЕДУЮЩЕЙ НЕДЕЛЕ',
      title:'Зима, которая',
      titleAccent:'станет легендой.',
      intro:'Хочется отвлечься от сессии? Мы готовим зимнее приключение исключительно для студентов: заснеженные горы, атмосфера лыж и сноуборда, большая компания и море воспоминаний. Направление пока держим в секрете.',
      chipMountains:'🏔 Горы и снег',
      chipSki:'🏂 Лыжи и сноуборд',
      chipStudents:'🎓 Только студенты',
      chipFriends:'✨ Друзья и эмоции',
      timerHeading:'До начала недели большого анонса',
      days:'Дни',hours:'Часы',minutes:'Минуты',seconds:'Секунды',
      after:'Неделя анонса началась! Следите за AlviTravel.',
      cta:'Хочу узнать первым',
      instagram:'Следить в Instagram',
      fine:'Место, даты поездки, специальная цена и программа будут объявлены на неделе 23–29 ноября. Запись пока не открыта.',
      mystery:'ТАЙНА ДО АНОНСА',
      mysteryWhere:'Куда? 🔒',mysteryWhen:'Когда? 🔒',mysteryPrice:'Цена? 🔒',
      illustration:'Иллюстративное фото',
      whatsapp:'Здравствуйте! Хочу узнать о зимней поездке AlviTravel для студентов, когда появятся подробности.'
    },
    en:{
      eyebrow:'ALVITRAVEL × STUDENTS',
      badge:'BIG REVEAL NEXT WEEK',
      title:'A winter adventure',
      titleAccent:'worth remembering.',
      intro:'Need a break from exam season? A student-exclusive winter escape is taking shape: snow-covered mountains, ski and snowboard vibes, and a whole crew ready to make memories. The destination is still a secret.',
      chipMountains:'🏔 Snowy mountains',
      chipSki:'🏂 Ski & snowboard',
      chipStudents:'🎓 Students only',
      chipFriends:'✨ Friends & memories',
      timerHeading:'Until the reveal week begins',
      days:'Days',hours:'Hours',minutes:'Minutes',seconds:'Seconds',
      after:'Reveal week has started! Follow AlviTravel for the announcement.',
      cta:'Keep me in the loop',
      instagram:'Follow on Instagram',
      fine:'Destination, departure date, special price and itinerary will be announced during 23–29 November. Registration is not open yet.',
      mystery:'TOP SECRET UNTIL REVEAL',
      mysteryWhere:'Where? 🔒',mysteryWhen:'When? 🔒',mysteryPrice:'Price? 🔒',
      illustration:'Illustrative image',
      whatsapp:'Hi! Please let me know when AlviTravel reveals the winter student trip details.'
    }
  };
  var labels=root.querySelectorAll('[data-winter-copy]');
  var digits=root.querySelectorAll('[data-winter-digit]');
  var status=root.querySelector('#winterRevealStatus');
  var wa=root.querySelector('#winterRevealWhatsapp');
  function language(){
    var picker=document.getElementById('lang');
    var lang=picker?picker.value:'ro';
    return Object.prototype.hasOwnProperty.call(i18n,lang)?lang:'ro';
  }
  function translate(){
    var dict=i18n[language()];
    labels.forEach(function(el){
      var key=el.getAttribute('data-winter-copy');
      if(dict[key])el.textContent=dict[key];
    });
    if(wa)wa.href='https://wa.me/37368004449?text='+encodeURIComponent(dict.whatsapp);
    tick();
  }
  function tick(){
    var now=Date.now(),diff=Math.max(0,countdownTo-now);
    var values=[
      Math.floor(diff/86400000),
      Math.floor(diff/3600000)%24,
      Math.floor(diff/60000)%60,
      Math.floor(diff/1000)%60
    ];
    digits.forEach(function(el,i){el.textContent=String(values[i]||0).padStart(2,'0');});
    if(status){
      var reached=now>=countdownTo;
      status.textContent=reached?i18n[language()].after:'';
      root.classList.toggle('winter-drop--week-started',reached);
    }
  }
  window.addEventListener('alvi-language-change',translate);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)tick();});
  translate();
  window.setInterval(tick,1000);
})();
