import {expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
import {checkSecrets,sqlPath,staleConflictCorrectionPath,validateAuth,validateSecurity,validateSQL,validateStaleConflictCorrection,validateSync} from '../scripts/cloud-validation';
const sql=readFileSync(sqlPath,'utf8');
const correction=readFileSync(staleConflictCorrectionPath,'utf8');
it('validates local-first auth and strict sync boundaries',()=>{expect(validateAuth().localFallback).toBe(true);expect(validateSync().studentSchema).toBe(3);});
it('statically validates eight ownership policies and restricted RPC writes',()=>expect(validateSecurity()).toEqual({tables:2,ownerPolicies:8,remoteEnforcement:'NOT RUN'}));
it('permits only the PT409 stale-conflict correction in the replacement RPC',()=>{
  expect(()=>validateStaleConflictCorrection(correction,sql)).not.toThrow();
  expect(()=>validateStaleConflictCorrection(correction.replace("message = 'Stale cloud revision'","message = 'Other conflict'"),sql)).toThrow();
});
it.each(['learner_snapshots','learner_sync_operations'])('rejects missing RLS for %s',table=>expect(()=>validateSQL(sql.replace(`alter table public.${table} enable row level security;`,''))).toThrow());
it.each(['select','insert','update','delete'])('rejects missing %s ownership policy',operation=>expect(()=>validateSQL(sql.replace(new RegExp(`create policy snapshot_${operation}[^\n]+`),''))).toThrow());
it.each(['using (true)','with check (true)','grant update on public.learner_snapshots to authenticated;'])('rejects permissive SQL: %s',text=>expect(()=>validateSQL(sql+'\n'+text)).toThrow());
it.each(['owner_id uuid := auth.uid()','if owner_id is null','pg_advisory_xact_lock','receipt.request_hash <> fingerprint','History deletion rejected'])('rejects missing protection %s',text=>expect(()=>validateSQL(sql.replace(text,'REMOVED'))).toThrow());
it('rejects privileged key literals while accepting public configuration',()=>{expect(()=>checkSecrets('sb_'+'secret_'+'x'.repeat(25))).toThrow();expect(()=>checkSecrets('sb_publishable_'+'x'.repeat(25))).not.toThrow();});
it('rejects privileged JWT even under an innocuous variable name',()=>{const token=[btoa(JSON.stringify({alg:'HS256'})),btoa(JSON.stringify({role:'service_role'})),btoa('signature')].map(s=>s.replaceAll('=','')).join('.');expect(()=>checkSecrets('const innocent="'+token+'"')).toThrow();});
