import {academicIndex,courses,topicPath} from '../academic/navigation';
import type {Evidence} from '../adaptive/evidence';
import type {Recommendation} from '../adaptive/engine';
import type {Dataset} from '../learning/contracts';
import {attemptPath} from '../practice/catalog';
import type {PracticeExercise} from '../practice/registered-types';
import {resolveAttempt} from '../practice/service';

export type NextBestActionSelection=
 | {state:'loading'|'error'}
 | {state:'ready';source:'draft'|'exam'|'adaptive'|'resume'|'cold-start'|'study-path';title:string;to:string;cta:'continue'|'start-practice'|'build-path';course?:string;topic?:string;minutes?:number;estimated?:boolean;recentMistakes?:number;recommendation?:Recommendation};

interface SelectorInput {
 phase?:'loading'|'ready'|'busy'|'error';
 data:Dataset|null;
 evidence:Evidence;
 recommendations:readonly Recommendation[];
 exercises:readonly PracticeExercise[];
}

const newest=<T extends {updatedAt:string}>(rows:readonly T[])=>[...rows].sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))[0];
const courseName=(subjectId:string)=>courses.find(course=>course.subject_id===subjectId)?.name;
const topicName=(topicId:string)=>academicIndex.topics.find(topic=>topic.topic_id===topicId)?.name;

/** Selects one existing destination without calculating evidence, mastery or readiness. */
export function selectNextBestAction({phase,data,evidence,recommendations,exercises}:SelectorInput):NextBestActionSelection {
 if(phase==='error')return {state:'error'};
 if(!data)return {state:'loading'};

 const draft=newest(data.attempts.filter(attempt=>attempt.status==='DRAFT'));
 if(draft){
  const resolved=resolveAttempt(draft);
  if(resolved.status==='AVAILABLE')return {state:'ready',source:'draft',title:resolved.exercise.title,to:attemptPath(resolved.exercise,draft.attemptId),cta:'continue',course:courseName(draft.subjectId),topic:topicName(draft.topicId)};
 }
 const exam=newest(data.exams.filter(item=>item.status==='IN_PROGRESS'));
 if(exam)return {state:'ready',source:'exam',title:exam.mode==='quick'?'quick-exam':'full-mock',to:`/exams/sessions/${encodeURIComponent(exam.sessionId)}`,cta:'continue',course:courseName(exam.course),minutes:exam.durationMinutes};

 const recommendation=recommendations[0];
 if(recommendation){
  const recentMistakes=evidence.groups.find(group=>group.skill.id===recommendation.basisSkillId)?.recent.length;
  return {state:'ready',source:'adaptive',title:recommendation.title,to:recommendation.to,cta:'continue',course:courseName(recommendation.subjectId),topic:topicName(recommendation.topicId),minutes:recommendation.minutes,estimated:recommendation.durationSource==='Notedra estimate',recentMistakes,recommendation};
 }

 if(data.resume){
  const topic=academicIndex.topics.find(item=>item.subject_id===data.resume!.subjectId&&item.topic_id===data.resume!.topicId);
  if(topic)return {state:'ready',source:'resume',title:topic.name,to:topicPath(topic),cta:'continue',course:courseName(topic.subject_id),topic:topic.name};
 }

 const noActivity=!data.resume&&!data.attempts.length&&!data.reviews.length&&!data.exams.length&&!(data.upcomingExams?.length);
 if(noActivity){
  const exercise=exercises.find(item=>item.id==='ds.practice.co-binary-45')??exercises.find(item=>item.subjectId==='CSE1400_CO');
  if(exercise)return {state:'ready',source:'cold-start',title:exercise.title,to:`/practice/${encodeURIComponent(exercise.id)}`,cta:'start-practice',course:courseName(exercise.subjectId),topic:topicName(exercise.topicId)};
 }
 return {state:'ready',source:'study-path',title:'study-path',to:'/study-plan?minutes=15',cta:'build-path',minutes:15,estimated:true};
}
