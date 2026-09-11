export const REGISTER_NAMES = ['rax', 'rbx', 'rcx', 'rdx', 'rdi', 'rsi', 'rsp', 'rbp'] as const;
export type RegisterName = typeof REGISTER_NAMES[number];
export type Registers = Record<RegisterName, bigint>;
export const OPCODES = ['movq', 'pushq', 'popq', 'addq', 'subq', 'imulq', 'shlq', 'mulq', 'incq', 'decq', 'leaq', 'call', 'ret'] as const;
export type Opcode = typeof OPCODES[number];
export type Operand =
  | { kind: 'immediate'; value: bigint }
  | { kind: 'register'; name: RegisterName }
  | { kind: 'memory'; base: RegisterName; displacement: bigint; index?: RegisterName; scale?: 1 | 2 | 4 | 8 }
  | { kind: 'label'; name: string };
export interface Instruction {
  readonly opcode: Opcode;
  readonly operands: readonly Operand[];
  readonly line: number;
  readonly text: string;
}
export interface Program {
  readonly source: string;
  readonly instructions: readonly Instruction[];
  readonly labels: ReadonlyMap<string, number>;
  readonly entry: number;
}
export interface CPUState {
  readonly registers: Readonly<Registers>;
  readonly memory: Readonly<Record<number, bigint>>;
  readonly returnAddresses: Readonly<Record<number, number>>;
  readonly rip: number;
  readonly halted: boolean;
}
export interface StepResult {
  readonly state: CPUState;
  readonly instruction: Instruction;
  readonly explanation: readonly string[];
  readonly changedRegisters: readonly RegisterName[];
  readonly writtenAddresses: readonly number[];
  readonly pushedAddress?: number;
  readonly poppedAddress?: number;
}
export class AssemblyError extends Error {
  constructor(message: string, readonly line?: number) {
    super(line ? `Line ${line}: ${message}` : message);
    this.name = 'AssemblyError';
  }
}
