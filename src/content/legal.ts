/**
 * All copy for the Awraquna Legal Services site, in English and Arabic.
 * Language-neutral data (slugs, images, dates) lives in the *Meta arrays;
 * translated text is keyed by slug inside `en` / `ar`.
 *
 * Voice (brand guide): speak to "you / your business", we speak as "we",
 * lead with the benefit, stay calm — no exclamation marks, emoji or legal Latin.
 */
import type { Locale } from '@/lib/i18n';

// ---------- language-neutral data ----------

export const serviceSlugs = ['trademarks', 'intellectual-property', 'legal-advisory', 'contracts', 'compliance'] as const;
export type ServiceSlug = (typeof serviceSlugs)[number];

export type IconName =
  | 'ip' | 'trademark' | 'advisory' | 'contract' | 'compliance' | 'diamond' | 'people' | 'shield' | 'chart'
  | 'check' | 'info' | 'globe' | 'handshake' | 'target' | 'clock' | 'award' | 'chat' | 'download' | 'calendar'
  | 'registered' | 'mail' | 'phone' | 'pin';

export const serviceMeta: Record<ServiceSlug, { image: string; icon: IconName; related: ArticleSlug[] }> = {
  trademarks: { image: '/images/legal/leather-r.jpg', icon: 'trademark', related: ['trademark-registration-saudi-arabia', 'why-intellectual-property-matters'] },
  'intellectual-property': { image: '/images/legal/emboss-r.jpg', icon: 'ip', related: ['why-intellectual-property-matters', 'trademark-registration-saudi-arabia'] },
  'legal-advisory': { image: '/images/legal/scales.jpg', icon: 'advisory', related: ['role-of-legal-advisory', 'saudi-business-landscape-2026'] },
  contracts: { image: '/images/legal/contract.jpg', icon: 'contract', related: ['key-elements-commercial-contract', 'role-of-legal-advisory'] },
  compliance: { image: '/images/legal/building.jpg', icon: 'compliance', related: ['building-compliance-framework', 'opportunities-saudi-economy'] },
};

export const articleCategories = ['legal-updates', 'business-setup', 'intellectual-property', 'contracts', 'compliance', 'guides', 'perspectives'] as const;
export type ArticleCategory = (typeof articleCategories)[number];

export const articleSlugs = [
  'saudi-business-landscape-2026',
  'trademark-registration-saudi-arabia',
  'why-intellectual-property-matters',
  'opportunities-saudi-economy',
  'key-elements-commercial-contract',
  'building-compliance-framework',
  'role-of-legal-advisory',
] as const;
export type ArticleSlug = (typeof articleSlugs)[number];

/**
 * TODO(client): every article is an editorial draft (`draft: true`) and must be
 * reviewed by Awraquna's counsel before launch.
 */
export const articleMeta: Record<ArticleSlug, { date: string; categories: ArticleCategory[]; image: string; minutes: number; draft: boolean; featured?: boolean }> = {
  'saudi-business-landscape-2026': { date: '2026-03-18', categories: ['legal-updates'], image: '/images/legal/skyline-dusk.jpg', minutes: 4, draft: true, featured: true },
  'trademark-registration-saudi-arabia': { date: '2026-03-10', categories: ['intellectual-property', 'guides'], image: '/images/legal/notebook.jpg', minutes: 4, draft: true },
  'why-intellectual-property-matters': { date: '2026-02-12', categories: ['intellectual-property', 'perspectives'], image: '/images/legal/leather-r.jpg', minutes: 3, draft: true },
  'opportunities-saudi-economy': { date: '2026-02-05', categories: ['business-setup'], image: '/images/legal/skyline.jpg', minutes: 3, draft: true },
  'key-elements-commercial-contract': { date: '2026-01-28', categories: ['contracts', 'guides'], image: '/images/legal/contract.jpg', minutes: 4, draft: true },
  'building-compliance-framework': { date: '2025-12-01', categories: ['compliance', 'guides'], image: '/images/legal/desk-city.jpg', minutes: 3, draft: true },
  'role-of-legal-advisory': { date: '2025-11-20', categories: ['perspectives'], image: '/images/legal/scales.jpg', minutes: 3, draft: true },
};

/** Articles newest first. */
export const articlesByDate = [...articleSlugs].sort((a, b) => articleMeta[b].date.localeCompare(articleMeta[a].date));

export function formatDate(iso: string, lang: Locale) {
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-u-ca-gregory-nu-latn' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    .format(new Date(`${iso}T12:00:00Z`));
}

/** "{n}" placeholders in copy. */
export const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

// ---------- copy ----------

type Step = { label: string; title: string; text: string };
type Item = { title: string; text: string };
export type ArticleSection = { heading?: string; paragraphs: string[]; list?: string[] };
type Service = {
  title: string; short: string; menuNote: string; intro: string; imgAlt: string;
  covers: string[]; forWho: string[]; steps: Item[]; deliverables: string[];
};
type Article = { title: string; excerpt: string; imgAlt: string; body: ArticleSection[] };

const en = {
  meta: {
    siteName: 'Awraquna Legal Services',
    homeTitle: 'Awraquna Legal Services | Trademarks, IP & Legal Advisory in Saudi Arabia and Egypt',
    homeDescription: 'Awraquna Legal Services registers and protects trademarks, industrial designs and patents across Saudi Arabia and Egypt, with practical legal advisory for growing businesses.',
    servicesTitle: 'Legal services',
    servicesDescription: 'Trademark registration, intellectual property, legal advisory, contracts and compliance support for businesses in Saudi Arabia and Egypt.',
    aboutTitle: 'About us',
    aboutDescription: 'Why businesses choose Awraquna Legal Services: proven expertise, clear processes and a long-term partnership built on integrity.',
    resourcesTitle: 'Insights & resources',
    resourcesDescription: 'Practical guides and perspectives on trademarks, intellectual property, contracts and compliance in Saudi Arabia.',
    contactTitle: 'Contact us',
    contactDescription: 'Book a consultation or ask us to check whether your trademark is available in Saudi Arabia and Egypt.',
  },

  nav: {
    home: 'Home', services: 'Services', about: 'About', resources: 'Resources', contact: 'Contact',
    getInTouch: 'Get in touch', openMenu: 'Open menu', closeMenu: 'Close menu', main: 'Main', mobile: 'Mobile',
    homeLabel: 'Awraquna Legal Services — home', allServices: 'All services',
    otherLang: 'عربي', otherLangCode: 'ar', currentLangCode: 'EN',
  },

  common: {
    learnMore: 'Learn more', bookConsultation: 'Book a consultation', checkTrademark: 'Check a trademark',
    viewAllArticles: 'View all articles', readArticle: 'Read article', minRead: '{n} min read',
    backToResources: 'All insights', placeholder: 'placeholder', allServices: 'All services',
    disclaimer: 'General information, not legal advice. Every situation is different — speak to us before you act.',
    breadcrumb: 'Breadcrumb',
  },

  cta: {
    eyebrow: 'Get in touch',
    title: 'Let’s build a stronger tomorrow',
    text: 'Have a question or need legal support? Tell us about your business and we will come back to you with clear next steps.',
  },

  sister: {
    eyebrow: 'Also from the Awraquna family',
    title: 'Awraquna Plus — thermal paper, labels & POS supplies',
    text: 'Ready stock and Kingdom-wide delivery for retail, restaurants, logistics and healthcare.',
    cta: 'Visit Awraquna Plus',
  },

  footer: {
    blurb: 'Registering and protecting trademarks, industrial designs and patents across Saudi Arabia and Egypt.',
    servicesHeading: 'Services', companyHeading: 'Company', familyHeading: 'Awraquna family',
    plus: 'Awraquna Plus', legal: 'Awraquna Legal Services', all: 'All companies',
    privacy: 'Privacy policy', terms: 'Terms of service', copyright: '© 2026 Awraquna Legal Services. All rights reserved.',
    legalNav: 'Legal',
  },

  home: {
    eyebrow: 'Awraquna Legal Services',
    title: 'Your Legal Partner for a Brighter Tomorrow',
    lead: 'Comprehensive legal solutions with a commitment to clarity, integrity and results. We register and protect your trademarks, designs and patents across Saudi Arabia and Egypt — so you can focus on growth.',
    meta: [
      { title: 'Saudi Arabia & Egypt', text: 'Filing and protection' },
      { title: 'A to Z', text: 'From search to renewal' },
      { title: 'One partner', text: 'Local and international' },
    ],
    heroAlt: 'A leather folder embossed with the Awraquna logo on a marble desk overlooking the Riyadh skyline',
    tag: { title: 'Trademark protection', text: 'Clear guidance at every step, from search to certificate.' },
    stripLabel: 'Our services',
    about: {
      eyebrow: 'About Awraquna', title: 'More than registration',
      text: 'We are the intellectual-property arm of the Awraquna family. We give individuals and businesses clear, practical and reliable legal support — built on integrity, attention to detail and a deep understanding of local and international regulations.',
      checks: ['Trademarks, industrial designs and patents', 'Filing in Saudi Arabia and Egypt, with international coordination', 'Ongoing monitoring, renewals and enforcement support'],
      cta: 'Learn about us', imgAlt: 'The Awraquna Legal Services reception, with the logo on a marble wall',
    },
    why: {
      eyebrow: 'Why choose Awraquna', title: 'A partner you can rely on',
      text: 'We combine deep legal expertise with a practical, business-minded approach that creates real value for you.',
      items: [
        { title: 'Strategic insights', text: 'Practical solutions tailored to your goals and your market.' },
        { title: 'Trusted expertise', text: 'Local depth with international legal knowledge.' },
        { title: 'Clear processes', text: 'Transparent steps, so you always know where things stand.' },
        { title: 'Long-term value', text: 'Protection that keeps working for you as you grow.' },
      ],
    },
    services: {
      eyebrow: 'Our services', title: 'Comprehensive legal solutions',
      text: 'Intellectual property comes first — supported by the advisory, contracts and compliance work your business needs around it.',
      ctaCard: { eyebrow: 'Not sure where to start?', title: 'Tell us what you need to protect', text: 'A short call is often enough to show you the right path and what it involves.' },
    },
    process: {
      eyebrow: 'Our process', title: 'How trademark registration works',
      text: 'A structured, transparent path from your first question to a protected brand.',
      steps: [
        { label: 'Understand', title: 'Search & clearance', text: 'We check whether your mark is available and flag risks before you invest in it.' },
        { label: 'Plan', title: 'Filing', text: 'We prepare and file your application in the right classes and jurisdictions.' },
        { label: 'Execute', title: 'Examination & publication', text: 'We follow your application through review and respond on your behalf.' },
        { label: 'Achieve', title: 'Registration & monitoring', text: 'You receive your certificate; we watch for conflicts and manage renewals.' },
      ] as Step[],
      note: 'Steps and timelines are indicative and vary by jurisdiction and application. We confirm yours at the start.',
    },
    band: {
      eyebrow: 'Our commitment', title1: 'Clear advice.', title2: 'Real progress.',
      imgAlt: 'A sunlit meeting room overlooking the city',
      items: [
        { title: 'Clarity', text: 'Clear guidance at every step.' },
        { title: 'Integrity', text: 'Ethical, reliable and professional.' },
        { title: 'Results', text: 'Solutions that create real impact.' },
      ],
    },
    insights: { eyebrow: 'Insights & resources', title: 'Knowledge for what’s next' },
    quote: {
      eyebrow: 'Client perspective',
      text: 'Awraquna provided clear, practical advice that helped us navigate a complex regulatory process. Their professionalism and responsiveness gave us real confidence.',
      cite: 'CEO  |  Regional Business Group',
      imgAlt: 'A conference room with floor-to-ceiling windows',
    },
  },

  servicesPage: {
    eyebrow: 'Our services', title: 'Comprehensive legal solutions',
    lead: 'Practical, reliable and tailor-made legal services designed to protect your interests, support your growth and create lasting value.',
    heroAlt: 'A contract and fountain pen on a desk in warm light',
    stageEyebrow: 'Tailored to your needs', stageTitle: 'Legal support for every stage',
    stageText: 'We serve individuals, entrepreneurs and established businesses. Our work combines deep local knowledge with international best practice, so you can move forward with confidence.',
    stageAlt: 'An executive desk with a laptop and a view of the city',
    areasEyebrow: 'Our services', areasTitle: 'Expertise across key areas',
    featured: {
      eyebrow: 'Featured service', title: 'Trademark registration in Saudi Arabia',
      text: 'Secure your brand with expert guidance from search to registration. We keep the process simple, efficient and aligned with Saudi requirements.',
      imgAlt: 'The Riyadh skyline in the evening',
    },
    sectorsEyebrow: 'Who we work with', sectorsTitle: 'Sectors we support',
    sectorsText: 'We work with clients across a wide range of industries and tailor our support to each one.',
    sectors: ['Real estate & construction', 'Technology & innovation', 'Retail & consumer goods', 'Manufacturing & industry', 'Healthcare & life sciences', 'Finance & investment', 'Education & non-profit'],
    coversLabel: 'What we cover', forLabel: 'Who it’s for', stepsLabel: 'How we work', deliverablesLabel: 'What you receive',
    relatedLabel: 'Related insights', detailCtaTitle: 'Talk to us about {service}',
    detailCtaText: 'Tell us what you need. We will explain the options, what each involves and what it is likely to require from you.',
    otherServices: 'Other services',
  },

  services: {
    trademarks: {
      title: 'Trademarks & registration', short: 'Search and clearance, filing in Saudi Arabia and abroad, monitoring and renewals — so your brand stays yours.',
      menuNote: 'Search, filing, monitoring, renewals',
      intro: 'Your name and logo are among your most valuable assets. We help you secure them properly — from checking that a mark is free to use, through filing and examination, to keeping it protected for as long as you trade.',
      imgAlt: 'A registered-trademark symbol embossed in fig leather',
      covers: ['Availability searches and clearance opinions', 'Filing in Saudi Arabia and Egypt, with coordination for other markets', 'Choosing the right classes for your goods and services', 'Responding to examiner objections and third-party oppositions', 'Watch services that flag conflicting applications', 'Renewals, ownership transfers and recording changes'],
      forWho: ['New businesses choosing a name and logo', 'Established brands expanding into Saudi Arabia or Egypt', 'Companies that need to tidy up or extend an existing portfolio'],
      steps: [
        { title: 'Search & clearance', text: 'We check the registers and the market for conflicting marks and tell you plainly how strong your position is.' },
        { title: 'Filing', text: 'We prepare your application, select classes and descriptions, and file with the competent authority.' },
        { title: 'Examination & publication', text: 'We track your application, respond to any objections and handle oppositions if they arise.' },
        { title: 'Registration & monitoring', text: 'You receive your certificate. We record renewal dates and watch for marks that could dilute yours.' },
      ],
      deliverables: ['A written availability opinion', 'Filed applications with official receipts', 'Regular status updates in plain language', 'Registration certificates and a renewal calendar'],
    },
    'intellectual-property': {
      title: 'Intellectual property rights', short: 'Protect the value of your designs, patents and creative work with clear, strategic advice.',
      menuNote: 'Designs, patents, copyright',
      intro: 'Intellectual property is more than trademarks. Product designs, inventions, software and content can all carry real value — if they are protected and managed with intent. We help you decide what to protect, where and how.',
      imgAlt: 'An embossed registered symbol on textured paper',
      covers: ['Industrial design applications', 'Patent filing coordination and strategy', 'Copyright guidance for creative and digital work', 'Trade secret and confidentiality practices', 'IP portfolio reviews and management', 'Licensing and assignment agreements'],
      forWho: ['Manufacturers and product companies', 'Technology and creative businesses', 'Investors reviewing the IP of a target company'],
      steps: [
        { title: 'Audit', text: 'We map what you own today and identify assets that are unprotected or at risk.' },
        { title: 'Strategy', text: 'We recommend what to protect, in which markets and in what order, based on your plans and budget.' },
        { title: 'Protection', text: 'We prepare and coordinate applications and put the right agreements in place.' },
        { title: 'Management', text: 'We keep your portfolio current, track deadlines and support you if your rights are challenged.' },
      ],
      deliverables: ['An IP inventory and risk summary', 'A prioritised protection plan', 'Filed applications and supporting agreements', 'An ongoing deadline and renewal schedule'],
    },
    'legal-advisory': {
      title: 'Legal advisory', short: 'Practical guidance on commercial and regulatory questions, so you can decide with confidence.',
      menuNote: 'Commercial and regulatory advice',
      intro: 'Good decisions need clear advice. We help you understand the legal side of the choices in front of you — what the rules require, where the risks are and which option fits your goals.',
      imgAlt: 'Brass scales of justice on a marble desk',
      covers: ['Regulatory and commercial advisory', 'Legal risk assessment', 'Structuring and restructuring', 'Ongoing legal support on retainer'],
      forWho: ['Founders and management teams making key decisions', 'Foreign companies entering the Saudi or Egyptian market', 'Businesses without an in-house legal team'],
      steps: [
        { title: 'Listen', text: 'We learn your business, your goals and the decision you are facing.' },
        { title: 'Analyse', text: 'We review the applicable rules and the practical risks of each option.' },
        { title: 'Advise', text: 'We give you a clear recommendation in plain language, with the reasoning behind it.' },
        { title: 'Support', text: 'We stay with you as you act on it and adjust as circumstances change.' },
      ],
      deliverables: ['Written advice you can share with your board', 'Risk assessments with practical mitigations', 'Structuring options compared side by side', 'A single point of contact for follow-up questions'],
    },
    contracts: {
      title: 'Contracts & documentation', short: 'Commercial contracts, NDAs and partnership agreements, drafted and reviewed to protect your interests.',
      menuNote: 'Drafting, review, negotiation',
      intro: 'A clear contract prevents most disputes before they start. We draft, review and negotiate the agreements your business relies on, so that everyone knows what has been agreed.',
      imgAlt: 'A contract and fountain pen on a desk',
      covers: ['Commercial and supply contracts', 'NDAs and confidentiality agreements', 'Employment and partnership agreements', 'Distribution, agency and licensing agreements', 'Customised templates for repeat transactions'],
      forWho: ['Businesses signing with new suppliers, customers or partners', 'Teams that need reliable templates they can reuse', 'Anyone asked to sign an agreement they are unsure about'],
      steps: [
        { title: 'Brief', text: 'We understand the deal, the parties and what matters most to you.' },
        { title: 'Draft or review', text: 'We prepare a clear draft or mark up the other side’s version with explanations.' },
        { title: 'Negotiate', text: 'We support you in discussions and suggest workable compromises.' },
        { title: 'Finalise', text: 'We prepare the signing version and summarise your key obligations and dates.' },
      ],
      deliverables: ['Clear, bilingual-ready contracts', 'Marked-up reviews with plain-language notes', 'A summary of key obligations and deadlines', 'Reusable templates where they make sense'],
    },
    compliance: {
      title: 'Compliance & business support', short: 'Business set-up, licensing and governance support that keeps your growth on solid ground.',
      menuNote: 'Set-up, licensing, governance',
      intro: 'Regulatory requirements change, and keeping up can take time away from running your business. We help you set up correctly, stay compliant and build governance that scales with you.',
      imgAlt: 'A modern office building with palm trees',
      covers: ['Regulatory compliance advisory', 'Corporate governance support', 'Business set-up and licensing', 'Ongoing compliance management', 'Data protection and policy reviews'],
      forWho: ['Companies setting up or expanding in Saudi Arabia', 'Growing businesses formalising their governance', 'Regulated sectors that need regular reviews'],
      steps: [
        { title: 'Assess', text: 'We review your activities against the requirements that apply to them.' },
        { title: 'Plan', text: 'We set out what needs to change, in order of priority.' },
        { title: 'Implement', text: 'We help you put licences, policies and processes in place.' },
        { title: 'Maintain', text: 'We track changes in the rules and keep your records up to date.' },
      ],
      deliverables: ['A compliance gap assessment', 'A prioritised action plan', 'Policies and governance documents', 'A compliance calendar with renewal dates'],
    },
  } satisfies Record<ServiceSlug, Service>,

  about: {
    eyebrow: 'Why us', title: 'A partner you can rely on',
    lead: 'Practical legal solutions. Trusted expertise. A lasting commitment to your success.',
    heroAlt: 'A boardroom overlooking the Riyadh skyline',
    strip: ['Trusted expertise', 'Client-focused approach', 'Clear processes', 'Lasting impact', 'Local and international perspective'],
    reasons: {
      eyebrow: 'What sets Awraquna apart', title: 'Six reasons clients choose us',
      text: 'We go beyond legal advice. Our approach combines deep expertise, practical solutions and a genuine commitment to your goals.',
      items: [
        { title: 'Proven expertise', text: 'Deep knowledge of Saudi and Egyptian requirements and international best practice.' },
        { title: 'Client-centred', text: 'We listen, understand and tailor our work to your goals and challenges.' },
        { title: 'Practical solutions', text: 'Clear, commercially minded advice that helps you move forward with confidence.' },
        { title: 'Transparent communication', text: 'You will always know where things stand, with clear guidance at every step.' },
        { title: 'Local and international reach', text: 'A strong understanding of local regulations with a global perspective.' },
        { title: 'A long-term partner', text: 'We focus on lasting relationships and on contributing to your success over time.' },
      ],
    },
    process: {
      eyebrow: 'Our process', title: 'A clear path to results',
      text: 'We follow a structured, transparent process so that every engagement is efficient, focused and aligned with your goals.',
      steps: [
        { label: '1', title: 'Understand', text: 'We listen to your goals, challenges and priorities.' },
        { label: '2', title: 'Plan', text: 'We develop a tailored strategy with clear milestones.' },
        { label: '3', title: 'Execute', text: 'We deliver practical solutions with consistent communication.' },
        { label: '4', title: 'Achieve', text: 'We help you reach your goals and continue to support you.' },
      ] as Step[],
    },
    value: {
      eyebrow: 'Tangible advantages', title: 'Real business value',
      text: 'Working with Awraquna means more than legal support — it brings measurable advantages to your business.',
      items: [
        { title: 'Reduced risk', text: 'Navigate complex regulations with confidence.' },
        { title: 'Greater efficiency', text: 'Save time with clear, practical guidance.' },
        { title: 'Stronger decisions', text: 'Act on reliable insight and strategic advice.' },
        { title: 'Business growth', text: 'Focus on opportunities while we handle the legal detail.' },
        { title: 'Long-term stability', text: 'Build a strong foundation for sustainable success.' },
        { title: 'A trusted advisor', text: 'A partner committed to your continued success.' },
      ],
    },
    quote: { eyebrow: 'Client perspective', title: 'Trusted by businesses like yours' },
    ctaTitle: 'Build a stronger future',
  },

  resources: {
    eyebrow: 'Insights & resources', title: 'Knowledge for what’s next',
    lead: 'Helpful insights, updates and practical guides to keep you informed. We share knowledge that helps individuals and businesses move forward with confidence.',
    heroAlt: 'Law books on Saudi regulations, commercial law and intellectual property',
    filterLabel: 'Filter insights by topic',
    all: 'All',
    categories: {
      'legal-updates': 'Legal updates', 'business-setup': 'Business setup', 'intellectual-property': 'Intellectual property',
      contracts: 'Contracts', compliance: 'Compliance', guides: 'Guides', perspectives: 'Perspectives',
    } satisfies Record<ArticleCategory, string>,
    featured: 'Featured article', readFull: 'Read full article', recent: 'Recent articles', latest: 'Latest insights',
    empty: 'No articles in this topic yet.',
    guides: {
      eyebrow: 'Guides & resources', title: 'Practical resources for your business journey',
      text: 'Downloadable guides on key legal topics in Saudi Arabia. We are preparing them now.',
      comingSoon: 'Coming soon',
      items: [
        { title: 'Business set-up guide', text: 'A practical guide to setting up your business in Saudi Arabia.' },
        { title: 'Compliance checklist', text: 'Key compliance requirements for businesses operating in Saudi Arabia.' },
        { title: 'Trademark registration guide', text: 'A step-by-step overview of the trademark registration process.' },
        { title: 'Contract essentials', text: 'Key elements to consider when drafting commercial contracts.' },
      ],
    },
    newsletter: {
      eyebrow: 'Stay informed', title: 'Get the latest insights',
      text: 'Subscribe for legal updates, practical guides and new resources, delivered to your inbox.',
      label: 'Your email address', submit: 'Subscribe', success: 'Thank you. You are subscribed.',
      imgAlt: 'A laptop and plant on a sunlit desk',
    },
    articleLabel: 'Article', draftNote: 'Draft — pending review by counsel',
  },

  articles: {
    'saudi-business-landscape-2026': {
      title: 'Saudi Arabia’s evolving business landscape: key legal developments in 2026',
      excerpt: 'The reforms of recent years have changed how companies are formed, how contracts are read and how data is handled. Here is what they mean for investors, entrepreneurs and established companies.',
      imgAlt: 'The Riyadh skyline at dusk',
      body: [
        { paragraphs: [
          'Saudi Arabia has modernised much of its commercial legal framework over the past few years. For businesses, 2026 is less about new headlines and more about putting those reforms into practice: updating documents, governance and internal processes so they reflect the rules as they now stand.',
        ] },
        { heading: 'A more flexible framework for companies', paragraphs: [
          'The updated Companies Law gives founders and shareholders more freedom in how they structure and run their companies. That flexibility is valuable, but it also means your articles of association and shareholder agreements carry more weight. If yours were drafted under the previous rules, it is worth reviewing whether they still say what you intend.',
        ] },
        { heading: 'Contracts read against a codified civil law', paragraphs: [
          'The Civil Transactions Law brought many principles of contract and liability into a single written code. In practice, this makes outcomes more predictable — and it rewards clear drafting. Key commercial contracts deserve a fresh look at how they deal with liability, termination and changes in circumstances.',
        ] },
        { heading: 'Personal data is now a compliance topic', paragraphs: [
          'With the Personal Data Protection Law in force, collecting and using customer and employee data comes with defined obligations. Most businesses need, at minimum, a clear privacy notice, a record of what they collect and why, and a process for handling requests.',
        ] },
        { heading: 'What to do now', paragraphs: ['A short, structured review usually covers the essentials:'], list: [
          'Check that your constitutional documents reflect how your company actually operates.',
          'Review your most important contracts for liability and termination terms.',
          'Map the personal data you hold and update your notices and policies.',
          'Make sure your trademarks and other IP are registered in the name of the right entity.',
        ] },
        { paragraphs: ['If you would like help prioritising, we can walk through your situation in a short consultation.'] },
      ],
    },
    'trademark-registration-saudi-arabia': {
      title: 'A guide to trademark registration in Saudi Arabia',
      excerpt: 'What a trademark protects, how the registration process works and how to avoid the most common mistakes when you file.',
      imgAlt: 'A fig leather notebook embossed with the Awraquna logo',
      body: [
        { paragraphs: [
          'A registered trademark gives you the exclusive right to use your brand for the goods and services it covers. Without registration, protecting a name or logo is far harder — and another business may register it first. In Saudi Arabia, trademark applications are handled by the Saudi Authority for Intellectual Property (SAIP).',
        ] },
        { heading: '1. Decide what to protect', paragraphs: [
          'You can register a word, a logo, or both. Many businesses file the word mark first, because it protects the name however it is styled, and add the logo once it is final.',
        ] },
        { heading: '2. Search before you file', paragraphs: [
          'An availability search shows whether a similar mark is already registered or pending for related goods or services. It is the single best way to avoid a refused application or a dispute after you have invested in your brand.',
        ] },
        { heading: '3. Choose the right classes', paragraphs: [
          'Trademarks are registered for specific classes of goods and services under the international Nice Classification. Choosing too narrowly leaves gaps; choosing too broadly adds cost and can invite objections. Your descriptions should match what you actually sell, and what you plan to sell soon.',
        ] },
        { heading: '4. Examination and publication', paragraphs: [
          'After filing, the application is examined. If the examiner raises an objection, you have the opportunity to respond. Accepted applications are published so that third parties can oppose them within a set period. A well-prepared application reduces the chance of delays at both stages.',
        ] },
        { heading: '5. Registration and beyond', paragraphs: ['Once registered, your mark must be renewed periodically. Good practice after registration includes:'], list: [
          'Keeping a calendar of renewal dates.',
          'Watching for new applications that are confusingly similar to yours.',
          'Recording any change of owner, name or address.',
          'Using the mark consistently, as registered.',
        ] },
        { paragraphs: ['Timelines and official fees change from time to time, and each application is different. We confirm the current requirements for yours at the start.'] },
      ],
    },
    'why-intellectual-property-matters': {
      title: 'Why intellectual property matters for growing businesses',
      excerpt: 'Your brand, designs and know-how are often worth more than your equipment. Protecting them early is one of the most cost-effective decisions you can make.',
      imgAlt: 'A registered-trademark symbol embossed in fig leather',
      body: [
        { paragraphs: [
          'When a business is growing, intellectual property can feel like something to deal with later. In practice, the opposite is true: the earlier you protect your key assets, the cheaper and simpler it is — and the stronger your position when it matters.',
        ] },
        { heading: 'IP is value you can point to', paragraphs: [
          'Investors, buyers and lenders look at what a company owns. Registered trademarks, designs and patents are assets with clear boundaries. Unregistered ideas are much harder to value or defend.',
        ] },
        { heading: 'It protects your growth', paragraphs: [
          'Expanding into a new market, launching a product line or opening franchise locations all depend on being able to use your brand there. Discovering that someone else holds the rights can stop a launch or force a costly rebrand.',
        ] },
        { heading: 'It turns into revenue', paragraphs: [
          'Protected IP can be licensed to partners, distributors or franchisees. Clear ownership and good agreements make those arrangements possible.',
        ] },
        { heading: 'Where to start', paragraphs: ['A simple review usually answers three questions:'], list: [
          'What do we own that gives us an advantage?',
          'Which of those assets are registered, and in whose name?',
          'Where do we plan to trade in the next few years?',
        ] },
        { paragraphs: ['From there, a prioritised plan lets you protect what matters most first, within a budget that makes sense.'] },
      ],
    },
    'opportunities-saudi-economy': {
      title: 'Opportunities in Saudi Arabia’s growing economy',
      excerpt: 'Economic diversification is opening new sectors to local and international businesses. A solid legal foundation helps you move quickly when the right opportunity appears.',
      imgAlt: 'The Riyadh skyline with the Kingdom Centre',
      body: [
        { paragraphs: [
          'Saudi Arabia’s diversification agenda under Vision 2030 has widened the range of sectors open to private investment, from tourism and entertainment to technology, logistics and manufacturing. For businesses, that creates real opportunity — and a need to get the legal groundwork right.',
        ] },
        { heading: 'Choose the right structure', paragraphs: [
          'How you enter the market affects ownership, licensing, tax and how easily you can grow later. Comparing the options early avoids restructuring under time pressure.',
        ] },
        { heading: 'Secure your brand before you launch', paragraphs: [
          'Registering your trademarks in Saudi Arabia before you announce your arrival protects you against others filing first. It is one of the simplest steps to take and one of the hardest to fix later.',
        ] },
        { heading: 'Put clear agreements in place', paragraphs: [
          'Partnerships, distribution arrangements and supply contracts are often the backbone of a new venture. Clear, well-drafted agreements protect relationships as well as interests.',
        ] },
        { heading: 'Plan for compliance from day one', paragraphs: ['Building compliance into your set-up is easier than retrofitting it. At a minimum, consider:'], list: [
          'The licences your activities require.',
          'Employment and workforce requirements.',
          'How you collect and handle personal data.',
          'Governance that will scale as you grow.',
        ] },
        { paragraphs: ['We help businesses take these steps in a practical order, so that legal work supports the opportunity rather than slowing it down.'] },
      ],
    },
    'key-elements-commercial-contract': {
      title: 'Key elements of a strong commercial contract',
      excerpt: 'Most disputes start with an unclear contract. These are the elements that matter most — and the questions to ask before you sign.',
      imgAlt: 'A contract and fountain pen on a desk',
      body: [
        { paragraphs: [
          'A good contract is not the longest one. It is the one that both parties understand in the same way, that reflects the deal actually agreed, and that tells you what happens when things do not go to plan.',
        ] },
        { heading: 'The essentials', paragraphs: ['Whatever the transaction, check that the contract clearly covers:'], list: [
          'Who the parties are, with their correct legal names and details.',
          'What is being supplied, to what standard and by when.',
          'Price, payment terms and what happens if payment is late.',
          'How long the agreement lasts and how either side can end it.',
          'Liability: what each party is responsible for, and any limits.',
          'Confidentiality and ownership of any intellectual property created.',
          'Governing law and how disputes will be resolved.',
        ] },
        { heading: 'Plan for change', paragraphs: [
          'Circumstances change. Clauses dealing with variations, delays and events outside either party’s control help you adapt without starting a dispute.',
        ] },
        { heading: 'Language matters', paragraphs: [
          'Where a contract exists in Arabic and English, make sure both versions say the same thing, and agree which version prevails if they differ.',
        ] },
        { heading: 'Before you sign', paragraphs: [
          'Read the contract as if the relationship had gone wrong. If the answer to “what happens now?” is unclear, it is worth clarifying before you sign rather than after. A review of your key contracts is usually a small investment compared with the cost of a dispute.',
        ] },
      ],
    },
    'building-compliance-framework': {
      title: 'Building a strong compliance framework',
      excerpt: 'Compliance works best as a simple, repeatable system rather than a one-off project. Here is how to build one that grows with your business.',
      imgAlt: 'An office desk with a laptop overlooking the city',
      body: [
        { paragraphs: [
          'A compliance framework is simply the way your business makes sure it follows the rules that apply to it — consistently, and in a way you can show to others. It does not need to be complicated to be effective.',
        ] },
        { heading: 'Know what applies to you', paragraphs: [
          'Start by mapping your activities against the requirements that govern them: licences, sector regulations, employment rules, data protection and reporting obligations. This becomes your compliance register.',
        ] },
        { heading: 'Assign clear ownership', paragraphs: [
          'Every requirement should have someone responsible for it. Clear ownership is what turns a list into a working system.',
        ] },
        { heading: 'Keep it in writing', paragraphs: [
          'Short, practical policies — written for the people who use them — help teams act consistently and give you evidence if questions arise.',
        ] },
        { heading: 'Review regularly', paragraphs: ['Rules and businesses both change. A simple routine keeps your framework current:'], list: [
          'A compliance calendar with licence and filing dates.',
          'A periodic review of your register against new requirements.',
          'Training for staff in roles where the rules matter most.',
          'A clear way to report and fix issues when they are found.',
        ] },
        { paragraphs: ['We help businesses set up frameworks proportionate to their size, and maintain them as they grow.'] },
      ],
    },
    'role-of-legal-advisory': {
      title: 'The role of legal advisory in long-term growth',
      excerpt: 'Legal advice is most valuable before decisions are made, not after problems appear. A trusted advisor helps you grow with fewer surprises.',
      imgAlt: 'Brass scales of justice on a marble desk',
      body: [
        { paragraphs: [
          'Many businesses only call a lawyer when something has gone wrong. By then, options are narrower and costs are higher. The businesses that grow most smoothly tend to involve legal advice earlier — when the decision is still being shaped.',
        ] },
        { heading: 'From reactive to proactive', paragraphs: [
          'An advisor who knows your business can spot issues before they become problems: a contract term that limits a future deal, a brand that is not registered in a new market, a structure that will not suit the next stage of growth.',
        ] },
        { heading: 'Advice that fits the business', paragraphs: [
          'The best legal advice is practical. It explains the risk, weighs it against the commercial benefit and recommends a way forward — in plain language that management can act on.',
        ] },
        { heading: 'Continuity builds value', paragraphs: ['A long-term relationship means your advisor already understands your history, your priorities and your appetite for risk. That makes every conversation faster and every recommendation more relevant. In practice, this often looks like:'], list: [
          'A regular check-in on upcoming plans and decisions.',
          'A single point of contact for day-to-day questions.',
          'Periodic reviews of contracts, IP and compliance.',
        ] },
        { paragraphs: ['That is the kind of partnership we aim to build with every client.'] },
      ],
    },
  } satisfies Record<ArticleSlug, Article>,

  contact: {
    eyebrow: 'Get in touch', title: 'Let’s talk about what you need',
    lead: 'Book a consultation or ask us to check a trademark. We reply within one business day with clear next steps.',
    // TODO(client): confirm the reply-time commitment above.
    consultation: {
      tab: 'Book a consultation', title: 'Book a consultation',
      text: 'Tell us a little about your business and what you need. We will suggest a time and the right person to speak with.',
      submit: 'Request consultation',
    },
    trademark: {
      tab: 'Check a trademark', title: 'Check a trademark',
      text: 'Send us the mark you want to protect. We will check availability in the countries you choose and come back with a plain-language opinion.',
      submit: 'Request a trademark check',
    },
    fields: {
      name: 'Full name', email: 'Email', phone: 'Phone', company: 'Company (optional)',
      service: 'What can we help with?', serviceAny: 'I’m not sure yet',
      contactMethod: 'Preferred way to reach you', methods: { email: 'Email', phone: 'Phone call', whatsapp: 'WhatsApp' },
      message: 'Message', messageHint: 'A few lines about your situation is enough.',
      markName: 'Trademark (word or name)', markHint: 'Exactly as you would like to register it.',
      goods: 'Goods or services', goodsHint: 'What will you sell under this mark? Class numbers are welcome if you know them.',
      countries: 'Where do you need protection?', countryOptions: { sa: 'Saudi Arabia', eg: 'Egypt', both: 'Both' },
      logo: 'Logo (optional)', logoHint: 'Link to your logo, or describe it. You can also send it to us by email.',
      contactHint: 'Email or phone — at least one, so we can reply.',
    },
    sending: 'Sending…',
    success: { title: 'Thank you — we have received your request.', text: 'Your reference is {ref}. We will be in touch shortly.' },
    errors: {
      invalid: 'Please check the highlighted fields.', failed: 'Something went wrong on our side. Please try again, or email us.',
      required: 'This field is required.', email: 'Please enter a valid email address.', phone: 'Please enter a valid phone number.',
      emailOrPhone: 'Please give us an email or phone number.',
    },
    details: { title: 'Contact details', email: 'Email', phone: 'Phone', offices: 'Offices', placeholderNote: 'Contact details to be confirmed' },
  },
};

export type LegalDict = typeof en;

// TODO(client): Arabic copy is a professional-quality draft; have it reviewed by a native legal copywriter.
const ar: LegalDict = {
  meta: {
    siteName: 'أوراقنا للخدمات القانونية',
    homeTitle: 'أوراقنا للخدمات القانونية | العلامات التجارية والملكية الفكرية والاستشارات القانونية في السعودية ومصر',
    homeDescription: 'تسجّل أوراقنا للخدمات القانونية العلامات التجارية والنماذج الصناعية وبراءات الاختراع وتحميها في المملكة العربية السعودية ومصر، مع استشارات قانونية عملية للشركات النامية.',
    servicesTitle: 'الخدمات القانونية',
    servicesDescription: 'تسجيل العلامات التجارية، والملكية الفكرية، والاستشارات القانونية، والعقود، ودعم الامتثال للشركات في السعودية ومصر.',
    aboutTitle: 'من نحن',
    aboutDescription: 'لماذا تختار الشركات أوراقنا للخدمات القانونية: خبرة مثبتة، وإجراءات واضحة، وشراكة طويلة الأمد قائمة على النزاهة.',
    resourcesTitle: 'رؤى ومصادر',
    resourcesDescription: 'أدلة عملية ورؤى حول العلامات التجارية والملكية الفكرية والعقود والامتثال في المملكة العربية السعودية.',
    contactTitle: 'تواصل معنا',
    contactDescription: 'احجز استشارة أو اطلب منا التحقق من توفر علامتك التجارية في السعودية ومصر.',
  },

  nav: {
    home: 'الرئيسية', services: 'الخدمات', about: 'من نحن', resources: 'المصادر', contact: 'تواصل معنا',
    getInTouch: 'تواصل معنا', openMenu: 'فتح القائمة', closeMenu: 'إغلاق القائمة', main: 'القائمة الرئيسية', mobile: 'قائمة الجوال',
    homeLabel: 'أوراقنا للخدمات القانونية — الرئيسية', allServices: 'جميع الخدمات',
    otherLang: 'English', otherLangCode: 'en', currentLangCode: 'ع',
  },

  common: {
    learnMore: 'اعرف المزيد', bookConsultation: 'احجز استشارة', checkTrademark: 'تحقّق من علامة تجارية',
    viewAllArticles: 'عرض جميع المقالات', readArticle: 'اقرأ المقال', minRead: 'قراءة {n} دقائق',
    backToResources: 'جميع الرؤى', placeholder: 'مؤقت', allServices: 'جميع الخدمات',
    disclaimer: 'معلومات عامة وليست استشارة قانونية. لكل حالة ظروفها — تحدّث إلينا قبل أن تتخذ أي إجراء.',
    breadcrumb: 'مسار التنقل',
  },

  cta: {
    eyebrow: 'تواصل معنا',
    title: 'لنبنِ معًا غدًا أقوى',
    text: 'لديك سؤال أو تحتاج إلى دعم قانوني؟ أخبرنا عن عملك وسنعود إليك بخطوات واضحة.',
  },

  sister: {
    eyebrow: 'من عائلة أوراقنا أيضًا',
    title: 'أوراقنا بلس — الورق الحراري والملصقات ومستلزمات نقاط البيع',
    text: 'مخزون جاهز وتوصيل إلى جميع أنحاء المملكة لقطاعات التجزئة والمطاعم والخدمات اللوجستية والرعاية الصحية.',
    cta: 'زر أوراقنا بلس',
  },

  footer: {
    blurb: 'تسجيل العلامات التجارية والنماذج الصناعية وبراءات الاختراع وحمايتها في المملكة العربية السعودية ومصر.',
    servicesHeading: 'الخدمات', companyHeading: 'الشركة', familyHeading: 'عائلة أوراقنا',
    plus: 'أوراقنا بلس', legal: 'أوراقنا للخدمات القانونية', all: 'كل الشركات',
    privacy: 'سياسة الخصوصية', terms: 'شروط الخدمة', copyright: '© 2026 أوراقنا للخدمات القانونية. جميع الحقوق محفوظة.',
    legalNav: 'روابط قانونية',
  },

  home: {
    eyebrow: 'أوراقنا للخدمات القانونية',
    title: 'شريكك القانوني من أجل غدٍ أكثر إشراقًا',
    lead: 'حلول قانونية متكاملة بالتزام راسخ بالوضوح والنزاهة والنتائج. نسجّل علاماتك التجارية ونماذجك وبراءات اختراعك ونحميها في المملكة العربية السعودية ومصر — لتتفرغ أنت للنمو.',
    meta: [
      { title: 'السعودية ومصر', text: 'التسجيل والحماية' },
      { title: 'من الألف إلى الياء', text: 'من البحث إلى التجديد' },
      { title: 'شريك واحد', text: 'محليًا ودوليًا' },
    ],
    heroAlt: 'ملف جلدي منقوش عليه شعار أوراقنا على مكتب رخامي يطل على أفق الرياض',
    tag: { title: 'حماية العلامات التجارية', text: 'إرشاد واضح في كل خطوة، من البحث حتى الشهادة.' },
    stripLabel: 'خدماتنا',
    about: {
      eyebrow: 'عن أوراقنا', title: 'أكثر من مجرد تسجيل',
      text: 'نحن ذراع الملكية الفكرية في عائلة أوراقنا. نقدّم للأفراد والشركات دعمًا قانونيًا واضحًا وعمليًا وموثوقًا، يقوم على النزاهة والاهتمام بالتفاصيل والفهم العميق للأنظمة المحلية والدولية.',
      checks: ['العلامات التجارية والنماذج الصناعية وبراءات الاختراع', 'التسجيل في السعودية ومصر، مع التنسيق الدولي', 'المراقبة المستمرة والتجديد ودعم إنفاذ الحقوق'],
      cta: 'تعرّف علينا', imgAlt: 'استقبال أوراقنا للخدمات القانونية وعليه الشعار على جدار رخامي',
    },
    why: {
      eyebrow: 'لماذا أوراقنا', title: 'شريك يمكنك الاعتماد عليه',
      text: 'نجمع بين الخبرة القانونية العميقة ونهج عملي يراعي متطلبات الأعمال ويحقق لك قيمة حقيقية.',
      items: [
        { title: 'رؤى استراتيجية', text: 'حلول عملية مصممة وفق أهدافك وسوقك.' },
        { title: 'خبرة موثوقة', text: 'معرفة محلية عميقة مع خبرة قانونية دولية.' },
        { title: 'إجراءات واضحة', text: 'خطوات شفافة تجعلك على اطلاع دائم بموقف أعمالك.' },
        { title: 'قيمة طويلة الأمد', text: 'حماية تستمر في خدمتك مع نمو أعمالك.' },
      ],
    },
    services: {
      eyebrow: 'خدماتنا', title: 'حلول قانونية متكاملة',
      text: 'الملكية الفكرية أولًا — مدعومة بالاستشارات والعقود وأعمال الامتثال التي تحتاجها أعمالك من حولها.',
      ctaCard: { eyebrow: 'لا تعرف من أين تبدأ؟', title: 'أخبرنا بما تريد حمايته', text: 'غالبًا ما تكفي مكالمة قصيرة لتوضيح الطريق الصحيح وما يتطلبه.' },
    },
    process: {
      eyebrow: 'منهجيتنا', title: 'كيف يتم تسجيل العلامة التجارية',
      text: 'مسار منظم وشفاف من سؤالك الأول حتى علامة تجارية محمية.',
      steps: [
        { label: 'الفهم', title: 'البحث والتحقق', text: 'نتحقق من توفر علامتك وننبهك إلى المخاطر قبل أن تستثمر فيها.' },
        { label: 'التخطيط', title: 'تقديم الطلب', text: 'نُعدّ طلبك ونقدّمه في الفئات والدول المناسبة.' },
        { label: 'التنفيذ', title: 'الفحص والنشر', text: 'نتابع طلبك خلال مرحلة الفحص ونرد نيابةً عنك.' },
        { label: 'الإنجاز', title: 'التسجيل والمراقبة', text: 'تستلم شهادتك، ونراقب أي تعارض وندير مواعيد التجديد.' },
      ],
      note: 'الخطوات والمدد الزمنية تقديرية وتختلف حسب الدولة والطلب. نؤكد لك تفاصيل طلبك في البداية.',
    },
    band: {
      eyebrow: 'التزامنا', title1: 'مشورة واضحة.', title2: 'تقدّم حقيقي.',
      imgAlt: 'قاعة اجتماعات مشمسة تطل على المدينة',
      items: [
        { title: 'الوضوح', text: 'إرشاد واضح في كل خطوة.' },
        { title: 'النزاهة', text: 'أخلاقية وموثوقية واحترافية.' },
        { title: 'النتائج', text: 'حلول تُحدث أثرًا حقيقيًا.' },
      ],
    },
    insights: { eyebrow: 'رؤى ومصادر', title: 'معرفة لما هو قادم' },
    quote: {
      eyebrow: 'رأي عملائنا',
      text: 'قدّمت لنا أوراقنا مشورة واضحة وعملية ساعدتنا على اجتياز إجراء تنظيمي معقد. احترافيتهم وسرعة استجابتهم منحتنا ثقة حقيقية.',
      cite: 'الرئيس التنفيذي  |  مجموعة أعمال إقليمية',
      imgAlt: 'قاعة اجتماعات بنوافذ ممتدة من الأرض حتى السقف',
    },
  },

  servicesPage: {
    eyebrow: 'خدماتنا', title: 'حلول قانونية متكاملة',
    lead: 'خدمات قانونية عملية وموثوقة ومصممة خصيصًا لحماية مصالحك ودعم نموك وتحقيق قيمة تدوم.',
    heroAlt: 'عقد وقلم حبر على مكتب في ضوء دافئ',
    stageEyebrow: 'مصممة وفق احتياجاتك', stageTitle: 'دعم قانوني لكل مرحلة',
    stageText: 'نخدم الأفراد وروّاد الأعمال والشركات القائمة. نجمع بين المعرفة المحلية العميقة وأفضل الممارسات الدولية، لتمضي قدمًا بثقة.',
    stageAlt: 'مكتب تنفيذي عليه حاسوب محمول ويطل على المدينة',
    areasEyebrow: 'خدماتنا', areasTitle: 'خبرة في المجالات الرئيسية',
    featured: {
      eyebrow: 'خدمة مميزة', title: 'تسجيل العلامات التجارية في المملكة العربية السعودية',
      text: 'احمِ علامتك بإرشاد متخصص من البحث حتى التسجيل. نجعل الإجراء بسيطًا وفعالًا ومتوافقًا مع المتطلبات السعودية.',
      imgAlt: 'أفق الرياض في المساء',
    },
    sectorsEyebrow: 'من نعمل معهم', sectorsTitle: 'القطاعات التي ندعمها',
    sectorsText: 'نعمل مع عملاء في مجموعة واسعة من القطاعات ونصمم دعمنا بما يناسب كلًا منها.',
    sectors: ['العقارات والإنشاءات', 'التقنية والابتكار', 'التجزئة والسلع الاستهلاكية', 'التصنيع والصناعة', 'الرعاية الصحية وعلوم الحياة', 'المال والاستثمار', 'التعليم والقطاع غير الربحي'],
    coversLabel: 'ما نغطيه', forLabel: 'لمن هذه الخدمة', stepsLabel: 'كيف نعمل', deliverablesLabel: 'ما الذي تحصل عليه',
    relatedLabel: 'رؤى ذات صلة', detailCtaTitle: 'تحدّث إلينا بشأن {service}',
    detailCtaText: 'أخبرنا بما تحتاج. سنشرح لك الخيارات المتاحة، وما يتضمنه كل خيار، وما قد يتطلبه منك.',
    otherServices: 'خدمات أخرى',
  },

  services: {
    trademarks: {
      title: 'العلامات التجارية والتسجيل', short: 'البحث والتحقق، والتسجيل في السعودية وخارجها، والمراقبة والتجديد — لتبقى علامتك ملكك.',
      menuNote: 'البحث، التسجيل، المراقبة، التجديد',
      intro: 'اسمك وشعارك من أثمن أصولك. نساعدك على حمايتهما بالطريقة الصحيحة — من التحقق من أن العلامة متاحة للاستخدام، مرورًا بتقديم الطلب والفحص، وصولًا إلى الحفاظ على حمايتها طوال مدة نشاطك.',
      imgAlt: 'رمز العلامة المسجلة منقوش على جلد بلون التين',
      covers: ['البحث عن توفر العلامات وإبداء الرأي في إمكانية تسجيلها', 'التسجيل في السعودية ومصر، مع التنسيق للأسواق الأخرى', 'اختيار الفئات المناسبة لسلعك وخدماتك', 'الرد على اعتراضات الفاحص ومعارضات الغير', 'خدمات المراقبة التي تنبهك إلى الطلبات المتعارضة', 'التجديد ونقل الملكية وقيد التغييرات'],
      forWho: ['الشركات الناشئة التي تختار اسمًا وشعارًا', 'العلامات القائمة التي تتوسع إلى السعودية أو مصر', 'الشركات التي تحتاج إلى تنظيم محفظتها الحالية أو توسيعها'],
      steps: [
        { title: 'البحث والتحقق', text: 'نراجع السجلات والسوق بحثًا عن علامات متعارضة ونوضح لك موقفك بصراحة.' },
        { title: 'تقديم الطلب', text: 'نُعدّ طلبك ونختار الفئات والأوصاف ونقدّمه إلى الجهة المختصة.' },
        { title: 'الفحص والنشر', text: 'نتابع طلبك ونرد على أي اعتراضات ونتولى المعارضات إن وُجدت.' },
        { title: 'التسجيل والمراقبة', text: 'تستلم شهادتك، ونسجّل مواعيد التجديد ونراقب العلامات التي قد تضعف علامتك.' },
      ],
      deliverables: ['رأي مكتوب حول توفر العلامة', 'طلبات مقدّمة مع الإيصالات الرسمية', 'تحديثات منتظمة بلغة واضحة', 'شهادات التسجيل وجدول مواعيد التجديد'],
    },
    'intellectual-property': {
      title: 'حقوق الملكية الفكرية', short: 'احمِ قيمة تصاميمك وبراءات اختراعك وأعمالك الإبداعية بمشورة واضحة واستراتيجية.',
      menuNote: 'النماذج الصناعية، البراءات، حقوق المؤلف',
      intro: 'الملكية الفكرية أوسع من العلامات التجارية. تصاميم المنتجات والاختراعات والبرمجيات والمحتوى قد تحمل قيمة حقيقية — إذا حُميت وأُديرت بوعي. نساعدك على تحديد ما تحميه، وأين، وكيف.',
      imgAlt: 'رمز العلامة المسجلة بارز على ورق محبب',
      covers: ['طلبات تسجيل النماذج الصناعية', 'التنسيق والاستراتيجية في تسجيل براءات الاختراع', 'إرشادات حقوق المؤلف للأعمال الإبداعية والرقمية', 'ممارسات حماية الأسرار التجارية والسرية', 'مراجعة محافظ الملكية الفكرية وإدارتها', 'اتفاقيات الترخيص والتنازل'],
      forWho: ['المصنّعون وشركات المنتجات', 'شركات التقنية والصناعات الإبداعية', 'المستثمرون الذين يراجعون الملكية الفكرية لشركة مستهدفة'],
      steps: [
        { title: 'التدقيق', text: 'نحصر ما تملكه اليوم ونحدد الأصول غير المحمية أو المعرّضة للخطر.' },
        { title: 'الاستراتيجية', text: 'نوصي بما يجب حمايته، وفي أي الأسواق، وبأي ترتيب، وفق خططك وميزانيتك.' },
        { title: 'الحماية', text: 'نُعدّ الطلبات وننسقها ونضع الاتفاقيات المناسبة.' },
        { title: 'الإدارة', text: 'نحافظ على محفظتك محدّثة ونتابع المواعيد وندعمك إذا تعرضت حقوقك للطعن.' },
      ],
      deliverables: ['حصر للملكية الفكرية وملخص للمخاطر', 'خطة حماية مرتبة حسب الأولوية', 'طلبات مقدّمة واتفاقيات داعمة', 'جدول مستمر للمواعيد والتجديدات'],
    },
    'legal-advisory': {
      title: 'الاستشارات القانونية', short: 'إرشاد عملي في المسائل التجارية والتنظيمية، لتتخذ قراراتك بثقة.',
      menuNote: 'استشارات تجارية وتنظيمية',
      intro: 'القرارات الجيدة تحتاج إلى مشورة واضحة. نساعدك على فهم الجانب القانوني من الخيارات المطروحة أمامك — ما تتطلبه الأنظمة، وأين تكمن المخاطر، وأي خيار يناسب أهدافك.',
      imgAlt: 'ميزان عدالة نحاسي على مكتب رخامي',
      covers: ['الاستشارات التنظيمية والتجارية', 'تقييم المخاطر القانونية', 'الهيكلة وإعادة الهيكلة', 'دعم قانوني مستمر بعقد سنوي'],
      forWho: ['المؤسسون والإدارات التي تتخذ قرارات مهمة', 'الشركات الأجنبية التي تدخل السوق السعودي أو المصري', 'الشركات التي لا تملك فريقًا قانونيًا داخليًا'],
      steps: [
        { title: 'الإصغاء', text: 'نتعرف على عملك وأهدافك والقرار الذي تواجهه.' },
        { title: 'التحليل', text: 'نراجع الأنظمة المعمول بها والمخاطر العملية لكل خيار.' },
        { title: 'المشورة', text: 'نقدّم لك توصية واضحة بلغة مبسطة مع أسبابها.' },
        { title: 'المساندة', text: 'نبقى إلى جانبك أثناء التنفيذ ونعدّل مع تغيّر الظروف.' },
      ],
      deliverables: ['مشورة مكتوبة يمكنك مشاركتها مع مجلس الإدارة', 'تقييمات للمخاطر مع حلول عملية للحد منها', 'خيارات الهيكلة مقارنةً جنبًا إلى جنب', 'جهة تواصل واحدة لأسئلة المتابعة'],
    },
    contracts: {
      title: 'العقود والتوثيق', short: 'عقود تجارية واتفاقيات سرية وشراكة، نصوغها ونراجعها لحماية مصالحك.',
      menuNote: 'الصياغة، المراجعة، التفاوض',
      intro: 'العقد الواضح يمنع معظم النزاعات قبل أن تبدأ. نصوغ الاتفاقيات التي تعتمد عليها أعمالك ونراجعها ونتفاوض عليها، ليعرف الجميع ما تم الاتفاق عليه.',
      imgAlt: 'عقد وقلم حبر على مكتب',
      covers: ['العقود التجارية وعقود التوريد', 'اتفاقيات عدم الإفصاح والسرية', 'عقود العمل واتفاقيات الشراكة', 'اتفاقيات التوزيع والوكالة والترخيص', 'نماذج مخصصة للمعاملات المتكررة'],
      forWho: ['الشركات التي تتعاقد مع موردين أو عملاء أو شركاء جدد', 'الفرق التي تحتاج إلى نماذج موثوقة قابلة لإعادة الاستخدام', 'كل من يُطلب منه توقيع اتفاقية لا يطمئن إليها'],
      steps: [
        { title: 'فهم المطلوب', text: 'نفهم الصفقة وأطرافها وما يهمك أكثر من غيره.' },
        { title: 'الصياغة أو المراجعة', text: 'نُعدّ مسودة واضحة أو نراجع نسخة الطرف الآخر مع ملاحظات مشروحة.' },
        { title: 'التفاوض', text: 'ندعمك في المناقشات ونقترح حلولًا وسطًا قابلة للتطبيق.' },
        { title: 'الإتمام', text: 'نُعدّ النسخة النهائية للتوقيع ونلخص التزاماتك ومواعيدك الرئيسية.' },
      ],
      deliverables: ['عقود واضحة جاهزة باللغتين', 'مراجعات مع ملاحظات بلغة مبسطة', 'ملخص للالتزامات والمواعيد الرئيسية', 'نماذج قابلة لإعادة الاستخدام حيث يكون ذلك مفيدًا'],
    },
    compliance: {
      title: 'الامتثال ودعم الأعمال', short: 'دعم في تأسيس الأعمال والتراخيص والحوكمة يُبقي نموك على أساس متين.',
      menuNote: 'التأسيس، التراخيص، الحوكمة',
      intro: 'المتطلبات التنظيمية تتغير، ومواكبتها قد تأخذ من وقتك في إدارة أعمالك. نساعدك على التأسيس الصحيح والبقاء ممتثلًا وبناء حوكمة تتسع مع نموك.',
      imgAlt: 'مبنى مكاتب حديث تحيط به أشجار النخيل',
      covers: ['الاستشارات في الامتثال التنظيمي', 'دعم حوكمة الشركات', 'تأسيس الأعمال والتراخيص', 'إدارة الامتثال المستمرة', 'مراجعة سياسات حماية البيانات'],
      forWho: ['الشركات التي تؤسس أعمالها أو تتوسع في السعودية', 'الشركات النامية التي تنظم حوكمتها', 'القطاعات المنظمة التي تحتاج إلى مراجعات دورية'],
      steps: [
        { title: 'التقييم', text: 'نراجع أنشطتك مقارنةً بالمتطلبات التي تنطبق عليها.' },
        { title: 'التخطيط', text: 'نحدد ما يجب تغييره مرتبًا حسب الأولوية.' },
        { title: 'التنفيذ', text: 'نساعدك على استكمال التراخيص والسياسات والإجراءات.' },
        { title: 'المتابعة', text: 'نتابع تغيّر الأنظمة ونُبقي سجلاتك محدّثة.' },
      ],
      deliverables: ['تقييم لفجوات الامتثال', 'خطة عمل مرتبة حسب الأولوية', 'سياسات ووثائق حوكمة', 'تقويم للامتثال بمواعيد التجديد'],
    },
  },

  about: {
    eyebrow: 'لماذا نحن', title: 'شريك يمكنك الاعتماد عليه',
    lead: 'حلول قانونية عملية. خبرة موثوقة. التزام دائم بنجاحك.',
    heroAlt: 'قاعة اجتماعات تطل على أفق الرياض',
    strip: ['خبرة موثوقة', 'نهج يركز على العميل', 'إجراءات واضحة', 'أثر يدوم', 'منظور محلي ودولي'],
    reasons: {
      eyebrow: 'ما يميز أوراقنا', title: 'ستة أسباب تجعل العملاء يختاروننا',
      text: 'نتجاوز تقديم المشورة القانونية. يجمع نهجنا بين الخبرة العميقة والحلول العملية والالتزام الصادق بأهدافك.',
      items: [
        { title: 'خبرة مثبتة', text: 'معرفة عميقة بالمتطلبات السعودية والمصرية وأفضل الممارسات الدولية.' },
        { title: 'العميل أولًا', text: 'نصغي ونفهم ونصمم عملنا وفق أهدافك وتحدياتك.' },
        { title: 'حلول عملية', text: 'مشورة واضحة بعقلية تجارية تساعدك على المضي بثقة.' },
        { title: 'تواصل شفاف', text: 'ستعرف دائمًا موقف أعمالك، مع إرشاد واضح في كل خطوة.' },
        { title: 'حضور محلي ودولي', text: 'فهم متين للأنظمة المحلية مع منظور عالمي.' },
        { title: 'شريك طويل الأمد', text: 'نركز على علاقات دائمة وعلى الإسهام في نجاحك على المدى البعيد.' },
      ],
    },
    process: {
      eyebrow: 'منهجيتنا', title: 'طريق واضح إلى النتائج',
      text: 'نتبع منهجية منظمة وشفافة لتكون كل مهمة فعالة ومركزة ومتسقة مع أهدافك.',
      steps: [
        { label: '1', title: 'الفهم', text: 'نصغي إلى أهدافك وتحدياتك وأولوياتك.' },
        { label: '2', title: 'التخطيط', text: 'نضع استراتيجية مصممة لك بمراحل واضحة.' },
        { label: '3', title: 'التنفيذ', text: 'نقدّم حلولًا عملية مع تواصل مستمر.' },
        { label: '4', title: 'الإنجاز', text: 'نساعدك على بلوغ أهدافك ونواصل دعمك.' },
      ],
    },
    value: {
      eyebrow: 'مزايا ملموسة', title: 'قيمة حقيقية لأعمالك',
      text: 'العمل مع أوراقنا أكثر من مجرد دعم قانوني — إنه يمنح أعمالك مزايا يمكن قياسها.',
      items: [
        { title: 'مخاطر أقل', text: 'تعامل مع الأنظمة المعقدة بثقة.' },
        { title: 'كفاءة أعلى', text: 'وفّر وقتك بإرشاد واضح وعملي.' },
        { title: 'قرارات أقوى', text: 'اعتمد على رؤى موثوقة ومشورة استراتيجية.' },
        { title: 'نمو الأعمال', text: 'ركّز على الفرص ونحن نتولى التفاصيل القانونية.' },
        { title: 'استقرار طويل الأمد', text: 'ابنِ أساسًا متينًا لنجاح مستدام.' },
        { title: 'مستشار موثوق', text: 'شريك ملتزم بنجاحك المستمر.' },
      ],
    },
    quote: { eyebrow: 'رأي عملائنا', title: 'موثوقون لدى شركات مثل شركتك' },
    ctaTitle: 'ابنِ مستقبلًا أقوى',
  },

  resources: {
    eyebrow: 'رؤى ومصادر', title: 'معرفة لما هو قادم',
    lead: 'رؤى وتحديثات وأدلة عملية تبقيك على اطلاع. نشارك معرفة تساعد الأفراد والشركات على المضي قدمًا بثقة.',
    heroAlt: 'كتب قانونية عن الأنظمة السعودية والقانون التجاري والملكية الفكرية',
    filterLabel: 'تصفية الرؤى حسب الموضوع',
    all: 'الكل',
    categories: {
      'legal-updates': 'مستجدات قانونية', 'business-setup': 'تأسيس الأعمال', 'intellectual-property': 'الملكية الفكرية',
      contracts: 'العقود', compliance: 'الامتثال', guides: 'أدلة', perspectives: 'وجهات نظر',
    },
    featured: 'مقال مميز', readFull: 'اقرأ المقال كاملًا', recent: 'أحدث المقالات', latest: 'أحدث الرؤى',
    empty: 'لا توجد مقالات في هذا الموضوع بعد.',
    guides: {
      eyebrow: 'أدلة ومصادر', title: 'مصادر عملية لرحلة أعمالك',
      text: 'أدلة قابلة للتنزيل حول أهم الموضوعات القانونية في المملكة العربية السعودية. نعمل على إعدادها حاليًا.',
      comingSoon: 'قريبًا',
      items: [
        { title: 'دليل تأسيس الأعمال', text: 'دليل عملي لتأسيس عملك في المملكة العربية السعودية.' },
        { title: 'قائمة التحقق من الامتثال', text: 'أهم متطلبات الامتثال للشركات العاملة في المملكة.' },
        { title: 'دليل تسجيل العلامات التجارية', text: 'نظرة عامة خطوة بخطوة على إجراءات تسجيل العلامة التجارية.' },
        { title: 'أساسيات العقود', text: 'عناصر رئيسية يجب مراعاتها عند صياغة العقود التجارية.' },
      ],
    },
    newsletter: {
      eyebrow: 'ابقَ على اطلاع', title: 'احصل على أحدث الرؤى',
      text: 'اشترك لتصلك المستجدات القانونية والأدلة العملية والمصادر الجديدة إلى بريدك الإلكتروني.',
      label: 'بريدك الإلكتروني', submit: 'اشترك', success: 'شكرًا لك. تم اشتراكك.',
      imgAlt: 'حاسوب محمول ونبتة على مكتب مشمس',
    },
    articleLabel: 'مقال', draftNote: 'مسودة — بانتظار مراجعة المستشار القانوني',
  },

  articles: {
    'saudi-business-landscape-2026': {
      title: 'بيئة الأعمال المتطورة في السعودية: أبرز المستجدات القانونية في 2026',
      excerpt: 'غيّرت إصلاحات السنوات الأخيرة طريقة تأسيس الشركات وقراءة العقود والتعامل مع البيانات. إليك ما تعنيه للمستثمرين وروّاد الأعمال والشركات القائمة.',
      imgAlt: 'أفق الرياض عند الغروب',
      body: [
        { paragraphs: [
          'حدّثت المملكة العربية السعودية جزءًا كبيرًا من إطارها القانوني التجاري خلال السنوات القليلة الماضية. وبالنسبة للشركات، فإن عام 2026 لا يتعلق بعناوين جديدة بقدر ما يتعلق بتطبيق تلك الإصلاحات عمليًا: تحديث الوثائق والحوكمة والإجراءات الداخلية لتعكس الأنظمة كما هي اليوم.',
        ] },
        { heading: 'إطار أكثر مرونة للشركات', paragraphs: [
          'يمنح نظام الشركات المحدّث المؤسسين والشركاء مرونة أكبر في هيكلة شركاتهم وإدارتها. هذه المرونة قيّمة، لكنها تعني أيضًا أن نظامك الأساسي واتفاقيات الشركاء أصبحت أكثر أهمية. إذا صيغت وثائقك وفق الأنظمة السابقة، فمن المفيد مراجعة ما إذا كانت لا تزال تعبّر عما تقصده.',
        ] },
        { heading: 'العقود في ضوء نظام مدني مُقنَّن', paragraphs: [
          'جمع نظام المعاملات المدنية كثيرًا من مبادئ العقود والمسؤولية في نص مكتوب واحد. وعمليًا، يجعل ذلك النتائج أكثر قابلية للتوقع ويكافئ الصياغة الواضحة. لذا تستحق عقودك التجارية الرئيسية نظرة جديدة في طريقة معالجتها للمسؤولية والإنهاء وتغيّر الظروف.',
        ] },
        { heading: 'البيانات الشخصية أصبحت مسألة امتثال', paragraphs: [
          'مع سريان نظام حماية البيانات الشخصية، أصبح جمع بيانات العملاء والموظفين واستخدامها مقترنًا بالتزامات محددة. وتحتاج معظم الشركات على الأقل إلى إشعار خصوصية واضح، وسجل لما تجمعه وسببه، وإجراء للتعامل مع الطلبات.',
        ] },
        { heading: 'ما الذي ينبغي فعله الآن', paragraphs: ['عادةً ما تغطي مراجعة قصيرة ومنظمة الأساسيات:'], list: [
          'تحقق من أن وثائق التأسيس تعكس طريقة عمل شركتك فعليًا.',
          'راجع أهم عقودك من حيث شروط المسؤولية والإنهاء.',
          'حدد البيانات الشخصية التي تحتفظ بها وحدّث إشعاراتك وسياساتك.',
          'تأكد من تسجيل علاماتك التجارية وملكيتك الفكرية باسم الكيان الصحيح.',
        ] },
        { paragraphs: ['إذا رغبت في المساعدة على ترتيب الأولويات، يمكننا مراجعة وضعك في استشارة قصيرة.'] },
      ],
    },
    'trademark-registration-saudi-arabia': {
      title: 'دليل تسجيل العلامات التجارية في المملكة العربية السعودية',
      excerpt: 'ما الذي تحميه العلامة التجارية، وكيف تجري إجراءات التسجيل، وكيف تتجنب الأخطاء الأكثر شيوعًا عند تقديم الطلب.',
      imgAlt: 'دفتر جلدي بلون التين منقوش عليه شعار أوراقنا',
      body: [
        { paragraphs: [
          'تمنحك العلامة التجارية المسجلة الحق الحصري في استخدام علامتك للسلع والخدمات التي تشملها. ومن دون تسجيل، تصبح حماية الاسم أو الشعار أصعب بكثير — وقد تسبقك شركة أخرى إلى تسجيله. وفي المملكة العربية السعودية، تتولى الهيئة السعودية للملكية الفكرية طلبات تسجيل العلامات التجارية.',
        ] },
        { heading: '1. حدّد ما تريد حمايته', paragraphs: [
          'يمكنك تسجيل كلمة أو شعار أو كليهما. وتبدأ كثير من الشركات بتسجيل العلامة اللفظية لأنها تحمي الاسم أيًا كان شكله، ثم تضيف الشعار بعد اعتماده نهائيًا.',
        ] },
        { heading: '2. ابحث قبل أن تتقدم', paragraphs: [
          'يكشف البحث عن التوفر ما إذا كانت هناك علامة مشابهة مسجلة أو قيد التسجيل لسلع أو خدمات ذات صلة. وهو أفضل وسيلة لتجنب رفض الطلب أو الدخول في نزاع بعد أن تكون قد استثمرت في علامتك.',
        ] },
        { heading: '3. اختر الفئات المناسبة', paragraphs: [
          'تُسجّل العلامات التجارية لفئات محددة من السلع والخدمات وفق تصنيف نيس الدولي. الاختيار الضيق يترك ثغرات، والاختيار الواسع يزيد التكلفة وقد يثير اعتراضات. ينبغي أن تطابق أوصافك ما تبيعه فعلًا وما تخطط لبيعه قريبًا.',
        ] },
        { heading: '4. الفحص والنشر', paragraphs: [
          'بعد تقديم الطلب يخضع للفحص. وإذا أبدى الفاحص اعتراضًا، تُتاح لك فرصة الرد. أما الطلبات المقبولة فتُنشر ليتمكن الغير من الاعتراض عليها خلال مدة محددة. والطلب المُعدّ جيدًا يقلل احتمالات التأخير في المرحلتين.',
        ] },
        { heading: '5. التسجيل وما بعده', paragraphs: ['بعد التسجيل، يجب تجديد علامتك بصفة دورية. ومن الممارسات الجيدة بعد التسجيل:'], list: [
          'الاحتفاظ بتقويم لمواعيد التجديد.',
          'مراقبة الطلبات الجديدة المشابهة لعلامتك بشكل قد يسبب اللبس.',
          'قيد أي تغيير في المالك أو الاسم أو العنوان.',
          'استخدام العلامة بشكل ثابت كما سُجّلت.',
        ] },
        { paragraphs: ['تتغير المدد والرسوم الرسمية من وقت لآخر، ولكل طلب ظروفه. نؤكد لك المتطلبات الحالية لطلبك في البداية.'] },
      ],
    },
    'why-intellectual-property-matters': {
      title: 'لماذا تهم الملكية الفكرية الشركات النامية',
      excerpt: 'علامتك وتصاميمك ومعرفتك الفنية غالبًا ما تساوي أكثر من معداتك. وحمايتها مبكرًا من أكثر القرارات جدوى من حيث التكلفة.',
      imgAlt: 'رمز العلامة المسجلة منقوش على جلد بلون التين',
      body: [
        { paragraphs: [
          'عندما تنمو الشركة، قد تبدو الملكية الفكرية أمرًا يمكن تأجيله. لكن العكس هو الصحيح: كلما بادرت إلى حماية أصولك الرئيسية مبكرًا، كان ذلك أقل تكلفة وأبسط — وكان موقفك أقوى عندما يهم الأمر.',
        ] },
        { heading: 'الملكية الفكرية قيمة يمكن إثباتها', paragraphs: [
          'ينظر المستثمرون والمشترون والمقرضون إلى ما تملكه الشركة. والعلامات التجارية والنماذج وبراءات الاختراع المسجلة أصول ذات حدود واضحة، أما الأفكار غير المسجلة فيصعب تقييمها أو الدفاع عنها.',
        ] },
        { heading: 'إنها تحمي نموك', paragraphs: [
          'التوسع إلى سوق جديدة، أو إطلاق خط منتجات، أو افتتاح فروع امتياز، كلها تعتمد على قدرتك على استخدام علامتك هناك. واكتشاف أن غيرك يملك الحقوق قد يوقف الإطلاق أو يفرض عليك تغيير هويتك بتكلفة عالية.',
        ] },
        { heading: 'وتتحول إلى إيرادات', paragraphs: [
          'يمكن ترخيص الملكية الفكرية المحمية للشركاء أو الموزعين أو أصحاب الامتياز. والملكية الواضحة والاتفاقيات الجيدة هي ما يجعل هذه الترتيبات ممكنة.',
        ] },
        { heading: 'من أين تبدأ', paragraphs: ['عادةً ما تجيب مراجعة بسيطة عن ثلاثة أسئلة:'], list: [
          'ما الذي نملكه ويمنحنا ميزة؟',
          'أيّ هذه الأصول مسجّل، وباسم من؟',
          'أين نخطط للعمل خلال السنوات القليلة المقبلة؟',
        ] },
        { paragraphs: ['ومن هناك، تتيح لك خطة مرتبة حسب الأولوية حماية الأهم أولًا، وبميزانية منطقية.'] },
      ],
    },
    'opportunities-saudi-economy': {
      title: 'الفرص في الاقتصاد السعودي المتنامي',
      excerpt: 'يفتح التنويع الاقتصادي قطاعات جديدة أمام الشركات المحلية والدولية. والأساس القانوني المتين يساعدك على التحرك بسرعة عندما تظهر الفرصة المناسبة.',
      imgAlt: 'أفق الرياض ويظهر فيه برج المملكة',
      body: [
        { paragraphs: [
          'وسّعت أجندة التنويع ضمن رؤية 2030 نطاق القطاعات المفتوحة أمام الاستثمار الخاص، من السياحة والترفيه إلى التقنية والخدمات اللوجستية والتصنيع. وهذا يخلق فرصًا حقيقية للشركات — ويستدعي إعداد الأساس القانوني بشكل صحيح.',
        ] },
        { heading: 'اختر الهيكل المناسب', paragraphs: [
          'تؤثر طريقة دخولك السوق في الملكية والتراخيص والضرائب وسهولة التوسع لاحقًا. ومقارنة الخيارات مبكرًا تجنبك إعادة الهيكلة تحت ضغط الوقت.',
        ] },
        { heading: 'احمِ علامتك قبل الإطلاق', paragraphs: [
          'تسجيل علاماتك التجارية في السعودية قبل الإعلان عن دخولك السوق يحميك من أن يسبقك غيرك إلى تسجيلها. إنها من أبسط الخطوات، ومن أصعبها تداركًا لاحقًا.',
        ] },
        { heading: 'ضع اتفاقيات واضحة', paragraphs: [
          'غالبًا ما تكون الشراكات وترتيبات التوزيع وعقود التوريد العمود الفقري لأي مشروع جديد. والاتفاقيات الواضحة والمحكمة الصياغة تحمي العلاقات كما تحمي المصالح.',
        ] },
        { heading: 'خطط للامتثال من اليوم الأول', paragraphs: ['إدماج الامتثال في مرحلة التأسيس أسهل من إضافته لاحقًا. وعلى الأقل، فكّر في:'], list: [
          'التراخيص التي تتطلبها أنشطتك.',
          'متطلبات العمل والقوى العاملة.',
          'كيفية جمع البيانات الشخصية والتعامل معها.',
          'حوكمة تتسع مع نموك.',
        ] },
        { paragraphs: ['نساعد الشركات على اتخاذ هذه الخطوات بترتيب عملي، ليكون العمل القانوني داعمًا للفرصة لا معطلًا لها.'] },
      ],
    },
    'key-elements-commercial-contract': {
      title: 'العناصر الأساسية للعقد التجاري المتين',
      excerpt: 'تبدأ معظم النزاعات بعقد غير واضح. هذه هي العناصر الأهم — والأسئلة التي ينبغي طرحها قبل التوقيع.',
      imgAlt: 'عقد وقلم حبر على مكتب',
      body: [
        { paragraphs: [
          'العقد الجيد ليس الأطول، بل هو الذي يفهمه الطرفان بالطريقة نفسها، ويعكس الصفقة المتفق عليها فعلًا، ويوضح ما يحدث عندما لا تسير الأمور كما خُطط لها.',
        ] },
        { heading: 'الأساسيات', paragraphs: ['أيًا كانت المعاملة، تحقق من أن العقد يغطي بوضوح:'], list: [
          'هوية الأطراف بأسمائهم وبياناتهم القانونية الصحيحة.',
          'ما الذي سيُورَّد، وبأي مستوى، ومتى.',
          'السعر وشروط الدفع وما يترتب على التأخر في السداد.',
          'مدة الاتفاقية وكيف يمكن لأي طرف إنهاؤها.',
          'المسؤولية: ما يتحمله كل طرف وأي حدود لها.',
          'السرية وملكية أي ملكية فكرية تنشأ عن العقد.',
          'القانون الواجب التطبيق وطريقة تسوية النزاعات.',
        ] },
        { heading: 'خطط للتغيير', paragraphs: [
          'الظروف تتغير. والبنود التي تعالج التعديلات والتأخير والأحداث الخارجة عن إرادة الطرفين تساعدك على التكيف دون الدخول في نزاع.',
        ] },
        { heading: 'اللغة مهمة', paragraphs: [
          'إذا كان العقد محررًا بالعربية والإنجليزية، فتأكد من تطابق النسختين، واتفقا على النسخة التي تسود عند الاختلاف.',
        ] },
        { heading: 'قبل أن توقّع', paragraphs: [
          'اقرأ العقد كما لو أن العلاقة تعثرت. فإذا لم تكن الإجابة عن سؤال «ماذا يحدث الآن؟» واضحة، فمن الأفضل توضيحها قبل التوقيع لا بعده. ومراجعة عقودك الرئيسية عادةً ما تكون استثمارًا صغيرًا مقارنةً بتكلفة النزاع.',
        ] },
      ],
    },
    'building-compliance-framework': {
      title: 'بناء إطار امتثال متين',
      excerpt: 'يعمل الامتثال بأفضل صورة عندما يكون نظامًا بسيطًا قابلًا للتكرار لا مشروعًا لمرة واحدة. إليك كيف تبني إطارًا ينمو مع أعمالك.',
      imgAlt: 'مكتب عليه حاسوب محمول يطل على المدينة',
      body: [
        { paragraphs: [
          'إطار الامتثال هو ببساطة الطريقة التي تضمن بها شركتك التزامها بالأنظمة المنطبقة عليها — باستمرار، وبطريقة يمكنك إثباتها للآخرين. ولا يلزم أن يكون معقدًا ليكون فعالًا.',
        ] },
        { heading: 'اعرف ما ينطبق عليك', paragraphs: [
          'ابدأ بمطابقة أنشطتك مع المتطلبات التي تحكمها: التراخيص، وأنظمة القطاع، وأنظمة العمل، وحماية البيانات، والتزامات الإفصاح. ويصبح ذلك سجل الامتثال الخاص بك.',
        ] },
        { heading: 'حدّد المسؤوليات بوضوح', paragraphs: [
          'ينبغي أن يكون لكل متطلب شخص مسؤول عنه. فالمسؤولية الواضحة هي ما يحوّل القائمة إلى نظام فعّال.',
        ] },
        { heading: 'دوّن كل شيء', paragraphs: [
          'السياسات القصيرة والعملية — المكتوبة لمن سيستخدمها — تساعد الفرق على العمل باتساق، وتمنحك ما تثبت به التزامك إذا طُرحت أسئلة.',
        ] },
        { heading: 'راجع بانتظام', paragraphs: ['تتغير الأنظمة وتتغير الشركات. وروتين بسيط يُبقي إطارك محدّثًا:'], list: [
          'تقويم للامتثال يتضمن مواعيد التراخيص والإيداعات.',
          'مراجعة دورية لسجلك في ضوء المتطلبات الجديدة.',
          'تدريب الموظفين في الأدوار الأكثر ارتباطًا بالأنظمة.',
          'آلية واضحة للإبلاغ عن المشكلات ومعالجتها عند اكتشافها.',
        ] },
        { paragraphs: ['نساعد الشركات على إعداد أطر تتناسب مع حجمها، والمحافظة عليها مع نموها.'] },
      ],
    },
    'role-of-legal-advisory': {
      title: 'دور الاستشارات القانونية في النمو طويل الأمد',
      excerpt: 'تكون المشورة القانونية في أقصى قيمتها قبل اتخاذ القرارات، لا بعد ظهور المشكلات. والمستشار الموثوق يساعدك على النمو بمفاجآت أقل.',
      imgAlt: 'ميزان عدالة نحاسي على مكتب رخامي',
      body: [
        { paragraphs: [
          'كثير من الشركات لا تتصل بمحامٍ إلا عندما يقع خطأ ما. وحينها تكون الخيارات أضيق والتكاليف أعلى. أما الشركات التي تنمو بسلاسة أكبر فتميل إلى إشراك المشورة القانونية مبكرًا — حين يكون القرار لا يزال قيد التشكل.',
        ] },
        { heading: 'من ردّ الفعل إلى المبادرة', paragraphs: [
          'المستشار الذي يعرف أعمالك يستطيع رصد المشكلات قبل وقوعها: بند في عقد يقيّد صفقة مستقبلية، أو علامة غير مسجلة في سوق جديدة، أو هيكل لا يناسب المرحلة التالية من النمو.',
        ] },
        { heading: 'مشورة تناسب طبيعة الأعمال', paragraphs: [
          'أفضل مشورة قانونية هي المشورة العملية: تشرح المخاطر، وتوازنها مع العائد التجاري، وتوصي بطريق للمضي قدمًا — بلغة واضحة تستطيع الإدارة العمل بها.',
        ] },
        { heading: 'الاستمرارية تصنع القيمة', paragraphs: ['العلاقة طويلة الأمد تعني أن مستشارك يفهم تاريخك وأولوياتك ومدى تقبلك للمخاطر. وهذا يجعل كل حوار أسرع وكل توصية أكثر صلة. وعمليًا، يبدو ذلك غالبًا على النحو التالي:'], list: [
          'لقاء دوري لمناقشة الخطط والقرارات القادمة.',
          'جهة تواصل واحدة للأسئلة اليومية.',
          'مراجعات دورية للعقود والملكية الفكرية والامتثال.',
        ] },
        { paragraphs: ['هذا هو نوع الشراكة الذي نسعى إلى بنائه مع كل عميل.'] },
      ],
    },
  },

  contact: {
    eyebrow: 'تواصل معنا', title: 'لنتحدث عما تحتاجه',
    lead: 'احجز استشارة أو اطلب منا التحقق من علامة تجارية. نرد خلال يوم عمل واحد بخطوات واضحة.',
    consultation: {
      tab: 'احجز استشارة', title: 'احجز استشارة',
      text: 'أخبرنا قليلًا عن عملك وما تحتاجه. سنقترح موعدًا والشخص المناسب للحديث معه.',
      submit: 'اطلب استشارة',
    },
    trademark: {
      tab: 'تحقّق من علامة تجارية', title: 'تحقّق من علامة تجارية',
      text: 'أرسل إلينا العلامة التي تريد حمايتها. سنتحقق من توفرها في الدول التي تختارها ونعود إليك برأي واضح.',
      submit: 'اطلب التحقق من العلامة',
    },
    fields: {
      name: 'الاسم الكامل', email: 'البريد الإلكتروني', phone: 'رقم الجوال', company: 'الشركة (اختياري)',
      service: 'بماذا يمكننا مساعدتك؟', serviceAny: 'لست متأكدًا بعد',
      contactMethod: 'الطريقة المفضلة للتواصل معك', methods: { email: 'البريد الإلكتروني', phone: 'مكالمة هاتفية', whatsapp: 'واتساب' },
      message: 'الرسالة', messageHint: 'تكفي بضعة أسطر عن وضعك.',
      markName: 'العلامة التجارية (كلمة أو اسم)', markHint: 'كما تريد تسجيلها تمامًا.',
      goods: 'السلع أو الخدمات', goodsHint: 'ما الذي ستبيعه تحت هذه العلامة؟ يمكنك ذكر أرقام الفئات إن كنت تعرفها.',
      countries: 'أين تحتاج إلى الحماية؟', countryOptions: { sa: 'السعودية', eg: 'مصر', both: 'كلاهما' },
      logo: 'الشعار (اختياري)', logoHint: 'أرفق رابطًا لشعارك أو صِفه. يمكنك أيضًا إرساله إلينا بالبريد الإلكتروني.',
      contactHint: 'البريد الإلكتروني أو رقم الجوال — واحد على الأقل لنتمكن من الرد.',
    },
    sending: 'جارٍ الإرسال…',
    success: { title: 'شكرًا لك — استلمنا طلبك.', text: 'رقمك المرجعي {ref}. سنتواصل معك قريبًا.' },
    errors: {
      invalid: 'يرجى مراجعة الحقول المظللة.', failed: 'حدث خطأ من جهتنا. يرجى المحاولة مرة أخرى أو مراسلتنا بالبريد الإلكتروني.',
      required: 'هذا الحقل مطلوب.', email: 'يرجى إدخال بريد إلكتروني صحيح.', phone: 'يرجى إدخال رقم صحيح.',
      emailOrPhone: 'يرجى تزويدنا ببريد إلكتروني أو رقم جوال.',
    },
    details: { title: 'بيانات التواصل', email: 'البريد الإلكتروني', phone: 'الهاتف', offices: 'المكاتب', placeholderNote: 'بيانات التواصل قيد التأكيد' },
  },
};

export const legalContent: Record<Locale, LegalDict> = { en, ar };
export const getLegal = (lang: Locale) => legalContent[lang];
