import {curriculumCourses} from './registry';
import type {CurriculumCourse, CurriculumExercise, CurriculumTopic} from './types';
import type {Exercise} from '../practice/types';

export interface CurriculumTask {
  kind: 'curriculum';
  format: 'choice' | 'integer' | 'open';
  options: {id: string; text: string}[];
  rubric: string[];
}
export interface CurriculumPracticeExercise extends Omit<Exercise, 'task' | 'grader' | 'source'> {
  task: CurriculumTask;
  grader: {id: 'curriculum'; version: '1'};
  source: {kind: 'CURRICULUM'; documentId: string; filename: string; locator: string; precision: 'DOCUMENT_RANGE'};
}

export function curriculumPracticeExercise(course: CurriculumCourse, topic: CurriculumTopic, item: CurriculumExercise): CurriculumPracticeExercise {
  const source = course.sources.find(source => source.id === item.sourceIds[0]);
  if (!source) throw new Error(`Missing curriculum source for ${item.id}.`);
  return {
    id: item.id, version: '1', title: item.title, prompt: item.prompt,
    subjectId: course.id, topicId: topic.id, subtopicId: `${topic.id}_CORE`, skillId: item.skillId,
    authorship: 'AUTHORED_PRACTICE',
    source: {kind: 'CURRICULUM', documentId: source.id, filename: source.filename, locator: source.locator, precision: 'DOCUMENT_RANGE'},
    rules: item.kind === 'choice' ? 'Choose one answer.' : item.kind === 'integer'
      ? 'Enter a base-10 integer, with an optional sign and at most 64 digits.'
      : 'Write your reasoning. This response is saved without a score; compare it with the rubric after submission.',
    grader: {id: 'curriculum', version: '1'},
    task: {kind: 'curriculum', format: item.kind, options: item.options ?? [], rubric: item.rubric ?? []},
    reference: item.kind === 'choice' ? {kind: 'choice', value: item.answer === undefined ? [] : [item.answer]}
      : {kind: 'text', value: item.answer ?? ''},
    explanation: item.explanation,
  };
}

export const curriculumExercises: CurriculumPracticeExercise[] = curriculumCourses.flatMap(course =>
  course.topics.flatMap(topic => topic.exercises.map(item => curriculumPracticeExercise(course, topic, item))));
