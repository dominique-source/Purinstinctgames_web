export const ZONE='America/Toronto';
export const TYPES=['conference','clinic','training','final'];
export class CalendarError extends Error {constructor(code,status=400){super(code);this.code=code;this.status=status;}}
const fail=(code,status)=>{throw new CalendarError(code,status);};
const text=(v,max=200)=>{if(typeof v!=='string'||v.length>max)fail('invalid_fields');return v.trim();};
const canonical=v=>v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr-CA').replace(/\s+/g,' ').trim();
const choice=(v,values)=>values.includes(v)?v:fail('invalid_fields');
const flag=v=>typeof v==='boolean'?v:fail('invalid_fields');
const id=v=>typeof v==='string'&&!['__proto__','constructor','prototype'].includes(v)&&/^[a-zA-Z0-9_-]{1,80}$/.test(v)?v:fail('invalid_id');
const dateParts=new Intl.DateTimeFormat('en-CA',{timeZone:ZONE,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
export function localTime(iso){const p=Object.fromEntries(dateParts.formatToParts(new Date(iso)).map(x=>[x.type,x.value]));return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;}
export function instant(value){
 if(typeof value!=='string')fail('invalid_time');
 if(/^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d(?:\.\d{1,3})?)?(?:Z|[+-]\d\d:\d\d)$/.test(value)){const t=new Date(value);if(!Number.isFinite(+t))fail('invalid_time');return t.toISOString();}
 if(!/^20\d\d-\d\d-\d\dT\d\d:\d\d$/.test(value))fail('invalid_time');
 const utc=Date.parse(value+'Z');if(!Number.isFinite(utc))fail('invalid_time');
 const matches=[240,300].map(offset=>new Date(utc+offset*60000).toISOString()).filter(iso=>localTime(iso)===value);
 if(matches.length!==1)fail(matches.length?'ambiguous_time':'invalid_time');return matches[0];
}
export function seed(){return {schema:1,revision:0,cohorts:[{id:'quebec-region',name:'Région de Québec',capacity:10,period:'2026–2027',visible:true},{id:'quebec-elsewhere',name:'Ailleurs au Québec',capacity:10,period:'2026–2027',visible:true}],schools:[{id:'ecole-secondaire-vanier',name:'École secondaire Vanier',city:'Québec',region:'Québec',cohortId:'quebec-region',status:'participating',visible:true}],events:[],slots:[],privateSchools:{}};}
export function publicView(s){
 const cohorts=s.cohorts.filter(c=>c.visible).map(c=>{const used=new Set(s.schools.filter(x=>x.cohortId===c.id&&x.status==='participating').map(x=>x.id)).size;return {id:c.id,name:c.name,capacity:c.capacity,period:c.period,used,remaining:Math.max(0,c.capacity-used)};});
 const schools=s.schools.filter(x=>x.visible&&x.status==='participating'&&cohorts.some(c=>c.id===x.cohortId)).map(x=>({id:x.id,name:x.name,city:x.city,region:x.region,cohortId:x.cohortId}));
 const events=s.events.filter(e=>e.visibility==='published'&&schools.some(x=>x.id===e.schoolId)).map(e=>({id:e.id,schoolId:e.schoolId,type:e.type,title:e.title,start:e.start,end:e.end,status:e.status,location:e.location}));
 const slots=s.slots.filter(a=>a.visibility==='published'&&a.status==='available').map(a=>({id:a.id,start:a.start,end:a.end,types:a.types}));
 return {zone:ZONE,revision:s.revision,demo:s.demo===true,cohorts,schools,events,slots};
}
export function mutate(current,command){
 if(!command||command.revision!==current.revision)fail('conflict',409);
 const kind=choice(command.kind,['cohort','school','event','slot']),action=choice(command.action,['save','delete']);
 const s=structuredClone(current),list=s[{cohort:'cohorts',school:'schools',event:'events',slot:'slots'}[kind]],raw=command.record;
 if(!raw||typeof raw!=='object'||Array.isArray(raw))fail('invalid_fields');
 const recordId=raw.id?id(raw.id):crypto.randomUUID(),index=list.findIndex(x=>x.id===recordId);
 if(action==='delete'){
  if(index<0)fail('not_found',404);
  if(kind==='school'&&s.events.some(e=>e.schoolId===recordId)||kind==='cohort'&&s.schools.some(e=>e.cohortId===recordId))fail('dependencies');
  list.splice(index,1);if(kind==='school')delete s.privateSchools[recordId];
 }else{
  let r={id:recordId};
  if(kind==='cohort'){
   const capacity=raw.capacity;if(!Number.isSafeInteger(capacity)||capacity<0||capacity>10000)fail('invalid_fields');
   r={...r,name:text(raw.name),period:text(raw.period,80),capacity,visible:flag(raw.visible)};
  }
  if(kind==='school'){
   const cohortId=id(raw.cohortId);if(!s.cohorts.some(c=>c.id===cohortId))fail('invalid_cohort');
   r={...r,name:text(raw.name),city:text(raw.city),region:text(raw.region),cohortId,status:choice(raw.status,['draft','participating','withdrawn']),visible:flag(raw.visible)};
   if(s.schools.some(x=>x.id!==r.id&&canonical(x.name)===canonical(r.name)&&canonical(x.city)===canonical(r.city)))fail('duplicate_school');
   s.privateSchools[r.id]={contactName:text(raw.contactName||''),email:text(raw.email||'',254),phone:text(raw.phone||'',80),notes:text(raw.notes||'',3000)};
  }
  if(kind==='event'||kind==='slot'){
   const start=instant(raw.start),end=instant(raw.end);if(end<=start)fail('end_before_start');
   r={...r,start,end,visibility:choice(raw.visibility,['draft','published']),privateNote:text(raw.privateNote||'',3000)};
   if(kind==='event'){
    const schoolId=id(raw.schoolId),school=s.schools.find(x=>x.id===schoolId);if(!school)fail('invalid_school');
    if(r.visibility==='published'&&(!school.visible||school.status!=='participating'))fail('unpublished_school');
    r={...r,schoolId,type:choice(raw.type,TYPES),title:text(raw.title||''),status:choice(raw.status,['provisional','confirmed']),location:text(raw.location||'',250)};
   }else{if(!Array.isArray(raw.types)||!raw.types.length||raw.types.length>4)fail('invalid_fields');r={...r,status:choice(raw.status,['available','unavailable']),types:[...new Set(raw.types.map(t=>choice(t,TYPES)))]};}
  }
  if('name' in r&&!r.name)fail('invalid_fields');
  if(index<0)list.push(r);else list[index]=r;
 }
 s.revision++;const warnings=[];
 const periods=[...s.events,...s.slots];
 for(let i=0;i<periods.length;i++)for(let j=i+1;j<periods.length;j++)if(periods[i].start<periods[j].end&&periods[j].start<periods[i].end)warnings.push([periods[i].id,periods[j].id]);
 return {state:s,warnings};
}
