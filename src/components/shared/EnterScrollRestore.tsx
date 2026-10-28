'use client';

import { useLayoutEffect } from 'react';

export const ENTER_KEY = 'awq-enter';
export type EnterHandoff = { path: string; y: number; at: number };

/**
 * When a visitor scrolls into a division circle on the homepage, the zoom ends
 * on whatever part of that site the circle was previewing. This puts the real
 * page at the same scroll position before first paint, so the hand-off is seamless.
 */
export default function EnterScrollRestore() {
  useLayoutEffect(() => {
    let handoff: EnterHandoff | null = null;
    try {
      handoff = JSON.parse(sessionStorage.getItem(ENTER_KEY) ?? 'null');
      sessionStorage.removeItem(ENTER_KEY);
    } catch {}
    if (!handoff || Date.now() - handoff.at > 15000) return;
    const here = decodeURI(location.pathname).replace(/\/$/, '') || '/';
    if (here !== handoff.path.replace(/\/$/, '')) return;
    window.scrollTo({ top: handoff.y, behavior: 'instant' });
  }, []);
  return null;
}
