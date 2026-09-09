export const PACK_VERSION = '1.0.1';
export const SCHEMA_VERSION = '1.1.0';
export const PACK_ID = 'DELFTSTUDY_Q1_CONTENT_PACK_2026';
export const SCHEMA_DIALECT = 'https://json-schema.org/draft/2020-12/schema';
export const PACK_DIRECTORY = new URL('../../content-pack/v1.0.1/', import.meta.url);
export const MANIFEST_SHA256 = 'd26c0384029d261185cd118979c874d86771439e49cf68a8deb96ee450653bcc';
export const HANDOFF_FILE = 'DelftStudy_Codex_Handoff_Pack.json';
export const SCHEMA_FILE = 'DelftStudy_Content_Pack.schema.json';
export const PACK_FILES = [
  HANDOFF_FILE, SCHEMA_FILE, 'DelftStudy_Master_Content_Pack.md', 'INSTRUCTIONS_FOR_CODEX.md',
  'FINAL_VALIDATION_REPORT.json', 'FINAL_VALIDATION_REPORT.md',
  'ADVERSARIAL_REAUDIT_REPORT.json', 'ADVERSARIAL_REAUDIT_REPORT.md', 'manifest.json',
] as const;
export const EXPECTED_COUNTS = {
  documents_total: 90,
  documents_by_subject: {CSE1100_IP: 28, CSE1400_CO: 29, CSE1300_RL: 33},
  topics: 43, subtopics: 105, atomic_skills: 147, assessments: 37,
  mapped_question_records: 489, question_types: 17, exam_patterns: 22, common_error_tags: 29,
};
export const EXPECTED_RELATIONS: Readonly<Record<string, number>> = {
  topic_prerequisites: 62, skill_prerequisites: 69, topic_to_subtopics: 105,
  subtopic_to_skills: 147, document_to_topics: 306, assessment_to_document: 37,
  question_to_topics: 538, question_to_skills: 2005,
};
export const EMBEDDING_FLAGS = {
  source_document_records_embedded_in_handoff: true,
  source_pdf_hashes_embedded_in_handoff: true,
  source_pdf_binaries_embedded_in_handoff: false,
  source_pdf_full_text_embedded_in_handoff: false,
};
