'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { ENTER_KEY, type EnterHandoff } from '@/components/shared/EnterScrollRestore';
import styles from './DivisionCircles.module.css';

export type Division = {
  key: 'plus' | 'legal';
  href: string;
  name: string;
  tagline: string;
  logo: { src: string; width: number; height: number };
  /** Long full-page screenshot shown inside the circle. */
  preview: { src: string; width: number; height: number };
  /** Higher-resolution copy used while the circle expands to fill the screen. */
  previewHd: string;
  previewMobile: string;
};

type Copy = { explore: string; hintScroll: string; hintTouch: string; previewAnnouncement: string };

const TOUCH_QUERY = '(max-width: 760px), (hover: none)';
const subscribeTouch = (cb: () => void) => {
  const mq = matchMedia(TOUCH_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const noopSubscribe = () => () => {};

// Motion tuning ---------------------------------------------------------------
const WHEEL_RANGE = 1100;  // px of (normalised) wheel travel from circle to full page
const SWIPE_RANGE = 380;
const MAX_STEP = 90;       // clamp per-event wheel delta so mice and trackpads feel alike
const STIFFNESS = 7.5;     // higher = snappier follow of the target (per second)
const COMMIT_AT = .55;     // released beyond this point → finish entering; below → glide back
const IDLE_MS = 420;       // pause after the last wheel event before committing or rewinding
const INTENT_MS = 450;     // pointer must rest on a circle before scrolling "enters" it

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const smoothstep = (a: number, b: number, t: number) => { const x = clamp01((t - a) / (b - a)); return x * x * (3 - 2 * x); };

type Snapshot = {
  cx: number; cy: number; r: number;                 // the circle on screen
  shotX: number; shotY: number; shotW: number;       // the preview inside it
  endX: number; endY: number; endW: number;          // the same content at true page scale
  pageY: number;                                      // scroll position the real page should open at
};

/** Width (CSS px) of the full-page screenshots used as previews. */
const SHOT_PAGE_WIDTH = 1440;

/**
 * The two division circles, placed inside the hero scene (behind the steps and
 * the books). At rest: brand colour, white logo, Explore. Hover/focus/tap: the
 * circle swells and its logo dissolves into a scrolling preview of the site.
 * Keep scrolling: the circle zooms smoothly into that site and navigates.
 */
export default function DivisionCircles({ divisions, copy }: { divisions: Division[]; copy: Copy }) {
  const router = useRouter();
  const touch = useSyncExternalStore(subscribeTouch, () => matchMedia(TOUCH_QUERY).matches, () => false);
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [active, setActive] = useState<Division['key'] | null>(null);
  const [announcement, setAnnouncement] = useState('');

  const rootRef = useRef<HTMLDivElement>(null);
  const orbRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const shotRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const barRefs = useRef<Record<string, SVGCircleElement | null>>({});
  const portalRef = useRef<HTMLDivElement>(null);
  const s = useRef({
    active: null as Division['key'] | null, since: 0, tapped: null as string | null,
    target: 0, current: 0, raf: 0, last: 0, idle: undefined as ReturnType<typeof setTimeout> | undefined,
    snap: null as Snapshot | null, navigating: false, reduce: false, leaving: false,
  });

  const byKey = useCallback((k: string) => divisions.find((d) => d.key === k)!, [divisions]);

  useEffect(() => {
    s.current.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    divisions.forEach((d) => { if (!d.href.startsWith('http')) router.prefetch(d.href); });
  }, [divisions, router]);

  // ---------- preview inside the circle ----------
  const scrollPreview = useCallback((key: string, on: boolean) => {
    const shot = shotRefs.current[key], orb = orbRefs.current[key];
    if (!shot || !orb) return;
    if (on && !s.current.reduce) {
      const travel = Math.max(0, shot.offsetHeight - orb.offsetHeight);
      const secs = Math.min(18, Math.max(7, travel / 230));
      shot.style.transition = `transform ${secs}s cubic-bezier(.37,0,.32,1) .45s, opacity .7s`;
      shot.style.transform = `translate(-50%, ${-travel}px)`;
    } else {
      shot.style.transition = 'transform 1.1s cubic-bezier(.16,1,.3,1), opacity .7s';
      shot.style.transform = 'translate(-50%, 0)';
    }
  }, []);

  /** Pin the preview where it is so the zoom starts from exactly what the visitor sees. */
  const freezePreview = useCallback((key: string) => {
    const shot = shotRefs.current[key];
    if (!shot) return;
    const m = new DOMMatrixReadOnly(getComputedStyle(shot).transform);
    shot.style.transition = 'none';
    shot.style.transform = `translate(-50%, ${m.m42}px)`;
  }, []);

  // ---------- one frame of the enter animation ----------
  const render = useCallback((key: string, p: number) => {
    const st = s.current;
    const portal = portalRef.current, root = rootRef.current;
    const bar = barRefs.current[key];
    if (bar) {
      const len = bar.getTotalLength();
      bar.style.strokeDasharray = `${len}`;
      bar.style.strokeDashoffset = `${len * (1 - p)}`;
    }
    // Everything else in the hero steps back as the circle takes over.
    (root?.closest('[data-scene]') as HTMLElement | null)?.style.setProperty('--enter', p.toFixed(4));
    if (!portal) return;
    if (p <= .0005 || !st.snap) { portal.dataset.on = 'false'; return; }
    const e = easeInOut(p);
    const vw = innerWidth, vh = innerHeight;
    const { cx, cy, r, shotX, shotY, shotW } = st.snap;
    const far = Math.hypot(vw, vh);
    const ccx = lerp(cx, vw / 2, e), ccy = lerp(cy, vh / 2, e);
    portal.style.clipPath = `circle(${lerp(r, far, e)}px at ${ccx}px ${ccy}px)`;
    // Zoom from the preview in the circle to the very same content at real page scale.
    const { endX, endY, endW } = st.snap;
    portal.style.backgroundSize = `${lerp(shotW, endW, e)}px auto`;
    portal.style.backgroundPosition = `${lerp(shotX, endX, e)}px ${lerp(shotY, endY, e)}px`;
    portal.style.opacity = `${smoothstep(0, .12, p)}`;
    portal.dataset.on = 'true';
  }, []);

  const navigate = useCallback((key: string) => {
    const st = s.current;
    if (st.navigating) return;
    st.navigating = true;
    try { localStorage.setItem('awq-last', key); } catch {}
    const href = byKey(key).href;
    // Tell the destination page where to open, so it matches the last frame of the zoom.
    try {
      const handoff: EnterHandoff = { path: decodeURI(new URL(href, location.href).pathname), y: Math.round(st.snap?.pageY ?? 0), at: Date.now() };
      sessionStorage.setItem(ENTER_KEY, JSON.stringify(handoff));
    } catch {}
    if (href.startsWith('http')) window.location.assign(href); else router.push(href, { scroll: false });
  }, [byKey, router]);

  const takeSnapshot = useCallback((key: string) => {
    const orb = orbRefs.current[key], shot = shotRefs.current[key];
    const portal = portalRef.current;
    if (!orb || !shot || !portal) return;
    freezePreview(key);
    const o = orb.getBoundingClientRect(), sh = shot.getBoundingClientRect();
    const d = byKey(key);
    portal.style.backgroundImage = `url("${innerWidth < 761 ? d.previewMobile : d.previewHd}"), url("${d.preview.src}")`;
    portal.style.backgroundColor = key === 'plus' ? '#ffffff' : '#faf7f5';
    const vw = innerWidth, vh = innerHeight;
    let endW = vw, endX = 0, endY = 0, pageY = 0;
    if (vw >= 761) {
      // Keep whatever the circle is showing in view: the page content at the circle's centre
      // lands at the centre of the screen, at the screenshot's natural width.
      endW = Math.min(vw, SHOT_PAGE_WIDTH);
      endX = (vw - endW) / 2;
      const k = SHOT_PAGE_WIDTH / endW;
      const pageHeight = (d.preview.height / d.preview.width) * SHOT_PAGE_WIDTH;
      const centre = ((o.top + o.height / 2 - sh.top) / sh.width) * SHOT_PAGE_WIDTH;
      pageY = Math.max(0, Math.min(pageHeight - vh * k, centre - (vh / 2) * k));
      endY = -pageY / k;
    }
    s.current.snap = {
      cx: o.left + o.width / 2, cy: o.top + o.height / 2, r: o.width / 2,
      shotX: sh.left, shotY: sh.top, shotW: sh.width, endX, endY, endW, pageY,
    };
  }, [byKey, freezePreview]);

  /** One frame of the critically damped follow (target → current). Returns false when at rest. */
  const step = useCallback((now: number): boolean => {
    const st = s.current;
    const key = st.active;
    if (!key) return false;
    const dt = Math.min(.05, (now - (st.last || now)) / 1000);
    st.last = now;
    const k = st.target >= 1 && st.current > COMMIT_AT ? STIFFNESS * 1.6 : STIFFNESS;
    st.current += (st.target - st.current) * (1 - Math.exp(-k * dt));
    if (Math.abs(st.target - st.current) < .0008) st.current = st.target;
    if (st.current > 0 && !st.snap) takeSnapshot(key);
    render(key, st.current);
    if (st.target >= 1 && st.current >= .985) { render(key, 1); navigate(key); return false; }
    if (st.current === 0 && st.target === 0) {
      st.snap = null; st.last = 0;
      if (st.leaving) {
        // The pointer left mid-zoom: now that we're back at rest, release the circle.
        st.leaving = false; st.active = null;
        scrollPreview(key, false);
        setActive(null);
      } else {
        scrollPreview(key, true); // resume the gentle preview scroll
      }
      return false;
    }
    return true;
  }, [navigate, render, scrollPreview, takeSnapshot]);

  const drive = useCallback((target: number) => {
    const st = s.current;
    st.target = clamp01(target);
    if (st.raf) return;
    st.last = 0;
    st.raf = requestAnimationFrame(function loop(now) {
      st.raf = step(now) ? requestAnimationFrame(loop) : 0;
    });
  }, [step]);

  const settle = useCallback(() => {
    const st = s.current;
    clearTimeout(st.idle);
    st.idle = setTimeout(() => drive(st.target >= COMMIT_AT ? 1 : 0), IDLE_MS);
  }, [drive]);

  // ---------- hover / focus ----------
  const activate = useCallback((key: Division['key']) => {
    const st = s.current;
    if (st.active === key) { st.leaving = false; return; } // pointer came back mid-glide
    if (st.navigating) return;
    if (st.active) { scrollPreview(st.active, false); render(st.active, 0); }
    st.active = key; st.since = performance.now(); st.target = 0; st.current = 0; st.snap = null; st.leaving = false;
    setActive(key);
    scrollPreview(key, true);
    // Warm the high-resolution preview used for the zoom.
    const img = new Image(); img.src = byKey(key).previewHd;
  }, [byKey, render, scrollPreview]);

  const deactivate = useCallback((key: string) => {
    const st = s.current;
    if (st.navigating || st.active !== key || st.current > 0) {
      // Mid-zoom: let the spring glide back before releasing the circle.
      if (st.active === key && st.current > 0 && !st.navigating) { st.leaving = true; drive(0); }
      return;
    }
    scrollPreview(key, false);
    render(key, 0);
    st.active = null;
    setActive(null);
  }, [drive, render, scrollPreview]);

  const enterNow = useCallback((key: Division['key']) => {
    const st = s.current;
    if (st.reduce) return navigate(key);
    activate(key);
    st.since = 0;
    drive(1);
  }, [activate, drive, navigate]);

  // ---------- wheel + swipe ----------
  useEffect(() => {
    const st = s.current;
    const onWheel = (e: WheelEvent) => {
      if (st.navigating || !st.active) return;
      if (st.target === 0 && performance.now() - st.since < INTENT_MS) return; // just passing by
      const raw = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY;
      if (st.target === 0 && raw < 0) return; // scrolling up with nothing to undo → page scrolls
      e.preventDefault();
      const step = Math.max(-MAX_STEP, Math.min(MAX_STEP, raw));
      drive(st.target + step / WHEEL_RANGE);
      settle();
    };
    let ty: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      const onActive = st.active && orbRefs.current[st.active]?.closest('a')?.contains(e.target as Node);
      ty = onActive ? e.touches[0].clientY : null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!st.active || ty === null || st.navigating) return;
      const dy = ty - e.touches[0].clientY;
      ty = e.touches[0].clientY;
      if (e.cancelable) e.preventDefault();
      drive(st.target + dy / SWIPE_RANGE);
    };
    const onTouchEnd = () => { if (ty !== null && st.active && !st.navigating) drive(st.target >= COMMIT_AT ? 1 : 0); ty = null; };
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return; // back/forward cache: reset the scene
      st.navigating = false; st.target = 0; st.current = 0; st.snap = null;
      if (portalRef.current) portalRef.current.dataset.on = 'false';
      divisions.forEach((d) => { scrollPreview(d.key, false); render(d.key, 0); });
      st.active = null; st.tapped = null; setActive(null);
    };
    addEventListener('wheel', onWheel, { passive: false });
    addEventListener('touchstart', onTouchStart, { passive: true });
    addEventListener('touchmove', onTouchMove, { passive: false });
    addEventListener('touchend', onTouchEnd);
    addEventListener('pageshow', onPageShow);
    return () => {
      removeEventListener('wheel', onWheel);
      removeEventListener('touchstart', onTouchStart);
      removeEventListener('touchmove', onTouchMove);
      removeEventListener('touchend', onTouchEnd);
      removeEventListener('pageshow', onPageShow);
      cancelAnimationFrame(st.raf);
      clearTimeout(st.idle);
    };
  }, [divisions, drive, render, scrollPreview, settle]);

  return (
    <>
      <div className={styles.circles} ref={rootRef} data-active={active ?? undefined}>
        {divisions.map((d) => (
          <a
            key={d.key}
            id={`division-${d.key}`}
            href={d.href}
            className={styles.circle}
            data-brand={d.key}
            data-active={active === d.key || undefined}
            aria-label={`${d.name}: ${d.tagline}. ${copy.explore}`}
            onMouseEnter={() => !touch && activate(d.key)}
            onMouseLeave={() => !touch && deactivate(d.key)}
            onFocus={() => activate(d.key)}
            onBlur={() => deactivate(d.key)}
            onClick={(e) => {
              e.preventDefault();
              if (touch && s.current.tapped !== d.key) {
                s.current.tapped = d.key;
                activate(d.key);
                setAnnouncement(`${d.name}. ${copy.previewAnnouncement}`);
                return;
              }
              enterNow(d.key);
            }}
          >
            <div className={styles.orbWrap}>
              <div className={styles.orb} ref={(el) => { orbRefs.current[d.key] = el; }}>
                <div className={styles.shot} ref={(el) => { shotRefs.current[d.key] = el; }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- long screenshot, moved by hand */}
                  <img src={d.preview.src} width={d.preview.width} height={d.preview.height} alt="" loading="lazy" decoding="async" />
                </div>
                <div className={styles.face}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={styles.logo} src={d.logo.src} width={d.logo.width} height={d.logo.height} alt="" />
                  <span className={styles.tagline}>{d.tagline}</span>
                  <span className={styles.explore}>
                    {copy.explore} <span className={styles.arrow} aria-hidden="true">→</span>
                  </span>
                </div>
              </div>
              <svg className={styles.ring} viewBox="0 0 100 100" aria-hidden="true">
                <circle className={styles.bar} cx="50" cy="50" r="49" ref={(el) => { barRefs.current[d.key] = el; }} />
              </svg>
            </div>
            <span className={styles.hint} aria-hidden="true">{touch ? copy.hintTouch : copy.hintScroll}</span>
          </a>
        ))}
      </div>
      {/* On <body> so the zoom sits above the fixed header */}
      {isClient && createPortal(<div className={styles.portal} ref={portalRef} data-on="false" aria-hidden="true" />, document.body)}
      <p className="sr-only" aria-live="polite">{announcement}</p>
    </>
  );
}
