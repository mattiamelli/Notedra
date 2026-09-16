import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import advancedDefinitions from '../src/advanced/practice.json';
import advancedCapabilities from '../src/advanced/capabilities.json';
import advancedLocks from '../src/advanced/practice-lock.json';
import {advancedExercises} from '../src/advanced/catalog';
import {allExercises,versionBinding} from '../src/practice/catalog';
import {gradeResponse,validateResponse} from '../src/practice/runtime';
import topicStudy from '../src/generated/topic-study.json';
import availability from '../docs/maintenance-patch-7-source-availability.json';

const fail=(message:string):never=>{throw new Error(message);};
function assert(condition:unknown,message:string):asserts condition {if(!condition)fail(message);}
const sha=(value:string|Buffer)=>createHash('sha256').update(value).digest('hex');
const canonical=(value:unknown):string=>{
  if(Array.isArray(value))return `[${value.map(canonical).join(',')}]`;
  if(value&&typeof value==='object')return `{${Object.entries(value as Record<string,unknown>).sort(([a],[b])=>a.localeCompare(b)).map(([key,item])=>`${JSON.stringify(key)}:${canonical(item)}`).join(',')}}`;
  return JSON.stringify(value);
};
const normalize=(value:string)=>value.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
type SearchableExercise={id:string;title:string;prompt:string;task:unknown;demand?:string};
const tokens=(exercise:SearchableExercise)=>{
  const task=exercise.task as {code?:unknown};
  const body=typeof task?.code==='string'?task.code:exercise.prompt;
  return new Set(normalize(`${exercise.title} ${exercise.demand??''} ${body}`).split(' ').filter(Boolean));
};
const jaccard=(left:Set<string>,right:Set<string>)=>{let shared=0;for(const token of left)if(right.has(token))shared++;return shared/(left.size+right.size-shared);};

assert(advancedDefinitions.length===424,`Expected 424 advanced exercises, found ${advancedDefinitions.length}`);
assert(advancedExercises.length===424,'Typed advanced catalog lost definitions');
assert(new Set(advancedDefinitions.map(item=>item.id)).size===424,'Advanced exercise IDs are not unique');
assert(new Set(advancedDefinitions.map(item=>normalize(item.title))).size===424,'Advanced titles are not unique');
const registered=advancedDefinitions.filter(item=>allExercises.some(candidate=>candidate.id===item.id));
assert(registered.length===424,'Not every advanced exercise is registered in the central catalog');
assert(new Set(allExercises.map(item=>item.id)).size===allExercises.length,'The combined exercise catalog contains duplicate IDs');

const unitCounts=new Map<string,number>();
const subjectCounts=new Map<string,number>();
const difficultyCounts=new Map<string,number>();
const modeCounts=new Map<string,number>();
const availabilityByUnit=new Map(availability.map(row=>[row.unit,row]));
for(const exercise of advancedDefinitions){
  unitCounts.set(exercise.unitId,(unitCounts.get(exercise.unitId)??0)+1);
  subjectCounts.set(exercise.subjectId,(subjectCounts.get(exercise.subjectId)??0)+1);
  difficultyCounts.set(exercise.difficulty,(difficultyCounts.get(exercise.difficulty)??0)+1);
  modeCounts.set(exercise.mode,(modeCounts.get(exercise.mode)??0)+1);
  assert(exercise.skillIds.includes(exercise.skillId),`${exercise.id}: primary skill absent from skillIds`);
  assert(exercise.skillIds.length>=1,`${exercise.id}: no skill evidence`);
  assert(exercise.source.precision==='DOCUMENT_RANGE',`${exercise.id}: source precision changed`);
  assert(exercise.source.documentId===exercise.unitId,`${exercise.id}: source/unit mismatch`);
  assert(/^[a-f0-9]{64}$/.test(exercise.sourceSha256),`${exercise.id}: invalid source digest`);
  const available=availabilityByUnit.get(exercise.unitId);
  assert(available&&exercise.sourceSha256===available.canonicalSha256,`${exercise.id}: source digest does not match the canonical unit`);
  assert(exercise.source.filename===available.filename,`${exercise.id}: source filename does not match the canonical unit`);
  const key=`${exercise.id}@${exercise.version}` as keyof typeof advancedLocks;
  assert(advancedLocks[key]===sha(canonical(exercise)),`${exercise.id}: immutable definition fingerprint mismatch`);
  assert(versionBinding(exercise as never).includes(advancedLocks[key]),`${exercise.id}: version binding omits definition lock`);
  const validation=validateResponse(exercise.task as never,exercise.reference as never);
  assert(validation.status==='VALID',`${exercise.id}: trusted reference is not valid`);
  const grade=gradeResponse(exercise as never,exercise.reference as never);
  assert(grade.status==='GRADED'&&grade.correct&&grade.earned===1,`${exercise.id}: trusted reference does not grade exactly`);
  if(exercise.task.kind==='ip-fixed'){
    const task=exercise.task as {kind:'ip-fixed';options:{id:string;output:string}[]};
    assert(exercise.reference.kind==='choice'&&exercise.reference.value.length===1,`${exercise.id}: malformed Java key`);
    assert(task.options.length===3&&new Set(task.options.map(option=>option.output)).size===3,`${exercise.id}: weak or duplicate fixed predictions`);
  }
}

assert(availability.length===53,'Canonical availability list no longer has 53 units');
for(const row of availability)assert(unitCounts.get(row.unit)===8,`${row.unit}: expected 8 new exercises, found ${unitCounts.get(row.unit)??0}`);
assert(unitCounts.size===53,'Advanced bank includes an unknown or duplicate canonical unit');
assert(subjectCounts.get('CSE1400_CO')===120,'CO advanced count mismatch');
assert(subjectCounts.get('CSE1300_RL')===136,'R&L advanced count mismatch');
assert(subjectCounts.get('CSE1100_IP')===168,'IP advanced count mismatch');
assert(difficultyCounts.get('Medium')===127,'Medium count mismatch');
assert(difficultyCounts.get('Hard')===267,'Hard count mismatch');
assert(difficultyCounts.get('Exam-level')===30,'Exam-level count mismatch');
assert(modeCounts.get('exam')===212&&modeCounts.get('practice')===212,'Practice/exam distribution mismatch');
const expectedCapabilities=[...new Set(advancedDefinitions.map(item=>item.topicId))].sort().map(topicId=>({topicId,count:advancedDefinitions.filter(item=>item.topicId===topicId).length}));
assert(canonical(advancedCapabilities)===canonical(expectedCapabilities),'Displayed advanced capability counts are stale');

const sourceById=new Map(topicStudy.sources.map(source=>[source.id,source]));
const topicById=new Map(topicStudy.topics.map(topic=>[topic.id,topic]));
for(const exercise of advancedDefinitions){
  const topic=topicById.get(exercise.topicId);
  assert(topic&&topic.subjectId===exercise.subjectId,`${exercise.id}: canonical topic mismatch`);
  const subtopic=topic.subtopics.find(item=>item.id===exercise.subtopicId);
  assert(subtopic,`${exercise.id}: canonical subtopic missing`);
  const skills=new Map(topic.subtopics.flatMap(item=>item.skills).map(skill=>[skill.id,skill]));
  for(const skillId of exercise.skillIds){
    const skill=skills.get(skillId);
    assert(skill,`${exercise.id}: canonical skill ${skillId} missing from topic`);
    assert(skill.sources.map(id=>sourceById.get(id)).some(source=>source?.documentId===exercise.unitId&&source.confidence==='HIGH'),`${exercise.id}: ${skillId} lacks high-confidence unit evidence`);
  }
}

const nearDuplicates:{left:string;right:string;score:number}[]=[];
for(let left=0;left<advancedDefinitions.length;left++)for(let right=left+1;right<advancedDefinitions.length;right++){
  const score=jaccard(tokens(advancedDefinitions[left]),tokens(advancedDefinitions[right]));
  if(score>=0.78)nearDuplicates.push({left:advancedDefinitions[left].id,right:advancedDefinitions[right].id,score:Number(score.toFixed(3))});
}
const historical=allExercises.filter(exercise=>!exercise.id.startsWith('ds.practice.advanced-'));
const historicalTitles=new Set(historical.map(item=>normalize(item.title)));
assert(advancedDefinitions.every(item=>!historicalTitles.has(normalize(item.title))),'An advanced title duplicates an accepted historical title');
for(const exercise of advancedDefinitions)for(const accepted of historical){
  const score=jaccard(tokens(exercise),tokens(accepted as SearchableExercise));
  if(score>=0.78)nearDuplicates.push({left:exercise.id,right:accepted.id,score:Number(score.toFixed(3))});
}
assert(nearDuplicates.length===0,`Near-duplicate audit failed: ${JSON.stringify(nearDuplicates.slice(0,5))}`);

const preservation=JSON.parse(readFileSync('scripts/advanced-preservation.json','utf8')) as Record<string,string>;
for(const [path,expected] of Object.entries(preservation))assert(sha(readFileSync(path))===expected,`${path}: accepted grader or Patch 7 artifact changed`);

const report={
  gate:'PASS',generatedAtUtc:new Date().toISOString(),newExercises:424,
  bySubject:Object.fromEntries(subjectCounts),byDifficulty:Object.fromEntries(difficultyCounts),byMode:Object.fromEntries(modeCounts),
  canonicalUnits:53,perUnitMinimum:8,unitsBelowTarget:[],sourceAlignment:'PASS: every skill link resolves to HIGH-confidence evidence for the same canonical lecture unit.',
  exactGrading:'PASS: all 424 references validate and earn exactly one point.',javaRuntimeOracle:'Run scripts/verify-advanced-java.ts for the independent JDK 21 result.',
  duplicateAudit:{scope:'all new-new and new-existing pairs',exactIds:'PASS',exactTitles:'PASS',nearDuplicateThreshold:0.78,result:'PASS',pairs:[]},
  preservation:'PASS: accepted graders and Patch 7 immutable artifacts match their recorded SHA-256 values.'
};
writeFileSync('docs/advanced-exercise-bank-validation.json',JSON.stringify(report,null,2)+'\n');
console.log(`Advanced bank PASS: 424 exercises; 53/53 units; Medium ${difficultyCounts.get('Medium')}, Hard ${difficultyCounts.get('Hard')}, Exam-level ${difficultyCounts.get('Exam-level')}; 0 near-duplicates.`);
