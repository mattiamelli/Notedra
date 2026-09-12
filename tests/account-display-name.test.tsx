// @vitest-environment jsdom
import {act} from 'react';
import {createRoot} from 'react-dom/client';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter} from 'react-router';
import {expect,it,vi} from 'vitest';
import {AccountPage} from '../src/accounts/AccountPage';
import {AccountContext,anonymousState,type AccountContextValue} from '../src/accounts/context';
import {DashboardPage} from '../src/pages/DashboardPage';
import {AppShell} from '../src/shell/AppShell';
import DashboardExams,{calendarDays,urgency} from '../src/pages/DashboardExams';
import {useLearning} from '../src/learning/LearningProvider';
import {emptyBackup} from '../src/learning/contracts';
vi.mock('../src/learning/LearningProvider',async original=>({...await original<typeof import('../src/learning/LearningProvider')>(),useLearning:vi.fn(()=>null)}));
const a={id:'11111111-1111-4111-8111-111111111111',email:'a@example.invalid',displayName:'Élodie Alpha'};
const value=(user:typeof a|null):AccountContextValue=>({config:{status:'unavailable',message:'Offline test'},auth:null,state:{...anonymousState,phase:user?'signed-in':'anonymous',user},syncStatus:user?'Synced':'Local only',syncMessage:'',sync:null,adopt:null});
it('renders canonical identity inside Account itself and clears it on account switch/logout',async()=>{
  Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});const host=document.createElement('div'),root=createRoot(host);
  const render=async(user:typeof a|null)=>act(async()=>root.render(<MemoryRouter><AccountContext.Provider value={value(user)}><AccountPage/></AccountContext.Provider></MemoryRouter>));
  try {
    await render(a);expect(host.querySelector('.ds-account')?.textContent).toContain(a.displayName);expect(host.textContent).toContain(a.email);expect(host.textContent).toContain('Synced');expect(host.textContent).not.toContain(a.id);
    await render({...a,email:'b@example.invalid',displayName:'Beta'});expect(host.textContent).toContain('Beta');expect(host.textContent).not.toContain(a.displayName);expect(host.textContent).not.toContain(a.email);
    await render(null);expect(host.textContent).toContain('Anonymous local profile');expect(host.textContent).not.toContain('Beta');expect(host.textContent).not.toContain('b@example.invalid');
  }finally{await act(async()=>root.unmount());}
});
it('preserves greeting and avatar sourced from the same account state',()=>{
  const host=document.createElement('div');host.innerHTML=renderToStaticMarkup(<MemoryRouter><AccountContext.Provider value={value(a)}><AppShell/><DashboardPage/></AccountContext.Provider></MemoryRouter>);
  expect(host.querySelector('.ds-greeting-title')?.textContent).toBe('Hello Élodie Alpha');expect(host.querySelector('.ds-header-account .ds-avatar')?.textContent).toBe('ÉA');
});
it('preserves anonymous greeting and avatar fallback',()=>{
  const host=document.createElement('div');host.innerHTML=renderToStaticMarkup(<MemoryRouter><AccountContext.Provider value={value(null)}><AppShell/><DashboardPage/></AccountContext.Provider></MemoryRouter>);
  expect(host.querySelector('.ds-greeting-title')?.textContent).toContain('Welcome to');expect(host.querySelector('.ds-header-account .ds-avatar')?.textContent).toBe('DS');
});
it('keeps countdown text and editing controls usable alongside account identity',()=>{
  vi.useFakeTimers();vi.setSystemTime(new Date('2026-09-12T12:00:00Z'));
  vi.mocked(useLearning).mockReturnValue({snapshot:{data:{...emptyBackup(),generation:'test',revision:0,upcomingExams:[{id:'exam',name:'Upcoming exam',examDate:'2026-09-14'}]},hasRecovery:false}} as ReturnType<typeof useLearning>);
  try {const host=document.createElement('div');host.innerHTML=renderToStaticMarkup(<DashboardExams/>);expect(host.querySelector('.ds-countdown')?.textContent).toBe('2 DAYS');expect(host.textContent).toContain('Edit');expect(host.textContent).toContain('Delete');expect(urgency(calendarDays('2026-09-12','2026-09-14'))).toBe('critical');}
  finally{vi.mocked(useLearning).mockReturnValue(null);vi.useRealTimers();}
});
