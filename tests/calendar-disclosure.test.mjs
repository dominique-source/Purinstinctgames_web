import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {seed,mutate} from '../lib/calendar/model.js';
import {publicCalendarHtml} from '../lib/calendar/public-html.js';
import {handler} from '../api/school-calendar.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
function fixture(reduced=false) {
 const listeners={},mediaListeners={},attrs={};
 const label={textContent:''};
 const trigger={hidden:true,querySelector:()=>label,setAttribute:(k,v)=>attrs[k]=v,addEventListener:(k,f)=>listeners['trigger-'+k]=f,focus:options=>{doc.activeElement=trigger;assert.equal(options.preventScroll,true);}};
 const inside={id:'focused-calendar-filter'};
 const collapse={hidden:true,setAttribute:(k,v)=>attrs['collapse-'+k]=v,addEventListener:(k,f)=>listeners['collapse-'+k]=f,focus:()=>{doc.activeElement=collapse;}};
 const panel={inert:false,contains:el=>el===inside,setAttribute:(k,v)=>attrs['panel-'+k]=v,addEventListener:(k,f)=>listeners['panel-'+k]=f};
 const root={dataset:{},querySelector:q=>q==='[data-calendar-toggle]'?trigger:q==='[data-calendar-collapse]'?collapse:panel,setAttribute:(k,v)=>attrs['root-'+k]=v};
 const doc={activeElement:null,addEventListener:(k,f)=>listeners[k]=f};
 const media={matches:reduced,addEventListener:(k,f)=>mediaListeners[k]=f};
 let language='fr',requests=0;
 const source=read('assets/calendar-disclosure.js').replace(/^import[^\n]+\n/,'').replace('export function','function');
 const init=new Function('t','window','document',source+'\nreturn enhanceCalendarDisclosure;')(fr=>language==='en'?({'AFFICHER TOUT LE CALENDRIER':'VIEW FULL CALENDAR','Réduire le calendrier':'Collapse calendar'}[fr]||fr):fr,{matchMedia:()=>media,fetch:()=>requests++},doc);
 return {root,panel,trigger,inside,attrs,doc,media,mediaListeners,listeners,label,init,get requests(){return requests;},language:lang=>{language=lang;listeners['pi:language']();}};
}
test('progressive shell starts compact/inert, keeps one button and does not touch the calendar model or fetch',()=>{
 const f=fixture();const result=f.init(f.root);
 assert.equal(f.trigger.hidden,false);assert.equal(f.panel.inert,true);assert.equal(f.attrs['aria-expanded'],'false');
 const content={period:'2027-05',school:'horizon',event:'finale'};f.root.calendarSelections=content;
 for(let i=0;i<15;i++){f.listeners['trigger-click']();f.listeners['collapse-click']();}f.listeners['trigger-click']();
 assert.equal(f.attrs['aria-expanded'],'true');assert.equal(f.panel.inert,false);assert.equal(f.root.calendarSelections,content);assert.equal(f.requests,0);
 result.setExpanded(false,false);assert.equal(f.panel.inert,true);assert.equal(f.attrs['panel-aria-hidden'],'true');
});
test('Escape and programmatic close restore focused content without scrolling; native button owns Enter/Space',()=>{
 const f=fixture();const controls=f.init(f.root);controls.setExpanded(true,false);f.doc.activeElement=f.inside;
 let prevented=false;f.listeners['panel-keydown']({key:'Escape',defaultPrevented:false,preventDefault:()=>prevented=true});
 assert.equal(prevented,true);assert.equal(f.doc.activeElement,f.trigger);assert.equal(f.attrs['aria-expanded'],'false');
 const html=read('index.html'),band=html.match(/<button[^>]+data-calendar-toggle[\s\S]*?<\/button>/)[0];
 assert.equal((band.match(/<button/g)||[]).length,1);assert.match(band,/type="button"/);assert.match(band,/aria-controls="school-calendar-panel"/);
});
test('language changes keep open state; reduced-motion skips activation effects and interrupts safely',()=>{
 const f=fixture(true);const controls=f.init(f.root);controls.setExpanded(true);
 assert.equal(f.root.dataset.calendarMotion,'idle');f.language('en');assert.equal(f.label.textContent,'VIEW FULL CALENDAR');assert.equal(f.attrs['aria-expanded'],'true');
 controls.setExpanded(false);assert.equal(f.label.textContent,'VIEW FULL CALENDAR');assert.equal(f.panel.inert,true);
 const normal=fixture();const n=normal.init(normal.root);n.setExpanded(true);normal.media.matches=true;normal.mediaListeners.change();assert.equal(normal.root.dataset.calendarMotion,'idle');n.setExpanded(false,false);
 assert.match(read('assets/calendar-disclosure.css'),/@media\(prefers-reduced-motion:reduce\)/);
 assert.doesNotMatch(read('assets/calendar-disclosure.css'),/max-height\s*:/);
});
test('only calendar markup and its resource references change; operational calendar logic and private permissions remain intact',()=>{
 const base=p=>execFileSync('git',['show','b49bd86:'+p],{encoding:'utf8'});
 const strip=html=>html.replace(/<section class="school-calendar"[\s\S]*?<\/section>/,'CALENDAR').replace(/^  <link rel="stylesheet" href="\/assets\/calendar-disclosure.css[^\n]+\n/m,'').replace('school-calendar.js?v=deployable-20261114','school-calendar.js?v=20261113');
 assert.equal(strip(read('index.html')),strip(base('index.html')));
 assert.equal(read('assets/school-calendar.js').replace("import {enhanceCalendarDisclosure} from './calendar-disclosure.js';\n",'').replace('enhanceCalendarDisclosure(root);\n',''),base('assets/school-calendar.js'));
 for(const path of ['assets/school-calendar.css','assets/calendar-admin.js','lib/calendar/model.js','lib/calendar/oidc.js','lib/calendar/store.js'])assert.equal(read(path),base(path),path);
});
test('no-JavaScript representation uses only published data, escapes HTML and retains month/school navigation in both languages',()=>{
 let state=seed();const save=record=>{state=mutate(state,{revision:state.revision,kind:'event',action:'save',record}).state;};
 const common={schoolId:'ecole-secondaire-vanier',type:'clinic',start:'2027-05-10T09:00',end:'2027-05-10T10:15',status:'provisional',privateNote:'PRIVATE NOTE'};
 save({...common,title:'DRAFT SECRET',visibility:'draft'});save({...common,title:'<script>alert(1)</script>',visibility:'published'});
 state.schools[0].email='PRIVATE EMAIL';state.schools[0].notes='PRIVATE SCHOOL NOTE';
 const params=new URLSearchParams({period:'2027-05',school:'ecole-secondaire-vanier',lang:'en'});
 const html=publicCalendarHtml(state,params);
 for(const secret of ['DRAFT SECRET','PRIVATE NOTE','PRIVATE EMAIL','PRIVATE SCHOOL NOTE','<script>'])assert.equal(html.includes(secret),false,secret);
 assert.match(html,/&lt;script&gt;/);assert.match(html,/SCHOOL CALENDAR/);assert.match(html,/period=2027-06/);assert.match(html,/school=ecole-secondaire-vanier/);assert.match(html,/method="get"/);
 params.set('lang','fr');assert.match(publicCalendarHtml(state,params),/LE CALENDRIER DES ÉCOLES/);
});
test('HTML fallback is GET-only and never turns admin access into a public response',async()=>{
 const api=handler({env:{AUTH_SECRET:'unit-test-only',CALENDAR_ADMIN_EMAILS:'owner@example.test'},storeFactory:()=>({read:async()=>({state:seed(),tag:'0'})})});
 const html=await api(new Request('https://example.test/api/school-calendar?view=calendar&lang=en'));
 assert.equal(html.status,200);assert.match(html.headers.get('content-type'),/text\/html/);assert.match(html.headers.get('content-security-policy'),/default-src 'none'/);
 assert.equal((await api(new Request('https://example.test/api/school-calendar?admin=1&view=calendar'))).status,401);
 assert.equal((await api(new Request('https://example.test/api/school-calendar?view=calendar',{method:'POST'}))).status,401);
 const json=await api(new Request('https://example.test/api/school-calendar'));assert.match(json.headers.get('content-type'),/application\/json/);
});

test('peek has one real calendar, separate native controls and no clickable wrapper',()=>{
 const html=read('index.html'),section=html.match(/<section class="school-calendar"[\s\S]*?<\/section>/)[0];
 assert.equal((section.match(/id="school-calendar-panel"/g)||[]).length,1);
 assert.equal((section.match(/data-calendar-content/g)||[]).length,1);
 assert.equal((section.match(/data-calendar-toggle /g)||[]).length,1);
 assert.equal((section.match(/data-calendar-collapse /g)||[]).length,1);
 assert.match(section,/AFFICHER TOUT LE CALENDRIER/);
 assert.match(section,/Les écoles. Les activités. Les prochaines dates./);
 assert.doesNotMatch(section,/stéthoscope|manette|onclick=/);
});
