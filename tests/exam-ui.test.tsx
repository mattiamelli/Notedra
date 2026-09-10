// @vitest-environment jsdom
import {act} from 'react';
import {createRoot, type Root} from 'react-dom/client';
import {BrowserRouter} from 'react-router';
import {afterEach,beforeEach,it,expect,vi} from 'vitest';
import {AppRoutes} from '../src/App';
import {LearningProvider} from '../src/learning/LearningProvider';
import {repository} from './helpers/learning';
import co from '../src/exams/banks/co.json';
import type {ExamBank} from '../src/exams/types';
let host:HTMLDivElement,root:Root;
const pause=()=>new Promise(r=>setTimeout(r,5));
async function settle(){for(let n=0;n<12;n++)await act(pause);}
async function click(text:string){const b=[...host.querySelectorAll('button')].find(b=>b.textContent===text);expect(b).toBeDefined();await act(async()=>b!.click());await settle();}
beforeEach(()=>{Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});Object.defineProperty(HTMLDialogElement.prototype,'showModal',{configurable:true,value:function(this:HTMLDialogElement){this.open=true;}});Object.defineProperty(HTMLDialogElement.prototype,'close',{configurable:true,value:function(this:HTMLDialogElement){this.open=false;}});vi.spyOn(window,'scrollTo').mockImplementation(()=>{});host=document.createElement('div');document.body.append(host);root=createRoot(host);});
afterEach(async()=>{await act(async()=>root.unmount());host.remove();vi.restoreAllMocks();});
async function mount(path:string,repo=repository()){window.history.replaceState(null,'',path);await act(async()=>{await import('../src/exams/ExamsPage');await import('../src/exams/ExamSessionPage');await import('../src/exams/ExamReviewPage');});await act(async()=>root.render(<BrowserRouter><LearningProvider createRepository={()=>repo}><AppRoutes/></LearningProvider></BrowserRouter>));await settle();return repo;}
it('deep links resolve course setup and missing local session without fake data',async()=>{await mount('/exams/CSE1400_CO/setup');expect(host.textContent).toContain('22 components');expect(host.textContent).toContain('Start full mock');});
it('a missing exam deep link explains browser-local history',async()=>{await mount('/exams/sessions/missing');expect(host.textContent).toContain('Exam not found in this browser');});
it('submission confirmation keeps unanswered distinct and review is read-only',async()=>{const repo=repository(),state=await repo.load(),saved=await repo.startExam(co as ExamBank,'ds.exam.co.quick','s','ui-session',state.data);await mount('/exams/sessions/ui-session',repo);expect(host.textContent).toContain('Time expired');await click('Finish and submit');expect(host.querySelector('dialog')?.textContent).toContain('4 unanswered');await click('Keep working');expect(host.querySelector('dialog')).toBeNull();await click('Finish and submit');await click('Confirm submission');expect(host.textContent).toContain('Exam review');expect(host.textContent).toContain('Unanswered');expect(host.querySelector('input,textarea')).toBeNull();expect((await repo.load()).data.exams[0].items).toEqual(saved.data.exams[0].items);});
it('history reflects actual local sessions and links to resume',async()=>{const repo=repository(),state=await repo.load();await repo.startExam(co as ExamBank,'ds.exam.co.quick','s','history',state.data);await mount('/exams/history',repo);expect(host.querySelector('a[href="/exams/sessions/history"]')).not.toBeNull();expect(host.textContent).toContain('0 answered');});
