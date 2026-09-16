import { Link, useSearchParams } from 'react-router';
import { academicIndex, courses } from '../academic/navigation';
import { PageHeading } from '../shell/PageParts';
import { useLearning } from '../learning/LearningProvider';
import { allExercises as catalog, exercisePath, attemptPath } from './catalog';
import { resolveAttempt } from './service';
import {difficultyCategories,difficultyCategory,type DifficultyCategory} from './difficulty';
import {useI18n} from '../i18n/i18n';
export function PracticePage() {
  const [params,setParams]=useSearchParams(); const learning=useLearning(); const {t,lt,language}=useI18n();
  const subject=params.get('subject')??'';const topic=params.get('topic')??'';const requestedDifficulty=params.get('difficulty');
  const difficulty=difficultyCategories.includes(requestedDifficulty as DifficultyCategory)?requestedDifficulty as DifficultyCategory:'';
  const updateFilter=(key:'subject'|'difficulty',value:string)=>{const next=new URLSearchParams(params);if(value)next.set(key,value);else next.delete(key);if(key==='subject')next.delete('topic');setParams(next);};
  const filtered=catalog.filter(item=>(!subject||item.subjectId===subject)&&(!topic||item.topicId===topic)&&(!difficulty||difficultyCategory(item)===difficulty));
  const attempts=learning?.snapshot?.data.attempts.filter(item=>item.templateRef?.startsWith('ds.practice.'))??[];
  return <><PageHeading eyebrow={t('practice.authored').toUpperCase()} title={t('practice.title')}><p>{t('practice.catalogDescription',{count:filtered.length})}</p></PageHeading>
    <p>{t('practice.automaticIntro')} {courses.map((course,index)=><span key={course.subject_id}>{index>0?', ':''}<Link className="ds-text-link" to={course.path}>{course.publicName}</Link></span>)}.</p>
    <div className="ds-practice-filters" aria-label={t('practice.filters')}>
      <label className="ds-practice-filter">{t('practice.course')}<select value={subject} onChange={event=>updateFilter('subject',event.target.value)}><option value="">{t('practice.allCourses')}</option>{courses.map(course=><option key={course.subject_id} value={course.subject_id}>{course.name}</option>)}</select></label>
      <label className="ds-practice-filter">{t('practice.difficulty')}<select value={difficulty} onChange={event=>updateFilter('difficulty',event.target.value)}><option value="">{t('practice.allDifficulties')}</option>{difficultyCategories.map(value=><option key={value} value={value}>{t(`practice.difficulty.${value}`)}</option>)}</select></label>
    </div>
    {topic&&<p>{t('practice.topicFilter')} <Link className="ds-text-link" to="/practice">{t('practice.showAll')}</Link></p>}
    <section className="ds-practice-grid" aria-label={t('practice.title')}>{filtered.map(exercise=><article className="ds-practice-card" key={exercise.id}><p className="ds-practice-label">{courses.find(course=>course.subject_id===exercise.subjectId)!.compactName} · {t('practice.authored')}</p><h2>{lt(exercise.title)}</h2><p>{academicIndex.topics.find(topic=>topic.topic_id===exercise.topicId)!.name}</p><Link className="ds-button" to={exercisePath(exercise)}>{t('practice.openExercise')}<span className="sr-only">: {lt(exercise.title)}</span></Link></article>)}</section>
    {filtered.length===0&&<div className="ds-practice-empty" role="status"><strong>{t('practice.noMatch')}</strong><p>{t('practice.noMatchHint')}</p><Link className="ds-text-link" to="/practice">{t('practice.returnCatalog')}</Link></div>}
    <section className="ds-section" aria-labelledby="attempts-heading"><h2 id="attempts-heading">{t('practice.attempts')}</h2>{!learning?.snapshot?<p role="status">{learning?.message??t('practice.connectStorage')}</p>:attempts.length===0?<p>{t('practice.noAttempts')}</p>:<ul className="ds-attempt-list">{[...attempts].reverse().map(attempt=>{const resolved=resolveAttempt(attempt);return <li key={attempt.attemptId}><Link to={resolved.status==='AVAILABLE'?attemptPath(resolved.exercise,attempt.attemptId):`/practice/${encodeURIComponent(attempt.templateRef!)}/attempts/${encodeURIComponent(attempt.attemptId)}`}><span>{resolved.status==='AVAILABLE'?lt(resolved.exercise.title):t('practice.originalUnavailable')}</span><span>{attempt.status==='DRAFT'?t('practice.resumeDraft'):attempt.status==='SUBMITTED'?t('practice.reviewSubmission'):t('practice.viewAbandoned')} · {new Date(attempt.createdAt).toLocaleString(language)}</span></Link></li>;})}</ul>}</section>
    <p className="ds-storage-note">{t('practice.catalogNote')}</p></>;
}
