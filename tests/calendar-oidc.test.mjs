import test from 'node:test';
import assert from 'node:assert/strict';
import {createCalendarTokenProvider,oidcConfig} from '../lib/calendar/oidc.js';
import {firestoreStore} from '../lib/calendar/store.js';
const env={VERCEL_ENV:'production',CALENDAR_FIRESTORE_PROJECT_ID:'purinstinct-school-calendar',CALENDAR_SERVICE_ACCOUNT_EMAIL:'calendar-server@purinstinct-school-calendar.iam.gserviceaccount.com',CALENDAR_OIDC_PROVIDER:'projects/949360956465/locations/global/workloadIdentityPools/vercel-calendar/providers/purinstinct-web-production'};
test('calendar uses only production OIDC with the exact dedicated provider/account; legacy key does not enable it',()=>{
 assert.ok(oidcConfig(env));for(const bad of [{VERCEL_ENV:'preview'},{VERCEL_ENV:'development'},{CALENDAR_FIRESTORE_PROJECT_ID:'competition'},{CALENDAR_SERVICE_ACCOUNT_EMAIL:'other@example.test'},{CALENDAR_OIDC_PROVIDER:'projects/other/pools/other'}])assert.throws(()=>oidcConfig({...env,...bad}),/storage_unconfigured/);
 assert.throws(()=>firestoreStore({CALENDAR_FIRESTORE_PROJECT_ID:'purinstinct-school-calendar',CALENDAR_SERVICE_ACCOUNT_KEY:'unused legacy credential'}),/storage_unconfigured/);
});
test('official external account flow uses fixed Google endpoints, datastore scope and 900-second tokens',async()=>{
 let options;const auth=createCalendarTokenProvider(env,{subjectToken:async()=>'ephemeral-test-subject',clientFactory:o=>{options=o;return {getAccessToken:async()=>({token:'ephemeral-test-result'})};}});assert.equal(await auth(),'ephemeral-test-result');
 assert.equal(options.token_url,'https://sts.googleapis.com/v1/token');assert.equal(options.audience,'//iam.googleapis.com/'+env.CALENDAR_OIDC_PROVIDER);assert.equal(options.service_account_impersonation.token_lifetime_seconds,900);assert.deepEqual(options.scopes,['https://www.googleapis.com/auth/datastore']);assert.equal(await options.subject_token_supplier.getSubjectToken(),'ephemeral-test-subject');assert.ok(!('credential_source' in options));
});
test('temporary credentials coalesce concurrent requests and redact upstream failures',async()=>{
 let calls=0,release;const gate=new Promise(resolve=>release=resolve);const auth=createCalendarTokenProvider(env,{clientFactory:()=>({getAccessToken:async()=>{calls++;await gate;return {token:'short-lived-test'};}})});const a=auth(),b=auth();release();assert.deepEqual(await Promise.all([a,b]),['short-lived-test','short-lived-test']);assert.equal(calls,1);
 const failed=createCalendarTokenProvider(env,{clientFactory:()=>({getAccessToken:async()=>{throw Error('SENSITIVE UPSTREAM TOKEN');}})});await assert.rejects(failed(),e=>e.code==='storage_auth_failed'&&!e.message.includes('SENSITIVE'));
});
test('server authorization allows only the configured Dominique session, not another signed account',async()=>{
 const {handler}=await import('../api/school-calendar.js');const {signToken}=await import('../lib/token.js');const {seed}=await import('../lib/calendar/model.js');const settings={AUTH_SECRET:'unit-test-only',CALENDAR_ADMIN_EMAILS:'dominique@purinstinct.com'};
 const api=handler({env:settings,storeFactory:()=>({read:async()=>({state:seed(),tag:'0'})})});
 const request=async(email,purpose='session')=>{const token=email?await signToken({email,purpose,exp:Date.now()+60000},settings.AUTH_SECRET):'';return api(new Request('https://example.test/api/school-calendar?admin=1',{headers:{cookie:'pig_session='+token}}));};
 assert.equal((await request('dominique@purinstinct.com')).status,200);assert.equal((await request('other@example.test')).status,403);assert.equal((await request('dominique@purinstinct.com','magic')).status,401);assert.equal((await request('')).status,401);
 const response=await api(new Request('https://example.test/api/school-calendar',{method:'POST',headers:{origin:'https://example.test','content-type':'application/json'},body:'{}'}));assert.equal(response.status,401);
});
