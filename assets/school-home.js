const arena = document.querySelector(".school-arena");
const zoneControls = [...document.querySelectorAll("[data-zone]")];
const zonePanels = [...document.querySelectorAll(".zone-detail")];
const arenaEffects = [...document.querySelectorAll("[data-effect]")];
const hero = document.querySelector(".school-hero");
const scene = document.querySelector(".arena-layer");
const panelContainer = document.querySelector(".zone-details");
const closePanel = document.querySelector(".arena-close");
const mobileScene = matchMedia("(max-width: 949px)");
function fitScene() {
  const width = hero.clientWidth;
  const height = hero.clientHeight;
  const sourceWidth = mobileScene.matches ? 910 : 1672;
  const sourceHeight = mobileScene.matches ? 1728 : 941;
  const scale = mobileScene.matches ? width / sourceWidth : Math.max(width / sourceWidth, height / sourceHeight);
  const sceneWidth = sourceWidth * scale;
  const sceneHeight = sourceHeight * scale;
  scene.style.setProperty("--scene-width", sceneWidth + "px");
  scene.style.setProperty("--scene-height", sceneHeight + "px");
  scene.style.setProperty("--scene-left", (width - sceneWidth) / 2 + "px");
  scene.style.setProperty("--scene-top", mobileScene.matches ? "40px" : (height - sceneHeight) / 2 + "px");
}
const sceneObserver = new ResizeObserver(fitScene);
sceneObserver.observe(hero);
mobileScene.addEventListener("change", fitScene);
fitScene();
let hoveredPanel = false;
let previewTimer;
let lastActivated;
let selectedZone;
let hoveredControl;
let focusedControl;
let displayedZone;

function showZone(play = true) {
  const zone = focusedControl?.dataset.zone ?? hoveredControl?.dataset.zone ?? (hoveredPanel ? displayedZone : selectedZone);
  if (zone === displayedZone) return;
  stopZoneClips();
  displayedZone = zone;
  arena.classList.toggle("has-zone", Boolean(zone));
  panelContainer.hidden = !zone;
  for (const control of zoneControls) {
    control.toggleAttribute("data-preview", control.dataset.zone === zone);
  }
  for (const panel of zonePanels) panel.hidden = panel.id !== "zone-" + zone;
  for (const effect of arenaEffects) {
    const active = effect.dataset.effect === zone;
    effect.classList.toggle("is-active", active);
    effect.classList.toggle("is-playing", active && play);
  }
}

for (const control of zoneControls) {
  control.addEventListener("pointerenter", event => {
    if (event.pointerType !== "mouse" || mobileScene.matches || control.closest(".zone-switcher")) return;
    clearTimeout(previewTimer);
    focusedControl = undefined;
    hoveredControl = control;
    showZone();
  });
  control.addEventListener("pointerleave", () => {
    if (hoveredControl !== control) return;
    hoveredControl = undefined;
    previewTimer = setTimeout(() => showZone(false), 100);
  });
  control.addEventListener("focus", () => {
    if (!control.matches(":focus-visible")) return;
    focusedControl = control;
    showZone();
  });
  control.addEventListener("blur", () => {
    if (focusedControl !== control) return;
    focusedControl = undefined;
    showZone(false);
  });
  control.addEventListener("click", () => {
    lastActivated = control.closest(".zone-switcher")
      ? zoneControls.find(item => item.classList.contains("arena-pin") && item.dataset.zone === control.dataset.zone)
      : control;
    selectedZone = control.dataset.zone;
    hoveredControl = focusedControl = undefined;
    hoveredPanel = false;
    for (const button of zoneControls) {
      button.setAttribute("aria-pressed", String(button.dataset.zone === selectedZone));
    }
    showZone();
    if (mobileScene.matches && !control.closest(".zone-switcher")) {
      document.getElementById("zone-" + selectedZone).querySelector("h2").focus({preventScroll:true});
    }
  });
}

panelContainer.addEventListener("pointerenter", () => {
  clearTimeout(previewTimer);
  hoveredPanel = true;
});
panelContainer.addEventListener("pointerleave", () => {
  hoveredPanel = false;
  showZone(false);
});
function dismissPanel(restoreFocus = true) {
  selectedZone = hoveredControl = focusedControl = undefined;
  hoveredPanel = false;
  clearTimeout(previewTimer);
  for (const control of zoneControls) control.setAttribute("aria-pressed", "false");
  showZone(false);
  const returnFocus = lastActivated;
  lastActivated = undefined;
  if (restoreFocus) returnFocus?.focus({ preventScroll: true });
  // Closing must win over the focus preview.
  focusedControl = undefined;
  displayedZone = undefined;
  panelContainer.hidden = true;
  for (const effect of arenaEffects) effect.classList.remove("is-active", "is-playing");
  for (const control of zoneControls) control.removeAttribute("data-preview");
}
closePanel.addEventListener("click", () => dismissPanel());
for (const link of document.querySelectorAll('.nav a[href^="#"], .hero-scroll, .school-intro a')) {
  link.addEventListener("click", () => dismissPanel(false));
}
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !panelContainer.hidden) dismissPanel();
});
const visibilityObserver = new IntersectionObserver(entries => {
  hero.toggleAttribute("data-offscreen", !entries[0].isIntersecting);
  if (!entries[0].isIntersecting && !panelContainer.hidden) dismissPanel(false);
}, { threshold: .01 });
visibilityObserver.observe(hero);
window.addEventListener("pagehide", event => {
  stopZoneClips();
  clearTimeout(previewTimer);
  if (event.persisted) return;
  sceneObserver.disconnect();
  visibilityObserver.disconnect();
  mobileScene.removeEventListener("change", fitScene);
});

// Compact estimate: current visible inputs are the only calculation state.
const commercial = window.piSchoolCommercial;
const estimator = commercial.estimator;
const estimateRoot = document.getElementById('configuration');
const estimateField = id => document.getElementById(id);
const estimateEnglish = () => document.documentElement.lang === 'en';
const estimateText = fr => estimateEnglish() ? window.piTranslations[fr] ?? fr : fr;
function readEstimate() {
  return {students:estimateField('students').value,reinforcements:estimateField('reinforcements').value,
    extraClasses:estimateField('extra-classes').value,multipleBlocks:estimateField('multiple-blocks').checked};
}
function updateEstimate() {
  const raw=readEstimate(),result=estimator.calculate(raw);
  const money=cents=>new Intl.NumberFormat(estimateEnglish()?'en-CA':'fr-CA',{style:'currency',currency:estimator.policy.currency,currencyDisplay:'narrowSymbol',minimumFractionDigits:0,maximumFractionDigits:2}).format(cents/100);
  const count=n=>new Intl.NumberFormat(estimateEnglish()?'en-CA':'fr-CA').format(n);
  const set=(id,value)=>estimateField(id).textContent=value;
  const interpolate=(fr,values)=>estimateText(fr).replace(/\{(\w+)\}/g,(_,key)=>values[key]);
  for(const id of ['students','reinforcements']) {
    const input=estimateField(id),number=input.valueAsNumber;
    const valid=input.value.trim()!==''&&Number.isInteger(number)&&number>=Number(input.min)&&number<=Number(input.max);
    input.setAttribute('aria-invalid',String(!valid));
  }
  set('estimate-error',result?'':estimateText('Saisissez un nombre entier d’élèves supérieur à zéro et un nombre entier d’intervenants égal ou supérieur à zéro.'));
  estimateField('estimate-custom-help').hidden=raw.extraClasses!=='custom';
  estimateField('estimate-block-help').hidden=!raw.multipleBlocks;
  set('estimate-scope',estimateText(result?.customClinics?'Estimation hors cliniques sur mesure et déplacement':'Budget estimé avant déplacement'));
  set('estimate-first-block',raw.multipleBlocks?estimateText('Montant pour le premier bloc de 4 h uniquement.'):'');
  set('estimate-program-label',interpolate('Programme · {count} élèves',{count:result?count(result.configuration.students):'—'}));
  set('estimate-staff-label',result&&result.configuration.reinforcements?result.configuration.reinforcements===1?estimateText('1 intervenant supplémentaire'):interpolate('{count} intervenants supplémentaires',{count:count(result.configuration.reinforcements)}):estimateText('Intervenants supplémentaires'));
  set('estimate-clinics-label',result&&!result.customClinics&&result.configuration.extraClasses!=='0'?result.configuration.extraClasses==='1'?estimateText('1 classe supplémentaire de clinique'):interpolate('{count} classes supplémentaires de clinique',{count:result.configuration.extraClasses}):estimateText('Classes supplémentaires de clinique'));
  set('estimate-base',result?money(result.baseCents):'—');
  set('estimate-staff',!result?'—':result.configuration.reinforcements?'+'+money(result.reinforcementCents):estimateText('Aucun ajouté'));
  set('estimate-clinics',!result?'—':result.customClinics?estimateText('Supplément à préciser'):result.configuration.extraClasses!=='0'?'+'+money(result.clinicCents):estimateText('Aucune ajoutée'));
  set('estimate-total',result?money(result.estimatedCents):'—');
  set('estimate-per-student',result?interpolate('{amount} par élève',{amount:money(result.perStudentCents)}):'—');
  const link=estimateRoot.querySelector('[data-school-proposal]');
  link.setAttribute('aria-disabled',String(!result));if(result)link.setAttribute('href','#contact');else link.removeAttribute('href');
  document.dispatchEvent(new CustomEvent('pi:configuration'));
}
// Existing shared links are read once. They are never overwritten or deleted.
try {
  const raw=JSON.parse(new URL(location.href).searchParams.get('configuration'));
  const restored=estimator.restore(raw);
  if(restored){
    for(const [id,key] of [['students','students'],['reinforcements','reinforcements'],['extra-classes','extraClasses']])estimateField(id).value=restored.value[key];
    estimateField('multiple-blocks').checked=restored.value.multipleBlocks;
    estimateField('estimate-restored').hidden=!restored.legacy;
  }
}catch{/* Malformed shared links do not replace the visible defaults. */}
window.piSchoolConfiguration=()=>estimator.configuration(readEstimate());
estimateRoot.addEventListener('input',updateEstimate);
estimateRoot.addEventListener('change',updateEstimate);
estimateRoot.addEventListener('click',event=>{
  const button=event.target.closest('[data-estimate-step]');if(!button)return;
  const input=estimateField(button.getAttribute('aria-controls')),step=Number(button.dataset.estimateStep);
  const current=input.valueAsNumber;
  input.value=String(Math.min(Number(input.max),Math.max(Number(input.min),Number.isFinite(current)?current+step:Number(input.min))));
  input.dispatchEvent(new Event('input',{bubbles:true}));
});
document.addEventListener('pi:language',updateEstimate);
updateEstimate();

const motion = matchMedia("(prefers-reduced-motion: no-preference)");
if (motion.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-entering");
      observer.unobserve(entry.target);
    }
  }, { threshold: .15 });
  document.querySelectorAll(".school-card").forEach(card => observer.observe(card));
}

const pointerEffects = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
for (const surface of document.querySelectorAll(".pointer-surface")) {
  let frame = 0;
  let x = 50;
  let y = 50;
  let targetX = 50;
  let targetY = 50;
  function follow() {
    if (!pointerEffects.matches || document.hidden || surface.closest("[data-offscreen]")) {
      surface.style.setProperty("--glow", "0");
      surface.style.setProperty("--dx", "0px");
      surface.style.setProperty("--dy", "0px");
      frame = 0;
      return;
    }
    x += (targetX - x) * .2;
    y += (targetY - y) * .2;
    surface.style.setProperty("--x", x + "%");
    surface.style.setProperty("--y", y + "%");
    surface.style.setProperty("--dx", (x - 50) * .08 + "px");
    surface.style.setProperty("--dy", (y - 50) * .08 + "px");
    frame = Math.abs(targetX - x) + Math.abs(targetY - y) > .25
      ? requestAnimationFrame(follow) : 0;
  }
  surface.addEventListener("pointermove", event => {
    if (!pointerEffects.matches || event.pointerType !== "mouse" || (surface === arena && mobileScene.matches)) return;
    const rect = surface.getBoundingClientRect();
    targetX = Math.max(0, Math.min(100, 100 * (event.clientX - rect.left) / rect.width));
    targetY = Math.max(0, Math.min(100, 100 * (event.clientY - rect.top) / rect.height));
    surface.style.setProperty("--glow", "1");
    if (!frame) frame = requestAnimationFrame(follow);
  });
  function resetPointer() {
    surface.style.setProperty("--glow", "0");
    targetX = targetY = 50;
    if (!frame) frame = requestAnimationFrame(follow);
  }
  surface.addEventListener("pointerleave", resetPointer);
  pointerEffects.addEventListener("change", resetPointer);
  document.addEventListener("visibilitychange", resetPointer);
  window.addEventListener("pagehide", () => {
    cancelAnimationFrame(frame);
    frame = 0;
  });
}

// One-shot school price reveal. Static HTML is the final, no-JavaScript offer.
{
  const panel = document.querySelector('[data-price-reveal]');
  if (panel) {
    const counter = panel.querySelector('[data-price-counter]');
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const {regularRate, pilotRate} = window.piSchoolCommercial.policy;
    let frame = 0;
    let observer;
    let started = false;
    let startTime;
    function finish(pulse = false) {
      cancelAnimationFrame(frame);
      frame = 0;
      counter.textContent = String(pilotRate);
      panel.dataset.revealState = 'complete';
      if (pulse && !preference.matches) panel.classList.add('offer-arrival');
      observer?.disconnect();
    }
    function tick(timestamp) {
      startTime ??= timestamp;
      const progress = Math.min(1, (timestamp - startTime) / 1800);
      counter.textContent = String(Math.max(pilotRate, regularRate - Math.floor((regularRate - pilotRate) * progress)));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else finish(true);
    }
    function start() {
      if (started) return;
      started = true;
      panel.dataset.revealState = 'running';
      observer?.disconnect();
      frame = requestAnimationFrame(tick);
    }
    function reduceMotion() {
      if (preference.matches) { started = true; finish(); panel.classList.remove('offer-arrival'); }
    }
    if (preference.matches || !('IntersectionObserver' in window)) {
      started = true;
      finish();
    } else {
      counter.textContent = String(regularRate);
      panel.dataset.revealState = 'pending';
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .4)) start();
      }, {threshold:.4});
      observer.observe(panel);
    }
    preference.addEventListener('change', reduceMotion);
    window.addEventListener('pagehide', () => {
      started = true;
      finish();
      preference.removeEventListener('change', reduceMotion);
    }, {once:true});
  }
}

// Optional zone clips: empty configuration uses approved public images only.
function stopZoneClips() {
  for (const panel of zonePanels) {
    for (const video of panel.querySelectorAll('video')) { video.pause(); video.remove(); }
    panel.querySelector('.zone-photo').hidden = false;
    panel.querySelector('.zone-play').hidden = !panel.dataset.zoneVideo;
  }
}
for (const panel of zonePanels) {
  const play = panel.querySelector('.zone-play');
  const source = panel.dataset.zoneVideo;
  if (!source) continue;
  play.hidden = false;
  play.addEventListener('click', async () => {
    stopZoneClips();
    const video = document.createElement('video');
    video.src = source;
    video.controls = true;
    video.playsInline = true;
    video.preload = 'none';
    video.poster = panel.querySelector('.zone-photo').src;
    video.setAttribute('aria-labelledby', panel.id + '-title');
    panel.querySelector('h2').id = panel.id + '-title';
    panel.querySelector('.zone-photo').before(video);
    panel.querySelector('.zone-photo').hidden = true;
    play.hidden = true;
    panel.querySelector('.zone-media-error').hidden = true;
    video.addEventListener('error', () => {
      stopZoneClips();
      panel.querySelector('.zone-media-error').hidden = false;
    });
    video.focus({preventScroll:true});
    try { await video.play(); } catch { /* Native controls remain available for voluntary playback. */ }
  });
}

// Click-to-play school video: no YouTube player or script before activation.
{
  const play = document.getElementById('school-video-play');
  const stage = document.getElementById('school-video-stage');
  const poster = document.getElementById('school-video-poster');
  const failure = document.getElementById('school-video-failure');
  const fullscreen = document.getElementById('school-video-fullscreen');
  const fullscreenStatus = document.getElementById('school-video-fullscreen-status');
  fullscreen.addEventListener('click', async () => {
    try { await stage.requestFullscreen(); } catch { fullscreenStatus.hidden = false; }
  });
  let player = null;
  const playerTitle = () => document.documentElement.lang === 'en'
    ? 'PürInstinct Games video' : 'Vidéo PürInstinct Games';
  poster.addEventListener('error', () => { poster.hidden = true; });
  play.addEventListener('click', () => {
    if (player) return;
    player = document.createElement('iframe');
    const language = document.documentElement.lang === 'en' ? 'en' : 'fr';
    player.title = playerTitle();
    player.src = 'https://www.youtube-nocookie.com/embed/chfQomu8rZ4?autoplay=1&controls=1&playsinline=1&loop=0&rel=0&hl=' + language;
    player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    player.allowFullscreen = true;
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    player.tabIndex = 0;
    player.addEventListener('error', () => { failure.hidden = false; });
    stage.replaceChildren(player);
    fullscreen.hidden = typeof stage.requestFullscreen !== 'function';
    player.focus();
  });
  document.addEventListener('pi:language', () => {
    // Change the accessible name only. Never reload an already playing video.
    if (player) player.title = playerTitle();
  });
  const section = document.getElementById('video-games');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      section.classList.add('is-video-visible');
      reveal.disconnect();
    }, { threshold: .08 });
    reveal.observe(section);
    window.addEventListener('pagehide', event => { if (!event.persisted) reveal.disconnect(); });
  }
}
