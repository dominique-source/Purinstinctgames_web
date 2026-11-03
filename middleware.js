import { next } from '@vercel/functions';
import { verifyToken } from './lib/token.js';

export const config = {
  matcher: ['/((?!api|access\\.html|favicon\\.png|favicon\\.ico|assets/arena-hero\\.jpg).*)'],
};

const schoolPublicPaths = new Set([
  '/pour-les-ecoles.html',
  '/assets/ecoles.css',
  '/assets/games.css',
  '/assets/app-portal.css',
  '/assets/games-menu.js',
  '/assets/app-portal.js',
  '/assets/ecoles-contact.js',
  '/assets/homepage/ecole.png',
  '/assets/homepage/logo.png',
]);

function getCookie(request, name) {
  const header = request.headers.get('cookie') || '';
  const match = header.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default async function middleware(request) {
  if (schoolPublicPaths.has(new URL(request.url).pathname)) return next();

  const session = getCookie(request, 'pig_session');
  const payload = session ? await verifyToken(session, process.env.AUTH_SECRET) : null;

  if (payload && payload.purpose === 'session') {
    return next();
  }

  return Response.redirect(new URL('/access.html', request.url), 302);
}
