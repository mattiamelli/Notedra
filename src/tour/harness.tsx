import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {MemoryRouter, Route, Routes} from 'react-router';
import {AccountContext, type AccountContextValue} from '../accounts/context';
import {ThemeProvider, useTheme} from '../appearance/theme';
import {LanguageProvider, useI18n} from '../i18n/i18n';
import {emptyBackup, type Backup, type LoadedState} from '../learning/contracts';
import {LearningProvider} from '../learning/LearningProvider';
import type {StudentRepository} from '../learning/repository';
import {DashboardPage} from '../pages/DashboardPage';
import {AppShell} from '../shell/AppShell';
import {TOUR_EVENT, tourStorageKey} from './ProductTour';
import '../index.css';
import '../design/product.css';
import '../practice/practice.css';
import '../shell/shell.css';
import './harness.css';

if (!import.meta.env.DEV) throw new Error('The Product Tour harness is available only in local development.');

const FIXTURE_ACCOUNT_ID='local-product-tour-review-user';
const fixtureBackup=emptyBackup();
const fixtureState:LoadedState={
  data:{...fixtureBackup,generation:'local-product-tour-review',revision:0},
  hasRecovery:false,
};

function cloneBackup():Backup {return structuredClone(fixtureBackup);}
function cloneState():LoadedState {return structuredClone(fixtureState);}
async function readOnlyMutation():Promise<LoadedState> {throw new Error('The local Product Tour harness is read-only.');}

function createFixtureRepository():StudentRepository {
  return {
    load:async()=>cloneState(),
    saveResume:readOnlyMutation,
    createDraft:readOnlyMutation,
    editDraft:readOnlyMutation,
    submit:readOnlyMutation,
    abandon:readOnlyMutation,
    setReviewed:readOnlyMutation,
    startExam:readOnlyMutation,
    saveExam:readOnlyMutation,
    submitExam:readOnlyMutation,
    abandonExam:readOnlyMutation,
    reviewExam:readOnlyMutation,
    addUpcomingExam:readOnlyMutation,
    updateUpcomingExam:readOnlyMutation,
    deleteUpcomingExam:readOnlyMutation,
    exportBackup:async()=>cloneBackup(),
    exportRecovery:async()=>cloneBackup(),
    restore:readOnlyMutation,
    close:()=>{},
  };
}

const fixtureAccount:AccountContextValue={
  config:{status:'unavailable',message:'Local visual review harness'},
  auth:null,
  state:{phase:'signed-in',user:{id:FIXTURE_ACCOUNT_ID,email:'tour-review@example.invalid',displayName:'Tour Reviewer'},message:'',epoch:1},
  syncStatus:'Local only',
  syncMessage:'In-memory visual review fixture',
  sync:null,
  adopt:null,
};

function HarnessControls(){
  const {language,setLanguage}=useI18n();
  const {resolved,setPreference}=useTheme();
  return <aside className="tour-harness-controls" aria-label="Local Product Tour controls">
    <strong>Local review</strong>
    <div className="tour-harness-control-group" aria-label="Language">
      <button type="button" aria-pressed={language==='en'} onClick={()=>setLanguage('en')}>EN</button>
      <button type="button" aria-pressed={language==='it'} onClick={()=>setLanguage('it')}>IT</button>
      <button type="button" aria-pressed={language==='es'} onClick={()=>setLanguage('es')}>ES</button>
      <button type="button" aria-pressed={language==='fr'} onClick={()=>setLanguage('fr')}>FR</button>
      <button type="button" aria-pressed={language==='de'} onClick={()=>setLanguage('de')}>DE</button>
    </div>
    <div className="tour-harness-control-group" aria-label="Theme">
      <button type="button" aria-pressed={resolved==='light'} onClick={()=>setPreference('light')}>Light</button>
      <button type="button" aria-pressed={resolved==='dark'} onClick={()=>setPreference('dark')}>Dark</button>
    </div>
    <button className="tour-harness-restart" type="button" onClick={()=>window.dispatchEvent(new CustomEvent(TOUR_EVENT))}>Restart Tour</button>
  </aside>;
}

function Harness(){
  return <ThemeProvider><LanguageProvider><AccountContext.Provider value={fixtureAccount}>
    <MemoryRouter initialEntries={['/dashboard']}>
      <LearningProvider createRepository={createFixtureRepository}>
        <Routes><Route element={<AppShell/>}><Route path="dashboard" element={<DashboardPage/>}/></Route></Routes>
        <HarnessControls/>
      </LearningProvider>
    </MemoryRouter>
  </AccountContext.Provider></LanguageProvider></ThemeProvider>;
}

try {localStorage.removeItem(tourStorageKey(FIXTURE_ACCOUNT_ID));} catch {/* The in-memory review still opens. */}
createRoot(document.getElementById('root')!).render(<StrictMode><Harness/></StrictMode>);
