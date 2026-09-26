import {examStorageHash} from './exam-storage-preservation';
import {hardeningHash} from './hardening-preservation';
import lock from './step9-storage-lock.json';
import cloudDependency from './cloud-dependency-lock.json';
import launchDependency from './launch-dependency-lock.json';
import analyticsDependency from './analytics-dependency-lock.json';
import securityDependency from './security-dependency-lock.json';
import examMathDependency from './exam-math-dependency-lock.json';
/** Step 9 explicitly authorizes only these storage files to move from the protected v1 bytes. */
export function storageMigrationHash(file: string, original: string): string {
  // Step 12 adds only the pinned Supabase client closure. Existing dependencies are unchanged.
  if(file==='pnpm-lock.yaml') {
    if(original!==cloudDependency.before)throw Error('Unrecognized dependency baseline');
    if(launchDependency.before!==cloudDependency.after)throw Error('Invalid launch dependency baseline');
    if(analyticsDependency.before!==launchDependency.after)throw Error('Invalid analytics dependency baseline');
    if(securityDependency.before!==analyticsDependency.after)throw Error('Invalid security dependency baseline');
    if(examMathDependency.before!==securityDependency.after)throw Error('Invalid exam math dependency baseline');
    return examMathDependency.after;
  }
  const record = (lock as Record<string, {before: string; after: string}>)[file];
  if (!record) return hardeningHash(file, original);
  if (!['src/learning/contracts.ts', 'src/learning/repository.ts', 'src/learning/StudentDataPanel.tsx'].includes(file) || record.before !== original) throw new Error('Invalid storage migration baseline: ' + file);
  return examStorageHash(file, record.after);
}
