import booleanItems from './practice.json';
import ipItems from './ip.json';
import completionItems from './completion.json';
import coItems from './co.json';
import type {PracticeExercise} from '../practice/registered-types';
export type ExpansionExercise=PracticeExercise&{unitId:string;mode:'practice'|'exam';difficulty:'Medium'|'Hard'|'Exam-level';demand:string;sourcePages?:number[];stimulus?:{language:'assembly';code:string}};
/** Trusted static content only; no runtime question generation. */
export const expansionExercises=[...booleanItems,...ipItems,...coItems,...completionItems] as ExpansionExercise[];
