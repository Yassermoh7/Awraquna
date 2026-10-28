import Link from 'next/link';
import type { Category, Industry, Product, ProductQuery } from '@/lib/commerce/types';
import { localePath, type Locale } from '@/lib/i18n';
import { getPlusCopy } from '@/content/plus';
import { widthOf } from './helpers';
import { Chevron } from './icons';
import styles from './shop.module.css';

export type ShopQuery = Required<Pick<ProductQuery, 'q' | 'category' | 'industry' | 'width'>>;

/** /shop URL with some filters changed; empty values are dropped. */
export function shopHref(lang: Locale, current: ShopQuery, patch: Partial<ShopQuery>) {
  const next = { ...current, ...patch };
  const qs = new URLSearchParams();
  (['q', 'category', 'industry', 'width'] as const).forEach((k) => { if (next[k]) qs.set(k, next[k]); });
  const s = qs.toString();
  return localePath(lang, '/shop') + (s ? `?${s}` : '');
}

type Props = {
  lang: Locale;
  query: ShopQuery;
  categories: Category[];
  industries: Industry[];
  /** Products matching every filter except the group's own, for counts. */
  forCategory: Product[];
  forIndustry: Product[];
  forWidth: Product[];
};

/**
 * Filters are plain links, so they work without JavaScript, can be shared and
 * are crawlable. Product type and industry are separate groups.
 */
export default function ShopFilters({ lang, query, categories, industries, forCategory, forIndustry, forWidth }: Props) {
  const t = getPlusCopy(lang).shop;
  const name = (c: { name: string; nameAr: string }) => (lang === 'ar' ? c.nameAr : c.name);
  const top = categories.filter((c) => !c.parent);
  const catCount = (slug: string) => forCategory.filter((p) => p.category === slug || p.subcategory === slug).length;
  const indCount = (slug: string) => forIndustry.filter((p) => p.industries.includes(slug)).length;
  const widths = [...new Set(forWidth.map(widthOf).filter((w): w is string => !!w))].sort((a, b) => Number(a) - Number(b));
  if (query.width && !widths.includes(query.width)) widths.push(query.width);

  return (
    <aside className={styles.filters} aria-label={t.filters}>
      <details open>
        <summary>{t.productType} <Chevron /></summary>
        <ul className={styles.filterList}>
          <li>
            <Link className={styles.filterLink} href={shopHref(lang, query, { category: '' })} aria-current={!query.category ? 'true' : undefined}>
              {t.allTypes}
            </Link>
          </li>
          {top.map((c) => {
            const subs = categories.filter((s) => s.parent === c.slug);
            const openSubs = subs.length > 0 && (query.category === c.slug || subs.some((s) => s.slug === query.category));
            return (
              <li key={c.slug}>
                <Link className={styles.filterLink} href={shopHref(lang, query, { category: c.slug })} aria-current={query.category === c.slug ? 'true' : undefined}>
                  {name(c)} <span>{catCount(c.slug)}</span>
                </Link>
                {openSubs && (
                  <ul>
                    {subs.map((s) => (
                      <li key={s.slug}>
                        <Link className={styles.filterLink} href={shopHref(lang, query, { category: s.slug })} aria-current={query.category === s.slug ? 'true' : undefined}>
                          {name(s)} <span>{catCount(s.slug)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </details>

      <details open>
        <summary>{t.industry} <Chevron /></summary>
        <ul className={styles.filterList}>
          <li>
            <Link className={styles.filterLink} href={shopHref(lang, query, { industry: '' })} aria-current={!query.industry ? 'true' : undefined}>
              {t.allIndustries}
            </Link>
          </li>
          {industries.map((c) => (
            <li key={c.slug}>
              <Link className={styles.filterLink} href={shopHref(lang, query, { industry: c.slug })} aria-current={query.industry === c.slug ? 'true' : undefined}>
                {name(c)} <span>{indCount(c.slug)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </details>

      {widths.length > 0 && (
        <details open>
          <summary>{t.width} <Chevron /></summary>
          <div className={styles.widthGrid}>
            <Link href={shopHref(lang, query, { width: '' })} aria-current={!query.width ? 'true' : undefined}>{t.anyWidth}</Link>
            {widths.map((w) => (
              <Link key={w} href={shopHref(lang, query, { width: query.width === w ? '' : w })} aria-current={query.width === w ? 'true' : undefined}>
                {t.widthValue(w)}
              </Link>
            ))}
          </div>
        </details>
      )}
    </aside>
  );
}
