import {verifyToken} from '../lib/token.js';
import {publicView,mutate,CalendarError} from '../lib/calendar/model.js';
import {firestoreStore} from '../lib/calendar/store.js';
export function handler({env=process.env,storeFactory=()=>firestoreStore(env)}={}){
 return async request=>{
  const url=new URL(request.url),admin=url.searchParams.has('admin')||request.method!=='GET';
  const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
  try{
   if(admin){
    const allowed=(env.CALENDAR_ADMIN_EMAILS||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
    if(!allowed.length)throw new CalendarError('admin_unconfigured',503);
    let token;try{token=decodeURIComponent((request.headers.get('cookie')||'').match(/(?:^|;\s*)pig_session=([^;]*)/)?.[1]||'');}catch{}
    const identity=await verifyToken(token,env.AUTH_SECRET);
    if(!identity||identity.purpose!=='session')throw new CalendarError('unauthenticated',401);
    if(!allowed.includes(String(identity.email).toLowerCase()))throw new CalendarError('forbidden',403);
    if(request.method!=='GET'&&(request.headers.get('origin')!==url.origin||!request.headers.get('content-type')?.startsWith('application/json')))throw new CalendarError('forbidden',403);
   }
   if(!['GET','POST'].includes(request.method))throw new CalendarError('method_not_allowed',405);
   const store=storeFactory(),{state,tag}=await store.read();
   if(request.method==='GET')return Response.json(admin?{state}:{...publicView(state)},{headers});
   const size=request.headers.get('content-length');if(size&&Number(size)>40000)throw new CalendarError('too_large',413);
   const body=await request.text();if(body.length>40000)throw new CalendarError('too_large',413);
   let input;try{input=JSON.parse(body);}catch{throw new CalendarError('invalid_fields');}
   const result=mutate(state,input);await store.write(result.state,tag);
   return Response.json({state:result.state,warnings:result.warnings},{headers});
  }catch(error){const known=error instanceof CalendarError;return Response.json({error:known?error.code:'service_unavailable'},{status:known?error.status:503,headers});}
 };
}
export default {fetch:handler()};
