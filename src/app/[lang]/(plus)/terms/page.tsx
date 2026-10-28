import type { Metadata } from 'next';
import PolicyPage from '@/components/plus/PolicyPage';
import { toLocale } from '@/components/plus/helpers';
import { getPlusCopy } from '@/content/plus';
import { alternates } from '@/lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[lang]/terms'>): Promise<Metadata> {
  const lang = toLocale((await params).lang);
  const t = getPlusCopy(lang).meta;
  return { title: t.termsTitle, description: t.termsDescription, alternates: alternates('/terms', lang) };
}

export default async function TermsPage({ params }: PageProps<'/[lang]/terms'>) {
  return <PolicyPage lang={toLocale((await params).lang)} doc="terms" />;
}
