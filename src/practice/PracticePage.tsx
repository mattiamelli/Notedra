import { Link, useSearchParams } from 'react-router';
import { academicIndex, courses } from '../academic/navigation';
import { PageHeading } from '../shell/PageParts';
import { useLearning } from '../learning/LearningProvider';
import { allExercises as catalog, exercisePath, attemptPath } from './catalog';
import { resolveAttempt } from './service';
import {useI18n} from '../i18n/i18n';
export function PracticePage() {
  const [params,setParams]=useSearchParams(); const learning=useLearning(); const {t}=useI18n();
  const subject=params.get('subject')??'';const topic=params.get('topic')??'';
  const filtered=catalog.filter(item=>(!subject||item.subjectId===subject)&&(!topic||item.topicId===topic));
  const attempts=learning?.snapshot?.data.attempts.filter(item=>item.templateRef?.startsWith('ds.practice.'))??[];
  return <><PageHeading eyebrow={t('practice.authored').toUpperCase()} title={t('practice.title')}><p>{t('practice.catalogDescription',{count:catalog.length})}</p></PageHeading>
    <p>{t('practice.automaticIntro')} <Link className="ds-text-link" to="/co">Computer Organisation</Link>, <Link className="ds-text-link" to="/rl">Reasoning & Logic</Link>, <Link className="ds-text-link" to="/ip">Introduction to Programming</Link>.</p>
    <label className="ds-practice-filter">{t('practice.course')}<select value={subject} onChange={event=>setParams(event.target.value?{subject:event.target.value}:{})}><option value="">{t('practice.allCourses')}</option>{courses.map(course=><option key={course.subject_id} value={course.subject_id}>{course.name}</option>)}</select></label>
    {topic&&<p>{t('practice.topicFilter')} <Link className="ds-text-link" to="/practice">{t('practice.showAll')}</Link></p>}
    <section className="ds-practice-grid" aria-label={t('practice.title')}>{filtered.map(exercise=><article className="ds-practice-card" key={exercise.id}><p className="ds-practice-label">{courses.find(course=>course.subject_id===exercise.subjectId)!.code} · {t('practice.authored')}</p><h2>{exercise.title}</h2><p>{academicIndex.topics.find(topic=>topic.topic_id===exercise.topicId)!.name}</p><Link className="ds-button" to={exercisePath(exercise)}>{t('practice.openExercise')}<span className="sr-only">: {exercise.title}</span></Link></article>)}</section>
    {filtered.length===0&&<p role="status">{t('practice.noMatch')} <Link to="/practice">{t('practice.returnCatalog')}</Link>.</p>}
    <section className="ds-section" aria-labelledby="attempts-heading"><h2 id="attempts-heading">{t('practice.attempts')}</h2>{!learning?.snapshot?<p role="status">{learning?.message??t('practice.connectStorage')}</p>:attempts.length===0?<p>{t('practice.noAttempts')}</p>:<ul className="ds-attempt-list">{[...attempts].reverse().map(attempt=>{const resolved=resolveAttempt(attempt);return <li key={attempt.attemptId}><Link to={resolved.status==='AVAILABLE'?attemptPath(resolved.exercise,attempt.attemptId):`/practice/${encodeURIComponent(attempt.templateRef!)}/attempts/${encodeURIComponent(attempt.attemptId)}`}><span>{resolved.status==='AVAILABLE'?resolved.exercise.title:'Original exercise version unavailable'}</span><span>{attempt.status==='DRAFT'?'Resume draft':attempt.status==='SUBMITTED'?'Review submission':'View abandoned attempt'} · {new Date(attempt.createdAt).toLocaleString()}</span></Link></li>;})}</ul>}</section>
    <p className="ds-storage-note">These are authored study items, not official exam questions. Correctness is item feedback; learning mastery and exam readiness remain unassessed.</p></>;
}
