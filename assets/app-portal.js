/* Progressive entry: real href, no network gate, standard modified clicks. */
(() => {
  const links = [
    ...document.querySelectorAll('a[href="/app"], a[href="/app/"]'),
  ];
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
