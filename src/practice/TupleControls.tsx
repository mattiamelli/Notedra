import './tuple-controls.css';
import type {Answer} from '../learning/contracts';
import {tupleFields} from './presentation';
import {useI18n} from '../i18n/i18n';
export function TupleControls({parts,answer,onChange,disabled}:{parts:number;answer:Answer;onChange:(answer:Answer)=>void;disabled:boolean}){
 const {t}=useI18n();
 const value=answer.kind==='text'?answer.value:'';
 const fields=tupleFields(value,parts);
 if(!fields)return <label className="ds-practice-answer">{t('interactive.savedOrderedAnswer')}<input aria-describedby="answer-rules" value={value} maxLength={16000} disabled={disabled} onChange={event=>onChange({kind:'text',value:event.target.value})}/><span>{t('interactive.orderHelp')}</span></label>;
 return <fieldset className="ds-tuple-fields" disabled={disabled} aria-describedby="answer-rules"><legend>{t('interactive.orderedAnswer')}</legend><p>{t('interactive.orderHelp')}</p>{fields.map((field,index)=><label className="ds-practice-answer" key={index}>{t('interactive.part',{number:index+1})}<input aria-describedby="answer-rules" autoComplete="off" spellCheck={false} maxLength={120} value={field} onChange={event=>{const next=[...fields];next[index]=event.target.value;onChange({kind:'text',value:next.join(',')});}}/></label>)}</fieldset>;
}
