import { JWT } from 'google-auth-library';
import { signToken } from '../lib/token.js';

const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SHEET_RANGE = 'A2:D';

function isAllowed(actifRaw, expirationRaw) {
  const isActive = ['oui', 'yes', 'true', '1'].includes(String(actifRaw).trim().toLowerCase());
  if (!isActive) return false;

  if (!expirationRaw) return true; // No expiration date set = never expires.

  const expiration = new Date(expirationRaw);
  if (isNaN(expiration.getTime())) return true; // Unparseable = ignore expiration.

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiration.setHours(0, 0, 0, 0);
  return expiration >= today;
}

async function getAccessToken() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  const client = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    subject: process.env.GOOGLE_IMPERSONATE_EMAIL,
  });
  const { token } = await client.getAccessToken();
  return token;
}

async function sendEmail({ to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `PürInstinct Games <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
  }
}

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    let email;
    try {
      const body = await request.json();
      email = String(body.email || '').trim().toLowerCase();
    } catch {
      return Response.json({ ok: false, error: 'invalid_request' }, { status: 400 });
    }

    if (!EMAIL_RE.test(email)) {
      return Response.json({ ok: false, error: 'invalid_email' }, { status: 400 });
    }

    try {
      const accessToken = await getAccessToken();
      const sheetId = process.env.ALLOWLIST_SHEET_ID;

      const sheetRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${SHEET_RANGE}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (!sheetRes.ok) {
        console.error('Sheets API error', sheetRes.status, await sheetRes.text());
      } else {
        const { values = [] } = await sheetRes.json();
        const match = values.find((row) => String(row[1] || '').trim().toLowerCase() === email);

        if (match && isAllowed(match[2], match[3])) {
          const token = await signToken(
            { email, purpose: 'magic', exp: Date.now() + MAGIC_LINK_TTL_MS },
            process.env.AUTH_SECRET,
          );
          const origin = `https://${request.headers.get('host')}`;
          const link = `${origin}/api/verify?token=${encodeURIComponent(token)}`;

          await sendEmail({
            to: email,
            subject: 'Votre lien d’accès — PurInstinct Games',
            html: `
              <div style="font-family:sans-serif;background:#0A0A0A;color:#fff;padding:32px">
                <h1 style="color:#CCFF00;font-size:20px;margin:0 0 16px">PürInstinct Games</h1>
                <p>Voici votre lien d'acc&egrave;s au site, valide 15 minutes :</p>
                <p><a href="${link}" style="color:#CCFF00">${link}</a></p>
                <p style="color:#888;font-size:13px">Si vous n'avez rien demand&eacute;, ignorez simplement cet email.</p>
              </div>
            `,
          });
        } else {
          await sendEmail({
            to: email,
            subject: 'Tentative de connexion — PurInstinct Games',
            html: `
              <div style="font-family:sans-serif;background:#0A0A0A;color:#fff;padding:32px">
                <h1 style="color:#CCFF00;font-size:20px;margin:0 0 16px">PürInstinct Games</h1>
                <p>Vous avez tent&eacute; de vous connecter au site PurInstinct Games avec cette adresse, mais elle n'a pas encore acc&egrave;s.</p>
                <p style="color:#888;font-size:13px">Si vous pensez que c'est une erreur, ou si vous souhaitez obtenir un acc&egrave;s, contactez l'administrateur pour recevoir votre autorisation.</p>
              </div>
            `,
          });
        }
      }
    } catch (err) {
      console.error('Failed to send access email', err);
    }

    return Response.json({ ok: true });
  },
};
