import {useMemo,type ReactNode} from 'react';
import {Link} from 'react-router';
import {courses} from '../academic/navigation';
import {useEvidence} from '../adaptive/useEvidence';
import {recommend} from '../adaptive/engine';
import {useProgress} from '../progress/useProgress';
import {ShellIcon} from '../shell/ShellIcon';
export default function DashboardInsights({children}:{children?:ReactNode}) {
  const {learning,evidence}=useEvidence();
  const {result,message}=useProgress();
  const path=useMemo(()=>recommend(evidence,{minutes:20,subjectId:'',topicId:''}),[evidence]);
  return <>
    <section className="ds-dash-panel ds-dash-plan"><div className="ds-section-heading"><h2><ShellIcon name="calendar"/>Your Study Path</h2><span>20 min · flexible plan</span></div>
      {!learning?.snapshot?<p role="status">{learning?.message??'Student storage is not connected.'}</p>:path.length?<ol className="ds-dashboard-plan">{path.map((action,i)=><li key={action.id}><span className="ds-plan-number">{i+1}</span><div><h3>{action.title}</h3><p>{action.reason}</p><small>{action.minutes} min · {action.durationSource}</small></div><Link className="ds-button" to={action.to}>Open</Link></li>)}</ol>:<div className="ds-plan-empty"><span className="ds-plan-number"><ShellIcon name="book" size={28}/></span><div><h3>Your next step starts with a topic</h3><p>There are no evidence-based recommendations yet. Choose a course or try Practice to begin.</p><Link className="ds-button" to="/practice">Choose Practice <ShellIcon name="arrow" size={16}/></Link></div></div>}
      <Link className="ds-dash-footer" to="/study-plan">View full Study Path <ShellIcon name="arrow" size={16}/></Link>
    </section>
    <section className="ds-dash-panel ds-dash-readiness"><h2><ShellIcon name="progress"/>Exam Readiness</h2><p className="ds-dash-caption">Course evidence, not a grade prediction.</p>{!result?<p role="status">{message}</p>:<div className="ds-readiness-list">{courses.map(course=>{const value=result.readiness.find(r=>r.courseId===course.subject_id)!;return <Link key={course.subject_id} to={'/progress?course='+course.subject_id} data-course={course.subject_id}><span className="ds-course-dot"/><div><strong>{course.short}</strong><small>Confidence: {value.confidence}</small><small>Objective coverage: {value.objectiveTopics}/{value.totalTopics} topics</small></div><span className="ds-readiness-value">{value.index===null?'Not enough evidence':<><b>{value.index}</b><small>/ 100 index</small></>}</span></Link>;})}</div>}<Link className="ds-dash-footer" to="/progress">Explore readiness & gaps <ShellIcon name="arrow" size={16}/></Link></section>
    {children}
    <section className="ds-dash-panel ds-dash-mastery"><h2><ShellIcon name="progress"/>Learning Mastery</h2><p className="ds-dash-caption">Normal practice evidence · separate from exam readiness</p>{!result?<p role="status">{message}</p>:<div className="ds-mastery-list">{courses.map(course=>{const value=result.courses.find(c=>c.id===course.subject_id)!;return <Link to={'/progress?course='+course.subject_id} key={course.subject_id} data-course={course.subject_id}><span>{course.short}</span><div><strong>{value.index===null?'Not enough evidence':`${value.index} / 100 evidence index`}</strong><small>{value.covered}/{value.total} skills covered · Confidence: {value.confidence}</small></div><ShellIcon name="arrow" size={16}/></Link>;})}</div>}<p className="ds-dash-caption">Missing evidence stays unknown. Visits and open answers do not establish correctness.</p></section>
  </>;
}
