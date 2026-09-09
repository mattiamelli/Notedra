import type { Answer } from '../learning/contracts';
import { academicIndex, topicPath } from '../academic/navigation';
import { Link } from 'react-router';
import type { GradeResult } from './types';
import type { PracticeExercise as Exercise } from '../co/types';
export function ExerciseSource({exercise}: {exercise: Exercise}) {
  const topic = academicIndex.topics.find(topic => topic.topic_id === exercise.topicId)!;
  return <><p className="ds-practice-label">Authored practice · Version {exercise.version} · Not an official TU Delft question</p>
    <p><Link className="ds-text-link" to={topicPath(topic)}>{topic.name}</Link></p>
    <details className="ds-practice-source"><summary>Source and scope</summary><p>{exercise.source.filename} · {exercise.source.documentId}</p><p>{exercise.source.locator} — whole-document reference, not an exact supporting slide. Original PDF is not included.</p><code>{exercise.skillId}</code><p>No official difficulty or examination weighting is claimed.</p></details></>;
}
export function ExercisePrompt({exercise}: {exercise: Exercise}) {
  return <div className="ds-practice-prompt"><h2>{exercise.prompt}</h2>{exercise.task.kind === 'java-output' && <pre aria-label="Fixed Java snippet"><code>{exercise.task.code}</code></pre>}<p id="answer-rules">{exercise.rules}</p></div>;
}
export function AnswerControls({exercise,answer,onChange,disabled}: {exercise: Exercise; answer: Answer; onChange: (answer: Answer)=>void; disabled: boolean}) {
  const task=exercise.task;
  if(task.kind==='radix'||task.kind==='co-exact') return <label className="ds-practice-answer">Your answer<input aria-describedby="answer-rules" autoComplete="off" spellCheck={false} maxLength={16000} disabled={disabled} value={answer.kind==='text'?answer.value:''} onChange={event=>onChange({kind:'text',value:event.target.value})}/></label>;
  const selected = answer.kind==='choice'?answer.value:[];
  if(task.kind==='java-output') return <fieldset disabled={disabled} className="ds-output-options" aria-describedby="answer-rules"><legend>Your predicted output</legend>{task.options.map(option=><label key={option.id}><input type="radio" name="java-output" value={option.id} checked={selected.includes(option.id)} onChange={()=>onChange({kind:'choice',value:[option.id]})}/><code>{option.output}</code></label>)}</fieldset>;
  return <table className="ds-truth-table"><caption>Truth table — select the formula’s value for every row</caption><thead><tr><th scope="col">p</th><th scope="col">q</th><th scope="col">Formula value</th></tr></thead><tbody>{task.rows.map(row=><tr key={row.id}><td>{row.p?'T':'F'}</td><td>{row.q?'T':'F'}</td><td><select aria-label={`Result when p is ${row.p?'T':'F'} and q is ${row.q?'T':'F'}`} aria-describedby="answer-rules" disabled={disabled} value={selected.find(value=>value.startsWith(row.id+':'))?.split(':')[1]??''} onChange={event=>onChange({kind:'choice',value:[...selected.filter(value=>!value.startsWith(row.id+':')), ...(event.target.value?[`${row.id}:${event.target.value}`]:[])]})}><option value="">Choose…</option><option value="T">True (T)</option><option value="F">False (F)</option></select></td></tr>)}</tbody></table>;
}
export function Feedback({result,exercise}: {result: GradeResult; exercise: Exercise}) {
  if(result.status!=='GRADED') return <section className="ds-practice-feedback" role="status"><h2>Feedback unavailable</h2><p>{result.message}</p><p>No item score was assigned.</p></section>;
  let reference = result.reference.value.toString();
  if(exercise.task.kind==='truth' && Array.isArray(result.reference.value)) reference=exercise.task.rows.map(row=>`${row.p?'T':'F'}, ${row.q?'T':'F'} → ${result.reference.value.includes(`${row.id}:T`)?'T':'F'}`).join('\n');
  if(exercise.task.kind==='java-output') reference=exercise.task.options.find(option=>option.id===result.reference.value[0])?.output??'';
  return <section className={`ds-practice-feedback ${result.correct?'is-correct':'is-incorrect'}`} aria-labelledby="feedback-heading" role="status"><h2 id="feedback-heading">{result.correct?'Correct':'Incorrect'} · {result.earned} / {result.max} item point</h2><h3>Reference answer</h3><pre>{reference}</pre><p>{result.explanation}</p><p>This is feedback for one authored practice item. It does not update mastery or exam readiness.</p></section>;
}
