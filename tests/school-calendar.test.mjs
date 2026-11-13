import test from 'node:test';import assert from 'node:assert/strict';import {mkdtemp,rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {seed,mutate,publicView,instant} from '../lib/calendar/model.js';import {localStore} from '../lib/calendar/local-store.js';import {handler} from '../api/school-calendar.js';import {signToken} from '../lib/token.js';
const event=(overrides={})=>({schoolId:'ecole-secondaire-vanier',type:'clinic',start:'2027-05-10T09:00',end:'2027-05-10T10:15',status:'provisional',visibility:'draft',privateNote:'SECRET NOTE',...overrides});
const save=(s,kind,record)=>mutate(s,{revision:s.revision,kind,action:'save',record}).state;
test('real seed has only Vanier with no invented dates; cohorts are distinct and counts cannot go negative',()=>{
 let s=seed(),v=publicView(s);assert.equal(v.schools[0].name,'École secondaire Vanier');assert.equal(v.events.length,0);assert.equal(v.cohorts[0].remaining,9);assert.equal(v.cohorts[1].remaining,10);
 s=save(s,'school',{...s.schools[0],visible:false,email:'private@example.test',notes:'PRIVATE'});v=publicView(s);assert.equal(v.schools.length,0);assert.equal(v.cohorts[0].remaining,9);assert.ok(!JSON.stringify(v).includes('PRIVATE'));
 s=save(s,'cohort',{...s.cohorts[0],capacity:0});assert.equal(publicView(s).cohorts[0].remaining,0);
 assert.throws(()=>save(s,'school',{...s.schools[0],id:'duplicate'}),/duplicate_school/);
});
test('multiple clinics, published provisional/final activities, depublication and private projection',()=>{
 let s=seed();s=save(s,'event',event());s=save(s,'event',event({start:'2027-05-11T09:00',end:'2027-05-11T10:15',visibility:'published'}));s=save(s,'event',event({type:'final',start:'2027-05-28T09:00',end:'2027-05-28T15:00',visibility:'published',status:'confirmed'}));
 let v=publicView(s);assert.equal(s.events.length,3);assert.equal(v.events.length,2);assert.equal(v.events[0].status,'provisional');assert.equal(v.events[1].type,'final');assert.ok(!JSON.stringify(v).includes('SECRET'));
 s=save(s,'event',{...s.events[1],visibility:'draft'});assert.equal(publicView(s).events.length,1);
 s=mutate(s,{revision:s.revision,kind:'event',action:'delete',record:{id:s.events[0].id}}).state;assert.equal(s.events.length,2);
});
test('Toronto DST rejects nonexistent/ambiguous times and validates end after start',()=>{
 assert.equal(instant('2027-05-28T09:00'),'2027-05-28T13:00:00.000Z');assert.equal(instant('2027-01-28T09:00'),'2027-01-28T14:00:00.000Z');
 assert.throws(()=>instant('2027-03-14T02:30'),/invalid_time/);assert.throws(()=>instant('2027-11-07T01:30'),/ambiguous_time/);
 assert.throws(()=>save(seed(),'event',event({end:'2027-05-10T08:00'})),/end_before_start/);
});
test('availability is only explicit and published, unavailable ranges stay private; overlap is a warning',()=>{
 let s=seed();const slot={start:'2027-05-10T09:00',end:'2027-05-10T12:00',types:['clinic'],status:'unavailable',visibility:'published',privateNote:'PRIVATE'};s=save(s,'slot',slot);assert.equal(publicView(s).slots.length,0);s=save(s,'slot',{...s.slots[0],status:'available'});assert.equal(publicView(s).slots.length,1);
 const result=mutate(s,{revision:s.revision,kind:'event',action:'save',record:event()});assert.equal(result.warnings.length,1);
});
test('signed sessions need explicit admin role; forged, expired, magic and CSRF writes fail',async()=>{
 const env={AUTH_SECRET:'test-calendar-secret',CALENDAR_ADMIN_EMAILS:'owner@example.test'};let s=seed();const store={read:async()=>({state:s,tag:String(s.revision)}),write:async state=>{s=state;}};const api=handler({env,storeFactory:()=>store});
 const call=(method='GET',token='',origin='https://example.test')=>api(new Request('https://example.test/api/school-calendar'+(method==='GET'?'?admin=1':''),{method,headers:{cookie:'pig_session='+token,origin,'content-type':'application/json'},...(method==='POST'?{body:JSON.stringify({revision:s.revision,kind:'event',action:'save',record:event()})}:{})}));
 assert.equal((await call()).status,401);
 for(const payload of [{email:'visitor@example.test',purpose:'session',exp:Date.now()+100000},{email:'owner@example.test',purpose:'magic',exp:Date.now()+100000},{email:'owner@example.test',purpose:'session',exp:1}])assert.ok([401,403].includes((await call('POST',await signToken(payload,env.AUTH_SECRET))).status));
 const token=await signToken({email:'owner@example.test',purpose:'session',exp:Date.now()+100000},env.AUTH_SECRET);assert.equal((await call('POST',token,'https://evil.test')).status,403);assert.equal((await call('POST',token)).status,200);
 const publicResponse=await api(new Request('https://example.test/api/school-calendar'));assert.equal(publicResponse.status,200);assert.ok(!(await publicResponse.text()).includes('SECRET'));
 assert.equal((await handler({env:{}})(new Request('https://example.test/api/school-calendar?admin=1'))).status,503);
});
test('local persistence survives reopening, stale revisions cannot overwrite, storage failures never succeed',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'pi-calendar-'));try{const path=join(dir,'state.json'),store=await localStore(path,seed());const first=await store.read(),next=save(first.state,'event',event());await store.write(next,first.tag);const reopened=await localStore(path,seed());assert.equal((await reopened.read()).state.events.length,1);await assert.rejects(store.write(next,first.tag),/conflict/);
 const env={AUTH_SECRET:'test',CALENDAR_ADMIN_EMAILS:'owner@example.test'},token=await signToken({email:'owner@example.test',purpose:'session',exp:Date.now()+100000},env.AUTH_SECRET);const bad=handler({env,storeFactory:()=>({read:()=>reopened.read(),write:()=>{throw Error('failure');}})});const result=await bad(new Request('https://example.test/api/school-calendar',{method:'POST',headers:{origin:'https://example.test','content-type':'application/json',cookie:'pig_session='+token},body:JSON.stringify({kind:'event',action:'save',revision:1,record:event()})}));assert.equal(result.status,503);
 }finally{await rm(dir,{recursive:true,force:true});}
});

test('Firestore adapter uses CAS and initialization preconditions; demo cannot reach remote storage',async()=>{
 const {firestoreStore}=await import('../lib/calendar/store.js');const env={CALENDAR_FIRESTORE_PROJECT_ID:'calendar-test',CALENDAR_SERVICE_ACCOUNT_KEY:'unused'};let calls=[];let response=new Response('{}',{status:200});const store=firestoreStore(env,async(url,options)=>{calls.push({url:String(url),options});return response;},{accessToken:async()=>'fake-test-token'});
 await store.write(seed(),null);assert.match(calls[0].url,/currentDocument.exists=false/);
 await store.write(seed(),'2026-11-13T10:00:00Z');assert.match(calls[1].url,/currentDocument.updateTime=/);assert.equal(calls[1].options.method,'PATCH');
 response=new Response('{}',{status:412});await assert.rejects(store.write(seed(),'old'),/conflict/);
 response=new Response('{}',{status:500});await assert.rejects(store.write(seed(),'old'),/storage_failed/);
 response=new Response('{}',{status:404});await assert.rejects(store.read(),/storage_uninitialized/);
 const count=calls.length;await assert.rejects(store.write({...seed(),demo:true},null),/demo_remote_forbidden/);assert.equal(calls.length,count);
});
test('school duplicates normalize spacing and accents; public response cannot contain private contacts',()=>{
 let s=seed();assert.throws(()=>save(s,'school',{...s.schools[0],id:'different',name:'Ecole  secondaire Vanier',city:'Quebec'}),/duplicate_school/);
 s=save(s,'school',{...s.schools[0],contactName:'PRIVATE CONTACT',email:'private@example.test',phone:'PRIVATE PHONE',notes:'PRIVATE NOTES'});const json=JSON.stringify(publicView(s));assert.ok(!json.includes('PRIVATE'));assert.ok(!json.includes('private@example.test'));
});
test('calendar insertion leaves every existing home section, calculation and form markup unchanged',async()=>{
 const {readFile}=await import('node:fs/promises');const {createHash}=await import('node:crypto');let html=await readFile(new URL('../index.html',import.meta.url),'utf8');
 html=html.replace('site-translations.js?v=calendar-20261113','site-translations.js?v=logistics-20261112').replace(/^  <link rel="stylesheet" href="\/assets\/school-calendar.css[^\n]+\n/m,'').replace(/^  <script type="module" src="\/assets\/school-calendar.js[^\n]+\n/m,'').replace(/<section class="school-wristband"[\s\S]*?(?=<section class="school-offer")/,'');
 assert.equal(createHash('sha256').update(html).digest('hex'),'5c887b9ee0c66a15136f35e7940f1b75ca8fe62d3ca6e66714aedd0df701356f');
});
