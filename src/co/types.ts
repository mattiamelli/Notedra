import type {AuthoredScope, Flashcard, Lesson} from '../topic-study/types';
import type {Exercise} from '../practice/types';
export interface GuidedActivity extends AuthoredScope { title: string; prompt: string; rubric: string[]; }
export interface COTopicContent { lesson: Lesson; cards: Flashcard[]; guided: GuidedActivity[]; }
export type COAnswerFormat = 'integer' | 'decimal' | 'binary' | 'hex';
export interface COTask { kind: 'co-exact'; format: COAnswerFormat; width: number | null; }
export interface COExercise extends Omit<Exercise, 'task' | 'grader'> {
  task: COTask;
  grader: {id: 'co-exact'; version: '1'};
}
export type PracticeExercise = Exercise | COExercise;
export type PracticeClass = 'A' | 'B' | 'C' | 'D' | 'E';
export interface SkillCoverage { skillId: string; category: PracticeClass; reason: string; exerciseIds: string[]; guidedIds: string[]; toolId: string | null; }
export interface COCapability { topicId: string; lessonId: string; cardCount: number; exerciseCount: number; guidedCount: number; toolId: string | null; toolName: string | null; }
