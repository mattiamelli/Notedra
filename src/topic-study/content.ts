import projection from '../generated/topic-study.json';
import authoredLessons from './lessons.json';
import authoredCards from './flashcards.json';
import type { Flashcard, Lesson, StudyProjection, StudyTopic } from './types';
function freeze<T>(value:T):T{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
export const topicStudy:StudyProjection=freeze(projection);
export const lessons=freeze(authoredLessons as Lesson[]);
export const flashcards=freeze(authoredCards as Flashcard[]);
export const lessonFor=(topicId:string)=>lessons.find(l=>l.topicId===topicId);
/** Builds Overview copy only from already-authored, source-linked lesson prose. */
export function overviewIntroduction(topicId:string){
 const lesson=lessonFor(topicId);
 if(!lesson){const topic=topicStudy.topics.find(item=>item.id===topicId);return topic?{paragraphs:[topic.description,topic.relevance],sourceIds:[...topic.sources],lessonId:null}:null;}
 const paragraphs:string[]=[];const sourceIds=new Set<string>();
 for(const block of lesson.blocks){
  if(!['introduction','concept','procedure','recap'].includes(block.kind))continue;
  for(const paragraph of block.paragraphs){
   if(paragraphs.length>=4)break;
   paragraphs.push(paragraph);block.sourceIds.forEach(id=>sourceIds.add(id));
   if(paragraphs.length>=2&&paragraphs.join(' ').split(/\s+/).length>=100)break;
  }
  if(paragraphs.length>=2&&paragraphs.join(' ').split(/\s+/).length>=100)break;
 }
 return {paragraphs:paragraphs.slice(0,4),sourceIds:[...sourceIds],lessonId:lesson.id};
}
export const cardsFor=(topicId:string)=>flashcards.filter(c=>c.topicId===topicId);
export function mapStructure(topic:StudyTopic){
  const nodes=[{id:topic.id,label:topic.name,type:'Topic'},...topic.subtopics.flatMap(s=>[{id:s.id,label:s.name,type:'Subtopic'},...s.skills.map(k=>({id:k.id,label:k.name,type:'Skill'}))])];
  const edges=topic.subtopics.flatMap(s=>[{from:topic.id,to:s.id,type:'contains'},...s.skills.map(k=>({from:s.id,to:k.id,type:'contains'}))]);
  const prerequisites=[topic,...topic.subtopics,...topic.subtopics.flatMap(s=>s.skills)].flatMap(n=>n.prerequisites.map(id=>({from:id,to:n.id,type:'prerequisite'})));
  return {nodes,edges,prerequisites};
}
export function shuffledIds(ids:readonly string[],random= Math.random):string[]{const result=[...ids];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
