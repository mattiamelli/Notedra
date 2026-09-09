import type {Answer} from '../learning/contracts';
import type {Exercise,Task} from './types';
import type {COExercise,COTask,PracticeExercise} from '../co/types';
import {gradeResponse as legacyGrade,validateResponse as legacyValidate,initialAnswer as legacyInitial} from './grading';
import {gradeCOResponse,validateCOResponse} from '../co/grading';
export function gradeResponse(exercise:PracticeExercise,answer:Answer){return exercise.task.kind==='co-exact'?gradeCOResponse(exercise as COExercise,answer):legacyGrade(exercise as Exercise,answer);}
export function validateResponse(task:Task|COTask,answer:Answer){return task.kind==='co-exact'?validateCOResponse(task,answer):legacyValidate(task,answer);}
export function initialAnswer(exercise:PracticeExercise):Answer{return exercise.task.kind==='co-exact'?{kind:'text',value:''}:legacyInitial(exercise as Exercise);}
