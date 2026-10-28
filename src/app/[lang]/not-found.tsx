import Link from 'next/link';
import styles from './not-found.module.css';

/** Shown for unknown URLs. Bilingual because not-found pages don't receive the locale. */
export default function NotFound() {
  return (
    <main className={styles.page}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>We couldn’t find that page</h1>
      <p className={styles.text}>It may have moved when our website was updated. Choose where you’d like to go:</p>
      <p className={styles.text} lang="ar" dir="rtl">لم نتمكن من العثور على هذه الصفحة. اختر وجهتك:</p>
      <nav className={styles.links} aria-label="Awraquna">
        <Link href="/plus">Awraquna Plus — business supplies</Link>
        <Link href="/shop">Browse all products</Link>
        <Link href="/legal">Awraquna Legal Services</Link>
        <Link href="/">All Awraquna companies</Link>
      </nav>
    </main>
  );
}
