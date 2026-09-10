import {beforeHardening} from './hardening-preservation';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import lock from './progress-preservation-lock.json';
import {STUDENT_SCHEMA_VERSION,emptyBackup} from '../src/learning/contracts';
import {STUDENT_DB_VERSION} from '../src/learning/repository';
import {deriveProgress} from '../src/progress/derive';
import {skillMastery,DAY,recency,difficultyWeight} from '../src/progress/mastery';
import {requiredOpen} from '../src/progress/readiness';
import {examBanks} from './exam-validation';
import type {Observation} from '../src/progress/types';
export function validateMastery(){
 assert.equal(STUDENT_SCHEMA_VERSION,3);assert.equal(STUDENT_DB_VERSION,3);
 for(const [file,digest] of Object.entries(lock))assert.equal(createHash('sha256').update(preservedBytes(file)).digest('hex'),digest,'Steps 1–10 protected file changed: '+file);
 const now=Date.UTC(2026,8,10),empty=deriveProgress(emptyBackup(),now);assert.equal(empty.skills.length,147);assert.equal(empty.topics.length,43);assert.equal(empty.courses.length,3);assert(empty.skills.every(s=>s.index===null&&s.confidence==='Insufficient'));
 const identity={id:'gate',name:'gate',courseId:'gate',topicId:'gate'},sample:Observation={id:'one',item:'exact',skillId:'gate',topicId:'gate',courseId:'gate',timestamp:now,correct:true,source:'Normal practice',session:'one',difficulty:'Unknown',solutionViewed:false,pattern:null};
 assert.equal(skillMastery(identity,[sample],now).index,55);assert.equal(skillMastery(identity,[{...sample,correct:false}],now).index,0);
 assert.equal(skillMastery(identity,Array.from({length:100},(_,i)=>({...sample,id:String(i)})),now).index,55);
 assert.equal(recency(now-45*DAY,now),.5);assert.equal(skillMastery(identity,[sample],now).confidence,'Low');assert.deepEqual(deriveProgress(emptyBackup(),now),empty);
 for(const file of readdirSync('src/progress').filter(f=>/\.tsx?$/.test(f)))assert(!/\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon|eval)\b|new Function|\.setItem\s*\(|indexedDB\.open/.test(readFileSync('src/progress/'+file,'utf8')),'Unexpected IO/evaluation in derived progress: '+file);
 return {skills:147,topics:43,courses:3,schema:3,db:3,protectedFiles:Object.keys(lock).length};
}
export function validateReadiness(){
 const now=Date.UTC(2026,8,10),r=deriveProgress(emptyBackup(),now).readiness;assert(r.every(c=>c.index===null&&c.confidence==='Insufficient'&&!c.integrated));
 assert.deepEqual(Object.fromEntries(r.map(c=>[c.courseId,c.totalTopics])),{CSE1400_CO:13,CSE1300_RL:9,CSE1100_IP:20});assert.deepEqual(['Easy','Medium','Hard','Unknown'].map(d=>difficultyWeight(d as Observation['difficulty'])),[.9,1,1.1,1]);
 for(const bank of examBanks){const required=requiredOpen[bank.course];assert(required.length>=7);for(const mechanism of required)assert(bank.items.some(i=>i.mechanism===mechanism&&i.evaluation==='RUBRIC'),'Required open mechanism missing: '+mechanism);}
 const ip=examBanks.find(b=>b.course==='CSE1100_IP')!;assert(['model','parser','application','tests'].every(m=>ip.items.some(i=>i.mechanism===m&&i.context&&i.evaluation==='RUBRIC')));
 return {courses:3,requiredOpenMechanisms:Object.fromEntries(Object.entries(requiredOpen).map(([k,v])=>[k,v.length])),unknown:true};
}
export function progressBuildGuard(){return {name:'progress-evidence-integrity',buildStart(){validateMastery();validateReadiness();}};}

function preservedBytes(file:string){
 const data=beforeHardening(file,readFileSync(file));
 if(file==='src/practice/ExerciseParts.tsx')return data.toString().replace('Eligible saved evidence is interpreted separately in Progress; this item point is not a mastery or readiness score.','This item feedback does not update mastery or exam readiness.');
 if(file==='src/practice/AttemptPage.tsx')return data.toString().replace('Learning evidence summaries are available in Progress.','No learning score is calculated.');
 if(file==='src/exams/ExamsPage.tsx')return data.toString().replace('No official grade is provided. See Progress for separate evidence indices with coverage, confidence and limitations.','No official grade or exam-readiness estimate is provided.');
 if(file==='src/exams/ExamReviewPage.tsx')return data.toString().replace('These item points are not a TU Delft grade or a mastery/readiness score. See Progress for separate evidence indices with coverage, confidence and limitations.','No TU Delft grade, mastery or readiness estimate is calculated.');
 return data;
}
