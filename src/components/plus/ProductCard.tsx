import Image from 'next/image';
import Link from 'next/link';
import type { Category, Product } from '@/lib/commerce/types';
import type { Locale } from '@/lib/i18n';
import { getPlusCopy } from '@/content/plus';
import { categoryLabel, defaultUnit, localiseValue, packLabel, productHref, productName, spec } from './helpers';
import AddToList from './AddToList';
import styles from './card.module.css';

type Props = {
  product: Product;
  categories: Category[];
  lang: Locale;
  flag?: string;
  headingLevel?: 'h2' | 'h3';
  /** Position in a grid row: the card fades in on scroll with a small per-column delay. */
  reveal?: number;
  /** Hint for next/image sizes when the card is used in a narrower grid. */
  sizes?: string;
};

/**
 * Image-led product tile: the photo fills the card and the essentials sit on
 * a glass panel over it. Used on the homepage, shop, categories and related products.
 */
export default function ProductCard({ product: p, categories, lang, flag, headingLevel: H = 'h3', sizes, reveal }: Props) {
  const t = getPlusCopy(lang);
  const name = productName(p, lang);
  const size = spec(p, 'size');
  const pack = packLabel(p, t, lang);
  // The name already carries the size for most products, so the meta line leads with the pack.
  const meta = pack ?? (size && !name.includes(size.split(' ')[0]) ? localiseValue(size, lang) : '');
  return (
    <article className={styles.card} {...(reveal !== undefined ? { 'data-reveal': '', 'data-reveal-delay': String(reveal) } : {})}>
      <div className={styles.media}>
        {p.images[0] && (
          <Image src={p.images[0]} alt={name} fill sizes={sizes ?? '(max-width: 600px) 50vw, (max-width: 1100px) 33vw, 300px'} />
        )}
        {flag && <span className={styles.flag}>{flag}</span>}
      </div>
      <div className={styles.panel}>
        <div className={styles.text}>
          <span className={styles.type}>{categoryLabel(p.subcategory ?? p.category, categories, lang)}</span>
          <H className={styles.title}><Link href={productHref(lang, p)}>{name}</Link></H>
          {meta && <p className={styles.meta}>{meta}</p>}
        </div>
        <AddToList lang={lang} id={p.id} name={name} unit={defaultUnit(p)} compact />
      </div>
    </article>
  );
}
