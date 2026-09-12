import {expansionExercises} from '../expansion/catalog';
import completionFingerprints from '../expansion/completion-lock.json';
import completionGraderLock from '../expansion/completion-grader-lock.json';
import expansionFingerprints from '../expansion/practice-lock.json';
import expansionGraderLock from '../expansion/grader-lock.json';
import interactiveDefinitions from '../interactive/practice.json';
import interactiveFingerprints from '../interactive/practice-lock.json';
import interactiveGraderLock from '../interactive/grader-lock.json';
import type {InteractiveExercise} from '../interactive/types';
import {isInteractive} from '../interactive/types';
import ipDefinitions from '../ip/practice.json';
import ipFingerprints from '../ip/practice-lock.json';
import ipGraderLock from '../ip/grader-lock.json';
import type {IPExercise} from '../ip/types';
import extraDefinitions from '../enrichment/practice.json';
import extraFingerprints from '../enrichment/practice-lock.json';
import extraGraderLock from '../enrichment/grader-lock.json';
import type {EnrichmentExercise} from '../enrichment/types';
import coDefinitions from '../co/practice.json';
import coFingerprints from '../co/practice-lock.json';
import coGraderLock from '../co/grader-lock.json';
import type {COExercise} from '../co/types';
import type {PracticeExercise} from './registered-types';
import type {RLExercise} from '../rl/practice-types';
import rlDefinitions from '../rl/practice.json';
import rlFingerprints from '../rl/practice-lock.json';
import rlGraderLock from '../rl/grader-lock.json';
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
export const allExercises: readonly PracticeExercise[] = freeze([...catalog,...expansionExercises,...interactiveDefinitions as InteractiveExercise[], ...coDefinitions as COExercise[],...rlDefinitions as RLExercise[],...extraDefinitions as EnrichmentExercise[],...ipDefinitions as IPExercise[]]);
export function getExercise(id: string) { return allExercises.find(item => item.id === id); }
export function versionBinding(exercise: PracticeExercise): string {
  if(Object.hasOwn(completionFingerprints,exercise.id+'@'+exercise.version))return `${exercise.version}:sha256:${(completionFingerprints as Record<string,string>)[exercise.id+'@'+exercise.version]}:grader:${completionGraderLock.sha256}`;
  if(Object.hasOwn(expansionFingerprints,exercise.id+'@'+exercise.version))return `${exercise.version}:sha256:${(expansionFingerprints as Record<string,string>)[exercise.id+'@'+exercise.version]}:grader:${expansionGraderLock.sha256}`;
  if(isInteractive(exercise.task)){const fingerprint=(interactiveFingerprints as Record<string,string>)[`${exercise.id}@${exercise.version}`];if(!fingerprint)throw new Error('Original exercise version unavailable.');return `${exercise.version}:sha256:${fingerprint}:grader:${interactiveGraderLock.sha256}`;}
  const isIP = exercise.task.kind === 'ip-fixed';
  const isExtra = exercise.task.kind === 'enrichment-exact';
  const isRL = exercise.task.kind === 'rl-exact';
  const isCO = exercise.task.kind === 'co-exact';
  const fingerprint = ((isIP ? ipFingerprints : isExtra ? extraFingerprints : isRL ? rlFingerprints : isCO ? coFingerprints : fingerprints) as Record<string, string>)[`${exercise.id}@${exercise.version}`];
  if (!fingerprint) throw new Error('Original exercise version unavailable.');
  return `${exercise.version}:sha256:${fingerprint}:grader:${isIP ? ipGraderLock.sha256 : isExtra ? extraGraderLock.sha256 : isRL ? rlGraderLock.sha256 : isCO ? coGraderLock.sha256 : graderLock.sha256}`;
}
export const exercisePath = (exercise: PracticeExercise) => `/practice/${encodeURIComponent(exercise.id)}`;
export const attemptPath = (exercise: PracticeExercise, id: string) => `${exercisePath(exercise)}/attempts/${encodeURIComponent(id)}`;
