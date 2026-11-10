import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source=readFileSync(new URL('../assets/app-portal.js',import.meta.url),'utf8');
function fixture(lang='fr'){
 const events={}, buttonEvents={},dialogEvents={},closeEvents={};
 let opened=0,focused=0;
 const message={textContent:''},close={textContent:'',addEventListener:(n,f)=>closeEvents[n]=f};
 const dialog={id:'',querySelector:s=>s==='p'?message:close,setAttribute(){},addEventListener:(n,f)=>dialogEvents[n]=f,showModal(){opened++},close(){opened--;dialogEvents.close()},getBoundingClientRect:()=>({left:10,right:100,top:10,bottom:100})};
 const button={tagName:'BUTTON',setAttribute(){},addEventListener:(n,f)=>buttonEvents[n]=f,focus(){focused++}};
 const document={documentElement:{lang},querySelectorAll:()=>[button],createElement:()=>dialog,body:{append(){}},addEventListener:(n,f)=>events[n]=f};
 // No window.location, navigator, storage or head: accessing any would fail.
 runInNewContext(source,{document,window:{piTranslations:{'À venir au printemps 2027':'Coming spring 2027','Fermer':'Close'}}});
 return{document,events,dialogEvents,closeEvents,dialog,message,close,buttonEvents,get opened(){return opened},get focused(){return focused}};
}
test('APP notice opens in FR/EN without invoking navigation, storage or prefetch',()=>{
 for(const [lang,text] of [['fr','À venir au printemps 2027'],['en','Coming spring 2027']]){
  const f=fixture(lang);f.buttonEvents.click();assert.equal(f.opened,1);assert.equal(f.message.textContent,text);
  f.closeEvents.click();assert.equal(f.opened,0);assert.equal(f.focused,1);
 }
});
test('notice follows existing language event and closes only on outside click',()=>{
 const f=fixture();f.buttonEvents.click();f.document.documentElement.lang='en';f.events['pi:language']();assert.equal(f.message.textContent,'Coming spring 2027');
 f.dialogEvents.click({target:f.dialog,clientX:50,clientY:50});assert.equal(f.opened,1);
 f.dialogEvents.click({target:f.dialog,clientX:0,clientY:0});assert.equal(f.opened,0);assert.equal(f.focused,1);
 let stopped=false;f.dialogEvents.keydown({key:'Escape',stopPropagation(){stopped=true}});assert.equal(stopped,true);
});
