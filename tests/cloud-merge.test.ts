import {describe, expect, it} from 'vitest';
import {emptyBackup, validateBackup} from '../src/learning/contracts';
import {accountDatabase, emptyPayload, projectLearner, validatePayload, validateSnapshot} from '../src/cloud/model';
import {mergeLearner} from '../src/cloud/merge';
import {attempt, time, position} from './helpers/learning';
import {mock} from './helpers/progress';

const owner = '11111111-1111-4111-8111-111111111111';
const submitted = (id = 'one') => attempt({attemptId:id,status:'SUBMITTED',submission:{operationId:'submit-'+id,submittedAt:time}});
describe('cloud payload boundary', () => {
  it('uploads only allowlisted learner state; navigation and derived values are absent', () => {
    const backup = {...emptyBackup(), resume:position, attempts:[submitted()]};
    const payload = projectLearner(backup);
    expect(Object.keys(payload).sort()).toEqual(['attempts','content','examReviews','exams','reviews','schemaVersion','upcomingExams']);
    expect(payload.attempts).toEqual(backup.attempts); expect(payload.attempts).not.toBe(backup.attempts);
  });
  it.each(['resume','mastery','readiness','coverage','confidence','lessons','questionBank','telemetry'])('rejects extra cloud field %s', field => {
    expect(() => validatePayload({...emptyPayload(), [field]:null})).toThrow();
  });
  it.each([null, [], {}, {...emptyPayload(),schemaVersion:2}, {...emptyPayload(),schemaVersion:4}, {...emptyPayload(),attempts:[{bad:true}]}])('rejects malformed or incompatible cloud payload %#', value => expect(() => validatePayload(value)).toThrow());
  it('rejects duplicate identifiers, operation IDs and invalid topic ownership', () => {
    const p = emptyPayload(); p.attempts = [submitted(), submitted()]; expect(() => validatePayload(p)).toThrow();
    p.attempts[1] = {...submitted('two'),submission:submitted().submission}; expect(() => validatePayload(p)).toThrow();
    p.attempts = [{...submitted(),subjectId:'CSE1300_RL'}]; expect(() => validatePayload(p)).toThrow();
  });
  it('isolates account namespaces and rejects malformed identities', () => {
    expect(accountDatabase(owner)).not.toBe(accountDatabase('22222222-2222-4222-8222-222222222222'));
    expect(accountDatabase(owner)).not.toBe('delftstudy-student-v1'); expect(() => accountDatabase('../anonymous')).toThrow();
  });
  it.each(['owner','revision','operationId','schema','extra'])('validates remote envelope %s', field => {
    const r = {owner,revision:1,operationId:owner,schema:1,payload:emptyPayload()};
    expect(() => validateSnapshot({...r,[field]:null},owner)).toThrow();
    expect(() => validateSnapshot(r,owner)).not.toThrow();
  });
});
describe('deterministic conservative three-way merge', () => {
  it.each([100,1000,5000])('merges %i unique saved records deterministically within a five-second safety ceiling',count=>{
    const a={...emptyPayload(),attempts:Array.from({length:count/2},(_,i)=>submitted('a-'+i))},b={...emptyPayload(),attempts:Array.from({length:count/2},(_,i)=>submitted('b-'+i))};
    const start=performance.now(),result=mergeLearner(null,a,b),elapsed=performance.now()-start;expect(result.attempts).toHaveLength(count);expect(elapsed).toBeLessThan(5000);expect(mergeLearner(null,b,a)).toEqual(result);
    console.info(`Cloud merge ${count} records: ${elapsed.toFixed(2)} ms`);
  });
  it('handles empty cloud, empty device and identical immutable dedupe', () => {
    const a = {...emptyPayload(),attempts:[submitted()]};
    expect(mergeLearner(null,a,emptyPayload())).toEqual(a);
    expect(mergeLearner(null,emptyPayload(),a)).toEqual(a);
    expect(mergeLearner(null,a,a)).toEqual(a);
  });
  it('keeps unrelated work from both devices with stable ordering and no mutation', () => {
    const a = {...emptyPayload(),attempts:[submitted('z')]}, b = {...emptyPayload(),attempts:[submitted('a')]};
    const before = JSON.stringify([a,b]);
    const merged = mergeLearner(null,a,b);
    expect(merged.attempts.map(v=>v.attemptId)).toEqual(['a','z']);
    expect(mergeLearner(null,b,a)).toEqual(merged); expect(JSON.stringify([a,b])).toBe(before);
  });
  it.each(['answer','submission','exercise','revision','updatedAt','targetedSkillIds'])('refuses a changed immutable %s even when the other device equals the common base', field => {
    const a = {...emptyPayload(),attempts:[submitted()]}, b = structuredClone(a);
    Object.assign(b.attempts[0], {[field]: field === 'answer' ? {kind:'text',value:'changed'} : field === 'revision' ? 2 : field === 'exercise' ? {id:'changed',version:'v2'} : field === 'submission' ? {operationId:'changed',submittedAt:time} : field === 'updatedAt' ? '2026-09-09T12:01:00.000Z' : ['wrong']});
    expect(() => mergeLearner(a,b,a)).toThrow();
  });
  it('same new immutable ID with different content conflicts without a base', () => {
    const a = {...emptyPayload(),attempts:[submitted()]}, b = structuredClone(a); b.attempts[0].answer.value='different';
    expect(() => mergeLearner(null,a,b)).toThrow(/incompatible/);
  });
  it('supports one-sided draft-to-submission with exact identity', () => {
    const base = {...emptyPayload(),attempts:[attempt({attemptId:'one'})]}, changed = {...emptyPayload(),attempts:[{...submitted(),revision:2}]};
    expect(mergeLearner(base,base,changed)).toEqual(changed);
    expect(mergeLearner(base,changed,base)).toEqual(changed);
  });
  it('does not mistake a higher revision for proven draft ancestry', () => {
    const base = {...emptyPayload(),attempts:[attempt()]}, a = structuredClone(base), b = structuredClone(base);
    a.attempts[0].revision=2; a.attempts[0].answer.value='A'; b.attempts[0].revision=8; b.attempts[0].answer.value='B';
    expect(() => mergeLearner(base,a,b)).toThrow(/Concurrent/);
    expect(() => mergeLearner(null,a,b)).toThrow(/Concurrent/);
  });
  it('merges review and undo on a common base despite misleading device clocks', () => {
    const base = {...emptyPayload(),attempts:[submitted()],reviews:[{attemptId:'one',revision:1,reviewedAt:'2099-01-01T00:00:00.000Z'}]};
    const undo = {...structuredClone(base),reviews:[{attemptId:'one',revision:2,reviewedAt:null}]};
    expect(mergeLearner(base,base,undo)).toEqual(undo);
    const concurrent = {...structuredClone(base),reviews:[{attemptId:'one',revision:3,reviewedAt:time}]};
    expect(() => mergeLearner(base,concurrent,undo)).toThrow(/Concurrent/);
  });
  it('does not propagate deletion from a restored backup or empty device', () => {
    const base = {...emptyPayload(),attempts:[submitted()]};
    expect(mergeLearner(base,emptyPayload(),base)).toEqual(base);
    expect(mergeLearner(base,emptyPayload(),emptyPayload())).toEqual(base);
  });
  it('preserves unavailable historical versions without regrading', () => {
    const p = {...emptyPayload(),attempts:[{...submitted(),exercise:{id:'ds.instance.one',version:'historical-unavailable'},templateRef:'historical-template'}]};
    expect(mergeLearner(null,emptyPayload(),p)).toEqual(p);
  });
  it('preserves submitted exams and exact evaluation/answer bindings and deduplicates', () => {
    const backup = emptyBackup(); mock(backup,0,0,'exam',true); validateBackup(backup);
    const payload = projectLearner(backup); expect(mergeLearner(null,payload,payload)).toEqual(payload);
    const bad = structuredClone(payload); bad.exams[0].submission!.operationId='rewritten-operation';
    expect(() => mergeLearner(payload,payload,bad)).toThrow();
  });
  it('rejects concurrent exam draft edits without interleaving responses', () => {
    const backup = emptyBackup(); const exam = mock(backup,0,0,'exam'); delete exam.submission; exam.status='IN_PROGRESS'; backup.attempts=[];
    const base = projectLearner(backup), a=structuredClone(base), b=structuredClone(base);
    a.exams[0].revision++; a.exams[0].responses[0].answer.value='A'; b.exams[0].revision+=2; b.exams[0].flagged=[b.exams[0].items[0].id];
    expect(() => mergeLearner(base,a,b)).toThrow(/exam session/);
  });
  it('merges one-sided exam review without changing any exam score', () => {
    const backup = emptyBackup(); const exam = mock(backup,0,0,'exam',true); const base=projectLearner(backup), next=structuredClone(base);
    next.examReviews=[{sessionId:'exam',itemId:exam.items.find(i=>i.evaluation==='RUBRIC')!.id,revision:1,reviewedAt:time}];
    expect(mergeLearner(base,base,next)).toEqual(next); expect(next.exams).toEqual(base.exams);
  });
});
