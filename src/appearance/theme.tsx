import {createContext, useContext, useEffect, useState, type ReactNode} from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = Exclude<ThemePreference, 'system'>;
export const THEME_STORAGE_KEY = 'delftstudy.appearance.theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

function isPreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function readThemePreference(storage: Pick<Storage, 'getItem'> | null = typeof localStorage === 'undefined' ? null : localStorage): ThemePreference {
  try {
    const value = storage?.getItem(THEME_STORAGE_KEY);
    return isPreference(value) ? value : 'system';
  } catch {
    return 'system';
  }
}

export function resolveTheme(preference: ThemePreference, darkSystem: boolean): ResolvedTheme {
  return preference === 'system' ? (darkSystem ? 'dark' : 'light') : preference;
}

export function applyTheme(preference: ThemePreference, darkSystem = typeof matchMedia !== 'undefined' && matchMedia(DARK_QUERY).matches): ResolvedTheme {
  const resolved = resolveTheme(preference, darkSystem);
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themePreference = preference;
    document.documentElement.style.colorScheme = resolved;
  }
  return resolved;
}

export function initializeStoredTheme(): ThemePreference {
  const preference = readThemePreference();
  applyTheme(preference);
  return preference;
}

interface ThemeContextValue {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue>({preference: 'system', resolved: 'light', setPreference: () => {}});

export function ThemeProvider({children}: {children: ReactNode}) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => readThemePreference());
  const [resolved, setResolved] = useState<ResolvedTheme>(() => resolveTheme(preference, typeof matchMedia !== 'undefined' && matchMedia(DARK_QUERY).matches));

  useEffect(() => {
    if (typeof matchMedia === 'undefined') { setResolved(applyTheme(preference, false)); return; }
    const media = matchMedia(DARK_QUERY);
    const update = () => setResolved(applyTheme(preference, media.matches));
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [preference]);

  function setPreference(next: ThemePreference) {
    try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* Appearance still applies for this session. */ }
    setPreferenceState(next);
  }

  return <ThemeContext.Provider value={{preference, resolved, setPreference}}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
