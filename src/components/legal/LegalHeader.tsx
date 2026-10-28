'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { switchLocalePath, type Locale } from '@/lib/i18n';
import type { LegalDict } from '@/content/legal';
import styles from './legal.module.css';

const subscribeScroll = (cb: () => void) => {
  window.addEventListener('scroll', cb, { passive: true });
  return () => window.removeEventListener('scroll', cb);
};

type NavKey = 'home' | 'services' | 'about' | 'resources' | 'contact';

type Props = {
  lang: Locale;
  t: LegalDict['nav'];
  hrefs: Record<NavKey, string>;
  services: { slug: string; title: string; note: string; href: string }[];
};

/** Section of the legal site the current URL belongs to (works with /legal, /ar/legal and the legal subdomain). */
function sectionOf(pathname: string): NavKey {
  const rel = pathname.replace(/^\/(ar|en)(?=\/|$)/, '').replace(/^\/legal(?=\/|$)/, '') || '/';
  const first = rel.split('/')[1] ?? '';
  return (['services', 'about', 'resources', 'contact'] as const).find((k) => k === first) ?? 'home';
}

export default function LegalHeader({ lang, t, hrefs, services }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 40, () => false);
  const active = sectionOf(pathname);
  const otherLang: Locale = lang === 'en' ? 'ar' : 'en';
  const otherHref = switchLocalePath(pathname, otherLang);

  // Lock page scroll while the mobile menu is open; close on Escape.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open]);

  const items: { key: NavKey; label: string }[] = [
    { key: 'home', label: t.home },
    { key: 'services', label: t.services },
    { key: 'about', label: t.about },
    { key: 'resources', label: t.resources },
    { key: 'contact', label: t.contact },
  ];

  return (
    <>
      <header className={styles.siteHeader} data-scrolled={scrolled || undefined}>
        <div className={`${styles.wrap} ${styles.hdr}`}>
          <Link className={styles.logo} href={hrefs.home} aria-label={t.homeLabel}>
            <Image src="/brand/legal-logo-fig.png" alt="" width={900} height={384} preload sizes="150px" />
          </Link>

          <nav aria-label={t.main}>
            <ul className={styles.mainnav}>
              {items.map((it) => (
                <li key={it.key} className={it.key === 'services' ? styles.hasMenu : undefined}>
                  <Link href={hrefs[it.key]} aria-current={active === it.key ? 'page' : undefined}>
                    {it.label}
                    {it.key === 'services' && <span className={styles.chev} aria-hidden="true">▾</span>}
                  </Link>
                  {it.key === 'services' && (
                    <div className={styles.dd}>
                      {services.map((s) => (
                        <Link key={s.slug} href={s.href}>
                          {s.title}
                          <small>{s.note}</small>
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.hdrRight}>
            <Link className={styles.lang} href={otherHref} hrefLang={otherLang} lang={otherLang} prefetch={false}>
              <b>{t.currentLangCode}</b> / <span>{t.otherLang}</span>
            </Link>
            <Link className={`${styles.btn} ${styles.btnFig} ${styles.hdrCta}`} href={hrefs.contact}>
              {t.getInTouch} <span className={styles.arrow} aria-hidden="true">→</span>
            </Link>
            <button
              type="button"
              className={styles.burger}
              aria-label={open ? t.closeMenu : t.openMenu}
              aria-expanded={open}
              aria-controls="legal-mnav"
              onClick={() => setOpen((o) => !o)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      <nav id="legal-mnav" className={styles.mnav} data-open={open || undefined} aria-label={t.mobile} hidden={!open}>
        {items.map((it) => (
          <div key={it.key}>
            <Link href={hrefs[it.key]} onClick={() => setOpen(false)} aria-current={active === it.key ? 'page' : undefined}>
              {it.label}
            </Link>
            {it.key === 'services' && (
              <div className={styles.mnavSub}>
                {services.map((s) => (
                  <Link key={s.slug} href={s.href} onClick={() => setOpen(false)}>{s.title}</Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <Link href={otherHref} hrefLang={otherLang} lang={otherLang} onClick={() => setOpen(false)} prefetch={false}>{t.otherLang}</Link>
        <p className={styles.mnavCta}>
          <Link className={`${styles.btn} ${styles.btnFig}`} href={hrefs.contact} onClick={() => setOpen(false)}>
            {t.getInTouch} <span className={styles.arrow} aria-hidden="true">→</span>
          </Link>
        </p>
      </nav>
    </>
  );
}
