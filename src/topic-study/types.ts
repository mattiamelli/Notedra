export interface StudySource { id: string; documentId: string; filename: string; locator: string; kind: string; precision: string; confidence: string; }
export interface StudySkill { id: string; name: string; description: string; prerequisites: string[]; sources: string[]; }
export interface StudySubtopic { id: string; name: string; prerequisites: string[]; sources: string[]; skills: StudySkill[]; }
export interface StudyTopic { id: string; subjectId: string; name: string; description: string; relevance: string; prerequisites: string[]; sources: string[]; subtopics: StudySubtopic[]; }
export interface StudyProjection { subjects: string[]; topics: StudyTopic[]; sources: StudySource[]; }
export const studyModes = [
  {id:'overview',label:'Overview'}, {id:'learn',label:'Learn'}, {id:'mental-map',label:'Mental Map'},
  {id:'flashcards',label:'Flashcards'}, {id:'practice',label:'Practice'}, {id:'exam-style',label:'Exam-style'}, {id:'mistakes',label:'Mistakes'},
] as const;
export type StudyMode = typeof studyModes[number]['id'];
export const isStudyMode = (value: string): value is StudyMode => studyModes.some(mode => mode.id === value);
export interface AuthoredScope { id: string; version: string; topicId: string; skillIds: string[]; subtopicIds: string[]; sourceIds: string[]; }
export type BlockKind = 'introduction' | 'concept' | 'procedure' | 'worked_example' | 'important_rule' | 'common_pitfall' | 'code_example' | 'recap';
export interface LessonBlock extends AuthoredScope { kind: BlockKind; title: string; paragraphs: string[]; code?: string; table?: {headers: string[]; rows: string[][]}; }
export interface Lesson { id: string; version: string; topicId: string; blocks: LessonBlock[]; }
export interface Flashcard extends AuthoredScope { prompt: string; answer: string; }
