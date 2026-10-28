import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { toLocale } from '@/components/plus/helpers';
import pages from '@/components/plus/pages.module.css';
import ui from '@/components/plus/ui.module.css';
import { getPlusCopy } from '@/content/plus';
import { alternates, localePath } from '@/lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[lang]/blog'>): Promise<Metadata> {
  const lang = toLocale((await params).lang);
  const t = getPlusCopy(lang).meta;
  return { title: t.blogTitle, description: t.blogDescription, alternates: alternates('/blog', lang) };
}

// Decorative pictures for the four updates, in the order they appear in the copy.
const postImages = ['/images/plus/cat-paper.jpg', '/images/plus/industry-logistics.jpg', '/images/plus/steps/choose.jpg', '/images/plus/pos-counter.jpg'];

export default async function NewsPage({ params }: PageProps<'/[lang]/blog'>) {
  const lang = toLocale((await params).lang);
  const t = getPlusCopy(lang);
  const b = t.blog;
  const [featured, ...rest] = b.posts;
  return (
    <>
      <section className={ui.pageHead}>
        <div className={ui.container}>
          <nav className={ui.breadcrumbs} aria-label={t.common.breadcrumb}>
            <ol>
              <li><Link href={localePath(lang, '/plus')}>{t.common.home}</Link></li>
              <li aria-current="page">{b.eyebrow}</li>
            </ol>
          </nav>
          <h1>{b.title}</h1>
          <p>{b.lead}</p>
        </div>
      </section>
      <div className={`${ui.container} ${pages.body}`}>
        <article className={pages.featured} data-reveal>
          <div className={pages.featuredImg}><Image src={postImages[0]} alt="" fill sizes="(max-width: 980px) 100vw, 640px" preload /></div>
          <div className={pages.featuredBody}>
            <div className={pages.postMeta}><span className={pages.tag}>{featured.tag}</span><span>{featured.date}</span><span>{b.readTime}</span></div>
            <h2>{featured.title}</h2>
            <p>{featured.text}</p>
          </div>
        </article>

        <div className={pages.posts}>
          {rest.map((post, i) => (
            <article key={post.title} className={pages.post} data-reveal data-reveal-delay={String(Math.min(i + 1, 6))}>
              <div className={pages.postImg}><Image src={postImages[i + 1]} alt="" fill sizes="(max-width: 980px) 100vw, 400px" /></div>
              <div className={pages.postBody}>
                <div className={pages.postMeta}><span className={pages.tag}>{post.tag}</span><span>{post.date}</span></div>
                <h2>{post.title}</h2>
                <p>{post.text}</p>
                <span className={pages.postFoot}>{b.update} · {b.readTime}</span>
              </div>
            </article>
          ))}
        </div>

        <section className={pages.quick} aria-labelledby="quick-title" data-reveal>
          <div>
            <h2 id="quick-title">{b.quickTitle}</h2>
            <p>{b.quickText}</p>
          </div>
          <ul className={pages.quickList} data-stagger>
            {b.quick.map((q) => <li key={q.title}><strong>{q.title}</strong><span>{q.text}</span></li>)}
          </ul>
        </section>
      </div>
    </>
  );
}
