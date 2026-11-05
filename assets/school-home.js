const zoneControls = [...document.querySelectorAll("[data-zone]")];

for (const control of zoneControls) {
  control.addEventListener("click", event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const key = control.dataset.zone;
    for (const link of zoneControls) {
      const selected = link.dataset.zone === key;
      link.toggleAttribute("data-selected", selected);
      link.setAttribute("aria-expanded", String(selected));
    }
    for (const panel of document.querySelectorAll(".zone-detail")) {
      panel.hidden = panel.id !== "zone-" + key;
    }
    const panel = document.getElementById("zone-" + key);
    if (control.classList.contains("arena-pin")) {
      const next = zoneControls.find(link => link.dataset.zone === key && !link.classList.contains("arena-pin"));
      next.focus({ preventScroll: true });
      panel.scrollIntoView({ block: "nearest" });
    }
  });
  control.setAttribute("aria-controls", "zone-" + control.dataset.zone);
  control.setAttribute("aria-expanded", "false");
}

const counts = new Intl.NumberFormat("fr-CA");
const field = id => document.getElementById(id);
const value = id => {
  const input = field(id);
  return input.validity.valid && Number.isFinite(input.valueAsNumber) ? input.valueAsNumber : null;
};
function sum(first, second) {
  return first === null || second === null ? null : first + second;
}

function updateConfiguration() {
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
    roles.setCustomValidity("Les postes attribués dépassent le nombre d’adultes disponibles.");
  }
  const invalid = document.querySelector(".school-fields input:invalid");
  field("configuration-error").textContent = invalid
    ? invalid.labels[0].textContent.trim() + " — " + invalid.validationMessage
    : "";
}
for (const input of document.querySelectorAll(".school-fields input")) {
  input.addEventListener("input", updateConfiguration);
}
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
