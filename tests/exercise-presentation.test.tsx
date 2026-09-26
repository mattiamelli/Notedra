// @vitest-environment jsdom
import {describe,it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter} from 'react-router';
import {courses} from '../src/academic/navigation';
import {allExercises,exercisePath,attemptPath} from '../src/practice/catalog';
import {ExerciseListRow} from '../src/practice/ExerciseListRow';
import {ExercisePrompt,AnswerControls} from '../src/practice/ExerciseParts';
import {PracticeService} from '../src/practice/service';
import {repository} from './helpers/learning';
import type {Attempt} from '../src/learning/contracts';

function dom(node:React.ReactNode){const host=document.createElement('div');host.innerHTML=renderToStaticMarkup(<MemoryRouter>{node}</MemoryRouter>);return host;}
describe('shared exercise presentation',()=>{
 it.each(courses)('renders compact, accessible $publicName rows and a rich exercise shell',course=>{
  const exercise=allExercises.find(item=>item.subjectId===course.subject_id)!;
  const row=dom(<ExerciseListRow exercise={exercise} showTopic/>);
  expect(row.querySelectorAll('a')).toHaveLength(1);
  expect(row.querySelector('a')?.getAttribute('href')).toBe(exercisePath(exercise));
  expect(row.querySelector('h3')?.textContent).toBe(exercise.title);
  expect(row.querySelector('svg')?.getAttribute('width')).toBe('18');
  expect(row.querySelector('svg')?.getAttribute('stroke-width')).toBe('1.6');
  expect(row.querySelector('.ds-practice-card,.ds-button')).toBeNull();
  const panel=dom(<ExercisePrompt exercise={exercise}><form><AnswerControls exercise={exercise} answer={{kind:'text',value:''}} onChange={()=>{}} disabled={false}/></form></ExercisePrompt>);
  const shell=panel.querySelector('.ds-exam-question')!;
  expect(shell).not.toBeNull();expect(shell.querySelector('form')).not.toBeNull();
  expect(shell.querySelector('#answer-rules')?.textContent).toBe(exercise.rules);
  expect(shell.querySelector('input,textarea,select')).not.toBeNull();
  expect(shell.querySelector('header h2')?.id).toBe(shell.getAttribute('aria-labelledby'));
  expect(shell.querySelector('header h2')?.textContent).toBeTruthy();
 });
 it('prefers a compatible draft, retains every historical link and never mutates saved work',async()=>{
  const repo=repository(),service=new PracticeService(repo),exercise=allExercises[0];
  try{
   let state=await repo.load();
   state=await service.start(exercise.id,'resume-ui',state.data);
   const draft=state.data.attempts[0];
   state=await service.start(exercise.id,'submitted-ui',state.data);
   const ready=state.data.attempts.find(item=>item.attemptId==='submitted-ui')!;
   state=await service.submit(ready,{kind:'text',value:'00101101'},'submit-ui',state.data);
   const submitted=state.data.attempts.find(item=>item.attemptId==='submitted-ui')!;
   const abandoned={...draft,attemptId:'abandoned-ui',status:'ABANDONED'} as Attempt;
   const unavailable={...draft,attemptId:'unavailable-ui',exercise:{...draft.exercise!,version:'99'}} as Attempt;
   const attempts=[draft,submitted,abandoned,unavailable],before=structuredClone(attempts);
   const host=dom(<ExerciseListRow exercise={exercise} attempts={attempts} history/>);
   expect(host.querySelector('.ds-exercise-row')?.getAttribute('href')).toBe(attemptPath(exercise,draft.attemptId));
   expect(host.querySelector('.ds-exercise-row')?.textContent).toContain('Resume draft');
   for(const attempt of attempts)expect(host.querySelector(`details a[href="${attemptPath(exercise,attempt.attemptId)}"]`)).not.toBeNull();
   expect(host.querySelector('details')?.textContent).toContain('Original exercise version unavailable');
   expect(host.querySelector(`a[href="${exercisePath(exercise)}"]`)).not.toBeNull();
   expect(attempts).toEqual(before);
   const reviewed=dom(<ExerciseListRow exercise={exercise} attempts={[submitted]}/>);
   expect(reviewed.textContent).toContain('Review submission');
   expect(reviewed.querySelector('a')?.getAttribute('href')).toBe(attemptPath(exercise,submitted.attemptId));
   const invalid=dom(<ExerciseListRow exercise={exercise} attempts={[unavailable,abandoned]}/>);
   expect(invalid.querySelector('a')?.getAttribute('href')).toBe(exercisePath(exercise));
  }finally{repo.close();}
 });
 it('keeps discipline-specific stimulus and specification inside the shared shell',()=>{
  for(const kind of ['assembly-trace','java-output','truth','logic-build','curriculum']){
   const exercise=allExercises.find(item=>item.task.kind===kind)!;
   const host=dom(<ExercisePrompt exercise={exercise}/>);
   expect(host.querySelector('.ds-exam-question')).not.toBeNull();
   if(kind==='assembly-trace'||kind==='java-output')expect(host.querySelector('.ds-exam-question pre code')?.textContent).toBe((exercise.task as {code:string}).code);
  }
 });
});
