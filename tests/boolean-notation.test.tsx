// @vitest-environment jsdom
import {act} from 'react';
import {createRoot} from 'react-dom/client';
import {describe,it,expect} from 'vitest';
import {literal,literalText,literalLabel,mintermLiterals,mintermFormula,termCells,selectedFormula,normalizeLiterals,type ComplementTask} from '../src/interactive/boolean-notation';
import {evaluateProp} from '../src/rl/logic';
import {mapLayout,valuation} from '../src/interactive/domain';
import {gradeComplement} from '../src/interactive/complement-grading';
import original from '../src/interactive/practice.json';
import Controls,{MapView,InteractiveSpecification} from '../src/interactive/Controls';
import {BooleanFormula} from '../src/interactive/BooleanFormula';
import type {InteractiveExercise} from '../src/interactive/types';
(globalThis as {IS_REACT_ACT_ENVIRONMENT?:boolean}).IS_REACT_ACT_ENVIRONMENT=true;
export const task:ComplementTask={kind:'logic-build',complements:true,variables:['A','B','C'],shape:{kind:'binary',operator:'and',left:{kind:'atom',slot:'a'},right:{kind:'binary',operator:'and',left:{kind:'atom',slot:'b'},right:{kind:'atom',slot:'c'}}},slots:['A','B','C'].map(v=>({id:v.toLowerCase(),label:v+' literal',options:[v,'!'+v]})),target:mintermFormula(['A','B','C'],3)};
describe('Boolean complement notation and accepted map semantics',()=>{
 it('A and complemented A are distinct literals, labels and semantics',()=>{
  expect(literalText('!A')).toBe('A̅');expect(literalLabel('!A')).toBe('NOT A');expect(literalLabel('A')).toBe('A');
  for(const A of [false,true]){expect(evaluateProp(literal('A'),{A})).toBe(A);expect(evaluateProp(literal('!A'),{A})).toBe(!A);}
  for(const token of ['!!A','!','A B','NOT A','!Z=1'])expect(()=>literal(token)).toThrow();
 });
 it.each([2,3,4])('every %i-variable cell maps to one exact product and back',n=>{
  const vs=['A','B','C','D'].slice(0,n);
  for(const i of mapLayout(n).cells.flat()){
   const tokens=mintermLiterals(vs,i);expect(termCells(vs,tokens)).toEqual([i]);
   for(let j=0;j<2**n;j++)expect(evaluateProp(mintermFormula(vs,i),valuation(vs,j))).toBe(i===j);
  }
 });
 it('constructs A-bar BC and AB-bar C-bar from assignments, without interpreting output 0 as an input complement',()=>{
  expect(mintermLiterals(['A','B','C'],3)).toEqual(['!A','B','C']);expect(mintermLiterals(['A','B','C'],4)).toEqual(['A','!B','!C']);
  expect(termCells(['A','B','C','D'],['!B','!D'])).toEqual([0,2,8,10]);
  expect(()=>termCells(['A','B'],['A','!A'])).toThrow();expect(()=>termCells(['A','B'],['C'])).toThrow();
  for(const i of [-1,8,1.2])expect(()=>mintermLiterals(['A','B','C'],i)).toThrow();
 });
 it('literal reconstruction reuses the legacy grader and rejects the opposite literal',()=>{
  const reference={kind:'choice' as const,value:['a=!A','b=B','c=C']};
  const e={...original[0],task,reference,grader:{id:'structured-logic',version:'1'},explanation:'Input zero complements a product literal.'} as InteractiveExercise;
  expect(gradeComplement(e,reference)).toMatchObject({status:'GRADED',correct:true});
  expect(gradeComplement(e,{kind:'choice',value:['a=A','b=B','c=C']})).toMatchObject({status:'GRADED',correct:false});
  expect(gradeComplement(e,{kind:'choice',value:['a=!Z','b=B','c=C']})).toMatchObject({status:'INVALID'});
  expect(gradeComplement(e,{kind:'choice',value:[]})).toMatchObject({status:'INCOMPLETE'});
  expect(()=>normalizeLiterals({...task,slots:task.slots.map(s=>({...s,options:['!!A']}))})).toThrow();
  expect(evaluateProp(selectedFormula(task,reference.value),{A:false,B:true,C:true})).toBe(true);
 });
 it('renders real overbars, native distinct choices, spoken NOT labels and minterm terms',()=>{
  const div=document.createElement('div');document.body.append(div);const root=createRoot(div);let answer={kind:'choice' as const,value:['a=!A','b=B','c=C']};
  act(()=>root.render(<><Controls task={task} answer={answer} disabled={false} onChange={a=>{if(a.kind==='choice')answer=a;}}/><BooleanFormula formula={task.target}/><MapView map={{variables:['A','B','C'],cells:[0,0,0,1,0,0,0,0]}}/><InteractiveSpecification task={{kind:'kmap-fill',map:{variables:['A','B'],cells:[1,1,0,0]},given:[],specification:{kind:'formula',formula:literal('!A')}}}/></>));
  const options=[...div.querySelectorAll('select[aria-label="A literal"] option')];expect(options.map(o=>o.textContent)).toEqual(['Choose…','A','A̅']);expect(options[2].getAttribute('aria-label')).toBe('NOT A');
  expect(div.querySelector('.boolean-complement[aria-label="NOT A"]')).not.toBeNull();expect(div.querySelector('[aria-label="NOT A AND B AND C"]')).not.toBeNull();
  const input=div.querySelector('select')!;act(()=>{input.value='A';input.dispatchEvent(new Event('change',{bubbles:true}));});expect(answer.value).toContain('a=A');
  act(()=>root.unmount());div.remove();
 });
});
