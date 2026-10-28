'use client';

import { useState, useSyncExternalStore } from 'react';
import { plusCopy } from '@/content/plus';
import type { Locale } from '@/lib/i18n';
import LeadForm, { type LeadField } from './LeadForm';
import styles from './contact.module.css';

type Mode = 'general' | 'bulk';

const subscribeHash = (cb: () => void) => {
  addEventListener('hashchange', cb);
  return () => removeEventListener('hashchange', cb);
};

/**
 * One enquiry form with a segmented switch: "General enquiry" or "Bulk or
 * recurring supply". Switching swaps the fields in place. Opens in bulk mode
 * for /contactus?type=bulk (or the older #bulk links).
 */
export default function ContactForm({ lang, initialMode }: { lang: Locale; initialMode: Mode }) {
  const c = plusCopy[lang].contact;
  const hash = useSyncExternalStore(subscribeHash, () => location.hash, () => '');
  const [chosen, setChosen] = useState<Mode | null>(null);
  const mode: Mode = chosen ?? (hash === '#bulk' ? 'bulk' : initialMode);

  const base: LeadField[] = [
    { name: 'name', label: c.name, required: true, autoComplete: 'name' },
    { name: 'company', label: c.company, required: mode === 'bulk', autoComplete: 'organization' },
    { name: 'email', label: c.email2, type: 'email', autoComplete: 'email' },
    { name: 'phone', label: c.phone2, type: 'tel', autoComplete: 'tel' },
  ];
  const fields: LeadField[] = mode === 'general'
    ? [
        ...base,
        { name: 'detail_topic', label: c.subject, type: 'select', options: c.subjects, wide: true },
        { name: 'message', label: c.message, type: 'textarea', required: true },
      ]
    : [
        ...base,
        { name: 'detail_city', label: c.city, autoComplete: 'address-level2' },
        { name: 'detail_branches', label: c.branches, type: 'number' },
        { name: 'detail_products', label: c.products, type: 'textarea', required: true, hint: c.productsHint },
        { name: 'detail_frequency', label: c.frequency, type: 'select', options: c.frequencies, wide: true },
      ];

  const options: { key: Mode; label: string }[] = [
    { key: 'general', label: c.contactTab },
    { key: 'bulk', label: c.bulkTab },
  ];

  return (
    <div className={styles.formWrap} id="bulk">
      <div className={styles.toggle} role="radiogroup" aria-label={c.tabsLabel}>
        <span className={styles.thumb} data-pos={mode} aria-hidden="true" />
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            role="radio"
            aria-checked={mode === o.key}
            className={styles.option}
            onClick={() => setChosen(o.key)}
            onKeyDown={(e) => {
              if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault();
                const next = mode === 'general' ? 'bulk' : 'general';
                setChosen(next);
                (e.currentTarget.parentElement?.querySelector(`[data-key="${next}"]`) as HTMLButtonElement | null)?.focus();
              }
            }}
            data-key={o.key}
            tabIndex={mode === o.key ? 0 : -1}
          >
            {o.label}
          </button>
        ))}
      </div>
      <p className={styles.intro} aria-live="polite">{mode === 'bulk' ? c.bulkFormText : c.generalFormText}</p>
      <LeadForm
        key={mode}
        lang={lang}
        source={mode === 'bulk' ? 'plus-bulk-quote' : 'plus-contact'}
        subject={mode === 'bulk' ? 'Bulk / recurring supply quote — Awraquna Plus' : 'Website enquiry — Awraquna Plus'}
        submitLabel={mode === 'bulk' ? c.sendQuote : c.send}
        fields={fields}
      />
    </div>
  );
}
