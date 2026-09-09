import { Link } from 'react-router';
import { academicIndex, courses, productAreas } from '../academic/navigation';
import { AssemblyToolCard, CourseCard, EmptyState, PageHeading } from '../shell/PageParts';
import { ShellIcon } from '../shell/ShellIcon';
export function DashboardPage() {
  return <>
    <PageHeading eyebrow="YOUR STUDY SPACE" title="Dashboard"><p>Choose a course or open the Assembly workbench.</p></PageHeading>
    <section className="ds-section" aria-labelledby="courses-title"><div className="ds-section-heading"><h2 id="courses-title">Your courses</h2><span>{courses.length} courses · {academicIndex.topics.length} topics</span></div><div className="ds-course-grid">{courses.map(course => <CourseCard key={course.subject_id} course={course}/>)}</div></section>
    <section className="ds-section" aria-labelledby="tools-title"><div className="ds-section-heading"><h2 id="tools-title">Available tools</h2><span>{courses.find(course => course.subject_id === 'CSE1400_CO')!.name}</span></div><AssemblyToolCard/></section>
    <section className="ds-section" aria-labelledby="study-title"><div className="ds-section-heading"><h2 id="study-title">Study areas</h2><span>Explore what’s next</span></div><div className="ds-shortcuts">{productAreas.map(area => <Link to={area.path} key={area.path}><ShellIcon name={area.icon}/><span>{area.title}</span><ShellIcon name="arrow" size={15}/></Link>)}</div></section>
    <EmptyState icon="progress" title="A place for your progress"><p>Progress tracking is not available yet. For now, explore the course topics and use the Assembly workbench.</p><Link to="/progress" className="ds-text-link">About progress <ShellIcon name="arrow" size={15}/></Link></EmptyState>
  </>;
}
