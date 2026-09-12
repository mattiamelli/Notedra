import {useMemo} from 'react';
import {Link,useSearchParams} from 'react-router';
import {PageHeading,EmptyState} from '../shell/PageParts';
import {courses,academicIndex} from '../academic/navigation';
import {useEvidence} from './useEvidence';
import {recommend,TIME_BUDGETS} from './engine';
import './adaptive.css';
export function StudyPathPage(){
 const {learning,evidence,refresh}=useEvidence();const [params,setParams]=useSearchParams();
 const input=Number(params.get('minutes')??20),minutes=TIME_BUDGETS.some(n=>n===input)?input:20;
 const subjectId=params.get('course')??'',topicId=params.get('topic')??'';
 const path=useMemo(()=>recommend(evidence,{minutes,subjectId,topicId}),[evidence,minutes,subjectId,topicId]);
 function change(key:string,value:string){const next=new URLSearchParams(params);value?next.set(key,value):next.delete(key);if(key==='course')next.delete('topic');setParams(next);}
 if(!learning?.snapshot)return <><PageHeading title="Study Path" eyebrow="CHOOSE YOUR NEXT STEP"/><p role="status">{learning?.message??'Student storage is not connected.'}</p></>;
 return <div className="ds-adaptive"><PageHeading title="Study Path" eyebrow="CHOOSE YOUR NEXT STEP"><p>A short plan based on the practice you have saved. Every suggestion explains why it may help.</p></PageHeading>
  <div className="ds-mistake-filters"><label>Available study time<select value={minutes} onChange={e=>change('minutes',e.target.value)}>{TIME_BUDGETS.map(n=><option key={n} value={n}>{n===60?'60+':n} min</option>)}</select></label><label>Course<select value={subjectId} onChange={e=>change('course',e.target.value)}><option value="">All courses</option>{courses.map(c=><option key={c.subject_id} value={c.subject_id}>{c.short}</option>)}</select></label><label>Topic<select value={topicId} onChange={e=>change('topic',e.target.value)}><option value="">All topics</option>{academicIndex.topics.filter(t=>!subjectId||t.subject_id===subjectId).map(t=><option key={t.topic_id} value={t.topic_id}>{t.name}</option>)}</select></label></div>
  <p>Time labels are broad DelftStudy estimates or authored practice durations, not completion-time predictions. The 60+ preset plans up to 60 minutes. This selection stays in the URL only.</p>
  <div className="ds-storage-actions"><button className="ds-button" disabled={learning.phase==='busy'} onClick={refresh}>Refresh study path</button><Link className="ds-text-link" to="/mistakes">Review Mistake Book →</Link></div>
  {!path.length?<EmptyState title="No suggestions yet"><p>Complete a few graded Practice exercises to build a useful study path. You can choose any topic in the meantime.</p><Link className="ds-button" to="/practice">Start Practice</Link></EmptyState>:<><p role="status">{path.length} suggested actions · about {path.reduce((n,a)=>n+a.minutes,0)} minutes.</p><ol className="ds-study-queue">{path.map(action=><li key={action.id}><article className="ds-path-card"><div className="ds-evidence-meta"><span>{courses.find(c=>c.subject_id===action.subjectId)!.short} · {action.kind}</span><span>{action.minutes} min · {action.durationSource}</span></div><h2>{action.title}</h2><p>{academicIndex.topics.find(t=>t.topic_id===action.topicId)!.name}</p><p className="ds-path-reason"><strong>Why this next step</strong><br/>{action.reason}</p><Link className="ds-button" to={action.to}>Open activity →</Link></article></li>)}</ol></>}
  <details><summary>How this path is chosen</summary><p>Recent and repeated mistakes raise priority. Later correct answers and reviewed items reduce urgency without erasing your history. A prerequisite appears first only when your own recent practice shows it needs attention.</p><p>After several mistakes on one activity, the path favors an explanation or a different way to practice. It balances up to four actions within your selected time. These suggestions are study guidance, not a grade.</p><details><summary>Technical details</summary><p>Stable internal identifiers resolve ties. Open coding, proof self-checks and workspaces remain unscored, and this path does not calculate mastery, readiness or a predicted exam grade.</p></details></details>
 </div>;
}
