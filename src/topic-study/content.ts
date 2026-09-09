import projection from '../generated/topic-study.json';
import authoredLessons from './lessons.json';
import authoredCards from './flashcards.json';
import type { Flashcard, Lesson, StudyProjection, StudyTopic } from './types';
function freeze<T>(value:T):T{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
export const topicStudy:StudyProjection=freeze(projection);
export const lessons=freeze(authoredLessons as Lesson[]);
export const flashcards=freeze(authoredCards as Flashcard[]);
export const lessonFor=(topicId:string)=>lessons.find(l=>l.topicId===topicId);
export const cardsFor=(topicId:string)=>flashcards.filter(c=>c.topicId===topicId);
export function mapStructure(topic:StudyTopic){
  const nodes=[{id:topic.id,label:topic.name,type:'Topic'},...topic.subtopics.flatMap(s=>[{id:s.id,label:s.name,type:'Subtopic'},...s.skills.map(k=>({id:k.id,label:k.name,type:'Skill'}))])];
  const edges=topic.subtopics.flatMap(s=>[{from:topic.id,to:s.id,type:'contains'},...s.skills.map(k=>({from:s.id,to:k.id,type:'contains'}))]);
  const prerequisites=[topic,...topic.subtopics,...topic.subtopics.flatMap(s=>s.skills)].flatMap(n=>n.prerequisites.map(id=>({from:id,to:n.id,type:'prerequisite'})));
  return {nodes,edges,prerequisites};
}
export function shuffledIds(ids:readonly string[],random= Math.random):string[]{const result=[...ids];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
