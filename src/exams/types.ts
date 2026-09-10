import type {Answer} from '../learning/contracts';
export type ExamCourse = 'CSE1400_CO' | 'CSE1300_RL' | 'CSE1100_IP';
export type ExamMode = 'quick' | 'full';
export type EvaluationMode = 'DETERMINISTIC' | 'RUBRIC';
export interface Ref {id: string; version: string;}
export interface Provenance {documentId: string; filename: string; pages: number[]; era: 'CURRENT' | 'RECENT'; role: 'MECHANISM_ONLY';}
export interface ExamItem extends Ref {
  course: ExamCourse; topicId: string; skillIds: string[]; title: string; mechanism: string;
  questionType: string; difficulty: 'Easy' | 'Medium' | 'Hard'; difficultyReason: string;
  responseType: Answer['kind']; evaluation: EvaluationMode; weight: number; evaluator: Ref;
  provenance: Provenance[]; patternId: string | null; generationEligibility: 'FIXED_AUTHORED_ONLY';
  practiceRef?: Ref; prompt?: string; context?: string; rubric?: {requirement: string; skillIds: string[]; checks: string[]}[];
}
export interface Blueprint extends Ref {
  course: ExamCourse; mode: ExamMode; title: string; durationMinutes: number;
  slots: {id: string; candidates: Ref[]}[];
  constraints: {topics: string[]; minOpen: number; maxPerTopic: number};
  difficultyMix: Record<ExamItem['difficulty'], number>; questionTypeMix: Record<string, number>;
  timingPolicy: 'ABSOLUTE_FREEZE_CONFIRM_V1'; scoringPolicy: 'EXACT_COMPONENTS_OPEN_UNSCORED_V1';
  provenance: Provenance[]; rationale: string;
}
export interface ExamBank {course: ExamCourse; items: ExamItem[]; blueprints: Blueprint[];}
export interface ItemBinding extends Ref {evaluator: Ref; weight: number; evaluation: EvaluationMode; responseType: Answer['kind'];}
export interface ExamResponse {itemId: string; answer: Answer;}
export type Evaluation = {itemId: string; status: 'AUTO_SCORED'; earned: number; max: number} |
  {itemId: string; status: 'UNANSWERED' | 'RUBRIC_REVIEW_REQUIRED' | 'NOT_AUTOGRADABLE'; reason: string};
export interface ExamSubmission {operationId: string; submittedAt: string; evaluations: Evaluation[]; evidence: {itemId: string; attemptId: string}[];}
export interface ExamSession {
  sessionId: string; course: ExamCourse; mode: ExamMode; blueprint: Ref; seed: string;
  items: ItemBinding[]; durationMinutes: number; timingPolicy: Blueprint['timingPolicy']; scoringPolicy: Blueprint['scoringPolicy'];
  startedAt: string; deadlineAt: string; updatedAt: string; revision: number;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'ABANDONED'; responses: ExamResponse[]; flagged: string[];
  submission?: ExamSubmission;
}
export interface ExamReview {sessionId: string; itemId: string; reviewedAt: string | null; revision: number;}
export interface OpenReference {itemId: string; version: string; reference: string; reasoning: string;}
