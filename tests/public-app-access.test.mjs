import test from 'node:test';
import assert from 'node:assert/strict';
import middleware from '../middleware.js';
import { signToken } from '../lib/token.js';

test('all APP routes and assets require a signed session', async () => {
  for (const path of ['/app', '/app/', '/app/competitions/ecole', '/app/competitions/interscolaire/', '/app/competitions/pour-tous', '/app/activites/horizon', '/app/assets/index.js', '/app/images/competitions/ecole-verticale.png', '/app/?lang=en']) {
    for (const cookie of ['', 'pig_session=expired-or-invalid']) {
      const response = await middleware(new Request(`https://purinstinctgames.com${path}`, { headers: { cookie } }));
      assert.equal(response.status, 302, path);
      assert.equal(response.headers.get('location'), 'https://purinstinctgames.com/access.html', path);
    }
  }
});

test('organizer, projection and other private routes retain the email gate', async () => {
  for (const path of ['/app/ecole/demo-horizon/gerer', '/app/ecole/demo-horizon/gerer/participants', '/app/ecole/demo-horizon/projection', '/app/admin', '/application', '/app-private', '/concept.html', '/pur-id.html', '/app/../concept.html']) {
    const response = await middleware(new Request(`https://purinstinctgames.com${path}`));
    assert.equal(response.status, 302, path);
    assert.equal(response.headers.get('location'), 'https://purinstinctgames.com/access.html', path);
  }
  const home = await middleware(new Request('https://purinstinctgames.com/'));
  assert.equal(home.headers.get('x-middleware-next'), '1');
});


test('existing signed sessions pass, forged/expired/magic/malformed sessions fail closed', async () => {
 const previous=process.env.AUTH_SECRET;
 process.env.AUTH_SECRET='unit-test-only-not-a-deployed-secret';
 try {
  const now=Date.now();
  const valid=await signToken({purpose:'session',email:'existing-fixture@example.invalid',exp:now+60000},process.env.AUTH_SECRET);
  for(const path of ['/app/','/app/admin','/app/api/send-claim-code','/app/assets/main.js']) {
   const r=await middleware(new Request('https://purinstinctgames.com'+path,{headers:{cookie:'pig_session='+valid}}));
   assert.equal(r.headers.get('x-middleware-next'),'1',path);
  }
  for(const cookie of ['pig_session=%E0%A4%A','pig_session=forged',
   'pig_session='+await signToken({purpose:'session',exp:now-1000},process.env.AUTH_SECRET),
   'pig_session='+await signToken({purpose:'magic',exp:now+60000},process.env.AUTH_SECRET)]) {
   assert.equal((await middleware(new Request('https://purinstinctgames.com/app/',{headers:{cookie}}))).status,302);
  }
 } finally { if(previous===undefined)delete process.env.AUTH_SECRET;else process.env.AUTH_SECRET=previous; }
});

test('public homepage and its static resources remain public',async()=>{
 for(const path of ['/','/index.html','/assets/school-home.js','/assets/app-portal.js','/assets/hero-deck/hero-mobile.webp']) {
  assert.equal((await middleware(new Request('https://purinstinctgames.com'+path))).headers.get('x-middleware-next'),'1',path);
 }
});
