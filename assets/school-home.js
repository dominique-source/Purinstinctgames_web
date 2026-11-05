const arena = document.querySelector(".school-arena");
const zoneControls = [...document.querySelectorAll("[data-zone]")];
const zonePanels = [...document.querySelectorAll(".zone-detail")];
const arenaEffects = [...document.querySelectorAll("[data-effect]")];
const arenaHint = document.querySelector(".arena-hint");
let selectedZone;
let hoveredControl;
let focusedControl;
let displayedZone;

function showZone(play = true) {
  const zone = hoveredControl?.dataset.zone ?? focusedControl?.dataset.zone ?? selectedZone;
  if (zone === displayedZone) return;
  displayedZone = zone;
  arena.classList.toggle("has-zone", Boolean(zone));
  arenaHint.hidden = Boolean(zone);
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
    if (event.pointerType !== "mouse") return;
    hoveredControl = control;
    showZone();
  });
  control.addEventListener("pointerleave", () => {
    if (hoveredControl !== control) return;
    hoveredControl = undefined;
    showZone(false);
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
    selectedZone = control.dataset.zone;
    for (const button of zoneControls) {
      button.setAttribute("aria-pressed", String(button.dataset.zone === selectedZone));
    }
    showZone();
  });
}

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
  const roles = field("roles");
  roles.setCustomValidity("");
  if (adults !== null && roles.valueAsNumber > adults) {
    roles.setCustomValidity(english
      ? "Assigned roles exceed the number of available adults."
      : "Les postes attribués dépassent le nombre d’adultes disponibles.");
  }
  const invalid = document.querySelector(".school-fields input:invalid");
  field("configuration-error").textContent = invalid
    ? invalid.labels[0].textContent.trim() + " — " + (invalid.validity.customError ? invalid.validationMessage : english
      ? "Enter a whole number between " + counts.format(Number(invalid.min)) + " and " + counts.format(Number(invalid.max)) + "."
      : "Saisissez un nombre entier entre " + counts.format(Number(invalid.min)) + " et " + counts.format(Number(invalid.max)) + ".")
    : "";
}
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
    x += (targetX - x) * .2;
    y += (targetY - y) * .2;
    surface.style.setProperty("--x", x + "%");
    surface.style.setProperty("--y", y + "%");
    surface.style.setProperty("--dx", (x - 50) * .12 + "px");
    surface.style.setProperty("--dy", (y - 50) * .12 + "px");
    frame = Math.abs(targetX - x) + Math.abs(targetY - y) > .25
      ? requestAnimationFrame(follow) : 0;
  }
  surface.addEventListener("pointermove", event => {
    if (!pointerEffects.matches || event.pointerType !== "mouse") return;
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
}
