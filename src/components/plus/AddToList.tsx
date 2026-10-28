'use client';

import { useEffect, useState } from 'react';
import { plusCopy } from '@/content/plus';
import type { Locale } from '@/lib/i18n';
import { Check, Minus, Plus } from './icons';
import { useOrderList, type OrderUnit } from './order-list';
import styles from './add.module.css';

/**
 * "Add to list" on product cards. Once the product is in the order list the
 * button becomes a compact stepper (− qty +) showing the quantity in the list,
 * so customers can see and adjust what they've added without leaving the page.
 * `compact` renders a round icon button (a full-width button on narrow cards).
 */
export default function AddToList({ lang, id, name, unit, compact }: { lang: Locale; id: number; name: string; unit: OrderUnit; compact?: boolean }) {
  const t = plusCopy[lang].common;
  const { ready, items, add, update, remove } = useOrderList();
  const [done, setDone] = useState(false);
  const item = ready ? items.find((i) => i.id === id) : undefined;

  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(timer);
  }, [done]);

  if (item) {
    const unitLabel = item.qty === 1 ? t.unitOne[item.unit] : t.units[item.unit];
    return (
      <div className={compact ? styles.stepperCompact : styles.stepper} role="group" aria-label={`${t.inList}: ${name}`}>
        <button
          type="button"
          aria-label={item.qty === 1 ? `${t.remove}: ${name}` : `${t.decrease}: ${name}`}
          onClick={() => (item.qty <= 1 ? remove(id) : update(id, { qty: item.qty - 1 }))}
        >
          <Minus />
        </button>
        <output aria-live="polite" title={`${item.qty} ${unitLabel}`}>
          {item.qty}
          <span className={styles.unitHint}> {unitLabel}</span>
        </output>
        <button type="button" aria-label={`${t.increase}: ${name}`} onClick={() => update(id, { qty: item.qty + 1 })}>
          <Plus />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={compact ? styles.compact : styles.add}
      data-done={done || undefined}
      aria-label={`${t.addToList}: ${name}`}
      title={t.addToList}
      onClick={() => { add(id, 1, unit, t.addedToast(name)); setDone(true); }}
    >
      {done ? <Check /> : <Plus />}
      <span className={styles.label}>{done ? t.added : t.addToList}</span>
    </button>
  );
}
