// @vitest-environment jsdom
import enrichment from '../src/enrichment/capabilities.json';
import {act} from 'react';
import {createRoot, type Root} from 'react-dom/client';
import {MemoryRouter} from 'react-router';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {RLStudyMode} from '../src/rl/RLStudyMode';
import type {RLTopicContent} from '../src/rl/types';
import capabilities from '../src/rl/capabilities.json';
import tools from '../src/rl/tools.json';
import introGuided from '../src/rl/intro-guided.json';
import {topicStudy, lessonFor, cardsFor} from '../src/topic-study/content';
import {studyPath} from '../src/topic-study/AcademicViews';
import {allExercises, exercisePath} from '../src/practice/catalog';
import {LearningProvider, useLearning} from '../src/learning/LearningProvider';
import {CoursePage} from '../src/pages/CoursePage';
import {courses, topicsFor} from '../src/academic/navigation';
import {AppRoutes} from '../src/App';
import {repository} from './helpers/learning';

const files = import.meta.glob<RLTopicContent>('../src/rl/topics/*.json', {eager: true, import: 'default'});
const topics = topicStudy.topics.filter(topic => topic.subjectId === 'CSE1300_RL');
const course = courses.find(item => item.subject_id === 'CSE1300_RL')!;
const contentFor = (topicId: string) => topicId === 'RL_T01_PROP_LOGIC'
  ? {lesson: lessonFor(topicId)!, cards: cardsFor(topicId), guided: introGuided}
  : files[`../src/rl/topics/${topicId}.json`];
function StorageProbe() { return <span hidden data-storage-phase={useLearning()?.phase}/>; }

Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true});
let root: Root, host: HTMLDivElement;
let errors: ReturnType<typeof vi.spyOn>, warnings: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  host = document.createElement('div'); document.body.append(host); root = createRoot(host);
  errors = vi.spyOn(console, 'error'); warnings = vi.spyOn(console, 'warn');
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});
afterEach(async () => {
  await act(async () => root.unmount()); host.remove();
  try { expect(errors).not.toHaveBeenCalled(); expect(warnings).not.toHaveBeenCalled(); }
  finally { vi.restoreAllMocks(); }
});
async function settle() {
  const loading = () => Boolean(host.querySelector('[data-storage-phase="loading"]')) || [...host.querySelectorAll('[role="status"]')].some(item => /^Loading /.test(item.textContent ?? ''));
  for (let index = 0; index < 150 && loading(); index++) await act(async () => { await new Promise(resolve => setTimeout(resolve, 10)); });
  expect(loading(), 'all topic/workspace lazy boundaries resolved').toBe(false);
}
async function click(name: string) {
  const button = [...host.querySelectorAll('button')].find(item => item.textContent === name);
  expect(button, name).toBeDefined(); await act(async () => button!.click()); await settle();
}

describe('complete R&L topic learning routes', () => {
  it.each(topics)('$id exposes its lesson, cards, shared exercises and unscored activities without changing student data', async topic => {
    const repo = repository(); await repo.load(); const before = await repo.exportBackup();
    const createRepository = () => repo;
    const content = contentFor(topic.id), capability = capabilities.find(item => item.topicId === topic.id)!;
    const expectedExercises = allExercises.filter(exercise => exercise.topicId === topic.id);
    const render = async (mode: 'learn' | 'flashcards' | 'practice') => {
      // A neutral router location isolates studying from the existing, intentional last-visited-topic recorder.
      await act(async () => root.render(<MemoryRouter><LearningProvider createRepository={createRepository}><StorageProbe/><RLStudyMode topic={topic} mode={mode}/></LearningProvider></MemoryRouter>));
      await settle();
    };

    await render('learn');
    expect(host.querySelector('.ds-lesson-introduction')).not.toBeNull();
    expect(host.querySelector('.ds-lesson-concept,.ds-lesson-procedure,.ds-lesson-worked_example')).not.toBeNull();
    expect(host.querySelector('.ds-lesson-recap')).not.toBeNull();
    expect(host.querySelectorAll('.ds-study-reading > .ds-lesson-block')).toHaveLength(content.lesson.blocks.length);
    for (const block of content.lesson.blocks) expect(document.getElementById(block.id)?.textContent).toContain(block.title);
    expect(host.textContent).toContain('Authored DelftStudy learning content');
    expect(host.textContent).toContain('Broad document-level provenance, not an exact supporting slide or page.');
    const firstSource = topicStudy.sources.find(source => source.id === content.lesson.blocks[0].sourceIds[0])!;
    expect(host.textContent).toContain(firstSource.filename);
    expect(host.textContent).toContain(firstSource.locator);
    expect(await repo.exportBackup()).toEqual(before);

    await render('flashcards');
    expect(host.querySelector('#card-prompt')?.textContent).toBe(content.cards[0].prompt);
    expect(host.querySelector('[role="status"]')?.textContent).toBe(`Card 1 of ${content.cards.length}`);
    expect(content.cards.length).toBe(capability.cardCount);
    expect(host.querySelector<HTMLElement>('#card-answer')!.hidden).toBe(true);
    await click('Reveal answer');
    expect(host.querySelector<HTMLElement>('#card-answer')!.hidden).toBe(false);
    expect(host.querySelector('#card-answer')?.textContent).toContain(content.cards[0].answer);
    await click('Next card');
    expect(host.querySelector('#card-prompt')?.textContent).toBe(content.cards[1].prompt);
    expect(host.querySelector<HTMLElement>('#card-answer')!.hidden).toBe(true);
    await click('Shuffle cards'); await click('Reset order');
    expect(host.querySelector('#card-prompt')?.textContent).toBe(content.cards[0].prompt);
    expect(host.querySelector<HTMLElement>('#card-answer')!.hidden).toBe(true);
    expect(host.textContent).toContain('Broad document-level provenance');
    expect(await repo.exportBackup()).toEqual(before);

    await render('practice');
    expect(host.querySelectorAll('.ds-practice-card')).toHaveLength(expectedExercises.length);
    expect(expectedExercises.filter(e=>e.task.kind!=='enrichment-exact').length).toBe(capability.exerciseCount);expect(expectedExercises.length).toBe(capability.exerciseCount+(enrichment.find(e=>e.topicId===topic.id)?.exercises??0));
    expect(host.querySelectorAll('.ds-rl-guided')).toHaveLength(content.guided.length);
    expect(content.guided.length).toBe(capability.guidedCount);
    for (const exercise of expectedExercises) {
      const card = [...host.querySelectorAll('.ds-practice-card')].find(item => item.querySelector('h3')?.textContent === exercise.title)!;
      expect(card).toBeDefined(); expect(card.querySelector('a')?.getAttribute('href')).toBe(exercisePath(exercise));
    }
    expect(host.textContent).toContain('shared Practice catalog');
    expect(host.textContent).toContain('these are not official exam questions');
    expect(host.textContent).toContain('Guided reasoning · unscored self-check');
    expect(host.textContent).toContain('No automatic correctness, numeric score or academic evidence is assigned.');
    expect(host.textContent).not.toContain('Topic practice is not available yet');
    expect(host.textContent).not.toMatch(/\d+%|predicted grade|mastery score|rubric score/);

    const firstGuide = host.querySelector<HTMLElement>('.ds-rl-guided')!;
    const notes = firstGuide.querySelector<HTMLTextAreaElement>('textarea')!;
    notes.focus(); expect(document.activeElement).toBe(notes);
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(notes, 'My own unverified reasoning.');
      notes.dispatchEvent(new Event('input', {bubbles: true}));
    });
    const reveal = firstGuide.querySelector<HTMLButtonElement>('button[aria-controls]')!;
    expect(document.getElementById(reveal.getAttribute('aria-controls')!)!.hidden).toBe(true);
    await act(async () => reveal.click());
    expect(document.getElementById(reveal.getAttribute('aria-controls')!)!.hidden).toBe(false);
    expect(firstGuide.textContent).toContain('Reference reasoning');
    expect(firstGuide.querySelector('[data-grade], [data-score], input[type="checkbox"]')).toBeNull();
    const reset = [...firstGuide.querySelectorAll('button')].find(button => button.textContent?.startsWith('Reset working notes'))!;
    await act(async () => reset.click());
    expect(notes.value).toBe(''); expect(reveal.getAttribute('aria-expanded')).toBe('false');

    const tool = tools.find(item => item.topicId === topic.id);
    if (tool) {
      const workspace = host.querySelector<HTMLElement>('#rl-workspace')!;
      expect(workspace).not.toBeNull(); expect(workspace.textContent).toContain(tool.name);
      expect(workspace.textContent).toContain(tool.assumptions);
      expect(workspace.textContent).toContain('Workspace changes are not saved as Practice attempts or learning evidence.');
      const control = workspace.querySelector<HTMLInputElement | HTMLSelectElement>('input,select');
      if (control) {
        expect(control.closest('label')?.textContent?.trim()).toBeTruthy();
        control.focus(); expect(document.activeElement).toBe(control);
        await act(async () => {
          if (control instanceof HTMLInputElement && control.type === 'checkbox') control.click();
          else if (control instanceof HTMLSelectElement) {
            control.value = [...control.options].find(option => option.value !== control.value)!.value;
            control.dispatchEvent(new Event('change', {bubbles: true}));
          }
        });
      } else expect(tool.id).toBe('proof');
    } else expect(host.querySelector('#rl-workspace')).toBeNull();
    expect((await repo.load()).data.attempts).toHaveLength(0);
    expect(await repo.exportBackup()).toEqual(before);
  });

  it('shows factual capabilities in canonical topic order with the actual prerequisite links', async () => {
    const repo = repository(); await repo.load(); const before = await repo.exportBackup();
    await act(async () => root.render(<MemoryRouter><LearningProvider createRepository={() => repo}><StorageProbe/><CoursePage course={course}/></LearningProvider></MemoryRouter>));
    await settle();
    const rows = [...host.querySelectorAll<HTMLElement>('.ds-topic-list > li')];
    expect(rows).toHaveLength(9);
    expect(capabilities).toHaveLength(9);
    const canonical = topicsFor(course.subject_id);
    for (let index = 0; index < rows.length; index++) {
      const topic = topics.find(item => item.id === canonical[index].topic_id)!, content = contentFor(topic.id);
      const tool = tools.find(item => item.topicId === topic.id), row = rows[index];
      const exerciseCount = allExercises.filter(exercise => exercise.topicId === topic.id).length;
      expect(row.querySelector(':scope > a')?.getAttribute('href')).toBe(studyPath(topic));
      expect(row.querySelector('.ds-topic-order')?.textContent).toBe(String(canonical[index].order).padStart(2, '0'));
      expect(row.querySelector('.ds-rl-capability')?.textContent).toContain(`Guided lesson available · ${content.cards.length+(enrichment.find(e=>e.topicId===topic.id)?.cards??0)} flashcards · ${exerciseCount} graded exercises · ${content.guided.length+(enrichment.find(e=>e.topicId===topic.id)?.guides??0)} unscored activities`);
      if (tool) expect(row.textContent).toContain(`${tool.name} available`);
      for (const prerequisite of topic.prerequisites) {
        const target = topics.find(item => item.id === prerequisite)!;
        expect([...row.querySelectorAll('.ds-rl-capability a')].map(link => link.getAttribute('href'))).toContain(studyPath(target));
      }
      if (!topic.prerequisites.length) expect(row.textContent).toContain('No topic prerequisites');
    }
    expect(host.textContent).toContain('reading does not mark a topic complete');
    expect(host.textContent).not.toMatch(/\d+%|predicted grade|streak/);
    expect(await repo.exportBackup()).toEqual(before);
  });

  it('keeps every R&L Exam-style deep link as an honest placeholder, separate from authored practice', async () => {
    for (const topic of topics) {
      const path = studyPath(topic, 'exam-style');
      await act(async () => root.render(<MemoryRouter key={path} initialEntries={[path]}><AppRoutes/></MemoryRouter>));
      await settle();
      expect(host.querySelector('h1')?.textContent).toBe(topic.name);
      expect(host.querySelector('[role="tabpanel"]')?.textContent).toContain('Exam-style practice is not available yet');
      expect(host.querySelector('[role="tabpanel"]')?.textContent).toContain('shared Practice items are introductory authored study exercises');
      expect(host.querySelector('.ds-practice-card,.ds-rl-guided,#rl-workspace')).toBeNull();
      expect(host.querySelector('[role="tab"][aria-selected="true"]')?.textContent).toBe('Exam-style');
      expect(host.textContent).not.toMatch(/\d+%|predicted grade|official exam score/);
    }
  });
});
