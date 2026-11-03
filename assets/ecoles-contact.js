document.getElementById("schools-contact-form").addEventListener("submit", event => {
  event.preventDefault();
  const fields = Array.from(new FormData(event.currentTarget));
  const message = fields.map(([label, value]) => label + " : " + value.trim()).join("\r\n");
  const subject = encodeURIComponent("PürInstinct Games à mon école");
  window.location.href = "mailto:dominique@purinstinct.com?subject=" + subject + "&body=" + encodeURIComponent(message);
});
