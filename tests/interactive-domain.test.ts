import {describe,it,expect} from 'vitest';
import {adjacent,mapLayout,validateTask,buildFormula,checkFormula,choices,valuation} from '../src/interactive/domain';
import {gradeInteractive,validateInteractive} from '../src/interactive/grading';
import {evaluateProp} from '../src/rl/logic';
import definitions from '../src/interactive/practice.json';
import type {InteractiveExercise} from '../src/interactive/types';
import {validateInteractiveContent} from '../scripts/interactive-validation';
const exercises=definitions as InteractiveExercise[];
describe('Structured logic and Karnaugh domain',()=>{
 it('validates every authored definition, reference, source and bound semantic implementation',()=>{expect(validateInteractiveContent().exercises).toBe(7);});
 it.each([2,3,4])('%s-variable Gray maps enumerate minterms once and preserve cyclic adjacency',n=>{
  const layout=mapLayout(n),flat=layout.cells.flat();expect([...flat].sort((a,b)=>a-b)).toEqual(Array.from({length:2**n},(_,i)=>i));
  for(const row of layout.cells)for(let c=0;c<row.length;c++)expect(adjacent(row[c],row[(c+1)%row.length],n)).toBe(true);
  for(let c=0;c<layout.columns.length;c++)expect(adjacent(layout.cells[0][c],layout.cells.at(-1)![c],n)).toBe(true);
  expect(adjacent(layout.cells[0][0],layout.cells[1][1],n)).toBe(false);expect(adjacent(0,0,n)).toBe(false);
 });
 it('uses binary minterms under Gray headers, including four corners',()=>{expect(mapLayout(3).cells).toEqual([[0,1,3,2],[4,5,7,6]]);expect(mapLayout(4).cells).toEqual([[0,1,3,2],[4,5,7,6],[12,13,15,14],[8,9,11,10]]);expect(valuation(['A','B','C'],5)).toEqual({A:true,B:false,C:true});expect(()=>mapLayout(5)).toThrow();});
 it.each(exercises)('$id accepts its structured reference and rejects duplicate/unknown selections',e=>{
  expect(gradeInteractive(e,e.reference)).toMatchObject({status:'GRADED',correct:true});
  expect(validateInteractive(e.task,{kind:'choice',value:[]})).toMatchObject({status:'INCOMPLETE'});
  expect(validateInteractive(e.task,{kind:'choice',value:['unknown=X']})).toMatchObject({status:'INVALID'});
  expect(validateInteractive(e.task,{kind:'choice',value:[...(e.reference.value as string[]),(e.reference.value as string[])[0]]})).toMatchObject({status:'INVALID'});
 });
 it('reports a real counterexample for a wrong connective, not a guessed misconception',()=>{
  const e=exercises[0];const result=gradeInteractive(e,{kind:'choice',value:['connective=and']});expect(result).toMatchObject({status:'GRADED',correct:false});if(result.status==='GRADED')expect(result.explanation).toContain('At P=0, Q=0');
 });
 it('accepts equivalent operand order and rejects a wrong variable',()=>{
  const e=exercises[1];expect(gradeInteractive(e,{kind:'choice',value:['left=Q','join=or','right=P']})).toMatchObject({status:'GRADED',correct:true});expect(gradeInteractive(e,{kind:'choice',value:['left=P','join=or','right=P']})).toMatchObject({status:'GRADED',correct:false});
 });
 it('invalid topology, foreign variables/operators and unused slots cannot grade',()=>{
  const task=exercises[1].task;if(task.kind!=='logic-build')throw Error();
  for(const changed of [{...task,shape:{kind:'invalid'}},{...task,slots:[...task.slots,{id:'extra',label:'extra',options:['P']}]},{...task,variables:['P']},{...task,slots:task.slots.map(s=>s.id==='join'?{...s,options:['xor']}:s)}])expect(()=>validateTask(changed as typeof task)).toThrow();
 });
 it('map fill distinguishes declared X, wrong values and given cells',()=>{
  const e=exercises.find(e=>e.id.endsWith('co-map-four'))!;
  expect(gradeInteractive(e,{kind:'choice',value:(e.reference.value as string[]).map(t=>t==='m1=X'?'m1=1':t)})).toMatchObject({status:'GRADED',correct:false});
  expect(validateInteractive(e.task,{kind:'choice',value:['m0=2']})).toMatchObject({status:'INVALID'});
  const partial=exercises.find(e=>e.id.endsWith('co-map-three'))!;expect(validateInteractive(partial.task,{kind:'choice',value:['m0=0']})).toMatchObject({status:'INVALID'});
 });
 it('reverse map checks all care assignments, not a textual or minimal expression match',()=>{
  const e=exercises.at(-1)!;if(e.task.kind!=='logic-build')throw Error();
  const f=buildFormula(e.task.shape,choices(e.task,e.reference.value as string[]));expect(checkFormula(e.task,f).correct).toBe(true);
  for(let i=0;i<8;i++){const v=valuation(['A','B','C'],i);expect(evaluateProp(f,v)).toBe(v.A&&v.B||v.C);}
  expect(checkFormula(e.task,f).message).toContain('not minimality');
  const dc={...e.task,map:{...e.task.map!,cells:e.task.map!.cells.map(()=> 'X' as const)}};expect(checkFormula(dc,{kind:'variable',name:'A'}).correct).toBe(true);
 });
});
