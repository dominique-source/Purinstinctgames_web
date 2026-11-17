import test from 'node:test';
import assert from 'node:assert/strict';
import middleware from '../middleware.js';
test('public short TV address opens the existing app screen without an email or moderator session',async()=>{
 for(const path of ['/ecran','/ecran/']){const response=await middleware(new Request('https://purinstinctgames.com'+path+'?lang=en'));assert.equal(response.status,307);assert.equal(response.headers.get('location'),'https://purinstinct-app.vercel.app/app/ecran?lang=en');}
});
test('TV entry leaves calendar administration protection and existing APP navigation intact',async()=>{
 const admin=await middleware(new Request('https://purinstinctgames.com/calendar-admin.html'));assert.equal(admin.status,302);assert.match(admin.headers.get('location'),/access\.html/);
 const app=await middleware(new Request('https://purinstinctgames.com/app/'));assert.equal(app.status,307);assert.equal(app.headers.get('location'),'https://purinstinct-app.vercel.app/app/');
});
