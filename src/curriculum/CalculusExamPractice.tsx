import {calculusExamSets,calculusQuestion} from './calculus-expansion';
import {ExerciseListRow} from '../practice/ExerciseListRow';
import {useLearning} from '../learning/LearningProvider';
import {allExercises} from '../practice/catalog';
import {resolveAttempt} from '../practice/service';
import '../practice/exam-question.css';

export function CalculusExamPractice(){
 const learning=useLearning();
 const attempts=learning?.snapshot?.data.attempts??[];
 return <section className="ds-exam-sets" aria-labelledby="calculus-exams"><h2 id="calculus-exams">Calculus exam practice</h2><p>Original practice sets across the course syllabus, not university exam replicas or predictions. Times are estimates. Written parts use a self-check rubric; their points are guidance, not an automatically awarded score.</p>
 {calculusExamSets.map(set=>{
  const points=set.ids.reduce((sum,id)=>sum+calculusQuestion(id)!.question.points,0);
  const saved=set.ids.map(id=>[...attempts].reverse().find(attempt=>attempt.templateRef===id&&attempt.status!=='ABANDONED'&&resolveAttempt(attempt).status==='AVAILABLE'));
  return <details className="ds-exam-set" key={set.id}><summary>{set.title}<small>{set.difficulty} · {set.minutes} min · {set.ids.length} questions · {points} pts</small></summary>
   <p className="ds-exam-set-progress">{saved.filter(attempt=>attempt?.status==='SUBMITTED').length} / {set.ids.length} questions submitted</p>
   <div className="ds-exercise-list">{set.ids.map(id=><ExerciseListRow key={id} exercise={allExercises.find(item=>item.id===id)!} attempts={attempts}/>)}</div>
  </details>;
 })}</section>;
}
