import {useMemo,useRef,useState} from 'react';
import {Link,useNavigate,useSearchParams} from 'react-router';
import {courses,academicIndex,topicPath} from '../academic/navigation';
import {PageHeading,EmptyState} from '../shell/PageParts';
import {PracticeService} from '../practice/service';
import {attemptPath} from '../practice/catalog';
import {errorMessage,type Answer} from '../learning/contracts';
import {useLearning} from '../learning/LearningProvider';
import {useEvidence} from './useEvidence';
import {filterMistakes,views} from './filters';
import {skills,type Mistake,type SkillEvidence} from './evidence';
import {selectReviewNow,type ReviewNowReason} from './review-queue';
import './adaptive.css';
import {useI18n} from '../i18n/i18n';
import {track} from '../analytics/analytics';
import {useTrackOnce} from '../analytics/react';
export function answerText(answer:Answer,mistake:Mistake){
 if(answer.kind!=='choice')return answer.value;
 const task=mistake.exercise.task;
 if(task.kind==='ip-fixed'||task.kind==='java-output')return answer.value.map(id=>task.options.find(o=>o.id===id)?.output??id).join(', ');
 return answer.value.join(', ');
}
const reviewReasonKey:Record<ReviewNowReason,'mistakes.reasonRepeatedPattern'|'mistakes.reasonRepeatedSkill'|'mistakes.reasonUnreviewed'>={'repeated-pattern':'mistakes.reasonRepeatedPattern','repeated-skill':'mistakes.reasonRepeatedSkill',unreviewed:'mistakes.reasonUnreviewed'};
function MistakeCard({mistake:m,group,reason}:{mistake:Mistake;group?:SkillEvidence;reason?:ReviewNowReason}){
 const learning=useLearning()!;const navigate=useNavigate();const {t,lt,language}=useI18n();const pending=useRef(false),retryId=useRef<string|null>(null);
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 const review=learning.snapshot!.data.reviews.find(r=>r.attemptId===m.attempt.attemptId);
 async function act(kind:'review'|'retry'){
  if(pending.current)return;pending.current=true;setBusy(true);setError('');const expected=learning.snapshot!.data;
  try{if(kind==='review')await learning.changeStudentData(repo=>repo.setReviewed(m.attempt.attemptId,review?.revision??0,!review?.reviewedAt,expected));
   else {retryId.current??=crypto.randomUUID();const id=retryId.current;await learning.changeStudentData(repo=>new PracticeService(repo).retry(m.attempt,id,expected));track('review_started',{course_id:m.attempt.subjectId,topic_id:m.attempt.topicId,activity_type:'practice',source_surface:'mistake_book'});navigate(attemptPath(m.exercise,id));}
  }catch(e){setError(errorMessage(e));}finally{pending.current=false;setBusy(false);}
 }
 const topic=academicIndex.topics.find(t=>t.topic_id===m.attempt.topicId)!;
 if(reason)return <article className="ds-review-now-card" aria-label={lt(m.exercise.title)}>
  <div className="ds-evidence-meta"><Link to={topicPath(topic)}>{courses.find(c=>c.subject_id===m.attempt.subjectId)!.compactName} · {topic.name}</Link><span>{m.skill?lt(m.skill.name):t('mistakes.itemEvidence')}</span></div>
  <h3>{lt(m.exercise.title)}</h3><p>{t(reviewReasonKey[reason])}</p>
  <div className="ds-storage-actions"><button className="ds-button ds-practice-primary" disabled={busy||learning.phase!=='ready'} onClick={()=>void act('retry')}>{t('mistakes.retry')}</button><Link className="ds-text-link" to={attemptPath(m.exercise,m.attempt.attemptId)}>{t('mistakes.openSaved')}</Link></div>
  {error&&<p role="alert">{error}</p>}
 </article>;
 return <article className="ds-mistake-card" aria-label={lt(m.exercise.title)}>
  <div className="ds-evidence-meta"><Link to={topicPath(topic)}>{courses.find(c=>c.subject_id===m.attempt.subjectId)!.compactName} · {topic.name}</Link><span>{group?lt(group.state):t('mistakes.itemEvidence')}</span></div>
  <h2>{lt(m.exercise.title)}</h2><p><time dateTime={m.attempt.submission!.submittedAt}>{new Date(m.timestamp).toLocaleString(language)}</time></p>
  <p>{m.skill?lt(m.skill.name):t('mistakes.noSkill')}</p>
  <dl className="ds-answer-pair"><div><dt>{t('practice.submitted')}</dt><dd><pre>{answerText(m.attempt.answer,m)}</pre></dd></div><div><dt>{t('practice.reference')}</dt><dd><pre>{answerText(m.reference,m)}</pre></dd></div></dl>
  <p>{lt(m.explanation?.why??m.exercise.explanation)}</p>
  {m.explanation?.misconception&&<p className="ds-pattern">{t('mistakes.matchedPattern',{pattern:lt(m.explanation.misconception.label)})}</p>}
  {group&&<p>{t('mistakes.groupSummary',{count:group.recent.length,submissionLabel:t(group.recent.length===1?'mistakes.submissionOne':'mistakes.submissionMany'),exercises:group.distinctExercises,exerciseLabel:t(group.distinctExercises===1?'mistakes.exerciseOne':'mistakes.exerciseMany'),date:new Date(group.latest.timestamp).toLocaleDateString(language)})} {group.laterSuccesses>0&&t('mistakes.laterSuccess',{count:group.laterSuccesses})}</p>}
  <details><summary>{t('mistakes.reviewReasoning')}</summary><p>{lt(m.explanation?.reasoning??m.exercise.explanation)}</p><p>{lt(m.explanation?.remember??m.exercise.rules)}</p><p><Link to={attemptPath(m.exercise,m.attempt.attemptId)}>{t('mistakes.openSaved')}</Link></p></details>
  {review?.reviewedAt&&<p>{t('mistakes.marked',{date:new Date(review.reviewedAt).toLocaleDateString(language)})}</p>}
  <div className="ds-storage-actions"><button className="ds-button" disabled={busy||learning.phase!=='ready'} onClick={()=>void act('retry')}>{t('mistakes.retry')}</button><button className="ds-button" disabled={busy||learning.phase!=='ready'} onClick={()=>void act('review')}>{t(review?.reviewedAt?'mistakes.undo':'mistakes.mark')}</button></div>
  {error&&<p role="alert">{error}</p>}
 </article>;
}
export function MistakesPage({topicId}:{topicId?:string}){
 const {learning,evidence,refresh}=useEvidence();const {t,lt}=useI18n();const [params,setParams]=useSearchParams();const [shown,setShown]=useState(20);
 const filter={course:params.get('course')??'',topic:topicId??params.get('topic')??'',skill:params.get('skill')??'',pattern:params.get('pattern')??'',days:params.get('days')??'all',view:params.get('view')??'all'};
 const openedCourse=filter.course||academicIndex.topics.find(topic=>topic.topic_id===filter.topic)?.subject_id;
 useTrackOnce(`mistake-book:${topicId?'topic':'global'}`,()=>track('mistake_book_opened',{source_surface:topicId?'topic':'mistake_book',...(openedCourse?{course_id:openedCourse}:{}),...(filter.topic?{topic_id:filter.topic}:{})}));
 const filtered=filterMistakes(evidence,filter),groups=useMemo(()=>new Map(evidence.groups.map(g=>[g.skill.id,g])),[evidence]);
 const reviewNow=useMemo(()=>selectReviewNow(evidence,{topicId}),[evidence,topicId]);
 const visibleSkills=new Set(filtered.flatMap(m=>m.skill?[m.skill.id]:[]));
 const repeatedSkills=evidence.groups.filter(g=>visibleSkills.has(g.skill.id)&&g.repeatedPatterns.length).length;
 const patterns=[...new Map(evidence.mistakes.flatMap(m=>{const p=m.explanation?.misconception;return p?[[`${p.id}@${p.version}`,p.label] as const]:[];})).entries()];
 function change(key:string,value:string){setShown(20);const next=new URLSearchParams(params);if(value)next.set(key,value);else next.delete(key);if(key==='course'){next.delete('topic');next.delete('skill');}if(key==='topic')next.delete('skill');setParams(next);}
 if(!learning?.snapshot)return <>{!topicId&&<PageHeading title={t('mistakes.title')} eyebrow={t('mistakes.eyebrow').toUpperCase()}/>}<p role="status">{learning?.message??t('mistakes.storage')}</p></>;
 return <div className="ds-adaptive">
  {!topicId&&<PageHeading title={t('mistakes.title')} eyebrow={t('mistakes.eyebrow').toUpperCase()}><p>{t('mistakes.subtitle')}</p></PageHeading>}
  {topicId&&<h2>{t('mistakes.topicTitle')}</h2>}
  <p>{t('mistakes.evidenceRule')}</p>
  <section className="ds-review-now" aria-labelledby="review-now-title"><div className="ds-review-now-heading"><h2 id="review-now-title">{t('mistakes.reviewNow')}</h2><p>{t('mistakes.reviewNowBody')}</p></div>
   {reviewNow.length?<div className="ds-review-now-list">{reviewNow.map(item=><MistakeCard key={item.mistake.attempt.attemptId} mistake={item.mistake} group={item.group} reason={item.reason}/>)}</div>:<div className="ds-review-now-empty"><strong>{t('mistakes.reviewEmpty')}</strong><p>{t('mistakes.reviewEmptyBody')}</p></div>}
  </section>
  <h2 className="ds-mistake-history-title">{t('mistakes.allMistakes')}</h2>
  <div className="ds-mistake-filters" aria-label={t('mistakes.filterAria')}>
   {!topicId&&<label>{t('mistakes.course')}<select value={filter.course} onChange={e=>change('course',e.target.value)}><option value="">{t('mistakes.allCourses')}</option>{courses.map(c=><option key={c.subject_id} value={c.subject_id}>{c.publicName}</option>)}</select></label>}
   {!topicId&&<label>{t('mistakes.topic')}<select value={filter.topic} onChange={e=>change('topic',e.target.value)}><option value="">{t('mistakes.allTopics')}</option>{academicIndex.topics.filter(t=>!filter.course||t.subject_id===filter.course).map(t=><option key={t.topic_id} value={t.topic_id}>{t.name}</option>)}</select></label>}
   <label>{t('mistakes.skill')}<select value={filter.skill} onChange={e=>change('skill',e.target.value)}><option value="">{t('mistakes.allSkills')}</option>{[...skills.values()].filter(s=>(!filter.course||s.subjectId===filter.course)&&(!filter.topic||s.topicId===filter.topic)).map(s=><option key={s.id} value={s.id}>{lt(s.name)}</option>)}</select></label>
   <label>{t('mistakes.pattern')}<select value={filter.pattern} onChange={e=>change('pattern',e.target.value)}><option value="">{t('mistakes.allPatterns')}</option>{patterns.map(([id,label])=><option key={id} value={id}>{lt(label)}</option>)}</select></label>
   <label>{t('mistakes.when')}<select value={filter.days} onChange={e=>change('days',e.target.value)}><option value="all">{t('mistakes.allHistory')}</option><option value="7">{t('mistakes.lastDays',{days:7})}</option><option value="30">{t('mistakes.lastDays',{days:30})}</option><option value="90">{t('mistakes.lastDays',{days:90})}</option></select></label>
   <label>{t('mistakes.view')}<select value={filter.view} onChange={e=>change('view',e.target.value)}>{views.map(view=><option key={view} value={view}>{t(({'all':'mistakes.viewAll','needs-review':'mistakes.needsReview','repeated':'mistakes.repeated','corrected':'mistakes.corrected','reviewed':'mistakes.reviewed','old':'mistakes.old'} as const)[view])}</option>)}</select></label>
  </div>
  <div className="ds-storage-actions"><button className="ds-button" disabled={learning.phase==='busy'} onClick={refresh}>{t('mistakes.reload')}</button><Link className="ds-button" to={'/study-plan'+(filter.topic?'?topic='+encodeURIComponent(filter.topic):filter.course?'?course='+encodeURIComponent(filter.course):'')}>{t('progress.openPath')}</Link></div>
  <p role="status">{t('mistakes.summary',{count:filtered.length,label:t(filtered.length===1?'mistakes.one':'mistakes.many'),skills:repeatedSkills,skillLabel:t(repeatedSkills===1?'mistakes.skillOne':'mistakes.skillMany')})}</p>
  {!filtered.length&&<EmptyState title={t(evidence.mistakes.length?'mistakes.noMatch':'mistakes.noDeterministic')}><p>{t(evidence.mistakes.length?'mistakes.changeFilter':'mistakes.begin')}</p><Link to="/practice" className="ds-text-link">{t('mistakes.openPractice')}</Link></EmptyState>}
  {filtered.slice(0,shown).map(m=><MistakeCard key={m.attempt.attemptId} mistake={m} group={m.skill?groups.get(m.skill.id):undefined}/>)}
  {filtered.length>shown&&<button className="ds-button" onClick={()=>setShown(shown+20)}>{t('mistakes.showMore')}</button>}
  {evidence.limited.length>0&&<details className="ds-historical"><summary>{t('mistakes.older',{count:evidence.limited.length})}</summary><p>{t('mistakes.olderBody')}</p>{evidence.limited.filter(({attempt})=>(!filter.topic||attempt.topicId===filter.topic)&&(!filter.course||attempt.subjectId===filter.course)).slice(0,20).map(({attempt})=><div key={attempt.attemptId}><p>{t('mistakes.savedAnswer')}</p><pre>{attempt.answer.kind==='choice'?attempt.answer.value.join(', '):attempt.answer.value}</pre></div>)}<p>{t('mistakes.backup')}</p></details>}
 </div>;
}
