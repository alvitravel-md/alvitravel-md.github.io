/* AlviTravel theme choice: accessible, persistent, and independent of translation. */
(function(){
  'use strict';
  var KEY='alvitravel-ui-theme';
  var theme='light';
  try { if(localStorage.getItem(KEY)==='dark') theme='dark'; } catch(e){}
  document.documentElement.setAttribute('data-alvi-theme',theme);
  var icons={
    light:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20.9 13a8.7 8.7 0 0 1-9.9-9.9A8.8 8.8 0 1 0 20.9 13Z"/></svg>',
    dark:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>'
  };
  var labels={
    ro:{dark:'Activează tema întunecată',light:'Activează tema luminoasă'},
    en:{dark:'Switch to dark mode',light:'Switch to light mode'},
    ru:{dark:'Включить тёмную тему',light:'Включить светлую тему'}
  };
  function lang(){
    var select=document.getElementById('lang');
    var value=select&&select.value||document.documentElement.lang||'ro';
    return value.toLowerCase().slice(0,2) in labels?value.toLowerCase().slice(0,2):'ro';
  }
  function refresh(){
    var current=document.documentElement.getAttribute('data-alvi-theme')==='dark'?'dark':'light';
    var button=document.getElementById('alviThemeToggle');
    if(!button)return;
    var next=current==='dark'?'light':'dark';
    button.innerHTML=icons[current];
    button.setAttribute('aria-label',labels[lang()][next]);
    button.setAttribute('title',labels[lang()][next]);
    button.setAttribute('aria-pressed',current==='dark'?'true':'false');
    var meta=document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content',current==='dark'?'#0b1e32':'#0a63c7');
  }
  function mount(){
    var nav=document.querySelector('.site-header .nav-actions');
    if(!nav||document.getElementById('alviThemeToggle'))return;
    var button=document.createElement('button');
    button.type='button';
    button.id='alviThemeToggle';
    button.className='alvi-theme-toggle';
    button.setAttribute('aria-label','Schimbă tema');
    var before=nav.querySelector('.header-phone, .header-booking, .menu-btn');
    nav.insertBefore(button,before||null);
    button.addEventListener('click',function(){
      var current=document.documentElement.getAttribute('data-alvi-theme');
      var newTheme=current==='dark'?'light':'dark';
      document.documentElement.setAttribute('data-alvi-theme',newTheme);
      try{localStorage.setItem(KEY,newTheme)}catch(e){}
      refresh();
    });
    var select=document.getElementById('lang');
    if(select)select.addEventListener('change',refresh);
    refresh();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
  else mount();
  window.addEventListener('storage',function(e){
    if(e.key===KEY){document.documentElement.setAttribute('data-alvi-theme',e.newValue==='dark'?'dark':'light');refresh();}
  });
})();