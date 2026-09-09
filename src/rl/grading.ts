import {validateAnswer, type Answer} from '../learning/contracts';
import type {GradeResult, InputResult} from '../practice/types';
import type {RLExercise, RLTask} from './practice-types';

function assertTask(task: RLTask): void {
  if (!task || task.kind !== 'rl-exact' || Object.keys(task).sort().join(',') !== 'format,kind,width') throw new Error('Invalid trusted task.');
  if (task.format === 'binary') {
    if (!Number.isInteger(task.width) || task.width! < 1 || task.width! > 64) throw new Error('Invalid trusted width.');
  } else if (!['integer', 'integer-set'].includes(task.format) || task.width !== null) {
    throw new Error('Invalid trusted response format.');
  }
}

function integer(value: string): string | null {
  if (!/^-?\d{1,64}$/.test(value)) return null;
  const negative = value.startsWith('-');
  const digits = value.replace(/^-/, '').replace(/^0+(?=\d)/, '');
  return negative && digits !== '0' ? '-' + digits : digits;
}

/** This recognizes bounded answer tokens, never formulas or executable learner input. */
function normalized(task: RLTask, input: string): string | null {
  const value = input.trim();
  if (value.length > 2048) return null;
  if (task.format === 'binary') return value.length === task.width && /^[01]+$/.test(value) ? value : null;
  if (task.format === 'integer') return integer(value);
  if (!value.startsWith('{') || !value.endsWith('}')) return null;
  const interior = value.slice(1, -1).trim();
  if (!interior) return '{}';
  const tokens = interior.split(',');
  if (tokens.length > 32) return null;
  const numbers = tokens.map(token => integer(token.trim()));
  if (numbers.some(number => number === null)) return null;
  // Membership determines a finite set. Order and repeated elements cannot change it.
  return '{' + [...new Set(numbers as string[])].sort().join(',') + '}';
}

export function validateRLResponse(task: RLTask | {kind: string}, answer: Answer): InputResult {
  if (!task || task.kind !== 'rl-exact') return {status: 'NOT_AUTOGRADABLE', message: 'This activity has no automatic correctness score.'};
  try { assertTask(task as RLTask); } catch { return {status: 'NOT_AUTOGRADABLE', message: 'The original response format is unavailable.'}; }
  try { validateAnswer(answer); } catch { return {status: 'INVALID', message: 'Malformed or oversized answer.'}; }
  if (answer.kind !== 'text') return {status: 'INVALID', message: 'Enter the controlled answer format stated above.'};
  if (!answer.value.trim()) return {status: 'INCOMPLETE', message: 'Enter an answer before submitting.'};
  if (normalized(task as RLTask, answer.value) === null) return {status: 'INVALID', message: 'Use the stated integer, exact binary width, or flat integer-set format. Formulas, proofs, units and exponent notation are not accepted.'};
  return {status: 'VALID'};
}

/** Fixed, independently checked references only; this is not a proof or construction grader. */
export function gradeRLResponse(exercise: RLExercise, answer: Answer): GradeResult {
  try {
    if (exercise.task?.kind !== 'rl-exact' || exercise.grader?.id !== 'rl-exact' || exercise.grader.version !== '1') {
      return {status: 'NOT_AUTOGRADABLE', message: 'The original automatic grader is unavailable. Guided reasoning has no automatic correctness score.'};
    }
    assertTask(exercise.task);
    validateAnswer(exercise.reference);
    if (exercise.reference.kind !== 'text') throw new Error('Invalid trusted reference kind.');
    const expected = normalized(exercise.task, exercise.reference.value);
    if (expected === null) throw new Error('Invalid trusted reference format.');
    const validation = validateRLResponse(exercise.task, answer);
    if (validation.status !== 'VALID') return validation;
    const correct = answer.kind === 'text' && normalized(exercise.task, answer.value) === expected;
    return {status: 'GRADED', correct, earned: correct ? 1 : 0, max: 1, explanation: exercise.explanation, reference: structuredClone(exercise.reference)};
  } catch {
    return {status: 'ERROR', message: 'A technical grading problem occurred. Your answer is preserved; no incorrect result was assigned.'};
  }
}
