import type {InteractiveExercise} from '../interactive/types';
import type {IPExercise} from '../ip/types';
import type {EnrichmentExercise} from '../enrichment/types';
import type {Exercise} from './types';
import type {COExercise} from '../co/types';
import type {RLExercise} from '../rl/practice-types';
import type {AdvancedExercise} from '../advanced/types';
export type PracticeExercise=InteractiveExercise|Exercise|COExercise|RLExercise|EnrichmentExercise|IPExercise|AdvancedExercise;
