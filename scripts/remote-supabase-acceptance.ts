/**
 * Isolated live Step 12 acceptance probe. It creates two disposable users and
 * leaves their learner history intact because the product deliberately offers
 * no client-side cloud deletion API.
 *
 * Run with: node --import tsx scripts/remote-supabase-acceptance.ts
 */
import {readFileSync} from 'node:fs';
import {createClient, type SupabaseClient} from '@supabase/supabase-js';
import {emptyPayload} from '../src/cloud/model';

type Account={email:string; password:string; id:string; client:SupabaseClient};
const fail=(message:string):never=>{throw new Error(`REMOTE ACCEPTANCE FAILED: ${message}`);};
const expect: (condition:unknown,message:string)=>asserts condition=(condition,message)=>{if(!condition)fail(message);};
function config():{url:string; key:string}{
  const vars=Object.fromEntries(readFileSync('.env.local','utf8').split(/\r?\n/).flatMap(line=>{
    const match=line.match(/^(VITE_SUPABASE_(?:URL|PUBLISHABLE_KEY))=(.*)$/);return match?[[match[1],match[2].replace(/^"|"$/g,'')]]:[];
  }));
  const url=vars.VITE_SUPABASE_URL,key=vars.VITE_SUPABASE_PUBLISHABLE_KEY;
  expect(url&&key,'missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env.local');return {url,key};
}
async function createAccount(label:string,settings:{url:string;key:string}):Promise<Account>{
  const client=createClient(settings.url,settings.key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const email=`delftstudy.step12.${label}.${Date.now()}.${crypto.randomUUID().slice(0,8)}@example.invalid`;
  const password=`Step12!${crypto.randomUUID()}Aa`;
  const {data,error}=await client.auth.signUp({email,password});
  if(error)fail(`${label} signup: ${error.code??'unknown'} ${error.message}`);
  const user=data.user;
  expect(data.session&&user,'email confirmation or signup configuration prevented authenticated acceptance');
  return {email,password,id:user.id,client};
}
async function rpc(account:Account, expectedRevision:number, operationId:string){
  const {data,error}=await account.client.rpc('sync_learner_snapshot',{expected_revision:expectedRevision,operation:operationId,learner_payload:emptyPayload()});
  if(error)fail(`RPC for ${account.id.slice(0,8)}: ${error.code??'unknown'} ${error.message}`);return data as Record<string,unknown>;
}
async function signIn(settings:{url:string;key:string},account:Account):Promise<SupabaseClient>{
  const client=createClient(settings.url,settings.key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const {data,error}=await client.auth.signInWithPassword({email:account.email,password:account.password});
  if(error)fail(`reconnect login: ${error.code??'unknown'} ${error.message}`);expect(data.session,'reconnect did not create a session');return client;
}
async function main(){
  const settings=config(), a=await createAccount('a',settings), b=await createAccount('b',settings);
  const opA=crypto.randomUUID(), firstA=await rpc(a,0,opA);
  expect(firstA.owner===a.id&&firstA.revision===1&&firstA.operationId===opA,'local-to-cloud RPC acknowledgement is invalid');
  const retryA=await rpc(a,0,opA);expect(retryA.revision===1,'identical operation is not idempotent');
  const stale=await a.client.rpc('sync_learner_snapshot',{expected_revision:0,operation:crypto.randomUUID(),learner_payload:emptyPayload()});
  expect(stale.error?.code==='40001',`stale revision did not produce a conflict: ${stale.error?.code??'no error'} ${stale.error?.message??''}`);
  const reused=await a.client.rpc('sync_learner_snapshot',{expected_revision:1,operation:opA,learner_payload:emptyPayload()});
  expect(reused.error?.code==='23505',`operation reuse with changed request did not conflict: ${reused.error?.code??'no error'} ${reused.error?.message??''}`);
  const changedPayload=emptyPayload();changedPayload.content.version='conflicting-request';
  const changed=await a.client.rpc('sync_learner_snapshot',{expected_revision:0,operation:opA,learner_payload:changedPayload});
  expect(changed.error?.code==='23505','same operation with changed payload did not return the receipt conflict code');
  const opB=crypto.randomUUID(),firstB=await rpc(b,0,opB);expect(firstB.owner===b.id&&firstB.revision===1,'second user cannot create an independent snapshot');

  const ownA=await a.client.from('learner_snapshots').select('user_id,revision,operation_id').eq('user_id',a.id);
  expect(!ownA.error&&ownA.data?.length===1&&ownA.data[0].user_id===a.id,'User A cannot read own snapshot');
  const ownOps=await a.client.from('learner_sync_operations').select('user_id,operation_id,revision').eq('operation_id',opA);
  expect(!ownOps.error&&ownOps.data?.length===1&&ownOps.data[0].user_id===a.id,'User A cannot read own operation receipt');
  const crossRead=await a.client.from('learner_snapshots').select('user_id').eq('user_id',b.id);
  expect(!crossRead.error&&crossRead.data?.length===0,'RLS exposed User B snapshot to User A');
  const crossOperation=await a.client.from('learner_sync_operations').select('user_id').eq('user_id',b.id);
  expect(!crossOperation.error&&crossOperation.data?.length===0,'RLS exposed User B receipt to User A');
  const crossUpdate=await a.client.from('learner_snapshots').update({revision:99}).eq('user_id',b.id).select('revision');
  expect(crossUpdate.error?crossUpdate.error.code==='42501':crossUpdate.data?.length===0,'RLS allowed User A to update User B snapshot');
  const crossDelete=await a.client.from('learner_snapshots').delete().eq('user_id',b.id).select('user_id');
  expect(crossDelete.error?crossDelete.error.code==='42501':crossDelete.data?.length===0,'RLS allowed User A to delete User B snapshot');
  const spoof=await a.client.from('learner_snapshots').insert({user_id:b.id,revision:1,operation_id:crypto.randomUUID(),schema_version:1,payload:emptyPayload()});
  expect(spoof.error?.code==='42501','direct insert claiming another user was not denied');
  for(const table of ['learner_snapshots','learner_sync_operations']){
    const ownWrite=await a.client.from(table).update({revision:99}).eq('user_id',a.id);
    expect(ownWrite.error?.code==='42501','direct own-table write could bypass the RPC');
  }
  const receiptUpdate=await a.client.from('learner_sync_operations').update({revision:99}).eq('user_id',b.id).select('revision');
  expect(receiptUpdate.error?receiptUpdate.error.code==='42501':receiptUpdate.data?.length===0,'cross-user receipt update was not denied');
  const receiptDelete=await a.client.from('learner_sync_operations').delete().eq('user_id',b.id).select('operation_id');
  expect(receiptDelete.error?receiptDelete.error.code==='42501':receiptDelete.data?.length===0,'cross-user receipt delete was not denied');
  const receiptSpoof=await a.client.from('learner_sync_operations').insert({user_id:b.id,operation_id:crypto.randomUUID(),revision:1,request_hash:'0'.repeat(64)});
  expect(receiptSpoof.error?.code==='42501','spoofed receipt insert was not denied');
  const bReceipt=await b.client.from('learner_sync_operations').select('operation_id,revision').eq('operation_id',opB);
  expect(!bReceipt.error&&bReceipt.data?.length===1&&bReceipt.data[0].revision===1,'User B receipt changed');
  const bStill=await b.client.from('learner_snapshots').select('user_id,revision').eq('user_id',b.id);
  expect(!bStill.error&&bStill.data?.length===1&&bStill.data[0].revision===1,'cross-user mutation changed User B history');

  const reconnected=await signIn(settings,a);
  const restored=await reconnected.from('learner_snapshots').select('user_id,revision,operation_id,payload').maybeSingle();
  expect(!restored.error&&restored.data?.user_id===a.id&&restored.data.revision===1,'cloud-to-local reload/reconnect read failed');
  await reconnected.auth.signOut({scope:'local'});
  const switched=await signIn(settings,b);
  const afterSwitch=await switched.from('learner_snapshots').select('user_id,revision').maybeSingle();
  expect(!afterSwitch.error&&afterSwitch.data?.user_id===b.id&&afterSwitch.data.revision===1,'account switch exposed the wrong cloud profile');
  await Promise.all([a.client.auth.signOut({scope:'local'}),b.client.auth.signOut({scope:'local'}),switched.auth.signOut({scope:'local'})]);
  console.log('REMOTE ACCEPTANCE PASS: auth, snapshots, receipts, RLS isolation, idempotency, stale-CAS conflict, reconnect and account switch.');
}
void main().catch(error=>{console.error(error instanceof Error?error.message:error);process.exitCode=1;});
