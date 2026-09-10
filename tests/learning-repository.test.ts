import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { emptyBackup, toBackup } from '../src/learning/contracts';
import { IndexedStudentRepository } from '../src/learning/repository';
import { answer, attempt, position, rawRead, rawWrite, repository, topic } from './helpers/learning';

afterEach(() => vi.restoreAllMocks());
describe('transactional student repository (fake-indexeddb)', () => {
  it('initializes fresh storage and survives a new repository/remount without empty-default overwrite', async () => {
    const factory = new IDBFactory(); const first = repository(factory);
    const start = await first.load(); expect(start.data.attempts).toEqual([]);
    await first.saveResume(position, start.data); first.close();
    const second = repository(factory); expect((await second.load()).data.resume).toEqual(position);
    await Promise.all([second.load(), repository(factory).load()]);
    expect((await second.load()).data.resume).toEqual(position);
  });
  it('preserves distinct concurrent writes and rejects stale draft revisions', async () => {
    const factory = new IDBFactory(); const a = repository(factory); const b = repository(factory);
    const start = await a.load();
    await Promise.all([a.createDraft({...topic, targetedSkillIds: [], answer, attemptId: 'a'}, start.data), b.createDraft({...topic, targetedSkillIds: [], answer, attemptId: 'b'}, start.data)]);
    expect((await a.load()).data.attempts).toHaveLength(2);
    await a.editDraft('a', 1, {kind: 'text', value: 'new'}, start.data);
    await expect(b.editDraft('a', 1, answer, start.data)).rejects.toMatchObject({code: 'CONFLICT'});
    expect((await a.load()).data.attempts[0].answer.value).toBe('new');
  });
  it('identical submissions are idempotent; conflicting IDs and edits never rewrite submitted answers', async () => {
    const repo = repository(); const start = await repo.load();
    const input = {...topic, targetedSkillIds: [], answer, attemptId: 'a'};
    await repo.createDraft(input, start.data); await repo.createDraft(input, start.data);
    await expect(repo.createDraft({...input, topicId: 'MISSING'}, start.data)).rejects.toMatchObject({code: 'INVALID'});
    const submitted = await repo.submit('a', 1, 'submit-1', answer, start.data);
    expect(await repo.submit('a', 1, 'submit-1', {value: answer.value, kind: 'text'}, start.data)).toEqual(submitted);
    await expect(repo.submit('a', 1, 'submit-1', {kind: 'text', value: 'conflicting'}, start.data)).rejects.toMatchObject({code: 'CONFLICT'});
    await expect(repo.editDraft('a', 2, answer, start.data)).rejects.toMatchObject({code: 'CONFLICT'});
    await expect(repo.abandon('a', 2, start.data)).rejects.toMatchObject({code: 'CONFLICT'});
    await repo.createDraft({...input, attemptId: 'retry'}, start.data);
    await expect(repo.submit('retry', 1, 'submit-1', answer, start.data)).rejects.toMatchObject({code: 'CONFLICT'});
    expect((await repo.load()).data.attempts[0]).toEqual(submitted.data.attempts[0]);
    expect((await repo.load()).data.attempts).toHaveLength(2);
  });
  it('abandons only drafts and prevents reassignment of an existing attempt ID', async () => {
    const repo = repository(); const {data} = await repo.load(); const input = {...topic, targetedSkillIds: [], answer, attemptId: 'a'};
    await repo.createDraft(input, data);
    await expect(repo.createDraft({...input, answer: {kind: 'text', value: 'other'}}, data)).rejects.toMatchObject({code: 'CONFLICT'});
    await repo.abandon('a', 1, data);
    await expect(repo.submit('a', 2, 'op', answer, data)).rejects.toMatchObject({code: 'CONFLICT'});
  });
  it('acknowledges writes only after transaction completion and propagates abort after request success', async () => {
    const repo = repository(); const {data} = await repo.load(); const original = IDBObjectStore.prototype.put;
    let requestSucceeded = false; let completed = false;
    const spy = vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(function (this: IDBObjectStore, value, key) {
      const req = original.call(this, value, key); this.transaction.addEventListener('complete', () => { completed = true; });
      req.addEventListener('success', () => { requestSucceeded = true; this.transaction.abort(); }); return req;
    });
    await expect(repo.saveResume(position, data)).rejects.toMatchObject({code: 'STORAGE'});
    expect(requestSucceeded).toBe(true); expect(completed).toBe(false); spy.mockRestore();
    expect((await repo.load()).data).toEqual(data);
    vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(function (this: IDBObjectStore, value, key) {
      this.transaction.addEventListener('complete', () => { completed = true; }); return original.call(this, value, key);
    });
    await repo.saveResume(position, data); expect(completed).toBe(true);
  });
  it('exports a consistent snapshot and atomically replaces with recoverable previous data', async () => {
    const repo = repository(); const start = await repo.load(); const saved = await repo.saveResume(position, start.data);
    const replacement = {...emptyBackup(), attempts: [attempt()]};
    const restored = await repo.restore(replacement, saved.data);
    expect(await repo.exportBackup()).toEqual(replacement); expect(await repo.exportRecovery()).toEqual(toBackup(saved.data));
    expect(restored.hasRecovery).toBe(true); expect(restored.data.generation).not.toBe(saved.data.generation);
    await repo.restore(await repo.exportRecovery(), restored.data);
    expect(await repo.exportBackup()).toEqual(toBackup(saved.data));
  });
  it('rejects malformed imports before writes without changing active or recovery data', async () => {
    const repo = repository(); const start = await repo.load();
    await expect(async () => repo.restore({...emptyBackup(), attempts: [attempt({subjectId: 'wrong'})]}, start.data)).rejects.toMatchObject({code: 'INVALID'});
    await expect(async () => repo.restore({...emptyBackup(), attempts: [attempt(), attempt()]}, start.data)).rejects.toMatchObject({code: 'INVALID'});
    expect(await repo.load()).toEqual(start);
  });
  it('rolls back both active and recovery after an abort during replacement', async () => {
    const repo = repository(); const start = await repo.load(); const prior = await repo.restore({...emptyBackup(), resume: position}, start.data);
    const recoveryBefore = await repo.exportRecovery(); const original = IDBObjectStore.prototype.put;
    const spy = vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(function (this: IDBObjectStore, value, key) {
      const req = original.call(this, value, key); if (key === 'active') req.addEventListener('success', () => this.transaction.abort()); return req;
    });
    await expect(repo.restore(emptyBackup(), prior.data)).rejects.toMatchObject({code: 'STORAGE'}); spy.mockRestore();
    expect(await repo.load()).toEqual(prior); expect(await repo.exportRecovery()).toEqual(recoveryBefore);
  });
  it('rejects stale-tab writes after restore inside the write transaction', async () => {
    const factory = new IDBFactory(); const a = repository(factory); const b = repository(factory);
    const old = await a.load(); await b.load(); const fresh = await a.restore({...emptyBackup(), attempts: [attempt()]}, old.data);
    await expect(b.editDraft('attempt-1', 1, answer, old.data)).rejects.toMatchObject({code: 'CONFLICT'});
    await expect(b.createDraft({...topic, targetedSkillIds: [], answer}, old.data)).rejects.toMatchObject({code: 'CONFLICT'});
    await expect(b.saveResume(position, old.data)).rejects.toMatchObject({code: 'CONFLICT'});
    expect(await a.load()).toEqual(fresh);
  });
  it('refuses restore when data changed after its confirmation preview', async () => {
    const repo = repository(); const start = await repo.load(); await repo.saveResume(position, start.data);
    await expect(repo.restore(emptyBackup(), start.data)).rejects.toMatchObject({code: 'CONFLICT'});
    expect((await repo.load()).data.resume).toEqual(position);
  });
  it.each([{schemaVersion: 99}, {content: {version: 'future', fingerprint: 'future'}}, {attempts: [attempt({revision: -1})]}])('preserves corrupt or incompatible records %j', async patch => {
    const factory = new IDBFactory(); const repo = repository(factory, 'corruption'); const initial = await repo.load();
    const raw = {...initial.data, ...patch}; await rawWrite(factory, 'corruption', raw);
    await expect(repo.load()).rejects.toMatchObject({code: patch.attempts ? 'INVALID' : 'INCOMPATIBLE'});
    expect(await rawRead(factory, 'corruption')).toEqual(raw);
  });
  it('reports unavailable storage and failed writes without successful empty results', async () => {
    await expect(new IndexedStudentRepository({factory: Object.assign(new IDBFactory(), {open: () => { throw new DOMException('Denied', 'SecurityError'); }})}).load()).rejects.toMatchObject({name: 'SecurityError'});
    const repo = repository(); const start = await repo.load();
    vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(() => { throw new DOMException('Full', 'QuotaExceededError'); });
    await expect(repo.saveResume(position, start.data)).rejects.toMatchObject({name: 'QuotaExceededError'});
    expect(await repo.load()).toEqual(start);
  });
  it('reports a genuinely blocked native-style upgrade and closes its late connection', async () => {
    const factory = new IDBFactory(); const held = await new Promise<IDBDatabase>(resolve => {
      const open = factory.open('blocked', 1); open.onupgradeneeded = () => open.result.createObjectStore('student'); open.onsuccess = () => resolve(open.result);
    });
    const upgradeFactory = {open: (name: string) => factory.open(name, 2)} as IDBFactory;
    const blocked = new IndexedStudentRepository({factory: upgradeFactory, name: 'blocked'});
    await expect(blocked.load()).rejects.toMatchObject({code: 'BLOCKED'});
    held.close(); blocked.close();
    // Deletion completing proves the late open connection did not remain alive. Test database only.
    await new Promise<void>((resolve, reject) => { const removal = factory.deleteDatabase('blocked'); removal.onsuccess = () => resolve(); removal.onerror = () => reject(removal.error); });
  });
  it('takes consistent exports during concurrent writes', async () => {
    const repo = repository(); const {data} = await repo.load();
    const [_, backup] = await Promise.all([repo.createDraft({...topic, targetedSkillIds: [], answer}, data), repo.exportBackup()]);
    expect(backup.attempts).toHaveLength(1); expect(backup.attempts[0].answer).toEqual(answer);
    expect(backup).not.toHaveProperty('generation');
  });
  it('refuses a newer IndexedDB version without deleting it', async () => {
    const factory = new IDBFactory();
    await new Promise<void>(resolve => { const open = factory.open('future', 4); open.onsuccess = () => { open.result.close(); resolve(); }; });
    await expect(repository(factory, 'future').load()).rejects.toMatchObject({code: 'INCOMPATIBLE'});
    expect((await factory.databases())[0].version).toBe(4);
  });
});
