import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Motion from '@/components/shared/Motion';
import { Cormorant_Garamond, IBM_Plex_Sans_Arabic, Libre_Franklin } from 'next/font/google';
import { dirFor, isLocale, locales } from '@/lib/i18n';
import { site } from '@/lib/site';
import '../globals.css';

// One type system for the whole family, taken from the Legal Services brand guide:
// Cormorant Garamond for display, Libre Franklin (stand-in for Acumin) for text,
// IBM Plex Sans Arabic (stand-in for Frutiger LT Arabic) for Arabic.
const display = Cormorant_Garamond({
  subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'],
  variable: '--font-display', display: 'swap',
});
const text = Libre_Franklin({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-text', display: 'swap' });
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Awraquna', template: '%s | Awraquna' },
  icons: { icon: '/favicon.ico' },
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={lang} dir={dirFor(lang)} data-scroll-behavior="smooth" className={`${display.variable} ${text.variable} ${arabic.variable}`}>
      <body>
        {children}
        <Suspense fallback={null}><Motion /></Suspense>
      </body>
    </html>
  );
}
