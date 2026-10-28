import Image from 'next/image';
import Link from 'next/link';
import { Arrow } from './icons';
import styles from './tile.module.css';

/**
 * Category tile for carousels: the picture fills the tile, the name and
 * product count sit at the bottom. Category photos fill edge to edge;
 * product shots (used for sub-categories) are shown on a soft studio tile.
 */
export default function CategoryTile({ href, title, kicker, blurb, count, image, photo }: {
  href: string; title: string; kicker?: string; blurb?: string; count: string; image: string; photo: boolean;
}) {
  return (
    <article className={styles.tile} data-photo={photo || undefined}>
      <div className={styles.media}>
        <Image src={image} alt="" fill sizes="(max-width: 760px) 62vw, (max-width: 1100px) 30vw, 280px" />
      </div>
      <div className={styles.body}>
        {kicker && <span className={styles.kicker}>{kicker}</span>}
        <h3><Link href={href}>{title}</Link></h3>
        {blurb && <p>{blurb}</p>}
        <span className={styles.foot}>
          <span>{count}</span>
          <span className={styles.go} aria-hidden="true"><Arrow /></span>
        </span>
      </div>
    </article>
  );
}
