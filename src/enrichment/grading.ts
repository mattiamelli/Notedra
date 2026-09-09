import {validateAnswer,type Answer} from '../learning/contracts';
import type {GradeResult,InputResult} from '../practice/types';
import type {EnrichmentExercise,EnrichmentTask} from './types';
export function tupleAnswer(value:string,parts:number):string|null {
 if(value.length>120 || ![2,3].includes(parts))return null;
 const tokens=value.trim().split(',').map(s=>s.trim());
 if(tokens.length!==parts||tokens.some(s=>! /^-?\d{1,8}$/.test(s)))return null;
 return tokens.map(s=>BigInt(s).toString()).join(',');
}
function validTask(task:EnrichmentTask){return task?.kind==='enrichment-exact'&&[2,3].includes(task.parts)&&Object.keys(task).sort().join(',')==='kind,parts';}
export function validateEnrichmentResponse(task:EnrichmentTask,answer:Answer):InputResult {
 if(!validTask(task))return {status:'NOT_AUTOGRADABLE',message:'This response format is unavailable. Open reasoning is not automatically graded.'};
 try{validateAnswer(answer);}catch{return {status:'INVALID',message:'Malformed or oversized answer.'};}
 if(answer.kind!=='text')return {status:'INVALID',message:'Enter the ordered integers in the stated format.'};
 if(!answer.value.trim())return {status:'INCOMPLETE',message:'Enter an answer before submitting.'};
 return tupleAnswer(answer.value,task.parts)===null?{status:'INVALID',message:`Enter ${task.parts} comma-separated integers, at most eight digits each. Do not enter formulas, units or proof text.`}:{status:'VALID'};
}
export function gradeEnrichment(exercise:EnrichmentExercise,answer:Answer):GradeResult {
 if(exercise.task?.kind!=='enrichment-exact'||exercise.grader?.id!=='enrichment-exact'||exercise.grader.version!=='1')return {status:'NOT_AUTOGRADABLE',message:'The original grader is unavailable.'};
 try{
  if(!validTask(exercise.task)||exercise.reference.kind!=='text')throw new Error('Trusted definition invalid');
  const expected=tupleAnswer(exercise.reference.value,exercise.task.parts);if(expected===null)throw new Error('Trusted reference invalid');
  const validation=validateEnrichmentResponse(exercise.task,answer);if(validation.status!=='VALID')return validation;
  const correct=answer.kind==='text'&&tupleAnswer(answer.value,exercise.task.parts)===expected;
  return {status:'GRADED',correct,earned:correct?1:0,max:1,reference:structuredClone(exercise.reference),explanation:exercise.explanation};
 }catch{return {status:'ERROR',message:'A technical grading problem occurred. Your answer is preserved; no incorrect result was assigned.'};}
}
