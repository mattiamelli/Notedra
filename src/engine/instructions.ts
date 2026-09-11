import { word } from './cpu';
import { addressHex, effectiveAddress, memoryAddress, readMemory, readOperand } from './memory';
import { AssemblyError, type CPUState, type Instruction, type Operand, type Program, type Registers } from './types';

export function applyInstruction(before: CPUState, instruction: Instruction, program: Program) {
  const registers: Registers = { ...before.registers };
  const memory = { ...before.memory };
  const returnAddresses = { ...before.returnAddresses };
  const state = { registers, memory };
  let rip = before.rip + 1;
  const explanation: string[] = [];
  const writtenAddresses: number[] = [];
  let pushedAddress: number | undefined;
  let poppedAddress: number | undefined;
  const [source, destination] = instruction.operands;
  const read = (operand: Operand): bigint => readOperand(operand, state);
  const describe = (operand: Operand): string => operand.kind === 'register' ? operand.name.toUpperCase() : operand.kind === 'memory' ? `Memory at ${addressHex(effectiveAddress(operand, registers))}` : 'Value';
  const store = (address: bigint, value: bigint): number => {
    const index = memoryAddress(address);
    memory[index] = word(value);
    delete returnAddresses[index];
    writtenAddresses.push(index);
    return index;
  };
  const write = (operand: Operand, value: bigint): void => {
    if (operand.kind === 'register') registers[operand.name] = word(value);
    else if (operand.kind === 'memory') store(effectiveAddress(operand, registers), value);
    else throw new AssemblyError('Cannot write to this operand.');
  };

  switch (instruction.opcode) {
    case 'movq': {
      const value = read(source);
      const target = describe(destination);
      write(destination, value);
      explanation.push(`${word(value)} was copied into ${target}. The source value is unchanged.`);
      if (source.kind === 'register' && source.name === 'rsp' && destination.kind === 'register' && destination.name === 'rbp') {
        explanation.splice(0, 1, 'The current stack pointer was copied into RBP.', `RBP changed from ${addressHex(before.registers.rbp)} to ${addressHex(registers.rbp)}.`, 'RBP can now be used as a stable reference point for this function’s stack frame.');
      } else if (source.kind === 'register' && source.name === 'rbp' && destination.kind === 'register' && destination.name === 'rsp') {
        explanation.push(`RSP moved from ${addressHex(before.registers.rsp)} to ${addressHex(registers.rsp)}. This releases the local stack space; stored values remain in memory.`);
      }
      break;
    }
    case 'pushq': {
      const value = read(source);
      const sourceDescription = describe(source);
      registers.rsp = word(registers.rsp - 8n);
      pushedAddress = store(registers.rsp, value);
      explanation.push(`RSP moved from ${addressHex(before.registers.rsp)} to ${addressHex(registers.rsp)}.`, `${sourceDescription} (${value}) was stored at ${addressHex(registers.rsp)}.`);
      if (source.kind === 'register' && source.name === 'rbp') explanation.push('This preserves the caller’s frame pointer at the beginning of a function.');
      else explanation.push('The stack grows downward: pushing one 64-bit value uses 8 bytes.');
      break;
    }
    case 'popq': {
      const value = readMemory(memory, registers.rsp);
      poppedAddress = memoryAddress(registers.rsp);
      registers.rsp = word(registers.rsp + 8n);
      const target = describe(source);
      // x86 resolves an RSP-based pop destination after incrementing RSP.
      write(source, value);
      explanation.push(`${value} was read from ${addressHex(poppedAddress)} into ${target}.`, `RSP changed from ${addressHex(before.registers.rsp)} to ${addressHex(registers.rsp)}.`, 'Popping does not erase memory. The old stack cell remains visible as a stored value.');
      break;
    }
    case 'addq': case 'subq': case 'imulq': case 'incq': case 'decq': {
      const target = destination ?? source;
      const original = read(target);
      const amount = destination ? read(source) : 1n;
      const subtract = instruction.opcode === 'subq' || instruction.opcode === 'decq';
      const multiply = instruction.opcode === 'imulq';
      const result = word(multiply ? original * amount : subtract ? original - amount : original + amount);
      const name = describe(target);
      write(target, result);
      explanation.push(`${name}: ${original} ${multiply ? '×' : subtract ? '−' : '+'} ${amount} = ${result}.`);
      if (instruction.opcode === 'subq' && target.kind === 'register' && target.name === 'rsp' && amount > 0n) {
        explanation.splice(0, 1, `${amount} bytes were reserved on the stack.`, `RSP changed from ${addressHex(before.registers.rsp)} to ${addressHex(registers.rsp)}.`, `This creates ${amount} bytes of space for local variables. Reserving space does not initialize it.`);
      }
      break;
    }
    case 'shlq': {
      const original = read(destination);
      const count = read(source) & 63n;
      const target = describe(destination);
      const result = word(original << count);
      // A zero effective count preserves memory and return-address annotations.
      if (count !== 0n) write(destination, result);
      explanation.push(`${target}: ${original} shifted left by ${count} = ${result}. Only the low 6 count bits and low 64 result bits are used.`);
      break;
    }
    case 'mulq': {
      // Read both inputs before changing either implicit destination (including aliases).
      const left = BigInt.asUintN(64, registers.rax);
      const right = BigInt.asUintN(64, read(source));
      const product = left * right;
      registers.rax = word(product);
      registers.rdx = word(product >> 64n);
      explanation.push(`Unsigned ${left} × ${right} = ${product}.`, `RDX:RAX holds the full 128-bit product: high ${BigInt.asUintN(64, registers.rdx)}, low ${BigInt.asUintN(64, registers.rax)}.`);
      break;
    }
    case 'leaq': {
      if (source.kind !== 'memory') throw new AssemblyError('leaq requires an effective address.');
      const address = effectiveAddress(source, registers);
      write(destination, address);
      const indexTerm = source.index ? ` + ${source.index.toUpperCase()} (${before.registers[source.index]}) × ${source.scale ?? 1}` : '';
      explanation.push(`${source.base.toUpperCase()} (${addressHex(before.registers[source.base])})${indexTerm} + (${source.displacement}) = ${addressHex(address)}.`, `The address was placed in ${describe(destination)}. No value was read from memory.`);
      break;
    }
    case 'call': {
      if (source.kind !== 'label') throw new AssemblyError('call requires a label.');
      const target = program.labels.get(source.name);
      if (target === undefined) throw new AssemblyError(`Unknown label "${source.name}"`);
      registers.rsp = word(registers.rsp - 8n);
      pushedAddress = store(registers.rsp, BigInt(rip));
      returnAddresses[pushedAddress] = rip;
      explanation.push(`Return address ${rip} (the next instruction index) was pushed at ${addressHex(registers.rsp)}.`, `Execution jumped to ${source.name}. RSP decreased by 8 bytes.`, 'The callee can return a result in RAX; RDI conventionally holds the first integer argument.');
      rip = target;
      break;
    }
    case 'ret': {
      const target = readMemory(memory, registers.rsp);
      if (target < 0n || target > BigInt(program.instructions.length)) throw new AssemblyError(`Invalid return address ${target}. Check the stack pointer and saved return address.`);
      poppedAddress = memoryAddress(registers.rsp);
      registers.rsp = word(registers.rsp + 8n);
      rip = Number(target);
      explanation.push(`Return address ${target} was read from ${addressHex(poppedAddress)}.`, `RSP increased to ${addressHex(registers.rsp)}. Execution ${rip === program.instructions.length ? 'reached the end of the program' : `resumed at instruction ${rip + 1}`}.`);
      break;
    }
  }
  return { state: {registers, memory, returnAddresses, rip, halted: rip === program.instructions.length}, instruction, explanation, writtenAddresses, pushedAddress, poppedAddress };
}
