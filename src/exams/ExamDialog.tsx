import {useEffect,useRef,type ReactNode} from 'react';
export function ExamDialog({title,children,onCancel,onConfirm,busy,label}:{title:string;children:ReactNode;onCancel:()=>void;onConfirm:()=>void;busy:boolean;label:string}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const d=ref.current!;d.showModal();return()=>d.close();},[]);
 return <dialog ref={ref} className="exam-dialog" aria-labelledby="exam-dialog-title" onCancel={event=>{event.preventDefault();if(!busy)onCancel();}}><h2 id="exam-dialog-title">{title}</h2>{children}<div className="exam-actions"><button className="ds-button" onClick={onCancel} disabled={busy} autoFocus>Keep working</button><button className="ds-button ds-button-primary" disabled={busy} onClick={onConfirm}>{busy?'Saving…':label}</button></div></dialog>;
}
