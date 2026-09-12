// Explicitly authorized disposable acceptance only. Stops on the first failed assertion.
// node --env-file=.env.local --import tsx scripts/patch2-live-acceptance.mjs
import assert from 'node:assert/strict';
import {createClient} from '@supabase/supabase-js';
import {emptyPayload} from '../src/cloud/model.ts';
import {writeFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
const results=[];let current='configuration',browser;
const check=(condition,label)=>{assert(condition,label);results.push(label);console.log('PASS',label);};
const url=process.env.VITE_SUPABASE_URL,key=process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
assert.equal(new URL(url).hostname,'obaljgxtosxnsljdtjjf.supabase.co');
const client=()=>createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
async function account(label){
  current=`${label} disposable signup`;
  const c=client(),email=`delftstudy.patch2.${randomUUID()}@example.invalid`,password=`Disposable!${randomUUID()}aA`,name=`Patch Two ${label}`;
  const {data,error}=await c.auth.signUp({email,password,options:{data:{display_name:name}}});
  check(!error&&!!data.session&&!!data.user,`${label} signup (${error?.code??'session required'})`);
  check(data.user.user_metadata.display_name===name,`${label} persisted display_name`);
  return {c,email,password,name,id:data.user.id};
}
async function rpc(a,revision,payload,operation=randomUUID()) {return a.c.rpc('sync_learner_snapshot',{expected_revision:revision,operation,learner_payload:payload});}
async function read(a){const r=await a.c.from('learner_snapshots').select('*').eq('user_id',a.id).single();check(!r.error,'own snapshot readable');return r.data;}
try {
  const a=await account('Alpha');
  current='old snapshot compatibility';const old=emptyPayload();delete old.upcomingExams;
  const oldOp=randomUUID(),oldSave=await rpc(a,0,old,oldOp);
  check(!oldSave.error&&oldSave.data.revision===1&&!Object.hasOwn(oldSave.data.payload,'upcomingExams'),'old-format payload accepted unchanged');
  current='upcoming exam cloud upload';const exam={id:randomUUID(),name:'Alpha cloud exam',examDate:'2028-02-29'},payload={...emptyPayload(),upcomingExams:[exam]},op=randomUUID();
  const saved=await rpc(a,1,payload,op);
  check(!saved.error&&saved.data.revision===2,`upcomingExams upload without 22023 (${saved.error?.code??'OK'})`);
  check(JSON.stringify((await read(a)).payload.upcomingExams)===JSON.stringify([exam]),'exam stored remotely');
  current='idempotency and CAS';const retry=await rpc(a,1,payload,op);
  check(!retry.error&&retry.data.revision===2,'identical operation idempotent');
  const historical=await rpc(a,0,old,oldOp);check(!historical.error&&historical.data.revision===1,'historical receipt replay');
  const reused=await rpc(a,2,payload,op);check(reused.error?.code==='23505','changed operation binding rejected with 23505');
  const staleOp=randomUUID(),stale=await rpc(a,0,payload,staleOp);check(stale.error?.code==='PT409','stale CAS returns PT409');
  const receipt=await a.c.from('learner_sync_operations').select('operation_id').eq('operation_id',staleOp);check(!receipt.error&&receipt.data.length===0,'stale CAS creates no receipt');
  current='malformed upcoming exams';
  for(const upcomingExams of [null,{},Array.from({length:51},(_,i)=>({...exam,id:String(i)})),[{...exam,name:' '}],[{...exam,name:'x'.repeat(121)}],[{...exam,examDate:'2027-02-29'}],[{...exam,daysRemaining:1}]]){
    const bad=await rpc(a,2,{...emptyPayload(),upcomingExams});check(bad.error?.code==='22023','malformed upcomingExams rejected');
  }
  check((await read(a)).revision===2,'rejected writes preserve revision');
  current='Alpha logout/login';check(!(await a.c.auth.signOut()).error,'Alpha SDK logout');
  const login=await a.c.auth.signInWithPassword({email:a.email,password:a.password});check(!login.error&&login.data.user?.user_metadata.display_name===a.name,'Alpha sign-in restores display_name');
  check((await read(a)).payload.upcomingExams[0].id===exam.id,'Alpha sign-in restores remote exam');
  const b=await account('Beta');current='User B isolation';
  const cross=await b.c.from('learner_snapshots').select('user_id').eq('user_id',a.id);check(!cross.error&&cross.data.length===0,'B cannot read A snapshot');
  const crossReceipt=await b.c.from('learner_sync_operations').select('user_id').eq('user_id',a.id);check(!crossReceipt.error&&crossReceipt.data.length===0,'B cannot read A receipts');
  const ownB=await rpc(b,0,emptyPayload());check(!ownB.error&&ownB.data.owner===b.id&&ownB.data.payload.upcomingExams.length===0,'B has independent empty profile');
  const crossA=await a.c.from('learner_snapshots').select('user_id').eq('user_id',b.id);check(!crossA.error&&crossA.data.length===0,'A cannot read B snapshot');
  const write=await b.c.from('learner_snapshots').update({revision:99}).eq('user_id',a.id);check(write.error?.code==='42501','direct cross-user write denied');
  current='browser acceptance';
  const {chromium}=await import('/Users/mattiamelli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  browser=await chromium.launch({headless:true});const context=await browser.newContext({viewport:{width:1280,height:900},timezoneId:'Europe/Amsterdam'}),page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const go=async path=>{await page.goto('http://127.0.0.1:4173'+path);};
  const add=async name=>{await page.getByRole('button',{name:'+ Add exam',exact:true}).click();await page.getByLabel('Exam name',{exact:true}).fill(name);await page.getByLabel('Exam date',{exact:true}).fill('2028-02-29');await page.getByRole('button',{name:'Save',exact:true}).click();await page.getByText(name,{exact:true}).waitFor();};
  const signIn=async who=>{await go('/account');await page.getByLabel('Email',{exact:true}).fill(who.email);await page.getByLabel('Password',{exact:true}).fill(who.password);await page.getByRole('button',{name:'Sign in',exact:true}).click();await page.getByRole('heading',{name:'Account profile',exact:true}).waitFor();await page.getByText(who.email,{exact:true}).waitFor();await page.getByText('Synced',{exact:true}).waitFor();};
  const signOut=async()=>{await go('/account');await page.getByRole('button',{name:'Sign out',exact:true}).click();await page.getByRole('heading',{name:'Anonymous local profile',exact:true}).waitFor();};
  await go('/');await add('Anonymous private exam');
  current='Alpha browser identity and exam restore';await signIn(a);await go('/');await page.getByText(`Hello ${a.name}`,{exact:true}).waitFor();await page.getByText(exam.name,{exact:true}).waitFor();
  check(await page.locator('.ds-header-account .ds-avatar').innerText()==='P','Alpha greeting/avatar');check(await page.getByText('Anonymous private exam',{exact:true}).count()===0,'anonymous exam excluded from Alpha');
  await add('Alpha browser exam');await go('/account');await page.getByRole('button',{name:'Sync now',exact:true}).click();await page.getByText('Synced',{exact:true}).waitFor();
  check((await read(a)).payload.upcomingExams.some(e=>e.name==='Alpha browser exam'),'UI-created Alpha exam persisted remotely');
  await go('/');await page.reload();await page.getByText('Alpha browser exam',{exact:true}).waitFor();check(true,'Alpha reload restores UI exam');
  current='Beta browser account switching';await signOut();await signIn(b);await go('/');await page.getByText(`Hello ${b.name}`,{exact:true}).waitFor();
  check(await page.getByText('Alpha browser exam',{exact:true}).count()===0&&await page.getByText(exam.name,{exact:true}).count()===0,'Beta browser has no Alpha exams');check(!(await page.locator('body').innerText()).includes(a.name),'Beta browser has no Alpha identity');
  current='switch back Alpha';await signOut();await signIn(a);await go('/');await page.getByText('Alpha browser exam',{exact:true}).waitFor();await page.getByText(`Hello ${a.name}`,{exact:true}).waitFor();check(true,'A/B/A identity and exams restored');
  for(const width of [1280,375]){current=`authenticated ${width}px acceptance`;await page.setViewportSize({width,height:900});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}px authenticated Dashboard no overflow`);await page.screenshot({path:`/tmp/p2-live-dashboard-${width}.png`,fullPage:true});await go('/account');await page.getByText(a.email,{exact:true}).waitFor();check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}px authenticated Account no overflow`);await page.screenshot({path:`/tmp/p2-live-account-${width}.png`,fullPage:true});await go('/');}
  current='logout anonymous separation';await signOut();await go('/');await page.getByText('Anonymous private exam',{exact:true}).waitFor();check(await page.getByText('Alpha browser exam',{exact:true}).count()===0,'logout restores only anonymous exam');check(!(await page.locator('body').innerText()).includes(a.name),'logout clears authenticated identity');check(errors.length===0,'no browser page errors');
  current='disposable SDK session cleanup';check(!(await a.c.auth.signOut()).error,'Alpha final SDK signout');check(!(await b.c.auth.signOut()).error,'Beta final SDK signout');
  writeFileSync('/tmp/p2-live-results.json',JSON.stringify({status:'PASS',timestamp:new Date().toISOString(),results},null,2));
} catch(error) {
  const failure={status:'FIX NEEDED',stage:current,error:error instanceof Error?error.message:String(error),timestamp:new Date().toISOString(),results};
  writeFileSync('/tmp/p2-live-results.json',JSON.stringify(failure,null,2));
  console.error('STOP',current,failure.error);process.exitCode=1;
} finally {if(browser)await browser.close();}
