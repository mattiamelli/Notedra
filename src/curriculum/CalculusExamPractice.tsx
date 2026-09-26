import {Link} from 'react-router';
import {calculusExamSets,calculusQuestion} from './calculus-expansion';
import {ExamQuestionPanel} from '../practice/ExamQuestionPanel';
import {useLearning} from '../learning/LearningProvider';
import {allExercises,exercisePath,attemptPath} from '../practice/catalog';
import {resolveAttempt} from '../practice/service';

export function CalculusExamPractice(){
 const learning=useLearning();
 const attempts=learning?.snapshot?.data.attempts??[];
 return <section className="ds-exam-sets" aria-labelledby="calculus-exams"><h2 id="calculus-exams">Calculus exam practice</h2><p>Original practice sets across the course syllabus, not university exam replicas or predictions. Times are estimates. Written parts use a self-check rubric; their points are guidance, not an automatically awarded score.</p>
 {calculusExamSets.map(set=>{
  const points=set.ids.reduce((sum,id)=>sum+calculusQuestion(id)!.question.points,0);
  const saved=set.ids.map(id=>[...attempts].reverse().find(attempt=>attempt.templateRef===id&&attempt.status!=='ABANDONED'&&resolveAttempt(attempt).status==='AVAILABLE'));
  return <details className="ds-exam-set" key={set.id}><summary>{set.title}<small>{set.difficulty} · {set.minutes} min · {set.ids.length} questions · {points} pts</small></summary>
   <p className="ds-exam-set-progress">{saved.filter(attempt=>attempt?.status==='SUBMITTED').length} / {set.ids.length} questions submitted</p>
   {set.ids.map((id,index)=>{const entry=calculusQuestion(id)!,exercise=allExercises.find(item=>item.id===id)!,attempt=saved[index];return <ExamQuestionPanel key={id} question={entry.question} number={index+1}><Link className="ds-button" to={attempt?attemptPath(exercise,attempt.attemptId):exercisePath(exercise)}>{attempt?.status==='SUBMITTED'?'Review answer':attempt?'Continue answer':'Open question'}</Link></ExamQuestionPanel>;})}
  </details>;
 })}</section>;
}
