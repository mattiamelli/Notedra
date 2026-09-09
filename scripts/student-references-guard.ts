import type { Plugin } from 'vite';
import { checkStudentReferences } from './student-references.ts';
export function studentReferencesGuard(): Plugin {
  return {name: 'delftstudy-student-references', apply: 'build', buildStart() { checkStudentReferences(); }};
}
