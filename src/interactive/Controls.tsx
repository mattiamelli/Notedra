import type {ReactNode} from 'react';
import type {Answer} from '../learning/contracts';
import {displayProp} from '../rl/logic';
import {choices,mapLayout,slotsFor,symbols} from './domain';
import type {FormulaShape,InteractiveTask,MapSpec} from './types';
import './interactive.css';
function layoutLabel(map:MapSpec,n:number){return map.variables.map((v,i)=>`${v}=${(n>>(map.variables.length-i-1))&1}`).join(', ');}
export function MapView({map,task,answer,onChange,disabled=false}:{map:MapSpec;task?:Extract<InteractiveTask,{kind:'kmap-fill'}>;answer?:Answer;onChange?:(a:Answer)=>void;disabled?:boolean}){
 const layout=mapLayout(map.variables.length),tokens=answer?.kind==='choice'?answer.value:[];
 return <div className="logic-map-scroll"><table className="logic-map"><caption>Karnaugh map · rows {map.variables.slice(0,layout.rowBits).join('')}, columns {map.variables.slice(layout.rowBits).join('')} · Gray order</caption><thead><tr><th scope="col">{map.variables.slice(0,layout.rowBits).join('')} / {map.variables.slice(layout.rowBits).join('')}</th>{layout.columns.map(c=><th scope="col" key={c}>{c}</th>)}</tr></thead><tbody>{layout.cells.map((row,r)=><tr key={r}><th scope="row">{layout.rows[r]}</th>{row.map(n=><td key={n}>{task&&!task.given.includes(n)?<select disabled={disabled} aria-label={`${layoutLabel(map,n)}, minterm ${n}`} value={tokens.find(t=>t.startsWith(`m${n}=`))?.split('=')[1]??''} onChange={e=>onChange?.({kind:'choice',value:[...tokens.filter(t=>!t.startsWith(`m${n}=`)),...(e.target.value?[`m${n}=${e.target.value}`]:[])]})}><option value="">—</option>{slotsFor(task).find(s=>s.id===`m${n}`)!.options.map(v=><option key={v}>{v}</option>)}</select>:<span aria-label={`${layoutLabel(map,n)}, minterm ${n}: ${map.cells[n]}`}>{map.cells[n]}{task&&<small>given</small>}</span>}</td>)}</tr>)}</tbody></table></div>;
}
export default function InteractiveControls({task,answer,onChange,disabled}:{task:InteractiveTask;answer:Answer;onChange:(a:Answer)=>void;disabled:boolean}){
 const tokens=answer.kind==='choice'?answer.value:[];
 let selected:Record<string,string>={};try{selected=choices(task,tokens,false);}catch{/* Preserve malformed draft; reset is explicit. */}
 function shape(node:FormulaShape):ReactNode{
  if(node.kind==='atom')return selected[node.slot]??'□';if(node.kind==='fixed')return node.name;
  if(node.kind==='not')return <>¬{shape(node.operand)}</>;
  const op=typeof node.operator==='string'?node.operator:selected[node.operator.slot];return <>({shape(node.left)} {symbols[op]??'□'} {shape(node.right)})</>;
 }
 return <fieldset className="logic-workspace" disabled={disabled} aria-describedby="answer-rules"><legend>{task.kind==='logic-build'?'Construct your formula':'Complete the map'}</legend>
  {task.kind==='logic-build'?<><div className="logic-preview" aria-label="Your formula" aria-live="polite">{shape(task.shape)}</div><div className="logic-slots">{task.slots.map(slot=><label key={slot.id}>{slot.label}<select aria-label={slot.label} value={selected[slot.id]??''} onChange={e=>onChange({kind:'choice',value:[...tokens.filter(t=>!t.startsWith(slot.id+'=')),...(e.target.value?[slot.id+'='+e.target.value]:[])]})}><option value="">Choose…</option>{slot.options.map(o=><option value={o} key={o}>{symbols[o]??o}</option>)}</select></label>)}</div></>:<MapView map={task.map} task={task} answer={answer} onChange={onChange} disabled={disabled}/>}
  {!disabled&&<button className="ds-button" type="button" onClick={()=>onChange({kind:'choice',value:[]})}>Reset fields</button>}
 </fieldset>;
}
export function InteractiveSpecification({task}:{task:InteractiveTask}){
 if(task.kind==='logic-build')return task.map?<MapView map={task.map}/>:null;
 const map=task.map;
 return <p className="logic-specification">{task.specification.kind==='formula'?`Function: ${displayProp(task.specification.formula)}`:`Output 1 at minterms: ${map.cells.flatMap((v,i)=>v===1?[i]:[]).join(', ')||'none'}. Don’t-cares: ${map.cells.flatMap((v,i)=>v==='X'?[i]:[]).join(', ')||'none'}. All other outputs: 0.`}</p>;
}
