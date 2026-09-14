import type {Answer} from '../learning/contracts';
import {tupleFields} from '../practice/presentation';
import type {AssemblyTraceField} from './types';
import {useI18n} from '../i18n/i18n';
export function AssemblyTraceControls({fields,answer,onChange,disabled}:{fields:AssemblyTraceField[];answer:Answer;onChange:(answer:Answer)=>void;disabled:boolean}){
 const {t}=useI18n();const value=answer.kind==='text'?answer.value:'';const values=tupleFields(value,fields.length);
 if(!values)return <label className="ds-practice-answer">{t('assemblyTrace.savedAnswer')}<input aria-describedby="answer-rules" value={value} maxLength={1000} disabled={disabled} onChange={event=>onChange({kind:'text',value:event.target.value})}/></label>;
 return <fieldset className="ds-tuple-fields ds-assembly-trace-fields" disabled={disabled} aria-describedby="answer-rules"><legend>{t('assemblyTrace.snapshot')}</legend><p>{t('assemblyTrace.numberHelp')}</p>{values.map((value,index)=><label className="ds-practice-answer" key={fields[index].id}>{fields[index].label}<input inputMode="text" autoComplete="off" spellCheck={false} maxLength={80} value={value} onChange={event=>{const next=[...values];next[index]=event.target.value;onChange({kind:'text',value:next.join(',')});}}/></label>)}</fieldset>;
}
