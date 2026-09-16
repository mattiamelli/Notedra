import './practice/practice.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ASSEMBLY_TOOL_PATH, courses, productAreas } from './academic/navigation';
import { AppShell } from './shell/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { ProductAreaPage } from './pages/ProductAreaPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LandingPage } from './pages/LandingPage';
import './shell/shell.css';
import { AccountRoot } from './accounts/AccountRoot';
import { ThemeProvider } from './appearance/theme';
import {LanguageProvider} from './i18n/i18n';
import {useI18n} from './i18n/i18n';
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
const AssemblyWorkbench = lazy(() => import('./AssemblyWorkbench'));

export function AppRoutes() {
  const {t}=useI18n();
  const loading=(area:string)=><p className="ds-loading" role="status">{t('common.loadingArea',{area})}</p>;
  return <Routes>
    <Route index element={<LandingPage/>}/>
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
    <Route path="account" caseSensitive element={<Suspense fallback={loading(t('nav.account'))}><AccountPage/></Suspense>}/>
    <Route path="privacy" caseSensitive element={<Suspense fallback={loading(t('nav.privacy'))}><LegalPage kind="privacy"/></Suspense>}/>
    <Route path="terms" caseSensitive element={<Suspense fallback={loading(t('nav.terms'))}><LegalPage kind="terms"/></Suspense>}/>
    {productAreas.filter(area => !['/practice','/mistakes','/study-plan','/exams','/progress'].includes(area.path)).map(area => <Route key={area.path} path={area.path} caseSensitive element={<ProductAreaPage area={area}/>}/>)}
    <Route path="*" element={<NotFoundPage/>}/>
    </Route>
  </Routes>;
}

export default function App() {
  return <LanguageProvider><ThemeProvider><BrowserRouter><AccountRoot><AppRoutes/></AccountRoot></BrowserRouter></ThemeProvider></LanguageProvider>;
}
