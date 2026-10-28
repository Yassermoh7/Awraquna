import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/plus/ProductCard';
import ProductGallery from '@/components/plus/ProductGallery';
import ProductPurchase from '@/components/plus/ProductPurchase';
import { categoryHref, categoryLabel, defaultUnit, localiseValue, productName, sortProducts, spec, toLocale } from '@/components/plus/helpers';
import { WhatsApp } from '@/components/plus/icons';
import shop from '@/components/plus/shop.module.css';
import ui from '@/components/plus/ui.module.css';
import { getPlusCopy } from '@/content/plus';
import { commerce } from '@/lib/commerce';
import { alternates, localePath } from '@/lib/i18n';
import { site, whatsappLink } from '@/lib/site';

/** Refresh catalogue data from Odoo every 5 minutes (new products appear without a rebuild). */
export const revalidate = 300;

export async function generateStaticParams() {
  return (await commerce.listProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/shop/[slug]'>): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = toLocale(raw);
  const p = await commerce.getProduct(slug);
  if (!p) return {};
  const t = getPlusCopy(lang);
  const name = productName(p, lang);
  const facts = p.specs.slice(0, 4).map((s) => `${lang === 'ar' ? s.labelAr : s.label}: ${localiseValue(s.value, lang)}`).join(' · ');
  const description = `${name} (${p.sku}). ${facts}. ${t.product.priceNote}`;
  return {
    title: name,
    description,
    alternates: alternates(`/shop/${slug}`, lang),
    openGraph: { title: name, description, images: p.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: PageProps<'/[lang]/shop/[slug]'>) {
  const { lang: raw, slug } = await params;
  const lang = toLocale(raw);
  const t = getPlusCopy(lang);
  const [p, categories] = await Promise.all([commerce.getProduct(slug), commerce.listCategories()]);
  if (!p) notFound();

  const name = productName(p, lang);
  const top = categories.find((c) => c.slug === p.category);
  const sub = categories.find((c) => c.slug === p.subcategory);
  const related = sortProducts(
    (await commerce.listProducts({ category: p.subcategory ?? p.category ?? undefined })).filter((x) => x.id !== p.id),
    categories,
  ).slice(0, 4);
  const carton = spec(p, 'perCarton');
  const highlights = (['size', 'core', 'perRoll', 'perCarton'] as const)
    .map((key) => p.specs.find((s) => s.key === key))
    .filter((s) => !!s)
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    sku: p.sku,
    image: p.images.map((src) => (src.startsWith('http') ? src : `${site.url}${src}`)),
    brand: { '@type': 'Brand', name: 'Awraquna' },
    category: categoryLabel(p.subcategory ?? p.category, categories, 'en'),
    url: `${site.url}${localePath(lang, `/shop/${p.slug}`)}`,
    additionalProperty: p.specs.map((s) => ({ '@type': 'PropertyValue', name: s.label, value: s.value })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className={ui.container}>
        <nav className={ui.breadcrumbs} aria-label={t.common.breadcrumb} style={{ paddingTop: 24 }}>
          <ol>
            <li><Link href={localePath(lang, '/plus')}>{t.common.home}</Link></li>
            <li><Link href={localePath(lang, '/shop')}>{t.common.shop}</Link></li>
            {top && <li><Link href={categoryHref(lang, top.slug)}>{lang === 'ar' ? top.nameAr : top.name}</Link></li>}
            {sub && <li><Link href={categoryHref(lang, sub.slug)}>{lang === 'ar' ? sub.nameAr : sub.name}</Link></li>}
            <li aria-current="page">{name}</li>
          </ol>
        </nav>

        <div className={shop.productTop}>
          <ProductGallery images={p.images} alt={name} label={t.product.gallery} thumbLabel={p.images.map((_, i) => t.product.showImage(i + 1))} />

          <div className={shop.productInfo}>
            {(sub ?? top) && (
              <Link className={shop.typeTag} href={categoryHref(lang, (sub ?? top)!.slug)}>{categoryLabel(p.subcategory ?? p.category, categories, lang)}</Link>
            )}
            <h1>{name}</h1>
            <p className={shop.sku}>{t.product.code}: <b dir="ltr">{p.sku}</b></p>

            {highlights.length > 0 && (
              <div className={shop.highlights}>
                {highlights.map((s) => (
                  <div key={s.key}><small>{lang === 'ar' ? s.labelAr : s.label}</small><b>{localiseValue(s.value, lang)}</b></div>
                ))}
              </div>
            )}

            <ProductPurchase
              lang={lang}
              id={p.id}
              sku={p.sku}
              name={name}
              defaultUnit={defaultUnit(p)}
              cartonInfo={carton ? localiseValue(carton.toLowerCase(), lang) : null}
            />

            <p className={shop.help}>
              <WhatsApp />
              <span>
                {t.product.help}{' '}
                <a href={whatsappLink(site.plus.whatsapp, `${p.sku} — ${name}`)} target="_blank" rel="noopener">WhatsApp</a>
              </span>
            </p>

            <table className={shop.specTable}>
              <caption>{t.product.specs}</caption>
              <tbody>
                <tr><th scope="row">{t.product.code}</th><td dir="ltr" style={{ textAlign: 'start' }}>{p.sku}</td></tr>
                {p.specs.map((s) => (
                  <tr key={s.key}><th scope="row">{lang === 'ar' ? s.labelAr : s.label}</th><td>{localiseValue(s.value, lang)}</td></tr>
                ))}
                {p.specs.length === 0 && <tr><td colSpan={2}>{t.product.noSpecs}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className={shop.related} aria-labelledby="related-title">
          <div className={ui.container}>
            <h2 id="related-title" data-reveal>{t.product.related}</h2>
            <div className={shop.grid}>
              {related.map((r, i) => <ProductCard key={r.id} product={r} categories={categories} lang={lang} reveal={i % 4} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
