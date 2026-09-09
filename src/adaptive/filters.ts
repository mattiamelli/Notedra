import type {Evidence,Mistake} from './evidence';
import {DAY} from './evidence';
export const views=['all','needs-review','repeated','corrected','reviewed','old'] as const;
export interface MistakeFilters {course?:string;topic?:string;skill?:string;pattern?:string;days?:string;view?:string;}
export function filterMistakes(evidence:Evidence,filter:MistakeFilters):Mistake[]{
 const groups=new Map(evidence.groups.map(group=>[group.skill.id,group]));
 const days=['7','30','90'].includes(filter.days??'')?Number(filter.days):Infinity;
 return evidence.mistakes.filter(m=>{
  const group=m.skill?groups.get(m.skill.id):undefined;const pattern=m.explanation?.misconception;
  return (!filter.course||m.attempt.subjectId===filter.course)&&(!filter.topic||m.attempt.topicId===filter.topic)&&(!filter.skill||m.skill?.id===filter.skill)&&(!filter.pattern||pattern&&`${pattern.id}@${pattern.version}`===filter.pattern)&&m.timestamp>=evidence.now-days*DAY
   &&(filter.view!=='needs-review'||!m.reviewedAt&&!group?.laterSuccesses)
   &&(filter.view!=='repeated'||!!group&&group.recent.length>=2)
   &&(filter.view!=='corrected'||!!group?.laterSuccesses)
   &&(filter.view!=='reviewed'||!!m.reviewedAt)
   &&(filter.view!=='old'||m.timestamp<evidence.now-90*DAY);
 });
}
