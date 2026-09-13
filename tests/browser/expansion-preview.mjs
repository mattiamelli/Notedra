// Local production acceptance, disposable anonymous contexts only. No remote accounts.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.argv[2]).href),base=process.argv[3]??'http://127.0.0.1:4178';
assert(/^http:\/\/127\.0\.0\.1:\d+$/.test(base));
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const all=['practice','ip','co'].flatMap(p=>read(`src/expansion/${p}.json`));
const notationOnly=process.argv[4]==='notation';
const selected=all.filter((e,i)=>e.task.kind.startsWith('logic')||e.task.kind==='kmap-fill'||(!notationOnly&&(all.findIndex(a=>a.unitId===e.unitId)===i||e.stimulus)));
const guides=notationOnly?[]:read('src/expansion/guided.json'),results=[];
const browser=await chromium.launch({headless:true});
try{for(const width of [1280,375]){
 const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
 try{
 for(const e of selected){
  console.log('Checking',width,e.id);
  await page.goto(`${base}/practice/${e.id}`);await page.getByRole('button',{name:'Start exercise',exact:true}).click();const submit=page.getByRole('button',{name:'Submit answer',exact:true});await submit.waitFor();
  assert.equal(await page.getByText('Prepare for this exercise',{exact:true}).count(),e.mode==='exam'?0:1);
  await submit.click();assert(await page.getByRole('alert').count()>0);
  if(e.task.kind==='ip-fixed')await page.locator(`input[name="java-output"][value="${e.reference.value[0]}"]`).check();
  else if(e.task.kind==='enrichment-exact'){for(const [i,value] of e.reference.value.split(',').entries())await page.getByLabel('Part '+(i+1),{exact:true}).fill(value);}
  else if(e.task.kind==='co-exact')await page.locator('.ds-practice-answer input').fill(e.reference.value);
  else for(const token of e.reference.value){const [id,value]=token.split('=');if(e.task.kind==='logic-build')await page.getByLabel(e.task.slots.find(s=>s.id===id).label,{exact:true}).selectOption(value);else await page.getByRole('combobox',{name:new RegExp(`minterm ${id.slice(1)}$`)}).selectOption(value);}
  if(e.task.kind==='logic-build'){
   const bars=page.locator('.boolean-complement');assert(await bars.count()>0);assert((await bars.evaluateAll(es=>es.every(el=>parseFloat(getComputedStyle(el).borderTopWidth)>0))));
   assert(await page.getByRole('img',{name:/NOT/}).count()>0);
   assert(await page.locator('.boolean-minterm').evaluateAll(es=>es.every(el=>{const bars=[...el.querySelectorAll('.boolean-complement')];return bars.every((b,i)=>!i||b.getBoundingClientRect().left>bars[i-1].getBoundingClientRect().right);})), 'Adjacent literal bars must remain visibly separate');
   for(const s of e.task.slots.filter(s=>s.options.includes('A')&&s.options.includes('!A'))){const sel=page.getByLabel(s.label,{exact:true});assert.equal(await sel.locator('option[value="!A"]').getAttribute('aria-label'),'NOT A');assert((await sel.locator('option[value="!A"]').innerText()).includes('\u0305'));}
  }
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow ${e.id}`);
  if(e.task.kind==='logic-build'||e.stimulus)await page.screenshot({path:`/tmp/patch7-${width}-${e.id}-input.png`,fullPage:true});
  await submit.click();await page.getByRole('heading',{name:'Correct · 1 / 1 item point',exact:true}).waitFor();await page.reload();await page.getByRole('heading',{name:'Correct · 1 / 1 item point',exact:true}).waitFor();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(e.id==='ds.practice.p7-boolean-minterm'){
   await page.getByRole('button',{name:'Retry as new attempt',exact:true}).click();for(const token of ['a=A','b=B','c=C']){const [id,value]=token.split('=');await page.getByLabel(e.task.slots.find(s=>s.id===id).label,{exact:true}).selectOption(value);}await page.getByRole('button',{name:'Submit answer',exact:true}).click();await page.getByRole('heading',{name:'Incorrect · 0 / 1 item point',exact:true}).waitFor();assert(await page.locator('.ds-practice-feedback .boolean-complement').count()>0);await page.screenshot({path:`/tmp/patch7-${width}-wrong-polarity.png`,fullPage:true});
  }
  const next=page.getByRole('link',{name:/^Next exercise:/});await next.click();await page.getByRole('button',{name:'Start exercise',exact:true}).waitFor();
 }
 for(const g of guides){await page.goto(`${base}/ip/${g.topicId}/${g.mode==='exam'?'exam-style':'practice'}`);const heading=page.getByRole('heading',{name:g.title,exact:true});await heading.waitFor();const article=heading.locator('..');assert.equal(await article.locator('textarea').count(),g.fields.length);await article.locator('textarea').first().fill('Disposable working notes');const criteria=article.locator('[id$="-criteria"]');assert.equal(await criteria.isVisible(),false);await article.getByRole('button',{name:'Reveal criteria and reference',exact:true}).click();assert(await criteria.isVisible());assert((await article.innerText()).includes('not saved as a submitted Practice attempt'));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 assert.deepEqual(errors,[]);results.push({width,objective:selected.length,guides:guides.length,result:'PASS',checks:['empty validation','correct answer','reload','same-topic next','practice/exam distinction','overbar border and accessible label','wrong literal polarity','no horizontal overflow','no page errors','unscored guided boundaries']});console.log(JSON.stringify(results.at(-1)));
 }catch(error){await page.screenshot({path:`/tmp/patch7-failure-${width}.png`,fullPage:true});console.error(page.url(),await page.locator('body').innerText());throw error;}finally{await context.close();}
}writeFileSync(notationOnly?'docs/maintenance-patch-7-notation-browser.json':'docs/maintenance-patch-7-browser.json',JSON.stringify({base,results},null,2)+'\n');}finally{await browser.close();}
