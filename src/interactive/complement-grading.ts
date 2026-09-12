import type {Answer} from '../learning/contracts';
import type {InteractiveExercise} from './types';
import type {InputResult} from '../practice/types';
import {gradeInteractive,validateInteractive} from './grading';
import {hasComplements,normalizeLiterals,type ComplementTask} from './boolean-notation';
export function validateComplement(task:ComplementTask,answer:Answer):InputResult {
 try {
  if(answer.kind!=='choice')return {status:'INVALID',message:'Use the labelled literal controls.'};
  const normalized=normalizeLiterals(task,answer.value);
  return validateInteractive(normalized.task,{kind:'choice',value:normalized.tokens});
 }catch{return {status:'INVALID',message:'Unsupported literal or duplicate selection. Reset the fields and choose valid values.'};}
}
export function gradeComplement(exercise:InteractiveExercise,answer:Answer){
 if(!hasComplements(exercise.task))return gradeInteractive(exercise,answer);
 const valid=validateComplement(exercise.task,answer);if(valid.status!=='VALID')return valid;
 const normalized=normalizeLiterals(exercise.task,(answer as {value:string[]}).value);
 return gradeInteractive({...exercise,task:normalized.task},{kind:'choice',value:normalized.tokens});
}
