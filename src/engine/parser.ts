import { AssemblyError, OPCODES, REGISTER_NAMES, type Instruction, type Opcode, type Operand, type Program, type RegisterName } from './types';

const integerPattern = /^[+-]?(?:0x[\da-f]+|\d+)$/i;
const labelPattern = /^[A-Za-z_.][\w.]*$/;

function integer(text: string, line: number): bigint {
  if (!integerPattern.test(text)) throw new AssemblyError(`Invalid operand "${text}"`, line);
  const negative = text.startsWith('-');
  const magnitude = BigInt(text.replace(/^[+-]/, ''));
  return negative ? -magnitude : magnitude;
}

function register(text: string, line: number): RegisterName {
  const name = text.slice(1);
  if (!REGISTER_NAMES.includes(name as RegisterName)) throw new AssemblyError(`Unknown register "${text}"`, line);
  return name as RegisterName;
}

export function parseOperand(text: string, line = 1): Operand {
  text = text.trim();
  if (text.startsWith('$')) {
    if (!integerPattern.test(text.slice(1))) throw new AssemblyError(`Invalid operand "${text}"`, line);
    return { kind: 'immediate', value: integer(text.slice(1), line) };
  }
  if (/^%\w+$/.test(text)) return { kind: 'register', name: register(text, line) };
  const memory = /^([+-]?(?:0x[\da-f]+|\d+))?\s*\(\s*(%\w+)\s*\)$/i.exec(text);
  if (memory) return { kind: 'memory', base: register(memory[2], line), displacement: memory[1] ? integer(memory[1], line) : 0n };
  if (labelPattern.test(text)) return { kind: 'label', name: text };
  throw new AssemblyError(`Invalid operand "${text}"`, line);
}

function validate(instruction: Instruction): void {
  const {opcode, operands, line} = instruction;
  const expected = opcode === 'ret' ? 0 : ['pushq','popq','incq','decq','call'].includes(opcode) ? 1 : 2;
  if (operands.length !== expected) throw new AssemblyError(`${opcode} expects ${expected} operand${expected === 1 ? '' : 's'}.`, line);
  const fail = (message: string): never => { throw new AssemblyError(message, line); };
  if (opcode === 'ret') return;
  const [source, destination] = operands;
  if (opcode === 'call') {
    if (source.kind !== 'label') fail('call requires a label, such as call calculate.');
    return;
  }
  if (operands.some(operand => operand.kind === 'label')) fail('Use $ for an immediate, % for a register, or displacement(%register) for memory.');
  if (opcode === 'leaq') {
    if (source.kind !== 'memory' || destination.kind !== 'register') fail('leaq requires a memory address and a destination register.');
    return;
  }
  if (opcode === 'pushq') return;
  const target = destination ?? source;
  if (target.kind !== 'register' && target.kind !== 'memory') fail(`${opcode} requires a register or memory destination.`);
  if (opcode === 'imulq' && target.kind !== 'register') fail('Two-operand imulq requires a register destination.');
  if (destination && source.kind === 'memory' && destination.kind === 'memory') fail(`${opcode} does not support two memory operands. Use a register in between.`);
}

export function parseProgram(source: string): Program {
  const instructions: Instruction[] = [];
  const labels = new Map<string, number>();
  source.split(/\r?\n/).forEach((raw, offset) => {
    const line = offset + 1;
    let text = raw.split('#')[0].trim();
    while (true) {
      const label = /^([A-Za-z_.][\w.]*):/.exec(text);
      if (!label) break;
      if (labels.has(label[1])) throw new AssemblyError(`Duplicate label "${label[1]}"`, line);
      labels.set(label[1], instructions.length);
      text = text.slice(label[0].length).trim();
    }
    if (!text) return;
    const [mnemonic] = text.split(/\s+/);
    if (!OPCODES.includes(mnemonic as Opcode)) throw new AssemblyError(`Unsupported instruction "${mnemonic}"`, line);
    const argumentText = text.slice(mnemonic.length).trim();
    const operands = argumentText ? argumentText.split(',').map(part => parseOperand(part, line)) : [];
    const instruction = Object.freeze({ opcode: mnemonic as Opcode, operands: Object.freeze(operands.map(operand => Object.freeze(operand))), line, text });
    validate(instruction);
    instructions.push(instruction);
  });
  if (!instructions.length) throw new AssemblyError('No instructions found. Paste a program or choose an example.');
  for (const instruction of instructions) {
    if (instruction.opcode !== 'call') continue;
    const target = instruction.operands[0];
    if (target.kind === 'label' && (!labels.has(target.name) || labels.get(target.name) === instructions.length)) {
      throw new AssemblyError(`Unknown or empty label "${target.name}"`, instruction.line);
    }
  }
  const entry = labels.get('main') ?? 0;
  if (entry === instructions.length) throw new AssemblyError('The main label has no instructions.');
  return Object.freeze({ source, instructions: Object.freeze(instructions), labels, entry });
}
