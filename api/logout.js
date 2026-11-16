import {authDestination} from '../lib/auth-destination.js';
export default {async fetch(request){
 const url=new URL(request.url);
 if(request.method!=='POST')return new Response(null,{status:405});
 if(request.headers.get('origin')!==url.origin)return new Response(null,{status:403});
 return new Response(null,{status:303,headers:{Location:'/access.html?returnTo='+encodeURIComponent(authDestination('/calendar-admin.html')),'Set-Cookie':'pig_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0','Cache-Control':'private, no-store'}});
}};
