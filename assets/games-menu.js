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
