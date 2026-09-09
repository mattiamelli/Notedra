import { isDeepStrictEqual } from 'node:util';
import { isUncertainMapping } from './policies.ts';
import type { ContentPack, Question, ReportIssue } from './types.ts';

const uniqueDocuments = (questions: readonly Question[]): number => new Set(questions.map(q => q.document_id)).size;
export function checkFrequency(pack: ContentPack, report: ReportIssue): void {
  const questions = pack.assessment_model.assessments.flatMap(a => a.question_map);
  for (const kind of ['topics','atomic_skills'] as const) {
    for (const item of pack.taxonomy[kind]) {
      const isTopic = kind === 'topics';
      const id = (isTopic ? item.topic_id : item.skill_id) as string;
      const mapped = questions.filter(q => (isTopic ? q.topic_ids : q.skill_ids).includes(id));
      const eligible = mapped.filter(q => !isUncertainMapping(q) && (isTopic ? q.historical_topic_frequency_eligible : q.historical_skill_frequency_eligible));
      const official = eligible.filter(q => q.official_status === 'OFFICIAL_ASSESSMENT');
      const recent = official.filter(q => ['CURRENT','RECENT'].includes(q.evidence_era));
      const expected: Record<string,unknown> = {
        observed_official_assessment_count: uniqueDocuments(official),
        recent_or_current_verified_assessment_count: uniqueDocuments(recent),
      };
      if (isTopic) {
        expected.observed_official_assessment_count_including_low_confidence = uniqueDocuments(mapped.filter(q => q.official_status === 'OFFICIAL_ASSESSMENT'));
        expected.practice_or_example_assessment_count = uniqueDocuments(mapped.filter(q => q.official_status !== 'OFFICIAL_ASSESSMENT'));
        expected.low_or_unverified_assessment_count = uniqueDocuments(mapped.filter(q => isUncertainMapping(q) || !q.historical_topic_frequency_eligible));
        expected.by_assessment_type = Object.fromEntries([...new Set(official.map(q => q.assessment_type))].sort().map(type => [type,uniqueDocuments(official.filter(q => q.assessment_type === type))]));
      } else {
        // These two fields are explicitly reference counts, unlike assessment frequency.
        expected.eligible_question_reference_count = eligible.length;
        expected.all_mapped_reference_count = mapped.length;
      }
      for (const [key,value] of Object.entries(expected)) {
        const actual = item.historical_frequency[key as keyof typeof item.historical_frequency];
        if (!isDeepStrictEqual(actual,value)) report('FREQUENCY', `${id}/historical_frequency/${key}`, `Expected ${JSON.stringify(value)}, got ${JSON.stringify(actual)}. Assessment frequencies count unique eligible documents, never occurrences.`);
      }
    }
  }
}
