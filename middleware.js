/**
 * Force www.xchat.directory → https://xchat.directory (301).
 *
 * vercel.json already declares the same host redirect. On Vercel, adding both
 * hostnames as Production domains can serve this deployment with HTTP 200 on
 * www before those redirects run — that is what the live site was doing.
 * Middleware runs on the original Host, so the redirect happens first.
 *
 * If a deploy still returns 200 on www, the domain is pinned in the dashboard
 * and this file is not on the request path. Fix it there:
 *   Project → Settings → Domains → www.xchat.directory → Redirect to → xchat.directory
 *
 * HTTP → HTTPS is Vercel's edge default once the domain certificate is valid.
 * A hang on port 80 is a DNS or proxy problem, not something this file can set.
 */

export const config = {
  matcher: '/:path*',
};

export default function middleware(request) {
  const forwarded = request.headers.get('x-forwarded-host');
  const hostHeader = (forwarded || request.headers.get('host') || '').split(',')[0].trim().toLowerCase();
  const hostname = hostHeader.replace(/:\d+$/, '');

  if (hostname !== 'www.xchat.directory') return;

  const url = new URL(request.url);
  url.protocol = 'https:';
  url.hostname = 'xchat.directory';
  url.port = '';
  return Response.redirect(url.toString(), 301);
}
