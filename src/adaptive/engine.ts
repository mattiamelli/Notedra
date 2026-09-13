import {allExercises,attemptPath,exercisePath} from '../practice/catalog';
import {courses,ASSEMBLY_TOOL_PATH} from '../academic/navigation';
import type {SkillEvidence,Evidence} from './evidence';
import {DAY,eligibleSkill,stableCompare} from './evidence';
import authoredActions from './actions.json';
export const TIME_BUDGETS=[10,20,30,45,60] as const;
export type ActionKind='review'|'retry'|'practice'|'learn'|'flashcards'|'guided'|'workspace'|'coding';
export interface Action {id:string;title:string;topicId:string;subjectId:string;skillIds:string[];kind:ActionKind;minutes:number;durationSource:'Notedra estimate'|'Authored practice duration';to:string;}
export interface Recommendation extends Action {reason:string;priority:number;basisSkillId:string;}
export interface PathOptions {minutes:number;subjectId?:string;topicId?:string;}
export const topicRoute=(subjectId:string,topicId:string)=>`${courses.find(c=>c.subject_id===subjectId)!.path}/${topicId}`;
export function priorityFor(group:SkillEvidence,now:number):number {
 const age=now-group.latest.timestamp;
 const recency=age<=7*DAY?40:age<=30*DAY?25:age<=90*DAY?10:2;
 return Math.max(0,recency+8*Math.min(4,Math.max(0,group.recent.length-1))+(group.latest.explanation?.misconception?6:0)+6*Math.min(2,Math.max(0,group.distinctExercises-1))-(group.laterSuccesses?25:0)-(group.latest.reviewedAt?5:0));
}
export function recommend(evidence:Evidence,options:PathOptions):Recommendation[]{
 if(!TIME_BUDGETS.some(value=>value===options.minutes))throw new Error('Unsupported study time budget.');
 const groups=evidence.groups.filter(g=>(!options.subjectId||g.skill.subjectId===options.subjectId)&&(!options.topicId||g.skill.topicId===options.topicId));
 const bySkill=new Map(evidence.groups.map(group=>[group.skill.id,group]));
 const dependencies=new Map<string,Set<string>>();
 const selected=new Map(groups.map(group=>[group.skill.id,{group,bonus:0,extra:''}]));
 for(const downstream of groups){
  if(downstream.recent.length<2||downstream.laterSuccesses)continue;
  for(const id of downstream.skill.prerequisites){const before=bySkill.get(id);
   if(!before||before.skill.subjectId!==downstream.skill.subjectId||!before.recent.length||before.laterSuccesses)continue;
   const prerequisites=dependencies.get(downstream.skill.id)??new Set<string>();prerequisites.add(id);dependencies.set(downstream.skill.id,prerequisites);
   const old=selected.get(id);
   const extra=` Review ${before.skill.name} first: it is a canonical prerequisite of ${downstream.skill.name}, and you also have recent incorrect evidence on it.`;
   if(!old?.bonus||stableCompare(extra,old.extra)<0)selected.set(id,{group:before,bonus:30,extra});
  }
 }
 // Canonical prerequisite precedence is a hard constraint, not a score that repetition can outweigh.
 const pending=new Set(selected.keys()),groupRank=new Map<string,number>();
 while(pending.size){
  const ready=[...pending].filter(id=>![...(dependencies.get(id)??[])].some(pre=>pending.has(pre)));
  if(!ready.length)throw new Error('Cyclic prerequisite evidence graph.');
  ready.sort((a,b)=>{const left=selected.get(a)!,right=selected.get(b)!;return priorityFor(right.group,evidence.now)+right.bonus-priorityFor(left.group,evidence.now)-left.bonus||stableCompare(a,b);});
  groupRank.set(ready[0],groupRank.size);pending.delete(ready[0]);
 }
 const candidates:Recommendation[]=[];
 for(const {group,bonus,extra} of selected.values()){
  const skill=group.skill,latest=group.latest,base=topicRoute(skill.subjectId,skill.topicId);
  const recent=group.recent.length;
  const reason=(recent?`${recent} incorrect ${recent===1?'submission':'submissions'} on ${skill.name} in the last 30 days.`:`An older incorrect submission on ${skill.name} remains in your history.`)
   +(group.repeatedPatterns[0]?` ${group.repeatedPatterns[0].count} exactly matched “${group.repeatedPatterns[0].label}” across ${group.repeatedPatterns[0].exercises} ${group.repeatedPatterns[0].exercises===1?'exercise':'exercises'}.`:'')
   +(group.laterSuccesses?` ${group.laterSuccesses} later correct ${group.laterSuccesses===1?'submission reduces':'submissions reduce'} its priority; the mistakes stay visible.`:'')+extra;
  const priority=priorityFor(group,evidence.now)+bonus;
  const add=(action:Action,adjust=0,detail='')=>candidates.push({...action,basisSkillId:skill.id,priority:priority+adjust,reason:reason+detail});
  const common={topicId:skill.topicId,subjectId:skill.subjectId,skillIds:[skill.id],durationSource:'Notedra estimate' as const};
  const retries=group.recent.filter(m=>m.exercise.id===latest.exercise.id).length;
  const reinforcement=retries>=3||group.laterSuccesses>0;
  add({...common,id:`learn:${skill.id}`,title:`Review ${skill.name}`,kind:'learn',minutes:5,to:base+'/learn'},reinforcement?8:-4,reinforcement?' Review the explanation before another familiar retry.':'');
  add({...common,id:`cards:${skill.id}`,title:`Recall ${skill.name}`,kind:'flashcards',minutes:5,to:base+'/flashcards'},-6);
  if(!reinforcement)add({...common,id:`retry:${latest.attempt.attemptId}`,title:`Retry: ${latest.exercise.title}`,kind:'retry',minutes:5,to:attemptPath(latest.exercise,latest.attempt.attemptId)},3,' Open the original result and choose Retry as new attempt.');
  const related=allExercises.filter(e=>e.id!==latest.exercise.id&&eligibleSkill(e)?.id===skill.id&&!group.successes.some(s=>s.exerciseId===e.id&&s.timestamp>=evidence.now-30*DAY)&&group.recent.filter(m=>m.exercise.id===e.id).length<3).sort((a,b)=>stableCompare(a.id,b.id));
  if(related[0])add({...common,id:`practice:${related[0].id}`,title:related[0].title,kind:'practice',minutes:8,to:exercisePath(related[0])},1,' Try a different fixed item on the same exact skill.');
  for(const action of authoredActions as Action[]){if(action.skillIds.includes(skill.id)&&action.subjectId===skill.subjectId)add(action,action.kind==='coding'&&options.minutes>=action.minutes&&action.minutes>=15?12+(action.minutes===options.minutes?2:0):reinforcement?5:-2,action.kind==='coding'||action.kind==='guided'||action.kind==='workspace'?' This is unscored reinforcement, not a test of mastery.':'');}
 }
 candidates.sort((a,b)=>groupRank.get(a.basisSkillId)!-groupRank.get(b.basisSkillId)!||b.priority-a.priority||stableCompare(a.id,b.id));
 const result:Recommendation[]=[];const used=new Set<string>(),perSkill=new Map<string,number>(),perKind=new Map<string,number>();let remaining=options.minutes;
 // Two passes: cover distinct evidence first, then allow one different reinforcement activity.
 for(const maxPerSkill of [1,2])for(const candidate of candidates){
  if(result.length>=4)break;
  if(used.has(candidate.to)||candidate.minutes>remaining||(perSkill.get(candidate.basisSkillId)??0)>=maxPerSkill||(perKind.get(candidate.kind)??0)>=2)continue;
  used.add(candidate.to);remaining-=candidate.minutes;result.push(candidate);perSkill.set(candidate.basisSkillId,(perSkill.get(candidate.basisSkillId)??0)+1);perKind.set(candidate.kind,(perKind.get(candidate.kind)??0)+1);
 }
 return result;
}
// Keep this public target tied to the established Assembly route, never an alternative workbench.
export const assemblyTarget=ASSEMBLY_TOOL_PATH;
