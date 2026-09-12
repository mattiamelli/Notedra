import {expect,it} from 'vitest';
import {IDBFactory} from 'fake-indexeddb';
import {randomUUID} from 'node:crypto';
import {IndexedStudentRepository} from '../src/learning/repository';
import {emptyBackup,migrateBackup} from '../src/learning/contracts';
import {SyncCoordinator} from '../src/cloud/coordinator';
import {IndexedSyncStore} from '../src/cloud/local-store';
import {accountDatabase} from '../src/cloud/model';
import {FakeCloud} from './helpers/cloud';
const A='11111111-1111-4111-8111-111111111111',B='22222222-2222-4222-8222-222222222222';
const exam={id:'exam-a',name:'Alpha exam',examDate:'2028-02-29'};
it.each([3,4])('opens existing IndexedDB %i without losing exams or changing sync generation',async version=>{
  const factory=new IDBFactory(),data={...emptyBackup(),upcomingExams:[exam],generation:'preserved-generation',revision:7};
  const metadata={schema:1,owner:A,base:null,pending:null};
  const db=await new Promise<IDBDatabase>((resolve,reject)=>{
    const request=factory.open(accountDatabase(A),version);
    request.onupgradeneeded=()=>request.result.createObjectStore('student');
    request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
  });
  await new Promise<void>((resolve,reject)=>{const tx=db.transaction('student','readwrite'),store=tx.objectStore('student');store.put(data,'active');store.put(metadata,'cloud-sync-v1');store.put({...emptyBackup(),upcomingExams:[exam]},'recovery');tx.oncomplete=()=>resolve();tx.onabort=()=>reject(tx.error);});
  db.close();const repo=new IndexedStudentRepository({name:accountDatabase(A),factory});
  try {expect((await repo.load()).data).toEqual(data);expect((await repo.exportRecovery())?.upcomingExams).toEqual([exam]);expect((await new IndexedSyncStore(A,factory).read(new AbortController().signal)).metadata).toEqual(metadata);}
  finally {repo.close();}
});
function device(cloud=new FakeCloud(),factory=new IDBFactory()) {
  const owner=cloud.owner,repo=new IndexedStudentRepository({name:accountDatabase(owner),factory});
  const sync=new SyncCoordinator(owner,new IndexedSyncStore(owner,factory),cloud,new AbortController().signal,randomUUID);
  return {repo,sync};
}
it('syncs independent exam additions, edits and deletions across two devices and reload',async()=>{
  const cloud=new FakeCloud(),a=device(cloud),b=device(cloud);
  try {
    await a.repo.addUpcomingExam(exam,(await a.repo.load()).data);
    await a.sync.sync(); await b.sync.sync();
    expect((await b.repo.load()).data.upcomingExams).toEqual([exam]);
    const second={...exam,id:'exam-b'},third={...exam,id:'exam-c'};
    await a.repo.addUpcomingExam(second,(await a.repo.load()).data);
    await b.repo.addUpcomingExam(third,(await b.repo.load()).data);
    await a.sync.sync(); await b.sync.sync(); await a.sync.sync();
    expect((await a.repo.load()).data.upcomingExams).toEqual([exam,second,third]);
    await a.repo.updateUpcomingExam({...exam,name:'Edited exam'},(await a.repo.load()).data);
    await a.sync.sync(); await b.sync.sync();
    expect((await b.repo.load()).data.upcomingExams?.[0].name).toBe('Edited exam');
    await b.repo.deleteUpcomingExam(exam.id,(await b.repo.load()).data);
    await b.sync.sync(); await a.sync.sync();
    expect((await a.repo.load()).data.upcomingExams).toEqual([second,third]);
    const reloaded=device(cloud);
    try {await reloaded.sync.sync();expect((await reloaded.repo.load()).data.upcomingExams).toEqual([second,third]);}
    finally {reloaded.repo.close();}
  } finally {a.repo.close();b.repo.close();}
});
it('preserves exam backups, old backups, and A/B/anonymous storage separation',async()=>{
  const factory=new IDBFactory(),a=device(new FakeCloud(A),factory),b=device(new FakeCloud(B),factory);
  const anonymous=new IndexedStudentRepository({factory});
  try {
    await a.repo.addUpcomingExam(exam,(await a.repo.load()).data);
    await anonymous.addUpcomingExam({...exam,id:'anonymous-exam'},(await anonymous.load()).data);
    await a.sync.sync(); await b.sync.sync();
    expect((await b.repo.load()).data.upcomingExams).toEqual([]);
    expect((await anonymous.load()).data.upcomingExams?.map(e=>e.id)).toEqual(['anonymous-exam']);
    const backup=await a.repo.exportBackup();
    expect(migrateBackup(backup).upcomingExams).toEqual([exam]);
    const old=emptyBackup();delete old.upcomingExams;
    expect(migrateBackup(old).upcomingExams).toEqual([]);
    const backToA=device(new FakeCloud(A),factory);
    try {expect((await backToA.repo.load()).data.upcomingExams).toEqual([exam]);}
    finally {backToA.repo.close();}
  } finally {a.repo.close();b.repo.close();anonymous.close();}
});
