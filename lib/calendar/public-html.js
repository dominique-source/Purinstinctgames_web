import {publicView,localTime,ZONE} from './model.js';
const escape = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/** Read-only progressive fallback. Always apply the existing public projection first. */
export function publicCalendarHtml(state,parameters=new URLSearchParams(),now=new Date()) {
 const data=publicView(state),en=parameters.get('lang')==='en',language=en?'en':'fr',locale=en?'en-CA':'fr-CA';
 const t=(fr,eng)=>en?eng:fr;
 const requested=parameters.get('period');
 const period=/^20\d\d-(0[1-9]|1[0-2])$/.test(requested || '')?requested:localTime(data.events[0]?.start || now.toISOString()).slice(0,7);
 const school=data.schools.find(s=>s.id===parameters.get('school'));
 const date=new Date(period+'-15T12:00:00Z');
 const month=new Intl.DateTimeFormat(locale,{month:'long',year:'numeric',timeZone:'UTC'}).format(date);
 const link=delta=>{const d=new Date(date);d.setUTCMonth(d.getUTCMonth()+delta);return '?'+new URLSearchParams({view:'calendar',lang:language,period:d.toISOString().slice(0,7),...(school?{school:school.id}:{})});};
 const events=data.events.filter(e=>(!school||e.schoolId===school.id)&&localTime(e.start).slice(0,7)<=period&&localTime(new Date(Date.parse(e.end)-1).toISOString()).slice(0,7)>=period);
 const slots=data.slots.filter(s=>localTime(s.start).slice(0,7)===period);
 const names={conference:t('Conférence','Talk'),clinic:t('Clinique préparatoire','Preparatory clinic'),training:t('Formation des enseignants','Teacher training'),final:t('Événement final','Final event')};
 const dateText=iso=>new Intl.DateTimeFormat(locale,{timeZone:ZONE,dateStyle:'long'}).format(new Date(iso));
 const timeText=iso=>new Intl.DateTimeFormat(locale,{timeZone:ZONE,hour:'numeric',minute:'2-digit'}).format(new Date(iso));
 const rows=[...events.map(e=>({start:e.start,html:`<article><h2>${escape(e.title||names[e.type])}</h2><p>${escape(data.schools.find(s=>s.id===e.schoolId)?.name)}</p><p>${escape(dateText(e.start))} · ${escape(timeText(e.start))}–${escape(timeText(e.end))}</p><p>${escape(e.location)}</p><p>${escape(e.status==='confirmed'?t('Confirmé','Confirmed'):t('Provisoire','Provisional'))}</p></article>`})),
 ...slots.map(s=>({start:s.start,html:`<article><h2>${t('Disponibilité publiée','Published availability')}</h2><p>${escape(dateText(s.start))} · ${escape(timeText(s.start))}–${escape(timeText(s.end))}</p></article>`}))].sort((a,b)=>a.start.localeCompare(b.start));
 return `<!doctype html><html lang="${language}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${t('Le calendrier des écoles','School calendar')} · PürInstinct</title>
 <style>@font-face{font-family:Barlow;src:url('/assets/hero-deck/fonts/Barlow-Regular.ttf')}@font-face{font-family:Display;src:url('/assets/hero-deck/fonts/BarlowCondensed-BlackItalic.ttf')}*{box-sizing:border-box}body{margin:0;background:#0a0a0a;color:#f4f4ef;font:18px/1.5 Barlow,sans-serif}main{max-width:1000px;margin:auto;padding:28px 20px}h1,h2{font-family:Display,sans-serif;line-height:1.1}h1{font-size:42px}h2{font-size:28px}a{color:#ccff00}form{display:flex;gap:16px;flex-wrap:wrap;align-items:end}label{display:grid;gap:6px}input,select,button{min-height:44px;padding:9px;font:inherit;max-width:100%}button{background:#ccff00;color:#0a0a0a}nav{display:flex;justify-content:space-between;align-items:center;gap:15px;margin:25px 0}article{border-top:1px solid #00d9e8;padding:16px 0}a:focus-visible,input:focus-visible,select:focus-visible,button:focus-visible{outline:3px solid #00d9e8;outline-offset:4px}</style>
 <main><a href="/${en?'?lang=en':''}#school-calendar">← ${t('Retour au site','Back to website')}</a><h1>${t('LE CALENDRIER DES ÉCOLES','SCHOOL CALENDAR')}</h1><p>${t('Vue accessible sans JavaScript · informations publiées uniquement.','Accessible view without JavaScript · published information only.')}</p>
 <form method="get"><input type="hidden" name="view" value="calendar"><input type="hidden" name="lang" value="${language}"><label>${t('École','School')}<select name="school"><option value="">${t('Toutes les écoles','All schools')}</option>${data.schools.map(s=>`<option value="${escape(s.id)}"${school?.id===s.id?' selected':''}>${escape(s.name)}</option>`).join('')}</select></label><label>${t('Mois','Month')}<input type="month" name="period" value="${period}" min="2020-01" max="2099-12" required></label><button>${t('Afficher','Show')}</button></form>
 <nav aria-label="${t('Navigation mensuelle','Monthly navigation')}"><a href="${escape(link(-1))}">← ${t('Mois précédent','Previous month')}</a><strong>${escape(month)}</strong><a href="${escape(link(1))}">${t('Mois suivant','Next month')} →</a></nav>
 ${data.demo?`<p>${t('Démonstration · données fictives','Demonstration · fictitious data')}</p>`:''}
 ${rows.length?rows.map(r=>r.html).join(''):`<p>${t('Aucune activité publiée pour cette période.','No published activities for this period.')}</p>`}
 <p>${t('Les journées vides ne sont pas des disponibilités.','Empty days do not mean availability.')} ${escape(ZONE)}.</p></main></html>`;
}
