// Disposable authenticated UI acceptance; no schema/configuration changes.
import assert from 'node:assert/strict';
import {existsSync,writeFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
import {chromium} from '/Users/mattiamelli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const ready='/tmp/p2-mobile-ui-ready-20260912',results=[];
assert(!existsSync(ready),'Use a fresh acceptance marker');
assert.equal(new URL(process.env.VITE_SUPABASE_URL).hostname,'obaljgxtosxnsljdtjjf.supabase.co');
const sdk=createClient(process.env.VITE_SUPABASE_URL,process.env.VITE_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const email=`patch2.mobile.${randomUUID()}@example.invalid`,password=`Disposable!${randomUUID()}aA`,name='Mobile Acceptance';
const signup=await sdk.auth.signUp({email,password,options:{data:{display_name:name}}});
assert(!signup.error&&signup.data.session,'Disposable signup needs a session');
const browser=await chromium.launch({headless:true});
try {
  const context=await browser.newContext({viewport:{width:375,height:900},timezoneId:'Europe/Amsterdam'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const account=async()=>{await page.goto('http://127.0.0.1:4173/account');await page.getByRole('heading',{name:'Account profile',exact:true}).waitFor();await page.getByText(email,{exact:true}).waitFor();};
  await page.goto('http://127.0.0.1:4173/account');await page.getByLabel('Email',{exact:true}).fill(email);await page.getByLabel('Password',{exact:true}).fill(password);await page.getByRole('button',{name:'Sign in',exact:true}).click();await page.getByRole('heading',{name:'Account profile',exact:true}).waitFor();
  for(const width of [375,1280]){await page.setViewportSize({width,height:900});await account();const profileHasName=await page.locator('.ds-account').getByText(name,{exact:true}).count()>0;const headerNameVisible=await page.locator('.ds-header-account').getByText(name,{exact:false}).isVisible();console.log('BASELINE',JSON.stringify({width,profileHasName,headerNameVisible}));assert(!profileHasName,'Baseline defect no longer reproduces');await page.screenshot({path:`/tmp/p2-mobile-before-${width}.png`,fullPage:true});}
  console.log('BASELINE COMPLETE — waiting for rebuilt UI');
  const deadline=Date.now()+1200000;while(!existsSync(ready)){assert(Date.now()<deadline,'Timed out waiting for updated preview');await new Promise(r=>setTimeout(r,1000));}
  const pass=label=>{results.push(label);console.log('PASS',label);};
  for(const width of [1280,375]){
    await page.setViewportSize({width,height:900});await account();await page.locator('.ds-account').getByText(name,{exact:true}).waitFor();pass(`${width}px Account displays canonical name, email and authenticated state`);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`/tmp/p2-mobile-account-${width}.png`,fullPage:true});
    await page.goto('http://127.0.0.1:4173/');await page.getByText(`Hello ${name}`,{exact:true}).waitFor();await page.getByRole('heading',{name:'Upcoming Exams',exact:true}).waitFor();await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('.ds-header-account .ds-avatar').innerText(),'M');pass(`${width}px fully loaded Dashboard greeting and avatar`);
    await page.getByRole('button',{name:'+ Add exam',exact:true}).click();const input=page.getByLabel('Exam name',{exact:true});await input.fill('Mobile exam');await input.focus();await page.keyboard.press('Tab');assert(await page.getByLabel('Exam date',{exact:true}).evaluate(e=>e===document.activeElement));
    const day=new Date(Date.now()+2*86400000).toISOString().slice(0,10);await page.getByLabel('Exam date',{exact:true}).fill(day);await page.getByRole('button',{name:'Save',exact:true}).click();await page.getByText('Mobile exam',{exact:true}).waitFor();
    await page.getByRole('button',{name:'Edit',exact:true}).click();await input.fill('Edited mobile exam');await page.getByRole('button',{name:'Save',exact:true}).click();await page.getByText('Edited mobile exam',{exact:true}).waitFor();assert.equal(await page.locator('.ds-countdown.ds-urgency-critical').innerText(),'2 DAYS');
    await page.evaluate(()=>window.scrollTo(0,0));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    const overlap=await page.locator('.ds-dash-panel').evaluateAll(nodes=>{const r=nodes.map(n=>n.getBoundingClientRect());return r.some((a,i)=>r.slice(i+1).some(b=>Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1));});assert(!overlap,'Dashboard cards overlap');
    await page.screenshot({path:`/tmp/p2-mobile-dashboard-${width}.png`,fullPage:true});pass(`${width}px exam add/edit, urgency, keyboard focus, no overflow/card overlap`);
    page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Delete',exact:true}).click();await page.getByText('Add an exam date to keep it in view.',{exact:true}).waitFor();pass(`${width}px exam deletion`);
    await page.locator('.ds-header-account').click();await page.locator('.ds-account').getByText(name,{exact:true}).waitFor();pass(`${width}px Account reachable from Dashboard`);
  }
  await page.getByRole('button',{name:'Sign out',exact:true}).click();await page.getByRole('heading',{name:'Anonymous local profile',exact:true}).waitFor();assert.equal(await page.locator('.ds-account').getByText(name,{exact:true}).count(),0);assert.deepEqual(errors,[]);pass('Logout clears profile name; no page errors');
  writeFileSync('/tmp/p2-mobile-ui-results.json',JSON.stringify({status:'PASS',browser:browser.version(),results},null,2));
}catch(e){console.error('FAIL',e.message);process.exitCode=1;}finally{await browser.close();await sdk.auth.signOut();}
