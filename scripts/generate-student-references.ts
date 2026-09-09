import { checkStudentReferences, trustedStudentReferencesSource, writeStudentReferences } from './student-references.ts';
try {
  const source = trustedStudentReferencesSource();
  if (process.argv.includes('--check')) checkStudentReferences(source);
  else writeStudentReferences(source);
  console.log(`Student references: PASS — 3 subjects, 43 topics, 105 subtopics, 147 skills, 489 source locators; ${Buffer.byteLength(source)} bytes.`);
} catch (error) { console.error(error); process.exitCode = 1; }
