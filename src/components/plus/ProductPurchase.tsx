'use client';

import { useId, useState } from 'react';
import { plusCopy } from '@/content/plus';
import type { Locale } from '@/lib/i18n';
import { site, whatsappLink } from '@/lib/site';
import { Minus, Plus, WhatsApp } from './icons';
import { useOrderList, type OrderUnit } from './order-list';
import shop from './shop.module.css';
import ui from './ui.module.css';

type Props = { lang: Locale; id: number; sku: string; name: string; defaultUnit: OrderUnit; cartonInfo: string | null };

/** Quantity, unit, "Add to order list" and "Order this on WhatsApp". */
export default function ProductPurchase({ lang, id, sku, name, defaultUnit, cartonInfo }: Props) {
  const t = plusCopy[lang];
  const { add } = useOrderList();
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState<OrderUnit>(defaultUnit);
  const qtyId = useId();
  const unitId = useId();

  const clamp = (n: number) => Math.max(1, Math.min(10000, Number.isFinite(n) ? Math.round(n) : 1));
  const qtyText = `${qty} ${qty === 1 ? t.common.unitOne[unit] : t.common.units[unit]}`;

  return (
    <div className={shop.purchase}>
      <div className={shop.purchaseRow}>
        <div className={shop.purchaseField}>
          <label htmlFor={qtyId}>{t.product.quantity}</label>
          <div className={shop.stepper}>
            <button type="button" onClick={() => setQty(clamp(qty - 1))} aria-label={t.product.decrease} disabled={qty <= 1}><Minus /></button>
            <input id={qtyId} type="number" inputMode="numeric" min={1} max={10000} value={qty} onChange={(e) => setQty(clamp(e.target.valueAsNumber))} />
            <button type="button" onClick={() => setQty(clamp(qty + 1))} aria-label={t.product.increase}><Plus /></button>
          </div>
        </div>
        <div className={shop.purchaseField}>
          <label htmlFor={unitId}>{t.product.unit}</label>
          <select id={unitId} className={ui.select} value={unit} onChange={(e) => setUnit(e.target.value as OrderUnit)}>
            {cartonInfo && <option value="carton">{t.common.units.carton} ({cartonInfo})</option>}
            <option value="unit">{t.common.units.unit}</option>
          </select>
        </div>
      </div>
      <div className={shop.purchaseActions}>
        <button type="button" className={`${ui.btn} ${ui.primary}`} onClick={() => add(id, qty, unit, t.common.addedToast(name))}>
          <Plus /> {t.product.addToList}
        </button>
        <a className={`${ui.btn} ${ui.wa}`} href={whatsappLink(site.plus.whatsapp, t.product.whatsappMessage(sku, name, qtyText))} target="_blank" rel="noopener">
          <WhatsApp /> {t.product.orderWhatsapp}
        </a>
      </div>
      <p className={shop.note}>{t.product.priceNote}</p>
    </div>
  );
}
