import type {Exercise} from '../practice/types';
import type {RegisterName} from '../engine/types';

export interface AssemblyTraceField {id:string;label:string;target:RegisterName|'memory-rsp';}
export interface AssemblyTraceTask {
 kind:'assembly-trace';code:string;fields:AssemblyTraceField[];
 initialRegisters:Partial<Record<RegisterName,string>>;
 checkpoint:{instruction:string;occurrence:number;phase:'after'};
}
export interface AssemblyTraceExercise extends Omit<Exercise,'task'|'grader'> {
 task:AssemblyTraceTask;grader:{id:'assembly-trace-exact';version:'1'};
 difficulty:'Medium'|'Medium-high'|'Hard'|'High'|'Very high';
}
