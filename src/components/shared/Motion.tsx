'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Site-wide scroll motion. Mark elements in markup, no JS per component:
 *
 *   data-reveal                 rise + fade (default)
 *   data-reveal="fade|zoom|left|right|mask"
 *   data-reveal-delay="1".."6"  stagger step (80 ms each)
 *   data-stagger                every direct child reveals in sequence
 *   data-parallax="0.15"        gentle vertical drift while scrolling (images, backgrounds)
 *
 * Nothing is hidden in the server HTML. On mount only elements still below the
 * fold become "pending" and animate in when they arrive, so content that's on
 * screen (including pages opened mid-way from the homepage circles) is never
 * hidden. Re-scans after every navigation and filter change.
 */
export default function Motion() {
  const pathname = usePathname();
  const search = useSearchParams();
  const key = `${pathname}?${search.toString()}`;

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Children of [data-stagger] inherit a reveal with increasing delays.
    document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
      [...group.children].forEach((child, i) => {
        const el = child as HTMLElement;
        if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', group.dataset.stagger || '');
        if (!el.hasAttribute('data-reveal-delay')) el.setAttribute('data-reveal-delay', String(Math.min(i, 6)));
      });
    });

    const below = (el: Element) => el.getBoundingClientRect().top > innerHeight * .96;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.setAttribute('data-shown', '');
        e.target.removeAttribute('data-pending');
        io.unobserve(e.target);
      }
    }, { rootMargin: '0px 0px -6% 0px', threshold: .06 });

    document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-shown])').forEach((el) => {
      if (below(el)) { el.setAttribute('data-pending', ''); io.observe(el); }
      else { el.removeAttribute('data-pending'); el.setAttribute('data-shown', ''); }
    });

    // Parallax: one rAF-throttled scroll handler for the whole page.
    const layers = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
    let raf = 0;
    const update = () => {
      raf = 0;
      for (const el of layers) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) continue;
        const speed = parseFloat(el.dataset.parallax || '0.12');
        const offset = (r.top + r.height / 2 - innerHeight / 2) * -speed;
        el.style.setProperty('--parallax', `${offset.toFixed(1)}px`);
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    if (layers.length) { update(); addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); }

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      // Never leave anything hidden behind (e.g. a page kept in the router cache). Don't mark it
      // shown: if the effect runs again (route change, React dev double-run) it's re-evaluated.
      document.querySelectorAll('[data-pending]').forEach((el) => el.removeAttribute('data-pending'));
    };
  }, [key]);

  return null;
}
