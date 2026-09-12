// Local-only PostgreSQL integration. No network, environment keys, or production data.
// Run: node tests/sql/upcoming-exams.mjs /absolute/path/to/pglite/dist/index.js
// Verified with @electric-sql/pglite 0.5.8, installed outside the application.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {randomUUID} from 'node:crypto';
if (!process.argv[2]) throw new Error('Supply the local PGlite module path. This test never connects to Supabase.');
const {PGlite} = await import(pathToFileURL(process.argv[2]).href);
const db = new PGlite();
const A = randomUUID(), B = randomUUID();
let checks = 0;
const check = (value) => {assert(value); checks++;};
const equal = (actual, expected) => {assert.deepEqual(actual, expected); checks++;};
async function rejected(promise, code) {await assert.rejects(promise, error => error.code === code); checks++;}
const old = {schemaVersion:3,content:{},attempts:[],reviews:[],exams:[],examReviews:[]};
const exam = {id:'exam-a',name:'Acceptance exam',examDate:'2028-02-29'};
const next = {...old,upcomingExams:[exam]};
const rpc = async (revision, payload, operation = randomUUID()) => (await db.query(
  'select public.sync_learner_snapshot($1::bigint,$2::uuid,$3::jsonb) as snapshot',
  [revision,operation,JSON.stringify(payload)]
)).rows[0].snapshot;
const login = async owner => {
  await db.exec('reset role; set role authenticated;');
  await db.query("select set_config('request.jwt.claim.sub',$1,false)",[owner]);
};
try {
  // Only the Supabase identity boundary is stubbed; migrations execute as real SQL.
  await db.exec(`create role anon; create role authenticated;
    create schema auth; create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema public,auth to anon,authenticated;`);
  for (const file of ['202609100001_learner_sync.sql','202609100002_stale_conflict_pt409.sql']) {
    await db.exec(readFileSync('supabase/migrations/'+file,'utf8'));
  }
  await db.query('insert into auth.users(id) values($1),($2)',[A,B]);
  await login(A);
  const oldOperation = randomUUID(), original = await rpc(0,old,oldOperation);
  equal(original.payload,old); equal(original.revision,1);
  await rejected(rpc(1,next),'22023'); // Reproduce the deployed contract defect.
  await db.exec('reset role');
  await db.exec(readFileSync('supabase/migrations/20260912122342_upcoming_exams_cloud_contract.sql','utf8'));
  await login(A);
  equal(await rpc(0,old,oldOperation),original); // Historical receipt unchanged.
  const operation = randomUUID(), saved = await rpc(1,next,operation);
  equal(saved.payload,next); equal(saved.revision,2); equal(saved.owner,A);
  equal(await rpc(1,next,operation),saved);
  await rejected(rpc(1,next),'PT409');
  await rejected(rpc(2,next,operation),'23505');
  await rejected(rpc(1,{...next,upcomingExams:[]},operation),'23505');
  const before = (await db.query('select * from public.learner_snapshots')).rows;
  const receipts = (await db.query('select * from public.learner_sync_operations')).rows;
  const malformed = [
    null, [], 42, 'wrong', {...next,unexpected:true},
    ...[null,{},'wrong',51,Array(51).fill(exam),[null],[42],[[]],[exam,exam],
      [{...exam,id:''}],[{...exam,id:42}],[{...exam,id:'x'.repeat(101)}],
      [{...exam,name:''}],[{...exam,name:' \t\n'}],[{...exam,name:'\u00a0\uFEFF'}],
      [{...exam,name:'x'.repeat(121)}],[{...exam,name:'😀'.repeat(61)}],
      [{...exam,examDate:'2027-02-29'}],[{...exam,examDate:'2028-02-30'}],
      [{...exam,examDate:'2028-13-01'}],[{...exam,examDate:'2028-01-00'}],
      [{...exam,examDate:'0000-01-01'}],[{...exam,examDate:'2028-2-29'}],
      [{...exam,examDate:20280229}],[{...exam,examDate:'2028-02-29T00:00:00Z'}],
      [{...exam,daysRemaining:10}],[{...exam,urgency:'soon'}],
      [{id:exam.id,name:exam.name}]
    ].map(upcomingExams => ({...old,upcomingExams}))
  ];
  for (const payload of malformed) await rejected(rpc(2,payload),'22023');
  equal((await db.query('select * from public.learner_snapshots')).rows,before);
  equal((await db.query('select * from public.learner_sync_operations')).rows,receipts);
  const bounded = {...old,upcomingExams:Array.from({length:50},(_,i)=>({id:'😀'.repeat(49)+i,name:'😀'.repeat(60),examDate:'9999-12-31'}))};
  equal((await rpc(2,bounded)).revision,3);
  equal((await rpc(3,{...old,upcomingExams:[]})).revision,4); // Explicit deletion.
  equal(await rpc(1,next,operation),saved); // Retry after later writes returns original receipt.
  equal((await rpc(4,old)).payload,old); // Old clients remain accepted, without normalization.
  await login(B);
  equal((await db.query('select * from public.learner_snapshots')).rows,[]);
  equal((await db.query('select * from public.learner_sync_operations')).rows,[]);
  const b = await rpc(0,{...old,upcomingExams:[{...exam,id:'exam-b',name:'Beta exam'}]});
  equal(b.owner,B); equal(b.revision,1); check(!b.payload.upcomingExams.some(e=>e.id===exam.id));
  await rejected(db.query('update public.learner_snapshots set revision=99'),'42501');
  await login(A);
  equal((await db.query('select user_id,revision from public.learner_snapshots')).rows,[{user_id:A,revision:5}]);
  // Existing append-only learner history protections remain effective.
  const history = {...old,attempts:[{attemptId:'attempt-a',revision:1,status:'SUBMITTED'}]};
  equal((await rpc(5,history)).revision,6);
  await rejected(rpc(6,old),'22023');
  await rejected(rpc(6,{...history,attempts:[{...history.attempts[0],revision:2}]}),'22023');
  await login(''); await rejected(rpc(0,old),'42501');
  await db.exec('reset role; set role anon;'); await rejected(rpc(0,old),'42501');
  console.log(`Local PostgreSQL integration PASS: ${checks} assertions; historical reproduction, old/new shape, bounds, dates, receipts, PT409, history and A/B RLS. Remote NOT RUN.`);
} finally {await db.close();}
