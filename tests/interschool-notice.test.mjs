import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
function fixture(){
 const events={}, handlers={}; let focused=null;
 const message={},close={textContent:'',addEventListener:(k,f)=>handlers[k]=f,focus:()=>focused=close};
 const dialog={open:false,setAttribute(){},querySelector:s=>s==='p'?message:close,addEventListener:(k,f)=>events[k]=f,getBoundingClientRect:()=>({left:10,right:100,top:10,bottom:100}),showModal(){this.open=true;close.focus();},close(){this.open=false;events.close();}};
 const button={attrs:{},setAttribute(k,v){this.attrs[k]=v;},addEventListener:(k,f)=>button[k]=f,focus:()=>focused=button};
 const language={}; const document={documentElement:{lang:'fr'},querySelectorAll:()=>[button],createElement:()=>dialog,body:{append(){}},addEventListener:(k,f)=>language[k]=f};
 runInNewContext(read('assets/interschool-notice.js'),{document,window:{piTranslations:{}}});
 return {dialog,button,close,message,events,handlers,document,language,focus:()=>focused};
}
test('interschool notice is bilingual and restores trigger focus on each close path',()=>{
 const f=fixture();f.button.click();assert.equal(f.message.textContent,'À venir au printemps 2028');assert.equal(f.dialog.open,true);
 f.document.documentElement.lang='en';f.language['pi:language']();assert.equal(f.message.textContent,'Coming spring 2028');assert.equal(f.close.textContent,'Close');
 f.handlers.click();assert.equal(f.dialog.open,false);assert.equal(f.focus(),f.button);
 f.button.click();f.events.click({target:f.dialog,clientX:0,clientY:0});assert.equal(f.dialog.open,false);assert.equal(f.focus(),f.button);
 let stopped=false,prevented=false;f.button.click();f.events.keydown({key:'Escape',stopPropagation(){stopped=true;}});assert.equal(stopped,true);
 f.events.keydown({key:'Tab',preventDefault(){prevented=true;}});assert.equal(prevented,true);assert.equal(f.focus(),f.close);
 assert.equal(f.button.attrs['aria-haspopup'],'dialog');assert.equal(f.button.attrs['aria-controls'],'pi-interschool-notice');
});
test('public menus place a non-navigation interschool button immediately before APP',()=>{
 for(const page of ['index.html','zones.html','concept.html','pur-id.html']){
  const html=read(page);assert.match(html,/<button type="button" data-interschool-entry[^>]*>Compétition interscolaire<\/button>\s*<button type="button" data-app-entry/);
  assert.equal((html.match(/data-interschool-entry/g)||[]).length,1);
 }
 assert.match(read('assets/app-portal.js'),/const phrase = "À venir au printemps 2027"/);
 assert.doesNotMatch(read('assets/interschool-notice.js'),/location|fetch\(|sessionStorage/);
});
