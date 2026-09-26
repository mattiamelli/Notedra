import type {Answer} from '../learning/contracts';
import type {ExamPart} from '../curriculum/calculus-expansion';

export function writtenParts(value:string,count:number):string[]|null{
 if(!value)return Array<string>(count).fill('');
 try{const parsed:unknown=JSON.parse(value);if(Array.isArray(parsed)&&parsed.length===count&&parsed.every(item=>typeof item==='string'&&item.length<=4000))return parsed as string[];}catch{/* Keep free-text drafts editable without rewriting them. */}
 return null;
}
export function WrittenPartsControls({parts,answer,onChange,disabled}:{parts:ExamPart[];answer:Answer;onChange:(answer:Answer)=>void;disabled:boolean}){
 const value=answer.kind==='text'?answer.value:'',fields=writtenParts(value,parts.length);
 if(!fields)return <label className="ds-practice-answer">Your reasoning (saved text)<textarea disabled={disabled} value={value} maxLength={16000} rows={8} onChange={event=>onChange({kind:'text',value:event.target.value})}/></label>;
 return <fieldset className="ds-written-parts" disabled={disabled} aria-describedby="answer-rules"><legend>Your reasoning · self-check</legend>{parts.map((_,index)=><label key={index}>Part {String.fromCharCode(97+index)})<textarea rows={4} maxLength={4000} value={fields[index]} onChange={event=>{const next=[...fields];next[index]=event.target.value;onChange({kind:'text',value:next.every(part=>!part.trim())?'':JSON.stringify(next)});}}/></label>)}</fieldset>;
}
