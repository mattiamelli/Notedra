import {LearningError} from '../learning/contracts';
import {answered, validateExamSession} from './records';
import type {Blueprint, ExamBank, ExamItem, ExamReview, ExamSession, ItemBinding} from './types';
export const timing = (session: ExamSession, now: number) => {
  if (!Number.isFinite(now)) throw new LearningError('INVALID','Clock is unavailable.');
  const remainingMs = Math.max(0, Math.min(session.durationMinutes*60000, Date.parse(session.deadlineAt)-now));
  return {remainingMs, expired: now >= Date.parse(session.deadlineAt)};
};
export function selectItems(blueprint: Blueprint, bank: ExamBank, seed: string): ExamItem[] {
  if (!seed.length || seed.length>80 || blueprint.course!==bank.course) throw new LearningError('INVALID','Invalid exam configuration.');
  const index=new Map(bank.items.map(i=>[`${i.id}@${i.version}`,i]));
  // Stable FNV-1a selection per ordered slot; no random generation or difficulty ordering claims.
  let hash=2166136261; for(const char of seed) hash=Math.imul(hash^char.charCodeAt(0),16777619)>>>0;
  const selected=blueprint.slots.map((slot,n)=>{const ref=slot.candidates[(hash+n)%slot.candidates.length];const item=ref&&index.get(`${ref.id}@${ref.version}`);if(!item)throw new LearningError('INCOMPATIBLE','Exact exam component version is unavailable.');return item;});
  if(new Set(selected.map(i=>i.id)).size!==selected.length||new Set(selected.map(i=>i.mechanism)).size!==selected.length)throw new LearningError('INVALID','Exam contains duplicate components or mechanisms.');
  const topics=new Map<string,number>();for(const i of selected)topics.set(i.topicId,(topics.get(i.topicId)??0)+1);
  if(blueprint.constraints.topics.some(t=>!topics.has(t))||selected.filter(i=>i.evaluation==='RUBRIC').length<blueprint.constraints.minOpen||[...topics.values()].some(n=>n>blueprint.constraints.maxPerTopic))throw new LearningError('INVALID','Exam coverage constraints are not satisfied.');
  return selected;
}
export const bindItem=(item:ExamItem):ItemBinding=>({id:item.id,version:item.version,evaluator:{...item.evaluator},weight:item.weight,evaluation:item.evaluation,responseType:item.responseType});
export function startSession(blueprint:Blueprint,bank:ExamBank,seed:string,sessionId:string,now:number):ExamSession {
  const items=selectItems(blueprint,bank,seed).map(bindItem),startedAt=new Date(now).toISOString();
  const session:ExamSession={sessionId,course:blueprint.course,mode:blueprint.mode,blueprint:{id:blueprint.id,version:blueprint.version},seed,items,durationMinutes:blueprint.durationMinutes,timingPolicy:blueprint.timingPolicy,scoringPolicy:blueprint.scoringPolicy,startedAt,deadlineAt:new Date(now+blueprint.durationMinutes*60000).toISOString(),updatedAt:startedAt,revision:1,status:'IN_PROGRESS',responses:items.map(i=>({itemId:i.id,answer:i.responseType==='choice'?{kind:'choice',value:[]}:{kind:i.responseType,value:''}})),flagged:[]};validateExamSession(session);return session;
}
export function resolveSession(session:ExamSession,bank:ExamBank):{status:'AVAILABLE';items:ExamItem[];blueprint:Blueprint}|{status:'UNAVAILABLE';message:string} {
  try {
    validateExamSession(session);const blueprint=bank.blueprints.find(b=>b.id===session.blueprint.id&&b.version===session.blueprint.version);
    if(!blueprint||session.course!==bank.course||session.course!==blueprint.course||blueprint.durationMinutes!==session.durationMinutes||blueprint.mode!==session.mode||blueprint.scoringPolicy!==session.scoringPolicy||blueprint.timingPolicy!==session.timingPolicy)throw Error();
    const items=selectItems(blueprint,bank,session.seed);
    if(JSON.stringify(items.map(bindItem))!==JSON.stringify(session.items))throw Error();
    return {status:'AVAILABLE',items,blueprint};
  } catch {return {status:'UNAVAILABLE',message:'The exact historical exam, question or evaluator version is unavailable. Saved responses are preserved; this session cannot be edited or regraded.'};}
}
export function summary(session:ExamSession,reviews:ExamReview[]=[]) {
  const answeredCount=session.responses.filter(r=>answered(r.answer)).length;
  const auto=session.items.filter(i=>i.evaluation==='DETERMINISTIC');
  const open=session.items.filter(i=>i.evaluation==='RUBRIC');
  const pending=open.filter(i=>session.responses.some(r=>r.itemId===i.id&&answered(r.answer))&&!reviews.some(r=>r.sessionId===session.sessionId&&r.itemId===i.id&&r.reviewedAt!==null));
  return {answered:answeredCount,unanswered:session.items.length-answeredCount,flagged:session.flagged.length,open:open.length,
    autoMax:auto.reduce((sum,i)=>sum+i.weight,0),autoEarned:session.submission?.evaluations.reduce((sum,e)=>sum+(e.status==='AUTO_SCORED'?e.earned:0),0)??0,
    openWeight:open.reduce((sum,i)=>sum+i.weight,0),openRemaining:pending.length,pendingWeight:pending.reduce((sum,i)=>sum+i.weight,0)};
}
