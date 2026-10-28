import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SisterCard } from '@/components/legal/Blocks';
import { ContactTabs } from '@/components/legal/Forms';
import styles from '@/components/legal/legal.module.css';
import { getLegal, serviceSlugs, type ServiceSlug } from '@/content/legal';
import { alternates, isLocale } from '@/lib/i18n';
import { site, whatsappLink } from '@/lib/site';

export async function generateMetadata({ params }: PageProps<'/[lang]/legal/contact'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getLegal(lang).meta;
  return {
    title: `${t.contactTitle} | ${t.siteName}`,
    description: t.contactDescription,
    alternates: alternates('/legal/contact', lang),
  };
}

export default async function ContactPage({ params, searchParams }: PageProps<'/[lang]/legal/contact'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const sp = await searchParams;
  const t = getLegal(lang);
  const c = t.contact;
  const services = serviceSlugs.map((slug) => ({ slug, title: t.services[slug].title }));
  const preselected = typeof sp.service === 'string' && (serviceSlugs as readonly string[]).includes(sp.service)
    ? t.services[sp.service as ServiceSlug].title
    : undefined;
  const { email, phone, whatsapp, offices } = site.legal;

  return (
    <>
      <section className={`${styles.hero} ${styles.pageHero}`}>
        <div className={styles.watermark} aria-hidden="true">A</div>
        <div className={styles.wrap} style={{ display: 'block' }}>
          <div className={styles.heroTxt}>
            <span className={styles.eyebrow}>{c.eyebrow}</span>
            <h1>{c.title}</h1>
            <div className={`${styles.rule} ${styles.ruleBlue}`} />
            <p className={styles.lead} style={{ marginTop: 26 }}>{c.lead}</p>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 24 }}>
        <div className={`${styles.wrap} ${styles.contactGrid}`}>
          <ContactTabs
            key={`${sp.form ?? ''}-${sp.service ?? ''}`}
            lang={lang}
            t={c}
            services={services}
            initial={sp.form === 'trademark' ? 'trademark' : 'consultation'}
            initialService={preselected}
          />
          <aside className={styles.detailsCard}>
            <h2>{c.details.title}</h2>
            <dl>
              <div><dt>{c.details.email}</dt><dd><a href={`mailto:${email}`}>{email}</a></dd></div>
              {phone && <div><dt>{c.details.phone}</dt><dd><a href={`tel:${phone.replace(/\s/g, '')}`} dir="ltr">{phone}</a></dd></div>}
              {whatsapp && <div><dt>WhatsApp</dt><dd><a href={whatsappLink(whatsapp)} target="_blank" rel="noopener noreferrer" dir="ltr">+{whatsapp}</a></dd></div>}
              <div><dt>{c.details.offices}</dt><dd>{offices[lang]}</dd></div>
            </dl>
            {/* TODO(client): real contact details for the legal arm are not provided yet. */}
            {!phone && <small>{c.details.placeholderNote}</small>}
          </aside>
        </div>
      </section>

      <SisterCard lang={lang} />
    </>
  );
}
