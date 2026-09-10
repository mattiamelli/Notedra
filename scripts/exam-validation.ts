import assert from 'node:assert/strict';
import {beforeHardening} from './hardening-preservation';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import co from '../src/exams/banks/co.json';import rl from '../src/exams/banks/rl.json';import ip from '../src/exams/banks/ip.json';
import coRefs from '../src/exams/references/co.json';import rlRefs from '../src/exams/references/rl.json';import ipRefs from '../src/exams/references/ip.json';
import refs from '../src/generated/student-references.json';
import lock from './exam-content-lock.json';
import {startSession,selectItems,resolveSession} from '../src/exams/engine';
import {evaluateSubmission,practiceFor} from '../src/exams/evaluation';
import {validateExamSession} from '../src/exams/records';
import {STUDENT_SCHEMA_VERSION} from '../src/learning/contracts';
import {STUDENT_DB_VERSION} from '../src/learning/repository';
import type {ExamBank,OpenReference} from '../src/exams/types';
export const examBanks=[co,rl,ip] as ExamBank[];
export function validateExamContent(banks:ExamBank[]=examBanks,solutions:OpenReference[]=[...coRefs,...rlRefs,...ipRefs]){
 const pack=JSON.parse(readFileSync('content-pack/v1.0.1/DelftStudy_Codex_Handoff_Pack.json','utf8'));
 function find(key:string,value:unknown):unknown[]{if(value&&typeof value==='object'){const r=value as Record<string,unknown>;if(Array.isArray(r[key]))return r[key];for(const v of Object.values(r)){const found=find(key,v);if(found.length)return found;}}return [];}
 const patterns=find('course_exam_patterns',pack) as {pattern_id:string;subject_id:string}[],types=find('question_types',pack) as {question_type_id:string}[];
 assert.equal(patterns.length,22);assert.equal(types.length,17);assert.equal(banks.length,3);assert.equal(new Set(banks.map(b=>b.course)).size,3);
 const allKeys=new Set<string>();
 for(const bank of banks){assert.equal(bank.blueprints.length,2);assert.deepEqual(bank.blueprints.map(b=>b.mode),['quick','full']);assert(bank.items.length>=10);
  const items=new Map(bank.items.map(i=>[i.id,i]));assert.equal(items.size,bank.items.length);
  for(const item of bank.items){assert.equal(item.course,bank.course);assert(refs.topics.some(t=>t.id===item.topicId&&t.subject===bank.course),'Topic ownership');assert(types.some(t=>t.question_type_id===item.questionType),'Unknown question type');assert.equal(item.generationEligibility,'FIXED_AUTHORED_ONLY');assert(item.version.length&&item.difficultyReason.length>20);assert(['Easy','Medium','Hard'].includes(item.difficulty));assert(Number.isSafeInteger(item.weight)&&item.weight>0&&item.weight<=100);
   const key=item.id+'@'+item.version;assert(!allKeys.has(key));allKeys.add(key);
   for(const id of item.skillIds){const skill=refs.skills.find(s=>s.id===id);assert(skill&&refs.subtopics.some(s=>s.id===skill.subtopic&&s.topic===item.topicId),'Skill ownership');}
   if(item.patternId)assert(patterns.some(p=>p.pattern_id===item.patternId&&p.subject_id===item.course),'Pattern ownership');
   assert(item.provenance.length);for(const p of item.provenance){const doc=pack.corpus.documents.find((d:{document_id:string})=>d.document_id===p.documentId);assert(doc&&doc.filename===p.filename&&doc.subject_id===bank.course,'Source identity');assert.equal(p.era,doc.evidence_era);assert(['CURRENT','RECENT'].includes(p.era));assert.equal(p.role,'MECHANISM_ONLY');assert(p.pages.length&&p.pages.every(n=>Number.isSafeInteger(n)&&n>0&&n<=33));}
   if(item.evaluation==='DETERMINISTIC'){const exercise=practiceFor(item);assert(exercise,'Exact practice/grader binding');assert.equal(exercise!.subjectId,item.course);assert.equal(exercise!.topicId,item.topicId);assert.deepEqual(item.skillIds,[exercise!.skillId]);assert.equal(item.responseType,exercise!.reference.kind);assert(!item.rubric);}
   else {assert.equal(item.evaluation,'RUBRIC');assert.equal(item.evaluator.id,'rubric-self-review');assert.equal(item.evaluator.version,'1');assert(!item.practiceRef);assert(item.prompt&&item.prompt.length>50&&item.rubric&&item.rubric.length>=2);for(const r of item.rubric){assert(r.checks.length);assert(r.skillIds.every(s=>item.skillIds.includes(s)));}assert.equal(solutions.filter(s=>s.itemId===item.id&&s.version===item.version).length,1);}
  }
  for(const blueprint of bank.blueprints){assert.equal(blueprint.course,bank.course);assert.equal(blueprint.version,'1');assert.equal(blueprint.durationMinutes,blueprint.mode==='full'?180:30);assert(blueprint.rationale.includes('authored'));assert.equal(new Set(blueprint.slots.map(s=>s.id)).size,blueprint.slots.length);for(const slot of blueprint.slots){assert(slot.candidates.length);for(const ref of slot.candidates)assert.equal(items.get(ref.id)?.version,ref.version);}
   for(const seed of ['baseline','repeatable','αβ']){const picked=selectItems(blueprint,bank,seed);assert.deepEqual(picked,selectItems(blueprint,bank,seed));assert.deepEqual(blueprint.difficultyMix,Object.fromEntries(['Easy','Medium','Hard'].map(d=>[d,picked.filter(i=>i.difficulty===d).length])));assert.deepEqual(blueprint.questionTypeMix,Object.fromEntries([...new Set(picked.map(i=>i.questionType))].map(q=>[q,picked.filter(i=>i.questionType===q).length])));}
  }
 }
 const fullCO=banks.find(b=>b.course==='CSE1400_CO')!,fullRL=banks.find(b=>b.course==='CSE1300_RL')!,fullIP=banks.find(b=>b.course==='CSE1100_IP')!;
 assert.equal(new Set(fullCO.items.map(i=>i.topicId)).size,13);assert(fullCO.items.some(i=>i.mechanism==='dma'));assert.equal(fullCO.items.filter(i=>i.topicId==='CO_T06_ASSEMBLY_X86_64').length,1);
 assert(fullRL.items.filter(i=>i.evaluation==='RUBRIC').length>=12);assert(fullIP.items.filter(i=>i.responseType==='code'&&i.evaluation==='RUBRIC'&&i.context&&i.rubric?.every(r=>r.skillIds.length)).length>=8);
 assert.equal(solutions.length,banks.flatMap(b=>b.items).filter(i=>i.evaluation==='RUBRIC').length);
 return {courses:3,blueprints:6,items:banks.reduce((n,b)=>n+b.items.length,0),openReferences:solutions.length};
}
export function validateExam(){
 validateExamContent();assert.equal(STUDENT_SCHEMA_VERSION,3);assert.equal(STUDENT_DB_VERSION,3);
 for(const [file,digest] of Object.entries(lock))assert.equal(createHash('sha256').update(beforeHardening(file,readFileSync(file))).digest('hex'),digest,'Published exam version/source drift: '+file);
 const now=Date.parse('2026-09-10T10:00:00.000Z');
 for(const bank of examBanks)for(const blueprint of bank.blueprints){const s=startSession(blueprint,bank,'gate','gate-session',now);validateExamSession(s);assert.equal(resolveSession(s,bank).status,'AVAILABLE');for(const r of s.responses){const item=bank.items.find(i=>i.id===r.itemId)!;r.answer=practiceFor(item)?.reference??{kind:item.responseType as 'text'|'code',value:'unverified learner work'};}const result=evaluateSubmission(s,bank,s.startedAt);assert(result.evaluations.every(e=>e.status==='AUTO_SCORED'||e.status==='RUBRIC_REVIEW_REQUIRED'));assert.equal(result.attempts.length,s.items.filter(i=>i.evaluation==='DETERMINISTIC').length);}
 for(const file of ['src/exams/evaluation.ts','src/exams/engine.ts','src/exams/ExamOpenAnswer.tsx'])assert(!/\b(?:eval|fetch)\s*\(|new Function|child_process|WebSocket/.test(readFileSync(file,'utf8')),'Unsafe exam runtime');
 return {schema:3,db:3,blueprints:6};
}
export function examBuildGuard(){return {name:'exam-integrity',buildStart(){validateExam();}};}
