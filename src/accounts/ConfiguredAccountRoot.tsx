import {useEffect,useMemo,useRef,useState,useSyncExternalStore,type ReactNode} from 'react';
import {LearningProvider,useLearning} from '../learning/LearningProvider';
import {IndexedStudentRepository} from '../learning/repository';
import {toBackup} from '../learning/contracts';
import {AccountSession} from '../cloud/auth';
import type {CloudConfig} from '../cloud/config';
import {createSupabase} from '../cloud/supabase';
import {SyncCoordinator,type CloudRepository} from '../cloud/coordinator';
import {IndexedSyncStore} from '../cloud/local-store';
import {accountDatabase,canonical,projectLearner,syncMessage} from '../cloud/model';
import {mergeLearner} from '../cloud/merge';
import {AccountContext,anonymousState} from './context';

export default function ConfiguredAccountRoot({config,children}:{config:Extract<CloudConfig,{status:'configured'}>;children:ReactNode}) {
  const [runtime,setRuntime]=useState<{auth:AccountSession;cloud:CloudRepository}|null>(null);
  const [failure,setFailure]=useState('');
  useEffect(()=>{
    try {
      const adapters=createSupabase(config),auth=new AccountSession(adapters.auth);setRuntime({auth,cloud:adapters.cloud});void auth.start();
      return()=>auth.close();
    } catch {setFailure('Account support could not initialize. Local study remains available; reload to retry accounts.');}
  },[config]);
  if(failure)return <AccountContext.Provider value={{config:{status:'unavailable',message:failure},auth:null,state:anonymousState,syncStatus:'Local only',syncMessage:failure,sync:null,adopt:null}}><LearningProvider>{children}</LearningProvider></AccountContext.Provider>;
  return runtime?<ProfileBoundary config={config} {...runtime}>{children}</ProfileBoundary>:<p role="status">Opening account session…</p>;
}
function ProfileBoundary({config,auth,cloud,children}:{config:CloudConfig;auth:AccountSession;cloud:CloudRepository;children:ReactNode}) {
  const state=useSyncExternalStore(auth.subscribe,auth.snapshot);
  const [continueLocal,setContinueLocal]=useState(false);
  const owner=state.user?.id??null;
  const createRepository=useMemo(()=>()=>new IndexedStudentRepository(owner?{name:accountDatabase(owner)}:{}),[owner]);
  if(continueLocal)return <AccountContext.Provider value={{config:{status:'unavailable',message:'Account restore is paused. Continue anonymously; reload to retry accounts.'},auth:null,state:anonymousState,syncStatus:'Local only',syncMessage:'Account restore is paused. Continue anonymously; reload to retry accounts.',sync:null,adopt:null}}><LearningProvider>{children}</LearningProvider></AccountContext.Provider>;
  if(state.phase==='loading')return <main className="ds-main"><h1>Restoring your session</h1><p role="status">Account data stays hidden until its identity is known.</p><button onClick={()=>{auth.close();setContinueLocal(true);}}>Continue with anonymous local study</button></main>;
  return <LearningProvider key={owner??'anonymous'} createRepository={createRepository}><SyncBridge config={config} auth={auth} cloud={cloud}>{children}</SyncBridge></LearningProvider>;
}
function SyncBridge({config,auth,cloud,children}:{config:CloudConfig;auth:AccountSession;cloud:CloudRepository;children:ReactNode}) {
  const state=useSyncExternalStore(auth.subscribe,auth.snapshot),learning=useLearning()!;
  const owner=state.user?.id,signal=auth.signal;
  const runtime=useMemo(()=>{if(!owner)return null;const local=new IndexedSyncStore(owner);return {local,coordinator:new SyncCoordinator(owner,local,cloud,signal),busy:false,initial:false};},[owner,cloud,signal]);
  const [status,setStatus]=useState(owner?'Pending':'Local only'),[message,setMessage]=useState('');
  const successful=useRef<string|null>(null);
  const [offline,setOffline]=useState(!navigator.onLine);
  useEffect(()=>{const update=()=>setOffline(!navigator.onLine);window.addEventListener('online',update);window.addEventListener('offline',update);return()=>{window.removeEventListener('online',update);window.removeEventListener('offline',update);};},[]);
  useEffect(()=>{if(owner&&learning.snapshot&&successful.current!==canonical(projectLearner(toBackup(learning.snapshot.data)))&&!runtime?.busy)setStatus('Pending');},[learning.snapshot,owner,runtime]);
  async function sync(confirmedRestore=false) {
    if(!runtime||runtime.busy||signal.aborted)return;
    if(!navigator.onLine){setMessage('Offline — saved local work remains available. Reconnect and retry sync.');return;}
    runtime.busy=true;setStatus('Syncing');setMessage('Comparing saved local and cloud histories…');
    try {const result=await (confirmedRestore?runtime.coordinator.reconcileRestoredData():runtime.coordinator.sync());if(signal.aborted)return;successful.current=canonical(projectLearner(toBackup(result.state.data)));learning.refresh();setStatus(result.status);setMessage(result.status==='Synced'?'Remote data and the required local transaction completed. Export backups too; browser deletion and device failure can still lose local data.':'Newer local work is pending. Sync again to upload it.');}
    catch(error){if(!signal.aborted){setStatus(error instanceof Error&&'code' in error&&error.code==='CONFLICT'?'Conflict requires attention':'Sync error');setMessage(syncMessage(error));}}
    finally{runtime.busy=false;}
  }
  useEffect(()=>{if(runtime&&learning.snapshot&&!runtime.initial){runtime.initial=true;void sync();}},[runtime,learning.snapshot]);
  async function adopt() {
    if(!runtime||runtime.busy||signal.aborted)return;
    const anonymous=new IndexedStudentRepository();
    try {
      const local=await runtime.local.read(signal);if(local.metadata.pending)throw Error('Finish or resolve the pending sync before adopting another profile.');
      await anonymous.load();const source=await anonymous.exportBackup();const merged=mergeLearner(null,projectLearner(toBackup(local.data)),projectLearner(source));signal.throwIfAborted();
      await learning.restore({...merged,resume:local.data.resume},local.data);
      if(!signal.aborted){setStatus('Pending');setMessage('Anonymous history was copied into this account profile. The anonymous original is preserved. Sync now to upload the merged history.');}
    } finally {anonymous.close();}
  }
  return <AccountContext.Provider value={{config,auth,state,syncStatus:owner&&offline?'Offline':status,syncMessage:message,sync:owner?sync:null,adopt:owner?adopt:null,reconcile:owner?()=>sync(true):undefined}}>{children}</AccountContext.Provider>;
}
