import { MAX_MEMORY_ADDRESS } from '../engine/memory';
import type { CPUState, StepResult } from '../engine/types';

export function stackAddresses(cpu: CPUState, step?: StepResult): number[] {
  const valid = (value: bigint) => value >= 0n && value <= MAX_MEMORY_ADDRESS;
  const pointers = [cpu.registers.rsp, cpu.registers.rbp, 0x1000n].filter(valid).map(value => Number(value - value % 8n));
  const minimum = Math.min(...pointers) - 48;
  const maximum = Math.max(...pointers) + 16;
  const addresses = new Set<number>();
  if (maximum - minimum <= 256) {
    for (let address = minimum; address <= maximum; address += 8) addresses.add(address);
  } else {
    for (const pointer of pointers) for (let offset = -32; offset <= 16; offset += 8) addresses.add(pointer + offset);
  }
  for (const address of step?.writtenAddresses ?? []) addresses.add(address);
  if (step?.poppedAddress !== undefined) addresses.add(step.poppedAddress);
  return [...addresses].filter(value => value >= 0 && value <= Number(MAX_MEMORY_ADDRESS)).sort((a,b) => b-a);
}
