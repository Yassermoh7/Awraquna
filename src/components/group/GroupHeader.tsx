'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import styles from './GroupHeader.module.css';

type NavItem = { href: string; label: string; current?: boolean };

/**
 * Share (0–1) of the photo behind `box` that is dark. The photo is the <img data-tone-source>
 * on the page, drawn small into a canvas once; its object-fit: cover placement is
 * replayed here, and beyond its left/right edges it is read mirrored, which is how the
 * hero extends the photo on wide screens. Returns null where there is no photo behind.
 */
function brightnessBehind(box: DOMRect, img: HTMLImageElement, pixels: ImageData): number | null {
  const r = img.getBoundingClientRect();
  const scale = Math.max(r.width / img.naturalWidth, r.height / img.naturalHeight);
  const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
  const [px, py] = getComputedStyle(img).objectPosition.split(' ').map((v) => (v.endsWith('%') ? parseFloat(v) / 100 : 0.5));
  const left = r.left + (r.width - w) * px, top = r.top + (r.height - h) * py;
  let sum = 0, n = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 4; j++) {
      const y = box.top + (box.height * (j + .5)) / 4;
      if (y < r.top || y > r.bottom) continue;
      let u = (box.left + (box.width * (i + .5)) / 8 - left) / w;
      u = u < 0 ? -u : u > 1 ? 2 - u : u;
      const v = (y - top) / h;
      const x = Math.min(pixels.width - 1, Math.max(0, Math.floor(u * pixels.width)));
      const k = (Math.min(pixels.height - 1, Math.max(0, Math.floor(v * pixels.height))) * pixels.width + x) * 4;
      const lum = (0.2126 * pixels.data[k] + 0.7152 * pixels.data[k + 1] + 0.0722 * pixels.data[k + 2]) / 255;
      sum += lum < 0.45 ? 1 : 0;
      n++;
    }
  }
  return n ? sum / n : null;
}

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
  // What the photo behind the logo is like: light, dark, or split between the two.
  const [behind, setBehind] = useState<'light' | 'dark' | 'mixed'>('light');
  const logoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  // White logo while the photo behind it is dark (e.g. the fig wall in the Arabic layout); when the
  // logo straddles light and dark, the fig logo gets a frosted backing like the language button.
  useEffect(() => {
    const img = document.querySelector<HTMLImageElement>('img[data-tone-source]');
    const logo = logoRef.current;
    if (!img || !logo) return;
    let pixels: ImageData | null = null;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!pixels) return;
        const dark = brightnessBehind(logo.getBoundingClientRect(), img, pixels) ?? 0;
        setBehind(dark >= 0.75 ? 'dark' : dark > 0.12 ? 'mixed' : 'light');
      });
    };
    const read = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = Math.round((160 * img.naturalHeight) / img.naturalWidth);
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
      measure();
    };
    if (img.complete && img.naturalWidth) read();
    else img.addEventListener('load', read, { once: true });
    addEventListener('resize', measure);
    addEventListener('scroll', measure, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      img.removeEventListener('load', read);
      removeEventListener('resize', measure);
      removeEventListener('scroll', measure);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={styles.header}
      data-scrolled={scrolled || undefined}
      data-open={open || undefined}
      data-tone={behind !== 'light' && !scrolled && !open ? behind : undefined}
    >
      <div className={styles.inner}>
        <Link href={homeHref} className={styles.logo} aria-label="Awraquna Group" ref={logoRef}>
          <Image className={styles.logoDark} src="/brand/group-logo-fig.png" alt="" width={900} height={384} sizes="136px" preload />
          <Image className={styles.logoLight} src="/brand/group-logo-white.png" alt="" width={900} height={384} sizes="136px" />
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
