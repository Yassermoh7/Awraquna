import type { Category, Industry, Product } from '@/lib/commerce/types';
import { isLocale, localePath, type Locale } from '@/lib/i18n';
import type { PlusCopy } from '@/content/plus';
import type { OrderUnit } from './order-list';

export const toLocale = (raw: string): Locale => (isLocale(raw) ? raw : 'en');

export const spec = (p: Product, key: string) => p.specs.find((s) => s.key === key)?.value;

/** Cartons when the product has a carton quantity, otherwise single units. */
export const defaultUnit = (p: Pick<Product, 'specs'>): OrderUnit =>
  p.specs.some((s) => s.key === 'perCarton') ? 'carton' : 'unit';

/** Display name; sizes like "80 × 60 mm" are kept on one line with no-break spaces. */
export const productName = (p: Product, lang: Locale) =>
  (lang === 'ar' && p.nameAr ? p.nameAr : p.name).replace(/(\d+(?:\s?(?:mm|m|مم|م))?) × (\d+) ?(mm|m|مم|م)?/g, (m) => m.replace(/ /g, '\u00a0'));

/** Arabic copy for spec values: units like "mm" → "مم", "rolls" → "رول". */
export function localiseValue(value: string, lang: Locale) {
  if (lang !== 'ar') return value;
  return value
    .replace(/\bmm\b/gi, 'مم')
    .replace(/(\d)\s*m\b/g, '$1 م')
    .replace(/\brolls?\b/gi, 'رول')
    .replace(/\bboxes?\b/gi, 'علبة')
    .replace(/\bpcs\b/gi, 'قطعة')
    .replace(/\bGSM\b/g, 'غم/م²');
}

/** Short pack description for cards: "50 rolls per carton" or "1,000 per roll". */
export function packLabel(p: Product, t: PlusCopy, lang: Locale): string | null {
  const carton = spec(p, 'perCarton');
  if (carton) return t.common.perCarton(localiseValue(carton.toLowerCase(), lang));
  const roll = spec(p, 'perRoll');
  if (roll) return t.common.perRoll(Number(roll).toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US'));
  return null;
}

export const categoryLabel = (slug: string | null, categories: (Category | Industry)[], lang: Locale) => {
  const c = categories.find((x) => x.slug === slug);
  return c ? (lang === 'ar' ? c.nameAr : c.name) : '';
};

export const productHref = (lang: Locale, p: Pick<Product, 'slug'>) => localePath(lang, `/shop/${p.slug}`);
/** Categories are filters on the full product list, not separate pages. */
export const categoryHref = (lang: Locale, slug: string) => localePath(lang, `/shop?category=${encodeURIComponent(slug)}`);
/** Industries open the full product list with the industry filter applied. */
export const industryHref = (lang: Locale, slug: string) => `${localePath(lang, '/shop')}?industry=${encodeURIComponent(slug)}`;

/** Order products by catalogue category order, then naturally by name. */
export function sortProducts(products: Product[], categories: Category[]) {
  const order = new Map(categories.map((c, i) => [c.slug, i]));
  const idx = (s: string | null) => (s ? order.get(s) ?? 999 : 999);
  return [...products].sort(
    (a, b) =>
      idx(a.category) - idx(b.category) ||
      idx(a.subcategory) - idx(b.subcategory) ||
      a.name.localeCompare(b.name, 'en', { numeric: true }),
  );
}

/** First dimension of the size, e.g. "80 × 70 mm" → "80". */
export const widthOf = (p: Product) => spec(p, 'size')?.match(/^\s*(\d+)/)?.[1] ?? null;

/** Minimal product data the client components need (order list, cards). */
export type ProductLite = {
  id: number; slug: string; sku: string; name: string; image: string | null;
  unit: OrderUnit; pack: string | null; size: string | null;
};

export const toLite = (p: Product, t: PlusCopy, lang: Locale): ProductLite => ({
  id: p.id, slug: p.slug, sku: p.sku, name: productName(p, lang), image: p.images[0] ?? null,
  unit: defaultUnit(p), pack: packLabel(p, t, lang), size: spec(p, 'size') ? localiseValue(spec(p, 'size')!, lang) : null,
});
