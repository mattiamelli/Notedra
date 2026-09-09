import { LearningError, validateAttempt, type Answer, type Attempt, type LoadedState, type WriteToken } from '../learning/contracts';
import type { StudentRepository } from '../learning/repository';
import { getExercise, versionBinding } from './catalog';
import { gradeResponse, initialAnswer, validateResponse } from './runtime';
import type { GradeResult } from './types';
import type { PracticeExercise as Exercise } from './registered-types';
export type Resolution = {status: 'AVAILABLE'; exercise: Exercise} | {status: 'UNAVAILABLE'; message: string};
export function resolveAttempt(attempt: Attempt): Resolution {
  try { validateAttempt(attempt); } catch { return {status: 'UNAVAILABLE', message: 'This stored attempt is invalid. Its original answer has not been changed.'}; }
  const exercise = attempt.templateRef && getExercise(attempt.templateRef);
  if (!exercise || !attempt.exercise || attempt.exercise.version !== versionBinding(exercise)) return {status: 'UNAVAILABLE', message: 'Original exercise version unavailable. Your saved answer is preserved and has not been graded against another version.'};
  if (attempt.exercise.id !== `ds.instance.${attempt.attemptId}` || attempt.subjectId !== exercise.subjectId || attempt.topicId !== exercise.topicId || attempt.subtopicId !== exercise.subtopicId || attempt.targetedSkillIds.length !== 1 || attempt.targetedSkillIds[0] !== exercise.skillId || attempt.source !== undefined) return {status: 'UNAVAILABLE', message: 'The saved exercise binding does not match its canonical identity. No grade was calculated.'};
  return {status: 'AVAILABLE', exercise};
}
export function feedbackFor(attempt: Attempt): GradeResult {
  const resolved = resolveAttempt(attempt);
  if (resolved.status !== 'AVAILABLE') return {status: 'NOT_AUTOGRADABLE', message: resolved.message};
  if (attempt.status !== 'SUBMITTED') return {status: 'NOT_AUTOGRADABLE', message: 'Only a successfully saved submission receives feedback.'};
  return gradeResponse(resolved.exercise, attempt.answer);
}
function requireExercise(attempt: Attempt) {
  const resolved = resolveAttempt(attempt);
  if (resolved.status !== 'AVAILABLE') throw new LearningError('INCOMPATIBLE', resolved.message);
  return resolved.exercise;
}
export class PracticeService {
  constructor(private readonly repository: StudentRepository) {}
  start(exerciseId: string, attemptId: string, token: WriteToken, viewedSolution: boolean | null = null): Promise<LoadedState> {
    const exercise = getExercise(exerciseId);
    if (!exercise) return Promise.reject(new LearningError('INVALID', 'Exercise not found.'));
    return this.repository.createDraft({
      attemptId, exercise: {id: `ds.instance.${attemptId}`, version: versionBinding(exercise)}, templateRef: exercise.id,
      subjectId: exercise.subjectId, topicId: exercise.topicId, subtopicId: exercise.subtopicId, targetedSkillIds: [exercise.skillId],
      answer: initialAnswer(exercise), hintsUsed: null, solutionViewed: viewedSolution,
    }, token);
  }
  async save(attempt: Attempt, answer: Answer, token: WriteToken) {
    requireExercise(attempt);
    return this.repository.editDraft(attempt.attemptId, attempt.revision, answer, token);
  }
  async submit(attempt: Attempt, answer: Answer, operationId: string, token: WriteToken) {
    const exercise = requireExercise(attempt);
    const validation = validateResponse(exercise.task, answer);
    if (validation.status !== 'VALID') throw new LearningError('INVALID', validation.message);
    // Repository completion is the boundary: feedback is derived only from its returned immutable submission.
    return this.repository.submit(attempt.attemptId, attempt.revision, operationId, answer, token);
  }
  retry(attempt: Attempt, newId: string, token: WriteToken) {
    const exercise = requireExercise(attempt);
    if (attempt.status !== 'SUBMITTED') return Promise.reject(new LearningError('INVALID', 'Submit this attempt before retrying.'));
    return this.start(exercise.id, newId, token, feedbackFor(attempt).status === 'GRADED' ? true : null);
  }
}
