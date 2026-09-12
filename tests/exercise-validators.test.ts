import {describe,it,expect} from 'vitest';
import {allExercises} from '../src/practice/catalog';
import {gradeResponse,validateResponse} from '../src/practice/runtime';
import {createCPU} from '../src/engine/cpu';
import {executeStep} from '../src/engine/executor';
import {parseProgram} from '../src/engine/parser';
describe('Type-appropriate validation preservation',()=>{
 it('ordered machine results agree with the accepted Assembly engine without sharing UI state',()=>{
  const e=allExercises.find(e=>e.id==='ds.practice.enrich-address-load')!;
  const program=parseProgram('leaq -16(%rbp), %rax\nmovq -16(%rbp), %rbx');
  const initial={...createCPU(0,{rbp:4096n}),memory:{4080:37n}};
  const cpu=executeStep(program,executeStep(program,initial).state).state;
  expect(gradeResponse(e,{kind:'text',value:`${cpu.registers.rax},${cpu.registers.rbx}`})).toMatchObject({status:'GRADED',correct:true});
  expect(initial.registers.rax).toBe(0n);expect(cpu.memory).toEqual(initial.memory);
  expect(gradeResponse(e,{kind:'text',value:`${cpu.registers.rbx},${cpu.registers.rax}`})).toMatchObject({status:'GRADED',correct:false});
  expect(gradeResponse(e,{kind:'text',value:'04080, 0037'})).toMatchObject({status:'GRADED',correct:true});
  for(const value of ['4080, +37','4080','4080,37,0','4080+0,37','4080 bytes,37'])expect(gradeResponse(e,{kind:'text',value}).status).not.toBe('GRADED');
 });
 it('integer-set order is immaterial, but membership and format are not',()=>{
  const e=allExercises.find(e=>e.task.kind==='rl-exact'&&e.task.format==='integer-set')!;
  const raw=String(e.reference.value);const values=raw.replace(/[{}]/g,'').split(',').map(s=>s.trim()).filter(Boolean);
  expect(gradeResponse(e,{kind:'text',value:'{'+values.reverse().join(',')+'}'})).toMatchObject({status:'GRADED',correct:true});
  expect(gradeResponse(e,{kind:'text',value:'{999999}'})).toMatchObject({status:'GRADED',correct:false});
  expect(validateResponse(e.task,{kind:'text',value:'{a,b}'}).status).not.toBe('VALID');
 });
 it('MCQ accepts canonical choices only, never labels or multiple choices',()=>{
  const e=allExercises.find(e=>e.task.kind==='ip-fixed')!;if(e.task.kind!=='ip-fixed')throw Error('fixture');
  expect(gradeResponse(e,e.reference)).toMatchObject({status:'GRADED',correct:true});
  expect(validateResponse(e.task,{kind:'choice',value:e.task.options.map(o=>o.id)}).status).not.toBe('VALID');
  expect(validateResponse(e.task,{kind:'choice',value:['not-an-option']}).status).not.toBe('VALID');
 });
});
