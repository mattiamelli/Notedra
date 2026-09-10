import {FakeCloud} from './helpers/cloud';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {IDBFactory, IDBObjectStore} from 'fake-indexeddb';
import {IndexedStudentRepository, STUDENT_DATABASE} from '../src/learning/repository';
import {emptyBackup, toBackup} from '../src/learning/contracts';
import {SyncCoordinator} from '../src/cloud/coordinator';
import {IndexedSyncStore} from '../src/cloud/local-store';
import {accountDatabase, projectLearner, type CloudSnapshot} from '../src/cloud/model';
import {answer, time, topic} from './helpers/learning';
import {deriveProgress} from '../src/progress/derive';
import {success, CLOCK} from './helpers/progress';

const A='11111111-1111-4111-8111-111111111111', B='22222222-2222-4222-8222-222222222222';
let sequence=0;
const id=()=>`00000000-0000-4000-8000-${String(++sequence).padStart(12,'0')}`;

function setup(cloud=new FakeCloud(),owner=A,factory=new IDBFactory()) {
  const local=new IndexedSyncStore(owner,factory), repo=new IndexedStudentRepository({name:accountDatabase(owner),factory,now:()=>time}), controller=new AbortController();
  return {cloud,local,repo,controller,factory,sync:new SyncCoordinator(owner,local,cloud,controller.signal,id)};
}
async function submit(context:ReturnType<typeof setup>,attemptId:string) {
  const start=await context.repo.load(); const draft=await context.repo.createDraft({...topic,attemptId,targetedSkillIds:[],answer},start.data);
  return context.repo.submit(attemptId,1,'submit-'+attemptId,answer,draft.data);
}
afterEach(()=>vi.restoreAllMocks());
describe('sync coordinator and native-shaped transactional local adapter (fake-indexeddb)',()=>{
  it('explicit restore reconciliation completes the original operation and retains recovery',async()=>{
    const a=setup();const before=await submit(a,'one');a.cloud.onPut=async()=>{a.cloud.onPut=null;await a.repo.restore(emptyBackup(),(await a.repo.load()).data);};await expect(a.sync.sync()).rejects.toThrow(/restored during/);
    const result=await a.sync.reconcileRestoredData();expect(result.status).toBe('Synced');expect(result.state.data.attempts).toEqual(before.data.attempts);expect(a.cloud.receipts.size).toBe(1);expect(await a.repo.exportRecovery()).toEqual(toBackup(before.data));a.repo.close();
  });
  it('restore reconciliation still rejects immutable changes and a second concurrent restore',async()=>{
    const a=setup();await submit(a,'one');a.cloud.onPut=async()=>{a.cloud.onPut=null;await a.repo.restore(emptyBackup(),(await a.repo.load()).data);};await expect(a.sync.sync()).rejects.toThrow();
    a.cloud.onPut=async()=>{a.cloud.onPut=null;await a.repo.restore(emptyBackup(),(await a.repo.load()).data);};await expect(a.sync.reconcileRestoredData()).rejects.toThrow(/restored during/);
    const current=await a.repo.load(),backup=toBackup(current.data);backup.attempts=[{...structuredClone(a.cloud.snapshot!.payload.attempts[0]),answer:{kind:'text',value:'tampered'}}];await a.repo.restore(backup,current.data);
    await expect(a.sync.reconcileRestoredData()).rejects.toThrow(/Conflicting/);expect((await a.repo.load()).data.attempts[0].answer.value).toBe('tampered');a.repo.close();
  });
  it('self-review: rejects changed cloud bytes at the same acknowledged revision',async()=>{
    const a=setup();await submit(a,'one');await a.sync.sync();const before=await a.repo.load();
    // Malformed server behavior: append a valid new record without advancing its snapshot revision.
    a.cloud.snapshot!.payload.attempts.push({...structuredClone(a.cloud.snapshot!.payload.attempts[0]),attemptId:'injected',submission:{operationId:'injected-op',submittedAt:time}});
    await expect(a.sync.sync()).rejects.toThrow(/revision/);expect(await a.repo.load()).toEqual(before);a.repo.close();
  });
  it('uploads existing local data to empty cloud and downloads to an empty device',async()=>{
    const a=setup();const before=await submit(a,'one');expect((await a.sync.sync()).status).toBe('Synced');expect(a.cloud.snapshot!.payload.attempts).toEqual(before.data.attempts);
    const b=setup(a.cloud);const result=await b.sync.sync();expect(result.status).toBe('Synced');expect(result.state.data.attempts).toEqual(before.data.attempts);expect(a.cloud.puts).toBe(1);
    a.repo.close();b.repo.close();
  });
  it('two devices converge unrelated submissions, then review/undo, without clocks',async()=>{
    const a=setup(),b=setup(a.cloud);await submit(a,'a');await a.sync.sync();await b.sync.sync();
    await submit(a,'new-a');await submit(b,'new-b');await a.sync.sync();await b.sync.sync();await a.sync.sync();
    expect((await a.repo.load()).data.attempts.map(v=>v.attemptId)).toEqual(['a','new-a','new-b']);
    let state=await b.repo.load();await b.repo.setReviewed('a',0,true,state.data);await b.sync.sync();await a.sync.sync();
    state=await a.repo.load();expect(state.data.reviews[0].revision).toBe(1);await a.repo.setReviewed('a',1,false,state.data);await a.sync.sync();await b.sync.sync();
    expect((await b.repo.load()).data.reviews).toEqual([{attemptId:'a',revision:2,reviewedAt:null}]);a.repo.close();b.repo.close();
  });
  it('reports failed upload without losing local data, then reuses the persisted operation ID',async()=>{
    const a=setup();const before=await submit(a,'one');a.cloud.failPut=true;await expect(a.sync.sync()).rejects.toThrow('Upload failed');
    const pending=(await a.local.read(a.controller.signal)).metadata.pending!;expect(pending).not.toBeNull();expect(await a.repo.load()).toEqual(before);
    a.cloud.failPut=false;await a.sync.sync();expect(a.cloud.snapshot!.operationId).toBe(pending.operationId);a.repo.close();
  });
  it('lost remote acknowledgement retries once logically, including a new coordinator/reload',async()=>{
    const a=setup();await submit(a,'one');a.cloud.loseAck=true;await expect(a.sync.sync()).rejects.toThrow('lost');
    const restarted=new SyncCoordinator(A,a.local,a.cloud,a.controller.signal,id);await restarted.sync();expect(a.cloud.snapshot!.revision).toBe(1);expect(a.cloud.receipts.size).toBe(1);expect(a.cloud.puts).toBe(2);a.repo.close();
  });
  it('failed download creates no pending operation and does not overwrite local data',async()=>{
    const a=setup();const before=await submit(a,'one');a.cloud.failRead=true;await expect(a.sync.sync()).rejects.toThrow('Download failed');
    expect(await a.repo.load()).toEqual(before);expect((await a.local.read(a.controller.signal)).metadata.pending).toBeNull();expect(a.cloud.puts).toBe(0);a.repo.close();
  });
  it('coalesces repeated sync calls and never loops on network failure',async()=>{
    const a=setup();await submit(a,'one');a.cloud.failPut=true;const first=a.sync.sync();expect(a.sync.sync()).toBe(first);await expect(first).rejects.toThrow();
    await new Promise(resolve=>setTimeout(resolve,20));expect(a.cloud.puts).toBe(1);a.repo.close();
  });
  it('reconciles a definite stale CAS on user retry without silently overwriting another device',async()=>{
    const a=setup(),b=setup(a.cloud);await submit(a,'a');await submit(b,'b');a.cloud.onPut=async()=>{a.cloud.onPut=null;await b.sync.sync();};
    await expect(a.sync.sync()).rejects.toThrow('Stale');expect((await a.local.read(a.controller.signal)).metadata.pending).toBeNull();await a.sync.sync();
    expect(a.cloud.snapshot!.payload.attempts.map(v=>v.attemptId)).toEqual(['a','b']);a.repo.close();b.repo.close();
  });
  it('refuses a corrupt remote payload before preparing or modifying active data',async()=>{
    const a=setup();const before=await submit(a,'one');vi.spyOn(a.cloud,'read').mockResolvedValue({owner:A,revision:1,operationId:id(),schema:1,payload:{...projectLearner(emptyBackup()),mastery:99}} as unknown as CloudSnapshot);
    await expect(a.sync.sync()).rejects.toThrow();expect(await a.repo.load()).toEqual(before);expect(a.cloud.puts).toBe(0);a.repo.close();
  });
  it('refuses another account response',async()=>{
    const a=setup(new FakeCloud(B));await submit(a,'one');await expect(a.sync.sync()).rejects.toThrow(/account/);expect((await a.repo.load()).data.attempts).toHaveLength(1);a.repo.close();
  });
  it('cancels stale responses during sign-out/account switch even if transport ignores abort',async()=>{
    const a=setup();const before=await submit(a,'one');a.cloud.onPut=async()=>{a.controller.abort();};await expect(a.sync.sync()).rejects.toThrow();
    expect(await a.repo.load()).toEqual(before);expect((await a.local.read(new AbortController().signal)).metadata.base).toBeNull();a.repo.close();
  });
  it('account A, account B and the anonymous profile have independent durable datasets',async()=>{
    const factory=new IDBFactory(),a=setup(new FakeCloud(A),A,factory),b=setup(new FakeCloud(B),B,factory);await submit(a,'private-a');
    const anon=new IndexedStudentRepository({factory,name:STUDENT_DATABASE});expect((await anon.load()).data.attempts).toHaveLength(0);expect((await b.repo.load()).data.attempts).toHaveLength(0);
    await submit(b,'private-b');expect((await a.repo.load()).data.attempts.map(v=>v.attemptId)).toEqual(['private-a']);a.repo.close();b.repo.close();anon.close();
  });
  it('only reports synced after transaction completion; successful requests followed by abort roll back data and journal',async()=>{
    const a=setup();await submit(a,'one');await a.sync.sync();const b=setup(a.cloud);const before=await b.repo.load();
    const put=IDBObjectStore.prototype.put;vi.spyOn(IDBObjectStore.prototype,'put').mockImplementation(function(this:IDBObjectStore,value,key){const q=put.call(this,value,key);if(key==='active')q.addEventListener('success',()=>this.transaction.abort());return q;});
    await expect(b.sync.sync()).rejects.toBeDefined();vi.restoreAllMocks();expect(await b.repo.load()).toEqual(before);expect((await b.local.read(b.controller.signal)).metadata.base).toBeNull();
    await b.sync.sync();expect((await b.repo.load()).data.attempts).toHaveLength(1);a.repo.close();b.repo.close();
  });
  it('local edits during upload survive and are marked pending for the next explicit pass',async()=>{
    const a=setup();await submit(a,'one');a.cloud.onPut=async()=>{a.cloud.onPut=null;await submit(a,'during');};const result=await a.sync.sync();expect(result.status).toBe('Pending');
    expect(result.state.data.attempts).toHaveLength(2);expect(a.cloud.snapshot!.payload.attempts).toHaveLength(1);expect((await a.sync.sync()).status).toBe('Synced');expect(a.cloud.snapshot!.payload.attempts).toHaveLength(2);a.repo.close();
  });
  it('preserves manual restore recovery and rejoins missing cloud records after restore',async()=>{
    const a=setup();const before=await submit(a,'one');await a.sync.sync();const restored=await a.repo.restore(emptyBackup(),(await a.repo.load()).data);
    const result=await a.sync.sync();expect(result.state.data.generation).toBe(restored.data.generation);expect(result.state.data.attempts).toEqual(before.data.attempts);expect(await a.repo.exportRecovery()).toEqual(toBackup(before.data));a.repo.close();
  });
  it('restore mid-upload rejects stale application and retains both restore recovery and pending operation',async()=>{
    const a=setup();const before=await submit(a,'one');a.cloud.onPut=async()=>{a.cloud.onPut=null;await a.repo.restore(emptyBackup(),(await a.repo.load()).data);};
    await expect(a.sync.sync()).rejects.toThrow(/restored during/);expect((await a.repo.load()).data.attempts).toHaveLength(0);expect(await a.repo.exportRecovery()).toEqual(toBackup(before.data));expect((await a.local.read(a.controller.signal)).metadata.pending).not.toBeNull();a.repo.close();
  });
  it('prepare checks generation and dataset revision inside the same write transaction',async()=>{
    const a=setup();const old=await a.local.read(a.controller.signal);await submit(a,'one');
    await expect(a.local.prepare(old,{operationId:id(),expectedRevision:0,payload:projectLearner(toBackup(old.data)),local:old.data},a.controller.signal)).rejects.toThrow(/Another tab/);a.repo.close();
  });
  it('restored exact evidence recomputes Progress locally without syncing indices',async()=>{
    const a=setup();let state=await a.repo.load();const backup=emptyBackup();backup.attempts=[success('correct')];state=await a.repo.restore(backup,state.data);await a.sync.sync();const b=setup(a.cloud);const result=await b.sync.sync();
    expect(deriveProgress(toBackup(result.state.data),CLOCK)).toEqual(deriveProgress(toBackup(state.data),CLOCK));expect(Object.hasOwn(a.cloud.snapshot!.payload,'mastery')).toBe(false);a.repo.close();b.repo.close();
  });
  it('local backup and recovery remain functional without network or cloud metadata in export',async()=>{
    const a=setup();await submit(a,'one');a.cloud.failPut=true;await expect(a.sync.sync()).rejects.toThrow();const backup=await a.repo.exportBackup();expect(Object.hasOwn(backup,'pending')).toBe(false);
    await a.repo.restore(backup,(await a.repo.load()).data);expect(await a.repo.exportRecovery()).toEqual(backup);a.repo.close();
  });
});
