// @vitest-environment jsdom
import {act} from 'react';
import {createRoot} from 'react-dom/client';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter} from 'react-router';
import {describe,it,expect} from 'vitest';
import InteractiveControls from '../src/interactive/Controls';
import {ExercisePrompt} from '../src/practice/ExerciseParts';
import definitions from '../src/interactive/practice.json';
import type {InteractiveExercise} from '../src/interactive/types';
import type {Answer} from '../src/learning/contracts';
const es=definitions as InteractiveExercise[];
Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});
describe('Interactive renderer and mode behavior',()=>{
 it('structured controls construct labelled token answers and explicitly reset',async()=>{
  const host=document.createElement('div'),root=createRoot(host);document.body.append(host);let answer:Answer={kind:'choice',value:[]};const task=es[0].task;
  const render=()=>root.render(<InteractiveControls task={task} answer={answer} disabled={false} onChange={next=>{answer=next;render();}}/>);
  try{await act(async()=>render());const select=host.querySelector('select')!;expect(select.getAttribute('aria-label')).toBe('Missing connective');expect(select.closest('label')?.textContent).toContain('Missing connective');await act(async()=>{select.value='or';select.dispatchEvent(new Event('change',{bubbles:true}));});expect(answer).toEqual({kind:'choice',value:['connective=or']});expect(host.querySelector('.logic-preview')?.textContent).toBe('(¬P ∨ Q)');await act(async()=>host.querySelector('button')!.click());expect(answer).toEqual({kind:'choice',value:[]});}finally{await act(async()=>root.unmount());host.remove();}
 });
 it.each(es.filter(e=>e.task.kind==='kmap-fill'))('$id exposes Gray headers, semantic minterm labels and editable cells only',e=>{
  const markup=renderToStaticMarkup(<InteractiveControls task={e.task} answer={{kind:'choice',value:[]}} onChange={()=>{}} disabled={false}/>);
  const host=document.createElement('div');host.innerHTML=markup;if(e.task.kind!=='kmap-fill')throw Error();expect(host.querySelectorAll('select')).toHaveLength(e.task.map.cells.length-e.task.given.length);expect(host.querySelector('caption')?.textContent).toContain('Gray order');for(const select of host.querySelectorAll('select'))expect(select.getAttribute('aria-label')).toMatch(/A=[01].*minterm/);
 });
 it('exam challenges use more construction and no preparation/given map cells',()=>{
  const practice=es[0],exam=es[2];if(practice.task.kind!=='logic-build'||exam.task.kind!=='logic-build')throw Error();expect(exam.task.slots.length).toBeGreaterThan(practice.task.slots.length);
  const render=(e:InteractiveExercise)=>renderToStaticMarkup(<MemoryRouter><ExercisePrompt exercise={e}/></MemoryRouter>);
  expect(render(practice)).toContain('Prepare for this exercise');expect(render(exam)).not.toContain('Prepare for this exercise');expect(render(exam)).not.toContain(exam.explanation);
  const maps=es.filter(e=>e.task.kind==='kmap-fill');expect(maps.find(e=>e.mode==='exam')!.task).toMatchObject({given:[]});expect(maps.filter(e=>e.mode==='practice').every(e=>e.task.kind==='kmap-fill'&&e.task.given.length>0)).toBe(true);
 });
});
