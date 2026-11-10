import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import middleware from '../middleware.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html'),js=read('assets/school-home.js');
test('discovery stays on one page, with unique IDs, one form and accessible APP notice entry',()=>{
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
 for(const match of html.matchAll(/href="([^"]+)"/g)){
  const href=match[1];if(href.startsWith('#'))assert.ok(ids.includes(href.slice(1)),href);
 }
 const nav=html.match(/<nav.*?<\/nav>/s)[0],footer=html.match(/<footer.*?<\/footer>/s)[0];
 assert.doesNotMatch(nav+footer,/L’Arène|Pür ID|pour-les-ecoles.html|concept.html|zones.html/);
 assert.doesNotMatch(html,/Explorer la zone|Explore the zone|href="\/(zones|concept|pur-id|pour-les-ecoles)\.html/);
 assert.match(nav,/<button type="button" data-app-entry class="nav-app-link"/);
 assert.equal((html.match(/<form /g)||[]).length,1);
 assert.ok(html.indexOf('id="contact"')>html.indexOf('id="configuration"'));
 assert.match(html,/action="\/api\/schools-contact"/);
 assert.doesNotMatch(read('pour-les-ecoles.html'),/<form/);
 assert.match(html,/data-school-proposal href="#contact"/);
});
test('legacy public school URLs preserve language, valid section and shared configuration without touching protected routes',async()=>{
 const redirect=read('pour-les-ecoles.html').match(/<script>(.*?)<\/script>/s)[1];
 for(const [hash,section] of [['#contact','contact'],['#programme','parcours'],['#unknown','contact']]){
  let destination;runInNewContext(redirect,{location:{hash,search:'?lang=en&configuration=example',replace:url=>destination=url}});
  assert.equal(destination,'/?lang=en&configuration=example#'+section);
 }
 for(const path of ['/','/pour-les-ecoles.html','/assets/ecoles-contact.js','/assets/render-speed.jpg']){
  const response=await middleware(new Request('https://example.test'+path));assert.equal(response.headers.get('x-middleware-next'),'1');
 }
 for(const path of ['/zone-speed.mp4','/concept.html','/pur-id.html','/app/admin']){
  const response=await middleware(new Request('https://example.test'+path));assert.equal(response.status,path.startsWith('/app/')?307:302,path);
 }
});
test('five distinct existing public zone images, plus a separate field, replace outbound buttons and empty players',()=>{
 for(const [zone,file] of [['vitesse','speed'],['agilite','agility'],['habiletes-manuelles','hand'],['habiletes-au-pied','foot'],['game-iq','iq']]){
  const panel=html.match(new RegExp('<article class="zone-detail" id="zone-'+zone+'"[\\s\\S]*?</article>'))[0];
  assert.match(panel,new RegExp('/assets/render-'+file+'\\.jpg'));
  assert.match(panel,/data-zone-video=""/);assert.doesNotMatch(panel,/<iframe|<video|<a /);
  assert.ok(readFileSync(new URL('../assets/render-'+file+'.jpg',import.meta.url)).length>0);
 }
 assert.match(html,/id="zone-terrain"/);
});
function arenaMount(){
 const listeners={},focused=[];let stops=0;
 const classes=()=>({toggle(){},remove(){}});
 const keys=['vitesse','agilite','habiletes-manuelles','habiletes-au-pied','game-iq','terrain'];
 const panels=keys.map(key=>({id:'zone-'+key,hidden:true,querySelector:()=>({focus:()=>focused.push('heading')})}));
 const controls=keys.map(key=>({dataset:{zone:key},events:{},classList:{contains:()=>true},setAttribute(name,value){this[name]=value;},toggleAttribute(){},removeAttribute(){},closest:()=>null,matches:()=>false,focus:()=>focused.push(key),addEventListener(name,fn){this.events[name]=fn;}}));
 const container={hidden:true,events:{},addEventListener(name,fn){this.events[name]=fn;}};
 const close={addEventListener:(name,fn)=>listeners.close=fn};
 const document={getElementById:id=>panels.find(p=>p.id===id),querySelectorAll:()=>[],addEventListener:(name,fn)=>listeners[name]=fn};
 runInNewContext(js.slice(js.indexOf('let hoveredPanel'),js.indexOf('const visibilityObserver')),{zoneControls:controls,zonePanels:panels,arena:{classList:classes()},arenaEffects:keys.map(key=>({dataset:{effect:key},classList:classes()})),panelContainer:container,closePanel:close,mobileScene:{matches:false},document,stopZoneClips:()=>stops++,clearTimeout(){},setTimeout:fn=>fn()});
 return {controls,panels,container,listeners,focused,get stops(){return stops;}};
}
test('all six zones switch in place, one panel at a time; Escape closes and restores focus',()=>{
 const m=arenaMount();for(const control of m.controls){control.events.click();assert.deepEqual(m.panels.filter(p=>!p.hidden).map(p=>p.id),['zone-'+control.dataset.zone]);assert.equal(m.container.hidden,false);assert.equal(control['aria-pressed'],'true');}
 m.listeners.keydown({key:'Escape'});assert.equal(m.container.hidden,true);assert.equal(m.focused.at(-1),'terrain');assert.equal(m.stops,7);
});
test('configured future clips load voluntarily and are released on switch/close or failure',async()=>{
 const videos=[];let handler;const image={hidden:false,src:'/poster.jpg',before:v=>videos.push(v)};
 const play={hidden:true,addEventListener:(name,fn)=>handler=fn};const error={hidden:true};
 const panel={id:'zone-vitesse',dataset:{zoneVideo:'/approved-clip.mp4'},querySelector:selector=>selector==='.zone-photo'?image:selector==='.zone-play'?play:selector==='.zone-media-error'?error:{},querySelectorAll:()=>videos};
 const ctx={zonePanels:[panel],document:{createElement:()=>({events:{},setAttribute(){},addEventListener(name,fn){this.events[name]=fn;},focus(){},play:async()=>{},pause(){this.paused=true;},remove(){videos.splice(videos.indexOf(this),1);}})}};
 runInNewContext(js.slice(js.indexOf('// Optional zone clips:'),js.indexOf('// Click-to-play school video:')),ctx);
 assert.equal(videos.length,0);assert.equal(play.hidden,false);
 await handler();const video=videos[0];assert.equal(video.controls,true);assert.equal(video.preload,'none');assert.equal(image.hidden,true);
 ctx.stopZoneClips();assert.equal(video.paused,true);assert.equal(videos.length,0);assert.equal(image.hidden,false);
 await handler();videos[0].events.error();assert.equal(videos.length,0);assert.equal(error.hidden,false);assert.equal(image.hidden,false);
});

test('hovering the in-panel chooser cannot change the selected content before activation',()=>{
 const m=arenaMount();m.controls[0].events.click();m.container.events.pointerenter();
 m.controls[1].closest=()=>({});m.controls[1].events.pointerenter({pointerType:'mouse'});
 assert.deepEqual(m.panels.filter(p=>!p.hidden).map(p=>p.id),['zone-vitesse']);
 m.controls[1].events.click();assert.deepEqual(m.panels.filter(p=>!p.hidden).map(p=>p.id),['zone-agilite']);
 assert.equal(m.controls[1]['aria-pressed'],'true');
});
