import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const source = name => readFileSync(new URL('../assets/'+name, import.meta.url),'utf8');
function commercial() {
 const context={window:{}};
 runInNewContext(source('site-translations.js'),context);
 return context.window.piSchoolCommercial;
}
const chosen={students:2000,teachers:12,adults:3,indoors:1,outdoors:2,roles:10,zones:5,hours:8,clinics:2};
test('confirmed program rates remain independent of school staff; unknowns never become free',()=>{
 const model=commercial();
 for(const students of [200,2000]) {
  const amounts=model.estimate(students);
  assert.equal(amounts.base,students*10);
  assert.equal('regular' in amounts,false);
  assert.equal(amounts.discount,60);
  assert.equal(amounts.total,null);
  assert.equal(amounts.travel,null);
  assert.equal(amounts.staffSupplement,null);
 }
 for(const adults of [3,30,300]) {
  const c=model.configuration({...chosen,adults});
  assert.equal(model.estimate(c.students).base,20000);
 }
 for(const pupils of [0,-1,NaN,Infinity,1.5,1000000]) {
  assert.equal(model.estimate(pupils).base,null);
 }
 assert.equal(model.configuration({...chosen,roles:16}),null);
 assert.equal(model.configuration({...chosen,students:''}),null);
 assert.equal(model.configuration({...chosen,clinics:''}).clinics,null);
 assert.match(model.summary({...chosen,clinics:null},'fr'),/Cliniques envisagées \(séances\) : À confirmer/);
 assert.match(model.summary(chosen,'en'),/Total: to be confirmed/);
 assert.match(model.summary(chosen,'fr'),/Total : à confirmer/);
});
async function contact(responseOK=true,withConfiguration=true,language='fr') {
 const policy=commercial();
 const listeners={};
 const elements={
  'schools-contact-status':{textContent:''},
  'school-proposal':{hidden:true},
  'school-proposal-summary':{textContent:''},
 };
 const submit={disabled:false}; const comments={maxLength:2000};
 let reset=false, payload;
 const fields={Nom:'Test local',École:'Fictive',Ville:'Québec',Courriel:'test@example.invalid',Commentaires:'Bonjour'};
 const form={action:'/api/schools-contact',querySelector:()=>submit,elements:{namedItem:()=>comments},addEventListener:(name,fn)=>listeners[name]=fn,reset:()=>reset=true};
 const ctx={window:{piSchoolCommercial:policy},location:{href:'https://example.test/pour-les-ecoles.html'+(withConfiguration?'?configuration='+encodeURIComponent(JSON.stringify(chosen)):'')}, URL, FormData:class{*[Symbol.iterator](){yield* Object.entries(fields);}}, document:{documentElement:{lang:language},getElementById:id=>id==='schools-contact-form'?form:elements[id],addEventListener(){},querySelectorAll:()=>[]}, fetch:async(url,request)=>{payload=JSON.parse(request.body);assert.equal(url,form.action);return {ok:responseOK,json:async()=>({ok:responseOK})};}};
 runInNewContext(source('ecoles-contact.js'),ctx);
 await listeners.submit({preventDefault(){}});
 return {payload,reset,submit,elements,comments};
}
test('existing contact POST includes the visible validated configuration and original visitor message',async()=>{
 const r=await contact();
 assert.match(r.elements['school-proposal-summary'].textContent,/Élèves : 2000/);
 assert.equal(r.elements['school-proposal'].hidden,false);
 assert.match(r.payload.Commentaires,/^Bonjour\n\nConfiguration scolaire/);
 assert.match(r.payload.Commentaires,/20\s?000/);
 assert.ok(r.payload.Commentaires.length<=2000);
 assert.equal(r.payload.Courriel,'test@example.invalid');
 assert.equal(r.reset,true);
 assert.match(r.elements['schools-contact-status'].textContent,/Merci/);
 assert.equal(r.submit.disabled,false);
});
test('failed contact request preserves answers and restores retry; no real email is sent',async()=>{
 const r=await contact(false);
 assert.equal(r.reset,false);
 assert.match(r.elements['schools-contact-status'].textContent,/échoué/);
 assert.equal(r.submit.disabled,false);
});
test('contact without configuration retains the original message and full comment limit',async()=>{
 const r=await contact(true,false);
 assert.equal(r.payload.Commentaires,'Bonjour');
 assert.equal(r.elements['school-proposal'].hidden,true);
 assert.equal(r.comments.maxLength,2000);
});

test('French and English summaries and submitted comments contain only the pilot budget',async()=>{
 const model=commercial();
 for(const language of ['fr','en']){
  for(const students of [200,2000]){
   const summary=model.summary({...chosen,students},language);
   assert.doesNotMatch(summary,/Regular program|Référence régulière|50[\s\u00a0,]?000|5[\s\u00a0,]?000/);
   assert.match(summary,students===200?/2[\s\u00a0,]?000/:/20[\s\u00a0,]?000/);
  }
  const result=await contact(true,true,language);
  assert.doesNotMatch(result.elements['school-proposal-summary'].textContent,/Regular program|Référence régulière|50[\s\u00a0,]?000/);
  assert.doesNotMatch(result.payload.Commentaires,/Regular program|Référence régulière|50[\s\u00a0,]?000/);
  assert.match(result.payload.Commentaires,/20[\s\u00a0,]?000/);
 }
});
