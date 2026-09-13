// @vitest-environment jsdom
import {act} from 'react';
import {createRoot,type Root} from 'react-dom/client';
import {MemoryRouter} from 'react-router';
import {afterEach,beforeEach,describe,expect,it} from 'vitest';
import {AccountPage} from '../src/accounts/AccountPage';
import {AppShell} from '../src/shell/AppShell';
import {LANGUAGE_STORAGE_KEY,LanguageProvider,readLanguage,translate} from '../src/i18n/i18n';
import {en,languages,translations} from '../src/i18n/messages';

Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});
let host:HTMLDivElement,root:Root;
beforeEach(()=>{localStorage.clear();host=document.createElement('div');document.body.append(host);root=createRoot(host);});
afterEach(async()=>{await act(async()=>root.unmount());host.remove();document.documentElement.lang='en';});

describe('centralized interface languages',()=>{
  it('ships a complete stable-key catalog for all five languages',()=>{
    expect(languages).toEqual(['en','it','es','fr','de']);
    const keys=Object.keys(en).sort();
    for(const language of languages)expect(Object.keys(translations[language]).sort(),language).toEqual(keys);
  });
  it('uses English as the safe default and interpolates stable messages',()=>{
    expect(readLanguage({getItem:()=>null})).toBe('en');
    expect(readLanguage({getItem:()=>'unsupported'})).toBe('en');
    expect(translate('en','dashboard.hello',{name:'Ada'})).toBe('Hello Ada');
  });
  it('offers every language and restores the selected language after remount',async()=>{
    await act(async()=>root.render(<LanguageProvider><AccountPage/></LanguageProvider>));
    const select=host.querySelector<HTMLSelectElement>('.ds-language-select select')!;
    expect([...select.options].map(option=>option.value)).toEqual([...languages]);
    await act(async()=>{select.value='de';select.dispatchEvent(new Event('change',{bubbles:true}));});
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('de');
    expect(document.documentElement.lang).toBe('de');
    expect(host.querySelector('h1')?.textContent).toBe('Konto und Einstellungen');
    await act(async()=>root.unmount());root=createRoot(host);
    await act(async()=>root.render(<LanguageProvider><AccountPage/></LanguageProvider>));
    expect(host.querySelector<HTMLSelectElement>('.ds-language-select select')?.value).toBe('de');
  });
  it('localizes grouped navigation without changing its routes',async()=>{
    localStorage.setItem(LANGUAGE_STORAGE_KEY,'fr');
    await act(async()=>root.render(<LanguageProvider><MemoryRouter><AppShell/></MemoryRouter></LanguageProvider>));
    expect([...host.querySelectorAll('.ds-nav-group')].map(node=>node.textContent)).toEqual(['Principal','Secondaire','Compte']);
    expect([...host.querySelectorAll('.ds-nav-link')].map(link=>link.getAttribute('href'))).toEqual(['/','/#courses','/practice','/progress','/#upcoming-exams','/study-plan','/account','/account#settings']);
  });
  it('renders the Notedra wordmark as one consistently styled text element',async()=>{
    await act(async()=>root.render(<LanguageProvider><MemoryRouter><AppShell/></MemoryRouter></LanguageProvider>));
    const name=host.querySelector('.ds-brand-name')!;
    expect(name.textContent).toBe('Notedra');
    expect(name.children).toHaveLength(0);
    expect(host.querySelector('.ds-brand strong,.ds-brand b')).toBeNull();
  });
});

