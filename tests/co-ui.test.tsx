// @vitest-environment jsdom
import {act} from 'react';
import {createRoot,type Root} from 'react-dom/client';
import {MemoryRouter} from 'react-router';
import {beforeEach,afterEach,describe,it,expect,vi} from 'vitest';
import Workspace from '../src/co/Workspace';
import tools from '../src/co/tools.json';
import {COStudyMode} from '../src/co/COStudyMode';
import {topicStudy} from '../src/topic-study/content';
import {LearnMode,FlashcardMode} from '../src/topic-study/AuthoredViews';
import {TopicPractice} from '../src/topic-study/TopicPractice';
import {LearningProvider} from '../src/learning/LearningProvider';
import {repository} from './helpers/learning';
Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});
let root:Root,host:HTMLDivElement;
beforeEach(()=>{host=document.createElement('div');document.body.append(host);root=createRoot(host);});
afterEach(async()=>{await act(async()=>root.unmount());host.remove();vi.restoreAllMocks();});
async function click(name:string){const b=[...host.querySelectorAll('button')].find(b=>b.textContent===name);expect(b,name).toBeDefined();await act(async()=>b!.click());}
async function waitFor(selector:string){for(let i=0;i<150&&!host.querySelector(selector);i++)await act(async()=>{await new Promise(r=>setTimeout(r,10));});expect(host.querySelector(selector),selector).not.toBeNull();}
async function change(selector:string,value:string){const el=host.querySelector<HTMLInputElement|HTMLSelectElement>(selector)!;expect(el).not.toBeNull();await act(async()=>{Object.getOwnPropertyDescriptor(el.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype,'value')!.set!.call(el,value);el.dispatchEvent(new Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));});}
const expected:Record<string,string>={boolean:'Complete two-input truth table',representation:'5.5',isa:'64',address:'0x24, 0x25, 0x2C, 0x2D',memory:'32768',cache:'Read 0 of 5',pipeline:'9',amdahl:'0.5',vm:'0x734'};
describe('accessible deterministic CO workspaces',()=>{
 it.each(tools.filter(t=>t.id!=='assembly'))('$id calculation/reset is keyboard operable and never writes student data',async tool=>{const set=vi.spyOn(Storage.prototype,'setItem');await act(async()=>root.render(<MemoryRouter><Workspace tool={tool}/></MemoryRouter>));expect(host.querySelector('[aria-label="Workspace result"]')?.textContent).toContain(expected[tool.id]);const before=host.querySelector('.ds-co-result')!.textContent;
  expect([...host.querySelectorAll('input,select')].every(el=>el.closest('label')?.textContent)).toBe(true);expect(host.textContent).toContain(tool.assumptions);
  if(tool.id==='boolean')await change('select','nand');else if(tool.id==='pipeline')await change('select','no');else await change('input','');
  await act(async()=>host.querySelector('form')!.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  if(['boolean','pipeline'].includes(tool.id))expect(host.querySelector('.ds-co-result')?.textContent).not.toBe(before);else expect(host.querySelector('[role="alert"]')).not.toBeNull();
  await click('Reset workspace');expect(host.querySelector('.ds-co-result')?.textContent).toBe(before);expect(host.querySelector('[role="alert"]')).toBeNull();expect(set).not.toHaveBeenCalled();
 });
 it('cache read steps refresh LRU, evict, reverse exactly and reset without stale state',async()=>{await act(async()=>root.render(<MemoryRouter><Workspace tool={tools.find(t=>t.id==='cache')!}/></MemoryRouter>));for(let i=0;i<3;i++)await click('Next read');expect(host.textContent).toContain('HIT');expect(host.textContent).toContain('Set 0: 1 → 0');await click('Next read');expect(host.textContent).toContain('Evicted tag 1');await click('Previous read');expect(host.textContent).toContain('Set 0: 1 → 0');await change('input','7');expect([...host.querySelectorAll('button')].find(b=>b.textContent==='Next read')!.disabled).toBe(true);await click('Calculate');expect(host.textContent).toContain('Read 0 of 5');await click('Next read');await click('Reset workspace');expect(host.textContent).toContain('Read 0 of 5');expect(host.textContent).toContain('Set 0: empty');});
 it('VM permission changes expose a fault with no physical address',async()=>{await act(async()=>root.render(<MemoryRouter><Workspace tool={tools.find(t=>t.id==='vm')!}/></MemoryRouter>));const selects=host.querySelectorAll('select');await act(async()=>{selects[0].value='no';selects[0].dispatchEvent(new Event('change',{bubbles:true}));});await click('Calculate');expect(host.querySelector('.ds-co-result')?.textContent).toContain('NOT_PRESENT');expect(host.querySelector('.ds-co-result')?.textContent).not.toContain('Physical address');});
});
describe('complete CO learning UI',()=>{
 it.each(topicStudy.topics.filter(t=>t.subjectId==='CSE1400_CO'))('$id has a real lazy lesson, flashcards, practice or rubric/tool, with no mastery mutation',async topic=>{
  const repo=repository();const createRepository=()=>repo;await repo.load();const before=await repo.exportBackup();
  const render=async(mode:'learn'|'flashcards'|'practice')=>{const pilot=topic.id==='CO_T04_DATA_REP_RADIX_INTEGER';await act(async()=>root.render(<MemoryRouter><LearningProvider createRepository={createRepository}>{pilot?(mode==='learn'?<LearnMode topic={topic}/>:mode==='flashcards'?<FlashcardMode topic={topic}/>:<TopicPractice topicId={topic.id}/>):<COStudyMode topic={topic} mode={mode}/>}</LearningProvider></MemoryRouter>));};
  await render('learn');await waitFor('.ds-lesson-block');expect(host.querySelector('.ds-lesson-introduction')).not.toBeNull();expect(host.querySelector('.ds-lesson-recap')).not.toBeNull();
  await render('flashcards');await waitFor('#card-prompt');const first=host.querySelector('#card-prompt')!.textContent;await click('Reveal answer');expect(host.querySelector<HTMLElement>('#card-answer')!.hidden).toBe(false);await click('Next card');expect(host.querySelector<HTMLElement>('#card-answer')!.hidden).toBe(true);await click('Shuffle cards');await click('Reset order');expect(host.querySelector('#card-prompt')!.textContent).toBe(first);
  await render('practice');await waitFor('.ds-practice-card,.ds-lesson-block,.ds-tool-card');expect(host.textContent).not.toMatch(/\d+%|predicted grade/);expect(await repo.exportBackup()).toEqual(before);
 });
});
