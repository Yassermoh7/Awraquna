import EnterScrollRestore from '@/components/shared/EnterScrollRestore';
import FamilyBar from '@/components/shared/FamilyBar';
import Header, { type MenuItem } from '@/components/plus/Header';
import Footer from '@/components/plus/Footer';
import { OrderToast, WhatsAppFloat } from '@/components/plus/Chrome';
import { OrderListProvider } from '@/components/plus/order-list';
import { categoryHref, industryHref, toLocale } from '@/components/plus/helpers';
import styles from '@/components/plus/layout.module.css';
import { getPlusCopy, plusConfig } from '@/content/plus';
import { commerce } from '@/lib/commerce';

export default async function PlusLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const lang = toLocale((await params).lang);
  const t = getPlusCopy(lang);
  const [categories, industries] = await Promise.all([commerce.listCategories(), commerce.listIndustries()]);
  const top = categories.filter((c) => !c.parent);
  const name = (c: { name: string; nameAr: string }) => (lang === 'ar' ? c.nameAr : c.name);

  const productMenu: MenuItem[] = top.map((c) => ({
    href: categoryHref(lang, c.slug),
    label: name(c),
    text: t.categories[c.slug]?.blurb ?? '',
    image: plusConfig.categoryImages[c.slug] ?? '/images/plus/cat-paper.jpg',
  }));
  const industryMenu: MenuItem[] = industries.map((c) => ({
    href: industryHref(lang, c.slug),
    label: name(c),
    text: t.categories[c.slug]?.blurb ?? '',
    image: plusConfig.industryImages[c.slug] ?? '/images/plus/pos-counter.jpg',
  }));

  return (
    <OrderListProvider>
      <div className={styles.plus}>
        <a className="skip-link" href="#main">{t.skip}</a>
        <FamilyBar lang={lang} current="plus" />
        <Header lang={lang} products={productMenu} industries={industryMenu} />
        <main id="main" className={styles.main}>{children}</main>
        <Footer lang={lang} shopLinks={top.slice(0, 4).map((c) => ({ slug: c.slug, label: name(c) }))} />
        <WhatsAppFloat lang={lang} />
        <OrderToast lang={lang} />
        <EnterScrollRestore />
      </div>
    </OrderListProvider>
  );
}
