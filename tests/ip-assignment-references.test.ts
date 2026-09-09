import {createHash} from 'node:crypto';
import {readFileSync, readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import type {IPAssignment, IPReference} from '../src/ip/types';
import evidence from '../docs/ip-assignment-java-evidence.json';
import harnesses from '../scripts/ip-assignment-java-harnesses.json';

const root = resolve(import.meta.dirname, '..');
const slugs = readdirSync(resolve(root, 'src/ip/assignments')).map(name => name.replace(/\.json$/, '')).sort();
const read = (kind: 'assignments' | 'references', slug: string) => readFileSync(resolve(root, 'src/ip', kind, `${slug}.json`), 'utf8');
const assignments = slugs.map(slug => JSON.parse(read('assignments', slug)) as IPAssignment);
const references = slugs.map(slug => JSON.parse(read('references', slug)) as IPReference);
const digest = (text: string) => createHash('sha256').update(text).digest('hex');
function observed(slug: string, id: string) {
  const record = evidence.results.find(result => result.slug === slug)?.checks.find(check => check.id === id);
  expect(record, `${slug}/${id} must be a real recorded JDK check`).toBeDefined();
  expect(record?.result).toBe('PASS');
  return record!.actual;
}

describe('IP authored assignments and independently checked references', () => {
  it('publishes five 15-minute, three 30-minute and three integrated 60-minute tasks', () => {
    expect(assignments).toHaveLength(11);
    expect([15, 30, 60].map(minutes => assignments.filter(item => item.minutes === minutes).length)).toEqual([5, 3, 3]);
    expect(assignments.filter(item => item.minutes === 60).every(item => item.topicId === 'IP_T20_EXAM_PROGRAM_SYNTHESIS')).toBe(true);
  });
  it('keeps each component review unscored and timing explicitly authored', () => {
    for (const assignment of assignments) {
      expect(assignment.instructions.join(' ')).toContain('not compiled, run or automatically graded');
      expect(assignment.instructions.join(' ')).toContain('not an official assessment duration');
      expect(assignment.instructions.join(' ')).toContain('Multiple correct implementations are valid');
      expect(assignment).not.toHaveProperty('grade');
      expect(assignment).not.toHaveProperty('score');
    }
  });
  it.each(slugs)('%s has real test specifications attached to every rubric and requirement', slug => {
    const assignment = JSON.parse(read('assignments', slug)) as IPAssignment;
    const reference = JSON.parse(read('references', slug)) as IPReference;
    expect(reference.id).toBe(assignment.referenceId);
    expect(reference.assignmentId).toBe(assignment.id);
    for (const requirement of assignment.requirements) {
      const rubrics = assignment.rubric.filter(item => item.requirementIds.includes(requirement.id));
      expect(rubrics.length).toBeGreaterThan(0);
      expect(reference.tests.some(test => test.requirementIds.includes(requirement.id))).toBe(true);
      for (const rubric of rubrics) {
        expect(rubric.testIds.length).toBeGreaterThan(0);
        for (const id of rubric.testIds) {
          const specification = reference.tests.find(test => test.id === id);
          expect(specification?.requirementIds).toContain(requirement.id);
          expect(specification?.expected.length).toBeGreaterThan(10);
        }
      }
    }
  });
  it.each(slugs)('%s evidence binds to the exact compiled reference and trusted harness', slug => {
    const result = evidence.results.find(item => item.slug === slug)!;
    const harness = harnesses.find(item => item.slug === slug)!;
    expect(result.referenceSha256).toBe(digest(read('references', slug)));
    expect(result.harnessSha256).toBe(digest(harness.source));
    expect(result.checks.length).toBeGreaterThan(4);
    expect(result.checks.every(check => check.result === 'PASS')).toBe(true);
  });
  it('states exactly which Java tools ran and does not claim JUnit execution', () => {
    expect(evidence.javaVersion).toContain('21.0.12');
    expect(evidence.compilerVersion).toContain('javac 21.0.12');
    expect(evidence.compileCommand).toContain('-Xlint:all -Werror');
    expect(evidence.junitStatus).toContain('NOT RUN');
    expect(evidence.results.find(result => result.slug === 'boundary-tests')?.excludedIllustrativeFiles).toEqual(['JUnit-reference.txt']);
    expect(evidence.assertionCount).toBe(evidence.results.reduce((count, result) => count + result.checks.length, 0));
  });
  it('derives the half-open array window result independently', () => {
    const data = [4, 7, 7, 2, 9];
    expect(observed('array-window', 'window')).toBe(String(data.slice(1, 4).filter(value => value >= 7).length));
    expect(observed('array-window', 'whole')).toBe(String(data.filter(value => value >= 7).length));
    expect(observed('array-window', 'empty')).toBe('0');
    expect(observed('array-window', 'unchanged')).toBe('[4, 7, 7, 2, 9]');
  });
  it('rejects invalid array windows including reversed and out-of-bounds ranges', () => {
    for (const id of ['negative', 'beyond', 'reversed']) expect(observed('array-window', id)).toBe('IllegalArgumentException');
    expect(observed('array-window', 'null')).toBe('NullPointerException');
  });
  it('separates object identity, value equality and hash collision', () => {
    const first = [0, 31], second = [1, 0];
    expect(31 * first[0] + first[1]).toBe(31 * second[0] + second[1]);
    expect(first).not.toEqual(second);
    expect(observed('grid-key', 'identity')).toBe('false');
    expect(observed('grid-key', 'collision')).toBe('true');
    expect(observed('grid-key', 'set-size')).toBe('2');
    for (const id of ['reflexive', 'symmetric', 'transitive']) expect(observed('grid-key', id)).toBe('true');
    for (const id of ['null', 'unrelated', 'different-column']) expect(observed('grid-key', id)).toBe('false');
  });
  it('validates token parsing boundaries and never repairs malformed input', () => {
    expect(observed('batch-token', 'zero')).toBe('0');
    expect(observed('batch-token', 'leading-zero')).toBe(String(7));
    expect(observed('batch-token', 'maximum')).toBe(String(10 ** 3 - 1));
    for (let index = 0; index < 11; index++) expect(observed('batch-token', `invalid-${index}`)).toBe('IllegalArgumentException');
  });
  it('checks clamping from the contract instead of duplicating Math.min/max implementation', () => {
    [-4, 2, 5, 8, 12].forEach((value, index) => {
      const expected = value < 2 ? 2 : value > 8 ? 8 : value;
      expect(observed('boundary-tests', `range-${index}`)).toBe(String(expected));
    });
    for (const value of [-1, 3, 9]) expect(observed('boundary-tests', `degenerate-${value}`)).toBe('3');
    expect(observed('boundary-tests', 'reversed')).toBe('IllegalArgumentException');
  });
  it('preserves duplicate stream outputs and handles Optional absence', () => {
    const labels = [' elm ', 'oak', ' cedar', 'ash', 'birch', 'birch'];
    const result: string[] = [];
    for (const label of labels) if (label.trim().length >= 4) result.push(label.trim());
    result.sort();
    expect(observed('label-stream', 'cleaned')).toBe(`[${result.join(', ')}]`);
    expect(observed('label-stream', 'first')).toBe('Optional[birch]');
    expect(observed('label-stream', 'empty')).toBe('Optional.empty');
    expect(observed('label-stream', 'case-sensitive')).toBe('[Amber, zinc]');
  });
  it('checks shelf order, defensive copying and full/zero capacity', () => {
    const labels = ['ink', 'chalk', 'wax'].filter(label => label !== 'chalk');
    labels.push('clay');
    expect(observed('capacity-shelf', 'order')).toBe(`[${labels.join(', ')}]`);
    expect(observed('capacity-shelf', 'defensive-copy')).toBe('ink');
    for (const id of ['full', 'duplicate', 'zero-capacity', 'absent']) expect(observed('capacity-shelf', id)).toBe('false');
    expect(observed('capacity-shelf', 'ends')).toBe('[wax]');
  });
  it('checks overridden alert behavior and composition at strict thresholds', () => {
    const values = [9, 10, 11];
    expect(observed('alert-policies', 'high')).toBe(values.map(value => value > 10).join(','));
    expect(observed('alert-policies', 'low')).toBe(values.map(value => value < 10).join(','));
    expect(observed('alert-policies', 'composed')).toBe('2');
    expect(observed('alert-policies', 'empty')).toBe('0');
  });
  it('distinguishes a trailing newline from an actual blank record', () => {
    expect(observed('reading-export', 'terminal-newline')).toBe('1');
    expect(observed('reading-export', 'malformed-1')).toBe('ReadingFormatException');
    expect(observed('reading-export', 'line-number')).toBe('2');
  });
  it('verifies exact formatted output, borrowed ownership and failure propagation', () => {
    expect(observed('reading-export', 'formatted')).toBe('NORTH:12\nSOUTH:-4\nNORTH:0\n');
    expect(observed('reading-export', 'borrowed-open')).toBe('false');
    expect(observed('reading-export', 'io-failure')).toBe('IOException');
    expect(observed('reading-export', 'preserved')).toBe('KEEP');
  });
  it('derives integrated material totals independently by grouping value keys', () => {
    const records = [['EAST/resin', 4], ['WEST/wire', 9], ['EAST/resin', 7], ['EAST/wire', 0]] as const;
    const keys = [...new Set(records.map(record => record[0]))].sort();
    const lines = keys.map(key => `${key}=${records.filter(record => record[0] === key).reduce((sum, record) => sum + record[1], 0)}`);
    expect(observed('material-ledger', 'totals')).toBe(`[${lines.join(', ')}]`);
    expect(observed('material-ledger', 'cli-output')).toBe(`${lines.join('\n')}\n`);
    expect(observed('material-ledger', 'cli-preserves')).toBe('KEEP');
    expect(observed('material-ledger', 'cli-usage')).toBe('2');
    expect(observed('material-ledger', 'cli-malformed')).toBe('1');
  });
  it('derives air report statistics independently and treats equality to threshold as non-alert', () => {
    const zoneValues = {LAB: [800, 700], STUDIO: [400, 900]};
    const lines = Object.entries(zoneValues).map(([zone, values]) => `${zone} count=${values.length} peak=${Math.max(...values)} alerts=${values.filter(value => value > 700).length}`);
    expect(observed('air-audit', 'report')).toBe(`[${lines.join(', ')}]`);
    expect(observed('air-audit', 'formatted')).toBe(`${lines.join('\n')}\n`);
    expect(observed('air-audit', 'duplicate-line')).toBe('2');
    expect(observed('air-audit', 'different-zones')).toBe('2');
  });
  it('checks air parser resource/error cases and preserves previous output on invalid input', () => {
    expect(observed('air-audit', 'borrowed-open')).toBe('false');
    expect(observed('air-audit', 'io-failure')).toBe('IOException');
    expect(observed('air-audit', 'preserved')).toBe('KEEP');
    expect(observed('air-audit', 'cli-threshold')).toBe('2');
    for (let index = 0; index < 10; index++) expect(observed('air-audit', `malformed-${index}`)).toBe('SampleFormatException');
  });
  it('derives synchronized counts without choosing a worker schedule', () => {
    const tokens = [['lumen', 'ink', 'lumen'], ['ink', 'glow'], ['glow', 'lumen']].flat();
    const output = ['glow', 'ink', 'lumen'].map(token => `${token}=${tokens.filter(value => value === token).length}`);
    expect(observed('note-index', 'completed-counts')).toBe(`{${output.join(', ')}}`);
    expect(observed('note-index', 'interrupted-propagates')).toBe('true');
    expect(observed('note-index', 'snapshot-isolation')).toBe('1');
    expect(observed('note-index', 'no-partial-output')).toBe('0');
  });
  it('keeps the race explanation an open possible-interleavings self-check', () => {
    const task = assignments.find(item => item.id === 'ds.assignment.ip.note-index')!;
    const reference = references.find(item => item.assignmentId === task.id)!;
    expect(task.instructions.join(' ')).toContain('Their order is not predetermined');
    const race = reference.tests.find(test => test.id === 'index-race')!;
    expect(race.expected).toContain('No unique schedule is promised');
    expect(reference.reasoning.join(' ')).toContain('yields 1');
    expect(reference.reasoning.join(' ')).toContain('yields 2');
    expect(task).not.toHaveProperty('correctAnswer');
  });
  it.each(['material-ledger', 'note-index'])('review regression: %s states its concrete input bound rather than a universal List limit', slug => {
    const reference = JSON.parse(read('references', slug)) as IPReference;
    expect(reference.reasoning.join(' ')).toContain('ArrayList-backed');
    const maximumIndexedArrayLength = 2_147_483_647n;
    const maximumLong = 9_223_372_036_854_775_807n;
    const upperBound = slug === 'material-ledger' ? maximumIndexedArrayLength * 1000n : maximumIndexedArrayLength ** 2n;
    expect(upperBound < maximumLong).toBe(true);
    expect(reference.reasoning.join(' ')).not.toContain('a Java List has at most');
  });
});
