import {expect, it} from 'vitest';
import {evaluateFol, evaluateProp, type FolFormula} from '../src/rl/logic';
import {analyzeGraph, checkFiniteFunction, checkFiniteRelation, evaluateRecurrence, makeSet, type NumericExpression} from '../src/rl/models';

it('treats prototype-like labels as ordinary explicit dictionary entries', () => {
  expect(evaluateProp({kind: 'variable', name: 'constructor'}, {constructor: false})).toBe(false);
  expect(() => evaluateProp({kind: 'variable', name: 'constructor'}, {})).toThrow(/Missing/);
  const formula: FolFormula = {kind: 'predicate', name: 'toString', args: [{kind: 'constant', name: 'constructor'}]};
  expect(evaluateFol(formula, {domain: ['hasOwnProperty'], constants: {constructor: 'hasOwnProperty'}, functions: {}, predicates: {toString: {arity: 1 as const, tuples: [['hasOwnProperty']]}}}).value).toBe(true);
  expect(analyzeGraph({vertices: ['__proto__', 'constructor'], edges: [['__proto__', 'constructor']]}).unique).toBe(true);
  expect(checkFiniteFunction({domain: ['__proto__'], codomain: ['constructor'], pairs: [['__proto__', 'constructor']]}).bijective).toBe(true);
  expect(checkFiniteRelation({domain: ['__proto__'], pairs: [['__proto__', '__proto__']]}).equivalence).toBe(true);
});

it('enforces aggregate nested-value size, not just per-element size', () => {
  const child = makeSet(Array.from({length: 256}, (_, value) => ({kind: 'atom' as const, value})));
  const distinctLargeChildren = Array.from({length: 17}, (_, value) => makeSet([...child.elements.slice(0, 255), {kind: 'atom' as const, value: value + 1000}]));
  expect(() => makeSet(distinctLargeChildren)).toThrow(/limit/);
});

it('accepts exact recurrence paths below safe integer bound and rejects the next overflow', () => {
  const step: NumericExpression = {kind: 'multiply', left: {kind: 'integer', value: 2}, right: {kind: 'previous', offset: 1}};
  expect(evaluateRecurrence({startIndex: 0, bases: [1], step}, 52).at(-1)?.value).toBe(4503599627370496);
  expect(() => evaluateRecurrence({startIndex: 0, bases: [1], step}, 53)).toThrow(/safe-integer/);
  expect(evaluateRecurrence({startIndex: 0, bases: [-1], step}, 52).at(-1)?.value).toBe(-4503599627370496);
  expect(() => evaluateRecurrence({startIndex: 0, bases: [-1], step}, 53)).toThrow(/safe-integer/);
});

it('rejects holes in predicate extensions rather than interpreting missing tuple arguments', () => {
  const predicate: FolFormula = {kind: 'predicate', name: 'P', args: [{kind: 'variable', name: 'x'}]};
  expect(() => evaluateFol(predicate, {domain: ['a'], constants: {}, functions: {}, predicates: {P: {arity: 1, tuples: [new Array(1)]}}}, {x: 'a'})).toThrow(/Sparse/);
});
