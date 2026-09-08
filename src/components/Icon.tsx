import type { CSSProperties } from 'react';
const paths = {
  code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-2-15-4 18',
  stack: 'm12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5',
  cpu: 'M7 7h10v10H7zM9 1v3m6-3v3M9 20v3m6-3v3M1 9h3m-3 6h3m16-6h3m-3 6h3M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z',
  next: 'm8 5 8 7-8 7V5Zm10 0v14',
  previous: 'm16 5-8 7 8 7V5ZM6 5v14',
  play: 'm7 4 14 8-14 8V4Z',
  pause: 'M8 5v14M16 5v14',
  reset: 'M3 11a9 9 0 1 1 2 7M3 4v7h7',
  load: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
  arrow: 'M12 3v18m-5-5 5 5 5-5',
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  bulb: 'M9 18h6m-6 3h6M8 15c-5-5-2-12 4-12s9 7 4 12l-1 3H9l-1-3Z',
  check: 'm5 12 4 4L19 6',
  alert: 'M12 8v5m0 3v.01M3 21h18L12 3 3 21Z',
  chevron: 'm9 5 7 7-7 7',
} as const;
export function Icon({name, size = 18, style}: {name: keyof typeof paths; size?: number; style?: CSSProperties}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}><path d={paths[name]} /></svg>;
}
