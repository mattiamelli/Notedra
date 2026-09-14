import {validateAnswer,type Answer} from '../learning/contracts';
import type {GradeResult,InputResult} from '../practice/types';
import type {AssemblyTraceExercise,AssemblyTraceTask} from './types';

const token=/^[+-]?(?:0[xX][0-9a-fA-F]+|\d+)$/;
export function assemblyInteger(value:string):bigint|null{
 const text=value.trim();if(!token.test(text))return null;
 const negative=text.startsWith('-'),unsigned=text.replace(/^[+-]/,'');
 try{const parsed=BigInt(unsigned);return negative?-parsed:parsed;}catch{return null;}
}
export function traceAnswer(value:string,count:number):string[]|null{
 if(value.length>1000||count<1||count>5)return null;
 const parts=value.split(',');if(parts.length!==count)return null;
 const parsed=parts.map(assemblyInteger);if(parsed.some(item=>item===null))return null;
 return parsed.map(item=>item!.toString());
}
function validTask(task:AssemblyTraceTask){return task?.kind==='assembly-trace'&&task.fields.length>=1&&task.fields.length<=5&&new Set(task.fields.map(f=>f.id)).size===task.fields.length&&task.checkpoint.phase==='after';}
export function validateAssemblyTraceResponse(task:AssemblyTraceTask,answer:Answer):InputResult{
 if(!validTask(task))return {status:'NOT_AUTOGRADABLE',message:'This Assembly trace format is unavailable.'};
 try{validateAnswer(answer);}catch{return {status:'INVALID',message:'Malformed or oversized answer.'};}
 if(answer.kind!=='text')return {status:'INVALID',message:'Enter one integer for every requested field.'};
 if(!answer.value.trim()||answer.value.split(',').some(value=>!value.trim()))return {status:'INCOMPLETE',message:'Complete every requested register or stack field before submitting.'};
 return traceAnswer(answer.value,task.fields.length)?{status:'VALID'}:{status:'INVALID',message:'Use complete decimal or 0x-prefixed hexadecimal integers only; fractions, units and trailing text are not accepted.'};
}
export function gradeAssemblyTrace(exercise:AssemblyTraceExercise,answer:Answer):GradeResult{
 if(exercise.grader?.id!=='assembly-trace-exact'||exercise.grader.version!=='1')return {status:'NOT_AUTOGRADABLE',message:'The original Assembly trace grader is unavailable.'};
 try{
  if(exercise.reference.kind!=='text'||!validTask(exercise.task))throw new Error('Trusted definition invalid');
  const expected=traceAnswer(exercise.reference.value,exercise.task.fields.length);if(!expected)throw new Error('Trusted reference invalid');
  const validation=validateAssemblyTraceResponse(exercise.task,answer);if(validation.status!=='VALID')return validation;
  const actual=answer.kind==='text'?traceAnswer(answer.value,exercise.task.fields.length):null;
  const correct=!!actual&&actual.every((value,index)=>value===expected[index]);
  return {status:'GRADED',correct,earned:correct?1:0,max:1,reference:structuredClone(exercise.reference),explanation:exercise.explanation};
 }catch{return {status:'ERROR',message:'A technical grading problem occurred. Your answer is preserved; no incorrect result was assigned.'};}
}
