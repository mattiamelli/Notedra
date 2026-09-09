import { Link, useSearchParams } from 'react-router';
import { academicIndex, courses } from '../academic/navigation';
import { PageHeading } from '../shell/PageParts';
import { useLearning } from '../learning/LearningProvider';
import { catalog, exercisePath, attemptPath } from './catalog';
import { resolveAttempt } from './service';
export function PracticePage() {
  const [params,setParams]=useSearchParams(); const learning=useLearning();
  const subject=params.get('subject')??'';const topic=params.get('topic')??'';
  const filtered=catalog.filter(item=>(!subject||item.subjectId===subject)&&(!topic||item.topicId===topic));
  const attempts=learning?.snapshot?.data.attempts.filter(item=>item.templateRef?.startsWith('ds.practice.'))??[];
  return <><PageHeading eyebrow="AUTHORED PRACTICE" title="Practice"><p>Six short exercises. Save your work and get deterministic feedback, one item at a time.</p></PageHeading>
    <label className="ds-practice-filter">Course<select value={subject} onChange={event=>setParams(event.target.value?{subject:event.target.value}:{})}><option value="">All courses</option>{courses.map(course=><option key={course.subject_id} value={course.subject_id}>{course.name}</option>)}</select></label>
    {topic&&<p>Topic filter active. <Link className="ds-text-link" to="/practice">Show all exercises</Link></p>}
    <section className="ds-practice-grid" aria-label="Practice exercises">{filtered.map(exercise=><article className="ds-practice-card" key={exercise.id}><p className="ds-practice-label">{courses.find(course=>course.subject_id===exercise.subjectId)!.code} · Authored practice</p><h2>{exercise.title}</h2><p>{academicIndex.topics.find(topic=>topic.topic_id===exercise.topicId)!.name}</p><Link className="ds-button" to={exercisePath(exercise)}>Open exercise<span className="sr-only">: {exercise.title}</span></Link></article>)}</section>
    {filtered.length===0&&<p role="status">No authored exercises match this filter. <Link to="/practice">Return to the six-item catalog</Link>.</p>}
    <section className="ds-section" aria-labelledby="attempts-heading"><h2 id="attempts-heading">Your attempts</h2>{!learning?.snapshot?<p role="status">{learning?.message??'Connect student storage to start and save practice.'}</p>:attempts.length===0?<p>No practice attempts yet. Opening an exercise does not create a record; choose Start when you are ready.</p>:<ul className="ds-attempt-list">{[...attempts].reverse().map(attempt=>{const resolved=resolveAttempt(attempt);return <li key={attempt.attemptId}><Link to={resolved.status==='AVAILABLE'?attemptPath(resolved.exercise,attempt.attemptId):`/practice/${encodeURIComponent(attempt.templateRef!)}/attempts/${encodeURIComponent(attempt.attemptId)}`}><span>{resolved.status==='AVAILABLE'?resolved.exercise.title:'Original exercise version unavailable'}</span><span>{attempt.status==='DRAFT'?'Resume draft':attempt.status==='SUBMITTED'?'Review submission':'View abandoned attempt'} · {new Date(attempt.createdAt).toLocaleString()}</span></Link></li>;})}</ul>}</section>
    <p className="ds-storage-note">These are authored study items, not official exam questions. Correctness is item feedback; learning mastery and exam readiness remain unassessed.</p></>;
}
