import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { gatewayPath, legalPath, plusPath } from '@/lib/links';
import styles from './FamilyBar.module.css';

const t = {
  en: { family: 'The Awraquna family', plus: 'Awraquna Plus', plusSub: 'Business supplies', legal: 'Awraquna Legal Services', legalSub: 'Trademarks & IP', all: 'All companies' },
  ar: { family: 'عائلة أوراقنا', plus: 'أوراقنا بلس', plusSub: 'مستلزمات الأعمال', legal: 'أوراقنا للخدمات القانونية', legalSub: 'العلامات التجارية والملكية الفكرية', all: 'كل الشركات' },
};

/** Thin bar at the very top of both sites so visitors can switch company at any time. */
export default function FamilyBar({ lang, current }: { lang: Locale; current: 'plus' | 'legal' }) {
  const c = t[lang];
  return (
    <div className={styles.bar} data-theme={current}>
      <div className={styles.inner}>
        <span className={styles.family}>{c.family}</span>
        <nav className={styles.links} aria-label={c.family}>
          <Link href={plusPath(lang)} aria-current={current === 'plus' ? 'page' : undefined}>
            {c.plus}<span className={styles.sub}> — {c.plusSub}</span>
          </Link>
          <Link href={legalPath(lang)} aria-current={current === 'legal' ? 'page' : undefined}>
            {c.legal}<span className={styles.sub}> — {c.legalSub}</span>
          </Link>
        </nav>
        <Link className={styles.all} href={gatewayPath(lang)}>
          <span aria-hidden="true">{lang === 'ar' ? '→' : '←'}</span> {c.all}
        </Link>
      </div>
    </div>
  );
}
