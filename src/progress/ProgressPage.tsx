import {Link,useSearchParams} from 'react-router';
import {courses} from '../academic/navigation';
import {useProgress} from './useProgress';
import {MasteryCard,ReadinessCard} from './IndexCard';
import {POLICY_VERSION} from './mastery';
import './progress.css';
export function ProgressPage(){
 const {result,message}=useProgress(),[params,setParams]=useSearchParams();
 const course=courses.find(c=>c.subject_id===params.get('course'))??courses[0];
 const courseId=course.subject_id,topicId=params.get('topic');
 const topics=result?.topics.filter(t=>result.skills.some(s=>s.topicId===t.id&&s.courseId===courseId))??[];
 const selected=topics.find(t=>t.id===topicId);
 return <div className="progress-page"><h1>Progress</h1><p>See how your regular practice and exam practice are developing. These estimates are study guidance, not official TU Delft grades.</p>
 <label>Course<select value={courseId} onChange={e=>setParams({course:e.target.value})}>{courses.map(c=><option key={c.subject_id} value={c.subject_id}>{c.name}</option>)}</select></label>
 {!result?<p role="status">{message}</p>:<>
 <div className="progress-grid"><MasteryCard value={result.courses.find(c=>c.id===courseId)!}/><ReadinessCard value={result.readiness.find(c=>c.courseId===courseId)!}/></div>
 <section className="progress-card"><h2>What to do next</h2><p>Strongest recorded skills: {result.courses.find(c=>c.id===courseId)!.strongest.join('; ')||'Not enough practice yet'}.</p><p>Recent mistakes to review: {result.courses.find(c=>c.id===courseId)!.review.join('; ')||'None recorded'}.</p><p>{result.courses.find(c=>c.id===courseId)!.missing.length} skills do not yet have enough reliable practice. This does not mean you performed poorly.</p><Link to={`/study-plan?course=${courseId}`}>Open Study Path →</Link> · <Link to={`/mistakes?course=${courseId}`}>Review mistakes →</Link> · <Link to={`/exams/${courseId}/setup`}>Take a mock exam →</Link></section>
 <label>Topic<select value={selected?.id??''} onChange={e=>setParams({course:courseId,...(e.target.value?{topic:e.target.value}:{})})}><option value="">All course topics</option>{topics.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
 <section aria-label="Topic and skill progress">{topics.filter(t=>!selected||selected.id===t.id).map(t=><article className="progress-card" key={t.id}><h2>{t.name}</h2><MasteryCard value={t}/><details open={!!selected}><summary>Skills with reliable practice · {t.covered} / {t.total}</summary>{result.skills.filter(s=>s.topicId===t.id).map(s=><section key={s.id} className="progress-skill"><h3>{s.name}</h3><p>{s.index===null?'Not enough practice yet':`${s.index} / 100`} · Confidence: {s.confidence}</p><p>{s.observations} completed practice records across {s.distinctItems} activities and {s.days} study days · {s.recentMistakes} recent mistakes.</p>{s.limited>0&&<p>{s.limited} saved {s.limited===1?'record is':'records are'} not included because the original activity cannot be verified.</p>}<p>Last successful practice: {s.lastSuccess===null?'Not recorded':new Date(s.lastSuccess).toLocaleString()}.</p><details><summary>How is this calculated?</summary>{s.why.map(p=><p key={p}>{p}</p>)}</details></section>)}</details></article>)}</section>
 <details className="progress-card"><summary>How is my progress calculated?</summary><p>Your progress uses recent completed practice, performance across different skills, and the amount of reliable evidence available. Missing or unverified work remains unknown.</p><details><summary>Technical details</summary><p>Policy {POLICY_VERSION}. Results are recalculated locally from saved records and the current time; no mutable score is stored. Updated {new Date(result.now).toLocaleString()}.</p><p>{result.evidence.limited.length} unresolved or ineligible records are excluded. Practice and exams retain their saved activity and version bindings. Submitted open work can show participation while correctness remains unverified.</p><p>Confidence reflects amount, breadth, study days, recency, coverage and version availability. Self-review, visits, flags, hints and time spent do not establish correctness. Trends require a comparable historical window.</p></details></details>
 </>}
 </div>;
}
