import {expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
import {upcomingExamsCorrectionPath,staleConflictCorrectionPath,validateUpcomingExamsCorrection} from '../scripts/cloud-validation';
const sql=readFileSync(upcomingExamsCorrectionPath,'utf8'),previous=readFileSync(staleConflictCorrectionPath,'utf8');
it('limits the new migration to its exact reviewed optional field validation',()=>{
  expect(()=>validateUpcomingExamsCorrection(sql,previous)).not.toThrow();
});
it.each(['> 50',"array['examDate','id','name']",'pg_advisory_xact_lock','for update',"'PT409'",'receipt.request_hash <> fingerprint','auth.uid()',"security definer set search_path = ''",'grant execute','History deletion rejected'])('rejects a changed migration protection: %s',text=>{
  expect(sql).toContain(text);
  expect(()=>validateUpcomingExamsCorrection(sql.replace(text,'CHANGED'),previous)).toThrow();
});
