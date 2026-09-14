import definitions from './practice.json';
import type {AdvancedExercise} from './types';

function freeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

export const advancedExercises: readonly AdvancedExercise[] = freeze(definitions as AdvancedExercise[]);
