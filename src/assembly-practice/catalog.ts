import definitions from './practice.json';
import type {AssemblyTraceExercise} from './types';
function freeze<T>(value:T):T{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
export const assemblyTraceExercises:readonly AssemblyTraceExercise[]=freeze(definitions as AssemblyTraceExercise[]);
