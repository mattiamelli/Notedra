import canonicalRefs from '../src/generated/student-references.json';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { checkAcademicIndex, writeAcademicIndex } from './academic-index.ts';
import { loadPackFiles, readDocuments } from './content/manifest.ts';
import { validateContentFiles } from './content/validate.ts';
import type { ContentPack } from './content/types.ts';
import type { StudyProjection, StudySource } from '../src/topic-study/types.ts';
export const TOPIC_STUDY_PATH = fileURLToPath(new URL('../src/generated/topic-study.json', import.meta.url));
export const MAX_TOPIC_BYTES = 180_000;
const sorted = <T extends {id: string}>(items: T[]) => items.sort((a,b)=>a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
const label = (value: unknown): string => {if(typeof value !== 'string'||!value.length) throw new Error('Topic projection requires canonical text.');return value;};
type RawSource = {document_id?: string;source_document:string;source_page_or_slide:string;confidence:string;source_locator?:{kind:string;precision:string}};
export function projectTopicStudy(pack: ContentPack): StudyProjection {
  const sources = new Map<string,StudySource>();
  function refs(raw: unknown, subject: string) {
    if(!Array.isArray(raw)) throw new Error('Topic source list missing.');
    return [...new Set((raw as RawSource[]).map(ref=>{
      const doc=pack.corpus.documents.find(d=>d.filename===ref.source_document&&d.subject_id===subject);
      if(!doc||(ref.document_id&&ref.document_id!==doc.document_id)) throw new Error('Topic source ownership mismatch.');
      const fields={documentId:doc.document_id,filename:doc.filename,locator:label(ref.source_page_or_slide),kind:ref.source_locator?.kind??'UNKNOWN',precision:ref.source_locator?.precision??'UNKNOWN',confidence:label(ref.confidence)};
      const id='ref-'+createHash('sha256').update(JSON.stringify(fields)).digest('hex').slice(0,16);
      const source={id,...fields};if(sources.has(id)&&JSON.stringify(sources.get(id))!==JSON.stringify(source)) throw new Error('Topic source collision.');sources.set(id,source);return id;
    }))].sort();
  }
  const projection: StudyProjection={subjects:pack.subjects.map(s=>s.subject_id).sort(),topics:sorted(pack.taxonomy.topics.map(topic=>({
    id:topic.topic_id,subjectId:topic.subject_id,name:label(topic.name),description:label(topic.description),relevance:label(topic.current_curriculum_relevance),prerequisites:[...topic.prerequisite_topic_ids].sort(),sources:refs(topic.lecture_references,topic.subject_id),
    subtopics:sorted(pack.taxonomy.subtopics.filter(s=>s.topic_id===topic.topic_id).map(sub=>({
      id:sub.subtopic_id,name:label(sub.name),prerequisites:[...sub.prerequisite_subtopic_ids].sort(),sources:refs(sub.source_provenance,sub.subject_id),
      skills:sorted(pack.taxonomy.atomic_skills.filter(s=>s.subtopic_id===sub.subtopic_id).map(skill=>({id:skill.skill_id,name:label(skill.name),description:label(skill.description),prerequisites:[...skill.prerequisite_skill_ids].sort(),sources:refs(skill.lecture_references,skill.subject_id)})))
    })))
  }))),sources:[]};
  projection.sources=sorted([...sources.values()]);validateTopicProjection(projection);return projection;
}
export function validateTopicProjection(data: StudyProjection) {
  const subs=data.topics.flatMap(t=>t.subtopics);const skills=subs.flatMap(s=>s.skills);
  const unique=(ids:string[],count:number)=>ids.length===count&&new Set(ids).size===count;
  if(!unique(data.subjects,3)||!unique(data.topics.map(t=>t.id),43)||!unique(subs.map(s=>s.id),105)||!unique(skills.map(s=>s.id),147)) throw new Error('Topic projection canonical counts/uniqueness failed.');
  const nodes=[...data.topics,...subs,...skills];const sourceIds=new Set(data.sources.map(s=>s.id));
  if(sourceIds.size!==data.sources.length) throw new Error('Duplicate source identity.');
  for(const t of data.topics){
    if(!data.subjects.includes(t.subjectId)||!canonicalRefs.topics.some(x=>x.id===t.id&&x.subject===t.subjectId))throw new Error('Topic subject ownership failed.');
    for(const sub of t.subtopics){
      if(!canonicalRefs.subtopics.some(x=>x.id===sub.id&&x.topic===t.id)||sub.skills.some(skill=>!canonicalRefs.skills.some(x=>x.id===skill.id&&x.subtopic===sub.id)))throw new Error('Subtopic/skill ownership failed.');
    }
    for(const n of [t,...t.subtopics,...t.subtopics.flatMap(s=>s.skills)]){
      if(new Set(n.prerequisites).size!==n.prerequisites.length||n.prerequisites.some(id=>!nodes.some(x=>x.id===id)))throw new Error('Invalid prerequisite.');
      const sameLevel='subtopics' in n?data.topics:'skills' in n?subs:skills;
      if(n.prerequisites.some(id=>!sameLevel.some(x=>x.id===id)||!data.topics.some(owner=>owner.subjectId===t.subjectId&&[owner,...owner.subtopics,...owner.subtopics.flatMap(s=>s.skills)].some(x=>x.id===id))))throw new Error('Prerequisite ownership/level failed.');
      if(n.sources.some(id=>!sourceIds.has(id)))throw new Error('Unknown topic source.');
    }
  }
  const visit=(id:string,path:Set<string>)=>{if(path.has(id))throw new Error('Cyclic topic prerequisites.');const next=new Set(path).add(id);nodes.find(n=>n.id===id)!.prerequisites.forEach(p=>visit(p,next));};nodes.forEach(n=>visit(n.id,new Set()));
}
export function trustedTopicStudySource() {
  const files=loadPackFiles();if(!validateContentFiles(files).valid)throw new Error('Invalid trusted pack.');
  const output=JSON.stringify(projectTopicStudy(readDocuments(files).pack as ContentPack))+'\n';
  if(Buffer.byteLength(output)>MAX_TOPIC_BYTES)throw new Error('Topic projection exceeds 180 KB.');return output;
}
export const checkTopicStudy = (expected=trustedTopicStudySource(),path=TOPIC_STUDY_PATH)=>checkAcademicIndex(expected,path);
export const writeTopicStudy = (source:string)=>writeAcademicIndex(source,TOPIC_STUDY_PATH);
