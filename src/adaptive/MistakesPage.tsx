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
import './adaptive.css';
export function answerText(answer:Answer,mistake:Mistake){
 if(answer.kind!=='choice')return answer.value;
 const task=mistake.exercise.task;
 if(task.kind==='ip-fixed'||task.kind==='java-output')return answer.value.map(id=>task.options.find(o=>o.id===id)?.output??id).join(', ');
 return answer.value.join(', ');
}
function MistakeCard({mistake:m,group}:{mistake:Mistake;group?:SkillEvidence}){
 const learning=useLearning()!;const navigate=useNavigate();const pending=useRef(false),retryId=useRef<string|null>(null);
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 const review=learning.snapshot!.data.reviews.find(r=>r.attemptId===m.attempt.attemptId);
 async function act(kind:'review'|'retry'){
  if(pending.current)return;pending.current=true;setBusy(true);setError('');const expected=learning.snapshot!.data;
  try{if(kind==='review')await learning.changeStudentData(repo=>repo.setReviewed(m.attempt.attemptId,review?.revision??0,!review?.reviewedAt,expected));
   else {retryId.current??=crypto.randomUUID();const id=retryId.current;await learning.changeStudentData(repo=>new PracticeService(repo).retry(m.attempt,id,expected));navigate(attemptPath(m.exercise,id));}
  }catch(e){setError(errorMessage(e));}finally{pending.current=false;setBusy(false);}
 }
 const topic=academicIndex.topics.find(t=>t.topic_id===m.attempt.topicId)!;
 return <article className="ds-mistake-card" aria-label={m.exercise.title}>
  <div className="ds-evidence-meta"><Link to={topicPath(topic)}>{courses.find(c=>c.subject_id===m.attempt.subjectId)!.short} · {topic.name}</Link><span>{group?.state??'Item-level evidence'}</span></div>
  <h2>{m.exercise.title}</h2><p><time dateTime={m.attempt.submission!.submittedAt}>{new Date(m.timestamp).toLocaleString()}</time></p>
  <p>{m.skill?.name??'No eligible individual-skill inference.'}</p>
  <dl className="ds-answer-pair"><div><dt>Your submitted answer</dt><dd><pre>{answerText(m.attempt.answer,m)}</pre></dd></div><div><dt>Reference answer</dt><dd><pre>{answerText(m.reference,m)}</pre></dd></div></dl>
  <p>{m.explanation?.why??m.exercise.explanation}</p>
  {m.explanation?.misconception&&<p className="ds-pattern">Matched answer pattern: <strong>{m.explanation.misconception.label}</strong></p>}
  {group&&<p>{group.recent.length} incorrect {group.recent.length===1?'submission':'submissions'} on this exact skill in the last 30 days across {group.distinctExercises} {group.distinctExercises===1?'exercise':'exercises'}. Latest: {new Date(group.latest.timestamp).toLocaleDateString()}. {group.laterSuccesses>0&&`${group.laterSuccesses} later correct submissions; history retained.`}</p>}
  <details><summary>Review the reasoning</summary><p>{m.explanation?.reasoning??m.exercise.explanation}</p><p>{m.explanation?.remember??m.exercise.rules}</p><p><Link to={attemptPath(m.exercise,m.attempt.attemptId)}>Open your saved submission</Link></p></details>
  {review?.reviewedAt&&<p>Marked reviewed {new Date(review.reviewedAt).toLocaleDateString()}. Reviewed does not mean learned.</p>}
  <div className="ds-storage-actions"><button className="ds-button" disabled={busy||learning.phase!=='ready'} onClick={()=>void act('retry')}>Retry as new attempt</button><button className="ds-button" disabled={busy||learning.phase!=='ready'} onClick={()=>void act('review')}>{review?.reviewedAt?'Undo reviewed':'Mark reviewed'}</button></div>
  {error&&<p role="alert">{error}</p>}
 </article>;
}
export function MistakesPage({topicId}:{topicId?:string}){
 const {learning,evidence,refresh}=useEvidence();const [params,setParams]=useSearchParams();const [shown,setShown]=useState(20);
 const filter={course:params.get('course')??'',topic:topicId??params.get('topic')??'',skill:params.get('skill')??'',pattern:params.get('pattern')??'',days:params.get('days')??'all',view:params.get('view')??'all'};
 const filtered=filterMistakes(evidence,filter),groups=useMemo(()=>new Map(evidence.groups.map(g=>[g.skill.id,g])),[evidence]);
 const visibleSkills=new Set(filtered.flatMap(m=>m.skill?[m.skill.id]:[]));
 const repeatedSkills=evidence.groups.filter(g=>visibleSkills.has(g.skill.id)&&g.repeatedPatterns.length).length;
 const patterns=[...new Map(evidence.mistakes.flatMap(m=>{const p=m.explanation?.misconception;return p?[[`${p.id}@${p.version}`,p.label] as const]:[];})).entries()];
 function change(key:string,value:string){setShown(20);const next=new URLSearchParams(params);if(value)next.set(key,value);else next.delete(key);if(key==='course'){next.delete('topic');next.delete('skill');}if(key==='topic')next.delete('skill');setParams(next);}
 if(!learning?.snapshot)return <>{!topicId&&<PageHeading title="Mistakes" eyebrow="YOUR PRACTICE EVIDENCE"/>}<p role="status">{learning?.message??'Student storage is not connected.'}</p></>;
 return <div className="ds-adaptive">
  {!topicId&&<PageHeading title="Mistakes" eyebrow="YOUR PRACTICE EVIDENCE"><p>Revisit specific wrong answers, notice repetition, and retry with the original history intact.</p></PageHeading>}
  {topicId&&<h2>Topic mistakes</h2>}
  <p>Only valid deterministic wrong submissions appear here. Open proofs, coding drafts, visits and flashcard reveals are not correctness evidence.</p>
  <div className="ds-mistake-filters" aria-label="Filter mistakes">
   {!topicId&&<label>Course<select value={filter.course} onChange={e=>change('course',e.target.value)}><option value="">All courses</option>{courses.map(c=><option key={c.subject_id} value={c.subject_id}>{c.short}</option>)}</select></label>}
   {!topicId&&<label>Topic<select value={filter.topic} onChange={e=>change('topic',e.target.value)}><option value="">All topics</option>{academicIndex.topics.filter(t=>!filter.course||t.subject_id===filter.course).map(t=><option key={t.topic_id} value={t.topic_id}>{t.name}</option>)}</select></label>}
   <label>Skill<select value={filter.skill} onChange={e=>change('skill',e.target.value)}><option value="">All eligible skills</option>{[...skills.values()].filter(s=>(!filter.course||s.subjectId===filter.course)&&(!filter.topic||s.topicId===filter.topic)).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
   <label>Answer pattern<select value={filter.pattern} onChange={e=>change('pattern',e.target.value)}><option value="">All patterns</option>{patterns.map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
   <label>When<select value={filter.days} onChange={e=>change('days',e.target.value)}><option value="all">All history</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></label>
   <label>View<select value={filter.view} onChange={e=>change('view',e.target.value)}>{views.map(view=><option key={view} value={view}>{({'all':'Recent first · all history','needs-review':'Needs review','repeated':'Repeated within 30 days','corrected':'Later correct evidence','reviewed':'Marked reviewed','old':'Older than 90 days'})[view]}</option>)}</select></label>
  </div>
  <div className="ds-storage-actions"><button className="ds-button" disabled={learning.phase==='busy'} onClick={refresh}>Reload saved evidence</button><Link className="ds-button" to={'/study-plan'+(filter.topic?'?topic='+encodeURIComponent(filter.topic):filter.course?'?course='+encodeURIComponent(filter.course):'')}>Open Study Path</Link></div>
  <p role="status">{filtered.length} matching mistakes · {repeatedSkills} {repeatedSkills===1?'skill':'skills'} with repeated exact answer patterns in 30 days.</p>
  {!filtered.length&&<EmptyState title={evidence.mistakes.length?'No mistakes match these filters':'No deterministic mistakes yet'}><p>{evidence.mistakes.length?'Change a filter to revisit other history.':'Submit a fixed Practice item to begin. Nothing is inferred from reading or open coding.'}</p><Link to="/practice" className="ds-text-link">Open Practice</Link></EmptyState>}
  {filtered.slice(0,shown).map(m=><MistakeCard key={m.attempt.attemptId} mistake={m} group={m.skill?groups.get(m.skill.id):undefined}/>)}
  {filtered.length>shown&&<button className="ds-button" onClick={()=>setShown(shown+20)}>Show 20 more mistakes</button>}
  {evidence.limited.length>0&&<details className="ds-historical"><summary>{evidence.limited.length} older submissions cannot be checked</summary><p>They remain saved but are not counted as mistakes because the original activity is unavailable.</p>{evidence.limited.filter(({attempt})=>(!filter.topic||attempt.topicId===filter.topic)&&(!filter.course||attempt.subjectId===filter.course)).slice(0,20).map(({attempt})=><div key={attempt.attemptId}><p>Saved answer</p><pre>{attempt.answer.kind==='choice'?attempt.answer.value.join(', '):attempt.answer.value}</pre></div>)}<p>The complete original records remain in your student backup.</p></details>}
 </div>;
}
