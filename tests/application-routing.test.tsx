// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { BrowserRouter, MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppRoutes } from '../src/App';
import { academicIndex, ASSEMBLY_TOOL_PATH, ASSEMBLY_TOPIC_PATH, courses, productAreas, topicPath, topicsFor } from '../src/academic/navigation';
import { examplePrograms } from '../src/examples/examplePrograms';
import {allExercises} from '../src/practice/catalog';

Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true});
let container: HTMLDivElement;
let root: Root;
beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, '', '/');
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  container = document.createElement('div'); document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => { await act(async () => root.unmount()); container.remove(); vi.restoreAllMocks(); });


async function settleRoutes(){const loading=()=>[...container.querySelectorAll('[role="status"]')].some(n=>/^Loading /.test(n.textContent??''));for(let i=0;i<150&&loading();i++)await act(async()=>{await new Promise(r=>setTimeout(r,10));});expect(loading(),'lazy route resolved').toBe(false);}
async function renderRoute(path: string, browser = false) {
  if (browser) window.history.replaceState(null, '', path);
  await act(async () => {
    root.render(browser ? <BrowserRouter><AppRoutes/></BrowserRouter> : <MemoryRouter initialEntries={[path]}><AppRoutes/></MemoryRouter>);
    if (path === ASSEMBLY_TOOL_PATH) await import('../src/AssemblyWorkbench');
  });await settleRoutes();
}
async function click(selector: string) {
  const element = container.querySelector<HTMLElement>(selector);
  expect(element, selector).not.toBeNull();
  await act(async () => element!.click());await settleRoutes();
}
function button(label: string): HTMLButtonElement {
  const result = [...container.querySelectorAll('button')].find(item => item.textContent?.trim() === label);
  expect(result, label).toBeDefined(); return result!;
}
async function clickButton(label: string) { await act(async () => button(label).click()); }
const heading = () => container.querySelector('h1')?.textContent;
const register = (name: string) => container.querySelector(`[data-register="${name}"] .register-value`)?.textContent;

describe('application routes and canonical navigation', () => {
  it('renders the public positioning at /', async () => {
    await renderRoute('/'); expect(heading()).toBe('Study what matters.Know what you actually understand.');
    expect(container.textContent).toContain('A study system, not another chat window');
    expect(container.textContent).toContain('Built for focused university study.');
    expect(container.querySelector('a[href="/dashboard"]')).not.toBeNull();
  });
  it('renders the Dashboard at /dashboard', async () => {
    await renderRoute('/dashboard'); expect(heading()).toBe('Dashboard');
    expect(container.querySelectorAll('.ds-course-card')).toHaveLength(3);
    expect(container.textContent).toContain('3 courses · 43 topics');
  });
  it.each(courses)('renders $path from canonical course data', async course => {
    await renderRoute(course.path);
    expect(heading()).toBe(course.name);
    const links = [...container.querySelectorAll('.ds-topic-list > li > a')];
    const topics = topicsFor(course.subject_id);
    expect(links).toHaveLength(topics.length);
    expect(links.map(link => link.getAttribute('href'))).toEqual(topics.map(topicPath));
    topics.forEach((topic, index) => expect(links[index].textContent).toContain(topic.name));
    expect(container.querySelector('nav[aria-label="Primary navigation"] [aria-current="page"]')?.getAttribute('href')).toBe('/dashboard#courses');
  });
  it.each(academicIndex.topics)('renders the canonical topic $topic_id under its own course', async topic => {
    await renderRoute(topicPath(topic));
    expect(heading()).toBe(topic.name);
    expect(container.querySelector('.ds-topic-id')).toBeNull();
    expect(container.querySelector('.ds-page-heading')?.textContent).toContain(courses.find(course => course.subject_id === topic.subject_id)!.name);
    expect(container.querySelectorAll('[role="tab"]')).toHaveLength(7); // Step 5 adds deep-linkable Learn to the six existing modes.
  });
  it.each(productAreas)('renders the $title shell with a neutral empty state', async area => {
    await renderRoute(area.path);
    expect(heading()).toBe(area.title);
    // Step 4 intentionally replaces only the Practice placeholder with authored items, expanded for CO in Step 6.
    if (area.path === '/practice') {
      expect(container.querySelectorAll('.ds-practice-card')).toHaveLength(allExercises.length);
      expect(allExercises.every(exercise=>container.querySelector(`a[href="/practice/${exercise.id}"]`))).toBe(true);
      expect(container.textContent).toContain('Authored practice');
    } else if (area.path === '/mistakes' || area.path === '/study-plan' || area.path === '/exams' || area.path === '/progress') {
      expect(container.querySelector('[role="status"]')?.textContent).toContain('Student storage is not connected.');
      expect(container.querySelectorAll('.ds-mistake-card,.ds-path-card')).toHaveLength(0);
    }
    expect(container.textContent).not.toMatch(/\d+%|streak|\d+ days/);
  });
  it.each(['/missing', '/co/MISSING', '/co/RL_T01_PROP_LOGIC', '/rl/CO_T06_ASSEMBLY_X86_64', '/co/co_t06_assembly_x86_64', '/co/CO_T06_ASSEMBLY_X86_64/unknown'])('shows Not Found for %s', async path => {
    await renderRoute(path); expect(heading()).toBe('Page not found');
    await click('.ds-not-found a'); expect(heading()).toBe('Dashboard');
  });
});

describe('shell interaction and browser history', () => {
  it('provides the desktop navigation, landmark, skip link and all six primary destinations', async () => {
    await renderRoute('/dashboard');
    const links = [...container.querySelectorAll('nav[aria-label="Primary navigation"] a')];
    expect(links.map(link => link.getAttribute('href'))).toEqual(['/dashboard','/dashboard#courses','/practice','/progress','/study-plan','/account#settings']);
    expect(container.querySelectorAll('main')).toHaveLength(1);
    expect(container.querySelector('.ds-skip-link')?.getAttribute('href')).toBe('#ds-content');
    expect(document.title).toBe('Dashboard · Notedra');
  });
  it('opens and closes mobile navigation with an accessible expanded state', async () => {
    await renderRoute('/dashboard');
    const menu = container.querySelector<HTMLButtonElement>('.ds-menu-button')!;
    expect(menu.getAttribute('aria-expanded')).toBe('false');
    await click('.ds-menu-button');
    expect(menu.getAttribute('aria-expanded')).toBe('true');
    expect(container.querySelector('.ds-sidebar')?.classList.contains('is-open')).toBe(true);
    await act(async () => window.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'})));
    expect(menu.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(menu);
  });
  it('closes navigation after choosing a course and moves focus to the new content', async () => {
    await renderRoute('/dashboard'); await click('.ds-menu-button');
    await click('.ds-course-card[href="/co"]');
    expect(heading()).toBe(courses[0].name);
    expect(container.querySelector('.ds-menu-button')?.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement?.id).toBe('ds-content');
    expect(document.title).toBe(`${courses[0].name} · Notedra`);
  });
  it('returns focus to the menu when its current-page link closes mobile navigation', async () => {
    await renderRoute('/dashboard'); await click('.ds-menu-button');
    const link = container.querySelector<HTMLAnchorElement>('nav[aria-label="Primary navigation"] a[href="/dashboard"]')!;
    link.focus();
    await act(async () => link.click());
    expect(document.activeElement).toBe(container.querySelector('.ds-menu-button'));
    expect(container.querySelector('.ds-menu-button')?.getAttribute('aria-expanded')).toBe('false');
  });
  it('navigates course → topic with working breadcrumbs and active course state', async () => {
    await renderRoute('/co'); await click(`a[href="${ASSEMBLY_TOPIC_PATH}"]`);
    expect(heading()).toBe('x86-64 Assembly and stack execution');
    expect(container.querySelector('nav[aria-label="Primary navigation"] [aria-current="page"]')?.getAttribute('href')).toBe('/dashboard#courses');
    await click('.ds-breadcrumbs a[href="/co"]'); expect(heading()).toBe(courses[0].name);
  });
  it('supports native BrowserRouter Back and Forward without losing route context', async () => {
    await renderRoute('/dashboard', true);
    await click('.ds-course-card[href="/co"]');
    await click(`a[href="${ASSEMBLY_TOPIC_PATH}"]`);
    expect(window.location.pathname).toBe(ASSEMBLY_TOPIC_PATH);
    await act(async () => { const popped = new Promise(resolve => window.addEventListener('popstate', resolve, {once: true})); window.history.back(); await popped; });
    expect(window.location.pathname).toBe('/co'); expect(heading()).toBe(courses[0].name);
    await act(async () => { const popped = new Promise(resolve => window.addEventListener('popstate', resolve, {once: true})); window.history.forward(); await popped; });
    expect(window.location.pathname).toBe(ASSEMBLY_TOPIC_PATH);
    expect(heading()).toBe('x86-64 Assembly and stack execution');
  });
  it('supports topic mode clicks and keyboard navigation with the CO cards and shared Practice available', async () => {
    await renderRoute(ASSEMBLY_TOPIC_PATH);
    await click('#study-mode-3');
    expect(container.querySelector('[role="tabpanel"]')?.textContent).toContain('Card 1 of 7');
    const flashcards = container.querySelector<HTMLButtonElement>('#study-mode-3')!;
    await act(async () => flashcards.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true})));
    expect(document.activeElement?.id).toBe('study-mode-4');
    expect(container.querySelector('#study-mode-4')?.getAttribute('aria-selected')).toBe('true');
    await settleRoutes();expect(container.querySelector('[role="tabpanel"]')?.textContent).toContain('Unscored guided practice');expect(container.querySelector('[role="tabpanel"]')?.textContent).toContain('Assembly Visualizer');
  });
});

describe('integrated Assembly workbench regression', () => {
  it('retains the existing local editor draft when navigating away before autosave delay', async () => {
    localStorage.setItem('delftstudy:v1:program', examplePrograms[0].source);
    await renderRoute(ASSEMBLY_TOOL_PATH);
    const editor = container.querySelector<HTMLTextAreaElement>('textarea[aria-label="Assembly program"]')!;
    const draft = 'main:\n    movq $42, %rax';
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(editor, draft);
      editor.dispatchEvent(new Event('input', {bubbles: true}));
    });
    expect(button('Next Instruction').disabled).toBe(true);
    await click('.ds-tool-back');
    expect(localStorage.getItem('delftstudy:v1:program')).toBe(draft);
    await click(`a[href="${ASSEMBLY_TOOL_PATH}"]`);
    expect(container.querySelector<HTMLTextAreaElement>('textarea')?.value).toBe(draft);
  });
  it('pauses and removes the running timer and keyboard listeners when leaving the tool', async () => {
    localStorage.setItem('delftstudy:v1:program', examplePrograms[0].source);
    await renderRoute(ASSEMBLY_TOOL_PATH);
    vi.useFakeTimers();
    const intervals = vi.spyOn(window, 'setInterval');
    const clearInterval = vi.spyOn(window, 'clearInterval');
    try {
      await clickButton('Run');
      await act(async () => vi.advanceTimersByTime(650));
      expect(register('rax')).toBe('5');
      await clickButton('Pause');
      await act(async () => vi.advanceTimersByTime(1300));
      expect(container.querySelector('.instruction-counter')?.textContent).toContain('1 executed');
      await clickButton('Run');
      const runningTimer = intervals.mock.results.at(-1)!.value;
      await click('.ds-tool-back');
      expect(clearInterval).toHaveBeenCalledWith(runningTimer);
      await act(async () => vi.advanceTimersByTime(1300));
      expect(container.querySelector('.workspace-grid')).toBeNull();
      expect(heading()).toBe('x86-64 Assembly and stack execution');
    } finally { vi.useRealTimers(); }
  });
  it.each(examplePrograms)('executes $name through the routed workbench', async example => {
    localStorage.setItem('delftstudy:v1:program', example.source);
    await renderRoute(ASSEMBLY_TOOL_PATH);
    expect(heading()).toContain('Assembly workbench');
    expect(container.querySelectorAll('main')).toHaveLength(1);
    expect(container.querySelector('.ds-app')?.classList.contains('ds-tool')).toBe(true);
    let steps = 0;
    while (!button('Next Instruction').disabled && steps++ < 30) await clickButton('Next Instruction');
    expect(steps).toBeLessThan(30);
    expect(register('rax')).toBe(example.id === 'arithmetic' ? '8' : example.id === 'stack-frame' ? '15' : '7');
    if (example.id === 'function-call') expect(register('rbx')).toBe('7');
    expect(container.querySelector('[data-register="rsp"] .pointer-value')?.textContent).toBe('0x10004096');
    expect(container.querySelector('[data-register="rbp"] .pointer-value')?.textContent).toBe('0x10004096');
    expect(container.querySelector('.instruction-counter')?.textContent).toContain('Program complete');
    await clickButton('Previous'); expect(button('Next Instruction').disabled).toBe(false);
    await clickButton('Next Instruction'); expect(container.querySelector('.instruction-counter')?.textContent).toContain('Program complete');
    await clickButton('Reset'); expect(register('rax')).toBe('0');
    await click('.ds-tool-back'); expect(heading()).toBe('x86-64 Assembly and stack execution');
  });
  it('preserves load errors and can return to the course without running hidden instructions', async () => {
    localStorage.setItem('delftstudy:v1:program', 'unknownq %rax, %rax');
    await renderRoute(ASSEMBLY_TOOL_PATH);
    expect(container.querySelector('[role="alert"]')?.textContent).toContain('Unsupported instruction');
    expect(button('Run').disabled).toBe(true);
    await click('.ds-breadcrumbs a[href="/co"]');
    expect(heading()).toBe(courses[0].name);
    await act(async () => window.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', altKey: true})));
    expect(heading()).toBe(courses[0].name);
    expect(container.querySelector('.workspace-grid')).toBeNull();
  });
});
