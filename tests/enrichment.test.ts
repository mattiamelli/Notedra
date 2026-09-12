import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {readEnrichment,validateEnrichment,validateEnrichmentFiles,validateCapabilities,enrichmentGuard} from '../scripts/enrichment';
import {allExercises,versionBinding} from '../src/practice/catalog';
import {gradeResponse} from '../src/practice/runtime';
import {gradeEnrichment,validateEnrichmentResponse,tupleAnswer} from '../src/enrichment/grading';
import {explainAnswer} from '../src/enrichment/feedback';
import type {EnrichmentExercise} from '../src/enrichment/types';
import type {GradeResult} from '../src/practice/types';
const data=readEnrichment();const text=(value:string)=>({kind:'text' as const,value});
const exercise=(id:string)=>allExercises.find(e=>e.id===id)!;
describe('supplemental authority and immutable authoring',()=>{
 it('validates all published supplemental records and protected baseline bytes',()=>{expect(()=>validateEnrichmentFiles()).not.toThrow();expect(data.cards.filter(c=>c.topicId.startsWith('CO_'))).toHaveLength(6);expect(data.cards.filter(c=>c.topicId.startsWith('RL_'))).toHaveLength(6);});
 it.each(['filename','authority'] as const)('does not let Notes establish evidence via %s',key=>{const d=structuredClone(data);if(key==='filename')d.evidence[0].filename='CO Notes.pdf';else d.evidence[0].authority='COURSE_TEXTBOOK';expect(()=>validateEnrichment(d)).toThrow();});
 it('rejects textbook expansion into another course or invented skill',()=>{for(const id of ['IP_SK01_NEW','RL_SK99_ADVANCED']){const d=structuredClone(data);d.evidence[7].skillIds=[id];expect(()=>validateEnrichment(d)).toThrow();}});
 it('rejects out-of-scope source support even for a real canonical skill',()=>{const d=structuredClone(data);d.cards[0].evidenceIds=['rl-sets'];expect(()=>validateEnrichment(d)).toThrow();});
 it('rejects a new topic, invented map edge and persisted self-check score',()=>{for(const change of [(d:typeof data)=>d.cues[0].topicId='CO_T99_NEW',(d:typeof data)=>Object.assign(d.cues[0],{prerequisite:'CO_SK04_03_SIGNED_ENCODE'}),(d:typeof data)=>Object.assign(d.guided[0],{score:1})]){const d=structuredClone(data);change(d);expect(()=>validateEnrichment(d)).toThrow();}});
 it('refuses current-evidence substitution by unreviewed historical material',()=>{const d=structuredClone(data);d.evidence[5].filename='CO Endterm 2020.pdf';expect(()=>validateEnrichment(d)).toThrow();});
 it('refuses a mismatched exercise version, correct-answer error path and ambiguous pattern',()=>{for(const mutate of [(d:typeof data)=>d.feedback[0].binding='stale',(d:typeof data)=>d.feedback[0].paths[0].answer='1,0',(d:typeof data)=>d.feedback[0].paths.push({...d.feedback[0].paths[0]})]){const d=structuredClone(data);mutate(d);expect(()=>validateEnrichment(d)).toThrow();}});
 it('rejects misconception ownership assigned across skills',()=>{const d=structuredClone(data);d.feedback[0].paths[0].misconceptionId=d.misconceptions.at(-1)!.id;expect(()=>validateEnrichment(d)).toThrow();});
 it('has no source review or lock imports in runtime topic/feedback components',()=>{for(const name of ['TopicEnrichment.tsx','feedback.ts','EvidenceView.tsx'])expect(readFileSync('src/enrichment/'+name,'utf8')).not.toMatch(/content-lock|source-review|enrichment-baseline|content-pack|scripts\//);});
 it('rejects stale capability counts, missing topics and extra product fields',()=>{const counts=JSON.parse(readFileSync('src/enrichment/capabilities.json','utf8')) as {topicId:string;cards:number;exercises:number;guides:number;mastery?:number}[];expect(()=>validateCapabilities(data,counts)).not.toThrow();for(const mutate of [(c:typeof counts)=>c[0].cards++,(c:typeof counts)=>c.pop(),(c:typeof counts)=>c[0].mastery=50]){const c=structuredClone(counts);mutate(c);expect(()=>validateCapabilities(data,c)).toThrow();}});
 it('runs the enrichment gate on direct Vite builds',()=>{const guard=enrichmentGuard(()=>{throw new Error('bad enrichment');});expect(guard.buildStart as ()=>void).toThrow('bad enrichment');});
 it('retains all three historical grader fingerprints and 61 old item bindings',()=>{
  expect(allExercises.filter(e=>!e.id.startsWith('ds.practice.interactive-')&&e.task.kind!=='enrichment-exact'&&e.task.kind!=='ip-fixed')).toHaveLength(61);
  for(const dir of ['practice','co','rl']){const grader=JSON.parse(readFileSync(`src/${dir}/grader-lock.json`,'utf8'));expect(createHash('sha256').update(readFileSync(`src/${dir}/grading.ts`)).digest('hex')).toBe(grader.sha256);}
  for(const e of allExercises.filter(e=>!e.id.startsWith('ds.practice.interactive-')&&e.task.kind!=='enrichment-exact'&&e.task.kind!=='ip-fixed'))expect(versionBinding(e)).toMatch(/^1:sha256:[a-f0-9]{64}:grader:[a-f0-9]{64}$/);
 });
});
describe('controlled tuple grading',()=>{
 it.each(data.practice)('$id accepts its exact reference and formatting variants',e=>{const ref=e.reference.value as string;expect(gradeEnrichment(e,text(ref))).toMatchObject({status:'GRADED',correct:true});expect(gradeEnrichment(e,text(' '+ref.split(',').map(s=>'00'+s).join(' , ')+' '))).toMatchObject({status:'GRADED',correct:true});});
 it.each(['',' ','1','1,0,0','1.0,0','1e0,0','true,false','1,,0','123456789,0','NaN,0','<script>,0','∀xP(x)'])('classifies malformed response %j without incorrect feedback',value=>{const result=gradeEnrichment(data.practice[0],text(value));expect(result.status).toBe(value.trim()?'INVALID':'INCOMPLETE');expect(result).not.toHaveProperty('earned');expect(explainAnswer(data.practice[0],text(value),result)).toBeNull();});
 it('normalizes negative zero and rejects excessive length',()=>{expect(tupleAnswer('-0,000',2)).toBe('0,0');expect(tupleAnswer('1'.repeat(121),2)).toBeNull();});
 it('keeps invalid trusted definitions, unavailable graders and open text distinct',()=>{const e=data.practice[0];expect(gradeEnrichment({...e,reference:text('bad')},text('1,0')).status).toBe('ERROR');expect(gradeEnrichment({...e,grader:{id:'other',version:'1'}} as unknown as EnrichmentExercise,text('1,0')).status).toBe('NOT_AUTOGRADABLE');expect(validateEnrichmentResponse({kind:'open-proof',parts:2} as unknown as EnrichmentExercise['task'],text('any valid proof')).status).toBe('NOT_AUTOGRADABLE');});
});
describe('specific explanatory feedback without learner diagnosis',()=>{
 it.each(data.feedback)('$exerciseId only assigns a pattern for its authored incorrect answers',p=>{
  const e=exercise(p.exerciseId);
  for(const path of p.paths){const answer=text(path.answer),grade=gradeResponse(e,answer),detail=explainAnswer(e,answer,grade)!;expect(grade).toMatchObject({status:'GRADED',correct:false});expect(detail.why).toBe(path.why);expect(detail.misconception?.id).toBe(path.misconceptionId);expect(detail.reasoning).toBe(p.reasoning);expect(detail.remember).toBe(p.remember);}
  const correct=explainAnswer(e,e.reference,gradeResponse(e,e.reference))!;expect(correct.misconception).toBeNull();expect(correct.why).toContain('matches');
 });
 it('falls back without diagnosing an unrecognized valid wrong answer',()=>{const e=data.practice[0],a=text('7,8'),detail=explainAnswer(e,a,gradeResponse(e,a))!;expect(detail.misconception).toBeNull();expect(detail.why).toBe(data.feedback[0].fallback);});
 it.each(['INCOMPLETE','INVALID','ERROR','NOT_AUTOGRADABLE'] as const)('%s has no explanatory score or misconception',status=>expect(explainAnswer(data.practice[0],text('bad'),{status,message:'No score'} as GradeResult)).toBeNull());
 it('uses the historical explanation as a safe fallback for untouched exercises',()=>{const e=exercise('ds.practice.co-bcd-thirty-eight'),a=text('00000000'),detail=explainAnswer(e,a,gradeResponse(e,a))!;expect(detail.profileId).toBeNull();expect(detail.reasoning).toBe(e.explanation);expect(detail.misconception).toBeNull();});
 it('does not attach a profile to a changed original version',()=>{const e={...data.practice[0],version:'99'};expect(()=>explainAnswer(e,text('1,1'),{status:'GRADED',correct:false,earned:0,max:1,reference:text('1,0'),explanation:'unavailable'})).toThrow('Original exercise version unavailable');});
 it('matches equivalent safe token spelling without inventing a formula parser',()=>{const e=exercise('ds.practice.rl-negation-witnesses'),a=text('{3,01,3}');expect(explainAnswer(e,a,gradeResponse(e,a))?.misconception?.id).toContain('quantifier-negation');});
});

it('review regression: exact patterns do not assert an unobserved learner procedure',()=>{const p=data.feedback.find(p=>p.exerciseId==='ds.practice.enrich-constant-assignment')!;expect(p.paths[0].why).not.toContain('treats free x like c');expect(p.paths[0].why).toContain('P(c)');});
