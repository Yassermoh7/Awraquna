import type { SVGProps } from 'react';

/** Outline icons used across the Plus site (24px grid, currentColor). */
type P = SVGProps<SVGSVGElement>;
const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;

export const Arrow = (p: P) => <svg {...base} strokeWidth={2.2} data-icon="arrow" {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const Plus = (p: P) => <svg {...base} strokeWidth={2.2} {...p}><path d="M12 5v14M5 12h14" /></svg>;
export const Minus = (p: P) => <svg {...base} strokeWidth={2.2} {...p}><path d="M5 12h14" /></svg>;
export const Check = (p: P) => <svg {...base} strokeWidth={2.2} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
export const Close = (p: P) => <svg {...base} strokeWidth={2} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>;
export const Search = (p: P) => <svg {...base} strokeWidth={2} {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>;
export const Chevron = (p: P) => <svg viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden {...p}><path d="M1 1l4 4 4-4" /></svg>;
export const Menu = (p: P) => <svg {...base} strokeWidth={2} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
export const User = (p: P) => <svg {...base} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
export const List = (p: P) => <svg {...base} {...p}><path d="M9 6h11M9 12h11M9 18h11" /><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" strokeWidth={2.6} /></svg>;
export const Trash = (p: P) => <svg {...base} {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>;
export const Calendar = (p: P) => <svg {...base} {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>;
export const Truck = (p: P) => <svg {...base} {...p}><path d="M1 6h13v10H1zM14 10h4l3 3v3h-7z" /><circle cx="5.5" cy="18" r="1.8" /><circle cx="17.5" cy="18" r="1.8" /></svg>;
export const Leaf = (p: P) => <svg {...base} {...p}><path d="M5 19c8 0 14-6 14-15C10 4 5 9 5 15v4zM5 19l7-7" /></svg>;
export const Shield = (p: P) => <svg {...base} {...p}><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></svg>;
export const Box = (p: P) => <svg {...base} {...p}><path d="M21 8l-9-5-9 5v8l9 5 9-5z" /><path d="M3 8l9 5 9-5M12 13v8" /></svg>;
export const Printer = (p: P) => <svg {...base} {...p}><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v7H6z" /></svg>;
export const Pin = (p: P) => <svg {...base} {...p}><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>;
export const Phone = (p: P) => <svg {...base} {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>;
export const Mail = (p: P) => <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>;
export const Seal = (p: P) => <svg {...base} strokeWidth={1.4} {...p}><circle cx="12" cy="12" r="9" /><path d="M9.5 16.5v-9H13a2.6 2.6 0 0 1 0 5.2H9.5M12.6 12.7l2.9 3.8" /></svg>;

export const WhatsApp = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3z" />
  </svg>
);
export const LinkedIn = (p: P) => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.2 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4z" /></svg>;
export const Instagram = (p: P) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>;
export const Facebook = (p: P) => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}><path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.3c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.2H8v3.4h2.6V22H14v-10.1h2.7l.4-3.4z" /></svg>;
export const Store = (p: P) => <svg {...base} {...p}><path d="M4 10v10h16V10M3 4h18l-1.5 6a2.5 2.5 0 0 1-4.5 0 2.5 2.5 0 0 1-4.5 0 2.5 2.5 0 0 1-4.5 0A2.5 2.5 0 0 1 4.5 10z" /><path d="M10 20v-5h4v5" /></svg>;
export const Utensils = (p: P) => <svg {...base} {...p}><path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 21V3c-2.2 1.4-3.5 4-3.5 7v4H17" /></svg>;
export const Cross = (p: P) => <svg {...base} {...p}><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" /></svg>;
export const Grid = (p: P) => <svg {...base} {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>;
export const Filter = (p: P) => <svg {...base} {...p}><path d="M4 6h16M7 12h10M10 18h4" /></svg>;
