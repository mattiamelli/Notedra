import {examStorageHash} from './exam-storage-preservation';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {migrateBackup,emptyBackup,STUDENT_SCHEMA_VERSION} from '../src/learning/contracts';
import {STUDENT_DB_VERSION} from '../src/learning/repository';
import {allExercises,versionBinding} from '../src/practice/catalog';
import {deriveEvidence,eligibleSkill,skills} from '../src/adaptive/evidence';
import {recommend,TIME_BUDGETS} from '../src/adaptive/engine';
import {buildAdaptiveActions} from './adaptive-actions';
import actions from '../src/adaptive/actions.json';
import lock from './step9-storage-lock.json';
export function validateMistakes(){
 assert.equal(STUDENT_SCHEMA_VERSION,3);assert.equal(STUDENT_DB_VERSION,4);
 const {reviews:_reviews,exams:_exams,examReviews:_examReviews,upcomingExams:_upcomingExams,...base}=emptyBackup();const legacy={...base,schemaVersion:1};assert.deepEqual(migrateBackup(legacy),emptyBackup());
 for(const [file,value] of Object.entries(lock))assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'),examStorageHash(file,value.after),'Storage migration source drift: '+file);
 const now=Date.parse('2026-09-09T12:00:00.000Z');
 for(const e of allExercises){assert.equal(eligibleSkill(e)?.id,e.skillId);const attempt={...base,attemptId:e.id,contentVersion:base.content.version,status:'SUBMITTED' as const,answer:e.reference,hintsUsed:null,solutionViewed:null,createdAt:new Date(now).toISOString(),updatedAt:new Date(now).toISOString(),revision:2,submission:{operationId:e.id,submittedAt:new Date(now).toISOString()},subjectId:e.subjectId,topicId:e.topicId,subtopicId:e.subtopicId,targetedSkillIds:[e.skillId],templateRef:e.id,exercise:{id:'ds.instance.'+e.id,version:versionBinding(e)}};
  // Strip container metadata: only immutable attempt fields cross the evidence boundary.
  const {schemaVersion:_schema,content:_content,resume:_resume,attempts:_attempts,...record}=attempt;
  const evidence=deriveEvidence([record],[],now);assert.equal(evidence.limited.length,0);assert.equal(evidence.mistakes.length,0);
 }
 return {schema:STUDENT_SCHEMA_VERSION,db:STUDENT_DB_VERSION,atomicItems:allExercises.length};
}
export function validateAdaptive(candidate:unknown=actions){
 assert.deepEqual(candidate,buildAdaptiveActions(),'Adaptive action projection is stale.');const ids=new Set<string>();
 for(const action of actions){assert(!ids.has(action.id));ids.add(action.id);assert(action.skillIds.length);assert(action.minutes>0&&action.minutes<=60);assert(action.to.startsWith('/'));for(const id of action.skillIds)assert.equal(skills.get(id)?.subjectId,action.subjectId,'Cross-course action');}
 for(const minutes of TIME_BUDGETS)assert.deepEqual(recommend(deriveEvidence([],[],0),{minutes}),[]);
 for(const file of ['evidence.ts','engine.ts','filters.ts'])assert(!/\b(?:fetch|XMLHttpRequest|WebSocket|eval)\s*\(|new Function|localStorage|indexedDB|child_process/.test(readFileSync('src/adaptive/'+file,'utf8')),'Pure selector has side effects');
 return {skills:skills.size,authoredActions:actions.length,budgets:TIME_BUDGETS};
}
export function adaptiveBuildGuard(){return {name:'mistake-adaptive-integrity',buildStart(){validateMistakes();validateAdaptive();}};}
