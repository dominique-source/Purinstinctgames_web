const form = document.getElementById("schools-contact-form");
const status = document.getElementById("schools-contact-status");
const submit = form.querySelector("button");

const contactCommercial = window.piSchoolCommercial;
const policy = contactCommercial.estimator;
let proposal = null;
try { proposal = policy.restore(JSON.parse(new URL(location.href).searchParams.get('configuration')))?.value; } catch { /* Invalid/shared links are ignored. */ }
function currentProposal() {
  return typeof window.piSchoolConfiguration === 'function' ? window.piSchoolConfiguration() : proposal;
}
function proposalSummary() {
  const current = currentProposal();
  return current ? policy.summary(current, document.documentElement.lang) : '';
}
function updateProposal() {
  for (const output of document.querySelectorAll("[data-commercial-discount]")) output.textContent = contactCommercial.discountText(document.documentElement.lang);
  const summary = proposalSummary();
  document.getElementById('school-proposal').hidden = !summary;
  document.getElementById('school-proposal-summary').textContent = summary;
  form.elements.namedItem('Commentaires').maxLength = 2000;
  for (const output of document.querySelectorAll('[data-commercial-rate]')) {
    const rate = contactCommercial.policy[output.dataset.commercialRate === 'regular' ? 'regularRate' : 'pilotRate'];
    output.textContent = contactCommercial.formatMoney(rate, document.documentElement.lang);
  }
}
document.addEventListener('pi:language', updateProposal);
document.addEventListener('pi:configuration', updateProposal);
updateProposal();

const messages = {
  configuration: ["Vérifiez les champs de l’estimateur avant d’envoyer votre demande.", "Check the estimator fields before sending your request."],
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
  if (typeof window.piSchoolConfiguration === "function" && !currentProposal()) { showStatus("configuration"); return; }
  submit.disabled = true;
  showStatus("sending");

  try {
    const fields = Object.fromEntries(new FormData(form));
    const summary = proposalSummary();
    if (summary) fields.Commentaires = [fields.Commentaires, summary].filter(Boolean).join('\n\n');
    if (fields.Commentaires.length > 14000) throw new Error('comments-too-long');
    const response = await fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
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
