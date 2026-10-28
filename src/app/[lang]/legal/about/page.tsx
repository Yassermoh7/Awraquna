import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Arrow, CtaSection, PageHero, SectionHead, SisterCard, Steps } from '@/components/legal/Blocks';
import Icon from '@/components/legal/Icon';
import styles from '@/components/legal/legal.module.css';
import { getLegal, type IconName } from '@/content/legal';
import { alternates, isLocale } from '@/lib/i18n';
import { legalPath } from '@/lib/links';

export async function generateMetadata({ params }: PageProps<'/[lang]/legal/about'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getLegal(lang).meta;
  return {
    title: `${t.aboutTitle} | ${t.siteName}`,
    description: t.aboutDescription,
    alternates: alternates('/legal/about', lang),
  };
}

const stripIcons: IconName[] = ['diamond', 'people', 'trademark', 'chart', 'globe'];
const reasonIcons: IconName[] = ['award', 'people', 'target', 'chat', 'globe', 'chart'];
const valueIcons: IconName[] = ['shield', 'clock', 'chart', 'people', 'globe', 'handshake'];

export default async function AboutPage({ params }: PageProps<'/[lang]/legal/about'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getLegal(lang);
  const a = t.about;

  return (
    <>
      <PageHero eyebrow={a.eyebrow} title={a.title} lead={a.lead} image="/images/legal/window-boardroom.jpg" imageAlt={a.heroAlt}>
        <div className={styles.heroCtas}>
          <Link className={`${styles.btn} ${styles.btnFig}`} href={legalPath(lang, '/contact')}>{t.nav.getInTouch} <Arrow /></Link>
          <Link className={styles.link} href={legalPath(lang, '/services')}>{t.common.allServices} <Arrow /></Link>
        </div>
      </PageHero>

      <div className={styles.strip}>
        <div className={styles.wrap}>
          <ul>
            {a.strip.map((s, i) => <li key={s}><span><Icon name={stripIcons[i]} />{s}</span></li>)}
          </ul>
        </div>
      </div>

      <section className={styles.tinted}>
        <div className={styles.wrap}>
          <SectionHead eyebrow={a.reasons.eyebrow} title={a.reasons.title} aside={a.reasons.text} />
          <div className={styles.cardGrid} data-stagger>
            {a.reasons.items.map((it, i) => (
              <div key={it.title} className={styles.card}><Icon name={reasonIcons[i]} /><h3>{it.title}</h3><p>{it.text}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.plainBg}>
        <div className={styles.wrap}>
          <SectionHead eyebrow={a.process.eyebrow} title={a.process.title} aside={a.process.text} />
          <Steps steps={a.process.steps} />
        </div>
      </section>

      <section className={`${styles.band} ${styles.bandFull}`} aria-labelledby="value">
        <div className={styles.wrap}>
          <SectionHead eyebrow={a.value.eyebrow} title={a.value.title} aside={a.value.text} id="value" />
          <div className={styles.valueGrid} data-stagger>
            {a.value.items.map((it, i) => (
              <div key={it.title} className={styles.valueCard}>
                <Icon name={valueIcons[i]} />
                <div><h3>{it.title}</h3><p>{it.text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.quote} ${styles.quoteTop}`}>
        <div className={styles.wrap}>
          <figure data-reveal="left">
            <span className={styles.eyebrow}>{a.quote.eyebrow}</span>
            <h2>{a.quote.title}</h2>
            <blockquote>{t.home.quote.text}</blockquote>
            <figcaption><cite>{t.home.quote.cite}</cite></figcaption>
          </figure>
          <div className={styles.quoteImg} data-reveal="zoom">
            <Image src="/images/legal/conference.jpg" alt={t.home.quote.imgAlt} fill sizes="(max-width: 820px) 100vw, 560px" />
          </div>
        </div>
      </section>

      <CtaSection lang={lang} title={a.ctaTitle} />
      <SisterCard lang={lang} />
    </>
  );
}
