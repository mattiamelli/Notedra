import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import definitions from '../src/interactive/practice.json';
import fingerprints from '../src/interactive/practice-lock.json';
import capabilities from '../src/interactive/capabilities.json';
import grader from '../src/interactive/grader-lock.json';
import study from '../src/generated/topic-study.json';
import {validateTask} from '../src/interactive/domain';
import {gradeInteractive} from '../src/interactive/grading';
import type {InteractiveExercise} from '../src/interactive/types';
const sha=(s:string|Buffer)=>createHash('sha256').update(s).digest('hex');
export function validateInteractiveContent(){
 const ids=new Set<string>();
 for(const e of definitions as InteractiveExercise[]){
  if(ids.has(e.id)||!e.id.startsWith('ds.practice.interactive-'))throw Error('Duplicate or invalid interactive ID');ids.add(e.id);
  validateTask(e.task);
  const t=study.topics.find(t=>t.id===e.topicId&&t.subjectId===e.subjectId),st=t?.subtopics.find(st=>st.id===e.subtopicId),skill=st?.skills.find(s=>s.id===e.skillId);
  if(!skill||!skill.sources.some(id=>{const s=study.sources.find(s=>s.id===id)!;return s.documentId===e.source.documentId&&s.filename===e.source.filename&&s.locator===e.source.locator;}))throw Error('Lost canonical lecture/skill scope');
  if(!['practice','exam'].includes(e.mode)||!e.prompt||!e.rules||!e.explanation||e.authorship!=='AUTHORED_PRACTICE')throw Error('Missing pedagogical metadata');
  const result=gradeInteractive(e,e.reference);if(result.status!=='GRADED'||!result.correct)throw Error('Incorrect reference: '+e.id);
  if((fingerprints as Record<string,string>)[e.id+'@'+e.version]!==sha(JSON.stringify(e)))throw Error('Interactive exercise binding changed');
 }
 if(grader.sha256!==sha(Buffer.concat(grader.files.map(f=>readFileSync(f)))))throw Error('Structured semantic grader binding changed');
 if(JSON.stringify(capabilities)!==JSON.stringify([...new Set(definitions.map(e=>e.topicId))].sort().map(topicId=>({topicId,count:definitions.filter(e=>e.topicId===topicId).length}))))throw Error('Stale interactive capabilities');
 return {exercises:ids.size,oldBindings:'unchanged',minimality:'not claimed'};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log('Interactive content PASS',validateInteractiveContent());
