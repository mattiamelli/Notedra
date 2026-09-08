import { createCPU } from './cpu';
import { executeStep } from './executor';
import { AssemblyError, type CPUState, type Program, type StepResult } from './types';

export const MAX_STEPS = 2000;
export interface Session {
  readonly initial: CPUState;
  readonly steps: readonly StepResult[];
  readonly cursor: number;
}
export const createSession = (program: Program): Session => Object.freeze({initial: createCPU(program.entry), steps: Object.freeze([]), cursor: 0});
export const currentCPU = (session: Session): CPUState => session.cursor === 0 ? session.initial : session.steps[session.cursor - 1].state;
export function seekSession(session: Session, cursor: number): Session {
  return Object.freeze({...session, cursor: Math.max(0, Math.min(session.steps.length, cursor))});
}
export function nextSession(program: Program, session: Session): Session {
  if (session.cursor < session.steps.length) return seekSession(session, session.cursor + 1);
  if (session.steps.length >= MAX_STEPS) throw new AssemblyError(`Stopped after ${MAX_STEPS.toLocaleString()} instructions to keep the browser responsive. Check for recursion or fall-through, then reset.`);
  const step = executeStep(program, currentCPU(session));
  return Object.freeze({...session, steps: Object.freeze([...session.steps, step]), cursor: session.cursor + 1});
}
