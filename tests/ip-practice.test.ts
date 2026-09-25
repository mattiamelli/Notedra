import {describe,it,expect} from 'vitest';
import {allExercises,versionBinding} from '../src/practice/catalog';
import {gradeResponse,initialAnswer,validateResponse} from '../src/practice/runtime';
import {explainAnswer,patternKey} from '../src/enrichment/feedback';
import {gradeIPResponse} from '../src/ip/grading';
import type {IPExercise} from '../src/ip/types';
import profiles from '../src/ip/feedback.json';
import oracles from '../scripts/ip-practice-oracles.json';
import {repository} from './helpers/learning';
import {IDBFactory} from 'fake-indexeddb';
import {PracticeService,feedbackFor,resolveAttempt} from '../src/practice/service';
import {STUDENT_SCHEMA_VERSION,evidencePolicy} from '../src/learning/contracts';
const items=allExercises.filter((e):e is IPExercise=>e.task.kind==='ip-fixed'&&e.id.startsWith('ds.practice.ip-'));
describe('Fixed authored Java predictions',()=>{
 it('retains the 33 independently reasoned IP items and all other definitions including eight Assembly traces',()=>{expect(items).toHaveLength(33);expect(allExercises.filter(e=>e.task.kind!=='curriculum'&&!e.id.startsWith('ds.practice.advanced-')&&!e.id.startsWith('ds.practice.p7-')&&!e.id.startsWith('ds.practice.interactive-')&&e.task.kind!=='ip-fixed')).toHaveLength(75);expect(oracles.map(o=>o.exerciseId)).toEqual(items.map(e=>e.id));});
 it.each(items)('$id: exact choice, unsupported code, explanatory pattern and fallback',e=>{
  expect(initialAnswer(e)).toEqual({kind:'choice',value:[]});expect(gradeResponse(e,e.reference)).toMatchObject({status:'GRADED',correct:true,earned:1});
  expect(validateResponse(e.task,{kind:'text',value:'System.exit(0);'}).status).toBe('INVALID');expect(validateResponse(e.task,{kind:'choice',value:[]}).status).toBe('INCOMPLETE');expect(validateResponse(e.task,{kind:'choice',value:['reference','pattern']}).status).toBe('INVALID');expect(validateResponse(e.task,{kind:'choice',value:['arbitrary']}).status).toBe('INVALID');
  const answer={kind:'choice' as const,value:['pattern']};const result=gradeResponse(e,answer);expect(result).toMatchObject({status:'GRADED',correct:false,earned:0});const explanation=explainAnswer(e,answer,result)!;const profile=profiles.find(p=>p.exerciseId===e.id)!;expect(explanation.why).toBe(profile.paths[0].why);expect(explanation.misconception?.skillIds).toEqual([e.skillId]);expect(explanation.remember).toBe(profile.remember);expect(explanation.reasoning).toBe(e.explanation);expect(profile.binding).toBe(versionBinding(e));
  expect(explainAnswer(e,e.reference,gradeResponse(e,e.reference))!.misconception).toBeNull();const other={kind:'choice' as const,value:['other']};expect(explainAnswer(e,other,gradeResponse(e,other))).toMatchObject({why:profile.fallback,misconception:null});expect(explainAnswer(e,answer,{status:'ERROR',message:'Unavailable'})).toBeNull();expect(patternKey(e,'invented')).toBeNull();
 });
 it('refuses an unavailable grader and broken trusted reference without assigning incorrectness',()=>{const e=structuredClone(items[0]);e.grader.version='2' as '1';expect(gradeIPResponse(e,e.reference).status).toBe('NOT_AUTOGRADABLE');e.grader.version='1';e.reference={kind:'choice',value:['missing']};expect(gradeIPResponse(e,{kind:'choice',value:['reference']}).status).toBe('ERROR');});
 it('does not attach a new explanation to a changed version',()=>{const e={...items[0],version:'2'};expect(()=>versionBinding(e)).toThrow('unavailable');});
});
it.each(['pass-value','dispatch','equality','exception-flow','race'])('%s: durable mock-storage submission, reload, conflict and retry retain immutable history',async slug=>{
 const e=items.find(e=>e.id==='ds.practice.ip-'+slug)!;const factory=new IDBFactory(),repo=repository(factory),service=new PracticeService(repo);const initial=await repo.load();let state=await service.start(e.id,'one',initial.data);const draft=state.data.attempts[0];const answer={kind:'choice' as const,value:['pattern']};state=await service.submit(draft,answer,'submit',state.data);const submitted=state.data.attempts[0];
 expect(feedbackFor(submitted)).toMatchObject({status:'GRADED',correct:false});expect((await repository(factory).load()).data.attempts[0]).toEqual(submitted);expect((await service.submit(draft,answer,'submit',initial.data)).data.attempts[0]).toEqual(submitted);await expect(service.submit(draft,e.reference,'submit',initial.data)).rejects.toMatchObject({code:'CONFLICT'});await expect(repo.editDraft('one',submitted.revision,e.reference,state.data)).rejects.toMatchObject({code:'CONFLICT'});
 state=await service.retry(submitted,'two',state.data);expect(state.data.attempts).toHaveLength(2);expect(state.data.attempts[0]).toEqual(submitted);expect(state.data.attempts[1]).toMatchObject({attemptId:'two',status:'DRAFT',answer:{kind:'choice',value:[]}});expect(state.data.attempts[1].exercise?.version).toBe(submitted.exercise?.version);expect(evidencePolicy(submitted).eligible).toBe(false);expect(STUDENT_SCHEMA_VERSION).toBe(3);expect(submitted).not.toHaveProperty('misconception');expect(submitted).not.toHaveProperty('grade');expect(resolveAttempt({...submitted,exercise:{...submitted.exercise!,version:'stale'}}).status).toBe('UNAVAILABLE');
});
it('independently enumerates both lost-update outcomes without claiming a scheduling guarantee',()=>{
 const outcomes=new Set<number>();
 function explore(n:number,pc:number[],read:number[]){if(pc.every(p=>p===2)){outcomes.add(n);return;}for(let worker=0;worker<2;worker++){if(pc[worker]===2)continue;const next=[...pc],r=[...read];if(next[worker]++===0){r[worker]=n;explore(n,next,r);}else explore(r[worker]+1,next,r);}}
 explore(0,[0,0],[0,0]);expect([...outcomes].sort()).toEqual([1,2]);const e=items.find(e=>e.id.endsWith('-race'))!;expect(e.task.options[0].output).toContain('not guaranteed');expect(e.explanation).toContain('does not make n++ atomic');
});
it('independent event orders show why reading without join cannot guarantee worker completion',()=>{const outputs=new Set([['read','write'],['write','read']].map(events=>{let n=0,out=-1;for(const event of events)if(event==='write')n=1;else out=n;return out;}));expect([...outputs].sort()).toEqual([0,1]);});
it('independent serial update count and join obligation justify the synchronized result',()=>{let count=0;for(let worker=0;worker<2;worker++)for(let i=0;i<100;i++)count++;expect(count).toBe(200);const e=items.find(e=>e.id.endsWith('-joined-sync'))!;expect(e.task.code).toContain('synchronized void add()');expect(e.task.code).toContain('a.join();b.join()');expect(e.task.options[0].output).toBe('200');});
