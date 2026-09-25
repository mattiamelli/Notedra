import ipProfiles from '../ip/feedback.json';
import ipMisconceptions from '../ip/misconceptions.json';
import type {Answer} from '../learning/contracts';
import type {GradeResult} from '../practice/types';
import type {PracticeExercise} from '../practice/registered-types';
import {versionBinding} from '../practice/catalog';
import {tupleAnswer} from './grading';
import profiles from './feedback.json';
import misconceptions from './misconceptions.json';
import type {FeedbackProfile,Misconception} from './types';
export interface Explanation {why:string;reasoning:string;remember:string;profileId:string|null;version:string|null;misconception:Misconception|null;evidenceIds:string[];}
/** Normalize only declared response tokens, never formulas or open reasoning. */
export function patternKey(exercise:PracticeExercise,value:string):string|null {
 const s=value.trim();if(s.length>2048)return null;
 const task=exercise.task;
 if(task.kind==='ip-fixed')return task.options.some(o=>o.id===s)?s:null;
 if(task.kind==='enrichment-exact')return tupleAnswer(s,task.parts);
 if(task.kind==='co-exact'||task.kind==='rl-exact'){
  if(task.format==='binary')return /^[01]+$/.test(s)&&s.length===task.width?s:null;
  if(task.format==='hex')return /^[0-9a-f]+$/i.test(s)&&s.length===task.width?s.toLowerCase():null;
  if(task.format==='integer')return /^-?\d{1,64}$/.test(s)?BigInt(s).toString():null;
  if(task.format==='integer-set'){
   if(!/^\{.*\}$/.test(s))return null;const tokens=s.slice(1,-1).trim();if(!tokens)return '{}';
   const values=tokens.split(',').map(t=>t.trim());if(values.length>32||values.some(t=>! /^-?\d{1,64}$/.test(t)))return null;
   return '{'+[...new Set(values.map(t=>BigInt(t).toString()))].sort().join(',')+'}';
  }
 }
 return s;
}
export function explainAnswer(exercise:PracticeExercise,answer:Answer,result:GradeResult):Explanation|null {
 if(result.status!=='GRADED')return null;
 const profile=([...profiles,...ipProfiles] as FeedbackProfile[]).find(p=>p.exerciseId===exercise.id&&p.binding===versionBinding(exercise));
 if(!profile)return {why:result.correct?(exercise.task.kind==='curriculum'?'Your response matches the authored reference.':'Your response matches the independently checked reference.'):'Your response differs from the reference. Compare your result with the steps below; no specific misconception is inferred.',reasoning:result.explanation,remember:exercise.rules,profileId:null,version:null,misconception:null,evidenceIds:[]};
 const key=answer.kind==='text'?patternKey(exercise,answer.value):exercise.task.kind==='ip-fixed'&&answer.kind==='choice'&&answer.value.length===1?patternKey(exercise,answer.value[0]):null;
 const path=!result.correct&&key!==null?profile.paths.find(p=>patternKey(exercise,p.answer)===key):undefined;
 return {why:result.correct?'Your response matches the reference. The reasoning below explains why.':path?.why??profile.fallback,reasoning:profile.reasoning,remember:profile.remember,profileId:profile.id,version:profile.version,misconception:path?([...misconceptions,...ipMisconceptions] as Misconception[]).find(m=>m.id===path.misconceptionId)??null:null,evidenceIds:profile.evidenceIds};
}
