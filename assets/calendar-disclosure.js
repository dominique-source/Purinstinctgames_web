import {t} from './calendar-shared.js';

/** Presentation only: never fetch, render, destroy or reset the calendar model. */
export function enhanceCalendarDisclosure(root) {
  const trigger=root?.querySelector('[data-calendar-toggle]');
  const panel=root?.querySelector('#school-calendar-panel');
  if (!trigger || !panel || root.dataset.calendarEnhanced) return;
  const label=trigger.querySelector('[data-calendar-toggle-label]');
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let expanded=false, settle;
  const updateLabel=()=>{label.textContent=t(expanded?'Réduire le calendrier':'Voir le calendrier');};
  function finish() {clearTimeout(settle);root.dataset.calendarMotion='idle';}
  function setExpanded(next, animate=true) {
    expanded=Boolean(next);
    clearTimeout(settle);
    if (!expanded && panel.contains(document.activeElement)) trigger.focus({preventScroll:true});
    trigger.setAttribute('aria-expanded',String(expanded));
    panel.inert=!expanded;
    panel.setAttribute('aria-hidden',String(!expanded));
    root.dataset.calendarOpen=String(expanded);
    root.dataset.calendarMotion=animate&&!motion.matches?(expanded?'opening':'closing'):'idle';
    updateLabel();
    // Presentation cleanup only; controls and repeated clicks never wait for this timer.
    if (animate&&!motion.matches) settle=setTimeout(finish,expanded?580:380);
  }
  root.dataset.calendarEnhanced='true';
  root.setAttribute('aria-labelledby','calendar-disclosure-title');
  panel.setAttribute('role','region');
  panel.setAttribute('aria-labelledby','calendar-disclosure-title');
  trigger.hidden=false;
  setExpanded(false,false);
  trigger.addEventListener('click',()=>setExpanded(!expanded));
  panel.addEventListener('keydown',event=>{
    if (event.key==='Escape'&&!event.defaultPrevented) {event.preventDefault();setExpanded(false);}
  });
  document.addEventListener('pi:language',updateLabel);
  motion.addEventListener('change',()=>{if(motion.matches)finish();});
  return {setExpanded};
}
