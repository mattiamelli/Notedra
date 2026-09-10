import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { LearningError, errorMessage, type Answer, type Attempt } from '../learning/contracts';
import { useLearning } from '../learning/LearningProvider';
import { PageHeading } from '../shell/PageParts';
import { attemptPath } from './catalog';
import { validateResponse } from './runtime';
import { feedbackFor, PracticeService, resolveAttempt } from './service';
import { AnswerControls, ExercisePrompt, ExerciseSource, Feedback } from './ExerciseParts';
import type { PracticeExercise as Exercise } from './registered-types';
export function AttemptPage() {
  const {exerciseId,attemptId}=useParams();const learning=useLearning();
  if(!learning?.snapshot)return <p role="status">{learning?.message??'Student storage is not connected.'}</p>;
  const attempt=learning.snapshot.data.attempts.find(item=>item.attemptId===attemptId);
  if(!attempt||attempt.templateRef!==exerciseId)return <><PageHeading title="Attempt not found" eyebrow="PRACTICE"><p>This saved attempt does not belong to this exercise or browser dataset.</p></PageHeading><Link to="/practice">Return to Practice</Link></>;
  const resolved=resolveAttempt(attempt);
  if(resolved.status!=='AVAILABLE')return <><PageHeading title="Original exercise version unavailable" eyebrow="PRACTICE"><p>{resolved.message}</p></PageHeading><h2>Preserved answer</h2><pre>{JSON.stringify(attempt.answer,null,2)}</pre><Link to="/practice">Return to Practice</Link></>;
  return <AttemptRunner key={attempt.attemptId} attempt={attempt} exercise={resolved.exercise}/>;
}
function AttemptRunner({attempt,exercise}: {attempt:Attempt;exercise:Exercise}) {
  const learning=useLearning()!; const navigate=useNavigate();
  const generation=useRef(learning.snapshot!.data.generation); const saved=useRef(attempt); const pending=useRef(false);const retryId=useRef<string|null>(null);
  const [answer,setAnswer]=useState<Answer>(()=>structuredClone(attempt.answer));const [busy,setBusy]=useState(false);const [message,setMessage]=useState(attempt.status==='DRAFT'?'Draft loaded from this browser.':'Submitted answer loaded.');const [error,setError]=useState('');const [conflict,setConflict]=useState(false);
  const invalidated=conflict||generation.current!==learning.snapshot!.data.generation||(!busy&&attempt.revision!==saved.current.revision);
  const submitted=attempt.status==='SUBMITTED';const editable=attempt.status==='DRAFT'&&!invalidated;
  const dirty=JSON.stringify(answer)!==JSON.stringify(saved.current.answer);
  function edit(value:Answer){setAnswer(value);setError('');setMessage('Unsaved changes — save your draft before leaving.');}
  async function write(submit:boolean){
    if(pending.current||!editable)return;
    if(submit){const validation=validateResponse(exercise.task,answer);if(validation.status!=='VALID'){setError(validation.message);return;}}
    pending.current=true;setBusy(true);setError('');setMessage(submit?'Saving submission…':'Saving draft…');const finalAnswer=structuredClone(answer);
    try{const state=await learning.changeStudentData(repo=>{const service=new PracticeService(repo);return submit?service.submit(saved.current,finalAnswer,`ds.submit.${attempt.attemptId}`,{generation:generation.current}):service.save(saved.current,finalAnswer,{generation:generation.current});});
      saved.current=state.data.attempts.find(item=>item.attemptId===attempt.attemptId)!;setMessage(submit?'Submission saved in this browser.':'Draft saved in this browser.');
    }catch(failure){setError(errorMessage(failure));setMessage('Not saved. Your answer remains in the form.');if(failure instanceof LearningError&&failure.code==='CONFLICT')setConflict(true);}
    finally{pending.current=false;setBusy(false);}
  }
  async function retry(){
    if(pending.current||invalidated)return;pending.current=true;setBusy(true);setError('');retryId.current??=crypto.randomUUID(); const id=retryId.current;
    try{await learning.changeStudentData(repo=>new PracticeService(repo).retry(attempt,id,{generation:generation.current}));navigate(attemptPath(exercise,id));}
    catch(failure){setError(errorMessage(failure));if(failure instanceof LearningError&&failure.code==='CONFLICT')setConflict(true);}
    finally{pending.current=false;setBusy(false);}
  }
  return <><Link className="ds-text-link" to="/practice">← Practice catalog and saved attempts</Link><PageHeading title={exercise.title} eyebrow={submitted?'SUBMITTED PRACTICE':'PRACTICE DRAFT'}/><ExerciseSource exercise={exercise}/><ExercisePrompt exercise={exercise}/>
    {invalidated&&<div className="ds-storage-error" role="alert"><p>Saved data changed or was restored. This form cannot write to the replacement dataset. Copy any unsaved answer you need, then reload safely.</p><pre aria-label="Unsaved answer for recovery">{answer.kind==='choice'?answer.value.join('\n'):answer.value}</pre><button className="ds-button" onClick={()=>window.location.reload()}>Reload practice safely</button></div>}
    <form onSubmit={event=>{event.preventDefault();void write(true);}}><AnswerControls exercise={exercise} answer={submitted?attempt.answer:answer} onChange={edit} disabled={busy||!editable}/>
      <p role="status" className="ds-practice-save">{message}</p>{error&&<p role="alert" className="ds-storage-error">{error}</p>}
      {attempt.status==='DRAFT'&&<div className="ds-storage-actions"><button type="button" className="ds-button" disabled={busy||!editable||!dirty} onClick={()=>void write(false)}>Save draft</button><button type="submit" className="ds-button ds-practice-primary" disabled={busy||!editable}>Submit answer</button></div>}
    </form>
    {submitted&&!invalidated&&<><Feedback result={feedbackFor(attempt)} exercise={exercise} answer={attempt.answer}/><p>Retrying creates a new attempt on familiar content. This submitted answer stays unchanged.</p><button className="ds-button" disabled={busy} onClick={()=>void retry()}>Retry as new attempt</button></>}
    {attempt.status==='ABANDONED'&&<p>This attempt was abandoned. Its saved answer is preserved.</p>}
    <p className="ds-storage-note">Attempt {attempt.attemptId} · Revision {attempt.revision}. Hint use: {attempt.hintsUsed===null?'unknown':attempt.hintsUsed}. Prior solution exposure: {attempt.solutionViewed===null?'unknown':attempt.solutionViewed?'recorded':'not recorded'}. Learning evidence summaries are available in Progress.</p></>;
}
