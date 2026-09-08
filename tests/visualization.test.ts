import { afterEach, describe, expect, it, vi } from 'vitest';
import { createCPU } from '../src/engine/cpu';
import { executeStep } from '../src/engine/executor';
import { parseProgram } from '../src/engine/parser';
import { MAX_MEMORY_ADDRESS } from '../src/engine/memory';
import { stackAddresses } from '../src/utils/stackRows';
import { formatValue, readLocal, readPreferences, writeLocal } from '../src/utils/storage';

afterEach(() => vi.unstubAllGlobals());

describe('stack viewport', () => {
  it('orders higher addresses first and surrounds the initial pointers', () => {
    const addresses = stackAddresses(createCPU());
    expect(addresses).toContain(0x1000);
    expect(addresses[0]).toBe(0x1010);
    expect(addresses).toEqual([...addresses].sort((a,b) => b-a));
  });
  it('keeps distant stack and frame pointers in a bounded viewport', () => {
    const addresses = stackAddresses(createCPU(0, {rsp: 0x100n, rbp: 0xf0000n}));
    expect(addresses).toContain(0x100);
    expect(addresses).toContain(0xf0000);
    expect(addresses.length).toBeLessThan(30);
  });
  it('includes recently written memory even outside the current frame', () => {
    const program = parseProgram('movq $1, (%rax)');
    const result = executeStep(program, createCPU(0, {rax: 0x5000n}));
    expect(stackAddresses(result.state, result)).toContain(0x5000);
  });
  it('includes popped cells and clamps memory boundaries', () => {
    const addresses = stackAddresses(createCPU(0, {rsp: 0n, rbp: MAX_MEMORY_ADDRESS}));
    expect(addresses).toContain(0);
    expect(addresses).toContain(Number(MAX_MEMORY_ADDRESS));
    expect(addresses.every(address => address >= 0 && BigInt(address) <= MAX_MEMORY_ADDRESS)).toBe(true);
  });
  it('does not expand arbitrarily for invalid or enormous pointers', () => {
    const addresses = stackAddresses(createCPU(0, {rsp: -(2n ** 63n), rbp: 2n ** 62n}));
    expect(addresses).toContain(0x1000);
    expect(addresses.length).toBeLessThan(20);
  });
});

describe('local preferences and integer display', () => {
  it('formats the full 64-bit word, without precision loss', () => {
    expect(formatValue(-1n, 'hex')).toBe('0xFFFFFFFFFFFFFFFF');
    expect(formatValue(9223372036854775807n, 'decimal')).toBe('9223372036854775807');
  });
  it('handles unavailable localStorage without crashing', () => {
    vi.stubGlobal('localStorage', {getItem: () => {throw new Error('blocked');}, setItem: () => {throw new Error('blocked');}});
    expect(readLocal('program')).toBeNull();
    expect(writeLocal('program', 'movq $1, %rax')).toBe(false);
    expect(readPreferences().format).toBe('decimal');
  });
  it('stores the program and validates persisted preferences', () => {
    const values = new Map<string,string>();
    vi.stubGlobal('localStorage', {getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key,value)});
    expect(writeLocal('program', 'movq $2, %rax')).toBe(true);
    expect(readLocal('program')).toBe('movq $2, %rax');
    writeLocal('format', 'hex');
    expect(readPreferences().format).toBe('hex');
    writeLocal('format', 'invalid');
    expect(readPreferences().format).toBe('decimal');
  });
});
