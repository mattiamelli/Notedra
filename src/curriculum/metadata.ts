import metadata from '../generated/curriculum-metadata.json';
import type {AcademicIndex} from '../academic/types';

export const curriculumMetadata = metadata;
export const curriculumAcademicIndex: AcademicIndex = {
  subjects: metadata.map(course => ({subject_id: course.id, code: course.code, name: course.name, short: course.short})),
  topics: metadata.flatMap(course => course.topics.map((topic, index) => ({
    subject_id: course.id, topic_id: topic.id, name: topic.name, order: index + 1,
  }))),
};
