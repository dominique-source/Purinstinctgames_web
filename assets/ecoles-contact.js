const form = document.getElementById("schools-contact-form");
const status = document.getElementById("schools-contact-status");
const submit = form.querySelector("button");

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (submit.disabled) return;
  submit.disabled = true;
  status.textContent = "Envoi en cours…";

  try {
    const response = await fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    if (!response.ok || !(await response.json()).ok) throw new Error();
    form.reset();
    status.textContent = "Merci ! Ton message a été envoyé à Dominique.";
  } catch {
    status.textContent = "L’envoi a échoué. Tes réponses sont encore ici. Tu peux réessayer.";
  } finally {
    submit.disabled = false;
  }
});
