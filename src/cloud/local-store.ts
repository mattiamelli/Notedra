import {IndexedStudentRepository, STUDENT_DB_VERSION} from '../learning/repository';
import {LearningError, toBackup, validateBackup, validateDataset, type Dataset, type LoadedState} from '../learning/contracts';
import {accountDatabase, checkOwner, conflict, projectLearner, same, validatePayload, validateSnapshot, type CloudSnapshot, type LearnerPayload} from './model';
import {mergeLearner} from './merge';

export interface PendingSync {operationId: string; expectedRevision: number; payload: LearnerPayload; local: Dataset;}
export interface SyncMetadata {schema: 1; owner: string; base: CloudSnapshot | null; pending: PendingSync | null;}
export interface LocalSyncState {data: Dataset; metadata: SyncMetadata;}
export interface SyncLocalStore {
  read(signal: AbortSignal): Promise<LocalSyncState>;
  prepare(expected: LocalSyncState, pending: PendingSync, signal: AbortSignal): Promise<void>;
  finish(pending: PendingSync, remote: CloudSnapshot, signal: AbortSignal, confirmedRestore?: Dataset): Promise<LoadedState>;
  release(pending: PendingSync, signal: AbortSignal): Promise<void>;
}
const KEY = 'cloud-sync-v1';
function checkMetadata(value: unknown, owner: string): asserts value is SyncMetadata {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new LearningError('INVALID', 'Invalid local sync journal.');
  const row = value as SyncMetadata;
  if (Object.keys(row).sort().join(',') !== 'base,owner,pending,schema' || row.schema !== 1 || row.owner !== owner) throw new LearningError('INVALID', 'Incompatible local sync journal.');
  if (row.base !== null) validateSnapshot(row.base, owner);
  if (row.pending !== null) {
    const p = row.pending;
    if (!p || Object.keys(p).sort().join(',') !== 'expectedRevision,local,operationId,payload' || !Number.isSafeInteger(p.expectedRevision) || p.expectedRevision < 0) throw new LearningError('INVALID', 'Invalid pending sync.');
    checkOwner(p.operationId); validatePayload(p.payload); validateDataset(p.local);
  }
}
const request = <T>(r: IDBRequest<T>) => new Promise<T>((resolve, reject) => {
  r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error);
});

/** Additional metadata in the existing store; Student Schema 3 / DB 4 and repository APIs stay unchanged. */
export class IndexedSyncStore implements SyncLocalStore {
  readonly name: string;
  constructor(readonly owner: string, private readonly factory: IDBFactory = globalThis.indexedDB) {this.name = accountDatabase(owner);}
  private async transaction<T>(signal: AbortSignal, work: (store: IDBObjectStore) => Promise<T>): Promise<T> {
    signal.throwIfAborted();
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const r = this.factory.open(this.name, STUDENT_DB_VERSION);
      r.onupgradeneeded = () => {r.transaction?.abort();};
      r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error);
      r.onblocked = () => reject(new LearningError('BLOCKED', 'Close older tabs before syncing.'));
    });
    let tx: IDBTransaction;
    try {signal.throwIfAborted(); tx = db.transaction('student', 'readwrite', {durability: 'strict'});} catch (error) {db.close(); throw error;}
    const cancel = () => {try {tx.abort();} catch {/* Already complete. */}};
    signal.addEventListener('abort', cancel, {once: true});
    const completed = new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error ?? new LearningError('STORAGE', 'Sync transaction aborted. No local changes were saved.'));
      tx.onerror = () => {};
    });
    void completed.catch(() => {});
    try {const value = await work(tx.objectStore('student')); await completed; return structuredClone(value);}
    catch (error) {cancel(); await completed.catch(() => {}); throw error;}
    finally {signal.removeEventListener('abort', cancel); db.close();}
  }
  private async state(store: IDBObjectStore): Promise<LocalSyncState> {
    const data: unknown = await request(store.get('active')); validateDataset(data);
    const metadata: unknown = await request(store.get(KEY)) ?? {schema: 1, owner: this.owner, base: null, pending: null};
    checkMetadata(metadata, this.owner);
    return {data, metadata};
  }
  async read(signal: AbortSignal): Promise<LocalSyncState> {
    const repo = new IndexedStudentRepository({factory: this.factory, name: this.name});
    try {await repo.load();} finally {repo.close();}
    return this.transaction(signal, store => this.state(store));
  }
  async prepare(expected: LocalSyncState, pending: PendingSync, signal: AbortSignal): Promise<void> {
    const copy = structuredClone(pending);
    checkMetadata({...expected.metadata, pending: copy}, this.owner);
    if (!same(copy.local, expected.data)) conflict('Sync snapshot differs from saved local data.');
    await this.transaction(signal, async store => {
      const state = await this.state(store);
      if (!same(state, expected) || state.metadata.pending !== null) conflict('Another tab changed data or started sync. Retry after reloading saved data.');
      await request(store.put({...state.metadata, pending: copy}, KEY));
    });
  }
  async finish(pending: PendingSync, remote: CloudSnapshot, signal: AbortSignal, confirmedRestore?: Dataset): Promise<LoadedState> {
    validateSnapshot(remote, this.owner);
    const restored=confirmedRestore?structuredClone(confirmedRestore):undefined;if(restored)validateDataset(restored);
    if (!same(remote.payload, pending.payload)) conflict('Cloud acknowledgement differs from the requested data.');
    return this.transaction(signal, async store => {
      const state = await this.state(store);
      if (!same(state.metadata.pending, pending)) conflict('Sync journal changed in another tab. Reload before retrying.');
      if (state.data.generation !== pending.local.generation && (!restored || !same(state.data,restored))) conflict('A backup was restored during sync. Local data and the pending sync are preserved for review.');
      const merged = mergeLearner(projectLearner(toBackup(pending.local)), projectLearner(toBackup(state.data)), remote.payload);
      const backup = {...merged, resume: state.data.resume}; validateBackup(backup);
      const changed = !same(backup, toBackup(state.data));
      const data = {...backup, generation: state.data.generation, revision: state.data.revision + (changed ? 1 : 0)}; validateDataset(data);
      // Recovery is owned by manual restore; sync never overwrites its pre-import snapshot.
      if (changed) await request(store.put(data, 'active'));
      await request(store.put({schema: 1, owner: this.owner, base: remote, pending: null} satisfies SyncMetadata, KEY));
      return {data, hasRecovery: (await request(store.get('recovery'))) !== undefined};
    });
  }
  async release(pending: PendingSync, signal: AbortSignal): Promise<void> {
    await this.transaction(signal, async store => {
      const state = await this.state(store);
      if (!same(state.metadata.pending, pending)) conflict('Sync journal changed in another tab.');
      await request(store.put({...state.metadata, pending: null}, KEY));
    });
  }
}
