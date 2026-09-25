// @vitest-environment jsdom
import {describe, expect, it} from 'vitest';
import {act, createElement} from 'react';
import {createRoot} from 'react-dom/client';
import {MemoryRouter} from 'react-router';
import {IDBFactory} from 'fake-indexeddb';
import {curriculumCourses} from '../src/curriculum/registry';
import {curriculumExercises, type CurriculumPracticeExercise} from '../src/curriculum/practice';
import {PracticeService, feedbackFor, resolveAttempt} from '../src/practice/service';
import {PracticePage} from '../src/practice/PracticePage';
import {attemptPath} from '../src/practice/catalog';
import {LearningProvider} from '../src/learning/LearningProvider';
import {emptyBackup, parseBackup, toBackup, type Answer, type Attempt} from '../src/learning/contracts';
import {deriveEvidence, eligibleSkill} from '../src/adaptive/evidence';
import {buildStudySession} from '../src/adaptive/session';
import {deriveProgress} from '../src/progress/derive';
import {deriveCourseCompletion} from '../src/progress/completion';
import {projectLearner, validatePayload, validateSnapshot, type CloudSnapshot} from '../src/cloud/model';
import {repository, time} from './helpers/learning';

const now = Date.parse(time);
const objective = () => curriculumExercises.find(exercise => exercise.task.format === 'choice')!;
const openExercise = () => curriculumExercises.find(exercise => exercise.task.format === 'open')!;
function wrongAnswer(exercise: CurriculumPracticeExercise): Answer {
  if (exercise.reference.kind !== 'choice') throw new Error('Expected a choice fixture.');
  const correct = exercise.reference.value[0];
  return {kind: 'choice', value: [exercise.task.options.find(option => option.id !== correct)!.id]};
}
async function submit(repo: ReturnType<typeof repository>, exercise: CurriculumPracticeExercise, id: string, answer: Answer) {
  const service = new PracticeService(repo);
  const state = await repo.load();
  const draft = await service.start(exercise.id, id, state.data);
  return service.submit(draft.data.attempts.find(attempt => attempt.attemptId === id)!, answer, `submit-${id}`, draft.data);
}

describe('curriculum learning contracts', () => {
  it.each(curriculumCourses.map(course => course.id))('routes an objective submission through mistakes, study planning and mastery for %s', async courseId => {
    const exercise = curriculumExercises.find(item => item.subjectId === courseId && item.task.format === 'choice')!;
    expect(exercise).toBeDefined();
    const repo = repository();
    try {
      const wrong = await submit(repo, exercise, 'wrong-objective', wrongAnswer(exercise));
      const attempt = wrong.data.attempts[0];
      expect(feedbackFor(attempt)).toMatchObject({status: 'GRADED', correct: false});
      expect(eligibleSkill(exercise)?.id).toBe(exercise.skillId);
      const evidence = deriveEvidence(wrong.data.attempts, [], now);
      expect(evidence.limited).toEqual([]);
      expect(evidence.mistakes).toHaveLength(1);
      expect(evidence.groups[0].skill.id).toBe(exercise.skillId);
      const plan = buildStudySession(evidence, {minutes: 30, subjectId: courseId, topicId: exercise.topicId});
      expect(plan.some(action => action.to === attemptPath(exercise, attempt.attemptId))).toBe(true);
      expect(plan.every(action => action.subjectId === courseId)).toBe(true);
      expect(plan.reduce((total, action) => total + action.minutes, 0)).toBe(30);
      const progress = deriveProgress(toBackup(wrong.data), now);
      expect(progress.evidence.observations).toHaveLength(1);
      expect(progress.evidence.observations[0]).toMatchObject({correct: false, skillId: exercise.skillId, courseId});
      expect(progress.skills.find(skill => skill.id === exercise.skillId)).toMatchObject({index: 0, observations: 1});
      expect(progress.readiness.find(item => item.courseId === courseId)?.index).toBeNull();
      const correct = await submit(repo, exercise, 'correct-objective', exercise.reference);
      const correctAttempt = correct.data.attempts.find(item => item.attemptId === 'correct-objective')!;
      expect(feedbackFor(correctAttempt)).toMatchObject({status: 'GRADED', correct: true});
      const successOnly = {...emptyBackup(), attempts: [correctAttempt]};
      expect(deriveEvidence(successOnly.attempts, [], now).mistakes).toEqual([]);
      expect(deriveProgress(successOnly, now).skills.find(skill => skill.id === exercise.skillId)?.index).toBeGreaterThan(0);
    } finally { repo.close(); }
  });

  it('counts submitted reasoning as activity and open participation without mastery or mistakes', async () => {
    const exercise = openExercise();
    const repo = repository();
    try {
      const state = await submit(repo, exercise, 'open-work', {kind: 'text', value: 'My argument states assumptions and justifies its conclusion.'});
      expect(feedbackFor(state.data.attempts[0])).toMatchObject({status: 'NOT_AUTOGRADABLE'});
      const evidence = deriveEvidence(state.data.attempts, [], now);
      expect(evidence.mistakes).toEqual([]);
      expect(evidence.groups).toEqual([]);
      expect(evidence.limited).toEqual([]);
      const progress = deriveProgress(toBackup(state.data), now);
      expect(progress.evidence.observations).toEqual([]);
      expect(progress.evidence.limited).toEqual([]);
      expect(progress.evidence.open).toHaveLength(1);
      expect(progress.evidence.open[0]).toMatchObject({courseId: exercise.subjectId, topicId: exercise.topicId, mechanism: exercise.skillId});
      expect(progress.skills.find(skill => skill.id === exercise.skillId)).toMatchObject({index: null, observations: 0});
      expect(progress.readiness.find(item => item.courseId === exercise.subjectId)?.index).toBeNull();
      expect(deriveCourseCompletion([exercise], state.data.attempts)[0]).toMatchObject({completed: 1, eligible: 1, percentage: 100});
      const draft: Attempt = {...state.data.attempts[0], status: 'DRAFT'};
      delete draft.submission;
      expect(deriveCourseCompletion([exercise], [draft])[0].completed).toBe(0);
    } finally { repo.close(); }
  });

  it('round-trips objective and open answers through backup import and the client sync envelope', async () => {
    const repo = repository(), imported = repository(new IDBFactory());
    try {
      await submit(repo, objective(), 'objective-export', objective().reference);
      const state = await submit(repo, openExercise(), 'open-export', {kind: 'text', value: 'Reasoning preserved verbatim.\nSecond line.'});
      const original = toBackup(state.data);
      const parsed = parseBackup(JSON.stringify(await repo.exportBackup()));
      expect(parsed).toEqual(original);
      const payload = projectLearner(parsed);
      expect(() => validatePayload(payload)).not.toThrow();
      expect(payload).not.toHaveProperty('resume');
      expect(payload).not.toHaveProperty('mastery');
      expect(payload.attempts.every(attempt => !Object.hasOwn(attempt, 'earned'))).toBe(true);
      const snapshot: CloudSnapshot = {owner: '11111111-1111-4111-8111-111111111111', revision: 1,
        operationId: '22222222-2222-4222-8222-222222222222', schema: 1, payload};
      const downloaded = JSON.parse(JSON.stringify(snapshot));
      expect(() => validateSnapshot(downloaded, snapshot.owner)).not.toThrow();
      expect(() => validateSnapshot(downloaded, '33333333-3333-4333-8333-333333333333')).toThrow();
      expect(() => validatePayload({...payload, mastery: 100})).toThrow();
      expect(() => validatePayload({...payload, attempts: [{...payload.attempts[0], earned: 1}]})).toThrow();
      const empty = await imported.load();
      const restored = await imported.restore({...downloaded.payload, resume: null}, empty.data);
      expect(restored.data.attempts).toEqual(original.attempts);
      expect(restored.data.attempts.map(feedbackFor)).toEqual(original.attempts.map(feedbackFor));
      expect(deriveProgress(toBackup(restored.data), now)).toEqual(deriveProgress(original, now));
    } finally { repo.close(); imported.close(); }
  });

  it('preserves unavailable historical bindings on import and excludes them from all evaluated evidence', async () => {
    const repo = repository();
    try {
      const state = await submit(repo, objective(), 'historical', wrongAnswer(objective()));
      const backup = await repo.exportBackup();
      backup.attempts[0].exercise!.version = '1:sha256:historical-content:grader:historical-grader';
      const restored = await repo.restore(parseBackup(JSON.stringify(backup)), state.data);
      const attempt = restored.data.attempts[0];
      expect(attempt.answer).toEqual(backup.attempts[0].answer);
      expect(attempt.exercise).toEqual(backup.attempts[0].exercise);
      expect(resolveAttempt(attempt).status).toBe('UNAVAILABLE');
      expect(feedbackFor(attempt)).not.toHaveProperty('earned');
      const mistakes = deriveEvidence([attempt], [], now);
      expect(mistakes.mistakes).toEqual([]);
      expect(mistakes.groups).toEqual([]);
      expect(mistakes.limited).toHaveLength(1);
      const progress = deriveProgress(toBackup(restored.data), now);
      expect(progress.evidence.observations).toEqual([]);
      expect(progress.evidence.open).toEqual([]);
      expect(progress.evidence.limited).toHaveLength(1);
      expect(deriveCourseCompletion([objective()], [attempt])[0].completed).toBe(0);
      expect(() => validatePayload(projectLearner(toBackup(restored.data)))).not.toThrow();
    } finally { repo.close(); }
  });

  it('shows raw curriculum IDs and removed exercises in history while excluding unbound records', async () => {
    Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true});
    const repo = repository();
    const host = document.createElement('div');
    document.body.append(host);
    const root = createRoot(host);
    try {
      const exercise = objective();
      expect(exercise.id.startsWith('ds.practice.')).toBe(false);
      const state = await submit(repo, exercise, 'history-current', exercise.reference);
      const original = state.data.attempts[0];
      const renamed = (id: string): Attempt => ({...structuredClone(original), attemptId: id,
        exercise: {...original.exercise!, id: `ds.instance.${id}`}, submission: {...original.submission!, operationId: `submit-${id}`}});
      const unavailable = {...renamed('history-removed'), templateRef: 'REMOVED-CURRICULUM-ITEM'};
      const templateOnly = renamed('history-template-only'); delete templateOnly.exercise;
      const exerciseOnly = renamed('history-exercise-only'); delete exerciseOnly.templateRef;
      await repo.restore({...toBackup(state.data), attempts: [original, unavailable, templateOnly, exerciseOnly]}, state.data);
      await act(async () => root.render(createElement(MemoryRouter, {initialEntries: [`/practice?subject=${exercise.subjectId}`]},
        createElement(LearningProvider, {createRepository: () => repo, children: createElement(PracticePage)}))));
      for (let tries = 0; tries < 100 && host.querySelectorAll('.ds-attempt-list li').length !== 2; tries++)
        await act(async () => { await new Promise(resolve => setTimeout(resolve, 10)); });
      expect(host.querySelectorAll('.ds-attempt-list li')).toHaveLength(2);
      const links = [...host.querySelectorAll<HTMLAnchorElement>('.ds-attempt-list a')];
      expect(links.map(link => link.getAttribute('href'))).toContain(attemptPath(exercise, original.attemptId));
      const historical = links.find(link => link.getAttribute('href') === '/practice/REMOVED-CURRICULUM-ITEM/attempts/history-removed');
      expect(historical).toBeDefined();
      expect(historical!.textContent).toContain('Original exercise version unavailable');
    } finally { await act(async () => root.unmount()); host.remove(); repo.close(); }
  });
});
