// @vitest-environment jsdom
import {act,type ReactNode} from 'react';
import {createRoot,type Root} from 'react-dom/client';
import {MemoryRouter} from 'react-router';
import {afterEach,beforeEach,expect,it} from 'vitest';
import Assignments from '../src/ip/Assignments';
import {TopicContent} from '../src/ip/TopicContent';
import type {IPAssignment,IPTopicContent} from '../src/ip/types';
import {topicStudy} from '../src/topic-study/content';
import arraysContent from '../src/ip/topics/IP_T05_ARRAYS_RECURSION.json';
import testingContent from '../src/ip/topics/IP_T08_TESTING.json';
import equalityContent from '../src/ip/topics/IP_T11_EQUALITY_HASHING.json';
import arrayTask from '../src/ip/assignments/array-window.json';
import boundaryTask from '../src/ip/assignments/boundary-tests.json';
import gridTask from '../src/ip/assignments/grid-key.json';

Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});
let host:HTMLDivElement,root:Root;
beforeEach(()=>{host=document.createElement('div');document.body.append(host);root=createRoot(host);localStorage.clear();});
afterEach(async()=>{await act(async()=>root.unmount());host.remove();localStorage.clear();});

const cases=[
 {topicId:'IP_T05_ARRAYS_RECURSION',blockId:'ds.block.ip.t05.process',task:arrayTask,content:arraysContent},
 {topicId:'IP_T08_TESTING',blockId:'ds.block.ip.t08.boundaries',task:boundaryTask,content:testingContent},
 {topicId:'IP_T11_EQUALITY_HASHING',blockId:'ds.block.ip.t11.value',task:gridTask,content:equalityContent},
] as const;

async function render(ui:ReactNode,entry='/'){
 await act(async()=>root.render(<MemoryRouter initialEntries={[entry]}>{ui}</MemoryRouter>));
}
async function waitForWorkbench(){
 for(let i=0;i<100&&!host.querySelector('.ds-ip-workbench');i++)await act(async()=>{await new Promise(resolve=>setTimeout(resolve,10));});
 expect(host.querySelector('.ds-ip-workbench')).not.toBeNull();
}
function topic(topicId:string){return topicStudy.topics.find(candidate=>candidate.id===topicId)!;}

it.each(cases)('links $blockId to its registered task without adding links to unrelated lesson blocks',async ({topicId,blockId,task,content})=>{
 await render(<TopicContent topic={topic(topicId)} mode="learn" content={content as IPTopicContent}/>);
 const taskLinks=[...host.querySelectorAll<HTMLAnchorElement>('a[href*="?task="]')];
 expect(taskLinks).toHaveLength(1);
 expect(taskLinks[0].textContent).toBe('Open coding task');
 expect(taskLinks[0].getAttribute('href')).toBe(`/ip/${topicId}/practice?task=${encodeURIComponent(task.id)}`);
 expect(host.querySelector(`[id="${blockId}"] a[href*="?task="]`)).toBe(taskLinks[0]);
});

it.each(cases)('selects $task.id from a direct URL and loads its registered starter files',async ({topicId,task})=>{
 localStorage.setItem('notedra-context-test','unchanged');
 await render(<Assignments topicId={topicId}/>,`/?task=${encodeURIComponent(task.id)}`);
 await waitForWorkbench();
 const assignment=task as IPAssignment;
 expect(host.querySelector(`a[aria-current="page"]`)?.textContent).toContain(assignment.title);
 expect([...host.querySelectorAll<HTMLButtonElement>('[role="tab"]')].map(tab=>tab.textContent)).toEqual(assignment.starterFiles.map(file=>file.name));
 expect(host.querySelector<HTMLTextAreaElement>('textarea')?.value).toBe(assignment.starterFiles[0].content);
 expect(localStorage.getItem('notedra-context-test')).toBe('unchanged');
 expect(localStorage.length).toBe(1);
});

it('preserves task selection across a remount while accurately treating edited code as page-local',async()=>{
 const entry='/?task=ds.assignment.ip.array-window';
 await render(<Assignments topicId="IP_T05_ARRAYS_RECURSION"/>,entry);
 await waitForWorkbench();
 const editor=host.querySelector<HTMLTextAreaElement>('textarea')!;
 await act(async()=>{Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')!.set!.call(editor,'page-local edit');editor.dispatchEvent(new Event('input',{bubbles:true}));});
 expect(editor.value).toBe('page-local edit');
 await act(async()=>root.render(null));
 await render(<Assignments topicId="IP_T05_ARRAYS_RECURSION"/>,entry);
 await waitForWorkbench();
 expect(host.querySelector('a[aria-current="page"]')?.textContent).toContain('Count threshold crossings in a window');
 expect(host.querySelector<HTMLTextAreaElement>('textarea')?.value).toBe((arrayTask as IPAssignment).starterFiles[0].content);
 expect(host.textContent).toContain('Drafts stay on this page only.');
});

it('keeps wrong-topic and unknown task IDs safe while manual task selection still works',async()=>{
 await render(<Assignments topicId="IP_T08_TESTING"/>,'/?task=ds.assignment.ip.grid-key');
 expect(host.textContent).toContain('That assignment is not available in this topic and mode');
 expect(host.querySelector('.ds-ip-workbench')).toBeNull();
 await act(async()=>root.render(null));
 await render(<Assignments topicId="IP_T08_TESTING"/>,'/?task=unknown-task');
 expect(host.textContent).toContain('That assignment is not available in this topic and mode');
 await act(async()=>root.render(null));
 await render(<Assignments topicId="IP_T08_TESTING"/>);
 const link=[...host.querySelectorAll<HTMLAnchorElement>('a')].find(candidate=>candidate.getAttribute('href')?.includes('task=ds.assignment.ip.boundary-tests'))!;
 expect(link).toBeDefined();
 await act(async()=>link.click());
 await waitForWorkbench();
 expect(host.querySelector('a[aria-current="page"]')?.textContent).toContain('Design tests that expose boundary bugs');
});
