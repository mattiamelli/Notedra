import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {buildExerciseCoverage,coverageMarkdown} from '../scripts/exercise-coverage';
import {allExercises} from '../src/practice/catalog';
import {assemblyTraceExercises} from '../src/assembly-practice/catalog';
import {curriculumExercises} from '../src/curriculum/practice';
import {topicStudy} from '../src/topic-study/content';
import legacyStudy from '../src/generated/topic-study.json';
import type {PracticeExercise} from '../src/practice/registered-types';
// The patches 5-7 report is a retained baseline, not the merged runtime inventory.
const additions = new Set(curriculumExercises.map(exercise=>exercise.id));
const historicalExercises = allExercises.filter(exercise=>!additions.has(exercise.id));
describe('Complete exercise coverage audit',()=>{
 it('preserves the historical report and every legacy topic and skill, including honest gaps',()=>{
  const report=buildExerciseCoverage(historicalExercises);
  expect(new Set(report.skills.map(s=>s.topic)).size).toBe(report.counts.topics);
  expect(report.skills).toHaveLength(report.counts.skills);
  expect(report.rows.filter(r=>r.id.startsWith('ds.practice.'))).toHaveLength(historicalExercises.length);
  expect(coverageMarkdown(report)).toBe(readFileSync('docs/maintenance-patch-5-coverage.md','utf8'));
  for(const row of report.rows)for(const value of [row.validator,row.feedback,row.tests,row.fallback,row.source.join()])expect(value.length).toBeGreaterThan(0);
 });
 it('covers every added runtime topic and skill with correctly scoped practice',()=>{
  const legacyTopics=new Set(legacyStudy.topics.map(topic=>topic.id));
  const addedTopics=topicStudy.topics.filter(topic=>!legacyTopics.has(topic.id));
  expect(addedTopics.length).toBeGreaterThan(0);
  expect(new Set(allExercises.map(exercise=>exercise.id)).size).toBe(allExercises.length);
  for(const topic of addedTopics)for(const subtopic of topic.subtopics)for(const skill of subtopic.skills){
   expect(curriculumExercises.some(exercise=>exercise.subjectId===topic.subjectId&&exercise.topicId===topic.id&&exercise.subtopicId===subtopic.id&&exercise.skillId===skill.id)).toBe(true);
  }
  for(const exercise of [...assemblyTraceExercises,...curriculumExercises]){
   const topic=topicStudy.topics.find(topic=>topic.id===exercise.topicId);
   expect(topic?.subjectId).toBe(exercise.subjectId);
   expect(topic?.subtopics.some(subtopic=>subtopic.id===exercise.subtopicId&&subtopic.skills.some(skill=>skill.id===exercise.skillId))).toBe(true);
   expect(allExercises.find(item=>item.id===exercise.id)).toEqual(exercise);
  }
 });
 it('rejects a new unclassified family, missing validator, or lost source/course metadata',()=>{
  const original=allExercises[0];
  for(const changed of [{...original,task:{kind:'new-family'}},{...original,grader:{id:'missing',version:'1'}},{...original,source:{...original.source,filename:''}},{...original,subjectId:'wrong-course'}]){
   expect(()=>buildExerciseCoverage([changed as unknown as PracticeExercise])).toThrow();
  }
 });
 it('preserves real cross-course action variety and open exam work',()=>{
  const {rows}=buildExerciseCoverage(historicalExercises);
  expect(rows.some(r=>r.course==='CSE1400_CO'&&r.after==='ordered-fields')).toBe(true);
  expect(rows.some(r=>r.course==='CSE1300_RL'&&r.after==='truth-rows')).toBe(true);
  expect(rows.some(r=>r.course==='CSE1100_IP'&&r.after==='single-choice')).toBe(true);
  for(const course of ['CSE1400_CO','CSE1300_RL','CSE1100_IP']){
   expect(rows.some(r=>r.course===course&&r.id.startsWith('ds.exam.')&&r.validator.startsWith('RUBRIC_REVIEW_REQUIRED'))).toBe(true);
   expect(new Set(rows.filter(r=>r.course===course).map(r=>r.after)).size).toBeGreaterThan(2);
  }
 });
});
