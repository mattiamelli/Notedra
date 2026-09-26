import {lazy, Suspense} from 'react';
import {SummaryLoader} from '../adaptive/SummaryLoader';
import {ResumeLink} from '../learning/LearningProvider';
import {Link} from 'react-router';
import {ASSEMBLY_TOOL_PATH} from '../academic/navigation';
import {ShellIcon} from '../shell/ShellIcon';
import DashboardExams from './DashboardExams';
import {useAccount} from '../accounts/context';
import {useI18n} from '../i18n/i18n';
const DashboardInsights = lazy(()=>import('./DashboardInsights'));
const DashboardNextAction = lazy(()=>import('./DashboardLearningPanels').then(module=>({default:module.DashboardNextAction})));
const DashboardCourses = lazy(()=>import('./DashboardLearningPanels').then(module=>({default:module.DashboardCourses})));
function DashboardSkeleton(){const {t}=useI18n();return <>
  <section className="ds-dash-panel ds-dash-plan ds-dashboard-skeleton" aria-busy="true"><h2>{t('dashboard.studyPath')}</h2><p role="status">{t('dashboard.loadingEvidence')}</p></section>
  <section className="ds-dash-panel ds-dash-readiness ds-dashboard-skeleton" aria-hidden="true"/>
  <section className="ds-dash-panel ds-dash-exams ds-dashboard-skeleton" aria-hidden="true"/>
  <section className="ds-dash-panel ds-dash-courses ds-dashboard-skeleton" aria-hidden="true"/>
  <section className="ds-dash-panel ds-dash-practice ds-dashboard-skeleton" aria-hidden="true"/>
  <section className="ds-dash-panel ds-dash-mastery ds-dashboard-skeleton" aria-hidden="true"/>
  </>}
function NextActionSkeleton(){const {t}=useI18n();return <section className="ds-next-action is-loading" aria-busy="true"><p role="status">{t('dashboard.loadingEvidence')}</p></section>}
export function DashboardPage() {
  const {state}=useAccount(); const profileName=state.user?.displayName?.trim(); const {t}=useI18n();
  return <div className="ds-dashboard">
    <header className="ds-dashboard-greeting" data-tour="welcome"><div><h1 className="ds-dashboard-label">{t('dashboard.title')}</h1><p className="ds-greeting-title">{profileName?t('dashboard.hello',{name:profileName}):t('dashboard.welcome')}</p><p>{t('dashboard.subtitle')}</p></div><p className="ds-greeting-note">{t('dashboard.motto')}</p></header>
    <Suspense fallback={<NextActionSkeleton/>}><DashboardCourses/></Suspense>
    <Suspense fallback={<NextActionSkeleton/>}><DashboardNextAction/></Suspense>
    <div className="ds-dashboard-grid">
      <Suspense fallback={<DashboardSkeleton/>}><DashboardInsights>
      <DashboardExams/>
      <section className="ds-dash-panel ds-dash-practice" data-tour="practice-panel"><h2><ShellIcon name="practice"/>{t('dashboard.practiceTitle')}</h2><p>{t('dashboard.practiceBody')}</p><Link className="ds-button" to="/practice">{t('dashboard.openPractice')} <ShellIcon name="arrow" size={17}/></Link><div className="ds-dash-links" data-tour="assessment"><Link to="/mistakes">{t('dashboard.reviewMistakes')}</Link><Link to="/exams">{t('dashboard.mockExam')}</Link></div></section>
      </DashboardInsights></Suspense>
      <section className="ds-dash-panel ds-dash-continue" data-tour="progress-panel"><h2><ShellIcon name="calendar"/>{t('dashboard.continue')}</h2><ResumeLink/><SummaryLoader/><p className="ds-continue-hint">{t('dashboard.continueHint')}</p><Link to="/progress">{t('dashboard.viewEvidence')} →</Link></section>
      <section className="ds-dash-panel ds-dash-tools" data-tour="tools"><h2><ShellIcon name="cpu"/>{t('dashboard.machineTitle')}</h2><p>{t('dashboard.machineBody')}</p><Link className="ds-button" to={ASSEMBLY_TOOL_PATH}>{t('dashboard.openAssembly')} <ShellIcon name="arrow" size={17}/></Link></section>
    </div>
  </div>;
}
