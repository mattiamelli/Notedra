import { validateAnswer, type Answer } from '../learning/contracts';
import type { Exercise, Expression, GradeResult, InputResult, Task } from './types';
export function formulaText(expr: Expression): string {
  if (expr.op === 'var') return expr.name;
  if (expr.op === 'not') return `¬${formulaText(expr.arg)}`;
  return `(${formulaText(expr.left)} ${expr.op === 'and' ? '∧' : '∨'} ${formulaText(expr.right)})`;
}
export function evaluateExpression(expr: Expression, p: boolean, q: boolean, depth = 0): boolean {
  if (depth > 8) throw new Error('Expression exceeds depth limit.');
  if (expr.op === 'var') {
    if (expr.name !== 'p' && expr.name !== 'q') throw new Error('Unknown trusted proposition.');
    return expr.name === 'p' ? p : q;
  }
  if (expr.op === 'not') return !evaluateExpression(expr.arg, p, q, depth + 1);
  if (expr.op === 'and') return evaluateExpression(expr.left, p, q, depth + 1) && evaluateExpression(expr.right, p, q, depth + 1);
  if (expr.op === 'or') return evaluateExpression(expr.left, p, q, depth + 1) || evaluateExpression(expr.right, p, q, depth + 1);
  throw new Error('Unsupported expression.');
}
const invalid = (message: string): InputResult => ({status: 'INVALID', message});
const incomplete = (message: string): InputResult => ({status: 'INCOMPLETE', message});
export function validateResponse(task: Task | {kind: string}, answer: Answer): InputResult {
  if (!['radix', 'truth', 'java-output'].includes(task.kind)) return {status: 'NOT_AUTOGRADABLE', message: 'This task cannot be graded automatically.'};
  try { validateAnswer(answer); } catch { return invalid('Malformed or oversized answer payload. Use the labelled controls.'); }
  const spec = task as Task;
  if (spec.kind === 'radix') {
    if (answer.kind !== 'text' || typeof answer.value !== 'string') return invalid('Enter a text answer using the required digits.');
    const value = answer.value.trim();
    if (!value) return incomplete('Enter an answer before submitting.');
    if (value.length !== spec.width) return invalid(`Use exactly ${spec.width} digits.`);
    if (!(spec.base === 2 ? /^[01]+$/ : /^[0-9a-fA-F]+$/).test(value)) return invalid('The answer contains digits or characters not allowed in this base.');
  } else {
    if (answer.kind !== 'choice' || !Array.isArray(answer.value) || answer.value.some(item => typeof item !== 'string')) return invalid('Use the labelled answer controls.');
    if (new Set(answer.value).size !== answer.value.length) return invalid('Duplicate answers are not allowed.');
    if (spec.kind === 'truth') {
      for (const token of answer.value) if (!spec.rows.some(row => token === `${row.id}:T` || token === `${row.id}:F`)) return invalid('Unknown truth-table row or value.');
      if (spec.rows.some(row => answer.value.filter(token => token.startsWith(`${row.id}:`)).length > 1)) return invalid('Choose only one value per row.');
      if (answer.value.length < spec.rows.length) return incomplete('Complete every truth-table row before submitting.');
    } else {
      if (answer.value.some(id => !spec.options.some(option => option.id === id))) return invalid('Unknown output option.');
      if (answer.value.length === 0) return incomplete('Select an output before submitting.');
      if (answer.value.length !== 1) return invalid('Select exactly one output.');
    }
  }
  return {status: 'VALID'};
}
export function gradeResponse(exercise: Exercise, answer: Answer): GradeResult {
  try {
    const supported = {radix: 'radix-exact', truth: 'truth-rows', 'java-output': 'fixed-output-choice'};
    const task = exercise.task;
    if (!(task.kind in supported)) return {status: 'NOT_AUTOGRADABLE', message: 'This task cannot be graded automatically.'};
    if (exercise.grader.version !== '1' || exercise.grader.id !== supported[task.kind]) return {status: 'NOT_AUTOGRADABLE', message: 'The original grader version is unavailable.'};
    const validation = validateResponse(task, answer);
    if (validation.status !== 'VALID') return validation;
    let correct: boolean;
    if (task.kind === 'radix') {
      if (!/^\d{1,20}$/.test(task.decimal) || !Number.isInteger(task.width) || task.width < 1 || task.width > 64 || ![2,16].includes(task.base)) throw new Error('Invalid trusted radix specification.');
      const value = BigInt(task.decimal);
      const expected = value.toString(task.base).padStart(task.width, '0');
      if (expected.length !== task.width) throw new Error('Value does not fit trusted width.');
      correct = (answer.value as string).trim().toLowerCase() === expected;
    } else if (task.kind === 'truth') {
      const expected = task.rows.map(row => `${row.id}:${evaluateExpression(task.expression, row.p, row.q) ? 'T' : 'F'}`);
      correct = expected.every(token => (answer.value as string[]).includes(token));
    } else {
      if (exercise.reference.kind !== 'choice' || exercise.reference.value.length !== 1 || !task.options.some(option => option.id === exercise.reference.value[0])) throw new Error('Invalid trusted output key.');
      correct = answer.value[0] === exercise.reference.value[0];
    }
    return {status: 'GRADED', correct, earned: correct ? 1 : 0, max: 1, explanation: exercise.explanation, reference: structuredClone(exercise.reference)};
  } catch { return {status: 'ERROR', message: 'A technical grading problem occurred. Your submitted answer is preserved; this is not an incorrect result.'}; }
}
export function initialAnswer(exercise: Exercise): Answer { return exercise.task.kind === 'radix' ? {kind: 'text', value: ''} : {kind: 'choice', value: []}; }
