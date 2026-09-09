// @vitest-environment jsdom
import {act, type ReactNode} from 'react';
import {createRoot, type Root} from 'react-dom/client';
import {MemoryRouter} from 'react-router';
import {IDBFactory} from 'fake-indexeddb';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import PropositionWorkspace from '../src/rl/PropositionWorkspace';
import FolWorkspace from '../src/rl/FolWorkspace';
import RecurrenceWorkspace from '../src/rl/RecurrenceWorkspace';
import TreeGraphWorkspace from '../src/rl/TreeGraphWorkspace';
import SetsWorkspace from '../src/rl/SetsWorkspace';
import RelationsWorkspace from '../src/rl/RelationsWorkspace';
import {GuidedPractice} from '../src/rl/GuidedPractice';
import type {GuidedActivity} from '../src/rl/types';
import {topicStudy} from '../src/topic-study/content';

Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true});
let root: Root, host: HTMLDivElement;
let errors: ReturnType<typeof vi.spyOn>, warnings: ReturnType<typeof vi.spyOn>;
let storage: ReturnType<typeof vi.spyOn>, database: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  host = document.createElement('div'); document.body.append(host); root = createRoot(host);
  errors = vi.spyOn(console, 'error'); warnings = vi.spyOn(console, 'warn');
  storage = vi.spyOn(Storage.prototype, 'setItem');
  const factory = new IDBFactory(); database = vi.spyOn(factory, 'open'); vi.stubGlobal('indexedDB', factory);
});
afterEach(async () => {
  await act(async () => root.unmount()); host.remove();
  expect(errors).not.toHaveBeenCalled(); expect(warnings).not.toHaveBeenCalled();
  expect(storage).not.toHaveBeenCalled(); expect(database).not.toHaveBeenCalled();
  vi.restoreAllMocks(); vi.unstubAllGlobals();
});

async function render(node: ReactNode) { await act(async () => root.render(<MemoryRouter>{node}</MemoryRouter>)); }
function labelled<T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(name: string): T {
  const label = [...host.querySelectorAll('label')].find(item => [...item.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join('').trim() === name);
  expect(label, 'label ' + name).toBeDefined();
  const control = label!.querySelector<T>('input,select,textarea');
  expect(control, 'control ' + name).not.toBeNull();
  return control!;
}
async function change(name: string, value: string) {
  const control = labelled(name);
  const prototype = control.tagName === 'SELECT' ? HTMLSelectElement.prototype : control.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  await act(async () => {
    Object.getOwnPropertyDescriptor(prototype, 'value')!.set!.call(control, value);
    control.dispatchEvent(new Event(control.tagName === 'SELECT' ? 'change' : 'input', {bubbles: true}));
  });
}
async function toggle(name: string) { const control = labelled<HTMLInputElement>(name); await act(async () => control.click()); }
async function click(name: string) {
  const button = [...host.querySelectorAll('button')].find(item => item.textContent?.startsWith(name));
  expect(button, name).toBeDefined(); await act(async () => button!.click());
}
function definition(name: string): string {
  const term = [...host.querySelectorAll('dt')].find(item => item.textContent === name);
  expect(term, name).toBeDefined(); return term!.nextElementSibling!.textContent!;
}
function trace(): string[][] { return [...host.querySelectorAll('tbody tr')].map(row => [...row.querySelectorAll('td')].map(cell => cell.textContent!)); }
function folValue(): string { return host.querySelector('.ds-rl-result pre')!.textContent!; }

describe('R&L workspace controls preserve their mathematical claims', () => {
  it('distinguishes formula equivalence, argument validity and satisfiability with explicit truth-table ordering', async () => {
    await render(<PropositionWorkspace/>);
    expect(trace()).toEqual([['F', 'F', 'T'], ['F', 'T', 'T'], ['T', 'F', 'F'], ['T', 'T', 'T']]);
    expect(host.textContent).toContain('False precedes true; the last variable changes fastest.');
    expect(host.textContent).toContain('Equivalent: both formulas agree on every valuation.');
    expect(host.textContent).toContain('Valid: there is no valuation');
    await change('Compare with', 'converse');
    expect(host.textContent).toContain('Not equivalent: p = F, q = T');
    await change('Argument to investigate', 'affirm-consequent');
    expect(host.textContent).toContain('Invalid: p = F, q = T makes all premises true and the conclusion false.');
    await change('Compare with', 'implication');
    expect(host.textContent).toContain('Equivalent: both formulas agree on every valuation.');
    expect(host.textContent).toContain('Invalid: p = F, q = T');
    await change('Argument to investigate', 'explosion');
    expect(host.textContent).toContain('validity is vacuous (explosion)');
    expect(definition('Tautology')).toBe('No');
    await toggle('p is true');
    expect(host.querySelector('pre')!.textContent).toContain('p = T, q = F → F');
    await toggle('Negate the whole formula');
    expect(host.querySelector('pre')!.textContent).toContain('p = T, q = F → T');
    await click('Reset logic workspace');
    expect(trace()).toEqual([['F', 'F', 'T'], ['F', 'T', 'T'], ['T', 'F', 'F'], ['T', 'T', 'T']]);
    expect(labelled<HTMLInputElement>('Negate the whole formula').checked).toBe(false);
  });

  it('evaluates all four binary connective selections, negation and duplicate-operand variable bounds', async () => {
    await render(<PropositionWorkspace/>);
    for (const [connective, outputs] of [['and', 'FFFT'], ['or', 'FTTT'], ['implies', 'TTFT'], ['iff', 'TFFT']]) {
      await change('Connective', connective);
      expect(trace().map(row => row.at(-1)).join('')).toBe(outputs);
    }
    await change('Right operand', 'p');
    expect(trace()).toEqual([['F', 'T'], ['T', 'T']]);
    expect(definition('Tautology')).toBe('Yes');
    await toggle('Negate the whole formula');
    expect(definition('Contradiction')).toBe('Yes');
    expect(definition('Satisfiable')).toBe('No');
    expect(host.querySelector('table caption')?.textContent).toBe('Full truth table');
  });

  it('separates ∀x∃y from ∃y∀x in the directed three-cycle and explains argument order without reversing R', async () => {
    await render(<FolWorkspace/>);
    expect(folValue()).toContain('TRUE in this structure');
    expect(host.textContent).toContain('The witness y may depend on x.');
    // R is directed: explanations must name R(x,y), avoiding the reversed English y relates to x.
    expect(host.textContent).not.toContain('some object y is related to x');
    await change('Formula in this structure', 'someAll');
    expect(folValue()).toContain('FALSE in this structure');
    expect(host.textContent).toContain('The same witness must work for all x.');
    expect(host.textContent).not.toContain('One object y is related by');
    expect(host.textContent).toContain('Witnesses: none.');
    await change('Formula in this structure', 'eachSome');
    await toggle('R(c, a)');
    expect(folValue()).toContain('FALSE in this structure');
    expect(host.textContent).toContain('Refuting assignments: c.');
    await click('Reset finite structure');
    expect(folValue()).toContain('TRUE in this structure');
    expect(host.textContent).toContain('no spatial geometry is assumed');
  });

  it('keeps an empty predicate extension distinct from an empty domain and resolves named objects/functions', async () => {
    await render(<FolWorkspace/>);
    await toggle('P(a)');
    for (const selected of ['all', 'some', 'named']) {
      await change('Formula in this structure', selected);
      expect(folValue()).toContain('FALSE in this structure');
    }
    await change('Formula in this structure', 'notAll');
    expect(folValue()).toContain('TRUE in this structure');
    expect(host.textContent).toContain('P = {}');
    expect(host.textContent).toContain('domain remains nonempty');
    await change('Formula in this structure', 'function');
    expect(folValue()).toContain('TRUE in this structure');
    await toggle('R(a, b)');
    expect(folValue()).toContain('FALSE in this structure');
    await click('Reset finite structure');
    await change('Formula in this structure', 'named');
    expect(folValue()).toContain('TRUE in this structure');
    expect(host.textContent).toContain('This formula contains no quantifier.');
  });

  it('shows recurrence bases and exact terms while invalid indices remain errors, never proof grades', async () => {
    await render(<RecurrenceWorkspace/>);
    expect(trace().map(row => row[1])).toEqual(['1', '3', '5', '7', '9', '11', '13']);
    await change('Recursive definition', 'two');
    expect(trace().map(row => row[1])).toEqual(['0', '1', '1', '2', '3', '5', '8']);
    expect(trace().filter(row => row[2] === 'Given base value')).toHaveLength(2);
    await change('Evaluate through index', '0');
    expect(trace()).toEqual([['0', '0', 'Given base value']]);
    for (const invalid of ['', '-1', '31', '1.5']) {
      await change('Evaluate through index', invalid);
      expect(host.querySelector('[role="alert"]')).not.toBeNull();
      expect(host.querySelector('table')).toBeNull();
    }
    expect(host.textContent).toContain('Checking finitely many terms is not an induction proof.');
    expect(host.textContent).toContain('termination is a separate obligation');
    expect(host.querySelector('[data-grade], [data-score]')).toBeNull();
    await click('Reset recursive evaluation');
    expect(host.querySelector('[role="alert"]')).toBeNull();
    expect(trace().at(-1)?.[1]).toBe('13');
  });

  it('accepts both valid topological orders, rejects duplicates and detects a cycle from an added edge', async () => {
    await render(<TreeGraphWorkspace/>);
    expect(host.textContent).toContain('Multiple valid orders exist.');
    expect(host.textContent).toContain('This order satisfies every edge constraint.');
    await change('Position 2', 'C');
    expect(host.textContent).toContain('This order does not satisfy the constraints.');
    await change('Position 3', 'B');
    expect(host.textContent).toContain('This order satisfies every edge constraint.');
    await toggle('D → A');
    expect(host.textContent).toContain('No topological order exists.');
    expect(host.textContent).toContain('This order does not satisfy the constraints.');
    await click('Reset tree and graph');
    expect(host.textContent).toContain('This order satisfies every edge constraint.');
    expect(labelled<HTMLSelectElement>('Position 2').value).toBe('B');
  });

  it('shows textual child relationships and distinguishes empty, branch and ordered-chain traversals', async () => {
    await render(<TreeGraphWorkspace/>);
    expect(host.textContent).toContain('Preorder (root, left, right): A B D E C');
    expect(host.textContent).toContain('Inorder (left, root, right): D B E A C');
    expect(host.querySelector('table caption')?.textContent).toContain('root A');
    await change('Tree structure', 'chain');
    expect(host.textContent).toContain('Inorder (left, root, right): A C B');
    expect(host.textContent).toContain('Postorder (left, right, root): C B A');
    await change('Tree structure', 'empty');
    expect(host.textContent).toContain('Nodes: 0 · Leaves: 0 · Height: -1');
    expect(host.querySelector('table caption')?.textContent).toContain('root empty');
  });

  it('separates membership from subset claims and preserves powerset/product behavior for empty A', async () => {
    await render(<SetsWorkspace/>);
    expect(definition('1 ∈ A')).toBe('True');
    expect(definition('{1} ⊆ A')).toBe('True');
    expect(definition('{1} ∈ A')).toBe('False');
    expect(definition('A ⊆ B')).toBe('False');
    await toggle('1 ∈ A'); await toggle('2 ∈ A');
    expect(definition('A ⊆ B')).toBe('True');
    expect(definition('1 ∈ A')).toBe('False');
    expect(definition('{1} ⊆ A')).toBe('False');
    expect(host.textContent).toContain('|𝒫(A)| = 1');
    expect(host.textContent).toContain('|A × B| = 0');
    await click('Reset finite sets');
    expect(definition('1 ∈ A')).toBe('True');
    expect(host.textContent).toContain('|𝒫(A)| = 4');
    expect(host.textContent).toContain('|A × B| = 4');
  });

  it('does not classify injection or surjection until a candidate is a function, and exposes relation counterexamples', async () => {
    await render(<RelationsWorkspace/>);
    expect(definition('Bijective')).toBe('Yes');
    expect(definition('Equivalence relation')).toBe('Yes');
    await toggle('(a, b)');
    expect(definition('Function from the stated domain to codomain')).toBe('No');
    expect(definition('Single valued (at most one output)')).toBe('No');
    expect(definition('Injective')).toBe('Not applicable');
    expect(definition('Surjective')).toBe('Not applicable');
    expect(definition('Symmetric')).toBe('No');
    expect(host.textContent).toContain('Inputs with multiple outputs: a.');
    await toggle('(b, a)');
    expect(definition('Symmetric')).toBe('Yes');
    expect(definition('Antisymmetric')).toBe('No');
    await toggle('(b, c)');
    expect(definition('Transitive')).toBe('No');
    expect(host.textContent).toContain('(a, b, c)');
    await click('Reset functions and relations');
    for (const pair of ['(a, a)', '(b, b)', '(c, c)']) await toggle(pair);
    expect(definition('Total (every input has an output)')).toBe('No');
    expect(definition('Reflexive')).toBe('No');
    expect(definition('Symmetric')).toBe('Yes');
    expect(definition('Antisymmetric')).toBe('Yes');
    expect(definition('Transitive')).toBe('Yes');
  });

  it('keeps proof notes and rubric reveals ephemeral, unscored and resettable', async () => {
    const topic = topicStudy.topics.find(item => item.id === 'RL_T03_PROOF_METHODS')!;
    const subtopic = topic.subtopics[0], skill = subtopic.skills[0];
    const activity: GuidedActivity = {id: 'ds.guided.rl.ui-reference', version: '1', topicId: topic.id,
      skillIds: [skill.id], subtopicIds: [subtopic.id], sourceIds: [skill.sources[0]], title: 'A guided reasoning attempt',
      prompt: 'State the arbitrary element and target, then explain each justified step.',
      fields: [{id: 'assumption', label: 'Assumption', placeholder: 'State what may be assumed.'}, {id: 'reasoning', label: 'Reasoning'}],
      rubric: ['The element is arbitrary within the stated domain.', 'The target follows from justified steps.'],
      reference: ['Choosing a convenient example alone does not prove a universal claim.']};
    await render(<GuidedPractice activities={[activity]}/>);
    const reveal = () => [...host.querySelectorAll('button')].find(button => button.textContent?.includes('criteria and reference'))!;
    const criteria = () => document.getElementById(reveal().getAttribute('aria-controls')!)!;
    expect(reveal().getAttribute('aria-expanded')).toBe('false'); expect(criteria().hidden).toBe(true);
    await change('Assumption', 'Let n be arbitrary.'); await change('Reasoning', 'My attempted reasoning, still awaiting review.');
    expect(labelled<HTMLTextAreaElement>('Reasoning').maxLength).toBe(8000);
    await click('Reveal criteria and reference');
    expect(reveal().getAttribute('aria-expanded')).toBe('true'); expect(criteria().hidden).toBe(false);
    expect(criteria().textContent).toContain('Choosing a convenient example alone does not prove a universal claim.');
    expect(host.textContent).toContain('No automatic correctness, numeric score or academic evidence is assigned.');
    expect(host.textContent).toContain('not saved as a submitted Practice attempt');
    expect(host.querySelectorAll('input[type="checkbox"]')).toHaveLength(0);
    expect(host.querySelector('[data-grade], [data-score]')).toBeNull();
    await click('Reset working notes');
    expect(labelled<HTMLTextAreaElement>('Assumption').value).toBe('');
    expect(labelled<HTMLTextAreaElement>('Reasoning').value).toBe('');
    expect(criteria().hidden).toBe(true);
    await change('Reasoning', 'These notes should disappear on leaving.');
    await render(<p>Another page</p>); await render(<GuidedPractice activities={[activity]}/>);
    expect(labelled<HTMLTextAreaElement>('Reasoning').value).toBe('');
    expect(reveal().getAttribute('aria-expanded')).toBe('false');
  });
});
