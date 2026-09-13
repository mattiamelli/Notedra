const paths = {
  dashboard: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  cpu: 'M7 7h10v10H7zM9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3M5 5h14v14H5z',
  logic: 'M8 4h8M12 4v16M4 8l-3 6h6L4 8Zm16 0-3 6h6l-3-6ZM4 8h16M8 20h8',
  code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-2-15-4 18',
  practice: 'm14 4 6 6M4 20l5-1L21 7l-4-4L5 15l-1 5Z',
  exam: 'M8 4H5v17h14V4h-3M8 2h8v5H8zM8 12h8M8 16h5',
  progress: 'M4 3v17h17M8 15v-3m5 3V8m5 7V5',
  mistakes: 'M5 3h14v18H5zM9 8l6 6m0-6-6 6M9 18h6',
  calendar: 'M4 5h16v16H4zM4 10h16M8 2v6m8-6v6M8 14h2m4 0h2m-8 3h2',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'm6 6 12 12M18 6 6 18',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  book: 'M12 5v16M2 3l10 2 10-2v16l-10 2-10-2V3Z',
  back: 'M20 12H4m6-6-6 6 6 6',
  account: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0',
  settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0-13v2m0 15v2m9.5-9.5h-2m-15 0h-2m16.2-6.2-1.4 1.4M6.7 17.3l-1.4 1.4m13.4 0-1.4-1.4M6.7 6.7 5.3 5.3',
} as const;
export type ShellIconName = keyof typeof paths;
export function ShellIcon({name, size = 20}: {name: ShellIconName; size?: number}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]}/></svg>;
}
