/* Navigation only. Server authentication remains independent of this setting.
 * Change mode to "accessible" to restore the existing native APP destination. */
const PI_APP_ENTRY = Object.freeze({ mode: "coming-soon", destination: "/app" });
(() => {
  let links = [...document.querySelectorAll('[data-app-entry], a[href="/app"], a[href="/app/"]')];
  if (PI_APP_ENTRY.mode === "coming-soon") {
    const dialog = document.createElement("dialog");
    dialog.className = "pi-app-notice";
    dialog.id = "pi-app-notice";
    dialog.setAttribute("aria-labelledby", "pi-app-notice-message");
    dialog.innerHTML = '<p id="pi-app-notice-message"></p><button type="button" class="pi-app-notice-close" autofocus></button>';
    document.body.append(dialog);
    const message = dialog.querySelector("p");
    const close = dialog.querySelector("button");
    let trigger;
    const translate = () => {
      const en = document.documentElement.lang === "en";
      const dictionary = window.piTranslations || {};
      const phrase = "À venir au printemps 2027";
      message.textContent = en ? dictionary[phrase] || "Coming spring 2027" : phrase;
      close.textContent = en ? dictionary["Fermer"] || "Close" : "Fermer";
    };
    translate();
    document.addEventListener("pi:language", translate);
    close.addEventListener("click", () => dialog.close());
    dialog.addEventListener("keydown", event => {
      if (event.key === "Escape") event.stopPropagation();
    });
    dialog.addEventListener("click", event => {
      const r = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close();
    });
    dialog.addEventListener("close", () => trigger?.focus());
    links.forEach(entry => {
      let button = entry;
      if (entry.tagName !== "BUTTON") {
        button = document.createElement("button");
        button.className = entry.className;
        button.textContent = entry.textContent;
        button.setAttribute("aria-label", entry.getAttribute("aria-label") || "App PürInstinct Games");
        entry.replaceWith(button);
      }
      button.type = "button";
      button.setAttribute("data-app-entry", "");
      button.setAttribute("aria-haspopup", "dialog");
      button.setAttribute("aria-controls", dialog.id);
      button.addEventListener("click", () => { trigger = button; translate(); dialog.showModal(); });
    });
    return; // No prefetch, storage marker or navigation in coming-soon mode.
  }
  links = links.map(entry => {
    if (entry.tagName === "A") return entry;
    const link = document.createElement("a");
    link.href = PI_APP_ENTRY.destination;
    link.className = entry.className;
    link.textContent = entry.textContent;
    link.setAttribute("aria-label", entry.getAttribute("aria-label") || "App PürInstinct Games");
    entry.replaceWith(link);
    return link;
  });
  if (!links.length) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let warmed = false;
  let departing = false;
  let resetTimer;
  const prefetch = () => {
    if (
      warmed ||
      navigator.connection?.saveData ||
      /(^|-)2g$/.test(navigator.connection?.effectiveType || "")
    )
      return;
    warmed = true;
    // One document and the first visible photo, only on intent.
    for (const [href, as] of [
      ["/app/", "document"],
      ["/app/images/competitions/ecole-verticale.png", "image"],
    ]) {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = href;
      link.as = as;
      document.head.append(link);
    }
  };
  const reset = () => {
    clearTimeout(resetTimer);
    departing = false;
    document.body.classList.remove("pi-portal-departure");
    document.getElementById("pi-app-portal")?.remove();
    links.forEach((link) => link.classList.remove("pi-app-pressed"));
  };
  for (const link of links) {
    link.addEventListener("pointerenter", prefetch, { once: true });
    link.addEventListener("focus", prefetch, { once: true });
    link.addEventListener("pointerdown", () => {
      prefetch();
      link.classList.add("pi-app-pressed");
    });
    link.addEventListener("pointercancel", () =>
      link.classList.remove("pi-app-pressed"),
    );
    link.addEventListener("pointerleave", () => {
      if (!departing) link.classList.remove("pi-app-pressed");
    });
    link.addEventListener("click", (event) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.target === "_blank" ||
        link.hasAttribute("download")
      )
        return;
      if (departing) return;
      prefetch();
      try {
        sessionStorage.setItem("pi-app-entry", String(Date.now()));
      } catch {
        /* Optional choreography marker. */
      }
      if (reduced.matches) return;
      // Leave navigation to the anchor so Back keeps the source document.
      departing = true;
      resetTimer = setTimeout(reset, 1100);
      try {
        const rect = link.getBoundingClientRect();
        const portal = document.createElement("div");
        portal.id = "pi-app-portal";
        portal.setAttribute("aria-hidden", "true");
        portal.style.setProperty(
          "--portal-x",
          `${rect.left + rect.width / 2}px`,
        );
        portal.style.setProperty(
          "--portal-y",
          `${rect.top + rect.height / 2}px`,
        );
        portal.innerHTML =
          '<div class="pi-portal-opening"></div><div class="pi-portal-court"></div>';
        document.body.append(portal);
        document.body.classList.add("pi-portal-departure");
        link.classList.add("pi-app-pressed");
      } catch {
        /* Native anchor navigation still proceeds. */
      }
    });
  }
  window.addEventListener("pageshow", reset);
})();
