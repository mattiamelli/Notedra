import {conflict, emptyPayload, same, validatePayload, type LearnerPayload} from './model';
import type {UpcomingExam} from '../learning/contracts';

function mergeUpcoming(base: UpcomingExam[], local: UpcomingExam[], remote: UpcomingExam[]): UpcomingExam[] {
  const b = new Map(base.map(v => [v.id, v])), l = new Map(local.map(v => [v.id, v])), r = new Map(remote.map(v => [v.id, v]));
  return [...new Set([...b.keys(), ...l.keys(), ...r.keys()])].sort().flatMap(key => {
    const original = b.get(key), left = l.get(key), right = r.get(key);
    // Planning entries are mutable and deletable; submitted learning history is not.
    let chosen: UpcomingExam | undefined;
    if (same(left, right)) chosen = left;
    else if (same(original, left)) chosen = right;
    else if (same(original, right)) chosen = left;
    else conflict('Concurrent upcoming exam changes. Neither version was discarded.');
    return chosen ? [chosen] : [];
  });
}

type RecordValue = {revision: number; status?: string};
function locked(row: RecordValue): boolean {return row.status === 'SUBMITTED' || row.status === 'ABANDONED';}
function identity(row: RecordValue): unknown {
  const value = {...row} as Record<string, unknown>;
  // These are the only mutable lifecycle fields. Exact content/evaluator bindings stay in identity.
  for (const key of ['revision','status','answer','updatedAt','submission','responses','flagged','reviewedAt']) delete value[key];
  return value;
}
function descendant(base: RecordValue, next: RecordValue, label: string): void {
  if (same(base, next)) return;
  if (locked(base) || next.revision <= base.revision || !same(identity(base), identity(next))) conflict(`Conflicting ${label}. The saved history was preserved.`);
}
function mergeRecords<T extends RecordValue>(base: T[], local: T[], remote: T[], id: (v: T) => string, label: string): T[] {
  const b = new Map(base.map(v => [id(v), v])), l = new Map(local.map(v => [id(v), v])), r = new Map(remote.map(v => [id(v), v]));
  const keys = [...new Set([...b.keys(), ...l.keys(), ...r.keys()])].sort();
  return keys.map(key => {
    const original = b.get(key), left = l.get(key), right = r.get(key);
    if (original) {
      if (left) descendant(original, left, label);
      if (right) descendant(original, right, label);
    }
    // Absence is not deletion: a restored or empty device must not erase cloud history.
    if (!left) return right ?? original!;
    if (!right) return left;
    if (same(left, right)) return left;
    if (original && same(original, left)) return right;
    if (original && same(original, right)) return left;
    conflict(`Concurrent or incompatible ${label}. Export backups and review the conflicting records; neither version was discarded.`);
  });
}
/** Three-way merge. Revision numbers alone cannot prove a common ancestor. */
export function mergeLearner(base: LearnerPayload | null, local: LearnerPayload, remote: LearnerPayload): LearnerPayload {
  const ancestor = base ?? emptyPayload();
  [ancestor, local, remote].forEach(validatePayload);
  const result: LearnerPayload = {
    ...emptyPayload(),
    attempts: mergeRecords(ancestor.attempts, local.attempts, remote.attempts, a => a.attemptId, 'Practice attempt'),
    reviews: mergeRecords(ancestor.reviews, local.reviews, remote.reviews, r => r.attemptId, 'mistake review'),
    exams: mergeRecords(ancestor.exams, local.exams, remote.exams, e => e.sessionId, 'exam session'),
    examReviews: mergeRecords(ancestor.examReviews, local.examReviews, remote.examReviews, r => JSON.stringify([r.sessionId, r.itemId]), 'exam review'),
    upcomingExams: mergeUpcoming(ancestor.upcomingExams ?? [], local.upcomingExams ?? [], remote.upcomingExams ?? []),
  };
  validatePayload(result);
  return structuredClone(result);
}
