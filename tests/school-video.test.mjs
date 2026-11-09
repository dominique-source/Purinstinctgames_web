import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const all=read('assets/school-home.js');
const script=all.slice(all.indexOf('// Click-to-play school video:'));
function mount() {
 const handlers={}, events={}, created=[];
 const node=id=>({hidden:false,listeners:{},addEventListener(name,fn){this.listeners[name]=fn;},classList:{add(){}},id});
 const nodes=Object.fromEntries(['school-video-play','school-video-stage','school-video-poster','school-video-failure','school-video-fullscreen','school-video-fullscreen-status','video-games'].map(id=>[id,node(id)]));
 nodes['school-video-failure'].hidden=true;
 const document={documentElement:{lang:'fr'},getElementById:id=>nodes[id],addEventListener:(name,fn)=>events[name]=fn,createElement(tag){assert.equal(tag,'iframe');let src;const frame={...node('frame'),writes:0,set src(value){src=value;this.writes++;},get src(){return src;},focus(){this.focused=true;}};created.push(frame);return frame;}};
 nodes['school-video-stage'].replaceChildren=frame=>nodes['school-video-stage'].child=frame;
 runInNewContext(script,{document,window:{addEventListener:(name,fn)=>handlers[name]=fn},matchMedia:()=>({matches:true})});
 return {nodes,document,events,created};
}
test('no player is created before explicit activation; one click creates a focused nocookie player',()=>{
 const m=mount();assert.equal(m.created.length,0);
 m.nodes['school-video-play'].listeners.click();
 assert.equal(m.created.length,1);
 const frame=m.created[0];
 assert.match(frame.src,/^https:\/\/www.youtube-nocookie.com\/embed\/chfQomu8rZ4\?/);
 assert.equal(new URL(frame.src).searchParams.get('autoplay'),'1');
 assert.equal(new URL(frame.src).searchParams.get('loop'),'0');
 assert.equal(frame.allowFullscreen,true);
 assert.equal(frame.focused,true);
 assert.equal(frame.title,'Vidéo PürInstinct Games');
 m.nodes['school-video-play'].listeners.click();assert.equal(m.created.length,1);
});
test('language changes translate only the accessible player name, with no restart',()=>{
 const m=mount();m.nodes['school-video-play'].listeners.click();
 const frame=m.created[0], src=frame.src;
 m.document.documentElement.lang='en';m.events['pi:language']();
 assert.equal(frame.title,'PürInstinct Games video');assert.equal(frame.src,src);assert.equal(frame.writes,1);
});
test('poster failure keeps play available, and embed error exposes a fallback status',()=>{
 const m=mount();m.nodes['school-video-poster'].listeners.error();assert.equal(m.nodes['school-video-poster'].hidden,true);
 m.nodes['school-video-play'].listeners.click();m.created[0].listeners.error();assert.equal(m.nodes['school-video-failure'].hidden,false);
});
test('one responsive video section precedes the existing program, with a permanent external fallback',()=>{
 const html=read('index.html');
 assert.equal((html.match(/id="video-games"/g)||[]).length,1);
 assert.ok(html.indexOf('id="video-games"')<html.indexOf('id="parcours"'));
 const section=html.slice(html.indexOf('<section class="school-section school-video"'),html.indexOf('<section class="school-section" id="parcours"'));
 assert.doesNotMatch(section,/<iframe|<script/);
 assert.match(section,/href="#parcours"/);
 assert.match(section,/href="https:\/\/www.youtube.com\/shorts\/chfQomu8rZ4"/);
 assert.match(section,/type="button" aria-label="Lire la vidéo"/);
 const css=read('assets/ecoles.css');assert.match(css,/aspect-ratio: 9\/16/);assert.match(css,/prefers-reduced-motion:no-preference/);
});
test('fullscreen delegates to the native API only on user activation and reports a refusal', async()=>{
 const m=mount();let requested=0;
 m.nodes['school-video-stage'].requestFullscreen=async()=>{requested++;};
 m.nodes['school-video-play'].listeners.click();
 assert.equal(requested,0);
 assert.equal(m.nodes['school-video-fullscreen'].hidden,false);
 await m.nodes['school-video-fullscreen'].listeners.click();assert.equal(requested,1);
 m.nodes['school-video-stage'].requestFullscreen=async()=>{throw new Error('not available');};
 m.nodes['school-video-fullscreen-status'].hidden=true;
 await m.nodes['school-video-fullscreen'].listeners.click();
 assert.equal(m.nodes['school-video-fullscreen-status'].hidden,false);
});
