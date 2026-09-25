import './practice/practice.css';
import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { BrowserRouter, Route, Routes, useNavigate, useSearchParams } from 'react-router';
import { ASSEMBLY_TOOL_PATH, courses, productAreas } from './academic/navigation';
import { AppShell } from './shell/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { ProductAreaPage } from './pages/ProductAreaPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LandingPage } from './pages/LandingPage';
import './shell/shell.css';
import { AccountRoot } from './accounts/AccountRoot';
import {useAccount} from './accounts/context';
import { ThemeProvider } from './appearance/theme';
import {LanguageProvider} from './i18n/i18n';
import {useI18n} from './i18n/i18n';
import {AnalyticsConsentProvider} from './analytics/consent';
import {AnalyticsConsentBanner} from './analytics/ConsentBanner';
const AccountPage=lazy(()=>import('./accounts/AccountPage').then(m=>({default:m.AccountPage})));
const LegalPage=lazy(()=>import('./pages/LegalPage').then(m=>({default:m.LegalPage})));
const CoursePage=lazy(()=>import('./pages/CoursePage').then(m=>({default:m.CoursePage})));
const TopicPage=lazy(()=>import('./pages/TopicPage').then(m=>({default:m.TopicPage})));

const PracticePage = lazy(() => import('./practice/PracticePage').then(m => ({default:m.PracticePage})));
const ExercisePage = lazy(() => import('./practice/ExercisePage').then(m => ({default:m.ExercisePage})));
const AttemptPage = lazy(() => import('./practice/AttemptPage').then(m => ({default:m.AttemptPage})));

const MistakesPage=lazy(()=>import('./adaptive/MistakesPage').then(m=>({default:m.MistakesPage})));
const StudyPathPage=lazy(()=>import('./adaptive/StudyPathPage').then(m=>({default:m.StudyPathPage})));
const ProgressPage=lazy(()=>import('./progress/ProgressPage').then(m=>({default:m.ProgressPage})));
const ExamsPage=lazy(()=>import('./exams/ExamsPage').then(m=>({default:m.ExamsPage})));
const AssemblyWorkbench = lazy(() => import('./AssemblyWorkbenchRoute'));

export function safeInternalReturnTo(value:string|null):string|null {
  if(!value||!value.startsWith('/')||value.startsWith('//')||value.includes('\\'))return null;
  try {
    const parsed=new URL(value,window.location.origin);
    if(parsed.origin!==window.location.origin||parsed.pathname==='/account'||parsed.pathname==='/')return null;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {return null;}
}

function AccountEntry({children}:{children:ReactNode}) {
  const account=useAccount(),navigate=useNavigate(),[params]=useSearchParams();
  const returnTo=safeInternalReturnTo(params.get('returnTo'));
  useEffect(()=>{if(returnTo&&account.state.user)navigate(returnTo,{replace:true});},[account.state.user,returnTo,navigate]);
  if(returnTo&&account.state.phase==='loading')return <main className="ds-bootstrap"><p role="status">Restoring your session</p></main>;
  return <>{children}</>;
}

export function AppRoutes() {
  const {t}=useI18n();
  const loading=(area:string)=><p className="ds-loading" role="status">{t('common.loadingArea',{area})}</p>;
  return <Routes>
    <Route index element={<LandingPage/>}/>
    <Route element={<AppShell/>}>
    <Route path="account" caseSensitive element={<AccountEntry><Suspense fallback={loading(t('nav.account'))}><AccountPage/></Suspense></AccountEntry>}/>
    <Route path="privacy" caseSensitive element={<Suspense fallback={loading(t('nav.privacy'))}><LegalPage kind="privacy"/></Suspense>}/>
    <Route path="terms" caseSensitive element={<Suspense fallback={loading(t('nav.terms'))}><LegalPage kind="terms"/></Suspense>}/>
    </Route>
    <Route element={<AppShell/>}>
    <Route path="dashboard" caseSensitive element={<DashboardPage/>}/>
    {courses.map(course => <Route key={course.subject_id} path={course.path} caseSensitive>
      <Route index element={<Suspense fallback={loading(course.name)}><CoursePage course={course}/></Suspense>}/>
      <Route path=":topicId" caseSensitive element={<Suspense fallback={loading(course.name)}><TopicPage course={course}/></Suspense>}/>
      <Route path=":topicId/:mode" caseSensitive element={<Suspense fallback={loading(course.name)}><TopicPage course={course}/></Suspense>}/>
    </Route>)}
    <Route path={ASSEMBLY_TOOL_PATH} caseSensitive element={<Suspense fallback={loading('Assembly workbench')}><AssemblyWorkbench/></Suspense>}/>
    <Route path="practice" caseSensitive element={<Suspense fallback={loading(t('nav.practice'))}><PracticePage/></Suspense>}/>
    <Route path="practice/:exerciseId" caseSensitive element={<Suspense fallback={loading(t('nav.practice'))}><ExercisePage/></Suspense>}/>
    <Route path="practice/:exerciseId/attempts/:attemptId" caseSensitive element={<Suspense fallback={loading(t('nav.practice'))}><AttemptPage/></Suspense>}/>
    <Route path="mistakes" caseSensitive element={<Suspense fallback={loading(t('topic.mistakes'))}><MistakesPage/></Suspense>}/>
    <Route path="study-plan" caseSensitive element={<Suspense fallback={loading(t('studyPath.title'))}><StudyPathPage/></Suspense>}/>
    <Route path="exams/*" caseSensitive element={<Suspense fallback={loading('Mock Exams')}><ExamsPage/></Suspense>}/>
    <Route path="progress" caseSensitive element={<Suspense fallback={loading(t('progress.title'))}><ProgressPage/></Suspense>}/>
    {productAreas.filter(area => !['/practice','/mistakes','/study-plan','/exams','/progress'].includes(area.path)).map(area => <Route key={area.path} path={area.path} caseSensitive element={<ProductAreaPage area={area}/>}/>)}
    <Route path="*" element={<NotFoundPage/>}/>
    </Route>
  </Routes>;
}

export default function App() {
  return <LanguageProvider><ThemeProvider><AnalyticsConsentProvider><BrowserRouter><AccountRoot><AppRoutes/><AnalyticsConsentBanner/></AccountRoot></BrowserRouter></AnalyticsConsentProvider></ThemeProvider></LanguageProvider>;
}
