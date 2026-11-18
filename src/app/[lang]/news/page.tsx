import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { GroupFooter, GroupTopBar } from '@/components/group/GroupChrome';
import styles from '@/components/group/news.module.css';
import { groupChrome, groupNews } from '@/content/group';
import { getPlusCopy, plusConfig } from '@/content/plus';
import { alternates, isLocale, localePath, type Locale } from '@/lib/i18n';

/**
 * Group-level news: the same posts as the Plus news page (/blog), framed for the whole
 * Awraquna Group with the group header and footer instead of the Plus store chrome.
 */
const toLang = (raw: string): Locale => (isLocale(raw) ? raw : 'en');

export async function generateMetadata({ params }: PageProps<'/[lang]/news'>): Promise<Metadata> {
  const lang = toLang((await params).lang);
  const t = groupNews[lang];
  return {
    title: { absolute: t.metaTitle },
    description: t.metaDescription,
    alternates: alternates('/news', lang),
    openGraph: { title: t.metaTitle, description: t.metaDescription, type: 'website', locale: lang === 'ar' ? 'ar_SA' : 'en_US' },
  };
}

export default async function GroupNewsPage({ params }: PageProps<'/[lang]/news'>) {
  const lang = toLang((await params).lang);
  const t = groupNews[lang];
  const nav = groupChrome[lang].nav;
  const b = getPlusCopy(lang).blog;
  const images = plusConfig.newsImages;
  const [featured, ...rest] = b.posts;

  return (
    <div className={styles.page}>
      <a className="skip-link" href="#main">{groupChrome[lang].skip}</a>
      <GroupTopBar lang={lang} page="news" path="/news" />

      <main id="main">
        <header className={styles.head}>
          <nav className={styles.crumbs} aria-label={t.breadcrumb}>
            <ol>
              <li><Link href={localePath(lang, '/')}>{nav.home}</Link></li>
              <li aria-current="page">{t.eyebrow}</li>
            </ol>
          </nav>
          <p className={styles.eyebrow}>{t.eyebrow}</p>
          <h1 className={styles.title}>{t.title}</h1>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.lead}>{t.lead}</p>
        </header>

        <div className={styles.body}>
          <article className={styles.featured} data-reveal>
            <div className={styles.featuredImg}><Image src={images[0]} alt="" fill sizes="(max-width: 980px) 100vw, 640px" preload /></div>
            <div className={styles.featuredBody}>
              <div className={styles.meta}><span className={styles.tag}>{featured.tag}</span><span>{featured.date}</span><span>{b.readTime}</span></div>
              <h2>{featured.title}</h2>
              <p>{featured.text}</p>
            </div>
          </article>

          <div className={styles.posts}>
            {rest.map((post, i) => (
              <article key={post.title} className={styles.post} data-reveal data-reveal-delay={String(Math.min(i + 1, 6))}>
                <div className={styles.postImg}><Image src={images[i + 1]} alt="" fill sizes="(max-width: 980px) 100vw, 400px" /></div>
                <div className={styles.postBody}>
                  <div className={styles.meta}><span className={styles.tag}>{post.tag}</span><span>{post.date}</span></div>
                  <h2>{post.title}</h2>
                  <p>{post.text}</p>
                  <span className={styles.postFoot}>{b.update} · {b.readTime}</span>
                </div>
              </article>
            ))}
          </div>

          <section className={styles.quick} aria-labelledby="quick-title" data-reveal>
            <div>
              <h2 id="quick-title">{b.quickTitle}</h2>
              <p>{b.quickText}</p>
            </div>
            <ul className={styles.quickList} data-stagger>
              {b.quick.map((q) => <li key={q.title}><strong>{q.title}</strong><span>{q.text}</span></li>)}
            </ul>
          </section>
        </div>
      </main>

      <GroupFooter lang={lang} page="news" path="/news" />
    </div>
  );
}
