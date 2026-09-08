import { AssemblyError, type CPUState, type Operand, type Registers } from './types';

export const MAX_MEMORY_ADDRESS = 0xffff8n;
export const addressHex = (value: bigint | number): string => `0x${BigInt.asUintN(64, BigInt(value)).toString(16).toUpperCase().padStart(4, '0')}`;

export function memoryAddress(address: bigint): number {
  if (address < 0n || address > MAX_MEMORY_ADDRESS) {
    throw new AssemblyError(`Memory address ${addressHex(address)} is outside the simulated 1 MiB memory.`);
  }
  if (address % 8n !== 0n) throw new AssemblyError(`Memory address ${addressHex(address)} must be aligned to 8 bytes.`);
  return Number(address);
}

export function effectiveAddress(operand: Extract<Operand, {kind: 'memory'}>, registers: Readonly<Registers>): bigint {
  return BigInt.asIntN(64, registers[operand.base] + operand.displacement);
}

export function readMemory(memory: CPUState['memory'], address: bigint): bigint {
  const index = memoryAddress(address);
  const value = memory[index];
  if (value === undefined) throw new AssemblyError(`No value has been stored at ${addressHex(index)}. Initialize this memory before reading it.`);
  return value;
}

export function readOperand(operand: Operand, state: Pick<CPUState, 'registers' | 'memory'>): bigint {
  switch (operand.kind) {
    case 'immediate': return operand.value;
    case 'register': return state.registers[operand.name];
    case 'memory': return readMemory(state.memory, effectiveAddress(operand, state.registers));
    case 'label': throw new AssemblyError('A label is only valid as a call target.');
  }
}
