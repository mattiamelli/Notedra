import type {Exercise} from '../practice/types';
import type {BinaryConnective,PropFormula} from '../rl/logic';
export type Operator=BinaryConnective;
export type FormulaShape={kind:'atom';slot:string}|{kind:'fixed';name:string}|{kind:'not';operand:FormulaShape}|{kind:'binary';operator:Operator|{slot:string};left:FormulaShape;right:FormulaShape};
export interface Slot {id:string;label:string;options:string[];}
export type Cell=0|1|'X';
export interface MapSpec {variables:string[];cells:Cell[];}
export type InteractiveTask=
 | {kind:'logic-build';variables:string[];shape:FormulaShape;slots:Slot[];target:PropFormula;map?:MapSpec}
 | {kind:'kmap-fill';map:MapSpec;given:number[];specification:{kind:'formula';formula:PropFormula}|{kind:'minterms'}};
export interface InteractiveExercise extends Omit<Exercise,'task'|'grader'> {task:InteractiveTask;grader:{id:'structured-logic';version:'1'};mode:'practice'|'exam';}
export function isInteractive(task:{kind:string}):task is InteractiveTask{return task.kind==='logic-build'||task.kind==='kmap-fill';}
