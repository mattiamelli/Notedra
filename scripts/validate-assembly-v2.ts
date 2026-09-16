import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

interface Entry {id:string; source:string; section:string; feature:string; before:string; status:string; implementation:string|string[]; tests:string[];}
interface Manifest {version:string|number; sources:Array<{id:string; document:string; pages:number; revision:string}>; requirements:Entry[];}

const path=resolve('scripts/assembly-v2-coverage.json');
const manifest=JSON.parse(readFileSync(path,'utf8')) as Manifest;
const allowed=new Set(['SUPPORTED','EXTERNAL_TOOL','NOT_APPLICABLE']);
const failures:string[]=[];
if(!String(manifest.version).startsWith('2.'))failures.push('manifest version must be 2.x');
if(manifest.sources.length!==2)failures.push('exactly two owner-provided manuals must be recorded');
const ids=new Set<string>();
for(const item of manifest.requirements){
  if(ids.has(item.id))failures.push(`duplicate id ${item.id}`); else ids.add(item.id);
  if(!allowed.has(item.status))failures.push(`${item.id} has unresolved status ${item.status}`);
  if(!item.source||!item.section||!item.feature||!item.before||!item.implementation.length||!item.tests.length)failures.push(`${item.id} is missing traceability fields`);
}
for(const source of manifest.sources)if(source.pages<1||!source.revision||!source.id||!source.document)failures.push(`${source.id||'source'} is missing source metadata`);
if(failures.length)throw new Error(`Assembly V2 coverage validation failed:\n${failures.join('\n')}`);
const supported=manifest.requirements.filter(item=>item.status==='SUPPORTED').length;
const external=manifest.requirements.filter(item=>item.status==='EXTERNAL_TOOL').length;
const notApplicable=manifest.requirements.filter(item=>item.status==='NOT_APPLICABLE').length;
console.log(`Assembly V2 coverage: ${manifest.requirements.length} requirements (${supported} supported, ${external} external, ${notApplicable} not applicable).`);
