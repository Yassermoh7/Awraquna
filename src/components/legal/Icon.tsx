import type { IconName } from '@/content/legal';
import styles from './legal.module.css';

/** Outline line icons (brand guide: outline only, fine stroke, fig or warm white). */
const paths: Record<IconName, React.ReactNode> = {
  ip: (<><path d="M8 4h11l6 6v18H8z" /><path d="M19 4v6h6" /><circle cx="16.5" cy="19" r="4.5" /><path d="M15.4 21v-4h1.6a1.2 1.2 0 0 1 0 2.4h-1.6M17 19.4l1.2 1.6" /></>),
  trademark: (<><rect x="7" y="4" width="18" height="24" rx="1.5" /><path d="M11 10h10M11 15h10M11 20h6" /></>),
  advisory: (<><path d="M16 5v22M10 27h12M6 9h20M16 7.5v1.5" /><path d="M9 9l-4 9a4 4 0 0 0 8 0zM23 9l-4 9a4 4 0 0 0 8 0z" /></>),
  contract: (<><path d="M21 4H8v24h16V15" /><path d="M12 11h6M12 16h5M12 21h4" /><path d="M26.5 6.5l-8 8-1 3 3-1 8-8a1.4 1.4 0 0 0-2-2z" /></>),
  compliance: (<><path d="M16 4 6 8v8c0 6 4.3 10.3 10 12 5.7-1.7 10-6 10-12V8z" /><path d="m11.5 16 3 3 6-6" /></>),
  diamond: (<><path d="M8 5h16l5 7-13 15L3 12z" /><path d="M3 12h26M12 5l-3 7 7 15 7-15-3-7" /></>),
  people: (<><circle cx="12" cy="11" r="4.5" /><circle cx="22" cy="12" r="3.5" /><path d="M4 27c0-5 3.6-8 8-8s8 3 8 8M20 19c4-.4 8 1.8 8 7" /></>),
  shield: (<><path d="M16 4 6 8v8c0 6 4.3 10.3 10 12 5.7-1.7 10-6 10-12V8z" /><path d="m11.5 16 3 3 6-6" /></>),
  chart: (<><path d="M4 28h24" /><rect x="7" y="18" width="4" height="10" /><rect x="14" y="12" width="4" height="16" /><rect x="21" y="6" width="4" height="22" /></>),
  check: (<path d="m7 16.5 6 6 12-13" />),
  info: (<><circle cx="16" cy="16" r="12" /><path d="M16 14v8M16 10v.01" /></>),
  globe: (<><circle cx="16" cy="16" r="12" /><path d="M4 16h24M16 4c3.5 3.5 5 7.5 5 12s-1.5 8.5-5 12c-3.5-3.5-5-7.5-5-12s1.5-8.5 5-12z" /></>),
  handshake: (<><path d="m3 14 6-6 5 2 4-2 5 2 6 4" /><path d="m9 8-6 8 4 4M29 14l-5 6-4 4" /><path d="m11 17 3 3a1.5 1.5 0 0 0 2-2l-2-2M14 20l2 2a1.5 1.5 0 0 0 2-2l-2-2M16 22l1 1a1.5 1.5 0 0 0 2-2" /></>),
  target: (<><circle cx="16" cy="16" r="12" /><circle cx="16" cy="16" r="7" /><circle cx="16" cy="16" r="2" /><path d="m16 16 9-9M22 7h3v3" /></>),
  clock: (<><circle cx="16" cy="16" r="12" /><path d="M16 9v7l5 3" /></>),
  award: (<><circle cx="16" cy="12" r="7" /><path d="m11.5 17.5-2 10.5 6.5-3 6.5 3-2-10.5" /></>),
  chat: (<path d="M5 7h22v14H14l-6 5v-5H5z" />),
  download: (<><path d="M16 5v15M10 14l6 6 6-6" /><path d="M6 24v3h20v-3" /></>),
  calendar: (<><rect x="5" y="7" width="22" height="20" rx="1.5" /><path d="M5 13h22M11 4v6M21 4v6" /></>),
  registered: (<><circle cx="16" cy="16" r="12" /><path d="M12.5 22V10h4.5a3.6 3.6 0 0 1 0 7.2h-4.5M16.6 17.2 20.5 22" /></>),
  mail: (<><rect x="4" y="7" width="24" height="18" rx="1.5" /><path d="m4 9 12 9 12-9" /></>),
  phone: (<path d="M9 4h4l2 6-3 2a15 15 0 0 0 8 8l2-3 6 2v4a3 3 0 0 1-3 3A21 21 0 0 1 6 7a3 3 0 0 1 3-3z" />),
  pin: (<><path d="M16 28s9-8.5 9-15a9 9 0 0 0-18 0c0 6.5 9 15 9 15z" /><circle cx="16" cy="13" r="3.2" /></>),
};

export default function Icon({ name, className, title }: { name: IconName; className?: string; title?: string }) {
  return (
    <svg className={`${styles.ico} ${className ?? ''}`} viewBox="0 0 32 32" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title && <title>{title}</title>}
      {paths[name]}
    </svg>
  );
}
