import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Carousel from '@/components/plus/Carousel';
import CategoryTile from '@/components/plus/CategoryTile';
import ProductCard from '@/components/plus/ProductCard';
import Tabs from '@/components/plus/Tabs';
import { categoryHref, industryHref, sortProducts, toLocale, widthOf } from '@/components/plus/helpers';
import { Arrow, Box, Calendar, Cross, Leaf, Pin, Printer, Search, Seal, Shield, Store, Truck, Utensils } from '@/components/plus/icons';
import home from '@/components/plus/home.module.css';
import ui from '@/components/plus/ui.module.css';
import { getPlusCopy, plusConfig } from '@/content/plus';
import { commerce } from '@/lib/commerce';
import { alternates, localePath } from '@/lib/i18n';
import { legalPath } from '@/lib/links';
import { site, whatsappLink } from '@/lib/site';

/** Refresh catalogue data from Odoo every 5 minutes (new products appear without a rebuild). */
export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<'/[lang]/plus'>): Promise<Metadata> {
  const lang = toLocale((await params).lang);
  const t = getPlusCopy(lang).meta;
  return {
    title: t.homeTitle,
    description: t.homeDescription,
    alternates: alternates('/plus', lang),
    openGraph: { title: t.homeTitle, description: t.homeDescription, images: ['/images/plus/hero-still.jpg'] },
  };
}

const industryIcons: Record<string, typeof Store> = {
  'retail-27': Store, 'restaurants-26': Utensils, 'logistics-30': Truck, 'healthcare-31': Cross,
};
const stepImages = ['/images/plus/steps/choose.jpg', '/images/plus/steps/send.jpg', '/images/plus/steps/deliver.jpg'];

export default async function PlusHome({ params }: PageProps<'/[lang]/plus'>) {
  const lang = toLocale((await params).lang);
  const t = getPlusCopy(lang);
  const h = t.home;
  const [categories, industries, products] = await Promise.all([
    commerce.listCategories(), commerce.listIndustries(), commerce.listProducts(),
  ]);
  const name = (c: { name: string; nameAr: string }) => (lang === 'ar' ? c.nameAr : c.name);
  const top = categories.filter((c) => !c.parent);
  const widths = [...new Set(products.map(widthOf).filter((w): w is string => !!w))].sort((a, b) => Number(a) - Number(b));

  // Every category and sub-category, each top-level one followed by its children.
  const featuredOrder = [...plusConfig.featuredCategories, ...top.map((c) => c.slug).filter((s) => !plusConfig.featuredCategories.includes(s))];
  const tiles = featuredOrder.flatMap((slug) => {
    const c = top.find((x) => x.slug === slug);
    if (!c) return [];
    return [c, ...categories.filter((s) => s.parent === c.slug)];
  }).map((c) => {
    const items = products.filter((p) => p.category === c.slug || p.subcategory === c.slug);
    const image = plusConfig.categoryImages[c.slug] ?? items.find((p) => p.images[0])?.images[0] ?? '/images/plus/cat-paper.jpg';
    const parent = c.parent ? top.find((x) => x.slug === c.parent) : undefined;
    return { c, count: items.length, image, photo: !!plusConfig.categoryImages[c.slug], parent };
  }).filter((x) => x.count > 0);

  // Best sellers per industry: configured ids first, topped up from the industry if needed
  const bestSets = industries.map((ind) => {
    const ids = plusConfig.bestSellers[ind.slug] ?? [];
    const picked = ids.map((id) => products.find((p) => p.id === id)).filter((p) => !!p);
    const fill = sortProducts(products.filter((p) => p.industries.includes(ind.slug) && !picked.includes(p)), categories);
    return { ind, items: [...picked, ...fill], picks: picked.length, total: products.filter((p) => p.industries.includes(ind.slug)).length };
  });

  const arrow = <Arrow />;
  const bulkHref = `${localePath(lang, '/contactus')}?type=bulk`;
  const trustIcons = [Calendar, Truck, Leaf, Shield];
  const whyIcons = [Box, Printer, Leaf, Pin];

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className={home.hero} aria-labelledby="hero-title">
        <div className={home.heroMedia} data-parallax="0.1"><Image className={home.heroImage} src="/images/plus/hero-still.jpg" alt={h.heroAlt} fill preload sizes="100vw" /></div>
        <div className={`${ui.container} ${home.heroInner}`}>
          <div className={home.heroCopy}>
            <h1 id="hero-title">{h.titleA}<em>{h.titleEm}</em>{h.titleB}</h1>
            <p className={home.lead}>{h.lead}</p>
            <div className={home.ctas}>
              <Link className={`${ui.btn} ${ui.primary}`} href={localePath(lang, '/shop')}>{h.shopProducts} {arrow}</Link>
              <Link className={`${ui.btn} ${ui.ghost}`} href={bulkHref}>{h.bulkQuote}</Link>
            </div>
          </div>

          <form className={home.finder} action={localePath(lang, '/shop')} aria-labelledby="finder-title">
            <h2 id="finder-title" className={home.finderTitle}><Search />{h.finder.title}</h2>
            <div className={home.finderField}>
              <label htmlFor="f-category">{h.finder.product}</label>
              <select id="f-category" name="category">
                {top.map((c) => <option key={c.slug} value={c.slug}>{name(c)}</option>)}
              </select>
            </div>
            <div className={home.finderField}>
              <label htmlFor="f-width">{h.finder.width}</label>
              <select id="f-width" name="width" defaultValue="">
                <option value="">{h.finder.anyWidth}</option>
                {widths.map((w) => <option key={w} value={w}>{t.shop.widthValue(w)}</option>)}
              </select>
            </div>
            <div className={home.finderField}>
              <label htmlFor="f-industry">{h.finder.industry}</label>
              <select id="f-industry" name="industry" defaultValue="">
                <option value="">{h.finder.anyIndustry}</option>
                {industries.map((c) => <option key={c.slug} value={c.slug}>{name(c)}</option>)}
              </select>
            </div>
            <button className={`${ui.btn} ${ui.blue}`} type="submit">{h.finder.submit} {arrow}</button>
          </form>
        </div>
      </section>

      {/* ---------- Trust strip ---------- */}
      <section className={home.trustStrip} aria-label={h.trustLabel}>
        <ul className={ui.container}>
          {h.trust.map((item, i) => {
            const Icon = trustIcons[i];
            return <li key={item.title}><Icon /><div><strong>{item.title}</strong><span>{item.text}</span></div></li>;
          })}
        </ul>
      </section>

      {/* ---------- Categories (scrollable) ---------- */}
      <section className={ui.section} aria-labelledby="cats-title">
        <div className={ui.container}>
          <div className={ui.secHead} data-reveal>
            <div>
              <h2 id="cats-title">{h.categories.title}</h2>
              <p>{h.categories.text}</p>
            </div>
            <Link className={ui.linkArrow} href={localePath(lang, '/shop')}>{t.common.viewAll} {arrow}</Link>
          </div>
          <Carousel label={h.categories.title} prevLabel={t.common.prev} nextLabel={t.common.next}>
            {tiles.map(({ c, count, image, photo, parent }) => (
              <CategoryTile
                key={c.slug}
                href={categoryHref(lang, c.slug)}
                title={name(c)}
                kicker={parent ? name(parent) : undefined}
                blurb={t.categories[c.slug]?.blurb}
                count={t.shop.results(count)}
                image={image}
                photo={photo}
              />
            ))}
          </Carousel>
        </div>
      </section>

      {/* ---------- Industries (bento) ---------- */}
      <section className={ui.sectionAlt} aria-labelledby="inds-title">
        <div className={ui.container}>
          <div className={ui.secHead} data-reveal>
            <div>
              <h2 id="inds-title">{h.industries.title}</h2>
              <p>{h.industries.text}</p>
            </div>
          </div>
          <div className={home.bento}>
            {industries.map((c, i) => {
              const Icon = industryIcons[c.slug] ?? Store;
              return (
                <article key={c.slug} className={home.ind} data-reveal data-reveal-delay={String(Math.min(i + 1, 6))}>
                  <Image src={plusConfig.industryImages[c.slug] ?? '/images/plus/pos-counter.jpg'} alt="" fill sizes={i === 0 ? '(max-width: 980px) 100vw, 640px' : '(max-width: 980px) 50vw, 420px'} />
                  <span className={home.indIcon} aria-hidden="true"><Icon /></span>
                  <div className={home.indBody}>
                    <h3><Link href={industryHref(lang, c.slug)}>{name(c)}</Link></h3>
                    <p>{t.categories[c.slug]?.blurb}</p>
                    <span className={home.indGo}>{h.industries.shop(t.industryShort[c.slug] ?? name(c))} {arrow}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Best sellers ---------- */}
      <section className={ui.section} aria-labelledby="best-title">
        <div className={ui.container}>
          <div className={ui.secHead} data-reveal>
            <div><h2 id="best-title">{h.best.title}</h2></div>
          </div>
          <Tabs
            label={h.best.tabsLabel}
            idPrefix="best"
            aside={<Link className={ui.linkArrow} href={localePath(lang, '/shop')}>{h.best.browse} {arrow}</Link>}
            tabs={bestSets.map(({ ind, items, picks, total }) => {
              const Icon = industryIcons[ind.slug] ?? Store;
              return {
                key: ind.slug,
                label: t.industryShort[ind.slug] ?? name(ind),
                count: total,
                icon: <Icon />,
                panel: (
                  <Carousel label={`${h.best.title}: ${t.industryShort[ind.slug] ?? name(ind)}`} prevLabel={t.common.prev} nextLabel={t.common.next}>
                    {items.map((p, i) => (
                      <ProductCard key={p.id} product={p} categories={categories} lang={lang} flag={i < picks ? t.common.bestSeller : undefined} sizes="(max-width: 760px) 62vw, 300px" />
                    ))}
                  </Carousel>
                ),
              };
            })}
          />
        </div>
      </section>

      {/* ---------- How ordering works ---------- */}
      <section className={`${ui.sectionAlt} ${home.orderSection}`} aria-labelledby="order-title">
        <div className={ui.container}>
          <div className={`${ui.secHead} ${home.centerHead}`} data-reveal>
            <div>
              <h2 id="order-title">{h.order.title}</h2>
              <p>{h.order.text}</p>
            </div>
          </div>
          <ol className={home.steps} role="list">
            {h.order.steps.map((s, i) => (
              <li key={s.title} className={home.step} data-reveal data-reveal-delay={String(Math.min(i + 1, 6))}>
                <div className={home.stepArt}>
                  <Image src={stepImages[i]} alt="" fill sizes="(max-width: 980px) 90vw, 400px" />
                </div>
                <div className={home.stepRail} aria-hidden="true"><span className={home.num}>{i + 1}</span></div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>

          <div className={home.bulk} data-reveal>
            <div className={home.bulkPhoto} data-reveal="zoom">
              <Image src="/images/plus/industry-logistics.jpg" alt="" fill sizes="(max-width: 980px) 100vw, 420px" />
            </div>
            <div className={home.bulkBody}>
              <h3>{h.order.bulkTitle}</h3>
              <p>{h.order.bulkText}</p>
              <div className={home.bulkBtns}>
                <Link className={`${ui.btn} ${ui.primary}`} href={bulkHref}>{h.order.bulkCta} {arrow}</Link>
                <a className={`${ui.btn} ${ui.ghost}`} href={whatsappLink(site.plus.whatsapp)} target="_blank" rel="noopener">{h.order.bulkWhatsapp}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Why Awraquna ---------- */}
      <section className={ui.section} aria-labelledby="why-title">
        <div className={`${ui.container} ${home.whyGrid}`}>
          <div className={home.whyIntro} data-reveal>
            <h2 id="why-title">{h.why.title}</h2>
            <p>{h.why.text}</p>
            <Link className={ui.linkArrow} href={localePath(lang, '/about-us')}>{t.common.learnMore} {arrow}</Link>
          </div>
          <div className={home.why}>
            {h.why.items.map((item, i) => {
              const Icon = whyIcons[i];
              return (
                <div key={item.title} className={home.whyCard} data-reveal data-reveal-delay={String(Math.min(i + 1, 6))}>
                  <div className={home.whyIco}><Icon /></div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TODO(client): replace placeholders with client logos once written permission is confirmed */}
      <section className={home.clients} aria-labelledby="clients-title">
        <div className={ui.container}>
          <h2 id="clients-title" data-reveal>{h.clients.title}</h2>
          <ul className={home.logoRow} data-stagger="fade">
            {Array.from({ length: 6 }, (_, i) => <li key={i} className={home.logoTile}>{h.clients.tile}</li>)}
          </ul>
        </div>
      </section>

      {/* ---------- Sister company: a quiet hint of the legal brand ---------- */}
      <section className={home.sisterWrap} aria-labelledby="sister-title">
        <div className={ui.container}>
          <Link className={home.sister} href={legalPath(lang)} data-reveal>
            <span className={home.seal} aria-hidden="true"><Seal /></span>
            <span className={home.sisterText}>
              <span className={home.sisterTitle} id="sister-title">{h.sister.title}</span>
              <span className={home.sisterLead}>{h.sister.text}</span>
            </span>
            <span className={home.sisterCta}>{h.sister.cta} {arrow}</span>
          </Link>
        </div>
      </section>
    </>
  );
}
