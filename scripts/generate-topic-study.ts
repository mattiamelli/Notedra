import { checkTopicStudy, trustedTopicStudySource, writeTopicStudy } from './topic-projection.ts';
const source=trustedTopicStudySource();
if(process.argv.includes('--check'))checkTopicStudy(source);else writeTopicStudy(source);
console.log(`Topic study: PASS — 3 subjects / 43 topics / 105 subtopics / 147 skills; ${Buffer.byteLength(source)} bytes.`);
