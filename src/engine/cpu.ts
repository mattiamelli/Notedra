import type { CPUState, Registers } from './types';

export const INITIAL_STACK_POINTER = 0x1000n;
export const word = (value: bigint): bigint => BigInt.asIntN(64, value);

export function freezeCPU(state: CPUState): CPUState {
  Object.freeze(state.registers);
  Object.freeze(state.memory);
  Object.freeze(state.returnAddresses);
  return Object.freeze(state);
}

export function createCPU(entry = 0, initial: Partial<Registers> = {}): CPUState {
  const registers: Registers = {
    rax: 0n, rbx: 0n, rcx: 0n, rdx: 0n, rsi: 0n, rdi: 0n,
    rsp: INITIAL_STACK_POINTER, rbp: INITIAL_STACK_POINTER, ...initial,
  };
  for (const name of Object.keys(registers) as (keyof Registers)[]) registers[name] = word(registers[name]);
  return freezeCPU({ registers, memory: {}, returnAddresses: {}, rip: entry, halted: false });
}
