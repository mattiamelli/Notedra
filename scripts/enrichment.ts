import {storageMigrationHash} from './storage-migration-preservation';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import type {Plugin} from 'vite';
import type {EnrichmentScope,EnrichmentExercise,FeedbackProfile,Evidence,ExtraCard,StudyCue,Misconception,GuidedSupplement} from '../src/enrichment/types';
import {gradeEnrichment} from '../src/enrichment/grading';
import {patternKey} from '../src/enrichment/feedback';
import {allExercises,versionBinding} from '../src/practice/catalog';
import {gradeResponse} from '../src/practice/runtime';
import projection from '../src/generated/topic-study.json';
import {canonical} from './practice-catalog';
export interface EnrichmentData {practice:EnrichmentExercise[];evidence:Evidence[];cards:ExtraCard[];cues:StudyCue[];misconceptions:Misconception[];feedback:FeedbackProfile[];guided:GuidedSupplement[];}
const root=new URL('../src/enrichment/',import.meta.url);
export function readEnrichment():EnrichmentData {const read=(n:string)=>JSON.parse(readFileSync(new URL(n+'.json',root),'utf8'));return {practice:read('practice'),evidence:read('evidence'),cards:read('cards'),cues:read('cues'),misconceptions:read('misconceptions'),feedback:read('feedback'),guided:read('guided')};}
const need=(condition:unknown,message:string)=>{if(!condition)throw new Error('Enrichment: '+message);};
const sha=(data:string|Buffer)=>createHash('sha256').update(data).digest('hex');
const record=(value:object,keys:string[])=>need(Object.keys(value).sort().join(',')===[...keys].sort().join(','),'unsupported or missing fields');
const strings=(xs:string[],max=20)=>need(Array.isArray(xs)&&xs.length>0&&xs.length<=max&&new Set(xs).size===xs.length&&xs.every(s=>typeof s==='string'&&s.length>0&&s.length<4000),'invalid text list');
const scopeKeys=['id','version','topicId','skillIds','subtopicIds','sourceIds','evidenceIds'];
const text=(s:string,max=3000)=>need(typeof s==='string'&&s.length>0&&s.length<=max,'text bounds');
const verifiedFiles:Record<string,string>={
 'co-integers':'CO Lecture 6 - Data Representation Part 2.pdf','co-range':'CO Lecture 5 - Data Representation Part 1.pdf','co-endian':'CO Lecture 7 - ISA Part 1.pdf','co-address':'CO Lecture 2 - Assembly.pdf','co-cache':'CO Lecture 13 - Caching.pdf','co-cache-assessment':'CO Endterm 2025 Solutions.pdf','co-pipeline':'CO Lecture 14 - Pipelining.pdf','rl-implication':'Delftse Foundations of Computation.pdf','rl-fol':'Delftse Foundations of Computation.pdf','rl-sets':'Delftse Foundations of Computation.pdf','rl-proof':'Delftse Foundations of Computation.pdf'};
export function validateEnrichment(data:EnrichmentData){
 const allSkills=projection.topics.flatMap(t=>t.subtopics.flatMap(s=>s.skills.map(k=>({...k,topicId:t.id,subtopicId:s.id}))));
 need(data.evidence.length===11&&new Set(data.evidence.map(e=>e.id)).size===11,'reviewed evidence inventory');
 for(const e of data.evidence){
  record(e,['id','filename','pages','section','authority','skillIds']);need(verifiedFiles[e.id]===e.filename,'unreviewed/Notes source cannot establish authority');
  const expected=e.id.startsWith('rl-')?'COURSE_TEXTBOOK':e.id==='co-cache-assessment'?'OFFICIAL_ASSESSMENT':'OFFICIAL_LECTURE';need(e.authority===expected,'authority cannot be promoted or replaced');
  need(Array.isArray(e.pages)&&e.pages.length>0&&e.pages.every(n=>Number.isInteger(n)&&n>0&&n<736),'physical page references');text(e.section);strings(e.skillIds);
  need(e.skillIds.every(id=>allSkills.some(s=>s.id===id&&s.id.startsWith(e.id.startsWith('rl-')?'RL_':'CO_'))),'textbook outside canonical course scope');
 }
 const evidenceById=new Map(data.evidence.map(e=>[e.id,e]));
 function scope(s:EnrichmentScope){
  need(s.id.startsWith('ds.enrichment.')&&s.version==='1','versioned identity');strings(s.skillIds);strings(s.subtopicIds);strings(s.sourceIds);strings(s.evidenceIds);
  need(s.skillIds.every(id=>allSkills.some(k=>k.id===id&&k.topicId===s.topicId&&!id.startsWith('IP_'))),'canonical skill ownership; no expansion');
  const skills=allSkills.filter(k=>s.skillIds.includes(k.id));const subtopics=[...new Set(skills.map(k=>k.subtopicId))];need(subtopics.length===s.subtopicIds.length&&subtopics.every(id=>s.subtopicIds.includes(id)),'subtopic ownership');
  need(skills.every(k=>s.sourceIds.some(id=>k.sources.includes(id)))&&s.sourceIds.every(id=>skills.some(k=>k.sources.includes(id))),'canonical source associations');
  need(s.sourceIds.every(id=>projection.sources.some(ref=>ref.id===id&&ref.confidence==='HIGH'&&ref.precision==='DOCUMENT_RANGE'&&ref.documentId!=='RL_LEC_08')),'canonical source confidence/era preserved');
  need(s.evidenceIds.every(id=>evidenceById.has(id))&&skills.every(k=>s.evidenceIds.some(id=>evidenceById.get(id)!.skillIds.includes(k.id))),'unverified/out-of-scope claim');
 }
 need(data.practice.length===6,'bounded six new mechanisms');
 for(const e of data.practice){
  record(e,['id','version','title','prompt','rules','subjectId','topicId','subtopicId','skillId','authorship','source','grader','task','reference','explanation']);
  need(e.id.startsWith('ds.practice.enrich-')&&e.version==='1'&&e.authorship==='AUTHORED_PRACTICE','practice identity');
  need(projection.topics.some(t=>t.id===e.topicId&&t.subjectId===e.subjectId&&t.subtopics.some(s=>s.id===e.subtopicId&&s.skills.some(k=>k.id===e.skillId))),'exercise ownership');
  for(const value of [e.title,e.prompt,e.rules,e.explanation])text(value);
  need(gradeEnrichment(e,e.reference).status==='GRADED','trusted answer format');need(data.feedback.some(p=>p.exerciseId===e.id),'every new item needs feedback');
  const ref=projection.sources.find(s=>s.documentId===e.source.documentId&&s.filename===e.source.filename&&s.locator===e.source.locator&&s.precision===e.source.precision);
  need(ref&&allSkills.find(s=>s.id===e.skillId)!.sources.includes(ref.id),'new exercise canonical provenance');
 }
 for(const [items,extra] of [[data.cards,['prompt','answer','reason']],[data.cues,['text']],[data.misconceptions,['label','rule']],[data.guided,['title','prompt','conditions','pitfalls','reference']]] as const){
  for(const item of items){record(item,[...scopeKeys,...extra]);scope(item);for(const key of extra){const value=item[key as keyof typeof item];if(Array.isArray(value))strings(value);else text(value as string);}}
 }
 for(const p of data.feedback){
  record(p,[...scopeKeys,'exerciseId','binding','reasoning','remember','fallback','paths']);scope(p);
  const e=allExercises.find(e=>e.id===p.exerciseId);need(e&&versionBinding(e)===p.binding,'feedback must bind exact immutable exercise/grader');need(e!.skillId===p.skillIds[0]&&p.skillIds.length===1,'feedback skill identity');
  for(const t of [p.reasoning,p.remember,p.fallback])text(t);need(p.paths.length>0&&p.paths.length<=4,'bounded useful error paths');
  const keys=new Set<string>();for(const path of p.paths){record(path,['answer','misconceptionId','why']);text(path.why);const key=patternKey(e!,path.answer);need(key!==null&&!keys.has(key),'invalid/duplicate pattern');keys.add(key!);
   const result=gradeResponse(e!,{kind:'text',value:path.answer});need(result.status==='GRADED'&&!result.correct,'feedback path must be a valid incorrect answer');
   const misconception=data.misconceptions.find(m=>m.id===path.misconceptionId);need(misconception&&misconception.skillIds.includes(e!.skillId),'misconception ownership');
  }
 }
 const authored=[...data.cards,...data.cues,...data.misconceptions,...data.feedback,...data.guided];need(new Set(authored.map(r=>r.id)).size===authored.length,'duplicate identities');
 need(new Set(data.feedback.map(p=>p.exerciseId+':'+p.binding)).size===data.feedback.length,'ambiguous historical feedback');
 need(data.cards.length===12&&data.cues.length===6&&data.guided.length===2&&data.feedback.length===16,'bounded enrichment inventory');
}
export function validateCapabilities(data:EnrichmentData,actual:unknown){
 const topics=[...new Set([...data.cards,...data.practice,...data.guided].map(c=>c.topicId))].sort();
 const expected=topics.map(topicId=>({topicId,cards:data.cards.filter(c=>c.topicId===topicId).length,exercises:data.practice.filter(c=>c.topicId===topicId).length,guides:data.guided.filter(c=>c.topicId===topicId).length}));
 need(Array.isArray(actual),'capability inventory');
 need(canonical([...actual as {topicId:string}[]].sort((a,b)=>a.topicId.localeCompare(b.topicId)))===canonical(expected),'displayed capability counts are stale');
}
export function validateEnrichmentFiles(){
 const data=readEnrichment();validateEnrichment(data);
 const read=(n:string)=>JSON.parse(readFileSync(new URL(n+'.json',root),'utf8'));
 validateCapabilities(data,read('capabilities'));
 const records=[...data.evidence,...data.cards,...data.cues,...data.misconceptions,...data.feedback,...data.guided];const locks=read('content-lock') as Record<string,string>;
 need(Object.keys(locks).length===records.length,'content lock inventory');for(const item of records)need(locks[item.id+'@'+('version' in item?item.version:'1')]===sha(canonical(item)),'published enrichment changed: '+item.id);
 const practiceLocks=read('practice-lock') as Record<string,string>;need(Object.keys(practiceLocks).length===6,'practice lock inventory');for(const e of data.practice)need(practiceLocks[e.id+'@'+e.version]===sha(canonical(e)),'practice lock mismatch');
 const grader=read('grader-lock');need(grader.id==='enrichment-exact'&&grader.version==='1'&&grader.sha256===sha(readFileSync(new URL('grading.ts',root))),'grader binding changed');
 const baseline=JSON.parse(readFileSync(new URL('./enrichment-baseline.json',import.meta.url),'utf8')) as Record<string,string>;
 for(const [file,hash] of Object.entries(baseline))need(sha(readFileSync(new URL('../'+file,import.meta.url)))===storageMigrationHash(file,hash),'protected baseline changed: '+file);
}
export const enrichmentGuard=(validate=validateEnrichmentFiles):Plugin=>({name:'delftstudy-enrichment',apply:'build',buildStart(){validate();}});
