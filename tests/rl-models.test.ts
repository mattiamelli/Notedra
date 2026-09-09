import {describe, expect, it} from 'vitest';
import {analyzeGraph, analyzeTree, cartesianProduct, checkFiniteFunction, checkFiniteRelation, checkTopologicalOrder,
  displayValue, equalValues, evaluateRecurrence, evaluateTree, isSubset, makeSet, powerSet, setContains, setDifference,
  setIntersection, setUnion, type BinaryTree, type DirectedGraph, type FiniteSet, type FiniteValue, type NumericExpression,
  type RecurrenceDefinition} from '../src/rl/models';

const atom = (value: string | number): FiniteValue => ({kind: 'atom', value});
const set = (...values: number[]) => makeSet(values.map(atom));
const node = (label: string, left: BinaryTree | null = null, right: BinaryTree | null = null): BinaryTree => ({label, left, right});
const integer = (value: number): NumericExpression => ({kind: 'integer', value});
const previous = (offset = 1): NumericExpression => ({kind: 'previous', offset});
const recurrence: RecurrenceDefinition = {startIndex: 0, bases: [2], step: {kind: 'add', left: {kind: 'multiply', left: integer(2), right: previous()}, right: integer(1)}};

describe('recurrence definitions and exact bounded evaluation', () => {
  it('matches hand expansion 2,5,11,23 and the independent closed form', () => {
    expect(evaluateRecurrence(recurrence, 3)).toEqual([{index: 0, value: 2}, {index: 1, value: 5}, {index: 2, value: 11}, {index: 3, value: 23}]);
    expect(evaluateRecurrence(recurrence, 12).map(row => row.value)).toEqual(Array.from({length: 13}, (_, n) => 3 * 2 ** n - 1));
  });
  it('uses the specified starting index, bases and current n', () => {
    const factorial: RecurrenceDefinition = {startIndex: 0, bases: [1], step: {kind: 'multiply', left: {kind: 'index'}, right: previous()}};
    expect(evaluateRecurrence(factorial, 6).map(row => row.value)).toEqual([1, 1, 2, 6, 24, 120, 720]);
    const sums: RecurrenceDefinition = {startIndex: 1, bases: [1], step: {kind: 'add', left: {kind: 'index'}, right: previous()}};
    expect(evaluateRecurrence(sums, 4)).toEqual([{index: 1, value: 1}, {index: 2, value: 3}, {index: 3, value: 6}, {index: 4, value: 10}]);
  });
  it('uses all required consecutive bases with multiple backward references', () => {
    const fibonacci: RecurrenceDefinition = {startIndex: 0, bases: [0, 1], step: {kind: 'add', left: previous(), right: previous(2)}};
    expect(evaluateRecurrence(fibonacci, 7).map(row => row.value)).toEqual([0, 1, 1, 2, 3, 5, 8, 13]);
    expect(evaluateRecurrence(fibonacci, 0)).toEqual([{index: 0, value: 0}]);
    expect(evaluateRecurrence({...recurrence, step: {kind: 'subtract', left: previous(), right: integer(3)}}, 3).map(row => row.value)).toEqual([2, -1, -4, -7]);
  });
  it('accepts the last permitted index and does not mutate definitions', () => {
    const fixed = {...recurrence, step: previous()}; const before = JSON.stringify(fixed);
    expect(evaluateRecurrence(fixed, 64)).toHaveLength(65); expect(JSON.stringify(fixed)).toBe(before);
  });
  it.each([
    () => evaluateRecurrence(recurrence, -1), () => evaluateRecurrence(recurrence, 1.5), () => evaluateRecurrence(recurrence, 65),
    () => evaluateRecurrence({...recurrence, bases: []}, 1), () => evaluateRecurrence({...recurrence, bases: new Array(1)}, 1),
    () => evaluateRecurrence({...recurrence, step: previous(0)}, 2), () => evaluateRecurrence({...recurrence, step: previous(2)}, 2),
    () => evaluateRecurrence({...recurrence, step: integer(NaN)}, 2), () => evaluateRecurrence({...recurrence, startIndex: -1}, 2),
    () => evaluateRecurrence({...recurrence, step: {kind: 'divide'} as unknown as NumericExpression}, 2),
    () => evaluateRecurrence({...recurrence, step: {...integer(1), extra: true} as unknown as NumericExpression}, 2),
    () => evaluateRecurrence(recurrence, 60),
  ])('rejects invalid or inexact recurrence input %#', run => expect(run).toThrow(Error));
  it('rejects a recursive object cycle under the AST size bound', () => {
    const expression = {kind: 'add', right: integer(1)} as NumericExpression & {left: NumericExpression}; expression.left = expression;
    expect(() => evaluateRecurrence({...recurrence, step: expression}, 2)).toThrow(/limit/);
  });
});

describe('ordered trees and directed graphs: independent structural cases', () => {
  const tree = node('M', node('G', null, node('J')), node('T', node('P'), node('W')));
  it('matches hand traversals and edge-height conventions', () => {
    expect(analyzeTree(tree)).toEqual({preorder: ['M', 'G', 'J', 'T', 'P', 'W'], inorder: ['G', 'J', 'M', 'P', 'T', 'W'],
      postorder: ['J', 'G', 'P', 'W', 'T', 'M'], nodeCount: 6, leafCount: 3, height: 2});
    expect(evaluateTree(tree, 'node-count')).toBe(6); expect(evaluateTree(tree, 'leaf-count')).toBe(3); expect(evaluateTree(tree, 'height')).toBe(2);
  });
  it('distinguishes empty trees, singleton trees and one-sided descendants', () => {
    expect(analyzeTree(null)).toEqual({preorder: [], inorder: [], postorder: [], nodeCount: 0, leafCount: 0, height: -1});
    expect(analyzeTree(node('A'))).toEqual({preorder: ['A'], inorder: ['A'], postorder: ['A'], nodeCount: 1, leafCount: 1, height: 0});
    expect(analyzeTree(node('A', node('B', node('C'))))).toMatchObject({preorder: ['A', 'B', 'C'], inorder: ['C', 'B', 'A'], nodeCount: 3, leafCount: 1, height: 2});
  });
  it('rejects shared nodes, duplicate labels, cycles and missing children', () => {
    const child = node('B'); expect(() => analyzeTree(node('A', child, child))).toThrow(/distinct/);
    expect(() => analyzeTree(node('A', node('A')))).toThrow(/distinct/);
    const cycle = node('A'); cycle.left = cycle; expect(() => analyzeTree(cycle)).toThrow(/distinct/);
    expect(() => analyzeTree({label: 'A'} as BinaryTree)).toThrow();
    expect(() => evaluateTree(tree, 'sum' as 'height')).toThrow(/Unknown/);
  });
  const graph: DirectedGraph = {vertices: ['A', 'B', 'C', 'D'], edges: [['A', 'C'], ['B', 'C'], ['C', 'D']]};
  it('accepts both valid constructions rather than comparing one reference order', () => {
    expect(checkTopologicalOrder(graph, ['A', 'B', 'C', 'D'])).toBe(true);
    expect(checkTopologicalOrder(graph, ['B', 'A', 'C', 'D'])).toBe(true);
    expect(checkTopologicalOrder(graph, ['C', 'A', 'B', 'D'])).toBe(false);
    expect(analyzeGraph(graph)).toEqual({acyclic: true, topologicalOrder: ['A', 'B', 'C', 'D'], unique: false, cycle: null});
  });
  it('separates unique order, disconnected vertices and no possible order', () => {
    expect(analyzeGraph({vertices: ['C', 'A', 'B'], edges: [['A', 'B'], ['B', 'C']]})).toEqual({acyclic: true, topologicalOrder: ['A', 'B', 'C'], unique: true, cycle: null});
    expect(analyzeGraph({vertices: ['A', 'B'], edges: []}).unique).toBe(false);
    expect(analyzeGraph({vertices: [], edges: []})).toEqual({acyclic: true, topologicalOrder: [], unique: true, cycle: null});
    expect(analyzeGraph({vertices: ['A', 'B', 'C'], edges: [['A', 'B'], ['B', 'C'], ['C', 'A']]})).toEqual({acyclic: false, topologicalOrder: null, unique: false, cycle: ['A', 'B', 'C', 'A']});
    expect(analyzeGraph({vertices: ['A'], edges: [['A', 'A']]}).cycle).toEqual(['A', 'A']);
    expect(checkTopologicalOrder({vertices: ['A'], edges: [['A', 'A']]}, ['A'])).toBe(false);
  });
  it('finds a cycle even in a disconnected component', () => {
    expect(analyzeGraph({vertices: ['A', 'B', 'C'], edges: [['B', 'C'], ['C', 'B']]}).cycle).toEqual(['B', 'C', 'B']);
  });
  it.each([{order: ['A', 'A', 'C', 'D']}, {order: ['A', 'B', 'C']}, {order: ['A', 'B', 'C', 'Z']}])('rejects incomplete/duplicate/foreign ordering $order', ({order}) => {
    expect(checkTopologicalOrder(graph, order)).toBe(false);
  });
  it.each([
    () => analyzeGraph({vertices: ['A', 'A'], edges: []}), () => analyzeGraph({vertices: ['A'], edges: [['A', 'B']]}),
    () => analyzeGraph({vertices: ['A'], edges: [['A', 'A'], ['A', 'A']]}),
    () => analyzeGraph({vertices: new Array(1), edges: []}),
    () => analyzeGraph({vertices: ['A'], edges: [['A']] as unknown as [string, string][]}),
  ])('rejects malformed graph input %#', run => expect(run).toThrow(Error));
  it('cross-checks all 64 loop-free three-vertex digraphs against all six orders', () => {
    const edges: [string, string][] = [['A', 'B'], ['A', 'C'], ['B', 'A'], ['B', 'C'], ['C', 'A'], ['C', 'B']];
    const orders = [['A', 'B', 'C'], ['A', 'C', 'B'], ['B', 'A', 'C'], ['B', 'C', 'A'], ['C', 'A', 'B'], ['C', 'B', 'A']];
    for (let mask = 0; mask < 64; mask++) {
      const selected = edges.filter((_, bit) => (mask & 2 ** bit) !== 0);
      // Independent enumeration: erase each earlier vertex's outgoing edges and reject edges pointing to erased vertices.
      const valid = orders.filter(order => selected.every(([a, b]) => order.slice(order.indexOf(a) + 1).includes(b)));
      const result = analyzeGraph({vertices: ['A', 'B', 'C'], edges: selected});
      expect(result.acyclic).toBe(valid.length > 0); expect(result.unique).toBe(valid.length === 1);
      if (result.topologicalOrder) expect(valid).toContainEqual(result.topologicalOrder);
      if (result.cycle) for (let index = 1; index < result.cycle.length; index++) expect(selected).toContainEqual([result.cycle[index - 1], result.cycle[index]]);
    }
  });
});

describe('finite sets retain membership, nesting, and tuple distinctions', () => {
  it('deduplicates and compares sets without ordering, while atoms retain their types', () => {
    expect(makeSet([atom(1), atom(1), atom(2)]).elements).toHaveLength(2);
    expect(equalValues(set(1, 2), set(2, 1))).toBe(true); expect(equalValues(atom(1), atom('1'))).toBe(false);
    expect(displayValue(makeSet([atom(1), atom('1')]))).toBe('{1, "1"}');
  });
  it('distinguishes membership from subset and atom from singleton', () => {
    const nested = makeSet([atom(1), set(2)]);
    expect(setContains(nested, atom(1))).toBe(true); expect(setContains(nested, set(1))).toBe(false);
    expect(isSubset(set(1), nested)).toBe(true); expect(setContains(nested, atom(2))).toBe(false);
    expect(setContains(nested, set(2))).toBe(true); expect(isSubset(set(2), nested)).toBe(false);
    expect(isSubset(set(), nested)).toBe(true); expect(setContains(nested, set())).toBe(false);
    expect(equalValues(set(), makeSet([set()]))).toBe(false);
  });
  it('matches explicit union/intersection/difference reference results', () => {
    const left = set(1, 2, 4); const right = set(2, 3);
    expect(equalValues(setUnion(left, right), set(1, 2, 3, 4))).toBe(true);
    expect(equalValues(setIntersection(left, right), set(2))).toBe(true);
    expect(equalValues(setDifference(left, right), set(1, 4))).toBe(true);
    expect(equalValues(setDifference(right, left), set(3))).toBe(true);
  });
  it('enumerates all powerset members, including the empty-set boundaries', () => {
    expect(equalValues(powerSet(set(2, 5)), makeSet([set(), set(2), set(5), set(2, 5)]))).toBe(true);
    expect(equalValues(powerSet(set()), makeSet([set()]))).toBe(true);
    expect(equalValues(powerSet(makeSet([set()])), makeSet([set(), makeSet([set()])]))).toBe(true);
    expect(powerSet(set(1, 2, 3, 4, 5, 6, 7, 8)).elements).toHaveLength(256);
  });
  it('builds ordered pairs, preserving order/repetition and nested sets', () => {
    expect(displayValue(cartesianProduct(set(1, 2), set(2)))).toBe('{(1, 2), (2, 2)}');
    expect(cartesianProduct(set(), set(1)).elements).toHaveLength(0);
    expect(equalValues({kind: 'tuple', elements: [atom(1), atom(2)]}, {kind: 'tuple', elements: [atom(2), atom(1)]})).toBe(false);
    expect(equalValues({kind: 'tuple', elements: [atom(1), atom(1)]}, set(1))).toBe(false);
    expect(displayValue(cartesianProduct(makeSet([set(1)]), set(2)))).toBe('{({1}, 2)}');
    expect(displayValue({kind: 'tuple', elements: [atom(1)]})).toBe('(1,)');
  });
  it.each([
    () => powerSet(set(1, 2, 3, 4, 5, 6, 7, 8, 9)), () => makeSet([atom(NaN)]), () => makeSet([atom(Infinity)]),
    () => makeSet(new Array(1)), () => displayValue({kind: 'array', elements: []} as unknown as FiniteValue),
    () => setContains(atom(1) as FiniteSet, atom(1)),
    () => displayValue({kind: 'atom', value: 1, other: true} as FiniteValue),
    () => cartesianProduct(set(...Array.from({length: 17}, (_, i) => i)), set(...Array.from({length: 16}, (_, i) => i))),
  ])('rejects ambiguous/unbounded finite values %#', run => expect(run).toThrow(Error));
  it('rejects cyclic nesting before display/equality', () => {
    const cycle: {kind: 'set'; elements: FiniteValue[]} = {kind: 'set', elements: []}; cycle.elements.push(cycle);
    expect(() => displayValue(cycle)).toThrow(/limit/);
  });
});

describe('finite functions: explicit domain, codomain and graph obligations', () => {
  it('checks injection and surjection independently, including unused codomain objects', () => {
    expect(checkFiniteFunction({domain: ['a', 'b'], codomain: ['1', '2', '3'], pairs: [['a', '1'], ['b', '2']]}))
      .toMatchObject({wellDefined: true, injective: true, surjective: false, bijective: false, unusedCodomain: ['3']});
    expect(checkFiniteFunction({domain: ['a', 'b', 'c'], codomain: ['1', '2'], pairs: [['a', '1'], ['b', '1'], ['c', '2']]}))
      .toMatchObject({wellDefined: true, injective: false, surjective: true, bijective: false, collisions: ['1']});
  });
  it('accepts multiple different functions satisfying the same bijection constraint', () => {
    expect(checkFiniteFunction({domain: ['a', 'b'], codomain: ['1', '2'], pairs: [['a', '1'], ['b', '2']]}).bijective).toBe(true);
    expect(checkFiniteFunction({domain: ['a', 'b'], codomain: ['1', '2'], pairs: [['a', '2'], ['b', '1']]}).bijective).toBe(true);
  });
  it('does not label a partial or multi-valued graph injective/surjective', () => {
    expect(checkFiniteFunction({domain: ['a', 'b'], codomain: ['1'], pairs: [['a', '1']]}))
      .toMatchObject({wellDefined: false, total: false, missingInputs: ['b'], injective: null, surjective: null, bijective: null});
    expect(checkFiniteFunction({domain: ['a'], codomain: ['1', '2'], pairs: [['a', '1'], ['a', '2']]}))
      .toMatchObject({wellDefined: false, singleValued: false, conflictingInputs: ['a'], injective: null});
  });
  it('reports domain and codomain violations explicitly', () => {
    expect(checkFiniteFunction({domain: ['a'], codomain: ['1'], pairs: [['a', '2'], ['b', '1']]}))
      .toMatchObject({wellDefined: false, withinDomain: false, withinCodomain: false, outsideDomain: [['b', '1']], outsideCodomain: [['a', '2']]});
  });
  it('handles empty finite cases by the definitions and ignores repeated graph pairs', () => {
    expect(checkFiniteFunction({domain: [], codomain: [], pairs: []})).toMatchObject({wellDefined: true, injective: true, surjective: true, bijective: true});
    expect(checkFiniteFunction({domain: [], codomain: ['a'], pairs: []})).toMatchObject({wellDefined: true, injective: true, surjective: false});
    expect(checkFiniteFunction({domain: ['a'], codomain: [], pairs: []})).toMatchObject({wellDefined: false, total: false});
    expect(checkFiniteFunction({domain: ['a'], codomain: ['b'], pairs: [['a', 'b'], ['a', 'b']]})).toMatchObject({wellDefined: true, bijective: true});
  });
  it('rejects malformed declaration shapes', () => {
    expect(() => checkFiniteFunction({domain: ['a', 'a'], codomain: [], pairs: []})).toThrow();
    expect(() => checkFiniteFunction({domain: ['a'], codomain: ['b'], pairs: [['a']] as unknown as [string, string][]})).toThrow();
  });
});

describe('finite relation properties: direct definitions and counterexamples', () => {
  it('identifies equivalence classes rather than requiring all pairs', () => {
    expect(checkFiniteRelation({domain: ['a', 'b', 'c'], pairs: [['a', 'a'], ['b', 'b'], ['c', 'c'], ['a', 'b'], ['b', 'a']]}))
      .toMatchObject({reflexive: true, symmetric: true, antisymmetric: false, transitive: true, equivalence: true});
  });
  it('finds a missing transitive pair and does not confuse symmetry with antisymmetry', () => {
    expect(checkFiniteRelation({domain: ['a', 'b', 'c'], pairs: [['a', 'b'], ['b', 'c']]}))
      .toMatchObject({reflexive: false, symmetric: false, antisymmetric: true, transitive: false, transitiveCounterexamples: [['a', 'b', 'c']]});
    expect(checkFiniteRelation({domain: ['a', 'b'], pairs: [['a', 'b'], ['b', 'a']]}))
      .toMatchObject({symmetric: true, antisymmetric: false, transitive: false, transitiveCounterexamples: [['a', 'b', 'a'], ['b', 'a', 'b']]});
  });
  it('evaluates reflexive/symmetric/transitive vacuous cases correctly', () => {
    expect(checkFiniteRelation({domain: [], pairs: []})).toMatchObject({reflexive: true, symmetric: true, antisymmetric: true, transitive: true, equivalence: true});
    expect(checkFiniteRelation({domain: ['a'], pairs: []})).toMatchObject({reflexive: false, symmetric: true, antisymmetric: true, transitive: true, equivalence: false});
    expect(checkFiniteRelation({domain: ['a'], pairs: [['a', 'a']]})).toMatchObject({reflexive: true, symmetric: true, antisymmetric: true, transitive: true, equivalence: true});
  });
  it('uses relation set semantics and rejects out-of-domain objects', () => {
    expect(checkFiniteRelation({domain: ['a'], pairs: [['a', 'a'], ['a', 'a']]}).equivalence).toBe(true);
    expect(() => checkFiniteRelation({domain: ['a'], pairs: [['a', 'b']]})).toThrow(/outside/);
  });
});
