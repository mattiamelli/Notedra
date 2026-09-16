import {useEffect,useState} from 'react';
import {Link,useNavigate,useSearchParams} from 'react-router';
import {Feedback,ExercisePrompt} from '../practice/ExerciseParts';
import {courses} from '../academic/navigation';
import {displayAnswer} from '../practice/presentation';
import {gradeResponse} from '../practice/runtime';
import {useLearning} from '../learning/LearningProvider';
import {errorMessage} from '../learning/contracts';
import {practiceFor} from './evaluation';
import {resolveSession,summary} from './engine';
import type {ExamBank,ExamSession,OpenReference} from './types';
const loaders={CSE1400_CO:()=>import('./references/co.json'),CSE1300_RL:()=>import('./references/rl.json'),CSE1100_IP:()=>import('./references/ip.json')};
export function ExamReviewPage({session,bank}:{session:ExamSession;bank:ExamBank}){
 const learning=useLearning()!,navigate=useNavigate(),[params,setParams]=useSearchParams(),[references,setReferences]=useState<OpenReference[]|null>(null),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 useEffect(()=>{let active=true;void loaders[session.course]().then(m=>{if(active)setReferences(m.default);},()=>{if(active)setError('Reference content could not load. Your saved answers are preserved. Reload to retry.');});return()=>{active=false;};},[session.course]);
 const resolution=resolveSession(session,bank),counts=summary(session,learning.snapshot!.data.examReviews);
 if(session.status==='IN_PROGRESS')return <><h1>Exam still in progress</h1><Link className="ds-button" to={`/exams/sessions/${session.sessionId}`}>Resume saved exam</Link></>;
 const number=Number(params.get('q')??1),index=Number.isInteger(number)&&number>=1&&number<=session.items.length?number-1:0,binding=session.items[index],response=session.responses.find(r=>r.itemId===binding.id)!;
 const item=resolution.status==='AVAILABLE'?resolution.items[index]:null,fixed=item&&practiceFor(item),evaluation=session.submission?.evaluations.find(e=>e.itemId===binding.id),reference=references?.find(r=>r.itemId===binding.id&&r.version===binding.version),review=learning.snapshot!.data.examReviews.find(r=>r.sessionId===session.sessionId&&r.itemId===binding.id);
 async function mark(){setBusy(true);setError('');try{await learning.changeStudentData(repo=>repo.reviewExam(session.sessionId,binding.id,review?.revision??0,!review?.reviewedAt,learning.snapshot!.data));}catch(e){setError(errorMessage(e));}finally{setBusy(false);}}
 return <div className="exam-page"><Link to="/exams/history">← Exam history</Link><h1>{session.status==='ABANDONED'?'Abandoned exam':'Exam review'}</h1><p>{courses.find(c=>c.subject_id===session.course)?.name} · {session.mode==='full'?'Full authored mock':'Quick exam practice'} · {new Date(session.startedAt).toLocaleString()}</p>
  <div className="exam-result"><strong>Automatically verified: {counts.autoEarned} / {counts.autoMax} points</strong><p>{counts.openWeight} authored weight is open work, never automatically scored. {counts.openRemaining} answered open components ({counts.pendingWeight} weight) still need self/rubric review.</p><p>{counts.answered} answered · {counts.unanswered} unanswered · {counts.flagged} flagged. Unanswered objective components earn no verified points; unanswered open components have no numeric grade.</p><p>These item points are not an official university grade or a mastery/readiness score. See Progress for separate evidence indices with coverage, confidence and limitations.</p></div>
  {resolution.status==='UNAVAILABLE'&&<p role="alert">{resolution.message}</p>}
  <nav className="exam-jump" aria-label="Review question navigation">{session.items.map((i,n)=><button key={i.id} aria-current={n===index?'step':undefined} onClick={()=>setParams({q:String(n+1)})} aria-label={`Review question ${n+1}`}>{n+1}</button>)}</nav>
  <article className="exam-card"><h2>{item?.title??'Original item unavailable'} · {index+1} / {session.items.length}</h2><p>Exact item version {binding.version} · {binding.weight} authored {binding.evaluation==='RUBRIC'?'rubric weight':'objective points'}</p>
   {fixed?<ExercisePrompt exercise={fixed} mode="exam"/>:item&&<><p>{item.context}</p><p className="exam-prompt">{item.prompt}</p></>}
   <h3>Immutable submitted response</h3><pre className="exam-response">{fixed?displayAnswer(fixed,response.answer)||'Unanswered':typeof response.answer.value==='string'?response.answer.value||'Unanswered':'Original answer options unavailable'}</pre>
   <p>{evaluation?.status==='AUTO_SCORED'?`Automatically verified: ${evaluation.earned} / ${evaluation.max} points`:evaluation?.status==='UNANSWERED'?'Unanswered':evaluation?.status==='RUBRIC_REVIEW_REQUIRED'?(review?.reviewedAt?'Self-reviewed — correctness remains unverified':'Rubric review required — no automatic points'):evaluation?.status==='NOT_AUTOGRADABLE'?evaluation.reason:'Abandoned — no evaluation'}</p>
   {fixed&&evaluation?.status==='AUTO_SCORED'&&<><p>The practice feedback below uses its original one-point scale. This exam component has {binding.weight} objective points.</p><Feedback exercise={fixed} answer={response.answer} result={gradeResponse(fixed,response.answer)}/></>}
   {item?.evaluation==='RUBRIC'&&session.status==='SUBMITTED'&&<><h3>Component self-check</h3><ul>{item.rubric?.map((r,n)=><li key={n}>{r.requirement}</li>)}</ul>{reference?<><h3>One reference approach / test specification</h3><p className="exam-prompt">{reference.reference}</p><p>{reference.reasoning}</p></>:<p>{references?'This exact reference version is unavailable.':'Loading reference…'}</p>}{evaluation?.status==='RUBRIC_REVIEW_REQUIRED'&&<button className="ds-button" disabled={busy||!reference} onClick={()=>void mark()}>{review?.reviewedAt?'Undo self-review':'Mark self-reviewed'}</button>}</>}
   {item&&<details><summary>Source mechanism and authored scope</summary>{item.provenance.map(s=><p key={s.documentId}>{s.filename} · physical page(s) {s.pages.join(', ')} · {s.era}. Mechanism basis only; the question, timing and weights are authored practice.</p>)}<p>Generation: fixed authored version. No new source frequency or skill evidence is inferred from open work.</p></details>}
  </article>{error&&<p role="alert">{error}</p>}<div className="exam-actions"><button className="ds-button" disabled={index===0} onClick={()=>setParams({q:String(index)})}>Previous result</button><button className="ds-button" disabled={index===session.items.length-1} onClick={()=>setParams({q:String(index+2)})}>Next result</button><button className="ds-button" onClick={()=>navigate(`/exams/${session.course}/setup`)}>Retake with a new session</button><Link className="ds-button" to="/mistakes">Mistake Book</Link><Link className="ds-button" to="/study-plan">Study Path</Link></div>
 </div>;
}
