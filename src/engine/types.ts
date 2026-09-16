export const REGISTER_NAMES = ['rax','rbx','rcx','rdx','rsi','rdi','rbp','rsp','r8','r9','r10','r11','r12','r13','r14','r15'] as const;
export type RegisterName = typeof REGISTER_NAMES[number];
export type Registers = Record<RegisterName, bigint>;
export type OperandWidth = 8 | 16 | 32 | 64;
export interface RegisterAlias {readonly text:string; readonly name:RegisterName; readonly width:OperandWidth; readonly offset:0|8;}
export const OPCODES = ['mov','movzx','push','pop','xchg','lea','add','sub','inc','dec','mul','imul','div','idiv','xor','or','and','shl','shr','cmp','jmp','je','jne','jg','jge','jl','jle','loop','call','ret','syscall'] as const;
export type Opcode = typeof OPCODES[number];
export interface RegisterOperand {readonly kind:'register'; readonly alias:RegisterAlias; readonly name:RegisterName;}
export interface MemoryOperand {kind:'memory'; base?:RegisterName; index?:RegisterName; scale?:1|2|4|8; displacement:bigint; symbol?:string;}
export type Operand =
  | {readonly kind:'immediate'; readonly value:bigint; readonly symbol?:string}
  | RegisterOperand
  | MemoryOperand
  | {readonly kind:'label'; readonly name:string}
  | {readonly kind:'indirect'; readonly target:Extract<Operand,{kind:'register'|'memory'}>};
export interface Instruction {readonly opcode:Opcode; readonly mnemonic:string; readonly width:OperandWidth; readonly sourceWidth?:OperandWidth; readonly operands:readonly Operand[]; readonly line:number; readonly text:string;}
export type SegmentName='text'|'data'|'bss'|'stack';
export interface ProgramSymbol {readonly name:string; readonly kind:'text'|'data'|'bss'|'constant'|'external'; readonly value:bigint; readonly size:number; readonly exported:boolean;}
export interface ProgramVariable {readonly name:string; readonly address:number; readonly size:number; readonly segment:'text'|'data'|'bss';}
export interface Program {readonly source:string; readonly instructions:readonly Instruction[]; readonly labels:ReadonlyMap<string,number>; readonly symbols:ReadonlyMap<string,ProgramSymbol>; readonly exports:ReadonlySet<string>; readonly initialBytes:Readonly<Record<number,number>>; readonly initialMemory:Readonly<Record<number,bigint>>; readonly variables:readonly ProgramVariable[]; readonly entry:number;}
export interface Flags {zf:boolean; sf:boolean; of:boolean; cf:boolean;}
export interface CPUState {readonly registers:Readonly<Registers>; readonly flags:Readonly<Flags>; readonly memory:Readonly<Record<number,bigint>>; readonly bytes:Readonly<Record<number,number>>; readonly returnAddresses:Readonly<Record<number,number>>; readonly rip:number; readonly halted:boolean; readonly terminal:string; readonly input:string; readonly inputOffset:number; readonly exitCode?:bigint; readonly callDepth:number;}
export interface StepResult {readonly state:CPUState; readonly instruction:Instruction; readonly explanation:readonly string[]; readonly changedRegisters:readonly RegisterName[]; readonly changedFlags:readonly (keyof Flags)[]; readonly writtenAddresses:readonly number[]; readonly warnings:readonly string[]; readonly pushedAddress?:number; readonly poppedAddress?:number;}
export type AssemblyErrorCode='PARSE_ERROR'|'UNKNOWN_INSTRUCTION'|'UNKNOWN_REGISTER'|'INVALID_OPERAND'|'INVALID_OPERAND_COUNT'|'INVALID_SCALE'|'UNDEFINED_SYMBOL'|'DUPLICATE_SYMBOL'|'MEMORY_ACCESS_ERROR'|'STACK_UNDERFLOW'|'DIVIDE_BY_ZERO'|'DIVISION_OVERFLOW'|'INVALID_JUMP_TARGET'|'UNSUPPORTED_SYSCALL'|'INPUT_REQUIRED'|'EXECUTION_LIMIT';
export class AssemblyError extends Error {constructor(message:string,readonly line?:number,readonly code:AssemblyErrorCode='PARSE_ERROR'){super(line?`Line ${line}: ${message}`:message);this.name='AssemblyError';}}
