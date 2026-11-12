import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {runInNewContext} from 'node:vm';
import middleware from '../middleware.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const base=p=>execFileSync('git',['show','origin/main:'+p],{encoding:'utf8'});
const html=read('index.html');
test('calculator markup, prices, modal content and interactive code stay unchanged',()=>{
 const grid=s=>s.slice(s.indexOf('   <div class="estimate-grid">'),s.indexOf('   <p class="estimate-note">'));
 assert.ok(grid(html).length>500);assert.equal(grid(html),grid(base('index.html')));
 const library=s=>s.slice(s.indexOf('<article data-funding-description="school"'),s.indexOf('</div></section>'));
 assert.equal(library(html),library(base('index.html')));
 for(const p of ['assets/school-home.js','assets/site-language.js','assets/school-funding.js','assets/ecoles.css','assets/ecoles-contact.js','assets/hero-deck/games-brush.png']){
  if(p.endsWith('.png'))assert.deepEqual(readFileSync(new URL('../'+p,import.meta.url)),execFileSync('git',['show','origin/main:'+p],{maxBuffer:10*1024*1024}));
  else assert.equal(read(p),base(p),p);
 }
});
test('photo cards use five individual resources with HTML labels and move the block inquiry after funding',()=>{
 assert.ok(html.indexOf('data-multiple-blocks-inquiry')>html.indexOf('data-funding-inquiry'));
 assert.match(html,/ET POUR FINANCER VOTRE PROJET\?/);
 for(const key of ['school','grants','foundations','sponsors','local']){
  assert.match(html,new RegExp('data-funding="'+key+'"[^>]*><img src="/assets/funding/'+key+'\\.webp"'));
  assert.ok(readFileSync(new URL('../assets/funding/'+key+'.webp',import.meta.url)).length>1000);
 }
 assert.match(html,/class="funding-plus" aria-hidden="true">\+/);
});
test('French signature is the transparent PNG with one accessible translated H1',()=>{
 const png=readFileSync(new URL('../images/branding/les-jeux-purinstinct-ecole-fr.png',import.meta.url));
 assert.equal(png.readUInt32BE(16),1921);assert.equal(png.readUInt32BE(20),819);assert.equal(png[25],6);
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.match(html,/<h1 id="school-title"><span class="visually-hidden">Les Jeux PürInstinct à l’école<\/span>/);
 assert.match(html,/class="signature-fr" aria-hidden="true"><img[^>]*alt=""/);
 assert.match(html,/class="signature-en" aria-hidden="true"/);
 const scope={window:{}};runInNewContext(read('assets/site-translations.js'),scope);
 assert.equal(scope.window.piTranslations['Les Jeux PürInstinct à l’école'],'PürInstinct Games at School');
});
test('only the required new public graphic resources are readable',async()=>{
 for(const path of ['/images/branding/les-jeux-purinstinct-ecole-fr.png',...['school','grants','foundations','sponsors','local'].map(k=>'/assets/funding/'+k+'.webp')])assert.equal((await middleware(new Request('https://purinstinctgames.com'+path))).headers.get('x-middleware-next'),'1');
});
