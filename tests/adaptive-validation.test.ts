import {it,expect} from 'vitest';
import {validateAdaptive,validateMistakes} from '../scripts/mistake-adaptive-validation';
import {validateAdaptiveBundle} from '../scripts/adaptive-bundle';
import {storageMigrationHash} from '../scripts/storage-migration-preservation';
import type {IPBundleChunk} from '../scripts/ip-bundle';
import actions from '../src/adaptive/actions.json';
it('dedicated gates validate migration versions, all 107 bindings and canonical action projection',()=>{expect(validateMistakes()).toEqual({schema:3,db:3,atomicItems:107});expect(validateAdaptive().skills).toBe(147);});
it.each(['skillIds','topicId','subjectId','id','minutes','to','kind'])('rejects corrupted %s in the action projection',field=>{const bad=structuredClone(actions);Object.assign(bad[0],{[field]:'unsupported'});expect(()=>validateAdaptive(bad)).toThrow();});
it('rejects missing, duplicate and reordered action records',()=>{expect(()=>validateAdaptive(actions.slice(1))).toThrow();expect(()=>validateAdaptive([...actions,actions[0]])).toThrow();expect(()=>validateAdaptive([...actions].reverse())).toThrow();});
it('storage exceptions bind exact original bytes and never exempt unrelated files',()=>{expect(storageMigrationHash('src/engine/cpu.ts','original')).toBe('original');expect(()=>storageMigrationHash('src/learning/contracts.ts','wrong')).toThrow('Invalid storage migration baseline');});
function graph():IPBundleChunk[]{return [{file:'entry.js',modules:['/src/App.tsx','/src/adaptive/SummaryLoader.tsx'],imports:[],dynamicImports:['mistakes.js','path.js'],entry:true},{file:'mistakes.js',modules:['/src/adaptive/MistakesPage.tsx','/src/adaptive/evidence.ts'],imports:[],dynamicImports:[],entry:false},{file:'path.js',modules:['/src/adaptive/StudyPathPage.tsx','/src/adaptive/engine.ts','/src/adaptive/actions.json'],imports:['mistakes.js'],dynamicImports:[],entry:false}];}
it('accepts lazy route/engine boundaries',()=>expect(validateAdaptiveBundle(graph(),[]).initial).toEqual(['entry.js']));
it.each(['MistakesPage.tsx','StudyPathPage.tsx','engine.ts','evidence.ts','actions.json'])('rejects eager %s',name=>{const chunks=graph(),owner=chunks.find(c=>c.modules.includes('/src/adaptive/'+name))!;chunks[0].imports.push(owner.file);expect(()=>validateAdaptiveBundle(chunks,[])).toThrow('Eager');});
it.each(['/scripts/validate-adaptive.ts','/tests/migration.ts','/docs/report.json','/content-pack/full.json'])('rejects bundled development module %s',module=>{const chunks=graph();chunks[1].modules.push(module);expect(()=>validateAdaptiveBundle(chunks,[])).toThrow('Development');});
it.each([{file:'source.pdf',prefix:''},{file:'source.zip',prefix:''},{file:'Handoff.json',prefix:''},{file:'innocent.bin',prefix:'%PDF-1.7'}])('rejects raw artifact $file',file=>expect(()=>validateAdaptiveBundle(graph(),[file])).toThrow('Raw source'));
