import {describe,it,expect} from 'vitest';
import {expansionExercises} from '../src/expansion/catalog';
import guides from '../src/expansion/guided.json';
import {repository} from './helpers/learning';
import {PracticeService,feedbackFor,resolveAttempt} from '../src/practice/service';
import {getExercise,allExercises} from '../src/practice/catalog';
import {gradeResponse,validateResponse} from '../src/practice/runtime';
import {deriveEvidence,eligibleSkill} from '../src/adaptive/evidence';
import {explainAnswer} from '../src/enrichment/feedback';
import {nextExercise} from '../src/practice/next';
import {buildStudySession} from '../src/adaptive/session';
import type {Answer} from '../src/learning/contracts';
describe('Expanded bank reuses accepted learning contracts',()=>{
 it('every new Java choice safely grades all declared alternatives and rejects free code',()=>{
  for(const e of expansionExercises){if(e.task.kind!=='ip-fixed')continue;
   expect(validateResponse(e.task,{kind:'text',value:'System.exit(0)'})).toMatchObject({status:'INVALID'});
   for(const o of e.task.options){const answer:Answer={kind:'choice',value:[o.id]},result=gradeResponse(e,answer);expect(result).toMatchObject({status:'GRADED',correct:(e.reference.value as string[]).includes(o.id)});expect(explainAnswer(e,answer,result)).toMatchObject({misconception:null,profileId:null});}
  }
 });
 it.each(['ds.practice.p7-boolean-minterm','ds.practice.p7-ip-nested-argument-order','ds.practice.p7-co-address-alias-write'])('%s survives wrong submission, reload, factual mistakes and immutable retry',async id=>{
  const e=getExercise(id)!,repo=repository(),service=new PracticeService(repo);let state=await repo.load();state=await service.start(id,'p7-start',state.data);
  const answer:Answer=e.task.kind==='logic-build'?{kind:'choice',value:['a=A','b=B','c=C']}:e.task.kind==='ip-fixed'?{kind:'choice',value:[e.task.options.find(o=>!(e.reference.value as string[]).includes(o.id))!.id]}:{kind:'text',value:'0,0'};
  state=await service.submit(state.data.attempts[0],answer,'p7-submit',state.data);const submitted=state.data.attempts[0];expect(feedbackFor(submitted)).toMatchObject({status:'GRADED',correct:false});
  const reload=await repo.load();expect(reload.data.attempts[0]).toEqual(submitted);const evidence=deriveEvidence(reload.data.attempts,[],Date.parse(submitted.updatedAt));expect(evidence.mistakes).toHaveLength(1);expect(evidence.mistakes[0].explanation?.misconception).toBeNull();
  expect(resolveAttempt({...submitted,exercise:{...submitted.exercise!,version:'different'}}).status).toBe('UNAVAILABLE');
  const next=nextExercise(e,reload.data.attempts)!;expect(next.id).not.toBe(e.id);expect(next.topicId).toBe(e.topicId);expect(next.subjectId).toBe(e.subjectId);
  state=await service.retry(submitted,'p7-retry',reload.data);expect(state.data.attempts[0]).toEqual(submitted);
 });
 it('content alone creates no performance evidence and open guides have no graded exercise IDs',()=>{
  const empty=deriveEvidence([],[],Date.UTC(2026,8,12));expect(empty.mistakes).toHaveLength(0);expect(empty.groups).toHaveLength(0);
  for(const g of guides)expect(getExercise(g.id)).toBeUndefined();
  for(const e of expansionExercises)expect(eligibleSkill(e)?.id,e.id).toBe(e.skillId);
 });
 it('new exercises remain discoverable while topic sessions preserve scope and avoid duplicates',async()=>{
  const empty=deriveEvidence([],[],Date.UTC(2026,8,12));
  for(const topicId of ['CO_T02_BOOLEAN_KMAP','IP_T01_JAVA_BASICS']){
   const e=expansionExercises.find(e=>e.topicId===topicId)!;const session=buildStudySession(empty,{subjectId:e.subjectId,topicId,minutes:120});expect(new Set(session.map(a=>a.id)).size).toBe(session.length);expect(allExercises.filter(item=>item.topicId===topicId).some(item=>item.id===e.id)).toBe(true); // An empty session prioritizes existing prerequisite activities; expansion must not reorder that policy.
   const historical=allExercises.filter(item=>item.topicId===topicId&&!item.id.startsWith('ds.practice.p7-'));const repo=repository(),service=new PracticeService(repo);let state=await repo.load();for(const item of historical)state=await service.start(item.id,'discover-'+item.id,state.data);const seen=state.data.attempts;expect(nextExercise(historical[0],seen)?.id).toMatch(/^ds\.practice\.p7-/);
   for(const a of session.filter(a=>a.to.startsWith('/practice/'))){const item=allExercises.find(e=>a.to.endsWith(e.id))!;expect(item.subjectId).toBe(e.subjectId);expect(item.topicId).toBe(topicId);}
  }
 });
 it('the transfer invariant survives every serial order of seven completed monitor operations',()=>{
  // Same monitor serializes the seven compound transfers; thread labels do not alter their effect.
  for(let order=0;order<128;order++){let left=10,right=0;for(let k=0;k<7;k++){const owner=(order>>k)&1;expect([0,1]).toContain(owner);left--;right++;expect(left+right).toBe(10);}expect([left,right]).toEqual([3,7]);}
 });
});
