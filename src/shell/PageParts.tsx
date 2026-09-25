import { CourseArtwork } from './CourseArtwork';
import type { CSSProperties,ReactNode } from 'react';
import { Link } from 'react-router';
import { ASSEMBLY_TOOL_PATH, type Course, topicsFor } from '../academic/navigation';
import { ShellIcon, type ShellIconName } from './ShellIcon';
import {useI18n} from '../i18n/i18n';
import {completionColor} from '../progress/completion-color';

export function PageHeading({eyebrow, title, children}: {eyebrow?: string; title: string; children?: ReactNode}) {
  return <header className="ds-page-heading">{eyebrow && <p className="ds-eyebrow">{eyebrow}</p>}<h1>{title}</h1>{children}</header>;
}
export function CourseCard({course,completion}: {course: Course;completion:{completed:number;eligible:number;percentage:number|null}}) {
  const {t}=useI18n();
  const percent=completion.percentage??0;const color=completionColor(percent);
  return <Link to={course.path} aria-label={course.name} className={`ds-course-card ds-tone-${course.tone}`}>
    <CourseArtwork course={course}/>
    <div className="ds-course-body"><h3>{course.publicName}</h3><p className="ds-course-subtitle">{course.description||t(course.descriptionKey)}</p>
    <div className="ds-course-meta"><span><ShellIcon name="book" size={15}/>{t('course.topicCount',{count:topicsFor(course.subject_id).length})}</span></div>
    <div className="ds-course-completion"><span>{completion.eligible?t('dashboard.exerciseProgress',{completed:completion.completed,total:completion.eligible,percentage:percent}):t('dashboard.noExercises')}</span><div role="progressbar" aria-label={t('dashboard.exerciseProgressAria',{course:course.name})} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} style={{'--completion-color':color} as CSSProperties}><i style={{width:`${percent}%`}}/></div><small>{t('dashboard.exerciseProgressHint')}</small></div></div>
  </Link>;
}
export function EmptyState({icon = 'book', title, children}: {icon?: ShellIconName; title: string; children: ReactNode}) {
  return <div className="ds-empty"><span className="ds-empty-icon"><ShellIcon name={icon} size={28}/></span><div><h2>{title}</h2>{children}</div></div>;
}
export function AssemblyToolCard() {
  const {t}=useI18n();
  return <article className="ds-tool-card"><span className="ds-tool-icon"><ShellIcon name="code" size={30}/></span><div><span className="ds-available">{t('course.availableTool')}</span><h3>Assembly Visualizer</h3><p>{t('course.assemblyDescription')}</p></div><Link to={ASSEMBLY_TOOL_PATH} className="ds-button ds-button-primary">{t('course.openWorkbench')} <ShellIcon name="arrow" size={17}/></Link></article>;
}
