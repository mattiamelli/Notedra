import {readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import type {Plugin} from 'vite';
import {canonical, validateGraderSource} from './practice-catalog';
import {trustedTopicStudySource, checkTopicStudy} from './topic-projection';
import type {AuthoredScope, StudyProjection} from '../src/topic-study/types';
import type {RLCapability, RLTopicContent, SkillCoverage, GuidedActivity} from '../src/rl/types';
import type {RLExercise} from '../src/rl/practice-types';
import {checkRLSourcePolicy, type RLSourcePolicy} from './rl-source-policy';
import {gradeRLResponse} from '../src/rl/grading';
import pilots from '../src/topic-study/lessons.json';
import pilotCards from '../src/topic-study/flashcards.json';
import oldExercises from '../src/practice/catalog.json';
export interface RLTool {id:string; version:string; name:string; topicId:string; skillIds:string[]; sourceIds:string[]; summary:string; assumptions:string;}
export interface RLData {topics:RLTopicContent[]; exercises:RLExercise[]; coverage:SkillCoverage[]; tools:RLTool[]; introGuided:GuidedActivity[]; policy:RLSourcePolicy;}
const need=(yes:unknown,message:string)=>{if(!yes)throw new Error('RL content: '+message);};
const scopeKeys=['id','version','topicId','skillIds','subtopicIds','sourceIds'];
function shape(value:unknown,required:string[],optional:string[]=[]):asserts value is Record<string,unknown>{need(value&&typeof value==='object'&&!Array.isArray(value),'object required');need(required.every(k=>Object.hasOwn(value as object,k))&&Object.keys(value as object).every(k=>[...required,...optional].includes(k)),'unexpected/missing fields');}
function text(value:unknown,max=5000){need(typeof value==='string'&&value.trim().length>0&&value.length<=max,'text bounds');}
function list(value:unknown,min=1,max=60):asserts value is string[]{need(Array.isArray(value)&&value.length>=min&&value.length<=max,'list bounds');(value as unknown[]).forEach(v=>text(v,200));need(new Set(value as string[]).size===(value as string[]).length,'duplicate list value');}
export const digest=(value:unknown)=>createHash('sha256').update(canonical(value)).digest('hex');
export const readRL=<T,>(file:string):T=>JSON.parse(readFileSync(new URL('../src/rl/'+file,import.meta.url),'utf8')) as T;
export function loadRL():RLData{return {topics:readdirSync(new URL('../src/rl/topics/',import.meta.url)).filter(n=>n.endsWith('.json')).sort().map(n=>readRL<RLTopicContent>('topics/'+n)),exercises:readRL('practice.json'),coverage:readRL('coverage.json'),tools:readRL('tools.json'),introGuided:readRL('intro-guided.json'),policy:readRL('source-policy.json')};}
export function rlRecords(data:RLData){return [...data.topics.flatMap(b=>[b.lesson,...b.lesson.blocks,...b.cards,...b.guided]),...data.introGuided,...data.exercises,{id:'ds.rl.source-policy',...data.policy},...data.tools.map(t=>({...t,id:'ds.tool.rl.'+t.id})),...data.coverage.map(s=>({...s,id:'ds.coverage.'+s.skillId,version:'1'}))];}
export function rlCapabilities(data:RLData,projection:StudyProjection):RLCapability[]{return projection.topics.filter(t=>t.subjectId==='CSE1300_RL').map(t=>{const bundle=data.topics.find(b=>b.lesson.topicId===t.id);const tool=data.tools.find(x=>x.topicId===t.id);return {topicId:t.id,lessonId:(bundle?.lesson??pilots.find(l=>l.topicId===t.id))!.id,cardCount:bundle?.cards.length??pilotCards.filter(c=>c.topicId===t.id).length,exerciseCount:[...data.exercises,...oldExercises].filter(e=>e.topicId===t.id).length,guidedCount:bundle?.guided.length??data.introGuided.length,toolId:tool?.id??null,toolName:tool?.name??null};});}
export function validateRL(data:RLData,projection:StudyProjection){
 const topics=projection.topics.filter(t=>t.subjectId==='CSE1300_RL');const skills=topics.flatMap(t=>t.subtopics.flatMap(s=>s.skills));
 need(topics.length===9&&topics.flatMap(t=>t.subtopics).length===29&&skills.length===45,'canonical counts');
 const records:AuthoredScope[]=[];
 const identity=(item:{id:string;version:string},prefix:string)=>{text(item.id,120);need(item.id.startsWith(prefix)&&/^[1-9]\d{0,7}$/.test(item.version),'identity/version');};
 function scope(item:AuthoredScope,prefix:string){identity(item,prefix);const topic=topics.find(t=>t.id===item.topicId);need(topic,'RL ownership');list(item.skillIds);list(item.subtopicIds);list(item.sourceIds);
  const selected=topic!.subtopics.flatMap(s=>s.skills).filter(s=>item.skillIds.includes(s.id));need(selected.length===item.skillIds.length,'skill ownership');
  const subs=topic!.subtopics.filter(s=>s.skills.some(k=>item.skillIds.includes(k.id))).map(s=>s.id);need(canonical([...subs].sort())===canonical([...item.subtopicIds].sort()),'subtopic ownership');
  need(selected.every(s=>s.sources.some(id=>item.sourceIds.includes(id)))&&item.sourceIds.every(id=>selected.some(s=>s.sources.includes(id))),'source ownership');
  need(item.sourceIds.every(id=>projection.sources.some(s=>s.id===id&&s.confidence==='HIGH'&&s.precision==='DOCUMENT_RANGE'&&s.kind==='PDF_PAGE_RANGE'&&s.documentId.startsWith('RL_LEC_')&&s.documentId!=='RL_LEC_08')),'source precision/policy');records.push(item);
 }
 need(Array.isArray(data.topics)&&data.topics.length===8,'8 new topics');
 for(const bundle of data.topics){shape(bundle,['lesson','cards','guided']);const l=bundle.lesson;shape(l,['id','version','topicId','blocks']);identity(l,'ds.lesson.rl.');need(l.topicId!=='RL_T01_PROP_LOGIC','published T01 preserved');
  need(Array.isArray(l.blocks)&&l.blocks.length>=5&&l.blocks.length<=20,'lesson bounds');
  for(const b of l.blocks){shape(b,[...scopeKeys,'kind','title','paragraphs'],['table']);scope(b,'ds.block.rl.');need(b.topicId===l.topicId,'lesson block ownership');text(b.title,200);need(['introduction','concept','procedure','worked_example','important_rule','common_pitfall','recap'].includes(b.kind),'block kind');need(Array.isArray(b.paragraphs)&&b.paragraphs.length>0&&b.paragraphs.length<=6,'paragraphs');b.paragraphs.forEach(p=>text(p));if(b.table){shape(b.table,['headers','rows']);list(b.table.headers,1,10);need(Array.isArray(b.table.rows)&&b.table.rows.length<=20,'table bounds');for(const row of b.table.rows){need(Array.isArray(row)&&row.length===b.table.headers.length,'table shape');row.forEach(v=>text(v,500));}}}
  need(l.blocks[0].kind==='introduction'&&l.blocks.at(-1)!.kind==='recap','lesson structure');
  const owned=topics.find(t=>t.id===l.topicId)!.subtopics.flatMap(s=>s.skills);need(owned.every(s=>l.blocks.some(b=>b.skillIds.includes(s.id)&&!['introduction','recap'].includes(b.kind))),'deliberate learning coverage');
  need(Array.isArray(bundle.cards)&&bundle.cards.length>0,'cards required');for(const c of bundle.cards){shape(c,[...scopeKeys,'prompt','answer']);scope(c,'ds.card.rl.');need(c.topicId===l.topicId,'card topic');text(c.prompt,600);text(c.answer,1600);}
  need(owned.every(s=>bundle.cards.some(c=>c.skillIds.includes(s.id))),'flashcard coverage');
  validateGuides(bundle.guided,l.topicId);
 }
 need(new Set(data.topics.map(t=>t.lesson.topicId)).size===8,'duplicate topic');
 function validateGuides(guides:GuidedActivity[],topicId:string){need(Array.isArray(guides)&&guides.length>0,'guided list');for(const g of guides){shape(g,[...scopeKeys,'title','prompt','fields','rubric','reference']);scope(g,'ds.guided.rl.');need(g.topicId===topicId,'guided topic');text(g.title,200);text(g.prompt);need(Array.isArray(g.fields)&&g.fields.length>0&&g.fields.length<=6,'guided fields');for(const f of g.fields){shape(f,['id','label'],['placeholder']);text(f.id,60);need(/^[a-z][a-z0-9-]*$/.test(f.id),'field identity');text(f.label,250);if(f.placeholder)text(f.placeholder,1000);}need(new Set(g.fields.map(f=>f.id)).size===g.fields.length,'duplicate guided field');for(const lines of [g.rubric,g.reference]){need(Array.isArray(lines)&&lines.length>0&&lines.length<=12,'rubric/reference');lines.forEach(v=>text(v,2200));}}}
 validateGuides(data.introGuided,'RL_T01_PROP_LOGIC');
 need(Array.isArray(data.exercises)&&data.exercises.length>0,'practice required');
 for(const e of data.exercises){shape(e,['id','version','title','prompt','rules','subjectId','topicId','subtopicId','skillId','authorship','source','grader','task','reference','explanation']);identity(e,'ds.practice.rl-');need(e.subjectId==='CSE1300_RL'&&e.authorship==='AUTHORED_PRACTICE','practice subject/authorship');['title','prompt','rules','explanation'].forEach(k=>text(e[k as 'title']));const topic=topics.find(t=>t.id===e.topicId);const sub=topic?.subtopics.find(s=>s.id===e.subtopicId);const skill=sub?.skills.find(s=>s.id===e.skillId);need(skill,'practice skill ownership');
  shape(e.source,['kind','documentId','filename','locator','precision']);need(e.source.kind==='LECTURE'&&e.source.precision==='DOCUMENT_RANGE','lecture association required; puzzle mapping authorization is separately verified');need(skill!.sources.some(id=>{const s=projection.sources.find(s=>s.id===id)!;return s.kind==='PDF_PAGE_RANGE'&&s.documentId.startsWith('RL_LEC_')&&s.documentId!=='RL_LEC_08'&&s.confidence==='HIGH'&&s.precision===e.source.precision&&s.documentId===e.source.documentId&&s.filename===e.source.filename&&s.locator===e.source.locator;}),'practice source ownership/precision');
  shape(e.task,['kind','format','width']);shape(e.grader,['id','version']);shape(e.reference,['kind','value']);need(e.task.kind==='rl-exact'&&e.grader.id==='rl-exact'&&e.grader.version==='1','exact grader binding');need(gradeRLResponse(e,e.reference).status==='GRADED','reference format');
 }
 const toolTopics:Record<string,string>={proposition:'RL_T01_PROP_LOGIC','finite-model':'RL_T02_FOL',proof:'RL_T03_PROOF_METHODS',induction:'RL_T04_INDUCTION_RECURSION','tree-graph':'RL_T05_TREES_GRAPHS',sets:'RL_T06_SET_THEORY','functions-relations':'RL_T07_FUNCTIONS_RELATIONS'};
 need(Array.isArray(data.tools)&&data.tools.length===7,'tool inventory');for(const tool of data.tools){shape(tool,['id','version','name','topicId','skillIds','sourceIds','summary','assumptions']);need(['proposition','finite-model','proof','induction','tree-graph','sets','functions-relations'].includes(tool.id),'registered tool');need(toolTopics[tool.id]===tool.topicId,'tool route ownership');text(tool.name,150);text(tool.summary);text(tool.assumptions);const topic=topics.find(t=>t.id===tool.topicId)!;scope({...tool,id:'ds.tool.rl.'+tool.id,subtopicIds:topic?.subtopics.filter(s=>s.skills.some(k=>tool.skillIds.includes(k.id))).map(s=>s.id)},'ds.tool.rl.');}
 need(new Set(data.tools.map(t=>t.id)).size===7&&new Set(data.tools.map(t=>t.topicId)).size===7,'unique tools');
 need(Array.isArray(data.coverage)&&data.coverage.length===45&&new Set(data.coverage.map(s=>s.skillId)).size===45,'45 skill classifications');
 const guides=[...data.introGuided,...data.topics.flatMap(t=>t.guided)];const exercises=[...oldExercises,...data.exercises];
 for(const c of data.coverage){shape(c,['skillId','category','reason','exerciseIds','guidedIds','toolId']);need(skills.some(s=>s.id===c.skillId)&&['A','B','C','D','E'].includes(c.category),'classification');text(c.reason);list(c.exerciseIds,0);list(c.guidedIds,0);need(c.exerciseIds.every(id=>exercises.some(e=>e.id===id&&e.skillId===c.skillId)),'exercise classification link');need(c.guidedIds.every(id=>guides.some(g=>g.id===id&&g.skillIds.includes(c.skillId))),'guided classification link');need(c.toolId===null||data.tools.some(t=>t.id===c.toolId&&t.skillIds.includes(c.skillId)),'tool classification link');need(c.category!=='A'||c.exerciseIds.length>0,'A requires exact exercise');need(!['B','C'].includes(c.category)||c.guidedIds.length>0,'open work requires unscored rubric');need(c.category!=='D'||c.toolId!==null,'specialized tool required');}
 checkRLSourcePolicy(data.policy,data.exercises,guides);
 const ids=[...data.topics.map(t=>t.lesson.id),...records.map(r=>r.id),...data.exercises.map(e=>e.id)];need(new Set(ids).size===ids.length,'unique authored IDs');
}
export function checkRLLocks(data:RLData,locks:Record<string,string>){const all=rlRecords(data);need(Object.keys(locks).length===all.length,'lock inventory');for(const item of all)need(locks[`${item.id}@${item.version}`]===digest(item),'published version changed: '+item.id);}
export function validateRLFiles(){const source=trustedTopicStudySource();checkTopicStudy(source);const projection=JSON.parse(source) as StudyProjection;const data=loadRL();validateRL(data,projection);checkRLLocks(data,readRL('content-lock.json'));need(canonical(Object.fromEntries(data.exercises.map(e=>[`${e.id}@${e.version}`,digest(e)])))===canonical(readRL('practice-lock.json')),'practice binding locks');validateGraderSource(readFileSync(new URL('../src/rl/grading.ts',import.meta.url),'utf8'),readRL('grader-lock.json'));need(canonical(rlCapabilities(data,projection))===canonical(readRL('capabilities.json')),'stale capability index');return data;}
export function generateRLCapabilities(){const data=loadRL();const projection=JSON.parse(trustedTopicStudySource()) as StudyProjection;validateRL(data,projection);writeFileSync(new URL('../src/rl/capabilities.json',import.meta.url),JSON.stringify(rlCapabilities(data,projection),null,2)+'\n');}
export const rlBuildGuard=(validate=validateRLFiles):Plugin=>({name:'delftstudy-rl-course',apply:'build',buildStart(){validate();}});
