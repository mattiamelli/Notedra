// @vitest-environment jsdom
import {act} from 'react';
import {createRoot,type Root} from 'react-dom/client';
import {MemoryRouter} from 'react-router';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {AccountPage} from '../src/accounts/AccountPage';
import {AppShell} from '../src/shell/AppShell';
import {LANGUAGE_STORAGE_KEY,LanguageProvider,loadMessages,readLanguage,translate,useI18n} from '../src/i18n/i18n';
import {courses,trimesters} from '../src/academic/navigation';
import {en,languages} from '../src/i18n/messages';
import {allExercises} from '../src/practice/catalog';
import {MasteryCard} from '../src/progress/IndexCard';
import {PracticePage} from '../src/practice/PracticePage';
import itContent from '../public/i18n-content/it.json';
import esContent from '../public/i18n-content/es.json';
import frContent from '../public/i18n-content/fr.json';
import deContent from '../public/i18n-content/de.json';

Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});
let host:HTMLDivElement,root:Root;
beforeEach(async()=>{await Promise.all(languages.map(loadMessages));localStorage.clear();host=document.createElement('div');document.body.append(host);root=createRoot(host);});
afterEach(async()=>{await act(async()=>root.unmount());host.remove();document.documentElement.lang='en';vi.unstubAllGlobals();});

describe('centralized interface languages',()=>{
  it('ships a complete stable-key catalog for all five languages',async()=>{
    expect(languages).toEqual(['en','it','es','fr','de']);
    const keys=Object.keys(en).sort();
    for(const language of languages)expect(Object.keys(await loadMessages(language)).sort(),language).toEqual(keys);
  });
  it.each([
    ['en',['All difficulties','Low','Medium','High','Exam level']],['it',['Tutte le difficoltà','Bassa','Media','Alta','Livello esame']],['es',['Todas las dificultades','Baja','Media','Alta','Nivel de examen']],['fr',['Toutes les difficultés','Faible','Moyenne','Élevée','Niveau examen']],['de',['Alle Schwierigkeitsgrade','Niedrig','Mittel','Hoch','Prüfungsniveau']],
  ] as const)('localizes every difficulty option in %s',async(language,labels)=>{
    localStorage.setItem(LANGUAGE_STORAGE_KEY,language);await act(async()=>root.render(<LanguageProvider key={language}><MemoryRouter><PracticePage/></MemoryRouter></LanguageProvider>));
    const select=[...host.querySelectorAll('label')].find(label=>label.querySelector('select')?.options.length===5)!.querySelector('select')!;
    expect([...select.options].map(option=>option.textContent)).toEqual([...labels]);
  });
  it('uses English as the safe default and interpolates stable messages',()=>{
    expect(readLanguage({getItem:()=>null})).toBe('en');
    expect(readLanguage({getItem:()=>'unsupported'})).toBe('en');
    expect(translate('en','dashboard.hello',{name:'Ada'})).toBe('Hello Ada');
  });
  it.each([
    ['en','Insufficient','Local only'],['it','Insufficiente','Solo locale'],['es','Insuficiente','Solo local'],['fr','Insuffisante','Local uniquement'],['de','Unzureichend','Nur lokal'],
  ] as const)('renders confidence and local sync status in %s',async(language,confidence,localOnly)=>{
    localStorage.setItem(LANGUAGE_STORAGE_KEY,language);
    const value={id:'CSE1400_CO',name:'CO',index:null,confidence:'Insufficient' as const,covered:0,total:46,recent:0,why:[],strongest:[],review:[],missing:[]};
    await act(async()=>root.render(<LanguageProvider key={language}><MasteryCard value={value}/><AccountPage/></LanguageProvider>));
    expect(host.querySelector('.progress-mastery-meta strong')?.textContent).toContain(confidence);
    expect(host.querySelector('.ds-sync-badge')?.textContent).toBe(localOnly);
    expect(host.querySelector('[role=status] strong')?.textContent).toBe(localOnly);
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
    expect([...host.querySelectorAll('.ds-nav-section:not(.ds-curriculum-nav) .ds-nav-group')].map(node=>node.textContent)).toEqual(['Principal','Secondaire','Compte']);
    expect([...host.querySelectorAll('.ds-nav-section:not(.ds-curriculum-nav) .ds-nav-link')].map(link=>link.getAttribute('href'))).toEqual(['/dashboard','/dashboard#courses','/practice','/progress','/study-plan','/account#settings']);
    expect([...host.querySelectorAll('.ds-nav-section:not(.ds-curriculum-nav) .ds-nav-link')].map(link=>link.textContent)).toEqual(['Accueil','Cours','Exercices','Progression','Parcours d’étude','Paramètres']);
  });
  it('keeps all trimester course routes and authored names available in a localized shell',async()=>{
    localStorage.setItem(LANGUAGE_STORAGE_KEY,'fr');
    await act(async()=>root.render(<LanguageProvider><MemoryRouter><AppShell/></MemoryRouter></LanguageProvider>));
    const select=host.querySelector<HTMLSelectElement>('#sidebar-trimester')!;
    expect([...select.options].map(option=>Number(option.value))).toEqual([...trimesters]);
    for(const trimester of trimesters){
      await act(async()=>{select.value=String(trimester);select.dispatchEvent(new Event('change',{bubbles:true}));});
      const expected=courses.filter(course=>course.trimester===trimester);
      expect([...host.querySelectorAll('.ds-curriculum-nav .ds-nav-link')].map(link=>[link.getAttribute('href'),link.textContent])).toEqual(expected.map(course=>[course.path,course.publicName]));
      expect(host.querySelector('.ds-curriculum-nav')?.getAttribute('data-trimester')).toBe(String(trimester));
      expect([...host.querySelectorAll('.ds-curriculum-nav .ds-course-nav-icon path')].map(path=>path.getAttribute('d'))).toHaveLength(expected.length);
      expect(new Set([...host.querySelectorAll('.ds-curriculum-nav .ds-course-nav-icon path')].map(path=>path.getAttribute('d'))).size).toBe(expected.length);
    }
  });
  it('renders the Notedra wordmark as one consistently styled text element',async()=>{
    await act(async()=>root.render(<LanguageProvider><MemoryRouter><AppShell/></MemoryRouter></LanguageProvider>));
    const name=host.querySelector('.ds-brand-name')!;
    expect(name.textContent).toBe('Notedra');
    expect(name.children).toHaveLength(0);
    expect(host.querySelector('.ds-brand strong,.ds-brand b')).toBeNull();
  });
  it('retains every legacy exercise translation without changing technical notation',()=>{
    const content={it:itContent,es:esContent,fr:frContent,de:deContent} as const;
    const source=new Set<string>();
    for(const exercise of allExercises.filter(exercise=>exercise.task.kind!=='curriculum')){
      for(const field of ['title','prompt','rules','explanation'] as const){const text=exercise[field];if(typeof text==='string'&&text.trim())source.add(text);}
      if(exercise.task.kind==='logic-build')for(const slot of exercise.task.slots)source.add(slot.label);
    }
    const technical=/(?:%[a-z][a-z0-9]*|0x[0-9A-Fa-f]+|[¬∧∨→↔⊕])/gi;
    for(const [language,catalog] of Object.entries(content))for(const text of source){
      const localized=(catalog as Record<string,string>)[text];
      expect(localized,`${language}: ${text}`).toBeTruthy();
      expect(localized.match(technical)?.sort()??[],`${language}: ${text}`).toEqual(text.match(technical)?.sort()??[]);
    }
  });
  it.each(['it','es','fr','de'] as const)('preserves authored English curriculum text when %s content translations are unavailable',async language=>{
    const translated={it:itContent,es:esContent,fr:frContent,de:deContent}[language] as Record<string,string>;
    const texts=courses.filter(course=>course.trimester!==1).flatMap(course=>{
      const exercise=allExercises.find(item=>item.subjectId===course.subject_id)!;
      return [exercise.title,exercise.prompt,exercise.rules,exercise.explanation];
    }).filter(text=>!Object.hasOwn(translated,text));
    expect(texts.length).toBeGreaterThan(0);
    vi.stubGlobal('fetch',vi.fn(async()=>({ok:true,json:async()=>translated})));
    function CurriculumText(){const {lt}=useI18n();return <div data-curriculum-text>{texts.map((text,index)=><p key={index}>{lt(text)}</p>)}</div>;}
    localStorage.setItem(LANGUAGE_STORAGE_KEY,language);
    await act(async()=>root.render(<LanguageProvider><CurriculumText/></LanguageProvider>));
    expect([...host.querySelectorAll('[data-curriculum-text] p')].map(node=>node.textContent)).toEqual(texts);
  });
});
