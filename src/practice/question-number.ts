import {allExercises} from './catalog';
import type {PracticeExercise} from './registered-types';

/** Display numbering only: exercise IDs, versions and saved bindings are unchanged. */
export function questionNumber(exercise:PracticeExercise):number {
 if(exercise.subjectId==='CSE12A_CALC'&&/^CALC_E\d+$/.test(exercise.id))return Number(exercise.id.slice(6));
 return allExercises.filter(item=>item.subjectId===exercise.subjectId).findIndex(item=>item.id===exercise.id)+1;
}
