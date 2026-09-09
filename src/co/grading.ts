import {validateAnswer, type Answer} from '../learning/contracts';
import type {GradeResult, InputResult} from '../practice/types';
import type {COExercise, COTask} from './types';

function normalized(task: COTask, input: string): string | null {
  const value = input.trim();
  if (value.length > 64) return null;
  if (task.format === 'binary' || task.format === 'hex') {
    if (!Number.isInteger(task.width) || task.width! < 1 || task.width! > 64 || value.length !== task.width) return null;
    if (!(task.format === 'binary' ? /^[01]+$/ : /^[0-9a-fA-F]+$/).test(value)) return null;
    return value.toLowerCase();
  }
  if (task.width !== null || !['integer', 'decimal'].includes(task.format)) return null;
  if (!(task.format === 'integer' ? /^-?\d+$/ : /^-?\d+(?:\.\d+)?$/).test(value)) return null;
  const negative = value.startsWith('-');
  const [whole, fraction = ''] = value.replace(/^-/, '').split('.');
  const digits = whole.replace(/^0+(?=\d)/, ''); const tail = fraction.replace(/0+$/, '');
  const zero = digits === '0' && !tail;
  return `${negative && !zero ? '-' : ''}${digits}${tail ? '.' + tail : ''}`;
}
export function validateCOResponse(task: COTask, answer: Answer): InputResult {
  if (task.kind !== 'co-exact') return {status: 'NOT_AUTOGRADABLE', message: 'This activity has no automatic grader.'};
  try { validateAnswer(answer); } catch { return {status: 'INVALID', message: 'Malformed or oversized answer.'}; }
  if (answer.kind !== 'text') return {status: 'INVALID', message: 'Enter an answer in the stated format.'};
  if (!answer.value.trim()) return {status: 'INCOMPLETE', message: 'Enter an answer before submitting.'};
  if (normalized(task, answer.value) === null) return {status: 'INVALID', message: 'Use the stated digits and width. No units, prefixes, exponent notation or internal spaces are accepted.'};
  return {status: 'VALID'};
}
/** Exact fixed reference items only; open design/rubric activities never enter this grader. */
export function gradeCOResponse(exercise: COExercise, answer: Answer): GradeResult {
  if (exercise.task.kind !== 'co-exact' || exercise.grader.id !== 'co-exact' || exercise.grader.version !== '1') {
    return {status: 'NOT_AUTOGRADABLE', message: 'The original automatic grader is unavailable.'};
  }
  try {
    if (exercise.reference.kind !== 'text') throw new Error('Invalid trusted reference.');
    const expected = normalized(exercise.task, exercise.reference.value);
    if (expected === null) throw new Error('Invalid trusted reference.');
    const validation = validateCOResponse(exercise.task, answer);
    if (validation.status !== 'VALID') return validation;
    const correct = answer.kind === 'text' && normalized(exercise.task, answer.value) === expected;
    return {status: 'GRADED', correct, earned: correct ? 1 : 0, max: 1,
      explanation: exercise.explanation, reference: structuredClone(exercise.reference)};
  } catch {
    return {status: 'ERROR', message: 'A technical grading problem occurred. Your answer is preserved; no incorrect result was assigned.'};
  }
}
