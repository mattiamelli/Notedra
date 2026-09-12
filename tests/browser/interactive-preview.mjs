// Production acceptance with disposable anonymous browser storage only.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.argv[2]).href),base=process.argv[3]??'http://127.0.0.1:4177';
assert(/^http:\/\/127\.0\.0\.1:\d+$/.test(base));
const exercises=JSON.parse(readFileSync('src/interactive/practice.json','utf8'));
const browser=await chromium.launch({headless:true});
try{for(const width of [1280,375]){
 const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});page.on('requestfailed',r=>errors.push(r.url()+': '+r.failure()?.errorText));
 try{
  for(const e of exercises){
   await page.goto(`${base}/practice/${e.id}`);const start=page.getByRole('button',{name:'Start exercise',exact:true});await start.focus();await page.keyboard.press('Enter');await page.getByRole('button',{name:'Submit answer',exact:true}).waitFor();
   assert.equal(await page.getByText('Prepare for this exercise',{exact:true}).count(),e.mode==='exam'?0:1);
   const submit=page.getByRole('button',{name:'Submit answer',exact:true});await submit.click();await page.getByRole('alert').filter({hasText:'Complete every labelled field'}).waitFor();
   const selects=page.locator('.logic-workspace select');assert(await selects.count()>0);await selects.first().focus();await page.keyboard.press('ArrowDown');await page.keyboard.press('Tab');
   await page.getByRole('button',{name:'Reset fields',exact:true}).click();assert.deepEqual(await selects.evaluateAll(es=>es.map(e=>e.value)),Array(await selects.count()).fill(''));
   for(const token of e.reference.value){const [id,value]=token.split('=');if(e.task.kind==='logic-build'){const slot=e.task.slots.find(s=>s.id===id);await page.getByLabel(slot.label,{exact:true}).selectOption(value);}else{await page.getByRole('combobox',{name:new RegExp(`minterm ${id.slice(1)}$`)}).selectOption(value);}}
   for(const sel of await selects.all()){const rect=await sel.boundingBox();assert(rect.height>=44);assert(rect.width>=44);}
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow ${e.id}`);
   await page.screenshot({path:`/tmp/patch6-${width}-${e.id.split('interactive-')[1]}-input.png`,fullPage:true});
   await submit.focus();await page.keyboard.press('Enter');await page.getByRole('heading',{name:'Correct · 1 / 1 item point',exact:true}).waitFor();
   const feedback=page.locator('.ds-practice-feedback');assert(!/(?:RL|CO)_SK|connective=|join=/.test(await feedback.innerText()));
   await page.reload();await page.getByRole('heading',{name:'Correct · 1 / 1 item point',exact:true}).waitFor();
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.screenshot({path:`/tmp/patch6-${width}-${e.id.split('interactive-')[1]}-feedback.png`,fullPage:true});
   if(e.id.endsWith('rl-conditional')){
    await page.getByRole('button',{name:'Retry as new attempt',exact:true}).click();await page.getByLabel('Missing connective',{exact:true}).selectOption('and');await page.getByRole('button',{name:'Submit answer',exact:true}).click();await page.getByRole('heading',{name:'Incorrect · 0 / 1 item point',exact:true}).waitFor();assert((await page.locator('.ds-practice-feedback').innerText()).includes('At P=0, Q=0'));
    await page.screenshot({path:`/tmp/patch6-${width}-wrong.png`,fullPage:true});
   }
   const next=page.getByRole('link',{name:/^Next exercise:/});await next.focus();await page.keyboard.press('Enter');await page.getByRole('button',{name:'Start exercise',exact:true}).waitFor();
  }
  assert.deepEqual(errors,[]);console.log(`PASS ${width}px: all 7 authored interactions; invalid/correct/wrong, reset, keyboard start/submit/next, immutable reload/retry; mode differences; 44px controls and no page overflow/errors.`);
 }catch(error){await page.screenshot({path:`/tmp/patch6-failure-${width}.png`,fullPage:true});console.error(errors,page.url(),await page.locator('body').innerText());throw error;}finally{await context.close();}
}}finally{await browser.close();}
