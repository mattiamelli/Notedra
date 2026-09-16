import { describe, expect, it } from 'vitest';
import { createCPU } from '../src/engine/cpu';
import { executeStep } from '../src/engine/executor';
import { parseProgram } from '../src/engine/parser';
import type { CPUState, Registers } from '../src/engine/types';

function run(source: string, initial: Partial<Registers> = {}): CPUState {
  const program = parseProgram(source);
  let state = createCPU(program.entry, initial);
  for (let count = 0; !state.halted && count < 100; count++) state = executeStep(program, state).state;
  expect(state.halted).toBe(true);
  return state;
}

describe('data movement and memory', () => {
  it('moves immediate to register', () => expect(run('movq $5, %rax').registers.rax).toBe(5n));
  it('moves register to register', () => expect(run('movq %rdi, %rax', {rdi: 9n}).registers.rax).toBe(9n));
  it('moves register to memory', () => expect(run('movq %rax, -8(%rbp)', {rax: 23n}).memory[0xff8]).toBe(23n));
  it('moves memory to register', () => expect(run('movq $12, -8(%rbp)\nmovq -8(%rbp), %rbx').registers.rbx).toBe(12n));
  it('loads an effective address without reading memory', () => {
    const state = run('leaq -16(%rbp), %rax');
    expect(state.registers.rax).toBe(0xff0n);
    expect(state.memory).toEqual({});
  });
  it('allows unaligned effective addresses for LEA', () => expect(run('leaq -3(%rbp), %rax').registers.rax).toBe(0xffdn));
  it('rejects uninitialized memory', () => expect(() => run('movq (%rsp), %rax')).toThrow('No value has been stored'));
  it('supports unaligned byte-addressable memory', () => expect(run('movq $1, -3(%rbp)').memory[0xffd]).toBe(1n));
  it('rejects out-of-range addresses before number conversion', () => expect(() => run('movq $1, (%rax)', {rax: 2n ** 60n})).toThrow('outside the simulated'));
});

describe('stack instructions', () => {
  it('pushes a qword and decrements RSP by eight', () => {
    const state = run('pushq $5');
    expect(state.registers.rsp).toBe(0xff8n);
    expect(state.memory[0xff8]).toBe(5n);
  });
  it('pops a qword, restores RSP, and leaves stored memory intact', () => {
    const state = run('pushq $5\npopq %rax');
    expect(state.registers.rax).toBe(5n);
    expect(state.registers.rsp).toBe(0x1000n);
    expect(state.memory[0xff8]).toBe(5n);
  });
  it('reads old RSP before push', () => expect(run('pushq %rsp').memory[0xff8]).toBe(0x1000n));
  it('reads RSP-relative memory before push', () => expect(run('movq $3, (%rsp)\npushq (%rsp)').memory[0xff8]).toBe(3n));
  it('explains the original address of an RSP-relative push source', () => {
    const program = parseProgram('movq $3, (%rsp)\npushq (%rsp)');
    const first = executeStep(program, createCPU());
    const pushed = executeStep(program, first.state);
    expect(pushed.explanation[1]).toBe('Memory at 0x1000 (3) was stored at 0x0FF8.');
  });
  it('pop RSP leaves the popped value as RSP', () => expect(run('pushq $512\npopq %rsp').registers.rsp).toBe(512n));
  it('pop resolves an RSP-relative destination after increment', () => {
    const state = run('pushq $17\npopq (%rsp)');
    expect(state.memory[0x1000]).toBe(17n);
  });
  it('fails on empty pop without fabricating a value', () => expect(() => run('popq %rax')).toThrow('No value'));
});

describe('64-bit arithmetic', () => {
  it('adds registers', () => expect(run('addq %rdi, %rax', {rax: 5n, rdi: 3n}).registers.rax).toBe(8n));
  it('adds memory to a register', () => expect(run('movq $3, -8(%rbp)\naddq -8(%rbp), %rax', {rax: 5n}).registers.rax).toBe(8n));
  it('adds and subtracts in memory', () => expect(run('movq $5, -8(%rbp)\naddq $4, -8(%rbp)\nsubq $2, -8(%rbp)').memory[0xff8]).toBe(7n));
  it('reserves stack space with subq', () => expect(run('subq $16, %rsp').registers.rsp).toBe(0xff0n));
  it('multiplies signed values', () => expect(run('imulq %rdi, %rax', {rax: -4n, rdi: 3n}).registers.rax).toBe(-12n));
  it('supports immediate and memory multiplication sources', () => expect(run('movq $3, -8(%rbp)\nimulq $2, %rax\nimulq -8(%rbp), %rax', {rax: 2n}).registers.rax).toBe(12n));
  it('increments and decrements', () => expect(run('incq %rax\nincq %rax\ndecq %rax').registers.rax).toBe(1n));
  it('increments memory', () => expect(run('movq $4, -8(%rbp)\nincq -8(%rbp)').memory[0xff8]).toBe(5n));
  it('wraps signed overflow to 64 bits', () => expect(run('addq $1, %rax', {rax: 2n ** 63n - 1n}).registers.rax).toBe(-(2n ** 63n)));
  it('keeps the low 64 bits of multiplication', () => expect(run('imulq $2, %rax', {rax: 2n ** 63n}).registers.rax).toBe(0n));
  it('stores negative words consistently', () => expect(run('subq $1, %rax').registers.rax).toBe(-1n));
});

describe('call and ret', () => {
  it('pushes next instruction index and jumps to a label', () => {
    const program = parseProgram('helper: ret\nmain: call helper\nmovq $1, %rax');
    const result = executeStep(program, createCPU(program.entry));
    expect(result.state.rip).toBe(0);
    expect(result.state.memory[0xff8]).toBe(2n);
    expect(result.state.returnAddresses[0xff8]).toBe(2);
    expect(result.state.registers.rsp).toBe(0xff8n);
  });
  it('returns to the caller and restores RSP', () => {
    const state = run('helper: movq $7, %rax\nret\nmain: call helper\nmovq %rax, %rbx');
    expect(state.registers.rbx).toBe(7n);
    expect(state.registers.rsp).toBe(0x1000n);
  });
  it('handles nested calls', () => {
    const state = run('inner: incq %rax\nret\nouter: call inner\nret\nmain: call outer');
    expect(state.registers.rax).toBe(1n);
    expect(state.registers.rsp).toBe(0x1000n);
  });
  it('rejects corrupted return addresses', () => expect(() => run('pushq $999\nret')).toThrow('Invalid return address'));
  it('does not invent a caller for bare ret', () => expect(() => run('ret')).toThrow('No value'));
  it('clears return metadata when a normal write overwrites a call slot', () => {
    const state = run('helper: ret\nmain: call helper\nmovq $42, -8(%rsp)');
    expect(state.returnAddresses[0xff8]).toBeUndefined();
  });
});
