export interface CurriculumSource { id: string; filename: string; locator: string; }
export interface CurriculumSkill { id: string; name: string; description: string; }
export interface CurriculumExercise {
  id: string;
  title: string;
  prompt: string;
  skillId: string;
  sourceIds: string[];
  kind: 'choice' | 'integer' | 'open';
  options?: {id: string; text: string}[];
  answer?: string;
  explanation: string;
  rubric?: string[];
}
export interface CurriculumTopic {
  id: string;
  name: string;
  description: string;
  prerequisites: string[];
  sourceIds: string[];
  skills: CurriculumSkill[];
  lesson: {title: string; paragraphs: string[]}[];
  exercises: CurriculumExercise[];
}
export interface CurriculumCourse {
  id: string;
  code: string;
  name: string;
  short: string;
  trimester: 2 | 3 | 4;
  slug: string;
  description: string;
  limitations: string[];
  sources: CurriculumSource[];
  topics: CurriculumTopic[];
}
