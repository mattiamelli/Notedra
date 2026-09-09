import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { catalog, versionBinding } from '../src/practice/catalog';
import { describe, expect, it } from 'vitest';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from 'vite';
import data from '../src/practice/catalog.json';
import lock from '../src/practice/catalog-lock.json';
import graderLock from '../src/practice/grader-lock.json';
import { validateCatalog } from '../src/practice/validation';
import { validatePracticeData, validatePracticeFiles, validateGraderSource, practiceBuildGuard } from '../scripts/practice-catalog';
import { loadPackFiles, readDocuments } from '../scripts/content/manifest';
import type { ContentPack } from '../scripts/content/types';
const pack = readDocuments(loadPackFiles()).pack as ContentPack;
describe('six authored practice definitions', () => {
  it('validates six items, exact ownership, sources and immutable fingerprints', () => { expect(()=>validatePracticeFiles()).not.toThrow(); expect(data).toHaveLength(6); });
  it.each(['duplicate','ownership','source','answer','formula','row order','grader','oversized'] as const)('rejects %s catalog mutations', kind => {
    const changed = structuredClone(data);
    if(kind==='duplicate') changed[1].id=changed[0].id;
    if(kind==='ownership') changed[0].subjectId='CSE1100_IP';
    if(kind==='source') Object.assign(changed[0].source,{kind:'ASSESSMENT',mappingConfidence:'LOW'});
    if(kind==='answer') changed[0].reference.value='11111111';
    if(kind==='formula') changed[2].prompt='An unrelated formula';
    if(kind==='row order') changed[2].task.rows?.reverse();
    if(kind==='grader') changed[0].grader.version='99';
    if(kind==='oversized') changed[0].task.width=65;
    expect(()=>validateCatalog(changed)).toThrow('Practice catalog:');
  });
  it('refuses changed content under a published version even when structurally valid', () => {
    const changed=structuredClone(data);changed[0].title='Different wording';expect(()=>validatePracticeData(changed,lock,pack)).toThrow('Immutable practice version changed');
  });
  it('rejects source provenance changes even with a matching exercise lock', () => {
    const changedPack=structuredClone(pack);const skill=changedPack.taxonomy.atomic_skills.find(s=>s.skill_id==='CO_SK04_01_RADIX_CONVERT')!;
    skill.lecture_references=[];expect(()=>validatePracticeData(data,lock,changedPack)).toThrow('lecture provenance');
  });
  it('review regression: instance binding locks executable grader content, not only its version label', () => {
    const digest=createHash('sha256').update(readFileSync(new URL('../src/practice/grading.ts',import.meta.url))).digest('hex');
    expect(versionBinding(catalog[0])).toContain(digest);
    expect(versionBinding(catalog[0]).length).toBeLessThanOrEqual(200);
  });
  it('rejects modified executable grader content with an unchanged lock', () => {
    const source=readFileSync(new URL('../src/practice/grading.ts',import.meta.url),'utf8');
    expect(()=>validateGraderSource(source+'\n// changed',graderLock)).toThrow('Immutable grader implementation changed');
  });
  it('blocks direct production builds when practice validation fails', async () => {
    const root=await mkdtemp(join(tmpdir(),'ds-practice-build-')); const entry=join(root,'entry.js');await writeFile(entry,'console.log("isolated gate test");');
    try { await expect(build({root,configFile:false,logLevel:'silent',plugins:[practiceBuildGuard(()=>{throw new Error('Practice version lock failed');})],build:{write:false,rollupOptions:{input:entry}}})).rejects.toThrow('Practice version lock failed'); }
    finally { await rm(root,{recursive:true,force:true}); }
  });
});
