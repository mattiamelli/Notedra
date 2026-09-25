// @vitest-environment jsdom
import {act} from 'react';
import {createRoot,type Root} from 'react-dom/client';
import {MemoryRouter} from 'react-router';
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {AnalyticsConsentBanner} from '../src/analytics/ConsentBanner';
import {ANALYTICS_CONSENT_KEY,AnalyticsConsentController,AnalyticsConsentProvider} from '../src/analytics/consent';
import {setActiveAnalyticsSink,track,type AnalyticsRecord} from '../src/analytics/analytics';
import {POSTHOG_EU_HOST,POSTHOG_PERSISTENCE_NAME} from '../src/analytics/posthog';
import {AccountPage} from '../src/accounts/AccountPage';
import {ThemeProvider} from '../src/appearance/theme';
import {LanguageProvider,loadMessages} from '../src/i18n/i18n';

const env={VITE_POSTHOG_KEY:'phc_test_public_key',VITE_POSTHOG_HOST:POSTHOG_EU_HOST};
const event={course_id:'CSE1400_CO',activity_type:'course',source_surface:'course'} as const;
const persistenceKey=`ph_${POSTHOG_PERSISTENCE_NAME}`;
function controller(records:AnalyticsRecord[],disposed:{count:number}){
  return new AnalyticsConsentController({storage:localStorage,sessionStorage,env,production:true,createSink:()=>({capture:record=>records.push(record),dispose:async()=>{disposed.count++;}})});
}

describe('analytics consent boundary',()=>{
  beforeEach(()=>{localStorage.clear();sessionStorage.clear();setActiveAnalyticsSink(null);document.cookie='';});
  afterEach(()=>{setActiveAnalyticsSink(null);localStorage.clear();sessionStorage.clear();vi.restoreAllMocks();});

  it('keeps first-visit and refusal analytics disabled without creating PostHog storage',async()=>{
    const records:AnalyticsRecord[]=[],disposed={count:0},create=vi.fn(()=>({capture:(record:AnalyticsRecord)=>records.push(record),dispose:async()=>{disposed.count++;}}));
    const consent=new AnalyticsConsentController({storage:localStorage,sessionStorage,env,production:true,createSink:create});
    expect(consent.getSnapshot()).toBeNull();expect(create).not.toHaveBeenCalled();expect(track('course_opened',event)).toBe(true);expect(records).toEqual([]);
    await consent.deny();expect(consent.getSnapshot()).toBe('denied');expect(localStorage.getItem(ANALYTICS_CONSENT_KEY)).toBe('denied');expect(create).not.toHaveBeenCalled();expect(Object.keys(localStorage)).toEqual([ANALYTICS_CONSENT_KEY]);expect(document.cookie).toBe('');
  });

  it('enables only after opt-in, preserves the decision on revisit, and withdraws only analytics storage',async()=>{
    const records:AnalyticsRecord[]=[],disposed={count:0},consent=controller(records,disposed);
    localStorage.setItem('delftstudy.appearance.theme','dark');localStorage.setItem('delftstudy:v1:program','movq $1, %rax');
    await consent.allow();expect(consent.getSnapshot()).toBe('granted');track('course_opened',event);expect(records).toHaveLength(1);
    localStorage.setItem(persistenceKey,JSON.stringify({distinct_id:'random-browser-id'}));sessionStorage.setItem(`${persistenceKey}_window_id`,'window');
    const revisitRecords:AnalyticsRecord[]=[],revisitDisposed={count:0},revisit=controller(revisitRecords,revisitDisposed);
    expect(revisit.getSnapshot()).toBe('granted');expect(localStorage.getItem(persistenceKey)).toContain('random-browser-id');track('course_opened',event);expect(revisitRecords).toHaveLength(1);
    await revisit.withdraw();expect(revisit.getSnapshot()).toBe('denied');expect(localStorage.getItem(persistenceKey)).toBeNull();expect(sessionStorage.getItem(`${persistenceKey}_window_id`)).toBeNull();expect(localStorage.getItem('delftstudy.appearance.theme')).toBe('dark');expect(localStorage.getItem('delftstudy:v1:program')).toContain('movq');expect(localStorage.getItem(ANALYTICS_CONSENT_KEY)).toBe('denied');expect(revisitDisposed.count).toBe(1);
    await revisit.allow();expect(revisit.getSnapshot()).toBe('granted');track('course_opened',event);expect(revisitRecords).toHaveLength(2);expect(document.cookie).toBe('');
    await revisit.withdraw();
  });

  it('removes the legacy pre-consent identifier before showing a decision',()=>{
    localStorage.setItem('ph_phc_test_public_key_posthog','legacy');localStorage.setItem('notedra.keep','safe');
    const consent=controller([],{count:0});expect(consent.getSnapshot()).toBeNull();expect(localStorage.getItem('ph_phc_test_public_key_posthog')).toBeNull();expect(localStorage.getItem('notedra.keep')).toBe('safe');
  });
});

describe('analytics consent controls',()=>{
  let host:HTMLDivElement,root:Root;
  beforeEach(async()=>{localStorage.clear();sessionStorage.clear();setActiveAnalyticsSink(null);await loadMessages('en');host=document.createElement('div');document.body.append(host);root=createRoot(host);});
  afterEach(async()=>{await act(async()=>root.unmount());host.remove();setActiveAnalyticsSink(null);localStorage.clear();sessionStorage.clear();});
  it('offers equal first-visit choices and lets Settings enable and withdraw later',async()=>{
    const consent=controller([],{count:0});
    await act(async()=>root.render(<LanguageProvider><ThemeProvider><AnalyticsConsentProvider controller={consent}><MemoryRouter><AccountPage/><AnalyticsConsentBanner/></MemoryRouter></AnalyticsConsentProvider></ThemeProvider></LanguageProvider>));
    const choices=[...host.querySelectorAll<HTMLButtonElement>('.ds-analytics-consent-actions button')];expect(choices.map(button=>button.textContent)).toEqual(['Allow analytics','No thanks']);expect(choices.map(button=>button.className)).toEqual(['ds-button','ds-button']);
    await act(async()=>choices[1].click());expect(host.querySelector('.ds-analytics-consent')).toBeNull();let toggle=host.querySelector<HTMLInputElement>('input[type=checkbox][aria-label],.ds-analytics-setting input')!;expect(toggle.checked).toBe(false);
    await act(async()=>{toggle.click();await Promise.resolve();});expect(consent.getSnapshot()).toBe('granted');expect(toggle.checked).toBe(true);
    await act(async()=>{toggle.click();await Promise.resolve();});expect(consent.getSnapshot()).toBe('denied');expect(toggle.checked).toBe(false);
  });
});
