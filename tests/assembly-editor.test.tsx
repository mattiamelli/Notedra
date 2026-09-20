// @vitest-environment jsdom
import {act} from 'react';
import {createRoot, type Root} from 'react-dom/client';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import AssemblyWorkbench from '../src/AssemblyWorkbench';
import {useSimulator} from '../src/utils/useSimulator';

Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true});
let root: Root, host: HTMLDivElement;
beforeEach(() => {localStorage.clear(); vi.useFakeTimers(); host = document.createElement('div'); document.body.append(host); root = createRoot(host);});
afterEach(async () => {await act(async () => root.unmount()); host.remove(); vi.useRealTimers();});
const button = (label: string) => [...host.querySelectorAll('button')].find(item => item.textContent === label)!;
async function click(label: string) {expect(button(label)).toBeDefined(); await act(async () => button(label).click());}
async function edit(source: string) {
  const input = host.querySelector('textarea')!;
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(input, source);
    input.dispatchEvent(new Event('input', {bubbles: true}));
  });
}
describe('custom assembly editor', () => {
  it('creates and focuses a completely blank program while keeping examples available', async () => {
    await act(async () => root.render(<AssemblyWorkbench/>));
    expect(host.querySelector('textarea')?.getAttribute('value') ?? host.querySelector('textarea')?.textContent).not.toBe('');
    await click('New program');
    const editor=host.querySelector<HTMLTextAreaElement>('textarea')!;
    expect(editor.value).toBe('');
    expect(document.activeElement).toBe(editor);
    expect(host.textContent).toContain('AT&T syntax');
    expect(host.querySelectorAll('.example-select option').length).toBeGreaterThan(1);
  });
  it('does not show an old next instruction or promise cleared history after invalid replacement', async () => {
    await act(async () => root.render(<AssemblyWorkbench/>));
    await edit('movq $11, %rax'); await click('Load Program');
    expect(host.querySelector('.next-preview')?.textContent).toContain('movq $11, %rax');
    await edit('call bad:');
    expect(host.querySelector('.next-preview')).toBeNull();
    await click('Load Program');
    expect(host.querySelector('.next-preview')).toBeNull();
    expect(host.querySelector('[role="alert"]')?.textContent).not.toContain('last successful execution');
  });
  it('pauses a running program on edit and clears a failed replacement load', async () => {
    let simulator: ReturnType<typeof useSimulator>;
    function Harness() {simulator = useSimulator(); return null;}
    await act(async () => root.render(<Harness/>));
    await act(async () => simulator!.load('movq $9, %rax\nincq %rax'));
    await act(async () => simulator!.run());
    await act(async () => vi.advanceTimersByTime(650));
    expect(simulator!.cpu.registers.rax).toBe(9n);
    await act(async () => simulator!.edit('movq $4, %rax'));
    await act(async () => vi.advanceTimersByTime(1300));
    expect(simulator!.running).toBe(false);
    expect(simulator!.session.steps).toHaveLength(0);
    expect(simulator!.cpu.registers.rax).toBe(0n);
    await act(async () => simulator!.load('movq $11, %rax'));
    await act(async () => simulator!.step());
    await act(async () => simulator!.load('movq $99, %rax\ncall bad:'));
    expect(simulator!.error).toContain('Line 2:');
    expect(simulator!.session.steps).toHaveLength(0);
    expect(simulator!.cpu.registers.rax).toBe(0n);
    await act(async () => {simulator!.step(); simulator!.seek(1);});
    expect(simulator!.session.cursor).toBe(0);
  });
  it('loads, steps, runs, reverses, resets and replaces multiline student code through the workbench', async () => {
    await act(async () => root.render(<AssemblyWorkbench/>));
    await edit('double_value:\n    shlq $1, %rax\n    ret\n\nmain:\n    movq $2, %rcx\n    movq $3, (%rsp,%rcx,4)\n    movq $5, %rax\n    addq (%rsp,%rcx,4), %rax\n    call double_value\n    mulq (%rsp,%rcx,4)');
    await click('Load Program');
    expect(host.querySelector('[role="alert"]')).toBeNull();
    await click('Next Instruction');
    expect(host.querySelector('.instruction-counter')?.textContent).toContain('1 executed');
    await click('Run');
    await act(async () => vi.advanceTimersByTime(650 * 10));
    expect(host.textContent).toContain('Program complete');
    expect(host.querySelectorAll('.history-row')).toHaveLength(9);
    expect(host.querySelector('.register-panel')?.textContent).toContain('48');
    await click('Previous');
    expect(host.querySelector('.register-panel')?.textContent).toContain('16');
    await click('Reset');
    expect(host.querySelectorAll('.history-row')).toHaveLength(1);
    await edit('movq $99, %rax');
    await click('Load Program'); await click('Next Instruction');
    expect(host.querySelector('.register-panel')?.textContent).toContain('99');
  });
  it('invalidates history immediately on edits, including change-then-revert and direct hook actions', async () => {
    let simulator: ReturnType<typeof useSimulator>;
    function Harness() {simulator = useSimulator(); return null;}
    await act(async () => root.render(<Harness/>));
    await act(async () => simulator!.load('movq $9, %rax\nincq %rax'));
    await act(async () => {simulator!.step(); simulator!.step();});
    expect(simulator!.session.steps).toHaveLength(2);
    await act(async () => {simulator!.edit('movq $4, %rax'); simulator!.step(); simulator!.seek(2);});
    expect(simulator!.session.steps).toHaveLength(0);
    expect(simulator!.session.cursor).toBe(0);
    await act(async () => simulator!.edit('movq $9, %rax\nincq %rax'));
    expect(simulator!.session.steps).toHaveLength(0);
    await act(async () => simulator!.load('movq $4, %rax'));
    await act(async () => simulator!.step());
    expect(simulator!.cpu.registers.rax).toBe(4n);
  });
  it.each(['call foo:\nfoo: ret', 'call missing', 'xyzq %rax', 'movq (%rsp,%rcx,3), %rax', 'shlq %rax, %rbx'])('shows a line error and cannot run malformed source: %s', async source => {
    await act(async () => root.render(<AssemblyWorkbench/>));
    await edit(`movq $99, %rax\n${source}`); await click('Load Program');
    expect(host.querySelector('[role="alert"]')?.textContent).toContain('Line 2:');
    expect(button('Run').disabled).toBe(true);
    expect(button('Next Instruction').disabled).toBe(true);
    expect(host.querySelectorAll('.history-row')).toHaveLength(1);
  });
});
