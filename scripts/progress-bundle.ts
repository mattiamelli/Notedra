import {validateExamBundle} from './exam-bundle';
import type {IPBundleChunk,IPBundleArtifact} from './ip-bundle';
export function validateProgressBundle(chunks:IPBundleChunk[],files:IPBundleArtifact[]){
 const existing=validateExamBundle(chunks,files),owners:Record<string,string>={};
 const reachable=new Set<string>();function visit(file:string){if(reachable.has(file))return;const c=chunks.find(c=>c.file===file);if(!c)throw Error('Missing progress dependency');reachable.add(file);[...c.imports,...c.dynamicImports].forEach(visit);}chunks.filter(c=>c.entry).forEach(c=>visit(c.file));
 for(const name of ['ProgressPage.tsx','ProgressSummary.tsx','mastery.ts','readiness.ts','evidence.ts','derive.ts']){
  const matches=chunks.filter(c=>c.modules.some(m=>('/'+m.replaceAll('\\','/')).endsWith('/src/progress/'+name)));
  if(matches.length!==1||!reachable.has(matches[0].file))throw Error('Missing progress module '+name);
  if(existing.initial.includes(matches[0].file))throw Error('Eager progress module '+name);
  owners[name]=matches[0].file;
 }
 return {initial:existing.initial,owners};
}
