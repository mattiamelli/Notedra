// @vitest-environment jsdom
import {describe,it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter} from 'react-router';
import {MathText} from '../src/math/MathText';
import {AnswerControls,ExerciseSource} from '../src/practice/ExerciseParts';
import {allExercises} from '../src/practice/catalog';
import type {PracticeExercise} from '../src/practice/registered-types';
describe('Exercise presentation safety',()=>{
 it('unknown task kinds render a safe unavailable state',()=>{
  const unknown={...allExercises[0],task:{kind:'unsupported'}} as unknown as PracticeExercise;
  expect(renderToStaticMarkup(<AnswerControls exercise={unknown} answer={{kind:'text',value:''}} onChange={()=>{}} disabled={false}/>)).toContain('not available');
 });
 it('ordered tuples expose one labelled field per declared component',()=>{
  const exercise=allExercises.find(e=>e.task.kind==='enrichment-exact')!;
  const html=renderToStaticMarkup(<AnswerControls exercise={exercise} answer={{kind:'text',value:''}} onChange={()=>{}} disabled={false}/>);
  expect(html).toContain('Part 1');expect(html).toContain('Part 2');expect(html).toContain('fieldset');
 });
 it('source details retain filename without exposing document or skill identifiers',()=>{
  const exercise=allExercises[0];
  const html=renderToStaticMarkup(<MemoryRouter><ExerciseSource exercise={exercise}/></MemoryRouter>);
  expect(html).toContain(exercise.source.filename);expect(html).not.toContain(exercise.source.documentId);expect(html).not.toContain(exercise.skillId);
 });
});

import {ExercisePrompt,Feedback} from '../src/practice/ExerciseParts';
import {exerciseFormats,tupleFields} from '../src/practice/presentation';
import {initialAnswer,gradeResponse} from '../src/practice/runtime';
import {nextExercise} from '../src/practice/next';
import type {Answer,Attempt} from '../src/learning/contracts';
import {curriculumExercises} from '../src/curriculum/practice';
describe('Explicit exercise contracts',()=>{
 const objectiveFormats=[
  ...Object.keys(exerciseFormats).filter(kind=>kind!=='curriculum').map(kind=>({name:kind,exercise:allExercises.find(e=>e.task.kind===kind)!})),
  ...(['choice','integer'] as const).map(format=>({name:`curriculum ${format}`,exercise:curriculumExercises.find(e=>e.task.format===format)!})),
 ];
 it.each(objectiveFormats)('$name loads, renders and uses its bound grader and feedback',({exercise:e})=>{
  expect(e).toBeDefined();
  const markup=renderToStaticMarkup(<AnswerControls exercise={e} answer={initialAnswer(e)} onChange={()=>{}} disabled={false}/>);
  expect(markup).not.toContain('not available');expect(markup).toMatch(/input|select/);
  const grade=gradeResponse(e,e.reference);expect(grade).toMatchObject({status:'GRADED',correct:true});
  const feedback=renderToStaticMarkup(<Feedback result={grade} exercise={e} answer={e.reference}/>);
  expect(feedback).toContain('Correct');expect(feedback).toContain('Reference answer');expect(feedback).not.toContain(e.skillId);
 });
 it('open curriculum responses render reasoning and rubric feedback without objective grades',()=>{
  const exercises=curriculumExercises.filter(e=>e.task.format==='open');
  expect(exercises.length).toBeGreaterThan(0);
  for(const e of exercises){
   const answer={kind:'text' as const,value:'My reasoning considers the assumptions and alternatives.'};
   expect(initialAnswer(e)).toEqual({kind:'text',value:''});
   expect(e.reference).toEqual({kind:'text',value:''});
   expect(e.task.rubric.length).toBeGreaterThan(0);
   const controls=document.createElement('div');
   controls.innerHTML=renderToStaticMarkup(<AnswerControls exercise={e} answer={answer} onChange={()=>{}} disabled={false}/>);
   expect(controls.querySelectorAll('textarea')).toHaveLength(1);
   expect(controls.querySelector('textarea')?.value).toBe(answer.value);
   expect(controls.querySelector('textarea')?.disabled).toBe(false);
   expect(controls.querySelector('label')?.textContent).toContain('Your reasoning');
   expect(controls.querySelector('input,select')).toBeNull();
   controls.innerHTML=renderToStaticMarkup(<AnswerControls exercise={e} answer={answer} onChange={()=>{}} disabled={true}/>);
   expect(controls.querySelector('textarea')?.disabled).toBe(true);
   const grade=gradeResponse(e,answer);
   expect(grade).toMatchObject({status:'NOT_AUTOGRADABLE',feedback:'CURRICULUM_RUBRIC'});
   for(const key of ['correct','earned','max','reference'])expect(grade).not.toHaveProperty(key);
   const feedback=document.createElement('div');
   feedback.innerHTML=renderToStaticMarkup(<Feedback result={grade} exercise={e} answer={answer}/>);
   expect(feedback.querySelector('h2')?.textContent).toBe('Ungraded response');
   expect(feedback.textContent).toContain('Self-review rubric');
   expect(feedback.querySelector('pre')?.textContent).toBe(answer.value);
   expect(Array.from(feedback.querySelectorAll('li'),item=>item.textContent)).toEqual(e.task.rubric);
   const explanation=document.createElement('div');
   explanation.innerHTML=renderToStaticMarkup(<MathText text={e.explanation}/>);
   expect(feedback.textContent).toContain(explanation.textContent);
   expect(feedback.textContent).not.toContain('Reference answer');
   expect(feedback.textContent).not.toContain(e.skillId);
   expect(feedback.querySelector('.is-correct,.is-incorrect')).toBeNull();
   const invalidAnswers:[Answer,string][]=[[initialAnswer(e),'INCOMPLETE'],[{kind:'text',value:'   '},'INCOMPLETE'],[{kind:'choice',value:[]},'INVALID']];
   for(const [invalid,status] of invalidAnswers){
    const result=gradeResponse(e,invalid);
    expect(result.status).toBe(status);
    for(const key of ['correct','earned','max','reference','feedback'])expect(result).not.toHaveProperty(key);
    expect(renderToStaticMarkup(<Feedback result={result} exercise={e} answer={invalid}/>)).not.toContain('Self-review rubric');
   }
  }
 });
 it.each(['CSE1400_CO','CSE1300_RL','CSE1100_IP'])('%s practice has optional preparation, exam does not',course=>{
  const e=allExercises.find(e=>e.subjectId===course)!;
  const render=(mode:'practice'|'exam')=>renderToStaticMarkup(<MemoryRouter><ExercisePrompt exercise={e} mode={mode}/></MemoryRouter>);
  expect(render('practice')).toContain('Prepare for this exercise');expect(render('practice')).toContain('/learn');
  expect(render('exam')).not.toContain('Prepare for this exercise');expect(render('exam')).not.toContain('/learn');
  expect(render('exam')).not.toContain(e.explanation);
 });
 it('retains incomplete/wrong-arity old drafts without dropping or normalizing tokens',()=>{
  expect(tupleFields(' 0004 , -0 ',2)).toEqual([' 0004 ',' -0 ']);expect(tupleFields('1,2,3',2)).toBeNull();
  const e=allExercises.find(e=>e.task.kind==='enrichment-exact')!;
  const html=renderToStaticMarkup(<AnswerControls exercise={e} answer={{kind:'text',value:'1,2,3,4'}} onChange={()=>{}} disabled={false}/>);
  expect(html).toContain('Saved ordered answer');expect(html).toContain('1,2,3,4');
 });
 it('next selection is deterministic, scoped, unseen and stops at exhaustion',()=>{
  const e=allExercises.find(e=>allExercises.filter(other=>other.topicId===e.topicId).length>1)!;
  const next=nextExercise(e,[])!;expect(next).toBe(nextExercise(e,[]));expect(next.topicId).toBe(e.topicId);expect(next.subjectId).toBe(e.subjectId);expect(next.id).not.toBe(e.id);
  const seen=allExercises.map(e=>({templateRef:e.id}) as Attempt);
  expect(nextExercise(e,seen)).toBeNull();expect(nextExercise(e,[{templateRef:next.id} as Attempt])?.id).not.toBe(next.id);
 });
});

import {displayAnswer} from '../src/practice/presentation';
it('review formatting never exposes unknown option IDs or invents unanswered truth values',()=>{
 const java=allExercises.find(e=>e.task.kind==='ip-fixed')!;
 expect(displayAnswer(java,{kind:'choice',value:['internal-unavailable-id']})).toBe('Original option unavailable');
 const truth=allExercises.find(e=>e.task.kind==='truth')!;
 expect(displayAnswer(truth,{kind:'choice',value:[]})).toContain('Unanswered');
 expect(displayAnswer(truth,{kind:'choice',value:[]})).not.toContain('→ F');
});
