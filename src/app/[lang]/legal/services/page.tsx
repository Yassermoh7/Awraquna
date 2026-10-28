import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Arrow, CtaSection, PageHero, SectionHead, SisterCard } from '@/components/legal/Blocks';
import Icon from '@/components/legal/Icon';
import styles from '@/components/legal/legal.module.css';
import { getLegal, serviceMeta, serviceSlugs } from '@/content/legal';
import { alternates, isLocale } from '@/lib/i18n';
import { legalPath } from '@/lib/links';

export async function generateMetadata({ params }: PageProps<'/[lang]/legal/services'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getLegal(lang).meta;
  return {
    title: `${t.servicesTitle} | ${t.siteName}`,
    description: t.servicesDescription,
    alternates: alternates('/legal/services', lang),
  };
}

export default async function ServicesPage({ params }: PageProps<'/[lang]/legal/services'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getLegal(lang);
  const p = t.servicesPage;

  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} lead={p.lead} image="/images/legal/contract.jpg" imageAlt={p.heroAlt}>
        <div className={styles.heroCtas}>
          <Link className={`${styles.btn} ${styles.btnFig}`} href={legalPath(lang, '/contact')}>{t.common.bookConsultation} <Arrow /></Link>
        </div>
      </PageHero>

      <nav className={styles.strip} aria-label={p.eyebrow}>
        <div className={styles.wrap}>
          <ul>
            {serviceSlugs.map((s) => (
              <li key={s}><a href={`#${s}`}><Icon name={serviceMeta[s].icon} />{t.services[s].title}</a></li>
            ))}
          </ul>
        </div>
      </nav>

      <section className={styles.split}>
        <div className={styles.wrap}>
          <div data-reveal="left">
            <span className={styles.eyebrow}>{p.stageEyebrow}</span>
            <h2>{p.stageTitle}</h2>
            <div className={styles.rule} />
            <p>{p.stageText}</p>
          </div>
          <div className={styles.splitImg} data-reveal="zoom">
            <Image src="/images/legal/desk-city.jpg" alt={p.stageAlt} fill sizes="(max-width: 820px) 100vw, 560px" />
          </div>
        </div>
      </section>

      <section className={styles.tinted}>
        <div className={styles.wrap}>
          <SectionHead eyebrow={p.areasEyebrow} title={p.areasTitle} />
          <div className={styles.areas} data-stagger>
            {serviceSlugs.map((s, i) => {
              const svc = t.services[s];
              return (
                <article key={s} id={s} className={styles.area}>
                  <div className={styles.areaImg}>
                    <Image src={serviceMeta[s].image} alt={svc.imgAlt} fill sizes="(max-width: 820px) 100vw, 600px" />
                  </div>
                  <div className={styles.areaBody}>
                    <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                    <h3>{svc.title}</h3>
                    <p>{svc.short}</p>
                    <ul>{svc.covers.slice(0, 4).map((c) => <li key={c}>{c}</li>)}</ul>
                    <Link className={styles.link} href={legalPath(lang, `/services/${s}`)}>{t.common.learnMore} <Arrow /></Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`${styles.band} ${styles.bandFeature}`} aria-labelledby="featured-service">
        <div className={styles.wrap}>
          <div className={styles.bandTxt} data-reveal="right">
            <span className={styles.eyebrow}>{p.featured.eyebrow}</span>
            <h2 id="featured-service">{p.featured.title}</h2>
            <div className={styles.rule} />
            <p style={{ marginTop: 22, maxWidth: 460 }}>{p.featured.text}</p>
            <p style={{ marginTop: 30 }}>
              <Link className={`${styles.btn} ${styles.btnLight}`} href={legalPath(lang, '/services/trademarks')}>{t.common.learnMore} <Arrow /></Link>
            </p>
          </div>
          <div className={styles.bandImg} data-reveal="zoom">
            <div className={styles.parallax} data-parallax="0.1"><Image src="/images/legal/skyline-dusk.jpg" alt={p.featured.imgAlt} fill sizes="(max-width: 820px) 100vw, 600px" /></div>
          </div>
        </div>
      </section>

      <section>
        <div className={styles.wrap}>
          <SectionHead eyebrow={p.sectorsEyebrow} title={p.sectorsTitle} aside={p.sectorsText} />
          <ul className={styles.sectors}>
            {p.sectors.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
      </section>

      <CtaSection lang={lang} />
      <SisterCard lang={lang} />
    </>
  );
}
