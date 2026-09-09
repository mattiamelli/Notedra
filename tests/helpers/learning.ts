import { IDBFactory } from 'fake-indexeddb';
import references from '../../src/generated/student-references.json';
import { CONTENT, type Attempt, type Dataset } from '../../src/learning/contracts';
import { IndexedStudentRepository } from '../../src/learning/repository';
export const topic = {subjectId: 'CSE1400_CO', topicId: 'CO_T06_ASSEMBLY_X86_64'};
export const time = '2026-09-09T12:00:00.000Z';
export const position = {...topic, visitedAt: time};
export const answer = {kind: 'text', value: 'An answer'} as const;
export function attempt(overrides: Partial<Attempt> = {}): Attempt {
  return {...topic, attemptId: 'attempt-1', contentVersion: CONTENT.version, targetedSkillIds: [], status: 'DRAFT', answer, hintsUsed: null, solutionViewed: null, createdAt: time, updatedAt: time, revision: 1, ...overrides};
}
export function repository(factory = new IDBFactory(), name = 'isolated-learning-test') {
  let id = 0;
  return new IndexedStudentRepository({factory, name, now: () => time, id: () => `${name}-${++id}`});
}
export const foreignSkill = references.skills.find(skill => !references.subtopics.some(sub => sub.id === skill.subtopic && sub.topic === topic.topicId))!.id;
export async function rawWrite(factory: IDBFactory, name: string, value: unknown, key = 'active') {
  const db = await new Promise<IDBDatabase>((resolve, reject) => { const open = factory.open(name); open.onsuccess = () => resolve(open.result); open.onerror = () => reject(open.error); });
  await new Promise<void>((resolve, reject) => { const tx = db.transaction('student', 'readwrite'); tx.objectStore('student').put(value, key); tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); }); db.close();
}
export async function rawRead(factory: IDBFactory, name: string): Promise<Dataset> {
  const db = await new Promise<IDBDatabase>(resolve => { const open = factory.open(name); open.onsuccess = () => resolve(open.result); });
  const value = await new Promise<Dataset>(resolve => { const tx = db.transaction('student'); const req = tx.objectStore('student').get('active'); req.onsuccess = () => resolve(req.result as Dataset); }); db.close(); return value;
}
