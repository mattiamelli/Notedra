import type {Evidence,Mistake,SkillEvidence} from './evidence';
import {stableCompare} from './evidence';

export type ReviewNowReason='repeated-pattern'|'repeated-skill'|'unreviewed';
export interface ReviewNowItem {mistake:Mistake;group?:SkillEvidence;reason:ReviewNowReason;}

export function selectReviewNow(evidence:Evidence,{topicId,limit=4}:{topicId?:string;limit?:number}={}):ReviewNowItem[]{
 const grouped:ReviewNowItem[]=evidence.groups.flatMap(group=>{
  if(group.laterSuccesses>0||topicId&&group.skill.topicId!==topicId)return [];
  const mistake=group.mistakes.find(item=>!item.reviewedAt);
  if(!mistake)return [];
  const reason:ReviewNowReason=group.repeatedPatterns.length?'repeated-pattern':group.recent.length>=2?'repeated-skill':'unreviewed';
  return [{mistake,group,reason}];
 });
 const ungrouped:ReviewNowItem[]=evidence.mistakes.filter(mistake=>!mistake.skill&&!mistake.reviewedAt&&(!topicId||mistake.attempt.topicId===topicId)).map(mistake=>({mistake,reason:'unreviewed'}));
 const rank:Record<ReviewNowReason,number>={'repeated-pattern':0,'repeated-skill':1,unreviewed:2};
 return [...grouped,...ungrouped].sort((a,b)=>rank[a.reason]-rank[b.reason]||(b.group?.recent.length??0)-(a.group?.recent.length??0)||b.mistake.timestamp-a.mistake.timestamp||stableCompare(a.mistake.attempt.attemptId,b.mistake.attempt.attemptId)).slice(0,Math.max(0,limit));
}
