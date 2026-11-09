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

// Three-step public configurator. DOM inputs remain the source of truth.
const commercial = window.piSchoolCommercial;
const configRoot = document.querySelector('.config-v2');
const cfgField = id => document.getElementById(id);
const cfgEnglish = () => document.documentElement.lang === 'en';
const cfgText = fr => cfgEnglish() ? window.piTranslations[fr] ?? fr : fr;
const cfgEscape = text => String(text).replace(/[&<>"']/g, char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const cfgNumber = input => input.value === '' ? null : input.valueAsNumber;
let cfgSerial = 1;
let cfgBlocks = [{id:'b1',label:'',students:200,fields:1,games:9,teachers:12,adults:3,override:false,indoors:1,outdoors:2}];
let cfgLegacy;
const cfgOverrideEdited = new Set();
const cfgName = (b,i) => commercial.blockName(b,i,cfgEnglish()?'en':'fr');
function readConfiguration() {
  return {version:commercial.policy.version,students:cfgNumber(cfgField('students')),indoors:cfgNumber(cfgField('indoors')),outdoors:cfgNumber(cfgField('outdoors')),clinics:cfgNumber(cfgField('clinics')),notes:cfgField('config-notes').value,legacy:cfgLegacy,
    blocks:cfgBlocks.map(block=>({id:block.id,...Object.fromEntries(['label','students','fields','games','teachers','adults','override','indoors','outdoors'].map(key=>{
      const input=cfgField('cfg-'+block.id+'-'+key);
      return [key,key==='label'?input.value:key==='override'?input.checked:cfgNumber(input)];
    }))}))};
}
function cfgNumeric(block,key,label,value,min,max) {
  const id='cfg-'+block.id+'-'+key;
  return '<div class="offer-field"><label for="'+id+'"><span>'+cfgEscape(cfgText(label))+'</span><input id="'+id+'" data-config-field="'+key+'" type="number" min="'+min+'" max="'+max+'" step="1" required></label><span class="offer-stepper"><button type="button" data-step-target="'+id+'" data-step="-1" aria-controls="'+id+'" aria-label="'+cfgEscape(cfgText('Diminuer')+' — '+cfgText(label))+'">−</button><button type="button" data-step-target="'+id+'" data-step="1" aria-controls="'+id+'" aria-label="'+cfgEscape(cfgText('Augmenter')+' — '+cfgText(label))+'">+</button></span></div>';
}
function renderConfiguration(raw, countDraft = null) {
  const containers=['config-schedule','config-activities','config-staff'].map(cfgField);
  containers.forEach(el=>el.replaceChildren());
  cfgBlocks=raw.blocks.map(b=>({...b}));
  cfgField('block-count').value=countDraft??String(cfgBlocks.length);
  cfgField('add-config-block').disabled=cfgBlocks.length>=commercial.limits.blocks;
  cfgField('config-legacy').hidden=!cfgLegacy;
  cfgBlocks.forEach((b,i)=>{
    const heading='<h4 data-config-name="'+b.id+'">'+cfgEscape(cfgName(b,i))+'</h4>';
    const schedule=document.createElement('div');schedule.className='config-block';
    schedule.innerHTML=heading+'<label class="config-label" for="cfg-'+b.id+'-label">'+cfgEscape(cfgText('Libellé du bloc'))+'<input id="cfg-'+b.id+'-label" type="text" maxlength="'+commercial.limits.label+'"></label>'+cfgNumeric(b,'students','Élèves présents dans ce bloc',b.students,1,commercial.limits.students)+(i?'<button class="config-remove" type="button" data-remove-block="'+b.id+'">'+cfgEscape(cfgText('Retirer ce bloc'))+'</button>':'');
    const activities=document.createElement('div');activities.className='config-block';
    activities.innerHTML=heading+'<div class="config-pair">'+cfgNumeric(b,'fields','Terrains PürInstinct souhaités',b.fields,0,commercial.limits.installations)+cfgNumeric(b,'games','Jeux de zone souhaités',b.games,0,commercial.limits.installations)+'</div><label class="config-override"><input type="checkbox" id="cfg-'+b.id+'-override">'+cfgEscape(cfgText('Espaces différents pour ce bloc'))+'</label><div class="config-pair" data-space-override="'+b.id+'">'+cfgNumeric(b,'indoors','Plateaux intérieurs du bloc',b.indoors,0,commercial.limits.areas)+cfgNumeric(b,'outdoors','Plateaux extérieurs du bloc',b.outdoors,0,commercial.limits.areas)+'</div><div data-capacity="'+b.id+'"></div>';
    const staff=document.createElement('div');staff.className='config-block';
    staff.innerHTML=heading+'<div class="config-pair">'+cfgNumeric(b,'teachers','Enseignants simultanément disponibles',b.teachers,0,commercial.limits.adults)+cfgNumeric(b,'adults','Autres adultes simultanément disponibles',b.adults,0,commercial.limits.adults)+'</div><div data-staffing="'+b.id+'"></div>';
    [schedule,activities,staff].forEach((el,n)=>containers[n].append(el));
    for(const key of ['label','students','fields','games','teachers','adults','indoors','outdoors'])cfgField('cfg-'+b.id+'-'+key).value=b[key]??'';
    cfgField('cfg-'+b.id+'-label').placeholder=cfgName({label:''},i);
    cfgField('cfg-'+b.id+'-override').checked=b.override===true;
  });
  updateConfiguration();
}
function cfgRows(rows){return '<dl class="config-results">'+rows.map(([label,value])=>'<div><dt>'+cfgEscape(label)+'</dt><dd>'+cfgEscape(typeof value==='number'?new Intl.NumberFormat(cfgEnglish()?'en-CA':'fr-CA').format(value):value)+'</dd></div>').join('')+'</dl>';}
const cfgWarnings={numbers:'Saisissez des nombres entiers dans les limites indiquées.',blocks:'Le nombre de blocs doit être compris dans les limites indiquées.',notes:'Le texte des précisions est trop long.',label:'Le libellé du bloc est trop long.',attendanceMax:'Un bloc ne peut pas dépasser l’effectif distinct.',attendanceCoverage:'La somme des présences doit couvrir l’effectif distinct déclaré.',activity:'Prévoyez au moins un terrain ou un jeu de zone dans chaque bloc.'};
function updateConfiguration() {
  const raw=readConfiguration(),checked=commercial.validate(raw),legacyReady=!cfgLegacy||cfgField('config-legacy-confirm').checked,countMatches=cfgField('block-count').valueAsNumber===cfgBlocks.length,result=checked.value&&legacyReady&&countMatches?commercial.calculate(checked.value):null;
  const money=n=>commercial.formatMoney(n,cfgEnglish()?'en':'fr');
  for(const el of configRoot.querySelectorAll('[aria-invalid]'))el.removeAttribute('aria-invalid');
  checked.errors.forEach(error=>cfgField(error.path)?.setAttribute('aria-invalid','true'));
  const countValid=Number.isInteger(cfgField('block-count').valueAsNumber)&&cfgField('block-count').valueAsNumber===cfgBlocks.length;
  cfgField('configuration-error').textContent=[...new Set([...checked.errors.map(e=>cfgText(cfgWarnings[e.code])),...(!countValid?[cfgText(cfgWarnings.blocks)]:[]),...(!legacyReady?[cfgText('Vérifiez et confirmez les nouveaux blocs et disponibilités.')]:[])])].join(' ');
  raw.blocks.forEach((b,i)=>{
    configRoot.querySelectorAll('[data-config-name="'+b.id+'"]').forEach(el=>el.textContent=cfgName(b,i));
    configRoot.querySelector('[data-space-override="'+b.id+'"]').hidden=!b.override;
    const r=result?.blocks[i];
    const capacity=configRoot.querySelector('[data-capacity="'+b.id+'"]'),staffing=configRoot.querySelector('[data-staffing="'+b.id+'"]');
    if(!r){capacity.textContent=cfgText('Vérifiez les saisies pour afficher les capacités.');staffing.textContent='—';return;}
    const c=r.capacity,s=r.staffing;
    capacity.innerHTML=cfgRows([[cfgText('Surfaces nécessaires — minimum théorique'),c.minimumAreas],[cfgText('Surfaces physiques disponibles'),c.availableAreas],[cfgText('Élèves en jeu'),c.playing],[cfgText('Élèves en attente'),c.waiting],[cfgText('Élèves en transition'),c.transition],[cfgText('Capacité simultanée mobilisée'),c.mobilized],[cfgText('Adultes nécessaires aux jeux'),s.needed]])+
      '<p class="config-caution">'+cfgEscape(cfgText('Répartition théorique extérieure : un terrain par plateau, deux jeux de zone par plateau compatible. Dimensions et montage à valider.'))+'</p>'+
      (r.block.indoors>0?'<p class="config-warning">'+cfgEscape(cfgText('Compatibilité intérieure à confirmer. Aucun montage intérieur n’est certifié par ce calcul.'))+'</p>':'')+
      (c.availableAreas<c.minimumAreas?'<p class="config-warning">'+cfgEscape(cfgText('Surfaces insuffisantes pour cette répartition. Ajoutez des plateaux compatibles ou ajustez les installations souhaitées.'))+'</p>':'')+
      (c.mobilized<r.block.students?'<p class="config-warning">'+cfgEscape(cfgText('Capacité simultanée insuffisante : réduisez le groupe, ajoutez des surfaces et activités compatibles ou répartissez les élèves en blocs supplémentaires. Aucune rotation non documentée n’est supposée.'))+'</p>':'');
    staffing.innerHTML=cfgRows([[cfgText('Adultes nécessaires aux jeux'),s.needed],[cfgText('Adultes fournis par l’école'),s.school],[cfgText('Renforts PürInstinct nécessaires'),s.reinforcements],[cfgText('Intervenants PürInstinct de base — en plus'),s.baseStaff],[cfgText('Équipe PürInstinct totale'),s.piTeam],[cfgText('Adultes sur place, équipe déclarée et renforts'),s.onSite],[cfgText('Supplément d’encadrement du bloc'),money(s.cost)]])+
      '<p>'+cfgEscape(cfgText('Votre école fournit {school} adultes pour {needed} postes d’encadrement. Renforts PürInstinct nécessaires pour ce bloc : {reinforcements}, soit {cost}.').replace(/\{(school|needed|reinforcements|cost)\}/g,(_,key)=>({school:s.school,needed:s.needed,reinforcements:s.reinforcements,cost:money(s.cost)}[key])))+'</p>';
  });
  cfgField('config-capacity-rules').textContent=cfgText('Terrain : jeu / attente / transition / adultes : ')+[commercial.policy.field.playing,commercial.policy.field.waiting,commercial.policy.field.transition,commercial.policy.field.adults].join(' / ')+'. '+cfgText('Jeu de zone : ')+[commercial.policy.game.playing,commercial.policy.game.waiting,commercial.policy.game.transition,commercial.policy.game.adults].join(' / ')+'.';
  if(result){const b=result.budget;
    cfgField('config-budget-lines').innerHTML=cfgRows([[cfgText('Base du programme — élèves distincts'),money(b.base)],[cfgText('Premier bloc de quatre heures'),cfgText('Inclus')],[cfgText('Équipe de base du premier bloc'),commercial.policy.baseStaff+' — '+cfgText('Inclus')],...result.blocks.map((r,i)=>[cfgText('Renforts')+' · '+cfgName(r.block,i),r.staffing.reinforcements+' × '+money(commercial.policy.reinforcementBlockRate)+' = '+money(r.staffing.cost)]),[cfgText('Frais des blocs supplémentaires'),raw.blocks.length===1?cfgText('Sans objet'):money(b.extraBlocks)],[cfgText('Sous-total connu'),money(b.knownSubtotal)],[cfgText('Équivalent du sous-total connu par élève'),money(b.perStudent)],[cfgText('Déplacement'),money(b.travel)],[cfgText('Total à confirmer'),money(b.total)]])+'<p class="config-caution">'+cfgEscape(cfgText('Le sous-total connu et son équivalent par élève excluent les frais restant à confirmer.'))+'</p><p>'+cfgEscape(money(commercial.policy.reinforcementHourlyRate)+' × '+commercial.policy.blockHours+' h = '+money(commercial.policy.reinforcementBlockRate)+' · '+cfgText('par renfort et par bloc'))+'</p>';
  }else cfgField('config-budget-lines').innerHTML=cfgRows([[cfgText('Base du programme — élèves distincts'),commercial.estimate(raw.students).base===null?'—':money(commercial.estimate(raw.students).base)]])+'<p>'+cfgEscape(cfgText('Vérifiez les saisies pour afficher le budget.'))+'</p>';
  for(const link of document.querySelectorAll('[data-school-proposal]')){link.setAttribute('aria-disabled',String(!result||!countValid));if(result&&countValid)link.setAttribute('href','#contact');else link.removeAttribute('href');}
  document.dispatchEvent(new CustomEvent('pi:configuration'));
}
window.piSchoolConfiguration=()=>{
  if(cfgField('block-count').valueAsNumber!==cfgBlocks.length||(cfgLegacy&&!cfgField('config-legacy-confirm').checked))return null;
  return commercial.configuration(readConfiguration());
};
function cfgResize(count) {
  if(!Number.isInteger(count)||count<1||count>commercial.limits.blocks){updateConfiguration();return;}
  const raw=readConfiguration();
  while(raw.blocks.length<count){const first=raw.blocks[0];raw.blocks.push({id:'b'+(++cfgSerial),label:'',students:raw.students,fields:first.fields,games:first.games,teachers:0,adults:0,override:false,indoors:raw.indoors,outdoors:raw.outdoors});}
  raw.blocks=raw.blocks.slice(0,count);renderConfiguration(raw);
}
configRoot.addEventListener('input',event=>{
  if(event.target.id.endsWith('-override')&&event.target.checked){const id=event.target.id.slice(4,-9);if(!cfgOverrideEdited.has(id)){cfgField('cfg-'+id+'-indoors').value=cfgField('indoors').value;cfgField('cfg-'+id+'-outdoors').value=cfgField('outdoors').value;cfgOverrideEdited.add(id);}}
  updateConfiguration();
});
cfgField('block-count').addEventListener('change',event=>cfgResize(event.target.valueAsNumber));
cfgField('block-count').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();cfgResize(event.target.valueAsNumber);}});
configRoot.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.stepTarget){const input=cfgField(button.dataset.stepTarget),direction=Number(button.dataset.step);input.value=String(Math.min(Number(input.max),Math.max(Number(input.min),(Number.isFinite(input.valueAsNumber)?input.valueAsNumber:Number(input.min)-direction)+direction)));input.dispatchEvent(new Event('input',{bubbles:true}));}
  if(button.id==='add-config-block'){cfgResize(cfgBlocks.length+1);cfgField('cfg-'+cfgBlocks.at(-1).id+'-label').focus({preventScroll:true});}
  if(button.dataset.removeBlock){const raw=readConfiguration();raw.blocks=raw.blocks.filter(b=>b.id!==button.dataset.removeBlock);renderConfiguration(raw);cfgField('add-config-block').focus({preventScroll:true});}
});
document.addEventListener('pi:language',()=>{const raw=readConfiguration(),countDraft=cfgField('block-count').value;cfgField('clinics').placeholder=cfgText('À préciser');cfgField('config-technical-limit').textContent=cfgText('Limite technique de cette demande : {blocks} blocs.').replace('{blocks}',commercial.limits.blocks);renderConfiguration(raw,countDraft);});
let initial={students:200,indoors:1,outdoors:2,clinics:null,notes:'',blocks:cfgBlocks};
try{const shared=commercial.configuration(JSON.parse(new URL(location.href).searchParams.get('configuration')));if(shared){initial=shared;cfgLegacy=shared.legacy;}}catch{/* Ignore malformed legacy links. */}
for(const key of ['students','indoors','outdoors','clinics'])cfgField(key).value=initial[key]??'';
cfgField('config-notes').value=initial.notes;
cfgSerial=Math.max(1,...initial.blocks.map(b=>Number(b.id.replace(/^b/,''))||0));
initial.blocks.filter(b=>b.override).forEach(b=>cfgOverrideEdited.add(b.id));
cfgField('config-technical-limit').textContent=cfgText('Limite technique de cette demande : {blocks} blocs.').replace('{blocks}',commercial.limits.blocks);
renderConfiguration(initial);

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
