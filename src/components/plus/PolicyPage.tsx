import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { localePath } from '@/lib/i18n';
import { getPlusCopy } from '@/content/plus';
import pages from './pages.module.css';
import ui from './ui.module.css';

/** Shared layout for the privacy policy and terms (draft copy, to be reviewed by counsel). */
export default function PolicyPage({ lang, doc }: { lang: Locale; doc: 'privacy' | 'terms' }) {
  const t = getPlusCopy(lang);
  const d = t[doc];
  const id = (i: number) => `${doc}-${i + 1}`;
  return (
    <>
      <section className={ui.pageHead}>
        <div className={ui.container}>
          <nav className={ui.breadcrumbs} aria-label={t.common.breadcrumb}>
            <ol>
              <li><Link href={localePath(lang, '/plus')}>{t.common.home}</Link></li>
              <li aria-current="page">{d.title}</li>
            </ol>
          </nav>
          <h1>{d.title}</h1>
          <p>{d.updated}</p>
        </div>
      </section>
      <div className={`${ui.container} ${pages.body} ${pages.policy}`}>
        <nav className={pages.toc} aria-label={d.title}>
          <ol>
            {d.sections.map((s, i) => <li key={s.title}><a href={`#${id(i)}`}>{s.title}</a></li>)}
          </ol>
        </nav>
        <article className={ui.prose}>
          <p className={pages.draft} role="note">{d.draft}</p>
          {d.sections.map((s, i) => (
            <section key={s.title} id={id(i)} className={pages.policySection} data-reveal>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
