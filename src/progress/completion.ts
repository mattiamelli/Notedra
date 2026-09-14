import type {Attempt} from '../learning/contracts';
import type {PracticeExercise} from '../practice/registered-types';
import {exerciseFormat} from '../practice/presentation';
import {feedbackFor} from '../practice/service';
export interface CourseCompletion {subjectId:string;completed:number;eligible:number;percentage:number|null;}
/** Activity completion: one finalized, valid, persisted graded submission per current eligible exercise. */
export function deriveCourseCompletion(exercises:readonly PracticeExercise[],attempts:readonly Attempt[]):CourseCompletion[]{
 const eligible=exercises.filter(exercise=>!!exerciseFormat(exercise.task.kind));
 const completed=new Set(attempts.filter(attempt=>attempt.status==='SUBMITTED'&&feedbackFor(attempt).status==='GRADED').map(attempt=>attempt.templateRef).filter(Boolean));
 return completionFromIds(eligible,completed as Set<string>);
}
/** Pure selector used by UI and regression fixtures; an exercise identity is counted at most once. */
export function completionFromIds(exercises:readonly PracticeExercise[],completed:ReadonlySet<string>):CourseCompletion[]{
 const eligible=exercises.filter(exercise=>!!exerciseFormat(exercise.task.kind));
 return [...new Set(eligible.map(exercise=>exercise.subjectId))].map(subjectId=>{
  const ids=new Set(eligible.filter(exercise=>exercise.subjectId===subjectId).map(exercise=>exercise.id));
  const done=[...ids].filter(id=>completed.has(id)).length,total=ids.size;
  const raw=total?Math.round(done/total*100):null;const percentage=raw===100&&done<total?99:raw;
  return {subjectId,completed:done,eligible:total,percentage};
 });
}
export function completionColor(percentage:number){
 const stops=[[0,0],[25,28],[50,52],[75,82],[100,128]] as const;let hue=0;
 for(let i=1;i<stops.length;i++)if(percentage<=stops[i][0]){const [x0,h0]=stops[i-1],[x1,h1]=stops[i];hue=h0+(h1-h0)*(percentage-x0)/(x1-x0);break;}
 if(percentage>=100)hue=128;return `hsl(${Math.round(hue)} 72% 42%)`;
}
