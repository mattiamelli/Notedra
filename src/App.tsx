import { PracticePage } from './practice/PracticePage';
import { ExercisePage } from './practice/ExercisePage';
import { AttemptPage } from './practice/AttemptPage';
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
    <Route path="practice" caseSensitive element={<PracticePage/>}/>
    <Route path="practice/:exerciseId" caseSensitive element={<ExercisePage/>}/>
    <Route path="practice/:exerciseId/attempts/:attemptId" caseSensitive element={<AttemptPage/>}/>
    {productAreas.filter(area => area.path !== '/practice').map(area => <Route key={area.path} path={area.path} caseSensitive element={<ProductAreaPage area={area}/>}/>)}
    <Route path="*" element={<NotFoundPage/>}/>
  </Route></Routes>;
}

export default function App() {
  return <BrowserRouter><LearningProvider><AppRoutes/></LearningProvider></BrowserRouter>;
}
