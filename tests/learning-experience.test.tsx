// @vitest-environment jsdom
import {act,type ReactNode} from 'react';
import {createRoot,type Root} from 'react-dom/client';
import {MemoryRouter} from 'react-router';
import {afterEach,beforeEach,describe,expect,it} from 'vitest';
import {MasteryCard} from '../src/progress/IndexCard';
import {FlashcardMode,LearnMode} from '../src/topic-study/AuthoredViews';
import {MentalMap} from '../src/topic-study/AcademicViews';
import {mapStructure,topicStudy} from '../src/topic-study/content';
import coBoolean from '../src/co/topics/CO_T02_BOOLEAN_KMAP.json';
import coAssembly from '../src/co/topics/CO_T06_ASSEMBLY_X86_64.json';
import rlFol from '../src/rl/topics/RL_T02_FOL.json';
import ipBasics from '../src/ip/topics/IP_T01_JAVA_BASICS.json';
import type {Lesson} from '../src/topic-study/types';

let host:HTMLDivElement,root:Root;
beforeEach(()=>{host=document.createElement('div');document.body.append(host);root=createRoot(host);});
afterEach(async()=>{await act(async()=>root.unmount());host.remove();});
async function render(node:ReactNode){await act(async()=>root.render(<MemoryRouter>{node}</MemoryRouter>));}

it('renders the real mastery score as a compact accessible progress value',async()=>{
 await render(<MasteryCard value={{id:'topic',name:'Topic',index:34,confidence:'Low',covered:1,total:4,recent:1,why:['Evidence rule'],strongest:['Boolean evaluation'],review:[],missing:['SoP']}}/>);
 const progress=host.querySelector<HTMLElement>('[role=progressbar]')!;
 expect(progress.getAttribute('aria-valuenow')).toBe('34');
 expect(progress.querySelector<HTMLElement>('span')?.style.width).toBe('34%');
 expect(host.textContent).toContain('1 / 4 skills practiced reliably');
 expect(host.querySelector('details')?.open).toBe(false);
});

describe.each(['CO_T02_BOOLEAN_KMAP','CO_T06_ASSEMBLY_X86_64','RL_T02_FOL','IP_T01_JAVA_BASICS'])('learning experience for %s',topicId=>{
 const topic=topicStudy.topics.find(item=>item.id===topicId)!;
 const contentByTopic:Record<string,{lesson:Lesson}>={CO_T02_BOOLEAN_KMAP:coBoolean as {lesson:Lesson},CO_T06_ASSEMBLY_X86_64:coAssembly as {lesson:Lesson},RL_T02_FOL:rlFol as {lesson:Lesson},IP_T01_JAVA_BASICS:ipBasics as {lesson:Lesson}};
 it('starts with a concise overview and keeps real instruction ahead of collapsed evidence',async()=>{
  await render(<LearnMode topic={topic} content={contentByTopic[topicId].lesson}/>);
  expect(host.querySelector('.ds-learn-intro')).not.toBeNull();
  expect(host.querySelectorAll('.ds-learn-intro>p:not(.ds-study-eyebrow)').length).toBeGreaterThanOrEqual(1);
  expect(host.querySelectorAll('.ds-lesson-block').length).toBeGreaterThanOrEqual(3);
  expect(host.querySelectorAll('.ds-lesson-copy p').length).toBeGreaterThanOrEqual(4);
  expect([...host.querySelectorAll<HTMLDetailsElement>('.ds-authored-scope details')].every(item=>!item.open)).toBe(true);
 });
 it('renders a connected interactive hierarchy with routed nodes',async()=>{
  await render(<MentalMap topic={topic}/>);const structure=mapStructure(topic);
  expect(host.querySelectorAll('.ds-map-node')).toHaveLength(topic.subtopics.length+topic.subtopics.flatMap(item=>item.skills).length);
  expect(host.querySelector('.ds-map-connectors')).not.toBeNull();
  expect(host.querySelectorAll('.ds-map-main-branch')).toHaveLength(topic.subtopics.length);
  expect(host.querySelectorAll('.ds-map-skill-branch')).toHaveLength(topic.subtopics.flatMap(item=>item.skills).length);
  expect([...host.querySelectorAll('.ds-map-connectors path')].every(path=>path.getAttribute('d')?.includes(' C '))).toBe(true);
  expect(host.querySelectorAll('.ds-map-subtopic')).toHaveLength(topic.subtopics.length);
  expect(host.querySelectorAll<HTMLAnchorElement>('.ds-map-node a')[0]?.getAttribute('href')).toContain('/learn');
  expect(host.querySelectorAll<HTMLAnchorElement>('.ds-map-node a')[0]?.hash).toBe(`#${topic.subtopics[0].id}`);
  expect(host.querySelector('.ds-map-relations')?.textContent).toContain(structure.prerequisites.length?'is a prerequisite for':'No prerequisite');
 });
});

it('reorganizes and focuses the map without changing canonical topology',async()=>{
 const topic=topicStudy.topics.find(item=>item.id==='CO_T02_BOOLEAN_KMAP')!,before=structuredClone(mapStructure(topic));
 await render(<MentalMap topic={topic}/>);const first=host.querySelector('.ds-map-subtopic')?.textContent;
 const reorganize=[...host.querySelectorAll('button')].find(button=>button.textContent==='Reorganize')!;
 await act(async()=>reorganize.click());expect(host.querySelector('.ds-map-subtopic')?.textContent).not.toBe(first);
 const focus=[...host.querySelectorAll('button')].find(button=>button.textContent==='Focus mode')!;
 await act(async()=>focus.click());expect(focus.getAttribute('aria-pressed')).toBe('true');expect(mapStructure(topic)).toEqual(before);
});

it('renders a single flippable card with visible deterministic progress',async()=>{
 const topic=topicStudy.topics.find(item=>item.id==='CO_T02_BOOLEAN_KMAP')!;
 await render(<FlashcardMode topic={topic} content={(coBoolean as {cards:import('../src/topic-study/types').Flashcard[]}).cards}/>);
 const progress=host.querySelector<HTMLElement>('.ds-flashcard-progress')!,flip=host.querySelector<HTMLButtonElement>('.ds-flashcard-flip')!;
 expect(progress.getAttribute('role')).toBe('progressbar');expect(progress.getAttribute('aria-valuenow')).toBe('1');expect(host.querySelectorAll('.ds-study-card')).toHaveLength(1);
 expect(flip.getAttribute('aria-pressed')).toBe('false');await act(async()=>flip.click());expect(flip.getAttribute('aria-pressed')).toBe('true');
});
