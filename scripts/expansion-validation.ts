import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {expansionExercises as definitions} from '../src/expansion/catalog';
import oldFingerprints from '../src/expansion/practice-lock.json';
import grader from '../src/expansion/grader-lock.json';
import capabilities from '../src/expansion/capabilities.json';
import oldGuides from '../src/expansion/guided.json';
import guideCapabilities from '../src/expansion/guided-capabilities.json';
import oldGuideLocks from '../src/expansion/guided-lock.json';
import javaOracles from './expansion-java-oracles.json';
import {allExercises} from '../src/practice/catalog';
import {gradeResponse,validateResponse} from '../src/practice/runtime';
import type {PracticeExercise} from '../src/practice/registered-types';
import study from '../src/generated/topic-study.json';
import pack from '../content-pack/v1.0.1/DelftStudy_Codex_Handoff_Pack.json';
import completionFingerprints from '../src/expansion/completion-lock.json';
import completionGuides from '../src/expansion/completion-guided.json';
import completionGuideLocks from '../src/expansion/completion-guided-lock.json';
import completionGrader from '../src/expansion/completion-grader-lock.json';
import checkpoint from './expansion-accepted-checkpoint.json';
const fingerprints={...oldFingerprints,...completionFingerprints},guideLocks={...oldGuideLocks,...completionGuideLocks},guides=[...oldGuides,...completionGuides];
const sha=(value:string|Buffer)=>createHash('sha256').update(value).digest('hex');
export function validateExpansion(){
 for(const [file,hash] of Object.entries(checkpoint))if(sha(readFileSync(file))!==hash)throw Error('Changed accepted Patch 7 checkpoint: '+file);
 if(completionGrader.sha256!==sha(Buffer.concat(completionGrader.files.map(f=>readFileSync(f)))))throw Error('Changed completion grader binding');
 const seen=new Set<string>();const prompts=new Map<string,string>();
 for(const e of allExercises){if(seen.has(e.id))throw Error('Reused exercise ID: '+e.id);seen.add(e.id);const prompt=e.prompt.trim().replace(/\s+/g,' ');if(prompts.has(prompt)&&(e.id.startsWith('ds.practice.p7-')||prompts.get(prompt)!.startsWith('ds.practice.p7-')))throw Error('Duplicated new prompt: '+e.id);prompts.set(prompt,e.id);}
 for(const e of definitions){
  if(!e.id.startsWith('ds.practice.p7-')||!e.title||!e.prompt||!e.rules||!e.explanation||!e.demand||e.authorship!=='AUTHORED_PRACTICE')throw Error('Incomplete authored definition');
  if(!['practice','exam'].includes(e.mode)||!['Medium','Hard','Exam-level'].includes(e.difficulty))throw Error('Missing classification');
  const unit=pack.corpus.documents.find(d=>d.document_id===e.unitId&&d.document_id.includes('_LEC_'));
  if(!unit||unit.subject_id!==e.subjectId||e.source.documentId!==unit.document_id||e.source.filename!==unit.filename)throw Error('Invalid canonical unit');
  const topic=study.topics.find(t=>t.id===e.topicId&&t.subjectId===e.subjectId),sub=topic?.subtopics.find(t=>t.id===e.subtopicId),skill=sub?.skills.find(t=>t.id===e.skillId);
  if(e.sourcePages&&(!e.sourcePages.length||e.sourcePages.some(p=>!Number.isInteger(p)||p<1)))throw Error('Invalid physical source pages');
  if(!skill?.sources.some(id=>{const s=study.sources.find(s=>s.id===id)!;return s.documentId===e.unitId&&s.locator===e.source.locator&&s.precision===e.source.precision&&s.confidence==='HIGH';}))throw Error('Lost source/skill mapping');
  const exercise=e as PracticeExercise;const valid=validateResponse(exercise.task,exercise.reference),result=gradeResponse(exercise,exercise.reference);
  if(valid.status!=='VALID'||result.status!=='GRADED'||!result.correct)throw Error('Incorrect or unavailable reference: '+e.id);
  if((fingerprints as Record<string,string>)[e.id+'@'+e.version]!==sha(JSON.stringify(e)))throw Error('Changed definition binding');
 }
 if(grader.sha256!==sha(Buffer.concat(grader.files.map(f=>readFileSync(f)))))throw Error('Changed expansion grader binding');
 const javaIds=definitions.filter(e=>e.task.kind==='ip-fixed').map(e=>e.id).sort();
 if(JSON.stringify(javaIds)!==JSON.stringify(javaOracles.map(o=>o.exerciseId).sort()))throw Error('Missing independent Java oracle');
 for(const g of guides){
  if(seen.has(g.id)||!g.id.startsWith('ds.guided.p7-')||prompts.has(g.prompt)||!g.reference.length||!g.rubric.length||!g.fields.length)throw Error('Duplicate or incomplete guided exercise');seen.add(g.id);prompts.set(g.prompt,g.id);
  if((guideLocks as Record<string,string>)[g.id+'@'+g.version]!==sha(JSON.stringify(g)))throw Error('Changed unscored content binding');
  const topic=study.topics.find(t=>t.id===g.topicId)!;
  if(!['practice','exam'].includes(g.mode)||!['Medium','Hard','Exam-level'].includes(g.difficulty)||!g.demand)throw Error('Missing guided classification');
  for(const id of g.skillIds){const sub=topic.subtopics.find(st=>st.skills.some(sk=>sk.id===id));const skill=sub?.skills.find(sk=>sk.id===id);if(!sub||!g.subtopicIds.includes(sub.id)||!skill?.sources.some(id=>g.sourceIds.includes(id)&&study.sources.some(s=>s.id===id&&s.documentId===g.unitId&&s.confidence==='HIGH')))throw Error('Lost guided scope');}
 }
 const actual=[...new Set(definitions.map(e=>e.topicId))].sort().map(topicId=>({topicId,count:definitions.filter(e=>e.topicId===topicId).length}));
 const actualGuides=[...new Set(guides.map(g=>g.topicId))].sort().map(topicId=>({topicId,count:guides.filter(g=>g.topicId===topicId).length}));
 if(JSON.stringify(actualGuides)!==JSON.stringify(guideCapabilities))throw Error('Stale guided capabilities');
 if(JSON.stringify(actual)!==JSON.stringify(capabilities))throw Error('Stale capabilities');
 return {exercises:definitions.length,guided:guides.length,duplicates:0,originalGraderFiles:'unchanged'};
}
export function lectureCoverage(){
 const units=pack.corpus.documents.filter(d=>d.document_id.includes('_LEC_')).map(d=>{
  const old=allExercises.filter(e=>!e.id.startsWith('ds.practice.p7-')&&e.source.documentId===d.document_id),added=[...definitions.filter(e=>e.unitId===d.document_id),...guides.filter(g=>g.unitId===d.document_id)];
  return {course:d.subject_id,id:d.document_id,title:d.filename,before:old.length,added:added.length,total:old.length+added.length,topics:[...new Set(added.map(e=>e.topicId))],skills:[...new Set(added.flatMap(e=>'skillId' in e?[e.skillId]:e.skillIds))],practice:added.filter(e=>e.mode==='practice').length,exam:added.filter(e=>e.mode==='exam').length,difficulty:added.map(e=>e.difficulty),types:added.map(e=>'task' in e?e.task.kind:'guided-rubric'),source:d.filename,status:added.length>=4?'COUNT MET':'PENDING — not an academic exception'};
 });
 return {units,gate:units.every(u=>u.added>=4)?'PASS':'FIX NEEDED',newExercises:definitions.length+guides.length};
}
export function coverageMarkdown(){const report=lectureCoverage();return '# Patch 7 lecture coverage\n\nGate: **'+report.gate+'**. '+report.newExercises+' new exercises. This is a strict count audit, not proof of full source/browser acceptance. Pending units are not exempted. Canonical units: CO 15, R&L 17, IP 21. IP introduction 0 is outside the accepted taxonomy and is not fabricated as a new canonical unit. Before counts count each old objective exercise once under its primary lecture; existing unscored activities are not miscounted as new exercises.\n\n| Course | Unit | Source/title | Before | New | Total | Practice / Exam | Difficulty | Types | Topics | Skills | Status |\n|---|---|---|---:|---:|---:|---|---|---|---|---|---|\n'+report.units.map(u=>'| '+[u.course,u.id,u.title,u.before,u.added,u.total,`${u.practice} / ${u.exam}`,u.difficulty.join(', '),u.types.join(', '),u.topics.join(', '),u.skills.join(', '),u.status].join(' | ')+' |').join('\n')+'\n';}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 console.log('Expansion content PASS',validateExpansion());
 if(process.argv.includes('--write'))writeFileSync('docs/maintenance-patch-7-coverage.md',coverageMarkdown());
 if(process.argv.includes('--check')){
  if(readFileSync('docs/maintenance-patch-7-coverage.md','utf8')!==coverageMarkdown())throw Error('Stale lecture coverage');
  const missing=lectureCoverage().units.filter(u=>u.added<4);if(missing.length)throw Error('Coverage FIX NEEDED: '+missing.map(u=>u.id+'='+u.added).join(', '));
 }
}
