import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ACADEMIC_INDEX_PATH, checkAcademicIndex, MAX_ACADEMIC_INDEX_BYTES, projectAcademicIndex, serializeAcademicIndex, writeAcademicIndex } from '../scripts/academic-index';
import { loadPackFiles, readDocuments } from '../scripts/content/manifest';
import type { ContentPack } from '../scripts/content/types';

const pack = readDocuments(loadPackFiles()).pack as ContentPack;
const index = projectAcademicIndex(pack);
const source = serializeAcademicIndex(index);

describe('generated academic navigation', () => {
  it('contains exactly the three canonical subjects and their source labels', () => {
    expect(index.subjects).toHaveLength(3);
    for (const subject of pack.subjects) expect(index.subjects).toContainEqual({subject_id: subject.subject_id, code: subject.code, name: subject.name, short: subject.short});
  });
  it('contains all 43 canonical topics exactly once, with no invented IDs', () => {
    expect(index.topics).toHaveLength(43);
    expect(new Set(index.topics.map(topic => topic.topic_id)).size).toBe(43);
    expect(index.topics.map(topic => topic.topic_id).sort()).toEqual(pack.taxonomy.topics.map(topic => topic.topic_id).sort());
  });
  it('preserves canonical topic labels and subject relationships', () => {
    for (const topic of index.topics) {
      const canonical = pack.taxonomy.topics.find(item => item.topic_id === topic.topic_id)!;
      expect(topic.name).toBe(canonical.name);
      expect(topic.subject_id).toBe(canonical.subject_id);
      expect(index.subjects.some(subject => subject.subject_id === topic.subject_id)).toBe(true);
    }
  });
  it('keeps the Assembly topic under CSE1400_CO', () => {
    expect(index.topics.find(topic => topic.topic_id === 'CO_T06_ASSEMBLY_X86_64')?.subject_id).toBe('CSE1400_CO');
  });
  it('gives deterministic output even if source arrays arrive in a different order', () => {
    const shuffled = structuredClone(pack);
    shuffled.subjects.reverse(); shuffled.taxonomy.topics.reverse();
    expect(serializeAcademicIndex(projectAcademicIndex(shuffled))).toBe(source);
    expect(serializeAcademicIndex(projectAcademicIndex(pack))).toBe(source);
  });
  it('orders topics by canonical IDs within each course', () => {
    for (const subject of index.subjects) {
      const topics = index.topics.filter(topic => topic.subject_id === subject.subject_id);
      expect(topics.map(topic => topic.topic_id)).toEqual(topics.map(topic => topic.topic_id).sort());
      expect(topics.map(topic => topic.order)).toEqual(topics.map((_, i) => i + 1));
    }
  });
  it('exposes only an allowlist of navigation metadata', () => {
    expect(Object.keys(index).sort()).toEqual(['subjects', 'topics']);
    for (const subject of index.subjects) expect(Object.keys(subject).sort()).toEqual(['code', 'name', 'short', 'subject_id']);
    for (const topic of index.topics) expect(Object.keys(topic).sort()).toEqual(['name', 'order', 'subject_id', 'topic_id']);
    expect(Buffer.byteLength(source)).toBeLessThan(MAX_ACADEMIC_INDEX_BYTES);
  });
  it('keeps the committed generated artifact exactly reproducible', () => {
    expect(readFileSync(ACADEMIC_INDEX_PATH, 'utf8')).toBe(source);
    expect(() => checkAcademicIndex(source)).not.toThrow();
  });
  it('does not modify the trusted input', () => {
    const before = JSON.stringify(pack); projectAcademicIndex(pack);
    expect(JSON.stringify(pack)).toBe(before);
  });
  it.each(['duplicate', 'missing', 'invalid-subject'])('rejects %s navigation input', mutation => {
    const fixture = structuredClone(pack);
    if (mutation === 'duplicate') fixture.taxonomy.topics[1].topic_id = fixture.taxonomy.topics[0].topic_id;
    if (mutation === 'missing') fixture.taxonomy.topics.pop();
    if (mutation === 'invalid-subject') fixture.taxonomy.topics[0].subject_id = 'INVENTED';
    expect(() => projectAcademicIndex(fixture)).toThrow();
  });
  it('detects missing/stale files and atomically replaces a generated artifact', () => {
    const directory = mkdtempSync(join(tmpdir(), 'delftstudy-index-'));
    const path = join(directory, 'index.json');
    try {
      expect(() => checkAcademicIndex(source, path)).toThrow('missing');
      writeFileSync(path, '{}');
      expect(() => checkAcademicIndex(source, path)).toThrow('stale');
      writeAcademicIndex(source, path);
      expect(() => checkAcademicIndex(source, path)).not.toThrow();
      expect(readdirSync(directory)).toEqual(['index.json']);
    } finally { rmSync(directory, {recursive: true, force: true}); }
  });
  it('keeps frontend modules free of full handoff and development-tool imports', () => {
    const root = new URL('../src/', import.meta.url);
    const visit = (directory: URL): void => {
      for (const entry of readdirSync(directory, {withFileTypes: true})) {
        const path = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
        if (entry.isDirectory()) visit(path);
        else if (/\.[jt]sx?$/.test(entry.name)) {
          const code = readFileSync(path, 'utf8');
          expect(code, path.pathname).not.toMatch(/DelftStudy_Codex_Handoff_Pack|content-pack\/|scripts\//);
        }
      }
    };
    visit(root);
  });
});
