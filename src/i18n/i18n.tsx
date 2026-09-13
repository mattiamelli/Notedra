import {createContext, useContext, useEffect, useMemo, useState, type ReactNode} from 'react';
import {en, languageOptions, languages, translations, type Language, type MessageKey} from './messages';

export const LANGUAGE_STORAGE_KEY = 'delftstudy.interface.language';

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (languages as readonly string[]).includes(value);
}

export function readLanguage(storage: Pick<Storage, 'getItem'> | null = typeof localStorage === 'undefined' ? null : localStorage): Language {
  try { const value=storage?.getItem(LANGUAGE_STORAGE_KEY); return isLanguage(value) ? value : 'en'; }
  catch { return 'en'; }
}

export function translate(language: Language, key: MessageKey, values: Record<string, string | number> = {}): string {
  const template=translations[language][key] ?? en[key];
  return template.replace(/\{(\w+)\}/g, (_, name: string) => String(values[name] ?? `{${name}}`));
}

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: MessageKey, values?: Record<string, string | number>) => string;
}

const I18nContext=createContext<I18nContextValue>({language:'en',setLanguage:()=>{},t:(key,values)=>translate('en',key,values)});

export function LanguageProvider({children}:{children:ReactNode}) {
  const [language,setLanguageState]=useState<Language>(()=>readLanguage());
  useEffect(()=>{document.documentElement.lang=language;},[language]);
  const value=useMemo<I18nContextValue>(()=>({
    language,
    setLanguage(next){try{localStorage.setItem(LANGUAGE_STORAGE_KEY,next);}catch{/* The choice still applies for this session. */}setLanguageState(next);},
    t:(key,values)=>translate(language,key,values),
  }),[language]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n=()=>useContext(I18nContext);
export {languageOptions};
