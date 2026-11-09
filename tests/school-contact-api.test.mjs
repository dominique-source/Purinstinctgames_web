import test from 'node:test';
import assert from 'node:assert/strict';
import endpoint from '../api/schools-contact.js';
test('unchanged contact API relays the chosen configuration inside Comments', async()=>{
 const originalFetch=globalThis.fetch;
 const originalFrom=process.env.EMAIL_FROM;
 const originalKey=process.env.RESEND_API_KEY;
 let sent;
 try {
  process.env.EMAIL_FROM='sender@example.invalid';
  process.env.RESEND_API_KEY='local-test-only';
  globalThis.fetch=async(url,request)=>{assert.equal(url,'https://api.resend.com/emails');sent=JSON.parse(request.body);return {ok:true};};
  const response=await endpoint.fetch(new Request('https://example.test/api/schools-contact',{method:'POST',body:JSON.stringify({Nom:'Fictif',École:'École fictive',Ville:'Québec',Courriel:'test@example.invalid',Commentaires:'Demande\n\nConfiguration scolaire — proposition indicative\nÉlèves : 200\nBase : 2 000 CAD\nTotal : à confirmer'})}));
  assert.equal(response.status,200);
  assert.equal((await response.json()).ok,true);
  assert.equal(sent.to,'dominique@purinstinct.com');
  assert.match(sent.text,/Élèves : 200/);
  assert.match(sent.text,/Total : à confirmer/);
 } finally {
  globalThis.fetch=originalFetch;
  if(originalFrom===undefined) delete process.env.EMAIL_FROM;else process.env.EMAIL_FROM=originalFrom;
  if(originalKey===undefined) delete process.env.RESEND_API_KEY;else process.env.RESEND_API_KEY=originalKey;
 }
});

test('the same relay accepts a complete multi-block summary beyond the old limit and rejects oversized payloads before email',async()=>{
 const original=globalThis.fetch;let sent,calls=0;
 try{
  globalThis.fetch=async(url,request)=>{calls++;sent=JSON.parse(request.body);return {ok:true};};
  const fields={Nom:'Fictif',École:'Fictive',Ville:'Québec',Courriel:'test@example.invalid',Commentaires:'Configuration multi-blocs\n'+'Détails\n'.repeat(500)};
  const request=body=>new Request('https://example.test/api/schools-contact',{method:'POST',body});
  let response=await endpoint.fetch(request(JSON.stringify(fields)));assert.equal(response.status,200);assert.ok(sent.text.includes(fields.Commentaires));assert.equal(sent.to,'dominique@purinstinct.com');assert.equal(calls,1);
  response=await endpoint.fetch(request(JSON.stringify({...fields,Commentaires:'x'.repeat(14001)})));assert.equal(response.status,400);assert.equal(calls,1);
  response=await endpoint.fetch(request('x'.repeat(48001)));assert.equal(response.status,413);assert.equal(calls,1);
 }finally{globalThis.fetch=original;}
});
