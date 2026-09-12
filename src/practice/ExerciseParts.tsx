import {BooleanFormula} from '../interactive/BooleanFormula';
import {selectedFormula} from '../interactive/boolean-notation';
import InteractiveControls,{InteractiveSpecification} from '../interactive/Controls';
import {isInteractive} from '../interactive/types';
import {explainAnswer} from '../enrichment/feedback';
import {EvidenceView} from '../enrichment/EvidenceView';
import '../enrichment/enrichment.css';
import type { Answer } from '../learning/contracts';
import { academicIndex, topicPath } from '../academic/navigation';
import { Link } from 'react-router';
import type { GradeResult } from './types';
import type { PracticeExercise as Exercise } from './registered-types';
import {exerciseFormat,displayAnswer} from './presentation';
import {TupleControls} from './TupleControls';
export function ExerciseSource({exercise}: {exercise: Exercise}) {
  const topic = academicIndex.topics.find(topic => topic.topic_id === exercise.topicId)!;
  return <><p className="ds-practice-label">{'mode' in exercise&&exercise.mode==='exam'?'Authored exam-style practice':'Authored practice'} · Version {exercise.version} · Not an official TU Delft question</p>
    <p><Link className="ds-text-link" to={topicPath(topic)}>{topic.name}</Link></p>
    <details className="ds-practice-source"><summary>Source and scope</summary><p>{exercise.source.filename}</p><p>Whole-document reference, not an exact supporting slide. Original PDF is not included.</p><p>{exerciseFormat(exercise.task.kind)?.label}. No official difficulty or examination weighting is claimed.</p></details></>;
}
export function ExercisePrompt({exercise,mode='practice'}: {exercise: Exercise;mode?:'practice'|'exam'}) {
  const topic=academicIndex.topics.find(t=>t.topic_id===exercise.topicId);
  if('mode' in exercise&&exercise.mode==='exam')mode='exam';
  const stimulus='stimulus' in exercise?exercise.stimulus as {language:string;code:string}:null;
  return <div className="ds-practice-prompt"><h2>{exercise.prompt}</h2>{stimulus?.language==='assembly'&&<pre aria-label="Assembly fragment"><code>{stimulus.code}</code></pre>}{(exercise.task.kind === 'java-output'||exercise.task.kind === 'ip-fixed') && <pre aria-label="Fixed Java snippet"><code>{exercise.task.code}</code></pre>}{isInteractive(exercise.task)&&<InteractiveSpecification task={exercise.task}/>}<p id="answer-rules">{exercise.rules}</p>{mode==='practice'&&topic&&<details><summary>Prepare for this exercise</summary><p>Review the topic explanation, then return and work through the question before checking your answer.</p><Link to={topicPath(topic)+'/learn'}>Review {topic.name}</Link></details>}</div>;
}
export function AnswerControls({exercise,answer,onChange,disabled}: {exercise: Exercise; answer: Answer; onChange: (answer: Answer)=>void; disabled: boolean}) {
  const task=exercise.task;
  if(!exerciseFormat(task.kind))return <p role="status">This answer format is not available. Your saved answer is preserved; return to Practice to choose another exercise.</p>;
  if(isInteractive(task))return <InteractiveControls task={task} answer={answer} onChange={onChange} disabled={disabled}/>;
  if(task.kind==='enrichment-exact')return <TupleControls parts={task.parts} answer={answer} onChange={onChange} disabled={disabled}/>;
  if(task.kind==='radix'||task.kind==='co-exact'||task.kind==='rl-exact') return <label className="ds-practice-answer">Your answer<input aria-describedby="answer-rules" autoComplete="off" spellCheck={false} maxLength={16000} disabled={disabled} value={answer.kind==='text'?answer.value:''} onChange={event=>onChange({kind:'text',value:event.target.value})}/></label>;
  const selected = answer.kind==='choice'?answer.value:[];
  if((task.kind==='java-output'||task.kind==='ip-fixed')) return <fieldset disabled={disabled} className="ds-output-options" aria-describedby="answer-rules"><legend>Your predicted output</legend>{task.options.map(option=><label key={option.id}><input type="radio" name="java-output" value={option.id} checked={selected.includes(option.id)} onChange={()=>onChange({kind:'choice',value:[option.id]})}/><code>{option.output}</code></label>)}</fieldset>;
  return <table className="ds-truth-table"><caption>Truth table — select the formula’s value for every row</caption><thead><tr><th scope="col">p</th><th scope="col">q</th><th scope="col">Formula value</th></tr></thead><tbody>{task.rows.map(row=><tr key={row.id}><td>{row.p?'T':'F'}</td><td>{row.q?'T':'F'}</td><td><select aria-label={`Result when p is ${row.p?'T':'F'} and q is ${row.q?'T':'F'}`} aria-describedby="answer-rules" disabled={disabled} value={selected.find(value=>value.startsWith(row.id+':'))?.split(':')[1]??''} onChange={event=>onChange({kind:'choice',value:[...selected.filter(value=>!value.startsWith(row.id+':')), ...(event.target.value?[`${row.id}:${event.target.value}`]:[])]})}><option value="">Choose…</option><option value="T">True (T)</option><option value="F">False (F)</option></select></td></tr>)}</tbody></table>;
}
function PresentedAnswer({exercise,answer}:{exercise:Exercise;answer:Answer}) {
 if(exercise.task.kind==='logic-build'&&answer.kind==='choice'){
  try{return <p><BooleanFormula formula={selectedFormula(exercise.task,answer.value)}/></p>;}catch{/* Retain unavailable saved answer fallback. */}
 }
 return <pre>{displayAnswer(exercise,answer)}</pre>;
}
export function Feedback({result,exercise,answer}: {result: GradeResult; exercise: Exercise; answer:Answer}) {
  if(result.status!=='GRADED') return <section className="ds-practice-feedback" role="status"><h2>Feedback unavailable</h2><p>{result.message}</p><p>No item score was assigned.</p></section>;
  const explanation=explainAnswer(exercise,answer,result)!;

  return <section className={`ds-practice-feedback ${result.correct?'is-correct':'is-incorrect'}`} aria-labelledby="feedback-heading" role="status"><h2 id="feedback-heading">{result.correct?'Correct':'Incorrect'} · {result.earned} / {result.max} item point</h2><h3>Your submitted answer</h3><PresentedAnswer exercise={exercise} answer={answer}/><h3>Reference answer</h3><PresentedAnswer exercise={exercise} answer={result.reference}/><h3>{result.correct?'Why this works':'Why this answer differs'}</h3><p>{explanation.why}</p>{explanation.misconception&&<p className="ds-feedback-pattern">Answer pattern to check: {explanation.misconception.label}. This describes the submitted pattern, not a diagnosis of your understanding.</p>}<h3>Reasoning</h3><p>{explanation.reasoning}</p><h3>Remember</h3><p>{explanation.remember}</p><EvidenceView ids={explanation.evidenceIds}/>{explanation.profileId&&<small>Supplemental explanation v{explanation.version}. Original exercise and saved answer are unchanged.</small>}<p>Retry below to work through the mechanism again. Eligible saved evidence is interpreted separately in Progress; this item point is not a mastery or readiness score.</p></section>;
}
