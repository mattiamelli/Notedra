import {ProgressLoader} from '../progress/ProgressLoader';
import {SummaryLoader} from '../adaptive/SummaryLoader';
import { ResumeLink } from '../learning/LearningProvider';
import { Link } from 'react-router';
import { academicIndex, courses, productAreas } from '../academic/navigation';
import { AssemblyToolCard, CourseCard, PageHeading } from '../shell/PageParts';
import { ShellIcon } from '../shell/ShellIcon';
export function DashboardPage() {
  return <>
    <div className="ds-welcome"><div><PageHeading eyebrow="DELFTSTUDY · YOUR STUDY SPACE" title="Dashboard"><p>Build understanding, one idea at a time.</p></PageHeading><div className="ds-dashboard-actions"><Link className="ds-button ds-button-primary" to="/study-plan">Choose your next step <ShellIcon name="arrow" size={17}/></Link><Link className="ds-button" to="/exams">Mock Exams</Link></div></div><svg className="ds-welcome-mark" viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="M12 20 50 10 88 20v60L50 90 12 80Z" stroke="currentColor" strokeWidth="2"/><path d="M50 10v80M12 40l38 10 38-10M12 60l38 10 38-10" stroke="currentColor" strokeWidth="2"/><circle cx="50" cy="50" r="6" fill="currentColor"/></svg></div>
    <ResumeLink/><SummaryLoader/>
    <section className="ds-section" aria-labelledby="courses-title"><div className="ds-section-heading"><h2 id="courses-title">Your courses</h2><span>{courses.length} courses · {academicIndex.topics.length} topics</span></div><div className="ds-course-grid">{courses.map(course => <CourseCard key={course.subject_id} course={course}/>)}</div></section>
    <section className="ds-section" aria-labelledby="tools-title"><div className="ds-section-heading"><h2 id="tools-title">Available tools</h2><span>{courses.find(course => course.subject_id === 'CSE1400_CO')!.name}</span></div><AssemblyToolCard/></section>
    <section className="ds-section" aria-labelledby="study-title"><div className="ds-section-heading"><h2 id="study-title">Study areas</h2><span>Explore what’s next</span></div><div className="ds-shortcuts">{productAreas.map(area => <Link to={area.path} key={area.path}><ShellIcon name={area.icon}/><span>{area.title}</span><ShellIcon name="arrow" size={15}/></Link>)}</div></section>
    <ProgressLoader/>
  </>;
}
