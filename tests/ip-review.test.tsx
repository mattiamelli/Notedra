// @vitest-environment jsdom
import {act} from 'react';
import {createRoot, type Root} from 'react-dom/client';
import {MemoryRouter} from 'react-router';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import CodingWorkbench from '../src/ip/CodingWorkbench';
import Assignments from '../src/ip/Assignments';
import type {IPAssignment} from '../src/ip/types';
import arrayTask from '../src/ip/assignments/array-window.json';
import tokenTask from '../src/ip/assignments/batch-token.json';
import gridTask from '../src/ip/assignments/grid-key.json';

const imports = vi.hoisted(() => {
  let resolveArray!: () => void;
  let rejectToken!: (failure: Error) => void;
  const array = new Promise<void>(resolve => { resolveArray = resolve; });
  const token = new Promise<void>((_resolve, reject) => { rejectToken = reject; });
  return {array, token, resolveArray, rejectToken};
});
vi.mock('../src/ip/references/array-window.json', async () => {
  await imports.array;
  return vi.importActual('../src/ip/references/array-window.json');
});
vi.mock('../src/ip/references/batch-token.json', async () => {
  await imports.token;
  return vi.importActual('../src/ip/references/batch-token.json');
});

Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true});
let host: HTMLDivElement, root: Root;
beforeEach(() => { host = document.createElement('div'); document.body.append(host); root = createRoot(host); });
afterEach(async () => { await act(async () => root.unmount()); host.remove(); vi.restoreAllMocks(); });
async function mount(assignment: IPAssignment) {
  await act(async () => root.render(<MemoryRouter><CodingWorkbench assignment={assignment}/></MemoryRouter>));
}
async function click(label: string) {
  const button = [...host.querySelectorAll('button')].find(element => element.textContent === label)!;
  expect(button).toBeDefined();
  await act(async () => button.click());
}
async function flush() { await act(async () => { await new Promise(resolve => setTimeout(resolve, 30)); }); }
async function fill(value: string) {
  const field = host.querySelector('textarea')!;
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(field, value);
    field.dispatchEvent(new Event('input', {bubbles: true}));
  });
}

describe('Step 8 adversarial self-review regressions', () => {
  it('reset invalidates an in-flight reference reveal and leaves the solution hidden', async () => {
    await mount(arrayTask as IPAssignment);
    await fill('my draft');
    await click('Reveal reference solution');
    expect(host.textContent).toContain('Loading reference…');
    await click('Reset starter files');
    expect(host.querySelector('textarea')?.value).toBe(arrayTask.starterFiles[0].content);
    await act(async () => imports.resolveArray());
    for (let count = 0; count < 10; count++) await flush();
    expect(host.querySelector('#ip-reference-solution')?.hasAttribute('hidden')).toBe(true);
    expect(host.querySelector('#ip-reference-tests')?.hasAttribute('hidden')).toBe(true);
    expect(host.textContent).toContain('All starter files restored.');
    expect([...host.querySelectorAll('button')].find(button => button.textContent === 'Reveal reference solution')?.disabled).toBe(false);
    await click('Reveal reference solution');
    await flush();
    expect(host.querySelector('#ip-reference-solution')?.hasAttribute('hidden')).toBe(false);
  });
  it('a rejected pre-reset reference import cannot overwrite reset status', async () => {
    await mount(tokenTask as IPAssignment);
    await click('Reveal test specifications');
    await click('Reset starter files');
    await act(async () => imports.rejectToken(new Error('Controlled network failure')));
    for (let count = 0; count < 10; count++) await flush();
    expect(host.querySelector('[role=status]')?.textContent).toBe('All starter files restored.');
    expect(host.querySelector('#ip-reference-tests')?.hasAttribute('hidden')).toBe(true);
  });
  it('a late clipboard completion cannot overwrite reset status', async () => {
    let finish!: () => void;
    const pending = new Promise<void>(resolve => { finish = resolve; });
    Object.defineProperty(navigator, 'clipboard', {configurable: true, value: {writeText: vi.fn(() => pending)}});
    await mount(gridTask as IPAssignment);
    await fill('a code draft');
    await click('Copy current file');
    await click('Reset starter files');
    await act(async () => finish());
    expect(host.querySelector('[role=status]')?.textContent).toBe('All starter files restored.');
  });
  it('missing or mismatched reference data never replaces the working draft', async () => {
    await mount({...gridTask, referenceId: 'ds.reference.ip.unavailable'} as IPAssignment);
    await fill('keep this attempt');
    await click('Reveal reference solution');
    expect(host.textContent).toContain('The reference could not be loaded');
    expect(host.querySelector('textarea')?.value).toBe('keep this attempt');
    expect(host.querySelector('#ip-reference-solution')?.hasAttribute('hidden')).toBe(true);
    await act(async () => root.render(null));
    await mount({...gridTask, version: '2'} as IPAssignment);
    await fill('version two draft');
    await click('Reveal reference solution');
    for (let count = 0; count < 10; count++) await flush();
    expect(host.textContent).toContain('The reference could not be loaded');
    expect(host.querySelector('textarea')?.value).toBe('version two draft');
    expect(host.querySelector('#ip-reference-solution')?.hasAttribute('hidden')).toBe(true);
  });
  it('uses a truthful empty state in ordinary Practice without inventing a 60-minute filter', async () => {
    await act(async () => root.render(<MemoryRouter><Assignments topicId="IP_T01_JAVA_BASICS"/></MemoryRouter>));
    expect(host.textContent).toContain('No coding assignment is mapped to this topic');
    expect(host.textContent).not.toContain('No authored 60-minute assignment');
  });
  it('keeps the 60-minute-only empty state for the Exam-style route', async () => {
    await act(async () => root.render(<MemoryRouter><Assignments topicId="IP_T01_JAVA_BASICS" examOnly/></MemoryRouter>));
    expect(host.textContent).toContain('No authored 60-minute assignment');
    expect(host.textContent).toContain('Authored exam-style practice');
  });
  it('rejects an assignment query not mapped to the current topic without exposing its reference', async () => {
    await act(async () => root.render(<MemoryRouter initialEntries={['/?task=ds.assignment.ip.material-ledger']}><Assignments topicId="IP_T01_JAVA_BASICS"/></MemoryRouter>));
    expect(host.textContent).toContain('That assignment is not available in this topic and mode');
    expect(host.querySelector('.ds-ip-workbench')).toBeNull();
    expect(host.querySelector('#ip-reference-solution')).toBeNull();
  });
});
