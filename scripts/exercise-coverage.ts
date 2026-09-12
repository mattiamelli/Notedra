import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import study from '../src/generated/topic-study.json';
import {isInteractive} from '../src/interactive/types';
import {allExercises,versionBinding} from '../src/practice/catalog';
import {exerciseFormat} from '../src/practice/presentation';
import type {PracticeExercise} from '../src/practice/registered-types';
import type {ExamBank} from '../src/exams/types';
import {practiceFor} from '../src/exams/evaluation';
const read=<T>(path:string):T=>JSON.parse(readFileSync(path,'utf8'));
type Activity={id:string;topicId:string;skillIds:string[];sourceIds:string[];title?:string;name?:string;fields?:unknown[];assumptions?:string;mode?:string};
export type CoverageRow={id:string;course:string;topic:string;subtopics:string[];skills:string[];title:string;before:string;after:string;source:string[];practice:string;exam:string;validator:string;feedback:string;tests:string;fallback:string};
export function buildExerciseCoverage(exercises:readonly PracticeExercise[]=allExercises){
 const rows:CoverageRow[]=[];
 const banks=['co','rl','ip'].map(c=>read<ExamBank>(`src/exams/banks/${c}.json`));
 function scope(topicId:string,skills:string[],allowBroad=false){
  const topic=study.topics.find(t=>t.id===topicId);
  if(!topic||(!skills.length&&!allowBroad)||skills.some(s=>!study.topics.filter(t=>t.subjectId===topic.subjectId).some(t=>t.subtopics.some(st=>st.skills.some(sk=>sk.id===s)))))throw Error(`Missing canonical scope: ${topicId}`);
  return {course:topic.subjectId,topic:topicId,skills,subtopics:study.topics.filter(t=>t.subjectId===topic.subjectId).flatMap(t=>t.subtopics).filter(st=>st.skills.some(sk=>skills.includes(sk.id))).map(st=>st.id)};
 }
 function sources(ids:string[]){
  if(!ids.length)throw Error('Missing source metadata');
  return ids.map(id=>{const s=study.sources.find(s=>s.id===id);if(!s)throw Error(`Unknown source: ${id}`);return `${s.documentId}: ${s.filename} (${s.precision}; ${s.locator})`;});
 }
 for(const e of exercises){
  const policy=exerciseFormat(e.task.kind);if(!policy||policy.validator!==e.grader.id)throw Error(`Missing renderer/validator classification: ${e.id}`);
  const s=scope(e.topicId,[e.skillId]);if(s.course!==e.subjectId||!s.subtopics.includes(e.subtopicId)||!e.source.documentId||!e.source.filename)throw Error(`Lost provenance: ${e.id}`);
  const exam=banks.flatMap(b=>b.items).filter(i=>i.practiceRef?.id===e.id);
  const variant='format' in e.task?` / ${e.task.format}`:'';
  rows.push({id:e.id,...s,title:e.title,before:isInteractive(e.task)?'New interactive family':e.task.kind+variant,after:policy.renderer+variant,source:[`${e.source.documentId}: ${e.source.filename} (${e.source.precision}; ${e.source.locator})`],practice:'mode' in e?('mode' in e&&e.mode==='exam'?'Distinct individual exam-style challenge; no preparation panel. Not a readiness-bearing timed mock.':'Focused authored task with preparation, immediate factual feedback, retry and same-topic next.'):'Focused fixed task; optional topic preparation; immediate authored feedback; retry/new unseen same-topic item.',exam:exam.length?'Exact version reused inside timed mixed blueprint; no preparation panel or feedback until submission. '+exam.map(i=>i.id).join(', '):'No fixed exam reuse; see separate topic exam rows or explicit gap.',validator:policy.validator+' / '+versionBinding(e),feedback:policy.feedback+'; authored explanation/rules; exact authored misconception only where available.',tests:(isInteractive(e.task)?'interactive-domain; interactive-ui; interactive-validation; ':'')+'exercise-architecture; practice-grading; practice-ui; '+(s.course==='CSE1400_CO'?'co-reference':s.course==='CSE1300_RL'?'rl-practice':'ip-practice')+'; enrichment',fallback:isInteractive(e.task)?'Bounded structured semantic checking; formula equivalence on care rows, not minimality. K-map source mapping is CO only.':e.task.kind==='enrichment-exact'?'Legacy wrong-arity saved draft retains raw text; no truncation. Correct-arity answers use ordered fields.':'Retain bounded authored format: a unique declared result is safely checkable; this does not grade the whole skill.'});
 }
 function activity(a:Activity,family:string,file:string){
  const tool=family==='workspace',code=family==='code task';
  rows.push({id:a.id,...scope(a.topicId,a.skillIds),title:a.title??a.name??a.id,before:family,after:family+(a.fields?' / labelled reasoning fields':''),source:sources(a.sourceIds),practice:tool?'Explore the existing bounded domain model.':code?'Write local Java notes; inspect requirements and authored reference.':'Work through source-grounded prompt and rubric; reveal/reference where available.',exam:a.mode==='exam'?'Dedicated unscored exam-style challenge with broad response fields and a separate authored rubric.':code?'Integrated 60-minute assignments also exposed in programming exam practice; session bank has separately authored integrated rubric tasks.':'Not automatically converted into an exam question; separate exam bank coverage below.',validator:'Unscored; '+(tool?'existing bounded tool semantics, not skill grading':code?'learner Java is never executed':'human/self rubric review'),feedback:tool?'Visible model state and explicit assumptions':code?'Requirements, rubric and authored Java reference':'Authored component criteria/reference; no inferred correctness',tests:code?'ip-assignment-references; ip-ui; Java verification':family==='workspace'?'co-models; rl-models; assembly-maintenance':file.includes('/enrichment/')?'enrichment; enrichment-ui; browser acceptance':`${file.includes('/co/')?'co':file.includes('/rl/')?'rl':'ip'}-content; browser acceptance`,fallback:a.assumptions??(code?'Open implementation admits multiple valid solutions; no regex or keyword score.':'Open reasoning/construction cannot be objectively established by the existing bounded graders. Rubric is intentional, not missing automated correctness.')});
 }
 for(const c of ['co','rl','ip']){
  for(const f of readdirSync(`src/${c}/topics`).filter(f=>f.endsWith('.json')).sort()){
   const file=`src/${c}/topics/${f}`;for(const a of read<{guided?:Activity[]}>(file).guided??[])activity(a,'guided response',file);
  }
  if(c!=='co')for(const a of read<Activity[]>(`src/${c}/intro-guided.json`))activity(a,'guided response',`src/${c}/intro-guided.json`);
  if(c!=='ip')for(const a of read<Activity[]>(`src/${c}/tools.json`))activity({...a,id:`${c}.workspace.${a.id}`},'workspace',`src/${c}/tools.json`);
 }
 for(const a of read<Activity[]>('src/expansion/completion-guided.json'))activity(a,'guided response','src/expansion/completion-guided.json');
 for(const a of read<Activity[]>('src/expansion/guided.json'))activity(a,'guided response','src/expansion/guided.json');
 for(const a of read<Activity[]>('src/enrichment/guided.json'))activity(a,'guided response','src/enrichment/guided.json');
 for(const f of readdirSync('src/ip/assignments').filter(f=>f.endsWith('.json')).sort())activity(read<Activity>(`src/ip/assignments/${f}`),'code task',`src/ip/assignments/${f}`);
 for(const bank of banks)for(const i of bank.items){
  if(!i.provenance.length)throw Error(`Missing exam source: ${i.id}`);
  const fixed=i.evaluation==='DETERMINISTIC';if(fixed&&!practiceFor(i))throw Error(`Missing exact exam binding: ${i.id}`);
  rows.push({id:i.id,...scope(i.topicId,i.skillIds,true),title:i.title,before:i.questionType,after:fixed?exerciseFormat(practiceFor(i)!.task.kind)!.renderer:'open rubric / '+i.responseType,source:i.provenance.map(p=>`${p.documentId}: ${p.filename}, pages ${p.pages.join(', ')} (${p.era}, ${p.role})`),practice:fixed?'Linked fixed exercise has optional preparation and immediate feedback.':'No claim of a one-to-one practice item; topic guided work prepares related mechanisms.',exam:`${i.difficulty}: ${i.difficultyReason} Timed mixed blueprint; response saved; review after submission.`,validator:fixed?i.evaluator.id+' / '+i.evaluator.version:'RUBRIC_REVIEW_REQUIRED; no automatic points or atomic evidence',feedback:fixed?'Original bound exercise feedback after submission':'Authored component rubric; self-review, no correctness claim',tests:'exam-validation; exam-engine; exam-ui; exercise-architecture',fallback:fixed?'Fixed authored reuse is deliberate, not novel generation; cognitive demand comes from the mixed session and removed preparation. Difficulty labels are authored, not calibrated.':'Multiple valid proof/design/code solutions require review. Interactive symbolic construction remains deferred.'});
 }
 const ids=new Set<string>();for(const r of rows){if(ids.has(r.id))throw Error(`Duplicate area ${r.id}`);ids.add(r.id);}
 rows.sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);
 const declared=['co','rl','ip'].flatMap(c=>read<{skillId:string;reason:string}[]>(`src/${c}/coverage.json`));
 const skills=study.topics.flatMap(t=>t.subtopics.flatMap(st=>st.skills.map(sk=>({course:t.subjectId,topic:t.id,topicName:t.name,subtopic:st.id,skill:sk.id,name:sk.name,areas:rows.filter(r=>r.skills.includes(sk.id)).map(r=>r.id),limitation:declared.find(d=>d.skillId===sk.id)?.reason??'No dedicated authored activity; retain source-grounded learning/review. No correctness coverage claimed.'}))));
 return {schema:1,counts:{topics:study.topics.length,skills:skills.length,areas:rows.length,objective:exercises.length},rows,skills};
}
export function coverageMarkdown(report:ReturnType<typeof buildExerciseCoverage>){
 const esc=(s:string)=>s.replaceAll('|',' / ').replaceAll('\n',' ');
 return '# Exercise coverage matrix — Patches 5–7\n\nGenerated from canonical content; run `node --import tsx scripts/exercise-coverage.ts --check` to reject stale coverage. No learner data. All IDs here are internal audit references. No new question content.\n\n'+JSON.stringify(report.counts)+'\n\n## Every supported exercise area\n\n| Area / scope | Before → retained/new | Sources / style | Practice / Exam-style | Validation / feedback | Tests / fallback justification |\n|---|---|---|---|---|---|\n'+report.rows.map(r=>'| '+[`${r.id}: ${r.title}; ${r.course}; ${r.topic}; ${r.subtopics.join(', ')}; ${r.skills.join(', ')}`,`${r.before} → ${r.after}`,r.source.join('; '),`Practice: ${r.practice} Exam: ${r.exam}`,`${r.validator}; ${r.feedback}`,`${r.tests}; ${r.fallback}`].map(esc).join(' | ')+' |').join('\n')+'\n\n## Every canonical skill, including limited coverage\n\n| Course / topic / subtopic / skill | Supported areas | Honest limitation |\n|---|---|---|\n'+report.skills.map(s=>'| '+[`${s.course}; ${s.topicName} (${s.topic}); ${s.subtopic}; ${s.name} (${s.skill})`,s.areas.join(', ')||'Learning/review only',s.limitation].map(esc).join(' | ')+' |').join('\n')+'\n';
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const report=buildExerciseCoverage();
 const output=coverageMarkdown(report),path='docs/maintenance-patch-5-coverage.md';
 if(process.argv.includes('--check')){if(readFileSync(path,'utf8')!==output)throw Error('Exercise coverage matrix is stale');}else writeFileSync(path,output);
 console.log('Exercise coverage PASS',report.counts);
}
