import { isStudyMode, studyModes } from '../topic-study/types';
import generated from '../generated/academic-index.json';
import type { AcademicIndex, AcademicTopic } from './types';

export const academicIndex: AcademicIndex = generated;
export interface SubjectPresentation {
  publicName: string;
  compactName: string;
  descriptionKey: 'course.cardCo' | 'course.cardRl' | 'course.cardIp';
}

const subjectPresentations: Record<string, SubjectPresentation> = {
  CSE1400_CO: {publicName: 'Computer Organisation', compactName: 'Organisation', descriptionKey: 'course.cardCo'},
  CSE1300_RL: {publicName: 'Logic', compactName: 'Logic', descriptionKey: 'course.cardRl'},
  CSE1100_IP: {publicName: 'Programming', compactName: 'Programming', descriptionKey: 'course.cardIp'},
};

export function subjectPresentation(subjectId: string): SubjectPresentation | undefined {
  return subjectPresentations[subjectId];
}

// Stable application paths and public presentation choices. Canonical academic records remain unchanged.
const courseRoutes = [
  {subject_id: 'CSE1400_CO', path: '/co', tone: 'mint', icon: 'cpu'},
  {subject_id: 'CSE1300_RL', path: '/rl', tone: 'violet', icon: 'logic'},
  {subject_id: 'CSE1100_IP', path: '/ip', tone: 'blue', icon: 'code'},
] as const;
export const courses = courseRoutes.map(route => {
  const subject = academicIndex.subjects.find(item => item.subject_id === route.subject_id);
  if (!subject) throw new Error(`Missing canonical course ${route.subject_id}.`);
  const presentation = subjectPresentation(route.subject_id);
  if (!presentation) throw new Error(`Missing public subject presentation ${route.subject_id}.`);
  return {...subject, ...presentation, name: presentation.publicName, short: presentation.compactName, code: presentation.compactName, ...route};
});
export type Course = typeof courses[number];
export const topicsFor = (subjectId: string) => academicIndex.topics.filter(topic => topic.subject_id === subjectId).sort((a, b) => a.order - b.order);
export function topicPath(topic: AcademicTopic): string {
  const course = courses.find(item => item.subject_id === topic.subject_id);
  if (!course) throw new Error(`Missing route for ${topic.subject_id}.`);
  return `${course.path}/${topic.topic_id}`;
}
export function resolveStudyRoute(pathname:string) {
  const path=pathname.replace(/\/+$/, '');
  for(const topic of academicIndex.topics){const base=topicPath(topic);if(path===base)return {topic,mode:'overview' as const};if(path.startsWith(base+'/')){const mode=path.slice(base.length+1);if(isStudyMode(mode))return {topic,mode};}}
  return undefined;
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
  {path: '/study-plan', title: 'Study Path', icon: 'calendar', purpose: 'Choose a next activity from exact local practice evidence.', emptyTitle: 'Study planning is not available yet', message: 'Planning study sessions will be available in a future update. You can browse the course topics now.'},
] as const;
export type ProductArea = typeof productAreas[number];
export interface Breadcrumb {label: string; to?: string;}
export function pageContext(pathname: string): {title: string; breadcrumbs: Breadcrumb[]} {
  if (pathname.startsWith('/exams/')) return {title:'Mock Exams',breadcrumbs:[{label:'Dashboard',to:'/dashboard'},{label:'Mock Exams',to:'/exams'},{label:pathname.includes('/review/')?'Saved review':pathname.includes('/sessions/')?'Exam session':pathname.endsWith('/history')?'History':'Setup'}]};
  if (pathname.startsWith('/practice/')) return {title: 'Practice', breadcrumbs: [{label:'Dashboard',to:'/dashboard'},{label:'Practice',to:'/practice'},{label:pathname.includes('/attempts/')?'Saved attempt':'Exercise'}]};
  const path = pathname.replace(/\/+$/, '') || '/';
  const dashboard = {label: 'Dashboard', to: '/dashboard'};
  if (path === '/' || path === '/dashboard') return {title: 'Dashboard', breadcrumbs: [{label: 'Dashboard'}]};
  const area = productAreas.find(item => item.path === path);
  if (area) return {title: area.title, breadcrumbs: [dashboard, {label: area.title}]};
  const course = courses.find(item => path === item.path || path.startsWith(`${item.path}/`));
  if (course) {
    if (path === course.path) return {title: course.name, breadcrumbs: [dashboard, {label: course.name}]};
    const study = resolveStudyRoute(path);
    const topic = study?.topic ?? (path === ASSEMBLY_TOOL_PATH ? assemblyTopic : undefined);
    if (topic) {
      const tool = path === ASSEMBLY_TOOL_PATH;
      if(study && study.mode !== 'overview'){const label=studyModes.find(m=>m.id===study.mode)!.label;return {title:`${label} · ${topic.name}`,breadcrumbs:[dashboard,{label:course.compactName,to:course.path},{label:topic.name,to:topicPath(topic)},{label}]};}
      return {title: tool ? 'Assembly Visualizer' : topic.name, breadcrumbs: [dashboard, {label: course.compactName, to: course.path}, {label: topic.name, to: tool ? topicPath(topic) : undefined}, ...(tool ? [{label: 'Assembly Visualizer'}] : [])]};
    }
  }
  return {title: 'Page not found', breadcrumbs: [dashboard, {label: 'Page not found'}]};
}
