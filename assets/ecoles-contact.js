const form = document.getElementById("schools-contact-form");
const status = document.getElementById("schools-contact-status");
const submit = form.querySelector("button");

const messages = {
  sending: ["Envoi en cours…", "Sending…"],
  sent: ["Merci ! Ton message a été envoyé à Dominique.", "Thanks! Your message was sent to Dominique."],
  failed: ["L’envoi a échoué. Tes réponses sont encore ici. Tu peux réessayer.", "Your message could not be sent. Your answers are still here. You can try again."],
};
let statusKey;
function showStatus(key = statusKey) {
  if (!key) return;
  statusKey = key;
  status.textContent = messages[key][document.documentElement.lang === "en" ? 1 : 0];
}
document.addEventListener("pi:language", () => showStatus());

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (submit.disabled) return;
  submit.disabled = true;
  showStatus("sending");

  try {
    const response = await fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    if (!response.ok || !(await response.json()).ok) throw new Error();
    form.reset();
    showStatus("sent");
  } catch {
    showStatus("failed");
  } finally {
    submit.disabled = false;
  }
});
