import {hasComplements} from '../interactive/boolean-notation';
import {gradeComplement,validateComplement} from '../interactive/complement-grading';
import {isInteractive,type InteractiveExercise,type InteractiveTask} from '../interactive/types';
import {gradeInteractive,validateInteractive} from '../interactive/grading';
import type {IPExercise,IPTask} from '../ip/types';
import {gradeIPResponse,validateIPResponse} from '../ip/grading';
import type {EnrichmentExercise,EnrichmentTask} from '../enrichment/types';
import {gradeEnrichment,validateEnrichmentResponse} from '../enrichment/grading';
import type {PracticeExercise} from './registered-types';
import type {RLExercise,RLTask} from '../rl/practice-types';
import {gradeRLResponse,validateRLResponse} from '../rl/grading';
import type {Answer} from '../learning/contracts';
import type {Exercise,Task} from './types';
import type {COExercise,COTask} from '../co/types';
import {gradeResponse as legacyGrade,validateResponse as legacyValidate,initialAnswer as legacyInitial} from './grading';
import {gradeCOResponse,validateCOResponse} from '../co/grading';
import {gradeAssemblyTrace,validateAssemblyTraceResponse} from '../assembly-practice/grading';
import type {AssemblyTraceExercise,AssemblyTraceTask} from '../assembly-practice/types';
export function gradeResponse(exercise:PracticeExercise,answer:Answer){return isInteractive(exercise.task)&&hasComplements(exercise.task)?gradeComplement(exercise as InteractiveExercise,answer):isInteractive(exercise.task)?gradeInteractive(exercise as InteractiveExercise,answer):exercise.task.kind==='assembly-trace'?gradeAssemblyTrace(exercise as AssemblyTraceExercise,answer):exercise.task.kind==='ip-fixed'?gradeIPResponse(exercise as IPExercise,answer):exercise.task.kind==='enrichment-exact'?gradeEnrichment(exercise as EnrichmentExercise,answer):exercise.task.kind==='rl-exact'?gradeRLResponse(exercise as RLExercise,answer):exercise.task.kind==='co-exact'?gradeCOResponse(exercise as COExercise,answer):legacyGrade(exercise as Exercise,answer);}
export function validateResponse(task:InteractiveTask|Task|COTask|RLTask|EnrichmentTask|IPTask|AssemblyTraceTask,answer:Answer){return isInteractive(task)&&hasComplements(task)?validateComplement(task,answer):isInteractive(task)?validateInteractive(task,answer):task.kind==='assembly-trace'?validateAssemblyTraceResponse(task,answer):task.kind==='ip-fixed'?validateIPResponse(task,answer):task.kind==='enrichment-exact'?validateEnrichmentResponse(task,answer):task.kind==='rl-exact'?validateRLResponse(task,answer):task.kind==='co-exact'?validateCOResponse(task,answer):legacyValidate(task,answer);}
export function initialAnswer(exercise:PracticeExercise):Answer{if(isInteractive(exercise.task)||exercise.task.kind==='ip-fixed')return {kind:'choice',value:[]};return exercise.task.kind==='assembly-trace'||exercise.task.kind==='enrichment-exact'||exercise.task.kind==='co-exact'||exercise.task.kind==='rl-exact'?{kind:'text',value:''}:legacyInitial(exercise as Exercise);}
