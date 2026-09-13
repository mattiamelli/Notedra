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
  lt: (sourceText: string) => string;
}

type ContentTranslations=Record<string,string>;
async function loadContentTranslations(language: Exclude<Language,'en'>):Promise<ContentTranslations>{
  const response=await fetch(`${import.meta.env.BASE_URL}i18n-content/${language}.json`);
  if(!response.ok)throw new Error(`Localization catalog unavailable: ${language}`);
  return response.json() as Promise<ContentTranslations>;
}

const I18nContext=createContext<I18nContextValue>({language:'en',setLanguage:()=>{},t:(key,values)=>translate('en',key,values),lt:text=>text});

export function LanguageProvider({children}:{children:ReactNode}) {
  const [language,setLanguageState]=useState<Language>(()=>readLanguage());
  const [content,setContent]=useState<ContentTranslations>({});
  useEffect(()=>{document.documentElement.lang=language;},[language]);
  useEffect(()=>{let current=true;if(language==='en'){setContent({});return()=>{current=false;};}setContent({});loadContentTranslations(language).then(messages=>{if(current)setContent(messages);}).catch(()=>{if(current)setContent({});});return()=>{current=false;};},[language]);
  const value=useMemo<I18nContextValue>(()=>({
    language,
    setLanguage(next){try{localStorage.setItem(LANGUAGE_STORAGE_KEY,next);}catch{/* The choice still applies for this session. */}setLanguageState(next);},
    t:(key,values)=>translate(language,key,values),
    lt:sourceText=>content[sourceText]??sourceText,
  }),[language,content]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n=()=>useContext(I18nContext);
export {languageOptions};
