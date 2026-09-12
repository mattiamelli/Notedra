// @vitest-environment jsdom
import {act} from 'react';
import {createRoot,type Root} from 'react-dom/client';
import {MemoryRouter} from 'react-router';
import {beforeAll,beforeEach,afterEach,it,expect,vi} from 'vitest';
import {AppRoutes} from '../src/App';
import {LearningProvider} from '../src/learning/LearningProvider';
import {repository} from './helpers/learning';
import {readFileSync} from 'node:fs';
import {Feedback,ExercisePrompt} from '../src/practice/ExerciseParts';
import {gradeResponse} from '../src/practice/runtime';
import {allExercises} from '../src/practice/catalog';
import type {GradeResult} from '../src/practice/types';
import profiles from '../src/enrichment/feedback.json';
import TopicEnrichment from '../src/enrichment/TopicEnrichment';
import guides from '../src/enrichment/guided.json';
import {MentalMap} from '../src/topic-study/AcademicViews';
import {topicStudy,mapStructure} from '../src/topic-study/content';
Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});
let root:Root,host:HTMLDivElement;
beforeAll(async()=>{await Promise.all([import('../src/practice/ExercisePage'),import('../src/practice/AttemptPage')]);});
beforeEach(()=>{host=document.createElement('div');document.body.append(host);root=createRoot(host);vi.spyOn(window,'scrollTo').mockImplementation(()=>{});});
afterEach(async()=>{await act(async()=>root.unmount());host.remove();vi.restoreAllMocks();});
async function button(name:string){for(let i=0;i<150;i++){const b=[...host.querySelectorAll('button')].find(b=>b.textContent===name);if(b&&!b.disabled){await act(async()=>b.click());await settle();return;}await settle();}throw new Error('Button never enabled: '+name);}
async function settle(){await act(async()=>{await new Promise(resolve=>setTimeout(resolve,30));});}
async function waitText(text:string){for(let i=0;i<150;i++){await settle();if(host.textContent?.includes(text))return;}expect(host.textContent).toContain(text);}
async function fill(element:HTMLInputElement|HTMLTextAreaElement,value:string){await act(async()=>{Object.getOwnPropertyDescriptor(element instanceof HTMLInputElement?HTMLInputElement.prototype:HTMLTextAreaElement.prototype,'value')!.set!.call(element,value);element.dispatchEvent(new Event('input',{bubbles:true}));});}
it.each(profiles.filter(p=>p.exerciseId.startsWith('ds.practice.enrich-')))('$exerciseId wrong answer teaches and retries without overwriting',async profile=>{
 const repo=repository();await act(async()=>root.render(<MemoryRouter initialEntries={['/practice/'+profile.exerciseId]}><LearningProvider createRepository={()=>repo}><AppRoutes/></LearningProvider></MemoryRouter>));await waitText('Start exercise');await button('Start exercise');await waitText('Submit answer');for(const [index,value] of profile.paths[0].answer.split(',').entries())await fill(host.querySelectorAll<HTMLInputElement>('.ds-practice-answer input')[index],value);await button('Submit answer');await waitText('Incorrect · 0 / 1');
 const feedback=host.querySelector('.ds-practice-feedback')!;for(const label of ['Your submitted answer','Reference answer','Why this answer differs','Reasoning','Remember'])expect(feedback.textContent).toContain(label);expect(feedback.textContent).toContain(profile.paths[0].why);expect(feedback.textContent).toContain(profile.remember);
 let submitted!:(Awaited<ReturnType<typeof repo.load>>)['data']['attempts'][number];await act(async()=>{submitted=(await repo.load()).data.attempts[0];});await button('Retry as new attempt');await waitText('Submit answer');let after!:(Awaited<ReturnType<typeof repo.load>>)['data']['attempts'];await act(async()=>{after=(await repo.load()).data.attempts;});expect(after).toHaveLength(2);expect(after[0]).toEqual(submitted);expect(after[1].attemptId).not.toBe(submitted.attemptId);expect(host.querySelector('.ds-practice-feedback')).toBeNull();
});
it.each(['INVALID','INCOMPLETE','ERROR','NOT_AUTOGRADABLE'] as const)('%s never renders wrong-answer explanations or a score',async status=>{await act(async()=>root.render(<Feedback exercise={allExercises.at(-1)!} answer={{kind:'text',value:'bad'}} result={{status,message:'Controlled unavailable result'} as GradeResult}/>));expect(host.textContent).toContain('No item score was assigned');expect(host.textContent).not.toContain('Remember');expect(host.textContent).not.toContain('Incorrect');});
it.each(guides)('$id accepts any open attempt then reveals conditions without grading',async guide=>{
 const repo=repository();await repo.load();const before=await repo.exportBackup();await act(async()=>root.render(<MemoryRouter><TopicEnrichment topicId={guide.topicId} mode="practice"/></MemoryRouter>));const reveal=[...host.querySelectorAll('button')].find(b=>b.textContent==='Reveal self-check and reference')!;expect(reveal.disabled).toBe(true);
 const textarea=host.querySelector('textarea')!;textarea.focus();expect(document.activeElement).toBe(textarea);await fill(textarea,'A different complete proof or diagram can be valid.');await button('Reveal self-check and reference');expect(host.textContent).toContain('What a valid solution must establish');expect(host.textContent).toContain('Common failure modes');expect(host.textContent).toContain('One valid reference approach');expect(host.querySelector('.ds-practice-feedback,[data-grade]')).toBeNull();expect(host.textContent).not.toContain('item point');expect(await repo.exportBackup()).toEqual(before);await button('Reset reasoning');expect(textarea.value).toBe('');
});
it('adds optional cards/cues without adding canonical map topology or student writes',async()=>{
 const topic=topicStudy.topics.find(t=>t.id==='RL_T01_PROP_LOGIC')!,before=structuredClone(mapStructure(topic));await act(async()=>root.render(<MemoryRouter><MentalMap topic={topic}/><TopicEnrichment topicId={topic.id} mode="mental-map"/></MemoryRouter>));expect(host.querySelectorAll('.ds-map-node')).toHaveLength(topic.subtopics.length+topic.subtopics.flatMap(s=>s.skills).length);expect(mapStructure(topic)).toEqual(before);expect(host.textContent).toContain('Optional study cues');
 await act(async()=>root.render(<MemoryRouter><TopicEnrichment topicId={topic.id} mode="flashcards"/></MemoryRouter>));const summary=[...host.querySelectorAll('summary')].find(s=>s.textContent==='Reveal supplemental answer')!;await act(async()=>summary.click());expect(summary.parentElement?.hasAttribute('open')).toBe(true);expect(host.querySelectorAll('article')).toHaveLength(2);expect(host.textContent).not.toContain('item point');
});

it('review regression: shows the selected Java output rather than an internal option ID',async()=>{
 const e=allExercises.find(e=>e.task.kind==='java-output')!;if(e.task.kind!=='java-output')throw new Error('missing pilot');const option=e.task.options.find(o=>o.id!==e.reference.value[0])!;const answer={kind:'choice' as const,value:[option.id]};
 await act(async()=>root.render(<Feedback exercise={e} answer={answer} result={gradeResponse(e,answer)}/>));expect(host.querySelector('pre')?.textContent).toBe(option.output);
});

it('review regression: long exercise prompts wrap at narrow widths',async()=>{
 const style=document.createElement('style');style.textContent=readFileSync('src/enrichment/enrichment.css','utf8');document.head.append(style);
 try{await act(async()=>root.render(<MemoryRouter><ExercisePrompt exercise={allExercises.find(e=>e.id==='ds.practice.enrich-carry-overflow')!}/></MemoryRouter>));expect(getComputedStyle(host.querySelector('h2')!).whiteSpace).toBe('normal');expect(getComputedStyle(host.querySelector('h2')!).overflowWrap).toBe('anywhere');}finally{style.remove();}
});
