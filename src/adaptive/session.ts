import {academicIndex,courses,topicPath} from '../academic/navigation';
import {allExercises,exercisePath} from '../practice/catalog';
import {topicStudy} from '../topic-study/content';
import type {Evidence} from './evidence';
import {recommend,type ActionKind,type Recommendation} from './engine';

export const EXTENDED_SESSION_MINUTES=120;
export const STUDY_TIME_PRESETS=[15,30,45,60,90,EXTENDED_SESSION_MINUTES] as const;
export type StudyTimePreset=typeof STUDY_TIME_PRESETS[number];
export const studyTimeLabel=(minutes:number)=>minutes===EXTENDED_SESSION_MINUTES?'2h+':`${minutes} minutes`;

interface Candidate {id:string;title:string;topicId:string;subjectId:string;skillIds?:string[];kind:ActionKind;to:string;reason:string;basisSkillId:string;preferred:number;priority?:number;}

const targetCount=(minutes:number)=>minutes<=15?2:minutes<=30?3:minutes<=45?4:minutes<=60?5:minutes<=90?7:9;

export function buildStudySession(evidence:Evidence,options:{minutes:StudyTimePreset;subjectId:string;topicId?:string}):Recommendation[]{
 if(!STUDY_TIME_PRESETS.includes(options.minutes))throw new Error('Unsupported study time budget.');
 const course=courses.find(item=>item.subject_id===options.subjectId);
 if(!course)throw new Error('Choose a course before building a study session.');
 const available=academicIndex.topics.filter(topic=>topic.subject_id===course.subject_id).sort((a,b)=>a.order-b.order);
 const selected=options.topicId?available.find(topic=>topic.topic_id===options.topicId):undefined;
 if(options.topicId&&!selected)throw new Error('The selected topic does not belong to this course.');
 const evidenceTopic=evidence.groups.find(group=>group.skill.subjectId===course.subject_id)?.skill.topicId;
 const focus=selected??available.find(topic=>topic.topic_id===evidenceTopic)??available[0];
 if(!focus)throw new Error('No authored topics are available for this course.');
 const canonical=topicStudy.topics.find(topic=>topic.id===focus.topic_id)!;
 const base=topicPath(focus);
 const candidates:Candidate[]=[];
 const add=(id:string,title:string,kind:ActionKind,to:string,reason:string,preferred:number,topicId=focus.topic_id)=>candidates.push({id,title,kind,to,reason,preferred,topicId,subjectId:course.subject_id,basisSkillId:`topic:${topicId}`});
 const scope=selected?`the selected topic, ${focus.name}`:`${focus.name}, the first relevant topic in ${course.short}`;

 add('overview',`Orient yourself in ${focus.name}`,'learn',base,`Start with the authored overview for ${scope}; it defines the exact concepts and boundaries used by the course.`,5);
 add('learn',`Study the core ideas in ${focus.name}`,'learn',`${base}/learn`,`Use the authored lesson for ${scope} before switching to recall or application.`,15);
 add('practice',`Apply ${focus.name}`,'guided',`${base}/practice`,`Work in the topic's existing guided or graded practice area so the session stays tied to actual Notedra content.`,20);
 add('map',`Connect the ideas in ${focus.name}`,'review',`${base}/mental-map`,`Use the canonical topic map to connect subtopics, skills and documented prerequisite relationships.`,10);
 add('cards',`Recall the key points in ${focus.name}`,'flashcards',`${base}/flashcards`,`Use the authored recall activity for the selected scope, with a different study mode from concept review and practice.`,10);
 add('exam',`Bring ${course.short} ideas into exam-style work`,'practice',`/exams/${course.subject_id}/setup`,`Choose an existing authored mock for ${course.short} and keep your work centered on the selected course.`,20);

 for(const prerequisiteId of canonical.prerequisites){
  const prerequisite=academicIndex.topics.find(topic=>topic.topic_id===prerequisiteId&&topic.subject_id===course.subject_id);
  if(prerequisite)add(`prerequisite:${prerequisite.topic_id}`,`Review prerequisite: ${prerequisite.name}`,'review',topicPath(prerequisite),`${prerequisite.name} is listed as a canonical prerequisite for ${focus.name}; review its scope before the deeper phases.`,10,prerequisite.topic_id);
 }
 for(const subtopic of canonical.subtopics)add(`subtopic:${subtopic.id}`,`Focus on ${subtopic.name}`,'learn',`${base}#${subtopic.id}`,`${subtopic.name} is an authored subtopic inside ${focus.name}; this focused pass adds depth without repeating another activity.`,10);
 for(const exercise of allExercises.filter(item=>item.subjectId===course.subject_id&&item.topicId===focus.topic_id))add(`exercise:${exercise.id}`,exercise.title,'practice',exercisePath(exercise),`This is an authored exercise for ${focus.name}, used as a concrete application phase rather than repeated general practice.`,15);
 const adaptiveBudget=options.minutes===15?10:options.minutes>60?60:options.minutes;
 const adaptive=recommend(evidence,{minutes:adaptiveBudget,subjectId:course.subject_id,topicId:selected?.topic_id});
 const combined:Candidate[]=[...adaptive.map(item=>({...item,preferred:item.minutes})),...candidates];
 const unique=combined.filter((item,index,list)=>list.findIndex(other=>other.to===item.to)===index);
 const desired=targetCount(options.minutes);
 const chosen=unique.slice(0,Math.min(desired,unique.length));
 if(!chosen.length)throw new Error('No real study activities are available for this selection.');
 const minimum=5*chosen.length;
 if(minimum>options.minutes)chosen.splice(Math.floor(options.minutes/5));
 const minutes=chosen.map(()=>5);
 let remaining=options.minutes-minutes.reduce((sum,value)=>sum+value,0);
 const order=[...chosen.keys()].sort((a,b)=>chosen[b].preferred-chosen[a].preferred||a-b);
 for(let cursor=0;remaining>=5;cursor=(cursor+1)%order.length){minutes[order[cursor]]+=5;remaining-=5;}
 return chosen.map((item,index)=>({
  id:`session:${item.id}`,
  title:item.title,
  topicId:item.topicId,
  subjectId:item.subjectId,
  skillIds:item.skillIds??[],
  kind:item.kind,
  minutes:minutes[index],
  durationSource:'Notedra estimate',
  to:item.to,
  reason:item.reason,
  priority:item.priority??0,
  basisSkillId:item.basisSkillId,
 }));
}
