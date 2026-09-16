import type {ActionKind,Recommendation} from './engine';
import {studyMethodAvailability,type StudyMethodId} from './study-methods';

export type StudyMethodRecommendationReason='new-learner'|'practice-short'|'deep-focus'|'complex-work'|'retrieval'|'multi-topic'|'flexible-fallback';
export type StudyContentProfile='practice-heavy'|'deep-work'|'retrieval-heavy'|'multi-topic'|'mixed';
export type InterruptionTolerance='low'|'medium'|'high';
export interface StudyMethodRecommendation{methodId:StudyMethodId;reasonCode:StudyMethodRecommendationReason;confidence:'strong'|'moderate'|'fallback'}
export interface StudyMethodRecommendationInput{
 minutes:number;subjectId:string;topicId?:string;eligibleTopicCount:number;usableTopicCount:number;
 hasCourseActivity:boolean;hasContextActivity:boolean;hasRecentMistakes:boolean;candidates:readonly Recommendation[];
}
export function interruptionTolerance(kind:ActionKind,minutes:number):InterruptionTolerance{
 if(kind==='coding'||kind==='workspace'||(kind==='guided'&&minutes>=15))return 'low';
 if(kind==='learn'||kind==='review'||kind==='guided')return 'medium';
 return 'high';
}
export function profileStudyContent(candidates:readonly Recommendation[],usableTopicCount=1):StudyContentProfile{
 if(usableTopicCount>=2)return 'multi-topic';
 const low=candidates.filter(x=>interruptionTolerance(x.kind,x.minutes)==='low').length;
 const retrieval=candidates.filter(x=>x.kind==='flashcards'||x.kind==='review'||x.kind==='retry').length;
 const practice=candidates.filter(x=>x.kind==='practice'||x.kind==='retry'||x.kind==='flashcards'||x.kind==='guided').length;
 const deep=candidates.filter(x=>x.kind==='learn'||x.kind==='review').length;
 if(low)return 'deep-work';if(retrieval>candidates.length/2)return 'retrieval-heavy';if(practice>candidates.length/2)return 'practice-heavy';if(deep>practice)return 'deep-work';return 'mixed';
}
export function recommendStudyMethod(input:StudyMethodRecommendationInput):StudyMethodRecommendation{
 const available=(method:StudyMethodId)=>studyMethodAvailability(method,{minutes:input.minutes,subjectId:input.subjectId,topicId:input.topicId,eligibleTopicCount:input.eligibleTopicCount}).available;
 const usable=input.candidates.length>0,profile=profileStudyContent(input.candidates,input.usableTopicCount);
 if(!input.topicId&&input.usableTopicCount>=2&&input.hasCourseActivity&&input.minutes>=30&&available('interleaving'))return {methodId:'interleaving',reasonCode:'multi-topic',confidence:'strong'};
 const retrievalAvailable=input.candidates.some(x=>x.kind==='flashcards'||x.kind==='review'||x.kind==='practice'||x.kind==='retry');
 if((input.hasContextActivity||input.hasRecentMistakes)&&retrievalAvailable&&available('active-recall'))return {methodId:'active-recall',reasonCode:'retrieval',confidence:'strong'};
 const complex=input.candidates.some(x=>interruptionTolerance(x.kind,x.minutes)==='low');
 if(complex&&input.minutes>=45&&available('time-blocking'))return {methodId:'time-blocking',reasonCode:'complex-work',confidence:'strong'};
 if(profile==='deep-work'&&input.minutes>=69&&available('52-17'))return {methodId:'52-17',reasonCode:'deep-focus',confidence:'moderate'};
 const discrete=input.candidates.length>=3,practice=profile==='practice-heavy'||profile==='retrieval-heavy';
 if(usable&&input.minutes>=30&&(!input.hasCourseActivity||practice||discrete)&&available('pomodoro'))return {methodId:'pomodoro',reasonCode:input.hasCourseActivity?'practice-short':'new-learner',confidence:'moderate'};
 return {methodId:'flexible',reasonCode:'flexible-fallback',confidence:'fallback'};
}
export const recommendationImpressionKey=(input:Pick<StudyMethodRecommendationInput,'subjectId'|'topicId'|'minutes'>,recommendation:StudyMethodRecommendation)=>[input.subjectId,input.topicId??'',input.minutes,recommendation.methodId,recommendation.reasonCode].join('|');
export function claimRecommendationImpression(seen:Set<string>,key:string):boolean{if(seen.has(key))return false;seen.add(key);return true}
export const studyMethodSelectionSource=(selected:StudyMethodId,recommended:StudyMethodId):'manual'|'recommended'=>selected===recommended?'recommended':'manual';
