import type {PracticeExercise} from './registered-types';

export const difficultyCategories = ['low','medium','high','exam'] as const;
export type DifficultyCategory = typeof difficultyCategories[number];

/**
 * UI compatibility map for the immutable exercise banks.
 * Legacy foundational exercises predate explicit difficulty metadata and form
 * the Low category. Existing canonical values are never rewritten: Medium is
 * Medium, Exam-level is Exam, and the historical upper-band spellings
 * Medium-high, Hard, High and Very high are grouped under High.
 */
export function difficultyCategory(exercise: PracticeExercise): DifficultyCategory {
  const difficulty = 'difficulty' in exercise ? exercise.difficulty : undefined;
  if (difficulty === 'Medium') return 'medium';
  if (difficulty === 'Exam-level') return 'exam';
  if (difficulty === undefined) return 'low';
  return 'high';
}
