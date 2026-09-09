import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ASSEMBLY_TOOL_PATH, type Course, topicsFor } from '../academic/navigation';
import { ShellIcon, type ShellIconName } from './ShellIcon';

export function PageHeading({eyebrow, title, children}: {eyebrow?: string; title: string; children?: ReactNode}) {
  return <header className="ds-page-heading">{eyebrow && <p className="ds-eyebrow">{eyebrow}</p>}<h1>{title}</h1>{children}</header>;
}
export function CourseCard({course}: {course: Course}) {
  return <Link to={course.path} className={`ds-course-card ds-tone-${course.tone}`}>
    <div className="ds-card-top"><span className="ds-course-symbol"><ShellIcon name={course.icon} size={25}/></span><span className="ds-course-code">{course.code}</span></div>
    <h3>{course.name}</h3><p>{topicsFor(course.subject_id).length} topics</p>
    <span className="ds-card-action">Browse topics <ShellIcon name="arrow" size={17}/></span>
  </Link>;
}
export function EmptyState({icon = 'book', title, children}: {icon?: ShellIconName; title: string; children: ReactNode}) {
  return <div className="ds-empty"><span className="ds-empty-icon"><ShellIcon name={icon} size={28}/></span><div><h2>{title}</h2>{children}</div></div>;
}
export function AssemblyToolCard() {
  return <article className="ds-tool-card"><span className="ds-tool-icon"><ShellIcon name="code" size={30}/></span><div><span className="ds-available">Available tool</span><h3>Assembly Visualizer</h3><p>Step through a program and inspect registers, the stack, and execution history.</p></div><Link to={ASSEMBLY_TOOL_PATH} className="ds-button ds-button-primary">Open workbench <ShellIcon name="arrow" size={17}/></Link></article>;
}
