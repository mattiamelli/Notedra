import './tuple-controls.css';
import type {Answer} from '../learning/contracts';
import {tupleFields} from './presentation';
export function TupleControls({parts,answer,onChange,disabled}:{parts:number;answer:Answer;onChange:(answer:Answer)=>void;disabled:boolean}){
 const value=answer.kind==='text'?answer.value:'';
 const fields=tupleFields(value,parts);
 if(!fields)return <label className="ds-practice-answer">Saved ordered answer<input aria-describedby="answer-rules" value={value} maxLength={16000} disabled={disabled} onChange={event=>onChange({kind:'text',value:event.target.value})}/><span>Keep the stated order and separate each part with a comma.</span></label>;
 return <fieldset className="ds-tuple-fields" disabled={disabled} aria-describedby="answer-rules"><legend>Your ordered answer</legend><p>Enter each result in the order stated in the question.</p>{fields.map((field,index)=><label className="ds-practice-answer" key={index}>Part {index+1}<input aria-describedby="answer-rules" autoComplete="off" spellCheck={false} maxLength={120} value={field} onChange={event=>{const next=[...fields];next[index]=event.target.value;onChange({kind:'text',value:next.join(',')});}}/></label>)}</fieldset>;
}
