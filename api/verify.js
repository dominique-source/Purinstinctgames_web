import { signToken, verifyToken } from '../lib/token.js';

const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    const payload = token ? await verifyToken(token, process.env.AUTH_SECRET) : null;

    if (!payload || payload.purpose !== 'magic') {
      return Response.redirect(new URL('/access.html?error=expired', request.url), 302);
    }

    const session = await signToken(
      { email: payload.email, purpose: 'session', exp: Date.now() + SESSION_TTL_MS },
      process.env.AUTH_SECRET,
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
        'Set-Cookie': `pig_session=${session}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.floor(
          SESSION_TTL_MS / 1000,
        )}`,
      },
    });
  },
};
