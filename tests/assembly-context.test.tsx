// @vitest-environment jsdom
import {act,type ReactNode} from 'react';
import {createRoot,type Root} from 'react-dom/client';
import {MemoryRouter} from 'react-router';
import {afterEach,beforeEach,expect,it} from 'vitest';
import AssemblyWorkbenchRoute from '../src/AssemblyWorkbenchRoute';
import {assemblyTraceExercises} from '../src/assembly-practice/catalog';
import {assemblyVisualizerPath} from '../src/assembly-practice/navigation';
import {contextualAssemblyReturnPath,resolveAssemblyVisualizerContext,validatedAssemblyInitialRegisters} from '../src/assembly-practice/visualizer-context';
import {ExercisePrompt} from '../src/practice/ExerciseParts';
import {allExercises,attemptPath,exercisePath} from '../src/practice/catalog';
import {useSimulator} from '../src/utils/useSimulator';

Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});
let host:HTMLDivElement,root:Root;
const exercise=assemblyTraceExercises[0];
beforeEach(()=>{localStorage.clear();host=document.createElement('div');document.body.append(host);root=createRoot(host);});
afterEach(async()=>{await act(async()=>root.unmount());host.remove();});
async function render(node:ReactNode){await act(async()=>root.render(node));}
function SimulatorProbe({source,initialRegisters}:{source:string;initialRegisters?:ReturnType<typeof validatedAssemblyInitialRegisters>}){const simulator=useSimulator({initialSource:source,initialRegisters:initialRegisters??undefined,persistSource:false});return <><output data-register="rbp">{simulator.cpu.registers.rbp.toString()}</output><button onClick={simulator.step}>Step</button><button onClick={simulator.reset}>Reset</button></>}
async function click(label:string){const button=[...host.querySelectorAll('button')].find(item=>item.textContent===label);expect(button).toBeDefined();await act(async()=>button!.click());}

it('offers the contextual action only for a registered Assembly trace and preserves an attempt origin',async()=>{
 await render(<MemoryRouter><ExercisePrompt exercise={exercise} attemptId="attempt-a"/></MemoryRouter>);
 expect(host.querySelector<HTMLAnchorElement>('a[href*="visualizer"]')?.getAttribute('href')).toBe(assemblyVisualizerPath(exercise.id,'attempt-a'));
 expect(host.textContent).toContain('Explore in Assembly Visualizer');
 const other=allExercises.find(item=>item.task.kind!=='assembly-trace')!;
 await render(<MemoryRouter><ExercisePrompt exercise={other}/></MemoryRouter>);
 expect(host.textContent).not.toContain('Explore in Assembly Visualizer');
});

it('resolves only registered parseable Assembly source and safely derives return routes',()=>{
 const context=resolveAssemblyVisualizerContext(exercise.id)!;
 expect(context.source).toBe(exercise.task.code);
 expect(context.initialRegisters).toEqual({rsp:0x1000n,rbp:0x2000n});
 expect(resolveAssemblyVisualizerContext('missing')).toBeNull();
 expect(resolveAssemblyVisualizerContext(allExercises.find(item=>item.task.kind!=='assembly-trace')!.id)).toBeNull();
 expect(contextualAssemblyReturnPath(context,'attempt-a',[{attemptId:'attempt-a',templateRef:exercise.id}])).toBe(attemptPath(exercise,'attempt-a'));
 expect(contextualAssemblyReturnPath(context,'attempt-a',[{attemptId:'attempt-a',templateRef:'other'}])).toBe(exercisePath(exercise));
});

it('validates generic 64-bit contextual register state and rejects malformed authored state',()=>{
 expect(validatedAssemblyInitialRegisters({rax:'4',rdi:'0x10',rbp:'0x2000'})).toEqual({rax:4n,rdi:16n,rbp:8192n});
 expect(validatedAssemblyInitialRegisters({rip:'1'})).toBeNull();
 expect(validatedAssemblyInitialRegisters({rax:'not-a-number'})).toBeNull();
 expect(validatedAssemblyInitialRegisters({rax:'0x10000000000000000'})).toBeNull();
});

it('initializes and resets the simulator to contextual registers without changing normal defaults',async()=>{
 const context=resolveAssemblyVisualizerContext(exercise.id)!;
 await render(<SimulatorProbe source={'movq $7, %rbp'} initialRegisters={context.initialRegisters}/>);
 expect(host.querySelector('[data-register="rbp"]')?.textContent).toBe('8192');
 await click('Step');expect(host.querySelector('[data-register="rbp"]')?.textContent).toBe('7');
 await click('Reset');expect(host.querySelector('[data-register="rbp"]')?.textContent).toBe('8192');
 await act(async()=>root.render(null));
 await render(<SimulatorProbe source={'movq $7, %rbp'}/>);
 expect(host.querySelector('[data-register="rbp"]')?.textContent).toBe('4096');
});

it('loads authored context across a remount without overwriting saved Visualizer work',async()=>{
 const saved='movq $77, %rax';localStorage.setItem('delftstudy:v1:program',saved);
 const route=assemblyVisualizerPath(exercise.id);
 await render(<MemoryRouter initialEntries={[route]}><AssemblyWorkbenchRoute/></MemoryRouter>);
 expect(host.querySelector<HTMLTextAreaElement>('textarea')?.value).toBe(exercise.task.code);
 expect(host.textContent).toContain('8192');
 expect(host.querySelector<HTMLAnchorElement>('a')?.getAttribute('href')).toBe(exercisePath(exercise));
 await act(async()=>new Promise(resolve=>setTimeout(resolve,300)));
 expect(localStorage.getItem('delftstudy:v1:program')).toBe(saved);
 await act(async()=>root.unmount());root=createRoot(host);
 await render(<MemoryRouter initialEntries={[route]}><AssemblyWorkbenchRoute/></MemoryRouter>);
 expect(host.querySelector<HTMLTextAreaElement>('textarea')?.value).toBe(exercise.task.code);
 expect(localStorage.getItem('delftstudy:v1:program')).toBe(saved);
});

it('falls back to the saved Visualizer program for an invalid exercise context',async()=>{
 const saved='movq $41, %rax';localStorage.setItem('delftstudy:v1:program',saved);
 await render(<MemoryRouter initialEntries={['/co/CO_T06_ASSEMBLY_X86_64/visualizer?exercise=missing']}><AssemblyWorkbenchRoute/></MemoryRouter>);
 expect(host.querySelector<HTMLTextAreaElement>('textarea')?.value).toBe(saved);
 expect(host.textContent).not.toContain('Back to exercise');
});
