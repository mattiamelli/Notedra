import {readFileSync,readdirSync} from 'node:fs';
import {describe,it,expect} from 'vitest';
import type {RLTopicContent} from '../src/rl/types';
import type {StudyProjection} from '../src/topic-study/types';
const projection=JSON.parse(readFileSync(new URL('../src/generated/topic-study.json',import.meta.url),'utf8')) as StudyProjection;
const directory=new URL('../src/ip/topics/',import.meta.url);
const topics=readdirSync(directory).filter(name=>/^IP_T(1[1-9]|20)_.*\.json$/.test(name)).map(name=>JSON.parse(readFileSync(new URL(name,directory),'utf8')) as RLTopicContent);
describe('IP late-course authored teaching contracts',()=>{
 it('loop implementation evidence includes the inspected accumulation page rather than only Boolean material',()=>{
  const evidence=JSON.parse(readFileSync(new URL('../src/ip/evidence.json',import.meta.url),'utf8')) as {id:string;pages:number[];skillIds:string[]}[];
  const source=evidence.find(source=>source.id==='ip-t02')!;
  expect(source.skillIds).toContain('IP_SK02_04_LOOP_IMPLEMENT');
  expect(source.pages).toContain(31);
 });
 it('supplemental mock evidence retains official practice material authority',()=>{
  const evidence=JSON.parse(readFileSync(new URL('../src/ip/evidence.json',import.meta.url),'utf8')) as {id:string;authority:string}[];
  expect(evidence.find(source=>source.id==='ip-integrated-mock')?.authority).toBe('OFFICIAL_PRACTICE_MATERIAL');
 });
 it.each(topics.map(content=>[content.lesson.topicId,content] as const))('%s has unique lesson/block/card/guide IDs',(_id,content)=>{
  const ids=[content.lesson.id,...content.lesson.blocks.map(block=>block.id),...content.cards.map(card=>card.id),...content.guided.map(guide=>guide.id)];
  expect(new Set(ids).size).toBe(ids.length);
 });
 it.each(topics.map(content=>[content.lesson.topicId,content] as const))('%s teaches every owned skill with at least two preventive cards',(_id,content)=>{
  const topic=projection.topics.find(candidate=>candidate.id===content.lesson.topicId)!;
  const skills=topic.subtopics.flatMap(subtopic=>subtopic.skills);
  for(const skill of skills){
   expect(content.lesson.blocks.some(block=>!['introduction','recap'].includes(block.kind)&&block.skillIds.includes(skill.id))).toBe(true);
   expect(content.cards.filter(card=>card.skillIds.includes(skill.id)).length).toBeGreaterThanOrEqual(2);
   expect(content.guided.some(guide=>guide.skillIds.includes(skill.id))).toBe(true);
  }
  for(const item of [...content.lesson.blocks,...content.cards,...content.guided]){
   expect(item.version).toBe('1');
   expect(item.skillIds.length).toBeGreaterThan(0);
   expect(item.skillIds.every(id=>skills.some(skill=>skill.id===id))).toBe(true);
   expect([...item.subtopicIds].sort()).toEqual(topic.subtopics.filter(subtopic=>subtopic.skills.some(skill=>item.skillIds.includes(skill.id))).map(subtopic=>subtopic.id).sort());
   expect(item.sourceIds.length).toBeGreaterThan(0);
   expect(item.sourceIds.every(id=>topic.sources.includes(id))).toBe(true);
  }
 });
 it('contains exactly the ten canonical T11–T20 lessons, with no grader or learner state on guides',()=>{
  expect(topics.map(content=>content.lesson.topicId).sort()).toEqual(projection.topics.filter(topic=>topic.subjectId==='CSE1100_IP'&&Number(topic.id.slice(4,6))>=11).map(topic=>topic.id).sort());
  for(const guide of topics.flatMap(content=>content.guided)){
   expect(guide.fields.length).toBeGreaterThan(0);expect(guide.rubric.length).toBeGreaterThan(0);expect(guide.reference.length).toBeGreaterThan(0);
   for(const field of ['grader','score','earned','mastery','completed'])expect(guide).not.toHaveProperty(field);
  }
 });
});
