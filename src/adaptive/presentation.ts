import {academicIndex,courses} from '../academic/navigation';
import {allExercises} from '../practice/catalog';
import {topicStudy} from '../topic-study/content';
import type {MessageKey} from '../i18n/messages';
import type {Recommendation} from './engine';
type T=(key:MessageKey,values?:Record<string,string|number>)=>string;
type LT=(text:string)=>string;
const topicName=(id:string)=>academicIndex.topics.find(topic=>topic.topic_id===id)?.name??id;
const skillName=(id:string)=>topicStudy.topics.flatMap(topic=>topic.subtopics.flatMap(sub=>sub.skills)).find(skill=>skill.id===id)?.name??id;
export function studyTimeLabel(minutes:number,t:T){return minutes===120?t('duration.extended'):t('duration.minutes',{count:minutes});}
export function actionKind(kind:Recommendation['kind'],t:T){return t(`activity.${kind}` as MessageKey);}
export function presentAction(action:Recommendation,t:T,lt:LT){
 const topic=topicName(action.topicId),skill=lt(skillName(action.basisSkillId));
 const raw=action.id.startsWith('session:')?action.id.slice(8):action.id;
 const exerciseId=raw.startsWith('exercise:')?raw.slice(9):raw.startsWith('practice:')?raw.slice(9):raw.startsWith('retry:')?action.to.split('/')[2]:'';
 const exercise=allExercises.find(item=>item.id===exerciseId);
 let title=lt(action.title),reason=lt(action.reason);
 if(raw==='overview'){title=t('action.orient',{topic});reason=t('action.overviewReason',{topic});}
 else if(raw==='learn'){title=t('action.study',{topic});reason=t('action.learnReason',{topic});}
 else if(raw==='practice'){title=t('action.apply',{topic});reason=t('action.practiceReason',{topic});}
 else if(raw==='map'){title=t('action.connect',{topic});reason=t('action.mapReason',{topic});}
 else if(raw==='cards'){title=t('action.recall',{topic});reason=t('action.cardsReason',{topic});}
 else if(raw==='exam'){const course=courses.find(item=>item.subject_id===action.subjectId)?.compactName??'';title=t('action.exam',{course});reason=t('action.examReason',{course});}
 else if(raw.startsWith('prerequisite:')){const prerequisite=topicName(raw.slice(13));title=t('action.prerequisite',{topic:prerequisite});reason=t('action.prerequisiteReason',{prerequisite,topic});}
 else if(raw.startsWith('subtopic:')){const sub=topicStudy.topics.flatMap(item=>item.subtopics).find(item=>item.id===raw.slice(9));title=t('action.focus',{name:lt(sub?.name??raw.slice(9))});reason=t('action.focusReason',{name:lt(sub?.name??raw.slice(9)),topic});}
 else if(exercise){title=raw.startsWith('retry:')?t('action.retry',{title:lt(exercise.title)}):lt(exercise.title);reason=raw.startsWith('retry:')?t('action.retryReason',{skill}):t('action.exerciseReason',{topic});}
 else if(raw.startsWith('learn:')){title=t('action.review',{skill});reason=t('action.reviewReason',{skill});}
 else if(raw.startsWith('cards:')){title=t('action.recallSkill',{skill});reason=t('action.cardsSkillReason',{skill});}
 return {title,reason};
}
