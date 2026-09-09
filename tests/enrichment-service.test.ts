import {it,expect} from 'vitest';
import {IDBFactory} from 'fake-indexeddb';
import {repository} from './helpers/learning';
import {PracticeService,feedbackFor,resolveAttempt} from '../src/practice/service';
import {allExercises} from '../src/practice/catalog';
import {explainAnswer} from '../src/enrichment/feedback';
import {evidencePolicy,STUDENT_SCHEMA_VERSION} from '../src/learning/contracts';
const items=allExercises.filter(e=>e.task.kind==='enrichment-exact');
it.each(items)('$id: wrong feedback, immutable reload, idempotency and retry reuse schema1',async e=>{
 const factory=new IDBFactory(),repo=repository(factory),service=new PracticeService(repo);const loaded=await repo.load();let state=await service.start(e.id,'first',loaded.data);const draft=state.data.attempts[0];const answer={kind:'text' as const,value:e.task.kind==='enrichment-exact'&&e.task.parts===2?'7,8':'7,8,9'};
 state=await service.submit(draft,answer,'submit',state.data);const submitted=state.data.attempts[0];expect(feedbackFor(submitted)).toMatchObject({status:'GRADED',correct:false});expect(explainAnswer(e,answer,feedbackFor(submitted))!.remember).toBeTruthy();
 expect((await repository(factory).load()).data.attempts[0]).toEqual(submitted);expect((await service.submit(draft,answer,'submit',loaded.data)).data.attempts[0]).toEqual(submitted);
 await expect(service.submit(draft,e.reference,'submit',loaded.data)).rejects.toMatchObject({code:'CONFLICT'});
 const retry=await service.retry(submitted,'second',state.data);expect(retry.data.attempts[0]).toEqual(submitted);expect(retry.data.attempts[1].attemptId).toBe('second');expect(retry.data.attempts[1].status).toBe('DRAFT');expect(evidencePolicy(submitted).eligible).toBe(false);expect(STUDENT_SCHEMA_VERSION).toBe(1);
 expect(submitted).not.toHaveProperty('misconception');expect(submitted).not.toHaveProperty('grade');expect(resolveAttempt({...submitted,exercise:{...submitted.exercise!,version:'different'}}).status).toBe('UNAVAILABLE');
});
