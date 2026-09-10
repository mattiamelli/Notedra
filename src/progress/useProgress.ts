import {useEffect,useState} from 'react';
import {useLearning} from '../learning/LearningProvider';
import {loadExamBank,examCourse} from '../exams/catalog';
import {deriveProgress} from './derive';
import type {Progress} from './types';
export function useProgress(){
  const learning=useLearning(),data=learning?.snapshot?.data;
  const [clock,setClock]=useState(()=>Date.now()),[result,setResult]=useState<Progress|null>(null),[error,setError]=useState('');
  useEffect(()=>{const id=setInterval(()=>setClock(Date.now()),60000);return()=>clearInterval(id);},[]);
  useEffect(()=>{let active=true;setResult(null);setError('');if(data){
    const ids=[...new Set(data.exams.map(s=>s.course))].filter(id=>examCourse(id));
    void Promise.allSettled(ids.map(loadExamBank)).then(results=>{const banks=results.flatMap(r=>r.status==='fulfilled'?[r.value]:[]);const next=deriveProgress(data,clock,banks);if(active)setResult(next);}).catch(()=>{if(active)setError('Evidence could not be resolved. Saved records are unchanged. Reload to retry.');});
  }return()=>{active=false;};},[data,clock]);
  return {result,message:error||(!learning?'Student storage is not connected.':!data?learning.message:'Loading evidence summaries…')};
}
