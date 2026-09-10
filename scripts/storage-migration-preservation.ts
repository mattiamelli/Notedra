import {examStorageHash} from './exam-storage-preservation';
import lock from './step9-storage-lock.json';
/** Step 9 explicitly authorizes only these storage files to move from the protected v1 bytes. */
export function storageMigrationHash(file: string, original: string): string {
  const record = (lock as Record<string, {before: string; after: string}>)[file];
  if (!record) return original;
  if (!['src/learning/contracts.ts', 'src/learning/repository.ts', 'src/learning/StudentDataPanel.tsx'].includes(file) || record.before !== original) throw new Error('Invalid storage migration baseline: ' + file);
  return examStorageHash(file, record.after);
}
