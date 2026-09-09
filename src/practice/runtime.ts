import type {PracticeExercise} from './registered-types';
import type {RLExercise,RLTask} from '../rl/practice-types';
import {gradeRLResponse,validateRLResponse} from '../rl/grading';
import type {Answer} from '../learning/contracts';
import type {Exercise,Task} from './types';
import type {COExercise,COTask} from '../co/types';
import {gradeResponse as legacyGrade,validateResponse as legacyValidate,initialAnswer as legacyInitial} from './grading';
import {gradeCOResponse,validateCOResponse} from '../co/grading';
export function gradeResponse(exercise:PracticeExercise,answer:Answer){return exercise.task.kind==='rl-exact'?gradeRLResponse(exercise as RLExercise,answer):exercise.task.kind==='co-exact'?gradeCOResponse(exercise as COExercise,answer):legacyGrade(exercise as Exercise,answer);}
export function validateResponse(task:Task|COTask|RLTask,answer:Answer){return task.kind==='rl-exact'?validateRLResponse(task,answer):task.kind==='co-exact'?validateCOResponse(task,answer):legacyValidate(task,answer);}
export function initialAnswer(exercise:PracticeExercise):Answer{return exercise.task.kind==='co-exact'||exercise.task.kind==='rl-exact'?{kind:'text',value:''}:legacyInitial(exercise as Exercise);}
