import {it,expect} from 'vitest';
import {IDBFactory} from 'fake-indexeddb';
import {IndexedStudentRepository} from '../src/learning/repository';
import {emptyBackup} from '../src/learning/contracts';
import {deriveEvidence} from '../src/adaptive/evidence';
import {recommend} from '../src/adaptive/engine';
import {validateAdaptiveBundle} from '../scripts/adaptive-bundle';
import {allExercises} from '../src/practice/catalog';
import {record,text,CLOCK} from './helpers/adaptive';
it('review: incomplete legacy storage rolls back version and preserves recovery bytes',async()=>{
 const factory=new IDBFactory(),name='incomplete-migration';const {reviews:_reviews,exams:_exams,examReviews:_examReviews,...empty}=emptyBackup();const recovery={...empty,schemaVersion:1};
 const db=await new Promise<IDBDatabase>(resolve=>{const r=factory.open(name,1);r.onupgradeneeded=()=>r.result.createObjectStore('student');r.onsuccess=()=>resolve(r.result);});
 await new Promise<void>(resolve=>{const tx=db.transaction('student','readwrite');tx.objectStore('student').put(recovery,'recovery');tx.oncomplete=()=>resolve();});db.close();
 await expect(new IndexedStudentRepository({factory,name}).load()).rejects.toMatchObject({code:'STORAGE'});
 const reopened=await new Promise<IDBDatabase>(resolve=>{const r=factory.open(name);r.onsuccess=()=>resolve(r.result);});const read=await new Promise<unknown>(resolve=>{const r=reopened.transaction('student').objectStore('student').get('recovery');r.onsuccess=()=>resolve(r.result);});const version=reopened.version;reopened.close();expect(version).toBe(1);expect(read).toEqual(recovery);
});
it('review: prerequisite-first explanation remains true when downstream errors greatly outnumber prerequisite errors',()=>{
 const before=allExercises.find(e=>e.skillId==='CO_SK10_02_MEMORY_BITS')!,after=allExercises.find(e=>e.skillId==='CO_SK11_01_CACHE_BITS')!;
 const records=[record('pre',before.id,text('0'),20),...Array.from({length:8},(_,i)=>record('down-'+i,after.id,text('0'),i+1))];
 const queue=recommend(deriveEvidence(records,[],CLOCK),{minutes:20,topicId:after.topicId});expect(queue[0].basisSkillId).toBe(before.skillId);expect(queue[0].reason).toContain('canonical prerequisite');
});
it('review: unreachable lazy chunks cannot satisfy route bundle presence checks',()=>{
 const chunks=[{file:'entry',entry:true,modules:['src/App.tsx'],imports:[],dynamicImports:[]},{file:'ghost',entry:false,modules:['src/adaptive/MistakesPage.tsx','src/adaptive/StudyPathPage.tsx','src/adaptive/engine.ts','src/adaptive/evidence.ts','src/adaptive/actions.json'],imports:[],dynamicImports:[]}];
 expect(()=>validateAdaptiveBundle(chunks,[])).toThrow(/unreachable/i);
});
it('review: success history order is deterministic, including identical timestamps',()=>{
 const records=[record('wrong','enrich-carry-overflow',text('1,1'),3),record('a','enrich-carry-overflow',text('1,0'),1),record('b','enrich-carry-overflow',text('1,0'),1)];expect(deriveEvidence(records,[],CLOCK)).toEqual(deriveEvidence([...records].reverse(),[],CLOCK));
});
