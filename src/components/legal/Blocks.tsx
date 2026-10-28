import Image from 'next/image';
import Link from 'next/link';
import { localePath, type Locale } from '@/lib/i18n';
import { gatewayPath, legalPath, plusPath } from '@/lib/links';
import { site } from '@/lib/site';
import {
  articleMeta, fill, formatDate, getLegal, serviceMeta, serviceSlugs,
  type ArticleSlug, type ServiceSlug,
} from '@/content/legal';
import Icon from './Icon';
import styles from './legal.module.css';

export const Arrow = () => <span className={styles.arrow} aria-hidden="true">→</span>;

/** Eyebrow + heading + signature rule, with an optional aside paragraph or link. */
export function SectionHead({ eyebrow, title, aside, id, as: H = 'h2' }: {
  eyebrow: string; title: React.ReactNode; aside?: React.ReactNode; id?: string; as?: 'h1' | 'h2';
}) {
  return (
    <div className={styles.secHead} data-reveal>
      <div>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <H id={id}>{title}</H>
        <div className={styles.rule} />
      </div>
      {aside && (typeof aside === 'string' ? <p>{aside}</p> : aside)}
    </div>
  );
}

/** Inner-page hero: text on warm white, low-res photo framed on the side. */
export function PageHero({ eyebrow, title, lead, image, imageAlt, children }: {
  eyebrow: string; title: string; lead: string; image: string; imageAlt: string; children?: React.ReactNode;
}) {
  return (
    <section className={`${styles.hero} ${styles.pageHero}`}>
      <div className={styles.watermark} aria-hidden="true">A</div>
      <div className={styles.wrap}>
        <div className={styles.heroTxt}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h1>{title}</h1>
          <div className={`${styles.rule} ${styles.ruleBlue}`} />
          <p className={styles.lead}>{lead}</p>
          {children}
        </div>
        <div className={styles.heroImg}>
          <div className={`${styles.frame} ${styles.frameWide}`}>
            <div className={styles.parallax} data-parallax="0.08"><Image src={image} alt={imageAlt} fill preload sizes="(max-width: 820px) 100vw, 540px" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServiceCard({ lang, slug, index }: { lang: Locale; slug: ServiceSlug; index: number }) {
  const t = getLegal(lang);
  const s = t.services[slug];
  return (
    <Link className={styles.svc} href={legalPath(lang, `/services/${slug}`)}>
      <div className={styles.ph}>
        <Image src={serviceMeta[slug].image} alt={s.imgAlt} fill sizes="(max-width: 560px) 100vw, (max-width: 1080px) 50vw, 380px" />
      </div>
      <div className={styles.bd}>
        <span className={styles.num}>{String(index + 1).padStart(2, '0')}</span>
        <h3>{s.title}</h3>
        <p>{s.short}</p>
        <span className={styles.link}>{t.common.learnMore} <Arrow /></span>
      </div>
    </Link>
  );
}

export function ArticleCard({ lang, slug }: { lang: Locale; slug: ArticleSlug }) {
  const t = getLegal(lang);
  const m = articleMeta[slug];
  return (
    <Link className={styles.post} href={legalPath(lang, `/resources/${slug}`)}>
      <div className={styles.ph}>
        <Image src={m.image} alt={t.articles[slug].imgAlt} fill sizes="(max-width: 560px) 100vw, (max-width: 1080px) 50vw, 380px" />
      </div>
      <div className={styles.meta}>
        <span><time dateTime={m.date}>{formatDate(m.date, lang)}</time></span>
        <span>{t.resources.categories[m.categories[0]]}</span>
      </div>
      <h3>{t.articles[slug].title} <Arrow /></h3>
    </Link>
  );
}

/** "Let's build a stronger tomorrow" — closing call to action with contact details. */
export function CtaSection({ lang, title }: { lang: Locale; title?: string }) {
  const t = getLegal(lang);
  const { email, phone, offices } = site.legal;
  return (
    <section className={styles.cta} aria-labelledby="legal-cta" data-reveal="fade">
      <div className={`${styles.watermark} ${styles.watermarkCta}`} aria-hidden="true">A</div>
      <div className={styles.wrap}>
        <div>
          <span className={styles.eyebrow}>{t.cta.eyebrow}</span>
          <h2 id="legal-cta">{title ?? t.cta.title}</h2>
          <div className={styles.rule} />
          <p>{t.cta.text}</p>
        </div>
        <div className={styles.actions}>
          <div className={styles.ctaButtons}>
            <Link className={`${styles.btn} ${styles.btnFig}`} href={legalPath(lang, '/contact')}>{t.common.bookConsultation} <Arrow /></Link>
            <Link className={`${styles.btn} ${styles.btnLine}`} href={`${legalPath(lang, '/contact')}?form=trademark`}>{t.common.checkTrademark} <Arrow /></Link>
          </div>
          <ul className={styles.contactList}>
            <li><Icon name="mail" /> <a href={`mailto:${email}`}>{email}</a></li>
            {phone && <li><Icon name="phone" /> <a href={`tel:${phone.replace(/\s/g, '')}`} dir="ltr">{phone}</a></li>}
            <li><Icon name="pin" /> {offices[lang]}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Cross-link to the sister company. The only place Plus blue appears on the legal site. */
export function SisterCard({ lang }: { lang: Locale }) {
  const t = getLegal(lang).sister;
  return (
    <section className={styles.sister} aria-label={t.eyebrow} data-reveal>
      <div className={styles.wrap}>
        <Link href={plusPath(lang)}>
          <div className={styles.thumb}><Image src="/images/plus/cat-paper.jpg" alt="" width={84} height={84} /></div>
          <div>
            <small>{t.eyebrow}</small>
            <h3>{t.title}</h3>
            <p>{t.text}</p>
          </div>
          <span className={styles.go}>{t.cta} <Arrow /></span>
        </Link>
      </div>
    </section>
  );
}

export function LegalFooter({ lang }: { lang: Locale }) {
  const t = getLegal(lang);
  return (
    <footer className={styles.footer}>
      <div className={styles.wrap}>
        <div className={styles.ft}>
          <div>
            <Image src="/brand/legal-logo-white.png" alt={t.meta.siteName} width={900} height={384} sizes="160px" className={styles.ftLogo} />
            <p>{t.footer.blurb}</p>
          </div>
          <div>
            <h2>{t.footer.servicesHeading}</h2>
            <ul>
              {serviceSlugs.map((s) => <li key={s}><Link href={legalPath(lang, `/services/${s}`)}>{t.services[s].title}</Link></li>)}
            </ul>
          </div>
          <div>
            <h2>{t.footer.companyHeading}</h2>
            <ul>
              <li><Link href={legalPath(lang)}>{t.nav.home}</Link></li>
              <li><Link href={legalPath(lang, '/about')}>{t.nav.about}</Link></li>
              <li><Link href={legalPath(lang, '/resources')}>{t.nav.resources}</Link></li>
              <li><Link href={legalPath(lang, '/contact')}>{t.nav.contact}</Link></li>
            </ul>
          </div>
          <div>
            <h2>{t.footer.familyHeading}</h2>
            <ul>
              <li><Link href={plusPath(lang)}>{t.footer.plus}</Link></li>
              <li><Link href={legalPath(lang)} aria-current="page">{t.footer.legal}</Link></li>
              <li><Link href={gatewayPath(lang)}>{t.footer.all}</Link></li>
            </ul>
          </div>
        </div>
        <div className={styles.fb}>
          <span>{t.footer.copyright}</span>
          <nav aria-label={t.footer.legalNav}>
            <Link href={localePath(lang, '/privacy')}>{t.footer.privacy}</Link>
            <Link href={localePath(lang, '/terms')}>{t.footer.terms}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

/** Process steps (numbered dots on a connecting line). */
export function Steps({ steps }: { steps: { label?: string; title: string; text: string }[] }) {
  return (
    <ol className={styles.steps} data-stagger>
      {steps.map((s, i) => (
        <li key={s.title}>
          <div className={styles.dot}>{i + 1}</div>
          {s.label && !/^\d+$/.test(s.label) && <small>{s.label}</small>}
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function Disclaimer({ text }: { text: string }) {
  return <p className={styles.note}><Icon name="info" /> {text}</p>;
}

export { fill };
