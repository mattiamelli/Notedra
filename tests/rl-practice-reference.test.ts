import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import raw from '../src/rl/practice.json';
import policy from '../src/rl/source-policy.json';
import {gradeRLResponse, validateRLResponse} from '../src/rl/grading';
import type {RLExercise, RLTask} from '../src/rl/practice-types';
import type {Answer} from '../src/learning/contracts';

const exercises = raw as RLExercise[];
const bySlug = (slug: string) => exercises.find(exercise => exercise.id === 'ds.practice.rl-' + slug)!;
const text = (value: string): Answer => ({kind: 'text', value});
const bit = (value: boolean): string => value ? '1' : '0';
const rows = [[false, false], [false, true], [true, false], [true, true]] as const;
const table = (evaluate: (p: boolean, q: boolean) => boolean) => rows.map(([p, q]) => bit(evaluate(p, q))).join('');
const setText = (values: number[]) => '{' + [...new Set(values)].sort((a, b) => a - b).join(',') + '}';
const domain = [1, 2, 3];
const relation: [number, number][] = [[1, 2], [2, 3], [3, 3]];
const related = (x: number, y: number) => relation.some(([a, b]) => x === a && y === b);

function permutations<T>(values: T[]): T[][] {
  if (values.length === 0) return [[]];
  return values.flatMap((value, index) => permutations(values.filter((_, i) => i !== index)).map(tail => [value, ...tail]));
}
function puzzleSolutions(requirements = [(a: number, b: number) => a + b === 5,
  (_a: number, b: number, c: number) => b + c === 6,
  (_a: number, _b: number, c: number, d: number) => c > d]) {
  return permutations([1, 2, 3, 4]).filter(([a, b, c, d]) => requirements.every(check => check(a, b, c, d)));
}
function uniquePuzzleConclusion(solutions: number[][]): string {
  if (solutions.length !== 1) throw new Error('The complete constraint assignment is not uniquely established.');
  return String(solutions[0][3]);
}

/** Independent references: direct Boolean quantification, enumeration and arithmetic.
 * No production logic/models implementation, formula display or stored answer drives these computations.
 */
const references: Record<string, () => string> = {
  'implication-rows': () => table((p, q) => !p || q),
  'biconditional-rows': () => table((p, q) => p === q),
  'necessary-rows': () => table((r, s) => !s || r),
  'argument-counterrows': () => table((p, q) => (!p || q) && q && !p),
  'equivalence-rows': () => table((p, q) => (!p || q) === (!q || p)),
  'normal-form-check': () => table((p, q) => ((p && !q) || (!p && q)) === ((p || q) && (!p || !q))),
  'satisfying-rows': () => table((p, q) => (p || q) && !p),
  'forall-exists': () => bit(domain.every(x => domain.some(y => related(x, y)))),
  'exists-forall': () => bit(domain.some(y => domain.every(x => related(x, y)))),
  'negation-witnesses': () => setText(domain.filter(x => ![1, 3].includes(x))),
  'finite-countermodel': () => {
    const p = (x: number) => [1, 3].includes(x), q = (x: number) => [1, 3].includes(x);
    return [domain.some(p), domain.every(x => !p(x) || q(x)), domain.every(q)].map(bit).join('');
  },
  'arbitrary-step': () => setText([0, 1, 2, 3, 4, 5].filter(n => !Number.isInteger((n - 1) / 2))),
  'recurrence-affine': () => String(4 * 2 ** 4 - 1), // Closed form a_n=4*2^n-1, independent of recursive stepping.
  'recurrence-two-base': () => {
    const terms = [1, 4];
    for (let n = 2; n <= 4; n++) terms[n] = terms[n - 1] + 2 * terms[n - 2];
    return String(terms[4]);
  },
  'preorder-third': () => {
    const children: Record<number, number[]> = {5: [2, 8], 2: [1, 4], 8: [7, 9]};
    const stack = [5], visited: number[] = [];
    while (stack.length) { const node = stack.pop()!; visited.push(node); stack.push(...[...(children[node] ?? [])].reverse()); }
    expect(visited).toEqual([5, 2, 1, 4, 8, 7, 9]);
    return String(visited[2]);
  },
  'recursive-tree-cost': () => String([1, 4, 7, 9].length * 2 + [5, 2, 8].length * 3),
  'topological-count': () => {
    const edges = [['A', 'C'], ['B', 'C'], ['C', 'D']];
    const orders = permutations(['A', 'B', 'C', 'D']).filter(order => edges.every(([a, b]) => order.indexOf(a) < order.indexOf(b)));
    expect(orders).toEqual([['A', 'B', 'C', 'D'], ['B', 'A', 'C', 'D']]);
    return String(orders.length);
  },
  'set-difference': () => setText([...new Set([-2, 0, 3, 5, 0, 2, 5, 7])].filter(x => ![-2, 2, 7].includes(x))),
  'nested-membership': () => {
    // Tagged integers/sets avoid conflating an element, singleton and empty set.
    const a = [{kind: 'integer', value: 1}, {kind: 'set', elements: [2]}, {kind: 'set', elements: []}];
    return [a.some(x => x.kind === 'integer' && x.value === 2),
      a.some(x => x.kind === 'set' && x.elements?.length === 1 && x.elements[0] === 2),
      ([] as unknown[]).every(() => false), a.some(x => x.kind === 'set' && x.elements?.length === 0)].map(bit).join('');
  },
  'venn-region': () => setText([0, 1, 2, 3, 4, 5, 6, 7].filter(x => [0, 1, 2, 3].includes(x) && [2, 3, 4, 5].includes(x) && ![1, 3, 5, 7].includes(x))),
  'power-product': () => {
    const subsets = Array.from({length: 8}, (_, mask) => [1, 2, 3].filter((_, index) => (mask & (1 << index)) !== 0));
    const pairs = subsets.flatMap(subset => [4, 5].map(b => ({first: {kind: 'set', elements: subset}, second: b})));
    expect(new Set(pairs.map(pair => JSON.stringify(pair))).size).toBe(pairs.length);
    return String(pairs.length);
  },
  'cartesian-filter': () => String([-1, 2].flatMap(a => [0, 3, 5].map(b => [a, b])).filter(([a, b]) => a < b).length),
  'finite-function-total': () => bit([1, 2, 3].every(x => [[1, 4], [2, 5]].filter(([a, b]) => a === x && [4, 5].includes(b)).length === 1)),
  'mapping-properties': () => {
    const outputs = [4, 5, 6], codomain = [4, 5, 6, 7];
    const injective = new Set(outputs).size === outputs.length, surjective = codomain.every(y => outputs.includes(y));
    return [injective, surjective, injective && surjective].map(bit).join('');
  },
  'relation-properties': () => {
    const d = [0, 1, 2], pairs = [[0, 0], [1, 1], [2, 2], [0, 1], [1, 0], [1, 2], [2, 1]];
    const r = (x: number, y: number) => pairs.some(([a, b]) => a === x && b === y);
    return [d.every(x => r(x, x)), d.every(x => d.every(y => !r(x, y) || r(y, x))),
      d.every(x => d.every(y => d.every(z => !(r(x, y) && r(y, z)) || r(x, z))))].map(bit).join('');
  },
  'number-membership': () => {
    const fraction = {numerator: -7, denominator: 3};
    const {numerator, denominator} = fraction, isInteger = numerator % denominator === 0;
    return [isInteger && numerator / denominator >= 0, isInteger,
      Number.isInteger(numerator) && Number.isInteger(denominator) && denominator !== 0,
      Number.isFinite(numerator / denominator)].map(bit).join('');
  },
  'dock-setting': () => uniquePuzzleConclusion(puzzleSolutions()),
};

describe('R&L fixed practice independent reference evidence', () => {
  it('accounts for every authored item across all nine canonical topics', () => {
    expect(exercises).toHaveLength(27);
    expect(new Set(exercises.map(exercise => exercise.topicId)).size).toBe(9);
    expect(exercises.map(exercise => exercise.id.replace('ds.practice.rl-', '')).sort()).toEqual(Object.keys(references).sort());
    expect(new Set(exercises.map(exercise => exercise.id)).size).toBe(exercises.length);
  });
  it.each(Object.keys(references))('%s matches a separately computed answer and accepts its exact reference', slug => {
    const exercise = bySlug(slug);
    expect(exercise.reference).toEqual(text(references[slug]()));
    expect(gradeRLResponse(exercise, exercise.reference)).toMatchObject({status: 'GRADED', correct: true, earned: 1, max: 1});
    const wrong = exercise.task.format === 'binary' ? (exercise.reference.value as string).replace(/[01]/g, b => b === '1' ? '0' : '1')
      : exercise.task.format === 'integer' ? String(BigInt(exercise.reference.value as string) + 1n) : '{999}';
    expect(gradeRLResponse(exercise, text(wrong))).toMatchObject({status: 'GRADED', correct: false, earned: 0, max: 1});
  });
  it('uses exact canonical lecture associations, without inventing page-level verification', () => {
    const pack = JSON.parse(readFileSync(new URL('../content-pack/v1.0.1/DelftStudy_Codex_Handoff_Pack.json', import.meta.url), 'utf8'));
    for (const exercise of exercises) {
      const skill = pack.taxonomy.atomic_skills.find((s: {skill_id: string}) => s.skill_id === exercise.skillId);
      expect(skill).toMatchObject({subject_id: exercise.subjectId, topic_id: exercise.topicId, subtopic_id: exercise.subtopicId});
      expect(skill.lecture_references).toContainEqual(expect.objectContaining({document_id: exercise.source.documentId, source_document: exercise.source.filename,
        source_page_or_slide: exercise.source.locator, confidence: 'HIGH', source_locator: expect.objectContaining({precision: 'DOCUMENT_RANGE', method: 'WHOLE_DOCUMENT_RANGE'})}));
      expect(exercise.source.kind).toBe('LECTURE');
      expect(exercise.source.documentId).not.toBe('RL_LEC_08');
      expect(exercise.authorship).toBe('AUTHORED_PRACTICE');
    }
  });
  it('compares propositional semantics, preserving implication direction and quantifier order', () => {
    expect(references['necessary-rows']()).not.toBe(references['implication-rows']());
    expect(references['equivalence-rows']()).toBe('1001');
    expect(references['normal-form-check']()).toBe('1111');
    expect(references['forall-exists']()).toBe('1');
    expect(references['exists-forall']()).toBe('0');
    expect(references['finite-countermodel']()).toBe('110');
  });
  it('exhausts all complete puzzle assignments and rejects nonunique or impossible candidate puzzles', () => {
    expect(permutations([1, 2, 3, 4])).toHaveLength(24);
    expect(puzzleSolutions()).toEqual([[3, 2, 4, 1]]);
    const ambiguous = puzzleSolutions([(a, b) => a + b === 5]);
    expect(ambiguous.length).toBeGreaterThan(1);
    expect(() => uniquePuzzleConclusion(ambiguous)).toThrow(/not uniquely/);
    expect(() => uniquePuzzleConclusion(puzzleSolutions([() => false]))).toThrow(/not uniquely/);
    // Even an identical requested value cannot excuse multiple complete assignments.
    expect(() => uniquePuzzleConclusion([[1, 2, 3, 4], [2, 1, 3, 4]])).toThrow(/not uniquely/);
  });
  it('authorizes only a current verified puzzle mechanism while preserving its original RUBRIC boundary', () => {
    const pack = JSON.parse(readFileSync(new URL('../content-pack/v1.0.1/DelftStudy_Codex_Handoff_Pack.json', import.meta.url), 'utf8'));
    expect(policy.puzzles).toHaveLength(1);
    const authored = policy.puzzles[0];
    const mappings = pack.assessment_model.assessments.flatMap((a: {question_map: Record<string, unknown>[]}) => a.question_map);
    const trusted = mappings.find((q: {question_ref: string}) => q.question_ref === authored.mapping.question_ref);
    expect(trusted).toMatchObject(authored.mapping);
    expect(authored.mapping).toMatchObject({question_ref: 'RL_END_2025_Q14', evidence_era: 'CURRENT', mapping_confidence: 'HIGH', mapping_granularity: 'SKILL_LEVEL',
      can_generate_variants: true, validator_type: 'RUBRIC', adaptive_use_policy: 'SOURCE_ANALOGUE_ALLOWED_NONVERBATIM'});
    expect(authored.exerciseId).toBe(bySlug('dock-setting').id);
    expect(authored.reference.assignments).toEqual([{A: 3, B: 2, C: 4, D: 1}]);
    expect(bySlug('dock-setting').prompt).toContain('Only the final setting');
  });
});

describe('R&L exact-response grading boundaries', () => {
  const integer = bySlug('recurrence-affine'), binary = bySlug('implication-rows'), finiteSet = bySlug('set-difference');
  it('normalizes only exact numeric values without floating point rounding', () => {
    expect(gradeRLResponse(integer, text('  00063  '))).toMatchObject({status: 'GRADED', correct: true});
    const huge = {...integer, reference: text('9007199254740993')};
    expect(gradeRLResponse(huge, text('9007199254740992'))).toMatchObject({status: 'GRADED', correct: false});
    expect(gradeRLResponse(huge, text('009007199254740993'))).toMatchObject({status: 'GRADED', correct: true});
    expect(gradeRLResponse({...integer, reference: text('0')}, text('-000'))).toMatchObject({status: 'GRADED', correct: true});
  });
  it('uses set membership, accepting order changes and repeated elements', () => {
    expect(gradeRLResponse(finiteSet, text('{5, 03, -0, 5}'))).toMatchObject({status: 'GRADED', correct: true});
    expect(gradeRLResponse({...finiteSet, reference: text('{}')}, text('{  }'))).toMatchObject({status: 'GRADED', correct: true});
    expect(gradeRLResponse({...finiteSet, reference: text('{-2,3}')}, text('{3,-002,-2}'))).toMatchObject({status: 'GRADED', correct: true});
  });
  it.each(['', ' ', '\n\t'])('keeps missing input incomplete: %j', value => {
    expect(gradeRLResponse(integer, text(value))).toMatchObject({status: 'INCOMPLETE'});
  });
  it.each(['6.3e1', '+63', '63.0', '6 3', '63 units', 'NaN', 'Infinity', '9'.repeat(65)])('rejects an invalid integer without assigning an incorrect score: %s', value => {
    const result = gradeRLResponse(integer, text(value));
    expect(result.status).toBe('INVALID'); expect(result).not.toHaveProperty('earned');
  });
  it.each(['110', '11100', '11 01', '0b1101', 'TTFT', '2222'])('enforces the explicit binary width and alphabet: %s', value => {
    expect(gradeRLResponse(binary, text(value))).toMatchObject({status: 'INVALID'});
  });
  it.each(['0,3,5', '[0,3,5]', '{0,,3}', '{0,3,}', '{{0},3}', '{(0,3)}', '{1..3}', '{+3}', '{1e2}', '{3.0}', '{' + Array(33).fill('1').join(',') + '}'])('rejects unsupported set/tuple/formula syntax: %s', value => {
    expect(gradeRLResponse(finiteSet, text(value))).toMatchObject({status: 'INVALID'});
  });
  it.each([null, {}, {kind: 'choice', value: []}, {kind: 'code', value: '63'}, {kind: 'text', value: 63}, {kind: 'text', value: '63', extra: true}])('keeps malformed/wrong-kind learner payloads separate from incorrect answers', answer => {
    expect(gradeRLResponse(integer, answer as Answer)).toMatchObject({status: 'INVALID'});
  });
  it('does not grade proofs, formula translations, constructions, future graders or CO graders', () => {
    for (const kind of ['proof', 'induction', 'invariant', 'translation', 'countermodel-construction', 'graph-construction', 'rubric']) {
      expect(validateRLResponse({kind}, text('All rubric boxes checked'))).toMatchObject({status: 'NOT_AUTOGRADABLE'});
      const result = gradeRLResponse({...integer, task: {kind}} as RLExercise, text('therefore QED'));
      expect(result.status).toBe('NOT_AUTOGRADABLE'); expect(result).not.toHaveProperty('correct'); expect(result).not.toHaveProperty('earned');
    }
    for (const grader of [{id: 'rl-exact', version: '2'}, {id: 'co-exact', version: '1'}]) {
      expect(gradeRLResponse({...integer, grader} as RLExercise, integer.reference)).toMatchObject({status: 'NOT_AUTOGRADABLE'});
    }
  });
  it('reports corrupt trusted definitions as technical errors, not learner mistakes', () => {
    for (const changed of [
      {...integer, reference: text('not an integer')}, {...integer, reference: {kind: 'choice', value: ['63']}},
      {...binary, task: {...binary.task, width: 0}}, {...binary, task: {...binary.task, width: 65}},
      {...integer, task: {...integer.task, width: 3}}, {...integer, task: {...integer.task, format: 'proof'}},
      {...integer, task: {...integer.task, unexpected: true}},
    ]) {
      const result = gradeRLResponse(changed as RLExercise, text('bad learner input'));
      expect(result.status).toBe('ERROR'); expect(result).not.toHaveProperty('earned'); expect(result).not.toHaveProperty('correct');
    }
    expect(validateRLResponse({...integer.task, width: 3} as RLTask, text('63')).status).toBe('NOT_AUTOGRADABLE');
  });
  it('does not mutate the exercise, input or returned reference binding', () => {
    const exercise = structuredClone(integer), answer = text('63'), before = structuredClone(exercise);
    const result = gradeRLResponse(exercise, answer);
    expect(exercise).toEqual(before); expect(answer).toEqual(text('63'));
    if (result.status === 'GRADED' && result.reference.kind === 'text') result.reference.value = '0';
    expect(exercise.reference).toEqual(text('63'));
  });
});
