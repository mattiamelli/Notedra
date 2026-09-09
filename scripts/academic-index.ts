import { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AcademicIndex } from '../src/academic/types.ts';
import { loadPackFiles, readDocuments } from './content/manifest.ts';
import type { ContentPack } from './content/types.ts';
import { validateContentFiles } from './content/validate.ts';

export const ACADEMIC_INDEX_PATH = fileURLToPath(new URL('../src/generated/academic-index.json', import.meta.url));
export const MAX_ACADEMIC_INDEX_BYTES = 16_000;
const compare = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
function text(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error('Academic navigation requires a canonical nonempty label.');
  return value;
}

export function projectAcademicIndex(pack: ContentPack): AcademicIndex {
  const subjects = pack.subjects.map(subject => ({
    subject_id: subject.subject_id, code: text(subject.code), name: text(subject.name), short: text(subject.short),
  })).sort((a, b) => compare(a.subject_id, b.subject_id));
  const subjectIds = new Set(subjects.map(subject => subject.subject_id));
  const orderedTopics = [...pack.taxonomy.topics].sort((a, b) => compare(a.topic_id, b.topic_id));
  const orderBySubject = new Map<string, number>();
  const topics = orderedTopics.map(topic => {
    if (!subjectIds.has(topic.subject_id)) throw new Error(`Unknown subject for ${topic.topic_id}.`);
    const order = (orderBySubject.get(topic.subject_id) ?? 0) + 1;
    orderBySubject.set(topic.subject_id, order);
    return {subject_id: topic.subject_id, topic_id: topic.topic_id, name: text(topic.name), order};
  });
  if (subjects.length !== 3 || subjectIds.size !== 3 || topics.length !== 43 || new Set(topics.map(topic => topic.topic_id)).size !== 43) {
    throw new Error('Academic navigation must contain 3 unique canonical subjects and 43 unique canonical topics.');
  }
  return {subjects, topics};
}

export function serializeAcademicIndex(index: AcademicIndex): string {
  const output = `${JSON.stringify(index, null, 2)}\n`;
  if (Buffer.byteLength(output) > MAX_ACADEMIC_INDEX_BYTES) throw new Error('Academic navigation exceeds its 16 KB size budget.');
  return output;
}

export function trustedAcademicIndexSource(): string {
  const files = loadPackFiles();
  const report = validateContentFiles(files);
  if (!report.valid) throw new Error(`Cannot generate academic navigation from invalid content:\n${report.issues.map(issue => `${issue.path}: ${issue.message}`).join('\n')}`);
  const {pack} = readDocuments(files);
  return serializeAcademicIndex(projectAcademicIndex(pack as ContentPack));
}

export function checkAcademicIndex(expected = trustedAcademicIndexSource(), path = ACADEMIC_INDEX_PATH): void {
  let actual: string;
  try { actual = readFileSync(path, 'utf8'); }
  catch { throw new Error('Academic index is missing. Run the generate:academic command.'); }
  if (actual !== expected) throw new Error('Academic index is stale or edited. Run the generate:academic command.');
}

export function writeAcademicIndex(source: string, path = ACADEMIC_INDEX_PATH): void {
  // Replace the complete artifact atomically; interrupted generation preserves the last valid file.
  mkdirSync(dirname(path), {recursive: true});
  const temporary = `${path}.${process.pid}.tmp`;
  try {
    writeFileSync(temporary, source, 'utf8');
    renameSync(temporary, path);
  } finally {
    rmSync(temporary, {force: true});
  }
}
