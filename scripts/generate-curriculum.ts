import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {curriculumCourses} from '../src/curriculum/registry';
import {validateCurriculum} from './curriculum-validation';
import {writeAcademicIndex} from './academic-index';

const counts = validateCurriculum(curriculumCourses);
const inventory = JSON.parse(readFileSync(new URL('../docs/curriculum-source-inventory.json', import.meta.url), 'utf8')) as {
  courses: {id: string; files: {path: string; bytes: number; sha256: string}[]}[];
};
for (const course of curriculumCourses) {
  const files = inventory.courses.find(item => item.id === course.id)?.files;
  if (!files?.length) throw new Error(`Missing source inventory for ${course.id}`);
  for (const source of course.sources) {
    const matches = files.filter(file => file.path === source.filename || file.path.endsWith('/' + source.filename));
    if (!matches.length || new Set(matches.map(file => file.sha256)).size !== 1) throw new Error(`Missing or ambiguous source: ${course.id}/${source.id}`);
  }
}
const digest = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
const metadata = curriculumCourses.map(({topics, sources: _sources, ...course}) => ({...course,
  topics: topics.map(({id, name, skills}) => ({id, name, skills: skills.map(skill => ({id: skill.id}))})),
}));
const bindings = {
  graderSha256: digest(Buffer.concat([readFileSync(new URL('../src/curriculum/grading.ts', import.meta.url)), Buffer.from('\0'), readFileSync(new URL('../src/curriculum/practice.ts', import.meta.url))])),
  exercises: Object.fromEntries(curriculumCourses.flatMap(course => course.topics.flatMap(topic =>
    topic.exercises.map(exercise => [exercise.id, digest(JSON.stringify({courseId: course.id, topicId: topic.id,
      sources: exercise.sourceIds.map(id => course.sources.find(source => source.id === id)), exercise}))]),
  ))),
};
for (const [filename, value] of [['curriculum-metadata.json', metadata], ['curriculum-bindings.json', bindings]] as const) {
  const path = fileURLToPath(new URL(`../src/generated/${filename}`, import.meta.url));
  const serialized = JSON.stringify(value) + '\n';
  if (process.argv.includes('--check')) {
    if (readFileSync(path, 'utf8') !== serialized) throw new Error(`${filename} is stale; run generate:curriculum.`);
  } else writeAcademicIndex(serialized, path);
}
console.log('Curriculum validation: PASS', counts);
