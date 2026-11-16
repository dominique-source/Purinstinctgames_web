// Only explicitly approved internal destinations can survive authentication.
export function authDestination(value) {
 if(typeof value!=='string')return '/';
 try {const u=new URL(value,'https://internal.invalid');
 if(!value.startsWith('/')||value.startsWith('//')||u.origin!=='https://internal.invalid'||u.pathname!=='/calendar-admin.html')return '/';
 return u.pathname+(u.searchParams.get('lang')==='en'?'?lang=en':'');
 }catch{return '/';}
}
