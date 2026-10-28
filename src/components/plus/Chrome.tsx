'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { plusCopy } from '@/content/plus';
import { localePath, type Locale } from '@/lib/i18n';
import { site, whatsappLink } from '@/lib/site';
import { Check, Close, WhatsApp } from './icons';
import { useOrderList } from './order-list';
import styles from './layout.module.css';

/** "Added to your order list" confirmation, announced politely to screen readers. */
export function OrderToast({ lang }: { lang: Locale }) {
  const t = plusCopy[lang];
  const { toast, dismissToast } = useOrderList();

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(dismissToast, 4000);
    return () => clearTimeout(id);
  }, [toast, dismissToast]);

  return (
    <div className={styles.toastRegion} aria-live="polite" role="status">
      {toast && (
        <div className={styles.toast} key={toast.id}>
          <Check className={styles.toastIcon} />
          <span>{toast.message}</span>
          <Link href={localePath(lang, '/shop/cart')} onClick={dismissToast}>{t.common.viewList}</Link>
          <button type="button" onClick={dismissToast} aria-label={t.common.dismiss}><Close /></button>
        </div>
      )}
    </div>
  );
}

/** Floating WhatsApp button. Hidden on the order list page, which has its own WhatsApp action. */
export function WhatsAppFloat({ lang }: { lang: Locale }) {
  const t = plusCopy[lang];
  const pathname = usePathname();
  if (pathname.endsWith('/shop/cart')) return null;
  return (
    <a className={styles.waFloat} href={whatsappLink(site.plus.whatsapp, `${t.common.whatsappGreeting} `)} target="_blank" rel="noopener" aria-label={t.common.whatsappFloat}>
      <WhatsApp />
      <span className={styles.waText}>{t.common.whatsappFloat}</span>
    </a>
  );
}
