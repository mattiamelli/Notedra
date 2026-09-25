import {describe,expect,it} from 'vitest';
import {topicStudy,overviewIntroduction} from '../src/topic-study/content';
import {academicIndex} from '../src/academic/navigation';
describe('written topic introductions',()=>{
 it('derives a concise source-linked introduction for every registered lesson',()=>{
  expect(topicStudy.topics.length).toBe(academicIndex.topics.length);
  for(const topic of topicStudy.topics){
   const overview=overviewIntroduction(topic.id);
   expect(overview,topic.id).not.toBeNull();
   expect(overview!.paragraphs.length,topic.id).toBeGreaterThanOrEqual(2);
   expect(overview!.paragraphs.length,topic.id).toBeLessThanOrEqual(4);
   expect(new Set(overview!.paragraphs).size,topic.id).toBe(overview!.paragraphs.length);
   expect(overview!.sourceIds.length,topic.id).toBeGreaterThan(0);
   const valid=new Set(topic.sources);
   expect(overview!.sourceIds.every(id=>valid.has(id)||topicStudy.sources.some(source=>source.id===id)),topic.id).toBe(true);
  }
 });
});
