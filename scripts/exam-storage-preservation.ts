import lock from './step10-storage-lock.json';
/** Chained authorization for the one Step 10 Schema 3 migration. Step 9's lock stays historical. */
export function examStorageHash(file:string, previous:string):string {
  const entry=(lock as Record<string,{before:string;after:string}>)[file];
  if(!entry)return previous;
  if(!['src/learning/contracts.ts','src/learning/repository.ts','src/learning/StudentDataPanel.tsx'].includes(file)||entry.before!==previous)throw Error('Invalid exam storage migration chain: '+file);
  return entry.after;
}
