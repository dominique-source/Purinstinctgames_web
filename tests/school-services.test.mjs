import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {runInNewContext} from 'node:vm';
import middleware from '../middleware.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html'),source=read('assets/school-services.js');
const entries=[...html.matchAll(/<button type="button" class="service-card" data-service="([^"]+)"[\s\S]*?<img src="([^"]+)" width="(\d+)" height="(\d+)" alt="([^"]+)"[\s\S]*?class="service-card-title">([^<]+)</g)].map(m=>({id:m[1],src:m[2],width:m[3],height:m[4],alt:m[5],title:m[6],description:html.match(new RegExp('data-service-description="'+m[1]+'">([^<]+)'))[1]}));
const translations={window:{}};runInNewContext(read('assets/site-translations.js'),translations);const dictionary=translations.window.piTranslations;
function fixture(reducedMotion=false){
 const handlers={},documentHandlers={},body={style:{position:'relative',top:'',left:'',width:'',overflow:'',paddingRight:''}};let focused,scroll=620,animations=0;
 function element(){return {handlers:{},addEventListener(n,f){this.handlers[n]=f;},setAttribute(n,v){this[n]=v;},focus(){focused=this;}};}
 const close=element(),photo={},title={},description={};
 const languageButtons=['fr','en'].map(lang=>Object.assign(element(),{dataset:{serviceLanguage:lang}}));
 const cards=entries.map(data=>{
  const image={alt:data.alt,getAttribute:n=>data[n]};
  const name={textContent:data.title};
  return Object.assign(element(),{dataset:{service:data.id},data,image,name,querySelector:s=>s==='img'?image:name,getBoundingClientRect:()=>({left:80,top:180,width:360,height:270})});
 });
 const descriptions=Object.fromEntries(entries.map(e=>[e.id,{textContent:e.description}]));
 const dialog=Object.assign(element(),{open:false,querySelector:s=>({'[data-service-close]':close,img:photo,h2:title,'#service-dialog-description':description}[s]),querySelectorAll:s=>s==='button:not([disabled])'?[close,...languageButtons]:languageButtons,showModal(){this.open=true;},close(){this.open=false;this.handlers.close();},getBoundingClientRect:()=>({left:220,top:160,width:940,height:420}),animate(){animations++;return{finished:Promise.resolve(),cancel(){}};}});
 const document={body,documentElement:{clientWidth:1425,lang:'fr'},querySelectorAll:()=>cards,getElementById:()=>dialog,addEventListener:(n,f)=>documentHandlers[n]=f,
 querySelector(s){if(s.startsWith('[data-service-description'))return descriptions[s.match(/="([^"]+)"/)[1]];
  const lang=s.includes('"en"')?'en':'fr';return{click(){document.documentElement.lang=lang;for(const c of cards){c.name.textContent=lang==='en'?dictionary[c.data.title]:c.data.title;c.image.alt=lang==='en'?dictionary[c.data.alt]:c.data.alt;}for(const e of entries)descriptions[e.id].textContent=lang==='en'?dictionary[e.description]:e.description;documentHandlers['pi:language']();}};
 }};
 Object.defineProperty(document,'activeElement',{get:()=>focused});
 const preference={matches:reducedMotion,addEventListener:(n,f)=>handlers.motion=f};
 runInNewContext(source,{document,window:{scrollY:scroll,innerWidth:1440,scrollTo(x,y){scroll=typeof x==='object'?x.top:y;}},matchMedia:()=>preference,getComputedStyle:()=>({paddingRight:'0px'})});
 return {cards,dialog,close,photo,title,description,body,languageButtons,preference,handlers,get focused(){return focused},get scroll(){return scroll},get animations(){return animations}};
}
test('six real whole-card buttons use existing relevant images and translated concise content',()=>{
 assert.equal(entries.length,6);assert.equal(new Set(entries.map(e=>e.id)).size,6);
 for(const e of entries){assert.ok(readFileSync(new URL('..'+e.src,import.meta.url)).length>0);assert.ok(dictionary[e.title],e.title);assert.ok(dictionary[e.description],e.description);assert.ok(dictionary[e.alt],e.alt);}
 const section=html.slice(html.indexOf('<section class="school-services"'),html.indexOf('<section class="school-estimator'));
 assert.doesNotMatch(section,/<a |<iframe|<video/);assert.match(section,/Visuels illustratifs/);assert.match(entries[0].alt,/vu de dos/);
 assert.equal((html.match(/id="service-dialog"/g)||[]).length,1);assert.match(html,/data-service-language="fr"/);assert.match(html,/data-service-language="en"/);
});
test('every service opens its own content and closing restores scroll, styles and trigger focus',async()=>{
 const f=fixture();for(const c of f.cards){c.handlers.click();assert.equal(f.dialog.open,true);assert.equal(f.title.textContent,c.data.title);assert.equal(f.description.textContent,c.data.description);assert.equal(f.photo.src,c.data.src);assert.equal(f.body.style.position,'fixed');assert.equal(f.focused,f.close);await f.close.handlers.click();assert.equal(f.dialog.open,false);assert.equal(f.body.style.position,'relative');assert.equal(f.scroll,620);assert.equal(f.focused,c);}
 assert.equal(f.animations,12);
});
test('an open modal changes FR/EN without replacing the focused language control',async()=>{
 const f=fixture();f.cards[4].handlers.click();const language=f.languageButtons[1];language.focus();language.handlers.click();assert.equal(f.focused,language);assert.equal(f.title.textContent,dictionary[f.cards[4].data.title]);assert.equal(f.description.textContent,dictionary[f.cards[4].data.description]);assert.equal(f.dialog.open,true);assert.equal(language['aria-pressed'],'true');await f.close.handlers.click();assert.equal(f.focused,f.cards[4]);
});
test('reduced motion opens without enlargement; Escape and backdrop close one modal only',async()=>{
 const f=fixture(true);f.cards[0].handlers.click();f.cards[1].handlers.click();assert.equal(f.title.textContent,f.cards[0].data.title);assert.equal(f.animations,0);
 let prevented=false;f.dialog.handlers.cancel({preventDefault(){prevented=true;}});await new Promise(setImmediate);assert.equal(prevented,true);assert.equal(f.dialog.open,false);
 f.cards[2].handlers.click();f.dialog.handlers.click({target:f.dialog,clientX:0,clientY:0});await new Promise(setImmediate);assert.equal(f.dialog.open,false);assert.equal(f.focused,f.cards[2]);assert.equal(f.animations,0);
});
test('approved price markup, styles, reveal and estimator engine remain unchanged from main',()=>{
 const base=p=>execFileSync('git',['show','origin/main:'+p],{encoding:'utf8'});
 const price=s=>s.slice(s.indexOf('  <div class="offer-frame offer-price"'),s.indexOf('  <ul class="offer-frame offer-services"')<0?s.indexOf('  <section class="school-services"'):s.indexOf('  <ul class="offer-frame offer-services"')).trim();
 assert.equal(price(html),price(base('index.html')));
 assert.equal(read('assets/ecoles.css').split('/* Compact estimate;')[0],base('assets/ecoles.css').split('/* Compact estimate;')[0]);
 assert.equal(read('assets/school-home.js'),base('assets/school-home.js'));
 assert.equal(read('assets/site-translations.js').split('window.piTranslations =')[0],base('assets/site-translations.js').split('window.piTranslations =')[0]);
 for(const p of ['assets/ecoles-contact.js','assets/app-portal.js','assets/app-portal.css','api/schools-contact.js','vercel.json'])assert.equal(read(p),base(p),p);
 assert.doesNotMatch(read('assets/school-services.css'),/offer-price|offer-regular|data-reveal-state/);
});
test('only required service static resources are added to public access',async()=>{
 for(const path of ['/assets/school-services.js','/assets/school-services.css'])assert.equal((await middleware(new Request('https://purinstinctgames.com'+path))).headers.get('x-middleware-next'),'1');
 assert.equal((await middleware(new Request('https://purinstinctgames.com/app/admin'))).headers.get('location'),'https://purinstinct-app.vercel.app/app/admin');
});

test('Tab and Shift-Tab remain within the open service dialog',()=>{
 const f=fixture();f.cards[0].handlers.click();let prevented=false;
 f.dialog.handlers.keydown({key:'Tab',shiftKey:true,preventDefault(){prevented=true;}});
 assert.equal(prevented,true);assert.equal(f.focused,f.languageButtons[1]);
 prevented=false;f.dialog.handlers.keydown({key:'Tab',shiftKey:false,preventDefault(){prevented=true;}});
 assert.equal(prevented,true);assert.equal(f.focused,f.close);
});
