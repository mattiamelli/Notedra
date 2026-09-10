import {LearningError, validateAnswer, type Attempt} from '../learning/contracts';
import type {ExamReview, ExamSession, ItemBinding} from './types';
export const MAX_EXAMS = 250;
function invalid(message = 'Invalid exam data. No saved work was replaced.'): never {throw new LearningError('INVALID', message);}
function obj(value: unknown, keys: string[], optional: string[] = []): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) invalid();
  const r = value as Record<string, unknown>;
  if (keys.some(k => !Object.hasOwn(r, k)) || Object.keys(r).some(k => !keys.includes(k) && !optional.includes(k))) invalid();
  return r;
}
function text(value: unknown, max = 200): asserts value is string {if (typeof value !== 'string' || !value.length || value.length > max) invalid();}
function number(value: unknown, min: number, max = Number.MAX_SAFE_INTEGER): asserts value is number {if (!Number.isSafeInteger(value) || (value as number) < min || (value as number) > max) invalid();}
function time(value: unknown): asserts value is string {text(value, 24); if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString() !== value) invalid();}
function ref(value: unknown) {const r = obj(value, ['id', 'version']); text(r.id); text(r.version);}
export function answered(answer: ExamSession['responses'][number]['answer']): boolean {return typeof answer.value === 'string' ? answer.value.trim().length > 0 : answer.value.length > 0;}
export function validateExamSession(value: unknown): asserts value is ExamSession {
  const r = obj(value, ['sessionId','course','mode','blueprint','seed','items','durationMinutes','timingPolicy','scoringPolicy','startedAt','deadlineAt','updatedAt','revision','status','responses','flagged'], ['submission']);
  text(r.sessionId, 100); text(r.seed, 80); ref(r.blueprint);
  if (!['CSE1400_CO','CSE1300_RL','CSE1100_IP'].includes(r.course as string) || !['quick','full'].includes(r.mode as string)) invalid();
  if (r.timingPolicy !== 'ABSOLUTE_FREEZE_CONFIRM_V1' || r.scoringPolicy !== 'EXACT_COMPONENTS_OPEN_UNSCORED_V1') invalid();
  number(r.durationMinutes,1,240); number(r.revision,1); time(r.startedAt); time(r.deadlineAt); time(r.updatedAt);
  if (Date.parse(r.deadlineAt) - Date.parse(r.startedAt) !== r.durationMinutes * 60000 || r.updatedAt < r.startedAt) invalid();
  if (!Array.isArray(r.items) || !r.items.length || r.items.length > 64) invalid();
  const ids = new Map<string,ItemBinding>();
  for (const value of r.items) {
    const b = obj(value,['id','version','evaluator','weight','evaluation','responseType']); text(b.id); text(b.version); ref(b.evaluator); number(b.weight,1,100);
    if (!['DETERMINISTIC','RUBRIC'].includes(b.evaluation as string) || !['text','code','choice'].includes(b.responseType as string) || (b.responseType==='code' && b.evaluation!=='RUBRIC')) invalid();
    if(ids.has(b.id)) invalid('Duplicate exam component.'); ids.set(b.id,value as ItemBinding);
  }
  if (!Array.isArray(r.responses) || r.responses.length !== ids.size) invalid();
  const responses = new Map<string,boolean>();
  for (const value of r.responses) {const a=obj(value,['itemId','answer']); text(a.itemId);validateAnswer(a.answer);if(!ids.has(a.itemId)||responses.has(a.itemId)||ids.get(a.itemId)!.responseType!==a.answer.kind) invalid();responses.set(a.itemId,answered(a.answer));}
  if(!Array.isArray(r.flagged)||r.flagged.some(id=>!ids.has(id))||new Set(r.flagged).size!==r.flagged.length) invalid();
  if(r.status==='SUBMITTED') {
    const s=obj(r.submission,['operationId','submittedAt','evaluations','evidence']);text(s.operationId);time(s.submittedAt);if(s.submittedAt!==r.updatedAt)invalid();
    if(!Array.isArray(s.evaluations)||s.evaluations.length!==ids.size) invalid(); const seen=new Set<string>();
    for (const value of s.evaluations) {
      const e=obj(value,['itemId','status'],['earned','max','reason']);text(e.itemId);const b=ids.get(e.itemId);if(!b||seen.has(e.itemId)) invalid();seen.add(e.itemId);
      if(e.status==='AUTO_SCORED') {if(b.evaluation!=='DETERMINISTIC'||!responses.get(e.itemId)||'reason' in e) invalid();number(e.max,1,100);number(e.earned,0,e.max);if(e.max!==b.weight||![0,b.weight].includes(e.earned))invalid();}
      else {if(!['UNANSWERED','RUBRIC_REVIEW_REQUIRED','NOT_AUTOGRADABLE'].includes(e.status as string)||'earned' in e||'max' in e)invalid();text(e.reason,500);if((e.status==='UNANSWERED')===responses.get(e.itemId)|| (e.status==='RUBRIC_REVIEW_REQUIRED'&&b.evaluation!=='RUBRIC'))invalid();}
    }
    if(!Array.isArray(s.evidence)||s.evidence.length>ids.size)invalid();const evidenceIds=new Set<string>(),attemptIds=new Set<string>();
    for(const value of s.evidence){const e=obj(value,['itemId','attemptId']);text(e.itemId);text(e.attemptId);if(evidenceIds.has(e.itemId)||attemptIds.has(e.attemptId)||ids.get(e.itemId)?.evaluation!=='DETERMINISTIC'||!s.evaluations.some(v=>v.itemId===e.itemId&&v.status==='AUTO_SCORED'))invalid();evidenceIds.add(e.itemId);attemptIds.add(e.attemptId);}
  } else if(!['IN_PROGRESS','ABANDONED'].includes(r.status as string)||'submission' in r) invalid();
}
export function validateExamData(sessions: unknown, reviews: unknown, attempts: Attempt[]): asserts sessions is ExamSession[] {
  if(!Array.isArray(sessions)||sessions.length>MAX_EXAMS)invalid(`At most ${MAX_EXAMS} exam sessions are supported.`);
  sessions.forEach(validateExamSession);const checked=sessions as ExamSession[];const byId=new Map(checked.map(s=>[s.sessionId,s]));if(byId.size!==sessions.length)invalid('Duplicate exam session ID.');
  const linkedAttempts=new Set<string>();
  const operationIds=new Set(attempts.flatMap(a=>a.submission?[a.submission.operationId]:[])),attemptById=new Map(attempts.map(a=>[a.attemptId,a]));
  for(const session of checked){if(!session.submission)continue;const sub=session.submission;if(operationIds.has(sub.operationId))invalid('Duplicate exam submission operation.');operationIds.add(sub.operationId);
    for(const e of sub.evidence){if(linkedAttempts.has(e.attemptId))invalid('An evidence attempt can belong to only one exam component.');linkedAttempts.add(e.attemptId);const a=attemptById.get(e.attemptId);if(!a||a.status!=='SUBMITTED'||a.subjectId!==session.course||a.submission!.submittedAt!==sub.submittedAt||JSON.stringify(a.answer)!==JSON.stringify(session.responses.find(r=>r.itemId===e.itemId)!.answer))invalid('Exam evidence does not match its immutable submitted response.');}
  }
  if(!Array.isArray(reviews)||reviews.length>sessions.length*64)invalid();const seen=new Set<string>();
  for(const value of reviews){const r=obj(value,['sessionId','itemId','reviewedAt','revision']);text(r.sessionId);text(r.itemId);number(r.revision,1);if(r.reviewedAt!==null)time(r.reviewedAt);const session=byId.get(r.sessionId),key=JSON.stringify([r.sessionId,r.itemId]);if(seen.has(key)||session?.status!=='SUBMITTED'||!session.items.some(b=>b.id===r.itemId&&b.evaluation==='RUBRIC')||!session.responses.some(a=>a.itemId===r.itemId&&answered(a.answer)))invalid();seen.add(key);}
}
export type {ExamSession, ExamReview};
