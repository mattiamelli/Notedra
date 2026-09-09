import { describe, expect, it } from 'vitest';
import { loadPackFiles, readDocuments } from '../scripts/content/manifest';
import { validateContentData, validateContentFiles } from '../scripts/content/validate';
import { EXPECTED_COUNTS, EXPECTED_RELATIONS, HANDOFF_FILE } from '../scripts/content/constants';
import { isUncertainMapping } from '../scripts/content/policies';
import type { ContentPack, Question } from '../scripts/content/types';

const files = loadPackFiles();
const documents = readDocuments(files);
const pack = documents.pack as ContentPack;
const schema = documents.schema;
const allQuestions = (data: ContentPack): Question[] => data.assessment_model.assessments.flatMap(a => a.question_map);
function rejects(mutate: (fixture: ContentPack) => void, expectedCode?: string) {
  const fixture = structuredClone(pack);
  mutate(fixture);
  const result = validateContentData(fixture,schema);
  expect(result.valid).toBe(false);
  expect(result.issues.length).toBeGreaterThan(0);
  expect(result.issues.some(issue => issue.code === 'VALIDATOR'), JSON.stringify(result.issues)).toBe(false);
  if (expectedCode) expect(result.issues.some(issue => issue.code === expectedCode),JSON.stringify(result.issues)).toBe(true);
}

describe('trusted Content Pack v1.0.1', () => {
  it('passes schema, exact counts, semantic integrity and all release checksums', () => {
    const result = validateContentFiles(files);
    expect(result.issues).toEqual([]);
    expect(result.valid).toBe(true);
    expect(result.counts).toEqual(EXPECTED_COUNTS);
    expect(result.relationCounts).toEqual(EXPECTED_RELATIONS);
    expect(result.checks).toContain('JSON Schema 2020-12');
  });
  it('preserves distinct uncertainty for mappings, source locators, and difficulty', () => {
    expect(allQuestions(pack).filter(isUncertainMapping)).toHaveLength(99);
    const component = allQuestions(pack).find(q => q.question_ref === 'IP_RESIT_2024_C1')!;
    expect(component.difficulty_components).toBe('UNVERIFIED');
    expect(isUncertainMapping(component)).toBe(false);
    expect(component.can_generate_variants).toBe(true);
  });
  it('rejects another JSON Schema dialect', () => {
    const result = validateContentData(pack,{...(schema as object),$schema:'http://json-schema.org/draft-07/schema#'});
    expect(result.valid).toBe(false);
    expect(result.issues[0].code).toBe('SCHEMA');
  });
  it('does not modify source objects or release bytes during validation', () => {
    const before = JSON.stringify(pack);
    const bytes = Buffer.from(files.get(HANDOFF_FILE)!);
    expect(validateContentFiles(files).valid).toBe(true);
    expect(JSON.stringify(pack)).toBe(before);
    expect(Buffer.from(files.get(HANDOFF_FILE)!).equals(bytes)).toBe(true);
  });
});

describe('negative canonical/schema fixtures', () => {
  it('rejects duplicate canonical IDs even when the objects are otherwise different', () => rejects(data => {
    data.taxonomy.topics[1].topic_id = data.taxonomy.topics[0].topic_id;
  },'DUPLICATE_ID'));
  it('rejects an invalid prerequisite reference', () => rejects(data => {
    data.taxonomy.topics[1].prerequisite_topic_ids = ['MISSING_TOPIC'];
  }));
  it('rejects an invalid confidence enum', () => rejects(data => {
    allQuestions(data)[0].mapping_confidence = 'CERTAIN_ENOUGH';
  },'SCHEMA'));
  it('rejects an exact duplicate relation edge without changing its count', () => rejects(data => {
    data.relations.question_to_topics[1] = structuredClone(data.relations.question_to_topics[0]);
  }));
  it('rejects duplicate edge endpoints with different metadata', () => rejects(data => {
    data.relations.topic_prerequisites[1] = {...data.relations.topic_prerequisites[0],confidence:'MEDIUM'};
  },'DUPLICATE_EDGE'));
  it('rejects an incorrect canonical count', () => rejects(data => {data.counts.documents_total = 91;}));
  it('rejects a missing document', () => rejects(data => {data.corpus.documents.pop();}));
  it('rejects an invalid subject', () => rejects(data => {data.taxonomy.topics[0].subject_id = 'MISSING_SUBJECT';}));
  it('rejects an invalid question type', () => rejects(data => {allQuestions(data)[0].question_type_ids = ['MISSING_TYPE'];}));
  it('rejects orphaned skill membership', () => rejects(data => {data.taxonomy.subtopics[0].skill_ids.pop();}));
  it('rejects an invalid assessment/document association', () => rejects(data => {
    data.assessment_model.assessments[0].document_id = data.corpus.documents[0].document_id;
  },'REFERENCE'));
  it('rejects a stale denormalized question relation', () => rejects(data => {
    data.relations.question_to_skills[0].exam_readiness_eligible = false;
  },'UNCERTAINTY'));
  it('rejects duplicate question IDs in the canonical question map', () => rejects(data => {
    const questions = allQuestions(data); questions[1].question_ref = questions[0].question_ref;
  },'DUPLICATE_ID'));
});

describe('prerequisite graph guardrails', () => {
  it('rejects a topic prerequisite cycle', () => rejects(data => {
    data.taxonomy.topics[0].prerequisite_topic_ids.push(data.taxonomy.topics[1].topic_id);
  },'CYCLE'));
  it('rejects a subtopic prerequisite cycle', () => rejects(data => {
    const [a,b] = data.taxonomy.subtopics; a.prerequisite_subtopic_ids.push(b.subtopic_id); b.prerequisite_subtopic_ids.push(a.subtopic_id);
  },'CYCLE'));
  it('rejects a skill prerequisite cycle', () => rejects(data => {
    const [a,b] = data.taxonomy.atomic_skills; a.prerequisite_skill_ids.push(b.skill_id); b.prerequisite_skill_ids.push(a.skill_id);
  },'CYCLE'));
  it('rejects an unpermitted cross-course prerequisite', () => rejects(data => {
    data.taxonomy.topics[0].prerequisite_topic_ids.push(data.taxonomy.topics.find(topic => topic.subject_id !== data.taxonomy.topics[0].subject_id)!.topic_id);
  },'CROSS_COURSE'));
});

describe('uncertain mapping safety', () => {
  it.each(['can_generate_variants','exam_readiness_eligible','historical_topic_frequency_eligible','historical_skill_frequency_eligible'] as const)('rejects promotion through %s', flag => rejects(data => {
    allQuestions(data).find(isUncertainMapping)![flag] = true;
  },'SCHEMA'));
  it('rejects individual skill credit for an uncertain mapping', () => rejects(data => {
    allQuestions(data).find(isUncertainMapping)!.skill_mastery_update_policy = 'UPDATE_ONLY_LISTED_SKILLS_AFTER_VALIDATED_ATTEMPT';
  },'SCHEMA'));
  it('rejects a source-template policy on an uncertain mapping', () => rejects(data => {
    allQuestions(data).find(isUncertainMapping)!.adaptive_use_policy = 'SOURCE_ANALOGUE_ALLOWED_NONVERBATIM';
  },'SCHEMA'));
  it('rejects LOW mapping confidence even if granularity was promoted', () => rejects(data => {
    const question = allQuestions(data).find(q => q.mapping_confidence === 'LOW')!;
    question.mapping_granularity = 'SKILL_LEVEL'; question.can_generate_variants = true;
  },'UNCERTAINTY'));
  it('rejects disabled safety contracts', () => rejects(data => {data.data_safety_contract.low_mapping_updates_mastery = true;},'POLICY'));
  it('preserves the distinction between PDF hashes and missing PDF binaries', () => rejects(data => {
    data.corpus.embedding_semantics.source_pdf_binaries_embedded_in_handoff = true;
  },'SCHEMA'));
});

describe('historical frequency counts documents, not question occurrences', () => {
  it('rejects inflated official counts', () => rejects(data => {
    data.taxonomy.topics[0].historical_frequency.observed_official_assessment_count++;
  },'FREQUENCY'));
  it('rejects by-assessment-type question-occurrence counts', () => rejects(data => {
    const topic = data.taxonomy.topics.find(item => {
      const occurrences = allQuestions(data).filter(q => q.topic_ids.includes(item.topic_id) && q.historical_topic_frequency_eligible && q.official_status === 'OFFICIAL_ASSESSMENT');
      return occurrences.length > new Set(occurrences.map(q => q.document_id)).size;
    })!;
    const official = allQuestions(data).filter(q => q.topic_ids.includes(topic.topic_id) && q.historical_topic_frequency_eligible && q.official_status === 'OFFICIAL_ASSESSMENT');
    topic.historical_frequency.by_assessment_type = Object.fromEntries([...new Set(official.map(q => q.assessment_type))].map(type => [type,official.filter(q => q.assessment_type === type).length]));
  },'FREQUENCY'));
  it('rejects practice/example leakage into verified official counts', () => rejects(data => {
    const question = allQuestions(data).find(q => q.official_status === 'OFFICIAL_PRACTICE_MATERIAL' && q.historical_topic_frequency_eligible)!;
    data.taxonomy.topics.find(topic => topic.topic_id === question.topic_ids[0])!.historical_frequency.observed_official_assessment_count++;
  },'FREQUENCY'));
  it('rejects an inflated skill historical count', () => rejects(data => {
    data.taxonomy.atomic_skills[0].historical_frequency.observed_official_assessment_count++;
  },'FREQUENCY'));
});

describe('manifest integrity without touching real release files', () => {
  it('rejects a mutated payload byte', () => {
    const fixture = new Map(files);
    fixture.set(HANDOFF_FILE,Buffer.concat([fixture.get(HANDOFF_FILE)!,Buffer.from(' ')]));
    const result = validateContentFiles(fixture);
    expect(result.valid).toBe(false);
    expect(result.issues.some(issue => issue.code === 'MANIFEST' && issue.message.includes('SHA-256'))).toBe(true);
  });
  it('rejects a tampered manifest even if payload checksums remain valid', () => {
    const fixture = new Map(files); fixture.set('manifest.json',Buffer.concat([fixture.get('manifest.json')!,Buffer.from(' ')]));
    expect(validateContentFiles(fixture).issues.some(issue => issue.message.includes('pinned'))).toBe(true);
  });
  it('rejects a missing file', () => {
    const fixture = new Map(files); fixture.delete('INSTRUCTIONS_FOR_CODEX.md');
    expect(validateContentFiles(fixture).valid).toBe(false);
  });
  it('rejects malformed JSON with an actionable error', () => {
    const fixture = new Map(files); fixture.set(HANDOFF_FILE,Buffer.from('{'));
    expect(validateContentFiles(fixture).issues.some(issue => issue.code === 'JSON')).toBe(true);
  });
});
