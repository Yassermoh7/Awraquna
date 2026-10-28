'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { plusCopy } from '@/content/plus';
import { localePath, switchLocalePath, type Locale } from '@/lib/i18n';
import { plusPath } from '@/lib/links';
import { site, whatsappLink } from '@/lib/site';
import { Chevron, Close, List, Menu, Search, User, WhatsApp } from './icons';
import { useOrderList } from './order-list';
import styles from './layout.module.css';

export type MenuItem = { href: string; label: string; text: string; image: string };

const subscribeScroll = (cb: () => void) => {
  window.addEventListener('scroll', cb, { passive: true });
  return () => window.removeEventListener('scroll', cb);
};

export default function Header({ lang, products, industries }: { lang: Locale; products: MenuItem[]; industries: MenuItem[] }) {
  const t = plusCopy[lang];
  const pathname = usePathname();
  const { count } = useOrderList();
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 24, () => false);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [lastPath, setLastPath] = useState(pathname);
  const searchRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Close menus whenever the route changes (adjusting state during render, not in an effect).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setExpanded(null);
    setOpen(false);
  }

  /** Exactly one mega-menu at a time. Hover opens with a short intent delay; leaving closes after a grace period. */
  const isDesktop = () => matchMedia('(min-width: 981px) and (hover: hover)').matches;
  const hoverOpen = useCallback((key: string) => {
    if (!isDesktop()) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setExpanded(key), 90);
  }, []);
  const hoverClose = useCallback(() => {
    if (!isDesktop()) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setExpanded(null), 180);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const btn = document.getElementById(`menu-btn-${expanded}`);
      setExpanded(null);
      btn?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setExpanded(null);
    };
    addEventListener('keydown', onKey);
    addEventListener('pointerdown', onPointer);
    return () => { removeEventListener('keydown', onKey); removeEventListener('pointerdown', onPointer); };
  }, [expanded]);

  useEffect(() => () => clearTimeout(timer.current), []);

  // "/" focuses the search box, like most catalogue sites
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(el?.tagName ?? '')) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  const close = () => { setOpen(false); setExpanded(null); };
  const isCurrent = (href: string) => pathname === href || pathname === `/en${href}`;

  const menus = [
    { key: 'products', label: t.header.products, items: products, footer: true, all: localePath(lang, '/shop') },
    { key: 'industries', label: t.header.industries, items: industries, footer: false, all: null },
  ];

  return (
    <header className={styles.header} data-scrolled={scrolled || undefined}>
      <div className={styles.headerRow}>
        <Link className={styles.logo} href={plusPath(lang)} aria-label={t.header.home} onClick={close}>
          <Image src="/brand/plus-logo.png" alt={t.brand} width={103} height={48} style={{ height: 'auto' }} preload />
        </Link>

        <nav ref={navRef} className={styles.nav} data-open={open || undefined} id="plus-nav" aria-label={t.header.mainNav}>
          <ul>
            {menus.map((m) => (
              <li
                key={m.key}
                className={styles.hasMenu}
                data-expanded={expanded === m.key || undefined}
                onMouseEnter={() => hoverOpen(m.key)}
                onMouseLeave={hoverClose}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setExpanded((k) => (k === m.key ? null : k));
                }}
              >
                <button
                  type="button"
                  id={`menu-btn-${m.key}`}
                  className={styles.navLink}
                  aria-expanded={expanded === m.key}
                  aria-controls={`menu-${m.key}`}
                  onClick={() => { clearTimeout(timer.current); setExpanded(expanded === m.key ? null : m.key); }}
                >
                  {m.label} <Chevron className={styles.chev} />
                </button>
                <div className={styles.mega} id={`menu-${m.key}`}>
                  {m.items.map((item) => (
                    <Link key={item.href} href={item.href} onClick={close}>
                      <Image src={item.image} alt="" width={48} height={48} />
                      <div><strong>{item.label}</strong><span>{item.text}</span></div>
                    </Link>
                  ))}
                  {m.footer && (
                    <div className={styles.megaFoot}>
                      <Link href={m.all!} onClick={close}>{t.header.allProducts} →</Link>
                      <span>
                        {t.header.megaFoot}{' '}
                        <a href={whatsappLink(site.plus.whatsapp)} target="_blank" rel="noopener">{t.header.megaFootLink}</a>
                      </span>
                    </div>
                  )}
                </div>
              </li>
            ))}
            {[
              { href: localePath(lang, '/about-us'), label: t.header.about },
              { href: localePath(lang, '/blog'), label: t.header.news },
              { href: localePath(lang, '/contactus'), label: t.header.contact },
            ].map((l) => (
              <li key={l.href}>
                <Link className={styles.navLink} href={l.href} aria-current={isCurrent(l.href) ? 'page' : undefined} onClick={close}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li className={styles.mobileOnly}>
              <a className={styles.navLink} href={site.plus.portalUrl}><User className={styles.mobileIcon} />{t.header.signIn}</a>
            </li>
            <li className={styles.mobileOnly}>
              <a className={styles.navLink} href={whatsappLink(site.plus.whatsapp)} target="_blank" rel="noopener"><WhatsApp className={styles.mobileIcon} />{t.header.whatsapp}</a>
            </li>
            <li className={styles.mobileOnly}>
              <a className={styles.navLink} href={switchLocalePath(pathname, lang === 'en' ? 'ar' : 'en')} hrefLang={lang === 'en' ? 'ar' : 'en'} lang={lang === 'en' ? 'ar' : 'en'}>
                {lang === 'en' ? 'عربي' : 'English'}
              </a>
            </li>
          </ul>
        </nav>

        <form className={styles.search} role="search" action={localePath(lang, '/shop')} onSubmit={close}>
          <label className="sr-only" htmlFor="plus-search">{t.header.searchLabel}</label>
          <Search className={styles.searchIcon} />
          <input ref={searchRef} id="plus-search" name="q" type="search" placeholder={t.header.searchPlaceholder} autoComplete="off" enterKeyHint="search" />
          <kbd aria-hidden="true">/</kbd>
        </form>

        <div className={styles.actions}>
          <a className={`${styles.iconBtn} ${styles.waBtn}`} href={whatsappLink(site.plus.whatsapp)} target="_blank" rel="noopener" aria-label={t.header.whatsapp}>
            <WhatsApp />
          </a>
          <a className={`${styles.iconBtn} ${styles.signIn}`} href={site.plus.portalUrl}>
            <User /><span className={styles.btnText}>{t.header.signIn}</span>
          </a>
          <Link className={styles.iconBtn} href={localePath(lang, '/shop/cart')} aria-label={t.header.orderListCount(count)} onClick={close}>
            <List />
            <span className={styles.btnText}>{t.header.orderList}</span>
            {count > 0 && <span className={styles.badge} aria-hidden="true">{count}</span>}
          </Link>
          <div className={styles.lang} role="group" aria-label={t.header.language}>
            <a href={switchLocalePath(pathname, 'en')} aria-current={lang === 'en' ? 'true' : undefined} hrefLang="en" lang="en">EN</a>
            <a href={switchLocalePath(pathname, 'ar')} aria-current={lang === 'ar' ? 'true' : undefined} hrefLang="ar" lang="ar">عربي</a>
          </div>
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.menuToggle}`}
            aria-expanded={open}
            aria-controls="plus-nav"
            aria-label={open ? t.header.closeMenu : t.header.openMenu}
            onClick={() => setOpen(!open)}
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
