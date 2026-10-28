'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import styles from './tabs.module.css';

type Tab = { key: string; label: string; count?: number; icon?: ReactNode; panel: ReactNode };

/**
 * Segmented control with a sliding indicator (roving tabindex, arrow keys,
 * Home/End). Panels are rendered on the server and only shown/hidden here.
 */
export default function Tabs({ label, tabs, idPrefix, aside }: { label: string; idPrefix: string; tabs: Tab[]; aside?: ReactNode }) {
  const [selected, setSelected] = useState(tabs[0]?.key);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);

  // Measure the active tab so the indicator can slide to it.
  useLayoutEffect(() => {
    const measure = () => {
      const i = tabs.findIndex((t) => t.key === selected);
      const btn = refs.current[i];
      const list = listRef.current;
      if (!btn || !list) return;
      setIndicator({ x: btn.offsetLeft, w: btn.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (listRef.current) ro.observe(listRef.current);
    return () => ro.disconnect();
  }, [selected, tabs]);

  const choose = (i: number) => {
    setSelected(tabs[i].key);
    refs.current[i]?.focus();
    refs.current[i]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const rtl = document.documentElement.dir === 'rtl';
    const forward = e.key === (rtl ? 'ArrowLeft' : 'ArrowRight');
    const back = e.key === (rtl ? 'ArrowRight' : 'ArrowLeft');
    if (!forward && !back && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    choose(e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (forward ? 1 : tabs.length - 1)) % tabs.length);
  };

  return (
    <div>
      <div className={styles.bar}>
        <div className={styles.scroller}>
          <div className={styles.list} role="tablist" aria-label={label} ref={listRef}>
            {indicator && (
              <span className={styles.indicator} aria-hidden="true" style={{ width: indicator.w, transform: `translateX(${indicator.x}px)` }} />
            )}
            {tabs.map((tab, i) => (
              <button
                key={tab.key}
                ref={(el) => { refs.current[i] = el; }}
                type="button"
                role="tab"
                id={`${idPrefix}-tab-${tab.key}`}
                aria-controls={`${idPrefix}-panel-${tab.key}`}
                aria-selected={selected === tab.key}
                tabIndex={selected === tab.key ? 0 : -1}
                className={styles.tab}
                onClick={() => choose(i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                {tab.icon && <span className={styles.icon} aria-hidden="true">{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.count !== undefined && <span className={styles.count}>{tab.count}</span>}
              </button>
            ))}
          </div>
        </div>
        {aside}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.key}
          role="tabpanel"
          id={`${idPrefix}-panel-${tab.key}`}
          aria-labelledby={`${idPrefix}-tab-${tab.key}`}
          hidden={selected !== tab.key}
          className={styles.panel}
          tabIndex={0}
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
