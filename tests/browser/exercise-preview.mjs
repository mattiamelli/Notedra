// Disposable anonymous production acceptance. Arguments: Playwright module, local preview URL.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.argv[2]).href);
const base=process.argv[3]??'http://127.0.0.1:4176';
assert(/^http:\/\/127\.0\.0\.1:\d+$/.test(base),'Local preview only');
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const exercises=['src/practice/catalog.json',...['co','rl','ip','enrichment'].map(c=>`src/${c}/practice.json`)].flatMap(read);
const browser=await chromium.launch({headless:true});
try{for(const width of [1280,375]){
 const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const fits=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow ${width} ${page.url()}`);
 async function answer(e){
  if(e.task.kind==='enrichment-exact'){for(const [n,v] of e.reference.value.split(',').entries())await page.getByLabel(`Part ${n+1}`,{exact:true}).fill(v);}
  else if(e.task.kind==='truth'){for(const value of e.reference.value){const [id,result]=value.split(':');const row=e.task.rows.find(r=>r.id===id);await page.getByLabel(`Result when p is ${row.p?'T':'F'} and q is ${row.q?'T':'F'}`).selectOption(result);}}
  else if(e.reference.kind==='choice')await page.locator(`input[type=radio][value="${e.reference.value[0]}"]`).check();
  else await page.getByLabel('Your answer',{exact:true}).fill(e.reference.value);
 }
 try{
  for(const id of ['ds.practice.enrich-carry-overflow','ds.practice.enrich-address-load',exercises.find(e=>e.task.kind==='truth').id,exercises.find(e=>e.task.kind==='ip-fixed').id]){
   const e=exercises.find(e=>e.id===id);await page.goto(`${base}/practice/${id}`);
   await page.getByRole('button',{name:'Start exercise',exact:true}).click();
   await page.getByRole('button',{name:'Submit answer',exact:true}).waitFor();
   assert.equal(await page.getByText('Prepare for this exercise',{exact:true}).count(),1);
   await answer(e);if(e.task.kind==='enrichment-exact')for(const input of await page.locator('.ds-tuple-fields input').all())assert((await input.boundingBox()).width>=180,'Ordered result field must be readable');const first=page.locator('main input:not([disabled]),main select:not([disabled])').first();await first.focus();assert(await first.evaluate(e=>e===document.activeElement));
   await fits();await page.getByRole('button',{name:'Submit answer',exact:true}).click();
   await page.getByRole('heading',{name:'Correct · 1 / 1 item point',exact:true}).waitFor();
   assert(!/CO_SK|RL_SK|IP_SK|sum-10/.test(await page.locator('.ds-practice-feedback').innerText()));
   await fits();await page.screenshot({path:`/tmp/patch5-${width}-${e.task.kind}.png`,fullPage:true});
   await page.reload();await page.getByRole('heading',{name:'Correct · 1 / 1 item point',exact:true}).waitFor();
   const next=page.getByRole('link',{name:/^Next exercise:/});
   if(await next.count()){await next.click();await page.getByRole('button',{name:'Start exercise',exact:true}).waitFor();}
   else {await page.getByRole('link',{name:'Explore more ways to practise this topic'}).click();await page.locator('.ds-study-reading').first().waitFor();}
  }
  await page.goto(`${base}/rl/RL_T02_FOL/practice`);
  const guide=page.locator('.ds-rl-guided').first();await guide.locator('textarea').first().fill('Disposable scope and witness reasoning.');
  await guide.getByRole('button',{name:'Reveal criteria and reference',exact:true}).click();
  await guide.getByRole('heading',{name:'Self-check criteria',exact:true}).waitFor();assert(!/item point/.test(await guide.innerText()));await fits();
  await page.getByRole('tab',{name:'Exam-style',exact:true}).click();await fits();
  const assignment=read('src/ip/assignment-index.json').find(a=>a.minutes===15);
  await page.goto(`${base}/ip/${assignment.topicId}/practice?task=${assignment.id}`);
  await page.locator('#ip-source-editor').fill('// disposable unexecuted learner notes');
  await page.getByRole('button',{name:'Reveal reference solution',exact:true}).click();
  await page.getByRole('button',{name:'Hide reference solution',exact:true}).waitFor();await fits();
  assert(!/item point/.test(await page.locator('.ds-ip-workbench').innerText()));
  await page.screenshot({path:`/tmp/patch5-${width}-coding.png`,fullPage:true});
  await page.getByRole('tab',{name:'Exam-style',exact:true}).click();await fits();
  for(const c of ['co','rl','ip']){
   const bank=read(`src/exams/banks/${c}.json`),bp=bank.blueprints.find(b=>b.mode==='quick');
   await page.goto(`${base}/exams/${bank.course}/setup`);await page.getByRole('button',{name:'Start quick exam',exact:true}).click();
   await page.getByRole('button',{name:'Finish and submit',exact:true}).waitFor();
   for(const [n,slot] of bp.slots.entries()){
    if(n)await page.getByRole('button',{name:'Next question',exact:true}).click();
    const item=bank.items.find(i=>i.id===slot.candidates[0].id);
    assert.equal(await page.getByText('Prepare for this exercise',{exact:true}).count(),0);
    if(item.practiceRef)await answer(exercises.find(e=>e.id===item.practiceRef.id));
    else {await page.locator('.exam-answer textarea').fill('Disposable reasoning or Java notes; not a verified solution.');assert(/not compiled|no automatic correctness/.test(await page.locator('#exam-open-policy').innerText()));}
    await fits();
   }
   await page.screenshot({path:`/tmp/patch5-${width}-exam-${c}.png`,fullPage:true});
   await page.getByRole('button',{name:'Finish and submit',exact:true}).click();
   await page.getByRole('button',{name:'Confirm submission',exact:true}).click();
   await page.getByRole('navigation',{name:'Review question navigation'}).waitFor();
   const open=bp.slots.findIndex(s=>bank.items.find(i=>i.id===s.candidates[0].id).evaluation==='RUBRIC');
   await page.getByRole('button',{name:`Review question ${open+1}`,exact:true}).click();
   assert(/No automatic|unscored|rubric review/i.test(await page.locator('main').innerText()));assert(!/CSE1[134]00_|(?:CO|RL|IP)_SK/.test(await page.locator('main').innerText()));await fits();
  }
  assert.deepEqual(errors,[]);console.log(`PASS ${width}px Chromium: CO structured/state, RL truth+open, IP prediction+code; correct/reload/next; all three mixed exams; open unscored; no overflow/page errors; labelled keyboard focus.`);
 }catch(error){await page.screenshot({path:`/tmp/patch5-failure-${width}.png`,fullPage:true});console.error(page.url(),await page.locator('body').innerText());throw error;}finally{await context.close();}
}}finally{await browser.close();}
