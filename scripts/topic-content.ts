import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import type { Plugin } from 'vite';
import { canonical } from './practice-catalog.ts';
import { checkTopicStudy, trustedTopicStudySource } from './topic-projection.ts';
import type { AuthoredScope, Flashcard, Lesson, StudyProjection } from '../src/topic-study/types.ts';
export const PILOTS=['CO_T04_DATA_REP_RADIX_INTEGER','RL_T01_PROP_LOGIC','IP_T02_CONTROL_FLOW'];
const kinds=['introduction','concept','procedure','worked_example','important_rule','common_pitfall','code_example','recap'];
const need=(yes:unknown,message:string)=>{if(!yes)throw new Error('Topic content: '+message);};
function obj(value:unknown,required:string[],optional:string[]=[]):Record<string,unknown>{
  need(value&&typeof value==='object'&&!Array.isArray(value),'expected object');const row=value as Record<string,unknown>;
  need(required.every(k=>Object.hasOwn(row,k))&&Object.keys(row).every(k=>[...required,...optional].includes(k)),'missing or unsupported fields');return row;
}
function text(value:unknown,max=4000):asserts value is string {need(typeof value==='string'&&value.length>0&&value.length<=max,'invalid text/bounds');}
function strings(value:unknown){need(Array.isArray(value)&&value.length>0&&value.length<=20,'invalid list');(value as unknown[]).forEach(v=>text(v,200));need(new Set(value as string[]).size===(value as string[]).length,'duplicate list entries');}
const scopeKeys=['id','version','topicId','skillIds','subtopicIds','sourceIds'];
export function validateTopicContent(lessons:unknown,cards:unknown,projection:StudyProjection): asserts lessons is Lesson[] {
  const records:AuthoredScope[]=[];
  function scope(row:Record<string,unknown>,namespace:string){
    text(row.id,120);text(row.version,8);need((row.id as string).startsWith(`ds.${namespace}.`)&&/^\d+$/.test(row.version as string),'invalid authored identity/version');
    const topic=projection.topics.find(t=>t.id===row.topicId);need(topic&&PILOTS.includes(topic.id),'not a pilot topic');
    for(const k of ['skillIds','subtopicIds','sourceIds'])strings(row[k]);
    const typed=row as unknown as AuthoredScope;const all=topic!.subtopics.flatMap(s=>s.skills);const selected=all.filter(s=>typed.skillIds.includes(s.id));
    need(selected.length===typed.skillIds.length,'skill ownership');
    const expected=topic!.subtopics.filter(s=>s.skills.some(k=>typed.skillIds.includes(k.id))).map(s=>s.id);
    need(expected.length===typed.subtopicIds.length&&expected.every(id=>typed.subtopicIds.includes(id)),'subtopic ownership');
    need(selected.every(s=>s.sources.some(ref=>typed.sourceIds.includes(ref)))&&typed.sourceIds.every(id=>selected.some(s=>s.sources.includes(id))),'source/skill association');
    need(typed.sourceIds.every(id=>projection.sources.some(s=>s.id===id&&s.confidence==='HIGH'&&s.precision==='DOCUMENT_RANGE')),'source precision/confidence unavailable for authored pilots');records.push(typed);
  }
  need(Array.isArray(lessons)&&lessons.length===3,'exactly three lessons');
  for(const item of lessons as unknown[]){
    const row=obj(item,['id','version','topicId','blocks']);text(row.id,120);text(row.version,8);need((row.id as string).startsWith('ds.lesson.')&&/^\d+$/.test(row.version as string),'invalid lesson identity');
    need(Array.isArray(row.blocks)&&row.blocks.length>=5&&row.blocks.length<=16,'bounded complete lesson');
    for(const item of row.blocks as unknown[]){const b=obj(item,[...scopeKeys,'kind','title','paragraphs'],['code','table']);scope(b,'block');need(b.topicId===row.topicId,'lesson ownership');need(kinds.includes(b.kind as string),'unsafe block kind');text(b.title,200);need(Array.isArray(b.paragraphs)&&b.paragraphs.length>0&&b.paragraphs.length<=6,'paragraph bounds');(b.paragraphs as unknown[]).forEach(p=>text(p));
      if(b.code!==undefined){text(b.code,2000);need(['code_example','worked_example'].includes(b.kind as string)&&b.topicId==='IP_T02_CONTROL_FLOW','only fixed Java examples');}
      if(b.table!==undefined){const table=obj(b.table,['headers','rows']);strings(table.headers);need(Array.isArray(table.rows)&&table.rows.length<=10,'table bounds');for(const r of table.rows as unknown[]){need(Array.isArray(r)&&r.length===(table.headers as string[]).length,'table shape');(r as unknown[]).forEach(v=>text(v,200));}}
    }
    const typed=item as Lesson;need(typed.blocks[0].kind==='introduction'&&typed.blocks.at(-1)?.kind==='recap'&&typed.blocks.some(b=>b.kind==='worked_example'),'coherent lesson required');
    const topic=projection.topics.find(t=>t.id===typed.topicId)!;need(topic.subtopics.flatMap(s=>s.skills).every(s=>typed.blocks.some(b=>b.skillIds.includes(s.id))),'lesson skill coverage');
  }
  need(new Set((lessons as Lesson[]).map(l=>l.topicId)).size===3,'duplicate pilot lesson');
  need(Array.isArray(cards)&&cards.length===24,'exactly 24 flashcards');
  for(const card of cards as unknown[]){const row=obj(card,[...scopeKeys,'prompt','answer']);scope(row,'card');text(row.prompt,600);text(row.answer,1200);}
  for(const topicId of PILOTS){const selected=(cards as Flashcard[]).filter(c=>c.topicId===topicId);need(selected.length===8,'eight cards per pilot');need(projection.topics.find(t=>t.id===topicId)!.subtopics.flatMap(s=>s.skills).every(s=>selected.some(c=>c.skillIds.includes(s.id))),'flashcard skill coverage');}
  const ids=[...(lessons as Lesson[]).map(l=>l.id),...records.map(r=>r.id)];need(new Set(ids).size===ids.length,'duplicate authored ID');
}
export function checkContentLocks(lessons:Lesson[],cards:Flashcard[],locks:Record<string,string>){
  const all=[...lessons,...lessons.flatMap(l=>l.blocks),...cards];need(Object.keys(locks).length===all.length,'lock inventory mismatch');
  for(const item of all){const digest=createHash('sha256').update(canonical(item)).digest('hex');need(locks[`${item.id}@${item.version}`]===digest,`published version changed: ${item.id}@${item.version}; publish a new version, do not rewrite its lock`);}
}
export function validateTopicFiles(){
  const source=trustedTopicStudySource();checkTopicStudy(source);const projection=JSON.parse(source) as StudyProjection;
  const read=(name:string):unknown=>JSON.parse(readFileSync(new URL(`../src/topic-study/${name}.json`,import.meta.url),'utf8'));
  const lessons=read('lessons');const cards=read('flashcards');validateTopicContent(lessons,cards,projection);checkContentLocks(lessons,cards as Flashcard[],read('content-lock') as Record<string,string>);
}
export const topicStudyGuard=(validate=validateTopicFiles):Plugin=>({name:'delftstudy-topic-study',apply:'build',buildStart(){validate();}});
