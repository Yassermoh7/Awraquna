/** Copy shared by the Awraquna Group pages (the homepage and the group news page): header, footer and news. */
export const groupChrome = {
  en: {
    nav: { home: 'Home', about: 'About Us', divisions: 'Our Divisions', news: 'News', contact: 'Contact' },
    lang: 'العربية', menu: 'Open menu', close: 'Close menu', skip: 'Skip to content',
    legalShort: 'Legal Services',
    footer: { rights: '© 2026 Awraquna Group. All rights reserved.', privacy: 'Privacy Policy', terms: 'Terms of Service' },
  },
  ar: {
    nav: { home: 'الرئيسية', about: 'من نحن', divisions: 'أقسامنا', news: 'الأخبار', contact: 'تواصل معنا' },
    lang: 'English', menu: 'فتح القائمة', close: 'إغلاق القائمة', skip: 'انتقل إلى المحتوى',
    legalShort: 'الخدمات القانونية',
    footer: { rights: '© 2026 مجموعة أوراقنا. جميع الحقوق محفوظة.', privacy: 'سياسة الخصوصية', terms: 'شروط الخدمة' },
  },
} as const;

/** The group-level news page: neutral framing around the same posts as the Plus news page. */
export const groupNews = {
  en: {
    metaTitle: 'News and updates | Awraquna Group',
    metaDescription: 'News and updates from across Awraquna Group.',
    eyebrow: 'News',
    title: 'News and updates',
    lead: 'The latest from across Awraquna Group.',
    breadcrumb: 'Breadcrumb',
  },
  ar: {
    metaTitle: 'الأخبار والمستجدات | مجموعة أوراقنا',
    metaDescription: 'آخر الأخبار والمستجدات من مجموعة أوراقنا.',
    eyebrow: 'الأخبار',
    title: 'الأخبار والمستجدات',
    lead: 'آخر المستجدات من مجموعة أوراقنا.',
    breadcrumb: 'مسار التنقل',
  },
} as const;
