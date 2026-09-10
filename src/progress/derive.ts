import type {Backup} from '../learning/contracts';
import type {ExamBank} from '../exams/types';
import {topicStudy} from '../topic-study/content';
import {collectEvidence} from './evidence';
import {skillMastery,aggregate} from './mastery';
import {examReadiness} from './readiness';
import type {Observation,Progress} from './types';
export function deriveProgress(data:Backup,now:number,banks:readonly ExamBank[]=[]):Progress {
  const evidence=collectEvidence(data,banks,now),bySkill=new Map<string,Observation[]>();
  for(const e of evidence.observations){if(e.source!=='Normal practice')continue;const group=bySkill.get(e.skillId)??[];group.push(e);bySkill.set(e.skillId,group);}
  const limited=new Map<string,number>();
  for(const l of evidence.limited)for(const id of l.skillIds)limited.set(id,(limited.get(id)??0)+1);
  const skills=topicStudy.topics.flatMap(t=>t.subtopics.flatMap(s=>s.skills.map(skill=>skillMastery({id:skill.id,name:skill.name,topicId:t.id,courseId:t.subjectId},bySkill.get(skill.id)??[],now,limited.get(skill.id)??0))));
  const topics=topicStudy.topics.map(t=>aggregate(t.id,t.name,skills.filter(s=>s.topicId===t.id)));
  const courses=topicStudy.subjects.map(id=>aggregate(id,id,skills.filter(s=>s.courseId===id),topics.filter(t=>topicStudy.topics.some(p=>p.id===t.id&&p.subjectId===id))));
  return {now,skills,topics,courses,readiness:topicStudy.subjects.map(id=>examReadiness(id,evidence,now)),evidence};
}
