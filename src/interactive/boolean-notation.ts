import {evaluateProp, type PropFormula} from '../rl/logic';
import {mapLayout, valuation, choices, buildFormula, validateTask} from './domain';
import type {FormulaShape, InteractiveTask} from './types';

/** Literal tokens are persisted choices, never parsed as arbitrary expressions. */
export function literal(token:string):PropFormula {
 if(!/^!?[A-Z]$/.test(token))throw Error('Expected one Boolean literal.');
 const atom:PropFormula={kind:'variable',name:token.at(-1)!};
 return token.startsWith('!')?{kind:'not',operand:atom}:atom;
}
export function literalText(token:string){literal(token);return token.startsWith('!')?token[1]+'\u0305':token;}
export function literalLabel(token:string){literal(token);return token.startsWith('!')?'NOT '+token[1]:token;}
export function mintermLiterals(variables:string[],index:number):string[]{
 mapLayout(variables.length);
 if(new Set(variables).size!==variables.length||variables.some(v=>! /^[A-Z]$/.test(v))||!Number.isInteger(index)||index<0||index>=2**variables.length)throw Error('Invalid minterm.');
 const values=valuation(variables,index);return variables.map(v=>values[v]?v:'!'+v);
}
export function mintermFormula(variables:string[],index:number):PropFormula {
 return mintermLiterals(variables,index).map(literal).reduce((left,right)=>({kind:'and',left,right}));
}
/** Inverse mapping is semantic, using the accepted oracle; partial products may cover several cells. */
export function termCells(variables:string[],tokens:string[]):number[]{
 mintermLiterals(variables,0);
 if(!tokens.length||tokens.length>variables.length||new Set(tokens.map(t=>t.at(-1))).size!==tokens.length)throw Error('Use each product variable at most once.');
 const nodes=tokens.map(t=>{const node=literal(t);if(!variables.includes(t.at(-1)!))throw Error('Unknown variable.');return node;});
 const formula=nodes.reduce((left,right):PropFormula=>({kind:'and',left,right}));
 return Array.from({length:2**variables.length},(_,i)=>i).filter(i=>evaluateProp(formula,valuation(variables,i)));
}
export type ComplementTask=Extract<InteractiveTask,{kind:'logic-build'}>&{complements:true};
export function hasComplements(task:InteractiveTask):task is ComplementTask{return 'complements' in task&&task.complements===true;}
/** Normalize the explicit new literal extension into the unchanged Patch 6 AST/validator.
 * Historical definitions and their grader files remain byte-identical. */
export function normalizeLiterals(task:ComplementTask,tokens:string[]=[]){
 // choices enforces the original declared option domain before normalization.
 if(task.slots.some(s=>new Set(s.options).size!==s.options.length))throw Error('Duplicate slot options.');
 const selected=choices(task,tokens,false);
 const slots=task.slots.map(s=>({...s,options:[...new Set(s.options.map(o=>o.startsWith('!')?o.slice(1):o))]}));
 function shape(node:FormulaShape,depth=0):FormulaShape {
  if(depth>5)throw Error('Structure too deep.');
  if(node.kind==='atom'){
   const slot=task.slots.find(s=>s.id===node.slot);if(!slot||slot.options.some(o=>!/^!?[A-Z]$/.test(o)||!task.variables.includes(o.at(-1)!)))throw Error('Invalid literal slot.');
   return selected[node.slot]?.startsWith('!')?{kind:'not',operand:node}:node;
  }
  if(node.kind==='not')return {...node,operand:shape(node.operand,depth+1)};
  if(node.kind==='binary')return {...node,left:shape(node.left,depth+1),right:shape(node.right,depth+1)};
  return node;
 }
 const normalized={...task,slots,shape:shape(task.shape)};
 validateTask(normalized);
 return {task:normalized,tokens:tokens.map(t=>t.replace('=!', '='))};
}
export function selectedFormula(task:Extract<InteractiveTask,{kind:'logic-build'}>,tokens:string[]):PropFormula {
 const normalized=hasComplements(task)?normalizeLiterals(task,tokens):{task,tokens};
 return buildFormula(normalized.task.shape,choices(normalized.task,normalized.tokens));
}

export function booleanText(f:PropFormula):string {
 if(f.kind==='variable')return f.name;
 if(f.kind==='not')return f.operand.kind==='variable'?literalText('!'+f.operand.name):'NOT ('+booleanText(f.operand)+')';
 const ops={and:'∧',or:'∨',implies:'→',iff:'↔'};
 return '('+booleanText(f.left)+' '+ops[f.kind]+' '+booleanText(f.right)+')';
}
