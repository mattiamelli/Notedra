import {BooleanFormula} from '../interactive/BooleanFormula';
import type {ReactNode} from 'react';
import {calculusQuestion} from '../curriculum/calculus-expansion';
import {ExamQuestionPanel} from './ExamQuestionPanel';
import {WrittenPartsControls,writtenParts} from './WrittenPartsControls';
import {MathText} from '../math/MathText';
import {CurriculumControls} from '../curriculum/Controls';
import {isCurriculumRubricFeedback} from '../curriculum/grading';
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
import {AssemblyTraceControls} from '../assembly-practice/Controls';
import {assemblyVisualizerPath} from '../assembly-practice/navigation';
import {useI18n} from '../i18n/i18n';
export function ExerciseSource({exercise}: {exercise: Exercise}) {
  const {t}=useI18n();
  const topic = academicIndex.topics.find(topic => topic.topic_id === exercise.topicId)!;
  return <><p className="ds-practice-label">{t('practice.sourceLabel',{mode:t('mode' in exercise&&exercise.mode==='exam'?'practice.authoredExam':'practice.authored'),version:exercise.version})}</p>
    <p><Link className="ds-text-link" to={topicPath(topic)}>{topic.name}</Link></p>
    <details className="ds-practice-source"><summary>{t('learning.sourcesScope')}</summary><p>{exercise.source.filename}</p>{exercise.source.kind==='CURRICULUM'?<><p>{exercise.source.locator}</p><p>Authored practice grounded in the referenced curriculum material.</p></>:<p>{t('practice.sourceDocument')}</p>}<p>{t('practice.formatClaim',{format:exerciseFormat(exercise.task.kind)?.label??t('practice.unavailable')})}</p></details></>;
}
export function ExercisePrompt({exercise,mode='practice',attemptId,children}: {exercise: Exercise;mode?:'practice'|'exam';attemptId?:string;children?:ReactNode}) {
  const {t,lt}=useI18n();
  const topic=academicIndex.topics.find(t=>t.topic_id===exercise.topicId);
  const exam=calculusQuestion(exercise.id);
  if(exam)return <ExamQuestionPanel question={exam.question} number={Number(exercise.id.replace('CALC_E',''))}><p id="answer-rules">{lt(exercise.rules)}</p>{children}</ExamQuestionPanel>;
  if('mode' in exercise&&exercise.mode==='exam')mode='exam';
  const stimulus=exercise.task.kind==='assembly-trace'?{language:'assembly',code:exercise.task.code}:'stimulus' in exercise?exercise.stimulus as {language:string;code:string}:null;
  return <div className="ds-practice-prompt"><h2>{lt(exercise.prompt)}</h2>{stimulus?.language==='assembly'&&<pre aria-label="Assembly fragment"><code>{stimulus.code}</code></pre>}{exercise.task.kind==='assembly-trace'&&<p><Link className="ds-text-link" to={assemblyVisualizerPath(exercise.id,attemptId)}>{t('practice.exploreAssembly')}</Link></p>}{(exercise.task.kind === 'java-output'||exercise.task.kind === 'ip-fixed') && <pre aria-label="Fixed Java snippet"><code>{exercise.task.code}</code></pre>}{isInteractive(exercise.task)&&<InteractiveSpecification task={exercise.task}/>}<p id="answer-rules">{lt(exercise.rules)}</p>{mode==='practice'&&topic&&<details><summary>{t('practice.prepare')}</summary><p>{t('practice.prepareBody')}</p><Link to={topicPath(topic)+'/learn'}>{t('practice.reviewTopic',{topic:topic.name})}</Link></details>}</div>;
}
export function AnswerControls({exercise,answer,onChange,disabled}: {exercise: Exercise; answer: Answer; onChange: (answer: Answer)=>void; disabled: boolean}) {
  const {t}=useI18n();
  const task=exercise.task;
  const parts=calculusQuestion(exercise.id)?.question.parts;
  if(task.kind==='curriculum'&&task.format==='open'&&parts)return <WrittenPartsControls parts={parts} answer={answer} onChange={onChange} disabled={disabled}/>;
  if(!exerciseFormat(task.kind))return <p role="status">{t('practice.answerFormatUnavailable')}</p>;
  if(task.kind==='curriculum')return <CurriculumControls task={task} answer={answer} onChange={onChange} disabled={disabled}/>;
  if(isInteractive(task))return <InteractiveControls task={task} answer={answer} onChange={onChange} disabled={disabled}/>;
  if(task.kind==='enrichment-exact')return <TupleControls parts={task.parts} answer={answer} onChange={onChange} disabled={disabled}/>;
  if(task.kind==='assembly-trace')return <AssemblyTraceControls fields={task.fields} answer={answer} onChange={onChange} disabled={disabled}/>;
  if(task.kind==='radix'||task.kind==='co-exact'||task.kind==='rl-exact') return <label className="ds-practice-answer">{t('practice.yourAnswer')}<input aria-describedby="answer-rules" autoComplete="off" spellCheck={false} maxLength={16000} disabled={disabled} value={answer.kind==='text'?answer.value:''} onChange={event=>onChange({kind:'text',value:event.target.value})}/></label>;
  const selected = answer.kind==='choice'?answer.value:[];
  if((task.kind==='java-output'||task.kind==='ip-fixed')) return <fieldset disabled={disabled} className="ds-output-options" aria-describedby="answer-rules"><legend>{t('practice.predictedOutput')}</legend>{task.options.map(option=><label key={option.id}><input type="radio" name="java-output" value={option.id} checked={selected.includes(option.id)} onChange={()=>onChange({kind:'choice',value:[option.id]})}/><code>{option.output}</code></label>)}</fieldset>;
  return <table className="ds-truth-table"><caption>{t('practice.truthTableCaption')}</caption><thead><tr><th scope="col">p</th><th scope="col">q</th><th scope="col">{t('practice.formulaValue')}</th></tr></thead><tbody>{task.rows.map(row=><tr key={row.id}><td>{row.p?'T':'F'}</td><td>{row.q?'T':'F'}</td><td><select aria-label={t('practice.truthResult',{p:row.p?'T':'F',q:row.q?'T':'F'})} aria-describedby="answer-rules" disabled={disabled} value={selected.find(value=>value.startsWith(row.id+':'))?.split(':')[1]??''} onChange={event=>onChange({kind:'choice',value:[...selected.filter(value=>!value.startsWith(row.id+':')), ...(event.target.value?[`${row.id}:${event.target.value}`]:[])]})}><option value="">{t('practice.choose')}</option><option value="T">{t('practice.true')}</option><option value="F">{t('practice.false')}</option></select></td></tr>)}</tbody></table>;
}
function PresentedAnswer({exercise,answer}:{exercise:Exercise;answer:Answer}) {
 const parts=calculusQuestion(exercise.id)?.question.parts;
 const fields=parts&&answer.kind==='text'?writtenParts(answer.value,parts.length):null;
 if(fields)return <ol className="ds-written-preview">{fields.map((field,index)=><li key={index}><strong>Part {String.fromCharCode(97+index)})</strong><p>{field||'No response entered.'}</p></li>)}</ol>;
 if(exercise.task.kind==='logic-build'&&answer.kind==='choice'){
  try{return <p><BooleanFormula formula={selectedFormula(exercise.task,answer.value)}/></p>;}catch{/* Retain unavailable saved answer fallback. */}
 }
 return <pre>{displayAnswer(exercise,answer)}</pre>;
}
export function Feedback({result,exercise,answer}: {result: GradeResult; exercise: Exercise; answer:Answer}) {
  const {t,lt}=useI18n();
  if(exercise.task.kind==='curriculum'&&exercise.task.format==='open'&&isCurriculumRubricFeedback(result))return <section className="ds-practice-feedback" role="status"><h2>Ungraded response</h2><p>{t('practice.noScore')}</p><h3>{t('practice.submitted')}</h3><PresentedAnswer exercise={exercise} answer={answer}/><h3>Self-review rubric</h3><ul>{exercise.task.rubric.map((item,index)=><li key={index}><MathText text={item}/></li>)}</ul><p><MathText text={exercise.explanation}/></p></section>;
  if(result.status!=='GRADED') return <section className="ds-practice-feedback" role="status"><h2>{t('practice.feedbackUnavailable')}</h2><p>{lt(result.message)}</p><p>{t('practice.noScore')}</p></section>;
  const explanation=explainAnswer(exercise,answer,result)!;

  return <section className={`ds-practice-feedback ${result.correct?'is-correct':'is-incorrect'}`} aria-labelledby="feedback-heading" role="status"><h2 id="feedback-heading">{t(result.correct?'practice.correct':'practice.incorrect')} · {t('practice.itemPoints',{earned:result.earned,max:result.max})}</h2><h3>{t('practice.submitted')}</h3><PresentedAnswer exercise={exercise} answer={answer}/><h3>{t('practice.reference')}</h3><PresentedAnswer exercise={exercise} answer={result.reference}/><h3>{t(result.correct?'practice.whyWorks':'practice.whyDiffers')}</h3><p><MathText text={lt(explanation.why)}/></p>{explanation.misconception&&<p className="ds-feedback-pattern">{t('practice.answerPattern',{pattern:lt(explanation.misconception.label)})}</p>}<h3>{t('practice.reasoning')}</h3><p><MathText text={lt(explanation.reasoning)}/></p><h3>{t('practice.remember')}</h3><p><MathText text={lt(explanation.remember)}/></p><EvidenceView ids={explanation.evidenceIds}/>{explanation.profileId&&<small>{t('practice.supplementalVersion',{version:explanation.version??'—'})}</small>}<p>{t('practice.retryEvidence')}</p></section>;
}
