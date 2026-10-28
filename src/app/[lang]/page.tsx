import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import DivisionCircles, { type Division } from '@/components/group/DivisionCircles';
import GroupHeader from '@/components/group/GroupHeader';
import { alternates, isLocale, localePath, type Locale } from '@/lib/i18n';
import { legalPath, plusPath } from '@/lib/links';
import { site, whatsappLink } from '@/lib/site';
import previewHeights from '@/data/previews.json';
import styles from './group.module.css';


const copy = {
  en: {
    metaTitle: 'Awraquna Group | Business Supplies & Legal Services in Saudi Arabia',
    metaDescription:
      'Awraquna Group has two divisions: Awraquna Plus supplies thermal paper, labels and POS consumables across Saudi Arabia, and Awraquna Legal Services registers and protects trademarks, industrial designs and patents in Saudi Arabia and Egypt.',
    nav: { home: 'Home', about: 'About Us', divisions: 'Our Divisions', news: 'News', contact: 'Contact' },
    lang: 'العربية', menu: 'Open menu', close: 'Close menu',
    eyebrow: 'Two divisions',
    title: 'A stronger tomorrow',
    lede: 'From essential supplies to legal solutions, Awraquna supports your business at every step.',
    explore: 'Explore',
    hintScroll: 'Keep scrolling to enter',
    hintTouch: 'Swipe up or tap again to enter',
    previewAnnouncement: 'Preview open. Tap again or swipe up to enter.',
    plusTagline: 'Thermal paper, labels & POS supplies',
    legalTagline: 'Trademarks & intellectual property',
    stats: ['Trusted by businesses', 'Nationwide coverage', 'Premium quality', '15+ years of experience'],
    vision: {
      eyebrow: 'One vision', title: 'Supporting businesses at every step',
      body: ['Essential supplies that keep your business running.', 'Legal solutions that help it grow.'],
      alt: 'Thermal paper rolls and law books on a marble counter overlooking the Riyadh skyline',
    },
    divisions: {
      eyebrow: 'Our divisions', title: 'Two companies, one standard of service',
      plus: {
        name: 'Awraquna Plus',
        body: 'For more than 15 years, Awraquna Plus has kept cash registers running and supply chains organised with thermal paper, labels and ribbons — with ready stock and fast delivery across the Kingdom.',
        points: ['Thermal paper and cashier rolls', 'Label rolls and printer ribbons', 'Date and price labelers'],
        primary: 'Visit Awraquna Plus', secondary: 'Browse products',
      },
      legal: {
        name: 'Awraquna Legal Services',
        body: 'The intellectual-property arm of the Awraquna family. We register and protect trademarks, industrial designs and patents across Saudi Arabia and Egypt, so you can focus on growth.',
        points: ['Trademark search and registration', 'Industrial designs and patents', 'Contracts, advisory and compliance'],
        primary: 'Visit Legal Services', secondary: 'Book a consultation',
      },
    },
    contact: {
      eyebrow: 'Let’s work together', title: 'How can we help?',
      plusLabel: 'Supplies and orders', legalLabel: 'Legal enquiries',
      plusCta: 'Contact Awraquna Plus', legalCta: 'Contact Legal Services', whatsapp: 'WhatsApp',
    },
    footer: { rights: '© 2026 Awraquna Group. All rights reserved.', privacy: 'Privacy Policy', terms: 'Terms of Service' },
  },
  ar: {
    metaTitle: 'مجموعة أوراقنا | مستلزمات الأعمال والخدمات القانونية في السعودية',
    metaDescription:
      'تضم مجموعة أوراقنا قسمين: أوراقنا بلس لتوريد الورق الحراري والملصقات ومستلزمات نقاط البيع في المملكة، وأوراقنا للخدمات القانونية لتسجيل وحماية العلامات التجارية والنماذج الصناعية وبراءات الاختراع في السعودية ومصر.',
    nav: { home: 'الرئيسية', about: 'من نحن', divisions: 'أقسامنا', news: 'الأخبار', contact: 'تواصل معنا' },
    lang: 'English', menu: 'فتح القائمة', close: 'إغلاق القائمة',
    eyebrow: 'قسمان',
    title: 'غدٌ أقوى',
    lede: 'من المستلزمات الأساسية إلى الحلول القانونية، تدعم أوراقنا أعمالك في كل خطوة.',
    explore: 'استكشف',
    hintScroll: 'تابع التمرير للدخول',
    hintTouch: 'اسحب للأعلى أو اضغط مجددًا للدخول',
    previewAnnouncement: 'المعاينة مفتوحة. اضغط مجددًا أو اسحب للأعلى للدخول.',
    plusTagline: 'الورق الحراري والملصقات ومستلزمات نقاط البيع',
    legalTagline: 'العلامات التجارية والملكية الفكرية',
    stats: ['موثوقون لدى الشركات', 'تغطية في جميع أنحاء المملكة', 'جودة عالية', 'أكثر من 15 عامًا من الخبرة'],
    vision: {
      eyebrow: 'رؤية واحدة', title: 'ندعم الأعمال في كل خطوة',
      body: ['مستلزمات أساسية تُبقي أعمالك مستمرة.', 'وحلول قانونية تساعدها على النمو.'],
      alt: 'رولات ورق حراري وكتب قانونية على طاولة رخامية تطل على أفق الرياض',
    },
    divisions: {
      eyebrow: 'أقسامنا', title: 'شركتان، ومستوى واحد من الخدمة',
      plus: {
        name: 'أوراقنا بلس',
        body: 'منذ أكثر من 15 عامًا، تُبقي أوراقنا بلس أجهزة الكاشير تعمل وسلاسل الإمداد منظمة بالورق الحراري والملصقات وأشرطة الطباعة، مع مخزون جاهز وتوصيل سريع في جميع أنحاء المملكة.',
        points: ['الورق الحراري ورولات الكاشير', 'رولات الملصقات وأشرطة الطابعات', 'آلات التاريخ والتسعير'],
        primary: 'زيارة أوراقنا بلس', secondary: 'تصفح المنتجات',
      },
      legal: {
        name: 'أوراقنا للخدمات القانونية',
        body: 'ذراع الملكية الفكرية في عائلة أوراقنا. نسجّل ونحمي العلامات التجارية والنماذج الصناعية وبراءات الاختراع في السعودية ومصر، لتتفرغ أنت للنمو.',
        points: ['البحث عن العلامات التجارية وتسجيلها', 'النماذج الصناعية وبراءات الاختراع', 'العقود والاستشارات والامتثال'],
        primary: 'زيارة الخدمات القانونية', secondary: 'احجز استشارة',
      },
    },
    contact: {
      eyebrow: 'لنعمل معًا', title: 'كيف يمكننا مساعدتك؟',
      plusLabel: 'المستلزمات والطلبات', legalLabel: 'الاستفسارات القانونية',
      plusCta: 'تواصل مع أوراقنا بلس', legalCta: 'تواصل مع الخدمات القانونية', whatsapp: 'واتساب',
    },
    footer: { rights: '© 2026 مجموعة أوراقنا. جميع الحقوق محفوظة.', privacy: 'سياسة الخصوصية', terms: 'شروط الخدمة' },
  },
} as const;

/**
 * Screenshots shown inside the circles, per language, so an Arabic visitor previews
 * and zooms into the Arabic site. Regenerate with scripts/capture-previews.py.
 */
const PREVIEW_HEIGHT: Record<string, number> = previewHeights;
const previews = (key: 'plus' | 'legal', lang: Locale) => {
  const base = `/previews/${key}${lang === 'ar' ? '-ar' : ''}`;
  return {
    preview: { src: `${base}-preview.jpg`, width: 900, height: PREVIEW_HEIGHT[`${key}-${lang}`] },
    previewHd: `${base}-preview-hd.jpg`,
    previewMobile: `${base}-preview-mobile.jpg`,
  };
};

export async function generateMetadata({ params }: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  const t = copy[isLocale(lang) ? lang : 'en'];
  return {
    title: { absolute: t.metaTitle },
    description: t.metaDescription,
    alternates: alternates('/', lang as Locale),
    openGraph: {
      title: t.metaTitle, description: t.metaDescription, type: 'website',
      locale: lang === 'ar' ? 'ar_SA' : 'en_US', images: ['/images/group/hero-scene.jpg'],
    },
  };
}

const Icon = ({ name }: { name: 'shield' | 'truck' | 'star' | 'people' }) => {
  const paths = {
    shield: <path d="M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6l7-3z" />,
    truck: <><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></>,
    star: <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.7l5.9-.8z" />,
    people: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.4" /><path d="M3 20c.5-3.5 3-5.5 6-5.5s5.5 2 6 5.5M15 14.6c2.6-.3 5 1.4 5.6 4.4" /></>,
  };
  return (
    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
};

export default async function GroupHome({ params }: PageProps<'/[lang]'>) {
  const { lang: raw } = await params;
  const lang: Locale = isLocale(raw) ? raw : 'en';
  const t = copy[lang];
  const other: Locale = lang === 'en' ? 'ar' : 'en';

  const divisions: Division[] = [
    {
      key: 'plus', href: plusPath(lang), name: 'Awraquna Plus', tagline: t.plusTagline,
      logo: { src: '/brand/plus-logo-white.png', width: 466, height: 218 },
      ...previews('plus', lang),
    },
    {
      key: 'legal', href: legalPath(lang), name: 'Awraquna Legal Services', tagline: t.legalTagline,
      logo: { src: '/brand/legal-logo-white.png', width: 900, height: 384 },
      ...previews('legal', lang),
    },
  ];

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Awraquna Group', alternateName: 'مجموعة أوراقنا', url: site.url,
    logo: `${site.url}/brand/group-logo-fig.png`,
    sameAs: Object.values(site.plus.social),
    subOrganization: [
      {
        '@type': 'LocalBusiness', name: site.plus.name, url: `${site.url}${plusPath(lang)}`,
        telephone: site.plus.phone, email: site.plus.email,
        address: { '@type': 'PostalAddress', streetAddress: 'King Salman bin Abdulaziz Road, Al-Malqa District', addressLocality: 'Riyadh', addressCountry: 'SA' },
      },
      { '@type': 'LegalService', name: site.legal.name, url: `${site.url}${legalPath(lang)}`, areaServed: ['SA', 'EG'] },
    ],
  };

  const stats = [
    { icon: 'shield', label: t.stats[0] }, { icon: 'truck', label: t.stats[1] },
    { icon: 'star', label: t.stats[2] }, { icon: 'people', label: t.stats[3] },
  ] as const;

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <a className="skip-link" href="#main">{lang === 'ar' ? 'انتقل إلى المحتوى' : 'Skip to content'}</a>

      <GroupHeader
        homeHref={localePath(lang, '/')}
        nav={[
          { href: localePath(lang, '/'), label: t.nav.home, current: true },
          { href: '#about', label: t.nav.about },
          { href: '#divisions', label: t.nav.divisions },
          { href: localePath(lang, '/blog'), label: t.nav.news },
          { href: '#contact', label: t.nav.contact },
        ]}
        langSwitch={{ href: localePath(other, '/'), label: t.lang, hrefLang: other }}
        menuLabel={t.menu}
        closeLabel={t.close}
      />

      <main id="main">
        {/* ---------- Hero ---------- */}
        <section className={styles.hero} aria-labelledby="hero-title">
          {/*
            The scene keeps the photo's proportions so the circles stay anchored to it:
            photo → copy → circles → foreground cut-out (steps, books, scales) on top,
            which is what puts the circles "behind" the staircase and the books.
          */}
          <div className={styles.scene} data-scene>
            <Image className={styles.sceneBg} src="/images/group/hero-scene.jpg" alt="" fill preload sizes="(max-width: 760px) 200vw, 100vw" />
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>{t.eyebrow}</p>
              <h1 id="hero-title" className={styles.heroTitle}>{t.title}</h1>
              <span className={styles.rule} aria-hidden="true" />
              <p className={styles.heroLede}>{t.lede}</p>
            </div>
            <DivisionCircles
              divisions={divisions}
              copy={{ explore: t.explore, hintScroll: t.hintScroll, hintTouch: t.hintTouch, previewAnnouncement: t.previewAnnouncement }}
            />
            <Image className={styles.sceneFg} src="/images/group/hero-fg.webp" alt="" width={2048} height={686} sizes="100vw" />
          </div>
        </section>

        {/* ---------- Stats ---------- */}
        <section className={styles.stats} aria-label={t.eyebrow}>
          <ul data-stagger>
            {stats.map((s) => (
              <li key={s.label}><Icon name={s.icon} /><span>{s.label}</span></li>
            ))}
          </ul>
        </section>

        {/* ---------- One vision ---------- */}
        <section id="about" className={styles.vision} aria-labelledby="vision-title">
          <div className={styles.visionText} data-reveal="left">
            <p className={styles.eyebrow}>{t.vision.eyebrow}</p>
            <h2 id="vision-title" className={styles.serifTitle}>{t.vision.title}</h2>
            <span className={styles.rule} aria-hidden="true" />
            <p className={styles.visionBody}>{t.vision.body[0]}<br />{t.vision.body[1]}</p>
          </div>
          <div className={styles.visionImage} data-reveal="fade">
            <div className={styles.parallax} data-parallax="0.1"><Image src="/images/group/vision.jpg" alt={t.vision.alt} fill sizes="(max-width: 860px) 100vw, 50vw" /></div>
          </div>
        </section>

        {/* ---------- Divisions ---------- */}
        <section id="divisions" className={styles.divisions} aria-labelledby="divisions-title">
          <div className={styles.sectionHead} data-reveal>
            <p className={styles.eyebrow}>{t.divisions.eyebrow}</p>
            <h2 id="divisions-title" className={styles.serifTitle}>{t.divisions.title}</h2>
          </div>
          <div className={styles.cards} data-stagger>
            {([
              ['plus', '/brand/plus-logo.png', 466, 218, plusPath(lang), localePath(lang, '/shop')],
              ['legal', '/brand/legal-logo-fig.png', 900, 384, legalPath(lang), legalPath(lang, '/contact')],
            ] as const).map(([key, logo, w, h, primary, secondary]) => {
              const d = t.divisions[key];
              return (
                <article key={key} className={styles.card} data-brand={key}>
                  <Image className={styles.cardLogo} src={logo} alt={d.name} width={w} height={h} sizes="170px" />
                  <p>{d.body}</p>
                  <ul>{d.points.map((p) => <li key={p}>{p}</li>)}</ul>
                  <div className={styles.cardActions}>
                    <Link className={styles.btn} href={primary}>{d.primary} <span aria-hidden="true">→</span></Link>
                    <Link className={styles.link} href={secondary}>{d.secondary}</Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ---------- Contact ---------- */}
        <section id="contact" className={styles.contact} aria-labelledby="contact-title">
          <div className={styles.sectionHead} data-reveal>
            <p className={styles.eyebrow}>{t.contact.eyebrow}</p>
            <h2 id="contact-title" className={styles.serifTitle}>{t.contact.title}</h2>
          </div>
          <div className={styles.contactGrid} data-stagger>
            <div>
              <h3>{t.contact.plusLabel}</h3>
              <p><a href={`tel:${site.plus.phone}`} dir="ltr">{site.plus.phoneDisplay}</a></p>
              <p><a href={`mailto:${site.plus.email}`}>{site.plus.email}</a></p>
              <p className={styles.muted}>{site.plus.address[lang]}</p>
              <div className={styles.cardActions}>
                <Link className={styles.btn} href={localePath(lang, '/contactus')}>{t.contact.plusCta}</Link>
                <a className={styles.link} href={whatsappLink(site.plus.whatsapp)} target="_blank" rel="noopener noreferrer">{t.contact.whatsapp}</a>
              </div>
            </div>
            <div>
              <h3>{t.contact.legalLabel}</h3>
              <p><a href={`mailto:${site.legal.email}`}>{site.legal.email}</a></p>
              {site.legal.phone && <p><a href={`tel:${site.legal.phone}`} dir="ltr">{site.legal.phone}</a></p>}
              <p className={styles.muted}>{site.legal.offices[lang]}</p>
              <div className={styles.cardActions}>
                <Link className={styles.btn} href={legalPath(lang, '/contact')}>{t.contact.legalCta}</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Image src="/brand/group-logo-white.png" alt="Awraquna Group" width={900} height={384} sizes="130px" className={styles.footerLogo} />
          <nav aria-label="Footer">
            <a href={localePath(lang, '/')}>{t.nav.home}</a>
            <a href="#about">{t.nav.about}</a>
            <Link href={plusPath(lang)}>Awraquna Plus</Link>
            <Link href={legalPath(lang)}>{lang === 'ar' ? 'الخدمات القانونية' : 'Legal Services'}</Link>
            <Link href={localePath(lang, '/blog')}>{t.nav.news}</Link>
            <a href="#contact">{t.nav.contact}</a>
          </nav>
          <a className={styles.footerLang} href={localePath(other, '/')} hrefLang={other} lang={other}>{t.lang}</a>
        </div>
        <div className={styles.footerBottom}>
          <span>{t.footer.rights}</span>
          <span>
            <Link href={localePath(lang, '/privacy')}>{t.footer.privacy}</Link>
            <Link href={localePath(lang, '/terms')}>{t.footer.terms}</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
