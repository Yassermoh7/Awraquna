import type { Metadata } from 'next';
import PolicyPage from '@/components/plus/PolicyPage';
import { toLocale } from '@/components/plus/helpers';
import { getPlusCopy } from '@/content/plus';
import { alternates } from '@/lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[lang]/privacy'>): Promise<Metadata> {
  const lang = toLocale((await params).lang);
  const t = getPlusCopy(lang).meta;
  return { title: t.privacyTitle, description: t.privacyDescription, alternates: alternates('/privacy', lang) };
}

export default async function PrivacyPage({ params }: PageProps<'/[lang]/privacy'>) {
  return <PolicyPage lang={toLocale((await params).lang)} doc="privacy" />;
}
