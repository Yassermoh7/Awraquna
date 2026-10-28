import type { Product, ProductQuery } from './types';

const normalise = (s: string) =>
  s.toLowerCase().replace(/[×x*]/g, 'x').replace(/\s+/g, ' ').replace(/mm|مم/g, '').trim();

/** Shared search/filter logic so the sample and Odoo providers behave the same. */
export function filterProducts(products: Product[], query: ProductQuery = {}): Product[] {
  const q = query.q ? normalise(query.q) : '';
  const compactQ = q.replace(/\s/g, '');
  return products.filter((p) => {
    if (query.category && p.category !== query.category && p.subcategory !== query.category) return false;
    if (query.industry && !p.industries.includes(query.industry)) return false;
    const size = p.specs.find((s) => s.key === 'size')?.value ?? '';
    if (query.width && !size.trim().startsWith(query.width)) return false;
    if (!q) return true;
    const haystack = normalise([p.name, p.nameAr, p.sku, size, ...p.specs.map((s) => s.value)].join(' '));
    // "80x80", "80 x 80" and "80×80" all match "80 × 80 mm"
    return haystack.includes(q) || haystack.replace(/\s/g, '').includes(compactQ);
  });
}

export const specValue = (p: Product, key: string) => p.specs.find((s) => s.key === key)?.value;
