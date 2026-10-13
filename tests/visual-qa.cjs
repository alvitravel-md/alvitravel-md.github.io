const puppeteer=require('puppeteer-core');
const fs=require('fs');
const path=require('path');
const assert=require('assert');
const BASE='http://127.0.0.1:8765';
const problems=[];
fs.mkdirSync('qa-screens',{recursive:true});
function allHtml(dir){
  const list=[];
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if(['.git','node_modules','qa-screens'].includes(e.name))continue;
    const full=path.join(dir,e.name);
    if(e.isDirectory())list.push(...allHtml(full));
    else if(e.name.endsWith('.html'))list.push(full);
  }
  return list;
}
function check(cond,message){if(!cond){problems.push(message);console.error('FAIL',message)}else console.log('PASS',message)}
function contrast(c1,c2){
  const rgb=s=>(s.match(/[\d.]+/g)||[]).slice(0,3).map(Number);
  const conv=n=>{n/=255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4};
  const lum=v=>{const c=rgb(v);return .2126*conv(c[0])+.7152*conv(c[1])+.0722*conv(c[2])};
  const a=lum(c1),b=lum(c2);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
}
(async()=>{
  const staticFiles=allHtml(process.cwd()).filter(x=>!/^home-[0-9]/.test(path.basename(x)));
  for(const file of staticFiles){
    const html=fs.readFileSync(file,'utf8');
    if(!/<\/head>/i.test(html))continue;
    const id=path.relative(process.cwd(),file);
    check(html.includes('/premium-refresh.css?'),id+' has latest theme stylesheet');
    check(html.includes('/premium-refresh.js?'),id+' has theme script');
  }
  const chrome=process.env.CHROME_PATH||['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/opt/google/chrome/chrome'].find(p=>fs.existsSync(p));
  if(!chrome)throw Error('Chrome is not installed on the runner');
  const browser=await puppeteer.launch({headless:true,executablePath:chrome,args:['--no-sandbox','--disable-dev-shm-usage']});
  const samples=['/','/destinatii.html','/turcia.html','/blog/','/blog/vacanta-turcia-din-chisinau.html'];
  for(const viewport of [{width:390,height:844},{width:768,height:920},{width:1366,height:900}]){
    for(const mode of ['light','dark']){
      for(const link of samples){
        const page=await browser.newPage();
        await page.setViewport({...viewport,deviceScaleFactor:1,isMobile:viewport.width<700,hasTouch:viewport.width<700});
        await page.evaluateOnNewDocument(mode=>{
          try{localStorage.setItem('alvitravel-ui-theme',mode);localStorage.setItem('alvi_cookie_consent','rejected')}catch(e){}
        },mode);
        const errors=[];
        page.on('pageerror',err=>errors.push(err.message));
        try{
          const response=await page.goto(BASE+link,{waitUntil:'domcontentloaded',timeout:25000});
          check([200,304].includes(response.status()),link+' HTTP 200 or 304 (cached) — got '+response.status());
          await page.waitForSelector('#alviThemeToggle',{timeout:10000});
          await new Promise(r=>setTimeout(r,400));
          const report=await page.evaluate(()=>{
            const style=el=>getComputedStyle(el);
            const dest=[...document.querySelectorAll('.destination-card')].map(el=>({cls:el.className,bg:style(el).backgroundImage,visible:el.getBoundingClientRect().width>100}));
            const cb=document.querySelector('#callbackPhone');
            const iti=document.querySelector('.callback-form .iti__selected-dial-code');
            const itiReady=typeof window.intlTelInput==='function';
            const blog=document.querySelector('.blog-article');
            const faq=document.querySelector('.faq-list summary');
            const button=document.querySelector('#alviThemeToggle');
            const box=el=>{const b=el.getBoundingClientRect();return {x:b.x,y:b.y,w:b.width,h:b.height}};
            return {
              mode:document.documentElement.getAttribute('data-alvi-theme'),scroll:document.documentElement.scrollWidth-window.innerWidth,
              dest,cb:cb?{bg:style(cb).backgroundColor,text:style(cb).color,fill:style(cb).webkitTextFillColor,placeholder:cb.placeholder}:null,
              dial:iti?{text:iti.textContent.trim(),color:style(iti).color}:null,itiReady,
              blog:blog?{bg:style(blog).backgroundColor,pcolor:style(blog.querySelector('p')).color}:null,
              faq:faq?{bg:style(faq.parentElement).backgroundColor,text:style(faq).color}:null,
              button:button?box(button):null,nav:document.querySelector('.site-header')?.getBoundingClientRect().width,
              crispOpen:document.body.classList.contains('alvi-crisp-open'),
              close:document.querySelector('#alviCrispDismiss')!==null,
              imgVisibility:[...document.querySelectorAll('.offer-card>img,.excursion-card>img,.highlight-card img')].map(x=>style(x).visibility)
            };
          });
          const name=link==='/'?'home':link.replace(/^\//,'').replace(/[\W_]+/g,'-').slice(0,40);
          if((name==='home'||name==='destinatii-html') && viewport.width!==768)
            await page.screenshot({path:'qa-screens/'+name+'-'+viewport.width+'-'+mode+'.png',fullPage:true});
          check(report.mode===mode,link+' '+viewport.width+' '+mode+' active');
          check(report.scroll<=3,link+' '+viewport.width+' '+mode+' horizontal overflow <=3px ('+report.scroll+')');
          if(mode==='dark'){
            check(report.dest.every(d=>d.bg!=='none'),link+' '+viewport.width+' destinations retain CSS photography');
            check(report.imgVisibility.every(v=>v==='visible'),link+' '+viewport.width+' photo elements remain visible');
          }
          if(link==='/'){
            check(report.cb!==null,viewport.width+' callback input exists');
            if(report.cb)check(contrast(report.cb.text,report.cb.bg)>=4.5,viewport.width+' '+mode+' callback field contrast 4.5+: '+contrast(report.cb.text,report.cb.bg).toFixed(2));
            if(report.itiReady && report.cb){
              check(report.dial&&report.dial.text.includes('373'),viewport.width+' '+mode+' Moldova country dial code is shown');
              if(report.dial)check(contrast(report.dial.color,report.cb.bg)>=4.5,viewport.width+' '+mode+' country dial code readable');
            }
            check(!report.crispOpen,viewport.width+' '+mode+' Crisp closed by default');
            check(report.close,viewport.width+' '+mode+' Crisp failsafe dismiss exists');
          }
          if(mode==='dark'&&report.blog && report.blog.bg.startsWith('rgb('))check(contrast(report.blog.pcolor,report.blog.bg)>=4.5,link+' '+viewport.width+' dark blog text contrast');
          if(mode==='dark'&&report.faq && report.faq.bg.startsWith('rgb('))check(contrast(report.faq.text,report.faq.bg)>=4.5,link+' '+viewport.width+' dark FAQ contrast');
          check(errors.length===0,link+' '+viewport.width+' '+mode+' no JavaScript exceptions'+(errors.length?': '+errors.slice(0,2).join('; '):''));
        }catch(e){problems.push(link+' '+viewport.width+' '+mode+': '+e.message);console.error('FAIL',e.stack)}
        await page.close();
      }
    }
  }
  await browser.close();
  console.log('ALL CHECKS COMPLETED. Errors:',problems.length);
  if(problems.length){console.error(problems.join('\n'));process.exitCode=1}
})().catch(e=>{console.error(e.stack);process.exit(1)});
