'use client';

import type { ReactNode } from 'react';
import { Close, Filter } from './icons';
import styles from './shop.module.css';

/**
 * Wraps the shop filters. On desktop the <dialog> is shown inline as a sticky
 * sidebar (see shop.module.css); on smaller screens it is closed by default and
 * opens as a slide-over drawer from the "Filters" button.
 */
export function FilterDrawer({ title, closeLabel, showLabel, children }: { title: string; closeLabel: string; showLabel: string; children: ReactNode }) {
  return (
    <dialog
      id="shop-filters"
      className={styles.drawer}
      aria-label={title}
      onClick={(e) => {
        const dialog = e.currentTarget;
        // Close when a filter link is chosen, or when the backdrop is clicked
        if ((e.target as HTMLElement).closest('a') || e.target === dialog) { if (dialog.open && dialog.matches(':modal')) dialog.close(); }
      }}
    >
      <div className={styles.drawerHead}>
        <h2>{title}</h2>
        <button type="button" aria-label={closeLabel} onClick={(e) => (e.currentTarget.closest('dialog') as HTMLDialogElement).close()}>
          <Close />
        </button>
      </div>
      {children}
      <div className={styles.drawerFoot}>
        <button type="button" className={styles.showResults} onClick={(e) => (e.currentTarget.closest('dialog') as HTMLDialogElement).close()}>
          {showLabel}
        </button>
      </div>
    </dialog>
  );
}

export function FilterButton({ label, active }: { label: string; active: number }) {
  return (
    <button
      type="button"
      className={styles.filterToggle}
      aria-haspopup="dialog"
      aria-controls="shop-filters"
      onClick={() => (document.getElementById('shop-filters') as HTMLDialogElement | null)?.showModal()}
    >
      <Filter /> {label}
      {active > 0 && <span className={styles.filterBadge}>{active}</span>}
    </button>
  );
}
