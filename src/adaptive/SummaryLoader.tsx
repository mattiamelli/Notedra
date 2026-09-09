import {lazy,Suspense} from 'react';
import {useLearning} from '../learning/LearningProvider';
const Summary=lazy(()=>import('./EvidenceSummary'));
export function SummaryLoader({topicId}:{topicId?:string}){
 const learning=useLearning();
 if(!learning?.snapshot?.data.attempts.some(a=>a.status==='SUBMITTED'&&(!topicId||a.topicId===topicId)))return null;
 return <Suspense fallback={null}><Summary topicId={topicId}/></Suspense>;
}
