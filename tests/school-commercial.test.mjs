import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const read = path => readFileSync(new URL('../'+path, import.meta.url),'utf8');
const source=read('assets/school-home.js');
const shared={window:{}};
runInNewContext(read('assets/site-translations.js'), shared);
test('pilot base and invalid distinct counts remain independent from the commercial animation',()=>{const m=shared.window.piSchoolCommercial;for(const n of [1,200,2000]){assert.equal(m.estimate(n).base,n*10);assert.equal('regular' in m.estimate(n),false);}for(const n of [0,-1,1.5,NaN])assert.equal(m.estimate(n).base,null);});
test('the unified public page distinguishes price, pilot discount, travel and external funding',()=>{
 for(const path of ['index.html']){
  const html=read(path);
  assert.ok(html.indexOf('Tarif régulier')<html.indexOf('Cohorte pilote'));
  for(const phrase of ['25 $','10 $','Frais de déplacement en sus','réduction commerciale de 60 %','Cette réduction n’est pas une subvention gouvernementale.','L’admissibilité et l’obtention de fonds ne sont pas garanties.','plus d’un mois'])assert.ok(html.includes(phrase),path+': '+phrase);
  assert.doesNotMatch(html,/14 500|7,25|data-cad="14500"/);
 }
});
test('the homepage keeps configuration inputs and interactive field controls',()=>{
 const html=read('index.html');
 for(const id of ['students','reinforcements','extra-classes'])assert.ok(html.includes('id="'+id+'"'));
 assert.doesNotMatch(html,/id="(?:block-count|config-schedule|config-activities|config-staff|indoors|outdoors)"/);
 assert.equal((html.match(/class="arena-pin"/g)||[]).length,6);
 assert.ok(html.includes('assets/app-portal.js'));
});
test('school contact form keeps original fields, endpoint and submission handling',()=>{
 const html=read('index.html');
 assert.ok(html.includes('action="/api/schools-contact"'));
 for(const name of ['Nom','École','Ville','Courriel','Commentaires'])assert.ok(html.includes('name="'+name+'"'));
 assert.ok(read('assets/ecoles-contact.js').includes('Object.fromEntries(new FormData(form))'));
});
