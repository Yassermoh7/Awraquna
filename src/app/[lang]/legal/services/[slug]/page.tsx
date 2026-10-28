import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Arrow, ArticleCard, CtaSection, SectionHead, Steps, fill } from '@/components/legal/Blocks';
import Icon from '@/components/legal/Icon';
import styles from '@/components/legal/legal.module.css';
import { getLegal, serviceMeta, serviceSlugs, type ServiceSlug } from '@/content/legal';
import { alternates, isLocale } from '@/lib/i18n';
import { legalPath } from '@/lib/links';
import { site } from '@/lib/site';

const isService = (s: string): s is ServiceSlug => (serviceSlugs as readonly string[]).includes(s);

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/legal/services/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !isService(slug)) return {};
  const t = getLegal(lang);
  const s = t.services[slug];
  return {
    title: `${s.title} | ${t.meta.siteName}`,
    description: s.short,
    alternates: alternates(`/legal/services/${slug}`, lang),
    openGraph: { title: s.title, description: s.short, images: [serviceMeta[slug].image] },
  };
}

export default async function ServicePage({ params }: PageProps<'/[lang]/legal/services/[slug]'>) {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !isService(slug)) notFound();
  const t = getLegal(lang);
  const s = t.services[slug];
  const p = t.servicesPage;
  const meta = serviceMeta[slug];
  const contact = `${legalPath(lang, '/contact')}?service=${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.title,
    description: s.intro,
    serviceType: s.title,
    areaServed: ['SA', 'EG'],
    provider: { '@type': 'LegalService', name: t.meta.siteName, url: `${site.url}${legalPath(lang)}` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className={`${styles.hero} ${styles.pageHero}`}>
        <div className={styles.watermark} aria-hidden="true">A</div>
        <div className={styles.wrap}>
          <div className={styles.heroTxt}>
            <nav aria-label={t.common.breadcrumb}>
              <ol className={styles.crumbs}>
                <li><Link href={legalPath(lang)}>{t.nav.home}</Link></li>
                <li><Link href={legalPath(lang, '/services')}>{t.nav.services}</Link></li>
                <li aria-current="page">{s.title}</li>
              </ol>
            </nav>
            <span className={styles.eyebrow}>{p.eyebrow}</span>
            <h1>{s.title}</h1>
            <div className={`${styles.rule} ${styles.ruleBlue}`} />
            <p className={styles.lead}>{s.intro}</p>
            <div className={styles.heroCtas}>
              <Link className={`${styles.btn} ${styles.btnFig}`} href={contact}>{t.common.bookConsultation} <Arrow /></Link>
              {slug === 'trademarks' && (
                <Link className={styles.link} href={`${legalPath(lang, '/contact')}?form=trademark`}>{t.common.checkTrademark} <Arrow /></Link>
              )}
            </div>
          </div>
          <div className={styles.heroImg}>
            <div className={`${styles.frame} ${styles.frameWide}`}>
              <div className={styles.parallax} data-parallax="0.08"><Image src={meta.image} alt={s.imgAlt} fill preload sizes="(max-width: 820px) 100vw, 540px" /></div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.tinted}>
        <div className={`${styles.wrap} ${styles.detail}`}>
          <div>
            <div className={styles.detailBlock}>
              <h2>{p.coversLabel}</h2>
              <ul className={styles.coverList} data-stagger>
                {s.covers.map((c) => <li key={c}><Icon name="check" />{c}</li>)}
              </ul>
            </div>
            <div className={styles.detailBlock}>
              <h2>{p.stepsLabel}</h2>
              <Steps steps={s.steps} />
            </div>
          </div>
          <aside className={styles.aside}>
            <div className={styles.asideCard}>
              <h3>{p.forLabel}</h3>
              <ul>{s.forWho.map((w) => <li key={w}><Icon name="people" />{w}</li>)}</ul>
            </div>
            <div className={styles.asideCard}>
              <h3>{p.deliverablesLabel}</h3>
              <ul>{s.deliverables.map((d) => <li key={d}><Icon name="check" />{d}</li>)}</ul>
            </div>
            <div className={`${styles.asideCard} ${styles.asideCta}`}>
              <h3>{fill(p.detailCtaTitle, { service: s.title })}</h3>
              <p>{p.detailCtaText}</p>
              <Link className={`${styles.btn} ${styles.btnFig}`} href={contact}>{t.common.bookConsultation} <Arrow /></Link>
            </div>
          </aside>
        </div>
      </section>

      <section>
        <div className={styles.wrap}>
          <SectionHead
            eyebrow={t.home.insights.eyebrow}
            title={p.relatedLabel}
            aside={<Link className={styles.link} href={legalPath(lang, '/resources')}>{t.common.viewAllArticles} <Arrow /></Link>}
          />
          <div className={styles.insGrid} data-stagger>
            {meta.related.map((a) => <ArticleCard key={a} lang={lang} slug={a} />)}
            <div className={styles.asideCard}>
              <h3>{p.otherServices}</h3>
              <ul className={styles.otherList} data-stagger>
                {serviceSlugs.filter((o) => o !== slug).map((o) => (
                  <li key={o}><Link href={legalPath(lang, `/services/${o}`)}>{t.services[o].title} <Arrow /></Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CtaSection lang={lang} />
    </>
  );
}
