import type { Metadata } from 'next';
import Link from 'next/link';
import CartView from '@/components/plus/CartView';
import { toLite, toLocale } from '@/components/plus/helpers';
import cart from '@/components/plus/cart.module.css';
import ui from '@/components/plus/ui.module.css';
import { getPlusCopy } from '@/content/plus';
import { commerce } from '@/lib/commerce';
import { alternates, localePath } from '@/lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[lang]/shop/cart'>): Promise<Metadata> {
  const lang = toLocale((await params).lang);
  const t = getPlusCopy(lang).meta;
  return { title: t.cartTitle, description: t.cartDescription, alternates: alternates('/shop/cart', lang), robots: { index: false, follow: true } };
}

export default async function CartPage({ params }: PageProps<'/[lang]/shop/cart'>) {
  const lang = toLocale((await params).lang);
  const t = getPlusCopy(lang);
  const products = (await commerce.listProducts()).map((p) => toLite(p, t, lang));
  return (
    <>
      <div className={ui.pageHead}>
        <div className={ui.container}>
          <nav className={ui.breadcrumbs} aria-label={t.common.breadcrumb}>
            <ol>
              <li><Link href={localePath(lang, '/plus')}>{t.common.home}</Link></li>
              <li><Link href={localePath(lang, '/shop')}>{t.common.shop}</Link></li>
              <li aria-current="page">{t.cart.title}</li>
            </ol>
          </nav>
          <h1>{t.cart.title}</h1>
          <p>{t.cart.intro}</p>
        </div>
      </div>
      <div className={`${ui.container} ${cart.wrap}`}>
        <CartView lang={lang} products={products} />
      </div>
    </>
  );
}
