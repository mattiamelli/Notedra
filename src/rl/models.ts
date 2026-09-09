/** Pure finite teaching models. These check only the explicitly represented objects. */
function integer(value: unknown, minimum: number, maximum: number): asserts value is number {
  if (!Number.isSafeInteger(value) || (value as number) < minimum || (value as number) > maximum) throw new Error(`Expected an integer from ${minimum} to ${maximum}.`);
}
function shape(value: unknown, keys: readonly string[]): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Expected a structured object.');
  const item = value as Record<string, unknown>;
  if (Object.keys(item).length !== keys.length || keys.some(key => !Object.hasOwn(item, key))) throw new Error('Malformed structured input.');
  return item;
}
function array(value: unknown, maximum: number): asserts value is unknown[] {
  if (!Array.isArray(value) || value.length > maximum) throw new Error(`Expected at most ${maximum} entries.`);
  for (let index = 0; index < value.length; index++) if (!Object.hasOwn(value, index)) throw new Error('Sparse lists are not valid structured inputs.');
}
function label(value: unknown): asserts value is string {
  if (typeof value !== 'string' || !value.trim() || value.length > 40) throw new Error('Use nonempty labels of at most forty characters.');
}
function labels(value: unknown, maximum = 16): asserts value is string[] {
  array(value, maximum); value.forEach(label);
  if (new Set(value).size !== value.length) throw new Error('Domain/vertex labels must be distinct.');
}
function pairs(value: unknown): asserts value is [string, string][] {
  array(value, 256);
  for (const pair of value) { array(pair, 2); if (pair.length !== 2) throw new Error('Expected an ordered pair.'); pair.forEach(label); }
}

export type NumericExpression = {kind: 'integer'; value: number} | {kind: 'index'} | {kind: 'previous'; offset: number}
  | {kind: 'add' | 'subtract' | 'multiply'; left: NumericExpression; right: NumericExpression};
export interface RecurrenceDefinition {startIndex: number; bases: readonly number[]; step: NumericExpression;}
/** n is the index currently being computed. previous(k) denotes a(n-k), k > 0. */
export function evaluateRecurrence(definition: RecurrenceDefinition, throughIndex: number): {index: number; value: number}[] {
  shape(definition, ['startIndex', 'bases', 'step']); integer(definition.startIndex, 0, 32); array(definition.bases, 4);
  if (!definition.bases.length) throw new Error('At least one consecutive base value is required.');
  definition.bases.forEach(value => integer(value, -1_000_000, 1_000_000)); integer(throughIndex, definition.startIndex, definition.startIndex + 64);
  let nodes = 0;
  function validate(value: unknown, depth: number): void {
    if (++nodes > 63 || depth > 10) throw new Error('Recurrence expression exceeds its size limit.');
    if (!value || typeof value !== 'object') throw new Error('Malformed recurrence expression.');
    const kind = (value as NumericExpression).kind;
    if (kind === 'integer') { const node = shape(value, ['kind', 'value']); integer(node.value, -1_000_000, 1_000_000); }
    else if (kind === 'index') shape(value, ['kind']);
    else if (kind === 'previous') { const node = shape(value, ['kind', 'offset']); integer(node.offset, 1, definition.bases.length); }
    else if (kind === 'add' || kind === 'subtract' || kind === 'multiply') {
      const node = shape(value, ['kind', 'left', 'right']); validate(node.left, depth + 1); validate(node.right, depth + 1);
    } else throw new Error('Unknown recurrence expression.');
  }
  validate(definition.step, 0);
  const values = definition.bases.map(BigInt);
  function compute(node: NumericExpression, index: number): bigint {
    if (node.kind === 'integer') return BigInt(node.value);
    if (node.kind === 'index') return BigInt(index);
    if (node.kind === 'previous') return values[index - definition.startIndex - node.offset];
    const left = compute(node.left, index); const right = compute(node.right, index);
    const result = node.kind === 'add' ? left + right : node.kind === 'subtract' ? left - right : left * right;
    if (result > BigInt(Number.MAX_SAFE_INTEGER) || result < BigInt(Number.MIN_SAFE_INTEGER)) throw new Error('Recurrence exceeds exact safe-integer bounds.');
    return result;
  }
  for (let index = definition.startIndex + values.length; index <= throughIndex; index++) values.push(compute(definition.step, index));
  return values.slice(0, throughIndex - definition.startIndex + 1).map((value, offset) => ({index: definition.startIndex + offset, value: Number(value)}));
}

export interface BinaryTree {label: string; left: BinaryTree | null; right: BinaryTree | null;}
/** Ordered binary tree. Height counts edges; the empty tree has height -1. */
export function analyzeTree(tree: BinaryTree | null) {
  const preorder: string[] = []; const inorder: string[] = []; const postorder: string[] = [];
  const seen = new Set<string>(); let leafCount = 0;
  function visit(value: unknown, depth: number): number {
    if (value === null) return -1;
    if (depth > 32 || seen.size >= 63) throw new Error('Tree exceeds its size limit.');
    const node = shape(value, ['label', 'left', 'right']); label(node.label);
    if (seen.has(node.label)) throw new Error('A tree must have distinct node labels and no cycles/shared nodes.');
    seen.add(node.label); preorder.push(node.label);
    const leftHeight = visit(node.left, depth + 1); inorder.push(node.label);
    const rightHeight = visit(node.right, depth + 1); postorder.push(node.label);
    if (node.left === null && node.right === null) leafCount++;
    return 1 + Math.max(leftHeight, rightHeight);
  }
  const height = visit(tree, 0);
  return {preorder, inorder, postorder, nodeCount: seen.size, leafCount, height};
}
export function evaluateTree(tree: BinaryTree | null, operation: 'node-count' | 'leaf-count' | 'height'): number {
  const result = analyzeTree(tree);
  if (operation === 'node-count') return result.nodeCount;
  if (operation === 'leaf-count') return result.leafCount;
  if (operation === 'height') return result.height;
  throw new Error('Unknown recursive tree function.');
}

export interface DirectedGraph {vertices: readonly string[]; edges: readonly (readonly [string, string])[];}
function validateGraph(graph: DirectedGraph): void {
  shape(graph, ['vertices', 'edges']); labels(graph.vertices, 12); pairs(graph.edges);
  if (graph.edges.some(([from, to]) => !graph.vertices.includes(from) || !graph.vertices.includes(to))) throw new Error('Graph edge endpoint is outside the vertex set.');
  if (new Set(graph.edges.map(edge => JSON.stringify(edge))).size !== graph.edges.length) throw new Error('Duplicate graph edge.');
}
/** No geometry: edges define direction. Every valid vertex ordering is accepted. */
export function checkTopologicalOrder(graph: DirectedGraph, order: readonly string[]): boolean {
  validateGraph(graph); array(order, 12); order.forEach(label);
  if (order.length !== graph.vertices.length || new Set(order).size !== order.length || order.some(vertex => !graph.vertices.includes(vertex))) return false;
  return graph.edges.every(([from, to]) => order.indexOf(from) < order.indexOf(to));
}
export interface GraphAnalysis {acyclic: boolean; topologicalOrder: string[] | null; unique: boolean; cycle: string[] | null;}
export function analyzeGraph(graph: DirectedGraph): GraphAnalysis {
  validateGraph(graph);
  const indegree = new Map(graph.vertices.map(vertex => [vertex, 0]));
  const outgoing = new Map(graph.vertices.map(vertex => [vertex, [] as string[]]));
  for (const [from, to] of graph.edges) { indegree.set(to, indegree.get(to)! + 1); outgoing.get(from)!.push(to); }
  const remaining = new Set(graph.vertices); const order: string[] = []; let unique = true;
  while (remaining.size) {
    const ready = [...remaining].filter(vertex => indegree.get(vertex) === 0);
    if (!ready.length) break;
    if (ready.length > 1) unique = false;
    const next = ready[0]; remaining.delete(next); order.push(next);
    for (const to of outgoing.get(next)!) indegree.set(to, indegree.get(to)! - 1);
  }
  const acyclic = order.length === graph.vertices.length; let cycle: string[] | null = null;
  const visited = new Set<string>(); const path: string[] = [];
  function visit(vertex: string): boolean {
    const active = path.indexOf(vertex);
    if (active >= 0) { cycle = [...path.slice(active), vertex]; return true; }
    if (visited.has(vertex)) return false;
    visited.add(vertex); path.push(vertex);
    for (const to of outgoing.get(vertex)!) if (visit(to)) return true;
    path.pop(); return false;
  }
  if (!acyclic) for (const vertex of graph.vertices) if (visit(vertex)) break;
  return {acyclic, topologicalOrder: acyclic ? order : null, unique: acyclic && unique, cycle};
}

export type FiniteValue = {kind: 'atom'; value: string | number} | FiniteSet | {kind: 'tuple'; elements: readonly FiniteValue[]};
export interface FiniteSet {kind: 'set'; elements: readonly FiniteValue[];}
function valueKey(value: FiniteValue): string {
  let nodes = 0;
  function key(input: unknown, depth: number): string {
    if (++nodes > 4096 || depth > 8) throw new Error('Finite value exceeds its size limit.');
    if (!input || typeof input !== 'object') throw new Error('Expected a tagged finite value.');
    const kind = (input as FiniteValue).kind;
    if (kind === 'atom') {
      const item = shape(input, ['kind', 'value']);
      if (typeof item.value === 'number') integer(item.value, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
      else if (typeof item.value !== 'string' || item.value.length > 40) throw new Error('Atoms are short strings or safe integers.');
      return JSON.stringify(['atom', item.value]);
    }
    if (kind !== 'set' && kind !== 'tuple') throw new Error('Unknown finite value kind.');
    const item = shape(input, ['kind', 'elements']); array(item.elements, kind === 'tuple' ? 8 : 256);
    const children = item.elements.map(child => key(child, depth + 1));
    return JSON.stringify([kind, kind === 'set' ? [...new Set(children)].sort() : children]);
  }
  return key(value, 0);
}
function validateSet(set: FiniteSet): void {
  valueKey(set); if (set.kind !== 'set') throw new Error('Expected a finite set, not an atom or tuple.');
}
export function equalValues(left: FiniteValue, right: FiniteValue): boolean { return valueKey(left) === valueKey(right); }
export function makeSet(elements: readonly FiniteValue[]): FiniteSet {
  array(elements, 256); const seen = new Set<string>();
  const result: FiniteSet = {kind: 'set', elements: elements.filter(value => { const key = valueKey(value); if (seen.has(key)) return false; seen.add(key); return true; })};
  valueKey(result); return result;
}
export function displayValue(value: FiniteValue): string {
  valueKey(value);
  function print(node: FiniteValue): string {
    if (node.kind === 'atom') return typeof node.value === 'string' ? JSON.stringify(node.value) : String(node.value);
    const members = node.kind === 'set' ? makeSet(node.elements).elements : node.elements;
    return node.kind === 'set' ? `{${members.map(print).join(', ')}}` : `(${members.map(print).join(', ')}${members.length === 1 ? ',' : ''})`;
  }
  return print(value);
}
export function setContains(set: FiniteSet, value: FiniteValue): boolean {
  validateSet(set); const key = valueKey(value); return set.elements.some(element => valueKey(element) === key);
}
export function isSubset(left: FiniteSet, right: FiniteSet): boolean {
  validateSet(left); validateSet(right); return left.elements.every(element => setContains(right, element));
}
export function setUnion(left: FiniteSet, right: FiniteSet): FiniteSet {
  validateSet(left); validateSet(right);
  const members = new Map([...left.elements, ...right.elements].map(element => [valueKey(element), element]));
  return makeSet([...members.values()]);
}
export function setIntersection(left: FiniteSet, right: FiniteSet): FiniteSet {
  validateSet(left); validateSet(right); return makeSet(left.elements.filter(element => setContains(right, element)));
}
export function setDifference(left: FiniteSet, right: FiniteSet): FiniteSet {
  validateSet(left); validateSet(right); return makeSet(left.elements.filter(element => !setContains(right, element)));
}
export function powerSet(set: FiniteSet): FiniteSet {
  validateSet(set); const elements = makeSet(set.elements).elements;
  if (elements.length > 8) throw new Error('Powersets support at most eight distinct input elements.');
  const subsets = Array.from({length: 2 ** elements.length}, (_, mask) => makeSet(elements.filter((_, bit) => (mask & 2 ** bit) !== 0)));
  return makeSet(subsets);
}
export function cartesianProduct(left: FiniteSet, right: FiniteSet): FiniteSet {
  validateSet(left); validateSet(right); const a = makeSet(left.elements).elements; const b = makeSet(right.elements).elements;
  if (a.length * b.length > 256) throw new Error('Cartesian products support at most 256 ordered pairs.');
  return makeSet(a.flatMap(first => b.map(second => ({kind: 'tuple' as const, elements: [first, second]}))));
}

export interface FiniteFunction {domain: readonly string[]; codomain: readonly string[]; pairs: readonly (readonly [string, string])[];}
/** Invalid candidate graphs receive diagnostic properties; injection/surjection require a function first. */
export function checkFiniteFunction(candidate: FiniteFunction) {
  shape(candidate, ['domain', 'codomain', 'pairs']); labels(candidate.domain); labels(candidate.codomain); pairs(candidate.pairs);
  const uniquePairs = [...new Map(candidate.pairs.map(pair => [JSON.stringify(pair), pair])).values()];
  const outsideDomain = uniquePairs.filter(([input]) => !candidate.domain.includes(input));
  const outsideCodomain = uniquePairs.filter(([, output]) => !candidate.codomain.includes(output));
  const missingInputs = candidate.domain.filter(input => !uniquePairs.some(([from]) => from === input));
  const conflictingInputs = candidate.domain.filter(input => uniquePairs.filter(([from]) => from === input).length > 1);
  const total = missingInputs.length === 0; const singleValued = conflictingInputs.length === 0;
  const withinDomain = outsideDomain.length === 0; const withinCodomain = outsideCodomain.length === 0;
  const wellDefined = total && singleValued && withinDomain && withinCodomain;
  const unusedCodomain = candidate.codomain.filter(output => !uniquePairs.some(([, to]) => to === output));
  const collisions = candidate.codomain.filter(output => uniquePairs.filter(([, to]) => to === output).length > 1);
  const injective = wellDefined ? collisions.length === 0 : null;
  const surjective = wellDefined ? unusedCodomain.length === 0 : null;
  return {wellDefined, total, singleValued, withinDomain, withinCodomain, injective, surjective,
    bijective: wellDefined ? injective! && surjective! : null, missingInputs, conflictingInputs, outsideDomain, outsideCodomain, unusedCodomain, collisions};
}
export interface FiniteRelation {domain: readonly string[]; pairs: readonly (readonly [string, string])[];}
export function checkFiniteRelation(relation: FiniteRelation) {
  shape(relation, ['domain', 'pairs']); labels(relation.domain); pairs(relation.pairs);
  if (relation.pairs.some(pair => pair.some(object => !relation.domain.includes(object)))) throw new Error('Relation endpoint outside its domain.');
  const membership = new Set(relation.pairs.map(pair => JSON.stringify(pair)));
  const has = (left: string, right: string) => membership.has(JSON.stringify([left, right]));
  const reflexiveCounterexamples = relation.domain.filter(object => !has(object, object));
  const symmetricCounterexamples = relation.pairs.filter(([left, right]) => !has(right, left));
  const antisymmetricCounterexamples = relation.pairs.filter(([left, right]) => left !== right && has(right, left));
  const transitiveCounterexamples: [string, string, string][] = [];
  for (const a of relation.domain) for (const b of relation.domain) for (const c of relation.domain) {
    if (has(a, b) && has(b, c) && !has(a, c)) transitiveCounterexamples.push([a, b, c]);
  }
  const reflexive = !reflexiveCounterexamples.length; const symmetric = !symmetricCounterexamples.length;
  const antisymmetric = !antisymmetricCounterexamples.length; const transitive = !transitiveCounterexamples.length;
  return {reflexive, symmetric, antisymmetric, transitive, equivalence: reflexive && symmetric && transitive,
    reflexiveCounterexamples, symmetricCounterexamples, antisymmetricCounterexamples, transitiveCounterexamples};
}
