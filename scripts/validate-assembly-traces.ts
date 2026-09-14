import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import definitions from '../src/assembly-practice/practice.json';
import locks from '../src/assembly-practice/practice-lock.json';
import graderLock from '../src/assembly-practice/grader-lock.json';
import {parseProgram} from '../src/engine/parser';
import {createCPU} from '../src/engine/cpu';
import {executeStep} from '../src/engine/executor';
import {gradeAssemblyTrace,traceAnswer,validateAssemblyTraceResponse} from '../src/assembly-practice/grading';
import type {AssemblyTraceExercise} from '../src/assembly-practice/types';
import type {CPUState,RegisterName} from '../src/engine/types';
const fail=(message:string):never=>{throw new Error(`Assembly trace: ${message}`)};
function assert(value:unknown,message:string):asserts value {if(!value)fail(message)}
const canonical=(value:unknown):string=>Array.isArray(value)?`[${value.map(canonical).join(',')}]`:value&&typeof value==='object'?`{${Object.entries(value as Record<string,unknown>).sort(([a],[b])=>a.localeCompare(b)).map(([key,item])=>`${JSON.stringify(key)}:${canonical(item)}`).join(',')}}`:JSON.stringify(value);
const sha=(value:string|Buffer)=>createHash('sha256').update(value).digest('hex');
function initial(exercise:AssemblyTraceExercise){const values:Partial<Record<RegisterName,bigint>>={};for(const [key,value] of Object.entries(exercise.task.initialRegisters))values[key as RegisterName]=BigInt(value!);return createCPU(parseProgram(exercise.task.code).entry,values);}
function checkpoint(exercise:AssemblyTraceExercise,instruction=exercise.task.checkpoint.instruction,occurrence=exercise.task.checkpoint.occurrence){
 const program=parseProgram(exercise.task.code);let state:CPUState=initial(exercise),seen=0,calls=0;
 for(let steps=0;steps<200;steps++){
  const next=executeStep(program,state);state=next.state;if(next.instruction.opcode==='call')calls++;
  if(next.instruction.text===instruction&&++seen===occurrence)return {state,calls,line:next.instruction.line};
 }
 return fail(`${exercise.id}: checkpoint was not reached`);
}
const items=definitions as AssemblyTraceExercise[];
assert(items.length===8,'expected eight reviewed additions');assert(new Set(items.map(item=>item.id)).size===items.length,'duplicate IDs');
for(const exercise of items){
 const key=`${exercise.id}@${exercise.version}` as keyof typeof locks;
 assert(locks[key]===sha(canonical(exercise)),`${exercise.id}: fingerprint mismatch`);
 assert(exercise.source.documentId==='CO_LEC_02'&&exercise.topicId==='CO_T06_ASSEMBLY_X86_64','source/topic mismatch');
 assert(exercise.task.fields.length>=1&&exercise.task.fields.length<=5,'field count outside 1..5');
 assert(validateAssemblyTraceResponse(exercise.task,exercise.reference).status==='VALID','reference is invalid');
 const grade=gradeAssemblyTrace(exercise,exercise.reference);assert(grade.status==='GRADED'&&grade.correct&&grade.earned===1,'reference does not earn one point');
 const {state,calls}=checkpoint(exercise);assert(calls<=3,'more than three executed calls');
 const actual=exercise.task.fields.map(field=>field.target==='memory-rsp'?state.memory[Number(state.registers.rsp)]?.toString():state.registers[field.target].toString());
 assert(actual.every(Boolean),`${exercise.id}: queried uninitialized value`);
 const reference=exercise.reference.kind==='text'?exercise.reference.value:'';
 assert(actual.join(',')===traceAnswer(reference,exercise.task.fields.length)!.join(','),`${exercise.id}: actual engine state disagrees with independent reference`);
}
const benchmark=items.find(item=>item.id.endsWith('owner-benchmark'))!;
assert(checkpoint(benchmark,'call first',1).state.registers.rsp===0x0fe0n,'benchmark first transfer RSP');
assert(checkpoint(benchmark,'call second',1).state.registers.rsp===0x0fc0n,'benchmark second transfer RSP');
const afterSecond=checkpoint(benchmark,'ret',1).state;assert(afterSecond.registers.rax===34n&&afterSecond.registers.rdi===13n,'benchmark post-second state');
assert(traceAnswer(' 0X26, 0x12, 4096, 8192 ',4)?.join(',')==='38,18,4096,8192','hex/whitespace normalization');
for(const bad of ['', '1,2.5', '1,2junk', '1,,2', 'NaN,2', '0x,2'])assert(traceAnswer(bad,2)===null,`invalid numeric input accepted: ${bad}`);
assert(graderLock.sha256===sha(readFileSync(new URL('../src/assembly-practice/grading.ts',import.meta.url))),'grader lock mismatch');
console.log('Assembly traces PASS: 8 additions, 8 engine checkpoints, benchmark transfers/post-return, BigInt decimal/hex validation.');
