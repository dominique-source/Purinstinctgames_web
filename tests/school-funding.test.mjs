import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
function fixture(value='',selector='[data-multiple-blocks-inquiry]'){
 const events={},clicks={},comments={value,dispatchEvent(){}};
 const dialog={querySelector:()=>({addEventListener(){}}),querySelectorAll:()=>[],addEventListener(){}};
 const document={documentElement:{lang:'fr'},querySelector:s=>s===selector?{addEventListener:(name,fn)=>clicks[name]=fn}:s.includes('inquiry')?null:comments,getElementById:()=>dialog,querySelectorAll:()=>[],addEventListener:(name,fn)=>events[name]=fn};
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

test('funding inquiry preserves authored content and adds one bilingual editable mention',()=>{
 const f=fixture('Mon texte.', '[data-funding-inquiry]');f.click();f.click();
 assert.equal(f.comments.value,'Mon texte.\n\nJ’aimerais discuter des possibilités de financement pour notre projet PürInstinct Games scolaires.');
 f.language('en');f.click();assert.equal(f.comments.value,'Mon texte.\n\nI would like to discuss funding possibilities for our PürInstinct Games school project.');
 f.comments.value='Texte libre modifié.';f.language('fr');f.click();assert.equal(f.comments.value,'Texte libre modifié.');
});
test('official resources identify grouped measures, French program names and four official sources',()=>{
 const html=read('index.html');
 for(const text of ['mesure 1330','15023','15028','15232','PAFILR','Une école montréalaise pour tous','Pour les établissements montréalais concernés','et non des subventions indépendantes'])assert.ok(html.includes(text));
 assert.equal((html.match(/class="funding-explore"/g)||[]).length,5);
 const section=html.slice(html.indexOf('<section class="funding-options"'),html.indexOf('<section class="school-contact-section"'));
 assert.equal(section.split('href="https://www.quebec.ca/').length-1,4);
 assert.match(read('assets/school-funding.js'),/button,a\[href\]/);
});
