import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useLearning } from '../learning/LearningProvider';
import { errorMessage } from '../learning/contracts';
import { PageHeading } from '../shell/PageParts';
import { getExercise, attemptPath } from './catalog';
import { PracticeService } from './service';
import { ExercisePrompt, ExerciseSource } from './ExerciseParts';
export function ExercisePage() {
  const {exerciseId}=useParams();const exercise=getExercise(exerciseId??''); const learning=useLearning(); const navigate=useNavigate();
  const pending=useRef(false);const startId=useRef<string|null>(null);const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  if(!exercise)return <><PageHeading title="Exercise unavailable" eyebrow="PRACTICE"><p>This exercise is not registered. No attempt has been created.</p></PageHeading><Link to="/practice">Return to Practice</Link></>;
  async function start(){
    if(pending.current||!learning?.snapshot||!exercise)return;
    pending.current=true;setBusy(true);setError('');startId.current??=crypto.randomUUID(); const id=startId.current;const token={generation:learning.snapshot.data.generation};
    try{await learning.changeStudentData(repo=>new PracticeService(repo).start(exercise.id,id,token));navigate(attemptPath(exercise,id));}
    catch(failure){setError(errorMessage(failure));}
    finally{pending.current=false;setBusy(false);}
  }
  return <><Link className="ds-text-link" to="/practice">← Practice catalog</Link><PageHeading title={exercise.title} eyebrow="PRACTICE"/><ExerciseSource exercise={exercise}/><ExercisePrompt exercise={exercise}/>
    <p>A new attempt is created only when you start. Use Save draft before leaving an unfinished answer.</p>
    {error&&<p className="ds-storage-error" role="alert">{error}</p>}
    <button className="ds-button" disabled={busy||!learning?.snapshot||learning.phase==='error'||learning.phase==='busy'} onClick={()=>void start()}>{busy?'Creating saved draft…':'Start exercise'}</button>
    {!learning?.snapshot&&<p role="status">{learning?.message??'Student storage is not connected.'}</p>}</>;
}
