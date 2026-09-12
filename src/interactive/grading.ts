import {validateAnswer,type Answer} from '../learning/contracts';
import {displayProp} from '../rl/logic';
import type {GradeResult,InputResult} from '../practice/types';
import type {InteractiveExercise,InteractiveTask} from './types';
import {buildFormula,checkFormula,choices,slotsFor,validateTask} from './domain';
export function validateInteractive(task:InteractiveTask,answer:Answer):InputResult{
 try{validateTask(task);}catch{return {status:'NOT_AUTOGRADABLE',message:'This structured task definition is unavailable.'};}
 try{validateAnswer(answer);if(answer.kind!=='choice')throw Error('Use the labelled structured controls.');choices(task,answer.value,false);if(answer.value.length!==slotsFor(task).length)return {status:'INCOMPLETE',message:'Complete every labelled field before submitting.'};return {status:'VALID'};}catch{return {status:'INVALID',message:'Unsupported or duplicate selections. Reset the fields and choose valid values.'};}
}
export function gradeInteractive(exercise:InteractiveExercise,answer:Answer):GradeResult{
 if(exercise.grader.id!=='structured-logic'||exercise.grader.version!=='1')return {status:'NOT_AUTOGRADABLE',message:'Original structured grader unavailable.'};
 const valid=validateInteractive(exercise.task,answer);if(valid.status!=='VALID')return valid;
 try{
  const task=exercise.task,selected=choices(task,(answer as {value:string[]}).value);let correct:boolean,detail:string;
  if(task.kind==='logic-build'){const result=checkFormula(task,buildFormula(task.shape,selected));correct=result.correct;detail=result.message;}
  else {const wrong=task.map.cells.map((value,i)=>({value,i})).filter(({value,i})=>!task.given.includes(i)&&selected[`m${i}`]!==String(value));correct=wrong.length===0;detail=correct?'Every cell matches its minterm, including declared don’t-cares.':wrong.map(({value,i})=>`Minterm ${i}: selected ${selected[`m${i}`]}, required ${value}.`).join(' ');}
  return {status:'GRADED',correct,earned:correct?1:0,max:1,reference:structuredClone(exercise.reference),explanation:detail+' '+exercise.explanation};
 }catch{return {status:'ERROR',message:'Structured validation failed. No incorrect result was assigned.'};}
}
export function displayInteractive(task:InteractiveTask,answer:Answer){
 try{if(answer.kind!=='choice')return 'Original structured answer unavailable';const selected=choices(task,answer.value);
  if(task.kind==='logic-build')return displayProp(buildFormula(task.shape,selected));
  return task.map.cells.map((v,i)=>`Minterm ${i}: ${task.given.includes(i)?v:selected[`m${i}`]}`).join('\n');
 }catch{return 'Incomplete or unavailable structured answer';}
}
