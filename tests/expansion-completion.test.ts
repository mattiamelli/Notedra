import {describe,it,expect} from 'vitest';
import definitions from '../src/expansion/completion.json';
import guides from '../src/expansion/completion-guided.json';
import sources from '../docs/maintenance-patch-7-restored-source-review.json';
import {derived,verifyCompletion} from '../scripts/verify-completion';
import {getExercise,versionBinding} from '../src/practice/catalog';
import {gradeResponse,validateResponse} from '../src/practice/runtime';
import {repository} from './helpers/learning';
import {PracticeService,feedbackFor,resolveAttempt} from '../src/practice/service';
import {deriveEvidence,eligibleSkill} from '../src/adaptive/evidence';
import {nextExercise} from '../src/practice/next';
describe('Patch 7 supplied-source completion',()=>{
 it.each(definitions)('$id agrees with an independent derivation, accepts only valid answers and rejects a plausible wrong result',e=>{
  const live=getExercise(e.id)!;expect(derived(e.id)).toBe(e.reference.value);expect(versionBinding(live)).toContain(':grader:');
  expect(gradeResponse(live,live.reference)).toMatchObject({status:'GRADED',correct:true});
  const value=e.task.kind==='enrichment-exact'?e.reference.value.split(',').map((v,i)=>i===0?String(Number(v)+1):v).join(','):e.task.format==='binary'?(e.reference.value[0]==='1'?'0':'1')+e.reference.value.slice(1):e.task.format==='integer-set'?'{999}':String(Number(e.reference.value)+1);
  expect(gradeResponse(live,{kind:'text',value})).toMatchObject({status:'GRADED',correct:false});
  expect(validateResponse(live.task,{kind:'text',value:''}).status).not.toBe('VALID');expect(validateResponse(live.task,{kind:'text',value:'execute arbitrary code'}).status).not.toBe('VALID');expect(eligibleSkill(live)?.id).toBe(e.skillId);
 });
 it('has exactly four reviewed activities per newly restored source and keeps open reasoning out of the graded catalogue',()=>{
  expect(verifyCompletion().exercises).toBe(38);expect(sources).toHaveLength(25);
  for(const s of sources){const es=[...definitions,...guides].filter(e=>e.unitId===s.unitId);expect(es).toHaveLength(4);expect(new Set(es.map(e=>e.demand)).size).toBe(4);expect(s.exercises.sort()).toEqual(es.map(e=>e.id).sort());expect(es.some(e=>e.mode==='practice')).toBe(true);expect(es.some(e=>e.mode==='exam')).toBe(true);for(const e of es)expect(e.sourcePages.every(p=>s.reviewedPages.includes(p)&&p<=s.pdfPages)).toBe(true);}
  for(const g of guides){expect(getExercise(g.id)).toBeUndefined();expect(g.rubric.length).toBeGreaterThanOrEqual(3);expect(g.reference.length).toBeGreaterThan(0);}
 });
 it.each(['necessary-chain','latch-hold','word-boundary'])('new %s drafts/submissions/retries retain exact bindings and factual evidence',async slug=>{
  const e=getExercise('ds.practice.p7-complete-'+slug)!,repo=repository(),service=new PracticeService(repo);let state=await repo.load();state=await service.start(e.id,'completion-start',state.data);
  state=await service.submit(state.data.attempts[0],e.reference,'completion-submit',state.data);const a=state.data.attempts[0];expect(feedbackFor(a)).toMatchObject({status:'GRADED',correct:true});
  const reloaded=await repo.load();expect(reloaded.data.attempts[0]).toEqual(a);expect(resolveAttempt(a).status).toBe('AVAILABLE');expect(resolveAttempt({...a,exercise:{...a.exercise!,version:'changed'}}).status).toBe('UNAVAILABLE');
  const next=nextExercise(e,reloaded.data.attempts)!;expect(next.topicId).toBe(e.topicId);expect(next.id).not.toBe(e.id);state=await service.retry(a,'completion-retry',reloaded.data);expect(state.data.attempts[0]).toEqual(a);
  expect(deriveEvidence([],[],Date.UTC(2026,8,12)).groups).toHaveLength(0);
 });
});
