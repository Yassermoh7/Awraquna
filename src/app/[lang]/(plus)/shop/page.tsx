import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FilterButton, FilterDrawer } from '@/components/plus/FilterDrawer';
import ProductCard from '@/components/plus/ProductCard';
import ShopFilters, { shopHref, type ShopQuery } from '@/components/plus/ShopFilters';
import { sortProducts, toLocale } from '@/components/plus/helpers';
import { Close, Search, WhatsApp } from '@/components/plus/icons';
import shop from '@/components/plus/shop.module.css';
import ui from '@/components/plus/ui.module.css';
import { getPlusCopy, plusConfig } from '@/content/plus';
import { commerce } from '@/lib/commerce';
import { alternates, localePath } from '@/lib/i18n';
import { site, whatsappLink } from '@/lib/site';

export async function generateMetadata({ params, searchParams }: PageProps<'/[lang]/shop'>): Promise<Metadata> {
  const lang = toLocale((await params).lang);
  const sp = await searchParams;
  const t = getPlusCopy(lang).meta;
  const filtered = Object.keys(sp).length > 0;
  return {
    title: t.shopTitle,
    description: t.shopDescription,
    alternates: alternates('/shop', lang),
    // Filtered and search result pages shouldn't compete with category pages in search.
    robots: filtered ? { index: false, follow: true } : undefined,
  };
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v ?? '').trim().slice(0, 80);

export default async function ShopPage({ params, searchParams }: PageProps<'/[lang]/shop'>) {
  const lang = toLocale((await params).lang);
  const sp = await searchParams;
  const t = getPlusCopy(lang);
  const query: ShopQuery = { q: one(sp.q), category: one(sp.category), industry: one(sp.industry), width: one(sp.width) };

  const [categories, industries, results, forCategory, forIndustry, forWidth] = await Promise.all([
    commerce.listCategories(),
    commerce.listIndustries(),
    commerce.listProducts(query),
    commerce.listProducts({ ...query, category: '' }),
    commerce.listProducts({ ...query, industry: '' }),
    commerce.listProducts({ ...query, width: '' }),
  ]);
  const products = sortProducts(results, categories);
  const name = (c: { name: string; nameAr: string }) => (lang === 'ar' ? c.nameAr : c.name);
  const top = categories.filter((c) => !c.parent);
  const all = forCategory.length ? forCategory : results;
  const thumbFor = (slug: string) =>
    plusConfig.categoryImages[slug] ?? all.find((p) => p.category === slug && p.images[0])?.images[0] ?? '/images/plus/cat-paper.jpg';

  const active = [
    query.q && { key: 'q', label: `“${query.q}”` },
    query.category && { key: 'category', label: name(categories.find((c) => c.slug === query.category) ?? { name: query.category, nameAr: query.category }) },
    query.industry && { key: 'industry', label: name(industries.find((c) => c.slug === query.industry) ?? { name: query.industry, nameAr: query.industry }) },
    query.width && { key: 'width', label: t.shop.widthValue(query.width) },
  ].filter((x): x is { key: keyof ShopQuery; label: string } => !!x);

  return (
    <>
      <div className={shop.shopHead}>
        <div className={ui.container}>
          <nav className={ui.breadcrumbs} aria-label={t.common.breadcrumb}>
            <ol>
              <li><Link href={localePath(lang, '/plus')}>{t.common.home}</Link></li>
              <li aria-current="page">{t.shop.title}</li>
            </ol>
          </nav>
          <h1>{t.shop.title}</h1>
          <p>{t.shop.intro}</p>
          <nav className={shop.quick} aria-label={t.shop.browseCategories}>
            {top.map((c) => (
              <Link key={c.slug} className={shop.quickLink} href={shopHref(lang, query, { category: query.category === c.slug ? '' : c.slug })} aria-current={query.category === c.slug ? 'true' : undefined}>
                <span className={shop.quickThumb}>
                  <Image src={thumbFor(c.slug)} alt="" fill sizes="40px" />
                </span>
                {name(c)}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className={`${ui.container} ${shop.shopLayout}`}>
        <FilterDrawer title={t.shop.filters} closeLabel={t.shop.closeFilters} showLabel={t.shop.showResults(products.length)}>
          <ShopFilters lang={lang} query={query} categories={categories} industries={industries} forCategory={forCategory} forIndustry={forIndustry} forWidth={forWidth} />
        </FilterDrawer>

        <div>
          <div className={shop.toolbar}>
            <form className={shop.searchForm} role="search" action={localePath(lang, '/shop')}>
              <label className="sr-only" htmlFor="shop-q">{t.shop.searchLabel}</label>
              <Search className={shop.searchIcon} />
              <input id="shop-q" className={ui.input} type="search" name="q" defaultValue={query.q} placeholder={t.shop.searchPlaceholder} />
              {query.category && <input type="hidden" name="category" value={query.category} />}
              {query.industry && <input type="hidden" name="industry" value={query.industry} />}
              {query.width && <input type="hidden" name="width" value={query.width} />}
              <button className={`${ui.btn} ${ui.dark} ${ui.sm}`} type="submit">{t.shop.searchSubmit}</button>
            </form>
            <div className={shop.toolbarEnd}>
              <p className={shop.count} aria-live="polite">
                {t.shop.results(products.length)} {query.q && <span>{t.shop.resultsFor(query.q)}</span>}
              </p>
              <FilterButton label={t.shop.filtersButton} active={active.filter((f) => f.key !== 'q').length} />
            </div>
          </div>

          {active.length > 0 && (
            <div className={shop.active}>
              {active.map((f) => (
                <Link key={f.key} className={ui.chip} href={shopHref(lang, query, { [f.key]: '' })} aria-label={t.shop.removeFilter(f.label)}>
                  {f.label} <Close />
                </Link>
              ))}
              <Link className={shop.clearLink} href={localePath(lang, '/shop')}>{t.shop.clear}</Link>
            </div>
          )}

          {products.length > 0 ? (
            <div className={shop.grid3}>
              {products.map((p, i) => <ProductCard key={p.id} product={p} categories={categories} lang={lang} headingLevel="h2" reveal={i % 3} />)}
            </div>
          ) : (
            <div className={shop.empty}>
              <h2>{t.shop.emptyTitle}</h2>
              <p>{t.shop.emptyText}</p>
              <div className={shop.emptyActions}>
                <Link className={`${ui.btn} ${ui.ghost} ${ui.sm}`} href={localePath(lang, '/shop')}>{t.shop.clear}</Link>
                <a className={`${ui.btn} ${ui.wa} ${ui.sm}`} href={whatsappLink(site.plus.whatsapp, `${t.common.whatsappGreeting} ${query.q}`)} target="_blank" rel="noopener">
                  <WhatsApp /> {t.shop.emptyWhatsapp}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
