import expansionIP from '../src/expansion/ip.json';
// @vitest-environment jsdom
import ipDefinitions from '../src/ip/practice.json';
import { IDBFactory } from 'fake-indexeddb';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppRoutes } from '../src/App';
import { LearningProvider } from '../src/learning/LearningProvider';
import { LearningError, emptyBackup, type LoadedState } from '../src/learning/contracts';
import { catalog, exercisePath, attemptPath } from '../src/practice/catalog';
import { PracticeService } from '../src/practice/service';
import { repository } from './helpers/learning';
import type { StudentRepository } from '../src/learning/repository';
Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});
let root:Root;let container:HTMLDivElement;
// Preload lazy route modules so compilation cannot resolve between test act scopes.
beforeAll(async()=>{await Promise.all([import('../src/practice/ExercisePage'),import('../src/practice/AttemptPage')]);});
beforeEach(()=>{container=document.createElement('div');document.body.append(container);root=createRoot(container);vi.spyOn(window,'scrollTo').mockImplementation(()=>{});});
afterEach(async()=>{await act(async()=>root.unmount());container.remove();vi.restoreAllMocks();});

async function settleRoutes(){const loading=()=>[...container.querySelectorAll('[role="status"]')].some(n=>/^Loading /.test(n.textContent??''));for(let i=0;i<150&&loading();i++)await act(async()=>{await new Promise(r=>setTimeout(r,10));});expect(loading(),'lazy route resolved').toBe(false);}
async function settle(){await act(async()=>{await new Promise(resolve=>setTimeout(resolve,30));});await settleRoutes();}
async function load(repo:StudentRepository){let state!:LoadedState;await act(async()=>{state=await repo.load();});return state;}
async function mount(repo:StudentRepository,path='/practice'){await act(async()=>root.render(<MemoryRouter initialEntries={[path]}><LearningProvider createRepository={()=>repo}><AppRoutes/></LearningProvider></MemoryRouter>));await settle();}
function button(name:string){const found=[...container.querySelectorAll('button')].find(item=>item.textContent===name);expect(found,name).toBeDefined();return found!;}
async function click(name:string){await act(async()=>button(name).click());await settle();}
async function fill(value:string){await vi.waitFor(async()=>{await act(async()=>{await new Promise(resolve=>setTimeout(resolve,0));});expect(container.querySelector('.ds-practice-answer input')).not.toBeNull();});const input=container.querySelector<HTMLInputElement>('.ds-practice-answer input')!;await act(async()=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!.call(input,value);input.dispatchEvent(new Event('input',{bubbles:true}));});}
async function chooseRows(){for(const select of container.querySelectorAll<HTMLSelectElement>('.ds-truth-table select')){await act(async()=>{select.value=select.getAttribute('aria-label')==='Result when p is T and q is T'?'T':'F';select.dispatchEvent(new Event('change',{bubbles:true}));});}}
describe('shared practice UI',()=>{
  it('browsing/filtering the expanded catalog creates no attempts',async()=>{
    const repo=repository();await mount(repo);expect(container.querySelectorAll('.ds-practice-card')).toHaveLength(249);expect([...container.querySelectorAll('.ds-practice-card')].filter(c=>![...ipDefinitions,...expansionIP].some(e=>c.querySelector(`a[href="/practice/${e.id}"]`)))).toHaveLength(140);
    const select=container.querySelector<HTMLSelectElement>('.ds-practice-filter select')!;await act(async()=>{select.value='CSE1300_RL';select.dispatchEvent(new Event('change',{bubbles:true}));});expect(container.querySelectorAll('.ds-practice-card')).toHaveLength(56);expect((await load(repo)).data.attempts).toEqual([]);
  });
  it.each([catalog[0],catalog[2],catalog[4]])('completes the $subjectId flow without exposing a solution early',async exercise=>{
    const repo=repository();await mount(repo,exercisePath(exercise));expect(container.textContent).not.toContain('Reference answer');await click('Start exercise');
    if(exercise.task.kind==='radix')await fill('00101101');
    else if(exercise.task.kind==='truth')await chooseRows();
    else await act(async()=>container.querySelector<HTMLInputElement>('input[value="sum-10"]')!.click());
    expect(container.textContent).not.toContain(exercise.explanation);await click('Save draft');expect(container.textContent).toContain('Draft saved in this browser');
    await click('Submit answer');expect(container.textContent).toContain('Correct · 1 / 1 item point');expect(container.textContent).toContain(exercise.explanation);
    const state=await load(repo);expect(state.data.attempts[0].status).toBe('SUBMITTED');await click('Retry as new attempt');expect((await load(repo)).data.attempts).toHaveLength(2);expect(container.textContent).not.toContain('Reference answer');
    expect(container.textContent).not.toMatch(/\d+%|predicted grade/);
  });
  it('revisits saved drafts and recomputes submitted feedback from a deep link',async()=>{
    const factory=new IDBFactory();const repo=repository(factory);const service=new PracticeService(repo);const state=await load(repo);const started=await service.start(catalog[0].id,'saved',state.data);const saved=await service.save(started.data.attempts[0],{kind:'text',value:'00101101'},state.data);
    await mount(repo,attemptPath(catalog[0],'saved'));expect(container.querySelector<HTMLInputElement>('.ds-practice-answer input')?.value).toBe('00101101');expect(container.textContent).not.toContain('Reference answer');
    await act(async()=>{await service.submit(saved.data.attempts[0],{kind:'text',value:'00101101'},'op',state.data);});
    await act(async()=>root.unmount());root=createRoot(container);await mount(repository(factory),attemptPath(catalog[0],'saved'));expect(container.textContent).toContain('Correct · 1 / 1 item point');expect(container.textContent).toContain('Reference answer');
  });
  it('shows incomplete/invalid answers as actionable errors, without submitting',async()=>{
    const repo=repository();await mount(repo,exercisePath(catalog[0]));await click('Start exercise');await click('Submit answer');expect(container.querySelector('[role=alert]')?.textContent).toContain('Enter an answer');
    await fill('00101101x');await click('Submit answer');expect(container.querySelector('[role=alert]')?.textContent).toContain('exactly 8');expect((await load(repo)).data.attempts[0].status).toBe('DRAFT');expect(container.textContent).not.toContain('Reference answer');
  });
  it('guards double starts/submits and does not submit during a pending save',async()=>{
    const repo=repository();await mount(repo,exercisePath(catalog[0]));await act(async()=>{button('Start exercise').click();button('Start exercise').click();});await settle();expect((await load(repo)).data.attempts).toHaveLength(1);await fill('00101101');
    const original=repo.editDraft.bind(repo);let release!:()=>void;const gate=new Promise<void>(resolve=>{release=resolve;});vi.spyOn(repo,'editDraft').mockImplementation(async(...args)=>{await gate;return original(...args);});
    await act(async()=>button('Save draft').click());expect(button('Submit answer').disabled).toBe(true);await act(async()=>container.querySelector('form')!.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));expect((await load(repo)).data.attempts[0].status).toBe('DRAFT');
    await act(async()=>release());await settle();await act(async()=>{button('Submit answer').click();button('Submit answer').click();});await settle();expect((await load(repo)).data.attempts).toHaveLength(1);expect(container.textContent).toContain('Correct · 1 / 1');
  });
  it('save and submit failures keep the typed answer visible without feedback',async()=>{
    const repo=repository();await mount(repo,exercisePath(catalog[0]));await click('Start exercise');await fill('00101101');vi.spyOn(repo,'editDraft').mockRejectedValueOnce(new Error('controlled save failure'));await click('Save draft');expect(container.textContent).toContain('Not saved');expect(container.querySelector<HTMLInputElement>('.ds-practice-answer input')?.value).toBe('00101101');
    vi.spyOn(repo,'submit').mockRejectedValueOnce(new Error('controlled submission failure'));await click('Submit answer');expect(container.querySelector('[role=alert]')).not.toBeNull();expect(container.textContent).not.toContain('Reference answer');expect((await load(repo)).data.attempts[0].status).toBe('DRAFT');
  });
  it('requires safe reload after a stale revision or restored dataset conflict',async()=>{
    const repo=repository();await mount(repo,exercisePath(catalog[0]));await click('Start exercise');await fill('00101101');const before=await load(repo);await act(async()=>{await repo.restore(emptyBackup(),before.data);});await click('Submit answer');expect(container.textContent).toContain('Reload practice safely');expect(button('Submit answer').disabled).toBe(true);expect((await load(repo)).data.attempts).toEqual([]);
  });
  it('review regression: conflict exposes unsaved answer as selectable recovery text',async()=>{
    const repo=repository();await mount(repo,exercisePath(catalog[0]));await click('Start exercise');await fill('00101101');
    vi.spyOn(repo,'submit').mockRejectedValueOnce(new LearningError('CONFLICT','Restore changed the dataset'));await click('Submit answer');
    expect(container.querySelector('pre[aria-label="Unsaved answer for recovery"]')?.textContent).toBe('00101101');
  });
  it('unknown attempt and version routes never show an incorrect grade',async()=>{
    const repo=repository();const service=new PracticeService(repo);const start=await load(repo);const draft=await service.start(catalog[0].id,'unknown-version',start.data);
    const backup=await repo.exportBackup();backup.attempts[0].exercise!.version='99';await repo.restore(backup,draft.data);await mount(repo,attemptPath(catalog[0],'unknown-version'));expect(container.textContent).toContain('Original exercise version unavailable');expect(container.textContent).toContain('Preserved answer');expect(container.textContent).not.toContain('Incorrect');
  });
  it.each([['/practice/missing','Exercise unavailable'],[attemptPath(catalog[0],'missing'),'Attempt not found']])('handles unknown route %s',async(path,title)=>{
    await mount(repository(),path);expect(container.textContent).toContain(title);expect(container.textContent).not.toContain('Incorrect');
  });
  it('conflicting same-operation submission is shown as conflict, not success',async()=>{
    const repo=repository();await mount(repo,exercisePath(catalog[0]));await click('Start exercise');await fill('00101101');vi.spyOn(repo,'submit').mockRejectedValueOnce(new LearningError('CONFLICT','Conflicting operation ID'));await click('Submit answer');expect(container.textContent).toContain('Conflicting operation ID');expect(container.textContent).not.toContain('Reference answer');
  });
});

it('next exercise opens authored same-topic work without mutating the submitted attempt or starting a draft',async()=>{
 const repo=repository();const service=new PracticeService(repo);const state=await load(repo);
 const started=await service.start(catalog[0].id,'next-origin',state.data);
 const submitted=await service.submit(started.data.attempts[0],catalog[0].reference,'next-submit',state.data);
 await mount(repo,attemptPath(catalog[0],'next-origin'));
 const next=[...container.querySelectorAll<HTMLAnchorElement>('a')].find(a=>a.textContent?.startsWith('Next exercise:'))!;
 expect(next).toBeDefined();expect(next.getAttribute('href')).not.toBe(exercisePath(catalog[0]));
 await act(async()=>next.click());await settle();expect(container.textContent).toContain('Start exercise');
 expect((await load(repo)).data.attempts).toEqual(submitted.data.attempts);
});
