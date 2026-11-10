import { next } from '@vercel/functions';
import { verifyToken } from './lib/token.js';

export const config = {
  matcher: ['/((?!api|access\\.html|favicon\\.png|favicon\\.ico|assets/arena-hero\\.jpg).*)'],
};

const publicPaths = new Set([
  '/',
  '/index.html',
  '/assets/hero-deck/hero-desktop.webp',
  '/assets/hero-deck/hero-mobile.webp',
  '/assets/hero-deck/games-brush.png',
  '/assets/hero-deck/fonts/Barlow-Regular.ttf',
  '/assets/hero-deck/fonts/Barlow-Bold.ttf',
  '/assets/hero-deck/fonts/BarlowCondensed-BlackItalic.ttf',
  '/assets/hero-deck/icons/speed.svg',
  '/assets/hero-deck/icons/agility.svg',
  '/assets/hero-deck/icons/hand.svg',
  '/assets/hero-deck/icons/foot.svg',
  '/assets/hero-deck/icons/iq.svg',
  '/assets/hero-deck/icons/field.svg',
  '/assets/hero-deck/icons/chevron.svg',

  '/site.webmanifest',
  '/assets/site-translations.js',
  '/assets/site-language.js',
  '/assets/site-language.css',
  '/assets/school-home.css',
  '/assets/school-home.js',
  '/assets/school-home/arene-avec-reperes.webp',
  '/assets/school-home/action-ecole.webp',
  '/assets/school-home/conference.webp',
  '/assets/school-home/cliniques.webp',
  '/assets/school-home/formation.webp',
  '/assets/school-home/games.webp',
  '/assets/render-speed.jpg',
  '/assets/render-agility.jpg',
  '/assets/render-hand.jpg',
  '/assets/render-foot.jpg',
  '/assets/render-iq.jpg',
  '/assets/two-screens.css',
  '/assets/home-end-zone.js',
  '/assets/homepage/match.jpg',
  '/assets/homepage/arene.jpg',
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
  try { return match ? decodeURIComponent(match[1]) : null; } catch { return null; }
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const { pathname } = url;
  // A cross-origin proxy cannot reuse the visitor's Vercel login cookie.
  // Navigate to the protected origin instead; Vercel authenticates before
  // serving any APP route, asset or API. This is independent of the APP button.
  if (pathname === '/app' || pathname.startsWith('/app/')) {
    const destination = new URL('https://purinstinct-app.vercel.app');
    destination.pathname = pathname;
    destination.search = url.search;
    return new Response(null, { status: 307, headers: { Location: destination.href, 'Cache-Control': 'private, no-store' } });
  }
  // Only public portal pages and their static resources bypass the email gate.
  // Organizer, projection and operational routes keep the existing session check.
  if (publicPaths.has(pathname)) return next();

  const session = getCookie(request, 'pig_session');
  const payload = session ? await verifyToken(session, process.env.AUTH_SECRET) : null;

  if (payload && payload.purpose === 'session') {
    return next();
  }

  return Response.redirect(new URL('/access.html', request.url), 302);
}
