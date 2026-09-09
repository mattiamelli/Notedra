import { describe,it,expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { projectTopicStudy,validateTopicProjection,checkTopicStudy,MAX_TOPIC_BYTES } from '../scripts/topic-projection';
import { loadPackFiles,readDocuments } from '../scripts/content/manifest';
import type { ContentPack } from '../scripts/content/types';
import { topicStudy,mapStructure } from '../src/topic-study/content';
const pack=readDocuments(loadPackFiles()).pack as ContentPack;
describe('canonical topic study projection',()=>{
 it('matches all canonical fields, counts, ownership and projected artifact',()=>{
  const projected=projectTopicStudy(pack);expect(projected).toEqual(topicStudy);expect(projected.subjects).toHaveLength(3);expect(projected.topics).toHaveLength(43);
  expect(projected.topics.flatMap(t=>t.subtopics)).toHaveLength(105);expect(projected.topics.flatMap(t=>t.subtopics.flatMap(s=>s.skills))).toHaveLength(147);
  for(const t of projected.topics){const source=pack.taxonomy.topics.find(s=>s.topic_id===t.id)!;expect(t.description).toBe(source.description);expect(t.prerequisites).toEqual([...source.prerequisite_topic_ids].sort());
   for(const sub of t.subtopics){expect(pack.taxonomy.subtopics.find(s=>s.subtopic_id===sub.id)?.topic_id).toBe(t.id);for(const skill of sub.skills)expect(pack.taxonomy.atomic_skills.find(s=>s.skill_id===skill.id)?.subtopic_id).toBe(sub.id);}}
  expect(Buffer.byteLength(JSON.stringify(projected))).toBeLessThan(MAX_TOPIC_BYTES);expect(()=>checkTopicStudy()).not.toThrow();
 });
 it('is byte-deterministic despite reordering every canonical input collection',()=>{
  const reordered=structuredClone(pack);reordered.subjects.reverse();reordered.corpus.documents.reverse();for(const group of Object.values(reordered.taxonomy))group.reverse();
  reordered.taxonomy.topics.forEach(t=>{t.prerequisite_topic_ids.reverse();(t.lecture_references as unknown[]).reverse();});
  expect(JSON.stringify(projectTopicStudy(reordered))).toBe(JSON.stringify(projectTopicStudy(pack)));
 });
 it('preserves broad topic/skill provenance and UNKNOWN subtopic precision',()=>{
  expect(topicStudy.sources.some(s=>s.precision==='UNKNOWN'&&s.locator==='UNKNOWN')).toBe(true);
  expect(topicStudy.sources.filter(s=>s.precision==='DOCUMENT_RANGE').every(s=>s.locator.startsWith('PDF_PAGES_'))).toBe(true);
  expect(topicStudy.sources.some(s=>s.precision==='EXACT')).toBe(false);
 });
 it.each(['duplicate','ownership','skill','prerequisite','cross-course','source'] as const)('rejects %s projection corruption',kind=>{
  const data=structuredClone(topicStudy);const t=data.topics[0];
  if(kind==='duplicate')data.topics[1].id=t.id;
  if(kind==='ownership')t.subjectId='CSE1100_IP';
  if(kind==='skill')t.subtopics[0].skills[0].id=data.topics.at(-1)!.subtopics[0].skills[0].id;
  if(kind==='prerequisite')t.prerequisites=['MISSING'];
  if(kind==='cross-course')t.prerequisites=[data.topics.at(-1)!.id];
  if(kind==='source')t.sources=['missing'];
  expect(()=>validateTopicProjection(data)).toThrow();
 });
 it('rejects missing/stale projection bytes instead of silently trusting generated output',()=>{
  expect(()=>checkTopicStudy('different')).toThrow('stale');expect(()=>checkTopicStudy('expected','/tmp/delftstudy-intentionally-missing-topic-file')).toThrow('missing');
 });
 it('projects only consumed academic fields, without assessment or frequency payloads',()=>{
  const bytes=readFileSync(new URL('../src/generated/topic-study.json',import.meta.url),'utf8');
  expect(bytes).not.toMatch(/historical_frequency|question_map|question_ref|exam_references|mastery_dimensions|\$schema/);
  for(const t of topicStudy.topics)expect(Object.keys(t).sort()).toEqual(['id','subjectId','name','description','relevance','prerequisites','sources','subtopics'].sort());
 });
 it.each(topicStudy.topics)('map for $id contains only canonical containment and prerequisite edges',topic=>{
  const map=mapStructure(topic);const entities=[topic,...topic.subtopics,...topic.subtopics.flatMap(s=>s.skills)];
  expect(map.nodes.map(n=>n.id)).toEqual([topic.id,...topic.subtopics.flatMap(s=>[s.id,...s.skills.map(k=>k.id)])]);
  expect(map.edges).toEqual(topic.subtopics.flatMap(s=>[{from:topic.id,to:s.id,type:'contains'},...s.skills.map(k=>({from:s.id,to:k.id,type:'contains'}))]));
  expect(map.prerequisites).toEqual(entities.flatMap(n=>n.prerequisites.map(from=>({from,to:n.id,type:'prerequisite'}))));
 });
});
