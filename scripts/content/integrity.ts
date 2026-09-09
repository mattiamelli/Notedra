import { isDeepStrictEqual } from 'node:util';
import { EXPECTED_COUNTS, EXPECTED_RELATIONS } from './constants.ts';
import { sameSet, walkObjects, type ContentPack, type Entity, type Question, type ReportIssue } from './types.ts';

type Index = Map<string, Record<string, unknown>>;
export interface PackIndexes {
  subjects: Index; documents: Index; topics: Index; subtopics: Index; skills: Index;
  assessments: Index; questions: Map<string, Question>; questionTypes: Index;
  patterns: Index; errors: Index;
}
export function indexEntities(rows: readonly Record<string, unknown>[], key: string, namespace: string, report: ReportIssue): Index {
  const result: Index = new Map();
  for (const row of rows) {
    const id = row[key];
    if (typeof id !== 'string' || !id) { report('ID', namespace, `Missing ${key}.`); continue; }
    if (result.has(id)) report('DUPLICATE_ID', `${namespace}/${id}`, `Duplicate canonical ${key}.`);
    result.set(id, row);
  }
  return result;
}
export function buildIndexes(pack: ContentPack, report: ReportIssue): PackIndexes {
  const questions = pack.assessment_model.assessments.flatMap(assessment => assessment.question_map);
  const indexes = {
    subjects: indexEntities(pack.subjects, 'subject_id', 'subjects', report),
    documents: indexEntities(pack.corpus.documents, 'document_id', 'documents', report),
    topics: indexEntities(pack.taxonomy.topics, 'topic_id', 'topics', report),
    subtopics: indexEntities(pack.taxonomy.subtopics, 'subtopic_id', 'subtopics', report),
    skills: indexEntities(pack.taxonomy.atomic_skills, 'skill_id', 'skills', report),
    assessments: indexEntities(pack.assessment_model.assessments, 'assessment_id', 'assessments', report),
    questions: indexEntities(questions, 'question_ref', 'questions', report) as Map<string, Question>,
    questionTypes: indexEntities(pack.assessment_model.question_types, 'question_type_id', 'question_types', report),
    patterns: indexEntities(pack.assessment_model.course_exam_patterns, 'pattern_id', 'patterns', report),
    errors: indexEntities(pack.assessment_model.common_error_tags, 'error_tag', 'error_tags', report),
  };
  indexEntities(pack.assessment_model.official_signals, 'signal_id', 'official_signals', report);
  // Other IDs are scoped to their own canonical arrays, never merged across namespaces.
  walkObjects(pack, (object, path) => {
    for (const [key, value] of Object.entries(object)) {
      if (Array.isArray(value) && value.length && value.every(row => typeof row === 'object' && row !== null && !Array.isArray(row))) {
        for (const idKey of ['id', 'rule_id']) {
          if (value.every(row => typeof row[idKey] === 'string')) indexEntities(value, idKey, `${path}/${key}`, report);
        }
      }
    }
  });
  return indexes;
}
export function checkCounts(pack: ContentPack, report: ReportIssue): Record<string, unknown> {
  const subjects = Object.fromEntries(pack.subjects.map(subject => [subject.subject_id, pack.corpus.documents.filter(doc => doc.subject_id === subject.subject_id).length]));
  const actual = {
    documents_total: pack.corpus.documents.length, documents_by_subject: subjects,
    topics: pack.taxonomy.topics.length, subtopics: pack.taxonomy.subtopics.length,
    atomic_skills: pack.taxonomy.atomic_skills.length, assessments: pack.assessment_model.assessments.length,
    mapped_question_records: pack.assessment_model.assessments.reduce((sum, assessment) => sum + assessment.question_map.length, 0),
    question_types: pack.assessment_model.question_types.length, exam_patterns: pack.assessment_model.course_exam_patterns.length,
    common_error_tags: pack.assessment_model.common_error_tags.length,
  };
  for (const [key, expected] of Object.entries(EXPECTED_COUNTS)) {
    if (!isDeepStrictEqual(actual[key as keyof typeof actual], expected)) report('COUNT', `actual/${key}`, `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual[key as keyof typeof actual])}.`);
    if (!isDeepStrictEqual(pack.counts[key], expected)) report('COUNT', `counts/${key}`, `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(pack.counts[key])}.`);
  }
  return actual;
}
export function checkReferences(pack: ContentPack, indexes: PackIndexes, report: ReportIssue): void {
  const references: Record<string, Index> = {};
  const register = (index: Index, keys: string[]) => {for (const key of keys) references[key] = index;};
  register(indexes.subjects, ['subject_id']);
  register(indexes.documents, ['document_id', 'source_document_id']);
  register(indexes.topics, ['topic_id','topic_ids','main_topic_ids','prerequisite_topic_id','dependent_topic_id','prerequisite_topic_ids']);
  register(indexes.subtopics, ['subtopic_id','subtopic_ids','prerequisite_subtopic_ids']);
  register(indexes.skills, ['skill_id','skill_ids','prerequisite_skill_id','dependent_skill_id','prerequisite_skill_ids']);
  register(indexes.assessments, ['assessment_id']);
  register(indexes.questions, ['question_ref']);
  register(indexes.questionTypes, ['question_type_id','question_type_ids']);
  register(indexes.patterns, ['pattern_id']);
  register(indexes.errors, ['error_tag']);
  const filenames = new Set(pack.corpus.documents.map(doc => doc.filename));
  walkObjects(pack, (object, path) => {
    for (const [key, value] of Object.entries(object)) {
      const index = references[key];
      if (index) for (const reference of Array.isArray(value) ? value : [value]) {
        if (typeof reference !== 'string' || !index.has(reference)) report('REFERENCE', `${path}/${key}`, `Unknown reference ${JSON.stringify(reference)}.`);
      }
      if (key === 'source_document' || key === 'lecture_refs') for (const name of Array.isArray(value) ? value : [value]) {
        if (typeof name !== 'string' || !filenames.has(name)) report('REFERENCE', `${path}/${key}`, `Unknown source document ${JSON.stringify(name)}.`);
      }
    }
    if (typeof object.subject_id === 'string') {
      for (const key of ['topic_id','subtopic_id','skill_id','document_id','assessment_id']) {
        if (typeof object[key] === 'string') {
          const target = references[key].get(object[key]);
          if (target && target.subject_id !== object.subject_id) report('SUBJECT', `${path}/${key}`, 'Reference belongs to a different subject.');
        }
      }
    }
    if (typeof object.question_ref === 'string') {
      const question = indexes.questions.get(object.question_ref);
      if (question) for (const key of ['assessment_id','document_id','question_number','mapping_confidence','mapping_granularity','official_status','assessment_type','evidence_era','current_style_weight','exam_readiness_eligible']) {
        if (key in object && object[key] !== question[key]) report('REFERENCE', `${path}/${key}`, `Denormalized value differs from question ${question.question_ref}.`);
      }
    }
  });
  const verifySubject = (ids: string[], index: Index, subject: string, path: string) => {
    for (const id of ids) if (index.has(id) && index.get(id)?.subject_id !== subject) report('SUBJECT', path, `${id} belongs to a different course.`);
  };
  for (const assessment of pack.assessment_model.assessments) {
    const doc = indexes.documents.get(assessment.document_id);
    for (const key of ['official_status','evidence_era','current_style_weight']) if (doc && doc[key] !== assessment[key]) report('REFERENCE', `${assessment.assessment_id}/${key}`, 'Assessment differs from its document metadata.');
    for (const q of assessment.question_map) {
      if (q.assessment_id !== assessment.assessment_id || q.document_id !== assessment.document_id) report('REFERENCE', q.question_ref, 'Question does not match its containing assessment/document.');
      for (const key of ['assessment_type','official_status','evidence_era','current_style_weight']) if (q[key] !== assessment[key]) report('REFERENCE', `${q.question_ref}/${key}`, 'Question differs from its assessment metadata.');
      verifySubject(q.topic_ids, indexes.topics, assessment.subject_id, q.question_ref);
      verifySubject(q.skill_ids, indexes.skills, assessment.subject_id, q.question_ref);
    }
  }
  for (const topic of pack.taxonomy.topics) {
    const childIds = pack.taxonomy.subtopics.filter(child => child.topic_id === topic.topic_id).map(child => child.subtopic_id);
    if (!sameSet(topic.subtopic_ids, childIds)) report('RELATION', topic.topic_id, 'Topic/subtopic membership is inconsistent or duplicated.');
    if (!sameSet(topic.prerequisite_topic_ids, topic.prerequisite_information.topic_ids)) report('RELATION', topic.topic_id, 'Prerequisite fields disagree.');
  }
  for (const subtopic of pack.taxonomy.subtopics) {
    const childIds = pack.taxonomy.atomic_skills.filter(child => child.subtopic_id === subtopic.subtopic_id).map(child => child.skill_id);
    if (!sameSet(subtopic.skill_ids, childIds)) report('RELATION', subtopic.subtopic_id, 'Subtopic/skill membership is inconsistent or duplicated.');
  }
  for (const skill of pack.taxonomy.atomic_skills) {
    const parent = indexes.subtopics.get(skill.subtopic_id);
    if (!parent || parent.topic_id !== skill.topic_id || !Array.isArray(parent.skill_ids) || !parent.skill_ids.includes(skill.skill_id)) report('ORPHAN_SKILL', skill.skill_id, 'Skill is not attached to its declared subtopic and topic.');
    if (!sameSet(skill.prerequisite_skill_ids, skill.prerequisite_information.skill_ids)) report('RELATION', skill.skill_id, 'Prerequisite fields disagree.');
  }
  for (const entity of [...pack.taxonomy.topics, ...pack.taxonomy.atomic_skills]) {
    const isTopic = 'subtopic_ids' in entity;
    const id = isTopic ? entity.topic_id : entity.skill_id as string;
    const key = isTopic ? 'topic_ids' : 'skill_ids';
    const expected = [...indexes.questions.values()].filter(q => q[key].includes(id)).map(q => q.question_ref);
    if (!sameSet(entity.exam_references.map(ref => ref.question_ref), expected)) report('RELATION', `${id}/exam_references`, 'Question references do not exactly match canonical mappings.');
  }
}
const EDGE_KEYS: Record<string, string[]> = {
  topic_prerequisites: ['prerequisite_topic_id','dependent_topic_id'],
  skill_prerequisites: ['prerequisite_skill_id','dependent_skill_id'],
  topic_to_subtopics: ['topic_id','subtopic_id'], subtopic_to_skills: ['subtopic_id','skill_id'],
  document_to_topics: ['document_id','topic_id'], assessment_to_document: ['assessment_id','document_id'],
  question_to_topics: ['question_ref','topic_id'], question_to_skills: ['question_ref','skill_id'],
};
export function checkRelations(pack: ContentPack, report: ReportIssue): Record<string, number> {
  const expected: Record<string, string[]> = {};
  const edge = (...values: unknown[]) => JSON.stringify(values);
  expected.topic_prerequisites = pack.taxonomy.topics.flatMap(t => t.prerequisite_topic_ids.map(id => edge(id,t.topic_id)));
  expected.skill_prerequisites = pack.taxonomy.atomic_skills.flatMap(s => s.prerequisite_skill_ids.map(id => edge(id,s.skill_id)));
  expected.topic_to_subtopics = pack.taxonomy.subtopics.map(s => edge(s.topic_id,s.subtopic_id));
  expected.subtopic_to_skills = pack.taxonomy.atomic_skills.map(s => edge(s.subtopic_id,s.skill_id));
  expected.document_to_topics = pack.corpus.documents.flatMap(d => d.main_topic_ids.map(id => edge(d.document_id,id)));
  expected.assessment_to_document = pack.assessment_model.assessments.map(a => edge(a.assessment_id,a.document_id));
  const questions = pack.assessment_model.assessments.flatMap(a => a.question_map);
  expected.question_to_topics = questions.flatMap(q => q.topic_ids.map(id => edge(q.question_ref,id)));
  expected.question_to_skills = questions.flatMap(q => q.skill_ids.map(id => edge(q.question_ref,id)));
  const counts: Record<string,number> = {};
  for (const [name, keys] of Object.entries(EDGE_KEYS)) {
    const rows = pack.relations[name];
    counts[name] = rows.length;
    if (rows.length !== EXPECTED_RELATIONS[name]) report('COUNT', `relations/${name}`, `Expected ${EXPECTED_RELATIONS[name]}, got ${rows.length}.`);
    const actual = rows.map(row => edge(...keys.map(key => row[key])));
    if (new Set(actual).size !== actual.length) report('DUPLICATE_EDGE', name, 'Duplicate canonical relation endpoints (regardless of metadata).');
    if (!sameSet(actual, expected[name])) report('RELATION', name, 'Relation edges do not exactly match canonical records.');
  }
  return counts;
}
export function checkPrerequisites(pack: ContentPack, indexes: PackIndexes, report: ReportIssue): void {
  const graphs: [string, Entity[], string, string, Index][] = [
    ['topic',pack.taxonomy.topics,'topic_id','prerequisite_topic_ids',indexes.topics],
    ['subtopic',pack.taxonomy.subtopics,'subtopic_id','prerequisite_subtopic_ids',indexes.subtopics],
    ['skill',pack.taxonomy.atomic_skills,'skill_id','prerequisite_skill_ids',indexes.skills],
  ];
  for (const [kind, rows, idKey, prerequisiteKey, index] of graphs) {
    const graph = new Map<string,string[]>();
    for (const row of rows) {
      const id = row[idKey] as string;
      const prerequisites = row[prerequisiteKey] as string[];
      graph.set(id, prerequisites);
      if (new Set(prerequisites).size !== prerequisites.length) report('DUPLICATE_EDGE', id, 'Duplicate inline prerequisite.');
      for (const parentId of prerequisites) {
        const parent = index.get(parentId);
        if (!parent) report('REFERENCE', `${id}/${prerequisiteKey}`, `Unknown prerequisite ${parentId}.`);
        else if (parent.subject_id !== row.subject_id) report('CROSS_COURSE', id, `Prerequisite ${parentId} belongs to another course; v1.0.1 permits no cross-course prerequisites.`);
      }
    }
    const visiting = new Set<string>(); const visited = new Set<string>();
    const visit = (id: string, trail: string[]): void => {
      if (visiting.has(id)) {report('CYCLE', kind, [...trail,id].join(' -> ')); return;}
      if (visited.has(id)) return;
      visiting.add(id);
      for (const parent of graph.get(id) ?? []) visit(parent,[...trail,id]);
      visiting.delete(id); visited.add(id);
    };
    for (const id of graph.keys()) visit(id,[]);
  }
  // Relations have explicit subject fields as well as endpoint references.
  for (const [kind, index] of [['topic',indexes.topics],['skill',indexes.skills]] as const) {
    for (const row of pack.relations[`${kind}_prerequisites`]) {
      const parent = index.get(row[`prerequisite_${kind}_id`] as string);
      const child = index.get(row[`dependent_${kind}_id`] as string);
      if (parent && child && (parent.subject_id !== child.subject_id || parent.subject_id !== row.subject_id)) report('CROSS_COURSE', `${kind}_prerequisites`, 'Prerequisite edge has inconsistent course ownership.');
    }
  }
}
