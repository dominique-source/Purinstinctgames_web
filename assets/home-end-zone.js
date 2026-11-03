const stage = document.querySelector(".two-screens");
const match = stage.querySelector(".match-screen");
const nav = document.querySelector(".nav");
const motion = matchMedia("(prefers-reduced-motion: no-preference)");
const mobile = matchMedia("(max-width: 750px)");

function renderEndZone() {
  const start = stage.getBoundingClientRect().top + scrollY - nav.offsetHeight;
  const progress = Math.min(1, Math.max(0, (scrollY - start) / match.offsetHeight));
  const remaining = Math.max(0, start + match.offsetHeight - scrollY);
  const leadIn = Math.max(0, 1 - progress / .2);
  const sweep = Math.min(1, Math.max(0, (progress - .2) / .8));

  stage.style.setProperty("--nav-height", nav.offsetHeight + "px");
  stage.style.setProperty("--copy-opacity", String(Math.max(0, 1 - progress * 3)));
  stage.style.setProperty("--copy-y", -progress * (mobile.matches ? 24 : 90) + "px");
  stage.style.setProperty("--arena-y", progress > 0 ? -remaining + "px" : "0px");
  stage.style.setProperty("--line-left", (86 * (1 - sweep) + 14 * leadIn) + "%");
  stage.style.setProperty("--line-right", (70 * (1 - sweep) + 30 * leadIn) + "%");
}

function syncMotionPreference() {
  stage.toggleAttribute("data-end-zone", motion.matches);
  if (motion.matches) {
    renderEndZone();
    window.addEventListener("scroll", renderEndZone, { passive: true });
    window.addEventListener("resize", renderEndZone);
  } else {
    window.removeEventListener("scroll", renderEndZone);
    window.removeEventListener("resize", renderEndZone);
  }
}

motion.addEventListener("change", syncMotionPreference);
syncMotionPreference();
