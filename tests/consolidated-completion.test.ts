import {describe,expect,it} from 'vitest';
import {allExercises} from '../src/practice/catalog';
import {completionColor,completionFromIds} from '../src/progress/completion';
import type {PracticeExercise} from '../src/practice/registered-types';
const seed=allExercises[0];
const bank=(count:number):PracticeExercise[]=>Array.from({length:count},(_,index)=>({...seed,id:`fixture.${index}`,subjectId:'CSE1400_CO'}));
describe('dynamic exercise completion',()=>{
 it('recalculates from the current eligible bank and deduplicates completed identities',()=>{
  const completed=new Set(Array.from({length:20},(_,i)=>`fixture.${i}`));
  expect(completionFromIds(bank(40),completed)[0]).toMatchObject({completed:20,eligible:40,percentage:50});
  expect(completionFromIds(bank(50),completed)[0]).toMatchObject({completed:20,eligible:50,percentage:40});
  completed.add('fixture.0');
  expect(completionFromIds(bank(50),completed)[0].completed).toBe(20);
 });
 it('handles zero, partial, complete, removed and ineligible identities without NaN or premature 100%',()=>{
  expect(completionFromIds([],new Set())).toEqual([]);
  expect(completionFromIds(bank(3),new Set(['fixture.0']))[0].percentage).toBe(33);
  expect(completionFromIds(bank(201),new Set(Array.from({length:200},(_,i)=>`fixture.${i}`)))[0].percentage).toBe(99);
  expect(completionFromIds(bank(2),new Set(['fixture.0','fixture.1','removed']))[0]).toMatchObject({completed:2,eligible:2,percentage:100});
 });
 it.each([0,10,25,40,50,65,80,90,100])('uses a deterministic completion color at %i%%',percentage=>{
  expect(completionColor(percentage)).toMatch(/^hsl\(\d+ 72% 42%\)$/);
 });
});
