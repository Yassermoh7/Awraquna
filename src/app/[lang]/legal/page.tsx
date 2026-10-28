import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Arrow, ArticleCard, CtaSection, SectionHead, ServiceCard, SisterCard, Steps } from '@/components/legal/Blocks';
import Icon from '@/components/legal/Icon';
import styles from '@/components/legal/legal.module.css';
import { getLegal, serviceMeta, serviceSlugs, type ArticleSlug, type IconName } from '@/content/legal';
import { alternates, isLocale } from '@/lib/i18n';
import { legalPath } from '@/lib/links';
import { site } from '@/lib/site';

export async function generateMetadata({ params }: PageProps<'/[lang]/legal'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getLegal(lang).meta;
  return {
    title: { absolute: t.homeTitle },
    description: t.homeDescription,
    alternates: alternates('/legal', lang),
    openGraph: { title: t.homeTitle, description: t.homeDescription, images: ['/images/legal/hero-office.jpg'] },
  };
}

const homeArticles: ArticleSlug[] = ['trademark-registration-saudi-arabia', 'why-intellectual-property-matters', 'key-elements-commercial-contract'];
const whyIcons: IconName[] = ['diamond', 'people', 'shield', 'chart'];
const bandIcons: IconName[] = ['diamond', 'people', 'chart'];
// Strip order follows the mockups: IP rights, then trademarks.
const stripOrder = ['intellectual-property', 'trademarks', 'legal-advisory', 'contracts', 'compliance'] as const;

export default async function LegalHome({ params }: PageProps<'/[lang]/legal'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getLegal(lang);
  const h = t.home;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: t.meta.siteName,
    description: t.meta.homeDescription,
    url: `${site.url}${legalPath(lang)}`,
    logo: `${site.url}/brand/legal-logo-fig.png`,
    email: site.legal.email,
    areaServed: [{ '@type': 'Country', name: 'Saudi Arabia' }, { '@type': 'Country', name: 'Egypt' }],
    parentOrganization: { '@type': 'Organization', name: 'Awraquna', url: site.url },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className={styles.hero}>
        <div className={styles.watermark} aria-hidden="true">A</div>
        <div className={styles.wrap}>
          <div className={styles.heroTxt}>
            <span className={styles.eyebrow}>{h.eyebrow}</span>
            <h1>{h.title}</h1>
            <div className={`${styles.rule} ${styles.ruleBlue}`} />
            <p className={styles.lead}>{h.lead}</p>
            <div className={styles.heroCtas}>
              <Link className={`${styles.btn} ${styles.btnFig}`} href={legalPath(lang, '/contact')}>{t.common.bookConsultation} <Arrow /></Link>
              <Link className={styles.link} href={`${legalPath(lang, '/contact')}?form=trademark`}>{t.common.checkTrademark} <Arrow /></Link>
            </div>
            <div className={styles.heroMeta}>
              {h.meta.map((m) => <div key={m.title}><b>{m.title}</b>{m.text}</div>)}
            </div>
          </div>
          <div className={styles.heroImg}>
            <div className={`${styles.frame} ${styles.heroFrame}`}>
              <div className={styles.parallax} data-parallax="0.08"><Image src="/images/legal/hero-office.jpg" alt={h.heroAlt} fill preload sizes="(max-width: 820px) 100vw, 560px" /></div>
            </div>
            <div className={styles.tag}>
              <Icon name="registered" />
              <p><strong>{h.tag.title}</strong>{h.tag.text}</p>
            </div>
          </div>
        </div>
      </section>

      <nav className={styles.strip} aria-label={h.stripLabel}>
        <div className={styles.wrap}>
          <ul>
            {stripOrder.map((s) => (
              <li key={s}>
                <Link href={legalPath(lang, `/services/${s}`)}><Icon name={serviceMeta[s].icon} />{t.services[s].title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <section className={styles.split}>
        <div className={styles.wrap}>
          <div data-reveal="left">
            <span className={styles.eyebrow}>{h.about.eyebrow}</span>
            <h2>{h.about.title}</h2>
            <div className={styles.rule} />
            <p>{h.about.text}</p>
            <ul className={styles.checks} data-stagger>
              {h.about.checks.map((c) => <li key={c}><Icon name="check" />{c}</li>)}
            </ul>
            <Link className={`${styles.btn} ${styles.btnLine}`} href={legalPath(lang, '/about')}>{h.about.cta} <Arrow /></Link>
          </div>
          <div className={styles.splitImg} data-reveal="zoom">
            <Image src="/images/legal/reception.jpg" alt={h.about.imgAlt} fill sizes="(max-width: 820px) 100vw, 560px" />
          </div>
        </div>
      </section>

      <section className={styles.tinted}>
        <div className={styles.wrap}>
          <SectionHead eyebrow={h.why.eyebrow} title={h.why.title} aside={h.why.text} />
          <div className={styles.whyGrid} data-stagger>
            {h.why.items.map((it, i) => (
              <div key={it.title}><Icon name={whyIcons[i]} /><h3>{it.title}</h3><p>{it.text}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className={styles.wrap}>
          <SectionHead eyebrow={h.services.eyebrow} title={h.services.title} aside={h.services.text} />
          <div className={styles.svcGrid} data-stagger>
            {serviceSlugs.map((s, i) => <ServiceCard key={s} lang={lang} slug={s} index={i} />)}
            <div className={styles.svcCta}>
              <span className={styles.eyebrow}>{h.services.ctaCard.eyebrow}</span>
              <h3>{h.services.ctaCard.title}</h3>
              <p>{h.services.ctaCard.text}</p>
              <Link className={`${styles.btn} ${styles.btnFig}`} href={legalPath(lang, '/contact')}>{t.common.bookConsultation} <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.tinted}>
        <div className={styles.wrap}>
          <SectionHead eyebrow={h.process.eyebrow} title={h.process.title} aside={h.process.text} />
          <Steps steps={h.process.steps} />
          <p className={styles.note}><Icon name="info" />{h.process.note}</p>
        </div>
      </section>

      <section className={styles.band} aria-labelledby="commit">
        <div className={styles.wrap}>
          <div className={styles.bandImg} data-reveal="zoom">
            <div className={styles.parallax} data-parallax="0.1"><Image src="/images/legal/boardroom.jpg" alt={h.band.imgAlt} fill sizes="(max-width: 820px) 100vw, 600px" /></div>
          </div>
          <div className={styles.bandTxt} data-reveal="right">
            <span className={styles.eyebrow}>{h.band.eyebrow}</span>
            <h2 id="commit">{h.band.title1}<br />{h.band.title2}</h2>
            <div className={styles.rule} />
            <ul className={styles.bandList} data-stagger>
              {h.band.items.map((it, i) => (
                <li key={it.title}><Icon name={bandIcons[i]} /><b>{it.title}</b><span>{it.text}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div className={styles.wrap}>
          <SectionHead
            eyebrow={h.insights.eyebrow}
            title={h.insights.title}
            aside={<Link className={styles.link} href={legalPath(lang, '/resources')}>{t.common.viewAllArticles} <Arrow /></Link>}
          />
          <div className={styles.insGrid} data-stagger>
            {homeArticles.map((a) => <ArticleCard key={a} lang={lang} slug={a} />)}
          </div>
        </div>
      </section>

      <section className={styles.quote}>
        <div className={styles.wrap}>
          <figure data-reveal="left">
            <span className={styles.eyebrow}>{h.quote.eyebrow}</span>
            <blockquote>{h.quote.text}</blockquote>
            <figcaption><cite>{h.quote.cite}</cite></figcaption>
          </figure>
          <div className={styles.quoteImg} data-reveal="zoom">
            <Image src="/images/legal/conference.jpg" alt={h.quote.imgAlt} fill sizes="(max-width: 820px) 100vw, 560px" />
          </div>
        </div>
      </section>

      <CtaSection lang={lang} />
      <SisterCard lang={lang} />
    </>
  );
}
