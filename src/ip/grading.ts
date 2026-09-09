import {validateAnswer,type Answer} from '../learning/contracts';
import type {GradeResult,InputResult} from '../practice/types';
import type {IPExercise,IPTask} from './types';
function validTask(task:IPTask):boolean {
 return task?.kind==='ip-fixed'&&typeof task.code==='string'&&task.code.length<=12000&&Array.isArray(task.options)&&task.options.length>=2&&task.options.length<=6&&new Set(task.options.map(o=>o.id)).size===task.options.length&&task.options.every(o=>/^[a-z][a-z0-9-]*$/.test(o.id)&&typeof o.output==='string'&&o.output.length>0&&o.output.length<=1000);
}
export function validateIPResponse(task:IPTask,answer:Answer):InputResult {
 if(!validTask(task))return {status:'NOT_AUTOGRADABLE',message:'This fixed prediction is unavailable. Learner Java code is not automatically graded.'};
 try{validateAnswer(answer);}catch{return {status:'INVALID',message:'Malformed or oversized response.'};}
 if(answer.kind!=='choice')return {status:'INVALID',message:'Choose one stated prediction. Java source is not an answer format.'};
 if(answer.value.length===0)return {status:'INCOMPLETE',message:'Choose a prediction before submitting.'};
 if(answer.value.length!==1||!task.options.some(o=>o.id===answer.value[0]))return {status:'INVALID',message:'Choose exactly one available prediction.'};
 return {status:'VALID'};
}
/** Grades only a declared fixed prediction; never executes or compares learner Java. */
export function gradeIPResponse(exercise:IPExercise,answer:Answer):GradeResult {
 if(exercise.grader?.id!=='ip-fixed-choice'||exercise.grader.version!=='1'||!validTask(exercise.task))return {status:'NOT_AUTOGRADABLE',message:'The original fixed-prediction grader is unavailable.'};
 if(validateIPResponse(exercise.task,exercise.reference).status!=='VALID')return {status:'ERROR',message:'The trusted reference is unavailable. No score was assigned.'};
 const validation=validateIPResponse(exercise.task,answer);if(validation.status!=='VALID')return validation;
 const correct=answer.kind==='choice'&&exercise.reference.kind==='choice'&&answer.value[0]===exercise.reference.value[0];
 return {status:'GRADED',correct,earned:correct?1:0,max:1,reference:structuredClone(exercise.reference),explanation:exercise.explanation};
}
