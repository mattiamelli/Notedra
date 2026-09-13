import type {ReactNode} from 'react';
import type {Answer} from '../learning/contracts';
import {BooleanFormula,BooleanLiteral,Complement} from './BooleanFormula';
import {literalText,literalLabel,mintermLiterals} from './boolean-notation';
import {choices,mapLayout,slotsFor,symbols} from './domain';
import type {FormulaShape,InteractiveTask,MapSpec} from './types';
import {useI18n} from '../i18n/i18n';
import './interactive.css';

function layoutLabel(map:MapSpec,n:number){return map.variables.map((variable,index)=>`${variable}=${(n>>(map.variables.length-index-1))&1}`).join(', ');}

export function MapView({map,task,answer,onChange,disabled=false}:{map:MapSpec;task?:Extract<InteractiveTask,{kind:'kmap-fill'}>;answer?:Answer;onChange?:(answer:Answer)=>void;disabled?:boolean}){
  const {t}=useI18n(),layout=mapLayout(map.variables.length),tokens=answer?.kind==='choice'?answer.value:[];
  return <div className="logic-map-scroll"><table className="logic-map"><caption>Karnaugh map · rows {map.variables.slice(0,layout.rowBits).join('')}, columns {map.variables.slice(layout.rowBits).join('')} · Gray order</caption><thead><tr><th scope="col">{map.variables.slice(0,layout.rowBits).join('')} / {map.variables.slice(layout.rowBits).join('')}</th>{layout.columns.map(column=><th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{layout.cells.map((row,rowIndex)=><tr key={rowIndex}><th scope="row">{layout.rows[rowIndex]}</th>{row.map(minterm=><td key={minterm}>{task&&!task.given.includes(minterm)?<select disabled={disabled} aria-label={`${layoutLabel(map,minterm)}, minterm ${minterm}`} value={tokens.find(token=>token.startsWith(`m${minterm}=`))?.split('=')[1]??''} onChange={event=>onChange?.({kind:'choice',value:[...tokens.filter(token=>!token.startsWith(`m${minterm}=`)),...(event.target.value?[`m${minterm}=${event.target.value}`]:[])]})}><option value="">—</option>{slotsFor(task).find(slot=>slot.id===`m${minterm}`)!.options.map(value=><option key={value}>{value}</option>)}</select>:<span aria-label={`${layoutLabel(map,minterm)}, minterm ${minterm}: ${map.cells[minterm]}`}>{map.cells[minterm]}{task&&<small>{t('interactive.given')}</small>}</span>}<small className="boolean-minterm" aria-label={mintermLiterals(map.variables,minterm).map(literalLabel).join(' AND ')}>{mintermLiterals(map.variables,minterm).map(token=><BooleanLiteral key={token} token={token}/>)}</small></td>)}</tr>)}</tbody></table></div>;
}

export default function InteractiveControls({task,answer,onChange,disabled}:{task:InteractiveTask;answer:Answer;onChange:(answer:Answer)=>void;disabled:boolean}){
  const {t}=useI18n(),tokens=answer.kind==='choice'?answer.value:[];
  let selected:Record<string,string>={};try{selected=choices(task,tokens,false);}catch{/* Preserve malformed draft; reset is explicit. */}
  function shapeLabel(node:FormulaShape):string {
    if(node.kind==='atom')return selected[node.slot]?literalLabel(selected[node.slot]):'blank';
    if(node.kind==='fixed')return node.name;
    if(node.kind==='not')return 'NOT ('+shapeLabel(node.operand)+')';
    const operator=typeof node.operator==='string'?node.operator:selected[node.operator.slot];
    return '('+shapeLabel(node.left)+' '+(operator??'blank connective')+' '+shapeLabel(node.right)+')';
  }
  function shape(node:FormulaShape):ReactNode{
    if(node.kind==='atom')return selected[node.slot]?<BooleanLiteral token={selected[node.slot]}/>:'□';
    if(node.kind==='fixed')return node.name;
    if(node.kind==='not')return <Complement label={shapeLabel(node)}>{shape(node.operand)}</Complement>;
    const operator=typeof node.operator==='string'?node.operator:selected[node.operator.slot];
    return <>({shape(node.left)} {symbols[operator]??'□'} {shape(node.right)})</>;
  }
  return <fieldset className="logic-workspace" disabled={disabled} aria-describedby="answer-rules"><legend>{t(task.kind==='logic-build'?'interactive.construct':'interactive.completeMap')}</legend>
    {task.kind==='logic-build'?<><div className="logic-preview" aria-label={t('interactive.yourFormula')} aria-live="polite">{shape(task.shape)}</div><div className="logic-slots">{task.slots.map(slot=><label key={slot.id}>{slot.label}<select aria-label={slot.label} value={selected[slot.id]??''} onChange={event=>onChange({kind:'choice',value:[...tokens.filter(token=>!token.startsWith(slot.id+'=')),...(event.target.value?[slot.id+'='+event.target.value]:[])]})}><option value="">{t('practice.choose')}</option>{slot.options.map(option=><option value={option} key={option} aria-label={symbols[option]??literalLabel(option)}>{symbols[option]??literalText(option)}</option>)}</select></label>)}</div></>:<MapView map={task.map} task={task} answer={answer} onChange={onChange} disabled={disabled}/>}
    {!disabled&&<button className="ds-button" type="button" onClick={()=>onChange({kind:'choice',value:[]})}>{t('interactive.reset')}</button>}
  </fieldset>;
}

export function InteractiveSpecification({task}:{task:InteractiveTask}){
  const {t}=useI18n();
  if(task.kind==='logic-build')return task.map?<MapView map={task.map}/>:null;
  const map=task.map;
  return <p className="logic-specification">{task.specification.kind==='formula'?<>{t('interactive.function')}: <BooleanFormula formula={task.specification.formula}/></>:`Output 1 at minterms: ${map.cells.flatMap((value,index)=>value===1?[index]:[]).join(', ')||t('interactive.none')}. Don’t-cares: ${map.cells.flatMap((value,index)=>value==='X'?[index]:[]).join(', ')||t('interactive.none')}. All other outputs: 0.`}</p>;
}
