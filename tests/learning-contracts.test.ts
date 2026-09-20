import { describe, expect, it } from 'vitest';
import { emptyBackup, evidencePolicy, parseBackup, unassessed, validateAttempt, validateBackup, type Attempt } from '../src/learning/contracts';
import { answer, attempt, foreignSkill, position } from './helpers/learning';
import references from '../src/generated/student-references.json';

describe('bounded student contracts', () => {
  it('round-trips text, choice and code as raw unassessed data', () => {
    for (const payload of [answer, {kind: 'choice', value: ['option-1']}, {kind: 'code', value: '<script>neverExecute()</script>'}]) {
      const backup = {...emptyBackup(), resume: position, attempts: [attempt({answer: payload as Attempt['answer']})]};
      expect(parseBackup(JSON.stringify(backup))).toEqual(backup);
      expect(unassessed()).toEqual({status: 'UNASSESSED', reason: 'No evaluated evidence is available.'});
    }
  });
  it.each([
    ['invalid subject', {subjectId: 'MISSING'}], ['wrong course', {subjectId: 'CSE1100_IP'}], ['invalid topic', {topicId: 'MISSING'}],
    ['invalid subtopic', {subtopicId: 'MISSING'}], ['foreign skill', {targetedSkillIds: [foreignSkill]}], ['duplicate skills', {targetedSkillIds: ['x', 'x']}],
    ['bad revision', {revision: 0}], ['invalid status', {status: 'GRADED'}], ['oversized text', {answer: {kind: 'text', value: 'x'.repeat(16_001)}}],
    ['invalid answer', {answer: {kind: 'html', value: 'x'}}], ['duplicate choices', {answer: {kind: 'choice', value: ['a', 'a']}}],
    ['too many choices', {answer: {kind: 'choice', value: Array.from({length: 51}, (_, i) => `${i}`)}}],
    ['submission on draft', {submission: {operationId: 'op', submittedAt: position.visitedAt}}], ['missing submission', {status: 'SUBMITTED'}],
    ['invalid time', {updatedAt: 'yesterday'}], ['time reversed', {updatedAt: '2025-09-09T12:00:00.000Z'}],
    ['negative hints', {hintsUsed: -1}], ['made-up exposure', {solutionViewed: 'unknown'}], ['unknown source', {source: {assessmentId: 'x', questionRef: 'x'}}],
    ['fake score', {mastery: 100}], ['fake confidence', {mappingConfidence: 'HIGH'}], ['fake eligibility', {eligible: true}], ['fake correctness', {correct: true}],
  ])('rejects %s with a deliberate validation error', (_label, patch) => {
    expect(() => validateAttempt({...attempt(), ...patch})).toThrow(expect.objectContaining({code: 'INVALID'}));
  });
  it('validates canonical subtopic and explicit skill ownership', () => {
    const subtopic = references.subtopics.find(sub => sub.topic === position.topicId)!;
    const skill = references.skills.find(skill => skill.subtopic === subtopic.id)!;
    expect(() => validateAttempt(attempt({subtopicId: subtopic.id, targetedSkillIds: [skill.id]}))).not.toThrow();
  });
  it('rejects duplicate attempt and operation IDs', () => {
    expect(() => validateBackup({...emptyBackup(), attempts: [attempt(), attempt()]})).toThrow('Duplicate attempt');
    const submitted = attempt({status: 'SUBMITTED', submission: {operationId: 'same', submittedAt: position.visitedAt}});
    expect(() => validateBackup({...emptyBackup(), attempts: [submitted, {...submitted, attemptId: 'second'}]})).toThrow('Duplicate submission');
  });
  it.each([{schemaVersion: 4}, {content: {version: '1.0.0', fingerprint: 'old'}}, {content: {version: '1.0.1', fingerprint: 'wrong'}}])('refuses incompatible versions %j', patch => {
    expect(() => validateBackup({...emptyBackup(), ...patch})).toThrow(expect.objectContaining({code: 'INCOMPATIBLE'}));
  });
  it('rejects malformed JSON, oversized backups and arbitrary resume URLs', () => {
    expect(() => parseBackup('{')).toThrow('valid JSON');
    expect(() => parseBackup(' '.repeat(16_000_001))).toThrow('16 MB');
    expect(() => validateBackup({...emptyBackup(), resume: {...position, url: 'https://evil.invalid'}})).toThrow('unsupported student-data fields');
  });
  it.each(['__proto__', 'constructor', 'prototype'])('rejects dangerous object key %s without prototype mutation', key => {
    const json = JSON.stringify(emptyBackup()).replace('{', `{"${key}":{"polluted":true},`);
    expect(() => parseBackup(json)).toThrow('unsupported student-data fields');
    expect((Object.prototype as {polluted?:boolean}).polluted).toBeUndefined();
  });
  it('leaves hints and exposure unknown, and all source mappings ineligible', () => {
    expect(attempt().hintsUsed).toBeNull(); expect(attempt().solutionViewed).toBeNull();
    for (const source of references.questions) {
      const split = source.id.indexOf('/');
      const record = attempt({subjectId: source.subject, topicId: source.topics[0], source: {assessmentId: source.id.slice(0, split), questionRef: source.id.slice(split + 1)}, status: 'SUBMITTED', submission: {operationId: 'op', submittedAt: position.visitedAt}});
      validateAttempt(record);
      expect(evidencePolicy(record)).toEqual({eligible: false, reason: 'UNASSESSED_REQUIRES_TRUSTED_EVALUATION'});
    }
    expect(unassessed()).not.toHaveProperty('score');
  });
});
