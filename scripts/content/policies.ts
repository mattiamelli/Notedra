import { EMBEDDING_FLAGS } from './constants.ts';
import { walkObjects, type ContentPack, type Question, type ReportIssue } from './types.ts';

const uncertainValues = new Set(['LOW','UNVERIFIED','PARTIALLY_UNVERIFIED','UNKNOWN']);
const uncertainMappingNote = /\b(?:LOW|UNVERIFIED|PARTIALLY_UNVERIFIED)\b.{0,32}\bmapping\b|\bmapping\b.{0,32}\b(?:LOW|UNVERIFIED|PARTIALLY_UNVERIFIED)\b/i;
export function isUncertainMapping(question: Question): boolean {
  return question.mapping_granularity === 'UNVERIFIED_OR_DRILL_ONLY' || uncertainValues.has(question.mapping_confidence) || question.notes.some(note => uncertainMappingNote.test(note));
}
export function checkPolicies(pack: ContentPack, report: ReportIssue): void {
  const falseFlags = ['low_mapping_updates_mastery','broad_mapping_updates_child_skills_automatically','page_completion_counts_as_mastery','future_exam_prediction_is_guaranteed','partially_unverified_generation_allowed','unverified_or_drill_only_generation_allowed','unverified_or_drill_only_updates_mastery','unverified_or_drill_only_updates_exam_readiness'];
  const trueFlags = ['no_verbatim_exam_copy','unknown_is_valid_state','practice_is_not_official_occurrence','historical_frequency_is_not_forecast','topic_frequency_uses_unique_assessment_documents','source_locator_precision_must_be_explicit'];
  for (const [keys,expected] of [[falseFlags,false],[trueFlags,true]] as const) for (const key of keys) if (pack.data_safety_contract[key] !== expected) report('POLICY', `data_safety_contract/${key}`, `Must remain ${expected}.`);
  for (const [key,expected] of Object.entries(EMBEDDING_FLAGS)) if (pack.corpus.embedding_semantics[key] !== expected) report('POLICY', `corpus/embedding_semantics/${key}`, `Must remain ${expected}.`);
  for (const key of ['required_zero_cycle_policy','required_zero_cross_course_prerequisites','required_zero_duplicate_references_and_edges','required_uncertainty_policy_consistency','required_unique_assessment_frequency_aggregation','required_manifest_and_checksum_verification']) if (pack.validation_contract[key] !== true) report('POLICY', `validation_contract/${key}`, 'Required integrity check cannot be disabled.');
  const questions = new Map(pack.assessment_model.assessments.flatMap(a => a.question_map).map(q => [q.question_ref,q]));
  for (const q of questions.values()) {
    if (isUncertainMapping(q)) {
      for (const flag of ['can_generate_variants','historical_topic_frequency_eligible','historical_skill_frequency_eligible','exam_readiness_eligible'] as const) if (q[flag] !== false) report('UNCERTAINTY', `${q.question_ref}/${flag}`, 'Uncertain mappings cannot generate source variants, award mastery/readiness, or count as verified historical evidence.');
      if (q.skill_mastery_update_policy !== 'DO_NOT_UPDATE_SKILL_MASTERY') report('UNCERTAINTY', q.question_ref, 'Uncertain mapping must not update individual skill mastery.');
      if (q.adaptive_use_policy !== 'UNVERIFIED_DRILL_ONLY_NO_GENERATION_NO_MASTERY_NO_READINESS') report('UNCERTAINTY', q.question_ref, 'Uncertain mapping requires the drill-only safety policy.');
    }
    if (q.mapping_granularity === 'TOPIC_LEVEL_BROAD' && (q.historical_skill_frequency_eligible || q.skill_mastery_update_policy !== 'TOPIC_EVIDENCE_ONLY_UNLESS_COMPONENT_RUBRIC_DISAMBIGUATES')) report('UNCERTAINTY', q.question_ref, 'Broad topic evidence cannot directly credit individual skills.');
    if (q.mapping_granularity === 'INTEGRATED_MULTI_SKILL' && (q.historical_skill_frequency_eligible || q.skill_mastery_update_policy !== 'REQUIRES_COMPONENT_RUBRIC_OR_TEST_EVIDENCE')) report('UNCERTAINTY', q.question_ref, 'Integrated evidence requires rubric/test decomposition before individual mastery.');
  }
  walkObjects(pack, (object,path) => {
    if (typeof object.question_ref !== 'string') return;
    const q = questions.get(object.question_ref);
    if (!q) return;
    for (const [key,sourceKey] of [['mastery_update_policy','skill_mastery_update_policy'],['skill_mastery_update_policy','skill_mastery_update_policy'],['can_generate_variants','can_generate_variants'],['historical_topic_frequency_eligible','historical_topic_frequency_eligible'],['historical_skill_frequency_eligible','historical_skill_frequency_eligible'],['exam_readiness_eligible','exam_readiness_eligible']] as const) {
      if (key in object && object[key] !== q[sourceKey]) report('UNCERTAINTY', `${path}/${key}`, 'Mapping copy/edge contradicts its canonical question policy.');
    }
  });
}
