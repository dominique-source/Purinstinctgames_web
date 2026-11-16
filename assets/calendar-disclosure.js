import {t} from './calendar-shared.js';

/** Presentation only: never fetch, render, destroy or reset the calendar model. */
export function enhanceCalendarDisclosure(root) {
  const trigger=root?.querySelector('[data-calendar-toggle]');
  const panel=root?.querySelector('#school-calendar-panel');
  if (!trigger || !panel || root.dataset.calendarEnhanced) return;
  const collapse=root.querySelector('[data-calendar-collapse]');
  const label=trigger.querySelector('[data-calendar-toggle-label]');
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let expanded=false, settle;
  const updateLabel=()=>{label.textContent=t('AFFICHER TOUT LE CALENDRIER');};
  function finish() {clearTimeout(settle);root.dataset.calendarMotion='idle';}
  function setExpanded(next, animate=true) {
    const openingFromTrigger=document.activeElement===trigger;
    const restoreFocus=panel.contains(document.activeElement)||document.activeElement===collapse;
    expanded=Boolean(next);
    clearTimeout(settle);

    trigger.setAttribute('aria-expanded',String(expanded));
    collapse.setAttribute('aria-expanded',String(expanded));
    collapse.hidden=!expanded;
    trigger.hidden=expanded;
    if(expanded && openingFromTrigger) collapse.focus({preventScroll:true});
    if(!expanded && restoreFocus) trigger.focus({preventScroll:true});
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
  trigger.addEventListener('click',()=>setExpanded(true));
  collapse.addEventListener('click',()=>{setExpanded(false);trigger.focus({preventScroll:true});});
  panel.addEventListener('keydown',event=>{
    if (event.key==='Escape'&&!event.defaultPrevented) {event.preventDefault();setExpanded(false);}
  });
  document.addEventListener('pi:language',updateLabel);
  motion.addEventListener('change',()=>{if(motion.matches)finish();});
  return {setExpanded};
}
