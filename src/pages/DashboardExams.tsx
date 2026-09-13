import {useMemo,useState,type FormEvent} from 'react';
import {ShellIcon} from '../shell/ShellIcon';
import {useLearning} from '../learning/LearningProvider';
import type {UpcomingExam} from '../learning/contracts';
import {displayExamDate,ExamDatePicker,localDateKey} from './ExamDatePicker';
import {translate,useI18n} from '../i18n/i18n';
import type {Language} from '../i18n/messages';

export function calendarDays(from:string,to:string){const a=from.split('-').map(Number),b=to.split('-').map(Number);return Math.round((Date.UTC(b[0],b[1]-1,b[2])-Date.UTC(a[0],a[1]-1,a[2]))/86400000)}
export function urgency(days:number){return days<=2?'critical':days<=7?'high':days<=14?'medium':days<=30?'low':'neutral'}
export function countdownLabel(days:number,language:Language='en'){return days===0?translate(language,'exam.today'):days===1?translate(language,'exam.tomorrow'):translate(language,'exam.days',{days})}
export function sortedUpcomingExams(exams:UpcomingExam[],today:string){return exams.map(e=>({...e,days:calendarDays(today,e.examDate)})).filter(e=>e.days>=0).sort((a,b)=>a.days-b.days||a.examDate.localeCompare(b.examDate)||a.id.localeCompare(b.id))}

export default function DashboardExams(){
  const {language,t}=useI18n();
  const learning=useLearning(),exams=learning?.snapshot?.data.upcomingExams??[],[editing,setEditing]=useState<UpcomingExam|null>(null),[open,setOpen]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const today=localDateKey(),sorted=useMemo(()=>sortedUpcomingExams(exams,today),[exams,today]);
  function close(){if(busy)return;setOpen(false);setEditing(null);setError('');}
  const save=async(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();if(!learning?.snapshot||busy)return;
    const form=new FormData(event.currentTarget),value={id:editing?.id??crypto.randomUUID(),name:String(form.get('name')??''),examDate:String(form.get('date')??'')};
    setBusy(true);setError('');
    try{await learning.changeStudentData(repository=>editing?repository.updateUpcomingExam(value,learning.snapshot!.data):repository.addUpcomingExam(value,learning.snapshot!.data));setOpen(false);setEditing(null);}
    catch(failure){setError(failure instanceof Error?failure.message:'The exam could not be saved.');}
    finally{setBusy(false);}
  };
  const remove=async(id:string)=>{if(!learning?.snapshot||!confirm(t('exam.confirmDelete')))return;await learning.changeStudentData(repository=>repository.deleteUpcomingExam(id,learning.snapshot!.data));};
  return <section id="upcoming-exams" className="ds-dash-panel ds-dash-exams">
    <div className="ds-section-heading"><h2><ShellIcon name="calendar"/>{t('exam.upcoming')}</h2><button className="ds-button ds-button-primary" onClick={()=>{setEditing(null);setError('');setOpen(true);}}>{t('exam.add')}</button></div>
    {sorted.length===0?<p className="ds-dash-caption">{t('exam.empty')}</p>:<ul className="ds-upcoming-list">{sorted.slice(0,3).map(exam=><li key={exam.id}><div className="ds-upcoming-details"><strong>{exam.name}</strong><small>{displayExamDate(exam.examDate)}</small></div><span className={`ds-countdown ds-urgency-${urgency(exam.days)}`}>{countdownLabel(exam.days,language)}</span><div className="ds-upcoming-actions"><button className="ds-button ds-button-quiet" onClick={()=>{setEditing(exam);setError('');setOpen(true);}}>{t('exam.edit')}</button><button className="ds-button ds-button-quiet ds-button-danger" onClick={()=>void remove(exam.id)}>{t('exam.delete')}</button></div></li>)}</ul>}
    {open&&<div className="ds-exam-backdrop" role="presentation"><div className="ds-exam-dialog" role="dialog" aria-modal="true" aria-labelledby="upcoming-exam-title"><form onSubmit={save}><div><p className="ds-eyebrow">{t('exam.upcoming')}</p><h3 id="upcoming-exam-title">{t(editing?'exam.editTitle':'exam.addTitle')}</h3></div><label>{t('exam.name')}<input name="name" required maxLength={120} defaultValue={editing?.name??''} autoFocus/></label><ExamDatePicker name="date" defaultValue={editing?.examDate}/>{error&&<p role="alert">{error}</p>}<div className="ds-form-actions"><button className="ds-button ds-button-quiet" type="button" disabled={busy} onClick={close}>{t('common.cancel')}</button><button className="ds-button ds-button-primary" type="submit" disabled={busy}>{busy?t('account.saving'):t('exam.save')}</button></div></form></div></div>}
  </section>;
}
