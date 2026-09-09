import references from '../generated/student-references.json';
import { validateAnswer } from '../learning/contracts';
import { formulaText, gradeResponse } from './grading';
import type { Exercise, Expression } from './types';
function requireThat(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(`Practice catalog: ${message}`); }
function object(value: unknown, keys: string[]): Record<string, unknown> {
  requireThat(value && typeof value === 'object' && !Array.isArray(value), 'expected object');
  const row = value as Record<string, unknown>;
  requireThat(Object.keys(row).length === keys.length && keys.every(key => Object.hasOwn(row, key)), 'unsupported or missing fields'); return row;
}
function text(value: unknown, max = 2000): asserts value is string { requireThat(typeof value === 'string' && value.length > 0 && value.length <= max, 'invalid or oversized text'); }
function expression(value: unknown, depth = 0): asserts value is Expression {
  requireThat(depth <= 4, 'formula too deep');
  requireThat(value && typeof value === 'object' && 'op' in value, 'invalid formula');
  if (value.op === 'var') { const row = object(value, ['op','name']); requireThat(row.name === 'p' || row.name === 'q', 'unknown proposition'); }
  else if (value.op === 'not') { const row = object(value, ['op','arg']); expression(row.arg, depth + 1); }
  else { const row = object(value, ['op','left','right']); requireThat(row.op === 'and' || row.op === 'or', 'unsupported formula operator'); expression(row.left, depth + 1); expression(row.right, depth + 1); }
}
export function validateDefinition(value: unknown): asserts value is Exercise {
  const row = object(value, ['id','version','title','prompt','rules','subjectId','topicId','subtopicId','skillId','authorship','source','grader','task','reference','explanation']);
  for (const key of ['id','version','title','prompt','rules','subjectId','topicId','subtopicId','skillId','explanation']) text(row[key]);
  requireThat(/^ds\.practice\.[a-z0-9-]+$/.test(row.id as string) && /^\d+$/.test(row.version as string), 'invalid identity/version');
  requireThat(row.authorship === 'AUTHORED_PRACTICE', 'must be labelled authored practice');
  const topic = references.topics.find(item => item.id === row.topicId);
  const sub = references.subtopics.find(item => item.id === row.subtopicId);
  const skill = references.skills.find(item => item.id === row.skillId);
  requireThat(topic?.subject === row.subjectId && sub?.topic === row.topicId && skill?.subtopic === row.subtopicId, 'invalid canonical ownership');
  const source = object(row.source, ['kind','documentId','filename','locator','precision']);
  requireThat(source.kind === 'LECTURE' && source.precision === 'DOCUMENT_RANGE', 'only documented lecture-based practice is allowed; assessment mappings cannot authorize these items');
  for (const key of ['documentId','filename','locator']) text(source[key]);
  const grader = object(row.grader, ['id','version']); requireThat(grader.version === '1', 'unsupported grader version');
  requireThat(row.task && typeof row.task === 'object' && 'kind' in row.task, 'missing response specification');
  if (row.task.kind === 'radix') {
    const task = object(row.task, ['kind','decimal','base','width','trim','letterCase']);
    requireThat(typeof task.decimal === 'string' && /^\d{1,20}$/.test(task.decimal), 'invalid radix value');
    requireThat([2,16].includes(Number(task.base)) && typeof task.base === 'number' && Number.isInteger(task.width) && Number(task.width) >= 1 && Number(task.width) <= 64 && task.trim === true && task.letterCase === 'either', 'unsupported radix format');
    requireThat(BigInt(task.decimal).toString(task.base as number).length <= Number(task.width), 'radix value exceeds width');
    requireThat(grader.id === 'radix-exact' && row.skillId === 'CO_SK04_01_RADIX_CONVERT', 'wrong radix grader/skill');
    requireThat(row.prompt === `Convert decimal ${task.decimal} to base ${task.base}, using exactly ${task.width} digits.`, 'radix prompt differs from specification');
  } else if (row.task.kind === 'truth') {
    const task = object(row.task, ['kind','expression','rows']); expression(task.expression);
    requireThat(Array.isArray(task.rows) && task.rows.length === 4, 'truth table needs four rows');
    const expected = [{id:'ff',p:false,q:false},{id:'ft',p:false,q:true},{id:'tf',p:true,q:false},{id:'tt',p:true,q:true}];
    task.rows.forEach((item, i) => { const r = object(item, ['id','p','q']); requireThat(r.id === expected[i].id && r.p === expected[i].p && r.q === expected[i].q, 'truth-table row identity/order changed'); });
    requireThat(grader.id === 'truth-rows' && row.skillId === 'RL_SK01_03_TRUTH_TABLE', 'wrong truth grader/skill');
    requireThat(row.prompt === `Complete the final column for ${formulaText(task.expression)}.`, 'truth prompt differs from formula');
  } else if (row.task.kind === 'java-output') {
    const task = object(row.task, ['kind','code','options']); text(task.code, 1000);
    requireThat(Array.isArray(task.options) && task.options.length === 3, 'expected three fixed output options');
    const ids = task.options.map(item => { const option = object(item, ['id','output']); text(option.id, 80); text(option.output, 80); return option.id; });
    requireThat(new Set(ids).size === ids.length, 'duplicate output option IDs');
    requireThat(grader.id === 'fixed-output-choice' && row.skillId === 'IP_SK02_03_LOOP_TRACE', 'wrong output grader/skill');
    requireThat(row.prompt === 'What does this Java snippet print?', 'unexpected output prompt');
  } else throw new Error('Practice catalog: unsupported task');
  validateAnswer(row.reference);
  const result = gradeResponse(value as Exercise, row.reference);
  requireThat(result.status === 'GRADED' && result.correct && Number.isFinite(result.earned) && result.earned === result.max && result.max === 1, 'reference answer/grader mismatch');
}
export function validateCatalog(value: unknown): asserts value is Exercise[] {
  requireThat(Array.isArray(value) && value.length === 6, 'expected exactly six exercises');
  value.forEach(validateDefinition);
  requireThat(new Set(value.map(item => item.id)).size === 6, 'duplicate exercise identity');
  for (const subject of references.subjects) requireThat(value.filter(item => item.subjectId === subject).length === 2, 'expected two exercises per subject');
}
