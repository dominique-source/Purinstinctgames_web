const stage = document.querySelector(".two-screens");
const match = stage.querySelector(".match-screen");
const nav = document.querySelector(".nav");
const motion = matchMedia("(prefers-reduced-motion: no-preference)");
const mobile = matchMedia("(max-width: 750px)");

function renderParallax() {
  const start = stage.getBoundingClientRect().top + scrollY - nav.offsetHeight;
  const progress = Math.min(1, Math.max(0, (scrollY - start) / match.offsetHeight));
  const movement = Math.sin(Math.PI * progress);

  stage.style.setProperty("--nav-height", nav.offsetHeight + "px");
  stage.style.setProperty("--copy-opacity", String(Math.max(0, 1 - progress * 3)));
  stage.style.setProperty("--copy-y", -progress * (mobile.matches ? 24 : 90) + "px");
  stage.style.setProperty("--match-scale", String(1 + movement * .075));
  stage.style.setProperty("--match-y", -movement * 18 + "px");
}

function syncMotionPreference() {
  stage.toggleAttribute("data-parallax", motion.matches);
  if (motion.matches) {
    renderParallax();
    window.addEventListener("scroll", renderParallax, { passive: true });
    window.addEventListener("resize", renderParallax);
  } else {
    window.removeEventListener("scroll", renderParallax);
    window.removeEventListener("resize", renderParallax);
  }
}

motion.addEventListener("change", syncMotionPreference);
syncMotionPreference();
