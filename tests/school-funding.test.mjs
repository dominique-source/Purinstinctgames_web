import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
function fixture(value=''){
 const events={},clicks={},comments={value,dispatchEvent(){}};
 const dialog={querySelector:()=>({addEventListener(){}}),querySelectorAll:()=>[],addEventListener(){}};
 const document={documentElement:{lang:'fr'},querySelector:s=>s.includes('inquiry')?{addEventListener:(name,fn)=>clicks[name]=fn}:comments,getElementById:()=>dialog,querySelectorAll:()=>[],addEventListener:(name,fn)=>events[name]=fn};
 const shared={window:{}};runInNewContext(read('assets/site-translations.js'),shared);
 runInNewContext(read('assets/school-funding.js'),{document,window:shared.window,Event:class{}});
 return {comments,document,click:()=>clicks.click(),language:lang=>{document.documentElement.lang=lang;events['pi:language']();}};
}
test('block inquiry preserves authored text, adds one editable mention and keeps it bilingual',()=>{
 const f=fixture('Mon projet.');f.click();f.click();assert.equal(f.comments.value,'Mon projet.\n\nJe souhaite discuter de plusieurs blocs de 4 heures dans une même journée.');
 f.language('en');f.click();assert.equal(f.comments.value,'Mon projet.\n\nI would like to discuss several 4-hour blocks on the same day.');
 f.language('fr');assert.equal((f.comments.value.match(/Je souhaite/g)||[]).length,1);
 f.comments.value='Mon texte modifié librement.';f.language('en');f.click();assert.equal(f.comments.value,'Mon texte modifié librement.');
});
test('empty comments and an existing manual mention do not produce duplicates',()=>{
 const f=fixture();f.click();assert.ok(!f.comments.value.startsWith('\n'));
 const g=fixture(f.comments.value);g.click();assert.equal(g.comments.value,f.comments.value);
});
test('five funding notices are local and cannot calculate or send a message',()=>{
 const html=read('index.html'),js=read('assets/school-funding.js');
 assert.equal((html.match(/data-funding="/g)||[]).length,5);
 for(const key of ['school','grants','foundations','sponsors','local'])assert.ok(html.includes('data-funding-description="'+key+'"'));
 assert.doesNotMatch(html,/id="multiple-blocks"|id="estimate-block-help"|id="estimate-first-block"/);
 assert.match(html,/href="#schools-contact-form">Remplir le formulaire/);
 assert.match(html,/Événement final de 4 h. Déplacement en sus. Proposition adaptée à votre école./);
 assert.doesNotMatch(js,/fetch\(|submit\(|requestSubmit|calculate\(|pi:configuration/);
 assert.match(read('assets/school-funding.css'),/prefers-reduced-motion:reduce/);
});
