import {describe, expect, it} from 'vitest';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {IDBFactory} from 'fake-indexeddb';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {curriculumCourses} from '../src/curriculum/registry';
import {curriculumExercises, curriculumPracticeExercise} from '../src/curriculum/practice';
import type {CurriculumPracticeExercise, CurriculumTask} from '../src/curriculum/practice';
import {gradeCurriculumResponse, validateCurriculumResponse} from '../src/curriculum/grading';
import {CurriculumControls} from '../src/curriculum/Controls';
import {allExercises, versionBinding} from '../src/practice/catalog';
import {gradeResponse, initialAnswer, validateResponse} from '../src/practice/runtime';
import {displayAnswer, exerciseFormat} from '../src/practice/presentation';
import {PracticeService, feedbackFor, resolveAttempt} from '../src/practice/service';
import {Feedback} from '../src/practice/ExerciseParts';
import type {Answer} from '../src/learning/contracts';
import bindings from '../src/generated/curriculum-bindings.json';
import {repository} from './helpers/learning';

const source = {id: 'source', filename: 'Curriculum.md', locator: 'Section 1'};
const topic = {id: 'TOPIC', name: 'Topic', description: '', prerequisites: [], sourceIds: ['source'], skills: [{id: 'skill', name: 'Skill', description: ''}], lesson: [], exercises: []};
const course = {id: 'COURSE', code: 'CSE', name: 'Course', short: 'Course', trimester: 2 as const, slug: 'course', description: '', limitations: [], sources: [source], topics: [topic]};
function fixture(kind: 'choice' | 'integer' | 'open') {
  return curriculumPracticeExercise(course, topic, {id: `ds.practice.curriculum.${kind}`, title: 'Question', prompt: 'Respond', skillId: 'skill', sourceIds: ['source'], kind,
    options: kind === 'choice' ? [{id: 'a', text: 'First option'}, {id: 'b', text: 'Second option'}] : undefined,
    answer: kind === 'choice' ? 'a' : kind === 'integer' ? '9007199254740993' : undefined,
    rubric: kind === 'open' ? ['State an assumption.', 'Justify the conclusion.'] : undefined, explanation: 'Reference reasoning.'});
}

describe('curriculum practice adapter and exact grading', () => {
  it('preserves source identity and matches the shared canonical identities', () => {
    const exercise = fixture('open');
    expect(exercise.source).toEqual({kind: 'CURRICULUM', documentId: source.id, filename: source.filename, locator: source.locator, precision: 'DOCUMENT_RANGE'});
    expect(exercise).toMatchObject({subjectId: course.id, topicId: topic.id, subtopicId: 'TOPIC_CORE', skillId: 'skill'});
    expect(exerciseFormat(exercise.task.kind)).not.toBeNull();
  });

  it('grades only one registered option and displays option text', () => {
    const exercise = fixture('choice');
    expect(initialAnswer(exercise)).toEqual({kind: 'choice', value: []});
    expect(gradeResponse(exercise, {kind: 'choice', value: ['a']})).toMatchObject({status: 'GRADED', correct: true, earned: 1});
    expect(gradeResponse(exercise, {kind: 'choice', value: ['b']})).toMatchObject({status: 'GRADED', correct: false, earned: 0});
    expect(displayAnswer(exercise, {kind: 'choice', value: ['a']})).toBe('First option');
    for (const value of [[], ['a', 'b'], ['a', 'a'], ['unknown']]) expect(gradeResponse(exercise, {kind: 'choice', value})).not.toHaveProperty('earned');
    expect(validateResponse(exercise.task, {kind: 'text', value: 'a'}).status).toBe('INVALID');
  });

  it('compares signed integers without floating-point rounding or expression evaluation', () => {
    const exercise = fixture('integer');
    expect(gradeResponse(exercise, {kind: 'text', value: ' +09007199254740993 '})).toMatchObject({status: 'GRADED', correct: true});
    expect(gradeResponse(exercise, {kind: 'text', value: '9007199254740992'})).toMatchObject({status: 'GRADED', correct: false});
    for (const value of ['1.0', '1e3', '0x10', '1+2', 'NaN', '1'.repeat(65), 'globalThis.alert(1)'])
      expect(gradeResponse(exercise, {kind: 'text', value})).toMatchObject({status: 'INVALID'});
    expect(gradeResponse(exercise, {kind: 'text', value: ' '})).toMatchObject({status: 'INCOMPLETE'});
    expect(gradeResponse({...exercise, reference: {kind: 'text', value: '-0'}}, {kind: 'text', value: '+000'})).toMatchObject({correct: true});
    expect(gradeResponse({...exercise, reference: {kind: 'text', value: ''}}, {kind: 'text', value: '0'})).toMatchObject({status: 'ERROR'});
  });

  it('accepts bounded reasoning for submission but never assigns points', () => {
    const exercise = fixture('open');
    const answer: Answer = {kind: 'text', value: 'My reasoning, including <script> as literal text.'};
    expect(validateResponse(exercise.task, answer)).toEqual({status: 'VALID'});
    const feedback = gradeResponse(exercise, answer);
    expect(feedback).toMatchObject({status: 'NOT_AUTOGRADABLE', message: expect.stringContaining('Justify the conclusion.')});
    expect(feedback).not.toHaveProperty('correct');
    expect(feedback).not.toHaveProperty('earned');
    expect(validateResponse(exercise.task, {kind: 'text', value: 'x'.repeat(16000)}).status).toBe('VALID');
    expect(validateResponse(exercise.task, {kind: 'text', value: 'x'.repeat(16001)}).status).toBe('INVALID');
    expect(validateResponse(exercise.task, {kind: 'code', value: 'reasoning'}).status).toBe('INVALID');
    expect(validateResponse(exercise.task, {kind: 'text', value: ''}).status).toBe('INCOMPLETE');
  });

  it('renders separate choice, integer and multiline controls with disabled state', () => {
    for (const format of ['choice', 'integer', 'open'] as const) {
      const exercise = fixture(format);
      const html = renderToStaticMarkup(createElement(CurriculumControls, {task: exercise.task, answer: initialAnswer(exercise), disabled: true, onChange: () => {}}));
      expect(html).toContain('disabled');
      expect(html).toContain(format === 'open' ? '<textarea' : '<input');
      if (format === 'choice') expect(html).toContain('First option');
      else expect(html).toContain('maxLength="16000"');
    }
  });

  it('shows rubric feedback without correctness styling, but never for an unavailable submission', () => {
    const exercise = fixture('open');
    const answer: Answer = {kind: 'text', value: '<script>literal answer</script>'};
    const html = renderToStaticMarkup(createElement(Feedback, {exercise, answer, result: gradeResponse(exercise, answer)}));
    expect(html).toContain('Self-review rubric');
    expect(html).toContain('State an assumption.');
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('is-incorrect');
    expect(html).not.toContain('is-correct');
    const unavailable = renderToStaticMarkup(createElement(Feedback, {exercise, answer, result: {status: 'NOT_AUTOGRADABLE', message: 'Original version unavailable.'}}));
    expect(unavailable).not.toContain('Self-review rubric');
    expect(unavailable).not.toContain('Reference reasoning.');
  });

  it('fails closed for unknown graders and malformed task schemas', () => {
    const exercise = fixture('choice');
    const answer: Answer = {kind: 'choice', value: ['a']};
    for (const patch of [{kind: 'other'}, {format: 'javascript'}, {options: null}, {options: [{id: 'a', text: 'One'}, {id: 'a', text: 'Duplicate'}]}, {rubric: [42]}]) {
      const task = {...exercise.task, ...patch} as unknown as CurriculumTask;
      expect(validateCurriculumResponse(task, answer)).toMatchObject({status: 'NOT_AUTOGRADABLE'});
      expect(gradeCurriculumResponse({...exercise, task}, answer)).not.toHaveProperty('earned');
    }
    for (const grader of [undefined, {id: 'other', version: '1'}, {id: 'curriculum', version: '2'}])
      expect(gradeCurriculumResponse({...exercise, grader} as unknown as CurriculumPracticeExercise, answer)).toMatchObject({status: 'NOT_AUTOGRADABLE'});
    expect(gradeCurriculumResponse({...exercise, version: '2'}, answer)).toMatchObject({status: 'NOT_AUTOGRADABLE'});
  });
});

describe('registered curriculum submissions', () => {
  it('registers every authored exercise once and binds raw content plus the grader', () => {
    const raw = curriculumCourses.flatMap(course => course.topics.flatMap(topic => topic.exercises));
    expect(curriculumExercises.length).toBeGreaterThan(0);
    expect(curriculumExercises).toHaveLength(raw.length);
    expect(new Set(allExercises.map(item => item.id)).size).toBe(allExercises.length);
    expect(bindings.graderSha256).toBe(createHash('sha256')
      .update(readFileSync(new URL('../src/curriculum/grading.ts', import.meta.url))).update('\0')
      .update(readFileSync(new URL('../src/curriculum/practice.ts', import.meta.url))).digest('hex'));
    for (const exercise of curriculumExercises) {
      expect(allExercises).toContain(exercise);
      const owner = curriculumCourses.find(course => course.id === exercise.subjectId)!;
      const item = raw.find(item => item.id === exercise.id)!;
      const fingerprint = createHash('sha256').update(JSON.stringify({courseId: owner.id, topicId: exercise.topicId,
        sources: item.sourceIds.map(id => owner.sources.find(source => source.id === id)), exercise: item})).digest('hex');
      expect(versionBinding(exercise)).toBe(`1:sha256:${fingerprint}:grader:${bindings.graderSha256}`);
      expect(() => versionBinding({...exercise, version: '2'})).toThrow();
      if (exercise.task.format !== 'open') expect(gradeResponse(exercise, exercise.reference)).toMatchObject({status: 'GRADED', correct: true});
    }
  });

  it('persists, reloads, exports and retries an open submission without score evidence', async () => {
    const exercise = curriculumExercises.find(item => item.task.format === 'open');
    expect(exercise).toBeDefined();
    const factory = new IDBFactory();
    const repo = repository(factory);
    const service = new PracticeService(repo);
    const {data} = await repo.load();
    const started = await service.start(exercise!.id, 'curriculum-open', data);
    expect(feedbackFor(started.data.attempts[0])).not.toHaveProperty('earned');
    const answer: Answer = {kind: 'text', value: 'A considered explanation.\nWith supporting reasoning.'};
    const saved = await service.save(started.data.attempts[0], answer, data);
    expect((await repository(factory).load()).data.attempts[0].answer).toEqual(answer);
    const submitted = await service.submit(saved.data.attempts[0], answer, 'submit-open', data);
    const attempt = submitted.data.attempts[0];
    expect(attempt.status).toBe('SUBMITTED');
    expect(feedbackFor(attempt)).toMatchObject({status: 'NOT_AUTOGRADABLE'});
    expect(feedbackFor(attempt)).not.toHaveProperty('earned');
    expect(feedbackFor((await repository(factory).load()).data.attempts[0])).toEqual(feedbackFor(attempt));
    const backup = await repo.exportBackup();
    const restored = await repo.restore(backup, submitted.data);
    expect(restored.data.attempts[0].answer).toEqual(answer);
    const retry = await service.retry(restored.data.attempts[0], 'curriculum-retry', restored.data);
    expect(retry.data.attempts[1]).toMatchObject({status: 'DRAFT', solutionViewed: true});
    expect(resolveAttempt({...attempt, exercise: {...attempt.exercise!, version: 'obsolete'}}).status).toBe('UNAVAILABLE');
  });
});
