import {IndexedStudentRepository} from '../../src/learning/repository';
import {emptyBackup,toBackup} from '../../src/learning/contracts';
import {IndexedSyncStore} from '../../src/cloud/local-store';
import {SyncCoordinator} from '../../src/cloud/coordinator';
import {accountDatabase,same} from '../../src/cloud/model';
import {FakeCloud} from '../helpers/cloud';
const output=document.querySelector<HTMLPreElement>('#cloud-results')!;
const check=(value:unknown,message:string)=>{if(!value)throw Error(message);};
document.querySelector<HTMLButtonElement>('#run-cloud')!.onclick=async()=>{
  output.textContent='Running native IndexedDB with deterministic fake cloud transport…';
  const results:string[]=[],owner=crypto.randomUUID(),controller=new AbortController(),cloud=new FakeCloud(owner);
  const prefix='ds-step12-native-'+crypto.randomUUID()+'-';
  const device=(label:string)=>{
    const factory:IDBFactory={open:(name,version)=>indexedDB.open(prefix+label+name,version),deleteDatabase:name=>indexedDB.deleteDatabase(prefix+label+name),cmp:(a,b)=>indexedDB.cmp(a,b),databases:()=>indexedDB.databases()};
    const repo=new IndexedStudentRepository({name:accountDatabase(owner),factory}),local=new IndexedSyncStore(owner,factory),sync=new SyncCoordinator(owner,local,cloud,controller.signal);
    return {repo,local,sync,factory};
  };
  const a=device('A'),b=device('B');
  const run=async(name:string,work:()=>Promise<void>)=>{await work();results.push('PASS '+name);output.textContent=results.join('\n');};
  const submit=async(context:typeof a,id:string)=>{let state=await context.repo.load();state=await context.repo.createDraft({attemptId:id,subjectId:'CSE1400_CO',topicId:'CO_T06_ASSEMBLY_X86_64',targetedSkillIds:[],answer:{kind:'text',value:id}},state.data);await context.repo.submit(id,1,'submit-'+id,{kind:'text',value:id},state.data);};
  try {
    await run('Remote success / lost acknowledgement retains a durable operation',async()=>{await submit(a,'one');cloud.loseAck=true;let failed=false;try{await a.sync.sync();}catch{failed=true;}check(failed,'Lost acknowledgement was reported saved');check((await a.local.read(controller.signal)).metadata.pending,'Missing durable operation');});
    await run('Reopened coordinator retries the identical operation without duplicate history',async()=>{await new SyncCoordinator(owner,new IndexedSyncStore(owner,a.factory),cloud,controller.signal).sync();check(cloud.snapshot?.revision===1&&cloud.receipts.size===1,'Retry duplicated remote history');});
    await run('Validated download becomes committed native local history',async()=>{check((await b.sync.sync()).status==='Synced','Download did not commit');check((await b.repo.load()).data.attempts.length===1,'Missing downloaded attempt');});
    await run('Two simulated devices merge unrelated submissions',async()=>{await submit(a,'a');await submit(b,'b');await a.sync.sync();await b.sync.sync();await a.sync.sync();check((await a.repo.load()).data.attempts.length===3,'Unrelated work lost');});
    await run('Review/undo converges under saved revisions',async()=>{const state=await b.repo.load();await b.repo.setReviewed('one',0,true,state.data);await b.sync.sync();await a.sync.sync();check((await a.repo.load()).data.reviews[0]?.revision===1,'Review lost');});
    await run('Native transaction abort after a successful request does not report Synced',async()=>{
      await submit(a,'abort-test');await a.sync.sync();const before=await b.repo.load();const original=IDBObjectStore.prototype.put;let observed=false,failed=false;
      IDBObjectStore.prototype.put=function(value,key){const r=original.call(this,value,key);if(key==='active'&&this.transaction.db.name.startsWith(prefix+'B'))r.addEventListener('success',()=>{observed=true;this.transaction.abort();});return r;};
      try{await b.sync.sync();}catch{failed=true;}finally{IDBObjectStore.prototype.put=original;}
      check(observed&&failed,'Abort scenario did not execute');check(same(await b.repo.load(),before),'Aborted transaction changed local data');await b.sync.sync();
    });
    await run('Restore recovery remains independent, and missing cloud records survive',async()=>{const before=await b.repo.load();await b.repo.restore(emptyBackup(),before.data);await b.sync.sync();check(same(await b.repo.exportRecovery(),toBackup(before.data)),'Recovery overwritten');check((await b.repo.load()).data.attempts.length===4,'Cloud history lost after restore');});
    await run('Explicit restore reconciliation retains the original upload and recovery',async()=>{await submit(a,'restore-gate');cloud.onPut=async()=>{cloud.onPut=null;await a.repo.restore(emptyBackup(),(await a.repo.load()).data);};let failed=false;try{await a.sync.sync();}catch{failed=true;}check(failed,'Restore race was silently applied');const result=await a.sync.reconcileRestoredData();check(result.status==='Synced'&&result.state.data.attempts.some(v=>v.attemptId==='restore-gate'),'Explicit restore reconciliation failed');check((await a.repo.exportRecovery()).attempts.length===5,'Restore recovery lost');});
    await run('An auth epoch abort prevents stale local acknowledgement',async()=>{await submit(a,'cancel');const before=await a.repo.load();cloud.onPut=async()=>controller.abort();let failed=false;try{await a.sync.sync();}catch{failed=true;}check(failed&&same(await a.repo.load(),before),'Stale auth result applied');});
    output.textContent=results.join('\n')+'\n9 PASS · native IndexedDB / fake cloud transport. Remote Supabase NOT RUN.';
  }catch(error){output.textContent=results.join('\n')+'\nFAIL '+String(error);}
  finally{a.repo.close();b.repo.close();}
};
