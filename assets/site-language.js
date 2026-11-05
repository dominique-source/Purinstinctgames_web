const parameter = new URL(location.href).searchParams.get("lang");
function storedLanguage() {
  try { return localStorage.getItem("pi_lang"); } catch { return null; }
}
let language = ["fr", "en"].includes(parameter) ? parameter : storedLanguage() === "en" ? "en" : "fr";

const entries = new Map(Object.entries(window.piTranslations || {}));
const translated = [];
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
  acceptNode(node) {
    return node.parentElement.closest("script,style,[data-i18n]") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
  },
});
while (walker.nextNode()) {
  const node = walker.currentNode;
  const original = node.data;
  const phrase = original.trim();
  if (entries.has(phrase)) {
    translated.push(lang => {
      node.data = lang === "en" ? original.replace(phrase, entries.get(phrase)) : original;
    });
  }
}
for (const element of document.querySelectorAll("[aria-label], [alt]")) {
  for (const attribute of ["aria-label", "alt"]) {
    const original = element.getAttribute(attribute);
    if (entries.has(original)) translated.push(lang => element.setAttribute(attribute, lang === "en" ? entries.get(original) : original));
  }
}
const title = document.title;
const metadata = [...document.querySelectorAll('meta[name="description"], meta[property="og:title"], meta[property="og:description"]')]
  .map(element => [element, element.content]);
const switcher = document.querySelector(".site-language");
const pages = new Set(["/", "/index.html", "/zones.html", "/pour-les-ecoles.html", "/concept.html", "/pur-id.html"]);
const internalLinks = [...document.querySelectorAll('a[href]')].filter(link => link.getAttribute("href").split(/[?#]/)[0] && new URL(link.href).origin === location.origin && pages.has(new URL(link.href).pathname));

function applyLanguage(updateUrl) {
  try { localStorage.setItem("pi_lang", language); } catch { /* Storage can be unavailable. */ }
  document.documentElement.lang = language;
  if (updateUrl) {
    const url = new URL(location.href);
    if (language === "en") url.searchParams.set("lang", "en");
    else url.searchParams.delete("lang");
    history.replaceState(history.state, "", url);
  }
  for (const translate of translated) translate(language);
  if (entries.has(title)) document.title = language === "en" ? entries.get(title) : title;
  for (const [element, original] of metadata) element.content = language === "en" ? entries.get(original) ?? original : original;
  switcher.setAttribute("aria-label", language === "en" ? "Site language" : "Langue du site");
  for (const button of switcher.querySelectorAll("button")) button.setAttribute("aria-pressed", String(button.lang === language));
  for (const link of internalLinks) {
    const url = new URL(link.href);
    if (language === "en") url.searchParams.set("lang", "en");
    else url.searchParams.delete("lang");
    link.href = url.pathname + url.search + url.hash;
  }
  document.dispatchEvent(new CustomEvent("pi:language", { detail: language }));
}

for (const button of switcher.querySelectorAll("button")) {
  button.addEventListener("click", () => {
    language = button.lang;
    applyLanguage(true);
  });
}
applyLanguage(language === "en" || parameter === "fr");
