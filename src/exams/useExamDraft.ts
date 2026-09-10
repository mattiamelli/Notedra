import {useRef,useState} from 'react';
import {useLearning} from '../learning/LearningProvider';
import {errorMessage,type Answer} from '../learning/contracts';
import type {ExamSession} from './types';
/** Serialize immediately queued writes; a stale revision stops the queue until an explicit reload. */
export function useExamDraft(session:ExamSession) {
  const learning=useLearning()!,generation=useRef(learning.snapshot!.data.generation);
  const saved=useRef(session),queue=useRef(Promise.resolve()),failed=useRef(false);
  const [draft,setDraft]=useState(session),latest=useRef(session);
  const [pending,setPending]=useState(0),[error,setError]=useState('');
  function save(next:ExamSession){
    latest.current=next;setDraft(next);setPending(n=>n+1);
    queue.current=queue.current.then(async()=>{
      if(failed.current)return;
      try {const state=await learning.changeStudentData(repo=>repo.saveExam(session.sessionId,saved.current.revision,next.responses,next.flagged,{generation:generation.current}));saved.current=state.data.exams.find(s=>s.sessionId===session.sessionId)!;}
      catch(e){failed.current=true;setError(errorMessage(e));}
    }).finally(()=>setPending(n=>n-1));
  }
  function answer(itemId:string,answer:Answer){save({...latest.current,responses:latest.current.responses.map(r=>r.itemId===itemId?{itemId,answer}:r)});}
  function flag(itemId:string){const flagged=latest.current.flagged.includes(itemId)?latest.current.flagged.filter(id=>id!==itemId):[...latest.current.flagged,itemId];save({...latest.current,flagged});}
  return {draft,answer,flag,pending,error,saved,generation};
}
