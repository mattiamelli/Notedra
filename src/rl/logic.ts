/** Bounded, structured classical semantics. No string parser or theorem prover. */
export type BinaryConnective = 'and' | 'or' | 'implies' | 'iff';
export type PropFormula = {kind: 'variable'; name: string}
  | {kind: 'not'; operand: PropFormula}
  | {kind: BinaryConnective; left: PropFormula; right: PropFormula};
export type Valuation = Readonly<Record<string, boolean>>;
export const LOGIC_LIMITS = {variables: 8, nodes: 127, depth: 16, domain: 8, evaluationSteps: 20_000} as const;
const binaryKinds = ['and', 'or', 'implies', 'iff'];
const symbols: Record<BinaryConnective, string> = {and: '∧', or: '∨', implies: '→', iff: '↔'};
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Expected a structured object.');
  return value as Record<string, unknown>;
}
function shape(value: unknown, keys: string[]) {
  const item = record(value);
  if (Object.keys(item).length !== keys.length || keys.some(key => !Object.hasOwn(item, key))) throw new Error('Malformed structured input.');
  return item;
}
function name(value: unknown): asserts value is string {
  if (typeof value !== 'string' || !/^[A-Za-z][A-Za-z0-9_]{0,23}$/.test(value)) throw new Error('Names must be 1–24 letters, digits or underscores, beginning with a letter.');
}
function list(value: unknown, maximum: number): asserts value is unknown[] {
  if (!Array.isArray(value) || value.length > maximum) throw new Error(`Expected a list of at most ${maximum} entries.`);
  for (let index = 0; index < value.length; index++) if (!Object.hasOwn(value, index)) throw new Error('Sparse lists are not valid structured inputs.');
}
function budget() {
  let nodes = 0;
  return (depth: number) => {
    if (++nodes > LOGIC_LIMITS.nodes || depth > LOGIC_LIMITS.depth) throw new Error('Formula exceeds the node/depth limit.');
  };
}
function connective(kind: BinaryConnective, left: boolean, right: boolean): boolean {
  switch (kind) {
    case 'and': return left && right;
    case 'or': return left || right;
    case 'implies': return !left || right;
    case 'iff': return left === right;
  }
}
export function propVariables(formula: PropFormula): string[] {
  const variables = new Set<string>(); const tick = budget();
  function visit(value: unknown, depth: number): void {
    tick(depth); const item = record(value);
    if (item.kind === 'variable') { shape(item, ['kind', 'name']); name(item.name); variables.add(item.name); }
    else if (item.kind === 'not') { shape(item, ['kind', 'operand']); visit(item.operand, depth + 1); }
    else if (typeof item.kind === 'string' && binaryKinds.includes(item.kind)) {
      shape(item, ['kind', 'left', 'right']); visit(item.left, depth + 1); visit(item.right, depth + 1);
    } else throw new Error('Unknown propositional formula kind.');
  }
  visit(formula, 0);
  if (variables.size > LOGIC_LIMITS.variables) throw new Error('Use at most eight variables.');
  return [...variables];
}
function propValue(formula: PropFormula, valuation: Valuation): boolean {
  switch (formula.kind) {
    case 'variable': return valuation[formula.name];
    case 'not': return !propValue(formula.operand, valuation);
    default: return connective(formula.kind, propValue(formula.left, valuation), propValue(formula.right, valuation));
  }
}
export function evaluateProp(formula: PropFormula, valuation: Valuation): boolean {
  const variables = propVariables(formula); const values = record(valuation);
  if (Object.keys(values).length > LOGIC_LIMITS.variables) throw new Error('Too many valuation entries.');
  for (const [key, value] of Object.entries(values)) { name(key); if (typeof value !== 'boolean') throw new Error('Valuations must contain booleans.'); }
  if (variables.some(variable => !Object.hasOwn(values, variable))) throw new Error('Missing variable valuation.');
  return propValue(formula, valuation);
}
/** All binary nodes are parenthesized, including nested implications. */
export function displayProp(formula: PropFormula): string {
  propVariables(formula);
  const print = (node: PropFormula): string => node.kind === 'variable' ? node.name
    : node.kind === 'not' ? `¬${print(node.operand)}` : `(${print(node.left)} ${symbols[node.kind]} ${print(node.right)})`;
  return print(formula);
}
function valuations(formulas: readonly PropFormula[], variableOrder: readonly string[]): Record<string, boolean>[] {
  list(variableOrder, LOGIC_LIMITS.variables); variableOrder.forEach(name);
  const needed = new Set(formulas.flatMap(propVariables));
  if (new Set(variableOrder).size !== variableOrder.length || variableOrder.length !== needed.size || variableOrder.some(key => !needed.has(key))) {
    throw new Error('Variable order must list every formula variable exactly once.');
  }
  // False precedes true. The final listed variable changes fastest.
  return Array.from({length: 2 ** variableOrder.length}, (_, row) => Object.fromEntries(variableOrder.map((key, column) =>
    [key, Math.floor(row / 2 ** (variableOrder.length - column - 1)) % 2 === 1])));
}
export interface TruthRow {valuation: Record<string, boolean>; value: boolean;}
export function truthTable(formula: PropFormula, variableOrder: readonly string[]): TruthRow[] {
  return valuations([formula], variableOrder).map(valuation => ({valuation, value: propValue(formula, valuation)}));
}
export function analyzeFormula(formula: PropFormula, variableOrder: readonly string[]) {
  const rows = truthTable(formula, variableOrder);
  return {rows, satisfiable: rows.some(row => row.value), tautology: rows.every(row => row.value), contradiction: rows.every(row => !row.value),
    witness: rows.find(row => row.value)?.valuation ?? null};
}
export function compareEquivalent(left: PropFormula, right: PropFormula, variableOrder: readonly string[]) {
  const rows = valuations([left, right], variableOrder).map(valuation => ({valuation, left: propValue(left, valuation), right: propValue(right, valuation)}));
  const counterexample = rows.find(row => row.left !== row.right) ?? null;
  return {equivalent: counterexample === null, counterexample, rows};
}
export function analyzeArgument(premises: readonly PropFormula[], conclusion: PropFormula, variableOrder: readonly string[]) {
  list(premises, 8);
  const rows = valuations([...premises, conclusion], variableOrder).map(valuation => ({valuation,
    premises: premises.map(premise => propValue(premise, valuation)), conclusion: propValue(conclusion, valuation)}));
  const counterexample = rows.find(row => row.premises.every(Boolean) && !row.conclusion) ?? null;
  return {valid: counterexample === null, counterexample, rows, satisfiablePremises: rows.some(row => row.premises.every(Boolean))};
}

export type FolTerm = {kind: 'variable'; name: string} | {kind: 'constant'; name: string}
  | {kind: 'function'; name: string; args: readonly FolTerm[]};
export type FolFormula = {kind: 'predicate'; name: string; args: readonly FolTerm[]}
  | {kind: 'equal'; left: FolTerm; right: FolTerm}
  | {kind: 'not'; operand: FolFormula}
  | {kind: BinaryConnective; left: FolFormula; right: FolFormula}
  | {kind: 'forall' | 'exists'; variable: string; body: FolFormula};
export interface PredicateInterpretation {arity: 1 | 2; tuples: readonly (readonly string[])[];}
export interface FunctionInterpretation {arity: 1 | 2; entries: readonly {args: readonly string[]; value: string}[];}
export interface FiniteStructure {
  domain: readonly string[];
  constants: Readonly<Record<string, string>>;
  predicates: Readonly<Record<string, PredicateInterpretation>>;
  functions: Readonly<Record<string, FunctionInterpretation>>;
}
export type Assignment = Readonly<Record<string, string>>;
export interface QuantifierEvidence {
  path: string; kind: 'forall' | 'exists'; variable: string; outerAssignment: Record<string, string>;
  results: {object: string; value: boolean}[]; witnesses: string[]; counterexamples: string[];
}
/** Classical nonempty domain; empty predicate/relation extensions are allowed. */
export function validateStructure(structure: FiniteStructure): void {
  const item = shape(structure, ['domain', 'constants', 'predicates', 'functions']);
  list(item.domain, LOGIC_LIMITS.domain); item.domain.forEach(name);
  if (!item.domain.length || new Set(item.domain).size !== item.domain.length) throw new Error('The domain must contain 1–8 distinct objects.');
  const domain = new Set(item.domain);
  const inDomain = (value: unknown) => { name(value); if (!domain.has(value)) throw new Error('Interpretation uses an object outside the domain.'); };
  for (const key of ['constants', 'predicates', 'functions']) {
    const entries = Object.entries(record(item[key]));
    if (entries.length > 12) throw new Error('Use at most twelve symbols per interpretation table.');
    for (const [symbol, interpretation] of entries) {
      name(symbol);
      if (key === 'constants') { inDomain(interpretation); continue; }
      const table = shape(interpretation, key === 'predicates' ? ['arity', 'tuples'] : ['arity', 'entries']);
      if (table.arity !== 1 && table.arity !== 2) throw new Error('Only unary and binary interpretations are supported.');
      const rows = key === 'predicates' ? table.tuples : table.entries; list(rows, 64); const seen = new Set<string>();
      for (const row of rows) {
        const entry = key === 'functions' ? shape(row, ['args', 'value']) : null;
        const args = entry ? entry.args : row; list(args, 2);
        if (args.length !== table.arity) throw new Error('Interpretation arity mismatch.');
        args.forEach(inDomain); const encoded = JSON.stringify(args);
        if (seen.has(encoded)) throw new Error('Duplicate interpretation input.'); seen.add(encoded);
        if (entry) inDomain(entry.value);
      }
      if (key === 'functions' && seen.size !== domain.size ** table.arity) throw new Error('Function interpretations must be total.');
    }
  }
  const termNames = [...Object.keys(structure.constants), ...Object.keys(structure.functions)];
  if (new Set(termNames).size !== termNames.length) throw new Error('Constant and function symbols must be distinct.');
}
function validateFol(formula: FolFormula, structure?: FiniteStructure, assignment: Assignment = {}) {
  const tick = budget(); const variableNames = new Set<string>(); const termNames = new Set<string>();
  function term(value: unknown, depth: number, bound: Set<string>): void {
    tick(depth); const node = record(value);
    if (node.kind === 'variable' || node.kind === 'constant') {
      shape(node, ['kind', 'name']); name(node.name);
      (node.kind === 'variable' ? variableNames : termNames).add(node.name);
      if (structure && node.kind === 'variable' && !bound.has(node.name)) throw new Error(`Unbound variable: ${node.name}.`);
      if (structure && node.kind === 'constant' && !Object.hasOwn(structure.constants, node.name)) throw new Error(`Unknown constant: ${node.name}.`);
    } else if (node.kind === 'function') {
      shape(node, ['kind', 'name', 'args']); name(node.name); list(node.args, 2);
      termNames.add(node.name);
      if (!node.args.length) throw new Error('Function terms need one or two arguments.');
      if (structure && (!Object.hasOwn(structure.functions, node.name) || structure.functions[node.name].arity !== node.args.length)) throw new Error('Unknown function or arity mismatch.');
      node.args.forEach(arg => term(arg, depth + 1, bound));
    } else throw new Error('Unknown FOL term kind.');
  }
  function visit(value: unknown, depth: number, bound: Set<string>): void {
    tick(depth); const node = record(value);
    if (node.kind === 'predicate') {
      shape(node, ['kind', 'name', 'args']); name(node.name); list(node.args, 2);
      if (!node.args.length) throw new Error('Predicates need one or two arguments.');
      if (structure && (!Object.hasOwn(structure.predicates, node.name) || structure.predicates[node.name].arity !== node.args.length)) throw new Error('Unknown predicate or arity mismatch.');
      node.args.forEach(arg => term(arg, depth + 1, bound));
    } else if (node.kind === 'equal') { shape(node, ['kind', 'left', 'right']); term(node.left, depth + 1, bound); term(node.right, depth + 1, bound); }
    else if (node.kind === 'not') { shape(node, ['kind', 'operand']); visit(node.operand, depth + 1, bound); }
    else if (node.kind === 'forall' || node.kind === 'exists') {
      shape(node, ['kind', 'variable', 'body']); name(node.variable); variableNames.add(node.variable);
      visit(node.body, depth + 1, new Set([...bound, node.variable]));
    } else if (typeof node.kind === 'string' && binaryKinds.includes(node.kind)) {
      shape(node, ['kind', 'left', 'right']); visit(node.left, depth + 1, bound); visit(node.right, depth + 1, bound);
    } else throw new Error('Unknown FOL formula kind.');
  }
  visit(formula, 0, new Set(Object.keys(assignment)));
  return {variableNames, termNames};
}
export function displayFol(formula: FolFormula): string {
  const names = validateFol(formula);
  // AST evaluation distinguishes symbol kinds. Plain mathematical display requires disjoint term names.
  if ([...names.variableNames].some(variable => names.termNames.has(variable))) throw new Error('Formula display requires distinct variable and constant/function names.');
  const term = (node: FolTerm): string => node.kind === 'function' ? `${node.name}(${node.args.map(term).join(', ')})` : node.name;
  function print(node: FolFormula): string {
    switch (node.kind) {
      case 'predicate': return `${node.name}(${node.args.map(term).join(', ')})`;
      case 'equal': return `(${term(node.left)} = ${term(node.right)})`;
      case 'not': return `¬${print(node.operand)}`;
      case 'forall': case 'exists': return `(${node.kind === 'forall' ? '∀' : '∃'}${node.variable}. ${print(node.body)})`;
      default: return `(${print(node.left)} ${symbols[node.kind]} ${print(node.right)})`;
    }
  }
  return print(formula);
}
export function evaluateFol(formula: FolFormula, structure: FiniteStructure, assignment: Assignment = {}) {
  validateStructure(structure); const entries = Object.entries(record(assignment));
  if (entries.length > 16) throw new Error('Use at most sixteen assigned variables.');
  for (const [variable, object] of entries) { name(variable); name(object); if (!structure.domain.includes(object)) throw new Error('Assignment object is outside the domain.'); }
  validateFol(formula, structure, assignment);
  let steps = 0; const quantifiers: QuantifierEvidence[] = [];
  const tick = () => { if (++steps > LOGIC_LIMITS.evaluationSteps) throw new Error('Finite evaluation exceeds the step limit.'); };
  function term(node: FolTerm, values: Assignment): string {
    tick();
    if (node.kind === 'variable') return values[node.name];
    if (node.kind === 'constant') return structure.constants[node.name];
    const args = node.args.map(arg => term(arg, values));
    return structure.functions[node.name].entries.find(entry => entry.args.every((object, index) => object === args[index]))!.value;
  }
  function evaluate(node: FolFormula, values: Assignment, path: string): boolean {
    tick();
    switch (node.kind) {
      case 'predicate': {
        const args = node.args.map(arg => term(arg, values));
        return structure.predicates[node.name].tuples.some(tuple => tuple.every((object, index) => object === args[index]));
      }
      case 'equal': return term(node.left, values) === term(node.right, values);
      case 'not': return !evaluate(node.operand, values, `${path}.operand`);
      case 'forall': case 'exists': {
        const evidence: QuantifierEvidence = {path, kind: node.kind, variable: node.variable, outerAssignment: {...values}, results: [], witnesses: [], counterexamples: []};
        quantifiers.push(evidence);
        // Evaluate every object. Each local assignment restores outer bindings, including shadowed names.
        evidence.results = structure.domain.map(object => ({object, value: evaluate(node.body, {...values, [node.variable]: object}, `${path}[${object}].body`)}));
        if (node.kind === 'exists') evidence.witnesses = evidence.results.filter(result => result.value).map(result => result.object);
        else evidence.counterexamples = evidence.results.filter(result => !result.value).map(result => result.object);
        return node.kind === 'forall' ? evidence.results.every(result => result.value) : evidence.results.some(result => result.value);
      }
      default: return connective(node.kind, evaluate(node.left, values, `${path}.left`), evaluate(node.right, values, `${path}.right`));
    }
  }
  const value = evaluate(formula, {...assignment}, 'root');
  return {value, quantifiers, steps};
}
