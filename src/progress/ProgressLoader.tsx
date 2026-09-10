import {lazy,Suspense} from 'react';
import {useLearning} from '../learning/LearningProvider';
const Summary=lazy(()=>import('./ProgressSummary'));
export function ProgressLoader({courseId,topicId}:{courseId?:string;topicId?:string}){
  const learning=useLearning();
  if(!learning?.snapshot)return null;
  return <Suspense fallback={<p role="status">Loading evidence summaries…</p>}><Summary courseId={courseId} topicId={topicId}/></Suspense>;
}
