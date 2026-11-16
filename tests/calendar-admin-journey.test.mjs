import test from 'node:test';import assert from 'node:assert/strict';
import {authDestination} from '../lib/auth-destination.js';
import {signToken} from '../lib/token.js';import verify from '../api/verify.js';import logout from '../api/logout.js';
import {handler} from '../api/school-calendar.js';import {seed} from '../lib/calendar/model.js';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('only approved internal admin return destinations survive, without arbitrary parameters',()=>{
 for(const value of ['https://evil.test','//evil.test','/\\evil.test','/app','/calendar-admin.html.evil','javascript:alert(1)','/%2f%2fevil.test',null])assert.equal(authDestination(value),'/');
 assert.equal(authDestination('/calendar-admin.html?lang=en&evil=1'),'/calendar-admin.html?lang=en');
});
test('magic link opens the signed destination on a fresh device, session cookie then protects it',async()=>{
 process.env.AUTH_SECRET='unit-test-calendar-journey';
 const token=await signToken({email:'owner@example.test',purpose:'magic',returnTo:'/calendar-admin.html?lang=en',exp:Date.now()+60000},process.env.AUTH_SECRET);
 const response=await verify.fetch(new Request('https://example.test/api/verify?token='+encodeURIComponent(token)));
 assert.equal(response.status,302);assert.equal(response.headers.get('location'),'/calendar-admin.html?lang=en');assert.match(response.headers.get('set-cookie'),/HttpOnly; Secure; SameSite=Lax/);
 const cookie=response.headers.get('set-cookie').split(';')[0];
 const api=handler({env:{AUTH_SECRET:process.env.AUTH_SECRET,CALENDAR_ADMIN_EMAILS:'owner@example.test'},storeFactory:()=>({read:async()=>({state:seed(),tag:'0'})})});
 assert.equal((await api(new Request('https://example.test/api/school-calendar?admin=1',{headers:{cookie}}))).status,200);
 const other=await signToken({email:'other@example.test',purpose:'session',exp:Date.now()+60000},process.env.AUTH_SECRET);
 assert.equal((await api(new Request('https://example.test/api/school-calendar?admin=1',{headers:{cookie:'pig_session='+other}}))).status,403);
 const evil=await signToken({purpose:'magic',returnTo:'https://evil.test',exp:Date.now()+60000},process.env.AUTH_SECRET);
 assert.equal((await verify.fetch(new Request('https://example.test/api/verify?token='+encodeURIComponent(evil)))).headers.get('location'),'/');
 const expired=await verify.fetch(new Request('https://example.test/api/verify?token=invalid&returnTo=%2Fcalendar-admin.html'));
 assert.match(expired.headers.get('location'),/returnTo=%2Fcalendar-admin.html/);
});
test('logout is same-origin POST only and clears rather than exposes the session',async()=>{
 assert.equal((await logout.fetch(new Request('https://example.test/api/logout'))).status,405);
 assert.equal((await logout.fetch(new Request('https://example.test/api/logout',{method:'POST',headers:{origin:'https://evil.test'}}))).status,403);
 const r=await logout.fetch(new Request('https://example.test/api/logout',{method:'POST',headers:{origin:'https://example.test'}}));assert.equal(r.status,303);assert.match(r.headers.get('set-cookie'),/Max-Age=0/);
});
test('return destination crosses every link and is signed, public entry cannot toggle the calendar',()=>{
 assert.match(read('api/request-access.js'),/email, returnTo, purpose: 'magic'/);
 assert.match(read('access.html'),/returnTo: params.get\('returnTo'\)/);
 assert.match(read('middleware.js'),/login.searchParams.set\('returnTo'/);
 assert.match(read('index.html'),/class="calendar-admin-entry" href="\/calendar-admin.html"/);
 assert.match(read('assets/calendar-admin.js'),/await saveCommand/);
 assert.match(read('assets/calendar-admin.js'),/sessionStorage.setItem/);
});
