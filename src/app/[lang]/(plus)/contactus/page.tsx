import type { Metadata } from 'next';
import Link from 'next/link';
import ContactForm from '@/components/plus/ContactForm';
import { toLocale } from '@/components/plus/helpers';
import { Arrow, Mail, Phone, Pin, WhatsApp } from '@/components/plus/icons';
import styles from '@/components/plus/contact.module.css';
import ui from '@/components/plus/ui.module.css';
import { getPlusCopy } from '@/content/plus';
import { alternates, localePath } from '@/lib/i18n';
import { site, whatsappLink } from '@/lib/site';

export async function generateMetadata({ params }: PageProps<'/[lang]/contactus'>): Promise<Metadata> {
  const lang = toLocale((await params).lang);
  const t = getPlusCopy(lang).meta;
  return { title: t.contactTitle, description: t.contactDescription, alternates: alternates('/contactus', lang) };
}

export default async function ContactPage({ params, searchParams }: PageProps<'/[lang]/contactus'>) {
  const lang = toLocale((await params).lang);
  const type = (await searchParams).type;
  const t = getPlusCopy(lang);
  const c = t.contact;

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.plus.name,
    telephone: site.plus.phone,
    email: site.plus.email,
    url: `${site.url}${localePath(lang, '/plus')}`,
    address: { '@type': 'PostalAddress', streetAddress: 'King Salman bin Abdulaziz Road, Al-Malqa District', addressLocality: 'Riyadh', addressCountry: 'SA' },
  };
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Awraquna, King Salman bin Abdulaziz Road, Al-Malqa, Riyadh')}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
      <div className={`${ui.container} ${styles.page}`}>
        <nav className={ui.breadcrumbs} aria-label={t.common.breadcrumb}>
          <ol>
            <li><Link href={localePath(lang, '/plus')}>{t.common.home}</Link></li>
            <li aria-current="page">{c.eyebrow}</li>
          </ol>
        </nav>

        <div className={styles.grid}>
          <div>
            <h1 className={styles.title}>{c.title}</h1>
            <p className={styles.lead}>{c.lead}</p>
            <ContactForm lang={lang} initialMode={type === 'bulk' ? 'bulk' : 'general'} />
          </div>

          <aside className={styles.side} aria-label={c.reach}>
            <h2 className={styles.sideTitle}>{c.reach}</h2>
            <ul className={styles.lines}>
              <li>
                <WhatsApp className={styles.wa} />
                <div><small>{c.whatsapp}</small><a href={whatsappLink(site.plus.whatsapp)} target="_blank" rel="noopener" dir="ltr">{site.plus.phoneDisplay}</a></div>
              </li>
              <li>
                <Phone />
                <div><small>{c.phone}</small><a href={`tel:${site.plus.phone}`} dir="ltr">{site.plus.phoneDisplay}</a></div>
              </li>
              <li>
                <Mail />
                <div><small>{c.email}</small><a href={`mailto:${site.plus.email}`}>{site.plus.email}</a></div>
              </li>
              <li>
                <Pin />
                <div>
                  <small>{c.address}</small>
                  <p>{site.plus.address[lang]}</p>
                  <a className={styles.mapLink} href={mapUrl} target="_blank" rel="noopener">{c.mapLink} <Arrow /></a>
                </div>
              </li>
            </ul>
            <a className={`${ui.btn} ${ui.wa} ${ui.block}`} href={whatsappLink(site.plus.whatsapp)} target="_blank" rel="noopener"><WhatsApp /> {c.whatsappCta}</a>
          </aside>
        </div>
      </div>
    </>
  );
}
