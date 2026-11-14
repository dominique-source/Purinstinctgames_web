import { ExternalAccountClient } from 'google-auth-library';
import { getVercelOidcToken } from '@vercel/oidc';
import { CalendarError } from './model.js';

// Public configuration only. The provider enforces owner/project/environment claims.
export function oidcConfig(env) {
 const provider=env.CALENDAR_OIDC_PROVIDER, email=env.CALENDAR_SERVICE_ACCOUNT_EMAIL;
 if(env.VERCEL_ENV!=='production'||env.CALENDAR_FIRESTORE_PROJECT_ID!=='purinstinct-school-calendar'||
 provider!=='projects/949360956465/locations/global/workloadIdentityPools/vercel-calendar/providers/purinstinct-web-production'||
 email!=='calendar-server@purinstinct-school-calendar.iam.gserviceaccount.com')throw new CalendarError('storage_unconfigured',503);
 return {provider,email};
}
export function createCalendarTokenProvider(env,{clientFactory=options=>ExternalAccountClient.fromJSON(options),subjectToken=()=>getVercelOidcToken()}={}) {
 const {provider,email}=oidcConfig(env);
 const client=clientFactory({
  type:'external_account',audience:'//iam.googleapis.com/'+provider,
  subject_token_type:'urn:ietf:params:oauth:token-type:jwt',token_url:'https://sts.googleapis.com/v1/token',
  service_account_impersonation_url:`https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${email}:generateAccessToken`,
  service_account_impersonation:{token_lifetime_seconds:900},scopes:['https://www.googleapis.com/auth/datastore'],
  subject_token_supplier:{getSubjectToken:subjectToken}
 });
 if(!client)throw new CalendarError('storage_unconfigured',503);
 let pending;
 return async()=>{
  // google-auth-library caches temporary credentials; coalesce simultaneous refreshes.
  if(!pending)pending=(async()=>{try{const {token}=await client.getAccessToken();if(!token)throw Error();return token;}catch{throw new CalendarError('storage_auth_failed',503);}})().finally(()=>{pending=undefined;});
  return pending;
 };
}
let cached;
export function calendarAccessToken(env){oidcConfig(env);cached ||= createCalendarTokenProvider(env);return cached();}
