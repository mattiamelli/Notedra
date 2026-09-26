import {ExerciseListRow} from './ExerciseListRow';
import { Link, useSearchParams } from 'react-router';
import { academicIndex, courses } from '../academic/navigation';
import { PageHeading } from '../shell/PageParts';
import { useLearning } from '../learning/LearningProvider';
import { allExercises as catalog, attemptPath } from './catalog';
import { resolveAttempt } from './service';
import {difficultyCategories,difficultyCategory,type DifficultyCategory} from './difficulty';
import {useI18n} from '../i18n/i18n';
const PAGE_SIZE=48;
const courseById=new Map(courses.map(course=>[course.subject_id,course]));
const topicById=new Map(academicIndex.topics.map(topic=>[topic.topic_id,topic]));
const searchable=(value:string)=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function PracticePage() {
  const [params,setParams]=useSearchParams(); const learning=useLearning(); const {t,lt,language}=useI18n();
  const subject=params.get('subject')??'';const topic=params.get('topic')??'';const requestedDifficulty=params.get('difficulty');
  const difficulty=difficultyCategories.includes(requestedDifficulty as DifficultyCategory)?requestedDifficulty as DifficultyCategory:'';
  const query=params.get('q')??'';
  const words=searchable(query).trim().split(/\s+/).filter(Boolean);
  const updateFilter=(key:'subject'|'difficulty'|'q',value:string)=>{const next=new URLSearchParams(params);if(value)next.set(key,value);else next.delete(key);if(key==='subject')next.delete('topic');next.delete('page');setParams(next,{replace:key==='q'});};
  const filtered=catalog.filter(item=>{
    if((subject&&item.subjectId!==subject)||(topic&&item.topicId!==topic)||(difficulty&&difficultyCategory(item)!==difficulty))return false;
    if(!words.length)return true;
    const course=courseById.get(item.subjectId),topicInfo=topicById.get(item.topicId);
    const text=searchable([item.id,item.title,lt(item.title),item.prompt,lt(item.prompt),item.skillId,course?.name,course?.code,course?.compactName,topicInfo?.name].join(' '));
    return words.every(word=>text.includes(word));
  });
  const pageCount=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));
  const requestedPage=Number(params.get('page')??'1');
  const page=Number.isSafeInteger(requestedPage)&&requestedPage>0?Math.min(requestedPage,pageCount):1;
  const offset=(page-1)*PAGE_SIZE;
  const visible=filtered.slice(offset,offset+PAGE_SIZE);
  const changePage=(value:number)=>{const next=new URLSearchParams(params);if(value===1)next.delete('page');else next.set('page',String(value));setParams(next);};
  const attempts=learning?.snapshot?.data.attempts.filter(item=>item.templateRef&&item.exercise)??[];
  return <><PageHeading eyebrow={t('practice.authored').toUpperCase()} title={t('practice.title')}><p>{t('practice.catalogDescription',{count:filtered.length})}</p></PageHeading>
    <p>{t('practice.automaticIntro')} {courses.map((course,index)=><span key={course.subject_id}>{index>0?', ':''}<Link className="ds-text-link" to={course.path}>{course.publicName}</Link></span>)}.</p>
    <div className="ds-practice-filters" aria-label={t('practice.filters')}>
      <label className="ds-practice-filter ds-practice-answer" style={{gridColumn:'1 / -1',minWidth:0}}>Search exercises<input type="search" value={query} maxLength={200} onChange={event=>updateFilter('q',event.target.value)} aria-controls="practice-results"/></label>
      <label className="ds-practice-filter">{t('practice.course')}<select value={subject} onChange={event=>updateFilter('subject',event.target.value)}><option value="">{t('practice.allCourses')}</option>{courses.map(course=><option key={course.subject_id} value={course.subject_id}>{course.name}</option>)}</select></label>
      <label className="ds-practice-filter">{t('practice.difficulty')}<select value={difficulty} onChange={event=>updateFilter('difficulty',event.target.value)}><option value="">{t('practice.allDifficulties')}</option>{difficultyCategories.map(value=><option key={value} value={value}>{t(`practice.difficulty.${value}`)}</option>)}</select></label>
    </div>
    {topic&&<p>{t('practice.topicFilter')} <Link className="ds-text-link" to="/practice">{t('practice.showAll')}</Link></p>}
    <p id="practice-results-count" aria-live="polite" aria-atomic="true">{filtered.length?`Showing ${offset+1}-${offset+visible.length} of ${filtered.length} exercises`:'0 exercises'}</p>
    <section id="practice-results" className="ds-exercise-list" aria-label={t('practice.title')} aria-describedby="practice-results-count">{visible.map(exercise=><ExerciseListRow key={exercise.id} exercise={exercise} attempts={attempts} showTopic headingLevel={2}/>)}</section>
    {filtered.length>0&&<nav className="ds-storage-actions" aria-label="Exercise pages"><button type="button" className="ds-button" aria-label="Previous page" disabled={page===1} onClick={()=>changePage(page-1)}>Previous</button><span>Page {page} of {pageCount}</span><button type="button" className="ds-button" aria-label="Next page" disabled={page===pageCount} onClick={()=>changePage(page+1)}>Next</button></nav>}
    {filtered.length===0&&<div className="ds-practice-empty" role="status"><strong>{t('practice.noMatch')}</strong><p>{t('practice.noMatchHint')}</p><Link className="ds-text-link" to="/practice">{t('practice.returnCatalog')}</Link></div>}
    <section className="ds-section" aria-labelledby="attempts-heading"><h2 id="attempts-heading">{t('practice.attempts')}</h2>{!learning?.snapshot?<p role="status">{learning?.message??t('practice.connectStorage')}</p>:attempts.length===0?<p>{t('practice.noAttempts')}</p>:<ul className="ds-attempt-list">{[...attempts].reverse().map(attempt=>{const resolved=resolveAttempt(attempt);return <li key={attempt.attemptId}><Link to={resolved.status==='AVAILABLE'?attemptPath(resolved.exercise,attempt.attemptId):`/practice/${encodeURIComponent(attempt.templateRef!)}/attempts/${encodeURIComponent(attempt.attemptId)}`}><span>{resolved.status==='AVAILABLE'?lt(resolved.exercise.title):t('practice.originalUnavailable')}</span><span>{attempt.status==='DRAFT'?t('practice.resumeDraft'):attempt.status==='SUBMITTED'?t('practice.reviewSubmission'):t('practice.viewAbandoned')} · {new Date(attempt.createdAt).toLocaleString(language)}</span></Link></li>;})}</ul>}</section>
    <p className="ds-storage-note">{t('practice.catalogNote')}</p></>;
}
