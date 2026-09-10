import './practice/practice.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { ASSEMBLY_TOOL_PATH, courses, productAreas } from './academic/navigation';
import { AppShell } from './shell/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { CoursePage } from './pages/CoursePage';
import { TopicPage } from './pages/TopicPage';
import { ProductAreaPage } from './pages/ProductAreaPage';
import { NotFoundPage } from './pages/NotFoundPage';
import './shell/shell.css';
import { LearningProvider } from './learning/LearningProvider';

const PracticePage = lazy(() => import('./practice/PracticePage').then(m => ({default:m.PracticePage})));
const ExercisePage = lazy(() => import('./practice/ExercisePage').then(m => ({default:m.ExercisePage})));
const AttemptPage = lazy(() => import('./practice/AttemptPage').then(m => ({default:m.AttemptPage})));

const MistakesPage=lazy(()=>import('./adaptive/MistakesPage').then(m=>({default:m.MistakesPage})));
const StudyPathPage=lazy(()=>import('./adaptive/StudyPathPage').then(m=>({default:m.StudyPathPage})));
const ProgressPage=lazy(()=>import('./progress/ProgressPage').then(m=>({default:m.ProgressPage})));
const ExamsPage=lazy(()=>import('./exams/ExamsPage').then(m=>({default:m.ExamsPage})));
const AssemblyWorkbench = lazy(() => import('./AssemblyWorkbench'));

export function AppRoutes() {
  return <Routes><Route element={<AppShell/>}>
    <Route index element={<DashboardPage/>}/>
    <Route path="dashboard" caseSensitive element={<Navigate to="/" replace/>}/>
    {courses.map(course => <Route key={course.subject_id} path={course.path} caseSensitive>
      <Route index element={<CoursePage course={course}/>}/>
      <Route path=":topicId" caseSensitive element={<TopicPage course={course}/>}/>
      <Route path=":topicId/:mode" caseSensitive element={<TopicPage course={course}/>}/>
    </Route>)}
    <Route path={ASSEMBLY_TOOL_PATH} caseSensitive element={<Suspense fallback={<p className="ds-loading" role="status">Loading Assembly workbench…</p>}><AssemblyWorkbench/></Suspense>}/>
    <Route path="practice" caseSensitive element={<Suspense fallback={<p className="ds-loading" role="status">Loading Practice…</p>}><PracticePage/></Suspense>}/>
    <Route path="practice/:exerciseId" caseSensitive element={<Suspense fallback={<p className="ds-loading" role="status">Loading Practice…</p>}><ExercisePage/></Suspense>}/>
    <Route path="practice/:exerciseId/attempts/:attemptId" caseSensitive element={<Suspense fallback={<p className="ds-loading" role="status">Loading Practice…</p>}><AttemptPage/></Suspense>}/>
    <Route path="mistakes" caseSensitive element={<Suspense fallback={<p role="status">Loading Mistake Book…</p>}><MistakesPage/></Suspense>}/>
    <Route path="study-plan" caseSensitive element={<Suspense fallback={<p role="status">Loading Study Path…</p>}><StudyPathPage/></Suspense>}/>
    <Route path="exams/*" caseSensitive element={<Suspense fallback={<p role="status">Loading Mock Exams…</p>}><ExamsPage/></Suspense>}/>
    <Route path="progress" caseSensitive element={<Suspense fallback={<p role="status">Loading Progress…</p>}><ProgressPage/></Suspense>}/>
    {productAreas.filter(area => !['/practice','/mistakes','/study-plan','/exams','/progress'].includes(area.path)).map(area => <Route key={area.path} path={area.path} caseSensitive element={<ProductAreaPage area={area}/>}/>)}
    <Route path="*" element={<NotFoundPage/>}/>
  </Route></Routes>;
}

export default function App() {
  return <BrowserRouter><LearningProvider><AppRoutes/></LearningProvider></BrowserRouter>;
}
