import {type ReactNode} from 'react';
import {Link} from 'react-router';
import {courses as allCourses} from '../academic/navigation';
import {useCurrentTrimester} from './useCurrentTrimester';
import {useProgress} from '../progress/useProgress';
import {ShellIcon} from '../shell/ShellIcon';
import {useI18n} from '../i18n/i18n';
export default function DashboardInsights({children}:{children?:ReactNode}) {
  const {t}=useI18n();
  const [trimester]=useCurrentTrimester();
  const courses=allCourses.filter(course=>course.trimester===trimester);
  const {result,message}=useProgress();
  return <>
    <section className="ds-dash-panel ds-dash-plan"><div className="ds-section-heading"><h2><ShellIcon name="calendar"/>{t('dashboard.studyPath')}</h2></div>
      <div className="ds-plan-empty"><span className="ds-plan-number"><ShellIcon name="book" size={28}/></span><div><h3>{t('studyPath.eyebrow')}</h3><p>{t('studyPath.description')}</p><Link className="ds-button" to="/study-plan">{t('studyPath.build')} <ShellIcon name="arrow" size={16}/></Link></div></div>
    </section>
    <section className="ds-dash-panel ds-dash-readiness"><h2><ShellIcon name="progress"/>{t('dashboard.examReadiness')}</h2><p className="ds-dash-caption">{t('dashboard.readinessCaption')}</p>{!result?<p role="status">{message}</p>:<div className="ds-readiness-list">{courses.map(course=>{const value=result.readiness.find(r=>r.courseId===course.subject_id)!;const confidence=t(value.confidence==='Insufficient'?'confidence.insufficient':value.confidence==='Low'?'confidence.low':value.confidence==='Moderate'?'confidence.moderate':'confidence.high');return <Link key={course.subject_id} to={'/progress?course='+course.subject_id} data-course={course.subject_id}><span className="ds-course-dot"/><div><strong>{course.compactName}</strong><small>{t('dashboard.confidence',{value:confidence})}</small><small>{t('dashboard.coverage',{covered:value.objectiveTopics,total:value.totalTopics})}</small></div><span className="ds-readiness-value">{value.index===null?t('dashboard.notEnoughEvidence'):<><b>{value.index}</b><small>{t('dashboard.indexScale')}</small></>}</span></Link>;})}</div>}<Link className="ds-dash-footer" to="/progress">{t('dashboard.exploreReadiness')} <ShellIcon name="arrow" size={16}/></Link></section>
    {children}
    <section className="ds-dash-panel ds-dash-mastery"><h2><ShellIcon name="progress"/>{t('dashboard.mastery')}</h2><p className="ds-dash-caption">{t('dashboard.masteryCaption')}</p>{!result?<p role="status">{message}</p>:<div className="ds-mastery-list">{courses.map(course=>{const value=result.courses.find(c=>c.id===course.subject_id)!;const confidence=t(value.confidence==='Insufficient'?'confidence.insufficient':value.confidence==='Low'?'confidence.low':value.confidence==='Moderate'?'confidence.moderate':'confidence.high');return <Link to={'/progress?course='+course.subject_id} key={course.subject_id} data-course={course.subject_id}><span>{course.compactName}</span><div><strong>{value.index===null?t('dashboard.notEnoughPractice'):`${value.index} / 100`}</strong><small>{t('dashboard.skills',{covered:value.covered,total:value.total,confidence})}</small></div><ShellIcon name="arrow" size={16}/></Link>;})}</div>}<p className="ds-dash-caption">{t('dashboard.unknownPractice')}</p></section>
  </>;
}
