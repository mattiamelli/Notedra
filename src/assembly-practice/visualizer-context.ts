import {parseProgram} from '../engine/parser';
import {REGISTER_NAMES,type RegisterName,type Registers} from '../engine/types';
import {word} from '../engine/cpu';
import {examplePrograms} from '../examples/examplePrograms';
import {attemptPath,exercisePath,getExercise} from '../practice/catalog';
import type {PracticeExercise} from '../practice/registered-types';
import {assemblyInteger} from './grading';
import type {AssemblyTraceExercise} from './types';

export interface AssemblyExerciseVisualizerContext{kind:'exercise';exercise:AssemblyTraceExercise;source:string;initialRegisters:Readonly<Partial<Registers>>}
export interface AssemblyPresetVisualizerContext{kind:'preset';presetId:string;source:string}
export type AssemblyVisualizerContext=AssemblyExerciseVisualizerContext|AssemblyPresetVisualizerContext;
interface AttemptOrigin{attemptId:string;templateRef?:string}
function isAssemblyTraceExercise(exercise:PracticeExercise):exercise is AssemblyTraceExercise{return exercise.task.kind==='assembly-trace';}
const minimumSigned64=-(1n<<63n),maximumUnsigned64=(1n<<64n)-1n;

export function validatedAssemblyInitialRegisters(values:unknown):Readonly<Partial<Registers>>|null{
 if(!values||typeof values!=='object'||Array.isArray(values))return null;
 const registers:Partial<Registers>={};
 for(const [name,value] of Object.entries(values)){
  if(!REGISTER_NAMES.includes(name as RegisterName)||typeof value!=='string')return null;
  const parsed=assemblyInteger(value);
  if(parsed===null||parsed<minimumSigned64||parsed>maximumUnsigned64)return null;
  registers[name as RegisterName]=word(parsed);
 }
 return Object.freeze(registers);
}

export function resolveAssemblyVisualizerContext(exerciseId:string|null):AssemblyExerciseVisualizerContext|null{
 const exercise=getExercise(exerciseId??'');
 if(!exercise||!isAssemblyTraceExercise(exercise))return null;
 const initialRegisters=validatedAssemblyInitialRegisters(exercise.task.initialRegisters);
 if(!initialRegisters)return null;
 try{parseProgram(exercise.task.code);}catch{return null;}
 return {kind:'exercise',exercise,source:exercise.task.code,initialRegisters};
}

export function resolveAssemblyPresetContext(presetId:string|null):AssemblyPresetVisualizerContext|null{
 const preset=examplePrograms.find(item=>item.id===presetId);
 if(!preset)return null;
 try{parseProgram(preset.source);}catch{return null;}
 return {kind:'preset',presetId:preset.id,source:preset.source};
}

export function resolveAssemblyRouteContext(exerciseId:string|null,presetId:string|null):AssemblyVisualizerContext|null{
 return resolveAssemblyVisualizerContext(exerciseId)??resolveAssemblyPresetContext(presetId);
}

export function contextualAssemblyReturnPath(context:AssemblyExerciseVisualizerContext,attemptId:string|null,attempts:readonly AttemptOrigin[]|undefined){
 const attempt=attemptId?attempts?.find(item=>item.attemptId===attemptId&&item.templateRef===context.exercise.id):undefined;
 return attempt?attemptPath(context.exercise,attempt.attemptId):exercisePath(context.exercise);
}
