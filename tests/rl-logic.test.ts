import {describe, expect, it} from 'vitest';
import {analyzeArgument, analyzeFormula, compareEquivalent, displayFol, displayProp, evaluateFol, evaluateProp,
  propVariables, truthTable, validateStructure, type BinaryConnective, type FiniteStructure, type FolFormula,
  type FolTerm, type PropFormula} from '../src/rl/logic';

const p: PropFormula = {kind: 'variable', name: 'p'}; const q: PropFormula = {kind: 'variable', name: 'q'};
const not = (operand: PropFormula): PropFormula => ({kind: 'not', operand});
const binary = (kind: BinaryConnective, left: PropFormula = p, right: PropFormula = q): PropFormula => ({kind, left, right});
const variable = (name: string): FolTerm => ({kind: 'variable', name});
const predicate = (name: string, ...args: FolTerm[]): FolFormula => ({kind: 'predicate', name, args});
const x = variable('x'); const y = variable('y');
const world: FiniteStructure = {domain: ['u', 'v', 'w'], constants: {c: 'u'}, functions: {}, predicates: {
  P: {arity: 1, tuples: [['u'], ['v']]}, Q: {arity: 1, tuples: [['v']]}, R: {arity: 2, tuples: [['u', 'v'], ['v', 'w']]},
}};
const allHaveSuccessor: FolFormula = {kind: 'forall', variable: 'x', body: {kind: 'implies', left: predicate('P', x),
  right: {kind: 'exists', variable: 'y', body: predicate('R', x, y)}}};

describe('bounded propositional semantics: hand truth tables and reference arguments', () => {
  it.each([
    ['and', [false, false, false, true]], ['or', [false, true, true, true]],
    ['implies', [true, true, false, true]], ['iff', [true, false, false, true]],
  ] as const)('%s matches the four hand-enumerated cases', (kind, expected) => {
    expect(truthTable(binary(kind), ['p', 'q']).map(row => row.value)).toEqual(expected);
  });
  it('negates both possible values', () => {
    expect(truthTable(not(p), ['p'])).toEqual([{valuation: {p: false}, value: true}, {valuation: {p: true}, value: false}]);
  });
  it('makes false-first and last-variable-fastest row ordering explicit', () => {
    expect(truthTable(binary('implies'), ['q', 'p'])).toEqual([
      {valuation: {q: false, p: false}, value: true}, {valuation: {q: false, p: true}, value: false},
      {valuation: {q: true, p: false}, value: true}, {valuation: {q: true, p: true}, value: true},
    ]);
    const r: PropFormula = {kind: 'variable', name: 'r'};
    expect(truthTable(binary('and', binary('or'), r), ['p', 'q', 'r']).map(row => Object.values(row.valuation)))
      .toEqual([[false, false, false], [false, false, true], [false, true, false], [false, true, true],
        [true, false, false], [true, false, true], [true, true, false], [true, true, true]]);
  });
  it('handles nested implication scope and prints it without ambiguity', () => {
    const leftAssociated = binary('implies', binary('implies'), p);
    const rightAssociated = binary('implies', p, binary('implies', q, p));
    expect(displayProp(leftAssociated)).toBe('((p → q) → p)');
    expect(displayProp(rightAssociated)).toBe('(p → (q → p))');
    expect(displayProp(not(binary('and')))).toBe('¬(p ∧ q)');
    expect(evaluateProp(leftAssociated, {p: false, q: false})).toBe(false);
    expect(evaluateProp(rightAssociated, {p: false, q: false})).toBe(true);
  });
  it('compares semantics despite different surface formula structures', () => {
    expect(compareEquivalent(binary('implies'), binary('or', not(p), q), ['p', 'q']).equivalent).toBe(true);
    expect(compareEquivalent(binary('implies'), binary('implies', not(q), not(p)), ['p', 'q']).equivalent).toBe(true);
    expect(compareEquivalent(not(binary('and')), binary('or', not(p), not(q)), ['p', 'q']).equivalent).toBe(true);
    expect(compareEquivalent(binary('implies'), binary('implies', q, p), ['p', 'q']).counterexample)
      .toEqual({valuation: {p: false, q: true}, left: true, right: false});
  });
  it('distinguishes tautology, contradiction and contingent satisfiability', () => {
    expect(analyzeFormula(binary('or', p, not(p)), ['p'])).toMatchObject({satisfiable: true, tautology: true, contradiction: false, witness: {p: false}});
    expect(analyzeFormula(binary('and', p, not(p)), ['p'])).toMatchObject({satisfiable: false, tautology: false, contradiction: true, witness: null});
    expect(analyzeFormula(p, ['p'])).toMatchObject({satisfiable: true, tautology: false, contradiction: false, witness: {p: true}});
  });
  it('checks premise-true/conclusion-false rows for validity, including explosion', () => {
    expect(analyzeArgument([binary('implies'), p], q, ['p', 'q']).valid).toBe(true);
    expect(analyzeArgument([binary('implies'), q], p, ['p', 'q']).counterexample)
      .toEqual({valuation: {p: false, q: true}, premises: [true, true], conclusion: false});
    expect(analyzeArgument([p, not(p)], q, ['p', 'q'])).toMatchObject({valid: true, satisfiablePremises: false, counterexample: null});
    expect(analyzeArgument([], binary('or', p, not(p)), ['p']).valid).toBe(true);
    expect(analyzeArgument([], p, ['p']).valid).toBe(false);
  });
  it('accepts the eight-variable boundary and deduplicates formula variables', () => {
    let formula: PropFormula = p;
    for (let index = 1; index < 8; index++) formula = binary('or', formula, {kind: 'variable', name: `v${index}`});
    expect(truthTable(formula, propVariables(formula))).toHaveLength(256);
    expect(propVariables(binary('and', p, p))).toEqual(['p']);
  });
  it.each([
    () => evaluateProp(p, {}), () => evaluateProp(p, {p: 1} as unknown as Record<string, boolean>),
    () => evaluateProp(p, Object.create({p: true}) as Record<string, boolean>),
    () => truthTable(binary('and'), ['p']), () => truthTable(p, ['p', 'p']), () => truthTable(p, ['q']), () => truthTable(p, ['p', 'q']),
    () => displayProp({kind: 'variable', name: 'p → q'}), () => displayProp({kind: 'variable', name: 'p', extra: true} as PropFormula),
    () => evaluateProp({kind: 'xor', left: p, right: q} as unknown as PropFormula, {p: false, q: false}),
    () => evaluateProp({kind: 'and', left: p, right: {kind: 'broken'}} as unknown as PropFormula, {p: false}),
    () => truthTable(p, new Array(1)),
  ])('rejects malformed structured/valuation input %#', run => expect(run).toThrow(Error));
  it('rejects cycles and excessive formula depth before execution', () => {
    const cycle = {kind: 'not'} as PropFormula & {operand: PropFormula}; cycle.operand = cycle;
    expect(() => displayProp(cycle)).toThrow(/limit/);
    let formula: PropFormula = p; for (let i = 0; i < 18; i++) formula = not(formula);
    expect(() => displayProp(formula)).toThrow(/limit/);
  });
});

describe('finite first-order semantics: explicit interpretations and binding', () => {
  it('evaluates the authored three-object structure using all quantified branches', () => {
    const result = evaluateFol(allHaveSuccessor, world);
    expect(result.value).toBe(true);
    expect(result.quantifiers[0].results).toEqual([{object: 'u', value: true}, {object: 'v', value: true}, {object: 'w', value: true}]);
    expect(result.quantifiers.filter(item => item.kind === 'exists').map(item => item.witnesses)).toEqual([['v'], ['w'], []]);
    expect(result.quantifiers[0].counterexamples).toEqual([]);
  });
  it('distinguishes quantifier alternation with independently identified witnesses', () => {
    const identity: FiniteStructure = {domain: ['a', 'b'], constants: {}, functions: {}, predicates: {R: {arity: 2, tuples: [['a', 'a'], ['b', 'b']]}}};
    const each: FolFormula = {kind: 'forall', variable: 'x', body: {kind: 'exists', variable: 'y', body: predicate('R', x, y)}};
    const common: FolFormula = {kind: 'exists', variable: 'y', body: {kind: 'forall', variable: 'x', body: predicate('R', x, y)}};
    expect(evaluateFol(each, identity).value).toBe(true);
    const result = evaluateFol(common, identity); expect(result.value).toBe(false);
    expect(result.quantifiers[0].witnesses).toEqual([]);
    expect(result.quantifiers.slice(1).map(item => item.counterexamples)).toEqual([['b'], ['a']]);
  });
  it('returns the universal counterexample and existential witnesses', () => {
    expect(evaluateFol({kind: 'forall', variable: 'x', body: predicate('P', x)}, world).quantifiers[0].counterexamples).toEqual(['w']);
    expect(evaluateFol({kind: 'exists', variable: 'x', body: predicate('P', x)}, world).quantifiers[0].witnesses).toEqual(['u', 'v']);
  });
  it('supports empty extensions without allowing empty classical domains', () => {
    const empty: FiniteStructure = {domain: ['a'], constants: {}, functions: {}, predicates: {P: {arity: 1, tuples: []}}};
    expect(evaluateFol({kind: 'forall', variable: 'x', body: predicate('P', x)}, empty).value).toBe(false);
    expect(evaluateFol({kind: 'exists', variable: 'x', body: predicate('P', x)}, empty).value).toBe(false);
    expect(evaluateFol({kind: 'forall', variable: 'x', body: {kind: 'implies', left: predicate('P', x), right: {kind: 'not', operand: predicate('P', x)}}}, empty).value).toBe(true);
    expect(() => validateStructure({...empty, domain: []})).toThrow(/domain/);
  });
  it.each([0, 1, 2, 3])('quantifier-negation duality for all unary interpretations on two objects (mask %i)', mask => {
    const finite: FiniteStructure = {domain: ['a', 'b'], constants: {}, functions: {}, predicates: {P: {arity: 1, tuples: ['a', 'b'].filter((_, bit) => (mask & 2 ** bit) !== 0).map(object => [object])}}};
    const notAll: FolFormula = {kind: 'not', operand: {kind: 'forall', variable: 'x', body: predicate('P', x)}};
    const existsNot: FolFormula = {kind: 'exists', variable: 'x', body: {kind: 'not', operand: predicate('P', x)}};
    const notExists: FolFormula = {kind: 'not', operand: {kind: 'exists', variable: 'x', body: predicate('P', x)}};
    const allNot: FolFormula = {kind: 'forall', variable: 'x', body: {kind: 'not', operand: predicate('P', x)}};
    expect(evaluateFol(notAll, finite).value).toBe(mask !== 3); expect(evaluateFol(existsNot, finite).value).toBe(mask !== 3);
    expect(evaluateFol(notExists, finite).value).toBe(mask === 0); expect(evaluateFol(allNot, finite).value).toBe(mask === 0);
  });
  it('evaluates constants, identity and total unary/binary function interpretations', () => {
    const finite: FiniteStructure = {domain: ['a', 'b'], constants: {c: 'a'}, predicates: {}, functions: {
      swap: {arity: 1, entries: [{args: ['a'], value: 'b'}, {args: ['b'], value: 'a'}]},
      first: {arity: 2, entries: [{args: ['a', 'a'], value: 'a'}, {args: ['a', 'b'], value: 'a'}, {args: ['b', 'a'], value: 'b'}, {args: ['b', 'b'], value: 'b'}]},
    }};
    const twice: FolFormula = {kind: 'forall', variable: 'x', body: {kind: 'equal', left: {kind: 'function', name: 'swap', args: [{kind: 'function', name: 'swap', args: [x]}]}, right: x}};
    expect(evaluateFol(twice, finite).value).toBe(true);
    expect(evaluateFol({kind: 'equal', left: {kind: 'function', name: 'first', args: [{kind: 'constant', name: 'c'}, x]}, right: {kind: 'constant', name: 'c'}}, finite, {x: 'b'}).value).toBe(true);
    expect(evaluateFol({kind: 'equal', left: x, right: {kind: 'constant', name: 'c'}}, finite, {x: 'b'}).value).toBe(false);
  });
  it('restores shadowed variables across sibling formulas and leaves the assignment untouched', () => {
    const formula: FolFormula = {kind: 'and', left: {kind: 'exists', variable: 'x', body: predicate('Q', x)}, right: predicate('P', x)};
    const assignment = {x: 'w'}; const before = JSON.stringify(world);
    expect(evaluateFol(formula, world, assignment).value).toBe(false);
    expect(assignment).toEqual({x: 'w'}); expect(JSON.stringify(world)).toBe(before);
    const nested: FolFormula = {kind: 'forall', variable: 'x', body: {kind: 'implies', left: predicate('P', x), right: {
      kind: 'and', left: {kind: 'exists', variable: 'x', body: predicate('Q', x)}, right: predicate('P', x),
    }}};
    expect(evaluateFol(nested, world).value).toBe(true);
    expect(evaluateFol(nested, world)).toEqual(evaluateFol(nested, world));
  });
  it('prints precise formula and quantifier scope', () => {
    expect(displayFol(allHaveSuccessor)).toBe('(∀x. (P(x) → (∃y. R(x, y))))');
    expect(displayFol({kind: 'not', operand: {kind: 'exists', variable: 'x', body: {kind: 'equal', left: x, right: {kind: 'constant', name: 'c'}}}}))
      .toBe('¬(∃x. (x = c))');
  });
  it.each([
    () => validateStructure({...world, domain: ['u', 'u']}), () => validateStructure({...world, constants: {c: 'z'}}),
    () => validateStructure({...world, predicates: {P: {arity: 1, tuples: [['z']]}}}),
    () => validateStructure({...world, predicates: {P: {arity: 1, tuples: [['u', 'v']]}}}),
    () => validateStructure({...world, predicates: {P: {arity: 1, tuples: [['u'], ['u']]}}}),
    () => validateStructure({...world, functions: {f: {arity: 1, entries: [{args: ['u'], value: 'v'}]}}}),
    () => validateStructure({...world, functions: {f: {arity: 1, entries: [{args: ['u'], value: 'u'}, {args: ['u'], value: 'v'}, {args: ['w'], value: 'w'}]}}}),
    () => validateStructure({...world, domain: new Array(1)}),
    () => evaluateFol(predicate('P', x), world), () => evaluateFol(predicate('P', x), world, {x: 'z'}),
    () => evaluateFol(predicate('Missing', x), world, {x: 'u'}), () => evaluateFol(predicate('P', x, y), world, {x: 'u', y: 'v'}),
    () => evaluateFol(predicate('P', {kind: 'constant', name: 'missing'}), world),
    () => evaluateFol(predicate('P', {kind: 'function', name: 'missing', args: [x]}), world, {x: 'u'}),
    () => evaluateFol({kind: 'implies', left: predicate('Q', {kind: 'constant', name: 'c'}), right: predicate('P', x)}, world),
    () => displayFol({kind: 'forall', variable: 'x', body: null} as unknown as FolFormula),
    () => displayFol({kind: 'predicate', name: 'P', args: []}),
    () => displayFol({kind: 'predicate', name: 'P', args: [x], extra: true} as FolFormula),
  ])('rejects malformed interpretations/formulas %# without a truth result', run => expect(run).toThrow(Error));
  it('fails safely on excessive quantifier evaluation rather than returning partial truth', () => {
    const finite: FiniteStructure = {domain: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], constants: {}, predicates: {}, functions: {}};
    let formula: FolFormula = {kind: 'equal', left: x, right: x};
    for (let index = 0; index < 5; index++) formula = {kind: 'forall', variable: 'x', body: formula};
    expect(() => evaluateFol(formula, finite)).toThrow(/step limit/);
  });
});
