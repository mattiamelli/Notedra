import type { Answer } from '../learning/contracts';
export type Expression = {op: 'var'; name: 'p' | 'q'} | {op: 'not'; arg: Expression} | {op: 'and' | 'or'; left: Expression; right: Expression};
export type Task =
  {kind: 'radix'; decimal: string; base: 2 | 16; width: number; trim: true; letterCase: 'either'} |
  {kind: 'truth'; expression: Expression; rows: {id: string; p: boolean; q: boolean}[]} |
  {kind: 'java-output'; code: string; options: {id: string; output: string}[]};
export interface Exercise {
  id: string; version: string; title: string; prompt: string; rules: string;
  subjectId: string; topicId: string; subtopicId: string; skillId: string;
  authorship: 'AUTHORED_PRACTICE';
  source: {kind: 'LECTURE'; documentId: string; filename: string; locator: string; precision: 'DOCUMENT_RANGE'};
  grader: {id: 'radix-exact' | 'truth-rows' | 'fixed-output-choice'; version: '1'};
  task: Task; reference: Answer; explanation: string;
}
export type InputResult = {status: 'VALID'} | {status: 'INCOMPLETE' | 'INVALID' | 'NOT_AUTOGRADABLE'; message: string};
export type GradeResult =
  {status: 'GRADED'; correct: boolean; earned: number; max: number; explanation: string; reference: Answer} |
  {status: 'INCOMPLETE' | 'INVALID' | 'NOT_AUTOGRADABLE' | 'ERROR'; message: string};
