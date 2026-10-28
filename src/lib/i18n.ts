export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const dirFor = (lang: Locale) => (lang === 'ar' ? 'rtl' : 'ltr');

/**
 * Public URLs mirror the old Odoo site: English is unprefixed (/shop/...),
 * Arabic lives under /ar (/ar/shop/...). The proxy rewrites unprefixed
 * paths to /en internally.
 */
export function localePath(lang: Locale, path: string = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLocale) return clean;
  return clean === '/' ? '/ar' : `/ar${clean}`;
}

/** The same page in the other language, for the language switcher and hreflang. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const bare = pathname.replace(/^\/(en|ar)(?=\/|$)/, '') || '/';
  return localePath(to, bare);
}

/** hreflang alternates for generateMetadata. */
export function alternates(path: string, lang: Locale) {
  return {
    canonical: localePath(lang, path),
    languages: { en: localePath('en', path), ar: localePath('ar', path), 'x-default': localePath('en', path) },
  };
}

/** Pick the right field from a bilingual record. */
export const pick = <T,>(lang: Locale, en: T, ar: T | undefined | null): T => (lang === 'ar' && ar ? ar : en);
