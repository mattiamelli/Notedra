// @vitest-environment jsdom
import { act, StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppRoutes } from '../src/App';
import { LearningProvider } from '../src/learning/LearningProvider';
import { emptyBackup, type LoadedState } from '../src/learning/contracts';
import { IndexedStudentRepository, type StudentRepository } from '../src/learning/repository';
import { position, repository } from './helpers/learning';
import { academicIndex, topicPath } from '../src/academic/navigation';
Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true});
let container: HTMLDivElement; let root: Root;
beforeEach(() => { container = document.createElement('div'); document.body.append(container); root = createRoot(container); vi.spyOn(window, 'scrollTo').mockImplementation(() => {}); });
afterEach(async () => { await act(async () => root.unmount()); container.remove(); vi.restoreAllMocks(); });
async function loaded(repo: StudentRepository) { let result!: LoadedState; await act(async () => { result = await repo.load(); }); return result; }
async function settle() { await act(async () => { await new Promise(resolve => setTimeout(resolve, 35)); }); }
async function mount(repo: StudentRepository, path = '/') {
  await act(async () => root.render(<MemoryRouter initialEntries={[path]}><LearningProvider createRepository={() => repo}><AppRoutes/></LearningProvider></MemoryRouter>));
  await settle();
}
async function click(label: string) {
  const button = [...container.querySelectorAll('button')].find(item => item.textContent === label)!;
  expect(button).toBeDefined(); await act(async () => button.click()); await settle();
}
async function choose(text: string) {
  const input = container.querySelector<HTMLInputElement>('input[type=file]')!;
  const file = new File([text], 'student.json', {type: 'application/json'}); Object.assign(file, {text: async () => text});
  Object.defineProperty(input, 'files', {configurable: true, value: [file]});
  await act(async () => input.dispatchEvent(new Event('change', {bubbles: true}))); await settle();
}
describe('student data UI', () => {
  it('shows no fabricated data on a fresh Dashboard', async () => {
    await mount(repository()); expect(container.textContent).not.toContain('Resume last topic');
    expect(container.textContent).not.toMatch(/streak/);
    await vi.waitFor(() => expect(container.querySelectorAll('.ds-course-completion [role=progressbar]')).toHaveLength(3));
    const completion = [...container.querySelectorAll<HTMLElement>('.ds-course-completion [role=progressbar]')];
    expect(completion.every(item => item.getAttribute('aria-valuenow') === '0')).toBe(true);
  });
  it('shows the canonical saved topic label and safe route after remount', async () => {
    const repo = repository(); const initial = await loaded(repo); await repo.saveResume(position, initial.data);
    await mount(repo);
    const topic = academicIndex.topics.find(item => item.topic_id === position.topicId)!;
    expect(container.querySelector('.ds-resume a')?.getAttribute('href')).toBe(topicPath(topic));
    expect(container.querySelector('.ds-resume')?.textContent).toContain(topic.name);
    expect(container.querySelector('.ds-resume')?.textContent).toContain('Computer Organisation');
  });
  it('records only valid topic visits and never an invalid route', async () => {
    const repo = repository(); await mount(repo, '/co/MISSING'); expect((await loaded(repo)).data.resume).toBeNull();
    await act(async () => container.querySelector<HTMLAnchorElement>('.ds-not-found a')!.click());
    const href = '/co/CO_T06_ASSEMBLY_X86_64';
    await act(async () => { container.querySelector<HTMLAnchorElement>(`a[href="${href}/visualizer"]`)!.click(); await import('../src/AssemblyWorkbench'); }); await settle();
    expect((await loaded(repo)).data.resume?.topicId).toBe(position.topicId);
    expect((await loaded(repo)).data.attempts).toEqual([]);
  });
  it('does not overwrite existing data while initial loading is delayed', async () => {
    const repo = repository(); const initial = await loaded(repo); const saved = await repo.saveResume(position, initial.data);
    let release!: (value: LoadedState) => void;
    vi.spyOn(repo, 'load').mockReturnValueOnce(new Promise(resolve => { release = resolve; }));
    await mount(repo); expect(container.textContent).not.toContain('Resume last topic');
    await act(async () => release(saved)); await settle();
    expect(container.querySelector('.ds-resume')).not.toBeNull(); expect((await loaded(repo)).data).toEqual(saved.data);
  });
  it('survives StrictMode setup and cleanup without closing the active repository', async () => {
    const factory = new IDBFactory();
    const create = () => new IndexedStudentRepository({factory, name: 'strict'});
    await act(async () => root.render(<StrictMode><MemoryRouter><LearningProvider createRepository={create}><AppRoutes/></LearningProvider></MemoryRouter></StrictMode>)); await settle();
    expect(container.querySelector('[role=alert]')).toBeNull();
    expect((await create().load()).data.attempts).toEqual([]);
  });
  it('shows accessible storage errors and disables backup writes', async () => {
    const repo = repository(); vi.spyOn(repo, 'load').mockRejectedValue(new Error('No storage'));
    await mount(repo, '/account'); expect(container.querySelector('[role=alert]')?.textContent).toContain('Local storage failed');
    await vi.waitFor(() => expect(container.querySelector<HTMLInputElement>('input[type=file]')).not.toBeNull());
    expect(container.querySelector<HTMLInputElement>('input[type=file]')?.disabled).toBe(true);
    expect(container.textContent).toContain('Reload saved data');
  });
  it('requires explicit restore confirmation, supports cancellation, and exposes recovery export', async () => {
    const repo = repository(); await mount(repo, '/account'); const original = await repo.exportBackup();
    await choose(JSON.stringify({...emptyBackup(), resume: position}));
    const replace = [...container.querySelectorAll('button')].find(item => item.textContent === 'Replace student data')!;
    expect(replace.disabled).toBe(true); expect(await repo.exportBackup()).toEqual(original);
    await click('Cancel restore'); expect(container.querySelector('.ds-restore-confirm')).toBeNull();
    await choose(JSON.stringify({...emptyBackup(), resume: position}));
    await act(async () => container.querySelector<HTMLInputElement>('input[type=checkbox]')!.click());
    await click('Replace student data');
    expect((await repo.exportBackup()).resume).toEqual(position);
    expect(await repo.exportRecovery()).toEqual(original); expect(container.textContent).toContain('Export pre-restore recovery');
  });
  it('rejects malformed and fake-score imports visibly without modifying storage', async () => {
    const repo = repository(); await mount(repo, '/account'); const before = await repo.exportBackup();
    await choose('{'); expect(container.querySelector('[role=alert]')?.textContent).toContain('valid JSON');
    await choose(JSON.stringify({...emptyBackup(), mastery: 100})); expect(container.querySelector('[role=alert]')?.textContent).toContain('unsupported');
    expect(await repo.exportBackup()).toEqual(before);
  });
  it('shows a failed restore without claiming it was saved', async () => {
    const repo = repository(); await mount(repo, '/account'); vi.spyOn(repo, 'restore').mockRejectedValue(new DOMException('Full', 'QuotaExceededError'));
    await choose(JSON.stringify(emptyBackup())); await act(async () => container.querySelector<HTMLInputElement>('input[type=checkbox]')!.click());
    await click('Replace student data'); expect(container.querySelector('[role=alert]')?.textContent).toContain('Local storage failed');
    expect(container.textContent).not.toContain('Backup restored in this browser');
  });
  it('review regression: topic save failures are visible on the topic page', async () => {
    const repo = repository(); vi.spyOn(repo, 'saveResume').mockRejectedValue(new DOMException('Full', 'QuotaExceededError'));
    await mount(repo, '/co/CO_T06_ASSEMBLY_X86_64');
    expect(container.querySelector('[role=alert]')?.textContent).toContain('Local storage failed');
    expect((await loaded(repo)).data.resume).toBeNull();
  });
  it('review regression: valid trailing-slash topic routes save canonical identity', async () => {
    const repo = repository(); await mount(repo, '/co/CO_T06_ASSEMBLY_X86_64/');
    expect((await loaded(repo)).data.resume?.topicId).toBe(position.topicId);
  });
  it('student operations leave Assembly namespace bytes untouched', async () => {
    localStorage.setItem('delftstudy:v1:program', 'movq $5, %rax'); localStorage.setItem('delftstudy:v1:format', 'hex');
    const before = {...localStorage}; const repo = repository(); await mount(repo, '/progress');
    const state = await loaded(repo); await repo.restore({...emptyBackup(), resume: position}, state.data);
    expect({...localStorage}).toEqual(before);
  });
});
