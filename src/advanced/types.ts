import type {COExercise} from '../co/types';
import type {IPExercise} from '../ip/types';
import type {RLExercise} from '../rl/practice-types';

export type AdvancedDifficulty = 'Medium' | 'Hard' | 'Exam-level';

export interface AdvancedMetadata {
  unitId: string;
  skillIds: string[];
  sourceSha256: string;
  mode: 'practice' | 'exam';
  difficulty: AdvancedDifficulty;
  demand: string;
  oracleStdout?: string;
}

export type AdvancedExercise = (COExercise | RLExercise | IPExercise) & AdvancedMetadata;
