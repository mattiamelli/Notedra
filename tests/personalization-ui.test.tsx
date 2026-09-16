// @vitest-environment jsdom
import {act} from 'react';
import {createRoot} from 'react-dom/client';
import {renderToStaticMarkup} from 'react-dom/server';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {MemoryRouter} from 'react-router';
import {ThemeProvider,applyTheme,readThemePreference,resolveTheme,THEME_STORAGE_KEY} from '../src/appearance/theme';
import {AccountPage} from '../src/accounts/AccountPage';
import {profileInitials} from '../src/accounts/profile';
import {AccountContext,anonymousState,type AccountContextValue} from '../src/accounts/context';
import {AppShell} from '../src/shell/AppShell';

it.each([
  ['Fabio Rossi','FR'],['Mattia Melli','MM'],['Mattia','M'],['  Élodie   Alpha  ','ÉA'],['李 雷','李雷'],['---','N'],[undefined,'N'],
])('derives consistent profile initials from %s', (name,expected)=>expect(profileInitials(name)).toBe(expected));

it('uses the same initials in the header, sidebar, and Account profile',()=>{
  const value:AccountContextValue={config:{status:'unavailable',message:'Local'},auth:null,state:{...anonymousState,phase:'signed-in',user:{id:'11111111-1111-4111-8111-111111111111',email:'fabio@example.invalid',displayName:'Fabio Rossi'}},syncStatus:'Local only',syncMessage:'',sync:null,adopt:null};
  const shell=renderToStaticMarkup(<MemoryRouter><AccountContext.Provider value={value}><AppShell/></AccountContext.Provider></MemoryRouter>),account=renderToStaticMarkup(<AccountContext.Provider value={value}><AccountPage/></AccountContext.Provider>);
  expect((shell.match(/>FR<\/span>/g)??[])).toHaveLength(2);expect(account).toContain('Avatar initials FR');expect(account).toContain('>FR</span>');
});

it('resolves explicit and system themes and applies the accessible color scheme',()=>{
  expect(resolveTheme('light',true)).toBe('light');expect(resolveTheme('dark',false)).toBe('dark');expect(resolveTheme('system',true)).toBe('dark');expect(resolveTheme('system',false)).toBe('light');
  applyTheme('dark',false);expect(document.documentElement.dataset).toMatchObject({theme:'dark',themePreference:'dark'});expect(document.documentElement.style.colorScheme).toBe('dark');
});

it('defaults invalid or missing preferences to System',()=>{
  expect(readThemePreference({getItem:()=>null})).toBe('system');expect(readThemePreference({getItem:()=>'sepia'})).toBe('system');expect(readThemePreference({getItem:()=>'light'})).toBe('light');
});

describe('Account appearance',()=>{
  let listeners:Set<()=>void>,dark:boolean;
  beforeEach(()=>{listeners=new Set();dark=false;localStorage.clear();Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true,matchMedia:vi.fn(()=>({get matches(){return dark;},media:'(prefers-color-scheme: dark)',addEventListener:(_type:string,listener:()=>void)=>listeners.add(listener),removeEventListener:(_type:string,listener:()=>void)=>listeners.delete(listener)}))});});
  afterEach(()=>{vi.restoreAllMocks();document.documentElement.removeAttribute('data-theme');document.documentElement.removeAttribute('data-theme-preference');});
  it('shows all account groups without collecting a date of birth',()=>{const html=renderToStaticMarkup(<AccountPage/>);for(const heading of ['Profile','Appearance','Security','Sync &amp; Backup','Data &amp; Privacy'])expect(html).toContain(heading);expect(html.toLowerCase()).not.toContain('birth');});
  it('persists Light, Dark, and System choices and reacts to a system preference change without reload',async()=>{
    const host=document.createElement('div'),root=createRoot(host);document.body.append(host);await act(async()=>root.render(<ThemeProvider><AccountPage/></ThemeProvider>));
    try {
      const options=[...host.querySelectorAll<HTMLInputElement>('input[name=theme]')];expect(options.map(input=>input.value)).toEqual(['light','dark','system']);
      await act(async()=>options[1].click());expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');expect(document.documentElement.dataset.theme).toBe('dark');
      await act(async()=>options[2].click());expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('system');
      dark=true;await act(async()=>listeners.forEach(listener=>listener()));expect(document.documentElement.dataset.themePreference).toBe('system');expect(document.documentElement.dataset.theme).toBe('dark');
    } finally {await act(async()=>root.unmount());host.remove();}
  });
  it('restores the persisted preference for an authenticated profile after remount',async()=>{
    localStorage.setItem(THEME_STORAGE_KEY,'dark');const value:AccountContextValue={config:{status:'unavailable',message:'Local'},auth:null,state:{...anonymousState,phase:'signed-in',user:{id:'11111111-1111-4111-8111-111111111111',email:'student@example.invalid',displayName:'Mattia Melli'}},syncStatus:'Local only',syncMessage:'',sync:null,adopt:null};
    const host=document.createElement('div'),root=createRoot(host);document.body.append(host);await act(async()=>root.render(<ThemeProvider><AccountContext.Provider value={value}><AccountPage/></AccountContext.Provider></ThemeProvider>));
    try {expect(host.querySelector<HTMLInputElement>('input[value=dark]')?.checked).toBe(true);expect(document.documentElement.dataset.theme).toBe('dark');expect(host.textContent).toContain('Mattia Melli');}finally{await act(async()=>root.unmount());host.remove();}
  });
});
