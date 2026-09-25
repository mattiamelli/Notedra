import {validateAnswer, type Answer} from '../learning/contracts';
import type {GradeResult, InputResult} from '../practice/types';
import type {CurriculumPracticeExercise, CurriculumTask} from './practice';

type RubricFeedback = {status: 'NOT_AUTOGRADABLE'; message: string; feedback: 'CURRICULUM_RUBRIC'};
export function isCurriculumRubricFeedback(result: GradeResult): result is RubricFeedback {
  return result.status === 'NOT_AUTOGRADABLE' && 'feedback' in result && result.feedback === 'CURRICULUM_RUBRIC';
}

function integer(value: string): string | null {
  const text = value.trim();
  return /^[+-]?\d{1,64}$/.test(text) ? BigInt(text).toString() : null;
}

function supportedTask(task: CurriculumTask): boolean {
  if (!task || task.kind !== 'curriculum' || !['choice', 'integer', 'open'].includes(task.format)) return false;
  if (!Array.isArray(task.options) || task.options.length > 50 || !Array.isArray(task.rubric) || task.rubric.length > 50) return false;
  if (task.rubric.some(item => typeof item !== 'string' || !item.trim() || item.length > 16000)) return false;
  if (task.options.some(option => !option || typeof option.id !== 'string' || !option.id || option.id.length > 200
    || typeof option.text !== 'string' || !option.text.trim() || option.text.length > 16000)) return false;
  return new Set(task.options.map(option => option.id)).size === task.options.length
    && (task.format !== 'choice' || task.options.length >= 2);
}

export function validateCurriculumResponse(task: CurriculumTask, answer: Answer): InputResult {
  if (!supportedTask(task)) return {status: 'NOT_AUTOGRADABLE', message: 'This curriculum task format is unavailable.'};
  try { validateAnswer(answer); } catch { return {status: 'INVALID', message: 'Invalid or oversized answer.'}; }
  if (task.format === 'choice') {
    if (answer.kind !== 'choice') return {status: 'INVALID', message: 'Choose one of the available answers.'};
    if (!answer.value.length) return {status: 'INCOMPLETE', message: 'Choose an answer.'};
    if (answer.value.length !== 1 || !task.options.some(option => option.id === answer.value[0]))
      return {status: 'INVALID', message: 'Choose exactly one available answer.'};
  } else {
    if (answer.kind !== 'text') return {status: 'INVALID', message: 'Enter a text response.'};
    if (!answer.value.trim()) return {status: 'INCOMPLETE', message: 'Enter an answer.'};
    if (task.format === 'integer' && integer(answer.value) === null)
      return {status: 'INVALID', message: 'Enter a base-10 integer with at most 64 digits.'};
  }
  return {status: 'VALID'};
}

export function gradeCurriculumResponse(exercise: CurriculumPracticeExercise, answer: Answer): GradeResult | RubricFeedback {
  if (exercise.grader?.id !== 'curriculum' || exercise.grader.version !== '1' || exercise.version !== '1')
    return {status: 'NOT_AUTOGRADABLE', message: 'This curriculum grader version is unavailable.'};
  const validation = validateCurriculumResponse(exercise.task, answer);
  if (validation.status !== 'VALID') return validation;
  if (exercise.task.format === 'open') return {
    status: 'NOT_AUTOGRADABLE',
    feedback: 'CURRICULUM_RUBRIC',
    message: ['This response is ungraded. Compare your reasoning with the rubric.', ...exercise.task.rubric, exercise.explanation].join('\n'),
  };
  const reference = exercise.reference;
  try { validateAnswer(reference); } catch { return {status: 'ERROR', message: 'The reference answer is unavailable.'}; }
  let correct: boolean;
  if (exercise.task.format === 'choice') {
    if (reference.kind !== 'choice' || reference.value.length !== 1 || !exercise.task.options.some(option => option.id === reference.value[0]))
      return {status: 'ERROR', message: 'The reference answer is unavailable.'};
    correct = answer.kind === 'choice' && answer.value[0] === reference.value[0];
  } else {
    if (reference.kind !== 'text' || integer(reference.value) === null)
      return {status: 'ERROR', message: 'The reference answer is unavailable.'};
    correct = answer.kind === 'text' && integer(answer.value) === integer(reference.value);
  }
  return {status: 'GRADED', correct, earned: correct ? 1 : 0, max: 1, explanation: exercise.explanation, reference};
}
