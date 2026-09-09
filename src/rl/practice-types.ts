import type {Exercise} from '../practice/types';

/** Controlled, fixed-answer drills only. Proofs and learner constructions use guided activities. */
export interface RLTask {
  kind: 'rl-exact';
  format: 'integer' | 'binary' | 'integer-set';
  width: number | null;
}

export interface RLExercise extends Omit<Exercise, 'task' | 'grader'> {
  task: RLTask;
  grader: {id: 'rl-exact'; version: '1'};
}
