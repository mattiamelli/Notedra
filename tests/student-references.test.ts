import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { STUDENT_REFERENCES_PATH, projectStudentReferences, trustedStudentReferencesSource } from '../scripts/student-references';
import { loadPackFiles, readDocuments } from '../scripts/content/manifest';
import type { ContentPack } from '../scripts/content/types';
import references from '../src/generated/student-references.json';
describe('student reference projection', () => {
  it('matches validated source exactly and contains only consumed reference fields', () => {
    expect(readFileSync(STUDENT_REFERENCES_PATH, 'utf8')).toBe(trustedStudentReferencesSource());
    expect(Object.keys(references)).toEqual(['content', 'subjects', 'topics', 'subtopics', 'skills', 'questions']);
    expect([references.subjects.length, references.topics.length, references.subtopics.length, references.skills.length, references.questions.length]).toEqual([3,43,105,147,489]);
    expect(Object.keys(references.questions[0])).toEqual(['id', 'subject', 'topics']);
  });
  it('is deterministic under reordered canonical input', () => {
    const {pack} = readDocuments(loadPackFiles()); const original = pack as ContentPack; const reversed = structuredClone(original);
    reversed.subjects.reverse(); reversed.taxonomy.topics.reverse(); reversed.taxonomy.subtopics.reverse(); reversed.taxonomy.atomic_skills.reverse();
    reversed.assessment_model.assessments.reverse().forEach(row => row.question_map.reverse().forEach(question => question.topic_ids.reverse()));
    expect(projectStudentReferences(reversed, 'hash')).toEqual(projectStudentReferences(original, 'hash'));
  });
});
