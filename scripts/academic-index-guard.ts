import type { Plugin } from 'vite';
import { checkAcademicIndex } from './academic-index.ts';

export function academicIndexGuard(): Plugin {
  return {
    name: 'delftstudy-academic-index',
    apply: 'build',
    buildStart() {
      checkAcademicIndex();
      this.info('Academic navigation matches the trusted pack.');
    },
  };
}
