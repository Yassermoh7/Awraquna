import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Arrow, ArticleCard, CtaSection, SectionHead } from '@/components/legal/Blocks';
import Icon from '@/components/legal/Icon';
import styles from '@/components/legal/legal.module.css';
import { articleMeta, articleSlugs, articlesByDate, fill, formatDate, getLegal, type ArticleSlug } from '@/content/legal';
import { alternates, isLocale } from '@/lib/i18n';
import { legalPath } from '@/lib/links';
import { site } from '@/lib/site';

const isArticle = (s: string): s is ArticleSlug => (articleSlugs as readonly string[]).includes(s);

export function generateStaticParams() {
  return articleSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/legal/resources/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !isArticle(slug)) return {};
  const t = getLegal(lang);
  const a = t.articles[slug];
  return {
    title: `${a.title} | ${t.meta.siteName}`,
    description: a.excerpt,
    alternates: alternates(`/legal/resources/${slug}`, lang),
    openGraph: { type: 'article', title: a.title, description: a.excerpt, publishedTime: articleMeta[slug].date, images: [articleMeta[slug].image] },
  };
}

export default async function ArticlePage({ params }: PageProps<'/[lang]/legal/resources/[slug]'>) {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !isArticle(slug)) notFound();
  const t = getLegal(lang);
  const a = t.articles[slug];
  const m = articleMeta[slug];
  const more = articlesByDate.filter((s) => s !== slug && articleMeta[s].categories.some((c) => m.categories.includes(c)))
    .concat(articlesByDate.filter((s) => s !== slug))
    .filter((s, i, arr) => arr.indexOf(s) === i)
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.excerpt,
    datePublished: m.date,
    inLanguage: lang,
    image: `${site.url}${m.image}`,
    mainEntityOfPage: `${site.url}${legalPath(lang, `/resources/${slug}`)}`,
    author: { '@type': 'Organization', name: t.meta.siteName },
    publisher: { '@type': 'Organization', name: t.meta.siteName, logo: { '@type': 'ImageObject', url: `${site.url}/brand/legal-logo-fig.png` } },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article>
        <header className={`${styles.section} ${styles.articleHead}`}>
          <div className={styles.wrap}>
            <nav aria-label={t.common.breadcrumb}>
              <ol className={styles.crumbs}>
                <li><Link href={legalPath(lang)}>{t.nav.home}</Link></li>
                <li><Link href={legalPath(lang, '/resources')}>{t.nav.resources}</Link></li>
                <li><Link href={`${legalPath(lang, '/resources')}?category=${m.categories[0]}`}>{t.resources.categories[m.categories[0]]}</Link></li>
              </ol>
            </nav>
            <span className={styles.eyebrow}>
              {t.resources.articleLabel}
              {/* TODO(client): remove once counsel has reviewed the article. */}
              {m.draft && <span className={styles.draft}>{t.resources.draftNote}</span>}
            </span>
            <h1>{a.title}</h1>
            <div className={`${styles.rule} ${styles.ruleBlue}`} />
            <p className={styles.lead}>{a.excerpt}</p>
            <div className={styles.meta}>
              <span><time dateTime={m.date}>{formatDate(m.date, lang)}</time></span>
              <span>{fill(t.common.minRead, { n: m.minutes })}</span>
              <span>{m.categories.map((c) => t.resources.categories[c]).join(', ')}</span>
            </div>
          </div>
        </header>

        <div className={styles.wrap}>
          <div className={styles.articleHero}>
            <Image src={m.image} alt={a.imgAlt} fill preload sizes="(max-width: 900px) 100vw, 860px" />
          </div>
        </div>

        <section className={styles.section} style={{ paddingTop: 56 }}>
          <div className={styles.wrap}>
            <p className={styles.disclaimerBox}><Icon name="info" /> {t.common.disclaimer}</p>
            <div className={styles.prose}>
              {a.body.map((sec, i) => (
                <div key={i}>
                  {sec.heading && <h2>{sec.heading}</h2>}
                  {sec.paragraphs.map((p) => <p key={p}>{p}</p>)}
                  {sec.list && <ul>{sec.list.map((li) => <li key={li}>{li}</li>)}</ul>}
                </div>
              ))}
              <p style={{ marginTop: 40 }}>
                <Link className={styles.link} href={legalPath(lang, '/resources')}>
                  <span className={styles.arrow} style={{ transform: lang === 'ar' ? 'none' : 'scaleX(-1)' }} aria-hidden="true">→</span> {t.common.backToResources}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </article>

      <section className={styles.tinted}>
        <div className={styles.wrap}>
          <SectionHead
            eyebrow={t.home.insights.eyebrow}
            title={t.home.insights.title}
            aside={<Link className={styles.link} href={legalPath(lang, '/resources')}>{t.common.viewAllArticles} <Arrow /></Link>}
          />
          <div className={styles.insGrid} data-stagger>
            {more.map((s) => <ArticleCard key={s} lang={lang} slug={s} />)}
          </div>
        </div>
      </section>

      <CtaSection lang={lang} />
    </>
  );
}
