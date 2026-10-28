'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './shop.module.css';

export default function ProductGallery({ images, alt, label, thumbLabel }: { images: string[]; alt: string; label: string; thumbLabel: string[] }) {
  const [index, setIndex] = useState(0);
  if (!images.length) return null;
  return (
    <section className={styles.gallery} aria-label={label} data-single={images.length < 2 || undefined}>
      <div className={styles.mainImage}>
        <Image src={images[index]} alt={alt} fill sizes="(max-width: 980px) 100vw, 640px" preload={index === 0} />
      </div>
      {images.length > 1 && (
        <div className={styles.thumbs}>
          {images.map((src, i) => (
            <button key={src} type="button" className={styles.thumb} aria-pressed={i === index} aria-label={thumbLabel[i]} onClick={() => setIndex(i)}>
              <Image src={src} alt="" fill sizes="84px" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
