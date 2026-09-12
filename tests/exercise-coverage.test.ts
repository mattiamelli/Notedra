import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {buildExerciseCoverage,coverageMarkdown} from '../scripts/exercise-coverage';
import {allExercises} from '../src/practice/catalog';
import type {PracticeExercise} from '../src/practice/registered-types';
describe('Complete exercise coverage audit',()=>{
 it('is fresh and covers every canonical topic and skill, including honest gaps',()=>{
  const report=buildExerciseCoverage();
  expect(new Set(report.skills.map(s=>s.topic)).size).toBe(report.counts.topics);
  expect(report.skills).toHaveLength(report.counts.skills);
  expect(report.rows.filter(r=>r.id.startsWith('ds.practice.'))).toHaveLength(allExercises.length);
  expect(coverageMarkdown(report)).toBe(readFileSync('docs/maintenance-patch-5-coverage.md','utf8'));
  for(const row of report.rows)for(const value of [row.validator,row.feedback,row.tests,row.fallback,row.source.join()])expect(value.length).toBeGreaterThan(0);
 });
 it('rejects a new unclassified family, missing validator, or lost source/course metadata',()=>{
  const original=allExercises[0];
  for(const changed of [{...original,task:{kind:'new-family'}},{...original,grader:{id:'missing',version:'1'}},{...original,source:{...original.source,filename:''}},{...original,subjectId:'wrong-course'}]){
   expect(()=>buildExerciseCoverage([changed as unknown as PracticeExercise])).toThrow();
  }
 });
 it('preserves real cross-course action variety and open exam work',()=>{
  const {rows}=buildExerciseCoverage();
  expect(rows.some(r=>r.course==='CSE1400_CO'&&r.after==='ordered-fields')).toBe(true);
  expect(rows.some(r=>r.course==='CSE1300_RL'&&r.after==='truth-rows')).toBe(true);
  expect(rows.some(r=>r.course==='CSE1100_IP'&&r.after==='single-choice')).toBe(true);
  for(const course of ['CSE1400_CO','CSE1300_RL','CSE1100_IP']){
   expect(rows.some(r=>r.course===course&&r.id.startsWith('ds.exam.')&&r.validator.startsWith('RUBRIC_REVIEW_REQUIRED'))).toBe(true);
   expect(new Set(rows.filter(r=>r.course===course).map(r=>r.after)).size).toBeGreaterThan(2);
  }
 });
});
