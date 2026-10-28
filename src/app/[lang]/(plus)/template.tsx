import styles from '@/components/plus/route-fade.module.css';

/** Remounts on every navigation, so each Plus page fades in gently. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className={styles.page}>{children}</div>;
}
