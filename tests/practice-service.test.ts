import { describe, expect, it, vi } from 'vitest';
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import { catalog, versionBinding } from '../src/practice/catalog';
import { PracticeService, feedbackFor, resolveAttempt } from '../src/practice/service';
import { emptyBackup, evidencePolicy, unassessed } from '../src/learning/contracts';
import { repository } from './helpers/learning';
const answer={kind:'text',value:'00101101'} as const;
describe('practice through the unchanged student repository',()=>{
  it.each([catalog[0],catalog[2],catalog[4]])('start/save/reload/submit/review/retry for $subjectId',async exercise=>{
    const factory=new IDBFactory();const repo=repository(factory);const service=new PracticeService(repo);const {data}=await repo.load();
    expect(data.attempts).toEqual([]);
    let state=await service.start(exercise.id,'one',data);let attempt=state.data.attempts[0];
    expect(attempt.templateRef).toBe(exercise.id);expect(attempt.exercise).toEqual({id:'ds.instance.one',version:versionBinding(exercise)});
    expect(attempt.hintsUsed).toBeNull();expect(attempt.solutionViewed).toBeNull();
    state=await service.save(attempt,exercise.reference,data);attempt=state.data.attempts[0];
    const reloaded=await repository(factory).load();expect(reloaded.data.attempts[0]).toEqual(attempt);
    state=await service.submit(attempt,exercise.reference,'op-one',data);const submitted=state.data.attempts[0];
    expect(feedbackFor(submitted)).toMatchObject({status:'GRADED',correct:true,earned:1,max:1});
    expect(feedbackFor((await repository(factory).load()).data.attempts[0])).toEqual(feedbackFor(submitted));
    const retried=await service.retry(submitted,'two',data);expect(retried.data.attempts[0]).toEqual(submitted);expect(retried.data.attempts[1].attemptId).toBe('two');expect(retried.data.attempts[1].solutionViewed).toBe(true);
    expect(evidencePolicy(submitted).eligible).toBe(false);expect(unassessed()).not.toHaveProperty('score');
  });
  it('same start/submission IDs are idempotent and submitted content cannot be rewritten',async()=>{
    const repo=repository();const service=new PracticeService(repo);const {data}=await repo.load();
    const starts=await Promise.all([service.start(catalog[0].id,'same',data),service.start(catalog[0].id,'same',data)]);expect(starts[1].data.attempts).toHaveLength(1);
    const draft=starts[0].data.attempts[0];const submitted=await service.submit(draft,answer,'op',data);
    expect(await service.submit(draft,answer,'op',data)).toEqual(submitted);
    await expect(service.submit(draft,{kind:'text',value:'00000000'},'op',data)).rejects.toMatchObject({code:'CONFLICT'});
    await expect(service.save(submitted.data.attempts[0],answer,data)).rejects.toMatchObject({code:'CONFLICT'});
  });
  it('submission persists the latest explicit answer, not an older saved draft',async()=>{
    const repo=repository();const s=new PracticeService(repo);const {data}=await repo.load();
    const started=await s.start(catalog[0].id,'a',data);const draft=await s.save(started.data.attempts[0],{kind:'text',value:'00000000'},data);
    const submitted=await s.submit(draft.data.attempts[0],answer,'op',data);expect(submitted.data.attempts[0].answer).toEqual(answer);
    await expect(s.save(draft.data.attempts[0],{kind:'text',value:'11111111'},data)).rejects.toMatchObject({code:'CONFLICT'});
    expect((await repo.load()).data.attempts[0].answer).toEqual(answer);
  });
  it('rejects incomplete input before any submission or feedback',async()=>{
    const repo=repository();const s=new PracticeService(repo);const {data}=await repo.load();const state=await s.start(catalog[2].id,'a',data);
    await expect(s.submit(state.data.attempts[0],{kind:'choice',value:['ff:F']},'op',data)).rejects.toMatchObject({code:'INVALID'});
    expect((await repo.load()).data.attempts[0].status).toBe('DRAFT');expect(feedbackFor(state.data.attempts[0])).not.toHaveProperty('earned');
  });
  it('does not acknowledge/grade a submission whose transaction aborts after request success',async()=>{
    const repo=repository();const s=new PracticeService(repo);const {data}=await repo.load();const before=await s.start(catalog[0].id,'a',data);const original=IDBObjectStore.prototype.put;
    const spy=vi.spyOn(IDBObjectStore.prototype,'put').mockImplementation(function(this:IDBObjectStore,value,key){const req=original.call(this,value,key);req.addEventListener('success',()=>this.transaction.abort());return req;});
    try{await expect(s.submit(before.data.attempts[0],answer,'op',data)).rejects.toMatchObject({code:'STORAGE'});}finally{spy.mockRestore();}
    expect(await repo.load()).toEqual(before);expect(feedbackFor(before.data.attempts[0])).not.toHaveProperty('earned');
  });
  it('preserves binding and feedback across backup replacement while rejecting stale epochs',async()=>{
    const repo=repository();const s=new PracticeService(repo);const {data}=await repo.load();const initial=await s.start(catalog[0].id,'a',data);const saved=await s.submit(initial.data.attempts[0],answer,'op',data);
    const backup=await repo.exportBackup();const restored=await repo.restore(backup,saved.data);
    expect(feedbackFor(restored.data.attempts[0])).toEqual(feedbackFor(saved.data.attempts[0]));
    await expect(s.start(catalog[1].id,'b',data)).rejects.toMatchObject({code:'CONFLICT'});
    await expect(s.save(initial.data.attempts[0],answer,data)).rejects.toMatchObject({code:'CONFLICT'});
  });
  it('unknown definition versions and forged identity bindings never receive a current grade',async()=>{
    const repo=repository();const s=new PracticeService(repo);const {data}=await repo.load();const initial=await s.start(catalog[0].id,'a',data);const saved=await s.submit(initial.data.attempts[0],answer,'op',data);const attempt=saved.data.attempts[0];
    for(const patch of [{exercise:{...attempt.exercise!,version:'99'}},{templateRef:'ds.practice.missing'},{exercise:{...attempt.exercise!,id:'other-instance'}},{targetedSkillIds:[]}]){
      const changed={...attempt,...patch};expect(resolveAttempt(changed).status).toBe('UNAVAILABLE');expect(feedbackFor(changed)).toMatchObject({status:'NOT_AUTOGRADABLE'});expect(feedbackFor(changed)).not.toHaveProperty('earned');
    }
  });
  it('retains unknown exposure from imported submitted records without evidence promotion',async()=>{
    const repo=repository();const s=new PracticeService(repo);const {data}=await repo.load();const started=await s.start(catalog[0].id,'a',data);const saved=await s.submit(started.data.attempts[0],answer,'op',data);
    const backup=await repo.exportBackup();const restored=await repo.restore(backup,saved.data);expect(restored.data.attempts[0].solutionViewed).toBeNull();expect(evidencePolicy(restored.data.attempts[0]).eligible).toBe(false);
    await expect(repo.restore({...backup,attempts:[{...backup.attempts[0],earned:1}]} as unknown as typeof backup,restored.data)).rejects.toMatchObject({code:'INVALID'});
  });
  it('never drops older attempts to make room at the existing dataset limit',async()=>{
    const repo=repository();const s=new PracticeService(repo);const {data}=await repo.load();const started=await s.start(catalog[0].id,'a',data);const template=started.data.attempts[0];
    const backup={...emptyBackup(),attempts:Array.from({length:1000},(_,i)=>({...template,attemptId:`a-${i}`,exercise:{...template.exercise!,id:`ds.instance.a-${i}`}}))};
    const full=await repo.restore(backup,started.data);
    await expect(s.start(catalog[1].id,'overflow',full.data)).rejects.toMatchObject({code:'INVALID'});expect((await repo.load()).data.attempts).toHaveLength(1000);
  });
});
