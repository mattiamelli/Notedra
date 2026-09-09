import {expect, it} from 'vitest';
import {displayFol, evaluateFol, type FolFormula} from '../src/rl/logic';
import {equalValues, makeSet, setUnion} from '../src/rl/models';

it('union keeps the 256-member output bound after deduplicating two large sets', () => {
  const set = makeSet(Array.from({length: 256}, (_, value) => ({kind: 'atom' as const, value})));
  expect(equalValues(setUnion(set, set), set)).toBe(true);
});

it('does not display a constant and bound variable with indistinguishable names', () => {
  const withVariable: FolFormula = {kind: 'forall', variable: 'x', body: {kind: 'predicate', name: 'P', args: [{kind: 'variable', name: 'x'}]}};
  const withConstant: FolFormula = {kind: 'forall', variable: 'x', body: {kind: 'predicate', name: 'P', args: [{kind: 'constant', name: 'x'}]}};
  const structure = {domain: ['a', 'b'], constants: {x: 'a'}, functions: {}, predicates: {P: {arity: 1 as const, tuples: [['a']]}}};
  expect(evaluateFol(withVariable, structure).value).toBe(false);
  expect(evaluateFol(withConstant, structure).value).toBe(true);
  // Safe UI outcome: reject colliding namespaces or display a distinguishing marker.
  let display: string | null = null;
  try { display = displayFol(withConstant); } catch { /* An explicit rejection is also safe. */ }
  if (display !== null) expect(display).not.toBe(displayFol(withVariable));
});
