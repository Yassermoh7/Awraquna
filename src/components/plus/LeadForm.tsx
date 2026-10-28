'use client';

import { useActionState, useId, useState } from 'react';
import { submitLead, type FormState } from '@/app/actions';
import { plusCopy } from '@/content/plus';
import type { Locale } from '@/lib/i18n';
import ui from './ui.module.css';

export type LeadField = {
  name: string;               // form field name; extra fields use the "detail_" prefix
  label: string;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'number';
  options?: string[];
  required?: boolean;
  hint?: string;
  wide?: boolean;
  autoComplete?: string;
};

type Props = {
  lang: Locale;
  source: 'plus-contact' | 'plus-bulk-quote';
  subject: string;
  title?: string;
  intro?: string;
  submitLabel: string;
  fields: LeadField[];
};

const initial: FormState = { status: 'idle' };

/** Enquiry form backed by the shared submitLead server action. */
export default function LeadForm({ lang, source, subject, title, intro, submitLabel, fields }: Props) {
  const t = plusCopy[lang];
  const uid = useId();
  const [state, action, pending] = useActionState(submitLead, initial);
  // "Send another" hides the current success message and remounts an empty form.
  const [dismissed, setDismissed] = useState<string | null>(null);
  const showSuccess = state.status === 'success' && state.reference !== dismissed;

  if (showSuccess) {
    return (
      <div className={ui.success} role="status" aria-live="polite">
        <h3>{t.contact.successTitle}</h3>
        <p>{t.contact.successText}</p>
        <p>{t.contact.reference}: <span className={ui.reference} dir="ltr">{state.reference}</span></p>
        <button type="button" className={`${ui.btn} ${ui.ghost} ${ui.sm}`} style={{ marginTop: 12 }} onClick={() => setDismissed(state.reference)}>
          {t.contact.another}
        </button>
      </div>
    );
  }

  const invalid = (f: string) => state.status === 'error' && !!state.fields?.includes(f);
  const emailOrPhoneMissing = invalid('email') && invalid('phone');
  const errorText = (f: string) =>
    emailOrPhoneMissing && (f === 'email' || f === 'phone') ? t.forms.fieldErrors.emailOrPhone : t.forms.fieldErrors[f.replace(/^detail_/, '')] ?? t.forms.fieldErrors.name;
  const required = fields.filter((f) => f.required && !['name', 'email', 'phone'].includes(f.name)).map((f) => f.name).join(',');

  return (
    <form action={action} noValidate key={dismissed ?? 'form'}>
      {title && <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 34, fontWeight: 600, lineHeight: 1.08, marginBottom: 8 }}>{title}</h3>}
      {intro && <p className={ui.hint} style={{ fontSize: 15, marginBottom: 18 }}>{intro}</p>}
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="subject" value={subject} />
      <input type="hidden" name="required" value={required} />
      <div className={ui.honeypot} aria-hidden="true">
        <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {state.status === 'error' && <p className={ui.alert} role="alert" style={{ marginBottom: 16 }}>{t.forms.errors[state.error]}</p>}

      <div className={ui.formGrid}>
        {fields.map((f) => {
          const id = `${uid}-${f.name}`;
          const bad = invalid(f.name);
          const common = {
            id, name: f.name, required: f.required,
            'aria-invalid': bad || undefined,
            'aria-describedby': [bad ? `${id}-err` : '', f.hint ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined,
          };
          return (
            <div key={f.name} className={`${ui.field} ${f.wide || f.type === 'textarea' ? ui.span2 : ''}`}>
              <label htmlFor={id}>
                {f.label} {!f.required && <small>({t.cart.optional})</small>}
              </label>
              {f.type === 'textarea' ? (
                <textarea className={ui.textarea} rows={5} {...common} />
              ) : f.type === 'select' ? (
                <select className={ui.select} {...common} defaultValue={f.options?.[0]}>
                  {f.options?.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  className={ui.input}
                  type={f.type ?? 'text'}
                  autoComplete={f.autoComplete}
                  dir={f.type === 'email' || f.type === 'tel' ? 'ltr' : undefined}
                  inputMode={f.type === 'tel' ? 'tel' : f.type === 'number' ? 'numeric' : undefined}
                  min={f.type === 'number' ? 1 : undefined}
                  {...common}
                />
              )}
              {f.hint && <span className={ui.hint} id={`${id}-hint`}>{f.hint}</span>}
              {bad && <span className={ui.fieldError} id={`${id}-err`}>{errorText(f.name)}</span>}
            </div>
          );
        })}
      </div>
      <p className={ui.hint} style={{ margin: '14px 0' }}>{t.contact.contactHint}</p>
      <button className={`${ui.btn} ${ui.primary}`} type="submit" disabled={pending}>{pending ? t.contact.sending : submitLabel}</button>
    </form>
  );
}
