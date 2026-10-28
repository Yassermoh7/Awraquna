'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './GroupHeader.module.css';

type NavItem = { href: string; label: string; current?: boolean };

export default function GroupHeader({
  homeHref, nav, langSwitch, menuLabel, closeLabel,
}: {
  homeHref: string;
  nav: NavItem[];
  langSwitch: { href: string; label: string; hrefLang: string };
  menuLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={styles.header} data-scrolled={scrolled || undefined} data-open={open || undefined}>
      <div className={styles.inner}>
        <Link href={homeHref} className={styles.logo} aria-label="Awraquna Group">
          <Image src="/brand/group-logo-fig.png" alt="Awraquna Group" width={900} height={384} sizes="128px" preload />
        </Link>

        <nav className={styles.nav} id="group-nav" aria-label="Main">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} aria-current={item.current ? 'page' : undefined} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a className={styles.langMobile} href={langSwitch.href} hrefLang={langSwitch.hrefLang} lang={langSwitch.hrefLang}>
            {langSwitch.label}
          </a>
        </nav>

        <a className={styles.lang} href={langSwitch.href} hrefLang={langSwitch.hrefLang} lang={langSwitch.hrefLang}>
          {langSwitch.label}
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
          </svg>
        </a>

        <button
          className={styles.burger}
          aria-expanded={open}
          aria-controls="group-nav"
          aria-label={open ? closeLabel : menuLabel}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span />
        </button>
      </div>
    </header>
  );
}
