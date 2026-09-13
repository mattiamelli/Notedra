import {lazy, Suspense} from 'react';
import {SummaryLoader} from '../adaptive/SummaryLoader';
import {ResumeLink} from '../learning/LearningProvider';
import {Link} from 'react-router';
import {academicIndex, courses, ASSEMBLY_TOOL_PATH} from '../academic/navigation';
import {CourseCard} from '../shell/PageParts';
import {ShellIcon} from '../shell/ShellIcon';
import DashboardExams from './DashboardExams';
import {useAccount} from '../accounts/context';
const DashboardInsights = lazy(()=>import('./DashboardInsights'));
function DashboardSkeleton(){return <>
  <section className="ds-dash-panel ds-dash-plan ds-dashboard-skeleton" aria-busy="true"><h2>Your Study Path</h2><p role="status">Loading your local study evidence…</p></section>
  <section className="ds-dash-panel ds-dash-readiness ds-dashboard-skeleton" aria-hidden="true"/>
  <section className="ds-dash-panel ds-dash-exams ds-dashboard-skeleton" aria-hidden="true"/>
  <section className="ds-dash-panel ds-dash-courses ds-dashboard-skeleton" aria-hidden="true"/>
  <section className="ds-dash-panel ds-dash-practice ds-dashboard-skeleton" aria-hidden="true"/>
  <section className="ds-dash-panel ds-dash-mastery ds-dashboard-skeleton" aria-hidden="true"/>
  </>}
export function DashboardPage() {
  const {state}=useAccount(); const profileName=state.user?.displayName?.trim();
  return <div className="ds-dashboard">
    <header className="ds-dashboard-greeting"><div><h1 className="ds-dashboard-label">Dashboard</h1><p className="ds-greeting-title">{profileName?`Hello ${profileName}`:<>Welcome to <span>Notedra</span></>}</p><p>Build understanding today. Take your next step with confidence.</p></div><p className="ds-greeting-note">Learn · Practice · Reflect</p></header>
    <div className="ds-dashboard-grid">
      <Suspense fallback={<DashboardSkeleton/>}><DashboardInsights>
      <DashboardExams/>
      <section className="ds-dash-panel ds-dash-courses" aria-labelledby="courses-title"><div className="ds-section-heading"><h2 id="courses-title"><ShellIcon name="book"/>Your courses</h2><span>{courses.length} courses · {academicIndex.topics.length} topics</span></div><div className="ds-course-grid">{courses.map(course=><CourseCard key={course.subject_id} course={course}/>)}</div></section>
      <section className="ds-dash-panel ds-dash-practice"><h2><ShellIcon name="practice"/>Practice, one idea at a time</h2><p>Choose a course and work through authored exercises with explanatory feedback.</p><Link className="ds-button ds-button-primary" to="/practice">Open Practice <ShellIcon name="arrow" size={17}/></Link><div className="ds-dash-links"><Link to="/mistakes">Review Mistake Book</Link><Link to="/exams">Try a mock exam</Link></div></section>
      </DashboardInsights></Suspense>
      <section className="ds-dash-panel ds-dash-continue"><h2><ShellIcon name="calendar"/>Continue learning</h2><ResumeLink/><SummaryLoader/><p className="ds-continue-hint">Choose a course above, or return to your saved work.</p><Link to="/progress">View your learning evidence →</Link></section>
      <section className="ds-dash-panel ds-dash-tools"><h2><ShellIcon name="cpu"/>See the machine in motion</h2><p>Follow registers, stack frames and function calls, one instruction at a time.</p><Link className="ds-button" to={ASSEMBLY_TOOL_PATH}>Open Assembly Visualizer <ShellIcon name="arrow" size={17}/></Link></section>
    </div>
  </div>;
}
