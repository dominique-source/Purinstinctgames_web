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

function formatters() {
  const locale = document.documentElement.lang === "en" ? "en-CA" : "fr-CA";
  return {
    counts: new Intl.NumberFormat(locale),
    currency: new Intl.NumberFormat(locale, {
      style: "currency", currency: "CAD", currencyDisplay: "code",
      minimumFractionDigits: 0, maximumFractionDigits: 2,
    }),
  };
}
const field = id => document.getElementById(id);
const value = id => {
  const input = field(id);
  return input.validity.valid && Number.isFinite(input.valueAsNumber) ? input.valueAsNumber : null;
};
function sum(first, second) {
  return first === null || second === null ? null : first + second;
}

function updateConfiguration() {
  const { counts, currency } = formatters();
  for (const el of document.querySelectorAll("[data-cad]")) el.textContent = currency.format(Number(el.dataset.cad));
  for (const el of document.querySelectorAll("[data-number]")) el.textContent = counts.format(Number(el.dataset.number));
  const english = document.documentElement.lang === "en";
  field("clinics").placeholder = english ? "To be specified" : "À préciser";
  const adults = sum(value("teachers"), value("adults"));
  const totals = {
    students: value("students"),
    adults,
    spaces: sum(value("indoors"), value("outdoors")),
  };
  for (const [key, number] of Object.entries(totals)) {
    for (const output of document.querySelectorAll('[data-total="' + key + '"]')) {
      const next = number === null ? "—" : counts.format(number);
      if (output.textContent === next) continue;
      output.textContent = next;
      output.classList.remove("is-changing");
      requestAnimationFrame(() => output.classList.add("is-changing"));
    }
  }
  const budget = window.piSchoolCommercial.estimate(totals.students);
  for (const [selector, amount] of [["[data-pilot-total]", budget.base]]) {
    for (const output of document.querySelectorAll(selector)) {
      output.textContent = amount === null ? (english ? "Enter a valid student count" : "Saisissez un nombre d’élèves valide") : currency.format(amount);
    }
  }
  for (const output of document.querySelectorAll("[data-commercial-discount]")) output.textContent = window.piSchoolCommercial.discountText(english ? "en" : "fr");
  const roles = field("roles");
  roles.setCustomValidity("");
  if (adults !== null && roles.valueAsNumber > adults) {
    roles.setCustomValidity(english
      ? "Simultaneously available adults exceed the declared total."
      : "Le nombre d’adultes présents en même temps dépasse le total disponible.");
  }
  for (const output of document.querySelectorAll('[data-commercial-rate]')) {
    const rate = window.piSchoolCommercial.policy[output.dataset.commercialRate === 'regular' ? 'regularRate' : 'pilotRate'];
    output.textContent = currency.format(rate);
  }
  const raw = Object.fromEntries(Object.keys(window.piSchoolCommercial.limits).map(key => [key, value(key)]));
  const configured = window.piSchoolCommercial.configuration(raw);
  for (const link of document.querySelectorAll('[data-school-proposal]')) {
    link.setAttribute('aria-disabled', String(!configured));
    if (!configured) { link.removeAttribute('href'); continue; }
    link.setAttribute('href', '#contact');
  }
  const invalid = document.querySelector(".school-fields input:invalid");
  field("configuration-error").textContent = invalid
    ? invalid.labels[0].textContent.trim() + " — " + (invalid.validity.customError ? invalid.validationMessage : english
      ? "Enter a whole number between " + counts.format(Number(invalid.min)) + " and " + counts.format(Number(invalid.max)) + "."
      : "Saisissez un nombre entier entre " + counts.format(Number(invalid.min)) + " et " + counts.format(Number(invalid.max)) + ".")
    : "";
}
// Compatibility with previously shared school proposal links. Never reset on language changes.
try {
  const shared = window.piSchoolCommercial.configuration(JSON.parse(new URL(location.href).searchParams.get('configuration')));
  if (shared) for (const [id, number] of Object.entries(shared)) field(id).value = number === null ? '' : String(number);
} catch { /* Ignore malformed legacy links. */ }
for (const input of document.querySelectorAll(".school-fields input")) {
  input.addEventListener("input", updateConfiguration);
}
document.addEventListener("pi:language", updateConfiguration);
updateConfiguration();

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

// School offer steppers: native editable fields remain the source of truth.
for (const button of document.querySelectorAll('[data-step-target]')) {
  button.addEventListener('click', () => {
    const input = document.getElementById(button.dataset.stepTarget);
    const direction = Number(button.dataset.step);
    const current = Number.isFinite(input.valueAsNumber) ? input.valueAsNumber : Number(input.min) - (direction > 0 ? 1 : -1);
    input.value = String(Math.max(Number(input.min), Math.min(Number(input.max), current + direction)));
    input.dispatchEvent(new Event('input', { bubbles:true }));
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
