import { describe, expect, it } from 'vitest';
import { createCPU } from '../src/engine/cpu';
import { executeStep } from '../src/engine/executor';
import { parseProgram } from '../src/engine/parser';
import { createSession, currentCPU, MAX_STEPS, nextSession, seekSession } from '../src/engine/session';
import { examplePrograms } from '../src/examples/examplePrograms';

describe('execution and immutable history', () => {
  it('starts from the specified defaults', () => expect(createCPU().registers).toEqual({rax:0n,rbx:0n,rcx:0n,rdx:0n,rdi:0n,rsi:0n,rsp:0x1000n,rbp:0x1000n}));
  it('retains all snapshots and restores exact memory and registers', () => {
    const program = parseProgram('pushq $5\npopq %rax');
    const initial = createSession(program);
    const pushed = nextSession(program, initial);
    const popped = nextSession(program, pushed);
    expect(currentCPU(initial).memory).toEqual({});
    expect(currentCPU(pushed).registers.rsp).toBe(0xff8n);
    expect(currentCPU(popped).halted).toBe(true);
    const back = seekSession(popped, 1);
    expect(currentCPU(back)).toBe(currentCPU(pushed));
    expect(nextSession(program, back)).toEqual(popped);
    expect(currentCPU(createSession(program))).toEqual(initial.initial);
    expect(Object.isFrozen(currentCPU(popped).memory)).toBe(true);
    expect(Object.isFrozen(currentCPU(popped).registers)).toBe(true);
  });
  it('restores return annotations when seeking history', () => {
    const program = parseProgram('helper: ret\nmain: call helper');
    const session = nextSession(program, createSession(program));
    expect(currentCPU(session).returnAddresses[0xff8]).toBe(2);
    expect(currentCPU(seekSession(session, 0)).returnAddresses).toEqual({});
  });
  it('leaves input state untouched on a failing instruction', () => {
    const program = parseProgram('pushq $5');
    const before = createCPU(0, {rsp: 0n});
    expect(() => executeStep(program, before)).toThrow('Line 1');
    expect(before.registers.rsp).toBe(0n);
    expect(before.memory).toEqual({});
  });
  it('does not advance a halted CPU', () => {
    const program = parseProgram('incq %rax');
    const after = executeStep(program, createCPU()).state;
    expect(() => executeStep(program, after)).toThrow('finished');
  });
  it('enforces the safety limit while preserving history', () => {
    const program = parseProgram('call main\nmain: call main');
    const session = {...createSession(program), steps: Array.from({length: MAX_STEPS}, () => executeStep(program, createCPU(program.entry))), cursor: MAX_STEPS};
    expect(() => nextSession(program, session)).toThrow('2,000 instructions');
    expect(seekSession(session, MAX_STEPS - 1).cursor).toBe(MAX_STEPS - 1);
  });
  it('reports changes and deterministic explanations', () => {
    const program = parseProgram('pushq %rbp');
    const step = executeStep(program, createCPU());
    expect(step.changedRegisters).toEqual(['rsp']);
    expect(step.writtenAddresses).toEqual([0xff8]);
    expect(step.pushedAddress).toBe(0xff8);
    expect(step.explanation.join(' ')).toContain('0x1000 to 0x0FF8');
    expect(executeStep(program, createCPU())).toEqual(step);
  });
});

describe('complete example programs', () => {
  it.each(examplePrograms)('$name executes to the expected final state', example => {
    const program = parseProgram(example.source);
    let session = createSession(program);
    while (!currentCPU(session).halted) session = nextSession(program, session);
    const state = currentCPU(session);
    expect(state.registers.rax).toBe(example.id === 'arithmetic' ? 8n : example.id === 'stack-frame' ? 15n : 7n);
    expect(state.registers.rsp).toBe(0x1000n);
    expect(state.registers.rbp).toBe(0x1000n);
    if (example.id === 'function-call') expect(state.registers.rbx).toBe(7n);
    if (example.id === 'stack-frame') {
      expect(state.memory[0xff0]).toBe(5n);
      expect(state.memory[0xfe8]).toBe(10n);
    }
  });
});
