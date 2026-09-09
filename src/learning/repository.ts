import {
  CONTENT, LearningError, emptyBackup, migrateBackup, migrateDataset, toBackup, validateAttempt, validateBackup, validateDataset, validateResume,
  type Answer, type Attempt, type AttemptIdentity, type Backup, type Dataset, type LoadedState, type ResumePosition, type WriteToken,
} from './contracts';

export const STUDENT_DB_VERSION = 2;
export const STUDENT_DATABASE = 'delftstudy-student-v1';
export interface DraftInput extends AttemptIdentity { attemptId?: string; answer: Answer; hintsUsed?: number | null; solutionViewed?: boolean | null; }
export interface StudentRepository {
  load(): Promise<LoadedState>;
  saveResume(position: ResumePosition, expected: Dataset): Promise<LoadedState>;
  createDraft(input: DraftInput, expected: WriteToken): Promise<LoadedState>;
  editDraft(id: string, revision: number, answer: Answer, expected: WriteToken): Promise<LoadedState>;
  submit(id: string, revision: number, operationId: string, answer: Answer, expected: WriteToken): Promise<LoadedState>;
  abandon(id: string, revision: number, expected: WriteToken): Promise<LoadedState>;
  setReviewed(id: string, revision: number, reviewed: boolean, expected: WriteToken): Promise<LoadedState>;
  exportBackup(): Promise<Backup>;
  exportRecovery(): Promise<Backup>;
  restore(backup: unknown, expected: Dataset): Promise<LoadedState>;
  close(): void;
}
interface Options { name?: string; factory?: IDBFactory; now?: () => string; id?: () => string; }
const request = <T>(value: IDBRequest<T>) => new Promise<T>((resolve, reject) => {
  value.onsuccess = () => resolve(value.result);
  value.onerror = () => reject(value.error ?? new LearningError('STORAGE', 'IndexedDB request failed.'));
});
function conflict(message = 'Data changed in another tab. Reload saved data before making another change.'): never { throw new LearningError('CONFLICT', message); }
function same(left: unknown, right: unknown): boolean {
  // Canonical comparison also makes imported object-key ordering irrelevant to idempotency.
  const ordered = (value: unknown): unknown => Array.isArray(value) ? value.map(ordered) : value && typeof value === 'object'
    ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, ordered(item)])) : value;
  return JSON.stringify(ordered(left)) === JSON.stringify(ordered(right));
}
export class IndexedStudentRepository implements StudentRepository {
  private connection: Promise<IDBDatabase> | undefined;
  private closed = false;
  private readonly now: () => string;
  private readonly id: () => string;
  constructor(private readonly options: Options = {}) {
    this.now = options.now ?? (() => new Date().toISOString());
    this.id = options.id ?? (() => crypto.randomUUID());
  }
  private open(): Promise<IDBDatabase> {
    if (this.closed) return Promise.reject(new LearningError('UNAVAILABLE', 'Storage connection closed. Reload this page to reconnect.'));
    if (this.connection) return this.connection;
    this.connection = new Promise((resolve, reject) => {
      let opening: IDBOpenDBRequest;
      let rejected = false;
      let migrationFailure: unknown;
      try {
        const factory = this.options.factory ?? globalThis.indexedDB;
        if (!factory) throw new LearningError('UNAVAILABLE', 'Student storage is unavailable in this browser. Allow site storage and reload.');
        opening = factory.open(this.options.name ?? STUDENT_DATABASE, STUDENT_DB_VERSION);
      } catch (error) { reject(error); return; }
      opening.onupgradeneeded = event => {
        if ((event as IDBVersionChangeEvent).oldVersion === 0) { opening.result.createObjectStore('student'); return; }
        const tx = opening.transaction!;
        try {
          const store = tx.objectStore('student');
          // Both records and the DB version roll back together if either validation/write fails.
          for (const key of ['active', 'recovery']) {
            const read = store.get(key);
            read.onsuccess = () => {
              try {
                if (read.result === undefined && key === 'active') {
                  const count = store.count();
                  count.onsuccess = () => {
                    if (count.result > 0) {
                      migrationFailure = new LearningError('STORAGE', 'Incomplete legacy student storage. Migration was rolled back; recovery data was preserved.');
                      tx.abort();
                    }
                  };
                }
                if (read.result !== undefined) store.put(key === 'active' ? migrateDataset(read.result, this.id()) : migrateBackup(read.result), key);
              } catch (error) { migrationFailure = error; tx.abort(); }
            };
          }
        } catch (error) { migrationFailure = error; tx.abort(); }
      };
      opening.onblocked = () => {
        rejected = true;
        reject(new LearningError('BLOCKED', 'Storage upgrade is blocked by another tab. Close other DelftStudy tabs and reload.'));
      };
      opening.onerror = () => reject(migrationFailure ?? new LearningError(opening.error?.name === 'VersionError' ? 'INCOMPATIBLE' : 'STORAGE',
        opening.error?.name === 'VersionError' ? 'A newer student database exists. It was preserved; use a compatible application version.' : 'Cannot open student storage. Check browser permissions and reload.'));
      opening.onsuccess = () => {
        const db = opening.result;
        if (rejected || this.closed) { db.close(); reject(new LearningError('UNAVAILABLE', 'Storage connection was closed.')); return; }
        db.onversionchange = () => { db.close(); this.closed = true; };
        resolve(db);
      };
    });
    return this.connection;
  }
  private async transaction<T>(mode: IDBTransactionMode, work: (store: IDBObjectStore) => Promise<T>): Promise<T> {
    const db = await this.open();
    const tx = db.transaction('student', mode, mode === 'readwrite' ? {durability: 'strict'} : undefined);
    const finished = new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error ?? new LearningError('STORAGE', 'Student storage transaction was aborted. No changes were saved.'));
      tx.onerror = () => { /* Abort is the terminal failure signal; request failures propagate as well. */ };
    });
    // Observe immediately, including aborts that arrive before the request continuation.
    void finished.catch(() => {});
    try {
      const result = await work(tx.objectStore('student'));
      await finished;
      return structuredClone(result);
    } catch (error) {
      try { tx.abort(); } catch { /* Transaction already finished. */ }
      await finished.catch(() => {});
      throw error;
    }
  }
  private async read(store: IDBObjectStore): Promise<LoadedState> {
    const active: unknown = await request(store.get('active'));
    if (active === undefined) throw new LearningError('STORAGE', 'Student dataset is missing. Existing storage was preserved; restore from a compatible application or backup.');
    validateDataset(active);
    const recovery: unknown = await request(store.get('recovery'));
    if (recovery !== undefined) validateBackup(recovery);
    return {data: active, hasRecovery: recovery !== undefined};
  }
  load(): Promise<LoadedState> {
    return this.transaction('readwrite', async store => {
      const active: unknown = await request(store.get('active'));
      if (active === undefined) {
        // Only a genuinely empty store is a fresh installation; never replace partial/corrupt records.
        if (await request(store.count()) !== 0) throw new LearningError('STORAGE', 'Incomplete student storage. Data was preserved; no automatic reset was performed.');
        const data: Dataset = {...emptyBackup(), generation: this.id(), revision: 0};
        validateDataset(data); await request(store.add(data, 'active'));
      }
      return this.read(store);
    });
  }
  private mutate(expected: WriteToken, change: (state: LoadedState, store: IDBObjectStore) => void | Promise<void>): Promise<LoadedState> {
    return this.transaction('readwrite', async store => {
      const state = await this.read(store);
      if (state.data.generation !== expected.generation) conflict('This tab predates a backup restore. Reload saved data before writing.');
      await change(state, store);
      validateDataset(state.data);
      await request(store.put(state.data, 'active'));
      return state;
    });
  }
  async saveResume(position: ResumePosition, expected: Dataset) {
    const resume = structuredClone(position); validateResume(resume);
    return this.mutate(expected, state => {
      if (state.data.revision !== expected.revision) conflict();
      state.data.resume = resume; state.data.revision++;
    });
  }
  async createDraft(input: DraftInput, expected: WriteToken) {
    const {attemptId = this.id(), hintsUsed = null, solutionViewed = null, ...identity} = structuredClone(input);
    const timestamp = this.now();
    const attempt: Attempt = {...identity, attemptId, contentVersion: CONTENT.version, status: 'DRAFT', hintsUsed, solutionViewed, createdAt: timestamp, updatedAt: timestamp, revision: 1};
    validateAttempt(attempt);
    return this.mutate(expected, state => {
      const existing = state.data.attempts.find(item => item.attemptId === attemptId);
      if (existing) {
        const {createdAt: _created, updatedAt: _updated, ...stable} = attempt;
        const {createdAt: _oldCreated, updatedAt: _oldUpdated, ...oldStable} = existing;
        if (!same(stable, oldStable)) conflict('Attempt ID already exists with different content. A retry needs a new attempt ID.');
        return;
      }
      state.data.attempts.push(attempt); state.data.revision++;
    });
  }
  private draft(data: Dataset, id: string, revision: number): Attempt {
    const attempt = data.attempts.find(item => item.attemptId === id);
    if (!attempt || attempt.revision !== revision) conflict('Attempt revision changed or no longer exists. Reload before editing.');
    if (attempt.status !== 'DRAFT') conflict('Submitted and abandoned attempts cannot be edited. A retry creates a new attempt.');
    return attempt;
  }
  private touch(data: Dataset, attempt: Attempt) {
    attempt.updatedAt = [this.now(), attempt.updatedAt].sort().at(-1)!;
    attempt.revision++; data.revision++;
  }
  editDraft(id: string, revision: number, answer: Answer, expected: WriteToken) {
    const copy = structuredClone(answer);
    return this.mutate(expected, state => {
      const attempt = this.draft(state.data, id, revision);
      attempt.answer = copy; this.touch(state.data, attempt);
    });
  }
  submit(id: string, revision: number, operationId: string, answer: Answer, expected: WriteToken) {
    const copy = structuredClone(answer);
    return this.mutate(expected, state => {
      const existing = state.data.attempts.find(item => item.submission?.operationId === operationId);
      if (existing) {
        if (existing.attemptId === id && same(existing.answer, copy)) return;
        conflict('Submission operation ID already exists with different content.');
      }
      const attempt = this.draft(state.data, id, revision);
      attempt.answer = copy; this.touch(state.data, attempt);
      attempt.status = 'SUBMITTED'; attempt.submission = {operationId, submittedAt: attempt.updatedAt};
    });
  }
  abandon(id: string, revision: number, expected: WriteToken) {
    return this.mutate(expected, state => { const attempt = this.draft(state.data, id, revision); attempt.status = 'ABANDONED'; this.touch(state.data, attempt); });
  }
  setReviewed(id: string, revision: number, reviewed: boolean, expected: WriteToken) {
    return this.mutate(expected, state => {
      if (!state.data.attempts.some(attempt => attempt.attemptId === id && attempt.status === 'SUBMITTED')) conflict('The reviewed submission is unavailable.');
      const existing = state.data.reviews.find(review => review.attemptId === id);
      if ((existing?.revision ?? 0) !== revision) conflict('Review state changed in another tab. Reload before changing it.');
      const record = {attemptId: id, reviewedAt: reviewed ? this.now() : null, revision: revision + 1};
      if (existing) Object.assign(existing, record); else state.data.reviews.push(record);
      state.data.revision++;
    });
  }
  exportBackup() { return this.transaction('readonly', async store => toBackup((await this.read(store)).data)); }
  exportRecovery() {
    return this.transaction('readonly', async store => {
      const value: unknown = await request(store.get('recovery'));
      if (value === undefined) throw new LearningError('INVALID', 'No pre-restore recovery snapshot exists yet.');
      validateBackup(value); return value;
    });
  }
  async restore(backup: unknown, expected: Dataset) {
    const replacement = migrateBackup(backup);
    return this.mutate(expected, async (state, store) => {
      if (state.data.revision !== expected.revision) conflict('Saved data changed after the restore preview. Reload and review the backup again.');
      const generation = this.id();
      if (generation === state.data.generation) conflict('Could not create a new dataset generation. Retry the restore.');
      await request(store.put(toBackup(state.data), 'recovery'));
      state.data = {...replacement, generation, revision: 0}; state.hasRecovery = true;
    });
  }
  close() { this.closed = true; void this.connection?.then(db => db.close(), () => {}); }
}
