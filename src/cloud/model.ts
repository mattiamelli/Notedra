import {emptyBackup, LearningError, validateBackup, type Backup} from '../learning/contracts';

export const CLOUD_SCHEMA = 1 as const;
export type LearnerPayload = Omit<Backup, 'resume'>;
export interface CloudSnapshot {
  owner: string;
  revision: number;
  operationId: string;
  schema: typeof CLOUD_SCHEMA;
  payload: LearnerPayload;
}
export class SyncError extends Error {
  constructor(public readonly code: 'CONFLICT' | 'INVALID' | 'AUTH' | 'NETWORK' | 'CANCELLED', message: string) {
    super(message); this.name = 'SyncError';
  }
}
export function conflict(message: string): never {throw new SyncError('CONFLICT', message);}
export function checkOwner(owner: string): void {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(owner)) throw new SyncError('AUTH', 'Account identity is invalid.');
}
export function accountDatabase(owner: string): string {checkOwner(owner); return `delftstudy-account-${owner}-v1`;}
export function canonical(value: unknown): string {
  const sort = (v: unknown): unknown => Array.isArray(v) ? v.map(sort) : v && typeof v === 'object'
    ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([k, item]) => [k, sort(item)])) : v;
  return JSON.stringify(sort(value));
}
export const same = (a: unknown, b: unknown): boolean => canonical(a) === canonical(b);
export function projectLearner(backup: Backup): LearnerPayload {
  validateBackup(backup);
  // An explicit allowlist: navigation/resume and derived evidence never leave the device.
  return structuredClone({schemaVersion: backup.schemaVersion, content: backup.content, attempts: backup.attempts,
    reviews: backup.reviews, exams: backup.exams, examReviews: backup.examReviews});
}
export const emptyPayload = (): LearnerPayload => projectLearner(emptyBackup());
export function validatePayload(value: unknown): asserts value is LearnerPayload {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.hasOwn(value, 'resume')) throw new SyncError('INVALID', 'Invalid cloud learner data.');
  validateBackup({...value, resume: null});
}
export function validateSnapshot(value: unknown, owner: string): asserts value is CloudSnapshot {
  checkOwner(owner);
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new SyncError('INVALID', 'Invalid cloud snapshot.');
  const row = value as Record<string, unknown>;
  if (Object.keys(row).sort().join(',') !== 'operationId,owner,payload,revision,schema' || row.owner !== owner || row.schema !== CLOUD_SCHEMA
    || !Number.isSafeInteger(row.revision) || (row.revision as number) < 1 || typeof row.operationId !== 'string') throw new SyncError('INVALID', 'Incompatible cloud snapshot or account.');
  checkOwner(row.operationId); validatePayload(row.payload);
}
export function syncMessage(error: unknown): string {
  if (error instanceof SyncError) return error.message;
  if (error instanceof LearningError && error.code === 'CONFLICT') return 'Local data changed. Reload saved data and retry sync; your work is preserved.';
  return 'Sync failed. Local data is preserved. Check connectivity and storage, then retry.';
}
