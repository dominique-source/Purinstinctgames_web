import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {runInNewContext} from 'node:vm';
import middleware from '../middleware.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html'),section=html.match(/<section class="school-logistics"[\s\S]*?<\/section>\n\n/)[0];
test('logistics is a single insertion between the unchanged hero and video',()=>{
 assert.equal((html.match(/id="logistique"/g)||[]).length,1);
 assert.ok(html.indexOf('class="zone-grid"')<html.indexOf('id="logistique"'));
 assert.ok(html.indexOf('id="logistique"')<html.indexOf('id="video-games"'));
 const previous=execFileSync('git',['show','origin/main:index.html'],{encoding:'utf8'}).match(/<section class="school-logistics"[\s\S]*?<\/section>\n\n/)[0];
 assert.equal(section,previous);
 for(const p of ['assets/school-home.js','assets/ecoles-contact.js','assets/site-language.js','assets/school-home.css','assets/ecoles.css','assets/school-funding.js','api/schools-contact.js'])assert.equal(read(p),execFileSync('git',['show','origin/main:'+p],{encoding:'utf8'}),p);
});
test('all kit text remains selectable and bilingual with explicit student transport scope',()=>{
 const content=JSON.parse(read('design/purinstinct-logistique/content.fr-en.json'));
 const scope={window:{}};runInNewContext(read('assets/site-translations.js'),scope);
 for(const key of ['title','accent','intro','costTitle','costText','pride','closing']){
  assert.ok(section.includes(content.fr[key]),key);assert.equal(scope.window.piTranslations[content.fr[key]],content.en[key]);
 }
 assert.equal((section.match(/class="logistics-benefit"/g)||[]).length,3);
 assert.match(section,/<strong>0 \$<\/strong> <span>DE TRANSPORT D’ÉLÈVES<\/span>/);
 assert.doesNotMatch(section,/<button|<a |<dialog|<details|<input|Dominique/);
 assert.match(section,/<h2 id="logistics-title">/);
});
test('responsive photos and scoped styles are available without changing auth protections',async()=>{
 for(const name of ['panorama','equipment','school','pride']){
  const path='/assets/school-logistics/'+name+'.webp';assert.ok(readFileSync(new URL('..'+path,import.meta.url)).length>1000);
  assert.equal((await middleware(new Request('https://purinstinctgames.com'+path))).headers.get('x-middleware-next'),'1');
 }
 assert.match(read('assets/school-logistics.css'),/@media\(max-width:800px\)/);
 assert.doesNotMatch(read('assets/school-logistics.css'),/@font-face|animation:/);
 assert.equal((await middleware(new Request('https://purinstinctgames.com/app/admin'))).headers.get('location'),'https://purinstinct-app.vercel.app/app/admin');
});
