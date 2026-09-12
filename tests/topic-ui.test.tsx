// @vitest-environment jsdom
import { act } from 'react';
import { createRoot,type Root } from 'react-dom/client';
import { BrowserRouter,MemoryRouter } from 'react-router';
import { afterEach,beforeEach,describe,it,expect,vi } from 'vitest';
import { AppRoutes } from '../src/App';
import { LearningProvider, useLearning } from '../src/learning/LearningProvider';
import { repository } from './helpers/learning';
import { topicStudy,lessons,flashcards,shuffledIds } from '../src/topic-study/content';
import { studyModes } from '../src/topic-study/types';
import { studyPath } from '../src/topic-study/AcademicViews';
import { catalog,allExercises,exercisePath,attemptPath } from '../src/practice/catalog';
import { PracticeService } from '../src/practice/service';
Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});
let container:HTMLDivElement,root:Root;
beforeEach(()=>{container=document.createElement('div');document.body.append(container);root=createRoot(container);vi.spyOn(window,'scrollTo').mockImplementation(()=>{});});
afterEach(async()=>{await act(async()=>root.unmount());container.remove();vi.restoreAllMocks();});
function StorageProbe(){const learning=useLearning();return <output data-storage>{learning?.phase}:{learning?.snapshot?.data.resume?.topicId}</output>;}

async function settleRoutes(){const loading=()=>[...container.querySelectorAll('[role="status"]')].some(n=>/^Loading /.test(n.textContent??''));for(let i=0;i<150&&loading();i++)await act(async()=>{await new Promise(r=>setTimeout(r,10));});expect(loading(),'lazy route resolved').toBe(false);}
async function render(path:string,browser=false,repo?:ReturnType<typeof repository>){
 if(browser)window.history.replaceState(null,'',path);
 const children=repo?<LearningProvider createRepository={()=>repo}><StorageProbe/><AppRoutes/></LearningProvider>:<AppRoutes/>;
 await act(async()=>root.render(browser?<BrowserRouter>{children}</BrowserRouter>:<MemoryRouter key={path} initialEntries={[path]}>{children}</MemoryRouter>));
 await settleRoutes();
 if(repo){const expected='ready:'+path.split('/')[2];for(let turn=0;turn<100&&container.querySelector('[data-storage]')?.textContent!==expected;turn++)await act(async()=>{await new Promise(resolve=>setTimeout(resolve,5));});expect(container.querySelector('[data-storage]')?.textContent).toBe(expected);}
}
async function click(selector:string){const el=container.querySelector<HTMLElement>(selector);expect(el,selector).not.toBeNull();await act(async()=>el!.click());await settleRoutes();}
async function button(name:string){const el=[...container.querySelectorAll('button')].find(b=>b.textContent===name);expect(el,name).toBeDefined();await act(async()=>el!.click());await settleRoutes();}
const pilots=lessons.map(l=>topicStudy.topics.find(t=>t.id===l.topicId)!);
describe('topic learning routes and modes',()=>{
 it.each(studyModes)('all 43 topics resolve directly in $id mode',async mode=>{
  for(const topic of topicStudy.topics){await render(studyPath(topic,mode.id));expect(container.querySelector('h1')?.textContent).toBe(topic.name);expect(container.querySelectorAll('[role="tab"]')).toHaveLength(7);expect(container.querySelector('[aria-selected="true"]')?.textContent).toBe(mode.label);expect(container.querySelectorAll('main')).toHaveLength(1);}
 });
 it.each(['/co/CO_T04_DATA_REP_RADIX_INTEGER/nope','/co/IP_T02_CONTROL_FLOW/learn','/ip/MISSING/flashcards','/rl/RL_T01_PROP_LOGIC/learn/extra'])('rejects invalid topic/mode %s',async path=>{await render(path);expect(container.querySelector('h1')?.textContent).toBe('Page not found');});
 it('renders canonical description, prerequisites, grouped skills and honest broad/unknown sources',async()=>{
  const ip=pilots[2];await render(studyPath(ip));expect(container.textContent).toContain(ip.description);expect(container.querySelector('a[href="/ip/IP_T01_JAVA_BASICS"]')?.textContent).toBe('Java basics and data');
  for(const sub of ip.subtopics){expect(container.querySelector(`[id="${sub.id}"] h3`)?.textContent).toBe(sub.name);for(const skill of sub.skills)expect(container.querySelector(`[id="${skill.id}"]`)?.textContent).toContain(skill.description);}
  expect(container.textContent).toContain('This reference covers a broad part of the document');expect(container.textContent).toContain('An exact supporting page is not recorded');expect(container.querySelectorAll('a[href$=".pdf"]')).toHaveLength(0);expect(container.textContent).not.toMatch(/\d+%|predicted grade|exam probability/);
 });
 it('provides a canonical map and text alternative with keyboard-accessible links',async()=>{
  const t=pilots[0];await render(studyPath(t,'mental-map'));expect(container.querySelectorAll('.ds-map-node')).toHaveLength(t.subtopics.length+t.subtopics.flatMap(s=>s.skills).length);
  const outline=[...container.querySelectorAll('summary')].find(s=>s.textContent==='Text outline of this map');expect(outline).toBeDefined();expect(container.textContent).toContain('is a prerequisite for');expect(container.querySelector('.ds-study-map a')?.getAttribute('href')).toContain('#CO_ST04');
 });
 it.each(pilots)('runs the complete $subjectId topic modes and retains its two original Practice items alongside new course items',async topic=>{
  await render(studyPath(topic));await click('#study-mode-1');expect(container.querySelectorAll('.ds-lesson-block')).toHaveLength(lessonBlocks(topic.id));
  await click('#study-mode-2');expect(container.querySelector('.ds-study-map')).not.toBeNull();await click('#study-mode-3');expect(container.querySelector('#card-prompt')).not.toBeNull();await button('Reveal answer');expect(container.querySelector<HTMLElement>('#card-answer')?.hidden).toBe(false);
  await click('#study-mode-4');const expected=allExercises.filter(e=>e.topicId===topic.id);expect(catalog.filter(e=>e.topicId===topic.id)).toHaveLength(2);expect(container.querySelectorAll('.ds-practice-card')).toHaveLength(topic.subjectId==='CSE1400_CO'?8:topic.subjectId==='CSE1300_RL'?13:2);expect([...container.querySelectorAll('.ds-practice-card>a')].map(a=>a.getAttribute('href'))).toEqual(expected.map(exercisePath));await click(`a[href="${exercisePath(expected[0])}"]`);expect(container.querySelector('h1')?.textContent).toBe(expected[0].title);
 });
 it('completed IP modes retain overview/map and show real study content with honest unavailable global features',async()=>{
  const t=topicStudy.topics.find(t=>t.id==='IP_T01_JAVA_BASICS')!;await render(studyPath(t));expect(container.textContent).toContain(t.description);
  await click('#study-mode-1');expect(container.textContent).toContain('Track both the value and its type');expect(container.querySelectorAll('.ds-lesson-block')).toHaveLength(8);await click('#study-mode-2');expect(container.querySelector('.ds-study-map')).not.toBeNull();
  await click('#study-mode-3');expect(container.textContent).toContain('Card 1 of 10');expect(container.querySelector('#card-prompt')).not.toBeNull();await click('#study-mode-4');expect(container.querySelectorAll('.ds-practice-card')).toHaveLength(5);
  await click('#study-mode-5');expect(container.textContent).toContain('Authored exam-style practice');expect(container.textContent).toContain('No authored 60-minute assignment targets this topic');await click('#study-mode-6');expect(container.textContent).toContain('Student storage is not connected.');expect(container.textContent).not.toMatch(/Step \d|mastery:|streak/);
 });
 it('Learn and Flashcards deep links survive remount and BrowserRouter Back/Forward',async()=>{
  const t=pilots[0];await render(studyPath(t,'learn'),true);await click('#study-mode-3');expect(window.location.pathname).toBe(studyPath(t,'flashcards'));
  await act(async()=>{const p=new Promise(r=>window.addEventListener('popstate',r,{once:true}));window.history.back();await p;});expect(container.querySelector('[aria-selected="true"]')?.textContent).toBe('Learn');
  await act(async()=>{const p=new Promise(r=>window.addEventListener('popstate',r,{once:true}));window.history.forward();await p;});expect(container.querySelector('#card-prompt')).not.toBeNull();
  await act(async()=>root.unmount());root=createRoot(container);await render(studyPath(t,'flashcards'));expect(container.querySelector('#card-prompt')).not.toBeNull();expect(container.querySelector<HTMLElement>('#card-answer')?.hidden).toBe(true);
 });
 it('review regression: canonical map links focus the requested Overview node',async()=>{
  const t=pilots[0];await render(studyPath(t,'mental-map'),true);const sub=t.subtopics[1];await click(`.ds-study-map a[href="${studyPath(t)}#${sub.id}"]`);expect(window.location.hash).toBe('#'+sub.id);expect(document.activeElement?.id).toBe(sub.id);
 });
 it('keyboard mode navigation follows URL and retains focus on the active tab',async()=>{
  await render(studyPath(pilots[0]),true);const first=container.querySelector<HTMLElement>('#study-mode-0')!;first.focus();await act(async()=>first.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true})));
  expect(window.location.pathname).toBe(studyPath(pilots[0],'learn'));expect(document.activeElement?.id).toBe('study-mode-1');
 });
 it('flashcards reveal/hide, navigate, shuffle/reset without storage or identity changes',async()=>{
  const repo=repository();await render(studyPath(pilots[0],'flashcards'),false,repo);const before=await repo.exportBackup();const cards=flashcards.filter(c=>c.topicId===pilots[0].id);
  expect(container.querySelector('#card-prompt')?.textContent).toBe(cards[0].prompt);await button('Reveal answer');expect(container.querySelector('#card-answer')?.textContent).toContain(cards[0].answer);await button('Hide answer');expect(container.querySelector<HTMLElement>('#card-answer')?.hidden).toBe(true);
  await button('Previous card');expect(container.querySelector('#card-prompt')?.textContent).toBe(cards[7].prompt);await button('Next card');expect(container.querySelector('#card-prompt')?.textContent).toBe(cards[0].prompt);
  vi.spyOn(Math,'random').mockReturnValue(0);await button('Shuffle cards');expect(container.querySelector('#card-prompt')?.textContent).toBe(cards[1].prompt);expect(container.querySelector('.ds-study-card .ds-study-id')).toBeNull();
  await button('Reset order');expect(container.querySelector('#card-prompt')?.textContent).toBe(cards[0].prompt);expect(await repo.exportBackup()).toEqual(before);
  expect([...shuffledIds(cards.map(c=>c.id),()=>0)].sort()).toEqual(cards.map(c=>c.id).sort());
 });
 it('topic Practice resumes/reviews the same immutable saved attempt, without another service',async()=>{
  const repo=repository();const state=await repo.load();const service=new PracticeService(repo);const exercise=catalog[0];const saved=await service.start(exercise.id,'topic-test',state.data);
  await render(studyPath(pilots[0],'practice'),false,repo);const path=attemptPath(exercise,'topic-test');expect(container.querySelector(`a[href="${path}"]`)?.textContent).toContain('Resume draft');await click(`a[href="${path}"]`);expect(container.querySelector('h1')?.textContent).toBe(exercise.title);
  expect((await repo.load()).data.attempts).toHaveLength(1);expect(saved.data.attempts[0].exercise?.version).toBe((await repo.load()).data.attempts[0].exercise?.version);
 });
});
function lessonBlocks(id:string){return lessons.find(l=>l.topicId===id)!.blocks.length;}
