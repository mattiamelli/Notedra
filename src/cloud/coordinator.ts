import {toBackup, type LoadedState} from '../learning/contracts';
import {mergeLearner} from './merge';
import {CLOUD_SCHEMA, SyncError, checkOwner, emptyPayload, projectLearner, same, validateSnapshot, type CloudSnapshot, type LearnerPayload} from './model';
import type {PendingSync, SyncLocalStore} from './local-store';

export interface CloudRepository {
  read(signal: AbortSignal): Promise<unknown | null>;
  put(input: {expectedRevision: number; operationId: string; payload: LearnerPayload}, signal: AbortSignal): Promise<unknown>;
}
export interface SyncResult {state: LoadedState; status: 'Synced' | 'Pending';}
/** One coalesced pass, no retry loop. The caller owns auth epoch cancellation and user-visible retries. */
export class SyncCoordinator {
  private running: Promise<SyncResult> | null = null;
  constructor(private readonly owner: string, private readonly local: SyncLocalStore, private readonly cloud: CloudRepository,
    private readonly signal: AbortSignal, private readonly id: () => string = () => crypto.randomUUID()) {checkOwner(owner);}
  sync(): Promise<SyncResult> {
    return this.start(false);
  }
  /** Explicit user recovery action; normal sync never accepts a restore generation change. */
  reconcileRestoredData(): Promise<SyncResult> {return this.start(true);}
  private start(confirmedRestore:boolean):Promise<SyncResult> {
    if (this.running) return this.running;
    const pass = this.pass(confirmedRestore); this.running = pass;
    void pass.finally(() => {if (this.running === pass) this.running = null;}).catch(() => {});
    return pass;
  }
  private async pass(confirmedRestore:boolean): Promise<SyncResult> {
    this.signal.throwIfAborted();
    const local = await this.local.read(this.signal);
    let pending: PendingSync | null = local.metadata.pending, acknowledged: CloudSnapshot | null = null;
    if (!pending) {
      const remote = await this.cloud.read(this.signal); this.signal.throwIfAborted();
      if (remote !== null) validateSnapshot(remote, this.owner);
      if (local.metadata.base && (!remote || remote.revision < local.metadata.base.revision)) throw new SyncError('CONFLICT', 'Cloud history moved backwards or disappeared. Local history is preserved.');
      if (local.metadata.base && remote?.revision === local.metadata.base.revision && !same(remote, local.metadata.base)) throw new SyncError('INVALID', 'Cloud data changed without advancing its revision. Local history is preserved.');
      const payload = mergeLearner(local.metadata.base?.payload ?? null, projectLearner(toBackup(local.data)), remote?.payload ?? emptyPayload());
      pending = {operationId: this.id(), expectedRevision: remote?.revision ?? 0, payload, local: local.data};
      await this.local.prepare(local, pending, this.signal);
      if (remote && same(remote.payload, payload)) acknowledged = remote;
    }
    if (!acknowledged) {
      try {
        const result = await this.cloud.put({expectedRevision: pending.expectedRevision, operationId: pending.operationId, payload: pending.payload}, this.signal);
        this.signal.throwIfAborted(); validateSnapshot(result, this.owner);
        if (result.operationId !== pending.operationId || result.revision !== pending.expectedRevision + 1 || result.schema !== CLOUD_SCHEMA) throw new SyncError('INVALID', 'Cloud acknowledgement has an unexpected revision. Local data is preserved.');
        acknowledged = result;
      } catch (error) {
        // Only a definite stale-CAS rejection may release this operation. Unknown outcomes retain its stable ID.
        if (error instanceof SyncError && error.code === 'CONFLICT') await this.local.release(pending, this.signal);
        throw error;
      }
    }
    this.signal.throwIfAborted();
    const state = await this.local.finish(pending, acknowledged, this.signal, confirmedRestore?local.data:undefined);
    this.signal.throwIfAborted();
    return {state, status: same(projectLearner(toBackup(state.data)), acknowledged.payload) ? 'Synced' : 'Pending'};
  }
}
