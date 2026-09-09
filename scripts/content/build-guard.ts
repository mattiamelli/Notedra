import { fileURLToPath } from 'node:url';
import { normalizePath, type Plugin } from 'vite';
import { PACK_DIRECTORY } from './constants.ts';
import { validateContentPack } from './validate.ts';
import type { ValidationReport } from './types.ts';

const developmentDirectories = [
  normalizePath(fileURLToPath(new URL('../', PACK_DIRECTORY))),
  normalizePath(fileURLToPath(new URL('../', import.meta.url))),
];

export function contentBuildGuard(validate: () => ValidationReport = validateContentPack): Plugin {
  return {
    name: 'delftstudy-trusted-content',
    apply: 'build',
    enforce: 'pre',
    buildStart() {
      const report = validate();
      if (!report.valid) {
        this.error(`Content Pack v1.0.1 validation failed:\n${report.issues.map(issue => `[${issue.code}] ${issue.path}: ${issue.message}`).join('\n')}`);
      }
      this.info('Content Pack v1.0.1: integrity verified.');
    },
    load(id) {
      const path = normalizePath(id.split('?')[0]);
      if (developmentDirectories.some(directory => path.startsWith(directory))) {
        this.error('Academic Content Pack and validation tooling are development-only; browser imports are not allowed in Step 1.');
      }
    },
  };
}
