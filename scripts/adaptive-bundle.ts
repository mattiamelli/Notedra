import type {IPBundleChunk,IPBundleArtifact} from './ip-bundle';
import {isReleaseRobots} from './release-robots';
export function validateAdaptiveBundle(chunks:IPBundleChunk[],files:IPBundleArtifact[]){
 const byName=new Map(chunks.map(c=>[c.file,c]));const initial=new Set<string>();
 function visit(name:string){if(initial.has(name))return;const chunk=byName.get(name);if(!chunk)throw new Error('Missing initial chunk');initial.add(name);chunk.imports.forEach(visit);}
 const entries=chunks.filter(c=>c.entry);if(entries.length!==1)throw new Error('Expected one application entry');visit(entries[0].file);
 const reachable=new Set<string>();
 function reach(name:string){if(reachable.has(name))return;const chunk=byName.get(name);if(!chunk)throw new Error('Missing reachable chunk');reachable.add(name);[...chunk.imports,...chunk.dynamicImports].forEach(reach);}
 reach(entries[0].file);
 const owners:Record<string,string>={};
 for(const file of ['MistakesPage.tsx','StudyPathPage.tsx','engine.ts','evidence.ts','actions.json']){
  const matches=chunks.filter(c=>c.modules.some(m=>('/'+m.replaceAll('\\','/')).endsWith('/src/adaptive/'+file)));if(matches.length!==1)throw new Error('Missing or duplicate adaptive module '+file);
  if(!reachable.has(matches[0].file))throw new Error('Unreachable adaptive payload '+file);
  if(initial.has(matches[0].file))throw new Error('Eager adaptive payload '+file);owners[file]=matches[0].file;
 }
 for(const chunk of chunks)for(const module of chunk.modules){if(/(?:^|\/)(scripts|docs|tests|content-pack)\//.test(module))throw new Error('Development data bundled');if(initial.has(chunk.file)&&/(?:^|\/)src\/adaptive\//.test(module)&&!module.endsWith('/SummaryLoader.tsx'))throw new Error('Eager adaptive implementation');}
 for(const file of files)if((/\.(pdf|zip|txt)$/i.test(file.file)&&!isReleaseRobots(file))||/Handoff|migration-scenarios|mistake-adaptive-status/.test(file.file)||/^(%PDF-|PK\x03\x04)/.test(file.prefix))throw new Error('Raw source in production');
 return {initial:[...initial],owners};
}
