import {lazy,Suspense,useEffect,useRef,useState} from 'react';
import {Link,useNavigate,useSearchParams} from 'react-router';
import {courses} from '../academic/navigation';
import {useLearning} from '../learning/LearningProvider';
import {errorMessage} from '../learning/contracts';
import {AnswerControls,ExercisePrompt} from '../practice/ExerciseParts';
import {practiceFor} from './evaluation';
import {resolveSession,summary,timing} from './engine';
import {answered} from './records';
import {useExamDraft} from './useExamDraft';
import {ExamDialog} from './ExamDialog';
import type {ExamBank,ExamSession} from './types';
import {track} from '../analytics/analytics';
import {durationBucket} from '../analytics/events';
const OpenAnswer=lazy(()=>import('./ExamOpenAnswer'));
export function ExamSessionPage({session,bank}:{session:ExamSession;bank:ExamBank}){
 const learning=useLearning()!,navigate=useNavigate(),[params,setParams]=useSearchParams();
 const state=useExamDraft(session),[now,setNow]=useState(Date.now()),[dialog,setDialog]=useState<'submit'|'abandon'|null>(null),[busy,setBusy]=useState(false),[failure,setFailure]=useState('');
 const lock=useRef(false),heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{const id=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(id);},[]);
 const resolved=resolveSession(session,bank);
 if(resolved.status!=='AVAILABLE')return <><h1>Historical content unavailable</h1><p>{resolved.message}</p><Link to="/progress">Export student data</Link></>;
 if(session.status!=='IN_PROGRESS')return <><h1>This exam is {session.status==='SUBMITTED'?'submitted':'abandoned'}</h1><p>Its responses are locked.</p><Link className="ds-button" to={`/exams/review/${session.sessionId}`}>Open saved review</Link></>;
 const raw=Number(params.get('q')??1),index=Number.isInteger(raw)&&raw>=1&&raw<=session.items.length?raw-1:0,item=resolved.items[index];
 const answer=state.draft.responses.find(r=>r.itemId===item.id)!.answer,fixed=practiceFor(item),clock=timing(session,now),counts=summary(state.draft);
 const disabled=clock.expired||busy||!!state.error;
 function go(i:number){setParams({q:String(i+1)});requestAnimationFrame(()=>heading.current?.focus());}
 async function confirm(){if(lock.current)return;lock.current=true;setBusy(true);setFailure('');try{
   const saved=state.saved.current;
   await learning.changeStudentData(repo=>dialog==='abandon'?repo.abandonExam(saved.sessionId,saved.revision,{generation:state.generation.current}):repo.submitExam(saved,'exam-submit:'+saved.sessionId,bank,{generation:state.generation.current}));
   if(dialog==='submit')track('exam_completed',{course_id:saved.course,activity_type:saved.mode==='quick'?'quick_exam':'full_mock',duration_bucket:durationBucket((Date.now()-Date.parse(saved.startedAt))/60000),completion_status:'completed',source_surface:'exam'});
   navigate(`/exams/review/${session.sessionId}`,{replace:true});
  }catch(e){setFailure(errorMessage(e));}finally{lock.current=false;setBusy(false);}}
 const remaining=Math.ceil(clock.remainingMs/1000),timeText=`${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,'0')}`;
 return <div className="exam-page"><div className="exam-toolbar"><div><Link to="/exams">← Mock Exams</Link><h1>{resolved.blueprint.title}</h1><p>Authored exam-style practice · {courses.find(c=>c.subject_id===session.course)?.name} · Version {session.blueprint.version}</p></div><div className="exam-timer"><span>Time remaining</span><strong role="timer" aria-label={`Time remaining ${timeText}`}>{timeText}</strong><small>Deadline {new Date(session.deadlineAt).toLocaleTimeString()}</small></div></div>
  {clock.expired&&<p className="ds-storage-error" role="status">Time expired. Editing is frozen; saved responses are preserved. Confirm submission to finish.</p>}
  <p role="status" className="exam-save">{state.error?`Not saved: ${state.error}`:state.pending?'Saving responses…':'Saved in this browser.'} {state.error&&<button className="ds-button" onClick={()=>window.location.reload()}>Discard unsaved edits and reload</button>}</p>
  <nav className="exam-jump" aria-label="Exam question navigation">{resolved.items.map((i,n)=>{const done=answered(state.draft.responses[n].answer),flag=state.draft.flagged.includes(i.id);return <button key={i.id} aria-current={n===index?'step':undefined} aria-label={`Question ${n+1}, ${done?'answered':'unanswered'}${flag?', flagged':''}`} className={`${done?'answered':''} ${flag?'flagged':''}`} onClick={()=>go(n)}>{n+1}{flag?' ⚑':done?' ✓':''}</button>;})}</nav>
  <div className="exam-actions"><button className="ds-button" onClick={()=>{const n=resolved.items.findIndex((i,n)=>n>index&&state.draft.flagged.includes(i.id));go(n>=0?n:Math.max(0,resolved.items.findIndex(i=>state.draft.flagged.includes(i.id))));}} disabled={!counts.flagged}>Next flagged</button><button className="ds-button" onClick={()=>{const n=state.draft.responses.findIndex((r,n)=>n>index&&!answered(r.answer));go(n>=0?n:Math.max(0,state.draft.responses.findIndex(r=>!answered(r.answer))));}} disabled={!counts.unanswered}>Next unanswered</button><span>{counts.answered} answered · {counts.unanswered} unanswered · {counts.flagged} flagged</span></div>
  <article className="exam-card"><div className="exam-toolbar"><div><p className="ds-practice-label">Component {index+1} / {session.items.length} · {item.difficulty} (authored) · {item.weight} {item.evaluation==='RUBRIC'?'rubric weight, unscored':'objective points'}</p><h2 tabIndex={-1} ref={heading}>{item.title}</h2></div><button className="ds-button" aria-pressed={state.draft.flagged.includes(item.id)} disabled={disabled} onClick={()=>state.flag(item.id)}>{state.draft.flagged.includes(item.id)?'Unflag question':'Flag for review'}</button></div>
   {item.context&&<details open><summary>Shared programming specification</summary><p>{item.context}</p></details>}
   {fixed?<><ExercisePrompt exercise={fixed} mode="exam"/><AnswerControls exercise={fixed} answer={answer} disabled={disabled} onChange={a=>state.answer(item.id,a)}/></>:<><p className="exam-prompt">{item.prompt}</p><Suspense fallback={<p>Loading open response…</p>}><OpenAnswer item={item} answer={answer} disabled={disabled} onChange={a=>state.answer(item.id,a)}/></Suspense></>}
   <p className="exam-muted">{item.difficultyReason} Reference answers become available after submission.</p>
  </article>
  <div className="exam-actions"><button className="ds-button" onClick={()=>go(index-1)} disabled={index===0}>Previous question</button><button className="ds-button" onClick={()=>go(index+1)} disabled={index===resolved.items.length-1}>Next question</button><button className="ds-button ds-button-primary" disabled={state.pending>0||!!state.error||busy} onClick={()=>setDialog('submit')}>Finish and submit</button><button className="ds-button" disabled={state.pending>0||busy||!!state.error} onClick={()=>setDialog('abandon')}>Abandon exam</button></div>
  <p className="exam-muted">No answer is evaluated before submission. Local saves can be lost if browser data is deleted or the device fails; export backups from Student Data.</p>
  {dialog&&<ExamDialog title={dialog==='submit'?'Submit this exam?':'Abandon this exam?'} label={dialog==='submit'?'Confirm submission':'Confirm abandon'} busy={busy} onCancel={()=>{setDialog(null);setFailure('');}} onConfirm={()=>void confirm()}><p>{counts.answered} answered · {counts.unanswered} unanswered · {counts.open} open/rubric components · {counts.flagged} flagged.</p><p>{dialog==='submit'?'Saved answers will be locked. Unanswered questions remain explicitly unanswered; open work receives no automatic score.':'Saved responses will be retained and locked without evaluation. You can start a new exam later.'}</p>{failure&&<p role="alert">{failure}</p>}</ExamDialog>}
 </div>;
}
