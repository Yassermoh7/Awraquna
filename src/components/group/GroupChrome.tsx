import Image from 'next/image';
import Link from 'next/link';
import { groupChrome } from '@/content/group';
import { localePath, type Locale } from '@/lib/i18n';
import { legalPath, plusPath } from '@/lib/links';
import GroupHeader from './GroupHeader';
import styles from './GroupFooter.module.css';

type Page = 'home' | 'news';

/** Section links point at the homepage sections; on the homepage itself they stay plain #anchors. */
const sectionHref = (lang: Locale, page: Page, id: string) => (page === 'home' ? `#${id}` : `${localePath(lang, '/')}#${id}`);

/** Header for the group pages, with the shared nav. `path` is this page's path, for the language switch. */
export function GroupTopBar({ lang, page, path }: { lang: Locale; page: Page; path: string }) {
  const t = groupChrome[lang];
  const other: Locale = lang === 'en' ? 'ar' : 'en';
  return (
    <GroupHeader
      homeHref={localePath(lang, '/')}
      nav={[
        { href: localePath(lang, '/'), label: t.nav.home, current: page === 'home' },
        { href: sectionHref(lang, page, 'about'), label: t.nav.about },
        { href: sectionHref(lang, page, 'divisions'), label: t.nav.divisions },
        { href: localePath(lang, '/news'), label: t.nav.news, current: page === 'news' },
        { href: sectionHref(lang, page, 'contact'), label: t.nav.contact },
      ]}
      langSwitch={{ href: localePath(other, path), label: t.lang, hrefLang: other }}
      menuLabel={t.menu}
      closeLabel={t.close}
    />
  );
}

export function GroupFooter({ lang, page, path }: { lang: Locale; page: Page; path: string }) {
  const t = groupChrome[lang];
  const other: Locale = lang === 'en' ? 'ar' : 'en';
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <Image src="/brand/group-logo-white.png" alt="Awraquna Group" width={900} height={384} sizes="130px" className={styles.footerLogo} />
        <nav aria-label="Footer">
          <Link href={localePath(lang, '/')}>{t.nav.home}</Link>
          <a href={sectionHref(lang, page, 'about')}>{t.nav.about}</a>
          <Link href={plusPath(lang)}>Awraquna Plus</Link>
          <Link href={legalPath(lang)}>{t.legalShort}</Link>
          <Link href={localePath(lang, '/news')}>{t.nav.news}</Link>
          <a href={sectionHref(lang, page, 'contact')}>{t.nav.contact}</a>
        </nav>
        <a className={styles.footerLang} href={localePath(other, path)} hrefLang={other} lang={other}>{t.lang}</a>
      </div>
      <div className={styles.footerBottom}>
        <span>{t.footer.rights}</span>
        <span>
          <Link href={localePath(lang, '/privacy')}>{t.footer.privacy}</Link>
          <Link href={localePath(lang, '/terms')}>{t.footer.terms}</Link>
        </span>
      </div>
    </footer>
  );
}
