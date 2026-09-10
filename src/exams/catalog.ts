import type {ExamBank, ExamCourse} from './types';
const loaders = {
  CSE1400_CO: () => import('./banks/co.json'),
  CSE1300_RL: () => import('./banks/rl.json'),
  CSE1100_IP: () => import('./banks/ip.json'),
};
export async function loadExamBank(course: ExamCourse): Promise<ExamBank> {return (await loaders[course]()).default as ExamBank;}
export const examCourse = (value: string | undefined): ExamCourse | null => value && Object.hasOwn(loaders,value) ? value as ExamCourse : null;
