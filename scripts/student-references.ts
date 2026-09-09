import { fileURLToPath } from 'node:url';
import { checkAcademicIndex, writeAcademicIndex } from './academic-index.ts';
import { HANDOFF_FILE, PACK_VERSION } from './content/constants.ts';
import { loadPackFiles, readDocuments, sha256 } from './content/manifest.ts';
import type { ContentPack } from './content/types.ts';
import { validateContentFiles } from './content/validate.ts';

export const STUDENT_REFERENCES_PATH = fileURLToPath(new URL('../src/generated/student-references.json', import.meta.url));
const sort = <T extends {id: string}>(rows: T[]): T[] => rows.sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
export function projectStudentReferences(pack: ContentPack, fingerprint: string) {
  return {
    content: {version: PACK_VERSION, fingerprint},
    subjects: pack.subjects.map(row => row.subject_id).sort(),
    topics: sort(pack.taxonomy.topics.map(row => ({id: row.topic_id, subject: row.subject_id}))),
    subtopics: sort(pack.taxonomy.subtopics.map(row => ({id: row.subtopic_id, topic: row.topic_id}))),
    skills: sort(pack.taxonomy.atomic_skills.map(row => ({id: row.skill_id, subtopic: row.subtopic_id}))),
    // Source locators are validated, but ALL raw attempts remain ineligible for derived evidence.
    questions: sort(pack.assessment_model.assessments.flatMap(assessment => assessment.question_map.map(row => ({
      id: `${assessment.assessment_id}/${row.question_ref}`, subject: assessment.subject_id, topics: [...row.topic_ids].sort(),
    })))),
  };
}
export function trustedStudentReferencesSource() {
  const files = loadPackFiles();
  const report = validateContentFiles(files);
  if (!report.valid) throw new Error('Cannot generate student references from invalid academic content.');
  const {pack} = readDocuments(files);
  const output = JSON.stringify(projectStudentReferences(pack as ContentPack, sha256(files.get(HANDOFF_FILE)!))) + '\n';
  if (Buffer.byteLength(output) > 100_000) throw new Error('Student reference projection exceeds 100 KB budget.');
  return output;
}
export function checkStudentReferences(source = trustedStudentReferencesSource()) {
  checkAcademicIndex(source, STUDENT_REFERENCES_PATH);
}
export function writeStudentReferences(source: string) { writeAcademicIndex(source, STUDENT_REFERENCES_PATH); }
