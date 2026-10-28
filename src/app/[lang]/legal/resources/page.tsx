import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Arrow, ArticleCard, PageHero, SectionHead, SisterCard } from '@/components/legal/Blocks';
import { NewsletterForm } from '@/components/legal/Forms';
import Icon from '@/components/legal/Icon';
import styles from '@/components/legal/legal.module.css';
import {
  articleCategories, articleMeta, articlesByDate, formatDate, getLegal,
  type ArticleCategory, type IconName,
} from '@/content/legal';
import { alternates, isLocale } from '@/lib/i18n';
import { legalPath } from '@/lib/links';

export async function generateMetadata({ params }: PageProps<'/[lang]/legal/resources'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getLegal(lang).meta;
  return {
    title: `${t.resourcesTitle} | ${t.siteName}`,
    description: t.resourcesDescription,
    alternates: alternates('/legal/resources', lang),
  };
}

const isCategory = (c: unknown): c is ArticleCategory => typeof c === 'string' && (articleCategories as readonly string[]).includes(c);
const guideIcons: IconName[] = ['contract', 'shield', 'registered', 'trademark'];

export default async function ResourcesPage({ params, searchParams }: PageProps<'/[lang]/legal/resources'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { category: raw } = await searchParams;
  const category = isCategory(raw) ? raw : null;
  const t = getLegal(lang);
  const r = t.resources;
  const base = legalPath(lang, '/resources');

  const featured = articlesByDate.find((s) => articleMeta[s].featured) ?? articlesByDate[0];
  const list = category
    ? articlesByDate.filter((s) => articleMeta[s].categories.includes(category))
    : articlesByDate.filter((s) => s !== featured);

  return (
    <>
      <PageHero eyebrow={r.eyebrow} title={r.title} lead={r.lead} image="/images/legal/books.jpg" imageAlt={r.heroAlt} />

      <section className={styles.chipsBar} id="topics">
        <div className={styles.wrap}>
          <nav aria-label={r.filterLabel}>
            <ul className={styles.chips}>
              <li><Link href={`${base}#topics`} aria-current={!category ? 'page' : undefined} scroll={false}>{r.all}</Link></li>
              {articleCategories.map((c) => (
                <li key={c}>
                  <Link href={`${base}?category=${c}#topics`} aria-current={category === c ? 'page' : undefined} scroll={false}>{r.categories[c]}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {!category && (
        <section style={{ paddingBottom: 40 }}>
          <div className={styles.wrap}>
            <Link className={styles.featured} href={legalPath(lang, `/resources/${featured}`)}>
              <div>
                <span className={styles.eyebrow}>{r.featured}</span>
                <h2>{t.articles[featured].title}</h2>
                <p>{t.articles[featured].excerpt}</p>
                <div className={styles.meta}>
                  <span><time dateTime={articleMeta[featured].date}>{formatDate(articleMeta[featured].date, lang)}</time></span>
                  <span>{r.categories[articleMeta[featured].categories[0]]}</span>
                </div>
                <span className={styles.link}>{r.readFull} <Arrow /></span>
              </div>
              <div className={styles.featuredImg}>
                <Image src={articleMeta[featured].image} alt={t.articles[featured].imgAlt} fill sizes="(max-width: 820px) 100vw, 600px" />
              </div>
            </Link>
          </div>
        </section>
      )}

      <section>
        <div className={styles.wrap}>
          <SectionHead eyebrow={r.recent} title={category ? r.categories[category] : r.latest} />
          {list.length ? (
            <div className={styles.insGrid} data-stagger>
              {list.map((s) => <ArticleCard key={s} lang={lang} slug={s} />)}
            </div>
          ) : (
            <p className={styles.empty}>{r.empty}</p>
          )}
        </div>
      </section>

      <section className={styles.tinted}>
        <div className={styles.wrap}>
          <SectionHead eyebrow={r.guides.eyebrow} title={r.guides.title} aside={r.guides.text} />
          <div className={styles.guideGrid} data-stagger>
            {r.guides.items.map((g, i) => (
              <div key={g.title} className={styles.guide}>
                <Icon name={guideIcons[i]} />
                <h3>{g.title}</h3>
                <p>{g.text}</p>
                <span className={styles.soon}><Icon name="clock" /> {r.guides.comingSoon}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.band} aria-labelledby="newsletter">
        <div className={styles.wrap}>
          <div className={styles.bandImg} data-reveal="zoom">
            <div className={styles.parallax} data-parallax="0.1"><Image src="/images/legal/plant-light.jpg" alt={r.newsletter.imgAlt} fill sizes="(max-width: 820px) 100vw, 600px" /></div>
          </div>
          <div className={styles.bandTxt} data-reveal="right">
            <span className={styles.eyebrow}>{r.newsletter.eyebrow}</span>
            <h2 id="newsletter">{r.newsletter.title}</h2>
            <div className={styles.rule} />
            <p style={{ marginTop: 22, maxWidth: 440 }}>{r.newsletter.text}</p>
            <NewsletterForm lang={lang} t={r.newsletter} errors={t.contact.errors} />
          </div>
        </div>
      </section>

      <SisterCard lang={lang} />
    </>
  );
}

