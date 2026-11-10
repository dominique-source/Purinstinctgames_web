const limits = { Nom: 100, École: 150, Ville: 100, Courriel: 254, Commentaires: 14000 };
const recipient = 'dominique@purinstinct.com';

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return new Response(null, { status: 405, headers: { Allow: 'POST' } });
    }

    let fields;
    try {
      const raw = await request.text();
      if (raw.length > 48000) return Response.json({ ok: false }, { status: 413 });
      const body = JSON.parse(raw);
      fields = Object.entries(limits).map(([label, max]) => {
        const value = body[label]?.trim() ?? '';
        if (value.length > max || (!value && label !== 'Commentaires')) throw new Error();
        return [label, value];
      });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields[3][1])) throw new Error();
    } catch {
      return Response.json({ ok: false }, { status: 400 });
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'PürInstinct Games <' + process.env.EMAIL_FROM + '>',
          to: recipient,
          reply_to: fields[3][1],
          subject: 'PürInstinct Games à mon école',
          text: fields.map(([label, value]) => label + ' : ' + value).join('\n'),
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (response.ok) return Response.json({ ok: true });
    } catch {
      // Keep the form data on the page so the visitor can retry.
    }
    return Response.json({ ok: false }, { status: 502 });
  },
};
