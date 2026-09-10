import {describe,it,expect} from 'vitest';
import co from '../src/exams/banks/co.json';
import type {ExamBank} from '../src/exams/types';
import {repository} from './helpers/learning';
import {emptyBackup} from '../src/learning/contracts';
import {startSession,resolveSession} from '../src/exams/engine';
import {evaluateSubmission} from '../src/exams/evaluation';
const bank=co as ExamBank;
describe('Step 10 adversarial self-review regressions',()=>{
 it('conflicting seed on a repeated submission operation must not silently succeed',async()=>{const repo=repository(),initial=await repo.load(),started=await repo.startExam(bank,'ds.exam.co.quick','original','same-id',initial.data),original=started.data.exams[0];const saved=await repo.submitExam(original,'same-op',bank,started.data);const conflict={...original,seed:'conflicting-seed'};await expect(repo.submitExam(conflict,'same-op',bank,saved.data)).rejects.toMatchObject({code:'CONFLICT'});expect(await repo.load()).toEqual(saved);repo.close();});
 it('one objective evidence attempt cannot be linked to two exam sessions in an imported backup',async()=>{const repo=repository(),initial=await repo.load(),started=await repo.startExam(bank,'ds.exam.co.quick','x','first',initial.data);const s=started.data.exams[0];s.responses[0].answer={kind:'text',value:'00000'};const edited=await repo.saveExam('first',1,s.responses,[],started.data),saved=await repo.submitExam(edited.data.exams[0],'op',bank,edited.data);const backup=await repo.exportBackup(),copy=structuredClone(backup.exams[0]);copy.sessionId='duplicate-evidence';copy.submission!.operationId='new-op';backup.exams.push(copy);await expect(repo.restore(backup,saved.data)).rejects.toBeDefined();expect(await repo.load()).toEqual(saved);repo.close();});
 it('Schema 2 migration rejects extra exam fields rather than discarding them',async()=>{const repo=repository(),initial=await repo.load();await expect(repo.restore({...emptyBackup(),schemaVersion:2},initial.data)).rejects.toBeDefined();expect(await repo.load()).toEqual(initial);repo.close();});
});
describe('Step 10 final verification regressions',()=>{
 it('rejects a historical session whose declared course differs from its exact blueprint',()=>{const session=startSession(bank.blueprints[0],bank,'seed','course-binding',Date.now());session.course='CSE1100_IP';expect(resolveSession(session,bank).status).toBe('UNAVAILABLE');expect(()=>evaluateSubmission(session,bank,session.startedAt)).toThrow();});
 it('does not assert an unseen solution for exam evidence when prior exposure is unknown',()=>{const session=startSession(bank.blueprints[0],bank,'seed','exposure',Date.now());session.responses[0].answer={kind:'text',value:'00000'};const result=evaluateSubmission(session,bank,session.startedAt);expect(result.attempts).toHaveLength(1);expect(result.attempts[0].solutionViewed).toBeNull();});
});
