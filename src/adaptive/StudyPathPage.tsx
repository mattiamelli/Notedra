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
 return <div className="ds-adaptive"><PageHeading title="Study Path" eyebrow="CHOOSE YOUR NEXT STEP"><p>A short queue based on your saved, exact practice evidence. Every suggestion explains its reason.</p></PageHeading>
  <div className="ds-mistake-filters"><label>Available study time<select value={minutes} onChange={e=>change('minutes',e.target.value)}>{TIME_BUDGETS.map(n=><option key={n} value={n}>{n===60?'60+':n} min</option>)}</select></label><label>Course<select value={subjectId} onChange={e=>change('course',e.target.value)}><option value="">All courses</option>{courses.map(c=><option key={c.subject_id} value={c.subject_id}>{c.short}</option>)}</select></label><label>Topic<select value={topicId} onChange={e=>change('topic',e.target.value)}><option value="">All topics</option>{academicIndex.topics.filter(t=>!subjectId||t.subject_id===subjectId).map(t=><option key={t.topic_id} value={t.topic_id}>{t.name}</option>)}</select></label></div>
  <p>Time labels are broad DelftStudy estimates or authored practice durations, not completion-time predictions. The 60+ preset plans up to 60 minutes. This selection stays in the URL only.</p>
  <div className="ds-storage-actions"><button className="ds-button" disabled={learning.phase==='busy'} onClick={refresh}>Refresh study path</button><Link className="ds-text-link" to="/mistakes">Review Mistake Book →</Link></div>
  {!path.length?<EmptyState title="No evidence-based suggestions yet"><p>No eligible wrong submissions match this context. You can choose a topic or Practice item freely; reading and open work do not create a weakness profile.</p><Link className="ds-button" to="/practice">Choose Practice</Link></EmptyState>:<><p role="status">{path.length} suggested actions · about {path.reduce((n,a)=>n+a.minutes,0)} minutes.</p><ol className="ds-study-queue">{path.map(action=><li key={action.id}><article className="ds-path-card"><div className="ds-evidence-meta"><span>{courses.find(c=>c.subject_id===action.subjectId)!.short} · {action.kind}</span><span>{action.minutes} min · {action.durationSource}</span></div><h2>{action.title}</h2><p>{academicIndex.topics.find(t=>t.topic_id===action.topicId)!.name}</p><p className="ds-path-reason"><strong>Why this next step</strong><br/>{action.reason}</p><Link className="ds-button" to={action.to}>Open activity →</Link></article></li>)}</ol></>}
  <details><summary>How this path is chosen</summary><p>Recent mistakes and repeated exact patterns raise priority. Later correct answers and reviewed markers reduce urgency without removing history. Only canonical prerequisites with their own recent incorrect evidence can come first.</p><p>After three recent wrong submissions on one item, the path favors explanations or other activities. It includes at most four actions, two per skill and two of one activity type, within the selected time. Stable identifiers break ties. These are product heuristics, not scientifically validated learning scores.</p><p>No mastery, readiness or predicted exam grade is calculated. Open coding, proof self-checks and workspaces remain unscored.</p></details>
 </div>;
}
