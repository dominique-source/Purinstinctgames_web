import { JWT } from 'google-auth-library';
import { CalendarError } from './model.js';
// One dedicated Firestore document, read/write only through the server service account.
// updateTime is a compare-and-swap precondition: never overwrite a concurrent edit.
export function firestoreStore(env=process.env,transport=fetch,{accessToken}={}){
 const project=env.CALENDAR_FIRESTORE_PROJECT_ID,key=env.CALENDAR_SERVICE_ACCOUNT_KEY;
 if(!project||!key)throw new CalendarError('storage_unconfigured',503);
 if(!/^[a-z][a-z0-9-]{4,62}$/.test(project))throw new CalendarError('storage_unconfigured',503);
 const url=`https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/schoolCalendar/state`;
 async function auth(){if(accessToken)return accessToken();const c=JSON.parse(key);const client=new JWT({email:c.client_email,key:c.private_key,scopes:['https://www.googleapis.com/auth/datastore']});return (await client.getAccessToken()).token;}
 return {
  async read(){const response=await transport(url,{headers:{Authorization:'Bearer '+await auth()}});if(response.status===404)throw new CalendarError('storage_uninitialized',503);if(!response.ok)throw new CalendarError('storage_failed',503);const doc=await response.json();return {state:JSON.parse(doc.fields.payload.stringValue),tag:doc.updateTime};},
  async write(state,tag){if(state.demo)throw new CalendarError('demo_remote_forbidden',403);const target=new URL(url);if(tag)target.searchParams.set('currentDocument.updateTime',tag);else target.searchParams.set('currentDocument.exists','false');
   const response=await transport(target,{method:'PATCH',headers:{Authorization:'Bearer '+await auth(),'Content-Type':'application/json'},body:JSON.stringify({fields:{payload:{stringValue:JSON.stringify(state)}}})});
   if([409,412].includes(response.status))throw new CalendarError('conflict',409);if(!response.ok)throw new CalendarError('storage_failed',503);
  }
 };
}
