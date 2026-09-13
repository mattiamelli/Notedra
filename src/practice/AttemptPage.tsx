import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { LearningError, errorMessage, type Answer, type Attempt } from '../learning/contracts';
import { useLearning } from '../learning/LearningProvider';
import { PageHeading } from '../shell/PageParts';
import { attemptPath, exercisePath } from './catalog';
import {nextExercise} from './next';
import {academicIndex,topicPath} from '../academic/navigation';
import { validateResponse } from './runtime';
import { feedbackFor, PracticeService, resolveAttempt } from './service';
import { AnswerControls, ExercisePrompt, ExerciseSource, Feedback } from './ExerciseParts';
import type { PracticeExercise as Exercise } from './registered-types';
import {useI18n} from '../i18n/i18n';
export function AttemptPage() {
  const {t}=useI18n(); const {exerciseId,attemptId}=useParams();const learning=useLearning();
  if(!learning?.snapshot)return <p role="status">{learning?.message??t('data.notConnected')}</p>;
  const attempt=learning.snapshot.data.attempts.find(item=>item.attemptId===attemptId);
  if(!attempt||attempt.templateRef!==exerciseId)return <><PageHeading title={t('practice.attemptNotFound')} eyebrow={t('practice.title').toUpperCase()}><p>{t('practice.attemptNotFoundBody')}</p></PageHeading><Link to="/practice">{t('practice.return')}</Link></>;
  const resolved=resolveAttempt(attempt);
  if(resolved.status!=='AVAILABLE')return <><PageHeading title={t('practice.originalUnavailable')} eyebrow={t('practice.title').toUpperCase()}><p>{resolved.message}</p></PageHeading><h2>{t('practice.preservedAnswer')}</h2><pre>{JSON.stringify(attempt.answer,null,2)}</pre><Link to="/practice">{t('practice.return')}</Link></>;
  return <AttemptRunner key={attempt.attemptId} attempt={attempt} exercise={resolved.exercise}/>;
}
function AttemptRunner({attempt,exercise}: {attempt:Attempt;exercise:Exercise}) {
  const {t,lt}=useI18n(); const learning=useLearning()!; const navigate=useNavigate();
  const generation=useRef(learning.snapshot!.data.generation); const saved=useRef(attempt); const pending=useRef(false);const retryId=useRef<string|null>(null);
  const [answer,setAnswer]=useState<Answer>(()=>structuredClone(attempt.answer));const [busy,setBusy]=useState(false);const [message,setMessage]=useState(attempt.status==='DRAFT'?t('practice.savedDraft'):t('practice.submittedLoaded'));const [error,setError]=useState('');const [conflict,setConflict]=useState(false);
  const invalidated=conflict||generation.current!==learning.snapshot!.data.generation||(!busy&&attempt.revision!==saved.current.revision);
  const next=nextExercise(exercise,learning.snapshot!.data.attempts);
  const topic=academicIndex.topics.find(t=>t.topic_id===exercise.topicId)!;
  const submitted=attempt.status==='SUBMITTED';const editable=attempt.status==='DRAFT'&&!invalidated;
  const dirty=JSON.stringify(answer)!==JSON.stringify(saved.current.answer);
  function edit(value:Answer){setAnswer(value);setError('');setMessage(t('practice.unsaved'));}
  async function write(submit:boolean){
    if(pending.current||!editable)return;
    if(submit){const validation=validateResponse(exercise.task,answer);if(validation.status!=='VALID'){setError(validation.message);return;}}
    pending.current=true;setBusy(true);setError('');setMessage(t(submit?'practice.savingSubmission':'practice.savingDraft'));const finalAnswer=structuredClone(answer);
    try{const state=await learning.changeStudentData(repo=>{const service=new PracticeService(repo);return submit?service.submit(saved.current,finalAnswer,`ds.submit.${attempt.attemptId}`,{generation:generation.current}):service.save(saved.current,finalAnswer,{generation:generation.current});});
      saved.current=state.data.attempts.find(item=>item.attemptId===attempt.attemptId)!;setMessage(t(submit?'practice.submissionSaved':'practice.draftSaved'));
    }catch(failure){setError(errorMessage(failure));setMessage(t('practice.notSaved'));if(failure instanceof LearningError&&failure.code==='CONFLICT')setConflict(true);}
    finally{pending.current=false;setBusy(false);}
  }
  async function retry(){
    if(pending.current||invalidated)return;pending.current=true;setBusy(true);setError('');retryId.current??=crypto.randomUUID(); const id=retryId.current;
    try{await learning.changeStudentData(repo=>new PracticeService(repo).retry(attempt,id,{generation:generation.current}));navigate(attemptPath(exercise,id));}
    catch(failure){setError(errorMessage(failure));if(failure instanceof LearningError&&failure.code==='CONFLICT')setConflict(true);}
    finally{pending.current=false;setBusy(false);}
  }
  return <><Link className="ds-text-link" to="/practice">← {t('practice.catalogSaved')}</Link><PageHeading title={lt(exercise.title)} eyebrow={t(submitted?'practice.submittedEyebrow':'practice.draftEyebrow')}/><ExerciseSource exercise={exercise}/><ExercisePrompt exercise={exercise}/>
    {invalidated&&<div className="ds-storage-error" role="alert"><p>{t('practice.replacedData')}</p><pre aria-label={t('practice.unsavedRecovery')}>{answer.kind==='choice'?answer.value.join('\n'):answer.value}</pre><button className="ds-button" onClick={()=>window.location.reload()}>{t('practice.reloadSafely')}</button></div>}
    <form onSubmit={event=>{event.preventDefault();void write(true);}}><AnswerControls exercise={exercise} answer={submitted?attempt.answer:answer} onChange={edit} disabled={busy||!editable}/>
      <p role="status" className="ds-practice-save">{message}</p>{error&&<p role="alert" className="ds-storage-error">{error}</p>}
      {attempt.status==='DRAFT'&&<div className="ds-storage-actions"><button type="button" className="ds-button" disabled={busy||!editable||!dirty} onClick={()=>void write(false)}>{t('practice.saveDraft')}</button><button type="submit" className="ds-button ds-practice-primary" disabled={busy||!editable}>{t('practice.submit')}</button></div>}
    </form>
    {submitted&&!invalidated&&<><Feedback result={feedbackFor(attempt)} exercise={exercise} answer={attempt.answer}/><p>{t('practice.retryCreates')}</p><button className="ds-button" disabled={busy} onClick={()=>void retry()}>{t('practice.retry')}</button><p>{next?<Link className="ds-button" to={exercisePath(next)}>{t('practice.next',{title:lt(next.title)})}</Link>:<Link className="ds-button" to={topicPath(topic)+'/practice'}>{t('practice.more')}</Link>}</p></>}
    {attempt.status==='ABANDONED'&&<p>{t('practice.abandoned')}</p>}
    <details className="ds-storage-note"><summary>{t('practice.aboutSaved')}</summary><p>{t('practice.savedMetadata',{hints:attempt.hintsUsed===null?t('learning.noneRecorded'):attempt.hintsUsed,solution:attempt.solutionViewed===null?t('learning.noneRecorded'):t(attempt.solutionViewed?'common.yes':'common.no')})}</p></details></>;
}
