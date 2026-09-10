export type Confidence = 'Insufficient' | 'Low' | 'Moderate' | 'High';
export type EvidenceClass = 'Normal practice' | 'Quick exam' | 'Full mock';
export interface Observation {
  id: string; item: string; skillId: string; topicId: string; courseId: string;
  timestamp: number; correct: boolean; session: string; source: EvidenceClass;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Unknown'; solutionViewed: boolean | null;
  pattern: string | null;
}
export interface SkillIndex {
  id: string; name: string; topicId: string; courseId: string;
  index: number | null; confidence: Confidence; observations: number; distinctItems: number;
  days: number; freshness: number; recentMistakes: number; lastSuccess: number | null;
  limited: number; why: string[];
}
export interface Aggregate {
  id: string; name: string; index: number | null; confidence: Confidence;
  covered: number; total: number; recent: number; why: string[];
  strongest: string[]; review: string[]; missing: string[];
}
export interface OpenParticipation {
  courseId: string; topicId: string; mechanism: string; session: string; timestamp: number;
  integrated: boolean; kind: 'Open/rubric practice' | 'Authored integrated task';
}
export interface Readiness {
  courseId: string; index: number | null; confidence: Confidence;
  objectiveTopics: number; practisedTopics: number; totalTopics: number;
  sessions: number; fullSessions: number; distinctItems: number;
  openMechanisms: number; openState: 'Limited' | 'Practised' | 'Broadly practised';
  integrated: boolean; gaps: string[]; why: string[];
}
export interface EvidenceSnapshot {
  observations: Observation[]; open: OpenParticipation[];
  limited: {id: string; courseId: string; skillIds: string[]; reason: string}[];
}
export interface Progress {
  now: number; skills: SkillIndex[]; topics: Aggregate[]; courses: Aggregate[];
  readiness: Readiness[]; evidence: EvidenceSnapshot;
}
