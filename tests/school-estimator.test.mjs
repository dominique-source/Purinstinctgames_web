import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext,Script} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const ctx={window:{}};runInNewContext(read('assets/site-translations.js'),ctx);
const m=ctx.window.piSchoolCommercial,e=m.estimator;
const plan=(overrides={})=>({students:200,reinforcements:0,extraClasses:'0',multipleBlocks:false,...overrides});
test('all confirmed same-day clinic packages use the exact total rather than a unit price',()=>{
 for(const [classes,total] of [0,400,750,1100,1400].entries())assert.equal(e.calculate(plan({extraClasses:String(classes)})).clinicCents,total*100);
});
test('all approved examples and rounded per-student amounts are calculated in cents',()=>{
 for(const [staff,classes,total,per]of[[0,'0',2000,10],[2,'0',2800,14],[2,'2',3550,17.75],[0,'4',3400,17]]){
  const r=e.calculate(plan({reinforcements:staff,extraClasses:classes}));assert.equal(r.estimatedCents,total*100);assert.equal(r.perStudentCents,per*100);
 }
 assert.equal(e.calculate(plan({students:3,extraClasses:'1'})).perStudentCents,14333);
 assert.equal(e.calculate(plan({students:2000})).baseCents,2000000);
});
test('invalid and empty numeric drafts never create a false budget or divide by zero',()=>{
 for(const key of ['students','reinforcements'])for(const value of['',' ',null,undefined,NaN,Infinity,-1,1.5,true,10000000])assert.equal(e.calculate(plan({[key]:value})),null,key+':'+String(value));
 assert.equal(e.calculate(plan({students:0})),null);
 for(const value of ['5','-1','1.5','',null])assert.equal(e.calculate(plan({extraClasses:value})),null);
});
test('custom clinics are explicitly unpriced; multiple-block interest never doubles the program',()=>{
 const r=e.calculate(plan({reinforcements:2,extraClasses:'custom',multipleBlocks:true}));
 assert.equal(r.clinicCents,null);assert.equal(r.customClinics,true);assert.equal(r.estimatedCents,280000);assert.equal(r.firstBlockOnly,true);
 for(const lang of ['fr','en']){
  const s=e.summary(r.configuration,lang);assert.match(s,lang==='fr'?/hors cliniques sur mesure et déplacement/:/excluding custom clinics and travel/);
  assert.match(s,lang==='fr'?/blocs supplémentaires exclus/:/Additional block fees excluded/);
  assert.match(s,lang==='fr'?/non chiffré/:/not priced/);
 }
});
test('legacy staffing and clinic counts cannot override visible choices; links restore only useful fields',()=>{
 const old={students:200,clinics:4,hours:8,teachers:0,adults:0,indoors:1,outdoors:2,blocks:[{fields:2,games:15,teachers:18},{}]};
 const restored=e.restore(old);assert.equal(restored.legacy,true);assert.deepEqual({...restored.value},{version:e.policy.version,students:200,reinforcements:0,extraClasses:'0',multipleBlocks:true});
 const explicit=plan({reinforcements:2,extraClasses:'2',...{blocks:old.blocks}});
 assert.equal(e.calculate(explicit).estimatedCents,355000);
 assert.equal(e.restore(plan({reinforcements:-1})),null);
 assert.equal(e.restore({...old,students:0}),null);
 assert.equal(e.restore(plan({reinforcements:2})).legacy,false);
});
test('FR and EN summaries include every selected cost and exclusion, never a 25-dollar school total',()=>{
 for(const lang of ['fr','en']){
  const s=e.summary(plan({reinforcements:2,extraClasses:'2',multipleBlocks:true}),lang);
  assert.ok(s.includes(e.policy.version));assert.match(s,lang==='fr'?/3\s?550/:/3,550/);assert.match(s,lang==='fr'?/17,75/:/17.75/);
  assert.match(s,lang==='fr'?/même journée/:/same day/);assert.match(s,lang==='fr'?/taxes/:/tax/);
  assert.doesNotMatch(s,/25|5[ ,]000|50[ ,]000|Reference|Référence|plateaux|transition/);
 }
});
test('public estimate replaces detailed planning, preserves funding separately and stays independent of price animation',()=>{
 const html=read('index.html'),js=read('assets/school-home.js');
 assert.equal((html.match(/id="configuration"/g)||[]).length,1);
 assert.doesNotMatch(html,/config-v2|config-step|config-schedule|config-staff|12 blocs|config-notes/);
 assert.ok(html.indexOf('id="financement"')>html.indexOf('id="multiple-blocks"'));
 assert.match(html,/Classes supplémentaires de clinique/);assert.match(html,/DISCUTER DE MON PROJET/);
 assert.match(html,/<details class="estimate-help">/);
 assert.doesNotMatch(js.slice(js.indexOf('// Compact estimate:'),js.indexOf('const motion =')),/cfgBlocks|staffing\(|regularRate|localStorage|sessionStorage/);
 const initial=JSON.stringify(plan({reinforcements:2,extraClasses:'2'}));
 for(const rate of [25,20,10])assert.equal(e.calculate(JSON.parse(initial)).estimatedCents,355000,rate);
});

test('classic scripts share a compatible global scope on the actual public page',()=>{
 const scripts=['app-portal.js','games-menu.js','site-translations.js','site-language.js','school-home.js','ecoles-contact.js'];
 assert.doesNotThrow(()=>new Script(scripts.map(name=>read('assets/'+name)).join('\n;\n')));
});
