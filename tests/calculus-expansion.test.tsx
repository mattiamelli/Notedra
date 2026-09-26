// @vitest-environment jsdom
import {describe,it,expect} from 'vitest';
import {createHash} from 'node:crypto';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter} from 'react-router';
import {calculusAdditions,calculusExamSets} from '../src/curriculum/calculus-expansion';
import {curriculumCourses} from '../src/curriculum/registry';
import {curriculumExercises} from '../src/curriculum/practice';
import {gradeCurriculumResponse} from '../src/curriculum/grading';
import {ExercisePrompt,AnswerControls,Feedback} from '../src/practice/ExerciseParts';
import {CalculusExamPractice} from '../src/curriculum/CalculusExamPractice';
import {MathText} from '../src/math/MathText';
import {writtenParts} from '../src/practice/WrittenPartsControls';
import bindings from '../src/generated/curriculum-bindings.json';
import formulas from '../src/generated/exam-math.json';
import {PracticeService,feedbackFor,resolveAttempt} from '../src/practice/service';
import {deriveEvidence} from '../src/adaptive/evidence';
import {buildStudySession} from '../src/adaptive/session';
import {deriveProgress} from '../src/progress/derive';
import {toBackup} from '../src/learning/contracts';
import {repository,time} from './helpers/learning';

const course=curriculumCourses.find(item=>item.id==='CSE12A_CALC')!;
const registered=(id:string)=>curriculumExercises.find(item=>item.id===id)!;
describe('Calculus original exam practice',()=>{
 it('has 200 unique exercises, twenty in every supported topic and four preserved original sets',()=>{
  expect(course.topics).toHaveLength(10);
  expect(course.topics.flatMap(topic=>topic.exercises)).toHaveLength(200);
  expect(calculusAdditions).toHaveLength(100);
  for(const topic of course.topics){expect(topic.exercises).toHaveLength(20);expect(calculusAdditions.filter(item=>item.topicId===topic.id)).toHaveLength(10);}
  expect(new Set(course.topics.flatMap(topic=>topic.exercises.map(item=>item.prompt))).size).toBe(200);
  expect(calculusExamSets).toHaveLength(4);
  expect(new Set(calculusExamSets.flatMap(set=>set.ids)).size).toBe(20);
  expect(new Set(calculusExamSets[3].ids.map(id=>registered(id).topicId)).size).toBe(10);
 });
 it('preserves every one of the 840 pre-expansion curriculum bindings',()=>{
  const legacy=Object.entries(bindings.exercises).filter(([id])=>!/^CALC_E/.test(id)||Number(id.slice(6))<=120).sort(([a],[b])=>a.localeCompare(b));
  expect(legacy).toHaveLength(840);
  expect(createHash('sha256').update(JSON.stringify(legacy)).digest('hex')).toBe('faa3cfa7812762a57f999b0db7a83d8e628e962d1d1febc421ba5fe6ed104200');
 });
 it('preserves all original Calculus identities and the shared curriculum grader',()=>{
  const legacy=Object.entries(bindings.exercises).filter(([id])=>/^CALC_E/.test(id)&&Number(id.slice(6))<=100).sort(([a],[b])=>a.localeCompare(b));
  expect(legacy).toHaveLength(100);
  expect(createHash('sha256').update(JSON.stringify(legacy)).digest('hex')).toBe('c2199f8353b6bf320337524067956737670cc7cf68074244d9e9b1a6626d78ca');
  expect(bindings.graderSha256).toBe('eb325a8d29079351ec20f8a27d393c3f39e4b906714a108cb14edfd5a46f9513');
 });
 it.each(calculusAdditions)('renders $item.id with vetted math, source identity and appropriate response mode',entry=>{
  const exercise=registered(entry.item.id);
  expect(exercise.topicId).toBe(entry.topicId);expect(exercise.skillId).toBe(entry.item.skillId);
  const text=[entry.item.prompt,entry.item.explanation,...entry.item.rubric??[]].join('\n');
  for(const match of text.matchAll(/\$([^$]+)\$/g))expect(formulas).toHaveProperty(match[1]);
  const markup=renderToStaticMarkup(<MemoryRouter><ExercisePrompt exercise={exercise}/><AnswerControls exercise={exercise} answer={{kind:'text',value:''}} onChange={()=>{}} disabled={false}/></MemoryRouter>);
  const host=document.createElement('div');host.innerHTML=markup;
  expect(host.querySelectorAll('math').length).toBeGreaterThan(0);
  expect(host.querySelector('.ds-exam-question')).not.toBeNull();
  expect(host.textContent).not.toContain('$');
  expect(host.querySelectorAll('script,iframe,img')).toHaveLength(0);
  if(entry.question.parts){expect(host.querySelectorAll('textarea')).toHaveLength(entry.question.parts.length);expect(entry.question.points).toBe(entry.question.parts.reduce((sum,part)=>sum+part.points,0));}
  else expect(host.querySelector('input')).not.toBeNull();
 });
 it('renders all four sets with real exercise routes and no automatic open score',()=>{
  const markup=renderToStaticMarkup(<MemoryRouter><CalculusExamPractice/></MemoryRouter>);
  const host=document.createElement('div');host.innerHTML=markup;
  expect(host.querySelectorAll('details')).toHaveLength(4);
  expect(host.querySelectorAll('a')).toHaveLength(20);
  expect(host.textContent).toContain('not an automatically awarded score');
 });
 it('escapes unknown formulas and written content rather than interpreting HTML',()=>{
  expect(renderToStaticMarkup(<MathText text={'$\\unknown{<script>}$'}/>)).not.toContain('<script>');
  expect(writtenParts('',3)).toEqual(['','','']);
  expect(writtenParts('old plain-text draft',3)).toBeNull();
  expect(writtenParts('["a","b","c"]',3)).toEqual(['a','b','c']);
  expect(writtenParts('[1,2,3]',3)).toBeNull();
  const exercise=registered('CALC_E101'),answer={kind:'text' as const,value:JSON.stringify(['<script>test</script>','a=3','b=0'])};
  const markup=renderToStaticMarkup(<Feedback exercise={exercise} answer={answer} result={gradeCurriculumResponse(exercise,answer)}/>);
  expect(markup).toContain('Ungraded response');expect(markup).toContain('Part a)');expect(markup).not.toContain('<script>');expect(markup).not.toContain('[&quot;');
 });
 it.each(calculusAdditions.filter(entry=>entry.item.kind==='integer'))('grades $item.id exactly and creates recoverable review evidence',async entry=>{
  const exercise=registered(entry.item.id),repo=repository(),service=new PracticeService(repo);
  try{
   const expected=entry.item.answer!;
   expect(gradeCurriculumResponse(exercise,{kind:'text',value:expected})).toMatchObject({status:'GRADED',correct:true});
   expect(gradeCurriculumResponse(exercise,{kind:'text',value:expected.startsWith('-')?'-000'+expected.slice(1):'+000'+expected})).toMatchObject({status:'GRADED',correct:true});
   expect(gradeCurriculumResponse(exercise,{kind:'text',value:'1/2'}).status).toBe('INVALID');
   const start=await repo.load(),draft=await service.start(exercise.id,'calc-review',start.data);
   await service.submit(draft.data.attempts[0],{kind:'text',value:String(Number(expected)+1)},'calc-submit',draft.data);
   const state=await repo.load(),attempt=state.data.attempts[0];
   expect(resolveAttempt(attempt).status).toBe('AVAILABLE');expect(feedbackFor(attempt)).toMatchObject({correct:false});
   const evidence=deriveEvidence(state.data.attempts,[],Date.parse(time));
   expect(evidence.mistakes).toHaveLength(1);expect(evidence.groups[0].skill.id).toBe(exercise.skillId);
   const plan=buildStudySession(evidence,{minutes:30,subjectId:exercise.subjectId,topicId:exercise.topicId});
   expect(plan.some(action=>action.to.includes('calc-review'))).toBe(true);
   expect(deriveProgress(toBackup(state.data),Date.parse(time)).evidence.observations[0]).toMatchObject({correct:false,skillId:exercise.skillId});
  }finally{repo.close();}
 });
 it.each(calculusAdditions.filter(entry=>entry.item.kind==='open'))('retains multipart $item.id without inventing mastery',async entry=>{
  const exercise=registered(entry.item.id),repo=repository(),service=new PracticeService(repo);
  try{
   const start=await repo.load(),draft=await service.start(exercise.id,'calc-written',start.data);
   const answer={kind:'text' as const,value:JSON.stringify(entry.question.parts!.map((_,index)=>`Reasoning ${index+1}`))};
   const saved=await service.save(draft.data.attempts[0],answer,draft.data);
   expect((await repo.load()).data.attempts[0].answer).toEqual(answer);
   const submitted=await service.submit(saved.data.attempts[0],answer,'calc-open-submit',saved.data);
   expect(feedbackFor(submitted.data.attempts[0])).toMatchObject({status:'NOT_AUTOGRADABLE'});
   const progress=deriveProgress(toBackup(submitted.data),Date.parse(time));
   expect(progress.evidence.observations).toEqual([]);expect(progress.evidence.open).toHaveLength(1);
   expect(deriveEvidence(submitted.data.attempts,[],Date.parse(time)).mistakes).toEqual([]);
  }finally{repo.close();}
 });
});
