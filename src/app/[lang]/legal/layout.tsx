import { notFound } from 'next/navigation';
import { Cormorant_Garamond, Libre_Franklin } from 'next/font/google';
import EnterScrollRestore from '@/components/shared/EnterScrollRestore';
import FamilyBar from '@/components/shared/FamilyBar';
import LegalHeader from '@/components/legal/LegalHeader';
import { LegalFooter } from '@/components/legal/Blocks';
import { getLegal, serviceSlugs } from '@/content/legal';
import { isLocale } from '@/lib/i18n';
import { legalPath } from '@/lib/links';
import styles from '@/components/legal/legal.module.css';

// Display face per the brand guide.
const serif = Cormorant_Garamond({
  subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'],
  variable: '--legal-serif', display: 'swap',
});
// The guide specifies Acumin Variable Concept (Adobe Fonts, licence required).
// Libre Franklin is a close free stand-in until the Acumin web licence is in place.
// Arabic uses IBM Plex Sans Arabic (loaded in the root layout) in place of Frutiger LT Arabic.
const sans = Libre_Franklin({
  subsets: ['latin'], weight: ['300', '400', '500', '600'],
  variable: '--legal-sans', display: 'swap',
});

export default async function LegalLayout({ children, params }: LayoutProps<'/[lang]/legal'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getLegal(lang);

  return (
    <div className={`${serif.variable} ${sans.variable} ${styles.root}`}>
      <a className="skip-link" href="#main">{lang === 'ar' ? 'انتقل إلى المحتوى' : 'Skip to content'}</a>
      <EnterScrollRestore />
      <FamilyBar lang={lang} current="legal" />
      <LegalHeader
        lang={lang}
        t={t.nav}
        hrefs={{
          home: legalPath(lang),
          services: legalPath(lang, '/services'),
          about: legalPath(lang, '/about'),
          resources: legalPath(lang, '/resources'),
          contact: legalPath(lang, '/contact'),
        }}
        services={serviceSlugs.map((slug) => ({
          slug, title: t.services[slug].title, note: t.services[slug].menuNote, href: legalPath(lang, `/services/${slug}`),
        }))}
      />
      <main id="main">{children}</main>
      <LegalFooter lang={lang} />
    </div>
  );
}
