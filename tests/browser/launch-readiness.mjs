// Patch 9 production-preview audit. Usage: node launch-readiness.mjs PLAYWRIGHT_PATH BASE_URL
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.argv[2]).href);
const base=process.argv[3]??'http://127.0.0.1:4181';
assert(/^http:\/\/127\.0\.0\.1:\d+$/.test(base));
const routes=['/','/account','/practice','/study-plan','/exams','/progress','/privacy','/terms','/practice/ds.practice.p7-boolean-minterm','/co/CO_T06_ASSEMBLY_X86_64/visualizer'];
const browser=await chromium.launch({headless:true});
const results=[];const discovered=new Set();
try{
 for(const [theme,width] of [['light',1280],['dark',1280],['light',375],['dark',375]]){
  const context=await browser.newContext({viewport:{width,height:900},colorScheme:theme});
  await context.addInitScript(({key,value})=>localStorage.setItem(key,value),{key:'delftstudy.appearance.theme',value:theme});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  for(const route of routes){
   const response=await page.goto(base+route,{waitUntil:'networkidle'});assert.equal(response?.status(),200,route+' did not load');await page.locator('.ds-app').waitFor();
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route} overflows at ${theme}/${width}`);
   assert.equal(await page.locator('h1').count(),1,route+' needs exactly one h1');
   const audit=await page.evaluate(()=>{
    const controls=[...document.querySelectorAll('button,input,select,textarea')].filter(element=>!(element instanceof HTMLInputElement&&element.type==='hidden'));
    const unnamed=controls.filter(element=>{const id=element.id;return !element.getAttribute('aria-label')&&!element.getAttribute('aria-labelledby')&&!(id&&document.querySelector(`label[for="${CSS.escape(id)}"]`))&&!element.closest('label')&&!element.textContent?.trim();});
    const ids=[...document.querySelectorAll('[id]')].map(element=>element.id);return {unnamed:unnamed.length,duplicateIds:ids.length-new Set(ids).size};
   });
   assert.equal(audit.unnamed,0,route+' has unnamed form controls');assert.equal(audit.duplicateIds,0,route+' has duplicate IDs');
   for(const href of await page.locator('a[href]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')).filter(href=>href?.startsWith('/'))))discovered.add(href.split('#')[0]);
  }
  assert.deepEqual(errors,[]);results.push({theme,width,routes:routes.length,overflow:'PASS',semantics:'PASS'});await context.close();
 }
 const context=await browser.newContext({viewport:{width:1280,height:900},colorScheme:'light'}),page=await context.newPage();
 await page.addInitScript(()=>{globalThis.__launchVitals={lcp:0,cls:0,shifts:[]};new PerformanceObserver(list=>{const entries=list.getEntries();globalThis.__launchVitals.lcp=entries.at(-1)?.startTime??0;}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput){globalThis.__launchVitals.cls+=entry.value;globalThis.__launchVitals.shifts.push({value:entry.value,sources:entry.sources?.map(source=>({node:source.node?.tagName+'.'+source.node?.className,previous:source.previousRect,current:source.currentRect}))??[]});}}).observe({type:'layout-shift',buffered:true});});
 await page.goto(base+'/',{waitUntil:'networkidle'});await page.waitForTimeout(500);
 const vitals=await page.evaluate(()=>({lcp:Math.round(globalThis.__launchVitals.lcp),cls:Number(globalThis.__launchVitals.cls.toFixed(4)),navigation:Math.round(performance.getEntriesByType('navigation')[0]?.duration??0),shifts:globalThis.__launchVitals.shifts}));
 assert(vitals.lcp>0&&vitals.lcp<2500,`LCP outside launch target: ${vitals.lcp}`);assert(vitals.cls<=0.1,`CLS outside launch target: ${vitals.cls}`);
 const tokens=await page.evaluate(()=>Object.fromEntries(['--ds-page','--ds-paper','--ds-ink','--ds-primary','--ds-co','--ds-rl','--ds-ip'].map(key=>[key,getComputedStyle(document.documentElement).getPropertyValue(key).trim()])));
 assert.deepEqual(tokens,{'--ds-page':'#f0f7ff','--ds-paper':'#ffffff','--ds-ink':'#081747','--ds-primary':'#0061ed','--ds-co':'#005caf','--ds-rl':'#007568','--ds-ip':'#6235b7'});
 await page.goto(base+'/privacy');await page.locator('.ds-legal').waitFor();assert.equal(await page.getByRole('link',{name:'Terms'}).count(),1);await page.goto(base+'/terms');await page.locator('.ds-legal').waitFor();assert.equal(await page.getByRole('link',{name:'Privacy'}).count(),1);
 await page.goto(base+'/social-preview.png');await page.locator('img').waitFor();const image=await page.locator('img').evaluate(img=>({width:img.naturalWidth,height:img.naturalHeight}));assert.deepEqual(image,{width:1200,height:630});
 for(const href of discovered){const response=await context.request.get(base+href);assert(response.status()<400,`Broken internal link ${href}: ${response.status()}`);}
 console.log(JSON.stringify({engine:'Chromium',base,results,internalLinks:discovered.size,palette:tokens,vitals:{lcp:vitals.lcp,cls:vitals.cls,navigation:vitals.navigation,inp:'NOT RUN'}},null,2));await context.close();
}finally{await browser.close();}
