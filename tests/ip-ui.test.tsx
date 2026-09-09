// @vitest-environment jsdom
import {act} from 'react';
import {createRoot,type Root} from 'react-dom/client';
import {MemoryRouter} from 'react-router';
import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import CodingWorkbench from '../src/ip/CodingWorkbench';
import {Feedback,ExercisePrompt,AnswerControls} from '../src/practice/ExerciseParts';
import {allExercises} from '../src/practice/catalog';
import {gradeResponse} from '../src/practice/runtime';
import type {IPAssignment} from '../src/ip/types';
import arrayTask from '../src/ip/assignments/array-window.json';
import miniTask from '../src/ip/assignments/reading-export.json';
import fullTask from '../src/ip/assignments/material-ledger.json';
import {readFileSync} from 'node:fs';
Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});
let host:HTMLDivElement,root:Root;
beforeEach(()=>{host=document.createElement('div');document.body.append(host);root=createRoot(host);});
afterEach(async()=>{await act(async()=>root.unmount());host.remove();vi.restoreAllMocks();});
async function mount(assignment:IPAssignment){await act(async()=>root.render(<MemoryRouter><CodingWorkbench assignment={assignment}/></MemoryRouter>));}
async function click(text:string){const b=[...host.querySelectorAll('button')].find(b=>b.textContent===text);expect(b).toBeTruthy();await act(async()=>b!.click());}
async function fill(value:string){const editor=host.querySelector('textarea')!;await act(async()=>{Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')!.set!.call(editor,value);editor.dispatchEvent(new Event('input',{bubbles:true}));});}
async function settleUntil(text:string){for(let i=0;i<100&&!host.textContent?.includes(text);i++)await act(async()=>{await new Promise(r=>setTimeout(r,20));});expect(host.textContent).toContain(text);}
it.each([arrayTask,miniTask,fullTask])('$minutes-minute task edits, copies, resets and reveals actual reference/specifications without execution',async raw=>{
 const task=raw as IPAssignment;const writeText=vi.fn().mockResolvedValue(undefined);Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText}});await mount(task);expect(host.querySelector('textarea')?.value).toBe(task.starterFiles[0].content);expect(host.textContent).toContain('Java code is not executed or automatically graded here.');expect(host.textContent).toContain('No tests have been run on your answer.');expect(host.querySelector('#ip-reference-solution')?.hasAttribute('hidden')).toBe(true);
 await fill('arbitrary learner code; this is not run');await click('Copy current file');expect(writeText).toHaveBeenCalledWith('arbitrary learner code; this is not run');expect(host.textContent).toContain('Copied '+task.starterFiles[0].name);
 await click('Reveal test specifications');await settleUntil('Reference test specifications · not executed on your code');expect(host.querySelector('#ip-reference-tests')?.hasAttribute('hidden')).toBe(false);await click('Reveal reference solution');await settleUntil('One reference implementation');expect(host.querySelector('#ip-reference-solution code')?.textContent?.length).toBeGreaterThan(30);expect(host.querySelector('textarea')?.value).toBe('arbitrary learner code; this is not run');expect(host.textContent).not.toMatch(/\d+ \/ \d+ item point|Your tests passed/);
 await click('Hide reference solution');expect(host.querySelector('#ip-reference-solution')?.hasAttribute('hidden')).toBe(true);await click('Reset starter files');expect(host.querySelector('textarea')?.value).toBe(task.starterFiles[0].content);expect(host.querySelector('#ip-reference-tests')?.hasAttribute('hidden')).toBe(true);
});
it('file tabs retain separate drafts and support arrow/end/home keyboard navigation',async()=>{
 const task=fullTask as IPAssignment;expect(task.starterFiles.length).toBeGreaterThan(1);await mount(task);await fill('file-one-draft');let tabs=host.querySelectorAll<HTMLButtonElement>('[role=tab]');await act(async()=>tabs[0].dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true})));expect(tabs[1].getAttribute('aria-selected')).toBe('true');expect(document.activeElement).toBe(tabs[1]);await fill('file-two-draft');await act(async()=>tabs[1].dispatchEvent(new KeyboardEvent('keydown',{key:'Home',bubbles:true})));expect(host.querySelector('textarea')?.value).toBe('file-one-draft');await act(async()=>tabs[0].dispatchEvent(new KeyboardEvent('keydown',{key:'End',bubbles:true})));expect(tabs[task.starterFiles.length-1].getAttribute('aria-selected')).toBe('true');
});
it('unmounting loses ephemeral drafts and a denied clipboard reports failure accurately',async()=>{
 Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:vi.fn().mockRejectedValue(new Error('Denied'))}});await mount(arrayTask as IPAssignment);await fill('ephemeral');await click('Copy current file');expect(host.textContent).toContain('Clipboard access was unavailable');await act(async()=>root.render(null));await mount(arrayTask as IPAssignment);expect(host.querySelector('textarea')?.value).toBe(arrayTask.starterFiles[0].content);
});
it.each(['division','pass-value','dispatch','equality','exception-flow','race'])('%s feedback shows actual learner prediction and safely matched explanation',async slug=>{
 const e=allExercises.find(e=>e.id==='ds.practice.ip-'+slug)!;if(e.task.kind!=='ip-fixed')throw new Error('Expected IP task');const answer={kind:'choice' as const,value:['pattern']};await act(async()=>root.render(<MemoryRouter><ExercisePrompt exercise={e}/><AnswerControls exercise={e} answer={answer} onChange={()=>{}} disabled/><Feedback exercise={e} answer={answer} result={gradeResponse(e,answer)}/></MemoryRouter>));expect(host.querySelector('[aria-label="Fixed Java snippet"]')?.textContent).toBe(e.task.code);const feedback=host.querySelector('.ds-practice-feedback')!;expect(feedback.querySelector('pre')?.textContent).toBe(e.task.options[1].output);for(const label of ['Your submitted answer','Reference answer','Why this answer differs','Reasoning','Remember','Answer pattern to check'])expect(feedback.textContent).toContain(label);expect(feedback.textContent).not.toContain('diagnosis of your understanding. Your');
});
it('workbench source has no learner execution/grading/storage path and styles wrap code',()=>{
 const source=readFileSync('src/ip/CodingWorkbench.tsx','utf8');expect(source).not.toMatch(/eval\(|new Function|child_process|fetch\(|localStorage|indexedDB|gradeResponse|PracticeService|\.test\(draft|\.match\(/);const style=readFileSync('src/ip/ip.css','utf8');expect(style).toContain('white-space:pre-wrap');expect(style).toContain('overflow-wrap:anywhere');expect(style).toContain('minmax(min(100%,260px),1fr)');
});
