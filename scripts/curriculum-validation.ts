import type {CurriculumCourse} from '../src/curriculum/types';

const expected = ['CSE12A_CALC', 'CSE12B_HCIAP', 'CSE12C_DM', 'CSE13A_LA', 'CSE13B_SDE', 'CSE13C_ADS', 'CSE14A_PTS', 'CSE14B_CN'];
function requireThat(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Curriculum: ${message}`);
}
export function validateCurriculum(courses: CurriculumCourse[]) {
  requireThat(courses.length === expected.length && expected.every(id => courses.some(course => course.id === id)), 'exactly the eight supplied courses are required');
  const ids = new Set<string>();
  const identity = (id: string) => {
    requireThat(typeof id === 'string' && id.length > 0 && id.length <= 160 && !ids.has(id), `duplicate or invalid identity ${id}`);
    ids.add(id);
  };
  const text = (value: unknown, label: string) => requireThat(typeof value === 'string' && value.trim().length > 0, `missing ${label}`);
  for (const course of courses) {
    identity(course.id);
    requireThat(course.trimester === (course.code.startsWith('CSE12') ? 2 : course.code.startsWith('CSE13') ? 3 : 4), `${course.id} trimester`);
    for (const value of [course.name, course.short, course.description, course.slug]) text(value, course.id);
    requireThat(course.topics.length >= 6 && course.sources.length > 0, `${course.id} missing scope or sources`);
    const sources = new Set(course.sources.map(source => source.id));
    for (const source of course.sources) {
      identity(source.id); text(source.filename, 'source filename'); text(source.locator, 'source locator');
      requireThat(!source.filename.startsWith('/') && !source.filename.includes('/Users/'), 'no private filesystem paths in published content');
    }
    const checkSources = (refs: string[]) => requireThat(Array.isArray(refs) && refs.length > 0 && new Set(refs).size === refs.length && refs.every(id => sources.has(id)), `${course.id} unresolved source`);
    const topicIds = new Set(course.topics.map(topic => topic.id));
    const prompts = new Set<string>();
    for (const topic of course.topics) {
      identity(topic.id); text(topic.name, 'topic name'); text(topic.description, 'topic description'); checkSources(topic.sourceIds);
      requireThat(topic.prerequisites.every(id => topicIds.has(id) && id !== topic.id), `${topic.id} invalid prerequisite`);
      requireThat(topic.skills.length > 0 && topic.lesson.length >= 2 && topic.exercises.length >= 3, `${topic.id} incomplete learning loop`);
      const skillIds = new Set(topic.skills.map(skill => skill.id));
      for (const skill of topic.skills) {
        identity(skill.id); text(skill.name, 'skill name'); text(skill.description, 'skill explanation');
        requireThat(topic.exercises.some(exercise => exercise.skillId === skill.id), `${skill.id} has no practice`);
      }
      for (const block of topic.lesson) {
        text(block.title, 'lesson title'); requireThat(block.paragraphs.length > 0, 'empty lesson block');
        block.paragraphs.forEach(paragraph => text(paragraph, 'lesson paragraph'));
      }
      for (const exercise of topic.exercises) {
        identity(exercise.id); text(exercise.title, 'exercise title'); text(exercise.prompt, 'exercise prompt'); text(exercise.explanation, 'exercise explanation');
        requireThat(!prompts.has(exercise.prompt), `${exercise.id} duplicated prompt`); prompts.add(exercise.prompt);
        checkSources(exercise.sourceIds); requireThat(skillIds.has(exercise.skillId), `${exercise.id} skill ownership`);
        if (exercise.kind === 'open') {
          requireThat(exercise.answer === undefined && exercise.rubric && exercise.rubric.length > 0, `${exercise.id} open response must have a rubric, not an objective answer`);
          exercise.rubric.forEach(criterion => text(criterion, 'rubric criterion'));
        } else if (exercise.kind === 'integer') {
          requireThat(typeof exercise.answer === 'string' && /^-?\d{1,12}$/.test(exercise.answer), `${exercise.id} integer reference`);
        } else {
          requireThat(exercise.kind === 'choice' && exercise.options && exercise.options.length >= 2, `${exercise.id} unsupported response`);
          const options = exercise.options;
          requireThat(new Set(options.map(option => option.id)).size === options.length && new Set(options.map(option => option.text)).size === options.length, `${exercise.id} duplicate options`);
          options.forEach(option => {text(option.id, 'option identity'); text(option.text, 'option text');});
          requireThat(options.some(option => option.id === exercise.answer), `${exercise.id} invalid reference option`);
        }
      }
    }
    const visit = (id: string, path: Set<string>) => {
      requireThat(!path.has(id), `${course.id} cyclic prerequisites`);
      const next = new Set(path).add(id);
      course.topics.find(topic => topic.id === id)!.prerequisites.forEach(prerequisite => visit(prerequisite, next));
    };
    course.topics.forEach(topic => visit(topic.id, new Set()));
  }
  return {courses: courses.length, topics: courses.reduce((sum, course) => sum + course.topics.length, 0),
    skills: courses.flatMap(course => course.topics).reduce((sum, topic) => sum + topic.skills.length, 0),
    exercises: courses.flatMap(course => course.topics).reduce((sum, topic) => sum + topic.exercises.length, 0)};
}
