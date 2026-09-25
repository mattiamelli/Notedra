import { describe,it,expect } from 'vitest';
import { mkdtemp,rm,writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from 'vite';
import { validateTopicContent,checkContentLocks,validateTopicFiles,topicStudyGuard } from '../scripts/topic-content';
import lessons from '../src/topic-study/lessons.json';
import flashcards from '../src/topic-study/flashcards.json';
import topicStudy from '../src/generated/topic-study.json';
import locks from '../src/topic-study/content-lock.json';
import type { Flashcard,Lesson } from '../src/topic-study/types';
const fresh=()=>({ls:structuredClone(lessons),cs:structuredClone(flashcards)});
describe('versioned topic lessons and cards',()=>{
 it('validates three complete lessons, all skill coverage and exactly eight cards each',()=>{
  expect(()=>validateTopicFiles()).not.toThrow();expect(lessons).toHaveLength(3);expect(flashcards).toHaveLength(24);expect(lessons.flatMap(l=>l.blocks)).toHaveLength(27);
  for(const l of lessons){expect(flashcards.filter(c=>c.topicId===l.topicId)).toHaveLength(8);expect(l.blocks[0].kind).toBe('introduction');expect(l.blocks.at(-1)?.kind).toBe('recap');}
 });
 it.each(['duplicate','wrong-topic','wrong-skill','wrong-subtopic','source','precision','unsafe-kind','oversized','missing-recap','missing-card','fake-score'] as const)('rejects %s authored content',kind=>{
  const {ls,cs}=fresh();const p=structuredClone(topicStudy);const b=ls[0].blocks[0];
  if(kind==='duplicate')cs[1].id=cs[0].id;
  if(kind==='wrong-topic')b.topicId=ls[1].topicId;
  if(kind==='wrong-skill')b.skillIds=[cs.at(-1)!.skillIds[0]];
  if(kind==='wrong-subtopic')b.subtopicIds=['UNKNOWN'];
  if(kind==='source')b.sourceIds=['missing'];
  if(kind==='precision')p.sources.find(s=>s.id===b.sourceIds[0])!.precision='UNKNOWN';
  if(kind==='unsafe-kind')Object.assign(b,{kind:'raw_html'});
  if(kind==='oversized')b.paragraphs=['x'.repeat(4001)];
  if(kind==='missing-recap')ls[0].blocks.pop();
  if(kind==='missing-card')cs.pop();
  if(kind==='fake-score')Object.assign(cs[0],{mastery:100});
  expect(()=>validateTopicContent(ls,cs,p)).toThrow('Topic content:');
 });
 it.each(['lesson','block','card','version'] as const)('refuses a changed published %s without a new immutable lock',kind=>{
  const {ls,cs}=fresh();if(kind==='lesson')ls[0].id='ds.lesson.changed';if(kind==='block')ls[0].blocks[0].paragraphs[0]+=' Altered meaning.';if(kind==='card')cs[0].answer+=' Changed.';if(kind==='version')cs[0].version='2';
  expect(()=>checkContentLocks(ls as Lesson[],cs as Flashcard[],locks)).toThrow('published version changed');
 });
 it('direct Vite production build is blocked by failed topic validation',async()=>{
  const root=await mkdtemp(join(tmpdir(),'ds-topic-build-'));const entry=join(root,'entry.js');await writeFile(entry,'export const ok=1;');
  try{await expect(build({root,configFile:false,logLevel:'silent',plugins:[topicStudyGuard(()=>{throw new Error('Topic lock failed');})],build:{write:false,rollupOptions:{input:entry}}})).rejects.toThrow('Topic lock failed');}finally{await rm(root,{recursive:true,force:true});}
 });
});
