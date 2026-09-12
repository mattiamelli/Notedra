import {describe,it,expect} from 'vitest';
import {validateExpansion,lectureCoverage} from '../scripts/expansion-validation';
import definitions from '../src/expansion/practice.json';
import {expansionExercises} from '../src/expansion/catalog';
import oldGuides from '../src/expansion/guided.json';
import newGuides from '../src/expansion/completion-guided.json';
const guides=[...oldGuides,...newGuides];
import {verifyExpansionCO} from '../scripts/verify-expansion-co';
import {allExercises,versionBinding} from '../src/practice/catalog';
import {gradeResponse} from '../src/practice/runtime';
import {hasComplements,selectedFormula,termCells} from '../src/interactive/boolean-notation';
import {evaluateProp} from '../src/rl/logic';
import {valuation} from '../src/interactive/domain';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import originalGrader from '../src/interactive/grader-lock.json';
import originalLocks from '../src/interactive/practice-lock.json';
import original from '../src/interactive/practice.json';
describe('Patch 7 authored source batches',()=>{
 it('independently checks all CO answers, including four real accepted-engine traces',()=>{expect(verifyExpansionCO()).toMatchObject({exercises:24,assembly:4});});
 it('validates every new source, answer, classification, unique prompt and binding',()=>{expect(validateExpansion()).toMatchObject({exercises:142,guided:70,duplicates:0});});
 it('keeps all Patch 6 exact grader and exercise bindings intact',()=>{
  expect(createHash('sha256').update(Buffer.concat(originalGrader.files.map(f=>readFileSync(f)))).digest('hex')).toBe(originalGrader.sha256);
  for(const e of original){expect(createHash('sha256').update(JSON.stringify(e)).digest('hex')).toBe((originalLocks as Record<string,string>)[e.id+'@1']);const live=allExercises.find(x=>x.id===e.id)!;expect(versionBinding(live)).toBe('1:sha256:'+(originalLocks as Record<string,string>)[e.id+'@1']+':grader:'+originalGrader.sha256);}
 });
 it('references are independently the specified products, not only self-consistent with the grader',()=>{
  const expected:Record<string,(v:Record<string,boolean>)=>boolean>={
   'boolean-minterm':v=>!v.A&&v.B&&v.C,
   'boolean-products-map':v=>!v.A&&v.B||v.A&&!v.C,
   'boolean-wrap-product':v=>!v.B&&!v.D,
   'boolean-selector':v=>v.A?v.B:v.C,
  };
  for(const e of definitions){const live=allExercises.find(x=>x.id===e.id)!;expect(gradeResponse(live,live.reference)).toMatchObject({status:'GRADED',correct:true});const task=live.task;if(task.kind!=='logic-build'&&task.kind!=='kmap-fill')throw Error();const vars=task.kind==='logic-build'?task.variables:task.map.variables;for(let i=0;i<2**vars.length;i++){const v=valuation(vars,i),want=expected[e.id.slice('ds.practice.p7-'.length)](v);expect(task.map!.cells[i]).toBe(Number(want));if(task.kind==='logic-build')expect(evaluateProp(selectedFormula(task,live.reference.value as string[]),v)).toBe(want);}}
  expect(termCells(['A','B','C','D'],['!D','!B'])).toEqual([0,2,8,10]);
 });
 it('covers distinct forward/single-cell/wraparound/selector tasks and genuinely separates modes',()=>{
  expect(new Set(definitions.map(e=>e.demand)).size).toBe(4);expect(definitions.filter(e=>e.mode==='practice')).toHaveLength(2);expect(definitions.filter(e=>e.mode==='exam')).toHaveLength(2);
  expect(definitions.some(e=>hasComplements(e.task as Parameters<typeof hasComplements>[0]))).toBe(true);
 });
 it('counts each new item once and does not silently exempt uncovered canonical lectures',()=>{
  const report=lectureCoverage();expect(report.units).toHaveLength(53);expect(report.units.reduce((s,u)=>s+u.added,0)).toBe(expansionExercises.length+guides.length);expect(report.units.filter(u=>u.added<4).every(u=>u.status.includes('not an academic exception'))).toBe(true);expect(report.units.every(u=>u.added===4)).toBe(true);expect(report.gate).toBe('PASS');
 });
});
