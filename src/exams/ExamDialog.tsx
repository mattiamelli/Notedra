import {useEffect,useRef,type ReactNode} from 'react';
export function ExamDialog({title,children,onCancel,onConfirm,busy,label}:{title:string;children:ReactNode;onCancel:()=>void;onConfirm:()=>void;busy:boolean;label:string}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const d=ref.current!,opener=document.activeElement;d.showModal();d.querySelector('button')?.focus();return()=>{d.close();if(opener instanceof HTMLElement&&opener.isConnected)opener.focus();};},[]);
 return <dialog ref={ref} className="exam-dialog" aria-labelledby="exam-dialog-title" onCancel={event=>{event.preventDefault();if(!busy)onCancel();}}><h2 id="exam-dialog-title">{title}</h2>{children}<div className="exam-actions"><button className="ds-button" onClick={onCancel} disabled={busy}>Keep working</button><button className="ds-button ds-button-primary" disabled={busy} onClick={onConfirm}>{busy?'Saving…':label}</button></div></dialog>;
}
