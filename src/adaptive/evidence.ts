import type {Answer, Attempt, ReviewRecord} from '../learning/contracts';
import {resolveAttempt} from '../practice/service';
import {gradeResponse} from '../practice/runtime';
import {explainAnswer, type Explanation} from '../enrichment/feedback';
import type {PracticeExercise} from '../practice/registered-types';
import {topicStudy} from '../topic-study/content';

export const DAY = 86_400_000;
export const RECENT_DAYS = 30;
export interface SkillContext {id:string; name:string; topicId:string; subjectId:string; prerequisites:string[]; sources:string[];}
export const skills = new Map<string,SkillContext>(topicStudy.topics.flatMap(topic=>topic.subtopics.flatMap(sub=>sub.skills.map(skill=>[skill.id,{...skill,topicId:topic.id,subjectId:topic.subjectId}] as const))));
const sources = new Map(topicStudy.sources.map(source=>[source.id,source]));
/** Authored atomic practice evidence is separate from assessment mapping/grade eligibility. */
export function eligibleSkill(exercise:PracticeExercise):SkillContext|undefined {
 const skill=skills.get(exercise.skillId);
 if (!skill || skill.topicId!==exercise.topicId || skill.subjectId!==exercise.subjectId || exercise.authorship!=='AUTHORED_PRACTICE') return;
 const curriculum=exercise.task.kind==='curriculum'&&exercise.source.kind==='CURRICULUM';
 if(!curriculum&&exercise.source.kind!=='LECTURE')return;
 if (!skill.sources.some(id=>{const source=sources.get(id);return source?.confidence==='HIGH' && source.kind===(curriculum?'DOCUMENT_SECTION':'PDF_PAGE_RANGE') && source.documentId===exercise.source.documentId && source.filename===exercise.source.filename && source.locator===exercise.source.locator && source.precision===exercise.source.precision;})) return;
 return skill;
}
export interface Mistake {
 attempt:Attempt; exercise:PracticeExercise; reference:Answer; explanation:Explanation|null;
 skill:SkillContext|null; timestamp:number; reviewedAt:string|null;
}
export interface SkillEvidence {
 skill:SkillContext; mistakes:Mistake[]; recent:Mistake[]; successes:{attemptId:string;timestamp:number;exerciseId:string}[];
 latest:Mistake; laterSuccesses:number; distinctExercises:number; repeatedPatterns:{id:string;label:string;count:number;exercises:number}[];
 state:'active'|'repeated'|'improving'|'recently corrected'|'old';
}
export interface Evidence {
 mistakes:Mistake[]; groups:SkillEvidence[];
 limited:{attempt:Attempt;reason:string}[];
 now:number;
}
export const stableCompare=(a:string,b:string)=>a<b?-1:a>b?1:0;
const order=(a:Mistake,b:Mistake)=>b.timestamp-a.timestamp||stableCompare(a.attempt.attemptId,b.attempt.attemptId);
export function deriveEvidence(attempts:readonly Attempt[],reviews:readonly ReviewRecord[],now:number):Evidence {
 if (!Number.isFinite(now)) throw new Error('Evidence needs a finite clock input.');
 const mistakes:Mistake[]=[], limited:Evidence['limited']=[];
 const bySkill=new Map<string,{wrong:Mistake[];correct:SkillEvidence['successes']}>();
 const reviewById=new Map(reviews.map(review=>[review.attemptId,review]));
 const seen=new Set<string>();
 for (const attempt of attempts) {
  if(seen.has(attempt.attemptId))throw new Error('Duplicate attempt IDs cannot become duplicate mistake evidence.');seen.add(attempt.attemptId);
  if(attempt.status!=='SUBMITTED')continue;
  const resolved=resolveAttempt(attempt);
  if(resolved.status!=='AVAILABLE'){limited.push({attempt,reason:resolved.message});continue;}
  const timestamp=Date.parse(attempt.submission!.submittedAt);
  if(timestamp>now){limited.push({attempt,reason:'Submission time is ahead of this clock. Evidence is deferred until that time.'});continue;}
  // The resolver requires the exact original definition AND grader fingerprint, never a current fallback.
  const grade=gradeResponse(resolved.exercise,attempt.answer);
  if(grade.status!=='GRADED')continue;
  const skill=eligibleSkill(resolved.exercise)??null;
  let group=skill?bySkill.get(skill.id):undefined;
  if(skill&&!group){group={wrong:[],correct:[]};bySkill.set(skill.id,group);}
  if(grade.correct){group?.correct.push({attemptId:attempt.attemptId,timestamp,exerciseId:resolved.exercise.id});continue;}
  const mistake:Mistake={attempt,exercise:resolved.exercise,reference:grade.reference,explanation:explainAnswer(resolved.exercise,attempt.answer,grade),skill,timestamp,reviewedAt:reviewById.get(attempt.attemptId)?.reviewedAt??null};
  mistakes.push(mistake);group?.wrong.push(mistake);
 }
 const groups:SkillEvidence[]=[];
 for(const [id,group] of bySkill){
  if(!group.wrong.length)continue;
  group.correct.sort((a,b)=>a.timestamp-b.timestamp||stableCompare(a.attemptId,b.attemptId));
  group.wrong.sort(order);const latest=group.wrong[0];
  const recent=group.wrong.filter(m=>m.timestamp>=now-RECENT_DAYS*DAY);
  const laterSuccesses=group.correct.filter(s=>s.timestamp>latest.timestamp).length;
  const patterns=new Map<string,{id:string;label:string;count:number;items:Set<string>}>();
  for(const m of recent){const p=m.explanation?.misconception;if(!p)continue;const key=`${p.id}@${p.version}`;const record=patterns.get(key)??{id:key,label:p.label,count:0,items:new Set<string>()};record.count++;record.items.add(m.exercise.id);patterns.set(key,record);}
  const repeatedPatterns=[...patterns.values()].filter(p=>p.count>=2).map(({items,...p})=>({...p,exercises:items.size})).sort((a,b)=>b.count-a.count||stableCompare(a.id,b.id));
  groups.push({skill:skills.get(id)!,mistakes:group.wrong,recent,successes:group.correct,latest,laterSuccesses,distinctExercises:new Set(recent.map(m=>m.exercise.id)).size,repeatedPatterns,
   state:laterSuccesses>=2?'improving':laterSuccesses===1?'recently corrected':latest.timestamp<now-90*DAY?'old':recent.length>=2?'repeated':'active'});
 }
 groups.sort((a,b)=>order(a.latest,b.latest));mistakes.sort(order);limited.sort((a,b)=>stableCompare(a.attempt.attemptId,b.attempt.attemptId));
 return {mistakes,groups,limited,now};
}
