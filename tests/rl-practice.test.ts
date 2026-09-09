import {describe,it,expect} from 'vitest';
import {IDBFactory} from 'fake-indexeddb';
import {allExercises,versionBinding} from '../src/practice/catalog';
import {PracticeService,feedbackFor,resolveAttempt} from '../src/practice/service';
import {evidencePolicy} from '../src/learning/contracts';
import {repository} from './helpers/learning';
const exercises=allExercises.filter(e=>e.task.kind==='rl-exact');
describe('R&L reuses immutable shared Practice and student schema',()=>{
 it.each(exercises)('$id saves, submits, reloads and resolves only its exact definition and grader',async exercise=>{
  const factory=new IDBFactory(),repo=repository(factory),service=new PracticeService(repo);const initial=await repo.load();
  const started=await service.start(exercise.id,'rl-one',initial.data),draft=started.data.attempts[0];
  expect(draft.exercise?.version).toBe(versionBinding(exercise));
  const saved=await service.save(draft,exercise.reference,started.data),submission=await service.submit(saved.data.attempts[0],exercise.reference,'rl-submit',saved.data);
  const submitted=submission.data.attempts[0];expect(feedbackFor(submitted)).toMatchObject({status:'GRADED',correct:true,earned:1,max:1});
  expect((await repository(factory).load()).data.attempts[0]).toEqual(submitted);
  expect(evidencePolicy(submitted).eligible).toBe(false);
  const replay=await service.submit(saved.data.attempts[0],exercise.reference,'rl-submit',saved.data);expect(replay.data.attempts[0]).toEqual(submitted);
  await expect(service.save(submitted,exercise.reference,submission.data)).rejects.toMatchObject({code:'CONFLICT'});
  const retried=await service.retry(submitted,'rl-two',submission.data);expect(retried.data.attempts[0]).toEqual(submitted);expect(retried.data.attempts[1].attemptId).toBe('rl-two');
  const forged={...submitted,exercise:{...submitted.exercise!,version:'1:changed-definition-or-grader'}};expect(resolveAttempt(forged).status).toBe('UNAVAILABLE');expect(feedbackFor(forged)).toMatchObject({status:'NOT_AUTOGRADABLE'});expect(feedbackFor(forged)).not.toHaveProperty('earned');
 });
 it('open proof IDs never enter the shared auto-grading registry',async()=>{const repo=repository(),service=new PracticeService(repo),state=await repo.load();await expect(service.start('ds.guided.rl.constraint-docks','open',state.data)).rejects.toThrow();expect((await repo.load()).data.attempts).toEqual([]);});
});
