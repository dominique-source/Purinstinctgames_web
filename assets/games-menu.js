const menuButton = document.getElementById("burger");
const navigation = document.getElementById("navLinks");

function setMenu(open) {
  menuButton.setAttribute("aria-expanded", String(open));
  navigation.classList.toggle("open", open);
}

menuButton.addEventListener("click", () => setMenu(!navigation.classList.contains("open")));
navigation.addEventListener("click", event => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && navigation.classList.contains("open")) {
    setMenu(false);
    menuButton.focus();
  }
});

// Add the educational Games library to every existing site menu without
// replacing page-specific navigation or rebuilding the existing pages.
if (navigation && !navigation.querySelector('a[data-games-library-link]')) {
  const gamesLink = document.createElement("a");
  gamesLink.href = "/jeux";
  gamesLink.textContent = "Jeux";
  gamesLink.dataset.gamesLibraryLink = "";
  const appButton = navigation.querySelector('[data-app-entry]');
  if (appButton) appButton.after(gamesLink);
  else navigation.append(gamesLink);
  const updateGamesLanguage = () => {
    let en = document.documentElement.lang === "en";
    gamesLink.textContent = en ? "Games" : "Jeux";
    gamesLink.href = en ? "/jeux?lang=en" : "/jeux";
  };
  document.addEventListener("pi:language", updateGamesLanguage);
  updateGamesLanguage();
}
