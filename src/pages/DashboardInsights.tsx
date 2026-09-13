import {useMemo,type ReactNode} from 'react';
import {Link} from 'react-router';
import {courses} from '../academic/navigation';
import {useEvidence} from '../adaptive/useEvidence';
import {recommend} from '../adaptive/engine';
import {useProgress} from '../progress/useProgress';
import {ShellIcon} from '../shell/ShellIcon';
import {useI18n} from '../i18n/i18n';
export default function DashboardInsights({children}:{children?:ReactNode}) {
  const {t}=useI18n();
  const {learning,evidence}=useEvidence();
  const {result,message}=useProgress();
  const path=useMemo(()=>recommend(evidence,{minutes:20,subjectId:'',topicId:''}),[evidence]);
  return <>
    <section className="ds-dash-panel ds-dash-plan"><div className="ds-section-heading"><h2><ShellIcon name="calendar"/>{t('dashboard.studyPath')}</h2><span>{t('dashboard.flexiblePlan')}</span></div>
      {!learning?.snapshot?<p role="status">{learning?.message??'Your saved study history is unavailable.'}</p>:path.length?<ol className="ds-dashboard-plan">{path.map((action,i)=><li key={action.id}><span className="ds-plan-number">{i+1}</span><div><h3>{action.title}</h3><p>{action.reason}</p><small>{action.minutes} min · {action.durationSource}</small></div><Link className="ds-button" to={action.to}>{t('dashboard.open')}</Link></li>)}</ol>:<div className="ds-plan-empty"><span className="ds-plan-number"><ShellIcon name="book" size={28}/></span><div><h3>{t('dashboard.startTopic')}</h3><p>{t('dashboard.startTopicBody')}</p><Link className="ds-button" to="/practice">{t('dashboard.startPractice')} <ShellIcon name="arrow" size={16}/></Link></div></div>}
      <Link className="ds-dash-footer" to="/study-plan">{t('dashboard.fullStudyPath')} <ShellIcon name="arrow" size={16}/></Link>
    </section>
    <section className="ds-dash-panel ds-dash-readiness"><h2><ShellIcon name="progress"/>{t('dashboard.examReadiness')}</h2><p className="ds-dash-caption">{t('dashboard.readinessCaption')}</p>{!result?<p role="status">{message}</p>:<div className="ds-readiness-list">{courses.map(course=>{const value=result.readiness.find(r=>r.courseId===course.subject_id)!;return <Link key={course.subject_id} to={'/progress?course='+course.subject_id} data-course={course.subject_id}><span className="ds-course-dot"/><div><strong>{course.short}</strong><small>{t('dashboard.confidence',{value:value.confidence})}</small><small>{t('dashboard.coverage',{covered:value.objectiveTopics,total:value.totalTopics})}</small></div><span className="ds-readiness-value">{value.index===null?t('dashboard.notEnoughEvidence'):<><b>{value.index}</b><small>/ 100 index</small></>}</span></Link>;})}</div>}<Link className="ds-dash-footer" to="/progress">{t('dashboard.exploreReadiness')} <ShellIcon name="arrow" size={16}/></Link></section>
    {children}
    <section className="ds-dash-panel ds-dash-mastery"><h2><ShellIcon name="progress"/>{t('dashboard.mastery')}</h2><p className="ds-dash-caption">{t('dashboard.masteryCaption')}</p>{!result?<p role="status">{message}</p>:<div className="ds-mastery-list">{courses.map(course=>{const value=result.courses.find(c=>c.id===course.subject_id)!;return <Link to={'/progress?course='+course.subject_id} key={course.subject_id} data-course={course.subject_id}><span>{course.short}</span><div><strong>{value.index===null?t('dashboard.notEnoughPractice'):`${value.index} / 100`}</strong><small>{t('dashboard.skills',{covered:value.covered,total:value.total,confidence:value.confidence})}</small></div><ShellIcon name="arrow" size={16}/></Link>;})}</div>}<p className="ds-dash-caption">{t('dashboard.unknownPractice')}</p></section>
  </>;
}
