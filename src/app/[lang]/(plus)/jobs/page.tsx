import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { toLocale } from '@/components/plus/helpers';
import { Mail } from '@/components/plus/icons';
import pages from '@/components/plus/pages.module.css';
import ui from '@/components/plus/ui.module.css';
import { getPlusCopy } from '@/content/plus';
import { alternates, localePath } from '@/lib/i18n';
import { site } from '@/lib/site';

export async function generateMetadata({ params }: PageProps<'/[lang]/jobs'>): Promise<Metadata> {
  const lang = toLocale((await params).lang);
  const t = getPlusCopy(lang).meta;
  return { title: t.jobsTitle, description: t.jobsDescription, alternates: alternates('/jobs', lang) };
}

export default async function JobsPage({ params }: PageProps<'/[lang]/jobs'>) {
  const lang = toLocale((await params).lang);
  const t = getPlusCopy(lang);
  const j = t.jobs;
  const mailto = `mailto:${site.plus.email}?subject=${encodeURIComponent(j.subject)}`;
  return (
    <>
      <section className={ui.pageHead}>
        <div className={ui.container}>
          <nav className={ui.breadcrumbs} aria-label={t.common.breadcrumb}>
            <ol>
              <li><Link href={localePath(lang, '/plus')}>{t.common.home}</Link></li>
              <li aria-current="page">{j.eyebrow}</li>
            </ol>
          </nav>
          <h1>{j.title}</h1>
          <p>{j.lead}</p>
        </div>
      </section>
      <div className={`${ui.container} ${pages.body}`}>
        <div className={pages.apply} data-reveal>
          <div className={pages.applyImg}>
            <Image src="/images/plus/industry-logistics.jpg" alt="" fill sizes="(max-width: 980px) 100vw, 520px" />
          </div>
          <div className={pages.applyBody}>
            <h2>{j.howTitle}</h2>
            <p>{j.howText} <a href={mailto}>{site.plus.email}</a>.</p>
            <a className={`${ui.btn} ${ui.primary}`} href={mailto}><Mail /> {site.plus.email}</a>
          </div>
        </div>
      </div>
    </>
  );
}
