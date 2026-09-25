import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

export function curriculumBuildGuard() {
  return {name: 'curriculum-validation', apply: 'build' as const, buildStart() {
    execFileSync(process.execPath, ['--import', 'tsx', fileURLToPath(new URL('./generate-curriculum.ts', import.meta.url)), '--check'], {
      cwd: fileURLToPath(new URL('..', import.meta.url)), stdio: 'pipe',
    });
  }};
}
