import {allExercises,versionBinding} from '../../src/practice/catalog';
import {CONTENT,type Answer,type Attempt} from '../../src/learning/contracts';
export const CLOCK=Date.parse('2026-09-09T12:00:00.000Z');
export function record(id:string,item:string,answer:Answer,daysAgo=0,patch:Partial<Attempt>={}):Attempt {
 const e=allExercises.find(e=>e.id===item||e.id===`ds.practice.${item}`);if(!e)throw new Error('Unknown test item '+item);
 const time=new Date(CLOCK-daysAgo*86400000).toISOString();
 return {attemptId:id,contentVersion:CONTENT.version,status:'SUBMITTED',answer,hintsUsed:null,solutionViewed:null,createdAt:time,updatedAt:time,revision:2,submission:{operationId:`op-${id}`,submittedAt:time},subjectId:e.subjectId,topicId:e.topicId,subtopicId:e.subtopicId,targetedSkillIds:[e.skillId],templateRef:e.id,exercise:{id:`ds.instance.${id}`,version:versionBinding(e)},...patch};
}
export const text=(value:string):Answer=>({kind:'text',value});
export const choice=(...value:string[]):Answer=>({kind:'choice',value});
