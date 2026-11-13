// Local-only harness. Never imported by deployed API routes.
import http from 'node:http';import {readFile} from 'node:fs/promises';import path from 'node:path';import {randomBytes} from 'node:crypto';
import {seed} from '../lib/calendar/model.js';import {localStore} from '../lib/calendar/local-store.js';import {handler} from '../api/school-calendar.js';import {signToken} from '../lib/token.js';
const demo=process.argv.includes('--demo'),port=demo?4185:4184,root=process.cwd();
const initial=seed();if(demo){initial.demo=true;for(const [id,name] of [['demo-horizon','École Horizon (démo)'],['demo-rivage','École du Rivage (démo)']])initial.schools.push({id,name,city:'Ville fictive',region:'Région fictive',cohortId:id==='demo-horizon'?'quebec-region':'quebec-elsewhere',status:'participating',visible:true});
 const iso=(day,time)=>`2027-05-${day}T${time}:00-04:00`;
 for(const [id,schoolId,type,day,time,end] of [['demo-conference','demo-horizon','conference','03','10:00','11:00'],['demo-clinic1','demo-horizon','clinic','10','09:00','10:15'],['demo-clinic2','demo-horizon','clinic','12','09:00','10:15'],['demo-training','demo-horizon','training','17','15:30','16:30'],['demo-final','demo-horizon','final','28','09:00','15:00'],['demo-rivage-conf','demo-rivage','conference','07','13:00','14:00']])initial.events.push({id,schoolId,type,title:'',start:new Date(iso(day,time)).toISOString(),end:new Date(iso(day,end)).toISOString(),visibility:'published',status:'confirmed',location:'Terrain gazonné — lieu fictif',privateNote:'Note privée de démonstration'});
 initial.slots.push({id:'demo-slot',start:new Date(iso('06','09:00')).toISOString(),end:new Date(iso('06','12:00')).toISOString(),types:['conference','clinic'],status:'available',visibility:'published',privateNote:'Privé'});
}
const file=demo?'/tmp/purinstinct-calendar-demo.json':'/tmp/purinstinct-calendar-local.json';const store=await localStore(file,initial);
const env={AUTH_SECRET:randomBytes(32).toString('hex'),CALENDAR_ADMIN_EMAILS:'calendar-admin@example.test'};const api=handler({env,storeFactory:()=>store});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.ico':'image/x-icon'};
http.createServer(async(req,res)=>{try{
 if(req.headers.host!==`127.0.0.1:${port}`&&req.headers.host!==`localhost:${port}`){res.writeHead(403);return res.end();}
 const url=new URL(req.url,`http://${req.headers.host}`);
 if(url.pathname==='/dev/calendar-login'){
  const token=await signToken({email:'calendar-admin@example.test',purpose:'session',exp:Date.now()+86400000},env.AUTH_SECRET);res.writeHead(302,{'Set-Cookie':`pig_session=${token}; Path=/; HttpOnly; SameSite=Lax`,'Location':'/calendar-admin.html','Cache-Control':'no-store'});return res.end();
 }
 if(url.pathname==='/api/school-calendar'){
  let chunks=[];for await(const chunk of req){chunks.push(chunk);if(chunks.reduce((n,c)=>n+c.length,0)>40000){res.writeHead(413);return res.end();}}
  const request=new Request(url,{method:req.method,headers:req.headers,...(req.method==='GET'?{}:{body:Buffer.concat(chunks)})});const response=await api(request);res.writeHead(response.status,Object.fromEntries(response.headers));return res.end(Buffer.from(await response.arrayBuffer()));
 }
 const pathname=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
 if(pathname.includes('..')||!(/^\/assets\/[\w./-]+$/.test(pathname)||/^\/images\/[\w./-]+$/.test(pathname)||['/index.html','/calendar-admin.html','/access.html','/favicon.png','/favicon.ico','/site.webmanifest'].includes(pathname))){res.writeHead(404);return res.end();}
 const data=await readFile(path.join(root,pathname));res.writeHead(200,{'Content-Type':mime[path.extname(pathname)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
 }catch{res.writeHead(500,{'Content-Type':'text/plain'});res.end('Local preview error');}}).listen(port,'127.0.0.1',()=>console.log(`Local calendar preview http://127.0.0.1:${port} — ${demo?'DEMO FICTIONAL':'Vanier / no dates'} — ${file}`));
