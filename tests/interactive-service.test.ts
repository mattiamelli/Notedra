import {it,expect} from 'vitest';
import {repository} from './helpers/learning';
import {PracticeService,feedbackFor,resolveAttempt} from '../src/practice/service';
import {getExercise} from '../src/practice/catalog';
import {deriveEvidence} from '../src/adaptive/evidence';
import {nextExercise} from '../src/practice/next';
import {STUDENT_SCHEMA_VERSION} from '../src/learning/contracts';
it('interactive submissions preserve immutable bindings, factual mistakes, retry and next without a schema change',async()=>{
 const e=getExercise('ds.practice.interactive-rl-conditional')!,repo=repository(),service=new PracticeService(repo);let state=await repo.load();
 state=await service.start(e.id,'interactive',state.data);state=await service.submit(state.data.attempts[0],{kind:'choice',value:['connective=and']},'interactive-submit',state.data);const submitted=state.data.attempts[0];
 expect(feedbackFor(submitted)).toMatchObject({status:'GRADED',correct:false});const evidence=deriveEvidence(state.data.attempts,[],Date.parse(submitted.updatedAt));expect(evidence.mistakes).toHaveLength(1);expect(evidence.mistakes[0].explanation?.reasoning).toContain('At P=0, Q=0');expect(evidence.mistakes[0].explanation?.misconception).toBeNull();
 expect(resolveAttempt({...submitted,exercise:{...submitted.exercise!,version:'different'}}).status).toBe('UNAVAILABLE');
 const next=nextExercise(e,state.data.attempts)!;expect(next.topicId).toBe(e.topicId);expect(next.id).not.toBe(e.id);
 state=await service.retry(submitted,'retry',state.data);expect(state.data.attempts[0]).toEqual(submitted);expect(STUDENT_SCHEMA_VERSION).toBe(3);
});
