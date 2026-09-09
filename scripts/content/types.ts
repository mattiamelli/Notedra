export interface Entity { [key: string]: unknown; subject_id: string; }
export interface DocumentRecord extends Entity {
  document_id: string; filename: string; main_topic_ids: string[];
  official_status: string; evidence_era: string; current_style_weight: string;
}
export interface Frequency {
  observed_official_assessment_count: number;
  recent_or_current_verified_assessment_count: number;
  observed_official_assessment_count_including_low_confidence?: number;
  practice_or_example_assessment_count?: number;
  low_or_unverified_assessment_count?: number;
  by_assessment_type?: Record<string, number>;
  eligible_question_reference_count?: number;
  all_mapped_reference_count?: number;
}
export interface ExamReference {
  [key: string]: unknown;
  assessment_id: string; document_id: string; question_ref: string;
  mapping_confidence: string;
}
export interface Topic extends Entity {
  topic_id: string; subtopic_ids: string[]; prerequisite_topic_ids: string[];
  prerequisite_information: {topic_ids: string[]};
  exam_references: ExamReference[]; historical_frequency: Frequency;
}
export interface Subtopic extends Entity {
  subtopic_id: string; topic_id: string; skill_ids: string[]; prerequisite_subtopic_ids: string[];
}
export interface Skill extends Entity {
  skill_id: string; topic_id: string; subtopic_id: string; prerequisite_skill_ids: string[];
  prerequisite_information: {skill_ids: string[]};
  exam_references: ExamReference[]; historical_frequency: Frequency;
}
export interface Question extends ExamReference {
  topic_ids: string[]; skill_ids: string[]; question_type_ids: string[];
  mapping_granularity: string; notes: string[];
  can_generate_variants: boolean; adaptive_use_policy: string;
  skill_mastery_update_policy: string; historical_topic_frequency_eligible: boolean;
  historical_skill_frequency_eligible: boolean; exam_readiness_eligible: boolean;
  assessment_type: string; official_status: string; evidence_era: string; current_style_weight: string;
}
export interface Assessment extends Entity {
  assessment_id: string; document_id: string; question_map: Question[];
  assessment_type: string; official_status: string; evidence_era: string; current_style_weight: string;
}
export interface ContentPack {
  [key: string]: unknown;
  pack_version: string; schema_version: string;
  counts: Record<string, unknown>;
  subjects: Entity[];
  corpus: {documents: DocumentRecord[]; embedding_semantics: Record<string, unknown>};
  taxonomy: {topics: Topic[]; subtopics: Subtopic[]; atomic_skills: Skill[]};
  assessment_model: {
    assessments: Assessment[]; question_types: Record<string, unknown>[];
    course_exam_patterns: Entity[]; common_error_tags: Entity[];
    official_signals: Entity[];
  };
  relations: Record<string, Record<string, unknown>[]>;
  data_safety_contract: Record<string, unknown>;
  validation_contract: Record<string, unknown>;
}
export interface ValidationIssue {code: string; path: string; message: string;}
export type ReportIssue = (code: string, path: string, message: string) => void;
export interface ValidationReport {
  valid: boolean;
  issues: ValidationIssue[];
  counts: Record<string, unknown>;
  relationCounts: Record<string, number>;
  checks: string[];
}
export const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
export function walkObjects(value: unknown, visit: (object: Record<string, unknown>, path: string) => void, path = ''): void {
  if (Array.isArray(value)) value.forEach((item, index) => walkObjects(item, visit, `${path}/${index}`));
  else if (isRecord(value)) {
    visit(value, path);
    for (const [key, child] of Object.entries(value)) walkObjects(child, visit, `${path}/${key}`);
  }
}
export const sameSet = (left: readonly string[], right: readonly string[]): boolean => left.length === right.length && new Set(left).size === left.length && left.every(value => right.includes(value));
