import { NextResponse, type NextRequest } from 'next/server';

/**
 * URL scheme (matches the old Odoo site so existing links and rankings survive):
 *   /shop/...        English  -> rewritten internally to /en/shop/...
 *   /ar/shop/...     Arabic   -> served as is
 *   /en/...          redirected to the unprefixed URL (one canonical URL per page)
 *
 * The legal site can run on its own host (e.g. legal.awraquna.com): requests
 * there are rewritten into the /legal section of this app.
 */
const LEGAL_HOST = process.env.LEGAL_HOST; // e.g. "legal.awraquna.com"

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;
  const host = request.headers.get('host')?.split(':')[0];
  const onLegalHost = !!LEGAL_HOST && host === LEGAL_HOST;

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    url.pathname = pathname.slice(3) || '/';
    return NextResponse.redirect(url, 308);
  }

  const isAr = pathname === '/ar' || pathname.startsWith('/ar/');
  const lang = isAr ? 'ar' : 'en';
  let rest = isAr ? pathname.slice(3) || '/' : pathname;

  if (onLegalHost) {
    // Links on the legal host never need the /legal prefix.
    if (rest === '/legal' || rest.startsWith('/legal/')) {
      url.pathname = (isAr ? '/ar' : '') + (rest.slice(6) || '/');
      return NextResponse.redirect(url, 308);
    }
    rest = rest === '/' ? '/legal' : `/legal${rest}`;
    url.pathname = `/${lang}${rest}`;
    return NextResponse.rewrite(url);
  }

  if (isAr) return NextResponse.next();
  url.pathname = `/en${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|brand/|images/|products/|previews/).*)'],
};
