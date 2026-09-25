import {curriculumCourses} from './registry';
import type {Flashcard, Lesson, StudyProjection} from '../topic-study/types';

export const curriculumProjection: StudyProjection = {
  subjects: curriculumCourses.map(course => course.id),
  sources: curriculumCourses.flatMap(course => course.sources.map(source => ({
    ...source, documentId: source.id, kind: 'DOCUMENT_SECTION',
    precision: 'DOCUMENT_RANGE', confidence: 'HIGH',
  }))),
  topics: curriculumCourses.flatMap(course => course.topics.map(topic => ({
    id: topic.id, subjectId: course.id, name: topic.name, description: topic.description,
    relevance: course.description, prerequisites: topic.prerequisites, sources: topic.sourceIds,
    subtopics: [{id: `${topic.id}_CORE`, name: topic.name, prerequisites: [], sources: topic.sourceIds,
      skills: topic.skills.map(skill => ({...skill, prerequisites: [], sources: [...new Set([
        ...topic.sourceIds, ...topic.exercises.filter(exercise => exercise.skillId === skill.id).flatMap(exercise => exercise.sourceIds),
      ])]}))}],
  }))),
};

export const curriculumLessons: Lesson[] = curriculumCourses.flatMap(course => course.topics.map(topic => ({
  id: `${topic.id}_LESSON`, version: '1', topicId: topic.id,
  blocks: topic.lesson.map((block, index) => ({...block, id: `${topic.id}_BLOCK_${index + 1}`,
    version: '1', topicId: topic.id, skillIds: topic.skills.map(skill => skill.id),
    subtopicIds: [`${topic.id}_CORE`], sourceIds: topic.sourceIds, kind: 'concept' as const})),
})));

// Reuse an authored question per skill for unscored recall, rather than treating a learning objective as an answer.
export const curriculumFlashcards: Flashcard[] = curriculumCourses.flatMap(course => course.topics.flatMap(topic =>
  topic.skills.map(skill => {
    const exercise = topic.exercises.find(item => item.skillId === skill.id)!;
    const reference = exercise.kind === 'choice' ? exercise.options?.find(option => option.id === exercise.answer)?.text : exercise.answer;
    return {id: `${skill.id}_RECALL`, version: '1', topicId: topic.id,
      skillIds: [skill.id], subtopicIds: [`${topic.id}_CORE`], sourceIds: exercise.sourceIds,
      prompt: exercise.prompt + (exercise.kind === 'choice' ? '\n' + exercise.options!.map(option => option.text).join(' / ') : ''),
      answer: [reference, exercise.explanation].filter(Boolean).join('\n')};
  }),
));
