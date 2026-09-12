import {evaluateProp,propVariables,type PropFormula} from '../rl/logic';
import type {FormulaShape,InteractiveTask,MapSpec,Slot} from './types';
export const operators=['and','or','implies','iff'] as const;
export const symbols:Record<string,string>={and:'∧',or:'∨',implies:'→',iff:'↔'};
export function mapLayout(count:number){
 if(![2,3,4].includes(count))throw Error('Use two, three or four variables.');
 const rowBits=Math.floor(count/2),columnBits=count-rowBits;
 const gray=(bits:number)=>Array.from({length:2**bits},(_,i)=>(i^(i>>1)).toString(2).padStart(bits,'0'));
 const rows=gray(rowBits),columns=gray(columnBits);
 return {rows,columns,rowBits,cells:rows.map(row=>columns.map(column=>parseInt(row+column,2)))};
}
export function adjacent(a:number,b:number,count:number){
 const grid=mapLayout(count).cells,cols=grid[0].length;
 const at=(n:number)=>{const r=grid.findIndex(row=>row.includes(n));if(r<0)throw Error('Cell outside map.');return [r,grid[r].indexOf(n)];};
 const [ar,ac]=at(a),[br,bc]=at(b);return ar===br&&(Math.abs(ac-bc)===1||Math.abs(ac-bc)===cols-1)||ac===bc&&(Math.abs(ar-br)===1||Math.abs(ar-br)===grid.length-1);
}
export function valuation(variables:string[],minterm:number){return Object.fromEntries(variables.map((v,i)=>[v,!!(minterm&(1<<(variables.length-i-1)))]));}
export function validateMap(map:MapSpec){
 mapLayout(map.variables.length);
 if(new Set(map.variables).size!==map.variables.length||map.variables.some(v=>! /^[A-Z]$/.test(v))||map.cells.length!==2**map.variables.length||map.cells.some(v=>v!==0&&v!==1&&v!=='X'))throw Error('Invalid map definition.');
}
export function slotsFor(task:InteractiveTask):Slot[]{return task.kind==='logic-build'?task.slots:task.map.cells.flatMap((_,i)=>task.given.includes(i)?[]:[{id:`m${i}`,label:`Minterm ${i}`,options:task.map.cells.includes('X')?['0','1','X']:['0','1']}]);}
export function choices(task:InteractiveTask,tokens:string[],complete=true):Record<string,string>{
 const slots=slotsFor(task),result:Record<string,string>={};
 for(const token of tokens){const [id,value,...rest]=token.split('=');const slot=slots.find(s=>s.id===id);if(rest.length||!slot||!slot.options.includes(value)||Object.hasOwn(result,id))throw Error('Unsupported or duplicate selection.');result[id]=value;}
 if(complete&&Object.keys(result).length!==slots.length)throw Error('Complete every labelled field before submitting.');return result;
}
export function buildFormula(shape:FormulaShape,selected:Record<string,string>):PropFormula{
 let nodes=0;
 function build(node:FormulaShape,depth:number):PropFormula{
  if(++nodes>31||depth>5)throw Error('Formula structure exceeds this exercise limit.');
  if(node.kind==='atom')return {kind:'variable',name:selected[node.slot]};
  if(node.kind==='fixed')return {kind:'variable',name:node.name};
  if(node.kind==='not')return {kind:'not',operand:build(node.operand,depth+1)};
  if(node.kind!=='binary')throw Error('Unknown formula structure.');
  const op=typeof node.operator==='string'?node.operator:selected[node.operator.slot];if(!operators.includes(op as typeof operators[number]))throw Error('Unsupported connective.');
  return {kind:op as typeof operators[number],left:build(node.left,depth+1),right:build(node.right,depth+1)};
 }
 const result=build(shape,0);propVariables(result);return result;
}
export function validateTask(task:InteractiveTask){
 if(!task||!['logic-build','kmap-fill'].includes(task.kind))throw Error('Unknown interactive task.');
 if(task.kind==='kmap-fill'){
  validateMap(task.map);if(new Set(task.given).size!==task.given.length||task.given.some(n=>!Number.isInteger(n)||n<0||n>=task.map.cells.length)||task.given.length===task.map.cells.length)throw Error('Invalid given cells.');
  if(task.specification.kind==='formula'){
   const formula=task.specification.formula;if(propVariables(formula).some(v=>!task.map.variables.includes(v)))throw Error('Unknown formula variable.');
   if(task.map.cells.some((value,i)=>value!=='X'&&Number(evaluateProp(formula,valuation(task.map.variables,i)))!==value))throw Error('Formula and map disagree.');
  }else if(task.specification.kind!=='minterms')throw Error('Unknown map specification.');
 }else{
  if(task.variables.length<1||task.variables.length>4||new Set(task.variables).size!==task.variables.length||task.variables.some(v=>! /^[A-Z]$/.test(v)))throw Error('Invalid variable domain.');
  if(task.slots.length<1||task.slots.length>15||new Set(task.slots.map(s=>s.id)).size!==task.slots.length)throw Error('Invalid slots.');
  const variables=task.variables;
  const used:string[]=[];let nodes=0;
  const slot=(id:string,allowed:readonly string[])=>{const s=task.slots.find(s=>s.id===id);if(!s||!s.options.length||s.options.some(o=>!allowed.includes(o))||new Set(s.options).size!==s.options.length||!s.label||! /^[a-z][a-z0-9]*$/.test(id))throw Error('Invalid slot domain.');used.push(id);};
  function check(s:FormulaShape,depth=0){if(++nodes>31||depth>5)throw Error('Structure too deep.');if(s.kind==='atom')slot(s.slot,variables);else if(s.kind==='fixed'){if(!variables.includes(s.name))throw Error('Unknown fixed variable.');}else if(s.kind==='not')check(s.operand,depth+1);else if(s.kind==='binary'){if(typeof s.operator==='string'){if(!operators.includes(s.operator))throw Error('Unknown operator.');}else slot(s.operator.slot,operators);check(s.left,depth+1);check(s.right,depth+1);}else throw Error('Invalid structure.');}
  check(task.shape);if(used.length!==task.slots.length||new Set(used).size!==used.length)throw Error('Unused or repeated slots.');
  if(propVariables(task.target).some(v=>!task.variables.includes(v)))throw Error('Target outside variable domain.');
  if(task.map){validateMap(task.map);if(task.map.variables.join()!==task.variables.join()||task.map.cells.some((v,i)=>v!=='X'&&Number(evaluateProp(task.target,valuation(task.variables,i)))!==v))throw Error('Target/map mismatch.');}
 }
}
export function checkFormula(task:Extract<InteractiveTask,{kind:'logic-build'}>,formula:PropFormula){
 if(propVariables(formula).some(v=>!task.variables.includes(v)))throw Error('Variable outside domain.');
 for(let i=0;i<2**task.variables.length;i++){
  if(task.map?.cells[i]==='X')continue;
  const values=valuation(task.variables,i),expected=evaluateProp(task.target,values),actual=evaluateProp(formula,values);
  if(expected!==actual)return {correct:false,message:`At ${Object.entries(values).map(([k,v])=>`${k}=${Number(v)}`).join(', ')}, your formula gives ${Number(actual)}; the specification requires ${Number(expected)}.`};
 }
 return {correct:true,message:'The formula agrees on every required truth assignment. This verifies equivalence, not minimality.'};
}
