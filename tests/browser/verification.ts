import { IndexedStudentRepository, STUDENT_DB_VERSION } from '../../src/learning/repository';
import { emptyBackup, parseBackup, type Backup, type Dataset } from '../../src/learning/contracts';
const prefix = 'delftstudy-isolated-acceptance-';
const position = {subjectId: 'CSE1400_CO', topicId: 'CO_T06_ASSEMBLY_X86_64', visitedAt: '2026-09-09T12:00:00.000Z'};
const input = {subjectId: position.subjectId, topicId: position.topicId, targetedSkillIds: [], answer: {kind: 'text', value: 'isolated browser fixture'} as const, attemptId: 'browser-attempt'};
const output = document.querySelector<HTMLPreElement>('#results')!;
document.querySelector('#browser')!.textContent = navigator.userAgent;
const hints = (navigator as Navigator & {userAgentData?: {getHighEntropyValues(keys: string[]): Promise<unknown>}}).userAgentData;
if (hints) void hints.getHighEntropyValues(['fullVersionList']).then(value => { document.querySelector('#browser')!.textContent += ' · ' + JSON.stringify(value); });
function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
const equal = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
async function rejects(operation: () => Promise<unknown>, code: string) {
  try { await operation(); } catch (error) { assert(typeof error === 'object' && error !== null && 'code' in error && error.code === code, `Expected ${code}, got ${String(error)}`); return; }
  throw new Error(`Expected ${code}, but operation succeeded.`);
}
function open(name: string, version = STUDENT_DB_VERSION) { return new Promise<IDBDatabase>((resolve, reject) => { const req = indexedDB.open(name, version); req.onupgradeneeded = () => { if (!req.result.objectStoreNames.contains('student')) req.result.createObjectStore('student'); }; req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error); }); }
async function raw(name: string, data: unknown) {
  const db = await open(name);
  await new Promise<void>((resolve, reject) => { const tx = db.transaction('student', 'readwrite'); tx.objectStore('student').put(data, 'active'); tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); }); db.close();
}
const results: {name: string; result: string}[] = [];
async function check(name: string, test: () => Promise<void>) {
  try { await test(); results.push({name, result: 'PASS'}); }
  catch (error) { results.push({name, result: `FAIL: ${String(error)}`}); }
  output.textContent = JSON.stringify({browser: navigator.userAgent, results}, null, 2);
}
async function run() {
  results.length = 0;
  const name = prefix + crypto.randomUUID(); const repo = new IndexedStudentRepository({name}); const other = new IndexedStudentRepository({name});
  let state: Dataset;
  await check('fresh installation', async () => { state = (await repo.load()).data; assert(state.attempts.length === 0 && state.resume === null, 'Fresh data was not empty.'); });
  await check('committed resume survives new connection', async () => { await repo.saveResume(position, state); const loaded = await other.load(); assert(equal(loaded.data.resume, position), 'Resume did not persist.'); state = loaded.data; });
  await check('distinct concurrent attempts survive', async () => {
    await Promise.all([repo.createDraft(input, state), other.createDraft({...input, attemptId: 'second'}, state)]);
    state = (await repo.load()).data; assert(state.attempts.length === 2, 'Concurrent record was lost.');
  });
  await check('stale draft edit rejected', async () => {
    await repo.editDraft(input.attemptId, 1, input.answer, state);
    await rejects(() => other.editDraft(input.attemptId, 1, input.answer, state), 'CONFLICT');
  });
  await check('immutable and idempotent submission', async () => {
    const saved = await repo.submit(input.attemptId, 2, 'operation', input.answer, state);
    assert(equal(await repo.submit(input.attemptId, 2, 'operation', input.answer, state), saved), 'Repeated submit changed data.');
    await rejects(() => other.submit(input.attemptId, 2, 'operation', {kind: 'text', value: 'changed'}, state), 'CONFLICT');
    await rejects(() => other.editDraft(input.attemptId, 3, input.answer, state), 'CONFLICT');
  });
  await check('request success followed by abort is not saved', async () => {
    state = (await repo.load()).data; const put = IDBObjectStore.prototype.put; let succeeded = false;
    IDBObjectStore.prototype.put = function (value: unknown, key?: IDBValidKey) {
      const req = put.call(this, value, key);
      if (this.transaction.db.name === name) req.addEventListener('success', () => { succeeded = true; this.transaction.abort(); });
      return req;
    };
    try { await rejects(() => repo.saveResume(position, state), 'STORAGE'); }
    finally { IDBObjectStore.prototype.put = put; }
    assert(succeeded && equal((await repo.load()).data, state), 'Aborted write changed data or request never succeeded.');
  });
  await check('restore and recovery are atomic; stale connection rejected', async () => {
    state = (await repo.load()).data; const before = await repo.exportBackup();
    const restored = await repo.restore(emptyBackup(), state);
    assert(equal(await repo.exportRecovery(), before), 'Recovery differs.');
    await rejects(() => other.createDraft(input, state), 'CONFLICT');
    assert(equal(await repo.exportBackup(), emptyBackup()), 'Stale tab altered replacement.'); state = restored.data;
  });
  await check('aborted replacement preserves active and recovery', async () => {
    const before = await repo.exportBackup(); const recovery = await repo.exportRecovery(); const put = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (value: unknown, key?: IDBValidKey) {
      const req = put.call(this, value, key);
      if (this.transaction.db.name === name && key === 'active') req.addEventListener('success', () => this.transaction.abort()); return req;
    };
    try { await rejects(() => repo.restore({...emptyBackup(), resume: position}, state), 'STORAGE'); }
    finally { IDBObjectStore.prototype.put = put; }
    assert(equal(await repo.exportBackup(), before) && equal(await repo.exportRecovery(), recovery), 'Restore partially applied.');
  });
  await check('invalid import rejected before mutation', async () => {
    const before = await repo.exportBackup();
    await rejects(async () => { await repo.restore({...emptyBackup(), score: 100} as Backup, state); }, 'INVALID');
    await rejects(async () => { parseBackup('{'); }, 'INVALID');
    assert(equal(before, await repo.exportBackup()), 'Invalid import mutated data.');
  });
  await check('corruption preserved with explicit error', async () => {
    const corruptName = prefix + crypto.randomUUID(); const corruptRepo = new IndexedStudentRepository({name: corruptName}); const initial = await corruptRepo.load();
    await raw(corruptName, {...initial.data, schemaVersion: 99});
    await rejects(() => corruptRepo.load(), 'INCOMPATIBLE');
    const db = await open(corruptName); const value = await new Promise<Dataset>(resolve => { const req = db.transaction('student').objectStore('student').get('active'); req.onsuccess = () => resolve(req.result as Dataset); });
    assert(Number(value.schemaVersion) === 99, 'Future data was reset.'); db.close(); corruptRepo.close();
  });
  await check('blocked upgrade rejects and releases late connection', async () => {
    const blockedName = prefix + crypto.randomUUID(); const held = await open(blockedName, 1);
    const adapter = {open: (dbName: string) => indexedDB.open(dbName, 2)} as IDBFactory;
    const blockedRepo = new IndexedStudentRepository({name: blockedName, factory: adapter});
    await rejects(() => blockedRepo.load(), 'BLOCKED'); held.close(); blockedRepo.close();
    const later = await open(blockedName, 2); later.close();
  });
  await check('browser permission failure propagates (injected denial)', async () => {
    const adapter = {open: () => { throw new DOMException('Controlled denial', 'SecurityError'); }} as unknown as IDBFactory;
    try { await new IndexedStudentRepository({factory: adapter}).load(); throw new Error('Unexpected success'); }
    catch (error) { assert(error instanceof DOMException && error.name === 'SecurityError', 'Wrong failure.'); }
  });
  await check('prepare actual page-reload persistence check', async () => {
    await repo.createDraft({...input, attemptId: 'reload-record'}, state);
    sessionStorage.setItem(prefix + 'reload-name', name);
    assert((await repo.exportBackup()).attempts.some(item => item.attemptId === 'reload-record'), 'Record not committed.');
  });
  repo.close(); other.close();
  output.textContent = JSON.stringify({browser: navigator.userAgent, results, total: results.length, failures: results.filter(item => item.result !== 'PASS').length}, null, 2);
}
document.querySelector('#run')!.addEventListener('click', () => { void run(); });
document.querySelector('#reload-check')!.addEventListener('click', () => {
  void check('actual page reload retained committed database record', async () => {
    const name = sessionStorage.getItem(prefix + 'reload-name'); assert(name !== null && name.startsWith(prefix), 'Run checks first.');
    const repo = new IndexedStudentRepository({name}); const state = await repo.load();
    assert(state.data.attempts.some(item => item.attemptId === 'reload-record'), 'Committed record was lost after reload.'); repo.close();
  });
});
