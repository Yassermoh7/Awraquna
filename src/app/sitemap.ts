import type { MetadataRoute } from 'next';
import { commerce } from '@/lib/commerce';
import { articleSlugs, serviceSlugs } from '@/content/legal';
import { localePath } from '@/lib/i18n';
import { legalPath } from '@/lib/links';
import { site } from '@/lib/site';

/** Refresh catalogue data from Odoo every 5 minutes (new products appear without a rebuild). */
export const revalidate = 300;

/** Every public page in English and Arabic, with hreflang alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await commerce.listProducts();

  const abs = (href: string) => (href.startsWith('http') ? href : `${site.url}${href}`);
  const entry = (build: (lang: 'en' | 'ar') => string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: abs(build('en')),
    priority,
    alternates: { languages: { en: abs(build('en')), ar: abs(build('ar')) } },
  });
  const plain = (path: string, priority: number) => entry((l) => localePath(l, path), priority);

  return [
    plain('/', 1),
    plain('/plus', .9),
    plain('/shop', .9),
    ...products.map((p) => plain(`/shop/${p.slug}`, .8)),
    ...['/about-us', '/contactus', '/blog', '/jobs', '/privacy', '/terms'].map((p) => plain(p, .5)),
    entry((l) => legalPath(l), .9),
    ...['/services', '/about', '/resources', '/contact'].map((p) => entry((l) => legalPath(l, p), .7)),
    ...serviceSlugs.map((s) => entry((l) => legalPath(l, `/services/${s}`), .7)),
    ...articleSlugs.map((s) => entry((l) => legalPath(l, `/resources/${s}`), .5)),
  ];
}
