import generated from '../generated/academic-index.json';
import type { AcademicIndex, AcademicTopic } from './types';

export const academicIndex: AcademicIndex = generated;
// Stable application paths and presentation choices only; academic labels come from the generated index.
const courseRoutes = [
  {subject_id: 'CSE1400_CO', path: '/co', tone: 'mint', icon: 'cpu'},
  {subject_id: 'CSE1300_RL', path: '/rl', tone: 'violet', icon: 'logic'},
  {subject_id: 'CSE1100_IP', path: '/ip', tone: 'blue', icon: 'code'},
] as const;
export const courses = courseRoutes.map(route => {
  const subject = academicIndex.subjects.find(item => item.subject_id === route.subject_id);
  if (!subject) throw new Error(`Missing canonical course ${route.subject_id}.`);
  return {...subject, ...route};
});
export type Course = typeof courses[number];
export const topicsFor = (subjectId: string) => academicIndex.topics.filter(topic => topic.subject_id === subjectId).sort((a, b) => a.order - b.order);
export function topicPath(topic: AcademicTopic): string {
  const course = courses.find(item => item.subject_id === topic.subject_id);
  if (!course) throw new Error(`Missing route for ${topic.subject_id}.`);
  return `${course.path}/${topic.topic_id}`;
}
export const ASSEMBLY_TOPIC_ID = 'CO_T06_ASSEMBLY_X86_64';
export const assemblyTopic = academicIndex.topics.find(topic => topic.topic_id === ASSEMBLY_TOPIC_ID && topic.subject_id === 'CSE1400_CO')!;
export const ASSEMBLY_TOPIC_PATH = topicPath(assemblyTopic);
export const ASSEMBLY_TOOL_PATH = `${ASSEMBLY_TOPIC_PATH}/visualizer`;
export const productAreas = [
  {path: '/practice', title: 'Practice', icon: 'practice', purpose: 'Work through exercises by course and topic.', emptyTitle: 'Practice is not available yet', message: 'Topic exercises will appear here when the practice tools are ready.'},
  {path: '/exams', title: 'Mock Exams', icon: 'exam', purpose: 'Bring topics together in an exam-style session.', emptyTitle: 'Mock exams are not available yet', message: 'Timed sessions and exam-style questions will be available in a future update.'},
  {path: '/progress', title: 'Progress', icon: 'progress', purpose: 'Understand your learning through evidence from your work.', emptyTitle: 'Progress tracking is not available yet', message: 'Learning progress will appear here once activity tracking is available. No learning scores are calculated yet.'},
  {path: '/mistakes', title: 'Mistakes', icon: 'mistakes', purpose: 'Return to mistakes and work through them again.', emptyTitle: 'Mistake review is not available yet', message: 'This space will help you revisit mistakes once practice attempts can be recorded.'},
  {path: '/study-plan', title: 'Study Planner', icon: 'calendar', purpose: 'Organise what to study and when.', emptyTitle: 'Study planning is not available yet', message: 'Planning study sessions will be available in a future update. You can browse the course topics now.'},
] as const;
export type ProductArea = typeof productAreas[number];
export interface Breadcrumb {label: string; to?: string;}
export function pageContext(pathname: string): {title: string; breadcrumbs: Breadcrumb[]} {
  const path = pathname.replace(/\/+$/, '') || '/';
  const dashboard = {label: 'Dashboard', to: '/'};
  if (path === '/' || path === '/dashboard') return {title: 'Dashboard', breadcrumbs: [{label: 'Dashboard'}]};
  const area = productAreas.find(item => item.path === path);
  if (area) return {title: area.title, breadcrumbs: [dashboard, {label: area.title}]};
  const course = courses.find(item => path === item.path || path.startsWith(`${item.path}/`));
  if (course) {
    if (path === course.path) return {title: course.name, breadcrumbs: [dashboard, {label: course.name}]};
    const topic = topicsFor(course.subject_id).find(item => path === topicPath(item) || (item.topic_id === ASSEMBLY_TOPIC_ID && path === ASSEMBLY_TOOL_PATH));
    if (topic) {
      const tool = path === ASSEMBLY_TOOL_PATH;
      return {title: tool ? 'Assembly Visualizer' : topic.name, breadcrumbs: [dashboard, {label: course.short, to: course.path}, {label: topic.name, to: tool ? topicPath(topic) : undefined}, ...(tool ? [{label: 'Assembly Visualizer'}] : [])]};
    }
  }
  return {title: 'Page not found', breadcrumbs: [dashboard, {label: 'Page not found'}]};
}
