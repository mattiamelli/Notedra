import {describe, expect, it} from 'vitest';
import {createCPU} from '../src/engine/cpu';
import {executeStep} from '../src/engine/executor';
import {parseOperand, parseProgram} from '../src/engine/parser';
import {effectiveAddress} from '../src/engine/memory';
import {createSession, currentCPU, nextSession, seekSession} from '../src/engine/session';

describe('assembly maintenance semantics', () => {
  it('preserves a call return slot on a zero-count memory shift', () => {
    const program = parseProgram('helper: shlq $64, (%rsp)\nret\nmain: call helper');
    const called = nextSession(program, createSession(program));
    const shifted = nextSession(program, called);
    expect(currentCPU(shifted).memory).toEqual(currentCPU(called).memory);
    expect(currentCPU(shifted).returnAddresses).toEqual(currentCPU(called).returnAddresses);
    expect(shifted.steps.at(-1)!.writtenAddresses).toEqual([]);
    expect(currentCPU(nextSession(program, shifted)).halted).toBe(true);
  });
  it.each([1, 2, 4, 8])('reads and writes indexed memory with scale %s', scale => {
    const program = parseProgram(`movq $8, %rcx\nmovq $23, -8(%rsp,%rcx,${scale})\nmovq -8(%rsp,%rcx,${scale}), %rax`);
    let session = createSession(program);
    while (!currentCPU(session).halted) session = nextSession(program, session);
    expect(currentCPU(session).registers.rax).toBe(23n);
    expect(currentCPU(session).memory[4088 + 8 * scale]).toBe(23n);
  });
  it('restores register shifts backwards and on reset', () => {
    const program = parseProgram('movq $5, %rax\nshlq $1, %rax');
    const first = nextSession(program, createSession(program));
    const shifted = nextSession(program, first);
    expect(currentCPU(shifted).registers.rax).toBe(10n);
    expect(currentCPU(seekSession(shifted, 1))).toBe(currentCPU(first));
    expect(currentCPU(createSession(program)).registers.rax).toBe(0n);
  });
  it.each([
    [5n, 1, 10n], [-1n, 1, -2n], [1n << 63n, 1, 0n],
    [1n, 63, -(1n << 63n)], [7n, 0, 7n], [7n, 64, 7n], [7n, 65, 14n], [1n, 255, -(1n << 63n)],
  ])('shlq wraps %s shifted by %s', (rax, count, expected) => {
    const program = parseProgram(`shlq $${count}, %rax`);
    const before = createCPU(0, {rax});
    const step = executeStep(program, before);
    expect(step.state.registers.rax).toBe(expected);
    expect(before.registers.rax).toBe(BigInt.asIntN(64, rax));
    expect(step.explanation.join(' ')).toContain('shift');
  });
  it.each([
    [3n, 7n, 21n, 0n], [-1n, 2n, -2n, 1n], [-1n, -1n, 1n, -2n],
    [1n << 63n, 2n, 0n, 1n], [0n, -1n, 0n, 0n],
  ])('mulq computes the full unsigned product of %s and %s', (rax, rbx, low, high) => {
    const program = parseProgram('mulq %rbx');
    const before = createCPU(0, {rax, rbx, rdx: 77n});
    const step = executeStep(program, before);
    expect(step.state.registers.rax).toBe(low);
    expect(step.state.registers.rdx).toBe(high);
    expect(before.registers.rdx).toBe(77n);
    expect(step.explanation.join(' ')).toContain('RDX:RAX');
  });
  it.each(['%rax', '%rdx', '(%rax)', '(%rdx)'])('mulq reads aliased source %s before writing RDX:RAX', source => {
    const program = parseProgram(`mulq ${source}`);
    const before = {...createCPU(0, {rax: 4096n, rdx: 4096n}), memory: {4096: -1n}};
    const after = executeStep(program, before).state;
    expect(after.registers.rax).toBe(source.startsWith('(') ? -4096n : 16777216n);
    expect(after.registers.rdx).toBe(source.startsWith('(') ? 4095n : 0n);
  });
  it.each([
    ['(%rsp)', 4096n], ['8(%rbp)', 4104n], ['-8(%rbp)', 4088n],
    ['(%rsp,%rcx)', 4098n], ['(%rsp,%rcx,1)', 4098n], ['(%rsp,%rcx,2)', 4100n],
    ['(%rsp,%rcx,4)', 4104n], ['16(%rbp,%rcx,8)', 4128n], ['-16(%rbp,%rcx,8)', 4096n],
  ])('evaluates %s', (text, expected) => {
    const operand = parseOperand(text);
    expect(operand.kind).toBe('memory');
    if (operand.kind !== 'memory') throw new Error('Expected memory');
    expect(effectiveAddress(operand, createCPU(0, {rcx: 2n}).registers)).toBe(expected);
    expect(parseProgram(`leaq ${text}, %rax`).instructions[0].operands).toHaveLength(2);
  });
  it.each(['0', '3', '16', '-1', '1.5', 'four'])('rejects invalid scale %s', scale => {
    expect(() => parseProgram(`movq (%rsp,%rcx,${scale}), %rax`)).toThrow('Invalid scale');
  });
  it.each(['(%rsp,%rcx,)', '(%rsp,,4)', '(%rsp,%rcx,4,8)', '((%rsp))', '(%rsp,%rcx', '%rsp,%rcx)', '(%rsp)junk', '(%rsp,%rsp,4)'])('rejects malformed memory %s', address => {
    expect(() => parseProgram(`movq ${address}, %rax`)).toThrow();
  });
  it.each(['shlq %rax, %rbx', 'shlq $1, $2', 'shlq $256, %rax', 'shlq $-1, %rax', 'shlq (%rsp), %rax', 'shlq $1', 'mulq $2', 'mulq %rax, %rdx', 'call foo:\nfoo: ret', 'call missing', 'xyzq %rax', 'movq $1,, %rax'])('rejects invalid source without partial execution: %s', source => {
    expect(() => parseProgram(`movq $123, %rax\n${source}`)).toThrow(/Line \d+:/);
  });
  it('reverses indexed writes, memory shifts and multiplication exactly, and restarts', () => {
    const program = parseProgram('movq $2, %rcx\nmovq $-1, (%rsp,%rcx,4)\nshlq $1, (%rsp,%rcx,4)\nmovq $-1, %rax\nmovq $77, %rdx\nmulq (%rsp,%rcx,4)');
    const snapshots = [createSession(program)];
    while (!currentCPU(snapshots.at(-1)!).halted) snapshots.push(nextSession(program, snapshots.at(-1)!));
    const end = snapshots.at(-1)!;
    expect(currentCPU(end).registers).toMatchObject({rax: 2n, rdx: -3n});
    expect(end.steps.at(-1)!.changedRegisters).toEqual(['rax', 'rdx']);
    expect(end.steps[2].writtenAddresses).toEqual([4104]);
    expect(currentCPU(snapshots[2]).memory[4104]).toBe(-1n);
    expect(currentCPU(snapshots[3]).memory[4104]).toBe(-2n);
    snapshots.forEach((snapshot, cursor) => {
      const restored = seekSession(end, cursor);
      expect(currentCPU(restored)).toBe(currentCPU(snapshot));
      expect(Object.isFrozen(currentCPU(restored).registers)).toBe(true);
      if (cursor < end.cursor) expect(currentCPU(nextSession(program, restored))).toBe(currentCPU(snapshots[cursor + 1]));
    });
    expect(createSession(program)).toEqual(snapshots[0]);
  });
  it('runs a custom multiline program with indexed memory and a real call/ret', () => {
    const program = parseProgram(`
double_value:
    shlq $1, %rax
    ret

main:
    movq $2, %rcx
    movq $3, (%rsp,%rcx,4)
    movq $5, %rax
    addq (%rsp,%rcx,4), %rax
    call double_value
    mulq (%rsp,%rcx,4)
`);
    let session = createSession(program);
    for (let i = 0; !currentCPU(session).halted && i < 20; i++) session = nextSession(program, session);
    expect(currentCPU(session).halted).toBe(true);
    expect(currentCPU(session).registers).toMatchObject({rax: 48n, rdx: 0n, rsp: 4096n});
    expect(session.steps).toHaveLength(8);
    expect(currentCPU(seekSession(session, 5)).registers.rsp).toBe(4088n);
  });
});
