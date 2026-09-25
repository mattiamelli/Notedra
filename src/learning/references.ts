import legacy from '../generated/student-references.json';
import {curriculumMetadata} from '../curriculum/metadata';

// The original content fingerprint remains the compatibility anchor for saved student data.
// Additive identifiers do not reinterpret any existing topic, skill, or attempt binding.
export const studentReferences = {
  ...legacy,
  subjects: [...legacy.subjects, ...curriculumMetadata.map(course => course.id)],
  topics: [...legacy.topics, ...curriculumMetadata.flatMap(course => course.topics.map(topic => ({id: topic.id, subject: course.id})))],
  subtopics: [...legacy.subtopics, ...curriculumMetadata.flatMap(course => course.topics.map(topic => ({id: `${topic.id}_CORE`, topic: topic.id})))],
  skills: [...legacy.skills, ...curriculumMetadata.flatMap(course => course.topics.flatMap(topic => topic.skills.map(skill => ({id: skill.id, subtopic: `${topic.id}_CORE`})) ))],
};
