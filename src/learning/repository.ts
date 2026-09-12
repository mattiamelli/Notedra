import type {ExamBank, ExamResponse, ExamSession} from '../exams/types';
import {validateExamSession} from '../exams/records';
import {
  CONTENT, LearningError, emptyBackup, migrateBackup, migrateDataset, toBackup, validateAttempt, validateBackup, validateDataset, validateResume,
  type Answer, type Attempt, type AttemptIdentity, type Backup, type Dataset, type LoadedState, type ResumePosition, type WriteToken, type UpcomingExam,
} from './contracts';

export const STUDENT_DB_VERSION = 4;
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
  startExam(bank: ExamBank, blueprintId: string, seed: string, sessionId: string, expected: WriteToken): Promise<LoadedState>;
  saveExam(id: string, revision: number, responses: ExamResponse[], flagged: string[], expected: WriteToken): Promise<LoadedState>;
  submitExam(snapshot: ExamSession, operationId: string, bank: ExamBank, expected: WriteToken): Promise<LoadedState>;
  abandonExam(id: string, revision: number, expected: WriteToken): Promise<LoadedState>;
  reviewExam(id: string, itemId: string, revision: number, reviewed: boolean, expected: WriteToken): Promise<LoadedState>;
  addUpcomingExam(exam: UpcomingExam, expected: WriteToken): Promise<LoadedState>;
  updateUpcomingExam(exam: UpcomingExam, expected: WriteToken): Promise<LoadedState>;
  deleteUpcomingExam(id: string, expected: WriteToken): Promise<LoadedState>;
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
  private validateUpcoming(exam: UpcomingExam) { const value=structuredClone(exam); if(!value.id||!value.name.trim()||value.name.trim().length>120||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value.examDate)) throw new LearningError('INVALID','Enter an exam name and a valid date.'); return {...value,name:value.name.trim()}; }
  addUpcomingExam(exam: UpcomingExam, expected: WriteToken) { const value=this.validateUpcoming(exam); return this.mutate(expected,state=>{const list=state.data.upcomingExams??(state.data.upcomingExams=[]);if(list.some(e=>e.id===value.id)) conflict('Exam ID already exists.'); list.push(value); state.data.revision++;}); }
  updateUpcomingExam(exam: UpcomingExam, expected: WriteToken) { const value=this.validateUpcoming(exam); return this.mutate(expected,state=>{const list=state.data.upcomingExams??[];const i=list.findIndex(e=>e.id===value.id); if(i<0) conflict('Exam no longer exists.'); list[i]=value; state.data.upcomingExams=list; state.data.revision++;}); }
  deleteUpcomingExam(id: string, expected: WriteToken) { return this.mutate(expected,state=>{const list=state.data.upcomingExams??[];const i=list.findIndex(e=>e.id===id); if(i>=0){list.splice(i,1);state.data.upcomingExams=list;state.data.revision++;}}); }
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
  async startExam(bank: ExamBank, blueprintId: string, seed: string, sessionId: string, expected: WriteToken) {
    const copy = structuredClone(bank);
    const {startSession} = await import('../exams/engine');
    return this.mutate(expected, state => {
      if (state.data.exams.some(s => s.sessionId === sessionId)) conflict('Exam session ID already exists. A retake needs a new session.');
      const blueprint = copy.blueprints.find(b => b.id === blueprintId);
      if (!blueprint) throw new LearningError('INCOMPATIBLE', 'Exam blueprint unavailable.');
      state.data.exams.push(startSession(blueprint, copy, seed, sessionId, Date.parse(this.now()))); state.data.revision++;
    });
  }
  private exam(data: Dataset, id: string, revision: number): ExamSession {
    const session = data.exams.find(s => s.sessionId === id);
    if (!session || session.revision !== revision) conflict('Exam changed in another tab. Reload saved data before writing.');
    if (session.status !== 'IN_PROGRESS') conflict('Submitted or abandoned exams are locked. Start a new exam to retry.');
    return session;
  }
  saveExam(id: string, revision: number, responses: ExamResponse[], flagged: string[], expected: WriteToken) {
    const copy = structuredClone({responses, flagged});
    return this.mutate(expected, state => {
      const session = this.exam(state.data, id, revision);
      const now = [this.now(), session.updatedAt].sort().at(-1)!;
      if (now >= session.deadlineAt) conflict('Time has expired. Your previously saved responses are preserved. Confirm submission to finish.');
      session.responses = copy.responses; session.flagged = copy.flagged;
      session.updatedAt = now; session.revision++; state.data.revision++;
    });
  }
  async submitExam(snapshot: ExamSession, operationId: string, bank: ExamBank, expected: WriteToken) {
    const original = structuredClone(snapshot), content = structuredClone(bank); validateExamSession(original);
    // Loading code happens before opening the transaction; no network/async gaps inside the write scope.
    const {evaluateSubmission} = await import('../exams/evaluation');
    return this.mutate(expected, state => {
      const used = state.data.exams.find(s => s.submission?.operationId === operationId);
      if (used) {
        if (same(used, {...original, status: used.status, revision: used.revision, updatedAt: used.updatedAt, submission: used.submission})) return;
        conflict('Exam submission operation already exists with conflicting content.');
      }
      if (state.data.attempts.some(a => a.submission?.operationId === operationId)) conflict('Submission operation ID is already used.');
      const session = this.exam(state.data, original.sessionId, original.revision);
      if (!same(session, original)) conflict('The submitted exam snapshot differs from saved data. Reload before submitting.');
      const submittedAt = [this.now(),session.updatedAt].sort().at(-1)!;
      const {evaluations, attempts, evidence} = evaluateSubmission(session, content, submittedAt);
      session.status = 'SUBMITTED'; session.updatedAt = submittedAt; session.revision++;
      session.submission = {operationId, submittedAt, evaluations, evidence};
      state.data.attempts.push(...attempts); state.data.revision++;
    });
  }
  abandonExam(id: string, revision: number, expected: WriteToken) {
    return this.mutate(expected, state => {const session = this.exam(state.data,id,revision); session.status='ABANDONED';session.updatedAt=[this.now(),session.updatedAt].sort().at(-1)!;session.revision++;state.data.revision++;});
  }
  reviewExam(id: string, itemId: string, revision: number, reviewed: boolean, expected: WriteToken) {
    return this.mutate(expected,state=>{
      const existing=state.data.examReviews.find(r=>r.sessionId===id&&r.itemId===itemId);
      if ((existing?.revision??0)!==revision) conflict('Exam review changed in another tab. Reload before changing it.');
      const record={sessionId:id,itemId,revision:revision+1,reviewedAt:reviewed?this.now():null};
      if(existing)Object.assign(existing,record);else state.data.examReviews.push(record);
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
