import {useMemo,useState,type FormEvent} from 'react';
import {ShellIcon} from '../shell/ShellIcon';
import {useLearning} from '../learning/LearningProvider';
import type {UpcomingExam} from '../learning/contracts';
import {displayExamDate, ExamDatePicker, localDateKey} from './ExamDatePicker';
export function calendarDays(from:string,to:string){const a=from.split('-').map(Number),b=to.split('-').map(Number);return Math.round((Date.UTC(b[0],b[1]-1,b[2])-Date.UTC(a[0],a[1]-1,a[2]))/86400000)}
export function urgency(days:number){return days<=2?'critical':days<=7?'high':days<=14?'medium':days<=30?'low':'neutral'}
export function countdownLabel(days:number){return days===0?'TODAY':days===1?'TOMORROW':`${days} DAYS`}
export function sortedUpcomingExams(exams:UpcomingExam[],today:string){return exams.map(e=>({...e,days:calendarDays(today,e.examDate)})).filter(e=>e.days>=0).sort((a,b)=>a.days-b.days||a.examDate.localeCompare(b.examDate)||a.id.localeCompare(b.id))}
export default function DashboardExams(){
  const learning=useLearning(),exams=learning?.snapshot?.data.upcomingExams??[],[editing,setEditing]=useState<UpcomingExam|null>(null),[open,setOpen]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const today=localDateKey();
  const sorted=useMemo(()=>sortedUpcomingExams(exams,today),[exams,today]);
  function close(){if(busy)return;setOpen(false);setEditing(null);setError('');}
  const save=async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();if(!learning?.snapshot||busy)return;
    const f=new FormData(e.currentTarget),v={id:editing?.id??crypto.randomUUID(),name:String(f.get('name')??''),examDate:String(f.get('date')??'')};
    setBusy(true);setError('');
    try{await learning.changeStudentData(r=>editing?r.updateUpcomingExam(v,learning.snapshot!.data):r.addUpcomingExam(v,learning.snapshot!.data));setOpen(false);setEditing(null);}
    catch(failure){setError(failure instanceof Error?failure.message:'The exam could not be saved.');}
    finally{setBusy(false);}
  };
  const remove=async(id:string)=>{if(!learning?.snapshot||!confirm('Delete this exam?'))return;await learning.changeStudentData(r=>r.deleteUpcomingExam(id,learning.snapshot!.data))};
  return <section className="ds-dash-panel ds-dash-exams"><div className="ds-section-heading"><h2><ShellIcon name="calendar"/>Upcoming Exams</h2><button className="ds-button ds-button-primary" onClick={()=>{setEditing(null);setError('');setOpen(true)}}>Add exam</button></div>{sorted.length===0?<p className="ds-dash-caption">Add an exam date to keep it in view.</p>:<ul className="ds-upcoming-list">{sorted.slice(0,3).map(e=><li key={e.id}><div className="ds-upcoming-details"><strong>{e.name}</strong><small>{displayExamDate(e.examDate)}</small></div><span className={`ds-countdown ds-urgency-${urgency(e.days)}`}>{countdownLabel(e.days)}</span><div className="ds-upcoming-actions"><button className="ds-button ds-button-quiet" onClick={()=>{setEditing(e);setError('');setOpen(true)}}>Edit</button><button className="ds-button ds-button-quiet ds-button-danger" onClick={()=>void remove(e.id)}>Delete</button></div></li>)}</ul>}{open&&<div className="ds-exam-backdrop" role="presentation"><div className="ds-exam-dialog" role="dialog" aria-modal="true" aria-labelledby="upcoming-exam-title"><form onSubmit={save}><div><p className="ds-eyebrow">Upcoming Exams</p><h3 id="upcoming-exam-title">{editing?'Edit exam':'Add an exam'}</h3></div><label>Exam name<input name="name" required maxLength={120} defaultValue={editing?.name??''} autoFocus/></label><ExamDatePicker name="date" defaultValue={editing?.examDate}/>{error&&<p role="alert">{error}</p>}<div className="ds-form-actions"><button className="ds-button ds-button-quiet" type="button" disabled={busy} onClick={close}>Cancel</button><button className="ds-button ds-button-primary" type="submit" disabled={busy}>{busy?'Saving…':'Save exam'}</button></div></form></div></div>}</section>;
}
