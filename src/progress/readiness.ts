import {DAY,recency,difficultyWeight} from './mastery';
import type {EvidenceSnapshot,Readiness} from './types';
import {topicStudy} from '../topic-study/content';
export const requiredOpen:Record<string,readonly string[]>={
  CSE1400_CO:['boolean','stack','micro-schedule','interrupts','cache-reason','pipeline-reason','parallel','virtual'],
  CSE1300_RL:['formalization','countermodel','proof-method','induction','invariant','relations','tree','transfer'],
  CSE1100_IP:['model','parser','application','tests','equality','streams','worker']
};
export function examReadiness(courseId:string,evidence:EvidenceSnapshot,now:number):Readiness {
  const topics=topicStudy.topics.filter(t=>t.subjectId===courseId&&t.id!=='CO_T01_HISTORY');
  const observations=evidence.observations.filter(e=>e.courseId===courseId&&e.source!=='Normal practice');
  const recent=observations.filter(e=>e.timestamp>=now-90*DAY);
  const open=evidence.open.filter(e=>e.courseId===courseId&&e.timestamp>=now-90*DAY);
  const objectiveTopics=new Set(recent.map(e=>e.topicId)),practisedTopics=new Set([...objectiveTopics,...open.map(e=>e.topicId)]);
  const mechanisms=new Set(open.map(e=>e.mechanism));
  const sessions=new Set(recent.map(e=>e.session)),full=new Set(recent.filter(e=>e.source==='Full mock').map(e=>e.session));
  const integrated=[...new Set(open.filter(e=>e.integrated).map(e=>e.session))].some(id=>['model','parser','application','tests'].every(m=>open.some(e=>e.session===id&&e.integrated&&e.mechanism===m)));
  const required=requiredOpen[courseId]??[],missing=required.filter(m=>!mechanisms.has(m));
  const items=new Map<string,typeof observations[number]>();
  for(const e of observations){const previous=items.get(e.item);if(!previous||e.timestamp>previous.timestamp||(e.timestamp===previous.timestamp&&e.id<previous.id))items.set(e.item,e);}
  let earned=0,mass=0,freshness=0;
  for(const e of items.values()){const w=recency(e.timestamp,now)*difficultyWeight(e.difficulty)*(e.source==='Full mock'?1:0.6);earned+=(e.correct?1:0)*w;mass+=w;freshness+=recency(e.timestamp,now);}
  const gaps:string[]=[];
  if(!recent.length)gaps.push('Missing recent eligible exam-style objective evidence. Normal practice is not exam evidence.');
  if(sessions.size<2)gaps.push('At least two recent exam sessions are needed; one quick exam is insufficient.');
  if(!full.size)gaps.push('Missing recent full-mock objective evidence.');
  const breadth=topics.length?objectiveTopics.size/topics.length:0;
  if(breadth<0.6)gaps.push(`Missing objective breadth: ${objectiveTopics.size} / ${topics.length} canonical course topics represented recently.`);
  if(missing.length)gaps.push(`Missing recorded open practice: ${missing.join(', ')}.`);
  if(courseId==='CSE1100_IP'&&!integrated)gaps.push('Missing integrated programming practice: model + parsing + application + tests within one full mock.');
  const limited=evidence.limited.filter(e=>e.courseId===courseId).length;
  if(limited)gaps.push(`${limited} unresolved historical records limit evidence.`);
  gaps.push('Open reasoning/programming correctness remains unverified. Practice breadth cannot resolve this limitation.');
  const score=recent.length&&mass>1e-6?Math.round(100*earned/mass*Math.sqrt(breadth)*(freshness/items.size)):null;
  const cap=sessions.size<2?35:breadth<0.6?40:!full.size?45:60;
  const index=score===null?null:Math.min(cap,score);
  const confidence=index===null?'Insufficient':sessions.size>=2&&full.size>0&&breadth>=0.6&&!missing.length&&!limited&&(courseId!=='CSE1100_IP'||integrated)?'Moderate':'Low';
  return {courseId,index,confidence,objectiveTopics:objectiveTopics.size,practisedTopics:practisedTopics.size,totalTopics:topics.length,
    sessions:sessions.size,fullSessions:full.size,distinctItems:items.size,openMechanisms:mechanisms.size,
    openState:!open.length?'Limited':missing.length?'Practised':'Broadly practised',integrated,gaps,
    why:[`${items.size} distinct exact exam items; ${sessions.size} recent sessions including ${full.size} full mocks.`,
      'Latest result per exact item only. Full mock relevance 1.0; quick exam 0.6. Authored difficulty Easy 0.9, Medium 1.0, Hard 1.1; unknown 1.0.',
      'Objective weighted performance × square root of recent objective topic coverage × mean recency. Recency half-life 45 days; breadth window 90 days.',
      `Current breadth/session gates cap the index at ${cap}/100. Open practice adds no points. With ungraded required open work, confidence cannot exceed Moderate and index cannot exceed 60.`,
      'This is a DelftStudy evidence heuristic, not an official grade, pass probability or validated psychometric measure. Ephemeral Coding Workbench/open-guide activity is not recorded; its absence here does not prove no practice occurred.']};
}
