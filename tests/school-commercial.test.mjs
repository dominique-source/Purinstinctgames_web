import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const read = path => readFileSync(new URL('../'+path, import.meta.url),'utf8');
const source=read('assets/school-home.js');
const shared={window:{}};
runInNewContext(read('assets/site-translations.js'), shared);
// Exercise the actual configuration function, not a second pricing formula.
const calculation=source.slice(source.indexOf('function formatters()'),source.indexOf('for (const input of document.querySelectorAll(".school-fields input"))'));
function configure(studentCount,lang='fr',roles=0){
 const fields={};
 for(const [id,value] of Object.entries({students:studentCount,teachers:12,adults:3,indoors:1,outdoors:2,roles,zones:5,hours:8,clinics:0})){
  fields[id]={valueAsNumber:value,min: id==='students'?1:0,max:999999,validity:{valid:Number.isInteger(value)&&value>= (id==='students'?1:0),customError:false},labels:[{textContent:id}],validationMessage:'',setCustomValidity(message){this.validationMessage=message;this.validity.customError=!!message;this.validity.valid=!message;}};
 }
 fields['configuration-error']={textContent:''};
 const outputs=Object.fromEntries(['[data-pilot-total]','[data-total="students"]','[data-total="adults"]','[data-total="spaces"]'].map(x=>[x,{textContent:'',classList:{remove(){},add(){}}}]));
 runInNewContext(calculation+'\nupdateConfiguration();',{Intl,Number,URLSearchParams,window:shared.window,document:{documentElement:{lang},getElementById:id=>fields[id],querySelectorAll:s=>outputs[s]?[outputs[s]]:[],querySelector:()=>Object.values(fields).find(f=>f.validity&&!f.validity.valid)},requestAnimationFrame:fn=>fn()});
 return {outputs,fields};
}
test('the current configuration uses only the pilot rate without changing resource inputs',()=>{
 for(const students of [1,200,2000]){
  const {outputs,fields}=configure(students);
  const amount=s=>Number(outputs[s].textContent.replace(/[^0-9]/g,''));
  assert.equal(outputs['[data-regular-total]'],undefined);
  assert.equal(amount('[data-pilot-total]'),students*10);
  assert.equal(fields.teachers.valueAsNumber,12);
 }
});
test('invalid pupil counts do not produce a misleading zero or NaN estimate',()=>{
 for(const students of [0,-1,1.5,NaN]){
  const {outputs}=configure(students);
  assert.equal(outputs['[data-pilot-total]'].textContent,'Saisissez un nombre d’élèves valide');
 }
});
test('English formatting and existing resource validation still run',()=>{
 const {outputs,fields}=configure(200,'en',16);
 assert.match(outputs['[data-pilot-total]'].textContent,/2,000/);
 assert.match(fields['configuration-error'].textContent,/Simultaneously available adults/);
});
test('both public pages distinguish price, pilot discount, travel and external funding',()=>{
 for(const path of ['index.html','pour-les-ecoles.html']){
  const html=read(path);
  assert.ok(html.indexOf('Tarif régulier')<html.indexOf('Cohorte pilote'));
  for(const phrase of ['25 $','10 $','Frais de déplacement en sus','réduction commerciale de 60 %','Cette réduction n’est pas une subvention gouvernementale.','contributions confirmées','plus d’un mois'])assert.ok(html.includes(phrase),path+': '+phrase);
  assert.doesNotMatch(html,/14 500|7,25|data-cad="14500"/);
 }
});
test('the homepage keeps configuration inputs and interactive field controls',()=>{
 const html=read('index.html');
 for(const id of ['students','teachers','adults','indoors','outdoors','roles','zones','hours','clinics'])assert.ok(html.includes('id="'+id+'"'));
 assert.equal((html.match(/class="arena-pin"/g)||[]).length,6);
 assert.ok(html.includes('assets/app-portal.js'));
});
test('school contact form keeps original fields, endpoint and submission handling',()=>{
 const html=read('pour-les-ecoles.html');
 assert.ok(html.includes('action="/api/schools-contact"'));
 for(const name of ['Nom','École','Ville','Courriel','Commentaires'])assert.ok(html.includes('name="'+name+'"'));
 assert.ok(read('assets/ecoles-contact.js').includes('Object.fromEntries(new FormData(form))'));
});
