import { freezeCPU } from './cpu';
import { applyInstruction } from './instructions';
import { AssemblyError, REGISTER_NAMES, type CPUState, type Program, type StepResult } from './types';

export function executeStep(program: Program, before: CPUState): StepResult {
  if (before.halted) throw new AssemblyError('The program has finished. Reset or step backwards to continue.');
  const instruction = program.instructions[before.rip];
  if (!instruction) throw new AssemblyError(`Invalid instruction index ${before.rip}.`);
  try {
    const result = applyInstruction(before, instruction, program);
    return Object.freeze({
      ...result,
      state: freezeCPU(result.state),
      explanation: Object.freeze(result.explanation),
      writtenAddresses: Object.freeze(result.writtenAddresses),
      changedRegisters: Object.freeze(REGISTER_NAMES.filter(name => before.registers[name] !== result.state.registers[name])),
      changedFlags: Object.freeze((['zf', 'sf', 'of', 'cf'] as const).filter(name => before.flags[name] !== result.state.flags[name])),
    });
  } catch (error) {
    throw new AssemblyError(error instanceof Error ? error.message : 'Instruction could not be executed.', instruction.line);
  }
}
