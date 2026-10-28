/**
 * Business details and integration settings. Values that differ per
 * environment come from env vars (see .env.example).
 */
export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',

  plus: {
    name: 'Awraquna Plus',
    phone: '+966552606070',
    phoneDisplay: '+966 55 260 6070',
    whatsapp: '966552606070',
    email: 'info@awraquna.com',
    address: {
      en: 'King Salman bin Abdulaziz Road, Al-Malqa District, Riyadh, Saudi Arabia',
      ar: 'طريق الملك سلمان بن عبدالعزيز، حي الملقا، الرياض، المملكة العربية السعودية',
    },
    social: {
      linkedin: 'https://www.linkedin.com/company/awraquna',
      instagram: 'https://www.instagram.com/awraquna.sa/',
      facebook: 'https://web.facebook.com/p/Awraquna-%D8%A3%D9%88%D8%B1%D8%A7%D9%82%D9%86%D8%A7-61578452713861/',
    },
    /** Odoo customer portal, for "Sign in" (orders, invoices). */
    portalUrl: process.env.NEXT_PUBLIC_ODOO_PORTAL_URL ?? 'https://erp.awraquna.com/web/login',
  },

  legal: {
    name: 'Awraquna Legal Services',
    // TODO(client): real contact details for the legal arm are not provided yet.
    email: process.env.NEXT_PUBLIC_LEGAL_EMAIL ?? 'legal@awraquna.com',
    phone: process.env.NEXT_PUBLIC_LEGAL_PHONE ?? '',
    whatsapp: process.env.NEXT_PUBLIC_LEGAL_WHATSAPP ?? '',
    offices: { en: 'Riyadh, Saudi Arabia · Cairo, Egypt', ar: 'الرياض، المملكة العربية السعودية · القاهرة، مصر' },
    /**
     * Where the legal site lives. In production it is its own subdomain
     * (legal.awraquna.com, handled by the proxy); locally it's /legal.
     */
    baseUrl: process.env.NEXT_PUBLIC_LEGAL_URL ?? '',
  },
} as const;

export const whatsappLink = (number: string, text?: string) =>
  `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
