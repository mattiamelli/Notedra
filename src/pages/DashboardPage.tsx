import {lazy, Suspense} from 'react';
import {SummaryLoader} from '../adaptive/SummaryLoader';
import {ResumeLink} from '../learning/LearningProvider';
import {Link} from 'react-router';
import {academicIndex, courses, ASSEMBLY_TOOL_PATH} from '../academic/navigation';
import {CourseCard} from '../shell/PageParts';
import {ShellIcon} from '../shell/ShellIcon';
import DashboardExams from './DashboardExams';
import {useAccount} from '../accounts/context';
import {useI18n} from '../i18n/i18n';
const DashboardInsights = lazy(()=>import('./DashboardInsights'));
function DashboardSkeleton(){const {t}=useI18n();return <>
  <section className="ds-dash-panel ds-dash-plan ds-dashboard-skeleton" aria-busy="true"><h2>{t('dashboard.studyPath')}</h2><p role="status">{t('dashboard.loadingEvidence')}</p></section>
  <section className="ds-dash-panel ds-dash-readiness ds-dashboard-skeleton" aria-hidden="true"/>
  <section className="ds-dash-panel ds-dash-exams ds-dashboard-skeleton" aria-hidden="true"/>
  <section className="ds-dash-panel ds-dash-courses ds-dashboard-skeleton" aria-hidden="true"/>
  <section className="ds-dash-panel ds-dash-practice ds-dashboard-skeleton" aria-hidden="true"/>
  <section className="ds-dash-panel ds-dash-mastery ds-dashboard-skeleton" aria-hidden="true"/>
  </>}
export function DashboardPage() {
  const {state}=useAccount(); const profileName=state.user?.displayName?.trim(); const {t}=useI18n();
  return <div className="ds-dashboard">
    <header className="ds-dashboard-greeting"><div><h1 className="ds-dashboard-label">{t('dashboard.title')}</h1><p className="ds-greeting-title">{profileName?t('dashboard.hello',{name:profileName}):t('dashboard.welcome')}</p><p>{t('dashboard.subtitle')}</p></div><p className="ds-greeting-note">{t('dashboard.motto')}</p></header>
    <div className="ds-dashboard-grid">
      <Suspense fallback={<DashboardSkeleton/>}><DashboardInsights>
      <DashboardExams/>
      <section id="courses" className="ds-dash-panel ds-dash-courses" aria-labelledby="courses-title"><div className="ds-section-heading"><h2 id="courses-title"><ShellIcon name="book"/>{t('dashboard.courses')}</h2><span>{t('dashboard.courseCount',{courses:courses.length,topics:academicIndex.topics.length})}</span></div><div className="ds-course-grid">{courses.map(course=><CourseCard key={course.subject_id} course={course}/>)}</div></section>
      <section className="ds-dash-panel ds-dash-practice"><h2><ShellIcon name="practice"/>{t('dashboard.practiceTitle')}</h2><p>{t('dashboard.practiceBody')}</p><Link className="ds-button ds-button-primary" to="/practice">{t('dashboard.openPractice')} <ShellIcon name="arrow" size={17}/></Link><div className="ds-dash-links"><Link to="/mistakes">{t('dashboard.reviewMistakes')}</Link><Link to="/exams">{t('dashboard.mockExam')}</Link></div></section>
      </DashboardInsights></Suspense>
      <section className="ds-dash-panel ds-dash-continue"><h2><ShellIcon name="calendar"/>{t('dashboard.continue')}</h2><ResumeLink/><SummaryLoader/><p className="ds-continue-hint">{t('dashboard.continueHint')}</p><Link to="/progress">{t('dashboard.viewEvidence')} →</Link></section>
      <section className="ds-dash-panel ds-dash-tools"><h2><ShellIcon name="cpu"/>{t('dashboard.machineTitle')}</h2><p>{t('dashboard.machineBody')}</p><Link className="ds-button" to={ASSEMBLY_TOOL_PATH}>{t('dashboard.openAssembly')} <ShellIcon name="arrow" size={17}/></Link></section>
    </div>
  </div>;
}
