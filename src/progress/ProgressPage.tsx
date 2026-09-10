import {Link,useSearchParams} from 'react-router';
import {courses} from '../academic/navigation';
import {StudentDataPanel} from '../learning/StudentDataPanel';
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
 return <div className="progress-page"><h1>Progress</h1><p>Learning Mastery, Exam Readiness, coverage and confidence answer different questions. These are authored evidence heuristics, not validated measurements or official TU Delft grades.</p>
 <label>Course<select value={courseId} onChange={e=>setParams({course:e.target.value})}>{courses.map(c=><option key={c.subject_id} value={c.subject_id}>{c.name}</option>)}</select></label>
 {!result?<p role="status">{message}</p>:<>
 <div className="progress-grid"><MasteryCard value={result.courses.find(c=>c.id===courseId)!}/><ReadinessCard value={result.readiness.find(c=>c.courseId===courseId)!}/></div>
 <section className="progress-card"><h2>Where to focus</h2><p>Strongest recorded skills: {result.courses.find(c=>c.id===courseId)!.strongest.join('; ')||'Not enough evidence'}.</p><p>Recent mistakes to review: {result.courses.find(c=>c.id===courseId)!.review.join('; ')||'None recorded'}.</p><p>Missing learning evidence: {result.courses.find(c=>c.id===courseId)!.missing.length} skills. Unrecorded practice is not failure.</p><Link to={`/study-plan?course=${courseId}`}>Open the existing Study Path →</Link> · <Link to={`/mistakes?course=${courseId}`}>Review Mistake Book →</Link> · <Link to={`/exams/${courseId}/setup`}>Choose authored exam practice →</Link></section>
 <label>Topic<select value={selected?.id??''} onChange={e=>setParams({course:courseId,...(e.target.value?{topic:e.target.value}:{})})}><option value="">All course topics</option>{topics.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
 <section aria-label="Topic and skill evidence">{topics.filter(t=>!selected||selected.id===t.id).map(t=><article className="progress-card" key={t.id}><h2>{t.name}</h2><MasteryCard value={t}/><details open={!!selected}><summary>Skill evidence · {t.covered} / {t.total} usable</summary>{result.skills.filter(s=>s.topicId===t.id).map(s=><section key={s.id} className="progress-skill"><h3>{s.name}</h3><p>{s.index===null?'Not enough evidence':`${s.index} / 100 learning evidence index`} · Confidence: {s.confidence}</p><p>{s.observations} eligible observations · {s.distinctItems} distinct items · {s.days} UTC days · {s.recentMistakes} recent mistakes · {s.limited} unresolved records.</p><p>Last demonstrated success: {s.lastSuccess===null?'Not recorded':new Date(s.lastSuccess).toLocaleString()}.</p><details><summary>Why this skill index?</summary>{s.why.map(p=><p key={p}>{p}</p>)}</details></section>)}</details></article>)}</section>
 <details className="progress-card"><summary>Evidence policy and limitations</summary><p>Policy {POLICY_VERSION}. Recalculated locally from saved immutable records and the current clock. No mutable score is stored. Updated {new Date(result.now).toLocaleString()}.</p><p>{result.evidence.limited.length} unresolved or ineligible records are excluded. Normal practice and quick/full exams are classified from exact saved bindings. Topic exam-style links alone do not establish a different evidence class. Authored integrated/open participation is recorded only from submitted, exactly resolved exam components; temporary guide/workbench activity cannot be reconstructed.</p><p>Confidence reflects amount, distinct items, days, recency, coverage and version availability. Self-review, visits, flags, hints and time spent do not earn correctness. No trend is shown without a comparable historical window. Required open correctness stays unverified, even after broad practice.</p></details>
 </>}
 <StudentDataPanel/>
 </div>;
}
