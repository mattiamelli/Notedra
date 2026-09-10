import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import type {Plugin} from 'vite';
import {cloudConfig} from '../src/cloud/config';
import {emptyPayload,projectLearner} from '../src/cloud/model';
import {mergeLearner} from '../src/cloud/merge';
import {emptyBackup,STUDENT_SCHEMA_VERSION} from '../src/learning/contracts';
import {STUDENT_DB_VERSION} from '../src/learning/repository';
export const sqlPath='supabase/migrations/202609100001_learner_sync.sql';
export const staleConflictCorrectionPath='supabase/migrations/202609100002_stale_conflict_pt409.sql';
export function validateSQL(sql:string):void {
  assert(!/using\s*\(\s*true\s*\)|with check\s*\(\s*true\s*\)|disable row level security/i.test(sql),'Permissive RLS');
  for(const [table,prefix] of [['learner_snapshots','snapshot'],['learner_sync_operations','operation']]){
    assert(sql.includes(`alter table public.${table} enable row level security;`));
    assert(sql.includes(`alter table public.${table} force row level security;`));
    for(const operation of ['select','insert','update','delete']){
      const policy=sql.split('\n').find(line=>line.startsWith(`create policy ${prefix}_${operation} `));
      assert(policy);assert(policy.includes(`on public.${table} for ${operation} to authenticated`));
      if(operation!=='insert')assert(policy.includes('using ((select auth.uid()) = user_id)'));
      if(operation==='insert'||operation==='update')assert(policy.includes('with check ((select auth.uid()) = user_id)'));
    }
  }
  for(const required of ["owner_id uuid := auth.uid()","if owner_id is null",'security definer set search_path = \'\'','expected_revision','pg_advisory_xact_lock','receipt.request_hash <> fingerprint','History deletion rejected',"old_record->>'status' in ('SUBMITTED','ABANDONED')",'revoke all on public.learner_snapshots, public.learner_sync_operations from public, anon, authenticated;','grant execute on function public.sync_learner_snapshot(bigint,uuid,jsonb) to authenticated;'])assert(sql.includes(required),'Missing database protection: '+required);
  assert(!/grant\s+(?:all|insert|update|delete)\b/i.test(sql),'Direct write grant bypasses CAS');
}
export function checkSecrets(text:string):void {
  assert(!/sb_secret_[A-Za-z0-9_-]{10,}|sbp_[A-Za-z0-9]{20,}|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/.test(text),'Privileged credential detected');
  for(const token of text.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g)??[]){
    const payload=JSON.parse(Buffer.from(token.split('.')[1],'base64url').toString()) as {role?:unknown};assert(payload.role==='anon','Non-public JWT literal detected');
  }
}
export function validateStaleConflictCorrection(sql:string,original:string):void {
  const start='create function public.sync_learner_snapshot';
  const originalFunction=original.slice(original.indexOf(start));
  assert.notEqual(originalFunction,'','Original sync function is missing');
  const expected=originalFunction
    .replace(start,'create or replace function public.sync_learner_snapshot')
    .replace("raise exception 'Stale cloud revision' using errcode = '40001';","raise sqlstate 'PT409' using message = 'Stale cloud revision';");
  const correction=sql.slice(sql.indexOf('create or replace function public.sync_learner_snapshot'));
  assert.equal(correction,expected,'Corrective migration must only replace stale 40001 with the stable PT409 contract');
  assert(!sql.includes("errcode = '40001'"),'Corrective migration must not retain retryable stale 40001');
}
function files(path:string):string[]{return readdirSync(path,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(path,e.name)):[join(path,e.name)]);}
export function validateSecurity(){const original=readFileSync(sqlPath,'utf8');validateSQL(original);validateStaleConflictCorrection(readFileSync(staleConflictCorrectionPath,'utf8'),original);for(const f of files('src'))checkSecrets(readFileSync(f,'utf8'));assert(readFileSync('.gitignore','utf8').includes('.env.*'));return {tables:2,ownerPolicies:8,remoteEnforcement:'NOT RUN'};}
export function validateAuth(){
  assert.equal(cloudConfig(undefined,undefined).status,'unavailable');
  assert.equal(cloudConfig('https://project.supabase.co','sb_'+'secret_'+'x'.repeat(32)).status,'invalid');
  const root=readFileSync('src/accounts/AccountRoot.tsx','utf8');assert(root.includes("lazy(()=>import('./ConfiguredAccountRoot'))"));
  const adapter=readFileSync('src/cloud/supabase.ts','utf8');for(const api of ['signInWithPassword','signUp','signOut','getSession','onAuthStateChange'])assert(adapter.includes(api));
  return {localFallback:true,lazyAuth:true,clientVersion:'2.116.0'};
}
export function validateSync(){
  assert.equal(STUDENT_SCHEMA_VERSION,3);assert.equal(STUDENT_DB_VERSION,3);
  assert.deepEqual(mergeLearner(null,emptyPayload(),emptyPayload()),emptyPayload());
  assert.deepEqual(Object.keys(projectLearner(emptyBackup())).sort(),['attempts','content','examReviews','exams','reviews','schemaVersion']);
  for(const f of ['src/cloud/merge.ts','src/cloud/coordinator.ts','src/cloud/local-store.ts'])assert(!/gradeResponse|deriveProgress|evaluateSubmission/.test(readFileSync(f,'utf8')),'Sync must not regrade or store derived indices');
  return {studentSchema:3,indexedDB:3,cloudSchema:1,resumeExcluded:true,derivedIndicesExcluded:true};
}
export function cloudBuildGuard():Plugin{return {name:'accounts-sync-security',configResolved(config){for(const [name,value] of Object.entries(config.env)){if(name.startsWith('VITE_')){assert(['VITE_SUPABASE_URL','VITE_SUPABASE_PUBLISHABLE_KEY'].includes(name),'Unexpected exposed environment variable');if(typeof value==='string')checkSecrets(value);}}const parsed=cloudConfig(config.env.VITE_SUPABASE_URL,config.env.VITE_SUPABASE_PUBLISHABLE_KEY);assert(parsed.status!=='invalid',parsed.status==='invalid'?parsed.message:'');},buildStart(){validateAuth();validateSync();validateSecurity();}};}
