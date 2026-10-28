'use client';

import { useActionState, useId, useState } from 'react';
import { submitLead, type FormState } from '@/app/actions';
import type { Locale } from '@/lib/i18n';
import { fill, type LegalDict } from '@/content/legal';
import styles from './legal.module.css';

type State = FormState & { values?: Record<string, string> };
type ContactT = LegalDict['contact'];

/**
 * React resets uncontrolled forms after an action runs. Echo the submitted
 * values back so fields keep what the visitor typed when validation fails.
 */
async function leadAction(prev: State, fd: FormData): Promise<State> {
  const result = await submitLead(prev, fd);
  const values: Record<string, string> = {};
  fd.forEach((v, k) => { if (typeof v === 'string') values[k] = v; });
  return { ...result, values: result.status === 'success' ? {} : values };
}

function errorFor(name: string, state: State, t: ContactT['errors']): string | undefined {
  if (state.status !== 'error' || !state.fields?.includes(name)) return undefined;
  const v = state.values ?? {};
  if ((name === 'email' || name === 'phone') && !v.email && !v.phone) return t.emailOrPhone;
  if (name === 'email' && v.email) return t.email;
  if (name === 'phone' && v.phone) return t.phone;
  return t.required;
}

function Field({ name, label, hint, error, type = 'text', required, full, defaultValue, autoComplete, as = 'input', children, dir }: {
  name: string; label: string; hint?: string; error?: string; type?: string; required?: boolean; full?: boolean;
  defaultValue?: string; autoComplete?: string; as?: 'input' | 'textarea' | 'select'; children?: React.ReactNode; dir?: 'ltr';
}) {
  const id = useId();
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(' ') || undefined;
  const common = { id, name, required, defaultValue, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy };
  return (
    <div className={`${styles.field} ${full ? styles.full : ''}`} data-invalid={error ? true : undefined}>
      <label htmlFor={id}>{label}</label>
      {as === 'textarea' ? <textarea {...common} /> : as === 'select' ? <select {...common}>{children}</select> : <input {...common} type={type} autoComplete={autoComplete} dir={dir} />}
      {hint && <span id={`${id}-hint`} className={styles.hint}>{hint}</span>}
      {error && <span id={`${id}-err`} className={styles.err}>{error}</span>}
    </div>
  );
}

function Hidden({ lang, source, subject, required }: { lang: Locale; source: string; subject: string; required?: string }) {
  return (
    <>
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="subject" value={subject} />
      {required && <input type="hidden" name="required" value={required} />}
      <div className={styles.honeypot} aria-hidden="true">
        <label>Website <input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
    </>
  );
}

function Status({ state, pending, t }: { state: State; pending: boolean; t: ContactT }) {
  return (
    <p className={`${styles.status} ${state.status === 'error' ? styles.statusError : ''}`} role="status" aria-live="polite">
      {pending ? t.sending : state.status === 'error' ? t.errors[state.error === 'failed' ? 'failed' : 'invalid'] : ''}
    </p>
  );
}

function Success({ t, reference }: { t: ContactT; reference: string }) {
  return (
    <div className={styles.success} role="status" aria-live="polite" tabIndex={-1}>
      <h3>{t.success.title}</h3>
      <p>{fill(t.success.text, { ref: reference })}</p>
    </div>
  );
}

const ContactFields = ({ t, state }: { t: ContactT; state: State }) => {
  const v = state.values ?? {};
  return (
    <>
      <Field name="name" label={t.fields.name} required autoComplete="name" defaultValue={v.name} error={errorFor('name', state, t.errors)} />
      <Field name="company" label={t.fields.company} autoComplete="organization" defaultValue={v.company} />
      <Field name="email" type="email" label={t.fields.email} autoComplete="email" defaultValue={v.email} error={errorFor('email', state, t.errors)} hint={t.fields.contactHint} dir="ltr" />
      <Field name="phone" type="tel" label={t.fields.phone} autoComplete="tel" defaultValue={v.phone} error={errorFor('phone', state, t.errors)} dir="ltr" />
    </>
  );
};

export function ConsultationForm({ lang, t, services, initialService }: {
  lang: Locale; t: ContactT; services: { slug: string; title: string }[]; initialService?: string;
}) {
  const [state, action, pending] = useActionState<State, FormData>(leadAction, { status: 'idle' });
  if (state.status === 'success') return <Success t={t} reference={state.reference} />;
  const v = state.values ?? {};
  return (
    <form action={action} className={styles.form} noValidate>
      <Hidden lang={lang} source="legal-consultation" subject="Consultation request" />
      <ContactFields t={t} state={state} />
      <Field name="detail_service" label={t.fields.service} as="select" full defaultValue={v.detail_service ?? initialService ?? ''}>
        <option value="">{t.fields.serviceAny}</option>
        {services.map((s) => <option key={s.slug} value={s.title}>{s.title}</option>)}
      </Field>
      <fieldset className={`${styles.field} ${styles.radios} ${styles.full}`}>
        <legend>{t.fields.contactMethod}</legend>
        <div className={styles.radioRow}>
          {(Object.keys(t.fields.methods) as (keyof ContactT['fields']['methods'])[]).map((m, i) => (
            <label key={m}>
              <input type="radio" name="detail_contactMethod" value={t.fields.methods[m]} defaultChecked={v.detail_contactMethod ? v.detail_contactMethod === t.fields.methods[m] : i === 0} />
              {t.fields.methods[m]}
            </label>
          ))}
        </div>
      </fieldset>
      <Field name="message" label={t.fields.message} as="textarea" full hint={t.fields.messageHint} defaultValue={v.message} />
      <div className={`${styles.formFoot} ${styles.full}`}>
        <button className={`${styles.btn} ${styles.btnFig}`} type="submit" disabled={pending}>
          {t.consultation.submit} <span className={styles.arrow} aria-hidden="true">→</span>
        </button>
        <Status state={state} pending={pending} t={t} />
      </div>
    </form>
  );
}

export function TrademarkForm({ lang, t }: { lang: Locale; t: ContactT }) {
  const [state, action, pending] = useActionState<State, FormData>(leadAction, { status: 'idle' });
  if (state.status === 'success') return <Success t={t} reference={state.reference} />;
  const v = state.values ?? {};
  const countries = t.fields.countryOptions;
  return (
    <form action={action} className={styles.form} noValidate>
      <Hidden lang={lang} source="legal-trademark-check" subject="Trademark availability check" required="detail_mark,detail_goods" />
      <Field name="detail_mark" label={t.fields.markName} hint={t.fields.markHint} required full defaultValue={v.detail_mark} error={errorFor('detail_mark', state, t.errors)} />
      <Field name="detail_goods" label={t.fields.goods} hint={t.fields.goodsHint} as="textarea" required full defaultValue={v.detail_goods} error={errorFor('detail_goods', state, t.errors)} />
      <fieldset className={`${styles.field} ${styles.radios} ${styles.full}`}>
        <legend>{t.fields.countries}</legend>
        <div className={styles.radioRow}>
          {(['sa', 'eg', 'both'] as const).map((c) => (
            <label key={c}>
              <input type="radio" name="detail_countries" value={countries[c]} defaultChecked={v.detail_countries ? v.detail_countries === countries[c] : c === 'both'} />
              {countries[c]}
            </label>
          ))}
        </div>
      </fieldset>
      <Field name="detail_logo" label={t.fields.logo} hint={t.fields.logoHint} full defaultValue={v.detail_logo} />
      <ContactFields t={t} state={state} />
      <div className={`${styles.formFoot} ${styles.full}`}>
        <button className={`${styles.btn} ${styles.btnFig}`} type="submit" disabled={pending}>
          {t.trademark.submit} <span className={styles.arrow} aria-hidden="true">→</span>
        </button>
        <Status state={state} pending={pending} t={t} />
      </div>
    </form>
  );
}

/** Two forms behind tabs; the initial tab comes from ?form=trademark. */
export function ContactTabs({ lang, t, services, initial, initialService }: {
  lang: Locale; t: ContactT; services: { slug: string; title: string }[]; initial: 'consultation' | 'trademark'; initialService?: string;
}) {
  const [tab, setTab] = useState(initial);
  const id = useId();
  const tabs = ['consultation', 'trademark'] as const;
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const next = tab === 'consultation' ? 'trademark' : 'consultation';
    setTab(next);
    document.getElementById(`${id}-${next}`)?.focus();
  };
  return (
    <div>
      <div className={styles.tabs} role="tablist" onKeyDown={onKey}>
        {tabs.map((k) => (
          <button key={k} id={`${id}-${k}`} type="button" role="tab" aria-selected={tab === k} aria-controls={`${id}-${k}-panel`} tabIndex={tab === k ? 0 : -1} onClick={() => setTab(k)}>
            {t[k].tab}
          </button>
        ))}
      </div>
      {tabs.map((k) => (
        <div key={k} id={`${id}-${k}-panel`} role="tabpanel" aria-labelledby={`${id}-${k}`} hidden={tab !== k}>
          <div className={styles.formIntro}>
            <h2>{t[k].title}</h2>
            <p>{t[k].text}</p>
          </div>
          {k === 'consultation'
            ? <ConsultationForm lang={lang} t={t} services={services} initialService={initialService} />
            : <TrademarkForm lang={lang} t={t} />}
        </div>
      ))}
    </div>
  );
}

export function NewsletterForm({ lang, t, errors }: { lang: Locale; t: LegalDict['resources']['newsletter']; errors: ContactT['errors'] }) {
  const [state, action, pending] = useActionState<State, FormData>(leadAction, { status: 'idle' });
  const id = useId();
  return (
    <>
      {state.status !== 'success' && (
        <form action={action} className={styles.newsForm} noValidate>
          <Hidden lang={lang} source="legal-contact" subject="Newsletter signup" required="email" />
          <input type="hidden" name="name" value="Newsletter subscriber" />
          <label htmlFor={id} className="sr-only">{t.label}</label>
          <input id={id} name="email" type="email" required autoComplete="email" placeholder={t.label} defaultValue={state.values?.email} dir="ltr" aria-invalid={state.status === 'error' || undefined} />
          <button className={`${styles.btn} ${styles.btnFig}`} type="submit" disabled={pending}>
            {t.submit} <span className={styles.arrow} aria-hidden="true">→</span>
          </button>
        </form>
      )}
      <p className={styles.newsStatus} role="status" aria-live="polite">
        {state.status === 'success' ? t.success : state.status === 'error' ? (state.error === 'failed' ? errors.failed : errors.email) : ''}
      </p>
    </>
  );
}
