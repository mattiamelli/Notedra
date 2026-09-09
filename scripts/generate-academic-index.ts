import { checkAcademicIndex, trustedAcademicIndexSource, writeAcademicIndex } from './academic-index.ts';

try {
  const source = trustedAcademicIndexSource();
  if (process.argv.includes('--check')) checkAcademicIndex(source);
  else writeAcademicIndex(source);
  console.log(`Academic navigation: PASS — 3 subjects, 43 topics, ${Buffer.byteLength(source)} bytes.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
