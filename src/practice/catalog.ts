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
export function getExercise(id: string) { return catalog.find(item => item.id === id); }
export function versionBinding(exercise: Exercise): string {
  const fingerprint = (fingerprints as Record<string, string>)[`${exercise.id}@${exercise.version}`];
  if (!fingerprint) throw new Error('Original exercise version unavailable.');
  return `${exercise.version}:sha256:${fingerprint}:grader:${graderLock.sha256}`;
}
export const exercisePath = (exercise: Exercise) => `/practice/${encodeURIComponent(exercise.id)}`;
export const attemptPath = (exercise: Exercise, id: string) => `${exercisePath(exercise)}/attempts/${encodeURIComponent(id)}`;
