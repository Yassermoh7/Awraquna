import { localePath, type Locale } from './i18n';
import { site } from './site';

/** Plus (supplies) site paths: /plus is its homepage, the shop keeps Odoo's /shop URLs. */
export const plusPath = (lang: Locale, path: string = '/') => localePath(lang, path === '/' ? '/plus' : path);

/**
 * Legal site paths. With NEXT_PUBLIC_LEGAL_URL set (e.g. https://legal.awraquna.com)
 * links are absolute to that host; otherwise they live under /legal in this app.
 */
export function legalPath(lang: Locale, path: string = '/') {
  const clean = path === '/' ? '' : path;
  if (site.legal.baseUrl) return `${site.legal.baseUrl}${lang === 'ar' ? '/ar' : ''}${clean}` || '/';
  return localePath(lang, `/legal${clean}`);
}

export const gatewayPath = (lang: Locale) => localePath(lang, '/');
