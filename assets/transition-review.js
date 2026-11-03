if (new URLSearchParams(location.search).has("transitions")) {
  const controls = document.querySelector(".transition-review");
  const stage = document.querySelector(".two-screens");
  const match = stage.querySelector(".match-screen");
  const arena = stage.querySelector(".arena-screen");
  const nav = document.querySelector(".nav");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = value => Math.min(1, Math.max(0, value));
  let replay = 0;
  let effect = new URLSearchParams(location.search).get("transitions") === "b" ? "b" : "a";
  controls.hidden = false;

  function render() {
    const narrow = innerWidth <= 750;
    const start = stage.offsetTop - nav.offsetHeight;
    const distance = match.offsetHeight;
    const progress = clamp((scrollY - start) / distance);
    const remaining = Math.max(0, start + distance - scrollY);
    stage.style.setProperty("--review-nav", nav.offsetHeight + "px");
    stage.style.setProperty("--copy-opacity", String(1 - clamp(progress * 3)));
    stage.style.setProperty("--copy-y", -progress * (narrow ? 24 : 90) + "px");
    stage.style.setProperty("--match-scale", String(1 - progress * (narrow ? .025 : .075)));
    stage.style.setProperty("--match-y", -progress * (narrow ? 5 : 22) + "px");

    // At rest the reveal is outside the frame. Its first visible edge crosses
    // the diagonal ground stripe, then sweeps up to uncover the whole image.
    const line = progress < .2 ? 1 - progress / .2 : 0;
    const sweep = clamp((progress - .2) / .8);
    const left = (narrow ? 92 : 86) * (1 - sweep) + 14 * line;
    const right = (narrow ? 88 : 70) * (1 - sweep) + 30 * line;
    stage.style.setProperty("--arena-y", progress > 0 ? -remaining + "px" : "0px");
    stage.style.setProperty("--line-left", (progress === 0 ? 100 : left) + "%");
    stage.style.setProperty("--line-right", (progress === 0 ? 100 : right) + "%");
  }

  function select() {
    stage.dataset.transition = effect;
    for (const button of controls.querySelectorAll("[data-effect]")) {
      button.setAttribute("aria-pressed", String(button.dataset.effect === effect));
    }
    render();
  }

  function stop() { cancelAnimationFrame(replay); }
  controls.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    stop();
    window.scrollTo({ top: 0, behavior: "instant" });
    if (button.dataset.effect) {
      effect = button.dataset.effect;
      select();
      return;
    }
    const target = arena.offsetTop - nav.offsetHeight;
    if (reduced.matches) {
      window.scrollTo({ top: target, behavior: "instant" });
      return;
    }
    const started = performance.now();
    function step(now) {
      const progress = clamp((now - started) / 1450);
      const eased = progress * progress * (3 - 2 * progress);
      window.scrollTo({ top: target * eased, behavior: "instant" });
      if (progress < 1) replay = requestAnimationFrame(step);
    }
    replay = requestAnimationFrame(step);
  });
  for (const type of ["wheel", "touchstart", "keydown"]) {
    window.addEventListener(type, stop, { passive: true });
  }
  window.addEventListener("scroll", render, { passive: true });
  window.addEventListener("resize", render);
  select();
}
