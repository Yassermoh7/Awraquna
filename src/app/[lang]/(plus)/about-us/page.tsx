import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { toLocale } from '@/components/plus/helpers';
import { Arrow, Box, Calendar, Check, Pin, Printer, Shield, Truck, User } from '@/components/plus/icons';
import pages from '@/components/plus/pages.module.css';
import ui from '@/components/plus/ui.module.css';
import { getPlusCopy } from '@/content/plus';
import { alternates, localePath } from '@/lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[lang]/about-us'>): Promise<Metadata> {
  const lang = toLocale((await params).lang);
  const t = getPlusCopy(lang).meta;
  return { title: t.aboutTitle, description: t.aboutDescription, alternates: alternates('/about-us', lang) };
}

export default async function AboutPage({ params }: PageProps<'/[lang]/about-us'>) {
  const lang = toLocale((await params).lang);
  const t = getPlusCopy(lang);
  const a = t.about;
  const highlightIcons = [Calendar, Box, Printer, Shield];
  const differentIcons = [Truck, Check, User];
  const storyImages = ['/images/plus/pos-counter.jpg', '/images/plus/industry-logistics.jpg', '/images/plus/industry-retail.png'];

  return (
    <>
      <section className={pages.hero}>
        <div className={`${ui.container} ${pages.heroGrid}`}>
          <div>
            <nav className={ui.breadcrumbs} aria-label={t.common.breadcrumb}>
              <ol>
                <li><Link href={localePath(lang, '/plus')}>{t.common.home}</Link></li>
                <li aria-current="page">{a.eyebrow}</li>
              </ol>
            </nav>
            <h1>{a.title}</h1>
            <p className={pages.lead}>{a.lead}</p>
            <div className={pages.ctas}>
              <Link className={`${ui.btn} ${ui.primary}`} href={localePath(lang, '/contactus')}>{a.contactSales} <Arrow /></Link>
              <Link className={`${ui.btn} ${ui.ghost}`} href={localePath(lang, '/shop')}>{a.shop}</Link>
            </div>
          </div>
          <div className={pages.heroMedia}>
            <div className={pages.heroPhoto}>
              <div className={pages.parallaxFill} data-parallax="0.08"><Image src="/images/plus/industry-logistics.jpg" alt={a.imageAlt} fill preload sizes="(max-width: 980px) 100vw, 600px" /></div>
            </div>
            <div className={pages.statCard} aria-hidden="true">
              <b>15+</b>
              <span>{t.home.trust[0].text}</span>
            </div>
          </div>
        </div>
        <div className={ui.container}>
          <ul className={pages.highlights}>
            {a.highlights.map((h, i) => {
              const Icon = highlightIcons[i];
              return <li key={h} data-reveal data-reveal-delay={String(Math.min(i + 1, 6))}><span><Icon /></span>{h}</li>;
            })}
          </ul>
        </div>
      </section>

      <section className={ui.section} aria-labelledby="story-title">
        <div className={ui.container}>
          <div className={ui.secHead} data-reveal><div><h2 id="story-title">{a.storyTitle}</h2><p>{a.storyText}</p></div></div>
          <ol className={pages.story} role="list">
            {a.story.map((s, i) => (
              <li key={s.title} className={pages.storyCard} data-reveal data-reveal-delay={String(Math.min(i + 1, 6))}>
                <div className={pages.storyImg}>
                  <Image src={storyImages[i]} alt="" fill sizes="(max-width: 980px) 100vw, 420px" />
                  <span className={pages.storyNum}>0{i + 1}</span>
                </div>
                <div className={pages.storyBody}><h3>{s.title}</h3><p>{s.text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={ui.sectionAlt} aria-labelledby="diff-title">
        <div className={ui.container}>
          <div className={ui.secHead} data-reveal><div><h2 id="diff-title">{a.differentTitle}</h2><p>{a.differentText}</p></div></div>
          <div className={pages.cards3}>
            {a.different.map((d, i) => {
              const Icon = differentIcons[i];
              return (
                <article key={d.title} className={pages.card} data-reveal data-reveal-delay={String(Math.min(i + 1, 6))}>
                  <span className={pages.cardIcon}><Icon /></span>
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                  <ul>{d.points.map((pt) => <li key={pt}><Check />{pt}</li>)}</ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={ui.section}>
        <div className={`${ui.container} ${pages.split}`}>
          <div className={pages.panel} data-reveal>
            <h2>{a.qualityTitle}</h2>
            <p className={pages.panelLead}>{a.qualityText}</p>
            <ul className={pages.checkList} data-stagger>{a.quality.map((q) => <li key={q}><Check />{q}</li>)}</ul>
          </div>
          <div className={pages.panel} data-reveal data-reveal-delay="2">
            <h2>{a.howTitle}</h2>
            <p className={pages.panelLead}>{a.howText}</p>
            <ol className={pages.timeline} data-stagger>{a.how.map((h, i) => <li key={h.title}><span>{i + 1}</span><div><h3>{h.title}</h3><p>{h.text}</p></div></li>)}</ol>
          </div>
        </div>
      </section>

      <section className={pages.serve} aria-labelledby="serve-title">
        <div className={`${ui.container} ${pages.serveInner}`} data-reveal>
          <div>
            <h2 id="serve-title">{a.serveTitle}</h2>
            <p>{a.serveText}</p>
          </div>
          <div>
            <ul className={pages.cities}>{a.cities.map((c) => <li key={c}><Pin />{c}</li>)}</ul>
            <Link className={ui.linkArrow} href={localePath(lang, '/contactus')}>{a.serveAsk} <Arrow /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
