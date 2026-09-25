import {describe, expect, it} from 'vitest';
import {curriculumCourses} from '../src/curriculum/registry';
import {validateCurriculum} from '../scripts/curriculum-validation';
import {curriculumMetadata} from '../src/curriculum/metadata';
import {curriculumProjection} from '../src/curriculum/study';
import {emptyBackup, migrateBackup, validateResume} from '../src/learning/contracts';
import legacy from '../src/generated/student-references.json';
import {studentReferences} from '../src/learning/references';
import {deriveProgress} from '../src/progress/derive';
import {academicIndex, courses, topicPath, resolveStudyRoute} from '../src/academic/navigation';

describe('additive first-year curriculum', () => {
  it('validates each course and its source, ownership and prerequisite graph', () => {
    expect(validateCurriculum(curriculumCourses).courses).toBe(8);
  });
  it('keeps the original content identity and all existing reference rows', () => {
    expect(studentReferences.content).toEqual(legacy.content);
    for (const key of ['subjects', 'topics', 'subtopics', 'skills', 'questions'] as const) {
      expect(studentReferences[key].slice(0, legacy[key].length)).toEqual(legacy[key]);
    }
    const backup = emptyBackup();
    expect(migrateBackup(backup)).toEqual(backup);
  });
  it('includes precisely the supplied eleven-course scope', () => {
    expect(courses).toHaveLength(11);
    expect(academicIndex.subjects).toHaveLength(11);
    expect(curriculumCourses.some(course => course.code === 'CSE14C')).toBe(false);
  });
  it('generates slim metadata consistent with authored course identities', () => {
    expect(curriculumMetadata.map(course => course.id)).toEqual(curriculumCourses.map(course => course.id));
    expect(curriculumMetadata.flatMap(course => course.topics.map(topic => topic.id))).toEqual(curriculumProjection.topics.map(topic => topic.id));
  });
  it('resolves every new topic mode without changing existing routes', () => {
    for (const topic of academicIndex.topics) {
      expect(resolveStudyRoute(`${topicPath(topic)}/learn`)?.topic.topic_id).toBe(topic.topic_id);
      expect(() => validateResume({subjectId: topic.subject_id, topicId: topic.topic_id, visitedAt: '2026-09-25T10:00:00.000Z'})).not.toThrow();
    }
    expect(courses.find(course => course.subject_id === 'CSE1400_CO')?.path).toBe('/co');
    expect(courses.find(course => course.subject_id === 'CSE1300_RL')?.path).toBe('/rl');
    expect(courses.find(course => course.subject_id === 'CSE1100_IP')?.path).toBe('/ip');
  });
  it('keeps missing mastery and readiness unknown for every course', () => {
    const progress = deriveProgress(emptyBackup(), Date.parse('2026-09-25T10:00:00.000Z'));
    expect(progress.courses).toHaveLength(11);
    expect(progress.courses.every(course => course.index === null)).toBe(true);
    expect(progress.readiness.every(course => course.index === null)).toBe(true);
  });
  it('rejects a foreign source reference', () => {
    const changed = structuredClone(curriculumCourses);
    changed[0].topics[0].exercises[0].sourceIds = ['unknown-source'];
    expect(() => validateCurriculum(changed)).toThrow(/source/);
  });
  it('rejects an objectively graded open answer', () => {
    const changed = structuredClone(curriculumCourses);
    const exercise = changed.flatMap(course => course.topics.flatMap(topic => topic.exercises)).find(item => item.kind === 'open')!;
    exercise.answer = 'correct';
    expect(() => validateCurriculum(changed)).toThrow(/open response/);
  });
  it('rejects cyclic prerequisites', () => {
    const changed = structuredClone(curriculumCourses);
    const [first, second] = changed[0].topics;
    first.prerequisites = [second.id]; second.prerequisites = [first.id];
    expect(() => validateCurriculum(changed)).toThrow(/cyclic/);
  });
});
