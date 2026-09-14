import {lazy,Suspense} from 'react';
import {useLearning} from '../learning/LearningProvider';
import {useI18n} from '../i18n/i18n';
const Summary=lazy(()=>import('./ProgressSummary'));
export function ProgressLoader({courseId,topicId}:{courseId?:string;topicId?:string}){
  const learning=useLearning();
  const {t}=useI18n();
  if(!learning?.snapshot)return null;
  return <Suspense fallback={<p role="status">{t('common.loadingEvidence')}</p>}><Summary courseId={courseId} topicId={topicId}/></Suspense>;
}
