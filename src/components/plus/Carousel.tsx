'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Arrow } from './icons';
import styles from './carousel.module.css';

/**
 * Horizontal, scroll-snapping row. Works with trackpads, shift+wheel, touch,
 * mouse drag, the arrow buttons and the keyboard (the track is focusable).
 * Children are rendered on the server; this only adds the controls.
 */
export default function Carousel({ label, prevLabel, nextLabel, children, variant }: {
  label: string; prevLabel: string; nextLabel: string; children: ReactNode; variant?: 'wide';
}) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft); // negative in RTL
    setEdges({ start: pos <= 4, end: pos >= max - 4 });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', update); ro.disconnect(); };
  }, [update]);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === 'rtl';
    el.scrollBy({ left: dir * (rtl ? -1 : 1) * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  // Mouse drag (touch and trackpads scroll natively)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !track.current) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || !track.current) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) {
      d.moved = true;
      track.current.dataset.dragging = '';
      track.current.scrollLeft = d.left - dx;
    }
  };
  const endDrag = () => {
    if (track.current) delete track.current.dataset.dragging;
    setTimeout(() => { drag.current = null; }, 0);
  };
  // A drag shouldn't trigger the link underneath
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current?.moved) { e.preventDefault(); e.stopPropagation(); }
  };

  return (
    <div className={styles.wrap} data-reveal data-variant={variant} data-at-start={edges.start || undefined} data-at-end={edges.end || undefined}>
      <div
        ref={track}
        className={styles.track}
        role="region"
        aria-label={label}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
      >
        {children}
      </div>
      <div className={styles.controls}>
        <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => page(-1)} disabled={edges.start} aria-label={prevLabel}>
          <Arrow />
        </button>
        <button type="button" className={styles.nav} onClick={() => page(1)} disabled={edges.end} aria-label={nextLabel}>
          <Arrow />
        </button>
      </div>
    </div>
  );
}
