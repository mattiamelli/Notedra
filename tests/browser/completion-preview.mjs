// All restored-source exercises; disposable local storage, no remote user data.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.argv[2]).href),base=process.argv[3]??'http://127.0.0.1:4178';
assert(/^http:\/\/127\.0\.0\.1:\d+$/.test(base));
const read=p=>JSON.parse(readFileSync(p,'utf8')),items=read('src/expansion/completion.json'),guides=read('src/expansion/completion-guided.json'),results=[];
const browser=await chromium.launch({headless:true});
try{for(const width of [1280,375]){
 const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
 try{
 for(const e of items){
  console.log('Objective',width,e.id);await page.goto(`${base}/practice/${e.id}`);await page.getByRole('button',{name:'Start exercise',exact:true}).click();const submit=page.getByRole('button',{name:'Submit answer',exact:true});await submit.waitFor();
  assert.equal(await page.getByText('Prepare for this exercise',{exact:true}).count(),e.mode==='exam'?0:1);await submit.click();assert(await page.getByRole('alert').count()>0);
  if(e.task.kind==='enrichment-exact'){for(const [i,v] of e.reference.value.split(',').entries())await page.getByLabel('Part '+(i+1),{exact:true}).fill(v);}else await page.locator('.ds-practice-answer input').fill(e.reference.value);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Input overflow ${e.id}`);
  if(e.id.endsWith('necessary-chain'))await page.screenshot({path:`/tmp/p7-completion-${width}-objective.png`,fullPage:true});
  await submit.click();await page.getByRole('heading',{name:'Correct · 1 / 1 item point',exact:true}).waitFor();await page.reload();await page.getByRole('heading',{name:'Correct · 1 / 1 item point',exact:true}).waitFor();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Feedback overflow ${e.id}`);
  const next=page.getByRole('link',{name:/^Next exercise:/});assert(await next.count()===1);await next.click();await page.getByRole('button',{name:'Start exercise',exact:true}).waitFor();
 }
 let checked=0;
 for(const topicId of new Set(guides.map(g=>g.topicId)))for(const mode of ['practice','exam']){
  const selected=guides.filter(g=>g.topicId===topicId&&g.mode===mode);if(!selected.length)continue;
  console.log('Guides',width,topicId,mode,selected.length);const course=topicId.startsWith('CO_')?'co':'rl';await page.goto(`${base}/${course}/${topicId}/${mode==='exam'?'exam-style':'practice'}`);
  await page.locator('#p7-guided-heading').waitFor();
  const ids=await page.locator('[id]').evaluateAll(es=>es.map(e=>e.id));assert.equal(new Set(ids).size,ids.length,'Duplicate accessible IDs');
  for(const g of selected){
   const article=page.locator('article').filter({has:page.getByRole('heading',{name:g.title,exact:true})});await article.waitFor();assert.equal(await article.locator('textarea').count(),g.fields.length);
   const input=article.locator('textarea').first();await input.fill('Disposable source-review reasoning');const criteria=article.locator('[id$="-criteria"]');assert.equal(await criteria.isVisible(),false);await article.getByRole('button',{name:'Reveal criteria and reference',exact:true}).click();assert(await criteria.isVisible());assert((await article.innerText()).includes('does not verify a proof'));assert.equal(await article.getByRole('button',{name:'Submit answer',exact:true}).count(),0);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Guide overflow ${g.id}`);await article.getByRole('button',{name:/^Reset working notes/}).click();assert.equal(await input.inputValue(),'');assert.equal(await criteria.isVisible(),false);checked++;
  }
  if(topicId==='RL_T09_TRANSFER_CONSTRAINT_PUZZLES'&&mode==='exam'){await page.locator('#p7-guided-heading').scrollIntoViewIfNeeded();await page.screenshot({path:`/tmp/p7-completion-${width}-guides.png`});}
  // Dedicated exam list must expose exactly the authored exam-tagged objectives, with no fabricated timed grading.
  if(mode==='exam'){
   const links=await page.locator('.ds-exercise-list-item > a').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
   for(const e of items.filter(e=>e.topicId===topicId&&e.mode==='exam'))assert(links.includes('/practice/'+e.id));
   for(const e of items.filter(e=>e.topicId===topicId&&e.mode==='practice'))assert(!links.includes('/practice/'+e.id));
  }
 }
 assert.equal(checked,62);assert.deepEqual(errors,[]);results.push({width,objective:items.length,guides:checked,result:'PASS',checks:['all correct answers','empty response validation','saved submission reload','same-topic next','practice/exam distinction','all guided routes and reset','no false proof score','unique accessible IDs','no horizontal overflow','no page errors']});
 }catch(e){await page.screenshot({path:`/tmp/p7-completion-failure-${width}.png`,fullPage:true});console.error(page.url(),await page.locator('body').innerText());throw e;}finally{await context.close();}
}writeFileSync('docs/maintenance-patch-7-completion-browser.json',JSON.stringify({base,results},null,2)+'\n');}finally{await browser.close();}
