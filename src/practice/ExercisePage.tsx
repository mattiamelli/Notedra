import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useLearning } from '../learning/LearningProvider';
import { errorMessage } from '../learning/contracts';
import { PageHeading } from '../shell/PageParts';
import { getExercise, attemptPath } from './catalog';
import { PracticeService } from './service';
import { ExercisePrompt, ExerciseSource } from './ExerciseParts';
import {useI18n} from '../i18n/i18n';
export function ExercisePage() {
  const {t,lt}=useI18n();
  const {exerciseId}=useParams();const exercise=getExercise(exerciseId??''); const learning=useLearning(); const navigate=useNavigate();
  const pending=useRef(false);const startId=useRef<string|null>(null);const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  if(!exercise)return <><PageHeading title={t('practice.unavailable')} eyebrow={t('practice.title').toUpperCase()}><p>{t('practice.unavailableBody')}</p></PageHeading><Link to="/practice">{t('practice.return')}</Link></>;
  async function start(){
    if(pending.current||!learning?.snapshot||!exercise)return;
    pending.current=true;setBusy(true);setError('');startId.current??=crypto.randomUUID(); const id=startId.current;const token={generation:learning.snapshot.data.generation};
    try{await learning.changeStudentData(repo=>new PracticeService(repo).start(exercise.id,id,token));navigate(attemptPath(exercise,id));}
    catch(failure){setError(errorMessage(failure));}
    finally{pending.current=false;setBusy(false);}
  }
  return <><Link className="ds-text-link" to="/practice">← {t('practice.catalog')}</Link><PageHeading title={lt(exercise.title)} eyebrow={t('practice.title').toUpperCase()}/><ExerciseSource exercise={exercise}/><ExercisePrompt exercise={exercise}/>
    <p>{t('practice.newAttempt')}</p>
    {error&&<p className="ds-storage-error" role="alert">{error}</p>}
    <button className="ds-button" disabled={busy||!learning?.snapshot||learning.phase==='error'||learning.phase==='busy'} onClick={()=>void start()}>{t(busy?'practice.creating':'practice.start')}</button>
    {!learning?.snapshot&&<p role="status">{learning?.message??t('mistakes.storage')}</p>}</>;
}
