import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import type { Plugin } from 'vite';
import { validateCatalog } from '../src/practice/validation.ts';
import { loadPackFiles, readDocuments } from './content/manifest.ts';
import { validateContentFiles } from './content/validate.ts';
import type { ContentPack } from './content/types.ts';
export const canonical = (value: unknown): string => JSON.stringify(order(value));
function order(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(order);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, order((value as Record<string, unknown>)[key])]));
  return value;
}
export function validatePracticeData(data: unknown, lock: Record<string,string>, pack: ContentPack) {
  validateCatalog(data);
  if (Object.keys(lock).length !== data.length) throw new Error('Practice lock inventory mismatch.');
  for (const item of data) {
    const digest = createHash('sha256').update(canonical(item)).digest('hex');
    if (lock[`${item.id}@${item.version}`] !== digest) throw new Error(`Immutable practice version changed: ${item.id}@${item.version}. Publish a new version; never rewrite its lock.`);
    const skill = pack.taxonomy.atomic_skills.find(skill => skill.skill_id === item.skillId);
    if (!skill || skill.subject_id !== item.subjectId || skill.topic_id !== item.topicId || skill.subtopic_id !== item.subtopicId) throw new Error('Practice skill ownership differs from the trusted pack.');
    const source = (skill.lecture_references as {document_id: string; source_document: string; source_page_or_slide: string; confidence: string; source_locator: {precision: string; method: string}}[]).find(ref => ref.document_id === item.source.documentId);
    const doc = pack.corpus.documents.find(doc => doc.document_id === item.source.documentId);
    if (!source || !doc || doc.subject_id !== item.subjectId || source.confidence !== 'HIGH' || source.source_document !== item.source.filename || source.source_page_or_slide !== item.source.locator || source.source_locator.precision !== item.source.precision || source.source_locator.method !== 'WHOLE_DOCUMENT_RANGE') throw new Error('Practice lecture provenance is missing, uncertain or misrepresented.');
  }
}
export function validateGraderSource(source: string, lock: {version: string; sha256: string}) {
  if (lock.version !== '1' || !/^[a-f0-9]{64}$/.test(lock.sha256) || createHash('sha256').update(source).digest('hex') !== lock.sha256) throw new Error('Immutable grader implementation changed. Publish a new grader version and preserve old bindings or mark them unavailable.');
}
export function validatePracticeFiles() {
  validateGraderSource(readFileSync(new URL('../src/practice/grading.ts', import.meta.url), 'utf8'), JSON.parse(readFileSync(new URL('../src/practice/grader-lock.json', import.meta.url), 'utf8')) as {version: string; sha256: string});
  const files = loadPackFiles(); if (!validateContentFiles(files).valid) throw new Error('Trusted content validation failed before practice validation.');
  const {pack} = readDocuments(files);
  const data: unknown = JSON.parse(readFileSync(new URL('../src/practice/catalog.json', import.meta.url), 'utf8'));
  const lock = JSON.parse(readFileSync(new URL('../src/practice/catalog-lock.json', import.meta.url), 'utf8')) as Record<string,string>;
  validatePracticeData(data, lock, pack as ContentPack);
}
export function practiceBuildGuard(validate = validatePracticeFiles): Plugin {
  return {name: 'delftstudy-practice-catalog', apply: 'build', buildStart() { validate(); }};
}
