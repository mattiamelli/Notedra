// @vitest-environment jsdom
import {act} from 'react';
import {createRoot,type Root} from 'react-dom/client';
import {MemoryRouter} from 'react-router';
import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {AppRoutes} from '../src/App';
import AssemblyWorkbenchRoute from '../src/AssemblyWorkbenchRoute';
import {ASSEMBLY_TOPIC_PATH} from '../src/academic/navigation';
import {assemblyPresetVisualizerPath,assemblyVisualizerPath} from '../src/assembly-practice/navigation';
import {resolveAssemblyPresetContext,resolveAssemblyRouteContext} from '../src/assembly-practice/visualizer-context';
import {assemblyTraceExercises} from '../src/assembly-practice/catalog';
import {examplePrograms} from '../src/examples/examplePrograms';
import {LearningProvider,useLearning} from '../src/learning/LearningProvider';
import {repository} from './helpers/learning';

Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});
let host:HTMLDivElement,root:Root;
beforeEach(()=>{localStorage.clear();host=document.createElement('div');document.body.append(host);root=createRoot(host);vi.spyOn(window,'scrollTo').mockImplementation(()=>{});});
afterEach(async()=>{await act(async()=>root.unmount());host.remove();vi.restoreAllMocks();});
async function settle(){for(let i=0;i<150&&[...host.querySelectorAll('[role="status"]')].some(node=>/^Loading /.test(node.textContent??''));i++)await act(async()=>new Promise(resolve=>setTimeout(resolve,10)));}
function LearningSnapshot(){const learning=useLearning();return <output data-learning={JSON.stringify(learning?.snapshot?.data??null)}/>;}
async function renderApp(path:string,repo?:ReturnType<typeof repository>){const app=<AppRoutes/>;await act(async()=>root.render(<MemoryRouter initialEntries={[path]}>{repo?<LearningProvider createRepository={()=>repo}><LearningSnapshot/>{app}</LearningProvider>:app}</MemoryRouter>));await settle();if(repo)for(let i=0;i<100&&host.querySelector('output')?.getAttribute('data-learning')===JSON.stringify(null);i++)await act(async()=>new Promise(resolve=>setTimeout(resolve,5)));}

it('adds contextual preset links only to the stack-frame and function-call lesson sections',async()=>{
 await renderApp(`${ASSEMBLY_TOPIC_PATH}/learn`);
 const frame=host.querySelector('#ds\\.block\\.co\\.t06\\.frame')!,calls=host.querySelector('#ds\\.block\\.co\\.t06\\.calls')!;
 expect(frame.querySelector('a')?.getAttribute('href')).toBe(assemblyPresetVisualizerPath('stack-frame'));
 expect(calls.querySelector('a')?.getAttribute('href')).toBe(assemblyPresetVisualizerPath('function-call'));
 expect(host.querySelectorAll('a[href*="?preset="]')).toHaveLength(2);
 expect(host.querySelector('#ds\\.block\\.co\\.t06\\.operands a[href*="?preset="]')).toBeNull();
});

it('loads only registered presets and gives valid exercise context deterministic priority',()=>{
 const stack=examplePrograms.find(item=>item.id==='stack-frame')!,exercise=assemblyTraceExercises[0];
 expect(resolveAssemblyPresetContext('stack-frame')?.source).toBe(stack.source);
 expect(resolveAssemblyPresetContext('missing')).toBeNull();
 expect(resolveAssemblyRouteContext(exercise.id,'stack-frame')?.source).toBe(exercise.task.code);
 expect(resolveAssemblyRouteContext('missing','stack-frame')?.source).toBe(stack.source);
});

it('restores a preset across remounts, returns to Learn, and preserves saved custom work',async()=>{
 const saved='movq $88, %rax';localStorage.setItem('delftstudy:v1:program',saved);const route=assemblyPresetVisualizerPath('function-call');const preset=examplePrograms.find(item=>item.id==='function-call')!;
 await act(async()=>root.render(<MemoryRouter initialEntries={[route]}><AssemblyWorkbenchRoute/></MemoryRouter>));
 expect(host.querySelector<HTMLTextAreaElement>('textarea.code-input')?.value).toBe(preset.source);
 expect(host.textContent).toContain('Back to Learn');
 expect(host.querySelector<HTMLAnchorElement>('a[href$="/learn"]')?.getAttribute('href')).toBe(`${ASSEMBLY_TOPIC_PATH}/learn`);
 await act(async()=>new Promise(resolve=>setTimeout(resolve,300)));expect(localStorage.getItem('delftstudy:v1:program')).toBe(saved);
 await act(async()=>root.unmount());root=createRoot(host);await act(async()=>root.render(<MemoryRouter initialEntries={[route]}><AssemblyWorkbenchRoute/></MemoryRouter>));
 expect(host.querySelector<HTMLTextAreaElement>('textarea.code-input')?.value).toBe(preset.source);expect(localStorage.getItem('delftstudy:v1:program')).toBe(saved);
});

it('opens a Learn preset without creating or changing learner records',async()=>{
 const repo=repository();await renderApp(`${ASSEMBLY_TOPIC_PATH}/learn`,repo);const before=host.querySelector('output')?.getAttribute('data-learning');expect(before).not.toBe(JSON.stringify(null));
 const link=host.querySelector<HTMLAnchorElement>('a[href*="?preset=stack-frame"]')!;await act(async()=>link.click());await settle();
 expect(host.querySelector<HTMLTextAreaElement>('textarea.code-input')?.value).toBe(examplePrograms.find(item=>item.id==='stack-frame')!.source);
 expect(host.querySelector('output')?.getAttribute('data-learning')).toBe(before);
});

it('opens an exercise context without creating attempts or learning evidence',async()=>{
 const repo=repository(),exercise=assemblyTraceExercises[0];await renderApp(assemblyVisualizerPath(exercise.id),repo);
 expect(host.querySelector<HTMLTextAreaElement>('textarea.code-input')?.value).toBe(exercise.task.code);
 const data=JSON.parse(host.querySelector('output')!.getAttribute('data-learning')!);
 expect(data.attempts).toHaveLength(0);
});
