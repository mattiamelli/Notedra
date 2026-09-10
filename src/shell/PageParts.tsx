import { CourseArtwork } from './CourseArtwork';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ASSEMBLY_TOOL_PATH, type Course, topicsFor } from '../academic/navigation';
import { ShellIcon, type ShellIconName } from './ShellIcon';

export function PageHeading({eyebrow, title, children}: {eyebrow?: string; title: string; children?: ReactNode}) {
  return <header className="ds-page-heading">{eyebrow && <p className="ds-eyebrow">{eyebrow}</p>}<h1>{title}</h1>{children}</header>;
}
export function CourseCard({course}: {course: Course}) {
  return <Link to={course.path} className={`ds-course-card ds-tone-${course.tone}`}>
    <CourseArtwork course={course}/>
    <div className="ds-course-body"><h3>{course.name}</h3><p className="ds-course-subtitle">{course.short==='CO'?'Computer architecture':course.short==='R&L'?'Reasoning, proofs & logic':'Java & problem solving'}</p>
    <div className="ds-course-meta"><span><ShellIcon name="book" size={15}/>{topicsFor(course.subject_id).length} topics</span><span>{course.code}</span></div>
    <span className="ds-card-action">Browse topics <ShellIcon name="arrow" size={17}/></span></div>
  </Link>;
}
export function EmptyState({icon = 'book', title, children}: {icon?: ShellIconName; title: string; children: ReactNode}) {
  return <div className="ds-empty"><span className="ds-empty-icon"><ShellIcon name={icon} size={28}/></span><div><h2>{title}</h2>{children}</div></div>;
}
export function AssemblyToolCard() {
  return <article className="ds-tool-card"><span className="ds-tool-icon"><ShellIcon name="code" size={30}/></span><div><span className="ds-available">Available tool</span><h3>Assembly Visualizer</h3><p>Step through a program and inspect registers, the stack, and execution history.</p></div><Link to={ASSEMBLY_TOOL_PATH} className="ds-button ds-button-primary">Open workbench <ShellIcon name="arrow" size={17}/></Link></article>;
}
