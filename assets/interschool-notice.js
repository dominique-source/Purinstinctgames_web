
// Independent notice: APP configuration and its 2027 date remain unchanged.
(() => {
  const entries = [...document.querySelectorAll('[data-interschool-entry]')];
  if (!entries.length) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'pi-app-notice';
  dialog.id = 'pi-interschool-notice';
  dialog.setAttribute('aria-labelledby', 'pi-interschool-message');
  dialog.innerHTML = '<p id="pi-interschool-message"></p><button type="button" class="pi-app-notice-close" autofocus></button>';
  document.body.append(dialog);
  let trigger;
  const translate = () => {
    const en = document.documentElement.lang === 'en';
    const dictionary = window.piTranslations || {};
    const phrase = 'À venir au printemps 2028';
    dialog.querySelector('p').textContent = en ? dictionary[phrase] || 'Coming spring 2028' : phrase;
    dialog.querySelector('button').textContent = en ? dictionary['Fermer'] || 'Close' : 'Fermer';
  };
  document.addEventListener('pi:language', translate);
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') event.stopPropagation();
    // Keep keyboard focus on the sole dialog control.
    if (event.key === 'Tab') { event.preventDefault(); dialog.querySelector('button').focus(); }
  });
  dialog.addEventListener('click', event => {
    const r = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => trigger?.focus({preventScroll:true}));
  entries.forEach(button => {
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', dialog.id);
    button.addEventListener('click', () => { trigger = button; translate(); dialog.showModal(); });
  });
})();
