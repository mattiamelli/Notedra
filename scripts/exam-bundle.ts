import type {IPBundleChunk,IPBundleArtifact} from './ip-bundle';
import {isReleaseRobots} from './release-robots';
export function validateExamBundle(chunks:IPBundleChunk[],files:IPBundleArtifact[]){
 const map=new Map(chunks.map(c=>[c.file,c])),initial=new Set<string>(),reachable=new Set<string>();
 function walk(name:string,set:Set<string>,dynamic:boolean){if(set.has(name))return;const c=map.get(name);if(!c)throw Error('Missing exam bundle dependency');set.add(name);[...c.imports,...(dynamic?c.dynamicImports:[])].forEach(n=>walk(n,set,dynamic));}
 const entry=chunks.filter(c=>c.entry);if(entry.length!==1)throw Error('Expected one entry');walk(entry[0].file,initial,false);walk(entry[0].file,reachable,true);
 const owners:Record<string,string>={};
 for(const module of ['ExamsPage.tsx','ExamSessionPage.tsx','ExamReviewPage.tsx','ExamOpenAnswer.tsx','banks/co.json','banks/rl.json','banks/ip.json','references/co.json','references/rl.json','references/ip.json']){const matches=chunks.filter(c=>c.modules.some(m=>('/'+m.replaceAll('\\','/')).endsWith('/src/exams/'+module)));if(matches.length!==1||!reachable.has(matches[0].file))throw Error('Missing/unreachable exam payload '+module);if(initial.has(matches[0].file))throw Error('Eager exam payload '+module);owners[module]=matches[0].file;}
 for(const code of ['co','rl','ip'])if(owners['banks/'+code+'.json']===owners['references/'+code+'.json'])throw Error('Reference must remain lazy until review');
 if(new Set(['co','rl','ip'].map(c=>owners['banks/'+c+'.json'])).size!==3)throw Error('Course banks must be separate chunks');
 for(const c of chunks)for(const m of c.modules)if(/(?:^|\/)(scripts|tests|docs|content-pack)\//.test(m))throw Error('Development or source corpus bundled');
 for(const f of files)if((/\.(pdf|zip|txt)$/i.test(f.file)&&!isReleaseRobots(f))||/Handoff|exam-source-review|exam-content-lock/.test(f.file)||/^(%PDF-|PK\x03\x04)/.test(f.prefix))throw Error('Raw source artifact bundled');
 return {initial:[...initial],owners};
}
