import {validateExamData, type ExamSession, type ExamReview} from '../exams/records';
import references from '../generated/student-references.json';

export const STUDENT_SCHEMA_VERSION = 3 as const;
export const CONTENT = Object.freeze(references.content);
export const MAX_BACKUP_BYTES = 16_000_000;
export const MAX_ATTEMPTS = 5000;
export const MAX_UPCOMING_EXAMS = 50;
export interface UpcomingExam {id:string; name:string; examDate:string;}
export type ErrorCode = 'INVALID' | 'INCOMPATIBLE' | 'CONFLICT' | 'UNAVAILABLE' | 'BLOCKED' | 'STORAGE';
export class LearningError extends Error {
  constructor(public readonly code: ErrorCode, message: string) { super(message); this.name = 'LearningError'; }
}
export interface TopicIdentity { subjectId: string; topicId: string; }
export interface ResumePosition extends TopicIdentity { visitedAt: string; }
export type Answer = {kind: 'text' | 'code'; value: string} | {kind: 'choice'; value: string[]};
export interface AttemptIdentity extends TopicIdentity {
  subtopicId?: string;
  targetedSkillIds: string[];
  exercise?: {id: string; version: string};
  templateRef?: string;
  source?: {assessmentId: string; questionRef: string};
}
export interface Attempt extends AttemptIdentity {
  attemptId: string;
  contentVersion: string;
  status: 'DRAFT' | 'SUBMITTED' | 'ABANDONED';
  answer: Answer;
  hintsUsed: number | null;
  solutionViewed: boolean | null;
  createdAt: string;
  updatedAt: string;
  revision: number;
  submission?: {operationId: string; submittedAt: string};
}
export interface ReviewRecord { attemptId: string; reviewedAt: string | null; revision: number; }
export interface Backup {
  schemaVersion: typeof STUDENT_SCHEMA_VERSION;
  content: {version: string; fingerprint: string};
  resume: ResumePosition | null;
  attempts: Attempt[];
  reviews: ReviewRecord[];
  exams: ExamSession[];
  examReviews: ExamReview[];
  upcomingExams?: UpcomingExam[];
}
export interface Dataset extends Backup { generation: string; revision: number; }
export interface LoadedState { data: Dataset; hasRecovery: boolean; }
export interface WriteToken { generation: string; }
export const unassessed = () => ({status: 'UNASSESSED', reason: 'No evaluated evidence is available.'} as const);
// A trusted evaluator/resolver does not exist in Step 3. Raw records never grant evidence.
export const evidencePolicy = (_attempt: Attempt) => ({eligible: false, reason: 'UNASSESSED_REQUIRES_TRUSTED_EVALUATION'} as const);

function fail(message: string): never { throw new LearningError('INVALID', message); }
function object(value: unknown, required: string[], optional: string[] = []): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) fail('Expected a student-data object.');
  const row = value as Record<string, unknown>;
  if (required.some(key => !Object.hasOwn(row, key)) || Object.keys(row).some(key => !required.includes(key) && !optional.includes(key))) fail('Missing or unsupported student-data fields.');
  return row;
}
function string(value: unknown, max = 200): asserts value is string {
  if (typeof value !== 'string' || value.length === 0 || value.length > max) fail(`Expected nonempty text of at most ${max} characters.`);
}
function integer(value: unknown, min = 0): asserts value is number {
  if (!Number.isSafeInteger(value) || (value as number) < min) fail('Invalid revision or count.');
}
function timestamp(value: unknown): asserts value is string {
  string(value, 24);
  if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString() !== value) fail('Invalid timestamp.');
}
function strings(value: unknown, limit: number): asserts value is string[] {
  if (!Array.isArray(value) || value.length > limit) fail('Invalid or oversized list.');
  value.forEach(item => string(item));
  if (new Set(value).size !== value.length) fail('Duplicate identifiers are not allowed.');
}
export function validateTopic(value: TopicIdentity): void {
  if (!references.topics.some(topic => topic.id === value.topicId && topic.subject === value.subjectId)) fail('Unknown topic or incorrect course ownership.');
}
export function validateResume(value: unknown): asserts value is ResumePosition | null {
  if (value === null) return;
  const row = object(value, ['subjectId', 'topicId', 'visitedAt']);
  string(row.subjectId); string(row.topicId); timestamp(row.visitedAt);
  validateTopic({subjectId: row.subjectId, topicId: row.topicId});
}
export function validateAnswer(value: unknown): asserts value is Answer {
  const row = object(value, ['kind', 'value']);
  if (row.kind === 'choice') strings(row.value, 50);
  else if (row.kind === 'text' || row.kind === 'code') {
    if (typeof row.value !== 'string' || row.value.length > 16_000) fail('Answer exceeds 16,000 characters or is not text.');
  } else fail('Unsupported answer kind.');
}
export function validateAttempt(value: unknown): asserts value is Attempt {
  const row = object(value, ['attemptId', 'contentVersion', 'subjectId', 'topicId', 'targetedSkillIds', 'status', 'answer', 'hintsUsed', 'solutionViewed', 'createdAt', 'updatedAt', 'revision'], ['subtopicId', 'exercise', 'templateRef', 'source', 'submission']);
  string(row.attemptId); string(row.subjectId); string(row.topicId);
  if (row.contentVersion !== CONTENT.version) throw new LearningError('INCOMPATIBLE', 'Attempt uses an unsupported academic content version.');
  validateTopic({subjectId: row.subjectId, topicId: row.topicId});
  if ('subtopicId' in row && !references.subtopics.some(item => item.id === row.subtopicId && item.topic === row.topicId)) fail('Subtopic does not belong to this topic.');
  strings(row.targetedSkillIds, 147);
  for (const id of row.targetedSkillIds) {
    const skill = references.skills.find(item => item.id === id);
    const subtopic = references.subtopics.find(item => item.id === skill?.subtopic);
    if (!skill || subtopic?.topic !== row.topicId || ('subtopicId' in row && skill.subtopic !== row.subtopicId)) fail('Targeted skill does not belong to this topic/subtopic.');
  }
  if ('exercise' in row) { const exercise = object(row.exercise, ['id', 'version']); string(exercise.id); string(exercise.version); }
  if ('templateRef' in row) string(row.templateRef);
  if ('source' in row) {
    const source = object(row.source, ['assessmentId', 'questionRef']); string(source.assessmentId); string(source.questionRef);
    if (!references.questions.some(item => item.id === `${source.assessmentId}/${source.questionRef}` && item.subject === row.subjectId && item.topics.includes(row.topicId as string))) fail('Unknown source mapping or incorrect source ownership.');
  }
  validateAnswer(row.answer); integer(row.revision, 1); timestamp(row.createdAt); timestamp(row.updatedAt);
  if (row.updatedAt < row.createdAt) fail('Updated time precedes creation.');
  if (row.hintsUsed !== null) { integer(row.hintsUsed); if (row.hintsUsed > 10_000) fail('Hint count is too large.'); }
  if (row.solutionViewed !== null && typeof row.solutionViewed !== 'boolean') fail('Solution exposure must be known boolean or null.');
  if (row.status === 'SUBMITTED') {
    const submission = object(row.submission, ['operationId', 'submittedAt']); string(submission.operationId); timestamp(submission.submittedAt);
    if (submission.submittedAt !== row.updatedAt) fail('Submitted answer metadata is inconsistent.');
  } else if (row.status !== 'DRAFT' && row.status !== 'ABANDONED') fail('Unsupported attempt lifecycle.');
  else if ('submission' in row) fail('Only submitted attempts may contain submission metadata.');
}
export function validateBackup(value: unknown): asserts value is Backup {
  const row = object(value, ['schemaVersion', 'content', 'resume', 'attempts', 'reviews', 'exams', 'examReviews'], ['upcomingExams']);
  if (row.schemaVersion !== STUDENT_SCHEMA_VERSION) throw new LearningError('INCOMPATIBLE', 'Unsupported student schema version. Existing data has been preserved.');
  const content = object(row.content, ['version', 'fingerprint']);
  if (content.version !== CONTENT.version || content.fingerprint !== CONTENT.fingerprint) throw new LearningError('INCOMPATIBLE', 'Academic pack version/fingerprint differs. No data was replaced.');
  validateResume(row.resume);
  if (!Array.isArray(row.attempts) || row.attempts.length > MAX_ATTEMPTS) fail(`At most ${MAX_ATTEMPTS} attempts are supported.`);
  row.attempts.forEach(validateAttempt);
  const attempts = row.attempts as Attempt[];
  if (new Set(attempts.map(item => item.attemptId)).size !== attempts.length) fail('Duplicate attempt IDs.');
  const operations = attempts.flatMap(item => item.submission ? [item.submission.operationId] : []);
  if (new Set(operations).size !== operations.length) fail('Duplicate submission operation IDs.');
  if (!Array.isArray(row.reviews) || row.reviews.length > attempts.length) fail('Invalid review records.');
  const byId = new Map(attempts.map(attempt => [attempt.attemptId, attempt]));
  const reviewIds = new Set<string>();
  for (const value of row.reviews) {
    const review = object(value, ['attemptId', 'reviewedAt', 'revision']);
    string(review.attemptId); integer(review.revision, 1);
    if (review.reviewedAt !== null) timestamp(review.reviewedAt);
    if (byId.get(review.attemptId)?.status !== 'SUBMITTED') fail('Review references a missing or unsubmitted attempt.');
    if (reviewIds.has(review.attemptId)) fail('Duplicate review attempt IDs.');
    reviewIds.add(review.attemptId);
  }
  validateExamData(row.exams, row.examReviews, attempts);
  if (row.upcomingExams === undefined) row.upcomingExams=[];
  if (!Array.isArray(row.upcomingExams) || row.upcomingExams.length > MAX_UPCOMING_EXAMS) fail('Invalid or oversized upcoming exam list.');
  const ids = new Set<string>();
  for (const item of row.upcomingExams) { const exam = object(item, ['id','name','examDate']); string(exam.id, 100); string(exam.name, 120); if (ids.has(exam.id)) fail('Duplicate upcoming exam IDs.'); ids.add(exam.id); if (!/^\d{4}-\d{2}-\d{2}$/.test(exam.examDate as string)) fail('Exam date must be YYYY-MM-DD.'); const d = new Date(`${exam.examDate}T00:00:00`); if (Number.isNaN(d.getTime()) || d.toISOString().slice(0,10)!==exam.examDate) fail('Invalid exam date.'); }
  if (new TextEncoder().encode(JSON.stringify(value)).length > MAX_BACKUP_BYTES) fail('Student backup exceeds 16 MB.');
}
export function validateDataset(value: unknown): asserts value is Dataset {
  const row = object(value, ['schemaVersion', 'content', 'resume', 'attempts', 'reviews', 'exams', 'examReviews', 'generation', 'revision']);
  string(row.generation); integer(row.revision);
  const {generation: _generation, revision: _revision, ...backup} = row;
  validateBackup(backup);
}
export function toBackup(data: Dataset): Backup {
  const {generation: _generation, revision: _revision, ...backup} = data;
  validateBackup(backup);
  return structuredClone(backup);
}
export function parseBackup(text: string): Backup {
  if (new TextEncoder().encode(text).length > MAX_BACKUP_BYTES) fail('Student backup exceeds 16 MB.');
  let value: unknown;
  try { value = JSON.parse(text); } catch { fail('Backup is not valid JSON.'); }
  return migrateBackup(value);
}
export const emptyBackup = (): Backup => ({schemaVersion: STUDENT_SCHEMA_VERSION, content: {...CONTENT}, resume: null, attempts: [], reviews: [], exams: [], examReviews: [], upcomingExams: []});
export function errorMessage(error: unknown) {
  if (error instanceof LearningError) return error.message;
  return 'Local storage failed. Keep your backup, check browser storage permissions/space, and retry. Existing data was not reset.';
}

/** Strict preflight conversion; never mutates a supplied legacy backup or its attempts. */
export function migrateBackup(value: unknown): Backup {
  if (typeof value === 'object' && value !== null && 'schemaVersion' in value && value.schemaVersion === 1) {
    const legacy = object(value, ['schemaVersion', 'content', 'resume', 'attempts']);
    if (!Array.isArray(legacy.attempts) || legacy.attempts.length > 1000 || new TextEncoder().encode(JSON.stringify(value)).length > 4_000_000) fail('Legacy backup exceeds Schema 1 limits.');
    const upgraded = {...structuredClone(legacy), schemaVersion: STUDENT_SCHEMA_VERSION, reviews: [], exams: [], examReviews: [], upcomingExams: []};
    validateBackup(upgraded);
    return upgraded;
  }
  if (typeof value === 'object' && value !== null && 'schemaVersion' in value && (value.schemaVersion === 2 || value.schemaVersion === 3)) {
    if (value.schemaVersion === 3) { const legacy = object(value, ['schemaVersion','content','resume','attempts','reviews','exams','examReviews']); const upgraded = {...structuredClone(legacy), schemaVersion: STUDENT_SCHEMA_VERSION, upcomingExams: []}; validateBackup(upgraded); return upgraded; }
    const legacy = object(value, ['schemaVersion','content','resume','attempts','reviews']);
    const upgraded = {...structuredClone(legacy), schemaVersion: STUDENT_SCHEMA_VERSION, exams: [], examReviews: [], upcomingExams: []};
    validateBackup(upgraded); return upgraded;
  }
  validateBackup(value);
  return structuredClone(value);
}
export function migrateDataset(value: unknown, newGeneration: string): Dataset {
  if (typeof value === 'object' && value !== null && 'schemaVersion' in value && (value.schemaVersion === 1 || value.schemaVersion === 2 || value.schemaVersion === 3)) {
    if (value.schemaVersion === 3) { const row = object(value, ['schemaVersion','content','resume','attempts','reviews','exams','examReviews','generation','revision']); string(row.generation); integer(row.revision); const {generation: _g, revision, ...backup} = row; const upgraded = {...migrateBackup(backup), generation:newGeneration, revision}; validateDataset(upgraded); return upgraded; }
    const row = object(value, ['schemaVersion', 'content', 'resume', 'attempts', ...(value.schemaVersion === 2 ? ['reviews'] : []), 'generation', 'revision']);
    string(row.generation); integer(row.revision); string(newGeneration);
    if (row.generation === newGeneration) throw new LearningError('CONFLICT', 'Migration needs a new dataset generation.');
    const {generation: _generation, revision, ...backup} = row;
    const upgraded = {...migrateBackup(backup), generation: newGeneration, revision};
    validateDataset(upgraded);
    return upgraded;
  }
  validateDataset(value);
  return structuredClone(value);
}
