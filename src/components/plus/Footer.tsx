import Image from 'next/image';
import Link from 'next/link';
import { getPlusCopy } from '@/content/plus';
import { localePath, type Locale } from '@/lib/i18n';
import { legalPath, plusPath } from '@/lib/links';
import { site } from '@/lib/site';
import { categoryHref } from './helpers';
import { Facebook, Instagram, LinkedIn, Mail, Phone, Pin } from './icons';
import styles from './layout.module.css';

export default function Footer({ lang, shopLinks }: { lang: Locale; shopLinks: { slug: string; label: string }[] }) {
  const t = getPlusCopy(lang).footer;
  const p = (path: string) => localePath(lang, path);
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <div className={styles.aboutCol}>
            <Link className={styles.footerLogo} href={plusPath(lang)}>
              <Image src="/brand/plus-logo.png" alt={site.plus.name} width={86} height={40} style={{ height: 'auto' }} />
            </Link>
            <p>{t.about}</p>
          </div>
          <div>
            <h2>{t.shop}</h2>
            <ul>
              {shopLinks.map((c) => <li key={c.slug}><Link href={categoryHref(lang, c.slug)}>{c.label}</Link></li>)}
              <li><Link href={p('/shop')}>{t.allProducts}</Link></li>
            </ul>
          </div>
          <div>
            <h2>{t.company}</h2>
            <ul>
              <li><Link href={p('/about-us')}>{t.aboutUs}</Link></li>
              <li><Link href={p('/blog')}>{t.news}</Link></li>
              <li><Link href={p('/jobs')}>{t.jobs}</Link></li>
              <li><Link href={p('/contactus')}>{t.contact}</Link></li>
            </ul>
          </div>
          <div>
            <h2>{t.support}</h2>
            <ul>
              <li><Link href={`${p('/contactus')}?type=bulk`}>{t.bulk}</Link></li>
              <li><Link href={p('/shop/cart')}>{t.orderList}</Link></li>
              <li><a href={site.plus.portalUrl}>{t.account}</a></li>
            </ul>
          </div>
          <div className={styles.contactCol}>
            <h2>{t.getInTouch}</h2>
            <p className={styles.contactLine}><Pin /><span>{site.plus.address[lang]}</span></p>
            <p className={styles.contactLine}><Phone /><a href={`tel:${site.plus.phone}`} dir="ltr">{site.plus.phoneDisplay}</a></p>
            <p className={styles.contactLine}><Mail /><a href={`mailto:${site.plus.email}`}>{site.plus.email}</a></p>
            <ul className={styles.social} aria-label={t.social}>
              <li><a href={site.plus.social.linkedin} aria-label="LinkedIn" rel="noopener" target="_blank"><LinkedIn /></a></li>
              <li><a href={site.plus.social.instagram} aria-label="Instagram" rel="noopener" target="_blank"><Instagram /></a></li>
              <li><a href={site.plus.social.facebook} aria-label="Facebook" rel="noopener" target="_blank"><Facebook /></a></li>
            </ul>
          </div>
        </div>
        <div className={styles.footerFamily}>
          <span>{t.family}</span>
          <Link className={styles.pill} href={plusPath(lang)}>{t.familyPlus}</Link>
          <Link className={`${styles.pill} ${styles.pillLegal}`} href={legalPath(lang)}>{t.familyLegal}</Link>
        </div>
        <div className={styles.footerBottom}>
          <span>{t.rights}</span>
          <nav aria-label={t.legalNav}>
            <Link href={p('/privacy')}>{t.privacy}</Link>
            <Link href={p('/terms')}>{t.terms}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
