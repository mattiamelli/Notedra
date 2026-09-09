import coDefinitions from '../co/practice.json';
import coFingerprints from '../co/practice-lock.json';
import coGraderLock from '../co/grader-lock.json';
import type {COExercise, PracticeExercise} from '../co/types';
import definitions from './catalog.json';
import fingerprints from './catalog-lock.json';
import graderLock from './grader-lock.json';
import { validateCatalog } from './validation';
import type { Exercise } from './types';
function freeze<T>(value: T): T {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
validateCatalog(definitions);
export const catalog: readonly Exercise[] = freeze(definitions);
export const allExercises: readonly PracticeExercise[] = freeze([...catalog, ...coDefinitions as COExercise[]]);
export function getExercise(id: string) { return allExercises.find(item => item.id === id); }
export function versionBinding(exercise: PracticeExercise): string {
  const isCO = exercise.task.kind === 'co-exact';
  const fingerprint = ((isCO ? coFingerprints : fingerprints) as Record<string, string>)[`${exercise.id}@${exercise.version}`];
  if (!fingerprint) throw new Error('Original exercise version unavailable.');
  return `${exercise.version}:sha256:${fingerprint}:grader:${isCO ? coGraderLock.sha256 : graderLock.sha256}`;
}
export const exercisePath = (exercise: PracticeExercise) => `/practice/${encodeURIComponent(exercise.id)}`;
export const attemptPath = (exercise: PracticeExercise, id: string) => `${exercisePath(exercise)}/attempts/${encodeURIComponent(id)}`;
