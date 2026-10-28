'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useActionState, useId, useState } from 'react';
import { submitOrderRequest, type FormState } from '@/app/actions';
import { plusCopy } from '@/content/plus';
import { localePath, type Locale } from '@/lib/i18n';
import { site, whatsappLink } from '@/lib/site';
import type { ProductLite } from './helpers';
import { Minus, Plus, Trash, WhatsApp } from './icons';
import { useOrderList, type OrderUnit } from './order-list';
import styles from './cart.module.css';
import ui from './ui.module.css';

const initial: FormState = { status: 'idle' };

export default function CartView({ lang, products }: { lang: Locale; products: ProductLite[] }) {
  const t = plusCopy[lang];
  const c = t.cart;
  const { ready, items, update, remove, clear } = useOrderList();
  const [waName, setWaName] = useState({ name: '', city: '' });
  const uid = useId();

  const lines = items.flatMap((i) => {
    const p = products.find((x) => x.id === i.id);
    return p ? [{ ...i, product: p }] : [];
  });
  const missing = items.length - lines.length;

  // Clear the list only once the request has been accepted.
  const [state, formAction, pending] = useActionState(async (prev: FormState, fd: FormData) => {
    const result = await submitOrderRequest(prev, fd);
    if (result.status === 'success') clear();
    return result;
  }, initial);

  const qtyText = (qty: number, unit: OrderUnit) => `${qty} ${qty === 1 ? t.common.unitOne[unit] : t.common.units[unit]}`;
  const whatsappText = [
    c.whatsappIntro,
    ...lines.map((l) => `• ${l.product.sku} — ${l.product.name} — ${qtyText(l.qty, l.unit)}`),
    waName.name ? `\n${c.whatsappFrom(waName.name, waName.city)}` : '',
  ].filter(Boolean).join('\n');

  if (state.status === 'success') {
    return (
      <div className={`${ui.success} ${styles.done}`} role="status" aria-live="polite">
        <h2>{c.successTitle}</h2>
        <p>{c.successText}</p>
        <p>{c.reference}: <span className={ui.reference} dir="ltr">{state.reference}</span></p>
        <Link className={`${ui.btn} ${ui.primary} ${ui.sm}`} href={localePath(lang, '/shop')} style={{ marginTop: 16 }}>{c.continue}</Link>
      </div>
    );
  }

  // Until the saved list is read, show a neutral placeholder rather than a misleading "empty" state.
  if (!ready) return <div className={styles.empty} aria-busy="true" />;

  if (lines.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>{c.emptyTitle}</h2>
        <p>{c.emptyText}</p>
        <Link className={`${ui.btn} ${ui.primary}`} href={localePath(lang, '/shop')}>{c.browse}</Link>
      </div>
    );
  }

  const invalid = (f: string) => state.status === 'error' && state.fields?.includes(f);
  const fieldProps = (f: string) => ({
    id: `${uid}-${f}`, name: f,
    'aria-invalid': invalid(f) || undefined,
    'aria-describedby': invalid(f) ? `${uid}-${f}-err` : undefined,
  });
  const err = (f: string) => invalid(f) && <span className={ui.fieldError} id={`${uid}-${f}-err`}>{t.forms.fieldErrors[f]}</span>;

  return (
    <div className={styles.layout}>
      <section aria-labelledby="list-title">
        <div className={styles.listHead}>
          <h2 id="list-title">{c.count(lines.length)}</h2>
          <button type="button" className={styles.clear} onClick={clear}><Trash /> {c.clear}</button>
        </div>
        {missing > 0 && <p className={ui.alert}>{c.unavailable}</p>}
        <ul className={styles.lines}>
          {lines.map((l) => (
            <li key={l.id} className={styles.line}>
              <div className={styles.thumb}>
                {l.product.image && <Image src={l.product.image} alt="" fill sizes="80px" />}
              </div>
              <div className={styles.lineInfo}>
                <Link href={localePath(lang, `/shop/${l.product.slug}`)}>{l.product.name}</Link>
                <span dir="ltr" className={styles.sku}>{l.product.sku}</span>
                {l.product.pack && <span className={styles.pack}>{l.product.pack}</span>}
              </div>
              <div className={styles.lineControls}>
                <div className={styles.stepper} role="group" aria-label={`${c.quantity}: ${l.product.name}`}>
                  <button type="button" onClick={() => update(l.id, { qty: l.qty - 1 })} disabled={l.qty <= 1} aria-label={t.product.decrease}><Minus /></button>
                  <input
                    type="number" min={1} max={10000} inputMode="numeric" value={l.qty} aria-label={c.quantity}
                    onChange={(e) => update(l.id, { qty: e.target.valueAsNumber || 1 })}
                  />
                  <button type="button" onClick={() => update(l.id, { qty: l.qty + 1 })} aria-label={t.product.increase}><Plus /></button>
                </div>
                <select
                  className={`${ui.select} ${styles.unit}`} aria-label={`${c.unit}: ${l.product.name}`} value={l.unit}
                  onChange={(e) => update(l.id, { unit: e.target.value as OrderUnit })}
                >
                  {(l.product.unit === 'carton' || l.unit === 'carton') && <option value="carton">{t.common.units.carton}</option>}
                  <option value="unit">{t.common.units.unit}</option>
                </select>
                <button type="button" className={styles.remove} onClick={() => remove(l.id)} aria-label={c.removeItem(l.product.name)}><Trash /></button>
              </div>
            </li>
          ))}
        </ul>
        <p className={styles.note}>{t.common.priceOnRequest} — {c.intro}</p>
      </section>

      <aside className={styles.send} aria-labelledby="send-title">
        <h2 id="send-title" className="sr-only">{c.sendTitle}</h2>

        <div className={styles.panel}>
          <h3><WhatsApp className={styles.waIcon} /> {c.whatsappTitle}</h3>
          <p>{c.whatsappText}</p>
          <a className={`${ui.btn} ${ui.wa} ${ui.block}`} href={whatsappLink(site.plus.whatsapp, whatsappText)} target="_blank" rel="noopener">
            <WhatsApp /> {c.whatsappCta}
          </a>
        </div>

        <div className={styles.or}><span>{c.or}</span></div>

        <form className={styles.panel} action={formAction} noValidate>
          <h3>{c.quoteTitle}</h3>
          <p>{c.quoteText}</p>
          <input type="hidden" name="lang" value={lang} />
          <input type="hidden" name="lines" value={JSON.stringify(lines.map((l) => ({ productId: l.id, sku: l.product.sku, name: l.product.name, quantity: l.qty, unit: l.unit })))} />
          <div className={ui.honeypot} aria-hidden="true">
            <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
          </div>

          {state.status === 'error' && <p className={ui.alert} role="alert">{t.forms.errors[state.error]}</p>}

          <div className={ui.formGrid}>
            <div className={ui.field}>
              <label htmlFor={`${uid}-name`}>{c.name}</label>
              <input className={ui.input} {...fieldProps('name')} autoComplete="name" required onChange={(e) => setWaName({ ...waName, name: e.target.value })} />
              {err('name')}
            </div>
            <div className={ui.field}>
              <label htmlFor={`${uid}-phone`}>{c.phone}</label>
              <input className={ui.input} {...fieldProps('phone')} type="tel" autoComplete="tel" inputMode="tel" required dir="ltr" />
              {err('phone')}
            </div>
            <div className={ui.field}>
              <label htmlFor={`${uid}-company`}>{c.company} <small>({c.optional})</small></label>
              <input className={ui.input} {...fieldProps('company')} autoComplete="organization" />
            </div>
            <div className={ui.field}>
              <label htmlFor={`${uid}-email`}>{c.email} <small>({c.optional})</small></label>
              <input className={ui.input} {...fieldProps('email')} type="email" autoComplete="email" dir="ltr" />
              {err('email')}
            </div>
            <div className={ui.field}>
              <label htmlFor={`${uid}-city`}>{c.city}</label>
              <input className={ui.input} {...fieldProps('city')} autoComplete="address-level2" required onChange={(e) => setWaName({ ...waName, city: e.target.value })} />
              {err('city')}
            </div>
            <div className={ui.field}>
              <label htmlFor={`${uid}-payment`}>{c.payment}</label>
              <select className={ui.select} id={`${uid}-payment`} name="payment" defaultValue="">
                {t.paymentOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className={`${ui.field} ${ui.span2}`}>
              <label htmlFor={`${uid}-address`}>{c.address} <small>({c.optional})</small></label>
              <input className={ui.input} {...fieldProps('address')} autoComplete="street-address" />
            </div>
            <div className={`${ui.field} ${ui.span2}`}>
              <label htmlFor={`${uid}-note`}>{c.note} <small>({c.optional})</small></label>
              <textarea className={ui.textarea} id={`${uid}-note`} name="note" rows={3} />
            </div>
          </div>
          <button className={`${ui.btn} ${ui.primary} ${ui.block}`} type="submit" disabled={pending}>
            {pending ? c.sending : c.submit}
          </button>
        </form>
      </aside>
    </div>
  );
}
