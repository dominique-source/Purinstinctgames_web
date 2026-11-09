import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const source=read('assets/school-home.js');
const reveal=source.slice(source.indexOf('// One-shot school price reveal.'),source.indexOf('// Click-to-play school video:'));
function mount(reduced=false,observerAvailable=true){
 const frames=new Map(),listeners={},classes=new Set(),values=[];let next=0,intersect,disconnects=0;
 const counter={set textContent(v){values.push(Number(v));},get textContent(){return String(values.at(-1));}};
 const panel={dataset:{},querySelector:()=>counter,classList:{add:v=>classes.add(v),remove:v=>classes.delete(v)}};
 const preference={matches:reduced,addEventListener:(name,fn)=>listeners[name]=fn,removeEventListener:name=>delete listeners[name]};
 const window={piSchoolCommercial:{policy:{regularRate:25,pilotRate:10}},addEventListener:(name,fn)=>listeners[name]=fn};
 class Observer {constructor(fn){intersect=fn;}observe(){}disconnect(){disconnects++;}}
 if(observerAvailable)window.IntersectionObserver=Observer;
 runInNewContext(reveal,{window,document:{querySelector:()=>panel},matchMedia:()=>preference,IntersectionObserver:Observer,requestAnimationFrame:fn=>{frames.set(++next,fn);return next;},cancelAnimationFrame:id=>frames.delete(id)});
 return {panel,values,frames,classes,listeners,preference,intersect:ratio=>intersect([{isIntersecting:ratio>0,intersectionRatio:ratio}]),tick(time){const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn(time));},get disconnects(){return disconnects;}};
}
test('reveal waits for visibility, counts every integer from 25 to exactly 10, then never restarts',()=>{
 const m=mount();assert.equal(m.panel.dataset.revealState,'pending');assert.equal(m.frames.size,0);
 m.intersect(.2);assert.equal(m.frames.size,0);m.intersect(.4);
 for(let time=0;time<=1800;time+=60)m.tick(time);
 assert.deepEqual([...new Set(m.values)],Array.from({length:16},(_,i)=>25-i));
 assert.equal(m.panel.dataset.revealState,'complete');assert.equal(m.frames.size,0);assert.ok(m.classes.has('offer-arrival'));
 m.intersect(1);assert.equal(m.frames.size,0);assert.ok(m.disconnects>0);
});
test('reduced motion and missing observer render the final price without animation',()=>{
 for(const m of [mount(true),mount(false,false)]){assert.deepEqual(m.values,[10]);assert.equal(m.frames.size,0);assert.equal(m.classes.size,0);assert.equal(m.panel.dataset.revealState,'complete');}
});
test('turning on reduced motion or leaving the page cancels an active counter',()=>{
 for(const reason of ['reduce','pagehide']){
  const m=mount();m.intersect(1);m.tick(0);m.tick(600);
  if(reason==='reduce'){m.preference.matches=true;m.listeners.change();}else m.listeners.pagehide();
  assert.equal(m.values.at(-1),10);assert.equal(m.frames.size,0);assert.equal(m.panel.dataset.revealState,'complete');assert.equal(m.classes.size,0);
 }
});
test('no-JS final price and a single proposal destination remain semantic; reveal cannot announce each frame',()=>{
 const html=read('index.html');
 assert.equal((html.match(/data-price-reveal/g)||[]).length,1);
 assert.equal((html.match(/id="students"/g)||[]).length,1);
 assert.match(html,/class="offer-counter" aria-hidden="true" data-i18n/);
 assert.match(html,/data-price-counter>10<\/span>/);
 assert.match(html,/class="offer-sr">Tarif régulier : 25 \$ CA/);
 assert.match(html,/data-school-proposal href="\/pour-les-ecoles.html#contact"/);
 assert.doesNotMatch(reveal,/pi:language|wheel|preventDefault/);
});

test('steppers respect field bounds, initialize optional counts, and use the existing input event',()=>{
 const code=source.slice(source.indexOf('// School offer steppers:'),source.indexOf('// One-shot school price reveal.'));
 for(const [current,min,max,step,wanted] of [[1,1,999999,-1,1],[5,1,5,1,5],[200,1,999999,1,201],[NaN,1,999999,1,1],[0,0,999999,-1,0]]){
  let click,dispatched;
  const input={valueAsNumber:current,min,max,dispatchEvent:e=>dispatched=e};
  const button={dataset:{stepTarget:'field',step},addEventListener:(name,fn)=>click=fn};
  runInNewContext(code,{document:{querySelectorAll:()=>[button],getElementById:()=>input},Event:class{constructor(type,options){this.type=type;this.bubbles=options.bubbles;}}});
  click();assert.equal(Number(input.value),wanted);assert.equal(dispatched.type,'input');assert.equal(dispatched.bubbles,true);
 }
});

test('the configurator never calculates a regular school budget, independently of the commercial counter',()=>{
 const html=read('index.html');
 const shared={window:{}};runInNewContext(read('assets/site-translations.js'),shared);
 const model=shared.window.piSchoolCommercial;
 assert.doesNotMatch(html,/data-regular-total|Référence régulière du programme/);
 assert.doesNotMatch(source,/data-regular-total|budget\.regular/);
 assert.doesNotMatch(reveal,/updateConfiguration|estimate\(|data-pilot-total|\.value\s*=/);
 const m=mount();m.intersect(1);
 for(const time of [0,300,900,1800]){
  m.tick(time);
  assert.equal(model.estimate(200).base,2000);
  assert.equal(model.estimate(2000).base,20000);
  assert.equal('regular' in model.estimate(2000),false);
 }
 assert.match(read('assets/ecoles.css'),/\[data-reveal-state="complete"\] \.offer-regular strong[^}]+line-through/);
});
