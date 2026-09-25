import type {Backup} from '../learning/contracts';
import {resolveAttempt} from '../practice/service';
import {gradeResponse} from '../practice/runtime';
import {eligibleSkill, stableCompare} from '../adaptive/evidence';
import {explainAnswer} from '../enrichment/feedback';
import {resolveSession} from '../exams/engine';
import {practiceFor} from '../exams/evaluation';
import type {ExamBank, ExamItem, ExamSession} from '../exams/types';
import type {EvidenceSnapshot, Observation} from './types';

/** Reuse exact historical resolvers. A linked but unavailable exam never falls back to normal practice. */
export function collectEvidence(data: Backup, banks: readonly ExamBank[], now: number): EvidenceSnapshot {
  if (!Number.isFinite(now)) throw new Error('Progress needs a finite clock.');
  const result: EvidenceSnapshot = {observations: [], open: [], limited: []};
  const links = new Map<string, {session: ExamSession; item: ExamItem | null}>();
  for (const session of data.exams) {
    for (const e of session.submission?.evidence ?? []) {
      if (links.has(e.attemptId)) throw new Error('Duplicate exam evidence link.');
      links.set(e.attemptId, {session, item: null});
    }
    if (session.status !== 'SUBMITTED') continue;
    const bank = banks.find(b => b.course === session.course);
    const resolved = bank && resolveSession(session, bank);
    const time = Date.parse(session.submission!.submittedAt);
    if (!resolved || resolved.status !== 'AVAILABLE' || time > now) {
      result.limited.push({id: session.sessionId, courseId: session.course, skillIds: [], reason: 'Exact exam version unavailable or submission ahead of this clock.'});
      continue;
    }
    for (const item of resolved.items) {
      const response = session.responses.find(r => r.itemId === item.id)!;
      const evaluation = session.submission!.evaluations.find(e => e.itemId === item.id)!;
      const link = session.submission!.evidence.find(e => e.itemId === item.id);
      if (link) links.set(link.attemptId, {session, item});
      if (item.evaluation === 'RUBRIC' && evaluation.status === 'RUBRIC_REVIEW_REQUIRED' &&
          typeof response.answer.value === 'string' && response.answer.value.trim()) {
        result.open.push({courseId: session.course, topicId: item.topicId, mechanism: item.mechanism,
          session: session.sessionId, timestamp: time, integrated: !!item.context && session.mode === 'full',
          kind: item.context ? 'Authored integrated task' : 'Open/rubric practice'});
      }
    }
  }
  const seen = new Set<string>();
  for (const attempt of data.attempts) {
    if (seen.has(attempt.attemptId)) throw new Error('Duplicate attempt IDs cannot inflate progress.');
    seen.add(attempt.attemptId);
    if (attempt.status !== 'SUBMITTED') continue;
    const resolved = resolveAttempt(attempt);
    const limit = (reason: string) => result.limited.push({id: attempt.attemptId, courseId: attempt.subjectId, skillIds: attempt.targetedSkillIds, reason});
    if (resolved.status !== 'AVAILABLE') {limit(resolved.message); continue;}
    const e = resolved.exercise, skill = eligibleSkill(e), time = Date.parse(attempt.submission!.submittedAt);
    if (!skill) {limit('No eligible exact atomic skill mapping.'); continue;}
    if (time > now) {limit('Submission ahead of this clock.'); continue;}
    const grade = gradeResponse(e, attempt.answer);
    if (e.task.kind === 'curriculum' && e.task.format === 'open' && grade.status === 'NOT_AUTOGRADABLE') {
      result.open.push({courseId: e.subjectId, topicId: e.topicId, mechanism: e.skillId,
        session: attempt.attemptId, timestamp: time, integrated: false, kind: 'Open/rubric practice'});
      continue;
    }
    if (grade.status !== 'GRADED') {limit('No deterministic correctness result.'); continue;}
    let source: Observation['source'] = 'Normal practice', difficulty: Observation['difficulty'] = 'Unknown';
    let sessionId = attempt.attemptId;
    const link = links.get(attempt.attemptId);
    if (link || attempt.attemptId.startsWith('exam:')) {
      const item = link?.item, session = link?.session;
      const fixed = item && practiceFor(item);
      const evaluation = session?.submission?.evaluations.find(v => v.itemId === item?.id);
      const answer = session?.responses.find(r => r.itemId === item?.id)?.answer;
      if (!item || !session || !fixed || fixed.id !== e.id || session.course !== attempt.subjectId ||
          session.submission?.submittedAt !== attempt.submission!.submittedAt || answer?.kind !== attempt.answer.kind || JSON.stringify(answer?.value) !== JSON.stringify(attempt.answer.value) ||
          evaluation?.status !== 'AUTO_SCORED' || evaluation.max !== item.weight || evaluation.earned !== (grade.correct ? item.weight : 0)) {
        limit('Original exam component/evaluation binding unavailable or inconsistent.'); continue;
      }
      source = session.mode === 'full' ? 'Full mock' : 'Quick exam'; difficulty = item.difficulty; sessionId = session.sessionId;
    }
    const pattern = grade.correct ? null : explainAnswer(e, attempt.answer, grade)?.misconception?.label ?? null;
    result.observations.push({id: attempt.attemptId, item: e.id + '@' + attempt.exercise!.version, skillId: skill.id,
      topicId: skill.topicId, courseId: skill.subjectId, timestamp: time, correct: grade.correct, session: sessionId,
      source, difficulty, solutionViewed: attempt.solutionViewed, pattern});
  }
  result.observations.sort((a,b) => a.timestamp-b.timestamp || stableCompare(a.id,b.id));
  result.open.sort((a,b) => a.timestamp-b.timestamp || stableCompare(a.session+':'+a.mechanism,b.session+':'+b.mechanism));
  result.limited.sort((a,b) => stableCompare(a.id,b.id));
  return result;
}
