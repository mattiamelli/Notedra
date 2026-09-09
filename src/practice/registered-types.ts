import type {EnrichmentExercise} from '../enrichment/types';
import type {Exercise} from './types';
import type {COExercise} from '../co/types';
import type {RLExercise} from '../rl/practice-types';
export type PracticeExercise=Exercise|COExercise|RLExercise|EnrichmentExercise;
