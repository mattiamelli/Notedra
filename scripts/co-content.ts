import {readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import type {Plugin} from 'vite';
import {canonical, validateGraderSource} from './practice-catalog';
import {trustedTopicStudySource, checkTopicStudy} from './topic-projection';
import type {AuthoredScope, StudyProjection} from '../src/topic-study/types';
import type {COCapability, COExercise, COTopicContent, SkillCoverage} from '../src/co/types';
import {gradeCOResponse} from '../src/co/grading';
import pilots from '../src/topic-study/lessons.json';
import pilotCards from '../src/topic-study/flashcards.json';
import oldExercises from '../src/practice/catalog.json';
export interface COTool {id:string; version:string; name:string; topicId:string; skillIds:string[]; sourceIds:string[]; summary:string; assumptions:string;}
export interface COData {topics:COTopicContent[]; exercises:COExercise[]; coverage:SkillCoverage[]; tools:COTool[];}
const need=(yes:unknown,message:string)=>{if(!yes)throw new Error('CO content: '+message);};
const scopeKeys=['id','version','topicId','skillIds','subtopicIds','sourceIds'];
function shape(value:unknown,required:string[],optional:string[]=[]):asserts value is Record<string,unknown>{need(value&&typeof value==='object'&&!Array.isArray(value),'object required');need(required.every(k=>Object.hasOwn(value as object,k))&&Object.keys(value as object).every(k=>[...required,...optional].includes(k)),'unexpected/missing fields');}
function text(value:unknown,max=5000){need(typeof value==='string'&&value.trim().length>0&&value.length<=max,'text bounds');}
function list(value:unknown,min=1,max=60):asserts value is string[]{need(Array.isArray(value)&&value.length>=min&&value.length<=max,'list bounds');(value as unknown[]).forEach(v=>text(v,200));need(new Set(value as string[]).size===(value as string[]).length,'duplicate list value');}
export const digest=(value:unknown)=>createHash('sha256').update(canonical(value)).digest('hex');
export const readCO=<T,>(file:string):T=>JSON.parse(readFileSync(new URL('../src/co/'+file,import.meta.url),'utf8')) as T;
export function loadCO():COData{return {topics:readdirSync(new URL('../src/co/topics/',import.meta.url)).filter(n=>n.endsWith('.json')).sort().map(n=>readCO<COTopicContent>('topics/'+n)),exercises:readCO('practice.json'),coverage:readCO('coverage.json'),tools:readCO('tools.json')};}
export function coRecords(data:COData){return [...data.topics.flatMap(b=>[b.lesson,...b.lesson.blocks,...b.cards,...b.guided]),...data.exercises,...data.tools.map(t=>({...t,id:'ds.tool.co.'+t.id})),...data.coverage.map(s=>({...s,id:'ds.coverage.'+s.skillId,version:'1'}))];}
export function coCapabilities(data:COData,projection:StudyProjection):COCapability[]{return projection.topics.filter(t=>t.subjectId==='CSE1400_CO').map(t=>{const bundle=data.topics.find(b=>b.lesson.topicId===t.id);const tool=data.tools.find(x=>x.topicId===t.id);return {topicId:t.id,lessonId:(bundle?.lesson??pilots.find(l=>l.topicId===t.id))!.id,cardCount:bundle?.cards.length??pilotCards.filter(c=>c.topicId===t.id).length,exerciseCount:[...data.exercises,...oldExercises].filter(e=>e.topicId===t.id).length,guidedCount:bundle?.guided.length??0,toolId:tool?.id??null,toolName:tool?.name??null};});}
export function validateCO(data:COData,projection:StudyProjection){
 const topics=projection.topics.filter(t=>t.subjectId==='CSE1400_CO');const skills=topics.flatMap(t=>t.subtopics.flatMap(s=>s.skills));
 need(topics.length===14&&topics.flatMap(t=>t.subtopics).length===32&&skills.length===46,'canonical counts');
 const records:AuthoredScope[]=[];
 const identity=(item:{id:string;version:string},prefix:string)=>{text(item.id,120);need(item.id.startsWith(prefix)&&/^[1-9]\d{0,7}$/.test(item.version),'identity/version');};
 function scope(item:AuthoredScope,prefix:string){identity(item,prefix);const topic=topics.find(t=>t.id===item.topicId);need(topic,'CO ownership');list(item.skillIds);list(item.subtopicIds);list(item.sourceIds);
  const selected=topic!.subtopics.flatMap(s=>s.skills).filter(s=>item.skillIds.includes(s.id));need(selected.length===item.skillIds.length,'skill ownership');
  const subs=topic!.subtopics.filter(s=>s.skills.some(k=>item.skillIds.includes(k.id))).map(s=>s.id);need(canonical([...subs].sort())===canonical([...item.subtopicIds].sort()),'subtopic ownership');
  need(selected.every(s=>s.sources.some(id=>item.sourceIds.includes(id)))&&item.sourceIds.every(id=>selected.some(s=>s.sources.includes(id))),'source ownership');
  need(item.sourceIds.every(id=>projection.sources.some(s=>s.id===id&&s.confidence==='HIGH'&&s.precision==='DOCUMENT_RANGE'&&s.kind==='PDF_PAGE_RANGE'&&s.documentId.startsWith('CO_LEC_'))),'source precision/policy');records.push(item);
 }
 need(Array.isArray(data.topics)&&data.topics.length===13,'13 new topics');
 for(const bundle of data.topics){shape(bundle,['lesson','cards','guided']);const l=bundle.lesson;shape(l,['id','version','topicId','blocks']);identity(l,'ds.lesson.co.');need(l.topicId!=='CO_T04_DATA_REP_RADIX_INTEGER','published T04 preserved');
  need(Array.isArray(l.blocks)&&l.blocks.length>=5&&l.blocks.length<=16,'lesson bounds');
  for(const b of l.blocks){shape(b,[...scopeKeys,'kind','title','paragraphs'],['table']);scope(b,'ds.block.co.');need(b.topicId===l.topicId,'lesson block ownership');text(b.title,200);need(['introduction','concept','procedure','worked_example','important_rule','common_pitfall','recap'].includes(b.kind),'block kind');need(Array.isArray(b.paragraphs)&&b.paragraphs.length>0&&b.paragraphs.length<=6,'paragraphs');b.paragraphs.forEach(p=>text(p));if(b.table){shape(b.table,['headers','rows']);list(b.table.headers,1,10);need(Array.isArray(b.table.rows)&&b.table.rows.length<=20,'table bounds');for(const row of b.table.rows){need(Array.isArray(row)&&row.length===b.table.headers.length,'table shape');row.forEach(v=>text(v,500));}}}
  need(l.blocks[0].kind==='introduction'&&l.blocks.at(-1)!.kind==='recap','lesson structure');
  const owned=topics.find(t=>t.id===l.topicId)!.subtopics.flatMap(s=>s.skills);need(owned.every(s=>l.blocks.some(b=>b.skillIds.includes(s.id)&&!['introduction','recap'].includes(b.kind))),'deliberate learning coverage');
  need(Array.isArray(bundle.cards)&&bundle.cards.length>0,'cards required');for(const c of bundle.cards){shape(c,[...scopeKeys,'prompt','answer']);scope(c,'ds.card.co.');need(c.topicId===l.topicId,'card topic');text(c.prompt,600);text(c.answer,1600);}
  need(owned.every(s=>bundle.cards.some(c=>c.skillIds.includes(s.id))),'flashcard coverage');
  need(Array.isArray(bundle.guided),'guided list');for(const g of bundle.guided){shape(g,[...scopeKeys,'title','prompt','rubric']);scope(g,'ds.guided.co.');need(g.topicId===l.topicId,'guided topic');text(g.title,200);text(g.prompt);need(Array.isArray(g.rubric)&&g.rubric.length>0&&g.rubric.length<=10,'rubric');g.rubric.forEach(v=>text(v,1500));}
 }
 need(new Set(data.topics.map(t=>t.lesson.topicId)).size===13,'duplicate topic');
 need(Array.isArray(data.exercises)&&data.exercises.length>0,'practice required');
 for(const e of data.exercises){shape(e,['id','version','title','prompt','rules','subjectId','topicId','subtopicId','skillId','authorship','source','grader','task','reference','explanation']);identity(e,'ds.practice.co-');need(e.subjectId==='CSE1400_CO'&&e.authorship==='AUTHORED_PRACTICE','practice subject/authorship');['title','prompt','rules','explanation'].forEach(k=>text(e[k as 'title']));const topic=topics.find(t=>t.id===e.topicId);const sub=topic?.subtopics.find(s=>s.id===e.subtopicId);const skill=sub?.skills.find(s=>s.id===e.skillId);need(skill,'practice skill ownership');
  shape(e.source,['kind','documentId','filename','locator','precision']);need(e.source.kind==='LECTURE'&&e.source.precision==='DOCUMENT_RANGE','only grounded lecture-authored items; assessment mappings cannot authorize these items');need(skill!.sources.some(id=>{const s=projection.sources.find(s=>s.id===id)!;return s.kind==='PDF_PAGE_RANGE'&&s.documentId.startsWith('CO_LEC_')&&s.confidence==='HIGH'&&s.precision===e.source.precision&&s.documentId===e.source.documentId&&s.filename===e.source.filename&&s.locator===e.source.locator;}),'practice source ownership/precision');
  shape(e.task,['kind','format','width']);shape(e.grader,['id','version']);shape(e.reference,['kind','value']);need(e.task.kind==='co-exact'&&e.grader.id==='co-exact'&&e.grader.version==='1','exact grader binding');need(gradeCOResponse(e,e.reference).status==='GRADED','reference format');
 }
 need(Array.isArray(data.tools)&&data.tools.length===10,'tool inventory');for(const tool of data.tools){shape(tool,['id','version','name','topicId','skillIds','sourceIds','summary','assumptions']);need(['boolean','representation','assembly','isa','address','memory','cache','pipeline','amdahl','vm'].includes(tool.id),'registered tool');text(tool.name,150);text(tool.summary);text(tool.assumptions);const topic=topics.find(t=>t.id===tool.topicId)!;scope({...tool,id:'ds.tool.co.'+tool.id,subtopicIds:topic?.subtopics.filter(s=>s.skills.some(k=>tool.skillIds.includes(k.id))).map(s=>s.id)},'ds.tool.co.');}
 need(new Set(data.tools.map(t=>t.id)).size===10&&new Set(data.tools.map(t=>t.topicId)).size===10,'unique tools');
 need(Array.isArray(data.coverage)&&data.coverage.length===46&&new Set(data.coverage.map(s=>s.skillId)).size===46,'46 skill classifications');
 const guides=data.topics.flatMap(t=>t.guided);const exercises=[...oldExercises,...data.exercises];
 for(const c of data.coverage){shape(c,['skillId','category','reason','exerciseIds','guidedIds','toolId']);need(skills.some(s=>s.id===c.skillId)&&['A','B','C','D','E'].includes(c.category),'classification');text(c.reason);list(c.exerciseIds,0);list(c.guidedIds,0);need(c.exerciseIds.every(id=>exercises.some(e=>e.id===id&&e.skillId===c.skillId)),'exercise classification link');need(c.guidedIds.every(id=>guides.some(g=>g.id===id&&g.skillIds.includes(c.skillId))),'guided classification link');need(c.toolId===null||data.tools.some(t=>t.id===c.toolId&&t.skillIds.includes(c.skillId)),'tool classification link');need(c.category!=='A'||c.exerciseIds.length>0,'A requires exact exercise');need(!['B','C'].includes(c.category)||c.guidedIds.length>0,'open work requires unscored rubric');need(c.category!=='D'||c.toolId==='assembly','existing specialized tool');}
 const ids=[...data.topics.map(t=>t.lesson.id),...records.map(r=>r.id),...data.exercises.map(e=>e.id)];need(new Set(ids).size===ids.length,'unique authored IDs');
}
export function checkCOLocks(data:COData,locks:Record<string,string>){const all=coRecords(data);need(Object.keys(locks).length===all.length,'lock inventory');for(const item of all)need(locks[`${item.id}@${item.version}`]===digest(item),'published version changed: '+item.id);}
export function validateCOFiles(){const source=trustedTopicStudySource();checkTopicStudy(source);const projection=JSON.parse(source) as StudyProjection;const data=loadCO();validateCO(data,projection);checkCOLocks(data,readCO('content-lock.json'));need(canonical(Object.fromEntries(data.exercises.map(e=>[`${e.id}@${e.version}`,digest(e)])))===canonical(readCO('practice-lock.json')),'practice binding locks');validateGraderSource(readFileSync(new URL('../src/co/grading.ts',import.meta.url),'utf8'),readCO('grader-lock.json'));need(canonical(coCapabilities(data,projection))===canonical(readCO('capabilities.json')),'stale capability index');return data;}
export function generateCOCapabilities(){const data=loadCO();const projection=JSON.parse(trustedTopicStudySource()) as StudyProjection;validateCO(data,projection);writeFileSync(new URL('../src/co/capabilities.json',import.meta.url),JSON.stringify(coCapabilities(data,projection),null,2)+'\n');}
export const coBuildGuard=(validate=validateCOFiles):Plugin=>({name:'delftstudy-co-course',apply:'build',buildStart(){validate();}});
